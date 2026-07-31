// ---------------------------------------------------------------------------
// Tiny dependency-free client-side router for the EARNWINGS landing site.
//
// The site is one scroll-driven landing page plus a few standalone pages
// (About / Privacy / Terms). We use the History API so those get real, shareable
// URLs (/about, /privacy, /terms) while section links (/#features …) still
// smooth-scroll the landing page via Lenis.
// ---------------------------------------------------------------------------
import {
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
} from "react";
import { isIntroActive, scrollToHash } from "./scroll";

type Listener = () => void;
const listeners = new Set<Listener>();
function emit() {
  listeners.forEach((l) => l());
}

/** How long to keep trying a hash-scroll before giving up. Generous, because it
 *  has to outlast the intro overlay and a code-split page's dynamic import. */
const HASH_SCROLL_TIMEOUT_MS = 15000;

/**
 * Keep retrying a hash-scroll until the target section is actually on screen.
 * Two things can make the target unavailable for a while:
 *   - the page owning it is still mounting (sub-pages are lazy-loaded), and
 *   - the intro overlay pins the page to the top while it plays, so scrolling
 *     underneath it would just be undone when it finishes.
 */
function scrollWhenReady(hash: string) {
  const deadline = Date.now() + HASH_SCROLL_TIMEOUT_MS;
  const tick = () => {
    if (!isIntroActive() && scrollToHash(hash)) return;
    if (Date.now() > deadline) return;
    setTimeout(tick, 80);
  };
  // Defer the first attempt one frame so every mount effect (the intro's lock in
  // particular) has run before we decide whether it is safe to scroll.
  requestAnimationFrame(tick);
}

/**
 * Navigate to an internal destination. Accepts:
 *   "/about"        → push a new page, scroll to top
 *   "/#features"    → go to the landing page and smooth-scroll to that section
 *   "/"             → back to the landing page top
 */
export function navigate(to: string) {
  const url = new URL(to, window.location.origin);
  const target = url.pathname + url.hash;
  const samePath = url.pathname === window.location.pathname;

  if (samePath) {
    // Same page — never a full route change, just move to the hash (or top).
    // Push (not replace) when the hash actually changes so Back walks the
    // sections the visitor jumped through instead of leaving the site.
    if (url.hash !== window.location.hash) window.history.pushState({}, "", target);
    else window.history.replaceState({}, "", target);
    if (url.hash) scrollWhenReady(url.hash);
    else window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  window.history.pushState({}, "", target);
  emit();
  // Let the new page render, then land on the hash or the top.
  if (url.hash) scrollWhenReady(url.hash);
  else window.scrollTo({ top: 0 });
}

/** Normalise a pathname: drop any trailing slash (GitHub Pages may serve
 *  "/about/" for a prerendered "/about") so route matching stays exact. */
function normalizePath(p: string): string {
  return p.length > 1 ? p.replace(/\/+$/, "") || "/" : p;
}

/** Current pathname; re-renders on navigate() or browser back/forward. */
export function useRoute(): string {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  useEffect(() => {
    // Deep link (/#play, /features#study, a shared or bookmarked URL): the
    // browser's own fragment jump happens before React has rendered the section,
    // so it silently does nothing. Do the landing ourselves on first paint.
    if (window.location.hash) scrollWhenReady(window.location.hash);

    const update = () => {
      setPath(normalizePath(window.location.pathname));
      if (window.location.hash) scrollWhenReady(window.location.hash);
    };
    listeners.add(update);
    window.addEventListener("popstate", update);
    return () => {
      listeners.delete(update);
      window.removeEventListener("popstate", update);
    };
  }, []);
  return path;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/**
 * Internal link. Renders a real <a href> (so it's shareable / right-clickable /
 * SEO-friendly) but intercepts plain left-clicks for SPA navigation.
 */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    // Respect new-tab / modified clicks and default-prevented handlers.
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
