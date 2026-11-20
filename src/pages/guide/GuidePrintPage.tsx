import { useEffect } from "react";
import { GUIDE_HUB, GUIDES, LAST_CHECKED, SCREENS_NOTE, guidePath, type Guide } from "../../content/guides";
import { GOLD, GUIDE_CSS, INK, Inline, MUTED, NAVY, SectionBody } from "../../components/guide/GuideBlocks";

// Print template for the Pilot Guide PDFs (scripts/make-guide-pdfs.mjs).
//   /guide-print?g=<slug>&part=cover   -> the full-bleed cover page only
//   /guide-print?g=<slug>&part=body    -> contents + the guide (printed with header/footer)
//   g=all                              -> the complete guide (every guide in order)
// Not linked anywhere and not in the sitemap. It renders the SAME content module
// and block renderer as the web pages, so a PDF can never disagree with its page.

const COVER_PAGE_CSS = `@page{size:A4;margin:0}`;
const PRINT_CSS = `
html,body{background:#fff!important}
body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.p-root{font-family:Inter,system-ui,sans-serif;color:${INK}}
.p-cover{width:210mm;height:297mm;position:relative;overflow:hidden;background:linear-gradient(160deg,#0D2450 0%,#1B3A7A 48%,#2E6BE5 100%);color:#fff;display:flex;flex-direction:column;padding:22mm 20mm 18mm}
.p-cover-glow{position:absolute;right:-60mm;top:-60mm;width:190mm;height:190mm;border-radius:50%;background:radial-gradient(circle,rgba(245,217,122,.55) 0%,rgba(245,217,122,.12) 40%,transparent 66%)}
.p-cover-route{position:absolute;left:0;right:0;bottom:62mm;height:70mm;opacity:.5}
.p-logo{display:flex;align-items:center;gap:4mm;position:relative}
.p-logo img{width:20mm;height:20mm;border-radius:50%;background:#fff;padding:1.6mm}
.p-word{font-family:Oswald,sans-serif;font-weight:700;font-size:26pt;letter-spacing:.04em;line-height:1}
.p-by{font-size:9pt;color:#F5D97A;margin-top:1mm}
.p-kicker{margin-top:auto;position:relative;font-size:11pt;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#F5D97A}
.p-title{position:relative;font-size:38pt;line-height:1.04;font-weight:900;margin:5mm 0 0;letter-spacing:-.01em}
.p-sub{position:relative;font-size:13.5pt;line-height:1.5;color:#DCE7FF;margin-top:6mm;max-width:150mm}
.p-meta{position:relative;margin-top:12mm;display:flex;gap:8mm;font-size:10.5pt;color:#C7D6F0;border-top:1px solid rgba(255,255,255,.22);padding-top:5mm}
.p-meta b{display:block;color:#fff;font-size:11.5pt;margin-top:1mm}
.p-body{padding:0 4mm}
.p-free{display:inline-block;border:1px solid rgba(201,152,31,.5);background:#FFF8E7;color:#8a6a12;border-radius:99px;padding:1.2mm 4mm;font-size:9.5pt;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.p-toc{page-break-after:always}
.p-toc h2{font-size:22pt;font-weight:900;margin:5mm 0 6mm}
.p-toc ol{list-style:none;margin:0;padding:0}
.p-toc li{border-bottom:1px solid rgba(27,58,122,.12);padding:3mm 0}
.p-toc a{color:${INK};text-decoration:none;font-size:12.5pt;font-weight:700;display:flex;gap:4mm}
.p-toc a span{color:${GOLD};font-family:Oswald,sans-serif;width:9mm}
.p-toc .p-toc-sub{margin:1.5mm 0 0 13mm;font-size:10pt;color:${MUTED};font-weight:500;line-height:1.5}
.p-guide{page-break-before:always}
.p-guide:first-of-type{page-break-before:auto}
.p-guide-h{border-bottom:2px solid ${GOLD};padding-bottom:5mm;margin-bottom:7mm}
.p-guide-h h1{font-size:25pt;line-height:1.1;font-weight:900;margin:2mm 0 3mm}
.p-guide-h p{font-size:11.5pt;line-height:1.6;color:#40506e;margin:0}
.p-guide-h .p-url{font-size:9.5pt;color:${MUTED};margin-top:3mm}
.p-root .g-body{font-size:11pt;line-height:1.6;gap:3mm}
.p-root .g-h2{font-size:15.5pt;margin-bottom:3mm}
.p-root .g-section{break-inside:auto;margin-bottom:7mm}
.p-root .g-h2,.p-root .g-h3{break-after:avoid}
.p-root .g-table-wrap{overflow:visible;border-radius:3mm}
.p-root .g-table{font-size:10pt}
.p-root .g-table tr,.p-root .g-note,.p-root .g-term,.p-root .g-steps>li{break-inside:avoid}
.p-root .g-table thead{display:table-header-group}
.p-root .g-table tr{display:table-row;padding:0}
.p-root .g-table td{display:table-cell;padding:2.4mm 3mm;border-top:1px solid rgba(27,58,122,.08)}
.p-root .g-table td::before{display:none!important}
.p-root .g-terms{grid-template-columns:1fr 1fr;gap:2.5mm}
.p-root .g-term{padding:2.6mm 3mm}
.p-root .g-term dd{font-size:9.8pt}
.p-root .g-step-n{width:6.5mm;height:6.5mm;font-size:9.5pt}
.p-root a{color:${NAVY}}
.p-sources{margin-top:6mm;background:#F4F8FF;border-radius:3mm;padding:5mm;break-inside:avoid}
.p-sources h3{margin:0 0 2mm;font-size:12.5pt}
.p-sources li{font-size:9.8pt;line-height:1.5;margin:1.2mm 0}
.p-sources .p-u{color:${MUTED};word-break:break-all;font-size:8.6pt}
.p-root .fig{background:#F5F9FF}
.p-root .fig:has(.fig-timeline),.p-root .fig:has(.fig-steps){break-inside:auto}
.p-root .fig-tl,.p-root .fig-step{break-inside:avoid}
.p-root .fig-timeline::before{background:#C9981F}
.p-root *{box-shadow:none!important}
.p-root .p-guide-h .p-screens{margin-top:3mm;font-size:10pt;color:#2b3f66;background:#F2F7FF;border:1px solid rgba(46,107,229,.25);border-radius:3mm;padding:2.4mm 3.5mm}
.p-root .g-shot{break-inside:avoid;margin:1mm 0 2mm}
.p-root .g-shot img{border-radius:2.5mm}
.p-root .g-shot-phone{max-width:70mm}
.p-root .g-shot figcaption{font-size:9.6pt;margin-top:1.8mm}
.p-end{margin-top:8mm;font-size:9.5pt;line-height:1.6;color:${MUTED};border-top:1px solid rgba(27,58,122,.12);padding-top:4mm;break-inside:avoid}
`;

function RouteArt() {
  return (
    <svg className="p-cover-route" viewBox="0 0 800 280" preserveAspectRatio="none" aria-hidden>
      <path d="M-20 250 C 180 240, 260 120, 420 110 S 690 60, 820 20" fill="none" stroke="#F5D97A" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" />
      <path d="M-20 270 C 200 262, 300 170, 450 160 S 700 120, 820 90" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.5" />
      <circle cx="420" cy="110" r="7" fill="#F5D97A" />
      <circle cx="420" cy="110" r="16" fill="none" stroke="#F5D97A" strokeOpacity=".5" />
    </svg>
  );
}

function Cover({ title, sub }: { title: string; sub: string }) {
  return (
    <section className="p-cover">
      <div className="p-cover-glow" />
      <RouteArt />
      <div className="p-logo">
        <img src="/assets/logo-mark-96.png" alt="" />
        <div>
          <div className="p-word"><span style={{ color: "#F5D97A" }}>EARN</span>WINGS</div>
          <div className="p-by">Free Pilot Guide</div>
        </div>
      </div>
      <div className="p-kicker">Free guide by EarnWings</div>
      <h1 className="p-title">{title}</h1>
      <p className="p-sub">{sub}</p>
      <div className="p-meta">
        <div>Last checked<b>{LAST_CHECKED}</b></div>
        <div>Read online<b>earnwings.org/guide</b></div>
        <div>Sources<b>DGCA, Pariksha, eGCA, MoCA</b></div>
      </div>
    </section>
  );
}

function GuideSectionPrint({ g, standalone }: { g: Guide; standalone: boolean }) {
  return (
    <article className="p-guide" id={`guide-${g.slug}`}>
      <header className="p-guide-h">
        {standalone ? <span className="p-free">Free guide by EarnWings</span> : <span className="p-free">Pilot Guide</span>}
        <h1>{g.title}</h1>
        <p><Inline text={g.intro} print /></p>
        <p className="p-url">Read online with the latest updates: earnwings.org{guidePath(g.slug)}</p>
        <p className="p-screens"><b>Please note:</b> {SCREENS_NOTE}</p>
      </header>
      {g.sections.map((s, i) => (
        <SectionBody key={s.id} s={s} n={i + 1} print />
      ))}
      <div className="p-sources">
        <h3>Check it yourself: official sources (last checked {LAST_CHECKED})</h3>
        <ul>
          {g.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url}>{s.label}</a>
              {s.note ? ` (${s.note})` : ""}
              <div className="p-u">{s.url}</div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function GuidePrintPage() {
  const q = new URLSearchParams(window.location.search);
  const which = q.get("g") || "all";
  const part = q.get("part") || "body";
  const guides = which === "all" ? GUIDES : GUIDES.filter((g) => g.slug === which);
  const single = which !== "all" ? guides[0] : null;

  useEffect(() => {
    document.documentElement.classList.add("print-mode");
    // Signal to the PDF script that fonts and layout are ready.
    // Wait for fonts AND every screenshot, so no image prints half-loaded.
    const images = Array.from(document.images).map((im) => (im.complete ? Promise.resolve() : im.decode().catch(() => undefined)));
    Promise.all([document.fonts.ready, ...images]).then(() => {
      (window as unknown as { __printReady?: boolean }).__printReady = true;
    });
  }, []);

  if (!guides.length) return <p>Unknown guide.</p>;

  return (
    <div className="p-root">
      <style dangerouslySetInnerHTML={{ __html: GUIDE_CSS + PRINT_CSS + (part === "cover" ? COVER_PAGE_CSS : "") }} />
      {part === "cover" ? (
        <Cover
          title={single ? single.title : "Become a pilot in India"}
          sub={single ? single.summary : "The complete Pilot Guide: the pathway, medicals, eGCA and the Computer Number, DGCA exams on Pariksha, the RTR licence and a beginner glossary."}
        />
      ) : (
        <div className="p-body">
          {single ? (
            <section className="p-toc">
              <span className="p-free">Contents</span>
              <h2>{single.title}</h2>
              <ol>
                {single.sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}><span>{String(i + 1).padStart(2, "0")}</span>{s.title}</a>
                  </li>
                ))}
                <li><a href={`#guide-${single.slug}`}><span>--</span>Official sources</a></li>
              </ol>
              <div className="p-end">
                {GUIDE_HUB.disclaimer} This is a free guide by EarnWings. Read it online, with the latest updates, at earnwings.org/guide/{single.slug}.
              </div>
            </section>
          ) : (
            <section className="p-toc">
              <span className="p-free">Contents</span>
              <h2>The complete Pilot Guide</h2>
              <ol>
                {guides.map((g, i) => (
                  <li key={g.slug}>
                    <a href={`#guide-${g.slug}`}><span>{String(i + 1).padStart(2, "0")}</span>{g.title}</a>
                    <div className="p-toc-sub">{g.summary}</div>
                  </li>
                ))}
              </ol>
              <div className="p-end">
                {GUIDE_HUB.disclaimer} This is a free guide by EarnWings. Read it online, with the latest updates, at earnwings.org/guide.
              </div>
            </section>
          )}
          {guides.map((g) => (
            <GuideSectionPrint key={g.slug} g={g} standalone={!!single} />
          ))}
        </div>
      )}
    </div>
  );
}
