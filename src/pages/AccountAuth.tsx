// Sign in, create an account, and finish setting it up, on the website.
//
// THE RULES ARE THE APP'S, BECAUSE THE ENDPOINTS ARE THE APP'S
// Nothing here is a second account system. Every step calls the same core endpoint the
// app's sign-up and onboarding call (EARNWINGS Student App/src/auth/AuthScreen.tsx and
// src/onboarding/Onboarding.tsx), and the server enforces every rule again:
//
//   create account   POST /auth/register      email, password, name, date of birth,
//                                             guardian email for 16-17, home aerodrome
//   confirm email    POST /auth/email/code + /auth/email/verify   six-digit code
//   username         GET /auth/username/check, POST /profile/complete
//   finish           POST /profile/onboarding (exams already cleared; flips "onboarded")
//   Google / Apple   POST /auth/social, then the same username/finish steps
//
// The checks written out here (password shape, age 16, guardian for 16-17) only let the
// form say what is wrong before the server does. The numbers in the words (25 Fuel, age
// 16 and 18) come from GET /auth/providers, so the page cannot drift from the server.
//
// BOT CHECK
// A hidden honeypot field, the time the form was open, and Cloudflare Turnstile when core
// has a key for it. Core checks all three (app/signins.check_web_signup).
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Eye, EyeOff, Loader2, MailCheck } from "lucide-react";

import {
  ApiError, Me, Providers, adoptSession, api, setSessionUser,
} from "../lib/api";
import {
  SocialCancelled, appleReady, appleSignIn, googleReady, mountGoogleButton, mountTurnstile,
} from "../lib/socialWeb";

const NAVY = "#1B3A7A";
const MUTED = "#41527A";
const BORDER = "#D9E2F5";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const HANDLE_RE = /^[a-z0-9_]{3,20}$/;
const ICAO_RE = /^[A-Z]{4}$/;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August",
  "September", "October", "November", "December"];

function msg(e: unknown, fallback: string): string {
  if (e instanceof ApiError) return e.message.charAt(0).toUpperCase() + e.message.slice(1);
  return e instanceof Error && e.message ? e.message : fallback;
}

/** Cloudflare Turnstile on demand: mounts the widget into `ref` while `active` and a
 *  site key exists. Core asks for it on sign-up, forgot password and resending a code
 *  (app/abuse.py). No site key = no widget and no token, and core does not ask. */
function useTurnstile(siteKey: string, active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const resetRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (!siteKey || !active || !ref.current) return;
    mountTurnstile(ref.current, siteKey, setToken)
      .then((reset) => { resetRef.current = reset; })
      .catch((e) => setFailed(msg(e, "The human check couldn't load. Refresh the page.")));
  }, [siteKey, active]);
  const reset = () => { resetRef.current?.(); setToken(null); };
  return { ref, token, reset, failed, needed: !!siteKey };
}

/** A live "You can resend in 45 s" count. */
function useCountdown() {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((n) => Math.max(0, n - 1)), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return [left, setLeft] as const;
}

/** Mirrors core routers/auth.py::_check_password, so the form can say it first. */
function passwordProblem(p: string): string | null {
  if (!p) return null;
  if (p.length < 8) return "At least 8 characters.";
  if (new TextEncoder().encode(p).length > 72) return "At most 72 characters.";
  if (/^\d+$/.test(p) || /^\p{L}+$/u.test(p)) return "Mix letters and numbers.";
  return null;
}

function ageOn(dob: Date, today = new Date()): number {
  let a = today.getFullYear() - dob.getFullYear();
  if (today.getMonth() < dob.getMonth()
      || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) a -= 1;
  return a;
}

const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm outline-none";
const inputStyle = { border: `1px solid ${BORDER}`, color: NAVY, background: "#fff" } as const;

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="rounded-2xl p-5"
      style={{ background: "#fff", boxShadow: "0 2px 14px rgba(27,58,122,0.10)", ...style }}>
      {children}
    </div>
  );
}

function Label({ text, children, hint }: { text: string; children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold" style={{ color: MUTED }}>
      {text}
      <div className="mt-1">{children}</div>
      {hint && <div className="mt-1 text-[11px] font-normal" style={{ color: MUTED }}>{hint}</div>}
    </label>
  );
}

function ErrorBox({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <div role="alert" className="rounded-xl px-3 py-2 text-sm" style={{ background: "#FDF3E7", color: "#8A5A00" }}>
      {text}
    </div>
  );
}

function Primary({ busy, disabled, children }: { busy?: boolean; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={busy || disabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white disabled:opacity-55"
      style={{ background: NAVY, border: "none" }}>
      {busy && <Loader2 size={16} className="animate-spin" />}{children}
    </button>
  );
}

// ─────────────────────────── date of birth ───────────────────────────

function useDob(minAge: number, adultAge: number) {
  const [dd, setDd] = useState("");
  const [mm, setMm] = useState("");
  const [yyyy, setYyyy] = useState("");
  const dob = dd && mm && yyyy ? `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}` : "";
  const problem = (() => {
    if (!dob) return null;
    const d = new Date(`${dob}T00:00:00`);
    if (Number.isNaN(d.getTime()) || d.getDate() !== Number(dd)) return "That date doesn't exist.";
    if (d > new Date()) return "That date is in the future.";
    const a = ageOn(d);
    if (a < minAge) return `EARNWINGS is for students aged ${minAge} and over, so we can't create an account for you yet. You're welcome back on your ${minAge}th birthday.`;
    if (a > 100) return "That date doesn't look right. Please check the year.";
    return null;
  })();
  const minor = !!dob && !problem && ageOn(new Date(`${dob}T00:00:00`)) < adultAge;
  return { dd, mm, yyyy, setDd, setMm, setYyyy, dob, problem, minor };
}

function DobFields({ d, minAge }: { d: ReturnType<typeof useDob>; minAge: number }) {
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 100 - minAge + 1 }, (_, k) => String(thisYear - minAge - k));
  const daysIn = d.mm && d.yyyy ? new Date(Number(d.yyyy), Number(d.mm), 0).getDate() : 31;
  const sel = { ...inputStyle, appearance: "none" as const };
  return (
    <div className="grid grid-cols-[1fr_1.6fr_1.2fr] gap-2">
      <select aria-label="Day" className={inputCls} style={sel} value={d.dd} onChange={(e) => d.setDd(e.target.value)}>
        <option value="">Day</option>
        {Array.from({ length: daysIn }, (_, i) => String(i + 1)).map((x) => <option key={x} value={x}>{x}</option>)}
      </select>
      <select aria-label="Month" className={inputCls} style={sel} value={d.mm} onChange={(e) => d.setMm(e.target.value)}>
        <option value="">Month</option>
        {MONTHS.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
      </select>
      <select aria-label="Year" className={inputCls} style={sel} value={d.yyyy} onChange={(e) => d.setYyyy(e.target.value)}>
        <option value="">Year</option>
        {years.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
}

// ─────────────────────────── Google / Apple ───────────────────────────

function SocialButtons({ providers, onSession, onError }: {
  providers: Providers | null;
  onSession: (u: Me) => void;
  onError: (m: string | null) => void;
}) {
  const g = googleReady(providers?.google);
  const a = appleReady(providers?.apple);
  const gRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"google" | "apple" | null>(null);

  async function finish(provider: "google" | "apple", idToken: string, nonce?: string, name?: string) {
    setBusy(provider); onError(null);
    try {
      const r = await api.social({ provider, id_token: idToken, nonce, name });
      adoptSession(r);
      onSession(r.user);
    } catch (e) {
      onError(msg(e, `Couldn't sign in with ${provider === "google" ? "Google" : "Apple"}.`));
    } finally { setBusy(null); }
  }

  useEffect(() => {
    if (!g || !gRef.current) return;
    const el = gRef.current;
    mountGoogleButton(el, el.clientWidth || 320, (t, n) => { void finish("google", t, n); })
      .catch((e) => onError(msg(e, "Google sign-in couldn't load.")));
  }, [g]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!g && !a) return null;
  return (
    <div className="space-y-2.5">
      {a && (
        <button type="button" disabled={busy !== null}
          onClick={async () => {
            onError(null);
            try { const r = await appleSignIn(); await finish("apple", r.idToken, r.nonce, r.name); }
            catch (e) { if (!(e instanceof SocialCancelled)) onError(msg(e, "Apple sign-in didn't finish.")); }
          }}
          className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: "#000", border: "none", minHeight: 44 }}>
          {busy === "apple" ? <Loader2 size={16} className="animate-spin" /> : <AppleMark />} Continue with Apple
        </button>
      )}
      {g && <div ref={gRef} className="flex min-h-[44px] w-full justify-center" aria-label="Continue with Google" />}
      {busy === "google" && <div className="text-center text-xs" style={{ color: MUTED }}>Signing in with Google…</div>}
      <div className="flex items-center gap-3 py-1 text-[11px]" style={{ color: MUTED }}>
        <span className="h-px flex-1" style={{ background: BORDER }} /> or with email
        <span className="h-px flex-1" style={{ background: BORDER }} />
      </div>
    </div>
  );
}

function AppleMark() {
  return (
    <svg width="14" height="17" viewBox="0 0 14 17" fill="#fff" aria-hidden="true">
      <path d="M11.62 9.02c.02 2.28 2 3.04 2.02 3.05-.02.05-.32 1.09-1.05 2.16-.63.93-1.29 1.85-2.33 1.87-1.02.02-1.35-.6-2.51-.6-1.17 0-1.53.58-2.5.62-1 .04-1.76-1-2.4-1.92C1.55 12.31.56 8.87 1.9 6.55c.67-1.15 1.86-1.88 3.15-1.9.99-.02 1.92.66 2.53.66.6 0 1.74-.82 2.93-.7.5.02 1.9.2 2.8 1.51-.07.05-1.67.98-1.65 2.9M9.72 3.4c.54-.65.9-1.56.8-2.46-.78.03-1.72.52-2.28 1.17-.5.57-.94 1.5-.82 2.38.87.07 1.76-.44 2.3-1.09" />
    </svg>
  );
}

// ─────────────────────────── sign in / create account ───────────────────────────

export function AuthCard({ providers, onSession }: { providers: Providers | null; onSession: (u: Me) => void }) {
  const [mode, setMode] = useState<"signin" | "signup">(() =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mode") === "signup" ? "signup" : "signin");
  const [socialErr, setSocialErr] = useState<string | null>(null);
  return (
    <Card style={{ maxWidth: 460, margin: "0 auto" }}>
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl p-1" style={{ background: "#EEF3FC" }} role="tablist">
        {([["signin", "Sign in"], ["signup", "Create account"]] as const).map(([m, label]) => (
          <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
            className="rounded-lg py-2 text-sm font-bold"
            style={{ background: mode === m ? "#fff" : "transparent", color: mode === m ? NAVY : MUTED,
                     boxShadow: mode === m ? "0 1px 4px rgba(27,58,122,0.12)" : "none", border: "none" }}>
            {label}
          </button>
        ))}
      </div>
      <SocialButtons providers={providers} onSession={onSession} onError={setSocialErr} />
      {socialErr && <div className="mb-3"><ErrorBox text={socialErr} /></div>}
      {mode === "signin"
        ? <SignInForm providers={providers} onSession={onSession} />
        : <SignUpForm providers={providers} onSession={onSession} />}
    </Card>
  );
}

function SignInForm({ providers, onSession }: { providers: Providers | null; onSession: (u: Me) => void }) {
  const [email, setEmail] = useState("");
  // Forgot password: with Turnstile on, the human check appears first.
  const [forgotting, setForgotting] = useState(false);
  const ts = useTurnstile(providers?.turnstile_site_key || "", forgotting);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const r = await api.login(email.trim(), password);
      adoptSession(r);
      onSession(r.user);
    } catch (err) {
      // The server's own words: "this account signs in with Google" is the most useful
      // thing it can say, and a generic line would send them to the reset flow.
      // One message for every wrong sign-in: core never says which part was wrong, nor
      // that an address signs in with Google or Apple (that would tell anyone it exists).
      setError(err instanceof ApiError && err.status === 401 && /invalid credentials/i.test(err.message)
        ? "Wrong email or password. If you joined with Google or Apple, use that button above."
        : msg(err, "Could not sign in."));
    } finally { setBusy(false); }
  }

  async function forgot() {
    if (!EMAIL_RE.test(email.trim())) { setError("Enter your email first, then press Forgot your password."); return; }
    if (ts.needed && !ts.token) { setForgotting(true); setError(null); return; }
    setBusy(true); setError(null);
    try {
      await api.forgot(email.trim(), ts.token);
      setSent(true);
    } catch (e) {
      // The answer never says whether an account exists. What can come back is a limit
      // ("Lots of requests from this network...", "We couldn't send the email right
      // now...") or a failed human check, and those are worth showing.
      if (e instanceof ApiError && (e.status === 429 || e.status === 400)) { setError(msg(e, "Please try again in a few minutes.")); ts.reset(); }
      else setSent(true);
    } finally { setBusy(false); }
  }

  if (sent) {
    return (
      <div className="rounded-xl p-4 text-sm" style={{ background: "#EBF3FF", color: NAVY }}>
        If that email has an EARNWINGS account, a reset link is on its way.
        <div className="mt-2 text-xs" style={{ color: MUTED }}>A password can be reset once every 3 days.</div>
        <button type="button" onClick={() => setSent(false)} className="mt-3 text-xs underline" style={{ color: MUTED }}>
          Back to sign in
        </button>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="space-y-3" aria-label="Sign in">
      <Label text="Email">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email"
          placeholder="you@example.com" autoComplete="email" required className={inputCls} style={inputStyle} />
      </Label>
      <Label text="Password">
        <div className="relative">
          <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
            name="password" autoComplete="current-password" required className={inputCls} style={inputStyle} />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1" style={{ color: MUTED, background: "none", border: "none" }}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Label>
      <ErrorBox text={error || ts.failed} />
      <Primary busy={busy}>{busy ? "Signing in" : "Sign in"}</Primary>
      {forgotting && ts.needed && (
        <div className="space-y-2">
          <p className="text-xs" style={{ color: MUTED }}>A quick check that you're a person, then we'll send the reset link.</p>
          <div ref={ts.ref} />
        </div>
      )}
      <button type="button" onClick={forgot} disabled={busy || (forgotting && ts.needed && !ts.token)}
        className="text-xs underline" style={{ color: MUTED, background: "none", border: "none" }}>
        {forgotting && ts.needed ? "Send the reset link" : "Forgot your password?"}
      </button>
      <p className="text-[11px]" style={{ color: MUTED }}>The same account works in the EARNWINGS app.</p>
    </form>
  );
}

function SignUpForm({ providers, onSession }: { providers: Providers | null; onSession: (u: Me) => void }) {
  const minAge = providers?.min_age ?? 16;
  const adultAge = providers?.adult_age ?? 18;
  const fuel = providers?.welcome_fuel ?? 25;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [guardian, setGuardian] = useState("");
  const [icao, setIcao] = useState("");
  const [company, setCompany] = useState("");          // honeypot: people never see it
  const [turnstile, setTurnstile] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const opened = useRef(Date.now());
  const tsRef = useRef<HTMLDivElement>(null);
  const resetTs = useRef<(() => void) | null>(null);
  const d = useDob(minAge, adultAge);
  const siteKey = providers?.turnstile_site_key || "";

  useEffect(() => {
    if (!siteKey || !tsRef.current) return;
    mountTurnstile(tsRef.current, siteKey, setTurnstile)
      .then((reset) => { resetTs.current = reset; })
      .catch((e) => setError(msg(e, "The human check couldn't load. Refresh the page.")));
  }, [siteKey]);

  const pwProblem = passwordProblem(password);
  const guardianOk = !d.minor || (EMAIL_RE.test(guardian.trim())
    && guardian.trim().toLowerCase() !== email.trim().toLowerCase());
  const icaoOk = !icao || ICAO_RE.test(icao);
  const ready = name.trim().length >= 2 && EMAIL_RE.test(email.trim()) && !!password && !pwProblem
    && !!d.dob && !d.problem && guardianOk && icaoOk && (!siteKey || !!turnstile);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setBusy(true); setError(null);
    try {
      const r = await api.register({
        name: name.trim(), email: email.trim(), password, dob: d.dob,
        ...(icao && { home_icao: icao }),
        ...(d.minor && { guardian_email: guardian.trim() }),
        company, fill_ms: Date.now() - opened.current,
        ...(turnstile && { turnstile_token: turnstile }),
      });
      adoptSession(r);
      onSession(r.user);
    } catch (err) {
      setError(msg(err, "Could not create the account."));
      resetTs.current?.(); setTurnstile(null);
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-3" aria-label="Create account" noValidate>
      <Label text="Full name">
        <input value={name} onChange={(e) => setName(e.target.value)} name="name" autoComplete="name"
          maxLength={120} required className={inputCls} style={inputStyle} />
      </Label>
      <Label text="Email">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email"
          placeholder="you@example.com" autoComplete="email" required className={inputCls} style={inputStyle} />
      </Label>
      <Label text="Password" hint={
        <span style={{ color: pwProblem ? "#8A5A00" : MUTED }}>{pwProblem ?? "At least 8 characters, letters and numbers."}</span>}>
        <div className="relative">
          <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
            name="new-password" autoComplete="new-password" required className={inputCls} style={inputStyle} />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1" style={{ color: MUTED, background: "none", border: "none" }}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Label>
      <Label text="Date of birth" hint={d.problem
        ? <span style={{ color: "#8A5A00" }}>{d.problem}</span>
        : `EARNWINGS is for students aged ${minAge} and over. It can't be changed once saved.`}>
        <DobFields d={d} minAge={minAge} />
      </Label>
      {d.minor && (
        <Label text="Parent or guardian's email" hint={
          `You're under ${adultAge}, so a parent or guardian approves your account by email. Until they do, you can study the free content but can't buy a plan.`}>
          <input type="email" value={guardian} onChange={(e) => setGuardian(e.target.value)} name="guardian_email"
            autoComplete="off" required className={inputCls} style={inputStyle} />
        </Label>
      )}
      <Label text="Home aerodrome (optional)" hint={icaoOk ? "The four-letter ICAO code, for example VIDP or VABB." :
        <span style={{ color: "#8A5A00" }}>Use the four-letter ICAO code, for example VIDP.</span>}>
        <input value={icao} onChange={(e) => setIcao(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4))}
          name="home_icao" placeholder="VOBL" maxLength={4} className={inputCls} style={inputStyle} />
      </Label>
      {/* Honeypot. Hidden from people and from screen readers; a script fills it. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>Company<input tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} name="company" /></label>
      </div>
      {siteKey && <div ref={tsRef} className="flex justify-center" />}
      <div className="rounded-xl px-3 py-2.5 text-xs" style={{ background: "#FDF6E3", color: "#6B4E0A" }}>
        Confirm your email after signing up and we add <b>{fuel} Fuel</b> to your account, once per
        email address. Fuel powers Captain Aezon, the AI tutor.
      </div>
      <ErrorBox text={error} />
      <Primary busy={busy} disabled={!ready}>{busy ? "Creating your account" : "Create account"}</Primary>
      <p className="text-[11px]" style={{ color: MUTED }}>
        By creating an account you agree to the <a href="/terms" className="underline">Terms</a> and the{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>
    </form>
  );
}

// ─────────────────────────── finishing the account ───────────────────────────

type Step = "email" | "profile" | "exams";

export function needsSetup(u: Me | null): boolean {
  return !!u && (!!u.needs_email_verification || !!u.needs_profile || u.onboarded === false);
}

function stepsFor(u: Me): Step[] {
  const s: Step[] = [];
  if (u.needs_email_verification) s.push("email");
  if (u.needs_profile || !u.onboarded) s.push("profile");
  if (!u.onboarded) s.push("exams");
  return s.length ? s : ["profile"];
}

/** The app's onboarding, on the web: confirm email, choose a username (and give a date
 *  of birth if Google or Apple did not), say which exams are already cleared. */
export function FinishSetup({ me, providers, onDone, onSignOut }: {
  me: Me; providers: Providers | null; onDone: (u: Me) => void; onSignOut: () => void;
}) {
  const steps = useMemo(() => stepsFor(me), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [user, setUser] = useState(me);
  const step = steps[i];
  const minAge = providers?.min_age ?? 16;
  const adultAge = providers?.adult_age ?? 18;
  const fuel = providers?.welcome_fuel ?? 25;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // email
  const [code, setCode] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [mailOk, setMailOk] = useState(true);
  const [sending, setSending] = useState(false);
  const [granted, setGranted] = useState<number | null>(null);
  const sentOnce = useRef(false);
  // Core allows one code every 60 s per address; a resend needs the human check when
  // Turnstile is on (the first code, sent as this step opens, does not).
  const [resendIn, setResendIn] = useCountdown();
  const [wantResend, setWantResend] = useState(false);
  const rts = useTurnstile(providers?.turnstile_site_key || "", wantResend);
  // profile
  const [handle, setHandle] = useState((me.handle || "").toLowerCase());
  const [name, setName] = useState(me.name || "");
  const [check, setCheck] = useState<{ handle: string; available: boolean; reason: string | null } | null>(null);
  const [checking, setChecking] = useState(false);
  const d = useDob(minAge, adultAge);
  const [guardian, setGuardian] = useState("");
  // exams
  const [subjects, setSubjects] = useState<{ subject_code: string; title: string }[]>([]);
  const [cleared, setCleared] = useState<string[]>([]);

  const update = (u: Me) => { setUser(u); setSessionUser(u); };
  const next = () => { setError(null); setI((k) => Math.min(steps.length - 1, k + 1)); };

  useEffect(() => {
    if (step !== "email" || sentOnce.current) return;
    sentOnce.current = true;
    void sendCode();
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (step === "exams") api.examSubjects().then((r) => setSubjects(r.items)).catch(() => setSubjects([]));
  }, [step]);

  async function sendCode(resend = false) {
    if (resend && rts.needed && !rts.token) { setWantResend(true); return; }
    setSending(true); setError(null);
    try {
      const r = await api.sendEmailCode(undefined, resend ? rts.token : null);
      if (r.already_verified) { update(await api.me()); next(); return; }
      setSentTo(r.email); setMailOk(r.mail_configured !== false);
      setResendIn(r.resend_in ?? 60);
      if (r.sent === false && r.message) setError(r.message);
      setWantResend(false);
    } catch (e) {
      const wait = e instanceof ApiError ? e.retryAfter : null;
      if (wait) setResendIn(wait);
      setError(wait && wait <= 60 ? null : msg(e, "Couldn't send the code. Try again."));
    } finally { setSending(false); if (resend) rts.reset(); }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const before = user.credits;
      const u = await api.verifyEmailCode(code.replace(/\s+/g, ""));
      update(u);
      setGranted(u.credits > before ? u.credits - before : 0);
    } catch (e) { setError(msg(e, "That code didn't work.")); }
    finally { setBusy(false); }
  }

  const handleShape = (() => {
    if (handle.length < 3) return "At least 3 characters.";
    if (handle.length > 20) return "At most 20 characters.";
    if (!HANDLE_RE.test(handle)) return "Use only lowercase letters, numbers and underscores.";
    return null;
  })();
  useEffect(() => {
    if (step !== "profile" || handleShape) { setCheck(null); return; }
    setChecking(true);
    const h = handle;
    const t = setTimeout(() => {
      api.checkHandle(h).then((r) => { if (r.handle === h) setCheck(r); })
        .catch(() => setCheck(null)).finally(() => setChecking(false));
    }, 350);
    return () => clearTimeout(t);
  }, [handle, step, handleShape]);

  const needDob = !user.dob;
  const guardianOk = !d.minor || (EMAIL_RE.test(guardian.trim())
    && guardian.trim().toLowerCase() !== (user.email || "").toLowerCase());
  const profileReady = name.trim().length >= 2 && !handleShape && !!check?.available
    && (!needDob || (!!d.dob && !d.problem && guardianOk));

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profileReady) return;
    setBusy(true); setError(null);
    try {
      const u = await api.completeProfile({
        handle, name: name.trim(),
        ...(needDob && { dob: d.dob }),
        ...(needDob && d.minor && { guardian_email: guardian.trim() }),
      });
      update(u);
      if (u.onboarded) onDone(u); else next();
    } catch (e) { setError(msg(e, "Couldn't save. Try again.")); }
    finally { setBusy(false); }
  }

  async function finish(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const u = await api.completeOnboarding({ name: user.name || undefined, exams_cleared: cleared });
      update(u);
      onDone(u);
    } catch (e) { setError(msg(e, "Couldn't save. Try again.")); setBusy(false); }
  }

  return (
    <Card style={{ maxWidth: 460, margin: "0 auto" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>Finish setting up</h2>
        <span className="text-xs" style={{ color: MUTED }}>Step {i + 1} of {steps.length}</span>
      </div>
      <p className="mt-1 text-sm" style={{ color: MUTED }}>Signed in as {user.email}.</p>

      {step === "email" && (
        granted !== null ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl p-4 text-sm" style={{ background: "#EAF7EF", color: NAVY }}>
              <b className="flex items-center gap-1.5"><Check size={15} style={{ color: "#0E8A4F" }} /> Email confirmed.</b>
              <div className="mt-1">
                {granted > 0
                  ? <>We added <b>{granted} Fuel</b> to your account as a welcome.</>
                  : <>The welcome Fuel ({fuel}) is given once per email address, and this address has already had it.</>}
              </div>
            </div>
            <button type="button" onClick={next}
              className="w-full rounded-xl py-3 text-sm font-bold text-white" style={{ background: NAVY, border: "none" }}>
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={verify} className="mt-5 space-y-3" aria-label="Confirm your email">
            <div className="flex items-center gap-2 text-sm font-bold" style={{ color: NAVY }}>
              <MailCheck size={16} /> Confirm your email
            </div>
            <p className="text-sm" style={{ color: MUTED }}>
              {sending && !sentTo ? "Sending a 6-digit code…"
                : !mailOk ? <>We couldn't email a code to <b style={{ color: NAVY }}>{sentTo || user.email}</b>. Email sending isn't set up on the server yet; contact support.</>
                : <>We sent a 6-digit code to <b style={{ color: NAVY }}>{sentTo || user.email}</b>. It expires in 30 minutes. Check spam if you don't see it.</>}
            </p>
            <p className="text-xs" style={{ color: MUTED }}>Confirming adds {fuel} Fuel to your account, once per email address.</p>
            <input value={code} onChange={(e) => setCode(e.target.value.replace(/[^\d\s]/g, "").slice(0, 7))}
              inputMode="numeric" autoComplete="one-time-code" placeholder="123456" aria-label="6-digit code"
              className={`${inputCls} text-center tracking-[0.4em]`} style={{ ...inputStyle, fontSize: 18 }} />
            <ErrorBox text={error} />
            <Primary busy={busy} disabled={code.replace(/\s/g, "").length < 6}>Confirm email</Primary>
            {wantResend && rts.needed && <div ref={rts.ref} />}
            <button type="button" disabled={sending || resendIn > 0 || (wantResend && rts.needed && !rts.token)}
              onClick={() => sendCode(true)} className="text-xs underline"
              style={{ color: MUTED, background: "none", border: "none" }}>
              {sending ? "Sending…" : resendIn > 0 ? `You can resend in ${resendIn} s` : "Send a new code"}
            </button>
          </form>
        )
      )}

      {step === "profile" && (
        <form onSubmit={saveProfile} className="mt-5 space-y-3" aria-label="Choose your username">
          <Label text="Username" hint={
            handleShape ? handleShape
              : checking ? "Checking…"
              : check ? (check.available ? <span style={{ color: "#0E8A4F" }}>Available</span>
                                         : <span style={{ color: "#8A5A00" }}>{check.reason || "That username is taken."}</span>)
              : "Other cadets see this name."}>
            <input value={handle} onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/\s/g, ""))}
              maxLength={20} autoComplete="username" className={inputCls} style={inputStyle} />
          </Label>
          <Label text="Full name">
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} autoComplete="name"
              className={inputCls} style={inputStyle} />
          </Label>
          {needDob && (
            <>
              <Label text="Date of birth" hint={d.problem
                ? <span style={{ color: "#8A5A00" }}>{d.problem}</span>
                : `EARNWINGS is for students aged ${minAge} and over. It can't be changed once saved.`}>
                <DobFields d={d} minAge={minAge} />
              </Label>
              {d.minor && (
                <Label text="Parent or guardian's email" hint={`You're under ${adultAge}, so a parent or guardian approves your account by email before you can buy anything.`}>
                  <input type="email" value={guardian} onChange={(e) => setGuardian(e.target.value)}
                    className={inputCls} style={inputStyle} />
                </Label>
              )}
            </>
          )}
          <ErrorBox text={error} />
          <Primary busy={busy} disabled={!profileReady}>Save and continue</Primary>
        </form>
      )}

      {step === "exams" && (
        <form onSubmit={finish} className="mt-5 space-y-3" aria-label="Exams already cleared">
          <div className="text-sm font-bold" style={{ color: NAVY }}>Which DGCA exams have you already cleared?</div>
          <p className="text-xs" style={{ color: MUTED }}>Optional. Your study plan in the app skips these.</p>
          <div className="flex flex-wrap gap-2">
            {subjects.length === 0 && <span className="text-xs" style={{ color: MUTED }}>None to show. You can carry on.</span>}
            {subjects.map((s) => {
              const on = cleared.includes(s.subject_code);
              return (
                <button key={s.subject_code} type="button"
                  onClick={() => setCleared((c) => on ? c.filter((x) => x !== s.subject_code) : [...c, s.subject_code])}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold"
                  style={{ background: on ? NAVY : "#EEF3FC", color: on ? "#fff" : NAVY, border: "none" }}>
                  {on && <Check size={12} />}{s.title}
                </button>
              );
            })}
          </div>
          <ErrorBox text={error} />
          <Primary busy={busy}>Finish</Primary>
        </form>
      )}

      <button type="button" onClick={onSignOut} className="mt-4 text-xs underline"
        style={{ color: MUTED, background: "none", border: "none" }}>
        Sign out and finish later
      </button>
    </Card>
  );
}
