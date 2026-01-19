import { motion } from "framer-motion";
import { Camera, Settings, Share2, MapPin, Calendar, Flame, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProfileHeader = () => {
  return (
    <div className="relative">
      {/* Cover image */}
      <div className="h-48 md:h-64 rounded-2xl overflow-hidden relative">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"
          alt="Cover"
          className="w-full h-full object-cover"
        />
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
              <div className="w-full h-full rounded-xl bg-card flex items-center justify-center text-4xl md:text-5xl font-bold text-primary">
                А
              </div>
            </div>
            {/* Level badge */}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-sm font-bold text-gold-foreground shadow-lg">
              12
            </div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
                  Анна Фотограф
                </h1>
                <p className="text-muted-foreground text-sm mb-3">@anna_photo</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>Москва, Россия</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>С марта 2024</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                  Поделиться
                </Button>
                <Button variant="ghost" size="icon">
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
          {[
            { icon: Camera, label: "Фото", value: "127", color: "text-primary" },
            { icon: Flame, label: "Стрик", value: "23 дня", color: "text-primary" },
            { icon: Trophy, label: "Бейджи", value: "8", color: "text-gold" },
            { icon: Star, label: "XP", value: "4,250", color: "text-gold" },
            { icon: Trophy, label: "Рейтинг", value: "#47", color: "text-accent" },
          ].map((stat, index) => (
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
    </div>
  );
};
