import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Map, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HuntCard } from '@/components/hunt';
import { EmptyState } from '@/components/common';
import type { HuntTheme, Difficulty, HuntProgress } from '@/types';
import { UI_TEXT } from '@/types';
import { mockHunts } from '@/data/mockData';
import { getHuntProgress } from '@/lib/storage';

export default function HuntsPage() {
  const navigate = useNavigate();
  const [themeFilter, setThemeFilter] = useState<HuntTheme | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');

  // Get all hunt progress from storage
  const allProgress = getHuntProgress();

  // Filter hunts
  const filteredHunts = mockHunts.filter(hunt => {
    if (themeFilter !== 'all' && hunt.theme !== themeFilter) return false;
    if (difficultyFilter !== 'all' && hunt.difficulty !== difficultyFilter) return false;
    return true;
  });

  // Separate active and completed hunts
  const activeHunts = filteredHunts.filter(hunt => {
    const progress = allProgress[hunt.id];
    return !progress || progress.tasksCompleted.length < hunt.tasks.length;
  });

  const completedHunts = filteredHunts.filter(hunt => {
    const progress = allProgress[hunt.id];
    return progress && progress.tasksCompleted.length === hunt.tasks.length;
  });

  const handleHuntClick = (huntId: string) => {
    navigate(`/hunts/${huntId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-lg font-semibold">Фото-охота</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-4">
            <Map className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              Исследуй мир
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            Фото-охота
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Выполняйте серии заданий, исследуйте новые места и зарабатывайте XP
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-3">
          <Select value={themeFilter} onValueChange={(v) => setThemeFilter(v as HuntTheme | 'all')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Тема" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все темы</SelectItem>
              {Object.entries(UI_TEXT.hunts.themes).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v as Difficulty | 'all')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Сложность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Любая</SelectItem>
              {Object.entries(UI_TEXT.hunts.difficulty).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Активные ({activeHunts.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Завершённые ({completedHunts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4 space-y-4">
            {activeHunts.length > 0 ? (
              activeHunts.map((hunt, index) => (
                <motion.div
                  key={hunt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HuntCard
                    hunt={hunt}
                    progress={allProgress[hunt.id]}
                    onClick={() => handleHuntClick(hunt.id)}
                  />
                </motion.div>
              ))
            ) : (
              <EmptyState
                icon={Map}
                title="Нет активных охот"
                description="Выберите другие фильтры или посмотрите завершённые охоты"
              />
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4 space-y-4">
            {completedHunts.length > 0 ? (
              completedHunts.map((hunt, index) => (
                <motion.div
                  key={hunt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HuntCard
                    hunt={hunt}
                    progress={allProgress[hunt.id]}
                    onClick={() => handleHuntClick(hunt.id)}
                  />
                </motion.div>
              ))
            ) : (
              <EmptyState
                icon={Map}
                title="Нет завершённых охот"
                description="Начните первую охоту и завершите все задания"
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
