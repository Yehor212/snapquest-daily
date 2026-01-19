import { motion } from "framer-motion";
import { TrendingUp, Calendar, Target, Zap, Loader2 } from "lucide-react";
import { useWeeklyActivity, useCurrentProfile } from "@/hooks/useProfile";

export const ProfileStats = () => {
  const { data: weekActivity, isLoading: activityLoading } = useWeeklyActivity();
  const { data: profile } = useCurrentProfile();

  const weekData = weekActivity || [];
  const completedDays = weekData.filter(d => d.completed).length;
  const weeklyXp = weekData.reduce((sum, d) => sum + d.xp, 0);
  const totalDays = weekData.length || 7;
  const accuracy = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  if (activityLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </motion.div>
    );
  }

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
            <span className="font-bold">{completedDays}/{totalDays}</span>
          </div>
          <div className="text-xs text-muted-foreground">Выполнено</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gold mb-1">
            <Zap className="w-4 h-4" />
            <span className="font-bold">{weeklyXp}</span>
          </div>
          <div className="text-xs text-muted-foreground">XP за неделю</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-primary mb-1">
            <Target className="w-4 h-4" />
            <span className="font-bold">{accuracy}%</span>
          </div>
          <div className="text-xs text-muted-foreground">Активность</div>
        </div>
      </div>
    </motion.div>
  );
};
