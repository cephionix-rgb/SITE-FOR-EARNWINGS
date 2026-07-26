// Reproducible responsive-image + favicon generator (sharp). Run:
//   node scripts/make-images.mjs
// Photographic assets get aggressive lossy AVIF/WebP; the two logos get LOSSLESS
// WebP so gradients and alpha edges do not band. Sources stay in place as the
// final fallback in <picture>/image-set().
import sharp from "sharp";
import { statSync } from "node:fs";

const A = "public/assets";
const kb = (p) => {
  try {
    return (statSync(p).size / 1024).toFixed(0) + "KB";
  } catch {
    return "?";
  }
};

async function responsive(srcName, baseName, widths, { avifQ = 50, webpQ = 62, jpegQ = 66 } = {}) {
  const src = `${A}/${srcName}`;
  for (const w of widths) {
    const s = () => sharp(src).resize({ width: w, withoutEnlargement: true });
    await s().avif({ quality: avifQ }).toFile(`${A}/${baseName}-${w}.avif`);
    await s().webp({ quality: webpQ }).toFile(`${A}/${baseName}-${w}.webp`);
    await s().jpeg({ quality: jpegQ, mozjpeg: true }).toFile(`${A}/${baseName}-${w}.jpg`);
  }
}

// 4.1a hero-clouds: full-bleed photographic sky. Aggressive lossy is fine.
await responsive("hero-clouds.png", "hero-clouds", [1024, 1920], { avifQ: 45, webpQ: 55, jpegQ: 62 });

// 4.1b india-flightmap (below-fold map) + intro poster (4K -> 1920).
await sharp(`${A}/india-flightmap.png`).resize({ width: 840, withoutEnlargement: true }).avif({ quality: 52 }).toFile(`${A}/india-flightmap.avif`);
await sharp(`${A}/india-flightmap.png`).resize({ width: 840, withoutEnlargement: true }).webp({ quality: 66 }).toFile(`${A}/india-flightmap.webp`);
await responsive("paper-airplane-intro-poster.jpg", "intro-poster", [1024, 1920], { avifQ: 46, webpQ: 58, jpegQ: 62 });

// 4.1c logos: LOSSLESS webp (no banding on gold gradients / alpha edges).
await sharp(`${A}/logo-full.png`).webp({ lossless: true }).toFile(`${A}/logo-full.webp`);
await sharp(`${A}/logo-mark.png`).webp({ lossless: true }).toFile(`${A}/logo-mark.webp`);

// 4.1d favicons + apple touch icon from the logo mark.
await sharp(`${A}/logo-mark.png`).resize(16, 16).png().toFile(`${A}/favicon-16.png`);
await sharp(`${A}/logo-mark.png`).resize(32, 32).png().toFile(`${A}/favicon-32.png`);
await sharp(`${A}/logo-mark.png`).resize(180, 180).png().toFile(`${A}/apple-touch-icon-180.png`);

const report = [
  "hero-clouds-1920.avif", "hero-clouds-1920.webp", "hero-clouds-1920.jpg",
  "hero-clouds-1024.webp",
  "india-flightmap.webp", "india-flightmap.avif",
  "intro-poster-1920.webp",
  "logo-full.webp", "logo-mark.webp",
  "favicon-32.png", "apple-touch-icon-180.png",
];
for (const f of report) console.log(`${f.padEnd(26)} ${kb(`${A}/${f}`)}`);
