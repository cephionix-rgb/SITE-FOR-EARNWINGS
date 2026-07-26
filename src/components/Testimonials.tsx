import { TESTIMONIALS } from "../lib/siteConfig";

/**
 * Empty-safe testimonials (Task 5). Renders nothing until real quotes exist —
 * drop { quote, name, role } objects into siteConfig.TESTIMONIALS and this
 * lights up with no redesign.
 */
export function Testimonials() {
  if (!TESTIMONIALS.length) return null;
  return (
    <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
      {TESTIMONIALS.map((t) => (
        <figure key={t.name + t.quote} className="card-soft p-6 text-left">
          <blockquote
            className="text-[15px] leading-relaxed"
            style={{ color: "#40506e" }}
          >
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-sm font-bold" style={{ color: "#1B3A7A" }}>
            {t.name}{" "}
            <span className="font-medium" style={{ color: "#5F7499" }}>
              — {t.role}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
