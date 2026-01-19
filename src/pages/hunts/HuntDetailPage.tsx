import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Trophy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HuntTaskCard, HuntProgress as HuntProgressComponent } from '@/components/hunt';
import { DifficultyBadge, XpBadge } from '@/components/common';
import { UI_TEXT } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useHuntWithTasks, useHuntProgress, useStartHunt } from '@/hooks/useHunts';

export default function HuntDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: huntData, isLoading: huntLoading } = useHuntWithTasks(id);
  const { data: progress, isLoading: progressLoading } = useHuntProgress(id);
  const startHuntMutation = useStartHunt();

  const [showHints, setShowHints] = useState(false);

  const handleStartHunt = async () => {
    if (!id) return;

    try {
      await startHuntMutation.mutateAsync(id);
      toast({ title: 'Охота началась!', description: 'Удачи!' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось начать охоту', variant: 'destructive' });
    }
  };

  const handleTaskClick = (taskId: string) => {
    if (!progress) return;

    // If task is not completed, navigate to upload
    if (!progress.completed_tasks.includes(taskId)) {
      navigate(`/upload?huntId=${id}&huntTask=${taskId}`);
    }
  };

  if (huntLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!huntData?.hunt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Охота не найдена</p>
      </div>
    );
  }

  const { hunt, tasks } = huntData;
  const isStarted = progress !== null;
  const isCompleted = progress?.completed_at !== null && progress?.completed_at !== undefined;

  // Map tasks to UI format
  const mappedTasks = tasks.map(t => ({
    id: t.id,
    huntId: t.hunt_id,
    title: t.title,
    description: t.description || '',
    order: t.order_num,
    xpReward: t.xp_reward,
    hint: t.hint || undefined,
  }));

  // Map progress to UI format
  const mappedProgress = progress ? {
    id: progress.id,
    huntId: progress.hunt_id,
    userId: progress.user_id,
    startedAt: progress.started_at,
    tasksCompleted: progress.completed_tasks,
    totalXpEarned: progress.total_xp_earned,
    completedAt: progress.completed_at || undefined,
  } : null;

  // Map hunt to UI format
  const mappedHunt = {
    id: hunt.id,
    title: hunt.title,
    description: hunt.description || '',
    coverImage: hunt.cover_image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    theme: hunt.theme,
    difficulty: hunt.difficulty,
    duration: hunt.duration,
    totalXp: hunt.total_xp,
    isActive: hunt.is_active,
    tasks: mappedTasks,
    createdAt: hunt.created_at,
  };

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
            src={mappedHunt.coverImage}
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
              <XpBadge xp={hunt.total_xp} />
              <span className="text-sm text-white/70">
                {tasks.length} заданий
              </span>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        {hunt.description && (
          <p className="text-muted-foreground">{hunt.description}</p>
        )}

        {/* Progress */}
        {isStarted && mappedProgress && (
          <HuntProgressComponent hunt={mappedHunt} progress={mappedProgress} />
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
              disabled={startHuntMutation.isPending}
              className="gap-2 bg-gradient-to-r from-primary to-accent"
            >
              {startHuntMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
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

            {mappedTasks.map((task, index) => (
              <HuntTaskCard
                key={task.id}
                task={task}
                order={index + 1}
                isCompleted={progress?.completed_tasks.includes(task.id) || false}
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
            <XpBadge xp={progress?.total_xp_earned || 0} size="lg" />
          </motion.div>
        )}
      </main>
    </div>
  );
}
