import { useEffect } from "react";
import Lenis from "lenis";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Live Lenis instance, shared so the router can smooth-scroll to a section after
// navigating home from a sub-page. Null when Lenis is off (reduced motion).
let lenisInstance: Lenis | null = null;

/** Height of the fixed nav — every hash landing clears it. */
const NAV_OFFSET = 80;

// The intro overlay locks the body and pins the page to the top while it plays,
// so any scroll done underneath it is thrown away. HeroIntro reports its state
// here and hash-scrolls wait it out instead of firing into a locked page.
let introActive = false;
export function setIntroActive(v: boolean) {
  introActive = v;
}
export function isIntroActive(): boolean {
  return introActive;
}

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
  if (lenisInstance) {
    // Lenis clamps every scrollTo against a *cached* page height, refreshed by a
    // ResizeObserver that hasn't fired yet right after a route change — the
    // stale limit is 0, so the jump silently collapses to the top of the page.
    // Re-measure first so the target survives the clamp.
    lenisInstance.resize();
    lenisInstance.scrollTo(el as HTMLElement, { offset: -NAV_OFFSET });
  } else {
    // No Lenis (reduced motion) — scroll natively, but keep the same nav offset
    // so the section heading never lands underneath the fixed header.
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }
  return true;
}

/**
 * Mounts Lenis smooth-scroll for the whole page. Disabled automatically when
 * the user prefers reduced motion, so the site degrades to native scrolling.
 */
export function useLenis() {
  // Same-page anchors (#waitlist, #play, #cockpit …) always route through
  // scrollToHash — with or without Lenis — so they clear the fixed nav and leave
  // a shareable URL behind. Registered independently of Lenis, because the
  // reduced-motion path used to fall through to an offset-less native jump.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href");
      if (!hash || hash === "#") return;
      // Target isn't on this page — leave it to the browser rather than
      // swallowing the click.
      if (!scrollToHash(hash)) return;
      e.preventDefault();
      if (hash !== window.location.hash) {
        window.history.pushState({}, "", window.location.pathname + hash);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

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

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
