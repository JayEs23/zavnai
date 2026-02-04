import { LandingNavbar } from "./LandingNavbar";
import { HeroSection } from "./HeroSection";
import { EcosystemSection } from "./EcosystemSection";
import { StakesSection } from "./StakesSection";
import { TribeSection } from "./TribeSection";
import { LandingFooter } from "./LandingFooter";

export const LandingLayout = () => {
  return (
    <div className="bg-[#09090b] text-zinc-100 min-h-screen selection:bg-amber-500 selection:text-black font-sans">
      <div className="grain-overlay opacity-[0.03]" />
      <LandingNavbar />
      <main className="relative">
        <HeroSection />
        <EcosystemSection />
        <StakesSection />
        <TribeSection />
      </main>
      <LandingFooter />
    </div>
  );
};
