// "Continue with Google" / "Continue with Apple" on the website, and the Turnstile widget.
//
// Same contract as the app (EARNWINGS Student App/src/lib/socialAuth.ts): get ONE ID
// token from the provider in the browser and hand it to core's POST /auth/social, which
// verifies the signature, the issuer, the expiry and that the token was issued for one
// of OUR client ids (core app/oauth.py). Nothing here decides who the student is.
//
// EACH BUTTON IS DRAWN ONLY WHEN IT CAN WORK
// Both providers tie their web client to registered DOMAINS. A button on a page whose
// origin the provider does not know can only end in an error popup, which is worse than
// no button. So a provider shows only when ALL of these hold:
//   * core says it is configured (GET /auth/providers);
//   * its web id is baked into this build:
//       VITE_GOOGLE_WEB_CLIENT_ID            the Google "Web application" client id
//       VITE_APPLE_SERVICES_ID + VITE_APPLE_REDIRECT_URI   an Apple Services ID and a
//                                            Return URL registered on it
//   * this page's origin is one registered with the provider:
//       VITE_GOOGLE_WEB_ORIGINS (comma list; default https://earnwings.org and www)
//       Apple: the origin of VITE_APPLE_REDIRECT_URI.
// What to create in each console is in _docs/LAUNCH_KEYS_NEEDED.md.
//
// REPLAY PROTECTION
// A fresh random nonce per attempt. The provider is given its SHA-256 (hex) and copies
// that into the token; core is sent the raw value and checks claim == sha256(raw).

const GOOGLE_ID = (import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID as string | undefined) || "";
const GOOGLE_ORIGINS = ((import.meta.env.VITE_GOOGLE_WEB_ORIGINS as string | undefined)
  || "https://earnwings.org,https://www.earnwings.org")
  .split(",").map((s) => s.trim().replace(/\/$/, "")).filter(Boolean);
const APPLE_ID = (import.meta.env.VITE_APPLE_SERVICES_ID as string | undefined) || "";
const APPLE_REDIRECT = (import.meta.env.VITE_APPLE_REDIRECT_URI as string | undefined) || "";

function here(): string {
  try { return window.location.origin; } catch { return ""; }
}

export function googleReady(serverOn: boolean | undefined): boolean {
  return !!serverOn && !!GOOGLE_ID && GOOGLE_ORIGINS.includes(here());
}

export function appleReady(serverOn: boolean | undefined): boolean {
  if (!serverOn || !APPLE_ID || !APPLE_REDIRECT) return false;
  try { return new URL(APPLE_REDIRECT).origin === here(); } catch { return false; }
}

export class SocialCancelled extends Error {}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const have = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (have) {
      if (have.dataset.loaded) resolve();
      else { have.addEventListener("load", () => resolve()); have.addEventListener("error", () => reject(new Error("load"))); }
      return;
    }
    const el = document.createElement("script");
    el.src = src; el.async = true; el.defer = true;
    el.onload = () => { el.dataset.loaded = "1"; resolve(); };
    el.onerror = () => reject(new Error("Couldn't reach the sign-in service. Check your connection."));
    document.head.appendChild(el);
  });
}

async function makeNonce(): Promise<{ raw: string; hashed: string } | null> {
  try {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const raw = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
    const hashed = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
    return { raw, hashed };
  } catch {
    return null;
  }
}

// ── Google Identity Services: the official button, rendered into `el` ──
type Gsi = {
  initialize: (o: Record<string, unknown>) => void;
  renderButton: (el: HTMLElement, o: Record<string, unknown>) => void;
};

/** Draw Google's own button into `el`. `onToken` receives the ID token and the raw nonce
 *  when the student completes Google's popup. */
export async function mountGoogleButton(
  el: HTMLElement, width: number,
  onToken: (idToken: string, nonce: string | undefined) => void,
): Promise<void> {
  await loadScript("https://accounts.google.com/gsi/client");
  const gsi = (window as unknown as { google?: { accounts?: { id?: Gsi } } }).google?.accounts?.id;
  if (!gsi) throw new Error("Google sign-in couldn't start in this browser.");
  const nonce = await makeNonce();
  gsi.initialize({
    client_id: GOOGLE_ID,
    callback: (r: { credential?: string }) => { if (r?.credential) onToken(r.credential, nonce?.raw); },
    ...(nonce && { nonce: nonce.hashed }),
    ux_mode: "popup",
    context: "signin",
    itp_support: true,
  });
  el.innerHTML = "";
  gsi.renderButton(el, {
    type: "standard", theme: "outline", size: "large", text: "continue_with",
    shape: "pill", logo_alignment: "center", width: Math.max(200, Math.min(400, Math.round(width))),
  });
}

// ── Sign in with Apple JS: a popup addressed to the Services ID ──
type AppleAuth = {
  init: (o: Record<string, unknown>) => void;
  signIn: () => Promise<{
    authorization?: { id_token?: string };
    user?: { name?: { firstName?: string; lastName?: string } };
  }>;
};

export async function appleSignIn(): Promise<{ idToken: string; nonce?: string; name?: string }> {
  await loadScript("https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js");
  const auth = (window as unknown as { AppleID?: { auth?: AppleAuth } }).AppleID?.auth;
  if (!auth) throw new Error("Apple sign-in couldn't start in this browser.");
  const nonce = await makeNonce();
  auth.init({
    clientId: APPLE_ID, scope: "name email", redirectURI: APPLE_REDIRECT, usePopup: true,
    ...(nonce && { nonce: nonce.hashed }),
  });
  try {
    const r = await auth.signIn();
    const idToken = r?.authorization?.id_token;
    if (!idToken) throw new Error("Apple did not return a sign-in.");
    // Apple sends the name ONCE, on the first authorisation, and never again.
    const name = [r.user?.name?.firstName, r.user?.name?.lastName].filter(Boolean).join(" ").trim();
    return { idToken, nonce: nonce?.raw, name: name || undefined };
  } catch (e) {
    const code = (e as { error?: string })?.error;
    if (code === "popup_closed_by_user" || code === "user_cancelled_authorize") throw new SocialCancelled();
    throw e instanceof Error ? e : new Error("Apple sign-in didn't finish.");
  }
}

// ── Cloudflare Turnstile (only when core hands us a site key) ──
type Turnstile = {
  render: (el: HTMLElement, o: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};

export async function mountTurnstile(el: HTMLElement, siteKey: string,
                                     onToken: (t: string | null) => void): Promise<() => void> {
  await loadScript("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit");
  const ts = (window as unknown as { turnstile?: Turnstile }).turnstile;
  if (!ts) throw new Error("The human check couldn't load. Refresh the page.");
  el.innerHTML = "";
  const id = ts.render(el, {
    sitekey: siteKey, theme: "light", action: "signup",
    callback: (t: string) => onToken(t),
    "expired-callback": () => onToken(null),
    "error-callback": () => onToken(null),
  });
  return () => { try { ts.reset(id); } catch { /* gone */ } };
}
