import { useEffect } from "react";
import { useLenis } from "./lib/scroll";
import { useRoute } from "./lib/router";
import { initAnalytics, trackPageView } from "./lib/analytics";
import { LandingPage } from "./pages/LandingPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { AboutPage } from "./pages/AboutPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";

export default function App() {
  // Lenis (smooth scroll) lives at the app root so it survives page changes.
  useLenis();
  const path = useRoute();

  // Google Analytics — loads once, then records a page view per route change.
  useEffect(() => { initAnalytics(); }, []);
  useEffect(() => { trackPageView(path); }, [path]);

  switch (path) {
    case "/features":
      return <FeaturesPage />;
    case "/about":
      return <AboutPage />;
    case "/privacy":
      return <PrivacyPage />;
    case "/terms":
      return <TermsPage />;
    default:
      return <LandingPage />;
  }
}
