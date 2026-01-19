import { motion } from "framer-motion";
import { Clock, Camera, Flame, Trophy, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDailyChallenge, useTodayCompletions } from "@/hooks/useChallenges";

// Local fallback challenges - rotate based on day of year
const localChallenges = [
  { id: "local-1", title: "Тени и свет", description: "Найдите интересную игру теней и света вокруг вас", xp_reward: 50 },
  { id: "local-2", title: "Отражения", description: "Сфотографируйте интересное отражение в воде, стекле или зеркале", xp_reward: 50 },
  { id: "local-3", title: "Симметрия", description: "Найдите симметричный объект или сцену", xp_reward: 50 },
  { id: "local-4", title: "Минимализм", description: "Создайте фото с минимальным количеством элементов", xp_reward: 50 },
  { id: "local-5", title: "Текстуры", description: "Сфотографируйте интересную текстуру крупным планом", xp_reward: 50 },
  { id: "local-6", title: "Цветовой акцент", description: "Найдите яркий цветной объект на нейтральном фоне", xp_reward: 50 },
  { id: "local-7", title: "Геометрия города", description: "Найдите интересные геометрические формы в архитектуре", xp_reward: 50 },
  { id: "local-8", title: "Детали", description: "Сфотографируйте маленькую деталь, которую обычно не замечают", xp_reward: 50 },
  { id: "local-9", title: "Контрасты", description: "Покажите контраст: старое и новое, большое и маленькое", xp_reward: 50 },
  { id: "local-10", title: "Ритм и повторение", description: "Найдите повторяющиеся элементы или паттерны", xp_reward: 50 },
];

export const TodayChallenge = () => {
  const navigate = useNavigate();
  const { data: dbChallenge, isLoading } = useDailyChallenge();
  const { data: completionsCount } = useTodayCompletions();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();

      return {
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (n: number) => n.toString().padStart(2, "0");

  // Calculate day number (day of year)
  const dayNumber = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );

  // Use DB challenge if available, otherwise fallback to local
  const challenge = useMemo(() => {
    if (dbChallenge) return dbChallenge;
    const index = dayNumber % localChallenges.length;
    return localChallenges[index];
  }, [dbChallenge, dayNumber]);

  const challengeDayNumber = dbChallenge?.day_number || dayNumber;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Сегодняшний <span className="text-gradient">челлендж</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Один день — одно задание для всех
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative rounded-3xl bg-gradient-to-br from-secondary to-card border border-border p-8 md:p-10 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl" />

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8 relative">
              <Clock className="w-4 h-4" />
              <span className="text-sm">До следующего челленджа:</span>
              <div className="flex items-center gap-1 font-mono font-semibold text-foreground">
                <span className="bg-secondary px-2 py-1 rounded">{formatTime(timeLeft.hours)}</span>
                <span>:</span>
                <span className="bg-secondary px-2 py-1 rounded">{formatTime(timeLeft.minutes)}</span>
                <span>:</span>
                <span className="bg-secondary px-2 py-1 rounded">{formatTime(timeLeft.seconds)}</span>
              </div>
            </div>

            {/* Challenge content */}
            <div className="text-center relative">
              {isLoading ? (
                <div className="py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground mt-4">Загрузка челленджа...</p>
                </div>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                    <Flame className="w-4 h-4" />
                    День #{challengeDayNumber}
                  </div>

                  <h3 className="font-display text-2xl md:text-4xl font-bold mb-4">
                    "{challenge.title}"
                  </h3>

                  <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                    {challenge.description || "Выполни этот челлендж и получи награду!"}
                  </p>

                  {/* Rewards */}
                  <div className="flex items-center justify-center gap-6 mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-gold" />
                      </div>
                      <span className="text-sm">
                        <span className="font-semibold text-gold">+{challenge.xp_reward} XP</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Flame className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm">
                        <span className="font-semibold text-primary">+1 день</span>
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="group"
                    onClick={() => {
                      const isLocal = challenge.id.startsWith('local-');
                      if (isLocal) {
                        navigate(`/upload?challengeTitle=${encodeURIComponent(challenge.title)}&xp=${challenge.xp_reward}`);
                      } else {
                        navigate(`/upload?challengeId=${challenge.id}&title=${encodeURIComponent(challenge.title)}&xp=${challenge.xp_reward}`);
                      }
                    }}
                  >
                    <Camera className="w-5 h-5" />
                    Выполнить задание
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>

                  {/* Participants count */}
                  <p className="text-sm text-muted-foreground mt-6">
                    <span className="text-foreground font-semibold">{completionsCount || 0}</span> человек уже выполнили сегодня
                  </p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
