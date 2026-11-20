import { useCallback, useEffect, useRef, useState } from "react";
import { Expand, ExternalLink, PlaneLanding, PlaneTakeoff, Play, Radio, Shrink } from "lucide-react";
import { APP_HOST_URL, LIVE_AIRPORTS, liveAirportUrl } from "../lib/siteConfig";

/** What the embed reports on every change (postMessage type "ew3d-status").
 *  `live` is the number of live aircraft in the feed; arrivals / departures count the
 *  embed's traffic list. */
type EmbedStatus = { icao: string; caption?: string; callsign?: string; simulated?: boolean; live?: number; arrivals?: number; departures?: number };
/** Shot requests the embed accepts (postMessage type "ew3d-cmd", sent only to APP_ORIGIN). */
type EmbedCmd = "next-landing" | "next-takeoff" | "auto";
const APP_ORIGIN = (() => {
  try {
    return new URL(APP_HOST_URL).origin;
  } catch {
    return "";
  }
})();
import { track } from "../lib/track";

/**
 * "Live at our airports": EarnWings' 3D airport viewer showing real aircraft
 * landing and taking off, from public ADS-B data.
 *
 * Performance contract (the homepage must stay fast):
 *   - Nothing from the app host loads until the visitor asks for it
 *     (`autoLoad = false`, the homepage) or the view scrolls near the screen
 *     (`autoLoad = true`, the /live page). Until then it is a poster image.
 *   - Once loaded, the embed is told when it is off-screen or the tab is hidden
 *     (postMessage { type: "ew3d-visibility", visible }) so it pauses rendering
 *     and live polling instead of burning GPU and data in the background.
 */

/** Code-drawn poster: the airport's runway headings on a radar-style dial.
 *  No image to download, so the homepage pays nothing for it. */
function Poster({ ap }: { ap: (typeof LIVE_AIRPORTS)[number] }) {
  const n = ap.runways.length;
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="lp-bg" cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor="#24498F" />
          <stop offset="60%" stopColor="#12306A" />
          <stop offset="100%" stopColor="#0A1C40" />
        </radialGradient>
        <linearGradient id="lp-sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F5D97A" stopOpacity="0.5" />
          <stop offset="1" stopColor="#F5D97A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#lp-bg)" />
      <circle cx="1350" cy="120" r="380" fill="url(#lp-sun)" />
      {[120, 220, 320, 420].map((r) => (
        <circle key={r} cx="800" cy="450" r={r} fill="none" stroke="#5BA4E8" strokeOpacity={0.22} strokeWidth="1.5" />
      ))}
      <line x1="800" y1="0" x2="800" y2="900" stroke="#5BA4E8" strokeOpacity="0.12" />
      <line x1="0" y1="450" x2="1600" y2="450" stroke="#5BA4E8" strokeOpacity="0.12" />
      {ap.runways.map((r, i) => {
        const off = (i - (n - 1) / 2) * 46;
        return (
          <g key={r.label} transform={`translate(800 450) rotate(${r.hdg - 90}) translate(0 ${off})`}>
            <rect x="-260" y="-11" width="520" height="22" rx="3" fill="#0B1733" stroke="#F5D97A" strokeOpacity="0.55" />
            <line x1="-235" y1="0" x2="235" y2="0" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" strokeDasharray="18 16" />
            <text x="-300" y="7" fill="#F5D97A" fontSize="20" fontWeight="700" textAnchor="middle" fontFamily="Oswald, sans-serif">{r.label.split("/")[0]}</text>
            <text x="300" y="7" fill="#F5D97A" fontSize="20" fontWeight="700" textAnchor="middle" fontFamily="Oswald, sans-serif">{r.label.split("/")[1]}</text>
          </g>
        );
      })}
      <text x="70" y="800" fill="#fff" fontSize="96" fontWeight="800" fontFamily="Oswald, sans-serif" letterSpacing="4">{ap.icao}</text>
      <text x="74" y="845" fill="#A9C0E6" fontSize="28" fontFamily="Inter, sans-serif">{ap.city} · runway schematic, not to scale</text>
    </svg>
  );
}

type Props = { autoLoad?: boolean; tall?: boolean };

export function LiveAirports({ autoLoad = false, tall = false }: Props) {
  const [icao, setIcao] = useState(LIVE_AIRPORTS[0].icao);
  const [loaded, setLoaded] = useState(false);
  const [full, setFull] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const visibleRef = useRef(false);
  const [status, setStatus] = useState<EmbedStatus | null>(null);
  const ap = LIVE_AIRPORTS.find((a) => a.icao === icao)!;
  const src = liveAirportUrl(icao);

  // Tell the embed whether it is worth rendering.
  const post = useCallback(() => {
    const visible = visibleRef.current && !document.hidden;
    try {
      frameRef.current?.contentWindow?.postMessage({ type: "ew3d-visibility", visible }, "*");
    } catch {
      /* cross-origin frame not ready yet */
    }
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visibleRef.current = e.isIntersecting;
        if (e.isIntersecting && autoLoad) setLoaded(true);
        post();
      },
      { rootMargin: autoLoad ? "200px" : "0px", threshold: autoLoad ? 0 : 0.15 },
    );
    io.observe(el);
    const onVis = () => post();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [autoLoad, post]);

  // Ask the embed for a shot ("Next landing"). Sent only to the app host's origin.
  const command = (cmd: EmbedCmd) => {
    if (!APP_ORIGIN) return;
    try {
      frameRef.current?.contentWindow?.postMessage({ type: "ew3d-cmd", cmd }, APP_ORIGIN);
    } catch {
      /* frame not ready */
    }
    track("live_cmd", { icao, cmd });
  };

  // Status from the embed: LIVE vs SIMULATED and what the camera is following.
  // Only messages from the app host's origin and our own frame are trusted.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== APP_ORIGIN || e.source !== frameRef.current?.contentWindow) return;
      const d = e.data as Partial<EmbedStatus> & { type?: string };
      if (d?.type !== "ew3d-status" || typeof d.icao !== "string") return;
      const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.min(999, Math.round(v))) : undefined);
      setStatus({
        icao: d.icao,
        caption: typeof d.caption === "string" ? d.caption.slice(0, 140) : undefined,
        callsign: typeof d.callsign === "string" ? d.callsign.slice(0, 16) : undefined,
        simulated: !!d.simulated,
        live: n(d.live),
        arrivals: n(d.arrivals),
        departures: n(d.departures),
      });
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);
  useEffect(() => setStatus(null), [icao]);

  useEffect(() => {
    const onFs = () => setFull(!!(document.fullscreenElement || (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("webkitfullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("webkitfullscreenchange", onFs);
    };
  }, []);

  const toggleFull = () => {
    const el = wrapRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null;
    if (!el) return;
    const d = document as Document & { webkitExitFullscreen?: () => void; webkitFullscreenElement?: Element };
    if (document.fullscreenElement || d.webkitFullscreenElement) {
      (document.exitFullscreen ? document.exitFullscreen() : d.webkitExitFullscreen?.());
    } else if (el.requestFullscreen) {
      void el.requestFullscreen();
    } else {
      el.webkitRequestFullscreen?.();
    }
    track("live_fullscreen", { icao });
  };

  return (
    <div>
      <div role="tablist" aria-label="Choose an airport" className="mb-4 grid grid-cols-4 gap-1 rounded-2xl p-1 sm:inline-grid sm:min-w-[520px]" style={{ background: "rgba(11,26,51,0.06)" }}>
        {LIVE_AIRPORTS.map((a) => {
          const on = a.icao === icao;
          return (
            <button
              key={a.icao}
              role="tab"
              aria-selected={on}
              onClick={() => {
                setIcao(a.icao);
                track("live_airport_tab", { icao: a.icao });
              }}
              className="flex min-h-[52px] flex-col items-center justify-center rounded-xl px-2 py-1.5 transition-[background-color,box-shadow,color] duration-200"
              style={
                on
                  ? { background: "#fff", color: "#0B1A33", boxShadow: "0 6px 16px -10px rgba(13,36,80,0.6), 0 0 0 1px rgba(11,26,51,0.06)" }
                  : { background: "transparent", color: "#46557A" }
              }
            >
              <span className="text-[15px] font-bold leading-tight">{a.city}</span>
              <span className="font-mono-data text-[11px] font-semibold leading-tight" style={{ color: on ? "#46557A" : "#56648A" }}>{a.icao}</span>
            </button>
          );
        })}
      </div>

      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-[22px] border shadow-[0_40px_80px_-46px_rgba(13,36,80,0.8)] sm:rounded-[24px]"
        style={{
          borderColor: "rgba(27,58,122,0.16)",
          background: "#0D2450",
          aspectRatio: full ? undefined : tall ? "16 / 10" : "16 / 9",
          height: full ? "100%" : undefined,
          maxHeight: full ? undefined : tall ? "78vh" : undefined,
        }}
      >
        {loaded ? (
          <iframe
            ref={frameRef}
            key={icao}
            src={src}
            title={`Live aircraft at ${ap.city} (${ap.icao}) in the EarnWings 3D airport`}
            className="absolute inset-0 h-full w-full border-0"
            allow="fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={post}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setLoaded(true);
              track("live_load", { icao });
            }}
            className="group absolute inset-0 flex h-full w-full items-center justify-center"
          >
            <Poster ap={ap} />
            <span className="relative flex flex-col items-center gap-3 text-white">
              <span className="flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20" style={{ background: "rgba(255,255,255,0.94)", boxShadow: "0 18px 40px -16px rgba(0,0,0,0.6)" }}>
                <Play size={26} fill="#0D2450" color="#0D2450" style={{ marginLeft: 3 }} />
              </span>
              <span className="font-mono-data text-[12px] font-semibold uppercase tracking-[0.12em] text-white/90">
                Watch {ap.city} live
              </span>
            </span>
          </button>
        )}

        {!(loaded && status) && (
          <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-[12px] font-extrabold uppercase tracking-[0.14em] text-white">
            <Radio size={13} className="text-[#ff5d5d]" /> Live · {ap.icao}
          </span>
        )}
        <button
          type="button"
          onClick={toggleFull}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-black/60"
          aria-label={full ? "Exit full screen" : "Full screen"}
        >
          {full ? <Shrink size={18} /> : <Expand size={18} />}
        </button>
      </div>

      {/* (owner, Nov 2026: "see the clutterness") the embed itself shows the airport, LIVE and
          the followed flight; below it only the shot buttons */}
      {loaded && status && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[14px]">
          <span className="flex gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={() => command("next-landing")}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold transition-colors hover:bg-[rgba(27,58,122,0.14)]"
              style={{ background: "rgba(27,58,122,0.08)", color: "#1B3A7A" }}
            >
              <PlaneLanding size={15} /> Next landing
            </button>
            <button
              type="button"
              onClick={() => command("next-takeoff")}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold transition-colors hover:bg-[rgba(27,58,122,0.14)]"
              style={{ background: "rgba(27,58,122,0.08)", color: "#1B3A7A" }}
            >
              <PlaneTakeoff size={15} /> Next take-off
            </button>
          </span>
        </div>
      )}
      <div className="mt-3 flex flex-col gap-2 text-[14px] leading-6 sm:flex-row sm:items-start sm:justify-between" style={{ color: "#4A5A78" }}>
        <p className="max-w-2xl">
          Real-time traffic at {ap.name}, {ap.city}, from public ADS-B data, shown in the EarnWings 3D airport. Positions can
          lag or drop out; when no aircraft is moving the view may show simulated traffic. Not for navigation.
        </p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 font-semibold hover:underline"
          style={{ color: "#1B3A7A" }}
        >
          Open in a new tab <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
