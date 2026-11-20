import { useEffect, useRef } from "react";

/**
 * Site-wide sky, fixed behind all page content (z-index -10, pointer-events none).
 *
 * The clouds are DRAWN IN CODE (no photos, no generated imagery): each cloud is
 * a seeded cluster of soft puffs painted in three passes (blue-grey underside,
 * white body, warm sunlit top). They are rendered ONCE per layer into a
 * wrap-around tile, and the tile is then only ever moved, never repainted:
 *
 *   - 3 parallax layers (far / mid / near) at ~8, ~16 and ~28 px per second;
 *   - each layer is a strip (not the full screen), so overdraw stays ~1.3 screens;
 *   - motion is a Web Animations translate3d loop, which runs on the compositor
 *     thread: it keeps drifting smoothly while the page scrolls and costs the
 *     main thread nothing;
 *   - rendered at up to 2x device pixels on phones (crisp on a 3x iPhone) and
 *     1.5x on desktop, where the layers are much wider;
 *   - paused while the tab is hidden; static under prefers-reduced-motion or
 *     Save-Data (the clouds are still drawn, they just do not move).
 *
 * History: this replaced (1) six animated full-screen CSS photo layers that held
 * desktop at 30-40 fps, then (2) a full-canvas repaint loop that was smooth but
 * looked soft and static on iPhone.
 */

type LayerSpec = {
  top: number; // fraction of viewport height
  height: number; // fraction of viewport height
  speed: number; // px per second
  opacity: number;
  count: number; // clouds per 1000 px of tile
  size: [number, number]; // cloud width as a fraction of the strip height
  base: [number, number]; // cloud base position within the strip (fraction)
  tint: number; // 0..1 how blue the underside is
};

const LAYERS: LayerSpec[] = [
  { top: 0.02, height: 0.42, speed: 8, opacity: 0.62, count: 3.2, size: [0.5, 0.9], base: [0.45, 0.85], tint: 0.9 },
  { top: 0.3, height: 0.42, speed: 16, opacity: 0.82, count: 2.2, size: [0.75, 1.25], base: [0.55, 0.85], tint: 0.7 },
  { top: 0.6, height: 0.42, speed: 28, opacity: 0.92, count: 1.6, size: [1.0, 1.6], base: [0.6, 0.9], tint: 0.55 },
];

/** Small deterministic PRNG so the sky looks the same on every visit. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Puff = { x: number; y: number; r: number };

/** One cumulus: a dome of many small, soft puffs over a flattish base, with a
 *  ring of tiny "cauliflower" puffs along the upper edge for detail. */
function makeCloud(cx: number, base: number, w: number, r: () => number): Puff[] {
  const h = w * (0.3 + r() * 0.14);
  const puffs: Puff[] = [];
  const n = 55 + Math.floor(r() * 25);
  for (let i = 0; i < n; i++) {
    const u = (r() + r() - 1); // -1..1, centre-weighted
    const d = Math.abs(u);
    const x = cx + (u * w) / 2;
    const up = h * Math.sqrt(Math.max(0, 1 - d * d)) * Math.pow(r(), 0.7);
    const rad = h * (0.2 + r() * 0.22) * (1 - d * 0.4);
    puffs.push({ x, y: base - up * 0.7 - rad * 0.2, r: rad });
  }
  // detail along the top silhouette
  const m = 18 + Math.floor(r() * 12);
  for (let i = 0; i < m; i++) {
    const u = (r() - 0.5) * 1.8;
    const d = Math.min(1, Math.abs(u));
    const x = cx + (u * w) / 2;
    const top = h * Math.sqrt(Math.max(0, 1 - d * d)) * 0.85;
    puffs.push({ x, y: base - top * 0.82 + h * 0.06, r: h * (0.09 + r() * 0.09) });
  }
  return puffs;
}

function puff(ctx: CanvasRenderingContext2D, x: number, y: number, rad: number, stops: [number, string][]) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
  for (const [o, c] of stops) g.addColorStop(o, c);
  ctx.fillStyle = g;
  ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
}

/** Paint one wrap-around tile (width T) for a layer; returns the canvas. */
function renderTile(spec: LayerSpec, T: number, H: number, dpr: number, seed: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.round(T * dpr);
  c.height = Math.round(H * dpr);
  const ctx = c.getContext("2d")!;
  ctx.scale(dpr, dpr);
  const r = rng(seed);
  const n = Math.max(2, Math.round((spec.count * T) / 1000));
  const clouds: Puff[][] = [];
  for (let i = 0; i < n; i++) {
    const w = H * (spec.size[0] + r() * (spec.size[1] - spec.size[0]));
    const cx = ((i + 0.15 + r() * 0.7) / n) * T;
    const base = H * (spec.base[0] + r() * (spec.base[1] - spec.base[0]));
    clouds.push(makeCloud(cx, base, w, r));
  }
  const shade = `rgba(${Math.round(196 - 30 * spec.tint)},${Math.round(212 - 18 * spec.tint)},${Math.round(236 - 4 * spec.tint)},`;
  // Draw each cloud at x, x-T and x+T so the tile wraps seamlessly.
  for (const off of [-T, 0, T]) {
    for (const cl of clouds) {
      // 1. cool underside, offset down
      for (const p of cl) puff(ctx, p.x + off, p.y + p.r * 0.45, p.r * 1.15, [[0, shade + "0.42)"], [0.5, shade + "0.2)"], [1, shade + "0)"]]);
    }
    for (const cl of clouds) {
      // 2. body: soft falloff, no hard rim
      for (const p of cl) puff(ctx, p.x + off, p.y, p.r, [[0, "rgba(255,255,255,0.85)"], [0.45, "rgba(255,255,255,0.55)"], [0.8, "rgba(255,255,255,0.12)"], [1, "rgba(255,255,255,0)"]]);
    }
    for (const cl of clouds) {
      // 3. warm sunlit tops (sun up and to the right)
      for (const p of cl) puff(ctx, p.x + off + p.r * 0.2, p.y - p.r * 0.38, p.r * 0.7, [[0, "rgba(255,250,236,0.55)"], [1, "rgba(255,250,236,0)"]]);
    }
  }
  return c;
}

/** Reduced motion or Save-Data: draw, but do not animate. */
export function wantsStaticMotion(): boolean {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !!conn?.saveData;
}

const idle = (fn: () => void) => {
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  if (ric) ric(fn, { timeout: 1200 });
  else window.setTimeout(fn, 60);
};

export function CloudBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const anims: Animation[] = [];
    const els: HTMLDivElement[] = [];
    let cancelled = false;
    const still = wantsStaticMotion();
    const W = window.innerWidth;
    const VH = Math.max(window.innerHeight, 640);
    const phone = W <= 768;
    const dpr = Math.min(window.devicePixelRatio || 1, phone ? 2 : 1.5);
    const T = Math.round(Math.max(W * 1.3, 900));

    const build = (i: number) => {
      if (cancelled || i >= LAYERS.length) return;
      const spec = LAYERS[i];
      const H = Math.round(VH * spec.height);
      const tile = renderTile(spec, T, H, dpr, 1009 * (i + 1));
      if (cancelled) return;
      // The strip is two canvases side by side (the tile and a copy), moved as
      // one composited layer. Canvases rather than a CSS background image:
      // an image would count as the page's Largest Contentful Paint and, since
      // the sky paints after load on idle, it held mobile LCP back by ~1 s.
      const el = document.createElement("div");
      Object.assign(el.style, {
        position: "absolute",
        left: "0",
        top: `${spec.top * 100}%`,
        width: `${T * 2}px`,
        height: `${H}px`,
        display: "flex",
        opacity: "0",
        transition: "opacity 1.2s ease",
        willChange: "transform",
        transform: "translate3d(0,0,0)",
      } as Partial<CSSStyleDeclaration>);
      const copy = document.createElement("canvas");
      copy.width = tile.width;
      copy.height = tile.height;
      copy.getContext("2d")!.drawImage(tile, 0, 0);
      for (const cv of [tile, copy]) {
        Object.assign(cv.style, { width: `${T}px`, height: `${H}px`, flex: "none", display: "block" } as Partial<CSSStyleDeclaration>);
        el.appendChild(cv);
      }
      host.appendChild(el);
      els.push(el);
      // Start each layer at a different phase so they never line up.
      const phase = ((i * 0.37) % 1) * T;
      if (!still && typeof el.animate === "function") {
        const a = el.animate(
          [{ transform: `translate3d(${-phase}px,0,0)` }, { transform: `translate3d(${-phase - T}px,0,0)` }],
          { duration: (T / spec.speed) * 1000, iterations: Infinity, easing: "linear" },
        );
        if (document.hidden) a.pause();
        anims.push(a);
      } else {
        el.style.transform = `translate3d(${-phase}px,0,0)`;
      }
      requestAnimationFrame(() => (el.style.opacity = String(spec.opacity)));
      idle(() => build(i + 1));
    };
    idle(() => build(0));

    const onVis = () => anims.forEach((a) => (document.hidden ? a.pause() : a.play()));
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVis);
      anims.forEach((a) => a.cancel());
      els.forEach((d) => d.remove());
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -10,
        overflow: "hidden",
        pointerEvents: "none",
        contain: "strict",
        background:
          "radial-gradient(60vmax 60vmax at 78% 4%, rgba(255,252,240,0.9), rgba(255,240,205,0.25) 35%, rgba(255,240,205,0) 62%), linear-gradient(180deg,#DCEBFF 0%,#CFE3FA 38%,#C2DBF7 66%,#E4EFFD 100%)",
      }}
    />
  );
}
