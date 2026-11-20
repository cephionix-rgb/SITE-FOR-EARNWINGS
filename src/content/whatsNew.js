// /whats-new: the EarnWings changelog. Imported by BOTH the React page and
// scripts/gen-routes.mjs (crawlable shell + sitemap), so the two never differ.
//
// RULE: every entry is a real change that shipped, written in plain English, with
// the date it shipped. No roadmap items, no "coming soon". Newest first. Add new
// entries at the top and move WHATS_NEW_UPDATED.

export const WHATS_NEW_UPDATED = "19 November 2026";
export const WHATS_NEW_UPDATED_ISO = "2026-11-19";

export const WHATS_NEW_INTRO =
  "Every change to EarnWings that students can see, newest first, with the date it shipped. If it is not live yet, it is not on this page.";

/** @type {{ date: string, label: string, area: string, title: string, body: string }[]} */
export const WHATS_NEW = [
  {
    date: "2026-11-19",
    label: "19 November 2026",
    area: "Ground school",
    title: "Interactive notes",
    body:
      "Chapters now have an Interactive mode beside the notes, flowchart and question bank: live explainers you can move, such as the pressure altimeter, the ILS localizer and glide slope, SSR and the transponder, pitot-static blockages and DC circuits. Every figure is drawn by code from computed values. 100+ chapters have one so far, and the chapter pages on this website say which.",
  },
  {
    date: "2026-11-19",
    label: "19 November 2026",
    area: "Cockpit trainers",
    title: "Cessna 172 cockpit lessons",
    body:
      "A Cessna 172 trainer joins the A320: seven lessons from the cockpit tour, engine start and run-up to the six-pack instruments, radios and shutdown, each with a video, notes and practice in the 3D cockpit, followed by emergency drills.",
  },
  {
    date: "2026-11-18",
    label: "18 November 2026",
    area: "Website",
    title: "Download free, public sample questions and this page",
    body:
      "The website's main button is now Download free, with download links for iPhone, Android and Mac. Every one of our 202 DGCA chapters has a public page with a short overview and sample questions from our own question bank. We also added this changelog, a page on how we check our content, and a form to report the questions you saw in your DGCA exam.",
  },
  {
    date: "2026-11-18",
    label: "18 November 2026",
    area: "Live airports",
    title: "Live airports now cover 8 airports",
    body:
      "The live 3D view now shows real traffic at Delhi (VIDP), Mumbai (VABB), Chennai (VOMM), Bengaluru (VOBL), Hyderabad Begumpet (VOHY), Jaipur (VIJP), Chandigarh (VICG) and Leh (VILH). Jaipur and Chandigarh are the newest. It is free for everyone, with no account and no plan needed.",
  },
  {
    date: "2026-11-18",
    label: "18 November 2026",
    area: "Live airports",
    title: "Live weather in the 3D airport view",
    body:
      "The live view now draws each airport's latest METAR: cloud layers, visibility, mist and fog, rain and thunderstorms. You can also choose your own weather, or raise or lower the visibility, then switch back to Live at any time.",
  },
  {
    date: "2026-11-18",
    label: "18 November 2026",
    area: "A320 trainer",
    title: "A320 lesson videos",
    body:
      "The first narrated A320 lesson videos are recorded on our own A320 flight deck: the cockpit tour, ADIRS, electrics, APU, ECAM, fuel and hydraulics, air, and lights. Each one explains what the system or procedure is and why it matters, then shows every control on the panel. More lessons follow one by one.",
  },
  {
    date: "2026-11-18",
    label: "18 November 2026",
    area: "Android app",
    title: "Home-screen widgets on Android",
    body:
      "Android now has home-screen widgets for METAR, NOTAMs and your study, matching the iPhone widgets. Weather refreshes about every 30 minutes.",
  },
  {
    date: "2026-11-17",
    label: "17 November 2026",
    area: "Mac app",
    title: "EarnWings for Mac",
    body:
      "The first Mac desktop app is on the downloads page. It runs the full app on a big screen, including the 3D airports and the A320 trainer, with the same account as your phone.",
  },
  {
    date: "2026-11-17",
    label: "17 November 2026",
    area: "3D airports",
    title: "Offline 3D airports",
    body:
      "The iPhone, Android and Mac apps can download each 3D airport once and keep it on the device, encrypted, so the airports open without waiting for a stream. You manage the downloads from your profile.",
  },
  {
    date: "2026-11-16",
    label: "16 November 2026",
    area: "RT practice",
    title: "Indian ATC voices for radio practice",
    body:
      "Every controller line in RT practice is now spoken in an Indian voice, with a VHF radio effect. Each unit at an airport (Tower, Ground, Approach) is a different person. Make a wrong call and you hear a real response, such as \"say again your callsign\". Every line is recorded in advance, so replies are instant.",
  },
  {
    date: "2026-11-16",
    label: "16 November 2026",
    area: "RT practice",
    title: "More varied RT scenarios",
    body:
      "We rebuilt the RT scenario pools so that no two scenarios in a group play the same sequence of calls, and every scenario has its own title. Runway configurations, frequencies, operators and traffic now vary by airport.",
  },
  {
    date: "2026-11-15",
    label: "15 November 2026",
    area: "RT practice",
    title: "Airliners at real airports",
    body:
      "RT practice at our real-scale 3D airports now puts you in an airliner that fits the scenario, such as an A320neo, ATR 72 or 787. The Cessna 172 is kept for general aviation scenarios.",
  },
  {
    date: "2026-11-15",
    label: "15 November 2026",
    area: "Captain Aezon",
    title: "Aezon's pictures are drawn, not imagined",
    body:
      "Every diagram, chart and instrument picture in Captain Aezon's answers is drawn by code from computed values. We removed AI image generation completely, because a wrongly drawn instrument is not acceptable in pilot training.",
  },
  {
    date: "2026-09-28",
    label: "28 September 2026",
    area: "App",
    title: "Layouts for iPad, tablets and laptops",
    body:
      "The app now adapts to larger screens: a side rail on tablets, a full sidebar on laptops and desktops, and sheets that fit the screen instead of stretching across it.",
  },
  {
    date: "2026-09-27",
    label: "27 September 2026",
    area: "NavCalc",
    title: "NavCalc re-synced with the NavCalc iPhone app",
    body:
      "The flight calculators inside EarnWings were re-synced with the NavCalc iPhone app (version 1.3.0), and an automatic check now compares their answers with the app's own before every release.",
  },
  {
    date: "2026-08-18",
    label: "18 August 2026",
    area: "iPhone app",
    title: "Weather widgets on the iPhone home screen",
    body:
      "Home-screen widgets on iPhone show live aviation weather for the station you choose. They work even on a phone that has not opened the app yet.",
  },
];
