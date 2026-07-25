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
- **Motion** (framer-motion successor) for scroll-linked animation
- **Lenis** for premium smooth scroll (auto-disabled under reduced-motion)
- **Three.js + @react-three/fiber + drei** for the hero 3D aircraft + gold ring
- **lucide-react** icons

## Run

```bash
npm install
npm run dev        # http://localhost:5175
npm run build      # type-check + production build → dist/
npm run preview    # preview the built site (port 4175)
```

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
