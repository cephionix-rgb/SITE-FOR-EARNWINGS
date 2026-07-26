// App-screenshot optimiser: image-src/screens/*.png -> public/screens/*.webp.
//   node scripts/make-screens.mjs
import sharp from "sharp";
import { readdirSync, mkdirSync, statSync } from "node:fs";
const SRC = "image-src/screens";
const OUT = "public/screens";
mkdirSync(OUT, { recursive: true });
let before = 0, after = 0;
for (const f of readdirSync(SRC).filter((f) => f.endsWith(".png"))) {
  const base = f.replace(/\.png$/, "");
  before += statSync(`${SRC}/${f}`).size;
  await sharp(`${SRC}/${f}`).webp({ quality: 80 }).toFile(`${OUT}/${base}.webp`);
  after += statSync(`${OUT}/${base}.webp`).size;
}
console.log(`screens: ${(before/1024/1024).toFixed(1)}MB PNG -> ${(after/1024/1024).toFixed(1)}MB WebP`);
