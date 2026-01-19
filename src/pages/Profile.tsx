import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileBadges } from "@/components/profile/ProfileBadges";
import { ProfileHistory } from "@/components/profile/ProfileHistory";
import { ProfileAchievements } from "@/components/profile/ProfileAchievements";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn, Camera } from "lucide-react";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Show login prompt if not authenticated
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <Camera className="w-10 h-10 text-muted-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold mb-3">
                Войдите в аккаунт
              </h1>
              <p className="text-muted-foreground mb-6">
                Чтобы видеть свой профиль, сохранять прогресс и участвовать в событиях
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={() => navigate('/')} variant="hero" size="lg" className="w-full">
                  <LogIn className="w-5 h-5 mr-2" />
                  Войти на главной
                </Button>
                <Button onClick={() => navigate('/gallery')} variant="outline" size="lg" className="w-full">
                  Посмотреть галерею
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProfileHeader />
          </motion.div>

          <div className="mt-8 grid lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              <ProfileStats />
              <ProfileHistory />
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <ProfileBadges />
              <ProfileAchievements />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
