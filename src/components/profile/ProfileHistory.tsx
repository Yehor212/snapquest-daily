import { motion } from "framer-motion";
import { Camera, Heart, Award, Clock } from "lucide-react";
import { useState } from "react";

const historyItems = [
  {
    id: 1,
    challenge: "Отражение в луже",
    date: "Сегодня",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    likes: 45,
    isTop: true,
    xp: 75,
  },
  {
    id: 2,
    challenge: "Городские тени",
    date: "Вчера",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop",
    likes: 32,
    isTop: false,
    xp: 50,
  },
  {
    id: 3,
    challenge: "Минимализм",
    date: "2 дня назад",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27abb37f?w=400&h=400&fit=crop",
    likes: 67,
    isTop: true,
    xp: 100,
  },
  {
    id: 4,
    challenge: "Золотой час",
    date: "3 дня назад",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=400&fit=crop",
    likes: 28,
    isTop: false,
    xp: 50,
  },
  {
    id: 5,
    challenge: "Текстуры",
    date: "4 дня назад",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop",
    likes: 41,
    isTop: false,
    xp: 50,
  },
  {
    id: 6,
    challenge: "Симметрия",
    date: "5 дней назад",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop",
    likes: 89,
    isTop: true,
    xp: 100,
  },
];

export const ProfileHistory = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Camera className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">История челленджей</h3>
            <p className="text-sm text-muted-foreground">127 выполненных заданий</p>
          </div>
        </div>
        <button className="text-sm text-primary hover:underline">Все фото</button>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {historyItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(selectedImage === item.id ? null : item.id)}
          >
            <img
              src={item.image}
              alt={item.challenge}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-sm font-medium truncate mb-1">{item.challenge}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-primary" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top badge */}
            {item.isTop && (
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-gold text-gold-foreground text-xs font-semibold">
                <Award className="w-3 h-3" />
                ТОП
              </div>
            )}

            {/* XP earned */}
            <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-semibold text-gold">
              +{item.xp} XP
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load more */}
      <div className="mt-4 text-center">
        <button className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          Показать ещё
        </button>
      </div>
    </motion.div>
  );
};
