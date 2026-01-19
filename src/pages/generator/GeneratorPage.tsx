import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, History, Lightbulb, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GeneratedChallengeCard,
  RandomizeButton,
  GeneratorControls,
} from '@/components/generator';
import { EmptyState } from '@/components/common';
import type { GeneratedChallenge, ChallengeCategory, Difficulty } from '@/types';
import { mockTemplates } from '@/data/mockData';
import { additionalTemplates, generateChallenge, filterTemplates } from '@/lib/challengeGenerator';
import { saveChallenge, getSavedChallenges, removeSavedChallenge } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const allTemplates = [...mockTemplates, ...additionalTemplates];

export default function GeneratorPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [category, setCategory] = useState<ChallengeCategory | 'all'>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [currentChallenge, setCurrentChallenge] = useState<GeneratedChallenge | null>(null);
  const [savedChallenges, setSavedChallenges] = useState<GeneratedChallenge[]>(getSavedChallenges);
  const [history, setHistory] = useState<GeneratedChallenge[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleSave = (challenge: GeneratedChallenge) => {
    const isSaved = savedChallenges.some(c => c.id === challenge.id);

    if (isSaved) {
      removeSavedChallenge(challenge.id);
      setSavedChallenges(prev => prev.filter(c => c.id !== challenge.id));
      toast({ title: 'Удалено из сохранённых' });
    } else {
      saveChallenge(challenge);
      setSavedChallenges(prev => [{ ...challenge, isSaved: true }, ...prev]);
      toast({ title: 'Сохранено!' });
    }
  };

  const handleUse = (challenge: GeneratedChallenge) => {
    navigate(`/upload?challenge=${challenge.id}`);
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

  const isSaved = (challengeId: string) =>
    savedChallenges.some(c => c.id === challengeId);

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
              isSaved={isSaved(currentChallenge.id)}
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
            {savedChallenges.length > 0 ? (
              savedChallenges.map((challenge) => (
                <GeneratedChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onUse={() => handleUse(challenge)}
                  onSave={() => handleSave(challenge)}
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
