import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TodayChallenge } from "@/components/TodayChallenge";
import { ChallengeFeed } from "@/components/ChallengeFeed";
import { GameModes } from "@/components/GameModes";
import { Gamification } from "@/components/Gamification";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <TodayChallenge />
        <ChallengeFeed />
        <GameModes />
        <Gamification />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
