import type { ReactNode } from "react";
import { Instagram, Youtube, Mail, ExternalLink } from "lucide-react";
import { Link } from "../lib/router";
import { COMPANY_NAME, COMPANY_URL, CONTACT_EMAIL, NEURALWINGS_URL, SUPPORT_EMAIL, downloadHref } from "../lib/siteConfig";
import { DownloadBadges } from "./DownloadBadges";
import { GUIDE_MENU, guideHref } from "../content/guideSlugs";

const SOCIALS = [
  { Icon: Instagram, href: "https://www.instagram.com/flywithearnwings/", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/@flywithearnwings?si=MSMcdyVgpkih-Ygx", label: "YouTube" },
  { Icon: Mail, href: `mailto:${CONTACT_EMAIL}`, label: "Email" },
];

/** External link in the footer list — new tab, with the outbound marker. */
function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 hover:text-white"
    >
      {children} <ExternalLink size={12} />
    </a>
  );
}

export function Footer() {
  return (
    <footer style={{ background: "#0D2450", color: "#C7D6F0" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-6 py-14 lg:grid-cols-5" style={{ paddingBottom: "max(3.5rem, calc(env(safe-area-inset-bottom) + 2rem))" }}>
        <div className="col-span-2 lg:col-span-1">
          <Link
            to="/"
            className="inline-flex items-center rounded-2xl bg-white/95 px-3 py-2 shadow-lg"
          >
            <picture>
              <source type="image/webp" srcSet="/assets/logo-full-160.webp" />
              <img
                src="/assets/logo-full-160.png"
                alt="EARNWINGS"
                width={160}
                height={110}
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
            DGCA ground school, radio practice and an A320 flight-deck trainer for student pilots in India.
          </p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "#F2CD6B" }}>
            Download free
          </p>
          <DownloadBadges where="footer" tone="dark" className="mt-2" />
          <p className="mt-2 max-w-xs text-xs leading-5" style={{ color: "#93A9D6" }}>
            The app and live 3D airports are free for everyone. A plan unlocks the study content.
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
          <h2 className="font-mono-data mb-3 text-[11.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#F2CD6B" }}>
            Product
          </h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/features" className="hover:text-white">Features</Link></li>
            <li><Link to="/#inside" className="hover:text-white">Inside the app</Link></li>
            <li><Link to="/live" className="hover:text-white">Live airports</Link></li>
            <li><Link to="/#journey" className="hover:text-white">Commander quiz</Link></li>
            <li><Link to="/dgca-ground-classes" className="hover:text-white">DGCA ground classes</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/aviation-glossary" className="hover:text-white">Aviation glossary</Link></li>
            <li><Link to="/live" className="hover:text-white">Live at our airports</Link></li>
            <li><Link to="/dgca" className="hover:text-white">DGCA sample questions</Link></li>
            <li><Link to="/whats-new" className="hover:text-white">What's new</Link></li>
            <li><Link to="/how-we-check" className="hover:text-white">How we check content</Link></li>
            <li><Link to="/report-exam-questions" className="hover:text-white">Report your exam questions</Link></li>
            <li><a href={downloadHref()} target="_blank" rel="noopener noreferrer" className="hover:text-white">Download free</a></li>
          </ul>
        </div>

        <div>
          <h2 className="font-mono-data mb-3 text-[11.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#F2CD6B" }}>
            Pilot Guide
          </h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/guide" className="hover:text-white">Become a pilot: overview</Link></li>
            {GUIDE_MENU.map((g) => (
              <li key={g.slug}><Link to={guideHref(g.slug)} className="hover:text-white">{g.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Cephionix column — mirrors the same column on neuralwings.org, so the
            two products share one company footer. Sibling products live on the
            Neural Wings site, so those entries point there. */}
        <div>
          <h2 className="font-mono-data mb-3 text-[11.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#F2CD6B" }}>
            {COMPANY_NAME}
          </h2>
          <ul className="space-y-2 text-sm">
            <li><Ext href={`${COMPANY_URL}/about`}>About {COMPANY_NAME}</Ext></li>
            <li><Ext href={COMPANY_URL}>cephionix.com</Ext></li>
            <li><Ext href={NEURALWINGS_URL}>Neural Wings</Ext></li>
            <li><Link to="/" className="hover:text-white">EARNWINGS (Cadet Prep)</Link></li>
            <li><Ext href={`${NEURALWINGS_URL}/about#verios`}>VERIOS (Oncology)</Ext></li>
            <li><Ext href={`${NEURALWINGS_URL}/aire`}>AIRE Engine</Ext></li>
            <li><Link to="/why-earnwings" className="hover:text-white">Why EARNWINGS</Link></li>
            <li><Link to="/research" className="hover:text-white">Research &amp; evidence</Link></li>
            <li><Ext href={`${NEURALWINGS_URL}/about#careers`}>Careers</Ext></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
            <li><Link to="/refunds" className="hover:text-white">Refund policy</Link></li>
            <li><Link to="/delivery" className="hover:text-white">Shipping &amp; delivery</Link></li>
            <li><Link to="/terms#credits" className="hover:text-white">Licence notices</Link></li>
            <li><Link to="/copyright" className="hover:text-white">Copyright &amp; IP</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact us</Link></li>
            <li><Link to="/support" className="hover:text-white">Support</Link></li>
            <li><Link to="/delete-account" className="hover:text-white">Delete your account</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-mono-data mb-3 text-[11.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#F2CD6B" }}>
            Follow
          </h2>
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
        {/* #6A83B4 on this navy is 3.98:1 — below the 4.5:1 WCAG AA minimum and
            flagged by Lighthouse. #93A9D6 measures 6.42:1. */}
        <p className="text-xs leading-6" style={{ color: "#93A9D6" }}>
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
        <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <Link to="/terms" className="hover:text-white">Terms</Link>
          <Link to="/refunds" className="hover:text-white">Refunds</Link>
          <Link to="/delivery" className="hover:text-white">Delivery</Link>
          <Link to="/terms#credits" className="hover:text-white">Credits</Link>
          <Link to="/copyright" className="hover:text-white">Copyright &amp; IP</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
          <Link to="/support" className="hover:text-white">Support</Link>
          <Link to="/delete-account" className="hover:text-white">Delete account</Link>
        </span>
      </div>
    </footer>
  );
}
