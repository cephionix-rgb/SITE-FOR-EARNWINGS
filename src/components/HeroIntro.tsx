import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/** Bump the version to force the intro to show again for returning visitors. */
const SEEN_KEY = "ew_intro_seen_v1";

type Phase = "video" | "splash" | "done";

/**
 * Landing intro sequence:
 *  1. Full-screen 4K paper-airplane video plays WITH SOUND (no controls).
 *  2. On end, a cinematic branded splash animates in (emblem + drawing gold
 *     ring + light-swept wordmark).
 *  3. The splash slides DOWN, revealing the site beneath.
 * Shown once per browser session so it doesn't replay on navigation/refresh.
 */
export function HeroIntro() {
  const first = typeof window !== "undefined" && sessionStorage.getItem(SEEN_KEY) !== "1";
  const [phase, setPhase] = useState<Phase>(first ? "video" : "done");
  const [progress, setProgress] = useState(0);
  const [slide, setSlide] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const active = phase !== "done";

  // Phones get the dedicated 9:16 intro; desktop keeps the wide 4K one.
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  const introSrc = isMobile ? "/assets/paper-airplane-mobile.mp4" : "/assets/paper-airplane-intro-4k.mp4";
  const introPoster = isMobile ? "/assets/paper-airplane-mobile-poster.jpg" : "/assets/paper-airplane-intro-poster.jpg";

  // Lock scroll + pin to top while the overlay covers the page.
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  // Drive unmuted playback; if autoplay-with-sound is blocked, start on the
  // first user gesture. Only during the video phase.
  useEffect(() => {
    if (phase !== "video") return;
    const v = videoRef.current;
    let cleanup = () => {};
    if (v) {
      v.muted = isMobile; // phones: muted so it autoplays; desktop: with sound
      v.volume = 1;
      v.play().catch(() => {
        const start = () => {
          if (!videoRef.current) return;
          videoRef.current.muted = false;
          void videoRef.current.play().catch(() => {});
          cleanup();
        };
        const events = ["pointerdown", "keydown", "touchstart", "wheel"] as const;
        const opts = { once: true } as AddEventListenerOptions;
        events.forEach((e) => window.addEventListener(e, start, opts));
        cleanup = () => events.forEach((e) => window.removeEventListener(e, start));
      });
    }
    return () => cleanup();
  }, [phase]);

  // Hold the splash while the ring draws, then slide it down — and signal the
  // hero so its "Earn Your Wings" flip plays as the splash reveals the page.
  useEffect(() => {
    if (phase !== "splash") return;
    const t = setTimeout(() => {
      setSlide(true);
      try { window.dispatchEvent(new Event("ew:intro-done")); } catch { /* noop */ }
    }, 2000);
    return () => clearTimeout(t);
  }, [phase]);

  function finish() {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode — fine */
    }
    setPhase("done");
  }

  return (
    <AnimatePresence>
      {phase === "video" && (
        <motion.div
          key="ew-intro-video"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
        >
          <video
            ref={videoRef}
            src={introSrc}
            poster={introPoster}
            autoPlay
            playsInline
            muted={isMobile}
            preload="auto"
            onEnded={() => setPhase("splash")}
            onError={() => setPhase("splash")}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setProgress(v.currentTime / v.duration);
            }}
            className="h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)" }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
            <div
              className="h-full origin-left"
              style={{ transform: `scaleX(${progress})`, background: "linear-gradient(90deg,#F5D97A,#C9981F)" }}
            />
          </div>
        </motion.div>
      )}

      {phase === "splash" && (
        <motion.div
          key="ew-intro-splash"
          initial={{ y: 0 }}
          animate={{ y: slide ? "100%" : 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => {
            if (slide) finish();
          }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          style={{ background: "radial-gradient(130% 100% at 50% 38%, #12315F 0%, #0A1E44 42%, #06122B 100%)" }}
        >
          {/* slow-rotating gold ray glow */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[150vmax] w-[150vmax] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "repeating-conic-gradient(from 0deg, rgba(224,167,58,0.10) 0deg 6deg, transparent 6deg 22deg)",
              maskImage: "radial-gradient(circle, black 0%, transparent 58%)",
              WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 58%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          {/* soft central bloom */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(224,167,58,0.22), transparent 66%)" }}
          />
          {/* sparse star field */}
          <div className="pointer-events-none absolute inset-0">
            {STARS.map((s, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-white"
                style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r }}
                animate={{ opacity: [0.15, 0.9, 0.15] }}
                transition={{ duration: s.d, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
              />
            ))}
          </div>

          {/* centered brand lockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.34, 1.4, 0.64, 1], delay: 0.05 }}
            className="relative flex flex-col items-center text-center"
          >
            {/* drawing gold ring + emblem */}
            <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
              <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full -rotate-90">
                <defs>
                  <linearGradient id="ew-ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F7E39B" />
                    <stop offset="50%" stopColor="#E0A73A" />
                    <stop offset="100%" stopColor="#B8801E" />
                  </linearGradient>
                </defs>
                <circle cx="160" cy="160" r="150" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                <motion.circle
                  cx="160"
                  cy="160"
                  r="150"
                  fill="none"
                  stroke="url(#ew-ring)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={942}
                  initial={{ strokeDashoffset: 942 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  style={{ filter: "drop-shadow(0 0 6px rgba(224,167,58,0.6))" }}
                />
              </svg>
              <motion.img
                src="/assets/logo-mark.png"
                alt="EARNWINGS"
                className="relative h-36 w-36 sm:h-40 sm:w-40 drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* wordmark with a one-shot light sweep */}
            <div className="relative mt-6 overflow-hidden">
              <div className="text-[clamp(2.1rem,6.4vw,3.6rem)] font-black leading-none tracking-tight">
                <span style={{ color: "#E7B94B" }}>EARN</span>
                <span style={{ color: "#EAF1FF" }}>WINGS</span>
              </div>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-1/3"
                style={{ background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.75), transparent)" }}
                initial={{ x: "-160%" }}
                animate={{ x: "360%" }}
                transition={{ duration: 1.1, ease: "easeInOut", delay: 0.7 }}
              />
            </div>
            <div className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.42em]" style={{ color: "#93A6C7" }}>
              Earn your wings
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Deterministic sparse star field (no Math.random at module load). */
const STARS = [
  { x: 12, y: 18, r: 2, d: 3.2, delay: 0.0 },
  { x: 22, y: 62, r: 1.5, d: 2.6, delay: 0.6 },
  { x: 34, y: 30, r: 2, d: 3.6, delay: 1.1 },
  { x: 44, y: 78, r: 1.5, d: 2.9, delay: 0.3 },
  { x: 58, y: 22, r: 2, d: 3.1, delay: 0.9 },
  { x: 68, y: 66, r: 1.5, d: 2.7, delay: 0.2 },
  { x: 78, y: 34, r: 2, d: 3.4, delay: 1.3 },
  { x: 86, y: 74, r: 1.5, d: 2.8, delay: 0.5 },
  { x: 8, y: 46, r: 1.5, d: 3.0, delay: 1.0 },
  { x: 92, y: 50, r: 2, d: 3.3, delay: 0.4 },
  { x: 50, y: 88, r: 1.5, d: 2.5, delay: 0.8 },
  { x: 30, y: 8, r: 1.5, d: 3.5, delay: 1.2 },
] as const;
