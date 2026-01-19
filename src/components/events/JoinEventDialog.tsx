import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowRight, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AccessCodeInput } from '@/components/common';
import type { PrivateEvent } from '@/types';
import { getEventByCode } from '@/lib/storage';

interface JoinEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (event: PrivateEvent) => void;
}

export function JoinEventDialog({ open, onOpenChange, onJoin }: JoinEventDialogProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [foundEvent, setFoundEvent] = useState<PrivateEvent | null>(null);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setError(null);
    setFoundEvent(null);
  };

  const handleCodeComplete = (completedCode: string) => {
    const event = getEventByCode(completedCode);
    if (event) {
      setFoundEvent(event);
      setError(null);
    } else {
      setError('Событие не найдено. Проверьте код.');
      setFoundEvent(null);
    }
  };

  const handleJoin = () => {
    if (foundEvent) {
      onJoin(foundEvent);
      onOpenChange(false);
      // Reset state
      setCode('');
      setFoundEvent(null);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setCode('');
    setError(null);
    setFoundEvent(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Присоединиться к событию</DialogTitle>
          <DialogDescription className="text-center">
            Введите код приглашения, полученный от организатора
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <AccessCodeInput
            value={code}
            onChange={handleCodeChange}
            onComplete={handleCodeComplete}
          />

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          {/* Found event preview */}
          {foundEvent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-4 rounded-xl bg-secondary border border-border"
            >
              <h4 className="font-medium mb-1">{foundEvent.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {foundEvent.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {foundEvent.participantsCount} участников
                </span>
              </div>
            </motion.div>
          )}

          {/* Join button */}
          <Button
            onClick={handleJoin}
            disabled={!foundEvent}
            className="w-full gap-2"
          >
            Присоединиться
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
