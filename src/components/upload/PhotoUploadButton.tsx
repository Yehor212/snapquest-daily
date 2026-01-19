import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Image as ImageIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { compressImage } from '@/lib/imageUtils';

interface PhotoUploadButtonProps {
  onPhotoSelected: (imageData: string) => void;
  variant?: 'default' | 'compact';
  disabled?: boolean;
}

export function PhotoUploadButton({
  onPhotoSelected,
  variant = 'default',
  disabled = false,
}: PhotoUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1920, 0.85);
        onPhotoSelected(compressed);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
    // Reset input
    e.target.value = '';
  };

  if (variant === 'compact') {
    return (
      <>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => cameraInputRef.current?.click()}
            disabled={disabled}
          >
            <Camera className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <ImageIcon className="w-5 h-5" />
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <Button
          size="lg"
          className="h-14 gap-3 bg-gradient-to-r from-primary to-primary/80"
          onClick={() => cameraInputRef.current?.click()}
          disabled={disabled}
        >
          <Camera className="w-6 h-6" />
          <span className="text-lg">Сделать фото</span>
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-14 gap-3"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <ImageIcon className="w-6 h-6" />
          <span className="text-lg">Выбрать из галереи</span>
        </Button>
      </motion.div>
    </>
  );
}
