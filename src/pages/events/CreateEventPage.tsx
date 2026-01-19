import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PrivateEvent, EventType, EventChallenge } from '@/types';
import { UI_TEXT } from '@/types';
import { saveEvent, generateId, generateAccessCode } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

type Step = 1 | 2 | 3;

const defaultChallenges: Partial<EventChallenge>[] = [
  { title: 'Групповое фото', description: 'Соберите всех вместе!', xpReward: 50 },
  { title: 'Селфи с организатором', description: 'Найдите хозяина праздника', xpReward: 40 },
  { title: 'Лучший момент', description: 'Поймайте самый яркий кадр', xpReward: 60 },
];

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('party');
  const [challenges, setChallenges] = useState<Partial<EventChallenge>[]>(defaultChallenges);

  const handleAddChallenge = () => {
    setChallenges([
      ...challenges,
      { title: '', description: '', xpReward: 30 },
    ]);
  };

  const handleRemoveChallenge = (index: number) => {
    setChallenges(challenges.filter((_, i) => i !== index));
  };

  const handleChallengeChange = (
    index: number,
    field: keyof EventChallenge,
    value: string | number
  ) => {
    const updated = [...challenges];
    updated[index] = { ...updated[index], [field]: value };
    setChallenges(updated);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    } else {
      navigate('/events');
    }
  };

  const handleCreate = () => {
    const eventId = generateId();
    const accessCode = generateAccessCode();

    const newEvent: PrivateEvent = {
      id: eventId,
      name,
      description,
      accessCode,
      creatorId: 'user-1',
      eventType,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      participantsCount: 1,
      status: 'active',
      challenges: challenges
        .filter(c => c.title)
        .map((c, index) => ({
          id: generateId(),
          eventId,
          title: c.title!,
          description: c.description || '',
          order: index + 1,
          xpReward: c.xpReward || 30,
        })),
    };

    saveEvent(newEvent);
    toast({
      title: 'Событие создано!',
      description: `Код доступа: ${accessCode}`,
    });
    navigate(`/events/${eventId}`);
  };

  const canProceed = step === 1 ? name.trim().length > 0 : true;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-lg font-semibold">
            Создать событие
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-secondary'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold mb-2">
                Основная информация
              </h2>
              <p className="text-muted-foreground text-sm">
                Дайте название вашему событию
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название события *</Label>
                <Input
                  id="name"
                  placeholder="Например: Свадьба Анны и Максима"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Расскажите гостям о событии"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Тип события</Label>
                <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(UI_TEXT.events.eventTypes).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Challenges */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold mb-2">
                Задания
              </h2>
              <p className="text-muted-foreground text-sm">
                Добавьте фото-челленджи для гостей
              </p>
            </div>

            <div className="space-y-4">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl border border-border bg-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Задание {index + 1}
                    </span>
                    {challenges.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveChallenge(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <Input
                    placeholder="Название задания"
                    value={challenge.title || ''}
                    onChange={(e) =>
                      handleChallengeChange(index, 'title', e.target.value)
                    }
                  />
                  <Input
                    placeholder="Описание (необязательно)"
                    value={challenge.description || ''}
                    onChange={(e) =>
                      handleChallengeChange(index, 'description', e.target.value)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">XP:</Label>
                    <Input
                      type="number"
                      className="w-20"
                      value={challenge.xpReward || 30}
                      onChange={(e) =>
                        handleChallengeChange(
                          index,
                          'xpReward',
                          parseInt(e.target.value) || 30
                        )
                      }
                    />
                  </div>
                </motion.div>
              ))}

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleAddChallenge}
              >
                <Plus className="w-4 h-4" />
                Добавить задание
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold mb-2">
                Всё готово!
              </h2>
              <p className="text-muted-foreground text-sm">
                Проверьте информацию перед созданием
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Название</p>
                <p className="font-medium">{name}</p>
              </div>

              {description && (
                <div>
                  <p className="text-sm text-muted-foreground">Описание</p>
                  <p>{description}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Тип</p>
                <p>{UI_TEXT.events.eventTypes[eventType]}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Задания</p>
                <p>{challenges.filter(c => c.title).length} шт.</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              После создания вы получите уникальный код для приглашения гостей
            </p>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <div className="container mx-auto max-w-md flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Назад
              </Button>
            )}

            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex-1 gap-2"
              >
                Далее
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent"
              >
                <Check className="w-4 h-4" />
                Создать событие
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
