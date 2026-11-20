import { useEffect } from "react";
import { ArrowRight, BookA, BookOpen, CalendarCheck, ClipboardList, GraduationCap, HeartPulse, Radio, Route } from "lucide-react";
import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import { CloudBackground } from "../../components/CloudBackground";
import { Link } from "../../lib/router";
import { GUIDE_HUB, GUIDES, LAST_CHECKED, guidePath } from "../../content/guides";
import { GOLD, INK, MUTED, NAVY } from "../../components/guide/GuideBlocks";
import { PdfButton } from "./GuidePage";

const ICONS: Record<string, typeof Route> = {
  "pilot-pathway": Route,
  medical: HeartPulse,
  egca: ClipboardList,
  pariksha: GraduationCap,
  rtr: Radio,
  glossary: BookA,
};

export function GuideHubPage() {
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="relative min-h-screen">
      <Nav solid />
      <CloudBackground />

      <header className="px-5 pb-6 pt-28 sm:px-6 sm:pt-36">
        <div className="mx-auto max-w-4xl text-center">
          <span className="eyebrow"><BookOpen size={14} /> Free Pilot Guide</span>
          <h1 className="mt-3 text-[clamp(2.2rem,5.4vw,3.8rem)] font-black leading-[1.05] tracking-tight" style={{ color: INK }}>
            {GUIDE_HUB.h1[0]}
            <span className="text-gradient-gold">{GUIDE_HUB.h1[1]}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[18px] leading-8" style={{ color: "#40506e" }}>
            {GUIDE_HUB.intro}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-5">
            <PdfButton href={GUIDE_HUB.pdf} label="Download the complete Pilot Guide (PDF)" where="hub" />
            <Link to={guidePath(GUIDES[0].slug)} className="btn-ghost text-[15px]" style={{ padding: "0.7rem 1.25rem" }}>
              Start reading <ArrowRight size={17} />
            </Link>
          </div>
          <p className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: MUTED }}>
            <CalendarCheck size={16} /> Updated {LAST_CHECKED}: every guide checked against official DGCA, eGCA and government sources
          </p>
          <p className="mt-1 text-[14px]" style={{ color: MUTED }}>
            Each guide lists its sources at the end.{" "}
            <Link to="/how-we-check" className="font-semibold underline" style={{ color: "#1B3A7A" }}>How we check content</Link>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-6">
        <ol className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g, i) => {
            const Icon = ICONS[g.slug] ?? BookOpen;
            return (
              <li key={g.slug}>
                <Link
                  to={guidePath(g.slug)}
                  className="group flex h-full flex-col rounded-3xl border bg-white/[0.94] p-6 shadow-[0_24px_50px_-36px_rgba(27,58,122,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-30px_rgba(27,58,122,0.5)]"
                  style={{ borderColor: "rgba(27,58,122,0.1)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: "#EEF4FF", color: NAVY }}>
                      <Icon size={21} />
                    </span>
                    <span className="font-[Oswald] text-[15px] font-semibold tracking-[0.06em]" style={{ color: GOLD }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="mt-5 text-[20px] font-extrabold leading-snug" style={{ color: INK }}>{g.title}</h2>
                  <p className="mt-2 flex-1 text-[15.5px] leading-7" style={{ color: "#40506e" }}>{g.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-bold" style={{ color: NAVY }}>
                    Read the guide <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border bg-white/[0.9] p-6 text-[14.5px] leading-7 sm:p-8" style={{ borderColor: "rgba(27,58,122,0.1)", color: MUTED }}>
          <h2 className="text-[17px] font-extrabold" style={{ color: INK }}>How we wrote this</h2>
          <p className="mt-2">
            Every fee, form field and rule in these guides comes from an official page (DGCA, the Pariksha and eGCA portals, the
            Ministry of Civil Aviation or the Gazette), and each guide links those pages so you can check them. Where an official
            page could not be checked, the guide says so instead of guessing. Costs that no regulator sets are shown as indicative
            ranges.
          </p>
          <p className="mt-3">{GUIDE_HUB.disclaimer}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
