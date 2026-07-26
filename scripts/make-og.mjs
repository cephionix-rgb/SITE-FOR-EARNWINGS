// Reproducible Open Graph / Twitter card image (1200x630) composed from brand
// assets. Run:  node scripts/make-og.mjs   ->  public/assets/og-image.jpg
// Brand colours match the live theme (navy #1B3A7A / gold #C9981F / sky #5BA4E8).
import sharp from "sharp";
import { statSync } from "node:fs";

const W = 1200;
const H = 630;
const OUT = "public/assets/og-image.jpg";
const LOGO = "public/assets/logo-full.png";

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0D2450"/>
      <stop offset="0.55" stop-color="#123A6E"/>
      <stop offset="1" stop-color="#1B3A7A"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.80" cy="0.26" r="0.62">
      <stop offset="0" stop-color="#C9981F" stop-opacity="0.30"/>
      <stop offset="1" stop-color="#C9981F" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <text x="80" y="300" font-family="Arial, 'Helvetica Neue', Helvetica, sans-serif" font-size="78" font-weight="800" fill="#FFFFFF">Pass DGCA faster.</text>
  <text x="80" y="392" font-family="Arial, 'Helvetica Neue', Helvetica, sans-serif" font-size="78" font-weight="800" fill="#F5D97A">Fly sooner.</text>
  <text x="82" y="472" font-family="Arial, 'Helvetica Neue', Helvetica, sans-serif" font-size="30" font-weight="600" fill="#A9CEF4">Flight planning &#183; RT trainer &#183; AI Captain &#183; Mock exams</text>
  <text x="82" y="558" font-family="Arial, 'Helvetica Neue', Helvetica, sans-serif" font-size="28" font-weight="700" fill="#F5D97A">earnwings.org</text>
</svg>`;

const logo = await sharp(LOGO).resize({ height: 96 }).png().toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: logo, top: 68, left: 80 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(OUT);

console.log("og-image:", (statSync(OUT).size / 1024).toFixed(0) + "KB", `${W}x${H}`);
