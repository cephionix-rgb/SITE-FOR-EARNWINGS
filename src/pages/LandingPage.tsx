import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { HeroIntro } from "../components/HeroIntro";
import { CloudBackground } from "../components/CloudBackground";
import { HeroSection } from "../sections/HeroSection";
import { FeatureOrbit } from "../sections/FeatureOrbit";
import { StatsMarquee } from "../sections/StatsMarquee";
import { PlaygroundSection } from "../sections/PlaygroundSection";
import { FlightPathScroll } from "../sections/FlightPathScroll";
import { ProofBand } from "../sections/ProofBand";
import { FounderBenefits } from "../sections/FounderBenefits";
import { AppShowcase } from "../sections/AppShowcase";
import { JourneySection } from "../sections/JourneySection";
import { Roadmap } from "../components/Roadmap";
import { AspirationalMoment } from "../sections/AspirationalMoment";
import { WaitlistSection } from "../sections/WaitlistSection";
import { SectionCTA } from "../components/SectionCTA";
import { useScrollDepth } from "../lib/track";

export function LandingPage() {
  useScrollDepth(); // Task 8 — scroll depth 25/50/75/100

  return (
    <div className="relative">
      {/* One unified animated cloud sky behind the whole page */}
      <CloudBackground />
      <div className="relative z-10">
        <HeroIntro />
        <Nav />
        <main>
          <HeroSection />
          <FeatureOrbit />
          <StatsMarquee />
          <SectionCTA variant="cockpit" />
          <FlightPathScroll />
          <SectionCTA variant="flightdeck" />
          <PlaygroundSection />
          <SectionCTA variant="play" />
          {/* Proof sits between the demo and the founder benefits (Task 5) */}
          <ProofBand />
          {/* FounderBenefits — move this one line to reposition (Task 3) */}
          <FounderBenefits />
          <AppShowcase />
          <SectionCTA variant="app" />
          <Roadmap />
          <JourneySection />
          <SectionCTA variant="journey" />
          <AspirationalMoment />
          <WaitlistSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
