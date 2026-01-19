import { motion } from "framer-motion";
import { Trophy, Flame, Star, Target, Zap, Crown, Camera, Heart, Award } from "lucide-react";

const badges = [
  { icon: Flame, name: "7 дней подряд", description: "Выполняй задания 7 дней", color: "bg-primary", earned: true, date: "15 янв" },
  { icon: Star, name: "Первая звезда", description: "Получи первый лайк", color: "bg-gold", earned: true, date: "10 янв" },
  { icon: Target, name: "Снайпер", description: "10 заданий подряд", color: "bg-accent", earned: true, date: "20 янв" },
  { icon: Camera, name: "Фотограф", description: "50 выполненных заданий", color: "bg-success", earned: true, date: "25 янв" },
  { icon: Heart, name: "Любимчик", description: "100 лайков на фото", color: "bg-primary", earned: true, date: "1 фев" },
  { icon: Award, name: "ТОП дня", description: "Попади в ТОП", color: "bg-gold", earned: true, date: "5 фев" },
  { icon: Crown, name: "Легенда", description: "365 дней в приложении", color: "bg-gold", earned: false, progress: 35 },
  { icon: Zap, name: "Молния", description: "30 дней подряд", color: "bg-accent", earned: false, progress: 76 },
];

export const ProfileBadges = () => {
  const earnedBadges = badges.filter(b => b.earned);
  const inProgressBadges = badges.filter(b => !b.earned);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg">Бейджи</h3>
          <p className="text-sm text-muted-foreground">{earnedBadges.length} из {badges.length} получено</p>
        </div>
      </div>

      {/* Earned badges */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {earnedBadges.map((badge, index) => (
          <motion.div
            key={badge.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="group relative"
          >
            <div
              className={`aspect-square rounded-xl ${badge.color} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 cursor-pointer`}
            >
              <badge.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-foreground text-background text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              <div className="font-semibold">{badge.name}</div>
              <div className="text-muted">{badge.date}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* In progress */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-3">В процессе</p>
        <div className="space-y-3">
          {inProgressBadges.map((badge) => (
            <div key={badge.name} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center`}>
                <badge.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">{badge.name}</span>
                  <span className="text-xs text-muted-foreground">{badge.progress}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all"
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
