import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CalendarCheck, CircleCheck, CircleX, ClipboardList, GraduationCap, Lightbulb, MousePointerClick } from "lucide-react";
import { ContentLayout, DownloadBand, BODY, CARD, INK, MUTED, NAVY } from "../components/ContentLayout";
import { DownloadFreeButton } from "../components/DownloadBadges";
import { Link } from "../lib/router";
import { track } from "../lib/track";

/**
 * Public DGCA sample-question pages:
 *   /dgca                       every subject
 *   /dgca/<subject>             one subject's chapters
 *   /dgca/<subject>/<chapter>   overview + up to 5 sample questions from our own bank
 *
 * The words come from small JSON files that scripts/gen-routes.mjs writes into
 * /dgca-data/ at build time (scripts/dgca-pages.mjs), the same data the crawlable
 * static shell is built from. Only samples are public: the full chapter, notes and
 * question bank stay in the app.
 *
 * OWNER RULE: never show how many questions a chapter or subject has in the app. The
 * data files carry no counts; only the overall "15,000+" line may appear.
 */
type ChapterRow = { slug: string; number: number; title: string; samples: number; interactive?: boolean };
type SubjectRow = { slug: string; title: string; short: string; paper: string; intro: string; chapters: ChapterRow[] };
type Index = { updated: string; totalChapters: number; subjects: SubjectRow[] };
type Sample = { prompt: string; options: string[]; answer: number; explanation: string; whyWrong: (string | null)[] | null; examTip: string | null; syllabusRef: string | null };
type ChapterPage = {
  updated: string;
  subject: { slug: string; title: string; short: string; paper: string };
  chapter: { slug: string; number: number; title: string; visuals: number };
  /** Titles of the app's Interactive notes for this chapter (empty when it has none). */
  interactive?: string[];
  overview: string;
  topics: string[];
  samples: Sample[];
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
};

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const SUFFIX = " | EARNWINGS";

function useJson<T>(url: string | null): { data: T | null; error: boolean } {
  const [state, setState] = useState<{ url: string | null; data: T | null; error: boolean }>({ url: null, data: null, error: false });
  useEffect(() => {
    if (!url) return;
    let live = true;
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: T) => live && setState({ url, data, error: false }))
      .catch(() => live && setState({ url, data: null, error: true }));
    return () => {
      live = false;
    };
  }, [url]);
  return state.url === url ? { data: state.data, error: state.error } : { data: null, error: false };
}

export function DgcaPage({ path }: { path: string }) {
  const parts = path.split("/").filter(Boolean).slice(1); // drop "dgca"
  if (parts.length >= 2) return <ChapterView subject={parts[0]} chapter={parts[1]} />;
  return <IndexView subject={parts[0] || null} />;
}

function Loading({ error }: { error: boolean }) {
  return (
    <div className="rounded-2xl p-6 text-[15px]" style={{ ...CARD, color: MUTED }} role="status">
      {error ? (
        <>This page could not be loaded. <Link to="/dgca" className="font-semibold underline" style={{ color: NAVY }}>See all DGCA subjects</Link>.</>
      ) : (
        "Loading…"
      )}
    </div>
  );
}

/** The free-tools strip shown on every DGCA page. */
function FreeTools() {
  const tools = [
    { to: "/live", t: "Live 3D airports", d: "Real traffic at 8 Indian airports. Free for everyone." },
    { to: "/aviation-glossary", t: "Aviation glossary", d: "Ground-school terms in plain English." },
    { to: "/guide", t: "Pilot Guide", d: "Medicals, eGCA, Pariksha and the RTR licence, checked against official sources." },
  ];
  return (
    <section className="mt-10">
      <h2 className="text-[19px] font-extrabold" style={{ color: INK }}>Free tools</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-3">
        {tools.map((x) => (
          <li key={x.to}>
            <Link to={x.to} className="block h-full rounded-2xl p-4 transition-transform hover:-translate-y-0.5" style={CARD}>
              <span className="flex items-center justify-between gap-2 text-[15px] font-extrabold" style={{ color: NAVY }}>
                {x.t} <ArrowRight size={16} className="shrink-0" />
              </span>
              <span className="mt-1 block text-[13.5px] leading-6" style={{ color: BODY }}>{x.d}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13.5px] leading-6" style={{ color: MUTED }}>
        Also free in the app: METAR, TAF and NOTAM decoders, weather radar and NavCalc essentials.
      </p>
    </section>
  );
}

// ── /dgca and /dgca/<subject> ────────────────────────────────────────────────
function IndexView({ subject }: { subject: string | null }) {
  const { data, error } = useJson<Index>("/dgca-data/index.json");
  const subj = subject && data ? data.subjects.find((s) => s.slug === subject) : null;

  useEffect(() => {
    if (!data) return;
    document.title = subj ? `${subj.title}: DGCA Sample Questions${SUFFIX}` : `DGCA CPL Sample Questions by Chapter, Free${SUFFIX}`;
  }, [data, subj]);

  if (subject && data && !subj) return <NotFound />;

  if (subj) {
    return (
      <ContentLayout
        eyebrow={<><GraduationCap size={14} /> DGCA {subj.paper} paper</>}
        title={`${subj.title}: `}
        gold="sample questions"
        lede={subj.intro}
        crumbs={[{ label: "Home", to: "/" }, { label: "DGCA questions", to: "/dgca" }, { label: subj.title }]}
        meta={<>
          <span>{subj.chapters.length} chapters</span>
          <span>Full question bank in the app</span>
          <span className="inline-flex items-center gap-1.5"><CalendarCheck size={16} /> Updated {data!.updated}</span>
        </>}
      >
        <ol className="flex flex-col gap-2.5">
          {subj.chapters.map((c) => (
            <li key={c.slug}>
              <Link to={`/dgca/${subj.slug}/${c.slug}`} className="flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-transform hover:-translate-y-0.5" style={CARD}>
                <span className="font-mono-data w-7 shrink-0 text-[13px] font-semibold" style={{ color: "#8A6510" }}>{String(c.number).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15.5px] font-bold leading-snug" style={{ color: INK }}>{c.title}</span>
                  <span className="block text-[13px]" style={{ color: MUTED }}>
                    {c.samples ? `${c.samples} free sample questions` : "Figure-based: practise in the app"}{c.interactive ? " · Interactive note in the app" : ""}
                  </span>
                </span>
                <ArrowRight size={17} className="shrink-0" style={{ color: NAVY }} />
              </Link>
            </li>
          ))}
        </ol>
        <FreeTools />
        <DownloadBand where="dgca_subject" title={`Practise the full ${subj.short} question bank`} />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      eyebrow={<><BookOpen size={14} /> Free DGCA practice</>}
      title="DGCA CPL sample questions, "
      gold="chapter by chapter"
      lede="Every chapter of the EarnWings DGCA CPL course has a free page: what the chapter covers, and sample questions from our own question bank with answers and explanations."
      meta={data ? <>
        <span>{data.subjects.length} subjects</span>
        <span>{data.totalChapters} chapters</span>
        <span>15,000+ questions in the app</span>
        <span className="inline-flex items-center gap-1.5"><CalendarCheck size={16} /> Updated {data.updated}</span>
      </> : null}
      width="max-w-5xl"
    >
      {!data ? (
        <Loading error={error} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.subjects.map((s) => (
            <li key={s.slug}>
              <Link to={`/dgca/${s.slug}`} className="flex h-full flex-col rounded-2xl p-5 transition-transform hover:-translate-y-0.5" style={CARD}>
                <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: "#8A6510" }}>{s.paper}</span>
                <span className="mt-1.5 text-[18px] font-extrabold leading-snug" style={{ color: INK }}>{s.title}</span>
                <span className="mt-2 flex-1 text-[14px] leading-6" style={{ color: BODY }}>{s.intro}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-bold" style={{ color: NAVY }}>
                  {s.chapters.length} chapters <ArrowRight size={15} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <ExamReportTeaser />
      <FreeTools />
      <DownloadBand where="dgca_hub" title="Practise the whole question bank" />
    </ContentLayout>
  );
}

function ExamReportTeaser() {
  return (
    <section className="mt-10 flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6" style={{ background: "#F4F8FF" }}>
      <div>
        <h2 className="text-[18px] font-extrabold" style={{ color: INK }}>Just sat a DGCA paper?</h2>
        <p className="mt-1 text-[14.5px] leading-6" style={{ color: BODY }}>Tell us the topics and questions you remember. It helps the next batch practise what really comes up.</p>
      </div>
      <Link to="/report-exam-questions" className="btn-navy shrink-0 text-[15px]" style={{ minHeight: 46, padding: "0.6rem 1.2rem" }}>
        <ClipboardList size={17} /> Report your exam
      </Link>
    </section>
  );
}

function NotFound() {
  return (
    <ContentLayout eyebrow="DGCA questions" title="Page not found" lede="That subject or chapter does not exist. It may have been renamed.">
      <Link to="/dgca" className="btn-navy">See all DGCA subjects</Link>
    </ContentLayout>
  );
}

// ── /dgca/<subject>/<chapter> ────────────────────────────────────────────────
function ChapterView({ subject, chapter }: { subject: string; chapter: string }) {
  const { data, error } = useJson<ChapterPage>(`/dgca-data/${encodeURIComponent(subject)}/${encodeURIComponent(chapter)}.json`);

  useEffect(() => {
    if (data) document.title = `${data.chapter.title}: DGCA ${data.subject.short} Questions${SUFFIX}`;
  }, [data]);

  if (error) return <NotFound />;
  const sPath = `/dgca/${subject}`;
  return (
    <ContentLayout
      eyebrow={<><GraduationCap size={14} /> {data ? `${data.subject.title} · Chapter ${data.chapter.number}` : "DGCA sample questions"}</>}
      title={data ? data.chapter.title : "Loading…"}
      crumbs={[
        { label: "Home", to: "/" },
        { label: "DGCA questions", to: "/dgca" },
        { label: data ? data.subject.title : "Subject", to: sPath },
        { label: data ? data.chapter.title : "Chapter" },
      ]}
      meta={data ? <>
        <span>Full chapter question bank in the app</span>
        <span className="inline-flex items-center gap-1.5"><CalendarCheck size={16} /> Updated {data.updated}</span>
      </> : null}
    >
      {!data ? (
        <Loading error={false} />
      ) : (
        <>
          <section className="rounded-2xl p-5 sm:p-6" style={CARD}>
            <p className="text-[15.5px] leading-7" style={{ color: BODY }}>{data.overview}</p>
            <h2 className="mt-5 text-[17px] font-extrabold" style={{ color: INK }}>What this chapter covers</h2>
            <ul className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {data.topics.map((t) => (
                <li key={t} className="flex gap-2 text-[14.5px] leading-6" style={{ color: BODY }}>
                  <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#C9981F" }} />
                  <span className="min-w-0" style={{ overflowWrap: "anywhere" }}>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {data.interactive && data.interactive.length > 0 && (
            <section className="mt-6 flex gap-4 rounded-2xl p-5" style={{ background: "#F4F8FF", border: "1px solid rgba(46,107,229,0.16)" }}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(46,107,229,0.12)", color: "#2E6BE5" }}>
                <MousePointerClick size={21} />
              </span>
              <div className="min-w-0">
                <h2 className="text-[17px] font-extrabold" style={{ color: INK }}>Interactive note available in the app</h2>
                <p className="mt-1 text-[14.5px] leading-6" style={{ color: BODY }}>
                  Turn the knobs and watch the physics move: {data.interactive.join(" · ")}.
                </p>
              </div>
            </section>
          )}

          <h2 className="mt-10 text-[clamp(1.35rem,3vw,1.7rem)] font-black" style={{ color: INK }}>Sample questions</h2>
          {data.samples.length ? (
            <>
              <p className="mt-1 text-[14.5px]" style={{ color: MUTED }}>Pick an answer, or tap "Show answer". From the EarnWings question bank.</p>
              <ol className="mt-4 flex flex-col gap-4">
                {data.samples.map((q, i) => <QuestionCard key={i} q={q} n={i + 1} where={`${subject}/${chapter}`} />)}
              </ol>
            </>
          ) : (
            <p className="mt-2 rounded-2xl p-5 text-[15px] leading-7" style={{ ...CARD, color: BODY }}>
              This chapter's questions are built around drawings, so they are in the app, where the figures can be shown with them.
            </p>
          )}

          <div className="mt-6 flex flex-col items-start gap-2 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between" style={{ background: "#F4F8FF" }}>
            <p className="text-[15px] font-bold leading-6" style={{ color: INK }}>
              The full chapter question bank is in the app, every question with an explanation.
            </p>
            <DownloadFreeButton where="dgca_chapter_inline" className="shrink-0 text-[15px]" style={{ minHeight: 46, padding: "0.6rem 1.2rem" }}>
              Download free to practise <ArrowRight size={17} />
            </DownloadFreeButton>
          </div>

          <nav aria-label="Chapters" className="mt-8 grid gap-3 sm:grid-cols-2">
            {data.prev ? (
              <Link to={`${sPath}/${data.prev.slug}`} className="rounded-2xl p-4" style={CARD}>
                <span className="inline-flex items-center gap-1 text-[12.5px] font-bold" style={{ color: MUTED }}><ArrowLeft size={14} /> Previous chapter</span>
                <span className="mt-1 block text-[15px] font-bold leading-snug" style={{ color: NAVY }}>{data.prev.title}</span>
              </Link>
            ) : <span className="hidden sm:block" />}
            {data.next ? (
              <Link to={`${sPath}/${data.next.slug}`} className="rounded-2xl p-4 sm:text-right" style={CARD}>
                <span className="inline-flex items-center gap-1 text-[12.5px] font-bold" style={{ color: MUTED }}>Next chapter <ArrowRight size={14} /></span>
                <span className="mt-1 block text-[15px] font-bold leading-snug" style={{ color: NAVY }}>{data.next.title}</span>
              </Link>
            ) : (
              <Link to={sPath} className="rounded-2xl p-4 sm:text-right" style={CARD}>
                <span className="text-[12.5px] font-bold" style={{ color: MUTED }}>All chapters</span>
                <span className="mt-1 block text-[15px] font-bold leading-snug" style={{ color: NAVY }}>{data.subject.title}</span>
              </Link>
            )}
          </nav>

          <FreeTools />
          <ExamReportTeaser />
          <DownloadBand
            where="dgca_chapter"
            title="Download free to practise the full chapter question bank"
            body="Free on iPhone, Android and Mac. The free plan includes sample chapters in every subject and the live 3D airports; a study plan unlocks every chapter, its notes and its full question bank."
          />
        </>
      )}
    </ContentLayout>
  );
}

function QuestionCard({ q, n, where }: { q: Sample; n: number; where: string }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const reveal = shown || picked !== null;
  const choose = (i: number) => {
    if (reveal) return;
    setPicked(i);
    track("dgca_sample_answer", { where, correct: i === q.answer });
  };
  return (
    <li className="rounded-2xl p-5 sm:p-6" style={CARD}>
      <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: "#8A6510" }}>
        Question {n}{q.syllabusRef ? ` · Syllabus ${q.syllabusRef}` : ""}
      </p>
      <p className="mt-2 text-[16px] font-bold leading-7" style={{ color: INK }}>{q.prompt}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {q.options.map((o, i) => {
          const right = i === q.answer;
          const wrongPick = reveal && picked === i && !right;
          const bg = reveal && right ? "#EAF6EF" : wrongPick ? "#FBEDEB" : "#fff";
          const border = reveal && right ? "rgba(30,122,74,0.45)" : wrongPick ? "rgba(178,58,46,0.4)" : "rgba(27,58,122,0.14)";
          const why = reveal && !right && q.whyWrong?.[i];
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => choose(i)}
                aria-pressed={picked === i}
                disabled={reveal}
                className="flex w-full items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left disabled:cursor-default"
                style={{ background: bg, borderColor: border }}
              >
                <span className="font-mono-data mt-[1px] w-5 shrink-0 text-[13px] font-semibold" style={{ color: NAVY }}>{LETTERS[i]}</span>
                <span className="min-w-0 flex-1 text-[15px] leading-6" style={{ color: INK }}>
                  {o}
                  {why && <span className="mt-1 block text-[13.5px] leading-6" style={{ color: MUTED }}>{why}</span>}
                </span>
                {reveal && right && <CircleCheck size={18} className="mt-[3px] shrink-0" style={{ color: "#1E7A4A" }} aria-label="Correct answer" />}
                {wrongPick && <CircleX size={18} className="mt-[3px] shrink-0" style={{ color: "#B23A2E" }} aria-label="Your answer" />}
              </button>
            </li>
          );
        })}
      </ul>
      {!reveal ? (
        <button type="button" onClick={() => setShown(true)} className="link-arrow mt-3 text-[14.5px]">
          Show answer <ArrowRight size={15} />
        </button>
      ) : (
        <div className="mt-4 rounded-xl p-4" style={{ background: "#F4F8FF" }}>
          <p className="text-[14.5px] font-bold" style={{ color: INK }}>
            {picked === null ? "" : picked === q.answer ? "Correct. " : "Not quite. "}Answer: {LETTERS[q.answer]}
          </p>
          <p className="mt-1 text-[14.5px] leading-7" style={{ color: BODY }}>{q.explanation}</p>
          {q.examTip && (
            <p className="mt-2 flex gap-2 text-[14px] leading-6" style={{ color: BODY }}>
              <Lightbulb size={16} className="mt-[4px] shrink-0" style={{ color: "#A47610" }} aria-hidden />
              <span><strong style={{ color: INK }}>Exam tip:</strong> {q.examTip}</span>
            </p>
          )}
        </div>
      )}
    </li>
  );
}
