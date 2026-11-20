import type { ReactNode } from "react";
import { useReveal } from "../lib/reveal";

/**
 * Section heading block used across the homepage: a left-aligned display
 * heading and at most two lines of lede. `tone="dark"` for navy bands.
 */
export function SectionHead({
  title,
  lede,
  tone = "light",
  className = "",
  id,
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  id?: string;
  children?: ReactNode;
}) {
  const ref = useReveal<HTMLDivElement>();
  const dark = tone === "dark";
  return (
    <div ref={ref} className={`reveal max-w-[44rem] ${className}`}>
      <h2 id={id} className="h-section" style={dark ? { color: "#fff" } : undefined}>
        {title}
      </h2>
      {lede && (
        <p className="lede mt-4 sm:mt-5" style={dark ? { color: "#BFD0EE" } : undefined}>
          {lede}
        </p>
      )}
      {children}
    </div>
  );
}
