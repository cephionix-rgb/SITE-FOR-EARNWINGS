import gsapCore from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

/**
 * Single registration point for GSAP on this site.
 *
 * Everything that animates with GSAP imports `gsap` (and any plugin) FROM HERE
 * rather than from the package, so plugins are guaranteed registered and the
 * house eases/defaults are applied before the first tween runs. Importing
 * `gsap` straight from the package still works, but skips all of that.
 *
 * Plugins ship inside the `gsap` package (3.13+ made the former Club plugins
 * free): ScrollTrigger, SplitText, Flip, MotionPathPlugin, DrawSVGPlugin,
 * MorphSVGPlugin, Observer, Physics2D, Inertia … Only ScrollTrigger is
 * registered globally — import + `gsap.registerPlugin()` the others in the one
 * component that needs them so they stay out of the main bundle.
 */
gsapCore.registerPlugin(useGSAP, ScrollTrigger, CustomEase);

/**
 * Named eases matching the Framer Motion curves in lib/motion.ts, so a GSAP
 * tween and a `motion` variant sitting in the same section feel identical.
 * CustomEase takes the CSS cubic-bezier control points as an SVG path.
 */
CustomEase.create("ew-out-expo", "M0,0 C0.16,1 0.3,1 1,1"); // = easeOutExpo
CustomEase.create("ew-springy", "M0,0 C0.34,1.56 0.64,1 1,1"); // = easeSpringy (overshoots)

export const EASE = {
  outExpo: "ew-out-expo",
  springy: "ew-springy",
} as const;

// House defaults — a tween that says nothing about ease/duration matches the
// rest of the site instead of GSAP's stock power1.out / 0.5s.
gsapCore.defaults({ ease: EASE.outExpo, duration: 0.7 });

// Mobile browsers fire a resize every time the URL bar hides/shows. Without
// this, every ScrollTrigger recalculates mid-scroll and pinned/scrubbed
// animations visibly jump on phones.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsapCore as gsap, ScrollTrigger, CustomEase, useGSAP };

type RevealOptions = {
  /** Distance (px) the target rises from. Default 34, matching `rise`. */
  y?: number;
  /** Seconds between children when `targets` is a list. Default 0 (together). */
  stagger?: number;
  duration?: number;
  /** Scale to grow from, e.g. 0.9 for a `scaleIn` feel. Default 1 (no scale). */
  scale?: number;
  /** ScrollTrigger `start`. Default "top 80%" — fires a bit before it's fully in. */
  start?: string;
  /**
   * Element the trigger measures. Defaults to the target — note that a string
   * selector resolves to its FIRST match, so a staggered list animates as one
   * batch off the first card (usually what you want). Pass a per-element
   * `trigger` if each item should fire on its own.
   */
  trigger?: Element | string;
  /** Replay every time it re-enters the viewport. Default false (once). */
  repeat?: boolean;
};

/**
 * Scroll-triggered fade + rise — the GSAP equivalent of the `rise` + `inView`
 * pair used with `motion` elsewhere. Call it inside `useGSAP()` so the tween and
 * its ScrollTrigger are cleaned up with the component.
 *
 *   const scope = useRef<HTMLDivElement>(null);
 *   useGSAP(() => reveal(".card", { stagger: 0.09 }), { scope });
 *
 * Under prefers-reduced-motion nothing animates and the content simply stays
 * put — the `no-preference` gate means the `from` state is never applied.
 */
export function reveal(targets: gsap.TweenTarget, opts: RevealOptions = {}) {
  const { y = 34, stagger = 0, duration = 0.7, scale = 1, start = "top 80%", trigger, repeat = false } = opts;

  // gsap.matchMedia() registered inside a useGSAP scope is reverted with it.
  const mm = gsapCore.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsapCore.from(targets, {
      opacity: 0,
      y,
      scale,
      duration,
      stagger,
      ease: scale === 1 ? EASE.outExpo : EASE.springy,
      scrollTrigger: {
        trigger: trigger ?? (targets as Element),
        start,
        once: !repeat,
        toggleActions: repeat ? "play none none reverse" : undefined,
      },
    });
  });
  return mm;
}
