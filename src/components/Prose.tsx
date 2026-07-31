import type { ReactNode } from "react";

// Lightweight typographic building blocks for the text-heavy legal pages, all
// on the brand's light "cloud" background.

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 mt-10 text-xl font-bold" style={{ color: "#1B3A7A" }}>
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2 mt-7 text-[15px] font-bold" style={{ color: "#1B3A7A" }}>
      {children}
    </h3>
  );
}

/** Gold-edged callout for the clauses we want a reader to actually stop on. */
export function Notice({ children }: { children: ReactNode }) {
  return (
    <div
      className="mb-4 rounded-2xl border p-4 text-[15px] leading-7"
      style={{
        background: "rgba(201,152,31,0.07)",
        borderColor: "rgba(201,152,31,0.35)",
        color: "#41527A",
      }}
    >
      {children}
    </div>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-[15px] leading-7" style={{ color: "#41527A" }}>
      {children}
    </p>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul
      className="mb-4 list-disc space-y-2 pl-5 text-[15px] leading-7"
      style={{ color: "#41527A" }}
    >
      {children}
    </ul>
  );
}

export function Updated({ date }: { date: string }) {
  return (
    <p
      className="mb-2 text-sm font-semibold uppercase tracking-wider"
      style={{ color: "#8296bf" }}
    >
      Last updated · {date}
    </p>
  );
}
