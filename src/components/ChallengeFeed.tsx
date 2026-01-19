import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Award } from "lucide-react";
import { useState } from "react";

const feedItems = [
  {
    id: 1,
    username: "anna_photo",
    avatar: "A",
    avatarColor: "bg-primary",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    likes: 234,
    comments: 18,
    isTop: true,
    timeAgo: "2ч назад",
  },
  {
    id: 2,
    username: "maxim.creative",
    avatar: "M",
    avatarColor: "bg-accent",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=600&fit=crop",
    likes: 189,
    comments: 12,
    isTop: false,
    timeAgo: "3ч назад",
  },
  {
    id: 3,
    username: "elena_art",
    avatar: "E",
    avatarColor: "bg-gold",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27abb37f?w=600&h=600&fit=crop",
    likes: 312,
    comments: 24,
    isTop: true,
    timeAgo: "4ч назад",
  },
  {
    id: 4,
    username: "dmitry_shots",
    avatar: "D",
    avatarColor: "bg-success",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=600&fit=crop",
    likes: 156,
    comments: 8,
    isTop: false,
    timeAgo: "5ч назад",
  },
  {
    id: 5,
    username: "kate.moments",
    avatar: "K",
    avatarColor: "bg-primary",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=600&fit=crop",
    likes: 278,
    comments: 21,
    isTop: false,
    timeAgo: "6ч назад",
  },
  {
    id: 6,
    username: "alex_urban",
    avatar: "А",
    avatarColor: "bg-accent",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=600&fit=crop",
    likes: 198,
    comments: 15,
    isTop: true,
    timeAgo: "7ч назад",
  },
];

export const ChallengeFeed = () => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Лента <span className="text-gradient">выполнений</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Смотрите, как другие интерпретируют задание
          </p>
        </motion.div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {feedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={`Photo by ${item.username}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Top badge */}
                  {item.isTop && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-gold text-gold-foreground text-xs font-semibold">
                      <Award className="w-3 h-3" />
                      ТОП
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* User info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full ${item.avatarColor} flex items-center justify-center text-sm font-semibold text-primary-foreground`}>
                      {item.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.username}</p>
                      <p className="text-xs text-muted-foreground">{item.timeAgo}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(item.id)}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          likedPosts.includes(item.id)
                            ? "fill-primary text-primary scale-110"
                            : ""
                        }`}
                      />
                      <span className={likedPosts.includes(item.id) ? "text-primary" : ""}>
                        {likedPosts.includes(item.id) ? item.likes + 1 : item.likes}
                      </span>
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span>{item.comments}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load more */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <button className="px-6 py-3 rounded-xl border-2 border-border text-muted-foreground font-medium hover:border-primary hover:text-primary transition-colors">
            Показать ещё
          </button>
        </motion.div>
      </div>
    </section>
  );
};
