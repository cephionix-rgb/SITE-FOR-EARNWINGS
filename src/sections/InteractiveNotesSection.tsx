import { MousePointerClick, SlidersHorizontal, Ruler, ArrowRight } from "lucide-react";
import { SectionHead } from "../components/SectionHead";
import { Link } from "../lib/router";
import { useReveal } from "../lib/reveal";
import { INTERACTIVE, INTERACTIVE_REACH } from "../lib/interactive";

/**
 * Interactive notes: the app's live explainers (altimeter, ILS, SSR, pitot-static…).
 *
 * The preview is a real capture of the app's altimeter explainer, looped as an animated
 * WebP (public/screens/app/interactive-altimeter.webp), with a still poster for reduced
 * motion. The chapter count comes from the app's own registry at build time
 * (scripts/sync-interactive.mjs), so the copy never claims "every chapter" early.
 */
const EXAMPLES = ["The pressure altimeter", "The ILS: localizer and glide slope", "SSR and the transponder", "Pitot-static blockages", "The airspeed indicator", "DC circuits"];

const POINTS = [
  { icon: SlidersHorizontal, title: "Move it, watch it react", body: "Drag the subscale, fly into lower pressure, block the pitot: the needles and the physics answer straight away." },
  { icon: Ruler, title: "Drawn to scale, by code", body: "Every figure is drawn from computed values, never a picture. Instruments read exactly what the numbers say." },
  { icon: MousePointerClick, title: "Inside the chapter", body: "Open the Interactive mode beside the notes, the flowchart and the question bank. Captain Aezon can open the same figures in his answers." },
];

export function InteractiveNotesSection() {
  const art = useReveal<HTMLDivElement>();
  const list = useReveal<HTMLUListElement>();
  return (
    <section id="interactive-notes" className="band overflow-hidden">
      <div className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <SectionHead
            title={<>Interactive notes. <span style={{ color: "#6B7896" }}>Turn the knob, see the physics.</span></>}
            lede={`${INTERACTIVE.explainerCount} live explainers across ${INTERACTIVE_REACH} of the DGCA syllabus, from the altimeter to the ILS.`}
          />
          <ul ref={list} className="reveal mt-8 border-t" style={{ borderColor: "var(--rule)" }}>
            {POINTS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="grid grid-cols-[28px_1fr] gap-x-4 border-b py-5" style={{ borderColor: "var(--rule)" }}>
                <Icon size={20} strokeWidth={2} className="mt-0.5" style={{ color: "var(--gold-ink)" }} aria-hidden />
                <div>
                  <p className="h-sub" style={{ fontSize: "1.08rem" }}>{title}</p>
                  <p className="mt-1 text-[0.92rem] leading-relaxed" style={{ color: "var(--ink-2)" }}>{body}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/features#interactive" className="link-arrow mt-6 text-[0.95rem]">
            See the interactive notes <ArrowRight size={17} />
          </Link>
        </div>

        <div ref={art} className="reveal min-w-0">
          <figure className="m-0">
            <div className="overflow-hidden rounded-[22px] bg-white" style={{ boxShadow: "0 40px 80px -46px rgba(13,36,80,0.55), 0 0 0 1px rgba(11,26,51,0.08)" }}>
              <picture>
                <source media="(prefers-reduced-motion: reduce)" srcSet="/screens/app/interactive-altimeter-still.webp" />
                <img
                  src="/screens/app/interactive-altimeter.webp"
                  alt="The pressure altimeter interactive note in the EarnWings app: as the pressure changes, the aneroid capsules expand and the needles turn"
                  width={800}
                  height={686}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </picture>
            </div>
            <figcaption className="mt-4 text-[0.85rem] leading-relaxed" style={{ color: "var(--ink-2)" }}>
              A real capture from the app: the altimeter explainer, in Instruments chapter 5.
            </figcaption>
          </figure>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Some of the interactive notes">
            {EXAMPLES.map((t) => (
              <li key={t} className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold" style={{ background: "rgba(46,107,229,0.08)", color: "var(--navy)" }}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
