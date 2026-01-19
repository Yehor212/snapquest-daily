import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Map, Users, Sparkles, ChevronRight, Wand2 } from "lucide-react";
import { useGlobalStats } from "@/hooks/usePhotos";

export const GameModes = () => {
  const navigate = useNavigate();
  const { data: stats } = useGlobalStats();

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  };

  const totalPhotos = stats?.totalPhotos || 0;
  const activeHunts = stats?.activeHunts || 0;
  const totalEvents = stats?.totalEvents || 0;

  const modes = [
    {
      icon: Calendar,
      title: "Daily Challenge",
      description: "Одно задание каждый день для всех. Выполняй и смотри, как другие интерпретируют тему",
      color: "from-primary to-primary/60",
      stats: totalPhotos > 0 ? `${formatNumber(totalPhotos)} фото загружено` : "365 челленджей в год",
      link: "/upload",
    },
    {
      icon: Map,
      title: "Фото-охота",
      description: "Список из 5-10 заданий на день или неделю. Идеально для путешествий и прогулок",
      color: "from-accent to-accent/60",
      stats: activeHunts > 0 ? `${activeHunts} активных охот` : "3 тематические охоты",
      link: "/hunts",
    },
    {
      icon: Users,
      title: "Социальные челленджи",
      description: "Создавай приватные игры для друзей, свадеб, тимбилдингов и вечеринок",
      color: "from-gold to-gold/60",
      stats: totalEvents > 0 ? `${formatNumber(totalEvents)} мероприятий` : "Создай своё событие",
      link: "/events",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-muted-foreground">
              Три режима игры
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Выбери свой <span className="text-gradient">формат</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Играй один или с друзьями, каждый день или на особых событиях
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group cursor-pointer"
              onClick={() => navigate(mode.link)}
            >
              <div className="h-full bg-card rounded-2xl border border-border p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <mode.icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {mode.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {mode.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">{mode.stats}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Generator CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => navigate("/generator")}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-gold/10 border border-border hover:border-primary/40 transition-all group"
          >
            <Wand2 className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
            <span className="font-medium">Генератор челленджей</span>
            <span className="text-muted-foreground hidden sm:inline">— бесконечные идеи для фото</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
