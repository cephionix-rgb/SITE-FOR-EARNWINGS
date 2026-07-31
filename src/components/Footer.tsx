import { Instagram, Youtube, Mail, ExternalLink } from "lucide-react";
import { Link } from "../lib/router";
import { COMPANY_NAME, CONTACT_EMAIL, NEURALWINGS_URL, SUPPORT_EMAIL } from "../lib/siteConfig";

const SOCIALS = [
  { Icon: Instagram, href: "https://www.instagram.com/flywithearnwings/", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/@flywithearnwings?si=MSMcdyVgpkih-Ygx", label: "YouTube" },
  { Icon: Mail, href: `mailto:${CONTACT_EMAIL}`, label: "Email" },
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
              <source type="image/webp" srcSet="/assets/logo-full-160.webp" />
              <img
                src="/assets/logo-full-160.png"
                alt="EARNWINGS"
                className="h-9 w-auto"
                loading="lazy"
                decoding="async"
              />
            </picture>
          </Link>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "#F5D97A" }}>
            A product of {COMPANY_NAME}
          </p>
          <p className="mt-3 max-w-xs text-sm" style={{ color: "#93A9D6" }}>
            The all-in-one training cockpit for future pilots. Learn, plan, practice
            and earn your wings.
          </p>
          <ul className="mt-4 space-y-1 text-sm" style={{ color: "#93A9D6" }}>
            <li>
              Contact{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold hover:text-white" style={{ color: "#C7D6F0" }}>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              Support{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold hover:text-white" style={{ color: "#C7D6F0" }}>
                {SUPPORT_EMAIL}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: "#F5D97A" }}>
            Product
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/features" className="hover:text-white">Features</Link></li>
            <li><Link to="/#play" className="hover:text-white">Try it live</Link></li>
            <li><Link to="/#app" className="hover:text-white">The app</Link></li>
            <li><Link to="/#journey" className="hover:text-white">Your journey</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: "#F5D97A" }}>
            {COMPANY_NAME}
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={NEURALWINGS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white"
              >
                Neural Wings <ExternalLink size={12} />
              </a>
            </li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/#waitlist" className="hover:text-white">Reserve seat</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
            <li><Link to="/copyright" className="hover:text-white">Copyright &amp; IP</Link></li>
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

      {/* Standing IP notice — the short form of /copyright, on every page. */}
      <div className="mx-auto max-w-7xl px-6 pb-8">
        <p className="text-xs leading-6" style={{ color: "#6A83B4" }}>
          EARNWINGS, {COMPANY_NAME}, the EARNWINGS logo and wings device are trade
          marks of {COMPANY_NAME}. The software, source code, designs, notes,
          question banks, screens, screenshots, chapter structure and the manner
          in which information is presented on this website and in the EARNWINGS
          app are the exclusive property of {COMPANY_NAME} and are protected by
          copyright, trade mark, design and trade-secret law. No part may be
          copied, reproduced, reverse engineered, imitated, or used to build a
          similar product without prior written permission. See our{" "}
          <Link to="/copyright" className="font-semibold underline hover:text-white">
            Intellectual Property Notice
          </Link>
          .
        </p>
      </div>

      <div
        className="flex flex-col items-center gap-3 border-t px-6 py-6 text-center text-xs sm:flex-row sm:justify-between"
        style={{ borderColor: "rgba(255,255,255,0.08)", color: "#7690C0" }}
      >
        <span>
          © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          EARNWINGS is a product of {COMPANY_NAME} · Made for DGCA aspirants in
          India
        </span>
        <span className="flex items-center gap-4">
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <Link to="/terms" className="hover:text-white">Terms</Link>
          <Link to="/copyright" className="hover:text-white">Copyright &amp; IP</Link>
        </span>
      </div>
    </footer>
  );
}
