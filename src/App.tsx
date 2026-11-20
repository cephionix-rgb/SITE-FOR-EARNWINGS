import { lazy, Suspense, useEffect } from "react";
import { useLenis } from "./lib/scroll";
import { useRoute } from "./lib/router";
import { initAnalytics, trackPageView } from "./lib/analytics";
import { LandingPage } from "./pages/LandingPage";
import { GUIDE_SLUGS as SLUG_LIST, GUIDE_TOP_LEVEL, guideHref } from "./content/guideSlugs";

const GUIDE_SLUGS = new Set(SLUG_LIST);

// Sub-pages are code-split (4.2e): each loads only when its route is visited, so
// none of them sit in the initial landing-page bundle. LandingPage stays eager
// (it is the default route and the one almost everyone lands on).
const FeaturesPage = lazy(() => import("./pages/FeaturesPage").then((m) => ({ default: m.FeaturesPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const WhyEarnwingsPage = lazy(() => import("./pages/WhyEarnwingsPage").then((m) => ({ default: m.WhyEarnwingsPage })));
const GroundClassesPage = lazy(() => import("./pages/GroundClassesPage").then((m) => ({ default: m.GroundClassesPage })));
const FaqPage = lazy(() => import("./pages/FaqPage").then((m) => ({ default: m.FaqPage })));
const GlossaryPage = lazy(() => import("./pages/GlossaryPage").then((m) => ({ default: m.GlossaryPage })));
const ResearchPage = lazy(() => import("./pages/ResearchPage").then((m) => ({ default: m.ResearchPage })));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage").then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./pages/TermsPage").then((m) => ({ default: m.TermsPage })));
// Refund and cancellation policy (Razorpay asks for a public one).
const RefundsPage = lazy(() => import("./pages/RefundsPage").then((m) => ({ default: m.RefundsPage })));
const CopyrightPage = lazy(() => import("./pages/CopyrightPage").then((m) => ({ default: m.CopyrightPage })));
// Account deletion (the URL Google Play's Data safety form asks for) and support.
const DeleteAccountPage = lazy(() => import("./pages/DeleteAccountPage").then((m) => ({ default: m.DeleteAccountPage })));
const SupportPage = lazy(() => import("./pages/SupportPage").then((m) => ({ default: m.SupportPage })));
// The account + purchase page. Code-split like the rest: it pulls in the API client
// and is irrelevant to a first-time visitor reading the landing page.
// Pilot Guide (/guide and /guide/<slug>) and the live-airports page.
const GuideHubPage = lazy(() => import("./pages/guide/GuideHubPage").then((m) => ({ default: m.GuideHubPage })));
const GuidePage = lazy(() => import("./pages/guide/GuidePage").then((m) => ({ default: m.GuidePage })));
const GuidePrintPage = lazy(() => import("./pages/guide/GuidePrintPage").then((m) => ({ default: m.GuidePrintPage })));
const LivePage = lazy(() => import("./pages/LivePage").then((m) => ({ default: m.LivePage })));
const AccountPage = lazy(() => import("./pages/AccountPage").then((m) => ({ default: m.AccountPage })));
// Trust pages, the exam-report form and the public DGCA sample-question pages.
const WhatsNewPage = lazy(() => import("./pages/WhatsNewPage").then((m) => ({ default: m.WhatsNewPage })));
const HowWeCheckPage = lazy(() => import("./pages/HowWeCheckPage").then((m) => ({ default: m.HowWeCheckPage })));
const ReportExamPage = lazy(() => import("./pages/ReportExamPage").then((m) => ({ default: m.ReportExamPage })));
const DgcaPage = lazy(() => import("./pages/DgcaPage").then((m) => ({ default: m.DgcaPage })));

export default function App() {
  // Lenis (smooth scroll) lives at the app root so it survives page changes.
  useLenis();
  const path = useRoute();

  // Google Analytics — loads once, then records a page view per route change.
  useEffect(() => { initAnalytics(); }, []);
  useEffect(() => { trackPageView(path); }, [path]);

  // Guide sub-pages are nested under /guide. Short top-level spellings (/egca …)
  // are aliases, so a link typed from memory still lands on the right guide.
  // A guide with a search-friendly top-level URL (GUIDE_TOP_LEVEL) is served there
  // directly; /guide/<slug> for it still works and its canonical points at it.
  const topLevel = GUIDE_TOP_LEVEL[path.replace(/\/+$/, "")];
  const guideSlug = topLevel ?? (path.startsWith("/guide/") ? path.slice(7) : GUIDE_SLUGS.has(path.slice(1)) ? path.slice(1) : null);
  useEffect(() => {
    if (guideSlug && !topLevel && !path.startsWith("/guide/")) {
      window.history.replaceState({}, "", `${guideHref(guideSlug)}${window.location.hash}`);
    }
  }, [guideSlug, path, topLevel]);

  let page;
  if (guideSlug && GUIDE_SLUGS.has(guideSlug)) return <Suspense fallback={null}><GuidePage slug={guideSlug} /></Suspense>;
  if (path === "/dgca" || path.startsWith("/dgca/")) return <Suspense fallback={null}><DgcaPage path={path} /></Suspense>;
  switch (path) {
    case "/guide": page = <GuideHubPage />; break;
    case "/guide-print": page = <GuidePrintPage />; break;
    case "/live": page = <LivePage />; break;
    case "/features": page = <FeaturesPage />; break;
    case "/about": page = <AboutPage />; break;
    case "/why-earnwings": page = <WhyEarnwingsPage />; break;
    case "/dgca-ground-classes": page = <GroundClassesPage />; break;
    case "/faq": page = <FaqPage />; break;
    case "/aviation-glossary": page = <GlossaryPage />; break;
    case "/research": page = <ResearchPage />; break;
    case "/privacy": page = <PrivacyPage />; break;
    case "/terms": page = <TermsPage />; break;
    case "/refunds": page = <RefundsPage />; break;
    case "/copyright": page = <CopyrightPage />; break;
    case "/delete-account": page = <DeleteAccountPage />; break;
    case "/support": page = <SupportPage />; break;
    case "/whats-new": page = <WhatsNewPage />; break;
    case "/how-we-check": page = <HowWeCheckPage />; break;
    case "/report-exam-questions": page = <ReportExamPage />; break;
    // Both spellings: the app links to /account, humans type /login.
    case "/account":
    case "/login": page = <AccountPage />; break;
    default: page = <LandingPage />;
  }
  return <Suspense fallback={null}>{page}</Suspense>;
}
