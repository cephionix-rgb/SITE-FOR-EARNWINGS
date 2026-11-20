// Talking to the EARNWINGS core API from the marketing site.
//
// WHY THE SITE HAS AN API CLIENT AT ALL
// Because this is where money changes hands. The app deliberately carries no purchase
// UI — an in-app purchase on iOS costs 30%, which on a ₹59,999 plan is ₹18,000. So the
// site is the till:
// sign in, see your plan, buy. The app is the product.
//
// WHAT THIS FILE IS NOT
// It is not a second account system. There are no users here, no sessions, no password
// handling — every one of those lives in the core service and always has. This holds a
// bearer token in localStorage and puts it on requests.
//
// THE TOKEN
// localStorage under "ew_token", and nowhere else: never in a URL, never in a cookie.
// Core mints a SHORT token for the website (7 days, settings.web_session_minutes, because
// every request says `X-EW-Client: website`) and the site slides it forward with
// /auth/refresh once per visit (`resumeSession`). A 401 clears it at once. Sign out is
// local: the token is dropped, and it would expire within the week regardless.
//
// TWO CONFIGURATION FACTS THAT WILL SILENTLY BREAK THIS
//  1. `VITE_CORE_URL` must point at the API. Unset, every call goes to the marketing
//     origin and 404s.
//  2. The site's Content-Security-Policy (vercel.json) restricts `connect-src`. The API
//     origin must be listed there or the browser blocks every request before it is
//     sent — and a CSP block does not look like a network error, it looks like nothing
//     happening at all.
// Both are in SIGNIN_SETUP.md.

const BASE = (import.meta.env.VITE_CORE_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "ew_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;   // Safari private mode throws on localStorage
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* nothing we can do; the session simply won't persist */
  }
  if (!token) setSessionUser(null);
}

// ── who is signed in, for the header on every page ──
// A tiny store rather than React context: the header lives inside every page shell, the
// pages are code-split, and this is one value. Cached in sessionStorage (name and
// initials only) so the header does not flash "Sign in" on every navigation.
export interface SessionUser { name: string; avatar_initials: string; email: string }
const USER_KEY = "ew_session_user";
type Listener = (u: SessionUser | null) => void;
const sessionListeners = new Set<Listener>();
let sessionUser: SessionUser | null = (() => {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw && getToken() ? (JSON.parse(raw) as SessionUser) : null;
  } catch { return null; }
})();

export function getSessionUser(): SessionUser | null { return sessionUser; }
export function setSessionUser(u: { name: string; avatar_initials: string; email: string } | null) {
  sessionUser = u ? { name: u.name, avatar_initials: u.avatar_initials, email: u.email } : null;
  try {
    if (sessionUser) sessionStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    else sessionStorage.removeItem(USER_KEY);
  } catch { /* private mode */ }
  sessionListeners.forEach((l) => l(sessionUser));
}
export function onSessionChange(l: Listener): () => void {
  sessionListeners.add(l);
  return () => { sessionListeners.delete(l); };
}

/** Adopt a session the server just handed us (sign-in, sign-up, refresh). */
export function adoptSession(r: { token: string; user: Me }) {
  setToken(r.token);
  setSessionUser(r.user);
}

export function signOut() {
  setToken(null);
}

let resumed: Promise<Me | null> | null = null;
/** Once per page load: slide the session forward and learn who is signed in. Every
 *  page's header calls this, so it is memoised. Null when signed out or expired. */
export function resumeSession(): Promise<Me | null> {
  if (!getToken() || !BASE) return Promise.resolve(null);
  if (!resumed) {
    resumed = req<{ token: string; user: Me }>("/auth/refresh", { method: "POST" })
      .then((r) => { adoptSession(r); return r.user; })
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) setToken(null);
        resumed = null;
        return null;
      });
  }
  return resumed;
}

export class ApiError extends Error {
  status: number;
  /** Seconds the server asked us to wait (429 `retry_after`); drives resend countdowns. */
  retryAfter: number | null;
  constructor(status: number, message: string, retryAfter: number | null = null) {
    super(message);
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE) throw new ApiError(0, "The site is not configured to reach the API yet.");
  const token = getToken();
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      // Tells core this is the website: a 7-day token, the web sign-up bot check, and
      // "Website" in the console's sign-up numbers (core app/signins.py).
      "X-EW-Client": "website",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    let detail = "";
    let retryAfter: number | null = null;
    try {
      const body = await res.json();
      // FastAPI validation errors arrive as a list of objects, which stringify to
      // "[object Object]" if handed straight to a toast. A structured refusal (the
      // anti-abuse limits: {code, message, retry_after}) carries its own sentence.
      const d = body?.detail;
      detail = typeof d === "string" ? d
        : Array.isArray(d) ? (d[0]?.msg ?? "")
        : (d && typeof d.message === "string") ? d.message : "";
      const n = Number(d?.retry_after);
      if (Number.isFinite(n) && n > 0) retryAfter = Math.ceil(n);
    } catch { /* not JSON */ }
    if (res.status === 401) setToken(null);      // stale token — stop replaying it
    if (!detail && res.status === 429) detail = "Too many attempts. Please wait a few minutes and try again.";
    throw new ApiError(res.status, detail || `Request failed (${res.status})`, retryAfter);
  }
  return res.json() as Promise<T>;
}

// ── shapes, mirroring the core service ──────────────────────────────────────
export interface GuardianStatus {
  minor: boolean; required: boolean; confirmed: boolean; pending: boolean;
  guardian_email: string | null; limited: boolean; can_buy: boolean;
  min_age: number; under_min_age: boolean; message?: string;
}

export interface Me {
  id: number; email: string; name: string; handle: string;
  avatar_initials: string; tier: string; is_premium: boolean;
  plan_expires_at?: string | null;
  credits: number; xp: number; level: number; level_name: string;
  // Sign-up onboarding (core routers/auth.py, routers/profile.py). Optional so an older
  // core reads as "nothing left to collect".
  dob?: string | null; onboarded?: boolean; home_icao?: string | null;
  auth_provider?: string; email_verified?: boolean;
  handle_confirmed?: boolean; needs_profile?: boolean; needs_email_verification?: boolean;
  guardian?: GuardianStatus;
}

/** What the sign-up form must explain, served by core so it cannot drift. */
export interface Providers {
  email: boolean; google: boolean; apple: boolean;
  welcome_fuel?: number; min_age?: number; adult_age?: number;
  turnstile_site_key?: string;
}

export interface RegisterBody {
  email: string; password: string; name: string; dob: string;
  home_icao?: string; guardian_email?: string;
  /** Bot check: honeypot (must stay empty), ms the form was open, Turnstile answer. */
  company?: string; fill_ms?: number; turnstile_token?: string;
}

export interface Plan {
  id: string; name: string;
  /** What is actually charged. The only number any payment path uses. */
  price_inr: number;
  /** The struck-through standard price. 0 = no launch offer running. */
  standard_price_inr: number;
  saving_inr: number; saving_pct: number;
  days: number | null;
  subjects: number; credits_per_month: number; ai_rtr: boolean;
  tagline: string; perks: string[]; available: boolean; lifetime: boolean;
  /** Razorpay-native EMI. A FLOOR, never a quote: the student's own bank sets the real
   *  rate at checkout, so this figure can only be met or exceeded, never undercut.
   *  false / 0 below the threshold, where no issuer would approve it anyway. */
  emi_available: boolean; emi_from_inr: number; emi_max_months: number;
  /** Card accent and ribbon, served by the API so the site, the app and the printed
   *  pricing sheet cannot drift apart. */
  accent: string; badge: string;
  /** Shown with price and perks but NOT sold: the button is "Join the next batch",
   *  which sends an enquiry (core routers/enquiries.py). Checkout refuses it. */
  enquiry_only?: boolean;
}
export interface EmiConfig { enabled: boolean; min_inr: number; tenures: number[] }

/** One DGCA subject, and whether this student can currently open it. */
export interface SubjectOption {
  code: string; title: string; description: string | null;
  color: string | null; unlocked: boolean;
}

/** What a plan opened and what is still to be chosen. The shape mirrors
 *  `entitlements.summary()` on the server so the two cannot drift apart. */
export interface Entitlement {
  all_access: boolean;
  quota: number;
  unlocked: string[];
  remaining: number;
  must_choose: boolean;
  unlocked_subjects?: { code: string; title: string }[];
}
/** The Founder Cadet campaign, described by the server so the site and the app cannot
 *  disagree about what the offer is. */
export interface Offer {
  active: boolean; label: string; badge: string; note: string; gifts: string[];
}
export interface Boost { id: string; name: string; credits: number; price_inr: number }

/** One issued invoice. `url` is relative to the API host and needs the auth header,
 *  so it is fetched as a blob rather than opened as a plain link. */
export interface Invoice {
  number: string; item: string; total_inr: number; gst_inr: number;
  issued_at: string; url: string;
  /** Refund state for this purchase (core billing). Optional: an older core sends none,
   *  and the row then shows no refund controls at all. */
  refund?: InvoiceRefund;
}

/** A refund request on one purchase, as core reports it. */
export interface RefundRequest {
  id: number;
  status: "pending" | "processing" | "refunded" | "declined";
  /** Plain-English state, shown as-is. */
  status_label: string;
  amount_inr: number;
  created_at: string | null;
  decided_at: string | null;
}

/** Whether this purchase can be refunded, and why. Website and Mac purchases (Razorpay)
 *  follow our 7-day rule (/refunds); App Store and Google Play purchases are refunded by
 *  Apple or Google, so for those the site only links to the store's own refund page. */
export interface InvoiceRefund {
  purchase_id: number | null;
  rail: "razorpay" | "apple" | "google" | "other";
  /** A request can be made now. */
  eligible: boolean;
  /** Plain-English sentence: why eligible, why not, or the request's state. */
  why: string;
  /** What an approved refund would return right now (0 if not eligible). */
  refund_inr: number;
  window_ends_at: string | null;
  request: RefundRequest | null;
  /** apple/google only: the store's own refund page. */
  store_refund_url?: string | null;
}

export interface MyPlan {
  user: Me;
  plan: { id: string; name: string; subjects: number; ai_rtr: boolean;
          lifetime: boolean; credits_per_month: number; daily_ai_cap: number };
  expires_at: string | null;
  credits: number;
  entitlement: Entitlement;
}

export const api = {
  login: (email: string, password: string) =>
    req<{ token: string; user: Me }>("/auth/login", {
      method: "POST", body: JSON.stringify({ email, password }),
    }),
  me: () => req<Me>("/auth/me"),
  providers: () => req<Providers>("/auth/providers"),
  register: (b: RegisterBody) =>
    req<{ token: string; user: Me; guardian?: { sent: boolean; message: string } }>("/auth/register", {
      method: "POST", body: JSON.stringify(b),
    }),
  /** Google or Apple: one call for sign-in and sign-up alike. `nonce` is the RAW value
   *  whose SHA-256 was given to the provider (core checks the token's claim). */
  social: (b: { provider: "google" | "apple"; id_token: string; name?: string; nonce?: string }) =>
    req<{ token: string; user: Me; created: boolean; onboarded: boolean }>("/auth/social", {
      method: "POST", body: JSON.stringify(b),
    }),
  /** `turnstile`: Cloudflare's token, needed for a RESEND when core has Turnstile on. */
  sendEmailCode: (email?: string, turnstile?: string | null) =>
    req<{ ok: boolean; already_verified: boolean; email: string; sent: boolean; mail_configured?: boolean; resend_in?: number; message?: string }>(
      "/auth/email/code", { method: "POST", body: JSON.stringify(email ? { email } : {}),
        ...(turnstile ? { headers: { "X-EW-Turnstile": turnstile } } : {}) }),
  verifyEmailCode: (code: string) =>
    req<Me>("/auth/email/verify", { method: "POST", body: JSON.stringify({ code }) }),
  checkHandle: (handle: string) =>
    req<{ handle: string; available: boolean; reason: string | null }>(
      `/auth/username/check?handle=${encodeURIComponent(handle)}`),
  completeProfile: (b: { handle: string; name: string; dob?: string; guardian_email?: string }) =>
    req<Me>("/profile/complete", { method: "POST", body: JSON.stringify(b) }),
  completeOnboarding: (b: { name?: string; dob?: string; exams_cleared: string[]; guardian_email?: string }) =>
    req<Me>("/profile/onboarding", { method: "POST", body: JSON.stringify(b) }),
  updateProfile: (b: { home_icao?: string; dob?: string; guardian_email?: string }) =>
    req<Me>("/profile/me", { method: "PATCH", body: JSON.stringify(b) }),
  examSubjects: () => req<{ items: { subject_code: string; title: string }[] }>("/tests/config"),
  requestGuardian: (guardian_email: string) =>
    req<{ sent: boolean; message: string }>("/account/guardian", {
      method: "POST", body: JSON.stringify({ guardian_email }),
    }),
  /** Permanent. Password accounts send the password; Google/Apple-only ones send none.
   *  `confirm` must be the literal DELETE (the server checks it too). */
  deleteAccount: (password: string) =>
    req<{ deleted: boolean }>("/auth/account/delete", {
      method: "POST", body: JSON.stringify({ password, confirm: "DELETE" }),
    }),
  myPlan: () => req<MyPlan>("/billing/me"),
  plans: () => req<{ plans: Plan[]; boosts: Boost[]; offer?: Offer; emi?: EmiConfig }>("/billing/plans"),
  /** Every subject, flagged with whether this student holds it. */
  subjects: () => req<{ items: SubjectOption[] } & Entitlement>("/billing/subjects"),
  /** Spend the student's subject picks. Additive; 409 on a real refusal, and that
   *  message is written to be shown verbatim. */
  chooseSubjects: (codes: string[]) =>
    req<Entitlement>("/billing/subjects", { method: "POST", body: JSON.stringify({ codes }) }),
  /** "Join the next batch" on an enquiry-only plan: what to prefill, and send one. */
  myEnquiries: () => req<{ prefill: { name: string; phone: string; email: string } }>("/enquiries/me"),
  createEnquiry: (b: { plan_id: string; name: string; phone: string; start_month?: string | null; note?: string | null }) =>
    req<{ ok: boolean; id: number; message: string }>("/enquiries", { method: "POST", body: JSON.stringify(b) }),
  /** This student's own invoices, newest first. */
  invoices: () => req<{ items: Invoice[] }>("/billing/invoices"),
  /** Ask for a refund of one website/Mac purchase. 404/409/422 carry a plain-English
   *  `detail` that is shown verbatim (ApiError.message). */
  requestRefund: (purchase_id: number, reason?: string) =>
    req<{ ok: boolean; message: string; request: RefundRequest }>("/billing/refunds", {
      method: "POST",
      body: JSON.stringify({ purchase_id, ...(reason?.trim() ? { reason: reason.trim().slice(0, 500) } : {}) }),
    }),
  forgot: (email: string, turnstile?: string | null) =>
    req<{ ok: boolean; message: string }>("/auth/password/forgot", {
      method: "POST", body: JSON.stringify({ email }),
      ...(turnstile ? { headers: { "X-EW-Turnstile": turnstile } } : {}),
    }),
  /** Mints a pending checkout and returns the hosted payment page to send them to.
   *
   *  `subject_codes` is optional and only meaningful for a plan that unlocks some but
   *  not all six subjects. Sending them means the plan arrives already usable; omitting
   *  them is still valid and falls through to the chooser this page already shows after
   *  payment. The server validates the count BEFORE creating the order, so a wrong pick
   *  is a 422 here rather than a support ticket once the money has moved. */
  checkout: (kind: "plan" | "boost", item_id: string, subject_codes?: string[]) =>
    req<{ token: string; url: string; amount_inr: number; label: string;
          subject_codes?: string[] }>(
      "/billing/checkout", {
        method: "POST",
        body: JSON.stringify({
          kind, item_id,
          ...(subject_codes?.length ? { subject_codes } : {}),
        }),
      }),
};

/** Download an invoice PDF.
 *
 *  Fetched as a blob rather than opened as a plain link because the endpoint is
 *  authenticated — a bare <a href> sends no Authorization header and would 401. The
 *  object URL is revoked immediately; the browser has already taken the bytes by then.
 */
export async function downloadInvoice(inv: Invoice): Promise<void> {
  if (!BASE) throw new ApiError(0, "The site is not configured to reach the API yet.");
  const token = getToken();
  const res = await fetch(BASE + inv.url, {
    headers: { "X-EW-Client": "website", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) throw new ApiError(res.status, "Could not download that invoice.");
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = `${inv.number.replace(/\//g, "-")}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
