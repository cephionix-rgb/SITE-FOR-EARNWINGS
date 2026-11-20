// ---------------------------------------------------------------------------
// EARNWINGS marketing site — single source of truth for numbers, cohort
// framing and proof content. Update values HERE; never hardcode them in
// components. Every figure below is real / confirmed by the founder.
// ---------------------------------------------------------------------------

/**
 * Public contact addresses — branded domain mailboxes. Import these; never
 * hardcode an address in a component.
 *   CONTACT_EMAIL — general enquiries (footer, Organization schema).
 *   SUPPORT_EMAIL — help, privacy and terms queries, unsubscribe.
 * Mirrored in scripts/gen-routes.mjs (contactPoint) and
 * apps-script/EarnwingsWaitlist.gs (reply-to + unsubscribe) — keep in sync.
 */
export const CONTACT_EMAIL = "hello@earnwings.org";
export const SUPPORT_EMAIL = "support@earnwings.org";

/**
 * The company that builds and owns EARNWINGS. EARNWINGS is the product;
 * Cephionix is the legal entity that holds the IP, so this is the name that
 * appears in the copyright line, the Terms and the Privacy Policy.
 * TODO(founder): replace with the full registered name from the SPICE+ filing
 * (e.g. "Cephionix Private Limited") and add the CIN — a named, registered
 * entity is what makes the enforcement clauses in Terms §7 bite.
 */
export const COMPANY_NAME = "Cephionix";

/** Cephionix's own company website (EarnWings is a Cephionix product). */
export const COMPANY_URL = "https://www.cephionix.com";

/** Cephionix's other product — the FTO management platform. */
export const NEURALWINGS_URL = "https://neuralwings.org";

/**
 * "Cadet to Commander" quiz: correct answers (of 10) needed to double the
 * founder perks. MUST match PASS_MARK in apps-script/EarnwingsWaitlist.gs.
 * The quiz is ONE attempt only — see JourneySection.tsx.
 */
export const QUIZ_PASS_MARK = 8;

/** Content-scale figures shown across the site (hero stats + proof band). */
export const siteStats = {
  subjects: 5, // DGCA exam subjects
  chapters: 202, // sum of every module chapter (see FlightPathScroll ROWS)
  questions: 15000, // practice questions (15,486 in the bank, Nov 2026) — rendered as "15,000+"
  ranks: 15, // Cadet -> Commander ladder
} as const;

/**
 * Founding-cohort framing. We show the CAP only ("the first N become Founding
 * Cadets") and never a live filled/remaining count. Change this one number if
 * the cohort size changes (e.g. 2000).
 */
export const FOUNDER_SEATS = 200;

/**
 * Proof-band credibility line (Task 5). Real: a DGCA Chief Ground Instructor
 * and a flight instructor were involved, and student pilots shaped it. Edit the
 * exact wording here.
 */
export const CREDIBILITY_LINE =
  "Built with a DGCA Chief Ground Instructor and a flight instructor, and shaped by student pilots preparing right now.";

/** What Captain Aezon is trained on (Task 5). */
export const AI_CAPTAIN_TRAINED =
  "Trained on the full aviation syllabus across every DGCA subject, plus real-world flight scenarios.";

/**
 * Aspirational-moment photo (Task 6) — a real student pilot studying / flight
 * planning. Leave empty to show the graceful navy gradient fallback; set to a
 * path under /public (e.g. "/assets/student-pilot.jpg") when you have the photo.
 */
export const ASPIRATION_IMAGE = "";

/**
 * Real testimonials only. Empty array = the testimonial block renders nothing.
 * Add { quote, name, role } objects here when you have real quotes and the
 * section lights up with no redesign.
 */
export type Testimonial = { quote: string; name: string; role: string };
export const TESTIMONIALS: Testimonial[] = [];

/**
 * Named instructors / advisors behind the course. Empty by default — the
 * Instructors block renders NOTHING until real, cleared-to-name people are added
 * here. Do NOT invent names, titles, or credentials.
 * TODO(founder): add the real DGCA Chief Ground Instructor and flight instructor
 * as { name, title, credentials?, image? } once you have permission to name them.
 * The generic CREDIBILITY_LINE above stays accurate until then.
 */
export type Instructor = { name: string; title: string; credentials?: string; image?: string };
export const INSTRUCTORS: Instructor[] = [];

/**
 * Where the EarnWings web app (and its 3D airport viewer) is served from.
 *
 * Set at BUILD time with the env var VITE_APP_HOST_URL (no trailing slash), e.g.
 *   VITE_APP_HOST_URL=https://app.earnwings.org npm run build
 * or by adding it to .env.production. The fallback below is a temporary
 * Cloudflare tunnel and WILL change: update the env var, then rebuild and deploy.
 *
 * Two other places must agree with it, or the live view stays blank:
 *   1. This site's CSP frame-src (vercel.json and public/_headers) must allow the
 *      host. It currently allows https://*.trycloudflare.com; add the permanent
 *      app domain when there is one.
 *   2. The APP host must allow earnwings.org to frame airport3d.html: its nginx
 *      `location = /airport3d.html` sends `frame-ancestors 'self' capacitor://localhost
 *      https://localhost`, which must also list https://earnwings.org.
 */
export const APP_HOST_URL: string = (
  (import.meta.env.VITE_APP_HOST_URL as string | undefined) || "https://optimal-bufing-joshua-villas.trycloudflare.com"
).replace(/\/+$/, "");

/**
 * The app downloads page (iPhone, Android, Mac), served by the same app host. It has
 * one section per platform: #iphone (install link), #android (APK) and #mac (dmg).
 * Override with VITE_APP_DOWNLOAD_URL. Owner rule: downloading the app and the live
 * aircraft view are FREE for everyone; a purchase buys the study content.
 */
export const APP_DOWNLOAD_URL: string =
  (import.meta.env.VITE_APP_DOWNLOAD_URL as string | undefined) || `${APP_HOST_URL}/downloads/`;

/**
 * Store listings. Empty until the apps are published there; while empty, the badges
 * say "Download for iPhone / Android" and point at the downloads page instead of
 * claiming a store listing that does not exist yet.
 */
export const APP_STORE_URL: string = (import.meta.env.VITE_APP_STORE_URL as string | undefined) || "";
export const PLAY_STORE_URL: string = (import.meta.env.VITE_PLAY_STORE_URL as string | undefined) || "";

export type Platform = "iphone" | "android" | "mac";
/** Where a download badge for one platform goes. */
export function downloadHref(p?: Platform): string {
  if (p === "iphone" && APP_STORE_URL) return APP_STORE_URL;
  if (p === "android" && PLAY_STORE_URL) return PLAY_STORE_URL;
  return p ? `${APP_DOWNLOAD_URL}#${p}` : APP_DOWNLOAD_URL;
}

/** The airports shown in the "Live at our airports" view. */
/** `runways`: approximate headings (degrees) of each runway, used only to draw
 *  the schematic poster shown before the live view loads. Not for navigation. */
export type LiveAirport = { icao: string; city: string; name: string; runways: { hdg: number; label: string }[] };
export const LIVE_AIRPORTS: LiveAirport[] = [
  { icao: "VIDP", city: "Delhi", name: "Indira Gandhi International", runways: [{ hdg: 90, label: "09/27" }, { hdg: 100, label: "10/28" }, { hdg: 110, label: "11/29" }] },
  { icao: "VABB", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International", runways: [{ hdg: 90, label: "09/27" }, { hdg: 140, label: "14/32" }] },
  { icao: "VOMM", city: "Chennai", name: "Chennai International", runways: [{ hdg: 70, label: "07/25" }, { hdg: 120, label: "12/30" }] },
  { icao: "VILH", city: "Leh", name: "Kushok Bakula Rimpochee", runways: [{ hdg: 70, label: "07/25" }] },
  { icao: "VOBL", city: "Bengaluru", name: "Kempegowda International", runways: [{ hdg: 90, label: "09L/27R" }, { hdg: 90, label: "09R/27L" }] },
  { icao: "VOHY", city: "Hyderabad", name: "Begumpet", runways: [{ hdg: 90, label: "09/27" }] },
  { icao: "VIJP", city: "Jaipur", name: "Jaipur International", runways: [{ hdg: 80, label: "08/26" }] },
  { icao: "VICG", city: "Chandigarh", name: "Shaheed Bhagat Singh International", runways: [{ hdg: 110, label: "11/29" }] },
];

/**
 * URL of the embeddable live spectator view for one airport. The app reads:
 *   icao=XXXX   which airport
 *   mode=live   real ADS-B traffic instead of the simulated fleet
 *   embed=1     the minimal "watch the airport" UI (LIVE badge + attribution, no
 *               student controls), auto-following landings and take-offs
 * The embed also listens for postMessage({ type: "ew3d-visibility", visible })
 * from this page, which pauses rendering and live polling when scrolled away.
 *
 * Optional: VITE_LIVE_CORE_URL (https only) is passed as &core=... to point the
 * embed's live-traffic requests at a specific core API host.
 * The embed posts { type: "ew3d-status", icao, caption, callsign, simulated, live }
 * back to this page, which shows LIVE vs SIMULATED and the caption under the view.
 */
const LIVE_CORE_URL = ((import.meta.env.VITE_LIVE_CORE_URL as string | undefined) || "").replace(/\/+$/, "");
export function liveAirportUrl(icao: string): string {
  const core = LIVE_CORE_URL.startsWith("https://") ? `&core=${encodeURIComponent(LIVE_CORE_URL)}` : "";
  return `${APP_HOST_URL}/airport3d.html?icao=${encodeURIComponent(icao)}&mode=live&embed=1${core}`;
}
