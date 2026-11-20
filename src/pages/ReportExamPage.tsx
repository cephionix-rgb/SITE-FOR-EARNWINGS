import { useState, type FormEvent } from "react";
import { ClipboardList, Copy, Mail, Send } from "lucide-react";
import { ContentLayout, DownloadBand, BODY, CARD, INK, MUTED, NAVY } from "../components/ContentLayout";
import { Link } from "../lib/router";
import { track } from "../lib/track";
import { SUPPORT_EMAIL } from "../lib/siteConfig";

/**
 * /report-exam-questions: "Report what you saw in your exam", the start of our
 * exam-seen data.
 *
 * There is no core endpoint for this yet (the only report endpoint, POST
 * /safety/report, is for community moderation and needs a signed-in user), so the
 * form builds an email to SUPPORT_EMAIL and opens the visitor's mail app. Nothing is
 * stored by the website. The backend plan (a public POST endpoint plus an
 * append-only migration) is in _work/site_wins/exam-seen-backend-plan.md; when it
 * ships, swap the mailto in submit() for a fetch and keep the fields as they are.
 */
const PAPERS = [
  "Air Navigation",
  "Aviation Meteorology",
  "Air Regulations",
  "Technical General",
  "Technical Specific",
  "RTR(A) Part 1 (theory)",
  "RTR(A) Part 2 (practical)",
  "Other",
];

type Report = { paper: string; month: string; topic: string; question: string; options: string };

function reportText(r: Report): string {
  return [
    "EXAM QUESTION REPORT (from earnwings.org)",
    `Paper: ${r.paper}`,
    `Session month: ${r.month}`,
    `Topic: ${r.topic || "-"}`,
    "",
    "Question as I remember it:",
    r.question,
    "",
    "Options or answer I remember (optional):",
    r.options || "-",
  ].join("\n");
}

function mailHref(r: Report): string {
  const subject = `Exam question report: ${r.paper}, ${r.month}`;
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reportText(r))}`;
}

const FIELD = "w-full rounded-xl border px-3.5 py-3 text-[16px] outline-none focus:ring-2";
const FIELD_STYLE: React.CSSProperties = { background: "#fff", borderColor: "rgba(27,58,122,0.18)", color: INK };

export function ExamReportForm() {
  const [r, setR] = useState<Report>({ paper: "", month: "", topic: "", question: "", options: "" });
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const set = (k: keyof Report) => (e: { target: { value: string } }) => setR((x) => ({ ...x, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    track("exam_report_submit", { paper: r.paper, month: r.month });
    // Navigation to a mailto: link, not a form action (the CSP allows form-action 'self' only).
    window.location.href = mailHref(r);
    setSent(true);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reportText(r));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const thisMonth = new Date().toISOString().slice(0, 7);
  return (
    <form onSubmit={submit} className="rounded-2xl p-5 sm:p-6" style={CARD} aria-describedby="report-note">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-[14px] font-bold" style={{ color: INK }}>
          Paper
          <select required value={r.paper} onChange={set("paper")} className={FIELD} style={FIELD_STYLE}>
            <option value="" disabled>Choose the paper</option>
            {PAPERS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-[14px] font-bold" style={{ color: INK }}>
          Session month
          <input required type="month" max={thisMonth} value={r.month} onChange={set("month")} className={FIELD} style={FIELD_STYLE} />
        </label>
      </div>
      <label className="mt-4 flex flex-col gap-1.5 text-[14px] font-bold" style={{ color: INK }}>
        Topic
        <input type="text" maxLength={120} placeholder="For example: jet streams, VOR, Rule 39B" value={r.topic} onChange={set("topic")} className={FIELD} style={FIELD_STYLE} />
      </label>
      <label className="mt-4 flex flex-col gap-1.5 text-[14px] font-bold" style={{ color: INK }}>
        The question, as you remember it
        <textarea required minLength={15} maxLength={1500} rows={4} placeholder="In your own words is fine. Numbers and units help." value={r.question} onChange={set("question")} className={FIELD} style={FIELD_STYLE} />
      </label>
      <label className="mt-4 flex flex-col gap-1.5 text-[14px] font-bold" style={{ color: INK }}>
        Options or answer you remember <span className="font-medium" style={{ color: MUTED }}>(optional)</span>
        <textarea maxLength={800} rows={2} value={r.options} onChange={set("options")} className={FIELD} style={FIELD_STYLE} />
      </label>
      <p id="report-note" className="mt-4 text-[13.5px] leading-6" style={{ color: MUTED }}>
        Write it from memory. Do not photograph, copy or share exam material. The website stores nothing: sending opens your
        email app with the report filled in, addressed to {SUPPORT_EMAIL}.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <button type="submit" className="btn-gold">
          <Send size={17} /> Send report
        </button>
        <button type="button" onClick={copy} className="btn-ghost text-[15px]" disabled={!r.question}>
          <Copy size={16} /> {copied ? "Copied" : "Copy the text instead"}
        </button>
      </div>
      {sent && (
        <p role="status" className="mt-4 rounded-xl px-4 py-3 text-[14.5px] leading-6" style={{ background: "#EEF4FF", color: NAVY }}>
          Your email app should have opened with the report ready to send. If it did not, use "Copy the text instead" and email it to{" "}
          <a href={mailHref(r)} className="font-bold underline">{SUPPORT_EMAIL}</a>. Thank you: one report helps the next batch.
        </p>
      )}
    </form>
  );
}

export function ReportExamPage() {
  return (
    <ContentLayout
      eyebrow={<><ClipboardList size={14} /> Exam reports</>}
      title="Report what you saw in "
      gold="your DGCA exam"
      lede="Just sat a DGCA paper? Tell us which paper, the session month, the topic and the question as you remember it. Two minutes now saves the next student hours."
    >
      <ExamReportForm />
      <section className="mt-6 rounded-2xl p-5 sm:p-6" style={{ background: "#F4F8FF" }}>
        <h2 className="text-[18px] font-extrabold" style={{ color: INK }}>What we do with reports</h2>
        <ul className="mt-3 list-disc pl-5 text-[15px] leading-7" style={{ color: BODY }}>
          <li>We read every report and match it to the topic and the closest questions in our bank.</li>
          <li>As reports build up over several sessions, we will mark the topics that keep coming up in the app, so you can practise them first.</li>
          <li>DGCA does not publish its papers, so anything we show from reports will be labelled as student-reported.</li>
        </ul>
        <p className="mt-3 text-[14px] leading-6" style={{ color: MUTED }}>
          Read <Link to="/how-we-check" className="font-semibold underline" style={{ color: NAVY }}>how we check content</Link>, or
          email <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex items-center gap-1 font-semibold underline" style={{ color: NAVY }}><Mail size={13} />{SUPPORT_EMAIL}</a>.
        </p>
      </section>
      <DownloadBand where="exam_report" title="Practise the topics that come up" />
    </ContentLayout>
  );
}
