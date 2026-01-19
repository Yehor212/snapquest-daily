import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, History, Lightbulb, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GeneratedChallengeCard,
  RandomizeButton,
  GeneratorControls,
} from '@/components/generator';
import { EmptyState } from '@/components/common';
import type { GeneratedChallenge, ChallengeCategory, Difficulty } from '@/types';
import { challengeTemplates, additionalTemplates, generateChallenge, filterTemplates } from '@/lib/challengeGenerator';
import { useToast } from '@/hooks/use-toast';
import { useSavedChallenges, useCreateAndSaveChallenge, useUnsaveChallenge } from '@/hooks/useChallenges';
import { useAuth } from '@/contexts/AuthContext';
import type { Challenge } from '@/lib/api/challenges';

// Use templates from challengeGenerator (no mockData dependency)
const allTemplates = [...challengeTemplates, ...additionalTemplates];

// Convert DB Challenge to GeneratedChallenge format for UI
function dbChallengeToGenerated(challenge: Challenge): GeneratedChallenge {
  return {
    id: challenge.id,
    templateId: 'db-saved',
    title: challenge.title,
    description: challenge.description || challenge.title,
    variables: {},
    category: (challenge.category || 'creative') as ChallengeCategory,
    difficulty: challenge.difficulty,
    xpReward: challenge.xp_reward,
    generatedAt: challenge.created_at,
    isSaved: true,
  };
}

export default function GeneratorPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [category, setCategory] = useState<ChallengeCategory | 'all'>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [currentChallenge, setCurrentChallenge] = useState<GeneratedChallenge | null>(null);
  const [history, setHistory] = useState<GeneratedChallenge[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Supabase hooks for saved challenges
  const { data: dbSavedChallenges, isLoading: savedLoading } = useSavedChallenges();
  const createAndSave = useCreateAndSaveChallenge();
  const unsave = useUnsaveChallenge();

  // Convert DB challenges to GeneratedChallenge format
  const savedChallenges = useMemo(() => {
    return (dbSavedChallenges || []).map(dbChallengeToGenerated);
  }, [dbSavedChallenges]);

  // Track which challenges are saved (by title for locally generated, by id for DB)
  const savedTitles = useMemo(() => {
    return new Set(savedChallenges.map(c => c.title));
  }, [savedChallenges]);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);

    // Небольшая задержка для анимации
    setTimeout(() => {
      const filters: { category?: ChallengeCategory; difficulty?: Difficulty } = {};
      if (category !== 'all') filters.category = category;
      if (difficulty !== 'all') filters.difficulty = difficulty;

      const filtered = filterTemplates(allTemplates, filters);
      const templates = filtered.length > 0 ? filtered : allTemplates;

      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      const challenge = generateChallenge(randomTemplate);

      // Добавляем в историю
      if (currentChallenge) {
        setHistory(prev => [currentChallenge, ...prev].slice(0, 10));
      }

      setCurrentChallenge(challenge);
      setIsGenerating(false);
    }, 400);
  }, [category, difficulty, currentChallenge]);

  const handleSave = async (challenge: GeneratedChallenge) => {
    if (!user) {
      toast({ title: 'Войдите, чтобы сохранять челленджи', variant: 'destructive' });
      return;
    }

    // Check if already saved (by title for new challenges, by id for DB challenges)
    const isSavedByTitle = savedTitles.has(challenge.title);
    const dbChallenge = dbSavedChallenges?.find(c => c.title === challenge.title);

    if (isSavedByTitle && dbChallenge) {
      // Unsave
      try {
        await unsave.mutateAsync(dbChallenge.id);
        toast({ title: 'Удалено из сохранённых' });
      } catch {
        toast({ title: 'Ошибка при удалении', variant: 'destructive' });
      }
    } else {
      // Save new challenge to DB
      try {
        await createAndSave.mutateAsync({
          title: challenge.title,
          description: challenge.description,
          category: challenge.category,
          difficulty: challenge.difficulty,
          xp_reward: challenge.xpReward,
        });
        toast({ title: 'Сохранено!' });
      } catch {
        toast({ title: 'Ошибка при сохранении', variant: 'destructive' });
      }
    }
  };

  const handleUnsave = async (challenge: GeneratedChallenge) => {
    if (!user) return;

    const dbChallenge = dbSavedChallenges?.find(c => c.id === challenge.id || c.title === challenge.title);
    if (dbChallenge) {
      try {
        await unsave.mutateAsync(dbChallenge.id);
        toast({ title: 'Удалено из сохранённых' });
      } catch {
        toast({ title: 'Ошибка при удалении', variant: 'destructive' });
      }
    }
  };

  const handleUse = (challenge: GeneratedChallenge) => {
    // For DB-saved challenges, use the DB id; for local, use title as identifier
    const dbChallenge = dbSavedChallenges?.find(c => c.title === challenge.title);
    if (dbChallenge) {
      navigate(`/upload?challenge=${dbChallenge.id}`);
    } else {
      // For newly generated challenges not yet in DB, pass title as query
      navigate(`/upload?challengeTitle=${encodeURIComponent(challenge.title)}&xp=${challenge.xpReward}`);
    }
  };

  const handleShare = async (challenge: GeneratedChallenge) => {
    try {
      await navigator.share({
        title: 'Фото-челлендж',
        text: challenge.title,
        url: window.location.href,
      });
    } catch {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(challenge.title);
      toast({ title: 'Скопировано в буфер обмена' });
    }
  };

  const isSaved = (challenge: GeneratedChallenge) => savedTitles.has(challenge.title);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-lg font-semibold">Генератор</h1>
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
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-muted-foreground">
              Бесконечные идеи
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            Генератор челленджей
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Не знаете, что сфотографировать? Нажмите кнопку и получите уникальное
            творческое задание!
          </p>
        </motion.div>

        {/* Controls */}
        <GeneratorControls
          category={category}
          difficulty={difficulty}
          onCategoryChange={setCategory}
          onDifficultyChange={setDifficulty}
        />

        {/* Generate Button */}
        <RandomizeButton
          onClick={handleGenerate}
          isLoading={isGenerating}
          variant="large"
        />

        {/* Current Challenge */}
        <AnimatePresence mode="wait">
          {currentChallenge && (
            <GeneratedChallengeCard
              key={currentChallenge.id}
              challenge={currentChallenge}
              onUse={() => handleUse(currentChallenge)}
              onSave={() => handleSave(currentChallenge)}
              onShare={() => handleShare(currentChallenge)}
              onRegenerate={handleGenerate}
              isSaved={isSaved(currentChallenge)}
            />
          )}
        </AnimatePresence>

        {/* Tabs for History and Saved */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              История
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Lightbulb className="w-4 h-4" />
              Сохранённые
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-4 space-y-4">
            {history.length > 0 ? (
              history.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-xl border border-border p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium mb-1">{challenge.title}</p>
                      <p className="text-xs text-muted-foreground">
                        +{challenge.xpReward} XP
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUse(challenge)}
                    >
                      Выполнить
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <EmptyState
                icon={History}
                title="История пуста"
                description="Сгенерированные челленджи появятся здесь"
              />
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-4 space-y-4">
            {savedLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !user ? (
              <EmptyState
                icon={Lightbulb}
                title="Войдите в аккаунт"
                description="Чтобы сохранять челленджи, необходимо войти в аккаунт"
              />
            ) : savedChallenges.length > 0 ? (
              savedChallenges.map((challenge) => (
                <GeneratedChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onUse={() => handleUse(challenge)}
                  onSave={() => handleUnsave(challenge)}
                  isSaved={true}
                />
              ))
            ) : (
              <EmptyState
                icon={Lightbulb}
                title="Нет сохранённых"
                description="Сохраняйте понравившиеся челленджи, чтобы вернуться к ним позже"
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
