import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Sparkles, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhotoUploadButton, PhotoPreview, PhotoEditor } from '@/components/upload';
import { XpBadge } from '@/components/common';
import type { PhotoEditOptions } from '@/types';
import { applyFilter, applyAdjustments, base64ToFile } from '@/lib/imageUtils';
import { verifyImage, VerificationResult } from '@/lib/imageVerification';
import { useToast } from '@/hooks/use-toast';
import { useDailyChallenge } from '@/hooks/useChallenges';
import { useUploadPhoto } from '@/hooks/usePhotos';
import { useAddXp, useUpdateStreak } from '@/hooks/useProfile';
import { useCompleteHuntTask, useHuntWithTasks } from '@/hooks/useHunts';
import { supabase } from '@/lib/supabase';

type Step = 'select' | 'preview' | 'edit' | 'verifying' | 'verified' | 'success';

export default function UploadPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const { data: challenge, isLoading: challengeLoading } = useDailyChallenge();
  const uploadPhotoMutation = useUploadPhoto();
  const addXpMutation = useAddXp();
  const updateStreakMutation = useUpdateStreak();
  const completeHuntTaskMutation = useCompleteHuntTask();

  // Support both challengeId and challenge query params
  const challengeId = searchParams.get('challengeId') || searchParams.get('challenge') || challenge?.id;
  const eventId = searchParams.get('event');
  const eventChallengeId = searchParams.get('eventChallenge');
  const huntId = searchParams.get('huntId') || searchParams.get('hunt');
  const huntTaskId = searchParams.get('huntTask');

  // Support custom challenge title and XP from generator (for non-DB challenges)
  const customChallengeTitle = searchParams.get('challengeTitle');
  const customXp = searchParams.get('xp') ? parseInt(searchParams.get('xp')!, 10) : null;

  // Fetch hunt data if huntId is present
  const { data: huntData } = useHuntWithTasks(huntId || undefined);

  // State for dynamic XP based on context
  const [contextXp, setContextXp] = useState<number>(50);

  // Fetch XP reward based on context (event challenge or hunt task)
  useEffect(() => {
    const fetchContextXp = async () => {
      if (eventChallengeId) {
        const { data } = await supabase
          .from('event_challenges')
          .select('xp_reward')
          .eq('id', eventChallengeId)
          .single();
        if (data) setContextXp(data.xp_reward);
      } else if (huntTaskId && huntData?.tasks) {
        const task = huntData.tasks.find(t => t.id === huntTaskId);
        if (task) setContextXp(task.xp_reward);
      } else if (customXp) {
        // Use custom XP from generator URL param
        setContextXp(customXp);
      } else if (challenge?.xp_reward) {
        setContextXp(challenge.xp_reward);
      }
    };
    fetchContextXp();
  }, [eventChallengeId, huntTaskId, huntData, challenge, customXp]);

  const [step, setStep] = useState<Step>('select');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editOptions, setEditOptions] = useState<PhotoEditOptions>({
    filter: 'none',
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handlePhotoSelected = (imageData: string) => {
    setSelectedImage(imageData);
    setStep('preview');
  };

  const handleEdit = () => {
    setStep('edit');
  };

  const handleEditSave = (options: PhotoEditOptions) => {
    setEditOptions(options);
    setStep('preview');
  };

  const handleEditCancel = () => {
    setStep('preview');
  };

  const handleVerifyAndSubmit = async () => {
    if (!selectedImage) return;

    setStep('verifying');

    try {
      // Apply filters and adjustments to get final image
      let processedImage = selectedImage;

      if (
        editOptions.brightness !== 100 ||
        editOptions.contrast !== 100 ||
        editOptions.saturation !== 100
      ) {
        processedImage = await applyAdjustments(
          processedImage,
          editOptions.brightness,
          editOptions.contrast,
          editOptions.saturation
        );
      }

      if (editOptions.filter !== 'none') {
        processedImage = await applyFilter(processedImage, editOptions.filter);
      }

      // Convert to file for verification
      const fileForVerification = await base64ToFile(processedImage, 'photo.jpg');

      // Run AI verification if challenge exists
      let result: VerificationResult = {
        isValid: true,
        confidence: 1,
        matchedKeyword: null,
        allScores: [],
        message: 'Фото принято',
      };

      // Use challenge title for verification (DB challenge or custom from generator)
      const verificationTitle = challenge?.title || customChallengeTitle;
      if (verificationTitle) {
        result = await verifyImage(
          fileForVerification,
          verificationTitle,
          challenge?.description || undefined
        );
      }

      setVerificationResult(result);
      setStep('verified');

      // If valid, proceed to upload
      if (result.isValid) {
        await handleUpload(processedImage);
      }
    } catch (error) {
      console.error('Verification error:', error);
      // On error, allow upload anyway
      setVerificationResult({
        isValid: true,
        confidence: 0,
        matchedKeyword: null,
        allScores: [],
        message: 'Верификация недоступна. Фото принято.',
      });
      setStep('verified');

      // Proceed with upload
      let processedImage = selectedImage;
      if (editOptions.filter !== 'none') {
        processedImage = await applyFilter(processedImage, editOptions.filter);
      }
      await handleUpload(processedImage);
    }
  };

  const handleUpload = async (processedImage: string) => {
    setIsSubmitting(true);

    try {
      // Convert base64 to File for Supabase upload
      const file = await base64ToFile(processedImage, 'photo.jpg');

      // Upload to Supabase and get photo ID
      const uploadedPhoto = await uploadPhotoMutation.mutateAsync({
        file,
        options: {
          challengeId: challengeId || undefined,
          eventId: eventId || undefined,
          eventChallengeId: eventChallengeId || undefined,
          huntId: huntId || undefined,
          huntTaskId: huntTaskId || undefined,
          filter: editOptions.filter !== 'none' ? editOptions.filter : undefined,
          xpEarned: contextXp,
        },
      });

      // Complete hunt task if applicable (RPC handles XP and streak atomically)
      if (huntId && huntTaskId && uploadedPhoto?.id) {
        await completeHuntTaskMutation.mutateAsync({
          huntId,
          taskId: huntTaskId,
          photoId: uploadedPhoto.id,
        });
        // RPC already handles XP and streak
      } else {
        // Add XP reward for daily challenges, events, and custom challenges
        await addXpMutation.mutateAsync(contextXp);
        // Update streak for all non-hunt uploads
        await updateStreakMutation.mutateAsync();
      }

      setStep('success');

      toast({
        title: 'Фото загружено!',
        description: `+${contextXp} XP`,
      });

      // Navigate back based on context
      setTimeout(() => {
        if (huntId) {
          navigate(`/hunts/${huntId}`);
        } else if (eventId) {
          navigate(`/events/${eventId}`);
        } else {
          navigate('/gallery');
        }
      }, 2000);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить фото',
        variant: 'destructive',
      });
      setStep('preview');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedImage(null);
    setVerificationResult(null);
    setStep('select');
  };

  const handleForceUpload = async () => {
    if (!selectedImage) return;

    let processedImage = selectedImage;
    if (editOptions.filter !== 'none') {
      processedImage = await applyFilter(processedImage, editOptions.filter);
    }
    await handleUpload(processedImage);
  };

  const handleBack = () => {
    if (step === 'preview') {
      setSelectedImage(null);
      setStep('select');
    } else if (step === 'edit') {
      setStep('preview');
    } else if (step === 'verified' && !verificationResult?.isValid) {
      setStep('preview');
    } else {
      navigate(-1);
    }
  };

  const xpReward = contextXp;
  const dayNumber = challenge?.day_number || 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-lg font-semibold">
            {step === 'select' && 'Загрузить фото'}
            {step === 'preview' && 'Предпросмотр'}
            {step === 'edit' && 'Редактирование'}
            {step === 'verifying' && 'Проверка фото...'}
            {step === 'verified' && (verificationResult?.isValid ? 'Проверено!' : 'Не соответствует')}
            {step === 'success' && 'Готово!'}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Select Step */}
        {step === 'select' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] gap-8"
          >
            {challengeLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                Загрузка задания...
              </div>
            ) : challenge ? (
              <div className="text-center max-w-sm">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-4">
                  <Camera className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">День #{dayNumber}</span>
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">
                  {challenge.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  {challenge.description}
                </p>
                <XpBadge xp={xpReward} />
              </div>
            ) : customChallengeTitle ? (
              <div className="text-center max-w-sm">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Генератор</span>
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">
                  {customChallengeTitle}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Выполните сгенерированный челлендж
                </p>
                <XpBadge xp={xpReward} />
              </div>
            ) : (
              <div className="text-center max-w-sm">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-4">
                  <Camera className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Свободная тема</span>
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">
                  Загрузите фото
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Поделитесь своим творчеством
                </p>
                <XpBadge xp={50} />
              </div>
            )}

            <PhotoUploadButton onPhotoSelected={handlePhotoSelected} />
          </motion.div>
        )}

        {/* Preview Step */}
        {step === 'preview' && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
          >
            <PhotoPreview
              imageUrl={selectedImage}
              filter={editOptions.filter}
              onRemove={() => {
                setSelectedImage(null);
                setStep('select');
              }}
            />

            <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
              <Button
                variant="outline"
                size="lg"
                onClick={handleEdit}
                className="gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Редактировать
              </Button>

              <Button
                size="lg"
                onClick={handleVerifyAndSubmit}
                disabled={isSubmitting}
                className="gap-2 bg-gradient-to-r from-primary to-primary/80"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  'Проверить и отправить'
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Edit Step */}
        {step === 'edit' && selectedImage && (
          <div className="fixed inset-0 z-50 bg-background">
            <PhotoEditor
              imageUrl={selectedImage}
              initialOptions={editOptions}
              onSave={handleEditSave}
              onCancel={handleEditCancel}
            />
          </div>
        )}

        {/* Verifying Step */}
        {step === 'verifying' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold mb-2">
                AI проверяет фото
              </h2>
              <p className="text-muted-foreground text-sm">
                Определяем соответствие заданию...
              </p>
            </div>
          </motion.div>
        )}

        {/* Verified Step */}
        {step === 'verified' && verificationResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center"
          >
            {verificationResult.isValid ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-success" />
                </motion.div>
                <div>
                  <h2 className="font-display text-xl font-bold mb-2 text-success">
                    Фото соответствует!
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    {verificationResult.message}
                  </p>
                  {verificationResult.confidence > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Уверенность: {Math.round(verificationResult.confidence * 100)}%
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Загружаем фото...
                </div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center"
                >
                  <XCircle className="w-10 h-10 text-destructive" />
                </motion.div>
                <div>
                  <h2 className="font-display text-xl font-bold mb-2 text-destructive">
                    Не соответствует заданию
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    {verificationResult.message}
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <Button onClick={handleRetry} variant="outline" className="gap-2">
                    <Camera className="w-4 h-4" />
                    Сделать другое фото
                  </Button>
                  <Button
                    onClick={handleForceUpload}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Загрузка...
                      </>
                    ) : (
                      'Загрузить всё равно'
                    )}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30, delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            >
              <Sparkles className="w-12 h-12 text-primary-foreground" />
            </motion.div>

            <div>
              <h2 className="font-display text-2xl font-bold mb-2">
                Отлично!
              </h2>
              <p className="text-muted-foreground">
                Ваше фото успешно загружено
              </p>
            </div>

            <XpBadge xp={xpReward} size="lg" animated />
          </motion.div>
        )}
      </main>
    </div>
  );
}
