import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  Gavel,
  LayoutGrid,
  MessageSquareQuote,
  Plane,
  Quote,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { CloudBackground } from "../components/CloudBackground";
import { PhoneFrame } from "../components/DeviceFrame";
import { Instructors } from "../components/Instructors";
import { Link } from "../lib/router";
import { FEATURES } from "../lib/data";
import { FAQ } from "../content/faq";
import { prefersReducedMotion } from "../lib/scroll";
import { inView, rise } from "../lib/motion";
import {
  AI_CAPTAIN_TRAINED,
  COMPANY_NAME,
  CREDIBILITY_LINE,
  FOUNDER_SEATS,
  NEURALWINGS_URL,
  siteStats,
} from "../lib/siteConfig";

// ---------------------------------------------------------------------------
// TRUTHFULNESS: same rule as content/faq.js — every claim on this page must be
// real. No invented people, dates, funding, user counts, pricing or DGCA
// affiliation. Numbers come from siteConfig; capability claims describe what the
// app actually ships.
// ---------------------------------------------------------------------------

const NAVY = "#1B3A7A";
const INK = "#0D1629";
const BODY = "#41527A";
const MUTED = "#4A5A78";

/** Section heading block — eyebrow + title + optional lede, used throughout. */
function Heading({
  eyebrow,
  icon: Icon,
  title,
  lede,
  center = true,
}: {
  eyebrow: string;
  icon?: LucideIcon;
  title: ReactNode;
  lede?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="eyebrow">
        {Icon ? <Icon size={14} /> : null} {eyebrow}
      </span>
      <h2 className="mt-3 text-[clamp(1.5rem,3.2vw,2.1rem)] font-black leading-tight" style={{ color: INK }}>
        {title}
      </h2>
      {lede ? (
        <p className="mt-3 text-[15.5px] leading-7" style={{ color: MUTED }}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Counts up to `to` the first time it reaches the viewport (instant under
 * reduced motion). Driven by a scroll listener rather than an IntersectionObserver
 * so a fast flick — or landing further down the page — can never leave the tile
 * frozen on 0: anything at or above the fold has already "arrived".
 */
function CountUp({ to, decorate }: { to: number; decorate?: (n: number) => string }) {
  const reduced = prefersReducedMotion();
  const [n, setN] = useState(reduced ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let running = false;

    const start = () => {
      if (running) return;
      running = true;
      window.removeEventListener("scroll", check);
      const t0 = performance.now();
      const dur = 1100;
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        // easeOutExpo — fast off the mark, settles gently on the real figure
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setN(Math.round(to * eased));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    function check() {
      if (!el) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) start();
    }

    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [to, reduced]);

  return <span ref={ref}>{decorate ? decorate(n) : n.toLocaleString("en-IN")}</span>;
}

// --- §1 -------------------------------------------------------------------
// The status quo vs. one cockpit. Left column is deliberately loose and
// scattered; the right one snaps to a single tidy list.

const SCATTERED = [
  "Five dense subjects across a shelf of books",
  "A question bank PDF with no marking scheme",
  "Flight planning practised on paper, never on real airways",
  "RT rehearsed in a classroom, if at all",
  "Weather chased across three different websites",
  "Progress tracked in a notebook — or not at all",
];

const COCKPIT = [
  `${siteStats.chapters} chapters mapped to the DGCA ground syllabus`,
  `${siteStats.questions.toLocaleString("en-IN")}+ questions marked the way the exam marks them`,
  "Real ATS airways, NOTAM-aware, with a printable pilot brief",
  "Voice RT that scores your phraseology as you speak it",
  "Live METARs, TAFs and SIGMETs, decoded line by line",
  `XP, ${siteStats.ranks} ranks and a journey map that shows the climb`,
];

function ProblemAndFix() {
  return (
    <div className="mt-10 grid gap-5 lg:grid-cols-2">
      {/* Before */}
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-7"
        style={{ background: "rgba(255,255,255,0.62)", border: "1px dashed rgba(27,58,122,0.22)" }}
      >
        <span className="pill" style={{ background: "rgba(27,58,122,0.07)", color: MUTED }}>
          How it usually goes
        </span>
        <h3 className="mt-4 text-xl font-black" style={{ color: NAVY }}>
          A dozen disconnected tools
        </h3>
        <ul className="mt-5 space-y-3">
          {SCATTERED.map((s, i) => (
            <motion.li
              key={s}
              initial={{ opacity: 0, x: -10, rotate: 0 }}
              whileInView={{ opacity: 1, x: 0, rotate: i % 2 ? 0.5 : -0.4 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-[14.5px] leading-6"
              style={{ background: "rgba(27,58,122,0.04)", color: MUTED }}
            >
              <X size={15} className="mt-1 shrink-0" style={{ color: "#9AA7C2" }} />
              {s}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* After */}
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-7"
        style={{
          background: "linear-gradient(160deg,#ffffff, #F3F8FF)",
          border: "1px solid rgba(201,152,31,0.35)",
          boxShadow: "0 30px 70px -40px rgba(27,58,122,0.5)",
        }}
      >
        <span className="pill" style={{ background: "#FFF3D6", color: "#8a6a12" }}>
          <Plane size={12} /> One cockpit
        </span>
        <h3 className="mt-4 text-xl font-black" style={{ color: NAVY }}>
          Everything on one panel
        </h3>
        <ul className="mt-5 space-y-3">
          {COCKPIT.map((s, i) => (
            <motion.li
              key={s}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="flex items-start gap-3 text-[14.5px] leading-6"
              style={{ color: BODY }}
            >
              <span
                aria-hidden
                className="mt-[7px] h-2 w-2 shrink-0 rounded-full"
                style={{ background: "#C9981F", boxShadow: "0 0 0 4px rgba(201,152,31,0.14)" }}
              />
              {s}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

// --- §3 -------------------------------------------------------------------
// How the cockpit was built, as a flight plan: waypoints down a dashed rail
// with a plane that tracks your scroll.

type Leg = { code: string; title: string; body: string };

const LEGS: Leg[] = [
  {
    code: "01 · SYLLABUS",
    title: "Start at the syllabus, not the app",
    body: `Every DGCA ground subject was broken down into modules, then chapters, then topics — ${siteStats.chapters} chapters in all, kept in the order you actually sit them. The app was built around that spine, not the other way round.`,
  },
  {
    code: "02 · MATERIAL",
    title: "Turn every chapter into three things",
    body: "Full-page visual notes, a one-glance summary and a concept flowchart. The same idea lands three different ways, so it sticks for the paper and for the aircraft.",
  },
  {
    code: "03 · THE CAPTAIN",
    title: "Ground the AI in that material",
    body: "The AI Captain answers from those notes and shows where the answer came from. Where the material doesn't cover something, it says so — it is built to refuse rather than to invent.",
  },
  {
    code: "04 · REAL DATA",
    title: "Wire in real aviation data",
    body: "Real ATS airways, waypoints and aerodromes; live METARs, TAFs and SIGMETs; NOTAM-aware rerouting and published procedures. Plan Delhi to Chennai and you are planning it over airways that exist.",
  },
  {
    code: "05 · THE EXAM",
    title: "Make the exam feel like the exam",
    body: "Composite papers for every subject with the DGCA's own marks, timing and figure questions — then a full Captain analysis of every answer you got wrong.",
  },
  {
    code: "06 · THE CLIMB",
    title: "Make the climb worth making",
    body: `XP comes from real work — notes read, topics closed, chapters finished, tests passed — and carries you up ${siteStats.ranks} ranks from Cadet to Commander, each one unlocking something real.`,
  },
];

function FlightPlanTimeline() {
  const reduced = prefersReducedMotion();
  const rail = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rail,
    offset: ["start 70%", "end 70%"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.4 });
  const planeTop = useTransform(smooth, [0, 1], ["0%", "100%"]);

  return (
    <div ref={rail} className="relative mt-10 pl-12 sm:pl-16">
      {/* dashed route + the leg flown so far */}
      <div
        aria-hidden
        className="absolute bottom-2 left-[18px] top-2 w-px sm:left-[26px]"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(27,58,122,0.32) 55%, transparent 0)",
          backgroundSize: "1px 12px",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute left-[17px] top-2 w-[3px] origin-top rounded-full sm:left-[25px]"
        style={{
          height: "calc(100% - 16px)",
          scaleY: reduced ? 1 : smooth,
          background: "linear-gradient(180deg,#F5D97A,#C9981F)",
          boxShadow: "0 0 12px rgba(201,152,31,0.5)",
        }}
      />
      {!reduced && (
        <motion.div
          aria-hidden
          className="absolute left-[6px] z-10 sm:left-[14px]"
          style={{ top: planeTop }}
        >
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{ background: "#fff", boxShadow: "0 6px 16px -4px rgba(27,58,122,0.5)", color: "#C9981F" }}
          >
            <Plane size={14} style={{ transform: "rotate(135deg)" }} />
          </span>
        </motion.div>
      )}

      <ol className="space-y-6">
        {LEGS.map((leg, i) => (
          <motion.li
            key={leg.code}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: (i % 2) * 0.05 }}
            className="relative rounded-2xl p-5 sm:p-6"
            style={{
              background: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(27,58,122,0.08)",
              boxShadow: "0 24px 50px -38px rgba(27,58,122,0.55)",
            }}
          >
            {/* waypoint dot on the rail */}
            <span
              aria-hidden
              className="absolute -left-[38px] top-7 h-3 w-3 rounded-full sm:-left-[46px]"
              style={{ background: "#fff", border: "2px solid #2E6BE5", boxShadow: "0 0 0 4px rgba(46,107,229,0.12)" }}
            />
            <span
              className="font-mono text-[11px] font-bold tracking-[0.18em]"
              style={{ color: "#9a7415" }}
            >
              {leg.code}
            </span>
            <h3 className="mt-2 text-[19px] font-black leading-snug" style={{ color: NAVY }}>
              {leg.title}
            </h3>
            <p className="mt-2 text-[15px] leading-7" style={{ color: BODY }}>
              {leg.body}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

// --- §4 -------------------------------------------------------------------

function CockpitSystems() {
  return (
    <div className="mt-10 space-y-6">
      {FEATURES.map((f, i) => (
        <motion.article
          key={f.key}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="grid items-center gap-6 overflow-hidden rounded-3xl p-6 sm:p-8 md:grid-cols-[1fr_auto]"
          style={{
            background: "rgba(255,255,255,0.86)",
            border: "1px solid rgba(27,58,122,0.08)",
            boxShadow: "0 30px 70px -45px rgba(27,58,122,0.6)",
          }}
        >
          <div className={i % 2 ? "md:order-2" : undefined}>
            <span className="pill" style={{ background: `${f.accent}1A`, color: f.accent }}>
              {f.title}
            </span>
            <h3 className="mt-3 text-[21px] font-black leading-snug" style={{ color: INK }}>
              {f.tagline}
            </h3>
            <p className="mt-2 text-[15px] leading-7" style={{ color: BODY }}>
              {f.desc}
            </p>
            <ul className="mt-4 space-y-2">
              {f.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-[14.5px] leading-6" style={{ color: MUTED }}>
                  <span
                    aria-hidden
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: f.accent }}
                  />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {f.screen ? (
            <div className={`justify-self-center ${i % 2 ? "md:order-1" : ""}`}>
              <PhoneFrame src={f.screen} alt={`${f.title} in the EARNWINGS app`} width={186} />
            </div>
          ) : null}
        </motion.article>
      ))}
    </div>
  );
}

// --- §5 -------------------------------------------------------------------

const BELIEFS: { icon: LucideIcon; title: string; body: ReactNode }[] = [
  {
    icon: Compass,
    title: "Real, not simulated",
    body: "Real ATS airways, real METARs, real DGCA marking. If it is in the app, it is grounded in genuine aviation data — never a plausible-looking mock-up.",
  },
  {
    icon: ShieldCheck,
    title: "It never bluffs",
    body: "The AI Captain answers from the course material and cites its source. Asked something the notes do not cover, it says so. A confident wrong answer is worse than no answer.",
  },
  {
    icon: Gavel,
    title: "Independent — and honest about it",
    body: "EARNWINGS follows the DGCA syllabus and exam pattern, but it is not affiliated with, endorsed by or approved by the DGCA. We would rather say that plainly than let a badge imply otherwise.",
  },
  {
    icon: LayoutGrid,
    title: "One cockpit, not twelve tabs",
    body: "Ground school, flight planning, radio telephony, weather, mock exams and progress belong on one panel. Switching apps mid-study is how momentum dies.",
  },
  {
    icon: Trophy,
    title: "Earned, not farmed",
    body: "XP comes from learning — notes read, topics closed, chapters finished, papers sat. Not from opening the app and tapping a streak button.",
  },
  {
    icon: MessageSquareQuote,
    title: "Straight answers",
    body: (
      <>
        Pricing is not finalised yet, and we will publish it before launch rather than bury it. What we
        collect and why is written plainly in the{" "}
        <Link to="/privacy" className="font-semibold underline" style={{ color: "#2E6BE5" }}>
          Privacy Policy
        </Link>
        .
      </>
    ),
  },
];

// ---------------------------------------------------------------------------

export function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const facts = [
    { value: <CountUp to={siteStats.subjects} />, label: "DGCA subjects" },
    { value: <CountUp to={siteStats.chapters} />, label: "Chapters mapped" },
    { value: <CountUp to={siteStats.questions} decorate={(n) => `${n.toLocaleString("en-IN")}+`} />, label: "Practice questions" },
    { value: <CountUp to={siteStats.ranks} />, label: "Ranks to climb" },
    { value: <CountUp to={FOUNDER_SEATS} />, label: "Founding cadet seats" },
  ];

  return (
    <div className="relative min-h-screen">
      <Nav solid />
      <CloudBackground />

      {/* Hero */}
      <header className="px-5 pb-6 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-1 text-sm font-semibold transition-colors"
            style={{ color: MUTED }}
          >
            <ChevronLeft size={16} /> Back to home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow">
              <Sparkles size={14} /> Our story
            </span>
            <h1 className="mt-3 text-[clamp(2.1rem,5vw,3.5rem)] font-black leading-tight" style={{ color: INK }}>
              Built by pilots-in-training,
              <br className="hidden sm:block" /> for{" "}
              <span className="text-gradient-gold">pilots-in-training</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8" style={{ color: "#40506e" }}>
              EARNWINGS is the all-in-one training cockpit for the next generation of Indian aviators —
              where ground school, flight planning, radio telephony and DGCA exam prep finally live in
              one place.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {[`A product of ${COMPANY_NAME}`, "Made in India", "Independent study platform"].map((chip) => (
                <span
                  key={chip}
                  className="pill"
                  style={{ background: "rgba(255,255,255,0.75)", color: NAVY, border: "1px solid rgba(27,58,122,0.1)" }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20 sm:px-6">
        {/* Why we built it */}
        <section className="mt-10">
          <Heading
            eyebrow="Why we built it"
            title="Becoming a pilot is hard enough without the tooling fighting you"
            lede="Becoming a commercial pilot in India means juggling five dense DGCA subjects, thousands of practice questions, real flight planning over live airways, radio-telephony fluency and a mountain of paperwork — usually across a dozen disconnected books, apps and coaching centres."
          />
          <ProblemAndFix />
          <p className="mx-auto mt-8 max-w-2xl text-center text-[16.5px] leading-8" style={{ color: BODY }}>
            We are building EARNWINGS so an aspiring pilot can open one app and{" "}
            <strong style={{ color: NAVY }}>learn, plan, practise and track the whole journey</strong> —
            grounded in real aviation data, guided by an AI captain that never bluffs, and turned into a
            climb you actually want to make.
          </p>
        </section>

        {/* By the numbers */}
        <section className="mt-16">
          <div
            className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl md:grid-cols-5"
            style={{ background: "rgba(27,58,122,0.09)", border: "1px solid rgba(27,58,122,0.09)" }}
          >
            {facts.map((f, i) => (
              <div
                key={f.label}
                // Odd count: the last tile spans the full width on the 2-col
                // layout so the grid never ends on an empty cell.
                className={`px-4 py-6 text-center ${i === facts.length - 1 ? "col-span-2 md:col-span-1" : ""}`}
                style={{ background: "rgba(255,255,255,0.88)" }}
              >
                <div className="text-[clamp(1.6rem,4vw,2.2rem)] font-black tabular-nums" style={{ color: "#C9981F" }}>
                  {f.value}
                </div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>
                  {f.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it was built */}
        <section className="mt-16">
          <Heading
            eyebrow="How it was built"
            icon={Compass}
            title="A flight plan, not a feature list"
            lede="Six decisions shaped everything in the app. They are the reason it behaves the way it does."
          />
          <FlightPlanTimeline />
        </section>

        {/* Systems */}
        <section className="mt-16">
          <Heading
            eyebrow="What's inside"
            icon={LayoutGrid}
            title="Five systems on one panel"
            lede="Each one would be an app on its own. Together they are a cockpit."
          />
          <CockpitSystems />
        </section>

        {/* Beliefs */}
        <section className="mt-16">
          <Heading
            eyebrow="What we believe"
            icon={ShieldCheck}
            title="The rules we hold ourselves to"
            lede="These are not slogans — every one of them costs us something, which is how you know we mean them."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BELIEFS.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    border: "1px solid rgba(27,58,122,0.08)",
                    boxShadow: "0 20px 40px -32px rgba(27,58,122,0.5)",
                  }}
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: "rgba(46,107,229,0.1)", color: "#2E6BE5" }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-3 font-black" style={{ color: NAVY }}>
                    {b.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-6" style={{ color: MUTED }}>
                    {b.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Who builds it */}
        <section className="mt-16">
          <Heading
            eyebrow="Who builds it"
            title={
              <>
                EARNWINGS is built and owned by <span className="text-gradient-navy">{COMPANY_NAME}</span>
              </>
            }
            lede={`${COMPANY_NAME} builds software for the two halves of Indian flight training — the schools that run it, and the students climbing through it.`}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <a
              href={NEURALWINGS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-3xl p-6 transition-transform hover:-translate-y-1 sm:p-7"
              style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(27,58,122,0.1)" }}
            >
              <span className="pill" style={{ background: "rgba(46,107,229,0.1)", color: "#2E6BE5" }}>
                For flight schools
              </span>
              <h3 className="mt-3 flex items-center gap-1.5 text-xl font-black" style={{ color: NAVY }}>
                Neural Wings <ExternalLink size={15} />
              </h3>
              <p className="mt-2 text-[14.5px] leading-7" style={{ color: MUTED }}>
                The FTO management platform — the system a flying training organisation runs its
                operation on.
              </p>
            </a>

            <div
              className="rounded-3xl p-6 sm:p-7"
              style={{
                background: "linear-gradient(160deg,#ffffff,#F3F8FF)",
                border: "1px solid rgba(201,152,31,0.35)",
              }}
            >
              <span className="pill" style={{ background: "#FFF3D6", color: "#8a6a12" }}>
                For student pilots
              </span>
              <h3 className="mt-3 text-xl font-black" style={{ color: NAVY }}>
                EARNWINGS
              </h3>
              <p className="mt-2 text-[14.5px] leading-7" style={{ color: MUTED }}>
                The training cockpit the students inside those schools learn, plan and practise in — and
                the product this site is about.
              </p>
            </div>
          </div>
          <p className="mt-5 text-center text-[13px] leading-6" style={{ color: "#6A83B4" }}>
            The app, its content and its technology are the property of {COMPANY_NAME} — see the{" "}
            <Link to="/copyright" className="font-semibold underline">
              Intellectual Property Notice
            </Link>
            .
          </p>
        </section>

        {/* Credibility */}
        <section className="mt-16">
          <div
            className="relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10"
            style={{ background: "linear-gradient(150deg,#0f2450,#0a1836)" }}
          >
            <Quote
              aria-hidden
              size={120}
              className="pointer-events-none absolute -right-4 -top-6 opacity-[0.07]"
              style={{ color: "#F5D97A" }}
            />
            <p className="relative max-w-3xl text-[clamp(1.15rem,2.4vw,1.5rem)] font-bold leading-relaxed text-white">
              {CREDIBILITY_LINE}
            </p>
            <p className="relative mt-4 max-w-2xl text-[15px] leading-7" style={{ color: "#93A9D6" }}>
              {AI_CAPTAIN_TRAINED}
            </p>
          </div>
          {/* Empty-safe: renders only once real, named instructors exist in siteConfig */}
          <Instructors />
        </section>

        {/* Straight answers */}
        <section className="mt-16">
          <Heading eyebrow="Straight answers" title="The questions people actually ask us" />
          <div className="mx-auto mt-8 max-w-2xl divide-y" style={{ borderColor: "rgba(27,58,122,0.1)" }}>
            {[FAQ[0], FAQ[2], FAQ[3]].map((item) => (
              <details key={item.q} className="group py-4">
                <summary
                  className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-[16.5px] font-bold"
                  style={{ color: NAVY }}
                >
                  {item.q}
                  <ChevronRight
                    size={18}
                    className="shrink-0 transition-transform group-open:rotate-90"
                    style={{ color: "#886611" }}
                  />
                </summary>
                <p className="mt-2.5 text-[15px] leading-7" style={{ color: BODY }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-sm">
            <Link to="/features#faq" className="font-bold" style={{ color: "#2E6BE5" }}>
              Read every answer →
            </Link>
          </p>
        </section>

        {/* CTA */}
        <section
          className="mt-16 overflow-hidden rounded-3xl px-6 py-12 text-center"
          style={{ background: "linear-gradient(150deg,#0f2450,#0a1836)" }}
        >
          <h2 className="text-3xl font-black text-white">Be one of the first to earn your wings</h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-7" style={{ color: "#93A9D6" }}>
            We are onboarding in small batches before launch — the first {FOUNDER_SEATS} to join become
            Founding Cadets, with early access and founder perks.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/#waitlist" className="btn-gold">
              <Plane size={18} /> Reserve My Captain Seat
            </Link>
            <Link
              to="/features"
              className="rounded-full px-5 py-3 text-sm font-bold text-white"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              Explore the cockpit
            </Link>
            <Link
              to="/#play"
              className="rounded-full px-5 py-3 text-sm font-bold text-white"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              Try it live
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
