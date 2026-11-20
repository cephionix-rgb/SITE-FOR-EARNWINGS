import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "../components/DeviceFrame";
import { SectionHead } from "../components/SectionHead";
import { useReveal } from "../lib/reveal";

/**
 * "Inside the app": real light-theme screens captured from the live app as the
 * demo student (no mock-ups, no generated imagery).
 *
 * Phone: a tab strip over a swipeable row of large phones; swiping moves the
 * tab underline and tapping a tab scrolls to its screen. Desktop: the list on
 * the left works as an accordion that swaps the one large phone on the right.
 */
const SCREENS = [
  { key: "learn", title: "Learning Hub", tab: "Notes", body: "Notes, flowcharts, question banks and summaries for every DGCA subject, with your progress through the syllabus." },
  { key: "exams", title: "DGCA exam papers", tab: "Mock papers", body: "Timed papers in the DGCA pattern for every subject, from Meteorology to Technical General." },
  { key: "rt-academy", title: "RT Academy", tab: "RT", body: "Radio telephony lesson by lesson, from the phonetic alphabet to full calls, with a trainer that marks your read-back." },
  { key: "metar", title: "METAR and TAF", tab: "Weather", body: "Live reports for any ICAO code, decoded into plain English, plus a decode challenge to practise against." },
  { key: "navcalc", title: "NavCalc", tab: "NavCalc", body: "35 navigation calculators that show the figures and the working, so you learn the method, not just the answer." },
  { key: "practice", title: "Practice", tab: "Practice", body: "The RT trainer, the METAR challenge and mock tests in one place, ready between flying slots." },
];

const src = (k: string) => `/screens/app/${k}.webp`;

export function ProductTour() {
  const [active, setActive] = useState(0);
  const rowRef = useRef<HTMLOListElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const deskRef = useReveal<HTMLDivElement>();
  const phoneRef = useReveal<HTMLDivElement>();

  // Phone carousel: follow the swipe.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const a = row.children[0] as HTMLElement | undefined;
        const b = row.children[1] as HTMLElement | undefined;
        if (!a || !b) return;
        const step = b.offsetLeft - a.offsetLeft;
        setActive(Math.max(0, Math.min(SCREENS.length - 1, Math.round(row.scrollLeft / step))));
      });
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      row.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Keep the active tab in view inside its own scroller (never scrolls the page).
  useEffect(() => {
    const bar = tabsRef.current;
    const tab = bar?.children[active] as HTMLElement | undefined;
    if (!bar || !tab || bar.scrollWidth <= bar.clientWidth) return;
    bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  const goTo = (i: number) => {
    const row = rowRef.current;
    const a = row?.children[0] as HTMLElement | undefined;
    const b = row?.children[1] as HTMLElement | undefined;
    if (!row || !a || !b) return;
    row.scrollTo({ left: i * (b.offsetLeft - a.offsetLeft), behavior: "smooth" });
    setActive(i);
  };

  const cur = SCREENS[active];

  return (
    <section id="inside" className="band">
      <div className="wrap">
        <SectionHead
          title={<>Every DGCA subject. <span style={{ color: "#6B7896" }}>One study app.</span></>}
          lede="Read the notes, work the flowcharts, drill the question bank, then sit a timed paper. These are real screens from the app."
        />

        {/* ---------- desktop ---------- */}
        <div ref={deskRef} className="reveal mt-14 hidden grid-cols-[minmax(0,1fr)_auto] items-center gap-20 lg:grid">
          <div className="border-t" style={{ borderColor: "var(--rule)" }} role="tablist" aria-orientation="vertical" aria-label="App screens">
            {SCREENS.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="grid w-full grid-cols-[1fr_auto] items-baseline gap-6 border-b py-5 text-left"
                  style={{ borderColor: "var(--rule)" }}
                >
                  <span>
                    <span className="h-sub block transition-colors duration-300" style={{ color: on ? "var(--ink)" : "#7B87A3", fontSize: "1.3rem" }}>{s.title}</span>
                    <span
                      className="block overflow-hidden text-[0.95rem] leading-relaxed transition-[max-height,opacity,margin] duration-500"
                      style={{ color: "var(--ink-2)", maxHeight: on ? 90 : 0, opacity: on ? 1 : 0, marginTop: on ? 8 : 0, transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                    >
                      {s.body}
                    </span>
                  </span>
                  <span aria-hidden className="font-mono-data text-[12px] font-semibold transition-colors" style={{ color: on ? "var(--gold-ink)" : "#A3ADC4" }}>
                    {String(i + 1).padStart(2, "0")}/{String(SCREENS.length).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
          <PhoneFrame key={cur.key} width={310} className="tour-swap relative" src={src(cur.key)} alt={`EarnWings app: ${cur.title}`} />
        </div>

        {/* ---------- phone ---------- */}
        <div ref={phoneRef} className="reveal mt-9 lg:hidden">
          <div ref={tabsRef} className="scroll-row -mx-5 flex gap-6 overflow-x-auto border-b px-5" style={{ borderColor: "var(--rule)" }} role="tablist" aria-label="App screens">
            {SCREENS.map((s, i) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => goTo(i)}
                className="relative shrink-0 whitespace-nowrap pb-2.5 text-[15px] font-semibold transition-colors"
                style={{ color: i === active ? "var(--ink)" : "#6B7896", minHeight: 44 }}
              >
                {s.tab}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-px h-[2px] origin-left transition-transform duration-300"
                  style={{ background: "var(--ink)", transform: `scaleX(${i === active ? 1 : 0})` }}
                />
              </button>
            ))}
          </div>

          <ol ref={rowRef} className="scroll-row -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2" style={{ scrollPaddingInline: "1.25rem" }}>
            {SCREENS.map((s) => (
              <li key={s.key} className="w-[min(80vw,330px)] shrink-0 snap-start">
                <PhoneFrame width={236} src={src(s.key)} alt={`EarnWings app: ${s.title}`} />
                <p className="h-sub mt-6">{s.title}</p>
                <p className="mt-1.5 max-w-[30ch] text-[0.9rem] leading-relaxed" style={{ color: "var(--ink-2)" }}>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
