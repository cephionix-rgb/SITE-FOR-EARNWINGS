// Reproducible responsive-image + favicon generator (sharp).
//   node scripts/make-images.mjs
// Reads high-res SOURCES from image-src/ (NOT deployed) and writes optimised,
// correctly-sized variants into public/assets/ (deployed). Photographic assets
// get lossy AVIF/WebP; logos get LOSSLESS WebP at their real render size (2x)
// so gradients and alpha edges never band.
import sharp from "sharp";
import { statSync } from "node:fs";

const SRC = "image-src";
const OUT = "public/assets";
const kb = (p) => {
  try {
    return (statSync(p).size / 1024).toFixed(1) + "KB";
  } catch {
    return "?";
  }
};

async function responsive(srcName, baseName, widths, { avifQ, webpQ, jpegQ }) {
  const src = `${SRC}/${srcName}`;
  for (const w of widths) {
    const s = () => sharp(src).resize({ width: w, withoutEnlargement: true });
    await s().avif({ quality: avifQ }).toFile(`${OUT}/${baseName}-${w}.avif`);
    await s().webp({ quality: webpQ }).toFile(`${OUT}/${baseName}-${w}.webp`);
    await s().jpeg({ quality: jpegQ, mozjpeg: true }).toFile(`${OUT}/${baseName}-${w}.jpg`);
  }
}

// hero-clouds: full-bleed sky. Quality raised (4.1b-2) so the open-blue gradient
// does not band on mobile, where the CSS blur is disabled. Still ~98% smaller.
await responsive("hero-clouds.png", "hero-clouds", [1024, 1920], { avifQ: 60, webpQ: 74, jpegQ: 72 });

// india-flightmap (below-fold map) + intro poster.
await sharp(`${SRC}/india-flightmap.png`).resize({ width: 840, withoutEnlargement: true }).avif({ quality: 55 }).toFile(`${OUT}/india-flightmap.avif`);
await sharp(`${SRC}/india-flightmap.png`).resize({ width: 840, withoutEnlargement: true }).webp({ quality: 70 }).toFile(`${OUT}/india-flightmap.webp`);
await responsive("paper-airplane-intro-poster.jpg", "intro-poster", [1024, 1920], { avifQ: 48, webpQ: 60, jpegQ: 64 });

// logo-mark (512 source): hero illustration + nav icon + splash. LOSSLESS WebP,
// sized to 2x of each render size. 512 stays for the desktop hero LCP (~560px).
const mark = (w) => sharp(`${SRC}/logo-mark.png`).resize({ width: w });
await mark(512).webp({ lossless: true }).toFile(`${OUT}/logo-mark.webp`); // desktop hero
await mark(320).webp({ lossless: true }).toFile(`${OUT}/logo-mark-320.webp`); // mobile hero + splash
await mark(96).webp({ lossless: true }).toFile(`${OUT}/logo-mark-96.webp`); // nav
await mark(96).png().toFile(`${OUT}/logo-mark-96.png`); // nav fallback

// logo-full (1100 source): footer only (~53px wide). LOSSLESS WebP at 160 (2x+).
await sharp(`${SRC}/logo-full.png`).resize({ width: 160 }).webp({ lossless: true }).toFile(`${OUT}/logo-full-160.webp`);
await sharp(`${SRC}/logo-full.png`).resize({ width: 160 }).png().toFile(`${OUT}/logo-full-160.png`);
// 512-wide PNG for the JSON-LD Organization logo (needs a real, deployed URL).
await sharp(`${SRC}/logo-full.png`).resize({ width: 512 }).png().toFile(`${OUT}/logo-512.png`);

// Favicons + apple touch icon from the logo mark.
await sharp(`${SRC}/logo-mark.png`).resize(16, 16).png().toFile(`${OUT}/favicon-16.png`);
await sharp(`${SRC}/logo-mark.png`).resize(32, 32).png().toFile(`${OUT}/favicon-32.png`);
await sharp(`${SRC}/logo-mark.png`).resize(180, 180).png().toFile(`${OUT}/apple-touch-icon-180.png`);

const report = [
  "hero-clouds-1920.avif", "hero-clouds-1920.webp", "hero-clouds-1920.jpg",
  "india-flightmap.webp", "intro-poster-1920.webp",
  "logo-mark.webp", "logo-mark-320.webp", "logo-mark-96.webp", "logo-mark-96.png",
  "logo-full-160.webp", "logo-full-160.png",
  "favicon-32.png", "apple-touch-icon-180.png",
];
for (const f of report) console.log(`${f.padEnd(24)} ${kb(`${OUT}/${f}`)}`);
