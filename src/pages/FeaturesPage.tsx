import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Map, Compass, Radar, Radio, Bot, GraduationCap, BookOpen, Trophy, LayoutDashboard,
  Check, Plane, Smartphone, Monitor, ChevronLeft, ChevronRight, ZoomIn, X, FileText, Hand,
  Sparkles, Coins, Satellite, GitBranch, Users, Flame, ListChecks, CalendarCheck, ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { CloudBackground } from "../components/CloudBackground";
import { FEATURES_H1, FEATURES_INTRO } from "../content/features";
import { FAQ } from "../content/faq";
import { PhoneFrame } from "../components/DeviceFrame";
import { Link } from "../lib/router";
import { STATS } from "../lib/data";
import { STUDY } from "../lib/study";

type Feat = {
  key: string; icon: LucideIcon; accent: string; title: string;
  tagline: string; desc: string; screen: string; callouts: string[]; points: string[];
};

const FEATURES: Feat[] = [
  {
    key: "planning", icon: Map, accent: "#2E6BE5", title: "Flight Planning",
    tagline: "Plan live routes over airways that actually exist.",
    desc: "Type a departure and destination and EARNWINGS routes you over real ARINC-424 airways — then hands you a full pilot brief you can fly.",
    screen: "/screens/app-flightplan.webp",
    callouts: ["ATS airways", "5-algo solver", "Brief PDF"],
    points: [
      "Real ARINC-424 airways, waypoints & aerodromes (Lido-grade)",
      "Compare 5 routing algorithms side-by-side",
      "Automatic weight & balance, fuel burn and ETE",
      "One-tap ICAO flight-plan / pilot-brief PDF",
    ],
  },
  {
    key: "airways", icon: Compass, accent: "#2E6BE5", title: "Airways & Charts",
    tagline: "The whole airspace, at your fingertips.",
    desc: "Explore real worldwide ATS airways, airspace boundaries and approach plates — pan the map, tap a sector, read the chart.",
    screen: "/screens/worldwide-airways.webp",
    callouts: ["Global airways", "Live airspace", "Charts"],
    points: [
      "Real global ATS airways & waypoints on an interactive map",
      "Airspace boundaries, sectors and FIR crossings",
      "In-app SID / STAR / IAP approach charts",
      "Obstacles and aerodrome data baked in",
    ],
  },
  {
    key: "weather", icon: Radar, accent: "#5BA4E8", title: "Weather & Currency",
    tagline: "Never fly a stale plan.",
    desc: "Live weather and NOTAMs reshape your route automatically, and self-updating charts keep every procedure current.",
    screen: "/screens/airport-chart.webp",
    callouts: ["METAR · TAF", "Auto-reroute", "Satellite"],
    points: [
      "METAR / TAF / SIGMET decode with VFR·MVFR·IFR·LIFR tagging",
      "NOTAM decode → corridor auto-reroute, with provenance",
      "Self-updating eAIP so procedures are always current",
      "Live INSAT-3DS satellite imagery — stills + animated loop",
    ],
  },
  {
    key: "rt", icon: Radio, accent: "#C9981F", title: "RT Trainer",
    tagline: "Grab the mic. ATC is grading you.",
    desc: "Speak your radio calls in an animated airport scene; speech-to-text scores your phraseology the instant you talk.",
    screen: "/screens/app-rt.webp",
    callouts: ["Speak the call", "Auto-scored", "Scenarios"],
    points: [
      "Voice-first practice with a real Cessna 172 in 3D",
      "Whisper speech-to-text scores your phraseology instantly",
      "Local, flight-plan, emergency & enroute scenarios",
      "Bridges straight from your own flight plan",
    ],
  },
  {
    key: "captain", icon: Bot, accent: "#1B3A7A", title: "AI Captain",
    tagline: "A ground instructor that never bluffs.",
    desc: "Ask anything. The Captain answers from your own notes, shows its working, quizzes you — and says ‘I don’t know’ rather than inventing.",
    screen: "/screens/app-captain.webp",
    callouts: ["Your notes", "Quizzes", "Study plan"],
    points: [
      "Answers grounded in your notes with anti-hallucination retrieval",
      "Markdown + KaTeX, chat memory and follow-ups",
      "In-chat quizzes and step-by-step METAR decodes",
      "Exports a personalised study plan to your planner",
    ],
  },
  {
    key: "exams", icon: GraduationCap, accent: "#2E6BE5", title: "DGCA Mock Exams",
    tagline: "Sit the real paper before the real paper.",
    desc: "Full composite papers for every subject — timed and marked exactly like the DGCA, then analysed answer-by-answer.",
    screen: "/screens/app-exams.webp",
    callouts: ["DGCA marks", "Figures", "Analysis"],
    points: [
      "Composite papers for every DGCA subject",
      "Theory, numerical & figure questions with SVG instruments",
      "10,000+ practice questions with per-chapter MCQ banks",
      "Full Captain analysis of every answer",
    ],
  },
  {
    key: "content", icon: BookOpen, accent: "#5BA4E8", title: "Ground School",
    tagline: "Your whole ground school, organised.",
    desc: "Structured notes and video lectures across all five subjects, paced by interactive chapter outlines that track what you’ve finished.",
    screen: "/screens/app-learn.webp",
    callouts: ["Paged notes", "Videos", "Progress"],
    points: [
      "Clean paged A4 notes across all 5 core subjects",
      "Video lecture library wired to each subject & chapter",
      "Interactive per-chapter outlines with completion tracking",
      "Screenshot deterrents on the native apps",
    ],
  },
  {
    key: "journey", icon: Trophy, accent: "#C9981F", title: "Gamified Journey",
    tagline: "Turn studying into a climb.",
    desc: "Earn XP for everything you learn and climb 15 ranks from Cadet to Commander — each one unlocking a real perk.",
    screen: "/screens/app-journey.webp",
    callouts: ["XP for all", "15 ranks", "Perks"],
    points: [
      "Learning-driven XP for every note, chapter, book & test",
      "15 ranks from Cadet to Commander, each with a perk",
      "Streaks, leaderboards and a level-up celebration",
      "A visual climb-map of your whole journey",
    ],
  },
  {
    key: "dashboard", icon: LayoutDashboard, accent: "#1B3A7A", title: "Home Dashboard",
    tagline: "Your daily flight deck.",
    desc: "Everything the moment you land — your rank, XP and credits up top, and one-tap quick actions into every tool.",
    screen: "/screens/app-dashboard.webp",
    callouts: ["Rank & XP", "Quick actions", "Daily deck"],
    points: [
      "A personalised home that greets you by name",
      "Rank, total XP, streak and credits at a glance",
      "Quick actions into planning, weather and the Captain",
      "Your daily deck — quote, streak and what to do next",
    ],
  },
];

type Mini = { icon: LucideIcon; title: string; body: string };
const MORE: Mini[] = [
  { icon: Sparkles, title: "First-join wizard", body: "Add your documents and the exams you’ve cleared for an exam-aware plan on day one." },
  { icon: Coins, title: "Free tier & AI credits", body: "Start free with Chapter 1 + sample RT; transparent credits power the smart stuff." },
  { icon: Satellite, title: "Satellite imagery", body: "Live INSAT-3DS stills plus a self-building animated cloud loop." },
  { icon: GitBranch, title: "Route-solver lab", body: "Compare Dijkstra, A* and 3 more pathfinders on the same route, visually." },
  { icon: Users, title: "Peer RT matches", body: "Practise your radio calls head-to-head against other cadets." },
  { icon: Flame, title: "Streaks & leaderboards", body: "Keep your streak alive and climb the founder leaderboard." },
  { icon: ListChecks, title: "Custom quizzes", body: "Ask the Captain to build a timed quiz on any topic you choose." },
  { icon: CalendarCheck, title: "Study-plan export", body: "Turn any Captain chat into a dated plan in your planner." },
  { icon: ShieldCheck, title: "Offline & protected", body: "Read notes offline, with native screenshot deterrents on your content." },
];

// Callout chips sit in the side margins, clear of the phone.
const RATIO = 19.3 / 9; // PhoneFrame aspect

function DeckArrow({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button type="button" aria-label={dir === "prev" ? "Previous feature" : "Next feature"} onClick={onClick} disabled={disabled}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 shadow-md backdrop-blur transition-all hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100"
      style={{ color: "#1B3A7A", boxShadow: "0 10px 26px -12px rgba(13,36,80,0.4)" }}>
      <Icon size={22} strokeWidth={2.4} />
    </button>
  );
}

/** The landing's draggable 3D "flight deck", reused here with every feature screen. */
function PhoneDeck() {
  const N = FEATURES.length;
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [hover, setHover] = useState(false);
  const dragging = useRef(false);
  const moved = useRef(false);
  const startX = useRef(0);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < 720);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const BASE = compact ? 186 : 240;
  const STEPX = BASE * (compact ? 0.5 : 0.62);
  const STEP_PX = compact ? 150 : 210;
  const stageH = Math.round(BASE * RATIO) + (compact ? 44 : 74);

  useEffect(() => {
    if (engaged || hover) return;
    const id = setInterval(() => setActive((a) => (a + 1) % N), 4200);
    return () => clearInterval(id);
  }, [engaged, hover, N]);

  const go = (i: number) => {
    const next = Math.max(0, Math.min(N - 1, i));
    if (next !== active) setActive(next);
    setEngaged(true);
  };

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = false;
    startX.current = e.clientX;
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    if (!moved.current && Math.abs(dx) > 4) {
      moved.current = true;
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* older browsers */ }
    }
    const minD = active - (N - 1) - 0.5;
    const maxD = active + 0.5;
    setDrag(Math.max(minD, Math.min(maxD, dx / STEP_PX)));
  };
  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const next = Math.max(0, Math.min(N - 1, Math.round(active - drag)));
    if (next !== active) { setActive(next); setEngaged(true); }
    setDrag(0);
  };

  const place = (i: number) => {
    const off = i - active + drag;
    const abs = Math.abs(off);
    const isActive = abs < 0.5;
    const blur = isActive ? 0 : Math.min(abs, 2) * 1.1;
    return {
      x: off * STEPX,
      z: -Math.min(abs, 3) * 130,
      rotateY: Math.max(-55, Math.min(55, -off * 22)),
      scale: Math.max(1 - abs * 0.14, 0.5),
      opacity: abs > 2.7 ? 0 : Math.max(1 - abs * 0.26, 0),
      filter: isActive ? "saturate(1.05) brightness(1) blur(0px)" : `saturate(0.7) brightness(0.9) blur(${blur.toFixed(2)}px)`,
      zIndex: Math.round(100 - abs * 10),
      pointer: abs > 2.5 ? "none" : "auto",
      isActive,
    };
  };

  const cur = FEATURES[active];
  const CurIcon = cur.icon;

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <motion.div
        className="relative mx-auto select-none"
        style={{ height: stageH, maxWidth: 960, perspective: 1600, touchAction: "pan-y", cursor: dragging.current ? "grabbing" : "grab" }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onUp}
      >
        {FEATURES.map((f, i) => {
          const p = place(i);
          return (
            <motion.button key={f.key} type="button" aria-label={`Show ${f.title}`}
              onClick={() => { if (moved.current) return; go(i); }}
              className="absolute left-1/2 top-1/2 rounded-[36px] outline-none"
              style={{ width: BASE, height: Math.round(BASE * RATIO), marginLeft: -BASE / 2, marginTop: -Math.round(BASE * RATIO) / 2, transformStyle: "preserve-3d", zIndex: p.zIndex, pointerEvents: p.pointer as "auto" | "none", cursor: p.isActive ? "grab" : "pointer" }}
              animate={{ x: p.x, z: p.z, rotateY: p.rotateY, scale: p.scale, opacity: p.opacity, filter: p.filter }}
              transition={dragging.current ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 28, mass: 0.9 }}
            >
              <div style={{ borderRadius: BASE * 0.16, boxShadow: p.isActive ? `0 48px 90px -34px ${f.accent}cc` : "none", pointerEvents: "none" }}>
                <PhoneFrame src={f.screen} alt={f.title} width={BASE} />
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {!engaged && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className="mt-5 flex items-center justify-center gap-2 text-[13px] font-semibold" style={{ color: "#4A5A78" }}>
            <motion.span animate={{ x: [-4, 4, -4] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="inline-flex"><Hand size={15} /></motion.span>
            Drag the deck · tap a screen to bring it forward
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-center gap-4">
        <DeckArrow dir="prev" disabled={active === 0} onClick={() => go(active - 1)} />
        <div className="flex items-center gap-2.5">
          {FEATURES.map((f, i) => i === active ? (
            <motion.div key={f.key} layout className="flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3.5" style={{ background: `${f.accent}1a`, boxShadow: `inset 0 0 0 1px ${f.accent}55` }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: f.accent }} />
              <span className="text-[13px] font-extrabold" style={{ color: f.accent }}>{f.title}</span>
            </motion.div>
          ) : (
            <motion.button key={f.key} layout aria-label={`Go to ${f.title}`} onClick={() => go(i)} className="h-2.5 w-2.5 rounded-full transition-transform hover:scale-125" style={{ background: "rgba(27,58,122,0.24)" }} />
          ))}
        </div>
        <DeckArrow dir="next" disabled={active === N - 1} onClick={() => go(active + 1)} />
      </div>

      <div className="relative mx-auto mt-8 max-w-xl" style={{ minHeight: compact ? 244 : 214 }}>
        <AnimatePresence mode="wait">
          <motion.div key={cur.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-6 sm:p-7" style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(27,58,122,0.08)", boxShadow: `0 30px 70px -34px ${cur.accent}55` }}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: `${cur.accent}18`, color: cur.accent }}><CurIcon size={24} /></div>
              <div>
                <h3 className="text-2xl font-extrabold leading-none" style={{ color: "#1B3A7A" }}>{cur.title}</h3>
                <p className="mt-1 text-[14px] font-semibold" style={{ color: cur.accent }}>“{cur.tagline}”</p>
              </div>
            </div>
            <ul className="mt-5 grid gap-3">
              {cur.points.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-[15.5px]" style={{ color: "#40506e" }}>
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: cur.accent, color: "white" }}><Check size={12} /></span>
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const STUDY_TABS = [
  { key: "notes" as const, label: "Notes", icon: BookOpen, accent: "#2E6BE5" },
  { key: "summaries" as const, label: "Summaries", icon: FileText, accent: "#C9981F" },
  { key: "flowcharts" as const, label: "Flowcharts", icon: GitBranch, accent: "#1B3A7A" },
];

/** A 3D coverflow "study pack" — flip through real notes, summaries & flowcharts. */
function StudyPack() {
  const [tab, setTab] = useState<"notes" | "summaries" | "flowcharts">("notes");
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const pages = STUDY[tab];
  const page = pages[idx];
  const portrait = tab !== "flowcharts";
  const meta = STUDY_TABS.find((t) => t.key === tab)!;
  const cardW = portrait ? 288 : 440;
  const spread = portrait ? 180 : 240;

  const go = (d: number) => setIdx((v) => (v + d + pages.length) % pages.length);

  return (
    <div>
      {/* Type tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {STUDY_TABS.map((t) => {
          const on = t.key === tab; const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => { setTab(t.key); setIdx(0); }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all"
              style={on ? { background: t.accent, color: "#fff", boxShadow: `0 12px 26px -12px ${t.accent}` } : { background: "rgba(255,255,255,0.82)", color: "#4A5A78", border: "1px solid rgba(27,58,122,0.12)" }}>
              <Icon size={16} /> {t.label}
              <span className="rounded-full px-1.5 text-[11px]" style={{ background: on ? "rgba(255,255,255,0.22)" : "rgba(27,58,122,0.08)" }}>{STUDY[t.key].length}</span>
            </button>
          );
        })}
      </div>

      {/* Coverflow stage */}
      <div className="relative mt-8 flex items-center justify-center overflow-hidden" style={{ perspective: 1500, minHeight: 430 }}>
        <div className="pointer-events-none absolute h-64 w-[70%] rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${meta.accent}40, transparent 70%)` }} />
        {pages.map((p, i) => {
          const off = i - idx; const a = Math.abs(off); const isA = a === 0;
          return (
            <motion.button key={p.img} onClick={() => (isA ? setZoom(true) : setIdx(i))}
              className="absolute overflow-hidden rounded-xl bg-white"
              style={{ width: cardW, transformStyle: "preserve-3d", cursor: isA ? "zoom-in" : "pointer", zIndex: 40 - Math.round(a * 10), border: "1px solid rgba(255,255,255,0.7)", boxShadow: isA ? "0 44px 80px -30px rgba(13,36,80,0.65)" : "0 24px 44px -26px rgba(13,36,80,0.5)" }}
              animate={{ x: off * spread, rotateY: -off * (portrait ? 26 : 20), scale: isA ? 1 : 0.82, z: isA ? 0 : -240, opacity: a > 1.55 ? 0 : 1, filter: isA ? "none" : "brightness(0.82) saturate(0.85)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <img src={p.img} alt={`${p.title} ${tab}`} className="block w-full" draggable={false} />
              {isA && <span className="pointer-events-none absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-white" style={{ background: "rgba(13,36,80,0.55)" }}><ZoomIn size={14} /></span>}
            </motion.button>
          );
        })}
      </div>

      {/* Caption + controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button onClick={() => go(-1)} aria-label="Previous" className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "rgba(27,58,122,0.08)", color: "#1B3A7A" }}><ChevronLeft size={18} /></button>
        <AnimatePresence mode="wait">
          <motion.div key={page.img} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="min-w-[220px] text-center">
            <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: meta.accent }}>{page.title}</div>
            <div className="text-[15px] font-bold" style={{ color: "#1B3A7A" }}>{page.topic}</div>
          </motion.div>
        </AnimatePresence>
        <button onClick={() => go(1)} aria-label="Next" className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "rgba(27,58,122,0.08)", color: "#1B3A7A" }}><ChevronRight size={18} /></button>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        {pages.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} aria-label={`Page ${i + 1}`} className="h-2 rounded-full transition-all" style={{ width: i === idx ? 24 : 8, background: i === idx ? meta.accent : "rgba(27,58,122,0.2)" }} />
        ))}
      </div>
      <p className="mt-3 text-center text-xs" style={{ color: "#4A5A78" }}>Tap the front page for full size</p>

      {/* Lightbox */}
      <AnimatePresence>
        {zoom && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoom(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(6,11,28,0.92)" }}>
            <button onClick={() => setZoom(false)} aria-label="Close" className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ background: "rgba(255,255,255,0.12)" }}><X size={22} /></button>
            <motion.img initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }} src={page.img} alt="" onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] max-w-[94vw] rounded-lg object-contain shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FeaturesPage() {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <div className="relative min-h-screen">
      <Nav solid />

      {/* Unified living cloud-sky background — shared with the landing (drifts + breathes) */}
      <CloudBackground />

      {/* Hero */}
      <header className="px-5 pb-8 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-6xl text-center">
          <Link to="/" className="mb-5 inline-flex items-center gap-1 text-sm font-semibold transition-colors" style={{ color: "#4A5A78" }}>
            <ChevronLeft size={16} /> Back to home
          </Link>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <span className="eyebrow"><Sparkles size={14} /> Explore the cockpit</span>
            <h1 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-black leading-tight" style={{ color: "#0D1629" }}>
              {FEATURES_H1[0]}<span className="text-gradient-gold">{FEATURES_H1[1]}</span>{FEATURES_H1[2]}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg" style={{ color: "#40506e" }}>
              {FEATURES_INTRO}
            </p>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
        {/* At-a-glance */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl px-4 py-5 text-center" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(27,58,122,0.08)" }}>
              <div className="text-3xl font-extrabold" style={{ color: "#C9981F" }}>{s.value}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "#4A5A78" }}>{s.label}</div>
            </div>
          ))}
        </section>

        {/* Interactive explorer */}
        <section className="mt-8">
          <h2 className="sr-only">Explore every feature</h2>
          <PhoneDeck />
        </section>

        {/* Notes, summaries & flowcharts — interactive coverflow */}
        <section id="study" className="mt-16 scroll-mt-24">
          <div className="text-center">
            <span className="eyebrow"><BookOpen size={14} /> Learn it once, remember it</span>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl" style={{ color: "#0D1629" }}>Notes, summaries &amp; flowcharts</h2>
            <p className="mx-auto mt-2 max-w-2xl text-[15px] leading-7" style={{ color: "#4A5A78" }}>
              Every chapter is turned into beautiful full-page notes, a single-glance summary and a concept flowchart. Flip through the real thing — tap a page for full size.
            </p>
          </div>
          <div className="mt-8"><StudyPack /></div>
        </section>

        {/* More in the cockpit */}
        <section className="mt-16">
          <h2 className="text-center text-2xl font-black sm:text-3xl" style={{ color: "#0D1629" }}>More in the cockpit</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-[15px] leading-7" style={{ color: "#4A5A78" }}>
            The flagships above are just the start — here’s more of what’s packed into EARNWINGS.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MORE.map((m) => {
              const Icon = m.icon;
              return (
                <motion.div key={m.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45 }}
                  className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(27,58,122,0.08)", boxShadow: "0 20px 40px -30px rgba(27,58,122,0.35)" }}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "rgba(46,107,229,0.1)", color: "#2E6BE5" }}><Icon size={20} /></div>
                  <h3 className="mt-3 font-bold" style={{ color: "#1B3A7A" }}>{m.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-6" style={{ color: "#4A5A78" }}>{m.body}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* One app, every platform */}
        <section className="mt-16 grid items-center gap-6 rounded-3xl p-8 sm:grid-cols-[1fr_auto]" style={{ background: "rgba(255,255,255,0.82)", border: "1px solid rgba(27,58,122,0.1)" }}>
          <div>
            <h2 className="text-2xl font-black" style={{ color: "#1B3A7A" }}>One app, every platform</h2>
            <p className="mt-2 max-w-xl text-[15px] leading-7" style={{ color: "#41527A" }}>
              iOS, Android, Web, Mac and Windows from a single codebase — your progress, plans and perks follow you across every device.
            </p>
          </div>
          <div className="flex items-center gap-4 justify-self-start sm:justify-self-end" style={{ color: "#1B3A7A" }}>
            <Smartphone size={30} /><Monitor size={30} /><Plane size={30} />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-16 scroll-mt-24">
          <div className="text-center">
            <span className="eyebrow"><ListChecks size={14} /> Questions, answered</span>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl" style={{ color: "#0D1629" }}>Frequently asked questions</h2>
          </div>
          <div className="mx-auto mt-8 max-w-2xl divide-y" style={{ borderColor: "rgba(27,58,122,0.1)" }}>
            {FAQ.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-[16.5px] font-bold" style={{ color: "#1B3A7A" }}>
                  {item.q}
                  <ChevronRight size={18} className="shrink-0 transition-transform group-open:rotate-90" style={{ color: "#886611" }} />
                </summary>
                <p className="mt-2.5 text-[15px] leading-7" style={{ color: "#41527A" }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 overflow-hidden rounded-3xl px-6 py-12 text-center" style={{ background: "linear-gradient(150deg,#0f2450,#0a1836)" }}>
          <h2 className="text-3xl font-black text-white">Get all of it — earn your wings</h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-7" style={{ color: "#93A9D6" }}>
            Founder cadets get the full app for a week, plus RT sessions, unlocked chapters, sample papers, flight plans and more.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/#waitlist" className="btn-gold"><Plane size={18} /> Reserve My Captain Seat</Link>
            <Link to="/#play" className="rounded-full px-5 py-3 text-sm font-bold text-white" style={{ background: "rgba(255,255,255,0.1)" }}>Try it live</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
