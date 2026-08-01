import { lazy, Suspense, useEffect } from "react";
import { useLenis } from "./lib/scroll";
import { useRoute } from "./lib/router";
import { initAnalytics, trackPageView } from "./lib/analytics";
import { LandingPage } from "./pages/LandingPage";

// Sub-pages are code-split (4.2e): each loads only when its route is visited, so
// none of them sit in the initial landing-page bundle. LandingPage stays eager
// (it is the default route and the one almost everyone lands on).
const FeaturesPage = lazy(() => import("./pages/FeaturesPage").then((m) => ({ default: m.FeaturesPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const WhyEarnwingsPage = lazy(() => import("./pages/WhyEarnwingsPage").then((m) => ({ default: m.WhyEarnwingsPage })));
const GroundClassesPage = lazy(() => import("./pages/GroundClassesPage").then((m) => ({ default: m.GroundClassesPage })));
const FaqPage = lazy(() => import("./pages/FaqPage").then((m) => ({ default: m.FaqPage })));
const GlossaryPage = lazy(() => import("./pages/GlossaryPage").then((m) => ({ default: m.GlossaryPage })));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage").then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./pages/TermsPage").then((m) => ({ default: m.TermsPage })));
const CopyrightPage = lazy(() => import("./pages/CopyrightPage").then((m) => ({ default: m.CopyrightPage })));

export default function App() {
  // Lenis (smooth scroll) lives at the app root so it survives page changes.
  useLenis();
  const path = useRoute();

  // Google Analytics — loads once, then records a page view per route change.
  useEffect(() => { initAnalytics(); }, []);
  useEffect(() => { trackPageView(path); }, [path]);

  let page;
  switch (path) {
    case "/features": page = <FeaturesPage />; break;
    case "/about": page = <AboutPage />; break;
    case "/why-earnwings": page = <WhyEarnwingsPage />; break;
    case "/dgca-ground-classes": page = <GroundClassesPage />; break;
    case "/faq": page = <FaqPage />; break;
    case "/aviation-glossary": page = <GlossaryPage />; break;
    case "/privacy": page = <PrivacyPage />; break;
    case "/terms": page = <TermsPage />; break;
    case "/copyright": page = <CopyrightPage />; break;
    default: page = <LandingPage />;
  }
  return <Suspense fallback={null}>{page}</Suspense>;
}
