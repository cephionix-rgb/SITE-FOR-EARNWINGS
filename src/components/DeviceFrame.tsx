import type { ReactNode } from "react";
import { Signal, Wifi, BatteryMedium } from "lucide-react";

/** Apple-style Dynamic Island pill (with camera lens), sized to the phone width. */
export function DynamicIsland({ width = 250 }: { width?: number }) {
  const w = Math.round(width * 0.32);
  const h = Math.round(width * 0.095);
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 999,
        background: "#04070d",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingRight: Math.round(h * 0.42),
      }}
    >
      <span
        style={{
          width: Math.round(h * 0.4),
          height: Math.round(h * 0.4),
          borderRadius: 999,
          background: "radial-gradient(circle at 35% 35%, #26364f 0%, #05080e 70%)",
          boxShadow: "0 0 0 1px rgba(90,164,232,0.15)",
        }}
      />
    </div>
  );
}

/** iOS status bar: time on the left, Dynamic Island centered, signal/wifi/battery right. */
function StatusBar({ width }: { width: number }) {
  const barH = Math.round(width * 0.13);
  const fs = Math.round(width * 0.052);
  const ic = Math.round(width * 0.05);
  return (
    <div
      style={{
        position: "relative",
        height: barH,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 ${Math.round(width * 0.06)}px`,
        background: "#F4F8FF",
        zIndex: 4,
      }}
    >
      <span style={{ fontSize: fs, fontWeight: 700, color: "#0D1629", letterSpacing: "0.01em" }}>9:41</span>
      <div style={{ position: "absolute", left: "50%", top: Math.round(width * 0.028), transform: "translateX(-50%)" }}>
        <DynamicIsland width={width} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: Math.round(width * 0.014), color: "#0D1629" }}>
        <Signal size={ic} strokeWidth={2.4} />
        <Wifi size={ic} strokeWidth={2.4} />
        <BatteryMedium size={Math.round(ic * 1.35)} strokeWidth={2} />
      </div>
    </div>
  );
}

/** A CSS iPhone shell (status bar + Dynamic Island) wrapping a screenshot or children. */
export function PhoneFrame({
  src,
  alt,
  children,
  className,
  width = 250,
}: {
  src?: string;
  alt?: string;
  children?: ReactNode;
  className?: string;
  width?: number;
}) {
  const pad = Math.round(width * 0.035);
  return (
    <div
      className={className}
      style={{
        width,
        aspectRatio: "9 / 19.3",
        borderRadius: width * 0.16,
        padding: pad,
        background: "linear-gradient(155deg, #2a3550 0%, #0d1629 55%, #1b2540 100%)",
        boxShadow:
          "0 40px 80px -30px rgba(13,22,41,0.6), inset 0 1px 2px rgba(255,255,255,0.25)",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          borderRadius: width * 0.125,
          overflow: "hidden",
          background: "#F4F8FF",
        }}
      >
        <StatusBar width={width} />
        {src ? (
          <img
            src={src}
            alt={alt ?? ""}
            style={{ flex: 1, minHeight: 0, width: "100%", objectFit: "cover", objectPosition: "top center" }}
          />
        ) : (
          <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
        )}
      </div>
    </div>
  );
}

/** A CSS MacBook-style laptop: a 16:10 screen lid over a silver hinge base. */
export function LaptopFrame({
  src,
  alt,
  width = 520,
  className,
}: {
  src?: string;
  alt?: string;
  width?: number;
  className?: string;
}) {
  const bezel = Math.round(width * 0.016);
  const topBezel = Math.round(width * 0.03);
  return (
    <div className={className} style={{ width }}>
      {/* screen lid */}
      <div
        style={{
          width,
          aspectRatio: "16 / 10.2",
          borderRadius: Math.round(width * 0.028),
          padding: bezel,
          paddingTop: topBezel,
          background: "linear-gradient(155deg, #2a3550 0%, #0d1629 55%, #1b2540 100%)",
          boxShadow:
            "0 34px 70px -30px rgba(13,22,41,0.6), inset 0 1px 2px rgba(255,255,255,0.22)",
          position: "relative",
        }}
      >
        {/* camera dot */}
        <span
          style={{
            position: "absolute",
            top: Math.round(topBezel * 0.32),
            left: "50%",
            transform: "translateX(-50%)",
            width: Math.max(3, Math.round(width * 0.008)),
            height: Math.max(3, Math.round(width * 0.008)),
            borderRadius: 999,
            background: "radial-gradient(circle at 40% 40%, #33445f 0%, #05080e 70%)",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: Math.round(width * 0.014),
            overflow: "hidden",
            background: "#F4F8FF",
          }}
        >
          {src ? (
            <img
              src={src}
              alt={alt ?? ""}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
            />
          ) : null}
        </div>
      </div>
      {/* hinge / base */}
      <div
        style={{
          width: Math.round(width * 1.14),
          marginLeft: Math.round(width * -0.07),
          height: Math.round(width * 0.028),
          borderRadius: `0 0 ${Math.round(width * 0.02)}px ${Math.round(width * 0.02)}px`,
          background: "linear-gradient(180deg, #c7d0de 0%, #9aa8bf 55%, #7a8aa3 100%)",
          boxShadow: "0 20px 34px -16px rgba(13,22,41,0.5)",
        }}
      >
        {/* opening notch */}
        <div
          style={{
            width: Math.round(width * 0.14),
            height: Math.round(width * 0.009),
            margin: "0 auto",
            borderRadius: `0 0 ${Math.round(width * 0.01)}px ${Math.round(width * 0.01)}px`,
            background: "#6d7c94",
          }}
        />
      </div>
    </div>
  );
}

/** A CSS iPad-style tablet: portrait 3:4 screen in a slim dark bezel. */
export function TabletFrame({
  src,
  alt,
  width = 180,
  className,
}: {
  src?: string;
  alt?: string;
  width?: number;
  className?: string;
}) {
  const pad = Math.round(width * 0.045);
  return (
    <div
      className={className}
      style={{
        width,
        aspectRatio: "3 / 4",
        borderRadius: Math.round(width * 0.07),
        padding: pad,
        background: "linear-gradient(155deg, #2a3550 0%, #0d1629 55%, #1b2540 100%)",
        boxShadow:
          "0 30px 60px -28px rgba(13,22,41,0.55), inset 0 1px 2px rgba(255,255,255,0.22)",
        position: "relative",
      }}
    >
      {/* front camera */}
      <span
        style={{
          position: "absolute",
          top: Math.round(pad * 0.42),
          left: "50%",
          transform: "translateX(-50%)",
          width: Math.max(3, Math.round(width * 0.02)),
          height: Math.max(3, Math.round(width * 0.02)),
          borderRadius: 999,
          background: "radial-gradient(circle at 40% 40%, #26364f 0%, #05080e 70%)",
        }}
      />
      <div
        style={{
          height: "100%",
          width: "100%",
          borderRadius: Math.round(width * 0.045),
          overflow: "hidden",
          background: "#F4F8FF",
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt ?? ""}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
          />
        ) : null}
      </div>
    </div>
  );
}
