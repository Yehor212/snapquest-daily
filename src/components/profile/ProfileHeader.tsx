import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Settings, Share2, Calendar, Flame, Trophy, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentProfile, useUserStats } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { EditProfileDialog } from "./EditProfileDialog";

export const ProfileHeader = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { data: stats, isLoading: statsLoading } = useUserStats(user?.id);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const isLoading = profileLoading || statsLoading;

  // Format date
  const formatJoinDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Недавно";
    const date = new Date(dateStr);
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня",
                    "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    return `С ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Get initials from display name
  const getInitials = (name: string | undefined) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // Format numbers
  const formatNumber = (num: number | undefined) => {
    if (!num) return "0";
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="relative">
        <div className="h-48 md:h-64 rounded-2xl bg-secondary animate-pulse" />
        <div className="relative px-4 md:px-8 -mt-16 md:-mt-20 flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const displayName = profile?.display_name || user?.email?.split('@')[0] || "Пользователь";
  const username = profile?.username || user?.email?.split('@')[0] || "user";
  const level = profile?.level || 1;
  const totalXp = profile?.xp || 0;
  const streak = profile?.streak || 0;
  const photosCount = stats?.photosCount || 0;
  const badgesCount = stats?.badgesCount || 0;

  const quickStats = [
    { icon: Camera, label: "Фото", value: formatNumber(photosCount), color: "text-primary" },
    { icon: Flame, label: "Стрик", value: `${streak} ${streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'}`, color: "text-primary" },
    { icon: Trophy, label: "Бейджи", value: formatNumber(badgesCount), color: "text-gold" },
    { icon: Star, label: "XP", value: formatNumber(totalXp), color: "text-gold" },
    { icon: Trophy, label: "Уровень", value: `${level}`, color: "text-accent" },
  ];

  return (
    <div className="relative">
      {/* Cover image */}
      <div className="h-48 md:h-64 rounded-2xl overflow-hidden relative">
        <div className="w-full h-full bg-gradient-to-br from-primary/30 via-accent/20 to-gold/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Profile info */}
      <div className="relative px-4 md:px-8 -mt-16 md:-mt-20">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative"
          >
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl gradient-primary p-1 shadow-xl">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-card flex items-center justify-center text-4xl md:text-5xl font-bold text-primary">
                  {getInitials(displayName)}
                </div>
              )}
            </div>
            {/* Level badge */}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-sm font-bold text-gold-foreground shadow-lg">
              {level}
            </div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
                  {displayName}
                </h1>
                <p className="text-muted-foreground text-sm mb-3">@{username}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatJoinDate(profile?.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                  Поделиться
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setEditDialogOpen(true)}>
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 grid grid-cols-3 md:grid-cols-5 gap-4"
        >
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl border border-border p-3 md:p-4 text-center hover:border-primary/30 transition-colors"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
              <div className="font-display font-bold text-lg md:text-xl">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </div>
  );
};
