import { useEffect } from "react";
import { ChevronLeft, Radio } from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { CloudBackground } from "../components/CloudBackground";
import { LiveAirports } from "../components/LiveAirports";
import { Link } from "../lib/router";

/** /live: the bigger live-airport view. Loads the embed when it scrolls into view. */
export function LivePage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <div className="relative min-h-screen">
      <Nav solid />
      <CloudBackground />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <Link to="/" className="mb-5 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#4A5A78" }}>
          <ChevronLeft size={16} /> Back to home
        </Link>
        <div className="mb-8 max-w-3xl">
          <span className="eyebrow"><Radio size={14} /> Live at our airports</span>
          <h1 className="mt-3 text-[clamp(2.1rem,5vw,3.4rem)] font-black leading-tight" style={{ color: "#0D1629" }}>
            Watch India's airports <span className="text-gradient-gold">live in 3D</span>
          </h1>
          <p className="mt-4 text-lg leading-8" style={{ color: "#40506e" }}>
            Real aircraft from public ADS-B data, placed in the EarnWings 3D models of Delhi, Mumbai, Chennai, Leh, Bengaluru, Hyderabad, Jaipur and Chandigarh. The camera
            follows whoever is landing or taking off. Use full screen for the best view.
          </p>
        </div>
        <LiveAirports autoLoad tall />
        <p className="mt-8 max-w-3xl text-[13.5px] leading-6" style={{ color: "#4A5A78" }}>
          Aircraft positions come from community ADS-B networks and can be delayed, incomplete or wrong. This view is for
          learning and enjoyment only and must not be used for navigation or any operational purpose.
        </p>
      </main>
      <Footer />
    </div>
  );
}
