// ---------------------------------------------------------------------------
// Static content for the EARNWINGS landing page.
// ---------------------------------------------------------------------------

export const STATS = [
  { value: "5", label: "Core subjects" },
  { value: "10,000+", label: "Practice questions" },
  { value: "∞", label: "RT scenarios" },
  { value: "15", label: "Ranks to climb" },
] as const;

export type Feature = {
  key: string;
  title: string;
  desc: string;
  screen?: string;
  accent: string;
  tagline: string;
  highlights: string[];
};

export const FEATURES: Feature[] = [
  {
    key: "flight-planning",
    title: "Real Flight Planning",
    desc: "Plan live routes over real ATS airways with NOTAM-aware reroutes, weight & balance and a 5-algorithm solver.",
    screen: "/screens/app-flightplan.png",
    accent: "#2E6BE5",
    tagline: "From VIDP to VOMM in three taps — on airways that actually exist.",
    highlights: [
      "Real ARINC-424 airways, waypoints & aerodromes",
      "NOTAM-aware auto-reroute around closed airspace",
      "Weight & balance + a 5-algorithm route solver",
    ],
  },
  {
    key: "rt-trainer",
    title: "Radio Telephony Trainer",
    desc: "Voice-first RT practice in an animated airport scene — speak the call, get scored instantly.",
    screen: "/screens/app-rt.png",
    accent: "#C9981F",
    tagline: "Grab the mic. ATC is waiting — and it's grading you.",
    highlights: [
      "Animated airport scene with a live narrated controller",
      "Whisper speech-to-text scores your phraseology",
      "Local, flight-plan, emergency & enroute scenarios",
    ],
  },
  {
    key: "ai-captain",
    title: "AI Captain",
    desc: "Your personal DGCA ground instructor. Grounded in your notes, it explains, quizzes and never invents.",
    screen: "/screens/app-captain.png",
    accent: "#1B3A7A",
    tagline: "A ground instructor that never sleeps — and never bluffs.",
    highlights: [
      "Answers grounded in your own notes, never invented",
      "In-chat quizzes and step-by-step METAR decodes",
      "Exports a personalised study plan to your planner",
    ],
  },
  {
    key: "dgca-exams",
    title: "DGCA Mock Exams",
    desc: "Full composite papers across every subject, timed and marked exactly like the real DGCA exam.",
    screen: "/screens/app-exams.png",
    accent: "#5BA4E8",
    tagline: "Sit the real paper before the real paper.",
    highlights: [
      "Composite papers for every DGCA subject",
      "Exact DGCA marks, timing and figure questions",
      "Full Captain analysis of every answer",
    ],
  },
  {
    key: "journey",
    title: "Gamified Journey",
    desc: "Earn XP for every note, chapter and test. Climb 15 ranks from Cadet to Commander.",
    screen: "/screens/app-journey.png",
    accent: "#C9981F",
    tagline: "Turn studying into a climb you actually want to make.",
    highlights: [
      "XP for every note, topic, chapter, book & test",
      "15 ranks from Cadet to Commander, each with a perk",
      "Streaks, leaderboards and a level-up celebration",
    ],
  },
];

// 15-rank progression ladder (mirrors the app's leveling system).
export const RANKS = [
  "Cadet",
  "Student Pilot",
  "First Solo",
  "Cross-Country",
  "Night Rating",
  "Instrument Rating",
  "CPL Holder",
  "Multi-Engine",
  "Type Rating",
  "First Officer",
  "Senior F/O",
  "Line Captain",
  "Training Captain",
  "Fleet Captain",
  "Commander",
] as const;

export type Rank = { level: number; name: string; xp: number; perk: string; milestone: boolean };

// Detailed 15-rank ladder — XP thresholds + the perk each rank unlocks.
export const RANK_LADDER: Rank[] = [
  { level: 1, name: "Cadet", xp: 0, perk: "Welcome kit · Chapter 1 unlocked", milestone: false },
  { level: 2, name: "Student Pilot", xp: 250, perk: "Weekly streak-freeze", milestone: false },
  { level: 3, name: "First Solo", xp: 600, perk: "Solo RT scenarios unlocked", milestone: true },
  { level: 4, name: "Cross-Country", xp: 1100, perk: "Flight planner unlocked", milestone: false },
  { level: 5, name: "Night Rating", xp: 1800, perk: "Night-ops weather pack", milestone: false },
  { level: 6, name: "Instrument Rating", xp: 2700, perk: "Full airways & charts", milestone: false },
  { level: 7, name: "CPL Holder", xp: 3800, perk: "DGCA mock exams unlocked", milestone: true },
  { level: 8, name: "Multi-Engine", xp: 5100, perk: "Advanced weight & balance", milestone: false },
  { level: 9, name: "Type Rating", xp: 6600, perk: "AI Captain Pro", milestone: false },
  { level: 10, name: "First Officer", xp: 8300, perk: "Leaderboard badge · +50 credits", milestone: true },
  { level: 11, name: "Senior F/O", xp: 9200, perk: "Peer RT matches", milestone: false },
  { level: 12, name: "Line Captain", xp: 10200, perk: "Mentor mode", milestone: false },
  { level: 13, name: "Training Captain", xp: 11000, perk: "Build custom quizzes", milestone: false },
  { level: 14, name: "Fleet Captain", xp: 11900, perk: "Priority AI credits", milestone: false },
  { level: 15, name: "Commander", xp: 12900, perk: "Commander wings · every perk", milestone: true },
];

// ---------------------------------------------------------------------------
// Playable route planner — real Indian airports, projected onto a 0..100 box
// over India's lon/lat rectangle (lon 68..97E, lat 8..37N).
// ---------------------------------------------------------------------------

export type Airport = {
  icao: string;
  iata: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
  mx: number; // pixel x on the flight-map image (Web Mercator)
  my: number; // pixel y on the flight-map image (Web Mercator)
};

// The route-planner background is a real capture of the EARNWINGS flight map
// (Leaflet / Lido airways). These are the exact geographic bounds of that capture,
// so airports project onto it precisely with Web Mercator.
export const MAP_W = 840;
export const MAP_H = 1050;
const MAP_B = { n: 35.44139836061064, s: 7.334809330750395, e: 92.3398840005521, w: 67.86775065005321 };

const mercY = (lat: number) => Math.log(Math.tan(((90 + lat) * Math.PI) / 360));

function mapProject(lat: number, lon: number) {
  const x = ((lon - MAP_B.w) / (MAP_B.e - MAP_B.w)) * MAP_W;
  const y = ((mercY(MAP_B.n) - mercY(lat)) / (mercY(MAP_B.n) - mercY(MAP_B.s))) * MAP_H;
  return { mx: +x.toFixed(1), my: +y.toFixed(1) };
}

function ap(icao: string, iata: string, name: string, city: string, lat: number, lon: number): Airport {
  return { icao, iata, name, city, lat, lon, ...mapProject(lat, lon) };
}

// Live data pulled from the EARNWINGS flight-planning engine
// (GET /planning/aerodromes-search on the flightplanning service).
// A focused set of 5 major hubs — every pair between them has a real generated
// flight-plan PDF baked into public/plans/, so any route the user picks is downloadable.
export const AIRPORTS: Airport[] = [
  ap("VIDP", "DEL", "Indira Gandhi Intl", "New Delhi", 28.55563, 77.09519),
  ap("VABB", "BOM", "Chhatrapati Shivaji Maharaj Intl", "Mumbai", 19.088699, 72.867897),
  ap("VOBL", "BLR", "Kempegowda Intl", "Bengaluru", 13.1979, 77.706299),
  ap("VOMM", "MAA", "Chennai Intl", "Chennai", 12.990005, 80.169296),
  ap("VECC", "CCU", "Netaji Subhash Chandra Bose Intl", "Kolkata", 22.654012, 88.44765),
];

export function findAirport(icao: string): Airport | undefined {
  return AIRPORTS.find((a) => a.icao === icao.toUpperCase());
}

// Every route between the 5 hubs has a REAL flight-brief PDF generated by the
// EARNWINGS engine (GET /planning/nw/pilot-brief-pdf), named by the sorted ICAO
// pair (e.g. VABB-VIDP.pdf) and baked into public/plans/.
export function routePlanPdf(a: string, b: string): { pdf: string; thumb: string } {
  const key = [a.toUpperCase(), b.toUpperCase()].sort().join("-");
  return { pdf: `/plans/${key}.pdf`, thumb: `/plans/${key}-thumb.png` };
}

// Quick-pick shortcuts shown as chips.
export const QUICK_PICKS = [
  { from: "VIDP", to: "VABB", label: "Delhi → Mumbai" },
  { from: "VIDP", to: "VOMM", label: "Delhi → Chennai" },
  { from: "VABB", to: "VOBL", label: "Mumbai → Bengaluru" },
  { from: "VECC", to: "VIDP", label: "Kolkata → Delhi" },
] as const;

// Stylised India silhouette in the same 0..100 projection (decorative landmass).
export const INDIA_PATH =
  "M20.7,10.3 L31,6.9 L37.9,10.3 L44.8,24.1 L69,34.5 L82.8,31 L89.7,34.5 L96.6,31 L100,44.8 L86.2,44.8 L79.3,51.7 L72.4,51.7 L69,53.4 L65.5,55.2 L58.6,62.1 L51.7,69 L41.4,82.8 L41.4,93.1 L32.8,100 L27.6,96.6 L24.1,86.2 L17.2,75.9 L16.6,62.1 L15.9,55.2 L3.4,51.7 L1.7,46.6 L6.9,44.8 L10.3,44.8 L20.7,41.4 L17.2,31 L6.9,31 L13.8,24.1 L24.1,17.2 Z";

/** Great-circle distance in nautical miles between two airports. */
export function distanceNm(a: Airport, b: Airport): number {
  const R = 3440.065; // nm
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const la1 = toRad(a.lat);
  const la2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

// Cruise model used by the EARNWINGS engine for the demo aircraft (Cessna 172).
export const CRUISE_KT = 110;
export const CRUISE_ALT_FT = 8500;
export const FUEL_GPH = 8; // ≈ engine output (VIDP→VABB 613.8 nm ≈ 45.5 gal)

/** Still-air enroute time at the engine's 110kt cruise. */
export function etaFromNm(nm: number): string {
  const hours = nm / CRUISE_KT;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** Fuel burn (US gal) for a leg at the engine's cruise + burn rate. */
export function fuelGal(nm: number): number {
  return Math.round((nm / CRUISE_KT) * FUEL_GPH * 10) / 10;
}

// ---------------------------------------------------------------------------
// METAR decode mini-game
// ---------------------------------------------------------------------------

export type MetarQuestion = {
  metar: string;
  station: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

// Live METARs captured from the EARNWINGS weather feed (GET /met/metar) with the
// answers taken from the engine's own decode (structured.* fields).
export const METAR_QUESTIONS: MetarQuestion[] = [
  {
    station: "VIDP · Delhi",
    metar: "VIDP 241230Z 10010KT 6000 SCT030 SCT090 32/25 Q0998 NOSIG",
    question: "What is the prevailing visibility?",
    options: ["6000 metres", "600 metres", "10 kilometres"],
    answer: 0,
    explain: "The 4-digit group after the wind is visibility in metres — 6 km. The engine tags VIDP as MVFR.",
  },
  {
    station: "VABB · Mumbai",
    metar: "VABB 241230Z 25014G24KT 2100 -RA FEW010 SCT018 FEW025TCU OVC090 29/26 Q1002 NOSIG",
    question: "What does “G24” in 25014G24KT mean?",
    options: ["Gusting to 24 knots", "24 km visibility", "Temperature 24°C"],
    answer: 0,
    explain: "Wind is 250° at 14 kt gusting 24 kt. With 2100 m in rain (-RA), the engine grades VABB as IFR.",
  },
  {
    station: "VOBL · Bengaluru",
    metar: "VOBL 241230Z 26016KT 8000 SCT015 SCT080 27/18 Q1012 NOSIG",
    question: "8 km visibility, scattered cloud, no weather — flight category?",
    options: ["VFR", "IFR", "LIFR"],
    answer: 0,
    explain: "Good visibility and no low ceiling → the EARNWINGS engine tags VOBL as VFR.",
  },
  {
    station: "VOMM · Chennai",
    metar: "VOMM 241230Z 13010KT 5000 BR SCT020 FEW025TCU BKN100 31/27 Q1004 NOSIG",
    question: "What does the group “BR” mean?",
    options: ["Mist", "Light rain", "Broken cloud"],
    answer: 0,
    explain: "BR = mist (French “brume”). TCU marks towering cumulus building nearby.",
  },
  {
    station: "VECC · Kolkata",
    metar: "VECC 241230Z 20005KT 2800 HZ SCT018 BKN090 28/26 Q0999 NOSIG",
    question: "What is the QNH?",
    options: ["999 hPa", "2800 hPa", "28 hPa"],
    answer: 0,
    explain: "Q0999 → QNH 999 hPa. Vis 2800 m in haze (HZ) makes VECC IFR.",
  },
  {
    station: "VOGO · Goa",
    metar: "VOGO 241200Z 31010G20KT 2500 RA SCT009 SCT020 BKN080 27/25 Q1006 NOSIG",
    question: "What is the base of the lowest cloud (SCT009)?",
    options: ["900 ft", "9000 ft", "90 ft"],
    answer: 0,
    explain: "SCT009 → scattered at 009 = 900 ft. With 2500 m in rain, VOGO is IFR.",
  },
];
