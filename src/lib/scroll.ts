import { useEffect } from "react";
import Lenis from "lenis";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Live Lenis instance, shared so the router can smooth-scroll to a section after
// navigating home from a sub-page. Null when Lenis is off (reduced motion).
let lenisInstance: Lenis | null = null;

/**
 * Smooth-scroll to the element matching `hash` (e.g. "#features").
 * Uses Lenis when available, else native. Returns false if the element isn't
 * in the DOM yet (the caller can retry once the target page has mounted).
 */
export function scrollToHash(hash: string): boolean {
  if (!hash || hash === "#") return false;
  let el: Element | null = null;
  try {
    el = document.querySelector(hash);
  } catch {
    return false; // invalid selector — treat as "not found"
  }
  if (!el) return false;
  if (lenisInstance) lenisInstance.scrollTo(el as HTMLElement, { offset: -80 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

/**
 * Mounts Lenis smooth-scroll for the whole page. Disabled automatically when
 * the user prefers reduced motion, so the site degrades to native scrolling.
 */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,             // continuous, buttery catch-up (feels smoother than a fixed duration)
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,  // mobile keeps native momentum; Lenis just tunes it
    });
    lenisInstance = lenis;

    let raf = 0;
    function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    // Anchor links → smooth scroll
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -80 });
      }
    }
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
