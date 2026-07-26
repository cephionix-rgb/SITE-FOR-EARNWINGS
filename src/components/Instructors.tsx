import { INSTRUCTORS } from "../lib/siteConfig";

/**
 * Empty-safe instructors block (Task 6d). Renders nothing until real, named
 * instructors are added to siteConfig.INSTRUCTORS — so the page never shows an
 * invented person. Add { name, title, credentials?, image? } entries and this
 * lights up with no redesign. No emojis, no placeholder names.
 */
export function Instructors() {
  if (!INSTRUCTORS.length) return null;
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold" style={{ color: "#1B3A7A" }}>
        The instructors behind the course
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {INSTRUCTORS.map((p) => (
          <div key={p.name} className="card-soft flex items-center gap-4 p-5">
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                decoding="async"
                className="h-14 w-14 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-black"
                style={{ background: "rgba(27,58,122,0.1)", color: "#1B3A7A" }}
              >
                {p.name.slice(0, 1)}
              </span>
            )}
            <div>
              <h3 className="font-bold" style={{ color: "#1B3A7A" }}>
                {p.name}
              </h3>
              <p className="text-sm font-semibold" style={{ color: "#886611" }}>
                {p.title}
              </p>
              {p.credentials ? (
                <p className="mt-1 text-[13px] leading-6" style={{ color: "#41527A" }}>
                  {p.credentials}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
