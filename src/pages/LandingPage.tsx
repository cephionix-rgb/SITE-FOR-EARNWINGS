import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { HeroIntro } from "../components/HeroIntro";
import { CloudBackground } from "../components/CloudBackground";
import { HeroSection } from "../sections/HeroSection";
import { FeatureOrbit } from "../sections/FeatureOrbit";
import { StatsMarquee } from "../sections/StatsMarquee";
import { PlaygroundSection } from "../sections/PlaygroundSection";
import { FlightPathScroll } from "../sections/FlightPathScroll";
import { AppShowcase } from "../sections/AppShowcase";
import { JourneySection } from "../sections/JourneySection";
import { WaitlistSection } from "../sections/WaitlistSection";

export function LandingPage() {
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
          <FlightPathScroll />
          <PlaygroundSection />
          <AppShowcase />
          <JourneySection />
          <WaitlistSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
