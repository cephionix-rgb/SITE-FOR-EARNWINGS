import { ArrowRight } from "lucide-react";
import { HeroVideo } from "../components/HeroVideo";
import { FlipBoard } from "../components/FlipBoard";
import { Link } from "../lib/router";
import { track } from "../lib/track";
import { siteStats, downloadHref } from "../lib/siteConfig";
import { DownloadBadges } from "../components/DownloadBadges";
import { HERO_CTA, HERO_FREE_LINE, HERO_H1, HERO_H1_BRAND, HERO_INTRO } from "../content/hero";

/**
 * Hero. Copy first, then the film window.
 *
 * Phone (390 wide): headline, one-paragraph intro and the two actions fit in the
 * first screen; the 4:5 film window starts just below and peeks into view, so the
 * product is the next thing the thumb reaches. Desktop: a 5/7 split with the
 * 16:9 window on the right.
 *
 * The window shows the poster now and plays the muted loop once the page is idle
 * (src/components/HeroVideo.tsx). Drop new hero-loop-* files into
 * public/media/hero/ with the same names and nothing here changes.
 *
 * Motion is one entrance: the lines rise in on a short stagger (CSS keyframes,
 * transform + opacity only) and the window settles from a slight zoom. No
 * scroll-linked effects, no filters, so nothing competes with the cloud sky.
 */
const SPEC = [
  { n: String(siteStats.subjects), l: "DGCA subjects" },
  { n: String(siteStats.chapters), l: "chapters" },
  { n: `${siteStats.questions.toLocaleString("en-IN")}+`, l: "practice questions" },
];

function Spec({ className, size }: { className: string; size: string }) {
  return (
    <dl className={`grid grid-cols-3 border-t pt-5 ${className}`} style={{ borderColor: "var(--rule)" }}>
      {SPEC.map((s) => (
        <div key={s.l}>
          <dt className="sr-only">{s.l}</dt>
          <dd className={`font-display font-extrabold leading-none tracking-tight ${size}`} style={{ color: "var(--ink)" }}>{s.n}</dd>
          <dd className="mt-1.5 text-[0.72rem] font-medium leading-tight" style={{ color: "var(--ink-3)" }}>{s.l}</dd>
        </div>
      ))}
    </dl>
  );
}

export function HeroSection() {
  return (
    <section id="top" className="relative w-full overflow-hidden">
      <div
        className="wrap grid grid-cols-1 items-center gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-16"
        style={{ paddingTop: "calc(var(--nav-h) + env(safe-area-inset-top) + clamp(30px, 6vw, 80px))", paddingBottom: "clamp(56px, 8vw, 104px)" }}
      >
        <div>
          {/* The departures board from the old hero: EARN YOUR WINGS flaps in and
              lands (src/components/FlipBoard.tsx), with the boarding line under it. */}
          <div className="mb-6 sm:mb-7">
            <div style={{ fontSize: "clamp(1.3rem, 0.75rem + 2.4vw, 2.05rem)" }}>
              <FlipBoard text="Earn your wings" />
            </div>
            <p aria-hidden className="board-status mt-3">
              <span className="board-dot" />
              Flight EW-001 · Now boarding
            </p>
          </div>

          <h1 className="h-display hero-line" style={{ fontSize: "clamp(2.75rem, 1.7rem + 3.9vw, 4.5rem)" }}>
            {HERO_H1[0]}
            <span>{HERO_H1[1]}</span>
            <br />
            <span style={{ color: "#2456B8" }}>{HERO_H1[2].trim()}</span>
            <span className="sr-only">{HERO_H1_BRAND}</span>
          </h1>

          <p className="lede hero-line mt-5 sm:mt-6" style={{ animationDelay: "90ms", maxWidth: "31em" }}>
            {HERO_INTRO}
          </p>

          <div className="hero-line mt-7 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-6" style={{ animationDelay: "170ms" }}>
            <a
              href={downloadHref()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("hero_cta_click", { cta: "download" })}
              className="btn-gold w-full text-[1rem] sm:w-auto"
              style={{ minHeight: 56, paddingInline: "1.75rem" }}
            >
              {HERO_CTA} <ArrowRight size={19} />
            </a>
            <Link
              to="/guide"
              onClick={() => track("hero_cta_click", { cta: "pilot_guide" })}
              className="link-arrow justify-center text-[0.95rem] sm:justify-start"
            >
              Read the free Pilot Guide <ArrowRight size={17} />
            </Link>
          </div>
          <DownloadBadges where="hero" className="hero-line mt-4 justify-center sm:justify-start" />
          <p className="hero-line small-print mt-3 text-center sm:text-left" style={{ animationDelay: "220ms" }}>
            {HERO_FREE_LINE}
          </p>

          <Spec className="hero-line mt-9 hidden max-w-md lg:grid" size="text-[1.65rem]" />
        </div>

        {/* The film window */}
        <figure className="hero-window relative m-0">
          <div
            className="relative overflow-hidden rounded-[22px] sm:rounded-[28px]"
            style={{
              background: "#0D2450",
              boxShadow: "0 40px 80px -42px rgba(13,36,80,0.75), 0 0 0 1px rgba(11,26,51,0.08)",
            }}
          >
            <HeroVideo label="An EarnWings A320 under tow on the apron, filmed inside the EarnWings app" />
            {/* data strip, set like a flight-deck readout */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 pb-3.5 pt-14 sm:px-6 sm:pb-5"
              style={{ background: "linear-gradient(180deg, rgba(8,20,44,0) 0%, rgba(8,20,44,0.62) 100%)" }}
            >
              <span className="font-mono-data text-[11px] font-semibold uppercase text-white/95 sm:text-[12.5px]">
                VIDP <span className="text-white/50">/</span> Delhi <span className="text-white/50">/</span> A320
              </span>
              <span className="font-mono-data text-[10.5px] font-medium uppercase text-white/80 sm:text-[12px]">Inside EarnWings · 3D Delhi</span>
            </div>
          </div>
        </figure>

        {/* phone/tablet: the numbers sit under the window as one quiet line */}
        <Spec className="-mt-3 lg:hidden" size="text-[1.45rem]" />
      </div>
    </section>
  );
}
