import { LandingNavbar } from "./LandingNavbar";
import { HeroSection } from "./HeroSection";
import { EcosystemSection } from "./EcosystemSection";
import { VoiceInteractionSection } from "./VoiceInteractionSection";
import { CtaSection } from "./CtaSection";
import { LandingFooter } from "./LandingFooter";

export const LandingLayout = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen transition-colors duration-300">
      <LandingNavbar />
      <main className="pt-20">
        <HeroSection />
        <EcosystemSection />
        <VoiceInteractionSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};


