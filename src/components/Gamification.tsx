import { motion } from "framer-motion";
import { Flame, Trophy, Star, Target, Zap, Crown, Camera, Award, Loader2 } from "lucide-react";
import { useAllBadges, useUserBadges, useLeaderboard, useUserRank, useCurrentProfile } from "@/hooks/useProfile";
import type { Badge } from "@/lib/api/profiles";

// Icon mapping for badge icons from database
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  flame: Flame,
  star: Star,
  target: Target,
  zap: Zap,
  crown: Crown,
  trophy: Trophy,
  camera: Camera,
  award: Award,
};

// Color mapping for badge colors from database
const colorMap: Record<string, string> = {
  primary: "bg-primary",
  gold: "bg-gold",
  accent: "bg-accent",
  success: "bg-success",
  destructive: "bg-destructive",
};

function getBadgeIcon(badge: Badge) {
  return iconMap[badge.icon?.toLowerCase()] || Award;
}

function getBadgeColor(badge: Badge) {
  return colorMap[badge.color?.toLowerCase()] || "bg-primary";
}

export const Gamification = () => {
  const { data: allBadges, isLoading: badgesLoading } = useAllBadges();
  const { data: userBadges } = useUserBadges();
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard(5);
  const { data: userRank } = useUserRank();
  const { data: profile } = useCurrentProfile();

  // Create a set of earned badge IDs for quick lookup
  const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);

  // Map all badges with earned status
  const displayBadges = (allBadges || []).slice(0, 5).map(badge => ({
    ...badge,
    earned: earnedBadgeIds.has(badge.id),
  }));

  const earnedCount = userBadges?.length || 0;
  const totalBadges = allBadges?.length || 0;

  // Find next badge to earn (first unearned)
  const nextBadge = displayBadges.find(b => !b.earned);

  return (
    <section className="py-20 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Зарабатывай <span className="text-gradient">награды</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Стрики, бейджи, XP и лидерборды — мотивация возвращаться каждый день
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">Твои бейджи</h3>
                  <p className="text-sm text-muted-foreground">{earnedCount} из {totalBadges} получено</p>
                </div>
              </div>

              {badgesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-3">
                  {displayBadges.map((badge, index) => {
                    const IconComponent = getBadgeIcon(badge);
                    const colorClass = getBadgeColor(badge);
                    return (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="group relative"
                      >
                        <div
                          className={`aspect-square rounded-xl ${
                            badge.earned
                              ? `${colorClass} shadow-lg`
                              : "bg-secondary border border-border"
                          } flex items-center justify-center transition-transform group-hover:scale-110`}
                        >
                          <IconComponent
                            className={`w-6 h-6 ${
                              badge.earned ? "text-primary-foreground" : "text-muted-foreground/40"
                            }`}
                          />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {badge.name}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Progress to next badge */}
              {nextBadge && (
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Следующий: {nextBadge.name}</span>
                    <span className="font-semibold">{nextBadge.requirement_value || 0} {nextBadge.requirement_type === 'streak' ? 'дней' : ''}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(100, ((profile?.streak || 0) / (nextBadge.requirement_value || 1)) * 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full gradient-primary rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">Лидерборд</h3>
                  <p className="text-sm text-muted-foreground">
                    {userRank ? `Ты на ${userRank} месте` : 'Войди, чтобы увидеть свой рейтинг'}
                  </p>
                </div>
              </div>

              {leaderboardLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (leaderboard && leaderboard.length > 0) ? (
                <div className="space-y-3">
                  {leaderboard.map((user, index) => {
                    const colors = ["bg-gold", "bg-muted-foreground", "bg-primary", "bg-accent", "bg-success"];
                    const avatarColor = colors[index % colors.length];
                    const displayName = user.display_name || user.username || 'Аноним';
                    const avatar = displayName.charAt(0).toUpperCase();

                    return (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        {/* Rank */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          user.rank === 1 ? "bg-gold text-gold-foreground" :
                          user.rank === 2 ? "bg-muted-foreground text-background" :
                          user.rank === 3 ? "bg-primary text-primary-foreground" :
                          "bg-secondary text-muted-foreground"
                        }`}>
                          {user.rank}
                        </div>

                        {/* Avatar */}
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={displayName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-sm font-semibold text-primary-foreground`}>
                            {avatar}
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{displayName}</p>
                        </div>

                        {/* XP */}
                        <div className="flex items-center gap-1 text-gold">
                          <Star className="w-4 h-4" />
                          <span className="font-semibold text-sm">{user.xp.toLocaleString()}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Пока нет участников</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
