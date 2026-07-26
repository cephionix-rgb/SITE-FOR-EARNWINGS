// ---------------------------------------------------------------------------
// Lightweight analytics wrapper — no vendor lock-in. Forwards events to gtag /
// dataLayer if present (GA is already wired via VITE_GA_ID), else no-ops. Point
// the body at any provider later without touching a single call site.
// ---------------------------------------------------------------------------
import { useEffect, useRef } from "react";

type Props = Record<string, string | number | boolean | undefined>;

export function track(event: string, props: Props = {}): void {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as {
      gtag?: (...a: unknown[]) => void;
      dataLayer?: unknown[];
    };
    if (typeof w.gtag === "function") {
      w.gtag("event", event, props);
    } else if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...props });
    }
    if (import.meta.env.DEV) console.debug("[track]", event, props);
  } catch {
    /* analytics must never break the page */
  }
}

/** Fire a scroll_depth event at 25 / 50 / 75 / 100 percent, once each. */
export function useScrollDepth(): void {
  const seen = useRef<Set<number>>(new Set());
  useEffect(() => {
    const marks = [25, 50, 75, 100];
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) return;
      const pct = (doc.scrollTop / max) * 100;
      for (const m of marks) {
        if (pct >= m && !seen.current.has(m)) {
          seen.current.add(m);
          track("scroll_depth", { percent: m });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}
