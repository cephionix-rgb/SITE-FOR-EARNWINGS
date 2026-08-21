// Talking to the EARNWINGS core API from the marketing site.
//
// WHY THE SITE HAS AN API CLIENT AT ALL
// Because this is where money changes hands. The app deliberately carries no purchase
// UI — an in-app purchase on iOS costs 30%, which on a ₹34,999 plan is ₹10,500, about
// eighteen times the entire annual AI bill for that student. So the site is the till:
// sign in, see your plan, buy. The app is the product.
//
// WHAT THIS FILE IS NOT
// It is not a second account system. There are no users here, no sessions, no password
// handling — every one of those lives in the core service and always has. This holds a
// bearer token in localStorage and puts it on requests.
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
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE) throw new ApiError(0, "The site is not configured to reach the API yet.");
  const token = getToken();
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      // FastAPI validation errors arrive as a list of objects, which stringify to
      // "[object Object]" if handed straight to a toast.
      detail = typeof body?.detail === "string" ? body.detail
        : Array.isArray(body?.detail) ? (body.detail[0]?.msg ?? "") : "";
    } catch { /* not JSON */ }
    if (res.status === 401) setToken(null);      // stale token — stop replaying it
    throw new ApiError(res.status, detail || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

// ── shapes, mirroring the core service ──────────────────────────────────────
export interface Me {
  id: number; email: string; name: string; handle: string;
  avatar_initials: string; tier: string; is_premium: boolean;
  plan_expires_at?: string | null;
  credits: number; xp: number; level: number; level_name: string;
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
  myPlan: () => req<MyPlan>("/billing/me"),
  plans: () => req<{ plans: Plan[]; boosts: Boost[]; offer?: Offer; emi?: EmiConfig }>("/billing/plans"),
  /** Every subject, flagged with whether this student holds it. */
  subjects: () => req<{ items: SubjectOption[] } & Entitlement>("/billing/subjects"),
  /** Spend the student's subject picks. Additive; 409 on a real refusal, and that
   *  message is written to be shown verbatim. */
  chooseSubjects: (codes: string[]) =>
    req<Entitlement>("/billing/subjects", { method: "POST", body: JSON.stringify({ codes }) }),
  /** This student's own invoices, newest first. */
  invoices: () => req<{ items: Invoice[] }>("/billing/invoices"),
  forgot: (email: string) =>
    req<{ ok: boolean; message: string }>("/auth/password/forgot", {
      method: "POST", body: JSON.stringify({ email }),
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
    headers: token ? { Authorization: `Bearer ${token}` } : {},
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
