// Sign in · your profile · the plans · buy.
//
// DELIBERATELY SMALL. This is a till, not a second app. A signed-in student sees who
// they are, what plan they hold, how much Fuel is left, and every plan they could buy.
// Nothing else — no notes, no chapters, no RT, no community. Those live in the app,
// behind a login, on a device where the content can be protected. Putting any of them
// on a web page would hand the course to anyone with a browser and a screenshot key.
//
// WHY BUYING HAPPENS HERE
// An in-app purchase on iOS costs 30%. On the ₹59,999 CPL Complete that would be
// ₹18,000. The website takes payment by Razorpay at our own price. The server-side flow (checkout token → hosted Razorpay page →
// signed webhook) is the same one the app used to drive, unchanged.
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Check, Crown, Download, FileText, Loader2, LogOut, Radio, Rocket, Smartphone, Users, X, Zap } from "lucide-react";

import { PageShell } from "../components/PageShell";
import {
  ApiError, api, Boost, Invoice, Me, MyPlan, Offer, Plan, Providers, SubjectOption,
  downloadInvoice, getToken, resumeSession, rupees, setSessionUser, signOut,
} from "../lib/api";
import { downloadHref } from "../lib/siteConfig";
import { Link } from "../lib/router";
import { AuthCard, Card, FinishSetup, needsSetup } from "./AccountAuth";

const NAVY = "#1B3A7A";
const MUTED = "#41527A";
const GOLD = "#C9981F";

// ─────────────────────────── sign in ───────────────────────────
// Sign in, create an account and finish setting it up live in AccountAuth.tsx: the
// same core endpoints, and the same rules, as the app's sign-up and onboarding.

// ─────────────────────────── profile ───────────────────────────
//
// THE HERO IS DARK, EVERYTHING ELSE IS LIGHT.
// A signed-in student lands on four white cards on a pale background, and with no
// contrast anywhere the eye has nowhere to start. The identity card is therefore navy:
// it separates "who you are and what you hold" from "what you could buy", which is the
// only real hierarchy on this page.

function Stat({ k, v, gold }: { k: string; v: React.ReactNode; gold?: boolean }) {
  return (
    <div className="rounded-xl px-3.5 py-3" style={{ background: "rgba(255,255,255,0.08)" }}>
      <div className="text-[10px] uppercase" style={{ color: "#9DB4E0", letterSpacing: "0.09em", fontWeight: 700 }}>{k}</div>
      <div className="mt-1 text-lg" style={{ color: gold ? "#F5D97A" : "#fff", fontWeight: 800 }}>{v}</div>
    </div>
  );
}

function Profile({ me, plan, onSignOut }: { me: Me; plan: MyPlan | null; onSignOut: () => void }) {
  const expires = plan?.expires_at ? new Date(plan.expires_at) : null;
  const planName = plan?.plan?.name ?? (me.is_premium ? "Premium" : "Explorer");
  return (
    <div className="rounded-3xl p-6 md:p-7"
      style={{ background: "linear-gradient(135deg,#0D2450 0%,#1B3A7A 62%,#24509E 100%)",
               boxShadow: "0 18px 46px -22px rgba(13,36,80,0.75)" }}>
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg"
          style={{ background: "rgba(245,217,122,0.14)", color: "#F5D97A", fontWeight: 800,
                   border: "1.5px solid rgba(245,217,122,0.45)" }}>
          {me.avatar_initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xl text-white" style={{ fontWeight: 800 }}>{me.name}</div>
          <div className="truncate text-xs" style={{ color: "#9DB4E0" }}>{me.email}</div>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]"
            style={{ background: me.is_premium ? "rgba(245,217,122,0.16)" : "rgba(255,255,255,0.10)",
                     color: me.is_premium ? "#F5D97A" : "#C9D6EC", fontWeight: 800 }}>
            {me.is_premium && <Crown size={11} />} {planName}
          </span>
        </div>
        <button onClick={onSignOut}
          className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px]"
          style={{ background: "rgba(255,255,255,0.08)", color: "#C9D6EC", fontWeight: 700 }}>
          <LogOut size={12} /> Sign out
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-3">
        <Stat k="Fuel left" v={(plan?.credits ?? me.credits).toLocaleString("en-IN")} gold />
        <Stat k="Rank" v={me.level_name || `Level ${me.level}`} />
        <Stat k="Valid until" v={plan?.plan?.lifetime ? "Lifetime"
          : expires ? expires.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : "—"} />
      </div>

      {me.guardian?.limited && (
        <div className="mt-4 rounded-xl px-3.5 py-3 text-xs" style={{ background: "rgba(245,217,122,0.14)", color: "#F5D97A" }}>
          Waiting for your parent or guardian to approve your account
          {me.guardian.guardian_email ? <> ({me.guardian.guardian_email})</> : null}. Until they do, you can
          study the free content in the app but can't buy a plan.
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center"
        style={{ background: "rgba(255,255,255,0.08)" }}>
        <Smartphone size={22} style={{ color: "#F5D97A" }} className="shrink-0" />
        <p className="flex-1 text-[12.5px]" style={{ color: "#C9D6EC", lineHeight: 1.6 }}>
          Studying happens in the EARNWINGS app: notes, question bank, RT trainer and A320
          trainer. Sign in there with this same account. This page is your account and your plan.
        </p>
        <a href={downloadHref()} target="_blank" rel="noopener noreferrer"
          className="btn-gold shrink-0 text-[14px]" style={{ minHeight: 40, padding: "0.45rem 1rem", borderRadius: 11 }}>
          Download the app
        </a>
      </div>
    </div>
  );
}

// ───────────────────── subjects, Fuel, invoices ─────────────────────
//
// The three questions a paying student actually has — what did I buy, what is Fuel,
// where is my receipt — answered on the page they land on rather than only inside an
// app they may not have installed yet.

function SectionCard({ icon, title, right, children }: {
  icon: React.ReactNode; title: string; right?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ background: "#FDF3E7", color: GOLD }}>{icon}</span>
        <h3 className="text-base" style={{ color: NAVY, fontWeight: 800 }}>{title}</h3>
        {right && <div className="ml-auto">{right}</div>}
      </div>
      {children}
    </Card>
  );
}

function SubjectsCard({ plan, onChanged }: { plan: MyPlan; onChanged: () => void }) {
  const ent = plan.entitlement;
  const [all, setAll] = useState<SubjectOption[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const choosing = !!ent && !ent.all_access && ent.remaining > 0;

  useEffect(() => {
    if (!choosing) return;
    api.subjects().then((r) => setAll(r.items)).catch(() => {});
  }, [choosing, ent?.remaining]);

  if (!plan.user.is_premium || !ent) return null;
  const held = ent.unlocked_subjects ?? [];

  async function save() {
    setBusy(true); setErr(null);
    try { await api.chooseSubjects(picked); setPicked([]); onChanged(); }
    catch (e) { setErr(e instanceof ApiError ? e.message : "Could not save your choice."); }
    finally { setBusy(false); }
  }

  function toggle(code: string) {
    setPicked((p) => p.includes(code) ? p.filter((c) => c !== code)
      : p.length >= ent.remaining ? p : [...p, code]);
  }

  return (
    <SectionCard icon={<BookOpen size={15} />} title="Your subjects"
      right={
        <span className="rounded-full px-2.5 py-1 text-[11px]"
          style={{ background: ent.all_access ? "#EAF7EF" : "#EBF3FF",
                   color: ent.all_access ? "#0E8A4F" : NAVY, fontWeight: 800 }}>
          {ent.all_access ? "All subjects" : `${held.length} of ${ent.quota}`}
        </span>
      }>
      <p className="mt-2.5 text-sm" style={{ color: MUTED }}>
        {ent.all_access
          ? <>Your plan includes <b style={{ color: NAVY }}>every DGCA subject</b> — nothing to choose.</>
          : <>Your plan covers <b style={{ color: NAVY }}>{ent.quota}</b> subject{ent.quota === 1 ? "" : "s"}.
              {ent.remaining > 0 && <> <b style={{ color: GOLD }}>{ent.remaining}</b> still to choose.</>}</>}
      </p>

      {held.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {held.map((s) => (
            <span key={s.code} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs"
              style={{ background: "#EBF3FF", color: NAVY, fontWeight: 700 }}>
              <Check size={12} style={{ color: "#0E8A4F" }} /> {s.title}
            </span>
          ))}
        </div>
      )}

      {choosing && (
        <div className="mt-4">
          <div className="text-[11px] uppercase" style={{ color: MUTED, fontWeight: 800, letterSpacing: "0.07em" }}>
            Pick the paper{ent.remaining === 1 ? "" : "s"} you are sitting
          </div>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
            {all.filter((s) => !s.unlocked).map((s) => {
              const on = picked.includes(s.code);
              const full = !on && picked.length >= ent.remaining;
              return (
                <button key={s.code} onClick={() => toggle(s.code)} disabled={full}
                  className="flex items-center gap-2.5 rounded-xl border p-3 text-left text-sm transition disabled:opacity-45"
                  style={{ borderColor: on ? NAVY : "#D9E2F5", background: on ? "#EBF3FF" : "#fff",
                           color: NAVY, fontWeight: on ? 700 : 500 }}>
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{ border: `1.5px solid ${on ? NAVY : "#C3D2EC"}`, background: on ? NAVY : "#fff" }}>
                    {on && <Check size={10} style={{ color: "#fff" }} />}
                  </span>
                  {s.title}
                </button>
              );
            })}
          </div>
          {err && <div className="mt-3 text-sm" style={{ color: "#B3261E" }}>{err}</div>}
          <button onClick={save} disabled={busy || picked.length === 0}
            className="mt-3.5 w-full rounded-xl py-3 text-sm text-white transition disabled:opacity-45 sm:w-auto sm:px-6"
            style={{ background: NAVY, fontWeight: 800 }}>
            {busy ? "Saving…" : picked.length ? `Unlock ${picked.length} subject${picked.length === 1 ? "" : "s"}` : "Select to continue"}
          </button>
          <p className="mt-2 text-[11px]" style={{ color: MUTED }}>
            This spends your plan's allowance. Upgrading later keeps everything you have already opened.
          </p>
        </div>
      )}
    </SectionCard>
  );
}

function FuelCard({ plan }: { plan: MyPlan }) {
  const monthly = plan.plan.credits_per_month || 0;
  // Against the MONTHLY allowance, not an all-time total — that is the number the bar
  // is actually about, and it is what refills. Clamped so a rollover balance above the
  // allowance cannot overflow the track.
  const pct = monthly ? Math.max(3, Math.min(100, Math.round((plan.credits / monthly) * 100))) : 0;
  return (
    <SectionCard icon={<Zap size={15} />} title="How Fuel works">
      <div className="mt-3 flex items-end gap-2">
        <div className="text-4xl leading-none" style={{ color: NAVY, fontWeight: 800 }}>
          {plan.credits.toLocaleString("en-IN")}
        </div>
        <div className="pb-1 text-sm" style={{ color: MUTED }}>
          Fuel {monthly > 0 && <>of {monthly.toLocaleString("en-IN")} / month</>}
        </div>
      </div>
      {monthly > 0 && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full" style={{ background: "#E4ECFB" }}>
          <div className="h-full rounded-full"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg,#C9981F,#F5D97A)" }} />
        </div>
      )}
      <p className="mt-3.5 text-sm" style={{ color: MUTED }}>
        Fuel powers the AI. One unit asks Captain Aezon a question or builds a quiz; a
        full research brief costs more, because it costs more to produce.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {[
          [`${monthly.toLocaleString("en-IN")}`, "tops up every month"],
          [`${plan.plan.daily_ai_cap}`, "daily AI ceiling"],
          ["2 months", "maximum rollover"],
          ["Fuel packs", "top up any time"],
        ].map(([a, b]) => (
          <div key={b} className="rounded-xl px-3 py-2.5" style={{ background: "#F6F9FF" }}>
            <div className="text-sm" style={{ color: NAVY, fontWeight: 800 }}>{a}</div>
            <div className="text-[11px]" style={{ color: MUTED }}>{b}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/** The refund line under one invoice. Everything it says comes from core (`refund`):
 *  the site never decides eligibility itself, it only shows the server's answer.
 *  App Store and Google Play purchases are refunded by Apple or Google, so for those
 *  this shows only a link to the store's own refund page: no button, no form. */
function RefundLine({ inv, open, onOpen, onClose, onSent }: {
  inv: Invoice; open: boolean; onOpen: () => void; onClose: () => void;
  onSent: (message: string) => void;
}) {
  const r = inv.refund;
  const [reason, setReason] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  if (!r) return null;

  const store = r.rail === "apple" || r.rail === "google";
  const storeLabel = r.rail === "apple" ? "Ask Apple for a refund" : "Ask Google Play for a refund";

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (r?.purchase_id == null) return;
    setSending(true); setErr(null);
    try {
      const res = await api.requestRefund(r.purchase_id, reason);
      setReason("");
      onSent(res.message);
    } catch (x) {
      setErr(x instanceof ApiError ? x.message : "Could not send that. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-2 border-t pt-2" style={{ borderColor: "#E4ECFB" }}>
      {r.request && (
        <div className="text-[11px]" style={{ color: NAVY, fontWeight: 700 }}>{r.request.status_label}</div>
      )}
      {r.why && <div className="text-[11px]" style={{ color: MUTED }}>{r.why}</div>}
      {store ? (
        r.store_refund_url && (
          <a href={r.store_refund_url} target="_blank" rel="noopener noreferrer"
            className="mt-1 inline-block text-[11px] underline" style={{ color: NAVY, fontWeight: 800 }}>
            {storeLabel}
          </a>
        )
      ) : r.eligible && r.purchase_id != null && !open ? (
        <button onClick={onOpen}
          className="mt-1.5 rounded-lg px-3 py-2 text-[11px]"
          style={{ background: "#EDF2FB", color: NAVY, fontWeight: 800 }}>
          Request a refund
        </button>
      ) : null}
      {!store && r.eligible && open && (
        <form onSubmit={send} className="mt-2 space-y-2">
          {r.refund_inr > 0 && (
            <div className="text-[11px]" style={{ color: MUTED }}>
              If we approve it, {rupees(r.refund_inr)} goes back to the card, UPI or bank account you paid with.
            </div>
          )}
          <label className="block text-xs font-bold" style={{ color: MUTED }}>Why are you asking? (optional)
            <textarea className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              style={{ borderColor: "#D5E0F2", color: NAVY, minHeight: 60, background: "#fff" }}
              value={reason} maxLength={500} onChange={(e) => setReason(e.target.value)} />
          </label>
          {err && <div className="text-xs" style={{ color: "#B3261E" }}>{err}</div>}
          <div className="flex gap-2">
            <button type="submit" disabled={sending}
              className="rounded-lg px-3 py-2 text-[11px] text-white disabled:opacity-50"
              style={{ background: NAVY, fontWeight: 800 }}>
              {sending ? "Sending…" : "Send refund request"}
            </button>
            <button type="button" onClick={onClose} disabled={sending}
              className="rounded-lg px-3 py-2 text-[11px]"
              style={{ background: "#EDF2FB", color: NAVY, fontWeight: 800 }}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function InvoicesCard() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  // Which invoice has its refund form open (one at a time), and the server's reply
  // after a request was sent.
  const [refundOpen, setRefundOpen] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(() => {
    api.invoices().then((r) => setItems(r.items)).catch(() => {});
  }, []);
  useEffect(() => { load(); }, [load]);

  // Nothing bought yet is the normal state for most accounts, and an empty "Invoices"
  // heading with nothing under it looks like a fault. Render nothing instead.
  if (items.length === 0) return null;

  async function get(inv: Invoice) {
    setBusy(inv.number); setErr(null);
    try { await downloadInvoice(inv); }
    catch (e) { setErr(e instanceof ApiError ? e.message : "Could not download that invoice."); }
    finally { setBusy(null); }
  }

  const anyRefund = items.some((i) => i.refund);

  return (
    <SectionCard icon={<FileText size={15} />} title="Invoices">
      <p className="mt-2.5 text-sm" style={{ color: MUTED }}>
        Every payment you have made. Each is also attached to the confirmation email we
        sent at the time.
        {anyRefund && (
          <> Website and Windows purchases can be refunded if you ask within 7 days of paying:
            see our <Link to="/refunds" className="underline" style={{ color: NAVY, fontWeight: 700 }}>refund policy</Link>.</>
        )}
      </p>
      {notice && (
        <div className="mt-3 rounded-xl p-4 text-sm" style={{ background: "#E9F7EF", color: NAVY }}>
          <b>Request sent.</b> {notice}
        </div>
      )}
      <div className="mt-3 space-y-2">
        {items.map((inv) => (
          <div key={inv.number} className="rounded-xl px-3.5 py-3" style={{ background: "#F6F9FF" }}>
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm" style={{ color: NAVY, fontWeight: 700 }}>{inv.item}</div>
                <div className="text-[11px]" style={{ color: MUTED }}>
                  {inv.number} · {new Date(inv.issued_at).toLocaleDateString("en-IN",
                    { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
              <div className="text-sm" style={{ color: NAVY, fontWeight: 800 }}>{rupees(inv.total_inr)}</div>
              <button onClick={() => get(inv)} disabled={busy === inv.number}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] text-white disabled:opacity-50"
                style={{ background: NAVY, fontWeight: 800 }}>
                <Download size={11} /> {busy === inv.number ? "…" : "PDF"}
              </button>
            </div>
            <RefundLine inv={inv} open={refundOpen === inv.number}
              onOpen={() => { setRefundOpen(inv.number); setNotice(null); }}
              onClose={() => setRefundOpen(null)}
              onSent={(m) => { setRefundOpen(null); setNotice(m); load(); }} />
          </div>
        ))}
      </div>
      {err && <div className="mt-3 text-sm" style={{ color: "#B3261E" }}>{err}</div>}
    </SectionCard>
  );
}


// ─────────────────────────── plans ───────────────────────────

/** "3 months", "1 year": the term said the way people say it, from the catalogue's days. */
function termLabel(days: number | null, lifetime: boolean): string {
  if (lifetime || days == null) return "Lifetime";
  if (days >= 360 && days <= 366) return "1 year";
  if (days % 30 === 0) return days === 30 ? "1 month" : `${days / 30} months`;
  return `${days} days`;
}

/** The price over the term, rounded up: "about ₹3,000 a month". */
function perMonth(p: Plan): number {
  if (p.lifetime || p.days == null || p.price_inr <= 0) return 0;
  const months = p.days >= 360 && p.days <= 366 ? 12 : Math.max(1, Math.round(p.days / 30));
  return Math.ceil(p.price_inr / months);
}

function PlanCard({ p, onBuy, busy, featured = false }: { p: Plan; onBuy: () => void; busy: boolean; featured?: boolean }) {
  const term = termLabel(p.days, p.lifetime);
  // The unit a student buys is a DGCA PAPER (five in the library). `all_papers` is the
  // server's flag for "everything"; never print a count of library subjects.
  const scope = (p as Plan & { all_papers?: boolean }).all_papers || p.subjects >= 5
    ? "All CPL papers" : p.subjects === 1 ? "1 DGCA paper" : `${p.subjects} DGCA papers`;
  const free = p.price_inr === 0;
  const soon = !p.available;
  const a = p.accent || NAVY;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl"
      style={{ background: "#fff", border: featured ? `2px solid ${GOLD}` : `1px solid ${a}22`,
               boxShadow: featured ? "0 14px 34px -16px rgba(27,58,122,0.55)" : "0 6px 22px -14px rgba(27,58,122,0.45)", opacity: soon ? 0.82 : 1 }}>
      {/* The accent is a top rule, not a filled header block: eight saturated blocks
          down one page compete with the prices, which are the thing being compared. */}
      <div style={{ height: 4, background: a }} />

      <div className="flex flex-1 flex-col p-5">
        {/* INLINE, not an absolutely-positioned corner ribbon. "GREAT FOR MULTIPLE
            PAPERS" is wide enough that a floating ribbon sat straight on top of the
            plan name — the one thing on the card that must always be readable. */}
        {p.badge && (
          <div className="mb-2 inline-block self-start rounded-full px-2.5 py-1 text-[9px] text-white"
            style={{ background: a, fontWeight: 800, letterSpacing: "0.05em" }}>
            {p.badge}
          </div>
        )}
        <div className="text-[15px]" style={{ color: a, fontWeight: 800 }}>{p.name}</div>
        <div className="mt-0.5 text-[11px]" style={{ color: MUTED, fontWeight: 600 }}>
          {term} · {scope}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-[26px] leading-none" style={{ color: NAVY, fontWeight: 800 }}>
            {free ? "FREE" : rupees(p.price_inr)}
          </span>
          {p.standard_price_inr > p.price_inr && (
            <span className="text-xs line-through" style={{ color: "#9AA9C4" }}>
              {rupees(p.standard_price_inr)}
            </span>
          )}
        </div>

        {perMonth(p) > 0 && (
          <div className="mt-1 text-[11px]" style={{ color: MUTED }}>
            for {term.toLowerCase()} · about {rupees(perMonth(p))} a month
          </div>
        )}

        {p.saving_inr > 0 && (
          <div className="mt-1.5 inline-block self-start rounded px-1.5 py-0.5 text-[10px]"
            style={{ background: `${a}14`, color: a, fontWeight: 800 }}>
            Save {rupees(p.saving_inr)} · {p.saving_pct}% off
          </div>
        )}

        {/* EMI is a FLOOR, never a quote — principal ÷ tenure with no interest assumed,
            so whatever the student's bank offers can only meet or exceed it. */}
        {p.emi_available && !p.enquiry_only && (
          <div className="mt-2 text-[11px]" style={{ color: MUTED }}>
            or from <b style={{ color: NAVY }}>{rupees(p.emi_from_inr)}/mo</b> on EMI
          </div>
        )}

        <div className="my-3.5 h-px" style={{ background: "#EDF2FB" }} />

        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: MUTED }}>
          <Zap size={11} style={{ color: GOLD }} />
          <b style={{ color: NAVY }}>{p.credits_per_month.toLocaleString("en-IN")}</b>&nbsp;Fuel/month
          {p.ai_rtr && <span className="ml-auto rounded px-1.5 py-0.5 text-[9px]"
            style={{ background: "#EBF3FF", color: NAVY, fontWeight: 800 }}>AI RTR</span>}
        </div>

        <ul className="mt-3 space-y-1.5">
          {p.perks.slice(0, 5).map((x) => (
            <li key={x} className="flex gap-1.5 text-[11.5px]" style={{ color: MUTED }}>
              <Check size={12} className="mt-0.5 shrink-0" style={{ color: a }} />
              <span>{x}</span>
            </li>
          ))}
        </ul>

        <button onClick={onBuy} disabled={busy || soon}
          className="mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] text-white transition disabled:opacity-55"
          style={{ background: soon ? "#9AA9C4" : a, fontWeight: 800, marginTop: "1.25rem" }}>
          {soon ? "Coming soon"
            : p.enquiry_only ? (<><Users size={14} /> Join the next batch</>)
            : busy ? "Opening checkout…" : free ? "Start free" : `Buy ${p.name}`}
        </button>
        {p.enquiry_only && (
          <p className="mt-2 text-[10.5px] leading-snug" style={{ color: MUTED }}>
            Seats in the next live batch are arranged with you directly. Nothing is charged here.
          </p>
        )}
      </div>
    </div>
  );
}


// ─────────────────────── join the next batch ───────────────────────
// An ENQUIRY-ONLY plan (core setting "plans.enquiry_only") is shown but not sold: the
// owner arranges live-batch seats with each student directly until a batch is opened.
// This sends name, phone, preferred start month and a note; nothing is charged.

function nextMonths(count = 12): { value: string; label: string }[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return { value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
             label: d.toLocaleDateString("en-IN", { month: "long", year: "numeric" }) };
  });
}

function JoinBatch({ plan, me, onClose }: { plan: Plan; me: Me | null; onClose: () => void }) {
  const [name, setName] = useState(me?.name || "");
  const [phone, setPhone] = useState("");
  const [month, setMonth] = useState("");
  const [note, setNote] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [stage, setStage] = useState("");
  const [mode, setMode] = useState("");
  const [callTime, setCallTime] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const months = nextMonths();

  useEffect(() => {
    if (!me) return;
    api.myEnquiries().then((r) => {
      setName((n) => n || r.prefill.name);
      setPhone((p) => p || r.prefill.phone);
    }).catch(() => {});
  }, [me]);

  const ready = name.trim().length >= 2 && (phone.match(/\d/g) || []).length >= 8 && consent;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setBusy(true); setErr(null);
    try {
      const r = await api.createEnquiry({ plan_id: plan.id, name: name.trim(), phone: phone.trim(),
                                          start_month: month || null, note: note.trim() || null, consent,
                                          city: city.trim() || null, state: state.trim() || null,
                                          stage: stage || null, mode: mode || null, call_time: callTime || null,
                                          source_platform: "web", source_page: location.pathname.slice(0, 160) });
      setDone(r.message);
    } catch (x) {
      setErr(x instanceof ApiError ? x.message : "Could not send that. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const input = "mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none";
  const inputStyle = { borderColor: "#D5E0F2", color: NAVY } as const;
  return (
    <div role="dialog" aria-modal="true" aria-label="Join the next batch"
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      style={{ background: "rgba(11,22,46,0.45)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl p-5" style={{ background: "#fff" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="text-lg font-extrabold" style={{ color: NAVY }}>Join the next batch</div>
            <div className="mt-0.5 text-xs" style={{ color: MUTED }}>
              Classroom batch (live classes). Tell us how to reach you and we'll call you about the next batch.
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5" style={{ background: "#EDF2FB" }}>
            <X size={14} style={{ color: NAVY }} />
          </button>
        </div>

        {!me ? (
          <p className="mt-4 text-sm" style={{ color: MUTED }}>
            Sign in at the top of this page first, so we can attach your request to your account.
          </p>
        ) : done ? (
          <div className="mt-4 rounded-xl p-4 text-sm" style={{ background: "#E9F7EF", color: NAVY }}>
            <b>Request sent.</b> {done}
          </div>
        ) : (
          <form onSubmit={send} className="mt-4 space-y-3">
            <label className="block text-xs font-bold" style={{ color: MUTED }}>Your name
              <input className={input} style={inputStyle} value={name} maxLength={120} autoComplete="name"
                onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="block text-xs font-bold" style={{ color: MUTED }}>Phone number
              <input className={input} style={inputStyle} value={phone} maxLength={20} inputMode="tel"
                autoComplete="tel" placeholder="+91 98765 43210" onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className="block text-xs font-bold" style={{ color: MUTED }}>When would you like to start?
              <select className={input} style={inputStyle} value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">No preference</option>
                {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs font-bold" style={{ color: MUTED }}>City (optional)
                <input className={input} style={inputStyle} value={city} maxLength={80} autoComplete="address-level2"
                  onChange={(e) => setCity(e.target.value)} />
              </label>
              <label className="block text-xs font-bold" style={{ color: MUTED }}>State (optional)
                <input className={input} style={inputStyle} value={state} maxLength={80} autoComplete="address-level1"
                  onChange={(e) => setState(e.target.value)} />
              </label>
            </div>
            <label className="block text-xs font-bold" style={{ color: MUTED }}>Where are you now? (optional)
              <select className={input} style={inputStyle} value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="">Choose</option>
                <option value="class_11">In Class 11</option>
                <option value="class_12">In Class 12</option>
                <option value="class_12_pcm">Class 12 done (with Physics and Maths)</option>
                <option value="class_12_other">Class 12 done (without Physics and Maths)</option>
                <option value="graduate">Graduate</option>
                <option value="working">Working</option>
                <option value="flying">Already flying (SPL or PPL)</option>
              </select>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs font-bold" style={{ color: MUTED }}>How would you like to study?
                <select className={input} style={inputStyle} value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="">No preference</option>
                  <option value="classroom">In a classroom</option>
                  <option value="online">Online</option>
                  <option value="either">Either</option>
                </select>
              </label>
              <label className="block text-xs font-bold" style={{ color: MUTED }}>Best time to call
                <select className={input} style={inputStyle} value={callTime} onChange={(e) => setCallTime(e.target.value)}>
                  <option value="">Any time</option>
                  <option value="morning">Morning (9 am to 12)</option>
                  <option value="afternoon">Afternoon (12 to 5 pm)</option>
                  <option value="evening">Evening (5 to 8 pm)</option>
                </select>
              </label>
            </div>
            <label className="block text-xs font-bold" style={{ color: MUTED }}>Anything we should know? (optional)
              <textarea className={input} style={{ ...inputStyle, minHeight: 70 }} value={note} maxLength={500}
                onChange={(e) => setNote(e.target.value)} />
            </label>
            <label className="flex items-start gap-2 text-xs" style={{ color: NAVY }}>
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
              <span>EarnWings may call, message or email me about the classroom batch. (required)</span>
            </label>
            {err && <div className="text-xs" style={{ color: GOLD }}>{err}</div>}
            <button type="submit" disabled={!ready || busy}
              className="w-full rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-55"
              style={{ background: NAVY }}>
              {busy ? "Sending…" : "Send my request"}
            </button>
            <p className="text-[11px]" style={{ color: MUTED }}>Nothing is charged and no payment details are asked for.</p>
          </form>
        )}
      </div>
    </div>
  );
}


// ─────────────────────────── page ───────────────────────────

export function AccountPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [plan, setPlan] = useState<MyPlan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [boosts, setBoosts] = useState<Boost[]>([]);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joinPlan, setJoinPlan] = useState<Plan | null>(null);
  const [providers, setProviders] = useState<Providers | null>(null);

  const loadAccount = useCallback(async () => {
    try {
      const p = await api.myPlan();
      setMe(p.user); setPlan(p); setSessionUser(p.user);
    } catch {
      // A stale token is cleared by the client; fall back to the sign-in form.
      setMe(null); setPlan(null);
    }
  }, []);

  useEffect(() => {
    // The catalogue is public — it renders for a signed-out visitor too, which is the
    // point of a pricing page.
    api.plans().then((r) => { setPlans(r.plans); setBoosts(r.boosts); setOffer(r.offer ?? null); }).catch(() => {});
    api.providers().then(setProviders).catch(() => setProviders(null));
    // Slide the 7-day web session forward first, then read the account.
    (getToken() ? resumeSession().then(() => (getToken() ? loadAccount() : undefined)) : Promise.resolve())
      .finally(() => setLoading(false));
  }, [loadAccount]);

  function doSignOut() {
    signOut(); setMe(null); setPlan(null);
  }

  const settingUp = needsSetup(me);

  async function buy(kind: "plan" | "boost", id: string) {
    if (!me) { setError("Sign in or create an account first. A plan is attached to your account."); return; }
    if (settingUp) { setError("Finish setting up your account first (above)."); return; }
    setBuying(id); setError(null);
    try {
      const r = await api.checkout(kind, id);
      // Same tab, not a popup: a blocked popup is invisible and reads as a dead button.
      window.location.href = r.url;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not start checkout.");
      setBuying(null);
    }
  }

  return (
    <PageShell
      eyebrow="Your account"
      title={me ? (settingUp ? "Almost there" : `Welcome back, ${(me.name || "").split(" ")[0] || "cadet"}`)
        : "Sign in to EARNWINGS"}
      subtitle={me
        ? (settingUp ? "A couple of quick steps and your account is ready."
                     : "Your plan, your Fuel, and everything you can add to it.")
        : "Sign in or create a free account to see your plan, or browse what's available below."}
    >
      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin" style={{ color: NAVY }} /></div>
        ) : me && settingUp ? (
          <FinishSetup me={me} providers={providers} onSignOut={doSignOut}
            onDone={(u) => { setMe(u); loadAccount(); }} />
        ) : me ? (
          <Profile me={me} plan={plan} onSignOut={doSignOut} />
        ) : (
          <AuthCard providers={providers} onSession={(u) => { setMe(u); loadAccount(); }} />
        )}

        {/* What they bought and what powers it. Only for a paying account — there is
            nothing honest to say about subjects or Fuel to someone on the free tier
            beyond the plan cards further down, which already say it. */}
        {me && plan?.user?.is_premium && (
          <>
            <SubjectsCard plan={plan} onChanged={loadAccount} />
            <FuelCard plan={plan} />
            <InvoicesCard />
          </>
        )}

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#FDF3E7", color: GOLD }}>{error}</div>
        )}

        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold" style={{ color: NAVY }}>
            <Rocket size={20} style={{ color: GOLD }} /> Plans
            {offer?.active && (
              <span className="rounded-full px-2 py-0.5 text-[10px]"
                style={{ background: GOLD, color: "#fff", fontWeight: 800 }}>{offer.badge}</span>
            )}
          </h2>
          {offer?.active && (
            <div className="mt-3 rounded-xl p-4" style={{ background: "#FDF3E7" }}>
              <div className="text-sm font-extrabold" style={{ color: NAVY }}>{offer.label}</div>
              <p className="mt-1 text-sm" style={{ color: MUTED }}>{offer.note}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {offer.gifts.map((g) => (
                  <span key={g} className="flex items-center gap-1 text-xs" style={{ color: MUTED }}>
                    <Check size={11} style={{ color: GOLD }} /> {g}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Line-up v3 (2026-11-20): the three plans side by side, All Papers (the
              server's MOST POPULAR badge) highlighted; the free plan and the Classroom
              batch (live classes, enquiry only) sit apart as quieter rows. */}
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {plans.filter((p) => p.price_inr > 0 && !p.enquiry_only).map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <PlanCard p={p} busy={buying === p.id} featured={/popular/i.test(p.badge || "")}
                  onBuy={() => buy("plan", p.id)} />
              </motion.div>
            ))}
          </div>
          {plans.filter((p) => p.enquiry_only).map((p) => (
            <button key={p.id} onClick={() => setJoinPlan(p)}
              className="mt-4 flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left"
              style={{ background: "#F4F7FC", border: "1px solid #E3EAF6" }}>
              <Users size={18} style={{ color: GOLD }} />
              <span className="flex-1">
                <span className="block text-[14px]" style={{ color: NAVY, fontWeight: 800 }}>Classroom batch (live classes)</span>
                <span className="block text-[12px]" style={{ color: MUTED }}>
                  Live classes for every paper with instructors, plus everything in Pilot Pro
                </span>
              </span>
              <span className="text-[13px]" style={{ color: NAVY, fontWeight: 800 }}>Join the next batch →</span>
            </button>
          ))}
          {plans.some((p) => p.price_inr === 0) && (
            <p className="mt-3 text-[12px]" style={{ color: MUTED }}>
              Not ready to buy? The free plan has sample chapters of every subject, one mock per
              paper, two RT scenarios, Live Airports and the first two lessons of each cockpit trainer.
            </p>
          )}
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold" style={{ color: NAVY }}>
            <Zap size={20} style={{ color: GOLD }} /> Refuel
          </h2>
          <p className="mt-2 text-sm" style={{ color: MUTED }}>
            Fuel powers Captain Aezon, the planner and RT sessions. Quizzes,
            mock tests and your notes never cost Fuel. Refuel packs never expire — and you
            can buy them on any plan, including the free one.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {boosts.map((b) => (
              <div key={b.id} className="rounded-2xl p-5"
                style={{ background: "#fff", boxShadow: "0 2px 14px rgba(27,58,122,0.10)" }}>
                <div className="flex items-baseline">
                  <span className="text-base font-extrabold" style={{ color: NAVY }}>{b.name}</span>
                  <span className="ml-auto text-xl font-extrabold" style={{ color: NAVY }}>{rupees(b.price_inr)}</span>
                </div>
                <div className="mt-1 text-xs" style={{ color: MUTED }}>
                  {b.credits.toLocaleString("en-IN")} Fuel · never expires
                </div>
                <button onClick={() => buy("boost", b.id)} disabled={buying === b.id}
                  className="mt-4 w-full rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-60"
                  style={{ background: GOLD, border: "none" }}>
                  {buying === b.id ? "Opening checkout…" : "Buy Fuel"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {joinPlan && <JoinBatch plan={joinPlan} me={me} onClose={() => setJoinPlan(null)} />}

        <div className="flex items-center gap-2 text-xs" style={{ color: MUTED }}>
          <Crown size={13} style={{ color: GOLD }} />
          Payments are handled by Razorpay. Your plan activates automatically — you do
          not need to keep this page open.
          <Radio size={13} className="ml-auto" />
        </div>
      </div>
    </PageShell>
  );
}
