import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ChevronDown, Sparkles, Plane, Lock } from "lucide-react";
import { CloudLayers } from "../components/CloudLayers";
import { easeOutExpo } from "../lib/motion";
import { CtaMicro } from "../components/CtaMicro";
import { track } from "../lib/track";
import { FOUNDER_SEATS } from "../lib/siteConfig";
import { HERO_H1, HERO_H1_BRAND, HERO_INTRO, HERO_CTA } from "../content/hero";

/*
 * Hero headline options (Task 1 — implementing #1):
 *   1. Pass DGCA faster. Fly sooner.
 *   2. India's smartest DGCA ground school.
 *   3. The cockpit every student pilot wishes they had on day one.
 * The outcome headline is the primary H1; the "EARN YOUR WINGS" split-flap
 * board is kept as the supporting brand line (preserves the animation + brand).
 */

/**
 * Hero — editorial split, cinematic.
 *
 * Copy is anchored left like a magazine spread; the brand mark lives large on
 * the right, emerging from a drifting cloud bank. Depth comes from spring-based
 * pointer parallax + scroll parallax, and the only "moving" flourish is a single
 * gold route-streak tracing an arc behind the logo — no busy rings or chrome.
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Hold the "Earn Your Wings" flip until the intro splash has finished (so the
  // cadet actually watches it play). Returning visitors (no intro) reveal at once.
  const [revealed, setRevealed] = useState(
    () => typeof window === "undefined" || sessionStorage.getItem("ew_intro_seen_v1") === "1",
  );
  useEffect(() => {
    if (revealed) return;
    const on = () => setRevealed(true);
    window.addEventListener("ew:intro-done", on);
    const t = window.setTimeout(() => setRevealed(true), 12000); // safety net
    return () => { window.removeEventListener("ew:intro-done", on); window.clearTimeout(t); };
  }, [revealed]);

  // Pointer parallax: normalized -0.5..0.5, spring-smoothed for a weighty feel.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 50, damping: 20, mass: 0.7 });

  const logoX = useTransform(sx, (v) => v * 34);
  const logoY = useTransform(sy, (v) => v * 26);
  const logoRotY = useTransform(sx, (v) => v * 14);
  const logoRotX = useTransform(sy, (v) => v * -10);
  const glowX = useTransform(sx, (v) => v * 20);
  const glowY = useTransform(sy, (v) => v * 16);
  const cloudFgX = useTransform(sx, (v) => v * 48);

  // Scroll parallax: the whole stage drifts up and softens as you leave.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  function handlePointer(e: React.PointerEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function resetPointer() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      onPointerMove={handlePointer}
      onPointerLeave={resetPointer}
      className="relative flex min-h-screen w-full items-center overflow-hidden"
    >
      <CloudLayers />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-5 pt-28 pb-24 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4">
        {/* ================= LEFT — editorial copy ================= */}
        <motion.div
          style={{ y: copyY }}
          className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left"
        >
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="pill mb-6"
            style={{
              background: "rgba(255,255,255,0.66)",
              color: "#9a7415",
              border: "1px solid rgba(201,152,31,0.35)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 6px 20px -10px rgba(201,152,31,0.5)",
            }}
          >
            <Sparkles size={14} /> DGCA CPL &amp; ATPL prep, reimagined
          </motion.span>

          {/* Primary outcome headline (Task 1). Brand kept in title/meta + sr-only. */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 22 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="font-black tracking-tight"
            style={{ fontSize: "clamp(2.3rem,5.6vw,4rem)", lineHeight: 1.02, color: "#0D1629" }}
          >
            {HERO_H1[0]}<span className="text-gradient-gold">{HERO_H1[1]}</span>
            <br />{HERO_H1[2]}<span className="sr-only">{HERO_H1_BRAND}</span>
          </motion.h1>

          {/* Supporting brand line — the split-flap board, preserved (decorative) */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 18 }}
            transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.1 }}
            className="mt-4 font-black uppercase leading-none"
            style={{ fontSize: "clamp(1.5rem,4.4vw,2.9rem)" }}
          >
            <div className="flex justify-center lg:justify-start">
              <SplitFlapWord text="Earn Your" startDelay={250} start={revealed} />
            </div>
            <div className="mt-[0.16em] flex justify-center lg:justify-start">
              <SplitFlapWord text="Wings" startDelay={1500} start={revealed} />
            </div>
          </motion.div>

          {/* Departure-board status line — completes the airport concept */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: revealed ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mt-4 flex items-center gap-2 font-mono text-[0.72rem] font-bold tracking-[0.18em]"
            style={{ color: "#9a7415" }}
          >
            <motion.span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: "#22c55e" }}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            />
            FLIGHT EW-001 · NOW BOARDING
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.3 }}
            className="mt-7 max-w-xl text-[1.12rem] leading-relaxed sm:text-lg"
            style={{ color: "#40506e" }}
          >
            {HERO_INTRO}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.4 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:items-start"
          >
            <a
              href="#waitlist"
              onClick={() => track("hero_cta_click", { cta: "primary" })}
              className="btn-gold"
              style={{ fontSize: "1.15rem", padding: "1.05rem 2.1rem" }}
            >
              <Plane size={20} /> {HERO_CTA}
            </a>
            <a
              href="#play"
              onClick={() => track("hero_cta_click", { cta: "secondary" })}
              className="btn-ghost"
              style={{ fontSize: "1.15rem", padding: "1.05rem 2.1rem" }}
            >
              Try it live — no signup
            </a>
          </motion.div>

          <CtaMicro className="lg:text-left" />

          {/* Scarcity strip (Task 1) — cohort framing, loss made explicit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold"
            style={{
              background: "rgba(201,152,31,0.12)",
              color: "#9a7415",
              border: "1px solid rgba(201,152,31,0.3)",
            }}
          >
            <Lock size={13} />
            Only the first {FOUNDER_SEATS} become Founding Cadets — these perks
            lock in now and disappear at public launch.
          </motion.div>
        </motion.div>

        {/* ================= RIGHT — the logo, emerging from cloud ================= */}
        <motion.div
          style={{ y: stageY, opacity: stageOpacity, perspective: 1200 }}
          className="relative order-1 flex h-[clamp(340px,60vh,620px)] items-center justify-center lg:order-2"
        >
          {/* Soft gold glow bloom behind the mark */}
          <motion.div
            aria-hidden
            style={{ x: glowX, y: glowY }}
            className="pointer-events-none absolute h-[72%] w-[72%] max-h-[480px] max-w-[480px] rounded-full"
          >
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(245,217,122,0.5) 0%, rgba(201,152,31,0.16) 40%, transparent 70%)",
                filter: "blur(8px)",
                animation: "haloPulse 7s ease-in-out infinite",
              }}
            />
          </motion.div>

          {/* Single cinematic route-streak arcing behind the logo */}
          <RouteStreak />

          {/* The mark itself — float + pointer-driven 3D tilt, base veiled by cloud */}
          <motion.div
            style={{
              x: logoX,
              y: logoY,
              rotateX: logoRotX,
              rotateY: logoRotY,
              transformStyle: "preserve-3d",
            }}
            className="relative z-10"
          >
            {/* Golden wingtip contrails, tucked behind the plane */}
            <Contrails />
            <motion.img
              src="/assets/logo-mark.webp"
              srcSet="/assets/logo-mark-320.webp 320w, /assets/logo-mark.webp 512w"
              sizes="(max-width: 640px) 340px, 560px"
              alt="EARNWINGS"
              draggable={false}
              initial={{ opacity: 0, scale: 0.72, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, ease: easeOutExpo, delay: 0.15 }}
              className="h-[clamp(270px,52vh,560px)] w-auto select-none"
              style={{
                filter:
                  "drop-shadow(0 28px 46px rgba(13,22,41,0.3)) drop-shadow(0 6px 14px rgba(201,152,31,0.32))",
                animation: "floaty 7.5s ease-in-out infinite",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 78%, transparent 99%)",
                maskImage:
                  "linear-gradient(to bottom, black 78%, transparent 99%)",
              }}
            />
          </motion.div>

          {/* Drifting foreground cloud bank — sells "emerging from the clouds" */}
          <motion.div
            style={{ x: cloudFgX }}
            className="pointer-events-none absolute inset-0 z-20"
          >
            <motion.div
              className="absolute bottom-[6%] left-[-6%] h-40 w-[70%] rounded-full"
              style={{
                background:
                  "radial-gradient(58% 58% at 50% 50%, rgba(255,255,255,0.95), rgba(255,255,255,0) 72%)",
                filter: "blur(6px)",
              }}
              animate={{ x: [0, 34, 0] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[-4%] right-[-10%] h-52 w-[80%] rounded-full"
              style={{
                background:
                  "radial-gradient(58% 58% at 50% 50%, rgba(255,255,255,0.98), rgba(255,255,255,0) 70%)",
                filter: "blur(8px)",
              }}
              animate={{ x: [0, -40, 0] }}
              transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue → the cockpit orbit section */}
      <motion.a
        href="#cockpit"
        className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-xs font-semibold"
        style={{ color: "#5F7499" }}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        Scroll to explore
        <ChevronDown size={18} />
      </motion.a>
    </section>
  );
}

/* ---------- One elegant gold route-streak that traces an arc ---------- */
function RouteStreak() {
  return (
    <svg
      viewBox="0 0 460 460"
      aria-hidden
      className="pointer-events-none absolute h-[92%] w-[92%] max-h-[600px] max-w-[600px]"
    >
      <defs>
        <linearGradient id="route-bright" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5d97a" stopOpacity="0" />
          <stop offset="0.6" stopColor="#f5d97a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#c9981f" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* faint full route the streak rides along, drawn in on load */}
      <motion.path
        d="M40 360 C 120 210, 230 150, 300 120 S 430 90, 430 60"
        fill="none"
        stroke="rgba(201,152,31,0.32)"
        strokeWidth="2"
        strokeDasharray="2 10"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: easeOutExpo, delay: 0.5 }}
      />

      {/* bright light-streak travelling along the same arc */}
      <motion.path
        d="M40 360 C 120 210, 230 150, 300 120 S 430 90, 430 60"
        fill="none"
        stroke="url(#route-bright)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="34 520"
        initial={{ strokeDashoffset: 554 }}
        animate={{ strokeDashoffset: -34 }}
        transition={{
          duration: 3.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.4,
        }}
      />
    </svg>
  );
}

/* ---------- Golden vapor contrails streaming off the wingtips ---------- */
function Contrails() {
  const LEFT = "M72 352 C 60 432, 42 505, 6 636";
  const RIGHT = "M440 352 C 452 432, 470 505, 506 636";
  return (
    <motion.svg
      viewBox="0 0 512 640"
      preserveAspectRatio="none"
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-0 w-full overflow-visible"
      style={{ height: "125%" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.6 }}
    >
      <defs>
        <linearGradient
          id="trail-left"
          x1="72"
          y1="352"
          x2="6"
          y2="636"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fff2cc" stopOpacity="1" />
          <stop offset="0.4" stopColor="#f0c256" stopOpacity="0.62" />
          <stop offset="1" stopColor="#c9981f" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="trail-right"
          x1="440"
          y1="352"
          x2="506"
          y2="636"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fff2cc" stopOpacity="1" />
          <stop offset="0.4" stopColor="#f0c256" stopOpacity="0.62" />
          <stop offset="1" stopColor="#c9981f" stopOpacity="0" />
        </linearGradient>
        <filter id="trail-blur" x="-60%" y="-10%" width="220%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* wide soft vapor glow */}
      <path
        d={LEFT}
        fill="none"
        stroke="url(#trail-left)"
        strokeWidth="40"
        strokeLinecap="round"
        filter="url(#trail-blur)"
        opacity="0.55"
      />
      <path
        d={RIGHT}
        fill="none"
        stroke="url(#trail-right)"
        strokeWidth="40"
        strokeLinecap="round"
        filter="url(#trail-blur)"
        opacity="0.55"
      />
      {/* fuller body */}
      <path
        d={LEFT}
        fill="none"
        stroke="url(#trail-left)"
        strokeWidth="15"
        strokeLinecap="round"
      />
      <path
        d={RIGHT}
        fill="none"
        stroke="url(#trail-right)"
        strokeWidth="15"
        strokeLinecap="round"
      />
      {/* bright inner cores */}
      <path
        d={LEFT}
        fill="none"
        stroke="url(#trail-left)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d={RIGHT}
        fill="none"
        stroke="url(#trail-right)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* travelling exhaust pulses */}
      <motion.path
        d={LEFT}
        fill="none"
        stroke="#fff3cf"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="20 660"
        opacity="0.85"
        initial={{ strokeDashoffset: 680 }}
        animate={{ strokeDashoffset: -20 }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeIn", delay: 1 }}
      />
      <motion.path
        d={RIGHT}
        fill="none"
        stroke="#fff3cf"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="20 660"
        opacity="0.85"
        initial={{ strokeDashoffset: 680 }}
        animate={{ strokeDashoffset: -20 }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          ease: "easeIn",
          delay: 1.35,
        }}
      />
    </motion.svg>
  );
}

/* ---------- Airport split-flap board that shuffles into the word ---------- */
const FLAP_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function SplitFlapWord({
  text,
  startDelay = 0,
  start = true,
}: {
  text: string;
  startDelay?: number;
  start?: boolean;
}) {
  const target = text.toUpperCase();
  const slots = target.split("");
  // Displayed glyph + a per-slot "tick" counter that re-keys the flap animation.
  const [display, setDisplay] = useState<string[]>(() =>
    slots.map((c) => (c === " " ? " " : "")), // blank until it starts — no "AAAA" flash
  );
  const [ticks, setTicks] = useState<number[]>(() => slots.map(() => 0));

  useEffect(() => {
    if (!start) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    slots.forEach((finalCh, i) => {
      if (finalCh === " ") return;
      const spins = 18 + i * 2; // longer — later tiles keep spinning
      const begin = window.setTimeout(() => {
        let count = 0;
        const iv = window.setInterval(() => {
          count += 1;
          if (count >= spins) {
            window.clearInterval(iv);
            setDisplay((d) => {
              const n = [...d];
              n[i] = finalCh;
              return n;
            });
          } else {
            setDisplay((d) => {
              const n = [...d];
              n[i] = FLAP_GLYPHS[Math.floor(Math.random() * FLAP_GLYPHS.length)];
              return n;
            });
          }
          setTicks((t) => {
            const n = [...t];
            n[i] = count;
            return n;
          });
        }, 76);
        timers.push(iv as unknown as ReturnType<typeof setTimeout>);
      }, startDelay + i * 115);
      timers.push(begin);
    });
    return () => timers.forEach((t) => clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  return (
    <span className="inline-flex gap-[0.09em]">
      {slots.map((finalCh, i) =>
        finalCh === " " ? (
          <span key={i} className="w-[0.42em]" />
        ) : (
          <span
            key={i}
            className="flap-tile"
            style={{ perspective: "300px" }}
          >
            <motion.span
              key={`${display[i]}-${ticks[i]}`}
              initial={{ rotateX: -82, opacity: 0.35 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.13, ease: easeOutExpo }}
              className="block"
              style={{ transformStyle: "preserve-3d" }}
            >
              {display[i]}
            </motion.span>
          </span>
        ),
      )}
    </span>
  );
}
