import { motion } from "framer-motion";
import { Award, Sparkles, Target, Flame, Camera, Heart, Loader2 } from "lucide-react";
import { useUserAchievements, useCurrentProfile, useUserStats } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

export const ProfileAchievements = () => {
  const { user } = useAuth();
  const { data: achievements, isLoading: achievementsLoading } = useUserAchievements();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { data: stats } = useUserStats(user?.id);

  const isLoading = achievementsLoading || profileLoading;

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </motion.div>
    );
  }

  const totalPhotos = stats?.photosCount || achievements?.totalPhotos || 0;
  const topPhotosCount = achievements?.topPhotosCount || 0;

  const achievementsList = [
    {
      icon: Flame,
      title: "Рекордный стрик",
      value: `${profile?.longest_streak || 0} дн.`,
      description: "Твой лучший результат",
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      icon: Target,
      title: "В ТОП",
      value: `${topPhotosCount}`,
      description: "Фото в топе (10+ лайков)",
      color: "text-accent",
      bgColor: "bg-accent/20",
    },
    {
      icon: Heart,
      title: "Всего лайков",
      value: `${achievements?.totalLikes || 0}`,
      description: "Получено лайков",
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
  ];

  // Add favorite theme if exists
  if (achievements?.favoriteTheme) {
    achievementsList.push({
      icon: Camera,
      title: "Любимая тема",
      value: achievements.favoriteTheme,
      description: `${achievements.favoriteThemeCount} выполнений`,
      color: "text-success",
      bgColor: "bg-success/20",
    });
  }

  const milestones = [
    { target: 1, current: totalPhotos, label: "Первое фото", completed: totalPhotos >= 1 },
    { target: 10, current: totalPhotos, label: "10 фото", completed: totalPhotos >= 10 },
    { target: 50, current: totalPhotos, label: "50 фото мастер", completed: totalPhotos >= 50 },
    { target: 100, current: totalPhotos, label: "100 фото эксперт", completed: totalPhotos >= 100 },
  ];

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
        {achievementsList.map((achievement, index) => (
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
                    {Math.min(milestone.current, milestone.target)}/{milestone.target}
                  </span>
                </div>
                {!milestone.completed && (
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary rounded-full"
                      style={{ width: `${Math.min(100, (milestone.current / milestone.target) * 100)}%` }}
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
