import { ArrowRight } from "lucide-react";
import { LiveAirports } from "../components/LiveAirports";
import { SectionHead } from "../components/SectionHead";
import { Link } from "../lib/router";

/** Homepage: "Live at our airports". Click-to-load, so it costs nothing until used. */
export function LiveSection() {
  return (
    <section id="live" className="band">
      <div className="wrap">
        <SectionHead
          title={<>Real aircraft, <span style={{ color: "#6B7896" }}>moving right now.</span></>}
          lede="The same 3D airports you fly in the app, filled with the real traffic at 8 airports: Delhi, Mumbai, Chennai, Bengaluru, Hyderabad, Jaipur, Chandigarh and Leh. Free for everyone. Pick one and watch."
        />
        <div className="mt-10">
          <LiveAirports />
          <div className="mt-5">
            <Link to="/live" className="link-arrow text-[0.95rem]">
              Open the full live view <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
