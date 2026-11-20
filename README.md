# EARNWINGS — Marketing / Waitlist Site

A standalone, high-craft landing page whose one job is to convert visitors into
**waitlist signups**. Scroll-driven storytelling, real 3D, a genuinely playable
demo, real app screens and the product film — in the EARNWINGS "sky/cloud
premium" brand (navy `#1B3A7A` · gold `#C9981F` · sky `#5BA4E8`).

Decoupled from the student app (`../EARNWINGS Student App`) but reuses its exact
brand tokens.

## Stack

- **Vite 6 + React 18 + TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`) — tokens in `src/styles/theme.css`
- **GSAP 3** (+ ScrollTrigger, `@gsap/react`) for timeline / scroll-driven animation — see [Animation](#animation)
- **Motion** (framer-motion successor) for component-level enter/exit animation
- **Lenis** for premium smooth scroll (auto-disabled under reduced-motion), driven by GSAP's ticker
- **Three.js + @react-three/fiber + drei** for the hero 3D aircraft + gold ring
- **lucide-react** icons

## Run

```bash
npm install
npm run dev        # http://localhost:5175
npm run build      # type-check + production build → dist/
npm run preview    # preview the built site (port 4175)
```

## Animation

Two systems, on purpose:

- **GSAP** — timelines, scroll-driven / scrubbed sequences, pinning, SVG drawing,
  anything tweening a value that isn't a React prop. Import from `src/lib/gsap.ts`,
  never straight from the package: that module registers the plugins, creates the
  house eases and sets the defaults.
- **Motion** — simple declarative enter/exit on a component (`variants` in
  `src/lib/motion.ts`). Still the right tool for a one-off fade-in.

```tsx
import { gsap, useGSAP, reveal, EASE } from "../lib/gsap";

function Section() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // helper: scroll-triggered fade + rise, matching the `rise` motion variant
    reveal(".card", { stagger: 0.09 });

    // or a full timeline
    gsap.timeline({ scrollTrigger: { trigger: scope.current, start: "top 70%" } })
      .from(".headline", { y: 40, opacity: 0 })
      .from(".plane", { x: -120, rotate: -8, ease: EASE.springy }, "-=0.4");
  }, { scope });                       // scope = selectors are local + auto-cleanup

  return <div ref={scope}>…</div>;
}
```

- `useGSAP` reverts every tween/ScrollTrigger created inside it on unmount, so
  there is no manual cleanup and StrictMode double-mounts are safe.
- Eases `EASE.outExpo` / `EASE.springy` are CustomEase copies of the `motion`
  curves, so both systems feel the same in the same section.
- **Reduced motion**: `reveal()` is gated behind `(prefers-reduced-motion:
  no-preference)`. Hand-written timelines must do the same — wrap them in
  `gsap.matchMedia()` or bail on `prefersReducedMotion()` (`src/lib/scroll.ts`).
- Lenis runs off `gsap.ticker` and calls `ScrollTrigger.update` on every scroll
  (`src/lib/scroll.ts`), so smooth-scroll and scrubbed animation stay on the
  same frame. Don't add a second `requestAnimationFrame` loop for Lenis.
- All GSAP plugins (SplitText, Flip, MotionPath, DrawSVG, MorphSVG, Observer …)
  ship free in the package. Only ScrollTrigger is registered globally — import
  and `gsap.registerPlugin()` the rest inside the component that needs them so
  they stay out of the main bundle.
- Working reference: the count-up numbers in `src/sections/ProofBand.tsx`.

## Sections (the scroll narrative)

1. **Hero** — cloud-sky canvas, centered gold streak ring, banking 3D aircraft, waitlist CTA
2. **Stats** — trust bar
3. **Play it live** — *genuinely playable*: tap airports to build a route (real great-circle distance + ETA, animated plane) and a METAR decode mini-game. No signup.
4. **Features** — a plane flies a flight-path down the page revealing the 5 pillars on scroll
5. **App** — a fan of iPhone mockups showing **real app screens**
6. **Product film** — the motion-graphic video
7. **Journey** — 15-rank ladder ending on the checkered XP finish line
8. **Waitlist** — signup form → "you're #N in line" takeoff animation
9. **Footer**

## Waitlist storage (third-party, no backend)

The form POSTs JSON `{ email, name, examTarget, source }` to
`import.meta.env.VITE_WAITLIST_ENDPOINT`. Leave it blank for **demo mode** (works,
shows success, stores nothing). To capture real signups, copy `.env.example` to
`.env` and set the endpoint — Formspree, Supabase REST, or a Google Apps Script
web app all work with zero code change. See `.env.example`.

## Assets

- `public/assets/aircraft.glb` — hero 3D model (Higgsfield image→3D)
- `public/assets/hero-aircraft.png` — reduced-motion / WebGL-failure fallback
- `public/assets/logo-full.png`, `logo-mark.png` — real EARNWINGS brand marks
- `public/assets/motion-graphic.mp4` (+ poster) — product film
- `public/screens/*.png` — real exported app screens (flight planning, airspace, charts)

Real app screens currently reuse the exported flight-planning PNGs. To swap in
true mobile captures, drop new images into `public/screens/` and update the
`PHONES` array in `src/sections/AppShowcase.tsx`.

## Pilot Guide (/guide)

Six guides nested under `/guide` (pilot pathway, medicals, eGCA and the Computer
Number, Pariksha exams, RTR, beginner glossary) plus the hub. One content module
feeds everything:

- `src/content/guides.js`: the text, official source links and `LAST_CHECKED` date.
  Rules for editing it are at the top of the file (official sources only; say so
  when something cannot be verified).
- `src/content/guideSlugs.js`: slugs and menu labels only, so the router and the
  top-bar "Pilot Guide" dropdown do not pull the guide text into the landing
  bundle. `npm run build` fails if it drifts from `guides.js`.
- Pages: `src/pages/guide/*`. Prerendered HTML, meta, Article + 3-level breadcrumb
  JSON-LD and sitemap entries come from `scripts/gen-routes.mjs`. Short URLs
  (`/egca`, `/pariksha`, ...) are static redirects to `/guide/<slug>`.

### Guide PDFs

```bash
npx playwright install chromium   # once
npm run guides:pdf                # writes public/guides/*.pdf + manifest.json
```

The PDFs are printed from `/guide-print` (a print template that renders the same
`guides.js` through the same block renderer), with a full-bleed cover, contents,
branded header/footer and page numbers, then joined with pdf-lib. They are
committed to `public/guides/` because CI has no browser. Every `npm run build`
hashes the guide content and prints a loud warning if the PDFs are out of date:
re-run `npm run guides:pdf` and commit.

## Live at our airports (/live and the homepage section)

The 3D airport viewer is embedded from the EarnWings app host:
`<APP_HOST>/airport3d.html?icao=VIDP&mode=live&embed=1` (VABB, VOMM, VILH too).
The page posts `{ type: "ew3d-visibility", visible }` to it when it scrolls out of
view or the tab is hidden.

- **App host URL is build-time config**: `VITE_APP_HOST_URL` (no trailing slash),
  e.g. `VITE_APP_HOST_URL=https://app.earnwings.org npm run build`, or add it to
  `.env.production`. The fallback in `src/lib/siteConfig.ts` is a temporary
  Cloudflare tunnel that changes.
- This site's CSP `frame-src` (vercel.json, public/_headers) allows
  `https://*.trycloudflare.com`; add the permanent app domain when there is one.
- **The app host must allow framing**: its nginx `location = /airport3d.html`
  currently sends `frame-ancestors 'self' capacitor://localhost https://localhost`.
  Add `https://earnwings.org` (and `https://www.earnwings.org`) or the browser
  refuses the embed. Until then the section shows its poster and an "Open in a new
  tab" link still works.

## Hero film

`src/components/HeroVideo.tsx` plays `/public/media/hero/hero-loop-1920x1080.*`
(desktop) or `hero-loop-1080x1350.*` (phones): poster first, video mounted only
after load and idle, muted/inline/loop while visible, paused off screen or in a
background tab, never loaded under reduced motion or Save-Data. To replace the
film, overwrite those files (MP4 H.264 required, WebM VP9 optional, plus the
`-poster.webp`/`-poster.jpg`).

## Terms and credits

`src/content/legal.js` holds the Terms (a plain-English DRAFT for legal review,
open points marked `[TODO legal]`) and the "Data and third-party material"
credits. The page is `/terms` (credits at `/terms#credits`); the build also
publishes the same data as `/legal/terms-and-credits.json` for the app.

## Performance notes

- The page-wide sky (`src/components/CloudBackground.tsx`) is drawn in code
  (no photos): three parallax strips of soft cumulus, each rendered once into a
  wrap-around tile (up to 2x pixels on phones, 1.5x on desktop) and then only
  moved with a compositor-thread Web Animations `translate3d` loop at ~8/16/28
  px/s. It keeps drifting while you scroll, pauses in background tabs and stays
  still under reduced motion / Save-Data. Earlier versions (six animated CSS
  photo layers, then a full-canvas repaint loop) were laggy or looked static.
- The old full-screen intro film (HeroIntro) is no longer mounted: the owner
  does not allow generated imagery. The hero film in `/public/media/hero/` is
  captured from the real app.
- App screenshots in `/public/screens/app/` are light-theme captures of the live
  app (demo student account), shown in `PhoneFrame` by `ProductTour.tsx`.
- Do not put `backdrop-filter` or `filter: blur()` on anything that moves every
  frame (see the comments in `FeatureOrbit.tsx`).

### Guide illustrations

`src/components/guide/Figures.tsx` holds the code-drawn SVG/HTML figures
(roadmap, comparisons, flows, wireframes, timelines, runway, METAR). Content
places them with `{ t: "figure", id, alt }` blocks in `guides.js`; the same
renderer draws them on the pages and in the PDFs. Forms are drawn as labelled
wireframes, never as copies of government screens.
