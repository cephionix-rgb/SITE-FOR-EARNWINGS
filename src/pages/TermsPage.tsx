import { FileWarning, Gavel, TriangleAlert } from "lucide-react";
import { LegalShell, Section, Sub, Callout, NoteCard, Bullets, DontList, DoList } from "../components/Legal";
import { Inline } from "../components/guide/GuideBlocks";
import {
  CREDITS,
  CREDITS_INTRO,
  TERMS,
  TERMS_STATUS,
  TERMS_UPDATED,
  type LegalBlock,
} from "../content/legal";

// Rendered from src/content/legal.js, the same module that is published as
// /legal/terms-and-credits.json for the app. Edit the text there, not here.


function LegalBlockView({ b }: { b: LegalBlock }) {
  switch (b.t) {
    case "p":
      return <p><Inline text={b.text} /></p>;
    case "sub":
      return <Sub>{b.text}</Sub>;
    case "ul":
      return <Bullets items={b.items.map((x, i) => <Inline key={i} text={x} />)} />;
    case "dont":
      return <DontList items={b.items.map((x, i) => <Inline key={i} text={x} />)} />;
    case "do":
      return <DoList items={b.items.map((x, i) => <Inline key={i} text={x} />)} />;
    case "callout":
      return (
        <Callout icon={b.title ? TriangleAlert : Gavel} title={b.title || undefined}>
          <p><Inline text={b.text} /></p>
        </Callout>
      );
    case "note":
      return (
        <NoteCard icon={Gavel}>
          <p><Inline text={b.text} /></p>
        </NoteCard>
      );
  }
}

function Credits() {
  return (
    <Section title="Licence notices" id="credits">
      <p className="text-[14px]">{CREDITS_INTRO}</p>
      <ul className="mt-2 flex flex-col gap-1.5 text-[13px] leading-relaxed" style={{ color: "#2b3f66" }}>
        {CREDITS.map((c) => (
          <li key={c.id} className="break-words">
            <strong style={{ color: "#0D1629" }}>{c.name}</strong>{" "}
            (<a href={c.licenceUrl} target="_blank" rel="noopener noreferrer" className="underline">{c.licence}</a>): {c.attribution}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function TermsPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Terms of Service"
      intro="The ground rules for using EarnWings, in plain English."
      updated={TERMS_UPDATED}
    >
      <Callout icon={FileWarning} title={`${TERMS_STATUS}: not yet final`}>
        <p>
          These terms are a plain-English draft that is being reviewed by a lawyer. They describe how we intend the Service to
          work, but they may change before they are final. Items marked TODO are open decisions. Questions:
          support@earnwings.org.
        </p>
      </Callout>

      {TERMS.map((s) => (
        <Section key={s.id} title={s.title} id={s.id}>
          {s.blocks.map((b, i) => <LegalBlockView key={i} b={b} />)}
        </Section>
      ))}

      <Credits />
    </LegalShell>
  );
}
