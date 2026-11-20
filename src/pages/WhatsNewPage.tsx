import { CalendarCheck, Sparkles } from "lucide-react";
import { ContentLayout, DownloadBand, BODY, CARD, INK, MUTED, NAVY } from "../components/ContentLayout";
import { Link } from "../lib/router";
import { WHATS_NEW, WHATS_NEW_INTRO, WHATS_NEW_UPDATED } from "../content/whatsNew";

/** /whats-new: the dated changelog (content in src/content/whatsNew.js). */
export function WhatsNewPage() {
  // Group by month so the list reads like a logbook.
  const months: { month: string; items: typeof WHATS_NEW }[] = [];
  for (const e of WHATS_NEW) {
    const month = e.label.replace(/^\d+\s+/, "");
    const last = months[months.length - 1];
    if (last && last.month === month) last.items.push(e);
    else months.push({ month, items: [e] });
  }
  return (
    <ContentLayout
      eyebrow={<><Sparkles size={14} /> Changelog</>}
      title="What's new in "
      gold="EarnWings"
      lede={WHATS_NEW_INTRO}
      meta={<span className="inline-flex items-center gap-1.5"><CalendarCheck size={16} /> Updated {WHATS_NEW_UPDATED}</span>}
    >
      {months.map((m) => (
        <section key={m.month} className="mt-6 first:mt-0">
          <h2 className="font-mono-data mb-3 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#8A6510" }}>{m.month}</h2>
          <ol className="flex flex-col gap-3">
            {m.items.map((e) => (
              <li key={e.title} className="rounded-2xl p-5" style={CARD}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] font-bold" style={{ color: MUTED }}>
                  <time dateTime={e.date}>{e.label}</time>
                  <span className="rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]" style={{ background: "#EEF4FF", color: NAVY }}>{e.area}</span>
                </div>
                <h3 className="mt-2 text-[18px] font-extrabold leading-snug" style={{ color: INK }}>{e.title}</h3>
                <p className="mt-1.5 text-[15px] leading-7" style={{ color: BODY }}>{e.body}</p>
              </li>
            ))}
          </ol>
        </section>
      ))}
      <p className="mt-8 text-[14px] leading-6" style={{ color: MUTED }}>
        Spotted something wrong in the app? See <Link to="/how-we-check" className="font-semibold underline" style={{ color: NAVY }}>how we check and correct content</Link>.
      </p>
      <DownloadBand where="whats_new" title="Try every one of these yourself" />
    </ContentLayout>
  );
}
