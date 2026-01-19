import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HuntTaskCard, HuntProgress as HuntProgressComponent } from '@/components/hunt';
import { DifficultyBadge, XpBadge, CountdownTimer } from '@/components/common';
import type { ScavengerHunt, HuntProgress } from '@/types';
import { UI_TEXT } from '@/types';
import { mockHunts } from '@/data/mockData';
import { getHuntProgressById, saveHuntProgress, generateId } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function HuntDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [hunt, setHunt] = useState<ScavengerHunt | null>(null);
  const [progress, setProgress] = useState<HuntProgress | null>(null);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    // Find hunt by ID
    const foundHunt = mockHunts.find(h => h.id === id);
    if (foundHunt) {
      setHunt(foundHunt);
      // Load progress
      const savedProgress = getHuntProgressById(id!);
      setProgress(savedProgress || null);
    }
  }, [id]);

  const handleStartHunt = () => {
    if (!hunt) return;

    const newProgress: HuntProgress = {
      id: generateId(),
      huntId: hunt.id,
      userId: 'user-1',
      startedAt: new Date().toISOString(),
      tasksCompleted: [],
      totalXpEarned: 0,
    };

    saveHuntProgress(hunt.id, newProgress);
    setProgress(newProgress);
    toast({ title: 'Охота началась!', description: 'Удачи!' });
  };

  const handleTaskClick = (taskId: string) => {
    if (!hunt || !progress) return;

    // If task is not completed, navigate to upload
    if (!progress.tasksCompleted.includes(taskId)) {
      navigate(`/upload?huntTask=${taskId}`);
    }
  };

  const handleCompleteTask = (taskId: string, xpReward: number) => {
    if (!hunt || !progress) return;

    const updatedProgress: HuntProgress = {
      ...progress,
      tasksCompleted: [...progress.tasksCompleted, taskId],
      totalXpEarned: progress.totalXpEarned + xpReward,
    };

    // Check if all tasks completed
    if (updatedProgress.tasksCompleted.length === hunt.tasks.length) {
      updatedProgress.completedAt = new Date().toISOString();
      toast({
        title: 'Охота завершена!',
        description: `Вы заработали ${updatedProgress.totalXpEarned} XP`,
      });
    }

    saveHuntProgress(hunt.id, updatedProgress);
    setProgress(updatedProgress);
  };

  if (!hunt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Охота не найдена</p>
      </div>
    );
  }

  const isStarted = progress !== null;
  const isCompleted = progress?.completedAt !== undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/hunts')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-lg font-semibold truncate max-w-[200px]">
            {hunt.title}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-48 rounded-2xl overflow-hidden"
        >
          <img
            src={hunt.coverImage}
            alt={hunt.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
                {UI_TEXT.hunts.themes[hunt.theme]}
              </span>
              <DifficultyBadge difficulty={hunt.difficulty} size="sm" />
              <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
                {UI_TEXT.hunts.duration[hunt.duration]}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-1">
              {hunt.title}
            </h2>
            <div className="flex items-center gap-3">
              <XpBadge xp={hunt.totalXp} />
              <span className="text-sm text-white/70">
                {hunt.tasks.length} заданий
              </span>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <p className="text-muted-foreground">{hunt.description}</p>

        {/* Progress */}
        {isStarted && (
          <HuntProgressComponent hunt={hunt} progress={progress} />
        )}

        {/* Start button or Tasks */}
        {!isStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <Button
              size="lg"
              onClick={handleStartHunt}
              className="gap-2 bg-gradient-to-r from-primary to-accent"
            >
              <Play className="w-5 h-5" />
              Начать охоту
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Задания</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHints(!showHints)}
              >
                {showHints ? 'Скрыть подсказки' : 'Показать подсказки'}
              </Button>
            </div>

            {hunt.tasks.map((task, index) => (
              <HuntTaskCard
                key={task.id}
                task={task}
                order={index + 1}
                isCompleted={progress?.tasksCompleted.includes(task.id) || false}
                onClick={() => handleTaskClick(task.id)}
                showHint={showHints}
              />
            ))}
          </div>
        )}

        {/* Completed message */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gold/10 border border-gold/30 rounded-2xl p-6 text-center"
          >
            <Trophy className="w-12 h-12 text-gold mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold mb-2">
              Поздравляем!
            </h3>
            <p className="text-muted-foreground mb-4">
              Вы успешно завершили эту охоту
            </p>
            <XpBadge xp={progress?.totalXpEarned || 0} size="lg" />
          </motion.div>
        )}
      </main>
    </div>
  );
}
