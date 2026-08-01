import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plane, Check, Loader2 } from "lucide-react";
import { track } from "../lib/track";
import { Link } from "../lib/router";
import { QUIZ_PASS_MARK, SUPPORT_EMAIL } from "../lib/siteConfig";

// Primary CTA label (Task 2). Alternatives, kept for easy swapping:
//   "Get Early Boarding Access" | "Become a Founding Cadet" | "Secure My Founder Wings"
const CTA_LABEL = "Reserve My Captain Seat";

const ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined;
const CAPACITY = 200;
const EXAMS = ["CPL", "ATPL", "PPL", "RTR (A)", "Just exploring"];

// The founder perks every waitlisted cadet unlocks (mirrors the Apps Script PERKS).
const PERKS = [
  "Full app — free for 7 days",
  "First 2 chapters unlocked in every subject",
  "MCQ banks for those 2 chapters",
  "1 sample paper in every subject",
  "5 RT scenarios",
  "5 flight plans",
  "5 weight & balance calcs",
  "5 METAR decoding challenges",
  "5 compete matches vs other cadets",
  "5 Ask-Captain doubts",
];

type Status = "idle" | "submitting" | "done" | "error";

/** What we keep about a cadet who has already joined, so the seat survives a reload. */
type Joined = { code?: string; email?: string; position?: number };
const JOINED_KEY = "ew_waitlist";

/**
 * The seat this browser already holds, if any. Written on a successful join and
 * read back on mount, so refreshing the page shows the boarding pass again
 * instead of an empty form — one cadet, one seat, one set of perks.
 * (The Apps Script is the real authority: it dedupes by email, so even a cleared
 * browser or a second device cannot mint a second seat for the same address.)
 */
function loadJoined(): Joined | null {
  try {
    const raw = localStorage.getItem(JOINED_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Joined;
    return saved && saved.email ? saved : null;
  } catch {
    return null; // storage blocked / corrupt value — fall back to showing the form
  }
}

export function Waitlist() {
  const [joined, setJoined] = useState<Joined | null>(loadJoined);
  const [status, setStatus] = useState<Status>(joined ? "done" : "idle");
  const [alreadyJoined, setAlreadyJoined] = useState(!!joined);
  const [error, setError] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("company")) return; // honeypot — bots fill this

    const email = String(data.get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }

    // Phone is required: it is the second identity the backend dedupes on, so
    // one cadet cannot claim a second seat (and a second perk bundle) by
    // signing up again with a different email address.
    const phone = String(data.get("phone") || "").trim();
    if (phone.replace(/\D/g, "").length < 10) {
      setStatus("error");
      setError("Please enter your 10-digit phone number — we use it to keep one seat per cadet.");
      return;
    }

    const subscription = String(data.get("subscription") || "").trim();
    if (!subscription || !Number.isFinite(Number(subscription)) || Number(subscription) <= 0) {
      setStatus("error");
      setError("Please enter the price you'd pay per subject, in numbers (₹).");
      return;
    }

    setStatus("submitting");
    setError("");
    track("waitlist_submit", { examTarget: String(data.get("examTarget") || "") });

    const payload = {
      email,
      name: String(data.get("name") || ""),
      phone,
      subscription,
      examTarget: String(data.get("examTarget") || ""),
      source: "earnwings-landing",
    };

    try {
      if (ENDPOINT) {
        // text/plain keeps this a "simple" request, so Apps Script answers without a CORS preflight.
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });
        const d = await res.json();
        if (!d.ok) {
          throw new Error(
            d.error === "invalid_email"
              ? "Please enter a valid email."
              : d.error === "invalid_phone"
                ? "Please enter your 10-digit phone number."
                : d.error === "phone_already_joined"
                ? "That phone number is already on the waitlist. Sign in with the email you used, or check your inbox for the boarding pass."
                : "Something went wrong.",
          );
        }
        setAlreadyJoined(!!d.alreadyJoined);
        // Remember who this cadet is — this is what the quiz reads to upgrade their
        // perks, and what keeps the form from coming back after a refresh.
        const record: Joined = { code: d.code, email, position: d.position };
        setJoined(record);
        try {
          localStorage.setItem(JOINED_KEY, JSON.stringify(record));
        } catch { /* ignore */ }
        // They may have passed the quiz BEFORE joining — there was no row to write to
        // then, so replay that one attempt's score now. The server ignores it if the
        // row already has a score, so this can never hand out a second chance.
        try {
          const q = JSON.parse(localStorage.getItem("ew_quiz") || "null");
          if (q && Number(q.score) >= QUIZ_PASS_MARK) {
            fetch(ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "text/plain;charset=utf-8" },
              body: JSON.stringify({ action: "upgrade", code: d.code, email, score: Number(q.score) }),
            }).catch(() => {});
          }
        } catch { /* ignore */ }
        setStatus("done");
      } else {
        // Demo mode — no endpoint configured yet.
        await new Promise((r) => setTimeout(r, 900));
        setStatus("done");
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <AnimatePresence mode="wait">
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-soft relative overflow-hidden p-8 text-center"
          >
            <motion.div
              initial={{ x: -60, y: 30, opacity: 0, rotate: -12 }}
              animate={{ x: 120, y: -60, opacity: [0, 1, 1, 0], rotate: -12 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="pointer-events-none absolute left-6 top-1/2"
              style={{ color: "#C9981F" }}
            >
              <Plane size={40} />
            </motion.div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "#1B3A7A", color: "white" }}>
              <Check size={28} />
            </div>
            <h3 className="text-2xl font-extrabold" style={{ color: "#1B3A7A" }}>
              {alreadyJoined ? "You're already on the list" : "You're cleared for takeoff!"}
            </h3>
            <p className="mt-2" style={{ color: "#4A5A78" }}>
              {alreadyJoined
                ? "Your founder seat is reserved — one per cadet, so there's nothing left to fill in. We'll email you the moment we open the doors."
                : "You're cleared for boarding, founder cadet — we'll email you the moment we open the doors."}
            </p>

            {/* Their actual seat, so the reserved state is verifiable and not just a claim. */}
            {(joined?.code || joined?.email) && (
              <div
                className="mx-auto mt-4 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full px-4 py-2 text-xs font-bold"
                style={{ background: "rgba(201,152,31,0.12)", color: "#886611" }}
              >
                {joined.code && <span>Boarding ref {joined.code}</span>}
                {joined.code && joined.email && <span style={{ opacity: 0.45 }}>·</span>}
                {joined.email && <span style={{ fontWeight: 600 }}>{joined.email}</span>}
              </div>
            )}

            {/* Founder perks unlocked */}
            <div className="mt-6 rounded-2xl p-5 text-left" style={{ background: "rgba(27,58,122,0.05)", border: "1px solid rgba(27,58,122,0.1)" }}>
              <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#C9981F" }}>
                Your founder perks
              </div>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm" style={{ color: "#40506e" }}>
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full" style={{ background: "#1B3A7A", color: "white" }}>
                      <Check size={11} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* The one honest way out of a locked form: a typo'd email needs a human,
                not a second submission that would mint a second seat. */}
            <p className="mt-4 text-xs" style={{ color: "#7186a8" }}>
              Signed up with the wrong details?{" "}
              <a href={`mailto:${SUPPORT_EMAIL}?subject=Fix%20my%20waitlist%20details`} className="font-semibold underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-soft p-6 text-left sm:p-8"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(201,152,31,0.12)", color: "#886611" }}>
              <span className="h-2 w-2 rounded-full" style={{ background: "#C9981F" }} />
              The first {CAPACITY} to join become founder cadets
            </div>

            {/* Honeypot */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="name"
                placeholder="Your name"
                autoComplete="name"
                className="rounded-xl border px-4 py-3 outline-none focus:ring-2"
                style={{ background: "#F0F5FF", borderColor: "rgba(27,58,122,0.12)" }}
              />
              <input
                name="phone"
                type="tel"
                required
                inputMode="tel"
                placeholder="Phone number"
                autoComplete="tel"
                className="rounded-xl border px-4 py-3 outline-none focus:ring-2"
                style={{ background: "#F0F5FF", borderColor: "rgba(27,58,122,0.12)" }}
              />
            </div>
            <input
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              autoComplete="email"
              className="mt-3 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
              style={{ background: "#F0F5FF", borderColor: "rgba(27,58,122,0.12)" }}
            />

            {/* Willingness-to-pay + training goal */}
            <p className="mt-4 mb-1.5 text-[13px] font-bold" style={{ color: "#1B3A7A" }}>
              If EARNWINGS were a paid app, what would you happily pay per subject?
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-bold" style={{ color: "#4A5A78" }}>₹</span>
                <input
                  name="subscription"
                  type="number"
                  required
                  min="1"
                  step="1"
                  inputMode="numeric"
                  placeholder="Amount / subject"
                  className="w-full rounded-xl border py-3 pl-8 pr-4 outline-none focus:ring-2"
                  style={{ background: "#F0F5FF", borderColor: "rgba(27,58,122,0.12)", color: "#1B3A7A" }}
                />
              </div>
              <select
                name="examTarget"
                aria-label="Training goal"
                defaultValue=""
                className="rounded-xl border px-4 py-3 outline-none focus:ring-2"
                style={{ background: "#F0F5FF", borderColor: "rgba(27,58,122,0.12)", color: "#1B3A7A" }}
              >
                <option value="" disabled>Training goal</option>
                {EXAMS.map((x) => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </div>

            {status === "error" && (
              <p className="mt-2 text-sm" style={{ color: "#dc2626" }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={status === "submitting"} className="btn-gold mt-4 w-full text-base disabled:opacity-70">
              {status === "submitting" ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Reserving your seat…
                </>
              ) : (
                <>
                  <Plane size={18} /> {CTA_LABEL}
                </>
              )}
            </button>
            <p className="mt-3 text-center text-xs" style={{ color: "#4A5A78" }}>
              Full app free for 7 days + 2 chapters &amp; MCQs per subject, 1 sample paper each, and 5× RT, flight plans, W&amp;B, METAR, compete &amp; Ask-Captain. No spam.
            </p>
            <p className="mt-1.5 text-center text-xs" style={{ color: "#4A5A78" }}>
              We only use your details to send early-access updates. See our{" "}
              <Link to="/privacy" className="font-semibold underline" style={{ color: "#1B3A7A" }}>
                Privacy Policy
              </Link>
              .
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
