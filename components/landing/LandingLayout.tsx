import { LandingNavbar } from "./LandingNavbar";
import { HeroSection } from "./HeroSection";
import { EcosystemSection } from "./EcosystemSection";
import { StakesSection } from "./StakesSection";
import { TribeSection } from "./TribeSection";
import { LandingFooter } from "./LandingFooter";

export const LandingLayout = () => {
  return (
    <div className="bg-white min-h-screen">
      <LandingNavbar />
      <main className="pt-20">
        <HeroSection />
        <EcosystemSection />
        <StakesSection />
        <TribeSection />
      </main>
      <LandingFooter />
    </div>
  );
};
