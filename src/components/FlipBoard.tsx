import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/scroll";

/**
 * "EARN YOUR WINGS" as an airport split-flap board (brought back from the old
 * hero). Each tile flips through a few letters and lands, left to right, the
 * way a departures board settles.
 *
 * Built for a phone's frame budget:
 *   - the tiles are fixed-size boxes from the first paint (blank, then lettered),
 *     so the board never shifts the layout;
 *   - one requestAnimationFrame loop drives every tile and stops for good once
 *     the last letter lands (about 2.3 s); no React re-renders while it runs, the
 *     letters are written straight into the DOM;
 *   - each flip is a 120 ms rotateX + opacity Web Animation, compositor-only.
 * Reduced motion: the finished words are shown at once, nothing moves.
 * The board is decorative (aria-hidden); the brand is in the h1's sr-only text.
 */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FLIP_MS = 62; // one flap
const STAGGER = 85; // ms between tiles starting

export function FlipBoard({ text, startDelay = 320 }: { text: string; startDelay?: number }) {
  const chars = text.toUpperCase().split("");
  const tiles = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const els = tiles.current;
    const finish = () => els.forEach((el, i) => { if (el) el.textContent = chars[i]; });
    if (prefersReducedMotion()) { finish(); return; }

    // Per letter: when it starts and how many flaps before it lands. Later tiles
    // spin a little longer, so the word lands as a wave.
    let k = 0;
    const plan = chars.map((c) => {
      if (c === " ") return null;
      const p = { start: startDelay + k * STAGGER, flips: 6 + Math.round(k * 0.9), shown: -1 };
      k++;
      return p;
    });
    const canAnimate = typeof Element !== "undefined" && "animate" in Element.prototype;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = now - t0;
      let busy = false;
      plan.forEach((p, i) => {
        const el = els[i];
        if (!p || !el) return;
        if (t < p.start) { busy = true; return; }
        const n = Math.min(p.flips, Math.floor((t - p.start) / FLIP_MS));
        if (n === p.shown) { if (n < p.flips) busy = true; return; }
        p.shown = n;
        el.textContent = n >= p.flips ? chars[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        if (canAnimate) {
          el.animate(
            [{ transform: "rotateX(-75deg)", opacity: 0.45 }, { transform: "rotateX(0deg)", opacity: 1 }],
            { duration: n >= p.flips ? 180 : 110, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
          );
        }
        if (n < p.flips) busy = true;
      });
      if (busy) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); finish(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span aria-hidden className="flip-board">
      {chars.map((c, i) =>
        c === " " ? (
          <span key={i} className="flip-gap" />
        ) : (
          <span key={i} className="flap-tile">
            <span ref={(el) => { tiles.current[i] = el; }} className="flap-char" />
          </span>
        ),
      )}
    </span>
  );
}
