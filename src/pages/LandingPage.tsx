import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { CloudBackground } from "../components/CloudBackground";
import { HeroSection } from "../sections/HeroSection";
import { ProductTour } from "../sections/ProductTour";
import { FlightPathScroll } from "../sections/FlightPathScroll";
import { RadioSection } from "../sections/RadioSection";
import { CockpitSection } from "../sections/CockpitSection";
import { ToolkitSection } from "../sections/ToolkitSection";
import { WaitlistSection } from "../sections/WaitlistSection";
import { InteractiveNotesSection } from "../sections/InteractiveNotesSection";
import { AezonSection } from "../sections/AezonSection";
import { JourneySection } from "../sections/JourneySection";
import { useScrollDepth } from "../lib/track";
import { lazy, Suspense } from "react";

// Below-the-fold sections are code-split so they add nothing to the first load.
const FeatureOrbit = lazy(() => import("../sections/FeatureOrbit").then((m) => ({ default: m.FeatureOrbit })));
const LiveSection = lazy(() => import("../sections/LiveSection").then((m) => ({ default: m.LiveSection })));
const GuideTeaser = lazy(() => import("../sections/GuideTeaser").then((m) => ({ default: m.GuideTeaser })));
const FilmSection = lazy(() => import("../sections/FilmSection").then((m) => ({ default: m.FilmSection })));
const PlansFaq = lazy(() => import("../sections/PlansFaq").then((m) => ({ default: m.PlansFaq })));
const Later = ({ children, h }: { children: React.ReactNode; h: number }) => (
  <Suspense fallback={<div style={{ minHeight: h }} />}>{children}</Suspense>
);

/**
 * Homepage order (Nov 2026 redesign): one idea per section, alternating light
 * sky and navy bands so the page has rhythm on a phone.
 *   hero (with the EARN YOUR WINGS flip-board) -> what's inside (the phone with
 *   the features orbiting it, lazy) -> the study app -> interactive notes -> the syllabus board
 *   (navy) -> radio -> A320 deck -> Captain Aezon -> everyday help -> film -> live airports -> Pilot Guide (navy) -> plans/FAQ
 *   -> join -> quiz.
 * Retired from the homepage (files kept): StatsMarquee,
 * PlaygroundSection (route planner: flight planning is switched off in the app),
 * ProofBand, FounderBenefits (merged into the join section), AppShowcase,
 * Roadmap (still on /about), AspirationalMoment and the repeated SectionCTAs.
 */
export function LandingPage() {
  useScrollDepth();

  return (
    <div className="relative">
      <CloudBackground />
      <div className="relative z-10">
        <Nav />
        <main>
          <HeroSection />
          <Later h={900}><FeatureOrbit /></Later>
          <ProductTour />
          <InteractiveNotesSection />
          <FlightPathScroll />
          <RadioSection />
          <CockpitSection />
          <AezonSection />
          <ToolkitSection />
          <Later h={700}><FilmSection /></Later>
          <Later h={800}><LiveSection /></Later>
          <Later h={700}><GuideTeaser /></Later>
          <Later h={800}><PlansFaq /></Later>
          <WaitlistSection />
          <JourneySection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
