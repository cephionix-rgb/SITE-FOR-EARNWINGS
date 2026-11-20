import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { Link } from "../lib/router";
import { GUIDE_MENU } from "../content/guideSlugs";
import { useReveal } from "../lib/reveal";

/** Homepage: a compact entry into the free Pilot Guide. Uses the small menu list
 *  only, so the guides' text stays out of the landing bundle. */
export function GuideTeaser() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="pilot-guide" className="band">
      <div className="wrap">
        <div
          ref={ref}
          className="reveal board-band -mx-5 grid grid-cols-1 gap-10 px-5 py-12 sm:mx-0 sm:rounded-[28px] sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 lg:p-14"
        >
          <div>
            <h2 className="h-section" style={{ color: "#fff" }}>
              Want to be a pilot? <span style={{ color: "#F2CD6B" }}>Start with the facts.</span>
            </h2>
            <p className="lede mt-5" style={{ color: "#BFD0EE" }}>
              Medicals, eGCA, the Computer Number, DGCA exams, the RTR licence and the path to the airlines. Plain English,
              checked against DGCA sources, free.
            </p>
            {/* Two real buttons with room between them: stacked full-width with a
                14px gap on a phone, side by side with a 16px gap on a tablet, and
                stacked at one shared width in the narrower desktop column. */}
            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:grid lg:w-max lg:grid-cols-1">
              <Link to="/guide" className="btn-gold w-full sm:w-auto">
                Read the Pilot Guide <ArrowRight size={18} />
              </Link>
              <a href="/guides/earnwings-pilot-guide.pdf" download className="btn-outline-light w-full sm:w-auto">
                <Download size={18} /> Complete guide (PDF)
              </a>
            </div>
          </div>
          <ul className="border-t" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
            {GUIDE_MENU.map((g) => (
              <li key={g.slug} className="border-b" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                <Link to={`/guide/${g.slug}`} className="group flex min-h-[64px] items-center justify-between gap-4 py-3.5">
                  <span>
                    <span className="block text-[1rem] font-bold text-white">{g.label}</span>
                    <span className="mt-0.5 block text-[0.82rem]" style={{ color: "#A9C0E6" }}>{g.hint}</span>
                  </span>
                  <ArrowUpRight size={18} className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" style={{ color: "#F2CD6B" }} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
