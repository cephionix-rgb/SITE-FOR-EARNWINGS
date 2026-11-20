import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CalendarCheck, ChevronRight, Download, ExternalLink, ListTree } from "lucide-react";
import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import { CloudBackground } from "../../components/CloudBackground";
import { Link, navigate } from "../../lib/router";
import { GUIDE_HUB, GUIDES, LAST_CHECKED, SCREENS_NOTE, guidePath, type Guide } from "../../content/guides";
import { BODY, GOLD, GUIDE_CSS, INK, Inline, MUTED, NAVY, SectionBody } from "../../components/guide/GuideBlocks";
import { track } from "../../lib/track";
import { RouteMap } from "../../components/guide/RouteMap";

/** Rough reading time from the guide's text. */
function minutes(g: Guide): number {
  const words = JSON.stringify(g.sections).split(/\s+/).length;
  return Math.max(2, Math.round(words / 220));
}

/** Scroll-spy: the last section whose heading has passed under the nav.
 *  Measured on scroll (one rAF per frame at most), so it is right at the top of
 *  the page too, which an IntersectionObserver alone gets wrong. */
function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      let cur = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) cur = id;
      }
      setActive(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ids]);
  return active;
}

export function PdfButton({ href, label = "Download as PDF", where }: { href: string; label?: string; where: string }) {
  return (
    <a
      href={href}
      download
      onClick={() => track("guide_pdf_download", { where })}
      className="btn-gold text-[15px]"
      style={{ padding: "0.7rem 1.25rem" }}
    >
      <Download size={17} /> {label}
    </a>
  );
}

/** Breadcrumbs: Pilot Guide > <guide>. Visible, and mirrored in JSON-LD by gen-routes. */
function Crumbs({ guide }: { guide: Guide }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-[14px] font-semibold" style={{ color: MUTED }}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <li><Link to="/" className="hover:underline">Home</Link></li>
        <li aria-hidden><ChevronRight size={14} /></li>
        <li><Link to={GUIDE_HUB.path} className="hover:underline" style={{ color: NAVY }}>{GUIDE_HUB.navLabel}</Link></li>
        <li aria-hidden><ChevronRight size={14} /></li>
        <li aria-current="page" style={{ color: INK }}>{guide.navLabel}</li>
      </ol>
    </nav>
  );
}

/** Desktop side navigation: the guides, then this guide's contents. */
function SideNav({ guide, active }: { guide: Guide; active: string }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 flex flex-col gap-6">
        <div className="rounded-2xl border bg-white/90 p-3" style={{ borderColor: "rgba(27,58,122,0.12)" }}>
          <p className="px-2 pb-2 pt-1 text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ color: GOLD }}>
            In this guide
          </p>
          <ul className="flex flex-col gap-0.5">
            <li>
              <Link to={GUIDE_HUB.path} className="block rounded-xl px-3 py-2 text-[14.5px] font-semibold hover:bg-[#EEF4FF]" style={{ color: BODY }}>
                Overview
              </Link>
            </li>
            {GUIDES.map((g) => {
              const on = g.slug === guide.slug;
              return (
                <li key={g.slug}>
                  <Link
                    to={guidePath(g.slug)}
                    aria-current={on ? "page" : undefined}
                    className="block rounded-xl px-3 py-2 text-[14.5px] font-semibold transition-colors hover:bg-[#EEF4FF]"
                    style={on ? { background: NAVY, color: "#fff" } : { color: BODY }}
                  >
                    {g.navLabel}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="px-1">
          <p className="pb-2 text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ color: GOLD }}>
            On this page
          </p>
          <ul className="flex flex-col gap-0.5 border-l" style={{ borderColor: "rgba(27,58,122,0.14)" }}>
            {guide.sections.map((s) => {
              const on = s.id === active;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px block border-l-2 py-1.5 pl-3 text-[13.5px] leading-snug transition-colors"
                    style={{ borderColor: on ? GOLD : "transparent", color: on ? INK : MUTED, fontWeight: on ? 750 : 550 }}
                  >
                    {s.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}

/** Phone / tablet: a compact guide selector and a collapsible table of contents. */
function CompactNav({ guide }: { guide: Guide }) {
  return (
    <div className="mb-6 flex flex-col gap-3 lg:hidden">
      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ color: GOLD }}>In this guide</span>
        <select
          value={guide.slug}
          onChange={(e) => navigate(e.target.value === "" ? GUIDE_HUB.path : guidePath(e.target.value))}
          className="w-full appearance-none rounded-xl border bg-white px-4 py-3 text-[16px] font-semibold"
          style={{ borderColor: "rgba(27,58,122,0.18)", color: NAVY, backgroundImage: "linear-gradient(45deg,transparent 50%,#1B3A7A 50%),linear-gradient(135deg,#1B3A7A 50%,transparent 50%)", backgroundPosition: "calc(100% - 20px) 55%,calc(100% - 14px) 55%", backgroundSize: "6px 6px", backgroundRepeat: "no-repeat" }}
        >
          <option value="">Overview</option>
          {GUIDES.map((g) => (
            <option key={g.slug} value={g.slug}>{g.navLabel}</option>
          ))}
        </select>
      </label>
      <details className="rounded-xl border bg-white/90" style={{ borderColor: "rgba(27,58,122,0.14)" }}>
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-[15px] font-bold" style={{ color: NAVY }}>
          <ListTree size={17} /> On this page
          <span className="ml-auto text-[13px] font-semibold" style={{ color: MUTED }}>{guide.sections.length} sections</span>
        </summary>
        <ol className="flex flex-col gap-1 px-4 pb-4">
          {guide.sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="flex gap-2 py-1 text-[15px]" style={{ color: BODY }}>
                <span className="font-bold" style={{ color: GOLD }}>{String(i + 1).padStart(2, "0")}</span> {s.title}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}

function PrevNext({ guide }: { guide: Guide }) {
  const i = GUIDES.findIndex((g) => g.slug === guide.slug);
  const prev = i > 0 ? GUIDES[i - 1] : null;
  const next = i < GUIDES.length - 1 ? GUIDES[i + 1] : null;
  const card = "group flex flex-1 flex-col gap-1 rounded-2xl border bg-white p-4 transition-shadow hover:shadow-lg";
  return (
    <nav aria-label="More guides" className="mt-10 flex flex-col gap-3 sm:flex-row">
      {prev ? (
        <Link to={guidePath(prev.slug)} className={card} style={{ borderColor: "rgba(27,58,122,0.12)" }}>
          <span className="flex items-center gap-1 text-[12px] font-extrabold uppercase tracking-[0.14em]" style={{ color: MUTED }}>
            <ArrowLeft size={14} /> Previous
          </span>
          <span className="text-[16px] font-bold" style={{ color: NAVY }}>{prev.title}</span>
        </Link>
      ) : (
        <Link to={GUIDE_HUB.path} className={card} style={{ borderColor: "rgba(27,58,122,0.12)" }}>
          <span className="flex items-center gap-1 text-[12px] font-extrabold uppercase tracking-[0.14em]" style={{ color: MUTED }}>
            <ArrowLeft size={14} /> Back to
          </span>
          <span className="text-[16px] font-bold" style={{ color: NAVY }}>Pilot Guide overview</span>
        </Link>
      )}
      {next && (
        <Link to={guidePath(next.slug)} className={`${card} sm:items-end sm:text-right`} style={{ borderColor: "rgba(27,58,122,0.12)" }}>
          <span className="flex items-center gap-1 text-[12px] font-extrabold uppercase tracking-[0.14em]" style={{ color: MUTED }}>
            Next <ArrowRight size={14} />
          </span>
          <span className="text-[16px] font-bold" style={{ color: NAVY }}>{next.title}</span>
        </Link>
      )}
    </nav>
  );
}

export function GuidePage({ slug }: { slug: string }) {
  const guide = GUIDES.find((g) => g.slug === slug) ?? GUIDES[0];
  const ids = useMemo(() => guide.sections.map((s) => s.id), [guide]);
  const active = useActiveSection(ids);

  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0 });
  }, [slug]);

  return (
    <div className="relative min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: GUIDE_CSS }} />
      <Nav solid />
      <CloudBackground />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[250px_minmax(0,1fr)]">
          <SideNav guide={guide} active={active} />

          <main className="min-w-0">
            <header className="mb-8 max-w-3xl">
              <Crumbs guide={guide} />
              <span className="eyebrow"><BookOpen size={14} /> Pilot Guide</span>
              <h1 className="mt-3 text-[clamp(2rem,4.6vw,3.2rem)] font-black leading-[1.08] tracking-tight" style={{ color: INK }}>
                {guide.h1[0]}
                <span className="text-gradient-gold">{guide.h1[1]}</span>
              </h1>
              <p className="mt-4 text-[17.5px] leading-8" style={{ color: "#40506e" }}>
                <Inline text={guide.intro} />
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <PdfButton href={guide.pdf} where={guide.slug} />
                <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: MUTED }}>
                  <CalendarCheck size={16} /> Updated {LAST_CHECKED}
                </span>
                <span className="text-[14px] font-semibold" style={{ color: MUTED }}>{minutes(guide)} min read</span>
              </div>
              {/* Sources line: what this guide was checked against, up front, not only at the end. */}
              <p className="mt-3 text-[14px] leading-6" style={{ color: MUTED }}>
                <strong style={{ color: INK }}>Sources:</strong>{" "}
                {guide.sources.slice(0, 2).map((x) => x.label.replace(/\s*\([^)]*\)/g, "")).join("; ")}
                {guide.sources.length > 2 && <> and {guide.sources.length - 2} more official sources</>}.{" "}
                <a href="#sources" className="font-semibold underline" style={{ color: NAVY }}>See the list</a>
                {" · "}
                <Link to="/how-we-check" className="font-semibold underline" style={{ color: NAVY }}>How we check</Link>
              </p>
            </header>

            {/* The pathway guide opens with its route map (Zero to CPL). */}
            {guide.slug === "pilot-pathway" && <RouteMap />}

            <CompactNav guide={guide} />

            <article
              className="flex max-w-3xl flex-col gap-10 rounded-[28px] border bg-white/[0.93] p-5 shadow-[0_30px_60px_-40px_rgba(27,58,122,0.45)] sm:p-9"
              style={{ borderColor: "rgba(27,58,122,0.1)" }}
            >
              <aside className="g-note" style={{ background: "#F2F7FF", borderColor: "rgba(46,107,229,0.25)" }}>
                <p className="g-p text-[15px]" style={{ color: BODY }}><strong style={{ color: INK }}>Please note:</strong> {SCREENS_NOTE}</p>
              </aside>
              {guide.sections.map((s, i) => (
                <SectionBody key={s.id} s={s} n={i + 1} />
              ))}

              <section aria-labelledby="sources" className="rounded-2xl p-5 sm:p-6" style={{ background: "#F4F8FF" }}>
                <h2 id="sources" className="text-[18px] font-extrabold" style={{ color: INK }}>Check it yourself: official sources</h2>
                <p className="mt-1 text-[14.5px]" style={{ color: MUTED }}>Last checked {LAST_CHECKED}. If anything differs, the official page is right.</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {guide.sources.map((s) => (
                    <li key={s.url} className="text-[15px] leading-snug">
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 font-semibold hover:underline" style={{ color: NAVY }}>
                        <ExternalLink size={14} className="mt-[3px] shrink-0" /> {s.label}
                      </a>
                      {s.note && <span className="block pl-5 text-[13.5px]" style={{ color: MUTED }}>{s.note}</span>}
                    </li>
                  ))}
                </ul>
              </section>

              <p className="text-[13.5px] leading-6" style={{ color: MUTED }}>{GUIDE_HUB.disclaimer}</p>
            </article>

            <div className="max-w-3xl">
              <PrevNext guide={guide} />
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
