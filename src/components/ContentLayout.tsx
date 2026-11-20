import { useEffect, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { CloudBackground } from "./CloudBackground";
import { Link } from "../lib/router";
import { DownloadBadges, DownloadFreeButton } from "./DownloadBadges";
import { HERO_FREE_LINE } from "../content/hero";

export const INK = "#0D1629";
export const NAVY = "#1B3A7A";
export const BODY = "#41527A";
export const MUTED = "#4A5A78";

/** The white card used across the content pages (same as the glossary cards). */
export const CARD: React.CSSProperties = {
  background: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(27,58,122,0.08)",
  boxShadow: "0 20px 40px -34px rgba(27,58,122,0.5)",
};

type Crumb = { label: string; to?: string };

/**
 * Frame for the text-first content pages (What's new, How we check, the DGCA
 * sample-question pages, the exam report form). It is the glossary / live page
 * layout: solid nav, the cloud sky, a left-aligned header, one content column and
 * the shared footer. Nothing new is styled here; it only reuses the page parts.
 */
export function ContentLayout({
  eyebrow,
  title,
  gold,
  lede,
  crumbs,
  meta,
  children,
  width = "max-w-3xl",
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  gold?: ReactNode;
  lede?: ReactNode;
  crumbs?: Crumb[];
  meta?: ReactNode;
  children: ReactNode;
  width?: string;
}) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <div className="relative min-h-screen">
      <Nav solid />
      <CloudBackground />
      <header className="px-5 pb-8 pt-28 sm:px-6 sm:pt-32">
        <div className={`mx-auto ${width}`}>
          {crumbs ? (
            <nav aria-label="Breadcrumb" className="mb-5 text-[14px] font-semibold" style={{ color: MUTED }}>
              <ol className="flex flex-wrap items-center gap-1.5">
                {crumbs.map((c, i) => (
                  <li key={i} className="inline-flex min-w-0 items-center gap-1.5">
                    {i > 0 && <ChevronRight size={14} aria-hidden className="shrink-0" />}
                    {c.to ? (
                      <Link to={c.to} className="hover:underline" style={{ color: NAVY }}>{c.label}</Link>
                    ) : (
                      <span aria-current="page" style={{ color: INK }}>{c.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          ) : (
            <Link to="/" className="mb-5 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: MUTED }}>
              <ChevronLeft size={16} /> Back to home
            </Link>
          )}
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-3 text-[clamp(2rem,4.6vw,3.2rem)] font-black leading-[1.08] tracking-tight" style={{ color: INK, overflowWrap: "anywhere" }}>
            {title}
            {gold && <span className="text-gradient-gold">{gold}</span>}
          </h1>
          {lede && <p className="mt-4 text-[17px] leading-8" style={{ color: "#40506e" }}>{lede}</p>}
          {meta && <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] font-semibold" style={{ color: MUTED }}>{meta}</div>}
        </div>
      </header>
      <main className={`mx-auto ${width} px-5 pb-20 sm:px-6`}>{children}</main>
      <Footer />
    </div>
  );
}

/** The navy "Download free" band that closes a content page. */
export function DownloadBand({ where, title, body }: { where: string; title: ReactNode; body?: ReactNode }) {
  return (
    <section className="mt-14 overflow-hidden rounded-3xl px-6 py-10 text-center sm:py-12" style={{ background: "linear-gradient(150deg,#0f2450,#0a1836)" }}>
      <h2 className="text-[clamp(1.5rem,3.4vw,2.1rem)] font-black leading-tight text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-[15px] leading-7" style={{ color: "#93A9D6" }}>{body ?? HERO_FREE_LINE}</p>
      <div className="mt-6 flex justify-center">
        <DownloadFreeButton where={where} />
      </div>
      <DownloadBadges where={where} tone="dark" className="mt-4 justify-center" />
    </section>
  );
}
