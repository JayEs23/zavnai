import { LandingNavbar } from "./LandingNavbar";
import { HeroSection } from "./HeroSection";
import { StatsSection } from "./StatsSection";
import { FocusAreasSection } from "./FocusAreasSection";
import { EcosystemSection } from "./EcosystemSection";
import { StakesSection } from "./StakesSection";
import { TribeSection } from "./TribeSection";
import { WaitlistSection } from "./WaitlistSection";
import { CtaSection } from "./CtaSection";
import { LandingFooter } from "./LandingFooter";
import { ENABLE_WAITLIST_MODE } from "@/constants/featureFlags";

export const LandingLayout = () => {
  return (
    <div className="bg-white min-h-screen">
      <LandingNavbar />
      <main className="pt-20 px-2">
        <HeroSection />
        <StatsSection />
        <FocusAreasSection />
        <EcosystemSection />
        <StakesSection />
        <TribeSection />
        {ENABLE_WAITLIST_MODE ? <WaitlistSection /> : <CtaSection />}
      </main>
      <LandingFooter />
    </div>
  );
};
