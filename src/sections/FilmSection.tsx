import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { Link } from "../lib/router";
import { SectionHead } from "../components/SectionHead";
import { track } from "../lib/track";

/**
 * "See it in action": the three-minute launch film (with sound), strictly
 * click-to-play. Until the visitor presses play only a ~30 KB poster loads; the
 * <video> element (preload="none") is created on click and starts with sound
 * because the click is the user gesture. Pauses when scrolled away.
 */
export function FilmSection() {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const start = () => {
    setOn(true);
    track("film_play");
    // Pause if the visitor scrolls past while it plays.
    requestAnimationFrame(() => {
      const v = ref.current;
      if (!v) return;
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) v.pause();
      }, { threshold: 0.25 });
      io.observe(v);
      v.addEventListener("emptied", () => io.disconnect(), { once: true });
    });
  };

  return (
    <section id="film" className="band">
      <div className="wrap">
      <SectionHead
        title={<>Your path to the flight deck. <span style={{ color: "#6B7896" }}>In three minutes.</span></>}
        lede="Ground school, radio practice at real Indian airports, live aircraft and the A320 cockpit, explained by your instructors George and Emma."
      />
      <div className="-mx-5 mt-10 sm:mx-0">
        <div
          className="relative overflow-hidden sm:rounded-[24px]"
          style={{ aspectRatio: "16 / 9", background: "#0D2450", boxShadow: "0 40px 80px -46px rgba(13,36,80,0.8), 0 0 0 1px rgba(11,26,51,0.08)" }}
        >
          {on ? (
            <video
              ref={ref}
              src="/media/film/launch-film-1920x1080.mp4"
              poster="/media/film/launch-film-poster.webp"
              controls
              autoPlay
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button type="button" onClick={start} className="group absolute inset-0 h-full w-full" aria-label="Play film, sound on">
              <picture>
                <source type="image/webp" srcSet="/media/film/launch-film-poster.webp" />
                <img
                  src="/media/film/launch-film-poster.jpg"
                  alt=""
                  width={1920}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </picture>
              <span className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(13,36,80,0) 40%,rgba(13,36,80,0.55))" }} />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                <span className="flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20" style={{ background: "rgba(255,255,255,0.94)", boxShadow: "0 18px 40px -16px rgba(0,0,0,0.6)" }}>
                  <Play size={26} fill="#0D2450" color="#0D2450" style={{ marginLeft: 3 }} />
                </span>
                <span className="font-mono-data text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white/90 sm:text-[12.5px]">Play film, sound on</span>
              </span>
            </button>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}
