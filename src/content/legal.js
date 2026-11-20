// Single source of truth for the Terms of Service and the "Data and third-party
// material" credits, rendered at earnwings.org/terms and published as JSON at
// earnwings.org/legal/terms-and-credits.json (scripts/gen-routes.mjs) so the app
// can show the same text. Plain .js so Node can import it.
//
// STATUS: DRAFT FOR LEGAL REVIEW. The terms below are a plain-English draft
// written for the owner's lawyer to review. Items marked [TODO legal] need a
// decision or a fact only the company can supply.
//
// Inline markup: **bold** and [label](url). Block types:
//   p, ul, sub (sub-heading), callout {title,text}, note {text}, dont {items}, do {items}

export const TERMS_STATUS = "Draft for legal review";
export const TERMS_UPDATED = "20 November 2026";
export const COMPANY = "Cephionix";
export const SUPPORT = "support@earnwings.org";

/** @type {{id:string,title:string,blocks:any[]}[]} */
export const TERMS = [
  {
    id: "acceptance",
    title: "1. Who we are and what you agree to",
    blocks: [
      { t: "p", text: "EarnWings is built, owned and operated by **Cephionix** (\"we\", \"us\", \"our\"). [TODO legal: full registered name, CIN and registered office.] These terms apply when you use the EarnWings website, join the waitlist, or use the EarnWings app on the web, iPhone, iPad, Android, Mac or Windows (together, \"the Service\")." },
      { t: "p", text: "By using the Service you agree to these terms and to our [Privacy Policy](/privacy). If you do not agree, please do not use the Service." },
    ],
  },
  {
    id: "what",
    title: "2. What EarnWings is",
    blocks: [
      { t: "p", text: "EarnWings is a study app for people training to be pilots, mainly for the DGCA exams in India. It includes notes, question banks and mock exams, radio-telephony (RT) practice with synthetic voices and speech recognition, an AI study assistant, 3D airports and live views of real air traffic." },
      { t: "p", text: "EarnWings is independent. It is **not** part of, approved by or affiliated with DGCA, the Airports Authority of India, the Ministry of Civil Aviation or any airline or flying school." },
    ],
  },
  {
    id: "safety",
    title: "3. Training only, never for real flying",
    blocks: [
      { t: "callout", title: "Study and practice only", text: "Charts, weather, NOTAMs, calculators, live aircraft positions, 3D scenes and every other output of EarnWings are for practice. They **must never be used for real-world flight operations, navigation or decisions**. Use official, current sources and follow your instructor or operator. You are responsible for checking any information before you act on it." },
    ],
  },
  {
    id: "account",
    title: "4. Your account",
    blocks: [
      {
        t: "ul",
        items: [
          "You must be at least 16 years old. If you are under 18, a parent or guardian must agree to these terms for you and supervise any purchase. [TODO legal: confirm the approach to minors under the DPDP Act, 2023.]",
          "Give accurate information and keep your login secure. You are responsible for what happens under your account.",
          "One account is for one person. Do not share or sell it.",
        ],
      },
    ],
  },
  {
    id: "payments",
    title: "5. Plans, payments and Fuel",
    blocks: [
      { t: "p", text: "Some features need a paid plan (for example a Subject Pass, Trio Pass or Cadet Pro) or Fuel, our in-app credit for AI and other metered features. Being free to try does not make a feature free forever: prices, what is included and Fuel costs are shown before you pay." },
      {
        t: "ul",
        items: [
          "Prices are in Indian rupees and include any taxes shown at checkout.",
          "If a plan renews automatically, we will say so before you buy, and you can cancel before the next renewal. [TODO legal: confirm renewal terms per plan.]",
          "Plans and add-ons bought on the website or in the Mac app (paid through Razorpay) are refunded in full if you ask within 7 days of paying; the plan ends when the refund is approved and the Fuel that came with it is taken back. Fuel boosts bought there are refunded within 7 days for the part you have not used. The full rules, and how to ask, are in our [Refund and cancellation policy](/refunds).",
          "After 7 days, except where the law requires otherwise, payments are not refundable. Purchases made in the iPhone or Android app are refunded by Apple or Google under their own rules, and our 7-day rule does not apply to them.",
          "Fuel has no cash value and cannot be transferred or exchanged for money. What a Fuel pack includes, and whether it expires, is stated at purchase.",
        ],
      },
    ],
  },
  {
    id: "acceptable-use",
    title: "6. Acceptable use",
    blocks: [
      { t: "p", text: "You agree not to:" },
      {
        t: "ul",
        items: [
          "Copy, resell or redistribute our content (see section 7).",
          "Reverse-engineer, decompile, disassemble, decrypt, modify or tamper with the app, its code, its offline files or its protections.",
          "Run the app on a jailbroken or rooted device, or with tools that bypass its security, screenshot protection or watermarks.",
          "Scrape, overload or abuse the Service or its AI features.",
          "Upload unlawful, infringing or harmful content.",
          "Try to disrupt the Service or get unauthorised access to it or to other people's accounts.",
          "Use live data, voices or 3D content from the Service in another product or service.",
        ],
      },
    ],
  },
  {
    id: "ip",
    title: "7. Intellectual property",
    blocks: [
      { t: "callout", title: "Our notes are our own work", text: "The EarnWings notes, chapters, summaries, visual notes, flowcharts, question banks, explanations, RT scenarios and the app itself are **original works created and owned by Cephionix**. Nobody may copy them, share them, sell them or reverse-engineer the app, in whole or in part, by any means." },
      { t: "p", text: "Everything that makes up EarnWings (the brand, the software, the study material and the way that material is presented) belongs to Cephionix, **except licensed third-party material**, which belongs to its owners and is used under their licences. Our work is protected under the Copyright Act, 1957, the Trade Marks Act, 1999, the Designs Act, 2000, the Information Technology Act, 2000 and the equivalent laws of other countries. Our [Intellectual Property Notice](/copyright) says the same in plain language." },
      { t: "sub", text: "7.1 What we own" },
      {
        t: "ul",
        items: [
          "**Brand.** The EarnWings and Cephionix names, wordmarks, logos, the wings device and our colour system.",
          "**Software.** The app and website, and our architecture, algorithms, data models, APIs, flight-planning, routing and radio-telephony engines, and Captain Aezon's prompts and retrieval logic.",
          "**Study material.** Notes, chapters, summaries, diagrams, question banks, mock papers, solutions, explanations, video lectures and RT scenarios written or commissioned by us.",
          "**Presentation.** The interface, screen layouts, flow, the way the syllabus is broken down and taught, the rank and progression system, and the overall look and feel.",
          "**Compilation.** Our selection and arrangement of the syllabus and question banks, protected as a work in itself.",
        ],
      },
      { t: "sub", text: "7.2 What you get" },
      { t: "p", text: "A personal, limited, non-exclusive, non-transferable and revocable licence to use the Service for your own exam preparation while your plan or trial is active. No other right is given." },
      { t: "sub", text: "7.3 What you must not do" },
      {
        t: "dont",
        items: [
          "Copy, republish, distribute, sell or otherwise make our content public.",
          "Screenshot, record, download, print or transcribe our notes, questions or screens and then share or sell them, including in study groups, messaging groups, cloud drives, social media or coaching classes.",
          "Get around any watermark, access control or other protection.",
          "Scrape or use bots or other automated means to extract our content.",
          "Use the Service or its outputs to train, fine-tune or evaluate any AI model, dataset or index.",
          "Build or help build an app, course, book or other product copied or substantially derived from our content, structure, interface or presentation.",
          "Reverse-engineer our source code, prompts or algorithms.",
          "Use our name or logo, or suggest an endorsement or partnership with EarnWings or Cephionix.",
        ],
      },
      { t: "sub", text: "7.4 Building \"something like this\"" },
      { t: "callout", title: "", text: "Recreating EarnWings, or any meaningful part of it, by working from our screens, screenshots, videos, notes or interface is infringement, whether the copying is literal or a paraphrase, translation or re-skin, and whether it is done by you, someone you hire or an AI tool you direct. We will act on it." },
      { t: "sub", text: "7.5 Your own content" },
      { t: "p", text: "Notes and files you upload stay yours. You give us a limited licence to store, process and display them only to provide the Service to you, for example so Captain Aezon can answer from your notes. We do not sell them." },
      { t: "sub", text: "7.6 Third-party material" },
      { t: "p", text: "Some maps, data, models, fonts and software libraries are licensed to us by others. Their owners keep their rights, their licence terms apply to that material, and nothing in these terms restricts any right those licences give you. Where an open licence lets you obtain the corresponding source, write to support@earnwings.org. The required notices are in [Licence notices](#credits)." },
      { t: "sub", text: "7.7 Copying is a crime, not only a breach of these terms" },
      { t: "callout", title: "Criminal offences under Indian law", text: "Copying, distributing or selling EarnWings content or the app without our written permission is infringement of copyright. Under **section 63 of the Copyright Act, 1957**, knowingly infringing copyright is a criminal offence punishable with imprisonment of six months to three years and a fine of ₹50,000 to ₹2,00,000. Getting around our technical protections (encryption, screenshot blocking, device checks, watermarks) is a separate offence under **section 65A** of the same Act. Accessing, downloading or extracting our data or code without permission can also lead to compensation claims under **section 43** and prosecution under **section 66 of the Information Technology Act, 2000**. Our notes carry an invisible watermark linked to the account that opened them, so leaked copies can be traced back. We report infringement to the police and pursue it in court." },
      { t: "sub", text: "7.8 Enforcement and reporting" },
      { t: "p", text: "Breaking section 7 is a material breach. We may suspend or end your access without refund and use every remedy the law allows, including injunctions, damages and takedown notices. If you see EarnWings material being copied or passed off, tell us at support@earnwings.org." },
    ],
  },
  {
    id: "permitted",
    title: "8. What you may do",
    blocks: [
      {
        t: "do",
        items: [
          "Study from the notes, questions and tools in your own account, for your own preparation.",
          "Save or print a page for your own personal reference.",
          "Share our free Pilot Guide pages and PDFs unchanged, with a link back to earnwings.org.",
          "Link to us, without framing us or implying a relationship that does not exist.",
          "Quote a short extract for genuine news or review, with attribution.",
        ],
      },
    ],
  },
  {
    id: "ai",
    title: "9. AI features, voices and speech recognition",
    blocks: [
      { t: "p", text: "AI answers can be wrong or incomplete. Treat them as a study aid and check anything important against official DGCA and aviation sources. ATC and instructor voices are synthetic. When you practise RT, your recorded voice is turned into text on our servers so your call can be checked; see the [Privacy Policy](/privacy) for how recordings are handled." },
    ],
  },
  {
    id: "live-data",
    title: "10. Live traffic, weather and other outside data",
    blocks: [
      { t: "p", text: "Live aircraft positions, weather reports, radar and satellite pictures and similar data come from outside sources. They may be delayed, incomplete, wrong or unavailable, and we do not control them. When no live aircraft are available, a 3D view may show simulated traffic. None of it may be used for real flying (section 3)." },
    ],
  },
  {
    id: "availability",
    title: "11. Availability and changes to the Service",
    blocks: [
      { t: "p", text: "The Service is provided \"as is\" and \"as available\". We may change, suspend or end features, and we do not promise it will be uninterrupted or error-free. If we end a paid feature you have already paid for and not used, we will offer a fair remedy. [TODO legal: define the remedy.]" },
    ],
  },
  {
    id: "termination",
    title: "12. Suspension and closing your account",
    blocks: [
      { t: "p", text: "You can stop using the Service and ask us to close your account at any time. We may suspend or close an account that breaks these terms, puts others at risk or is required to be closed by law. Sections 3, 7, 13 and 14 continue to apply after your account closes." },
    ],
  },
  {
    id: "liability",
    title: "13. Limits on our liability",
    blocks: [
      { t: "note", text: "To the maximum extent the law allows, Cephionix is not liable for indirect, incidental or consequential loss, or for any loss arising from relying on the Service's educational outputs, live data or third-party material. Nothing in these terms limits liability that cannot be limited under Indian law. [TODO legal: decide whether to add a monetary cap.]" },
    ],
  },
  {
    id: "law",
    title: "14. Governing law and disputes",
    blocks: [
      { t: "p", text: "These terms are governed by the laws of India. Disputes will be heard by the courts at [TODO legal: city], unless the law gives you the right to use another forum." },
    ],
  },
  {
    id: "grievance",
    title: "15. Complaints and the Grievance Officer",
    blocks: [
      { t: "p", text: "Write to support@earnwings.org with any complaint about the Service or its content. As required by the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, we have a Grievance Officer, whose details are shown in the app. [TODO legal: publish the Grievance Officer's name, address and response times here.]" },
    ],
  },
  {
    id: "changes",
    title: "16. Changes to these terms",
    blocks: [
      { t: "p", text: "We may update these terms as the product grows. For a significant change we will tell you in the app or by email before it takes effect. Continuing to use the Service after that means you accept the updated terms." },
    ],
  },
  {
    id: "contact",
    title: "17. Contact",
    blocks: [{ t: "p", text: "Questions about these terms: support@earnwings.org." }],
  },
];

export const CREDITS_INTRO =
  "Notices required by the licences of material we use from others. Each owner keeps its rights, and listing it does not mean it endorses EarnWings.";

export const CREDITS_CATEGORIES = [
  "Maps and geodata",
  "Live aircraft data",
  "Weather",
  "Charts and aeronautical data",
  "3D models",
  "Voices and speech",
  "Fonts and icons",
  "Software libraries",
];

/** @type {{id:string,category:string,name:string,provider:string,usedFor:string,licence:string,licenceUrl:string,sourceUrl:string,attribution:string,notes:string}[]} */
export const CREDITS = [
  {
    "id": "osm",
    "category": "Maps and geodata",
    "name": "OpenStreetMap",
    "provider": "OpenStreetMap contributors / OpenStreetMap Foundation",
    "usedFor": "Aerodrome layouts, taxiways, roads, rail and street-light positions in the 3D airport scenes and on the ground charts.",
    "licence": "Open Database License (ODbL) 1.0",
    "licenceUrl": "https://opendatacommons.org/licenses/odbl/1-0/",
    "sourceUrl": "https://www.openstreetmap.org/copyright",
    "attribution": "© OpenStreetMap contributors",
    "notes": "Map data is available under the Open Database License. Derived databases we publish are offered under the same licence."
  },
  {
    "id": "overture",
    "category": "Maps and geodata",
    "name": "Overture Maps (buildings, transportation, base)",
    "provider": "Overture Maps Foundation",
    "usedFor": "Building footprints, streets, flyovers, parks and water around airports in the 3D city scenery.",
    "licence": "Open Database License (ODbL) 1.0",
    "licenceUrl": "https://opendatacommons.org/licenses/odbl/1-0/",
    "sourceUrl": "https://docs.overturemaps.org/attribution/",
    "attribution": "© OpenStreetMap contributors, Overture Maps Foundation",
    "notes": "Overture conflates OpenStreetMap, Google Open Buildings, Microsoft Global ML Building Footprints and Esri Community Maps."
  },
  {
    "id": "carto-basemaps",
    "category": "Maps and geodata",
    "name": "CARTO basemaps",
    "provider": "CARTO",
    "usedFor": "Background map under the weather radar view.",
    "licence": "CARTO Basemap Terms",
    "licenceUrl": "https://carto.com/legal/basemap-terms/",
    "sourceUrl": "https://carto.com/attributions",
    "attribution": "© OpenStreetMap contributors © CARTO",
    "notes": ""
  },
  {
    "id": "copernicus-dem",
    "category": "Maps and geodata",
    "name": "Copernicus DEM GLO-30",
    "provider": "European Union and ESA (Copernicus); DLR e.V. and Airbus Defence and Space GmbH",
    "usedFor": "Terrain height and relief around airports and in the mountains around Leh.",
    "licence": "Copernicus DEM licence (free of charge; reproduction, distribution and adaptation permitted)",
    "licenceUrl": "https://documentation.dataspace.copernicus.eu/APIs/SentinelHub/Data/DEM/resources/license/License-COPDEM-30.pdf",
    "sourceUrl": "https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM",
    "attribution": "Produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved",
    "notes": "The organisations in charge of the Copernicus programme by law or by delegation do not incur any liability for any use of the Copernicus WorldDEM-30."
  },
  {
    "id": "copernicus-sentinel2",
    "category": "Maps and geodata",
    "name": "Copernicus Sentinel-2 imagery",
    "provider": "European Union, Copernicus programme (accessed via Element84 Earth Search)",
    "usedFor": "Real ground colour under and around each airport.",
    "licence": "Copernicus Sentinel data legal notice (free, full and open)",
    "licenceUrl": "https://sentinels.copernicus.eu/documents/247904/690755/Sentinel_Data_Legal_Notice",
    "sourceUrl": "https://element84.com/earth-search/",
    "attribution": "Contains modified Copernicus Sentinel data 2025-2026",
    "notes": ""
  },
  {
    "id": "eox-s2cloudless-2016",
    "category": "Maps and geodata",
    "name": "Sentinel-2 cloudless 2016",
    "provider": "EOX IT Services GmbH",
    "usedFor": "Ground imagery at a few airports built before the newer Sentinel-2 imagery.",
    "licence": "Creative Commons Attribution 4.0 International",
    "licenceUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceUrl": "https://s2maps.eu",
    "attribution": "Sentinel-2 cloudless - https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016)",
    "notes": ""
  },
  {
    "id": "esa-worldcover",
    "category": "Maps and geodata",
    "name": "ESA WorldCover 10 m 2021 v200",
    "provider": "European Space Agency, WorldCover consortium",
    "usedFor": "Land cover and water around airports (grass, fields, built-up areas, lakes and rivers).",
    "licence": "Creative Commons Attribution 4.0 International",
    "licenceUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceUrl": "https://esa-worldcover.org",
    "attribution": "© ESA WorldCover project 2021 / Contains modified Copernicus Sentinel data (2021) processed by ESA WorldCover consortium",
    "notes": ""
  },
  {
    "id": "google-open-buildings",
    "category": "Maps and geodata",
    "name": "Google Open Buildings v3 and Open Buildings 2.5D Temporal",
    "provider": "Google Research",
    "usedFor": "Building footprints and building heights in the 3D city scenery.",
    "licence": "Creative Commons Attribution 4.0 International",
    "licenceUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceUrl": "https://sites.research.google/gr/open-buildings/",
    "attribution": "Google Open Buildings v3; Open Buildings 2.5D Temporal Dataset, Google Research (CC BY 4.0)",
    "notes": "Contains modified Copernicus Sentinel data."
  },
  {
    "id": "microsoft-buildings",
    "category": "Maps and geodata",
    "name": "Global ML Building Footprints",
    "provider": "Microsoft",
    "usedFor": "Building footprints around Chennai.",
    "licence": "Community Data License Agreement – Permissive 2.0",
    "licenceUrl": "https://cdla.dev/permissive-2-0/",
    "sourceUrl": "https://github.com/microsoft/GlobalMLBuildingFootprints",
    "attribution": "Building footprints © Microsoft, licensed under CDLA Permissive 2.0",
    "notes": ""
  },
  {
    "id": "meta-wri-canopy",
    "category": "Maps and geodata",
    "name": "High Resolution Canopy Height Maps",
    "provider": "Meta and World Resources Institute",
    "usedFor": "Real positions and heights of trees around airports.",
    "licence": "Creative Commons Attribution 4.0 International",
    "licenceUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceUrl": "https://registry.opendata.aws/dataforgood-fb-forests/",
    "attribution": "High Resolution Canopy Height Maps by WRI and Meta (Tolan et al. 2024), CC BY 4.0. Source imagery for CHM © 2016 Maxar",
    "notes": ""
  },
  {
    "id": "ourairports",
    "category": "Charts and aeronautical data",
    "name": "OurAirports",
    "provider": "David Megginson and contributors",
    "usedFor": "Starting list of aerodromes, later checked against the official AIP.",
    "licence": "Public domain",
    "licenceUrl": "https://ourairports.com/data/",
    "sourceUrl": "https://ourairports.com/",
    "attribution": "Aerodrome list from OurAirports (public domain)",
    "notes": ""
  },
  {
    "id": "aai-eaip",
    "category": "Charts and aeronautical data",
    "name": "AIP India (eAIP)",
    "provider": "Airports Authority of India, Aeronautical Information Management",
    "usedFor": "Aerodrome data, runways, frequencies, procedures and air routes behind the training charts and RT scenarios, and the official charts shown for teaching.",
    "licence": "© Airports Authority of India",
    "licenceUrl": "https://aim-india.aai.aero/",
    "sourceUrl": "https://aim-india.aai.aero/",
    "attribution": "Source: AIP India, Airports Authority of India (AIRAC cycle as shown on each chart). For training only, not for navigation.",
    "notes": "EarnWings charts are drawn for training and are pinned to a stated AIRAC cycle. Always use the current official AIP for flight."
  },
  {
    "id": "adsb-fi",
    "category": "Live aircraft data",
    "name": "adsb.fi open data",
    "provider": "adsb.fi",
    "usedFor": "Live positions of real aircraft around airports in the 3D airport view.",
    "licence": "adsb.fi open data terms",
    "licenceUrl": "https://github.com/adsbfi/opendata",
    "sourceUrl": "https://adsb.fi",
    "attribution": "Live traffic data: adsb.fi (https://adsb.fi)",
    "notes": ""
  },
  {
    "id": "adsb-lol",
    "category": "Live aircraft data",
    "name": "adsb.lol",
    "provider": "adsb.lol community network",
    "usedFor": "Live positions of real aircraft around airports in the 3D airport view.",
    "licence": "Open Database License (ODbL) 1.0",
    "licenceUrl": "https://opendatacommons.org/licenses/odbl/1-0/",
    "sourceUrl": "https://www.adsb.lol",
    "attribution": "Live traffic data: adsb.lol (ODbL)",
    "notes": ""
  },
  {
    "id": "opensky",
    "category": "Live aircraft data",
    "name": "The OpenSky Network",
    "provider": "OpenSky Network association",
    "usedFor": "Positions of aircraft parked on the ground at airports in the 3D airport view.",
    "licence": "OpenSky Network terms of use",
    "licenceUrl": "https://opensky-network.org/about/terms-of-use",
    "sourceUrl": "https://opensky-network.org",
    "attribution": "Data from The OpenSky Network, https://opensky-network.org (Schäfer et al., \"Bringing Up OpenSky: A Large-scale ADS-B Sensor Network for Research\", IPSN 2014)",
    "notes": ""
  },
  {
    "id": "imd",
    "category": "Weather",
    "name": "India Meteorological Department (IMD)",
    "provider": "India Meteorological Department, Ministry of Earth Sciences, Government of India",
    "usedFor": "Doppler weather radar pictures from IMD stations across India, and Indian METAR and TAF reports.",
    "licence": "© India Meteorological Department",
    "licenceUrl": "https://mausam.imd.gov.in/responsive/disclaimer.php",
    "sourceUrl": "https://mausam.imd.gov.in/responsive/radar.php",
    "attribution": "Source: India Meteorological Department (mausam.imd.gov.in)",
    "notes": "IMD publishes radar and satellite imagery for the public at https://mausam.imd.gov.in/responsive/radar.php (stations selectable, e.g. https://mausam.imd.gov.in/responsive/radar.php?id=Mumbai), radar loops at https://mausam.imd.gov.in/responsive/radar_animation.php, and satellite imagery at https://mausam.imd.gov.in/responsive/satellite.php. Aviation weather services: https://mausam.imd.gov.in/imd_latest/contents/meteorological-services-civil-aviation.php. Shown for training; not a substitute for an official pre-flight briefing."
  },
  {
    "id": "noaa-awc",
    "category": "Weather",
    "name": "Aviation Weather Center",
    "provider": "NOAA / National Weather Service (United States)",
    "usedFor": "METAR, TAF and SIGMET reports, and observation history.",
    "licence": "United States Government work (public domain)",
    "licenceUrl": "https://www.weather.gov/disclaimer",
    "sourceUrl": "https://aviationweather.gov",
    "attribution": "METAR, TAF and SIGMET data: NOAA Aviation Weather Center",
    "notes": "Use of NOAA data does not imply endorsement by NOAA."
  },
  {
    "id": "noaa-gfs",
    "category": "Weather",
    "name": "Global Forecast System (WAFS winds and temperatures)",
    "provider": "NOAA / NCEP",
    "usedFor": "Winds and temperatures aloft.",
    "licence": "United States Government work (public domain)",
    "licenceUrl": "https://www.weather.gov/disclaimer",
    "sourceUrl": "https://nomads.ncep.noaa.gov",
    "attribution": "Winds aloft: NOAA NCEP GFS",
    "notes": ""
  },
  {
    "id": "noaa-gmgsi",
    "category": "Weather",
    "name": "Global Mosaic of Geostationary Satellite Imagery (GMGSI)",
    "provider": "NOAA / NESDIS",
    "usedFor": "Satellite cloud pictures (infrared, visible, water vapour) and animations.",
    "licence": "NOAA Open Data Dissemination (open use, attribution requested)",
    "licenceUrl": "https://registry.opendata.aws/noaa-gmgsi",
    "sourceUrl": "https://www.ospo.noaa.gov/Products/imagery/gmgsi/",
    "attribution": "Satellite imagery courtesy NOAA/NESDIS GMGSI; includes data from GOES (NOAA), Meteosat (EUMETSAT) and Himawari (JMA)",
    "notes": "Images are processed for display; they are not original, unaltered NOAA data."
  },
  {
    "id": "rainviewer",
    "category": "Weather",
    "name": "RainViewer weather radar maps",
    "provider": "RainViewer",
    "usedFor": "Animated radar mosaic on the weather radar map.",
    "licence": "RainViewer API terms of use",
    "licenceUrl": "https://www.rainviewer.com/api.html",
    "sourceUrl": "https://www.rainviewer.com",
    "attribution": "Weather data by RainViewer (https://www.rainviewer.com)",
    "notes": ""
  },
  {
    "id": "open-meteo",
    "category": "Weather",
    "name": "Open-Meteo",
    "provider": "Open-Meteo",
    "usedFor": "Backup source for winds aloft when the primary forecast is unavailable.",
    "licence": "Creative Commons Attribution 4.0 International (data)",
    "licenceUrl": "https://open-meteo.com/en/license",
    "sourceUrl": "https://open-meteo.com",
    "attribution": "Weather data by Open-Meteo.com (CC BY 4.0)",
    "notes": ""
  },
  {
    "id": "flightgear-aircraft",
    "category": "3D models",
    "name": "FlightGear aircraft models and liveries",
    "provider": "FlightGear aircraft authors (A320 family, A330, A350, A380, ATR 72, 737-800, 777, 787, Dash 8 projects)",
    "usedFor": "Airliners shown in the 3D airport view, converted to a web format with native liveries.",
    "licence": "GNU General Public License (version 2, 2 or later, or 3, per aircraft)",
    "licenceUrl": "https://www.gnu.org/licenses/gpl-3.0.html",
    "sourceUrl": "https://www.flightgear.org",
    "attribution": "Aircraft converted from FlightGear models (GNU GPL); authors and pinned upstream sources listed per aircraft",
    "notes": "Per-aircraft authors, licences and upstream commits are listed in the aircraft credits. The corresponding source (original FlightGear files and conversion tools) is available from EarnWings. Airline names and liveries are trademarks of their owners; no affiliation or endorsement is implied."
  },
  {
    "id": "a320-cockpit-davidmarton1987",
    "category": "3D models",
    "name": "A320 Cockpit 2",
    "provider": "davidmarton1987 (Sketchfab)",
    "usedFor": "The A320 flight deck in the cockpit view and procedure trainer.",
    "licence": "Creative Commons Attribution 4.0 International",
    "licenceUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceUrl": "https://sketchfab.com/3d-models/a320-cockpit-2-5fb0c671a91042c1a9d8f2cf3e2df021",
    "attribution": "\"A320 Cockpit 2\" by davidmarton1987 (https://sketchfab.com/davidmarton1987), CC BY 4.0",
    "notes": "Interactive overlays added by EarnWings."
  },
  {
    "id": "sketchfab-aircraft",
    "category": "3D models",
    "name": "Aircraft models (Sketchfab, CC BY 4.0)",
    "provider": "TonyWony; harshpriyanshu22; manilov.ap; AF267",
    "usedFor": "Airliner models in the 3D airport view.",
    "licence": "Creative Commons Attribution 4.0 International",
    "licenceUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceUrl": "https://sketchfab.com",
    "attribution": "\"A320-200 with cockpit (ver VIII)\" by TonyWony; \"Air India A321 Exteriors + Interiors\" by harshpriyanshu22; \"Boeing737\" and \"Boeing787\" by manilov.ap; \"GeoFS Official ATR-72 UTair Livery\" by AF267 — all CC BY 4.0, changes made (re-oriented, rescaled, levels of detail, textures re-encoded, liveries repainted)",
    "notes": "Model pages: https://sketchfab.com/3d-models/a320-200-with-cockpit-ver-viii-8006237df31a4b1c8fd5f692194328e9 ; https://sketchfab.com/3d-models/air-india-a321-exteriors-interiors-670c3985a1964a52a4c918bd45ef9e25 ; https://sketchfab.com/3d-models/boeing737-259de41be0c7410e86b7e79be33d6b3a ; https://sketchfab.com/3d-models/boeing787-b6984cf34f894d3d9ca3b696dca1c77a ; https://sketchfab.com/3d-models/geofs-official-atr-72-utair-livery-cf283f6412744bb28eddf971cc19dad2"
  },
  {
    "id": "sketchfab-vehicles",
    "category": "3D models",
    "name": "Vehicle and ground-equipment models (Sketchfab, CC BY 4.0)",
    "provider": "spot1studios; BumpkinCZ; razor24; ProPolyModels; own.guest; propmaker1; Comrade1280; Casacade Models; omri_ha_muglob; Dayvable; Nguyentuannghia 64",
    "usedFor": "Cars, taxis, buses, catering and fuel trucks, baggage carts, power units and tractors around the airports.",
    "licence": "Creative Commons Attribution 4.0 International",
    "licenceUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceUrl": "https://sketchfab.com",
    "attribution": "\"Airport Catering Truck\" by spot1studios; \"Tata Nano\" by BumpkinCZ; \"2015 Hyundai Tucson\" by razor24; \"Suzuki Carry Minivan\" by ProPolyModels; \"Generic Town Bus\" by own.guest; \"Airport baggage equipment (cart) lowpoly\" and \"Aircraft tractor lowpoly model\" by propmaker1; \"Generic passenger car pack\" and \"Generic civil service vehicles pack\" by Comrade1280; \"Suzuki Swift\" by Casacade Models; \"GPU (Aiport Ground Power Unit)\" by omri_ha_muglob; \"Airport Luggage Cart\" by Dayvable; \"Airport Fuel Truck\" by Nguyentuannghia 64 — all CC BY 4.0, changes made (rescaled, levels of detail, repainted)",
    "notes": "Vehicle makes and models are trademarks of their owners; no affiliation or endorsement is implied."
  },
  {
    "id": "selendis-kit",
    "category": "3D models",
    "name": "Selendis Airport 3D and Park Concept 3D",
    "provider": "Selendis (CGTrader)",
    "usedFor": "Selected airport props, trees, surface textures and cinematic renders.",
    "licence": "CGTrader Royalty Free License (purchased)",
    "licenceUrl": "https://www.cgtrader.com/pages/terms-and-conditions",
    "sourceUrl": "https://www.cgtrader.com/3d-models/exterior/other/selendis-airport",
    "attribution": "Includes assets from Selendis Airport 3D (CGTrader), used under licence",
    "notes": "Purchased assets; not redistributable."
  },
  {
    "id": "poly-haven",
    "category": "3D models",
    "name": "Poly Haven",
    "provider": "Poly Haven and its scanning artists",
    "usedFor": "Scanned trees, shrubs, grass, rocks and ground materials.",
    "licence": "CC0 1.0 Universal (public domain)",
    "licenceUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "sourceUrl": "https://polyhaven.com",
    "attribution": "Textures and models from Poly Haven (CC0)",
    "notes": "No attribution required; credited with thanks."
  },
  {
    "id": "ambientcg",
    "category": "3D models",
    "name": "ambientCG",
    "provider": "Lennart Demes / ambientCG",
    "usedFor": "Surface textures for runways, aprons, buildings, ground and vehicles.",
    "licence": "CC0 1.0 Universal (public domain)",
    "licenceUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "sourceUrl": "https://ambientcg.com",
    "attribution": "Textures from ambientCG.com (CC0)",
    "notes": "No attribution required; credited with thanks."
  },
  {
    "id": "sen2sr",
    "category": "Software libraries",
    "name": "SEN2SR Lite",
    "provider": "ESA OpenSR / tacofoundation",
    "usedFor": "Sharpening satellite ground imagery when building the city scenery.",
    "licence": "CC0 1.0 Universal (code and weights)",
    "licenceUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "sourceUrl": "https://github.com/ESAOpenSR/SEN2SR",
    "attribution": "SEN2SR by ESA OpenSR (CC0)",
    "notes": ""
  },
  {
    "id": "kokoro",
    "category": "Voices and speech",
    "name": "Kokoro-82M text-to-speech and voices",
    "provider": "hexgrad",
    "usedFor": "The ATC controller and instructor voices in RT practice.",
    "licence": "Apache License 2.0",
    "licenceUrl": "https://www.apache.org/licenses/LICENSE-2.0",
    "sourceUrl": "https://huggingface.co/hexgrad/Kokoro-82M",
    "attribution": "Voices generated with Kokoro-82M by hexgrad (Apache-2.0)",
    "notes": "Voice clips are generated by EarnWings and processed with a radio effect."
  },
  {
    "id": "espeak-ng",
    "category": "Voices and speech",
    "name": "eSpeak NG",
    "provider": "eSpeak NG contributors",
    "usedFor": "Pronunciation support for the text-to-speech voices (runs on EarnWings servers).",
    "licence": "GNU General Public License v3.0",
    "licenceUrl": "https://www.gnu.org/licenses/gpl-3.0.html",
    "sourceUrl": "https://github.com/espeak-ng/espeak-ng",
    "attribution": "eSpeak NG (GPL-3.0)",
    "notes": ""
  },
  {
    "id": "whisper",
    "category": "Voices and speech",
    "name": "Whisper (small.en) via faster-whisper",
    "provider": "OpenAI (model); SYSTRAN (faster-whisper)",
    "usedFor": "Turning a student's spoken radio call into text so it can be checked.",
    "licence": "MIT License",
    "licenceUrl": "https://github.com/openai/whisper/blob/main/LICENSE",
    "sourceUrl": "https://github.com/SYSTRAN/faster-whisper",
    "attribution": "Speech recognition: OpenAI Whisper (MIT) via faster-whisper by SYSTRAN (MIT)",
    "notes": "Runs on EarnWings servers."
  },
  {
    "id": "bge-small",
    "category": "Software libraries",
    "name": "BGE small (bge-small-en-v1.5) via FastEmbed",
    "provider": "BAAI; Qdrant (FastEmbed)",
    "usedFor": "Finding relevant study material when Captain Aezon answers questions.",
    "licence": "MIT License (model); Apache License 2.0 (FastEmbed)",
    "licenceUrl": "https://huggingface.co/BAAI/bge-small-en-v1.5",
    "sourceUrl": "https://github.com/qdrant/fastembed",
    "attribution": "bge-small-en-v1.5 by BAAI (MIT); FastEmbed by Qdrant (Apache-2.0)",
    "notes": ""
  },
  {
    "id": "font-inter",
    "category": "Fonts and icons",
    "name": "Inter",
    "provider": "Rasmus Andersson (via Google Fonts)",
    "usedFor": "The app's main typeface.",
    "licence": "SIL Open Font License 1.1",
    "licenceUrl": "https://openfontlicense.org",
    "sourceUrl": "https://fonts.google.com/specimen/Inter",
    "attribution": "Inter by Rasmus Andersson (SIL OFL 1.1)",
    "notes": ""
  },
  {
    "id": "font-sora-oswald",
    "category": "Fonts and icons",
    "name": "Sora and Oswald",
    "provider": "Sora: Jonathan Barnbrook and Julián Moncada; Oswald: Vernon Adams and contributors (via Google Fonts)",
    "usedFor": "Sora: headings in the EarnWings app. Oswald: the EARNWINGS wordmark on the website.",
    "licence": "SIL Open Font License 1.1",
    "licenceUrl": "https://openfontlicense.org",
    "sourceUrl": "https://fonts.google.com",
    "attribution": "Sora and Oswald (SIL OFL 1.1)",
    "notes": ""
  },
  {
    "id": "font-archivo-plex-mono",
    "category": "Fonts and icons",
    "name": "Archivo and IBM Plex Mono",
    "provider": "Archivo: Omnibus-Type; IBM Plex Mono: IBM, designed with Bold Monday (via Google Fonts)",
    "usedFor": "Headings (Archivo) and data labels (IBM Plex Mono) on the EarnWings website.",
    "licence": "SIL Open Font License 1.1",
    "licenceUrl": "https://openfontlicense.org",
    "sourceUrl": "https://fonts.google.com",
    "attribution": "Archivo and IBM Plex Mono (SIL OFL 1.1)",
    "notes": ""
  },
  {
    "id": "lucide",
    "category": "Fonts and icons",
    "name": "Lucide icons",
    "provider": "Lucide contributors",
    "usedFor": "Icons throughout the app.",
    "licence": "ISC License",
    "licenceUrl": "https://lucide.dev/license",
    "sourceUrl": "https://lucide.dev",
    "attribution": "Icons by Lucide (ISC)",
    "notes": "Parts derived from Feather icons (MIT)."
  },
  {
    "id": "material-icons",
    "category": "Fonts and icons",
    "name": "Material UI and Material Icons",
    "provider": "MUI; Google",
    "usedFor": "Some interface components and icons.",
    "licence": "MIT License (MUI); Apache License 2.0 (Material Icons)",
    "licenceUrl": "https://github.com/mui/material-ui/blob/master/LICENSE",
    "sourceUrl": "https://mui.com",
    "attribution": "Material UI (MIT); Material Icons by Google (Apache-2.0)",
    "notes": ""
  },
  {
    "id": "threejs",
    "category": "Software libraries",
    "name": "three.js",
    "provider": "three.js authors",
    "usedFor": "3D rendering of airports, aircraft and the cockpit.",
    "licence": "MIT License",
    "licenceUrl": "https://github.com/mrdoob/three.js/blob/dev/LICENSE",
    "sourceUrl": "https://threejs.org",
    "attribution": "three.js (MIT)",
    "notes": ""
  },
  {
    "id": "leaflet",
    "category": "Software libraries",
    "name": "Leaflet",
    "provider": "Volodymyr Agafonkin and contributors",
    "usedFor": "The interactive weather radar map.",
    "licence": "BSD 2-Clause License",
    "licenceUrl": "https://github.com/Leaflet/Leaflet/blob/main/LICENSE",
    "sourceUrl": "https://leafletjs.com",
    "attribution": "Leaflet (BSD-2-Clause)",
    "notes": ""
  },
  {
    "id": "react-capacitor",
    "category": "Software libraries",
    "name": "React, React Router, Capacitor, Electron",
    "provider": "Meta and contributors; Remix; Ionic; OpenJS Foundation",
    "usedFor": "The app framework on web, iPhone, Android and Mac.",
    "licence": "MIT License",
    "licenceUrl": "https://opensource.org/license/mit",
    "sourceUrl": "https://react.dev",
    "attribution": "React, React Router, Capacitor and Electron (MIT); Chromium (BSD-style and other notices shipped with the Mac app)",
    "notes": ""
  },
  {
    "id": "pdfjs",
    "category": "Software libraries",
    "name": "PDF.js",
    "provider": "Mozilla",
    "usedFor": "Displaying PDF documents and charts.",
    "licence": "Apache License 2.0",
    "licenceUrl": "https://github.com/mozilla/pdf.js/blob/master/LICENSE",
    "sourceUrl": "https://mozilla.github.io/pdf.js/",
    "attribution": "PDF.js by Mozilla (Apache-2.0)",
    "notes": ""
  },
  {
    "id": "gsap",
    "category": "Software libraries",
    "name": "GSAP",
    "provider": "GreenSock / Webflow",
    "usedFor": "Interface animation.",
    "licence": "GSAP Standard License (no charge)",
    "licenceUrl": "https://gsap.com/standard-license",
    "sourceUrl": "https://gsap.com",
    "attribution": "GSAP by GreenSock",
    "notes": ""
  },
  {
    "id": "other-js",
    "category": "Software libraries",
    "name": "Other open-source libraries",
    "provider": "Various (Radix UI, shadcn/ui, Tiptap, Mermaid, KaTeX, Recharts, Motion, DOMPurify, Lottie and others)",
    "usedFor": "Interface components, note editing, diagrams, maths, charts and animation.",
    "licence": "MIT, ISC, BSD and Apache-2.0 (DOMPurify: MPL-2.0 or Apache-2.0)",
    "licenceUrl": "https://opensource.org/licenses",
    "sourceUrl": "https://www.npmjs.com",
    "attribution": "Includes open-source software; full licence texts available on request",
    "notes": "shadcn/ui components used under the MIT license."
  }
];
