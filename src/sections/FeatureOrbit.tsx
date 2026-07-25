import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useAnimationFrame } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Route, Radio, Bot, GraduationCap, Trophy, BookOpen, LayoutDashboard,
  PlaneTakeoff, Video, CloudSun, CalendarCheck, Swords,
  Wind, Megaphone, LayoutGrid, Images, Medal, Mountain, ChevronLeft, ChevronRight,
} from "lucide-react";
import { prefersReducedMotion } from "../lib/scroll";
import { PhoneFrame } from "../components/DeviceFrame";
import { inView, rise } from "../lib/motion";

/**
 * "Cockpit orbit" section: a large phone joined to the brand's gold streak ring,
 * with every feature as an icon-circle revolving around it (evenly spaced by arc
 * length, so they never bunch up). Each circle is a button — clicking it swaps
 * the phone screen to that feature (real screenshot, or a branded placeholder if
 * we don't have one yet). The phone is drawn above the circles, so each hides
 * behind it as it nears and re-emerges on the far side. Hover pauses the orbit.
 * Background is transparent so the page's unified cloud sky shows through.
 */

type Feature = { key: string; label: string; icon: typeof Route; accent: string; screen?: string };

const FEATURES: Feature[] = [
  { key: "home", label: "Home Dashboard", icon: LayoutDashboard, accent: "#1B3A7A", screen: "/screens/app-dashboard.png" },
  { key: "flightplan", label: "Flight Planning", icon: Route, accent: "#2E6BE5", screen: "/screens/app-flightplan.png" },
  { key: "rt", label: "RT Trainer", icon: Radio, accent: "#C9981F", screen: "/screens/app-rt.png" },
  { key: "captain", label: "AI Captain", icon: Bot, accent: "#1B3A7A", screen: "/screens/app-captain.png" },
  { key: "exams", label: "DGCA Exams", icon: GraduationCap, accent: "#5BA4E8", screen: "/screens/app-exams.png" },
  { key: "learn", label: "Learning Hub", icon: BookOpen, accent: "#2E6BE5", screen: "/screens/app-learn.png" },
  { key: "visual", label: "Visual Notes", icon: Images, accent: "#5BA4E8", screen: "/screens/app-visual.png" },
  { key: "metar", label: "METAR Decoder", icon: Wind, accent: "#5BA4E8", screen: "/screens/app-metar.png" },
  { key: "weather", label: "Weather", icon: CloudSun, accent: "#1B3A7A", screen: "/screens/app-weather.png" },
  { key: "notam", label: "NOTAM System", icon: Megaphone, accent: "#C9981F", screen: "/screens/app-notam.png" },
  { key: "flightops", label: "Flight Ops", icon: LayoutGrid, accent: "#1B3A7A", screen: "/screens/app-flightops.png" },
  { key: "planner", label: "Course Planner", icon: CalendarCheck, accent: "#C9981F", screen: "/screens/app-planner.png" },
  { key: "compete", label: "Compete", icon: Swords, accent: "#2E6BE5", screen: "/screens/app-compete.png" },
  { key: "leaderboard", label: "Leaderboard", icon: Medal, accent: "#C9981F", screen: "/screens/app-leaderboard.png" },
  { key: "journey", label: "XP & Ranks", icon: Trophy, accent: "#C9981F", screen: "/screens/app-journey.png" },
  { key: "myjourney", label: "My Journey", icon: Mountain, accent: "#1B3A7A", screen: "/screens/app-myjourney.png" },
  // --- still placeholder (no screenshot yet) ---
  { key: "sim", label: "Flight Sim", icon: PlaneTakeoff, accent: "#2E6BE5" },
  { key: "video", label: "Video Lessons", icon: Video, accent: "#5BA4E8" },
];

const TILT_DEG = -15;
const TILT = (TILT_DEG * Math.PI) / 180;
const PERIOD_MS = 64000; // one slow revolution (many chips → slower)

// --- even spacing by arc length (so circles never cluster on the flat ends) --
function buildArcTable(rx: number, ry: number, N = 256) {
  const angles = new Array(N + 1);
  const cums = new Array(N + 1);
  let cum = 0, px = rx, py = 0;
  angles[0] = 0; cums[0] = 0;
  for (let k = 1; k <= N; k++) {
    const a = (k / N) * Math.PI * 2;
    const x = rx * Math.cos(a), y = ry * Math.sin(a);
    cum += Math.hypot(x - px, y - py);
    px = x; py = y;
    angles[k] = a; cums[k] = cum;
  }
  return { angles, cums, total: cum };
}
function arcAngle(table: ReturnType<typeof buildArcTable>, frac: number) {
  const f = ((frac % 1) + 1) % 1;
  const target = f * table.total;
  const { cums, angles } = table;
  let lo = 0, hi = cums.length - 1;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (cums[mid] < target) lo = mid + 1; else hi = mid; }
  const i1 = lo, i0 = Math.max(0, lo - 1);
  const c0 = cums[i0], c1 = cums[i1];
  const t = c1 > c0 ? (target - c0) / (c1 - c0) : 0;
  return angles[i0] + (angles[i1] - angles[i0]) * t;
}

function ChipButton({ feature, active, alwaysLabel, onSelect, onPause }: { feature: Feature; active: boolean; alwaysLabel?: boolean; onSelect: () => void; onPause?: (p: boolean) => void }) {
  const [hover, setHover] = useState(false);
  const showLabel = alwaysLabel || active || hover;
  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => { setHover(true); onPause?.(true); }}
      onMouseLeave={() => { setHover(false); onPause?.(false); }}
    >
      <motion.button
        type="button"
        onClick={onSelect}
        onFocus={() => { setHover(true); onPause?.(true); }}
        onBlur={() => { setHover(false); onPause?.(false); }}
        aria-label={`Preview ${feature.label}`}
        animate={{ scale: active ? 1.18 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none backdrop-blur-md"
        style={{
          background: active ? feature.accent : "rgba(255,255,255,0.94)",
          color: active ? "#fff" : feature.accent,
          boxShadow: active
            ? `0 16px 34px -10px ${feature.accent}, 0 0 0 4px ${feature.accent}33`
            : `0 12px 26px -12px ${feature.accent}aa, inset 0 0 0 1px ${feature.accent}30`,
        }}
      >
        <feature.icon size={20} strokeWidth={2.3} />
      </motion.button>
      <AnimatePresence>
        {showLabel && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className={`pointer-events-none whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-extrabold ${alwaysLabel ? "mt-2" : "absolute top-full mt-2"}`}
            style={{ background: "#0D1629", color: "#fff", boxShadow: "0 8px 20px -8px rgba(13,22,41,0.6)" }}
          >
            {feature.label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrbitChip({
  feature, i, count, t, rx, ry, table, active, onSelect, onPause,
}: {
  feature: Feature; i: number; count: number; t: ReturnType<typeof useMotionValue<number>>;
  rx: number; ry: number; table: ReturnType<typeof buildArcTable>; active: boolean; onSelect: () => void; onPause: (p: boolean) => void;
}) {
  const x = useTransform(t, (ms) => {
    const a = arcAngle(table, i / count + ms / PERIOD_MS);
    const ex = rx * Math.cos(a), ey = ry * Math.sin(a);
    return ex * Math.cos(TILT) - ey * Math.sin(TILT);
  });
  const y = useTransform(t, (ms) => {
    const a = arcAngle(table, i / count + ms / PERIOD_MS);
    const ex = rx * Math.cos(a), ey = ry * Math.sin(a);
    return ex * Math.sin(TILT) + ey * Math.cos(TILT);
  });
  return (
    <div className="absolute left-1/2 top-1/2 z-10">
      <motion.div style={{ x, y }}>
        <motion.div style={{ x: "-50%", y: "-50%" }} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.05 }}>
          <ChipButton feature={feature} active={active} onSelect={onSelect} onPause={onPause} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function FeatureOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();

  const [active, setActive] = useState(0);

  // Desktop = the orbit; phones = a swipeable phone (window-width based so the two
  // layouts switch cleanly without depending on the measured stage).
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window === "undefined" || window.matchMedia("(min-width: 768px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Change the active feature + fire a little haptic tap on phones.
  const selectFeature = (i: number) => {
    setActive(i);
    try { navigator.vibrate?.(12); } catch { /* unsupported */ }
  };

  const t = useMotionValue(0);
  const pausedRef = useRef(false);
  const visibleRef = useRef(true);
  useAnimationFrame((_, delta) => {
    if (!pausedRef.current && !reduced && visibleRef.current) t.set(t.get() + delta);
  });
  // Only spin the orbit while the section is near the viewport — keeps scrolling
  // smooth by not doing per-frame transform work when it's off-screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { visibleRef.current = e.isIntersecting; }, { rootMargin: "250px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [dims, setDims] = useState({ w: 1040, h: 740 });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setDims({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = dims;
  const cx = w / 2;
  const cy = h / 2;
  const orbit = !reduced && isDesktop;

  const phoneW = Math.max(172, Math.min(300, Math.round((h * 0.8 * 9) / 19.3)));
  const ringRx = Math.max(220, Math.min(480, Math.round(w * 0.44)));
  const ringRy = Math.max(150, Math.min(240, Math.round(h * 0.31)));
  const table = useMemo(() => buildArcTable(ringRx, ringRy), [ringRx, ringRy]);

  const orbitPath = `M ${cx - ringRx},${cy} a ${ringRx},${ringRy} 0 1,0 ${2 * ringRx},0 a ${ringRx},${ringRy} 0 1,0 ${-2 * ringRx},0`;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const stageY = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 34, reduced ? 0 : -34]);

  const cur = FEATURES[active];

  return (
    <section ref={sectionRef} id="cockpit" className="relative overflow-hidden">
      <div className="section relative">
        <motion.div variants={rise} initial="hidden" whileInView="show" viewport={inView} className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">The EARNWINGS cockpit</span>
          <h2 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-tight" style={{ color: "#0D1629" }}>
            Your whole ground school, <span className="text-gradient-gold">in orbit</span>
          </h2>
          <p className="mt-4 text-lg" style={{ color: "#40506e" }}>
            Every tool, one home screen — <b style={{ color: "#1B3A7A" }}>tap or swipe</b> to
            preview each one live on the phone.
          </p>
        </motion.div>

        {orbit ? (
        <motion.div
          ref={stageRef}
          style={{ y: stageY }}
          className="relative mx-auto mt-8 h-[700px] w-full max-w-6xl sm:mt-12 lg:h-[760px]"
        >
          {/* Gold streak ring + orbiting sparks */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="fo-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F5D97A" />
                <stop offset="45%" stopColor="#C9981F" />
                <stop offset="100%" stopColor="#8a6a12" />
              </linearGradient>
              <filter id="fo-glow" x="-20%" y="-40%" width="140%" height="180%">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="fo-spark" x="-300%" y="-300%" width="700%" height="700%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            <g transform={`rotate(${TILT_DEG} ${cx} ${cy})`}>
              <path id="fo-orbit" d={orbitPath} fill="none" stroke="url(#fo-gold)" strokeWidth="3" filter="url(#fo-glow)" />
              <ellipse cx={cx} cy={cy} rx={ringRx + 11} ry={ringRy + 11} fill="none" stroke="#F5D97A" strokeOpacity="0.3" strokeWidth="1.2" />
              {!reduced && (
                <>
                  <circle r="7" fill="#F5D97A" opacity="0.55" filter="url(#fo-spark)">
                    <animateMotion dur="14s" repeatCount="indefinite"><mpath href="#fo-orbit" /></animateMotion>
                  </circle>
                  <circle r="3" fill="#FFF6D6">
                    <animateMotion dur="14s" repeatCount="indefinite"><mpath href="#fo-orbit" /></animateMotion>
                  </circle>
                </>
              )}
            </g>
          </svg>

          {/* Gold glow behind the phone */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ width: phoneW * 1.9, height: phoneW * 1.9, background: "radial-gradient(circle, rgba(245,217,122,0.4), transparent 70%)" }}
          />

          {/* Feature circles revolving around the phone (desktop) */}
          {FEATURES.map((feature, i) => (
            <OrbitChip key={feature.key} feature={feature} i={i} count={FEATURES.length} t={t} rx={ringRx} ry={ringRy} table={table} active={active === i} onSelect={() => selectFeature(i)} onPause={(p) => (pausedRef.current = p)} />
          ))}

          {/* The phone — big, centred, joined to the ring, above the circles */}
          <div className="absolute left-1/2 top-1/2 z-30">
            <motion.div style={{ x: "-50%", y: "-50%" }} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={inView} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <div className="[perspective:1200px]">
                <motion.div
                  style={{ rotateY: -7, rotateX: 3 }}
                  animate={reduced ? undefined : { y: [0, -12, 0], rotateZ: [-1.2, 1.2, -1.2] }}
                  transition={reduced ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div style={{ filter: "drop-shadow(0 48px 78px rgba(13,36,80,0.44))" }}>
                    <PhoneFrame width={phoneW}>
                      <div className="relative h-full w-full overflow-hidden" style={{ background: "#F4F8FF" }}>
                        <AnimatePresence>
                          <motion.div key={cur.key} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0 h-full w-full">
                            {cur.screen ? (
                              <img src={cur.screen} alt={cur.label} className="h-full w-full" style={{ objectFit: "cover", objectPosition: "top center" }} />
                            ) : (
                              <ScreenPlaceholder feature={cur} />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </PhoneFrame>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        ) : (
          <MobileCockpit active={active} onSelect={selectFeature} />
        )}
      </div>
    </section>
  );
}

/**
 * Phone-only cockpit: one big SWIPEABLE phone (drag left/right to change the
 * feature screen) + a tappable chip row. Every change fires a haptic tap. No
 * orbit ring (it doesn't read well on a narrow screen).
 */
function MobileCockpit({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const n = FEATURES.length;
  const cur = FEATURES[active];
  const CurIcon = cur.icon;
  const go = (i: number) => onSelect(((i % n) + n) % n); // wraps around

  return (
    <div className="mx-auto mt-8 flex max-w-sm flex-col items-center px-2">
      {/* current feature */}
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${cur.accent}18`, color: cur.accent }}>
          <CurIcon size={18} strokeWidth={2.3} />
        </span>
        <span className="text-lg font-extrabold font-display" style={{ color: "#1B3A7A" }}>{cur.label}</span>
      </div>

      {/* swipeable phone */}
      <div className="relative">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ width: 320, height: 320, background: "radial-gradient(circle, rgba(245,217,122,0.42), transparent 70%)" }} />
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            if (info.offset.x < -55) go(active + 1);
            else if (info.offset.x > 55) go(active - 1);
          }}
          whileTap={{ cursor: "grabbing" }}
          className="relative cursor-grab"
        >
          <div style={{ filter: "drop-shadow(0 28px 56px rgba(13,36,80,0.42))" }}>
            <PhoneFrame width={230}>
              <div className="relative h-full w-full overflow-hidden" style={{ background: "#F4F8FF" }}>
                <AnimatePresence>
                  <motion.div key={cur.key} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0 h-full w-full">
                    {cur.screen ? (
                      <img src={cur.screen} alt={cur.label} draggable={false} className="h-full w-full" style={{ objectFit: "cover", objectPosition: "top center" }} />
                    ) : (
                      <ScreenPlaceholder feature={cur} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </PhoneFrame>
          </div>
        </motion.div>
      </div>

      {/* swipe hint */}
      <div className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "#5F7499" }}>
        <ChevronLeft size={15} /> swipe to explore <ChevronRight size={15} />
      </div>

      {/* tappable chip row (horizontal scroll) */}
      <div className="mt-5 flex w-full snap-x gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
        {FEATURES.map((f, i) => {
          const Ic = f.icon;
          const on = i === active;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => go(i)}
              className="flex shrink-0 snap-start items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors"
              style={{
                background: on ? f.accent : "rgba(255,255,255,0.92)",
                color: on ? "#fff" : "#1B3A7A",
                boxShadow: on ? `0 8px 20px -8px ${f.accent}` : "0 6px 16px -10px rgba(13,36,80,0.4), inset 0 0 0 1px rgba(27,58,122,0.1)",
              }}
            >
              <Ic size={13} strokeWidth={2.3} style={{ color: on ? "#fff" : f.accent }} />
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Branded in-phone panel for features that don't have a screenshot yet. */
function ScreenPlaceholder({ feature }: { feature: Feature }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center" style={{ background: `linear-gradient(160deg, ${feature.accent}17 0%, #F4F8FF 60%)` }}>
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl" style={{ background: `${feature.accent}1f`, color: feature.accent, boxShadow: `0 16px 34px -14px ${feature.accent}` }}>
        <feature.icon size={38} strokeWidth={2.1} />
      </div>
      <div className="text-xl font-extrabold font-display" style={{ color: "#1B3A7A" }}>{feature.label}</div>
      <div className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest" style={{ background: `${feature.accent}14`, color: feature.accent }}>
        Preview coming soon
      </div>
    </div>
  );
}
