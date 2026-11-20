import { ArrowRight, Laptop, Smartphone, TabletSmartphone } from "lucide-react";
import { track } from "../lib/track";
import { APP_STORE_URL, PLAY_STORE_URL, downloadHref, type Platform } from "../lib/siteConfig";

/**
 * App download badges: iPhone (App Store), Android (Google Play) and Mac.
 *
 * Plain styled buttons in the site's own look, not the official store artwork (the
 * repo has no official badge files). Until a store listing URL is configured
 * (VITE_APP_STORE_URL / VITE_PLAY_STORE_URL) a badge says "Download for iPhone"
 * rather than "App Store", and points at our downloads page, so it never claims a
 * listing that does not exist yet.
 */
const BADGES: { id: Platform; top: string; name: string; Icon: typeof Smartphone }[] = [
  { id: "iphone", top: APP_STORE_URL ? "Download on the" : "Download for", name: APP_STORE_URL ? "App Store" : "iPhone", Icon: Smartphone },
  { id: "android", top: PLAY_STORE_URL ? "Get it on" : "Download for", name: PLAY_STORE_URL ? "Google Play" : "Android", Icon: TabletSmartphone },
  { id: "mac", top: "Download for", name: "Mac", Icon: Laptop },
];

export function DownloadBadges({ where, tone = "light", className = "" }: { where: string; tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Download the EarnWings app">
      {BADGES.map(({ id, top, name, Icon }) => (
        <li key={id}>
          <a
            href={downloadHref(id)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("download_click", { platform: id, where })}
            className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl px-3.5 py-1.5 transition-colors"
            style={
              dark
                ? { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff" }
                : { background: "#0D1629", border: "1px solid #0D1629", color: "#fff" }
            }
          >
            <Icon size={20} aria-hidden />
            <span className="flex flex-col text-left leading-none">
              <span className="text-[10px] font-medium" style={{ opacity: 0.78 }}>{top}</span>
              <span className="mt-[3px] text-[15px] font-bold tracking-[-0.01em]">{name}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** The primary "Download free" button: goes to the app downloads page. */
export function DownloadFreeButton({ where, className = "", style, children }: { where: string; className?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
  return (
    <a
      href={downloadHref()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("download_click", { platform: "any", where })}
      className={`btn-gold ${className}`}
      style={style}
    >
      {children ?? <>Download free <ArrowRight size={18} /></>}
    </a>
  );
}
