import { motion } from "framer-motion";
import { Trophy, Flame, Star, Target, Zap, Crown, Camera, Heart, Award, Loader2 } from "lucide-react";
import { useUserBadges, useAllBadges, useCurrentProfile } from "@/hooks/useProfile";
import type { LucideIcon } from "lucide-react";

// Map badge icons by name
const iconMap: Record<string, LucideIcon> = {
  flame: Flame,
  star: Star,
  target: Target,
  zap: Zap,
  crown: Crown,
  camera: Camera,
  heart: Heart,
  award: Award,
  trophy: Trophy,
};

// Map badge colors
const colorMap: Record<string, string> = {
  primary: "bg-primary",
  gold: "bg-gold",
  accent: "bg-accent",
  success: "bg-success",
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
};

export const ProfileBadges = () => {
  const { data: userBadges, isLoading: badgesLoading } = useUserBadges();
  const { data: allBadges, isLoading: allBadgesLoading } = useAllBadges();
  const { data: profile } = useCurrentProfile();

  const isLoading = badgesLoading || allBadgesLoading;

  // Earned badge IDs
  const earnedBadgeIds = new Set((userBadges || []).map(ub => ub.badge_id));

  // Process earned badges
  const earnedBadges = (userBadges || []).map(ub => ({
    id: ub.badge_id,
    icon: iconMap[ub.badge?.icon || 'award'] || Award,
    name: ub.badge?.name || 'Бейдж',
    description: ub.badge?.description || '',
    color: colorMap[ub.badge?.color || 'primary'] || 'bg-primary',
    date: ub.earned_at ? new Date(ub.earned_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : '',
  }));

  // Process in-progress badges (not earned yet)
  const inProgressBadges = (allBadges || [])
    .filter(b => !earnedBadgeIds.has(b.id))
    .map(b => {
      // Calculate progress based on requirement type
      let progress = 0;
      if (profile) {
        switch (b.requirement_type) {
          case 'streak':
            progress = Math.min(100, Math.round((profile.streak / b.requirement_value) * 100));
            break;
          case 'photos':
            // Would need photos count from profile
            progress = 0;
            break;
          case 'xp':
            progress = Math.min(100, Math.round((profile.xp / b.requirement_value) * 100));
            break;
          case 'level':
            progress = Math.min(100, Math.round((profile.level / b.requirement_value) * 100));
            break;
          default:
            progress = 0;
        }
      }
      return {
        id: b.id,
        icon: iconMap[b.icon || 'award'] || Award,
        name: b.name,
        description: b.description,
        color: colorMap[b.color || 'primary'] || 'bg-primary',
        progress,
      };
    })
    .slice(0, 3); // Show only top 3 in-progress badges

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </motion.div>
    );
  }

  const totalBadges = allBadges?.length || 0;

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
          <p className="text-sm text-muted-foreground">
            {earnedBadges.length} из {totalBadges} получено
          </p>
        </div>
      </div>

      {/* Earned badges */}
      {earnedBadges.length > 0 ? (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {earnedBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
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
      ) : (
        <div className="text-center py-4 mb-6 text-muted-foreground text-sm">
          Пока нет полученных бейджей. Выполняйте челленджи!
        </div>
      )}

      {/* In progress */}
      {inProgressBadges.length > 0 && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">В процессе</p>
          <div className="space-y-3">
            {inProgressBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center">
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
      )}
    </motion.div>
  );
};
