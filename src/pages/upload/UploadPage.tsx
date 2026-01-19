import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhotoUploadButton, PhotoPreview, PhotoEditor } from '@/components/upload';
import { XpBadge } from '@/components/common';
import type { PhotoFilterType, PhotoEditOptions, Photo } from '@/types';
import { savePhoto, generateId } from '@/lib/storage';
import { applyFilter, applyAdjustments, createThumbnail } from '@/lib/imageUtils';
import { mockTodayChallenge } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

type Step = 'select' | 'preview' | 'edit' | 'success';

export default function UploadPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const challengeId = searchParams.get('challenge') || mockTodayChallenge.id;
  const eventId = searchParams.get('event');
  const huntTaskId = searchParams.get('huntTask');

  const [step, setStep] = useState<Step>('select');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editOptions, setEditOptions] = useState<PhotoEditOptions>({
    filter: 'none',
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setIsSubmitting(true);

    try {
      // Применяем фильтры и настройки
      let processedImage = selectedImage;

      // Применяем яркость/контраст/насыщенность
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

      // Применяем фильтр
      if (editOptions.filter !== 'none') {
        processedImage = await applyFilter(processedImage, editOptions.filter);
      }

      // Создаём миниатюру
      const thumbnail = await createThumbnail(processedImage, 200);

      // Создаём объект фото
      const photo: Photo = {
        id: generateId(),
        userId: 'user-1', // TODO: получить из контекста
        imageData: processedImage,
        thumbnailData: thumbnail,
        challengeId: challengeId || undefined,
        eventId: eventId || undefined,
        huntTaskId: huntTaskId || undefined,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        isTop: false,
        filter: editOptions.filter,
      };

      // Сохраняем в IndexedDB
      await savePhoto(photo);

      setStep('success');

      toast({
        title: 'Фото загружено!',
        description: `+${mockTodayChallenge.xpReward} XP`,
      });

      // Через 2 секунды переходим в галерею
      setTimeout(() => {
        navigate('/gallery');
      }, 2000);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить фото',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 'preview') {
      setSelectedImage(null);
      setStep('select');
    } else if (step === 'edit') {
      setStep('preview');
    } else {
      navigate(-1);
    }
  };

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
            {step === 'success' && 'Готово!'}
          </h1>
          <div className="w-10" /> {/* Spacer */}
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
            {/* Challenge info */}
            <div className="text-center max-w-sm">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-4">
                <Camera className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">День #{mockTodayChallenge.dayNumber}</span>
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">
                {mockTodayChallenge.title}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                {mockTodayChallenge.description}
              </p>
              <XpBadge xp={mockTodayChallenge.xpReward} />
            </div>

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
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 bg-gradient-to-r from-primary to-primary/80"
              >
                {isSubmitting ? 'Загрузка...' : 'Отправить'}
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

            <XpBadge xp={mockTodayChallenge.xpReward} size="lg" animated />
          </motion.div>
        )}
      </main>
    </div>
  );
}
