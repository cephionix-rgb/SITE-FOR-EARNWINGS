import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plane, Check, Loader2 } from "lucide-react";
import { track } from "../lib/track";
import { Link } from "../lib/router";
import { QUIZ_PASS_MARK } from "../lib/siteConfig";

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

export function Waitlist() {
  const [status, setStatus] = useState<Status>("idle");
  const [alreadyJoined, setAlreadyJoined] = useState(false);
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

    const phone = String(data.get("phone") || "").trim();
    if (phone && phone.replace(/\D/g, "").length < 7) {
      setStatus("error");
      setError("Please enter a valid phone number, or leave it blank.");
      return;
    }

    const subscription = String(data.get("subscription") || "").trim();
    if (!subscription || !Number.isFinite(Number(subscription)) || Number(subscription) <= 0) {
      setStatus("error");
      setError("Please enter the monthly price you'd pay, in numbers (₹).");
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
          throw new Error(d.error === "invalid_email" ? "Please enter a valid email." : "Something went wrong.");
        }
        setAlreadyJoined(!!d.alreadyJoined);
        // Remember who this cadet is so the "Cadet to Commander" quiz can upgrade their perks.
        try {
          localStorage.setItem("ew_waitlist", JSON.stringify({ code: d.code, email, position: d.position }));
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
              You're cleared for boarding, founder cadet — we'll email you the moment we open the doors.
            </p>

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
                inputMode="tel"
                placeholder="Phone number (optional)"
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
              If EARNWINGS were a paid app, what would you happily pay a month?
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
                  placeholder="Amount / month"
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
