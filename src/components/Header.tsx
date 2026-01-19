import { Link, useNavigate } from "react-router-dom";
import { Flame, Camera, Trophy, User, Image, Wand2, Map, Users } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LoginButton } from "./auth";
import { useCurrentProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useCurrentProfile();

  // Format numbers
  const formatNumber = (num: number | undefined) => {
    if (!num) return "0";
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  };

  const streak = profile?.streak || 0;
  const totalXp = profile?.xp || 0;

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <Camera className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Snap<span className="text-gradient">Quest</span>
            </span>
          </motion.div>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/generator" className="gap-2">
              <Wand2 className="w-4 h-4" />
              Генератор
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/hunts" className="gap-2">
              <Map className="w-4 h-4" />
              Охота
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/events" className="gap-2">
              <Users className="w-4 h-4" />
              События
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/gallery" className="gap-2">
              <Image className="w-4 h-4" />
              Галерея
            </Link>
          </Button>
          {user && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profile" className="gap-2">
                <User className="w-4 h-4" />
                Профиль
              </Link>
            </Button>
          )}
        </nav>

        {/* Stats - Desktop (only show when logged in) */}
        {user && (
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-primary">
                <Flame className="w-4 h-4" />
                <span className="font-semibold">{streak}</span>
              </div>
              <span className="text-muted-foreground">{streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-gold">
                <Trophy className="w-4 h-4" />
                <span className="font-semibold">{formatNumber(totalXp)}</span>
              </div>
              <span className="text-muted-foreground">XP</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/generator")}>
                <Wand2 className="w-4 h-4 mr-2" />
                Генератор
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/hunts")}>
                <Map className="w-4 h-4 mr-2" />
                Фото-охота
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/events")}>
                <Users className="w-4 h-4 mr-2" />
                События
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/gallery")}>
                <Image className="w-4 h-4 mr-2" />
                Галерея
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="w-4 h-4 mr-2" />
                Профиль
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden sm:flex">
            <LoginButton />
          </div>

          <Button variant="hero" size="sm" onClick={() => navigate("/upload")}>
            <Camera className="w-4 h-4 mr-2" />
            Снять
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
