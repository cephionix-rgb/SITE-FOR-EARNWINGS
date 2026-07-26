import type { ReactNode } from "react";

/**
 * Reusable "what happens if I click" micro-line for under any CTA. Keeps the
 * promise identical everywhere. No emojis — text only.
 */
export function CtaMicro({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`mt-3 text-center text-[13px] leading-snug ${className}`}
      style={{ color: "#5F7499" }}
    >
      {children ??
        "Takes about 20 seconds. No payment. You get your Founding Cadet perks and an early-access invite the moment we open the doors."}
    </p>
  );
}
