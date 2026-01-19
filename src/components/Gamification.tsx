import { motion } from "framer-motion";
import { Flame, Trophy, Star, Target, Zap, Crown } from "lucide-react";

const badges = [
  { icon: Flame, name: "7 дней подряд", color: "bg-primary", earned: true },
  { icon: Star, name: "Первый ТОП", color: "bg-gold", earned: true },
  { icon: Target, name: "Снайпер", color: "bg-accent", earned: true },
  { icon: Zap, name: "Молния", color: "bg-success", earned: false },
  { icon: Crown, name: "Легенда", color: "bg-primary", earned: false },
];

const leaderboard = [
  { rank: 1, name: "anna_photo", xp: 15420, avatar: "A", color: "bg-gold" },
  { rank: 2, name: "maxim.creative", xp: 14890, avatar: "M", color: "bg-muted-foreground" },
  { rank: 3, name: "elena_art", xp: 13750, avatar: "E", color: "bg-primary" },
  { rank: 4, name: "dmitry_shots", xp: 12340, avatar: "D", color: "bg-accent" },
  { rank: 5, name: "kate.moments", xp: 11890, avatar: "K", color: "bg-success" },
];

export const Gamification = () => {
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
                  <p className="text-sm text-muted-foreground">3 из 12 получено</p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.name}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div
                      className={`aspect-square rounded-xl ${
                        badge.earned
                          ? `${badge.color} shadow-lg`
                          : "bg-secondary border border-border"
                      } flex items-center justify-center transition-transform group-hover:scale-110`}
                    >
                      <badge.icon
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
                ))}
              </div>

              {/* Progress */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">До следующего бейджа</span>
                  <span className="font-semibold">2 дня</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "71%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full gradient-primary rounded-full"
                  />
                </div>
              </div>
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
                  <h3 className="font-display font-bold text-lg">Лидерборд недели</h3>
                  <p className="text-sm text-muted-foreground">Ты на 47 месте</p>
                </div>
              </div>

              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={user.name}
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
                    <div className={`w-10 h-10 rounded-full ${user.color} flex items-center justify-center text-sm font-semibold text-primary-foreground`}>
                      {user.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                    </div>

                    {/* XP */}
                    <div className="flex items-center gap-1 text-gold">
                      <Star className="w-4 h-4" />
                      <span className="font-semibold text-sm">{user.xp.toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
