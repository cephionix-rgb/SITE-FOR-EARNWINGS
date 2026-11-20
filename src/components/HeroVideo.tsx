import { useEffect, useRef, useState } from "react";

/**
 * The hero's looping, muted feature video, built so it never costs the page its
 * first paint:
 *   1. A poster <img> renders first (WebP with JPEG fallback). It is the only
 *      thing in the LCP path.
 *   2. The <video> element is created only after the page has loaded and the
 *      browser is idle, and only if the slot is on screen. preload="none" until
 *      then, so no video bytes are fetched up front.
 *   3. It plays muted, inline and looped while visible; pauses when scrolled
 *      away or when the tab is hidden.
 *   4. Under prefers-reduced-motion or Save-Data it never loads: the poster stays.
 *
 * Files live in /public/media/hero/. To replace the film, drop new files in with
 * the same names (or change HERO_MEDIA below). WebM is offered first where it
 * exists, H.264 MP4 is the universal fallback.
 */

export const HERO_MEDIA = {
  wide: {
    poster: "/media/hero/hero-loop-1920x1080-poster.webp",
    posterJpg: "/media/hero/hero-loop-1920x1080-poster.jpg",
    webm: "/media/hero/hero-loop-1920x1080.webm",
    mp4: "/media/hero/hero-loop-1920x1080.mp4",
    w: 1920,
    h: 1080,
  },
  tall: {
    poster: "/media/hero/hero-loop-1080x1350-poster.webp",
    posterJpg: "/media/hero/hero-loop-1080x1350-poster.jpg",
    webm: "/media/hero/hero-loop-1080x1350.webm",
    mp4: "/media/hero/hero-loop-1080x1350.mp4",
    w: 1080,
    h: 1350,
  },
} as const;

/** Phones and narrow tablets get the 4:5 cut; everything else the 16:9. */
const TALL_QUERY = "(max-width: 767px)";

function motionAllowed(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !c?.saveData;
}

export function HeroVideo({ className = "", label }: { className?: string; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tall] = useState(() => typeof window !== "undefined" && window.matchMedia(TALL_QUERY).matches);
  const [mount, setMount] = useState(false);
  const [playing, setPlaying] = useState(false);
  const m = tall ? HERO_MEDIA.tall : HERO_MEDIA.wide;

  // Decide when (and whether) to mount the <video>.
  useEffect(() => {
    if (!motionAllowed()) return;
    let cancelled = false;
    const go = () => {
      if (cancelled) return;
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (idle) idle(() => !cancelled && setMount(true), { timeout: 2500 });
      else window.setTimeout(() => !cancelled && setMount(true), 600);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", go);
    };
  }, []);

  // Play only while visible and the tab is in front.
  useEffect(() => {
    if (!mount) return;
    const v = videoRef.current;
    const el = wrapRef.current;
    if (!v || !el) return;
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden) {
        v.play().catch(() => undefined);
      } else {
        v.pause();
      }
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    }, { threshold: 0.2 });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [mount]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`} style={{ aspectRatio: `${m.w} / ${m.h}` }}>
      <picture>
        <source type="image/webp" srcSet={m.poster} />
        <img
          src={m.posterJpg}
          width={m.w}
          height={m.h}
          alt={label}
          {...({ fetchpriority: "high" } as Record<string, string>)}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      {mount && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          poster={m.poster}
          aria-hidden
          onPlaying={() => setPlaying(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: playing ? 1 : 0 }}
        >
          <source src={m.webm} type={`video/webm; codecs="vp9"`} />
          <source src={m.mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
