import { motion } from "framer-motion";
import { Award, ChevronRight, Sparkles, Target, Flame, Camera } from "lucide-react";

const achievements = [
  {
    icon: Flame,
    title: "Рекордный стрик",
    value: "23 дня",
    description: "Твой лучший результат",
    color: "text-primary",
    bgColor: "bg-primary/20",
  },
  {
    icon: Target,
    title: "Точность попаданий",
    value: "89%",
    description: "Процент в ТОП",
    color: "text-accent",
    bgColor: "bg-accent/20",
  },
  {
    icon: Camera,
    title: "Любимая тема",
    value: "Пейзажи",
    description: "32 выполнения",
    color: "text-success",
    bgColor: "bg-success/20",
  },
];

const milestones = [
  { target: 50, current: 50, label: "Первые 50 фото", completed: true },
  { target: 100, current: 100, label: "100 фото мастер", completed: true },
  { target: 150, current: 127, label: "150 фото эксперт", completed: false },
  { target: 365, current: 127, label: "Год креатива", completed: false },
];

export const ProfileAchievements = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <Award className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg">Достижения</h3>
          <p className="text-sm text-muted-foreground">Твои рекорды</p>
        </div>
      </div>

      {/* Personal bests */}
      <div className="space-y-3 mb-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg ${achievement.bgColor} flex items-center justify-center`}>
              <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{achievement.title}</span>
                <span className={`font-bold ${achievement.color}`}>{achievement.value}</span>
              </div>
              <span className="text-xs text-muted-foreground">{achievement.description}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Milestones */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-sm font-medium">Milestones</span>
        </div>
        <div className="space-y-3">
          {milestones.map((milestone, index) => (
            <div key={milestone.label} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  milestone.completed
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {milestone.completed ? "✓" : index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${milestone.completed ? "text-foreground" : "text-muted-foreground"}`}>
                    {milestone.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {milestone.current}/{milestone.target}
                  </span>
                </div>
                {!milestone.completed && (
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary rounded-full"
                      style={{ width: `${(milestone.current / milestone.target) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
