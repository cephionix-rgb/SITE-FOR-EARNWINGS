import { useMemo, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plane, Trophy, Gift, Check, X, Zap, ChevronRight, Sparkles, Lock } from "lucide-react";
import { inView, rise } from "../lib/motion";
import { QUIZ_PASS_MARK as PASS } from "../lib/siteConfig";

const ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined;

/**
 * ONE ATTEMPT ONLY. Commander Wings double a cadet's founder perks, so the quiz
 * has to mean something — a retry loop would let anyone brute-force their way to
 * 8/10. The finished attempt is stored here so a reload, a re-visit or a second
 * scroll past the section shows the same final score instead of a fresh quiz.
 * Enforced again server-side in apps-script/EarnwingsWaitlist.gs (_upgrade
 * refuses a row that already has a Quiz Score).
 */
const ATTEMPT_KEY = "ew_quiz";

type Attempt = { score: number; at: string };

function loadAttempt(): Attempt | null {
  try {
    const a = JSON.parse(localStorage.getItem(ATTEMPT_KEY) || "null");
    return a && Number.isFinite(Number(a.score)) ? { score: Number(a.score), at: String(a.at || "") } : null;
  } catch {
    return null;
  }
}

/** 10 basics-of-aviation questions. answer = index of the correct option. */
const QUIZ: { q: string; opts: string[]; a: number }[] = [
  { q: "Which flight control surface makes an aeroplane roll?", opts: ["Rudder", "Elevator", "Ailerons", "Flaps"], a: 2 },
  { q: "What does “VFR” stand for?", opts: ["Visual Flight Rules", "Variable Flight Ratio", "Vertical Flight Reference", "Very Fast Route"], a: 0 },
  { q: "The four forces acting in flight are lift, weight, thrust and…?", opts: ["Torque", "Drag", "Friction", "Momentum"], a: 1 },
  { q: "Standard sea-level atmospheric pressure is about:", opts: ["950 hPa", "1013 hPa", "1113 hPa", "850 hPa"], a: 1 },
  { q: "On the radio, “MAYDAY” signals:", opts: ["Low fuel", "A life-threatening emergency", "A position report", "Request to taxi"], a: 1 },
  { q: "Which instrument shows the aircraft’s heading?", opts: ["Altimeter", "Airspeed indicator", "Heading indicator", "Vertical speed indicator"], a: 2 },
  { q: "One nautical mile is approximately:", opts: ["1.609 km", "1.852 km", "1.000 km", "2.000 km"], a: 1 },
  { q: "Which control surface controls pitch (nose up / down)?", opts: ["Aileron", "Rudder", "Elevator", "Spoiler"], a: 2 },
  { q: "“QNH” set on the altimeter makes it read:", opts: ["Height above the runway", "Altitude above mean sea level", "A standard flight level", "Cabin altitude"], a: 1 },
  { q: "Squawking 7700 on the transponder means:", opts: ["Radio failure", "Unlawful interference", "General emergency", "Normal operations"], a: 2 },
];

/** Founder perks: Cadet baseline → Commander (earned by passing the quiz). */
const PERKS: { label: string; cadet: string; commander: string; up: boolean }[] = [
  { label: "Full app access", cadet: "7 days", commander: "10 days", up: true },
  { label: "Chapters / subject", cadet: "2", commander: "4", up: true },
  { label: "Chapter MCQ sets", cadet: "2", commander: "4", up: true },
  { label: "Sample paper / subject", cadet: "1", commander: "1", up: false },
  { label: "RT scenarios", cadet: "5", commander: "10", up: true },
  { label: "Flight plans", cadet: "5", commander: "10", up: true },
  { label: "Weight & balance", cadet: "5", commander: "10", up: true },
  { label: "METAR challenges", cadet: "5", commander: "10", up: true },
  { label: "Compete matches", cadet: "5", commander: "10", up: true },
  { label: "Ask-Captain doubts", cadet: "5", commander: "10", up: true },
];

const rankFor = (c: number) =>
  c >= PASS ? "Commander" :
  c >= Math.ceil(PASS * 0.75) ? "Captain" :
  c >= Math.ceil(PASS * 0.5) ? "First Officer" :
  c >= 1 ? "Trainee Pilot" : "Cadet";

/** Gold particle burst when Commander Wings are earned. */
function Burst({ trigger }: { trigger: number }) {
  const parts = Array.from({ length: 22 }, (_, i) => i);
  return (
    <AnimatePresence>
      {trigger > 0 && (
        <motion.div key={trigger} className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
          {parts.map((i) => {
            const ang = (i / parts.length) * Math.PI * 2;
            const dist = 120 + (i % 4) * 46;
            return (
              <motion.span key={i} className="absolute rounded-full" style={{ width: 9, height: 9, background: i % 2 ? "#F5D97A" : "#C9981F" }}
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }} animate={{ opacity: 0, x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, scale: 0.3 }}
                transition={{ duration: 1.2, ease: "easeOut" }} />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Vertical "climb" gauge — the pilot rises Cadet → Commander as answers land. */
function Climb({ correct }: { correct: number }) {
  const unlocked = correct >= PASS;
  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: 480, background: "linear-gradient(180deg,#060B1C 0%,#0A1836 14%,#12295C 30%,#1B3A7A 46%,#2E6BE5 62%,#5BA4E8 76%,#A9CEF4 88%,#EAD9A8 100%)", boxShadow: "inset 0 0 60px rgba(0,0,0,0.25)" }}>
      {[[12, 6], [30, 10], [46, 5], [64, 9], [80, 7], [22, 16], [56, 18], [74, 14], [88, 12]].map(([l, t], i) => (
        <span key={i} className="absolute rounded-full bg-white" style={{ left: `${l}%`, top: `${t}%`, width: i % 3 ? 2 : 3, height: i % 3 ? 2 : 3, opacity: 0.8 - t / 40 }} />
      ))}
      {/* sunrise glow */}
      <div className="pointer-events-none absolute -bottom-16 left-1/2 h-56 w-[130%] -translate-x-1/2 rounded-[50%]" style={{ background: "radial-gradient(circle,rgba(245,217,122,0.5),transparent 62%)" }} />

      {/* Commander Wings line (the PASS/10 reward threshold) */}
      <div className="absolute inset-x-0 flex items-center gap-2 px-3" style={{ bottom: `${8 + (PASS / QUIZ.length) * 74}%` }}>
        <div className="h-px flex-1" style={{ background: "repeating-linear-gradient(90deg,#F5D97A,#F5D97A 7px,transparent 7px,transparent 13px)" }} />
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider" style={{ background: unlocked ? "#F5D97A" : "rgba(245,217,122,0.2)", color: unlocked ? "#3d2c00" : "#F5D97A" }}>
          {unlocked ? <Check size={9} /> : <Lock size={9} />} Commander Wings
        </span>
      </div>

      {/* contrail */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "8%", width: 4, height: `${Math.max(0, (correct / QUIZ.length) * 74)}%`, background: "linear-gradient(180deg,rgba(245,217,122,0.9),rgba(245,217,122,0) 92%)", borderRadius: 4, transition: "height 0.7s cubic-bezier(0.16,1,0.3,1)" }} />

      {/* the climbing plane */}
      <div className="absolute left-1/2 z-20 -translate-x-1/2" style={{ bottom: `${8 + (correct / QUIZ.length) * 74}%`, transition: "bottom 0.7s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="relative">
          <div className="absolute -inset-4 rounded-full" style={{ background: "radial-gradient(circle,rgba(245,217,122,0.4),transparent 70%)" }} />
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white shadow-xl" style={{ background: "linear-gradient(150deg,#2E6BE5,#1B3A7A)" }}>
            <Plane size={20} className="-rotate-[38deg]" style={{ color: "#F5D97A" }} fill="#F5D97A" />
          </div>
        </motion.div>
      </div>

      {/* readout — top-left, clear of the centered climbing plane */}
      <div className="absolute left-0 top-0 p-3 text-left">
        <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#F5D97A", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}>Rank</div>
        <div className="text-xl font-black leading-tight text-white" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>{rankFor(correct)}</div>
        <div className="text-[11px]" style={{ color: "#e3ecfb", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}>{correct} / {QUIZ.length} correct</div>
      </div>
    </div>
  );
}

export function JourneySection() {
  // A stored attempt means the cadet has already used their one shot.
  const [attempt, setAttempt] = useState<Attempt | null>(() => loadAttempt());
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [burst, setBurst] = useState(0);
  const recorded = useRef(false);

  const joined = useMemo(() => {
    try { return !!localStorage.getItem("ew_waitlist"); } catch { return false; }
  }, []);

  const done = attempt !== null;
  const score = attempt ? attempt.score : correct; // final score once locked, live count while flying
  const passed = score >= PASS;

  function choose(i: number) {
    if (done || picked !== null) return; // attempt spent, or this one is already answered
    setPicked(i);
    if (i === QUIZ[qi].a) {
      const c = correct + 1;
      setCorrect(c);
      if (c === PASS) setBurst((b) => b + 1); // the moment wings are earned
    }
  }

  function next() {
    if (qi < QUIZ.length - 1) {
      setQi((n) => n + 1);
      setPicked(null);
      return;
    }

    // Last question — the attempt is over. Lock the score in; there is no retry.
    const finalScore = correct;
    try {
      localStorage.setItem(ATTEMPT_KEY, JSON.stringify({ score: finalScore, at: new Date().toISOString() }));
    } catch { /* ignore — the in-memory lock below still holds for this session */ }
    setAttempt({ score: finalScore, at: new Date().toISOString() });

    // Already on the waitlist and passed? Record the Commander upgrade on their row.
    // If they join *after* the quiz, Waitlist.tsx replays this from the stored attempt.
    if (finalScore >= PASS && joined && ENDPOINT && !recorded.current) {
      recorded.current = true;
      try {
        const { code, email } = JSON.parse(localStorage.getItem("ew_waitlist") || "{}");
        fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "upgrade", code, email, score: finalScore }) }).catch(() => {});
      } catch { /* ignore */ }
    }
  }

  const q = QUIZ[qi];

  return (
    <section id="journey" className="section">
      <motion.div variants={rise} initial="hidden" whileInView="show" viewport={inView} className="mx-auto max-w-2xl text-center">
        <span className="eyebrow"><Zap size={14} /> Gamified journey</span>
        <h2 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-tight" style={{ color: "#0D1629" }}>
          Climb from <span style={{ color: "#5BA4E8" }}>Cadet</span> to <span className="text-gradient-gold">Commander</span>
        </h2>
        <p className="mt-4 text-lg" style={{ color: "#40506e" }}>
          DGCA prep is a grind — so every chapter, mock and flight plan earns XP and moves you up a rank.
          Prove your basics: answer <b>{PASS} of {QUIZ.length}</b> aviation questions correctly to earn your{" "}
          <b style={{ color: "#C9981F" }}>Commander Wings</b> — and every founder perk <b>doubles</b>.
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-bold"
          style={{ background: "rgba(27,58,122,0.07)", color: "#1B3A7A" }}>
          <Lock size={13} /> One attempt only — like the real checkride, there is no retake.
        </p>
      </motion.div>

      <motion.div variants={rise} initial="hidden" whileInView="show" viewport={inView}
        className="relative mx-auto mt-12 grid max-w-5xl gap-6 rounded-[2rem] p-4 sm:p-6 md:grid-cols-[280px_1fr]"
        style={{ background: "linear-gradient(180deg,#EBF3FF,#DCEBFB)", border: "1px solid rgba(27,58,122,0.08)", boxShadow: "0 40px 90px -40px rgba(27,58,122,0.35)" }}>
        <Burst trigger={burst} />

        <Climb correct={score} />

        {/* Right: quiz or result */}
        <div className="flex min-h-[480px] flex-col rounded-2xl bg-white p-5 sm:p-6" style={{ boxShadow: "0 10px 30px -18px rgba(27,58,122,0.3)" }}>
          {!done ? (
            <>
              <div className="flex items-center justify-between">
                <span className="pill" style={{ background: "rgba(27,58,122,0.08)", color: "#1B3A7A" }}>Question {qi + 1} / {QUIZ.length}</span>
                <span className="text-sm font-bold" style={{ color: "#C9981F" }}>{correct} correct</span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "#E4EEFF" }}>
                <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#C9981F,#F5D97A)" }} animate={{ width: `${((qi + (picked !== null ? 1 : 0)) / QUIZ.length) * 100}%` }} transition={{ duration: 0.4 }} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={qi} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mt-5 flex-1">
                  <h3 className="text-lg font-extrabold leading-snug" style={{ color: "#1B3A7A" }}>{q.q}</h3>
                  <div className="mt-4 grid gap-2.5">
                    {q.opts.map((opt, i) => {
                      const isAns = i === q.a;
                      const isPicked = picked === i;
                      let bg = "#F0F5FF", border = "rgba(27,58,122,0.12)", color = "#1B3A7A", icon = null as ReactNode;
                      if (picked !== null) {
                        if (isAns) { bg = "rgba(34,160,90,0.12)"; border = "rgba(34,160,90,0.5)"; color = "#177245"; icon = <Check size={16} />; }
                        else if (isPicked) { bg = "rgba(220,38,38,0.1)"; border = "rgba(220,38,38,0.45)"; color = "#b91c1c"; icon = <X size={16} />; }
                        else { color = "#8aa0c8"; }
                      }
                      return (
                        <button key={opt} onClick={() => choose(i)} disabled={picked !== null}
                          className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-[15px] font-semibold transition-colors"
                          style={{ background: bg, borderColor: border, color, cursor: picked !== null ? "default" : "pointer" }}>
                          {opt}
                          {icon}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Screen-reader announcement of the result after each answer */}
              <div aria-live="polite" className="sr-only">
                {picked !== null
                  ? picked === q.a
                    ? "Correct."
                    : "Incorrect. The correct answer is highlighted."
                  : ""}
              </div>

              <button onClick={next} disabled={picked === null} className="btn-gold mt-5 w-full text-base disabled:opacity-40">
                {qi < QUIZ.length - 1 ? <>Next question <ChevronRight size={18} /></> : <>See my wings <Trophy size={18} /></>}
              </button>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-1 flex-col">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: passed ? "linear-gradient(135deg,#F5D97A,#C9981F)" : "rgba(27,58,122,0.1)" }}>
                  {passed ? <Trophy size={30} color="#3d2c00" /> : <Plane size={28} color="#1B3A7A" />}
                </div>
                <h3 className="mt-3 text-2xl font-black" style={{ color: "#1B3A7A" }}>
                  {passed ? "Commander Wings earned!" : "So close, Cadet"}
                </h3>
                <p className="mt-1 text-sm" style={{ color: "#4A5A78" }}>
                  You scored <b style={{ color: "#C9981F" }}>{score} / {QUIZ.length}</b>.{" "}
                  {passed
                    ? "Your founder perks just doubled."
                    : `You needed ${PASS} to earn your wings — your Cadet perks are still yours.`}
                </p>
              </div>

              {/* Perk reveal */}
              <div className="mt-5 rounded-2xl p-4" style={{ background: passed ? "#FFF8E7" : "rgba(27,58,122,0.04)", border: `1px solid ${passed ? "rgba(201,152,31,0.3)" : "rgba(27,58,122,0.08)"}` }}>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: "#8a6a12" }}>
                  <Gift size={13} /> {passed ? "Commander perks unlocked" : "Your founder perks"}
                </div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {PERKS.map((p) => (
                    <li key={p.label} className="flex items-center justify-between gap-2 text-[13px]" style={{ color: "#40506e" }}>
                      <span>{p.label}</span>
                      <span className="font-bold tabular-nums">
                        {passed && p.up ? (
                          <>
                            <span className="mr-1 text-[11px] font-semibold line-through" style={{ color: "#9aa8c4" }}>{p.cadet}</span>
                            <span style={{ color: "#C9981F" }}>{p.commander}</span>
                          </>
                        ) : (
                          <span style={{ color: passed ? "#177245" : "#1B3A7A" }}>{passed ? p.commander : p.cadet}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {passed && joined && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs font-semibold" style={{ color: "#177245" }}>
                  <Sparkles size={13} /> Saved to your founder account — you'll board as a Commander.
                </p>
              )}

              <div className="mt-auto flex flex-col gap-2.5 pt-5">
                {!joined && (
                  <a href="#waitlist" className="btn-gold w-full text-base"><Zap size={18} /> {passed ? "Claim these perks — Reserve My Captain Seat" : "Reserve My Captain Seat"}</a>
                )}
                {/* No retry — the attempt is spent. See ATTEMPT_KEY above. */}
                <p className="flex items-center justify-center gap-1.5 rounded-full py-2.5 text-center text-xs font-semibold"
                  style={{ background: "rgba(27,58,122,0.06)", color: "#4A5A78" }}>
                  <Lock size={13} /> One attempt only — this score is final.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
