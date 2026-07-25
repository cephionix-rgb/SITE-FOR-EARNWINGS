import { useEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Link } from "../lib/router";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

/**
 * Standalone page frame (About / Privacy / Terms): solid Nav, a branded sky
 * header, a centred content column and the shared Footer. Always opens scrolled
 * to the top.
 */
export function PageShell({ eyebrow, title, subtitle, children }: Props) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="relative">
      <Nav solid />

      <header
        className="relative overflow-hidden px-6 pb-14 pt-28 sm:pt-32"
        style={{
          background:
            "linear-gradient(160deg, #1B3A7A 0%, #2E6BE5 55%, #5BA4E8 100%)",
          color: "#EAF2FF",
        }}
      >
        {/* soft cloud glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 80% at 80% 0%, rgba(255,255,255,0.5), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-white/80 transition-colors hover:text-white"
          >
            <ChevronLeft size={16} /> Back to home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="eyebrow"
              style={{ color: "#F5D97A" }}
            >
              {eyebrow}
            </span>
            <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{title}</h1>
            {subtitle && (
              <p className="mt-4 max-w-2xl text-lg text-white/85">{subtitle}</p>
            )}
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14 sm:py-20">{children}</main>

      <Footer />
    </div>
  );
}
