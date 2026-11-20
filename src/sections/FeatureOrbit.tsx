import { useEffect, useMemo, useRef, useState } from "react";
import {
  House, Library, Images, GitBranch, ListChecks, GraduationCap, Bot, Radio, Headphones,
  Gauge, Siren, PlaneLanding, CalendarCheck, Radar, CloudSun, Megaphone, Gamepad2,
  Calculator, LayoutGrid, Trophy, ChartNoAxesColumn, ArrowRight, MousePointerClick, PlaneTakeoff, type LucideIcon,
} from "lucide-react";
import { prefersReducedMotion } from "../lib/scroll";
import { PhoneFrame } from "../components/DeviceFrame";
import { SectionHead } from "../components/SectionHead";
import { Link } from "../lib/router";
import { useReveal } from "../lib/reveal";
import { AezonPortrait } from "../components/AezonPortrait";
import { INTERACTIVE, INTERACTIVE_REACH } from "../lib/interactive";

/**
 * "What's inside": the phone with the app's features revolving around it on
 * gold rings (the owner's favourite from the old site, rebuilt for the new one).
 *
 * - 23 features, every one live in the app today and checked there (Nov 2026).
 *   Not here on purpose: flight planning and Community / Compete (switched off
 *   in /meta/features) and video lectures (coming soon). My Library and the
 *   document vault are live but left out: on the demo account both are empty
 *   screens, and an empty screen shows nothing.
 * - Every screen is a real light-theme capture of the app as the demo student
 *   (public/screens/orbit/*.webp, 560 px wide, 27-75 KB each). Images load only
 *   when the section nears the viewport, and only the one on the phone.
 * - Desktop: two concentric tilted rings. The inner ring holds the core study,
 *   radio and flight-deck features; the outer ring, turning the other way, holds
 *   the weather, planning and progress tools. Icons on the far side pass behind
 *   the phone and come back round.
 * - Phone: one upright ring of the core 12 (it never passes behind the phone),
 *   plus the other 9 as tappable labelled chips under it. Same data, same state.
 * - Motion: the rings turn slowly and the phone steps to the next feature every
 *   few seconds. Both stop ONLY while a mouse pointer is on a ring path or on an
 *   icon (or its label); anywhere else in the section, including over the phone,
 *   they keep going. A tap or click selects a feature and holds it for 12 s.
 *   Touch has no hover, so on phones it simply keeps turning, tap to select.
 * - Performance: one requestAnimationFrame loop writes translate3d() on the
 *   ring buttons, only while the section is on screen and the tab is visible.
 *   No filters, no React re-renders per frame.
 * - Reduced motion: the rings stand still, nothing auto-advances, taps work.
 */

/** `avatar`: show Captain Aezon's portrait instead of an icon. */
type Feature = { key: string; label: string; icon: LucideIcon; body: string; note?: string; ring: 0 | 1; avatar?: boolean };

const FEATURES: Feature[] = [
  // ring 0: the core (inner ring on desktop, the ring on phones)
  { ring: 0, key: "home", label: "Home dashboard", icon: House, body: "Your rank, XP and streak, the question of the day and the weather at your home aerodrome, on one screen." },
  { ring: 0, key: "learn", label: "Learning Hub", icon: Library, body: "Every DGCA subject and chapter in one place, with your progress through the whole syllabus." },
  { ring: 0, key: "visual", label: "Visual notes", icon: Images, body: "Illustrated figures for each chapter, so a concept is a picture you remember, not a paragraph." },
  { ring: 0, key: "interactive", label: "Interactive notes", icon: MousePointerClick, body: `${INTERACTIVE.explainerCount} live explainers across ${INTERACTIVE_REACH}: turn the altimeter's subscale or fly the ILS and watch the physics respond.` },
  { ring: 0, key: "flowchart", label: "Flowcharts", icon: GitBranch, body: "A flowchart that maps each chapter, with the key figures and the logic in order." },
  { ring: 0, key: "practice", label: "Question practice", icon: ListChecks, body: "Every question in the subject, in easy, preparatory and test sets, with a PDF report of each result." },
  { ring: 0, key: "exams", label: "DGCA mock exams", icon: GraduationCap, body: "Timed papers in the DGCA pattern for every subject, from Meteorology to Technical General." },
  { ring: 0, key: "captain", label: "Captain Aezon", icon: Bot, avatar: true, body: "Ask Aezon any aviation doubt, from decoding a METAR to an engine-failure checklist. Ask how an instrument works and the live figure opens in his answer." },
  { ring: 0, key: "rt", label: "RT practice in 3D", icon: Radio, body: "Speak your radio calls at real Indian airports in 3D. Every read-back is marked on standard phraseology." },
  { ring: 0, key: "academy", label: "RT Academy", icon: Headphones, body: "Radio telephony lesson by lesson: a ladder from the phonetic alphabet to full calls, built on the RTR syllabus." },
  { ring: 0, key: "a320", label: "A320 cockpit lessons", icon: Gauge, body: "Every switch on the A320 flight deck is live. Pick a procedure and the checklist follows you." },
  { ring: 0, key: "emergencies", label: "A320 emergency drills", icon: Siren, body: "31 drills in 9 groups, from an engine fire to a rejected take-off, each with its ECAM alerts." },
  { ring: 0, key: "live", label: "Live airports", icon: PlaneLanding, body: "Watch real traffic land and take off at 8 airports in 3D: Delhi, Mumbai, Chennai, Bengaluru, Hyderabad, Jaipur, Chandigarh and Leh. Free for everyone.", note: "On iPad, Mac and the web" },
  // ring 1: tools (outer ring on desktop, chips on phones)
  { ring: 1, key: "c172", label: "Cessna 172 lessons", icon: PlaneTakeoff, body: "Learn the C172 cockpit lesson by lesson, from the cockpit tour and engine start to shutdown, with emergency drills." },
  { ring: 1, key: "planner", label: "AI Planner", icon: CalendarCheck, body: "Put in your exam dates and get a day-by-day study plan with every remaining subject placed." },
  { ring: 1, key: "radar", label: "Weather radar", icon: Radar, body: "The IMD radar picture for all of India, every ten minutes, with a plain-English summary." },
  { ring: 1, key: "weather", label: "METAR and TAF", icon: CloudSun, body: "Live reports for any ICAO code, decoded into plain English, with the flight category." },
  { ring: 1, key: "notam", label: "NOTAMs", icon: Megaphone, body: "Current NOTAMs for Indian aerodromes, filtered by airport and type, in plain words." },
  { ring: 1, key: "metargame", label: "METAR challenge", icon: Gamepad2, body: "Decode real METARs against the clock, one group at a time, for XP." },
  { ring: 1, key: "navcalc", label: "NavCalc", icon: Calculator, body: "35 navigation calculators that show the working and the figure, not just the answer." },
  { ring: 1, key: "widgets", label: "Instruments and widgets", icon: LayoutGrid, body: "Live weather instruments on your home panel, plus home-screen widgets and Live Activities on iPhone." },
  { ring: 1, key: "progress", label: "XP, streaks and ranks", icon: Trophy, body: "XP for every chapter, test and radio call, a daily streak, and 15 ranks from Cadet to Captain." },
  { ring: 1, key: "report", label: "Progress report", icon: ChartNoAxesColumn, body: "Everything you have done in one report, subject by subject, saved as a PDF to keep or share." },
];

const src = (k: string) => `/screens/orbit/${k}.webp`;
const PERIOD_MS = 110000; // one slow turn of the inner ring
const STEP_MS = 4200; // auto-advance to the next feature
const IDLE_AFTER_TAP = 12000; // a tap holds the chosen feature this long

// Even spacing by arc length, so icons never bunch at the ends of an ellipse.
function arcTable(rx: number, ry: number, N = 240) {
  const ang = new Float64Array(N + 1);
  const cum = new Float64Array(N + 1);
  let px = rx, py = 0, c = 0;
  for (let k = 1; k <= N; k++) {
    const a = (k / N) * Math.PI * 2;
    const x = rx * Math.cos(a), y = ry * Math.sin(a);
    c += Math.hypot(x - px, y - py);
    px = x; py = y; ang[k] = a; cum[k] = c;
  }
  return { ang, cum, total: c };
}
type Table = ReturnType<typeof arcTable>;
function angleAt(t: Table, frac: number) {
  const target = (((frac % 1) + 1) % 1) * t.total;
  let lo = 0, hi = t.cum.length - 1;
  while (lo < hi) { const m = (lo + hi) >> 1; if (t.cum[m] < target) lo = m + 1; else hi = m; }
  const i0 = Math.max(0, lo - 1), c0 = t.cum[i0], c1 = t.cum[lo];
  return t.ang[i0] + (t.ang[lo] - t.ang[i0]) * (c1 > c0 ? (target - c0) / (c1 - c0) : 0);
}

type Ring = { rx: number; ry: number; table: Table; members: number[]; dir: 1 | -1; speed: number };

const INNER = FEATURES.map((f, i) => (f.ring === 0 ? i : -1)).filter((i) => i >= 0);
const OUTER = FEATURES.map((f, i) => (f.ring === 1 ? i : -1)).filter((i) => i >= 0);

export function FeatureOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const bodyRef = useReveal<HTMLDivElement>();

  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false); // images load once the section is close
  const [w, setW] = useState(0);
  const visible = useRef(false);
  const hovers = useRef(0); // mouse pointers currently on a ring path or an icon
  const focused = useRef(false); // keyboard focus on an icon also holds it
  const lastTap = useRef(-Infinity);
  const heldRef = useRef(() => hovers.current > 0 || focused.current);

  // Hover handlers: mouse only. A touch "hover" is a tap and must not freeze it.
  const enter = (e: React.PointerEvent) => { if (e.pointerType === "mouse") hovers.current++; };
  const leave = (e: React.PointerEvent) => { if (e.pointerType === "mouse") hovers.current = Math.max(0, hovers.current - 1); };

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (e.isIntersecting) setNear(true);
    }, { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const wide = w >= 900;
  const phoneW = wide ? Math.min(244, Math.round(w * 0.22)) : Math.min(168, Math.round(w * 0.46));
  const phoneH = Math.round((phoneW * 19.3) / 9);
  const chip = wide ? 50 : 44;
  const tilt = wide ? (-12 * Math.PI) / 180 : 0;

  const rings: Ring[] = useMemo(() => {
    if (!w) return [];
    if (wide) {
      const orx = Math.min(500, Math.round(w / 2 - chip));
      const ory = Math.round(phoneH * 0.5);
      const irx = Math.round(orx * 0.64);
      const iry = Math.round(phoneH * 0.35);
      return [
        { rx: irx, ry: iry, table: arcTable(irx, iry), members: INNER, dir: 1, speed: 1 },
        { rx: orx, ry: ory, table: arcTable(orx, ory), members: OUTER, dir: -1, speed: 0.6 },
      ];
    }
    const rx = Math.round(Math.min(w / 2 - chip / 2 - 2, 170));
    const ry = Math.round(phoneH / 2 + chip / 2 + 16);
    return [{ rx, ry, table: arcTable(rx, ry), members: INNER, dir: 1, speed: 1 }];
  }, [w, wide, chip, phoneH]);

  const extent = rings.length ? Math.max(...rings.map((r) => Math.hypot(r.rx * Math.sin(tilt), r.ry * Math.cos(tilt)))) : 0;
  const stageH = wide ? Math.max(phoneH + 60, Math.round(2 * extent + chip + 24)) : rings[0] ? 2 * rings[0].ry + chip + 28 : 560;

  // The one animation loop: place every ring icon.
  useEffect(() => {
    if (!w || !rings.length) return;
    const cx = w / 2, cy = stageH / 2;
    const cos = Math.cos(tilt), sin = Math.sin(tilt);
    const held = heldRef.current;
    hovers.current = 0; // a re-layout can drop a pointerleave
    let raf = 0, t = 0, prev = performance.now();
    const place = () => {
      for (const r of rings) {
        const n = r.members.length;
        r.members.forEach((fi, k) => {
          const el = chipRefs.current[fi];
          if (!el) return;
          // each ring's first feature starts at the front (bottom-centre)
          const a = angleAt(r.table, k / n + (r.dir * r.speed * t) / PERIOD_MS + 0.25);
          const ex = r.rx * Math.cos(a), ey = r.ry * Math.sin(a);
          const x = cx + ex * cos - ey * sin;
          const y = cy + ex * sin + ey * cos;
          const s = wide ? 0.84 + 0.16 * ((Math.sin(a) + 1) / 2) : 1; // far side a touch smaller
          el.style.transform = `translate3d(${(x - chip / 2).toFixed(1)}px, ${(y - chip / 2).toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
          const z = wide && Math.sin(a) < 0 ? "1" : "3"; // far side passes behind the phone
          if (el.style.zIndex !== z) el.style.zIndex = z;
        });
      }
    };
    place();
    if (reduced) return;
    const loop = (now: number) => {
      const dt = Math.min(64, now - prev);
      prev = now;
      if (visible.current && !held() && !document.hidden) {
        t += dt;
        place();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [w, rings, tilt, wide, chip, stageH, reduced]);

  // Auto-advance (held while the pointer is on a ring or icon, and after a tap).
  useEffect(() => {
    if (reduced) return;
    const held = heldRef.current;
    const id = window.setInterval(() => {
      if (!visible.current || document.hidden || held()) return;
      if (performance.now() - lastTap.current < IDLE_AFTER_TAP) return;
      setActive((a) => (a + 1) % FEATURES.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

  // Warm the next screen so a swap never shows an empty phone.
  useEffect(() => {
    if (!near) return;
    const img = new Image();
    img.decoding = "async";
    img.src = src(FEATURES[(active + 1) % FEATURES.length].key);
  }, [active, near]);

  const select = (i: number) => {
    lastTap.current = performance.now();
    setActive(i);
  };

  const cur = FEATURES[active];
  const cx = w / 2, cy = stageH / 2;
  const onRing = new Set(rings.flatMap((r) => r.members));
  const chipsBelow = w && !wide ? OUTER : [];

  return (
    <section ref={sectionRef} id="whats-inside" className="band relative overflow-hidden">
      <div className="wrap">
        <SectionHead
          title={<>What's inside. <span style={{ color: "#6B7896" }}>Everything, in one app.</span></>}
          lede={`${FEATURES.length} features, every one live in the app today. Tap any of them to see it on the phone. These are real screens from EarnWings.`}
        />

        <div ref={bodyRef} className="reveal">
          <div ref={stageRef} className="relative mx-auto mt-6 w-full max-w-[1120px] sm:mt-8" style={{ height: w ? stageH : 600 }}>
            {w > 0 && (
              <>
                {/* Gold rings: two plain strokes each, no blur filter. A wide
                    transparent stroke over each is the hover target for the path. */}
                <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${w} ${stageH}`} aria-hidden>
                  <defs>
                    <linearGradient id="orbit-gold" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F5D97A" />
                      <stop offset="50%" stopColor="#C9981F" />
                      <stop offset="100%" stopColor="#E9C46A" />
                    </linearGradient>
                  </defs>
                  <g transform={`rotate(${(tilt * 180) / Math.PI} ${cx} ${cy})`}>
                    {rings.map((r, ri) => (
                      <g key={ri}>
                        <ellipse cx={cx} cy={cy} rx={r.rx} ry={r.ry} fill="none" stroke="#F5D97A" strokeOpacity={ri ? 0.16 : 0.22} strokeWidth="9" />
                        <ellipse cx={cx} cy={cy} rx={r.rx} ry={r.ry} fill="none" stroke="url(#orbit-gold)" strokeWidth={ri ? 1.6 : 2.25} strokeOpacity={ri ? 0.8 : 1} />
                        <ellipse
                          cx={cx} cy={cy} rx={r.rx} ry={r.ry} fill="none" stroke="transparent" strokeWidth="22"
                          style={{ pointerEvents: "stroke" }}
                          onPointerEnter={enter}
                          onPointerLeave={leave}
                        />
                      </g>
                    ))}
                  </g>
                </svg>

                {/* soft gold light behind the phone (a gradient, not a blur) */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ width: phoneW * 2.2, height: phoneW * 2.2, background: "radial-gradient(circle, rgba(245,217,122,0.4) 0%, rgba(245,217,122,0) 68%)" }}
                />

                {/* the phone, centred on the rings */}
                <div className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2">
                  <PhoneFrame width={phoneW}>
                    <div className="relative h-full w-full overflow-hidden" style={{ background: "#F4F8FF" }}>
                      {near && (
                        <img
                          key={cur.key}
                          src={src(cur.key)}
                          alt={`EarnWings app: ${cur.label}`}
                          width={560}
                          height={1212}
                          loading="lazy"
                          decoding="async"
                          className="orbit-screen absolute inset-0 h-full w-full"
                          style={{ objectFit: "cover", objectPosition: "top center" }}
                        />
                      )}
                    </div>
                  </PhoneFrame>
                </div>

                {/* the features, riding the rings */}
                <div role="group" aria-label="App features">
                  {FEATURES.map((f, i) => {
                    if (!onRing.has(i)) return null;
                    const on = i === active;
                    const Icon = f.icon;
                    return (
                      <div
                        key={f.key}
                        ref={(el) => { chipRefs.current[i] = el; }}
                        className="orbit-chip"
                        style={{ width: chip, height: chip }}
                        onPointerEnter={enter}
                        onPointerLeave={leave}
                      >
                        <button
                          type="button"
                          className="orbit-btn h-full w-full"
                          aria-pressed={on}
                          aria-label={f.label}
                          onClick={() => select(i)}
                          onFocus={() => (focused.current = true)}
                          onBlur={() => (focused.current = false)}
                        >
                          {f.avatar ? (
                            <AezonPortrait size={chip - 6} ring={false} square alt="" />
                          ) : (
                            <Icon size={wide ? 21 : 19} strokeWidth={2.1} aria-hidden />
                          )}
                        </button>
                        {wide && <span className="orbit-label" data-on={on ? "" : undefined}>{f.label}</span>}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* phones: the other features as labelled chips under the ring */}
          {chipsBelow.length > 0 && (
            <div className="mx-auto mt-5 flex max-w-[30rem] flex-wrap justify-center gap-2" role="group" aria-label="More features">
              {chipsBelow.map((i) => {
                const f = FEATURES[i];
                const Icon = f.icon;
                return (
                  <button key={f.key} type="button" className="orbit-pill" aria-pressed={i === active} onClick={() => select(i)}>
                    <Icon size={15} strokeWidth={2.2} aria-hidden /> {f.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* what is on the phone right now */}
          <div className="mx-auto mt-6 max-w-[34rem] text-center sm:mt-7">
            <p className="font-mono-data text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--gold-ink)" }}>
              {String(active + 1).padStart(2, "0")} / {String(FEATURES.length).padStart(2, "0")}
              {cur.note ? ` · ${cur.note}` : ""}
            </p>
            <p className="h-sub mt-2 inline-flex items-center gap-2.5" style={{ fontSize: "1.3rem" }}>
              {cur.avatar && <AezonPortrait size={34} ring={false} square alt="" />}
              {cur.label}
            </p>
            <p className="mt-2 min-h-[4.7em] text-[0.95rem] leading-relaxed sm:min-h-[3.2em]" style={{ color: "var(--ink-2)" }}>{cur.body}</p>
            <Link to="/features" className="link-arrow mt-2 justify-center text-[0.95rem]">
              See every feature <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
