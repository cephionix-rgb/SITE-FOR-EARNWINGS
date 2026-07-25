// Google Analytics 4 — privacy-friendly, and only activates when a Measurement
// ID is provided via `VITE_GA_ID` (e.g. G-XXXXXXXXXX) in the env. No ID = no-op.
const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let started = false;

/** Load gtag.js once and configure it (manual SPA page_views). */
export function initAnalytics(): void {
  if (started || !GA_ID || typeof document === "undefined") return;
  started = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  const dataLayer = (window.dataLayer = window.dataLayer || []);
  window.gtag = (...args: unknown[]) => { dataLayer.push(args); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true, send_page_view: false });
}

/** Record a page view (call on every route change). */
export function trackPageView(path: string): void {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Fire a custom event (e.g. waitlist_signup). */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params || {});
}

export const analyticsEnabled = !!GA_ID;
