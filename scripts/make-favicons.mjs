// Regenerate every favicon / app icon from the master logo mark.
//   npm run favicons
//
// Design: the EARNWINGS plane mark centred on a WHITE CIRCLE. Browser tabs get a
// true circle (transparent outside it). The Apple touch icon is the exception —
// iOS composites transparency against BLACK and applies its own rounded-square
// mask, so a circle there would render with black corners; it gets an opaque
// white square instead and iOS rounds it.
//
// Sizes are not arbitrary:
//   16/32  — browser tabs and bookmarks
//   48/96  — Google shows a favicon in search results only if it is a multiple
//            of 48px square, so without these there is no icon beside our result
//   180    — iOS home screen
//   192/512— PWA manifest (512 also used as the maskable icon)
//   .ico   — /favicon.ico is still requested by crawlers and older clients
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "public/assets/logo-mark.webp";
const OUT = "public/assets";

/** Fraction of the canvas the mark occupies inside the circle. */
const INSET = 0.78;

/**
 * The master file is 512x512 but the mark itself only occupies 442x351 of it —
 * the rest is transparent padding. Trimming first means the mark fills the
 * circle properly instead of floating small inside it, which is the difference
 * between legible and mush at 16px.
 */
const mark = () => sharp(SRC).trim({ threshold: 10 });

/** White disc with transparent corners, with the mark centred on it. */
async function circleIcon(size) {
  const inner = Math.round(size * INSET);
  const circle = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#ffffff"/></svg>`,
  );
  const logo = await mark()
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: circle }, { input: logo, gravity: "centre" }])
    .png()
    .toBuffer();
}

/** Opaque white square — for iOS, which cannot handle transparent corners. */
async function squareIcon(size) {
  const inner = Math.round(size * INSET);
  const logo = await mark()
    .resize(inner, inner, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  })
    .composite([{ input: logo, gravity: "centre" }])
    .png()
    .toBuffer();
}

/**
 * Minimal ICO writer. An .ico is a 6-byte header, one 16-byte directory entry
 * per image, then the image payloads — and PNG payloads are legal, so the PNGs
 * above can be embedded as-is.
 */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const CIRCLE_SIZES = [16, 32, 48, 96, 192, 512];

for (const size of CIRCLE_SIZES) {
  const data = await circleIcon(size);
  const name = size >= 192 ? `icon-${size}.png` : `favicon-${size}.png`;
  writeFileSync(join(OUT, name), data);
  console.log(`  ${name.padEnd(20)} ${(data.length / 1024).toFixed(1)} KB`);
}

const apple = await squareIcon(180);
writeFileSync(join(OUT, "apple-touch-icon-180.png"), apple);
console.log(`  apple-touch-icon-180.png ${(apple.length / 1024).toFixed(1)} KB (opaque white, iOS rounds it)`);

// /favicon.ico at the site root, bundling the three classic sizes.
const icoBuf = ico(
  await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await circleIcon(size) }))),
);
writeFileSync("public/favicon.ico", icoBuf);
console.log(`  favicon.ico          ${(icoBuf.length / 1024).toFixed(1)} KB (16+32+48)`);
