import { CalendarCheck, CircleCheck, Mail, ShieldCheck } from "lucide-react";
import { ContentLayout, DownloadBand, BODY, CARD, INK, MUTED, NAVY } from "../components/ContentLayout";
import { Link } from "../lib/router";
import { SUPPORT_EMAIL } from "../lib/siteConfig";
import { HWC_CHECK_LABELS, HWC_H1, HWC_INTRO, HWC_NOT, HWC_SECTIONS, HWC_UPDATED } from "../content/howWeCheck";
import { LAST_CHECKED } from "../content/guides";
import DGCA_META from "../content/dgcaMeta.json";

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const MAIL =
  `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Content error")}` +
  `&body=${encodeURIComponent("Subject and chapter:\nThe question or sentence:\nWhat I think is wrong, and why (a source helps):\n")}`;

/** /how-we-check: how content is written, checked and corrected. */
export function HowWeCheckPage() {
  const dates = [
    { label: HWC_CHECK_LABELS.guides, date: LAST_CHECKED },
    { label: HWC_CHECK_LABELS.samples, date: fmtDate(DGCA_META.exportedAt) },
    { label: HWC_CHECK_LABELS.page, date: HWC_UPDATED },
  ];
  return (
    <ContentLayout
      eyebrow={<><ShieldCheck size={14} /> Trust</>}
      title={HWC_H1[0]}
      gold={HWC_H1[1]}
      lede={HWC_INTRO}
      meta={<span className="inline-flex items-center gap-1.5"><CalendarCheck size={16} /> Updated {HWC_UPDATED}</span>}
    >
      <div className="flex flex-col gap-4">
        {HWC_SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24 rounded-2xl p-5 sm:p-6" style={CARD}>
            <h2 className="text-[19px] font-extrabold" style={{ color: INK }}>{s.title}</h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {s.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-[15px] leading-7" style={{ color: BODY }}>
                  <CircleCheck size={17} className="mt-[5px] shrink-0" style={{ color: NAVY }} aria-hidden />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            {s.id === "errors" && (
              <a href={MAIL} className="btn-navy mt-5 text-[15px]" style={{ minHeight: 46, padding: "0.6rem 1.2rem" }}>
                <Mail size={17} /> Report a mistake
              </a>
            )}
          </section>
        ))}

        <section className="rounded-2xl p-5 sm:p-6" style={{ background: "#F4F8FF" }}>
          <h2 className="text-[19px] font-extrabold" style={{ color: INK }}>Last checked</h2>
          <dl className="mt-3 flex flex-col gap-2">
            {dates.map((d) => (
              <div key={d.label} className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="text-[15px]" style={{ color: BODY }}>{d.label}</dt>
                <dd className="text-[15px] font-bold" style={{ color: INK }}>{d.date}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-2xl p-5 sm:p-6" style={CARD}>
          <h2 className="text-[19px] font-extrabold" style={{ color: INK }}>What we do not claim</h2>
          <ul className="mt-3 list-disc pl-5 text-[15px] leading-7" style={{ color: BODY }}>
            {HWC_NOT.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <p className="mt-3 text-[14px] leading-6" style={{ color: MUTED }}>
            Just sat a DGCA paper? <Link to="/report-exam-questions" className="font-semibold underline" style={{ color: NAVY }}>Tell us what you saw</Link>. Every change we ship is on <Link to="/whats-new" className="font-semibold underline" style={{ color: NAVY }}>What's new</Link>.
          </p>
        </section>
      </div>
      <DownloadBand where="how_we_check" title="See the checked material for yourself" />
    </ContentLayout>
  );
}
