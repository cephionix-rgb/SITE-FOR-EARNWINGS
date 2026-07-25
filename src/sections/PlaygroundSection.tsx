import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plane,
  RotateCcw,
  Radio,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Navigation,
  Gauge,
  Ruler,
  Clock,
  Fuel,
  Mountain,
  FileText,
  FileDown,
} from "lucide-react";
import {
  AIRPORTS,
  MAP_W,
  MAP_H,
  METAR_QUESTIONS,
  QUICK_PICKS,
  routePlanPdf,
  findAirport,
  distanceNm,
  etaFromNm,
  fuelGal,
  CRUISE_ALT_FT,
  type Airport,
} from "../lib/data";
import { inView, rise } from "../lib/motion";
import { prefersReducedMotion } from "../lib/scroll";

/* ------------------------------- Route planner ------------------------------ */

function RoutePlanner() {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [hover, setHover] = useState<string | null>(null);
  const reduced = prefersReducedMotion();

  const from = findAirport(fromText) ?? null;
  const to = findAirport(toText) ?? null;
  const route = from && to && from.icao !== to.icao ? [from, to] : [];
  const totalNm = route.length === 2 ? distanceNm(from!, to!) : 0;
  // Every route between the hubs has a generated PDF.
  const plan = route.length === 2 ? routePlanPdf(from!.icao, to!.icao) : null;
  const pairKey = route.length === 2 ? [from!.icao, to!.icao].sort().join("-") : "";

  const inRoute = (icao: string) => from?.icao === icao || to?.icao === icao;

  // Tapping the map fills From, then To, then starts over.
  function pickAirport(a: Airport) {
    if (!from || (from && to)) {
      setFromText(a.icao);
      setToText("");
    } else if (a.icao !== from.icao) {
      setToText(a.icao);
    }
  }
  function loadPreset(p: { from: string; to: string }) {
    setFromText(p.from);
    setToText(p.to);
  }
  function clearRoute() {
    setFromText("");
    setToText("");
  }

  const pathD = route.length === 2 ? `M ${from!.mx} ${from!.my} L ${to!.mx} ${to!.my}` : "";
  const routeKey = route.map((r) => r.icao).join("-");
  const labelFor = AIRPORTS.find((a) => a.icao === hover);
  const planeShape = "M -16 -13 L 22 0 L -16 13 L -5 0 Z";

  return (
    <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
      {/* Real EARNWINGS flight map (Leaflet / Lido airways) with route overlay */}
      <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: `${MAP_W} / ${MAP_H}`, background: "#0b1c3f" }}>
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <image href="/assets/india-flightmap.png" x={0} y={0} width={MAP_W} height={MAP_H} />

          {pathD && (
            <>
              <path d={pathD} fill="none" stroke="#F5D97A" strokeWidth={13} strokeLinecap="round" opacity={0.5} />
              <path d={pathD} fill="none" stroke="#1B3A7A" strokeWidth={7.5} strokeLinecap="round" />
              <path d={pathD} fill="none" stroke="#F5D97A" strokeWidth={4} strokeDasharray="16 12" strokeLinecap="round" />
              <path id={`rp-${routeKey}`} d={pathD} fill="none" stroke="none" />
              {!reduced ? (
                <g>
                  <path d={planeShape} fill="#1B3A7A" stroke="#fff" strokeWidth={2.5} />
                  <animateMotion key={routeKey} dur={`${Math.max(3, route.length * 2.4)}s`} repeatCount="indefinite" rotate="auto">
                    <mpath href={`#rp-${routeKey}`} />
                  </animateMotion>
                </g>
              ) : (
                <g transform={`translate(${route[route.length - 1].mx} ${route[route.length - 1].my})`}>
                  <path d={planeShape} fill="#1B3A7A" stroke="#fff" strokeWidth={2.5} />
                </g>
              )}
            </>
          )}

          {AIRPORTS.map((a) => {
            const active = inRoute(a.icao);
            const isHover = hover === a.icao;
            const show = active || isHover;
            return (
              <g
                key={a.icao}
                className="cursor-pointer"
                onClick={() => pickAirport(a)}
                onMouseEnter={() => setHover(a.icao)}
                onMouseLeave={() => setHover((h) => (h === a.icao ? null : h))}
              >
                {active && <circle cx={a.mx} cy={a.my} r={22} fill="rgba(245,217,122,0.3)" />}
                <circle cx={a.mx} cy={a.my} r={show ? 13 : 9} fill={active ? "#F5D97A" : "#ffffff"} stroke={active ? "#8a6a12" : "#1B3A7A"} strokeWidth={3.5} />
                <circle cx={a.mx} cy={a.my} r={30} fill="transparent" />
                {show && (
                  <text
                    x={a.mx}
                    y={a.my - 22}
                    fontSize={26}
                    fontWeight={800}
                    textAnchor="middle"
                    fill="#0D1629"
                    stroke="#ffffff"
                    strokeWidth={5}
                    paintOrder="stroke"
                    style={{ pointerEvents: "none" }}
                  >
                    {a.icao}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <span className="pill absolute left-4 top-4" style={{ background: "rgba(13,36,80,0.82)", color: "#F5D97A" }}>
          <Navigation size={12} /> {labelFor ? `${labelFor.icao}/${labelFor.iata} · ${labelFor.city}` : "Tap airports to route"}
        </span>
      </div>

      {/* Right rail (dark) */}
      <div className="flex flex-col gap-3.5">
        {/* airport autocomplete list */}
        <datalist id="ap-list">
          {AIRPORTS.map((a) => (
            <option key={a.icao} value={a.icao}>{a.city}</option>
          ))}
        </datalist>

        {/* From / To inputs — the route only draws once both are entered */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#93A9D6" }}>Plan a route</span>
            {(fromText || toText) && (
              <button onClick={clearRoute} className="flex h-7 w-7 items-center justify-center rounded-lg text-white/80" style={{ background: "rgba(255,255,255,0.08)" }} title="Clear">
                <RotateCcw size={13} />
              </button>
            )}
          </div>
          <div className="mt-3 grid gap-2.5">
            {([["From", fromText, setFromText, from], ["To", toText, setToText, to]] as const).map(([label, val, setter, ap]) => (
              <div key={label}>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase" style={{ color: "#7f97c9" }}>
                  <span>{label}</span>
                  {ap && <span style={{ color: "#93A9D6" }}>{ap.city}</span>}
                </div>
                <input
                  list="ap-list"
                  value={val}
                  onChange={(e) => setter(e.target.value.toUpperCase().slice(0, 4))}
                  placeholder={label === "From" ? "ICAO · e.g. VIDP" : "ICAO · e.g. VABB"}
                  className="mt-1 w-full rounded-xl px-3 py-2.5 text-sm font-bold uppercase tracking-wide outline-none focus:ring-2"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#fff", border: `1px solid ${ap ? "rgba(245,217,122,0.5)" : "rgba(255,255,255,0.12)"}` }}
                />
              </div>
            ))}
          </div>
        </div>

        {route.length === 2 ? (
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Ruler, label: "Distance", value: `${totalNm.toLocaleString()}`, unit: "nm" },
              { icon: Clock, label: "ETE · 110kt", value: etaFromNm(totalNm), unit: "" },
              { icon: Fuel, label: "Fuel · C172", value: `${fuelGal(totalNm)}`, unit: "gal" },
              { icon: Mountain, label: "Cruise", value: CRUISE_ALT_FT.toLocaleString(), unit: "ft" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase" style={{ color: "#93A9D6" }}><Icon size={12} /> {s.label}</div>
                  <div className="mt-1 text-2xl font-black" style={{ color: "#F5D97A" }}>{s.value}{s.unit && <span className="ml-1 text-xs" style={{ color: "#93A9D6" }}>{s.unit}</span>}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl p-4 text-sm leading-relaxed" style={{ background: "rgba(46,107,229,0.12)", border: "1px solid rgba(91,164,232,0.2)", color: "#bcd3f2" }}>
            Enter a <b style={{ color: "#fff" }}>departure</b> and <b style={{ color: "#fff" }}>destination</b> — or pick a ready-made plan below — to draw the route and see the live figures.
          </div>
        )}

        {/* Every route has a real generated flight-plan PDF — preview + download */}
        {plan && (
          <div className="rounded-2xl p-3" style={{ background: "rgba(245,217,122,0.1)", border: "1px solid rgba(245,217,122,0.32)" }}>
            <div className="flex items-center gap-3">
              <img src={plan.thumb} alt="Flight plan preview" className="h-24 w-auto rounded-md" style={{ border: "1px solid rgba(255,255,255,0.15)" }} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-sm font-bold text-white"><FileText size={15} style={{ color: "#F5D97A" }} /> Flight plan for {from!.icao} → {to!.icao}</div>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "#bcd3f2" }}>Full 6-page brief — ICAO form, route map, terrain profile, weather, W&amp;B, CP/PNR &amp; validation. Demo only.</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={plan.pdf} download={`EARNWINGS-${pairKey}.pdf`} className="btn-gold !py-2.5 text-xs">
                <FileDown size={14} /> Download PDF
              </a>
              <a href={plan.pdf} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-bold" style={{ background: "rgba(255,255,255,0.08)", color: "#F5D97A", border: "1px solid rgba(245,217,122,0.3)" }}>
                <FileText size={14} /> Preview
              </a>
            </div>
          </div>
        )}

        {/* Quick-pick popular routes */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#93A9D6" }}>Popular routes</div>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {QUICK_PICKS.map((p) => {
              const key = [p.from, p.to].sort().join("-");
              const activeP = key === pairKey;
              return (
                <button key={p.label} onClick={() => loadPreset(p)} className="rounded-xl px-3 py-2 text-left transition-colors" style={{ background: activeP ? "rgba(245,217,122,0.18)" : "rgba(255,255,255,0.06)", color: activeP ? "#F5D97A" : "#cdd9f0", border: `1px solid ${activeP ? "rgba(245,217,122,0.4)" : "rgba(255,255,255,0.1)"}` }}>
                  <span className="text-xs font-extrabold">{p.from} → {p.to}</span>
                  <span className="block text-[10px] font-medium" style={{ color: "#7f97c9" }}>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl p-3.5 text-[13px] leading-relaxed" style={{ background: "rgba(46,107,229,0.12)", border: "1px solid rgba(91,164,232,0.2)", color: "#bcd3f2" }}>
          <b style={{ color: "#fff" }}>Real data.</b> Every airport, distance and PDF comes straight from the EARNWINGS flight engine — pick <em>any</em> two hubs and download the plan.
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- METAR game -------------------------------- */

function MetarGame() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const q = METAR_QUESTIONS[i];
  const done = i >= METAR_QUESTIONS.length;

  function pick(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  }
  const next = () => { setPicked(null); setI((n) => n + 1); };
  const restart = () => { setI(0); setPicked(null); setScore(0); };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold" style={{ color: "#7f97c9" }}>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#6ee7b7" }} />
        Live METARs from the EARNWINGS weather feed
      </div>
      {/* progress dots */}
      <div className="mb-4 flex items-center justify-center gap-2">
        {METAR_QUESTIONS.map((_, idx) => (
          <span key={idx} className="h-2 rounded-full transition-all" style={{ width: idx === i && !done ? 22 : 8, background: idx < i || done ? "#F5D97A" : idx === i ? "#5BA4E8" : "rgba(255,255,255,0.18)" }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-8 text-center" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="text-6xl font-black" style={{ color: "#F5D97A" }}>{score}/{METAR_QUESTIONS.length}</div>
            <p className="mt-3 text-lg font-bold text-white">{score === METAR_QUESTIONS.length ? "Perfect readback! 🎧" : "Nice — keep decoding."}</p>
            <p className="mt-1 text-sm" style={{ color: "#93A9D6" }}>The full app streams hundreds of live METARs, TAFs &amp; SIGMETs.</p>
            <button onClick={restart} className="btn-gold mt-6 text-sm"><RotateCcw size={16} /> Play again</button>
          </motion.div>
        ) : (
          <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} className="rounded-2xl p-6 sm:p-7" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#93A9D6" }}>{q.station}</span>
              <span className="pill" style={{ background: "rgba(5,150,105,0.2)", color: "#6ee7b7" }}><Gauge size={12} /> {score}/{METAR_QUESTIONS.length}</span>
            </div>
            <code className="mt-3 block rounded-xl px-4 py-4 text-[13.5px] leading-relaxed" style={{ background: "#060f26", color: "#8fd0ff", fontFamily: "ui-monospace, monospace" }}>{q.metar}</code>
            <div className="mt-5 text-lg font-bold text-white">{q.question}</div>
            <div className="mt-3 grid gap-2.5">
              {q.options.map((opt, idx) => {
                const isAnswer = idx === q.answer;
                const isPicked = picked === idx;
                const show = picked !== null;
                let bg = "rgba(255,255,255,0.06)", color = "#e6eefc", border = "rgba(255,255,255,0.1)";
                if (show && isAnswer) { bg = "rgba(5,150,105,0.18)"; color = "#6ee7b7"; border = "rgba(5,150,105,0.5)"; }
                else if (show && isPicked && !isAnswer) { bg = "rgba(220,38,38,0.16)"; color = "#fca5a5"; border = "rgba(220,38,38,0.5)"; }
                return (
                  <button key={idx} onClick={() => pick(idx)} disabled={show} className="flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors" style={{ background: bg, color, borderColor: border }}>
                    {opt}
                    {show && isAnswer && <CheckCircle2 size={18} />}
                    {show && isPicked && !isAnswer && <XCircle size={18} />}
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {picked !== null && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                  <p className="mt-4 rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ background: "rgba(245,217,122,0.12)", color: "#f5d97a" }}>{q.explain}</p>
                  <button onClick={next} className="btn-gold mt-4 w-full text-sm">{i === METAR_QUESTIONS.length - 1 ? "See score" : "Next METAR"} <ArrowRight size={16} /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------- Section ----------------------------------- */

const TABS = [
  { key: "plan", label: "Route Planner", icon: Plane },
  { key: "wx", label: "Weather Decoder", icon: Radio },
] as const;

export function PlaygroundSection() {
  const [tab, setTab] = useState<"plan" | "wx">("plan");

  return (
    <section id="play" className="section">
      <motion.div variants={rise} initial="hidden" whileInView="show" viewport={inView} className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">Try it live — no signup</span>
        <h2 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-tight" style={{ color: "#0D1629" }}>
          Don't just read about it. <span className="text-gradient-navy">Play with it.</span>
        </h2>
        <p className="mt-4 text-lg" style={{ color: "#40506e" }}>
          Boot up the EARNWINGS flight bag — plan a route across real Indian airports,
          then decode live METARs pulled straight from the app's weather feed.
        </p>
      </motion.div>

      {/* EFB console */}
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-[2rem] p-4 sm:p-6"
        style={{
          background: "linear-gradient(160deg,#0f2450 0%,#0a1836 100%)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 50px 120px -40px rgba(13,22,41,0.8)",
        }}
      >
        {/* glows */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle,rgba(46,107,229,0.35),transparent 70%)" }} />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle,rgba(201,152,31,0.28),transparent 70%)" }} />

        {/* header */}
        <div className="relative mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.08)", color: "#F5D97A" }}>
              <Plane size={18} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">EARNWINGS Flight Bag</div>
              <div className="text-[11px] font-medium" style={{ color: "#7f97c9" }}>Electronic Flight Bag · interactive demo</div>
            </div>
          </div>
          <span className="pill" style={{ background: "rgba(201,152,31,0.2)", color: "#F5D97A" }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#F5D97A" }} /> LIVE DEMO
          </span>
        </div>

        {/* tab switcher */}
        <div className="relative mb-6 grid grid-cols-2 rounded-full p-1" style={{ background: "rgba(255,255,255,0.06)" }}>
          <span
            className="absolute inset-y-1 rounded-full transition-all duration-300 ease-out"
            style={{
              left: tab === "plan" ? 4 : "50%",
              right: tab === "plan" ? "50%" : 4,
              background: "linear-gradient(135deg,#F5D97A,#C9981F)",
              boxShadow: "0 8px 20px -6px rgba(201,152,31,0.6)",
            }}
          />
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} className="relative z-10 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold transition-colors" style={{ color: active ? "#3d2c00" : "#cdd9f0" }}>
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* content */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              {tab === "plan" ? <RoutePlanner /> : <MetarGame />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
