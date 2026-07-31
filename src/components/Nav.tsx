import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Link } from "../lib/router";
import { track } from "../lib/track";
import { COMPANY_NAME } from "../lib/siteConfig";

// Section links point at "/#id" so they work from every page: on the landing
// page they smooth-scroll, from a sub-page they navigate home then scroll.
const LINKS = [
  { label: "Features", href: "/features" },
  { label: "Play", href: "/#play" },
  { label: "App", href: "/#app" },
  { label: "Journey", href: "/#journey" },
];

export function Nav({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filled = solid || scrolled;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: filled ? "rgba(247,250,255,0.72)" : "transparent",
        backdropFilter: filled ? "blur(16px) saturate(140%)" : "none",
        WebkitBackdropFilter: filled ? "blur(16px) saturate(140%)" : "none",
        borderBottom: filled
          ? "1px solid rgba(27,58,122,0.08)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3" aria-label="EARNWINGS — home">
          <picture>
            <source type="image/webp" srcSet="/assets/logo-mark-96.webp" />
            <img src="/assets/logo-mark-96.png" alt="" className="h-9 w-auto sm:h-11" />
          </picture>
          {/* Wordmark + owning company, matching neuralwings.org's header lockup. */}
          <span className="flex flex-col">
            <span
              className="leading-none uppercase"
              style={{
                fontFamily: "'Oswald', 'Sora', system-ui, sans-serif",
                fontSize: "clamp(26px, 3vw, 34px)",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              <span style={{ color: "#C9981F" }}>EARN</span>
              <span style={{ color: "#1B3A7A" }}>WINGS</span>
            </span>
            <span
              className="mt-0.5 text-[10px] font-light leading-tight"
              style={{ color: "#C9981F" }}
            >
              by {COMPANY_NAME}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="text-sm font-semibold text-navy/80 transition-colors hover:text-navy"
              style={{ color: "rgba(27,58,122,0.82)" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/#waitlist"
            onClick={() => track("nav_cta_click")}
            className="btn-gold text-sm"
          >
            Reserve Seat
          </Link>
        </nav>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-navy md:hidden"
          style={{ color: "#1B3A7A", background: "rgba(255,255,255,0.6)" }}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mx-3 mt-1 rounded-2xl p-4 md:hidden glass"
          >
            <div className="flex flex-col gap-1">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 font-semibold"
                  style={{ color: "#1B3A7A" }}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/#waitlist"
                onClick={() => {
                  track("nav_cta_click", { menu: "mobile" });
                  setOpen(false);
                }}
                className="btn-gold mt-2 w-full"
              >
                Reserve Seat
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
