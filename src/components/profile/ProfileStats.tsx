import { motion } from "framer-motion";
import { TrendingUp, Calendar, Target, Zap } from "lucide-react";

const weekData = [
  { day: "Пн", completed: true, xp: 50 },
  { day: "Вт", completed: true, xp: 75 },
  { day: "Ср", completed: true, xp: 50 },
  { day: "Чт", completed: true, xp: 100 },
  { day: "Пт", completed: true, xp: 50 },
  { day: "Сб", completed: false, xp: 0 },
  { day: "Вс", completed: false, xp: 0 },
];

export const ProfileStats = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">Статистика активности</h3>
            <p className="text-sm text-muted-foreground">Эта неделя</p>
          </div>
        </div>
      </div>

      {/* Week calendar */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekData.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="text-center"
          >
            <div className="text-xs text-muted-foreground mb-2">{day.day}</div>
            <div
              className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                day.completed
                  ? "gradient-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {day.completed ? "✓" : "—"}
            </div>
            {day.xp > 0 && (
              <div className="text-xs text-gold mt-1">+{day.xp}</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-success mb-1">
            <Calendar className="w-4 h-4" />
            <span className="font-bold">5/7</span>
          </div>
          <div className="text-xs text-muted-foreground">Выполнено</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gold mb-1">
            <Zap className="w-4 h-4" />
            <span className="font-bold">325</span>
          </div>
          <div className="text-xs text-muted-foreground">XP за неделю</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-primary mb-1">
            <Target className="w-4 h-4" />
            <span className="font-bold">89%</span>
          </div>
          <div className="text-xs text-muted-foreground">Точность</div>
        </div>
      </div>
    </motion.div>
  );
};
