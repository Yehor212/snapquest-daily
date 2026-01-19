import { useState, useMemo } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface EventShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventName: string;
  accessCode: string;
}

export function EventShareDialog({
  open,
  onOpenChange,
  eventName,
  accessCode,
}: EventShareDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareText = `Присоединяйся к событию "${eventName}"!\n\nКод: ${accessCode}\n\nСкачай приложение SnapQuest и введи код.`;

  // Generate QR code URL using free QR API
  const qrCodeUrl = useMemo(() => {
    const data = encodeURIComponent(`SNAPQUEST:${accessCode}`);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data}&bgcolor=ffffff&color=000000`;
  }, [accessCode]);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(accessCode);
    setCopied(true);
    toast({ title: 'Код скопирован!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Приглашение на ${eventName}`,
        text: shareText,
      });
    } catch {
      // Fallback: copy full text
      await navigator.clipboard.writeText(shareText);
      toast({ title: 'Приглашение скопировано!' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Пригласить участников</DialogTitle>
          <DialogDescription className="text-center">
            Поделитесь кодом с друзьями, чтобы они присоединились к событию
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* QR Code - generated via free API */}
          <div className="w-48 h-48 rounded-2xl bg-white flex items-center justify-center overflow-hidden">
            <img
              src={qrCodeUrl}
              alt={`QR код для события: ${accessCode}`}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Access Code */}
          <div className="w-full">
            <p className="text-sm text-muted-foreground text-center mb-2">
              Код доступа
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border font-mono text-xl text-center tracking-widest">
                {accessCode}
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopyCode}
                className="h-12 w-12"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Share button */}
          <Button onClick={handleShare} className="w-full gap-2">
            <Share2 className="w-4 h-4" />
            Поделиться приглашением
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
