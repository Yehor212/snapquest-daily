import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { verifyImage, VerificationResult } from '@/lib/imageVerification';
import { cn } from '@/lib/utils';

interface PhotoVerificationProps {
  imageFile: File | null;
  challengeTitle: string;
  challengeDescription?: string;
  onVerificationComplete?: (result: VerificationResult) => void;
  className?: string;
}

export function PhotoVerification({
  imageFile,
  challengeTitle,
  challengeDescription,
  onVerificationComplete,
  className,
}: PhotoVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [hasVerified, setHasVerified] = useState(false);

  const handleVerify = async () => {
    if (!imageFile) return;

    setIsVerifying(true);
    setResult(null);

    try {
      const verificationResult = await verifyImage(
        imageFile,
        challengeTitle,
        challengeDescription,
        import.meta.env.VITE_HUGGINGFACE_API_KEY
      );

      setResult(verificationResult);
      setHasVerified(true);
      onVerificationComplete?.(verificationResult);
    } catch (error) {
      console.error('Verification failed:', error);
      setResult({
        isValid: true,
        confidence: 0,
        matchedKeyword: null,
        allScores: [],
        message: 'Не удалось проверить фото. Принято автоматически.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Auto-verify when image changes
  const handleAutoVerify = () => {
    if (imageFile && !hasVerified) {
      handleVerify();
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Verify Button */}
      {imageFile && !hasVerified && !isVerifying && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleVerify}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          <span>Проверить соответствие AI</span>
        </motion.button>
      )}

      {/* Loading State */}
      <AnimatePresence>
        {isVerifying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-xl"
          >
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              AI анализирует фото...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'p-4 rounded-xl border',
              result.isValid
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            )}
          >
            <div className="flex items-start gap-3">
              {result.isValid ? (
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              )}

              <div className="flex-1 space-y-2">
                <p className={cn(
                  'font-medium',
                  result.isValid ? 'text-green-600' : 'text-red-600'
                )}>
                  {result.isValid ? 'Фото подходит!' : 'Фото не подходит'}
                </p>

                <p className="text-sm text-muted-foreground">
                  {result.message}
                </p>

                {/* Confidence Bar */}
                {result.confidence > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Уверенность AI</span>
                      <span>{Math.round(result.confidence * 100)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={cn(
                          'h-full rounded-full',
                          result.confidence >= 0.25 ? 'bg-green-500' :
                          result.confidence >= 0.15 ? 'bg-yellow-500' : 'bg-red-500'
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Matched keyword */}
                {result.matchedKeyword && (
                  <p className="text-xs text-muted-foreground">
                    Найдено: <span className="font-medium">{result.matchedKeyword}</span>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Re-verify button */}
      {hasVerified && !isVerifying && (
        <button
          onClick={() => {
            setHasVerified(false);
            setResult(null);
          }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Проверить другое фото
        </button>
      )}

      {/* Info */}
      {!imageFile && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>Загрузите фото для проверки AI</span>
        </div>
      )}
    </div>
  );
}
