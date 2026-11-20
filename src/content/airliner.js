// THE shared EarnWings airliner, for the website (route map, homepage teaser and
// the Zero to CPL brochure). Owner rule (memory `notes-aircraft-drawings`): one
// correctly proportioned A320 drawing everywhere, never an ad-hoc plane.
//
// These path strings are copied VERBATIM from the app's
// "EARNWINGS Student App/src/app/components/interactive/kit/airliner.tsx"
// (AirlinerTop / AirlinerSide), in metres from the Airbus A320ceo manual:
// length 37.57, span 35.80, 25 deg sweep, tailplane 12.45 m, CFM56 nacelles on
// pylons ahead of the wing leading edge. If the app's drawing changes, copy it here.
//
// Plain .js (no JSX) so Node scripts can build the same SVG for the PDF.

export const A320 = { length: 37.57, span: 35.8, cgX: 16.3 };

// Plan view: nose at the origin pointing UP the page, tail at y = 37.57.
export const TOP_FUSE =
  "M0 0 C1.1 0.4 1.9 2.2 1.98 5 L1.98 28 C1.9 32 1.2 35.6 0.35 37.57 L-0.35 37.57 C-1.2 35.6 -1.9 32 -1.98 28 L-1.98 5 C-1.9 2.2 -1.1 0.4 0 0Z";
export const TOP_WING = "M1.9 12.6 L17.9 20.6 L17.9 22.0 L16.3 22.2 L1.9 19.0 Z";
export const TOP_STAB = "M1.0 31.2 L6.2 35.3 L6.2 36.4 L1.0 35.8 Z";
export const TOP_NAC = "M5.2 10.4 L7.0 10.4 L7.2 14.6 L5.0 14.6 Z";
export const TOP_COCKPIT = "M-1.1 2.6 L1.1 2.6 L0.9 3.6 L-0.9 3.6 Z";

// Side view: x aft, y up (flip with scale(1 -1)); nose at the origin.
export const SIDE_FUSE =
  "M0 -0.25 C0.2 0.75 1.2 1.55 2.6 1.85 C3.6 2.0 4.6 2.0 6 2.0 L27.5 2.0 C30 1.95 33 1.75 36.4 1.35 L37.57 1.05 L37.57 0.65 " +
  "C34.5 0.25 31 -0.6 28 -1.35 C25.5 -1.85 24 -1.98 22 -1.98 L5 -1.98 C3 -1.98 1.4 -1.6 0.6 -1.05 C0.2 -0.7 0.02 -0.5 0 -0.25Z";
export const SIDE_FIN = "M28.2 1.95 L31.6 1.95 C33.4 4.6 35.3 7.4 36.6 9.1 L34.6 9.1 C33.4 7.6 31 4.9 28.2 1.95Z";
export const SIDE_STAB = "M31.2 0.55 L36.9 0.75 L37.0 0.95 L32.4 1.05 Z";
export const SIDE_WING = "M12.1 -1.35 L19.3 -1.25 L20.2 -0.95 L13.2 -0.85 Z";
export const SIDE_PYLON = "M11.6 -1.35 L15.6 -1.3 L14.6 -2.1 L11.4 -2.1 Z";
export const SIDE_NACELLE =
  "M9.9 -2.1 C9.9 -1.55 10.3 -1.35 10.9 -1.3 L14.4 -1.4 C15.0 -1.55 15.3 -2.0 15.6 -2.55 L16.4 -2.7 L15.6 -2.95 C15.2 -3.55 14.8 -3.7 14.2 -3.75 L10.9 -3.75 C10.3 -3.7 9.9 -3.4 9.9 -2.9 Z";
export const SIDE_COCKPIT = "M1.6 0.95 L3.1 1.25 L3.2 0.75 L1.9 0.55 Z";

const C = { body: "#FFFFFF", line: "#1B3A7A", wing: "#C9D7EF", dark: "#1B3A7A", tail: "#C9A227" };

/**
 * Plan view as an SVG <g> string, centred on the CG, nose pointing up (-y).
 * `scale` = px per metre. Wrap it in a rotate() for a heading.
 */
export function airlinerTopSvg(scale = 1, c = C) {
  const mirror = (d, fill) => `<path d="${d}" fill="${fill}"/><path d="${d}" fill="${fill}" transform="scale(-1 1)"/>`;
  return (
    `<g transform="scale(${scale}) translate(0 ${-A320.cgX})">` +
    mirror(TOP_STAB, c.wing) +
    mirror(TOP_WING, c.wing) +
    `<path d="${TOP_FUSE}" fill="${c.body}" stroke="${c.line}" stroke-width="1" vector-effect="non-scaling-stroke"/>` +
    mirror(TOP_NAC, c.dark) +
    `<path d="M0 30.5 L0 37.2" stroke="${c.tail}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path d="${TOP_COCKPIT}" fill="${c.dark}"/>` +
    `</g>`
  );
}

/** Side view as an SVG <g> string, nose at the origin pointing LEFT, y up. */
export function airlinerSideSvg(scale = 1, c = C) {
  return (
    `<g transform="scale(${scale}) scale(1 -1)">` +
    `<path d="${SIDE_STAB}" fill="${c.wing}"/>` +
    `<path d="${SIDE_FUSE}" fill="${c.body}" stroke="${c.line}" stroke-width="1" vector-effect="non-scaling-stroke"/>` +
    `<path d="${SIDE_FIN}" fill="${c.dark}"/>` +
    `<path d="${SIDE_WING}" fill="${c.wing}"/>` +
    `<path d="${SIDE_PYLON}" fill="${c.wing}"/>` +
    `<path d="${SIDE_NACELLE}" fill="${c.dark}"/>` +
    `<path d="${SIDE_COCKPIT}" fill="${c.dark}"/>` +
    `<path d="M6 0.55 L26 0.55" stroke="${c.line}" stroke-width="0.9" stroke-dasharray="2 3" vector-effect="non-scaling-stroke" opacity=".55"/>` +
    `</g>`
  );
}
