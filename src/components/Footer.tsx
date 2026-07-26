import { Instagram, Youtube, Mail } from "lucide-react";
import { Link } from "../lib/router";

const SOCIALS = [
  { Icon: Instagram, href: "https://www.instagram.com/flywithearnwings/", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/@flywithearnwings?si=MSMcdyVgpkih-Ygx", label: "YouTube" },
  { Icon: Mail, href: "mailto:cephionix@gmail.com", label: "Email" },
];

export function Footer() {
  return (
    <footer style={{ background: "#0D2450", color: "#C7D6F0" }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link
            to="/"
            className="inline-flex items-center rounded-2xl bg-white/95 px-3 py-2 shadow-lg"
          >
            <picture>
              <source type="image/webp" srcSet="/assets/logo-full.webp" />
              <img
                src="/assets/logo-full.png"
                alt="EARNWINGS"
                className="h-9 w-auto"
                loading="lazy"
                decoding="async"
              />
            </picture>
          </Link>
          <p className="mt-4 max-w-xs text-sm" style={{ color: "#93A9D6" }}>
            The all-in-one training cockpit for future pilots. Learn, plan, practice
            and earn your wings.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: "#F5D97A" }}>
            Product
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/#features" className="hover:text-white">Features</Link></li>
            <li><Link to="/#play" className="hover:text-white">Try it live</Link></li>
            <li><Link to="/#app" className="hover:text-white">The app</Link></li>
            <li><Link to="/#journey" className="hover:text-white">Your journey</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: "#F5D97A" }}>
            Company
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/#waitlist" className="hover:text-white">Reserve seat</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: "#F5D97A" }}>
            Follow
          </h4>
          <div className="flex gap-3">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        className="flex flex-col items-center gap-3 border-t px-6 py-6 text-center text-xs sm:flex-row sm:justify-between"
        style={{ borderColor: "rgba(255,255,255,0.08)", color: "#7690C0" }}
      >
        <span>
          © {new Date().getFullYear()} EARNWINGS · Elevate your aviation journey ·
          Made for DGCA aspirants in India 🇮🇳
        </span>
        <span className="flex items-center gap-4">
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <Link to="/terms" className="hover:text-white">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
