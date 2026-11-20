import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, navigate } from "../lib/router";
import { getSessionUser, getToken, onSessionChange, resumeSession, signOut, type SessionUser } from "../lib/api";
import { track } from "../lib/track";
import { COMPANY_NAME, downloadHref } from "../lib/siteConfig";
import { GUIDE_MENU, guideHref } from "../content/guideSlugs";

// Section links point at "/#id" so they work from every page: on the landing
// page they smooth-scroll, from a sub-page they navigate home then scroll.
const LINKS = [
  { label: "Features", href: "/features" },
  { label: "Live", href: "/live" },
  { label: "Plans", href: "/#plans" },
];

/**
 * Top bar. It is always a solid bar (near-opaque paper with a hairline), never
 * see-through: on a phone the page headings used to slide visibly underneath the
 * logo. No backdrop blur either, because the cloud sky behind it moves every
 * frame and a blur would be re-rendered every frame on iPhone. The bar grows a
 * soft shadow once the page has scrolled, and pads itself below the notch /
 * Dynamic Island (viewport-fit=cover + safe-area insets).
 */
/** Who is signed in, for the header on every page. Resumes (and slides) the web
 *  session once per page load; the account page shares the same store. */
function useSessionUser(): SessionUser | null {
  const [u, setU] = useState<SessionUser | null>(() => getSessionUser());
  useEffect(() => {
    const off = onSessionChange(setU);
    if (getToken()) void resumeSession();
    return off;
  }, []);
  return u;
}

function firstName(u: SessionUser): string {
  return (u.name || "").trim().split(/\s+/)[0] || "Account";
}

export function Nav({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const user = useSessionUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the phone menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const lifted = solid || scrolled || open;

  return (
    <header
      className="fixed inset-x-0 top-0 z-[60]"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        background: lifted ? "rgba(248,251,255,0.97)" : "rgba(248,251,255,0.9)",
        borderBottom: "1px solid " + (lifted ? "rgba(11,26,51,0.09)" : "rgba(11,26,51,0.04)"),
        boxShadow: lifted ? "0 8px 24px -18px rgba(13,36,80,0.45)" : "none",
        transition: "background-color .3s ease, box-shadow .3s ease, border-color .3s ease",
      }}
    >
      <div className="wrap flex items-center justify-between" style={{ height: "var(--nav-h)" }}>
        {/* No aria-label: the visible wordmark is the accessible name, so
            voice-control users can say what they see. */}
        <Link to="/" className="flex min-h-[44px] items-center gap-2.5">
          <picture>
            <source type="image/webp" srcSet="/assets/logo-mark-96.webp" />
            <img src="/assets/logo-mark-96.png" alt="" width={96} height={96} className="h-8 w-8 sm:h-9 sm:w-9" />
          </picture>
          <span className="flex flex-col">
            <span
              className="leading-none uppercase"
              style={{
                fontFamily: "'Oswald', system-ui, sans-serif",
                fontSize: "clamp(21px, 2.2vw, 26px)",
                fontWeight: 700,
                letterSpacing: "0.045em",
              }}
            >
              <span style={{ color: "#B8860B" }}>EARN</span>
              <span style={{ color: "#1B3A7A" }}>WINGS</span>
            </span>
            <span className="mt-[3px] text-[9.5px] font-medium leading-none tracking-[0.04em]" style={{ color: "#8A6510" }}>
              by {COMPANY_NAME}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          <Link to={LINKS[0].href} className="nav-link">{LINKS[0].label}</Link>
          <GuideMenu />
          {LINKS.slice(1).map((l) => (
            <Link key={l.href} to={l.href} className="nav-link">{l.label}</Link>
          ))}
          <span aria-hidden className="h-5 w-px" style={{ background: "rgba(11,26,51,0.12)" }} />
          {user ? (
            <Link to="/account" onClick={() => track("nav_account_click")} className="nav-link inline-flex items-center gap-2"
              title={`Signed in as ${user.email}`}>
              <span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-full text-[11px]"
                style={{ background: "#1B3A7A", color: "#F5D97A", fontWeight: 800 }}>{user.avatar_initials || "EW"}</span>
              <span className="max-w-[9rem] truncate">{firstName(user)}</span>
              <span className="sr-only">, your account</span>
            </Link>
          ) : (
            <Link to="/account" onClick={() => track("nav_signin_click")} className="nav-link">
              Sign in
            </Link>
          )}
          <a
            href={downloadHref()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("nav_cta_click", { cta: "download" })}
            className="btn-gold text-[15px]"
            style={{ minHeight: 42, padding: "0.5rem 1.1rem", borderRadius: 12 }}
          >
            Download free
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <a
            href={downloadHref()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("nav_cta_click", { menu: "bar", cta: "download" })}
            className="btn-gold text-[14px]"
            style={{ minHeight: 40, padding: "0.4rem 0.9rem", borderRadius: 11 }}
          >
            Download
          </a>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ color: "#0B1A33" }}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-y-auto border-t md:hidden"
            style={{ maxHeight: "calc(100svh - var(--nav-h) - env(safe-area-inset-top))", borderColor: "rgba(11,26,51,0.08)", background: "#F8FBFF" }}
          >
            <div className="wrap flex flex-col py-3">
              <MobileGuideMenu onNavigate={() => setOpen(false)} />
              {LINKS.map((l) => (
                <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="mobile-link">
                  {l.label}
                </Link>
              ))}
              <Link
                to="/account"
                onClick={() => {
                  track(user ? "nav_account_click" : "nav_signin_click", { menu: "mobile" });
                  setOpen(false);
                }}
                className="mobile-link"
              >
                {user ? `Account (${firstName(user)})` : "Sign in"}
              </Link>
              {user && (
                <button
                  type="button"
                  onClick={() => { signOut(); setOpen(false); navigate("/account"); }}
                  className="mobile-link text-left"
                >
                  Sign out
                </button>
              )}
              <a
                href={downloadHref()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track("nav_cta_click", { menu: "mobile", cta: "download" });
                  setOpen(false);
                }}
                className="btn-gold mt-4 mb-2 w-full"
              >
                Download free
              </a>
              <p className="mb-2 text-center text-[12.5px]" style={{ color: "#4A5A78" }}>
                iPhone, Android and Mac. Live airports are free for everyone.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Desktop "Pilot Guide" dropdown. Opens on hover or click, closes on Escape,
 *  outside click or navigation. Matches the top bar's type and colours. */
function GuideMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const hoverAt = useRef(0);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const enter = () => {
    window.clearTimeout(timer.current);
    if (!open) hoverAt.current = Date.now();
    setOpen(true);
  };
  const leave = () => {
    timer.current = window.setTimeout(() => setOpen(false), 140);
  };
  return (
    <div ref={ref} className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        type="button"
        // A mouse click arrives just after the hover already opened the menu;
        // keep it open then, and toggle normally for touch and keyboard.
        onClick={() => setOpen((v) => (Date.now() - hoverAt.current < 600 ? true : !v))}
        aria-expanded={open}
        aria-haspopup="true"
        className="nav-link inline-flex items-center gap-1"
      >
        Pilot Guide <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 pt-3">
          <div className="rounded-2xl border bg-white p-2 shadow-[0_24px_50px_-20px_rgba(13,36,80,0.35)]" style={{ borderColor: "rgba(27,58,122,0.1)" }}>
            <Link
              to="/guide"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 hover:bg-[#EEF4FF]"
            >
              <span className="block text-[14px] font-bold" style={{ color: "#1B3A7A" }}>Become a pilot: overview</span>
              <span className="block text-[12.5px]" style={{ color: "#5B6B8C" }}>Free guides, checked against DGCA sources</span>
            </Link>
            <div className="mx-3 my-1 h-px" style={{ background: "rgba(27,58,122,0.08)" }} />
            {GUIDE_MENU.map((g) => (
              <Link
                key={g.slug}
                to={guideHref(g.slug)}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 hover:bg-[#EEF4FF]"
              >
                <span className="block text-[14px] font-semibold" style={{ color: "#1B3A7A" }}>{g.label}</span>
                <span className="block text-[12.5px]" style={{ color: "#5B6B8C" }}>{g.hint}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Phone menu: "Pilot Guide" as an expandable list. */
function MobileGuideMenu({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mobile-link flex w-full items-center justify-between"
      >
        Pilot Guide <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mb-1 ml-3 flex flex-col border-l pl-2" style={{ borderColor: "rgba(27,58,122,0.15)" }}>
          <Link to="/guide" onClick={onNavigate} className="rounded-lg px-3 py-2 text-[15px] font-semibold" style={{ color: "#1B3A7A" }}>
            Overview
          </Link>
          {GUIDE_MENU.map((g) => (
            <Link key={g.slug} to={guideHref(g.slug)} onClick={onNavigate} className="rounded-lg px-3 py-2 text-[15px]" style={{ color: "#2b3f66" }}>
              {g.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
