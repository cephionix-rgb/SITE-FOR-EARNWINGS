// Single source of truth for the Pilot Guide (/guide and /guide/*).
//
// Imported by: the React pages (src/pages/guide/*), scripts/gen-routes.mjs (the
// crawlable shells, meta tags and sitemap) and scripts/make-guide-pdfs.mjs (the
// downloadable PDFs). Edit text HERE and every surface changes together. Plain
// .js so Node can import it.
//
// TRUTHFULNESS RULES for this file:
//   - Every fee, form field, rule or number must come from an official page
//     (DGCA, Pariksha, eGCA, Ministry of Civil Aviation, the Gazette) and that
//     page must be linked in the guide's `sources`.
//   - If something could not be verified on an official page, say so in a
//     `note` with tone "check" and point to the official page. Never guess.
//   - Costs and timelines that are not set by any regulator are given as
//     indicative ranges and labelled as such.
//   - Update LAST_CHECKED whenever the facts are re-checked.
//
// Inline markup used in text: **bold** and [label](https://url). Nothing else.

import { guideHref } from "./guideSlugs.js";

export const LAST_CHECKED = "18 November 2026";
export const LAST_CHECKED_ISO = "2026-11-18";

export const GUIDE_HUB = {
  path: "/guide",
  navLabel: "Pilot Guide",
  h1: ["Become a pilot in India: ", "the free Pilot Guide"],
  metaTitle: "Free Pilot Guide: DGCA Medicals, Exams, RTR | EARNWINGS",
  metaDescription:
    "A free, plain-English guide to becoming a pilot in India: the path from 10+2 to CPL and the airlines, DGCA medicals, eGCA, Pariksha exams, the RTR licence and a beginner glossary.",
  ogDescription:
    "From 10+2 to the right-hand seat: medicals, eGCA, Pariksha exams, RTR and the words you need, checked against official DGCA sources.",
  intro:
    "Everything a school student or graduate needs to know before spending a rupee on flight training: what the steps are, in what order, what each DGCA portal asks for, what is officially fixed and what varies. Written in plain English and checked against official sources, with links so you can verify every rule yourself.",
  disclaimer:
    "EARNWINGS is an independent study app. It is not part of, approved by or affiliated with DGCA, the Ministry of Civil Aviation or any government body. Rules, fees and forms change: always confirm on the official page linked in each guide before you apply or pay.",
  pdf: "/guides/earnwings-pilot-guide.pdf",
};

// Shown at the top of every guide (web and PDF), above the annotated screenshots.
export const SCREENS_NOTE =
  "EarnWings is independent and not affiliated with DGCA. Screens change; always follow the official site.";

// --------------------------------------------------------------- shared links
const L = {
  dgca: "https://www.dgca.gov.in",
  egcaLogin: "https://www.dgca.gov.in/digigov-portal/jsp/dgca/common/login.jsp",
  egcaManuals: "https://www.dgca.gov.in/digigov-portal/jsp/dgca/homePage/userMannual.jsp",
  egcaPilotManual:
    "https://public-prd-dgca.s3.ap-south-1.amazonaws.com/topHeader/eGCA%20User%20Manual_Pilot%20Registration%20Process.pdf",
  egcaTimelines:
    "https://public-prd-dgca.s3.ap-south-1.amazonaws.com/topHeader/Indicative%20timelines%20for%20approval%20of%20personnel%20licenses%20and%20authorisations/Indicative%20Timelines%20for%20eGCA%20services.pdf",
  egcaClass2Manual:
    "https://public-prd-dgca.s3.ap-south-1.amazonaws.com/topHeader/DMS%20-%20Process%20to%20Apply%20for%20Issuance%20Of%20Class%202.pdf",
  egcaClass1Manual:
    "https://public-prd-dgca.s3.ap-south-1.amazonaws.com/topHeader/DMS%20-%20Process%20to%20Apply%20for%20Issuance%20Of%20Class%201.pdf",
  egcaNocManual:
    "https://public-prd-dgca.s3.ap-south-1.amazonaws.com/topHeader/eGCA%20User%20Manual_Process%20to%20Apply%20Medical%20NOC.pdf",
  pariksha: "https://pariksha.dgca.gov.in",
  parikshaManual: "https://pariksha.dgca.gov.in/PDFViewer.jsp?pdf=95FB462516F636EF3FF3BAE7AA4DB33C",
  parikshaFaq: "https://pariksha.dgca.gov.in/PDFViewer.jsp?pdf=01BA8FB2105DBF5FA48E2F8D89E1E054",
  parikshaRejections: "https://pariksha.dgca.gov.in/PDFViewer.jsp?pdf=E22FF074A3C07EB4C9DE58925F4BDAF8",
  parikshaCalendar: "https://pariksha.dgca.gov.in/PDFViewer.jsp?pdf=027F234C1243D44B5BF5C787082CDCC8",
  parikshaInstructions: "https://pariksha.dgca.gov.in/PDFViewer.jsp?pdf=1F190676D3B858F530ED13B379792073",
  parikshaSyllabus: "https://pariksha.dgca.gov.in/PDFViewer.jsp?pdf=1A745E291DDC1E1BDC7FD70AEC52B711",
  carMedical: "https://www.dgca.gov.in/digigov-portal/Upload?flag=iframeAttachView&attachId=gIOV35y08VSQaJX1MbuHYg%3D%3D",
  carRtr: "https://www.dgca.gov.in/digigov-portal/Upload?flag=iframeAttachView&attachId=Yjr2U69tgL30j4R9JgAkmg%3D%3D",
  carElp: "https://www.dgca.gov.in/digigov-portal/Upload?flag=iframeAttachView&attachId=JPBUmdGwulu0nKP9bZMwpw%3D%3D",
  carConversion: "https://www.dgca.gov.in/digigov-portal/Upload?flag=iframeAttachView&attachId=wYuWRnFYsGA5N3yb3pWWEQ%3D%3D",
  carExams: "https://www.dgca.gov.in/digigov-portal/Upload?flag=iframeAttachView&attachId=qjWO22wds7BX8Yfa8AvH2A%3D%3D",
  carSyllabus: "https://www.dgca.gov.in/digigov-portal/Upload?flag=iframeAttachView&attachId=N7z1eKRUBXOMUMoP2JMGFQ%3D%3D",
  noticeMedical2025: "https://www.dgca.gov.in/digigov-portal/Upload?flag=iframeAttachView&attachId=VnyigCWHD0GGUAXx%2BlY80w%3D%3D",
  noticeRtrWpc: "https://www.dgca.gov.in/digigov-portal/Upload?flag=iframeAttachView&attachId=B9sngfpR9sBjILcpharYTQ%3D%3D",
  noticeRtrPractical: "https://www.dgca.gov.in/digigov-portal/Upload?flag=iframeAttachView&attachId=4b%2BBnXDFxz%2BpYPEwYABDsg%3D%3D",
  noticeAbroad: "https://www.dgca.gov.in/digigov-portal/Upload?flag=iframeAttachView&attachId=xU1P9qs1p%2BCqNcOvHSPxGw%3D%3D",
  noticeSplFee: "https://www.dgca.gov.in/digigov-portal/Upload?flag=iframeAttachView&attachId=n73N2%2FYqKRodBcwVjbPatA%3D%3D",
  rtrRules: "https://www.civilaviation.gov.in/sites/default/files/2026-10/telephone-operator-restricted-certificate-and-licence-rules-2025.pdf",
  mocaRules: "https://www.civilaviation.gov.in/ministry-documents/rules",
  moca: "https://www.civilaviation.gov.in",
  pilotsLicences: "https://public-prd-dgca.s3.ap-south-1.amazonaws.com/InventoryList/personal/license/pilot/Pilots.pdf",
  ftoList: "https://public-prd-dgca.s3.ap-south-1.amazonaws.com/InventoryList/personal/training/pilot/flrTrainOrgs/flyclub.pdf",
  ftoRanking: "https://public-prd-dgca.s3.ap-south-1.amazonaws.com/topHeader/aboutDGCA/Ranking%20of%20FTOs-April%202026.pdf",
  atoList: "https://public-prd-dgca.s3.ap-south-1.amazonaws.com/InventoryList/personal/training/pilot/aircraftTrainOrgs/ATO.pdf",
  class1List: "https://public-prd-dgca.s3.ap-south-1.amazonaws.com/InventoryList/personal/medical/class1/Class1.pdf",
  class2List: "https://public-prd-dgca.s3.ap-south-1.amazonaws.com/InventoryList/personal/medical/class2/Class2.pdf",
  elpList: "https://public-prd-dgca.s3.ap-south-1.amazonaws.com/InventoryList/personal/training/pilot/glidingTrainOrgs/ELP_Trg.pdf",
  bharatkosh: "https://bharatkosh.gov.in",
  digilocker: "https://www.digilocker.gov.in",
  dot: "https://dot.gov.in",
  // Aircraft Rules, 1937 (consolidated copy on the Ministry's site). An older
  // consolidation: later amendments, e.g. 10-year CPL validity (2023), are not in it.
  aircraftRules: "https://civilaviation.gov.in/sites/default/files/migration/moca_000947.pdf",
  // PIB backgrounder, 4 Nov 2026: Bharatiya Vayuyan Niyam, 2026 (G.S.R. 957(E),
  // Gazette 31 Oct 2026) replace the Aircraft Rules, 1937 and the RTR Rules 2025
  // from 1 Jan 2027. Its First Schedule repeats the CPL/PPL/SPL requirements.
  bvn: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2332687",
  pibValidity: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1968011",
  scNotice: "https://api.sci.gov.in/supremecourt/2018/38495/38495_2018_8_1501_16111_Judgement_22-Aug-2019.pdf",
  airIndiaCadet: "https://cadetpilot.airindia.com/",
};

// EarnWings pages the guides link to. Kept here so the wording stays helpful,
// not salesy: one link where it genuinely saves the reader a search.
const EW = {
  subjects: "/dgca-ground-classes",
  rt: "/features#rt",
  a320: "/features#a320",
  live: "/live",
  interactive: "/features#interactive",
};

/** @typedef {{label:string, url:string, note?:string}} Source */

// ------------------------------------------------------------------- guides
// Order matters: it is the reading order, the side-nav order and the PDF order.

/** @type {import("./guides").Guide[]} */
export const GUIDES = [
  // =========================================================== pilot pathway
  // Canonical URL: /how-to-become-a-pilot-in-india (see GUIDE_CANONICAL in
  // guideSlugs.js). /guide/pilot-pathway serves the same page.
  {
    slug: "pilot-pathway",
    navLabel: "How to become a pilot",
    title: "How to become a pilot in India (step by step)",
    h1: ["How to become a pilot in India, ", "step by step"],
    metaTitle: "How to Become a Pilot in India (Step by Step) | EARNWINGS",
    metaDescription:
      "How to become a pilot in India, step by step: 10+2 rules, DGCA medicals, the five DGCA papers, 200 flying hours, RTR, all-in costs, airline selection, bonds and jobs.",
    summary:
      "The whole route from school to the right-hand seat, in order: where to start from your situation, the all-in cost, medicals, exams, flying, the radio licence, airline selection, induction, bonds and jobs.",
    intro:
      "Becoming a commercial pilot in India is a chain of medicals, exams, flying hours and licences, each with a minimum set by the rules. This guide puts every link of that chain in order, separates what the rules fix from what your school and airline decide, gives honest cost ranges, and links each rule to the official page so you can check it yourself.",
    pdf: "/guides/earnwings-pilot-pathway-guide.pdf",
    sections: [
      {
        id: "route",
        title: "The route, in order",
        blocks: [
          { t: "p", text: "This is the order most Indian airline pilots follow. A few steps overlap (you can study for the exams while you fly), but none can be skipped. Each step links to the part of this guide, or the separate guide, that explains it." },
          {
            t: "steps",
            items: [
              { title: "Check you qualify", body: "For a Commercial Pilot Licence (CPL) you need Class 12 passed with **Physics and Mathematics** and must be at least **18** when the licence is issued. See [Start where you are](#start)." },
              { title: "Class 2 medical, then your first Class 1 medical", body: "Do this before you pay any big fee: a medical problem is the one thing money cannot fix. See the [Medicals guide](/guide/medical)." },
              { title: "Get your two DGCA IDs", body: "An eGCA ID (medicals, licences, logbook) and a Pariksha Computer Number (theory exams). Both are free. See the [eGCA guide](/guide/egca)." },
              { title: "Choose a DGCA-approved flying school on evidence", body: "Use DGCA's approved-school list and ranking, then ask each school for numbers. See [Choosing a flying school](#school)." },
              { title: "Student Pilot Licence (SPL) through the school", body: "From age 16, after an oral exam at the school. It lets you fly solo under supervision." },
              { title: "Pass the five DGCA theory papers on Pariksha", body: "Air Regulations, Air Navigation, Meteorology, Technical General and Technical Specific. See [The five DGCA papers](#papers)." },
              { title: "Fly at least 200 hours and pass the skill tests", body: "Most schools add an Instrument Rating and multi-engine training on the way. See [The licences](#licences)." },
              { title: "Radio licence (RTR) and English proficiency (ELP)", body: "Written and practical RTR exams with DGCA, and at least ICAO English Level 4. See [ELP and RTR](#elp-rtr)." },
              { title: "Apply for your CPL on eGCA", body: "Official fee ₹5,000; DGCA's indicative processing time is 15 days for students of Indian schools ([eGCA timelines](" + L.egcaTimelines + "))." },
              { title: "Apply to airlines and pass selection", body: "Written tests, interviews and usually a simulator check. See [Airline selection](#selection)." },
              { title: "Type rating, when an airline asks for one", body: "Training on one airliner type, such as the A320. Do not buy one speculatively. See [Ratings](#ratings)." },
              { title: "Wait for induction, then fly as a first officer", body: "Training batches start when the airline needs pilots. See [Waiting for induction](#induction)." },
            ],
          },
          { t: "figure", id: "pathway-roadmap", alt: "Roadmap of the route from Class 12 to airline first officer, with official fees and typical costs" },
          {
            t: "note",
            tone: "info",
            title: "New aviation rules from 1 January 2027",
            text: "The Bharatiya Vayuyan Niyam, 2026 replace the Aircraft Rules, 1937 and the RTR Rules 2025 on **1 January 2027** ([PIB, 4 November 2026](" + L.bvn + ")). We compared the pilot-licence parts of the notified text (G.S.R. 957(E)) with the old rules: the ages, education, the 200-hour CPL breakdown, the CPL exam subjects, 10-year licence validity, the exam fees and the RTR fees are the same. CARs and forms may be reissued under the new rules, so check the date on any official page you rely on.",
          },
        ],
      },
      {
        id: "start",
        title: "Start where you are",
        blocks: [
          { t: "p", text: "The route is the same for everyone, but your first move depends on where you are today." },
          {
            t: "table",
            head: ["You are", "What to do first", "Watch out for"],
            rows: [
              ["Finished Class 10", "Take **Physics and Mathematics** in Class 11 and 12; that is the one door you cannot open later without extra exams. From 16 you may do a Class 2 medical, and the SPL and RTR need only Class 10.", "Do not pay for flying yet. A CPL cannot be issued before Class 12 with Physics and Maths and age 18."],
              ["Finished Class 12 with Physics and Maths", "Book the Class 2 and Class 1 medicals, create your eGCA ID and Computer Number, and start comparing schools.", "Your name and date of birth must match your Class 10 certificate on every form."],
              ["Finished Class 12 without Physics or Maths", "You need a pass in both from a recognised board (or an equivalent exam) before DGCA will issue a CPL. You can start ground study meanwhile.", "Confirm with the Pariksha helpdesk that the board you plan to use is accepted before you rely on it (see the note under [Education](#education))."],
              ["A graduate in any subject", "A degree is not required and does not replace 10+2 Physics and Maths. If your Class 12 had both, you start at the medicals like everyone else.", "Budget for 18 to 24 months of training without a salary."],
              ["A working professional", "The licence rules set a **minimum** age, not a maximum, for a CPL. Do the Class 1 medical first, then study the papers part-time before you leave your job.", "Medicals are renewed more often as you get older (see the [Medicals guide](/guide/medical)), and each airline sets its own hiring age limits."],
              ["Already holding a foreign licence", "A licence from an ICAO country can be converted: the Indian Air Regulations paper and a composite paper, a skill test, the RTR and a signals exam ([conversion CAR](" + L.carConversion + ")).", "You must still meet the Indian age, education and medical rules. Conversion fee: ₹5,000 for a CPL."],
            ],
          },
        ],
      },
      {
        id: "costs",
        title: "What it costs, start to finish",
        blocks: [
          { t: "p", text: "DGCA fixes its own fees but not the price of flight training: schools set that. The ranges below are **typical, not official**: they come from schools' published fees and news reports as of **November 2026**, and they move with fuel prices, aircraft availability and delays. Official DGCA fees are shown exactly, with their source." },
          {
            t: "table",
            head: ["Item", "Typical cost (November 2026)", "In a school's CPL quote?"],
            rows: [
              ["Medicals (Class 2 and first Class 1)", "Official fee at an Indian Air Force centre: ₹3,000 for Class 2 and ₹5,000 for Class 1 ([CAR, para 4.3](" + L.carMedical + ")), plus test charges and travel. Private examiners and civil hospitals set their own fees.", "No, you pay these yourself"],
              ["Ground classes for the five papers and RTR", "Often quoted at **₹2 lakh to ₹5 lakh** when bought separately", "Sometimes included; ask"],
              ["DGCA exam fees", "**₹2,500 per paper** in a regular session, ₹5,000 on demand ([Pariksha manual](" + L.parikshaManual + ")). Five papers first time: ₹12,500 to ₹25,000, more with retakes.", "Usually extra"],
              ["Flying 200 hours in India", "Typically **₹35 lakh to ₹55 lakh**, the biggest single item", "Yes; check whether fuel surcharges and extra hours are"],
              ["CPL abroad instead", "Varies widely by country; commonly quoted between about **₹40 lakh and ₹80 lakh** including living costs, plus the Indian conversion exams and checks", "Ask what is included, in writing"],
              ["RTR radio licence", "Official: ₹2,000 written + ₹500 practical + ₹5,000 licence = **₹7,500** ([RTR Rules 2025](" + L.rtrRules + ")); FRTOL issue on eGCA ₹5,000", "Training sometimes; DGCA fees usually extra"],
              ["English proficiency (ELP)", "Set by the approved training organisation; not fixed by DGCA", "Ask"],
              ["Licence fees", "Official: SPL ₹1,000, CPL ₹5,000 ([eGCA timelines](" + L.egcaTimelines + "))", "Usually extra"],
              ["Living costs", "Depend on the town and on whether the school has a hostel; plan for the whole 18 to 24 months", "Hostel and meals sometimes; ask"],
              ["**CPL in India, all-in**", "Typically **₹45 lakh to ₹70 lakh**; delays and extra hours can push it higher", "-"],
              ["Type rating (later)", "Typically **₹15 lakh to ₹35 lakh** if you fund it yourself; often arranged by the airline after selection", "No, separate"],
            ],
          },
          { t: "p", text: "Time: commonly **18 to 24 months** from joining a school to holding a CPL in India, longer if weather or aircraft shortages slow the flying. Get every school's quote itemised and in writing, including what happens to your money if training stops." },
        ],
      },
      {
        id: "dgca-sites",
        title: "Finding your way around the DGCA websites",
        blocks: [
          { t: "p", text: "You will use three official sites again and again: [dgca.gov.in](" + L.dgca + ") (rules, notices and lists), eGCA (licences and medicals, reached from the **eGCA Login** link on dgca.gov.in) and [Pariksha](" + L.pariksha + ") (the theory exams). The screenshots below show where the important links are." },
          { t: "shot", id: "dgca-home", alt: "Annotated screenshot of the DGCA home page showing the eGCA Login link, the Personnel menu, the Regulations and Guidance menu and the Announcements tab", caption: "The DGCA home page. If it opens in Hindi, click **English** at the top right." },
          { t: "shot", id: "dgca-regulations", alt: "Annotated screenshot of the DGCA Regulations and Guidance menu showing Civil Aviation Requirements, Circulars, Public Notices and the RTR Rules 2025", caption: "Rules, CARs, circulars and public notices live under **Regulations and Guidance**." },
        ],
      },
      {
        id: "education",
        title: "Education: what you need from school",
        blocks: [
          { t: "p", text: "The education rules are in the licence schedule of the aircraft rules (Schedule II of the Aircraft Rules, 1937; the First Schedule of the Bharatiya Vayuyan Niyam, 2026 from 1 January 2027) and in the Pariksha exam manual." },
          {
            t: "table",
            head: ["Licence", "Minimum education"],
            rows: [
              ["SPL, PPL, RTR", "Class 10 pass"],
              ["CPL, ATPL", "Class 12 with **Physics and Mathematics** from a recognised board, or an equivalent exam"],
            ],
          },
          {
            t: "ul",
            items: [
              "You must be declared **pass in both Physics and Mathematics**. A compartment or fail in either is not accepted ([Pariksha manual](" + L.parikshaManual + ")).",
              "A diploma counts only if it is recognised by AICTE or a State Directorate of Technical Education, and you may need a 10+2 equivalence certificate.",
              "If you studied on an international or foreign board, you need an **equivalence certificate**. The current Pariksha manual and its older FAQ name different bodies for this (UGC in one, AIU in the other), so check the latest manual before you apply.",
              "Your licence is issued in the name on your **Class 10 certificate**. Make sure every later document matches it exactly.",
            ],
          },
          {
            t: "note",
            tone: "check",
            title: "Not verified: NIOS and adding Physics or Maths later",
            text: "DGCA does not name NIOS anywhere we could find. It asks for a board recognised by COBSE or a State or Central board, or an equivalent. Many students add Physics or Maths later through an open school, but we could not find an official DGCA page that confirms this. Ask the Pariksha helpdesk (help.pariksha.dgca@gov.in) before you rely on it.",
          },
        ],
      },
      {
        id: "medicals",
        title: "Medicals: do them first",
        blocks: [
          { t: "p", text: "A CPL needs a **Class 1** medical; an SPL, a PPL and the radio licence need **Class 2** ([CAR Section 7 Series C Part I](" + L.carMedical + ")). Your first Class 1 can only be done at one of three Indian Air Force centres (New Delhi, Bengaluru, Jorhat) or a DGCA-approved civil aeromedical centre. Because a medical problem can end a flying career before it starts, do your medicals before you pay any large training fee." },
          { t: "p", text: "The full process, centres, validity and fees are in the [Medicals guide](/guide/medical)." },
        ],
      },
      {
        id: "school",
        title: "Choosing a flying school, on evidence",
        blocks: [
          { t: "p", text: "Flying for a PPL or CPL must be done at a DGCA-approved flying school, called an FTO (Flying Training Organisation), unless you train abroad and later convert your licence. Glossy brochures all look alike; numbers do not." },
          { t: "h3", text: "Training in India" },
          {
            t: "ul",
            items: [
              "DGCA publishes the [list of approved FTOs](" + L.ftoList + "). On 11 November 2026 it listed **42** of them, with bases, fleets and approval dates.",
              "DGCA also publishes a [ranking of FTOs](" + L.ftoRanking + ") (April 2026), grouped into categories. A link to it also sits in the top bar of dgca.gov.in (\"FTO Ranking April-2026\").",
              "Your school must carry out police or character verification for each trainee when you enrol.",
              "Ask every school, and ask current students: how many aircraft are actually flying this month, how many students share them, how many hours a student really flies per month, the total cost itemised, what happens if training is delayed, and the refund policy.",
            ],
          },
          { t: "shot", id: "dgca-personnel-fto", alt: "Annotated screenshot of the DGCA Personnel menu with Training, Pilot, Flying Training Organizations highlighted", caption: "Where the approved flying school list is: **Personnel > Training > Pilot > Flying Training Organizations** on dgca.gov.in." },
          { t: "h3", text: "Training abroad" },
          {
            t: "ul",
            items: [
              "A foreign licence from an ICAO country can be converted to an Indian one under CAR Section 7 Series G Part I. For a CPL you pass the DGCA Air Regulations paper and a composite paper (Air Navigation and Meteorology), a skill test in India, the RTR and the signals exam, and you must meet the Indian hour, age, education and medical rules. See the [conversion CAR](" + L.carConversion + ").",
              "CPL conversion on eGCA costs **₹5,000**, with an indicative processing time of 25 days ([eGCA timelines](" + L.egcaTimelines + ")).",
              "In December 2025 DGCA issued a [public notice cautioning students](" + L.noticeAbroad + ") who train abroad: DGCA has no role in a foreign school's quality, delays, refunds or safety. Do your own checks on approvals, safety record, contracts and refund terms.",
            ],
          },
        ],
      },
      {
        id: "papers",
        title: "The five DGCA papers",
        blocks: [
          { t: "p", text: "The rules list the CPL written subjects as Air Regulations, Air Navigation, Aviation Meteorology, and Aircraft and Engines, plus a signals test ([Aircraft Rules, Schedule II Section J](" + L.aircraftRules + "); repeated in the [Bharatiya Vayuyan Niyam, 2026](" + L.bvn + ")). On Pariksha, Aircraft and Engines is split into two papers, which makes **five**:" },
          {
            t: "table",
            head: ["Paper", "What it covers, broadly"],
            rows: [
              ["Air Regulations", "Indian and international aviation law, rules of the air, licensing, airspace"],
              ["Air Navigation", "Charts, navigation calculations, instruments, radio navigation aids"],
              ["Aviation Meteorology", "The atmosphere, weather systems, clouds, reports and forecasts (METAR, TAF)"],
              ["Technical General", "Principles of flight, engines and aircraft systems in general"],
              ["Technical Specific", "The particular aircraft type you train on"],
            ],
          },
          {
            t: "ul",
            items: [
              "The **RTR written** paper is a sixth exam on the same portal, but it belongs to the radio licence, not the CPL papers.",
              "Each paper costs ₹2,500 in a regular session (four a year) or ₹5,000 in an on-demand session (eight a year) ([Pariksha manual](" + L.parikshaManual + ")).",
              "Your passes must fall within **5 years** before you apply for the CPL. Applying, exam day and results are in the [Pariksha guide](/guide/pariksha).",
              "To prepare: EarnWings has [notes and practice questions for each of these subjects](" + EW.subjects + "), set out in the DGCA syllabus order, with [interactive notes](" + EW.interactive + ") on 100+ chapters for the topics that are easier to see than to read, such as the altimeter and the ILS.",
            ],
          },
          { t: "shot", id: "pariksha-exams-menu", alt: "Annotated screenshot of the Pariksha Examinations menu with Exam Calendar 2026, Syllabus and FC OLODE Available Seats highlighted", caption: "Pariksha's **Examinations** menu: the exam calendar, the syllabus and on-demand seat availability." },
        ],
      },
      {
        id: "licences",
        title: "The licences, step by step",
        blocks: [
          { t: "figure", id: "cpl-hours", alt: "Bar chart of the CPL minimum flying hours" },
          { t: "p", text: "These minimums are from the licence schedule of the aircraft rules ([Aircraft Rules, 1937, Schedule II](" + L.aircraftRules + "), carried over unchanged into the Bharatiya Vayuyan Niyam, 2026). They are minimums: most students fly more." },
          {
            t: "table",
            head: ["Licence", "Minimum age", "Medical", "Key requirements"],
            rows: [
              ["SPL (Student Pilot Licence)", "16", "Class 2", "Class 10. Oral exam at your school. Lets you fly solo under an instructor's supervision. Issued through your FTO on eGCA; fee ₹1,000."],
              ["PPL (Private Pilot Licence)", "17", "Class 2", "Written exams. At least **40 hours** of flying, including 10 hours solo and 5 hours solo cross-country. No paid flying."],
              ["CPL (Commercial Pilot Licence)", "18", "Class 1", "Class 12 with Physics and Maths. The five papers. At least **200 hours** of flying (breakdown below). A current FRTOL (radio licence). Fee ₹5,000."],
              ["ATPL (Airline Transport Pilot Licence)", "21", "Class 1", "At least **1,500 hours**, a CPL, a multi-engine Instrument Rating and written and oral exams. Needed to command an airliner."],
            ],
          },
          { t: "h3", text: "What the 200 CPL hours must include" },
          {
            t: "ul",
            items: [
              "**100 hours as pilot-in-command (PIC)**, 15 of them in the 6 months before you apply.",
              "**20 hours cross-country as PIC**, including one flight of at least **300 nautical miles** with full-stop landings at two different aerodromes.",
              "**10 hours of instrument time**, of which no more than 5 in a simulator.",
              "**5 hours at night**, including 10 take-offs and 10 landings as PIC in the 6 months before you apply.",
              "Skill tests within the last 6 months: general flying by day and night, a 250 nm day cross-country and a 120 nm night cross-country.",
            ],
          },
          { t: "p", text: "A CPL is valid for **10 years** (increased from 5 in October 2023: [PIB](" + L.pibValidity + ")). Your Class 1 medical must stay current to use it." },
        ],
      },
      {
        id: "elp-rtr",
        title: "English proficiency (ELP) and the radio licence (RTR)",
        blocks: [
          {
            t: "ul",
            items: [
              "**English Language Proficiency** is required for PPL, CPL and ATPL under [CAR Section 7 Series G Part III](" + L.carElp + "). The minimum is **ICAO Level 4**. Level 4 is re-tested every 3 years, Level 5 every 6 years and Level 6 never.",
              "Before the ELP test you must complete training at a DGCA-approved organisation: at least 200 hours, or at least 30 hours if you passed English in Class 10 or 12 and have passed all your written licence exams. DGCA lists the [approved ELP organisations](" + L.elpList + ").",
              "The radio licence's official name is the **Radio Telephone Operator (Restricted) Certificate and Licence**, shortened to **RTR** in DGCA's CAR. Many schools still call it **RTR(A)**, for the aeronautical radiotelephony licence that WPC (Department of Telecommunications) used to issue. It is the same licence for a pilot.",
              "Since **1 December 2025** DGCA, not WPC, runs it: a 50-question written exam on Pariksha (pass 70%) and a practical radio test of about 30 minutes booked on eGCA (pass 50%) ([CAR Section 7 Series G Part VI](" + L.carRtr + ")). Details in the [RTR guide](/guide/rtr).",
              "The practical is spoken radio work, so practise speaking, not just reading. EarnWings' [RT practice](" + EW.rt + ") lets you say the calls out loud in 3D airports and hear ATC answer.",
            ],
          },
        ],
      },
      {
        id: "ratings",
        title: "Instrument rating, multi-engine and type rating",
        blocks: [
          {
            t: "ul",
            items: [
              "**Instrument Rating (IR):** lets you fly in cloud by reference to instruments. It needs at least 100 hours PIC (50 cross-country), at least 40 hours of instrument time (no more than 20 on the ground), written and oral exams, and a test. It is valid for 12 months and renewed with a test.",
              "**Multi-engine (ME):** airliners have two or more engines, so schools add multi-engine training and an endorsement, usually with the IR.",
              "**Type rating:** training on one specific aircraft type (for example A320 or B737) in a full-flight simulator, followed by base training in the aircraft. DGCA publishes the [list of approved type-rating training organisations](" + L.atoList + ").",
            ],
          },
          {
            t: "note",
            tone: "warn",
            title: "Get a type rating when an airline asks, not before",
            text: "A type rating is tied to one aircraft. If you buy an A320 rating and the airline that selects you flies something else, the money is wasted. Airlines usually tell you which type, and many arrange the training (sometimes recovered through a bond or salary deductions). Wait for that.",
          },
          { t: "p", text: "Before or during a type rating, it helps to know the flight deck by heart. EarnWings' [A320 cockpit trainer](" + EW.a320 + ") lets you work through the panels and checklists at your own pace." },
        ],
      },
      {
        id: "selection",
        title: "Airline selection: what airlines test",
        blocks: [
          { t: "p", text: "Each airline publishes its own steps in the recruitment notice, and they change between batches. Most Indian pilot selections we have seen use some mix of the following:" },
          {
            t: "ul",
            items: [
              "**A written or online test:** the DGCA subjects (navigation, meteorology, regulations, aircraft technical), mental maths, reasoning and English.",
              "**Aptitude or psychometric tests:** multitasking, spatial awareness and personality questionnaires.",
              "**Group exercise and interviews:** a technical interview on your flying and the DGCA subjects, and an HR interview on why you want to fly for them.",
              "**A simulator assessment:** often basic instrument flying (holding headings, altitudes and speeds), sometimes as a crew of two.",
              "**Document checks:** CPL, Class 1 medical, ELP, RTR or FRTOL, logbook, and that everything is current on the day.",
            ],
          },
          { t: "p", text: "Preparation that carries over: keep your DGCA subjects fresh ([practice questions](" + EW.subjects + ")), keep your radio calls crisp ([RT practice](" + EW.rt + ")), and watch real airline traffic to get a feel for how a busy airport flows. Our [live aircraft view](" + EW.live + ") of Delhi, Mumbai, Chennai and other airports is **free for everyone**, no account needed." },
          {
            t: "note",
            tone: "warn",
            title: "Only apply through official channels",
            text: "Apply through the airline's own careers page. Real airlines do not ask you to pay an agent for an interview slot or a job. Check that offer letters come from the airline's official email domain.",
          },
        ],
      },
      {
        id: "cadet",
        title: "Airline cadet programmes",
        blocks: [
          { t: "p", text: "Some Indian airlines run cadet pilot programmes. The airline selects candidates, often before they have any licence, partner academies train them to a CPL (often partly abroad), and a type rating follows. They are usually self-funded, sometimes with a bank loan arranged through the airline. The appeal is a clearer path to a job; the cost is usually similar to or higher than training on your own, and you sign the airline's contract at the start." },
          {
            t: "note",
            tone: "check",
            title: "Check the airline's own page",
            text: "Batches, eligibility, partner schools and fees change from intake to intake, and the airline sites did not allow us to verify current details. Read the airline's official careers or cadet page (for example [Air India's cadet pilot site](" + L.airIndiaCadet + ")) and get every cost in writing before you sign.",
          },
        ],
      },
      {
        id: "induction",
        title: "Waiting for induction",
        blocks: [
          { t: "p", text: "Being selected is not the same as starting. Airlines start training batches when they need pilots and when simulator slots are free, so the gap between an offer and a joining date can run to months. Nobody sets an official timeline for this." },
          {
            t: "ul",
            items: [
              "**Keep everything current:** Class 1 medical (12 months up to age 60), Instrument Rating (12 months), ELP Level 4 (3 years) and your CPL itself. A lapsed document on joining day can cost you the batch.",
              "**Stay sharp:** revise the DGCA subjects and the airline's aircraft type if you know it. Type-rating ground school moves fast.",
              "**Read the paperwork early:** the training agreement, any bond and the notice period (next section) are usually signed on joining. Ask for copies in advance.",
              "**After induction:** type rating in the simulator, base training in the aircraft, then line training on real flights with a training captain, after which you fly as a first officer.",
            ],
          },
        ],
      },
      {
        id: "bonds",
        title: "Bonds and notice periods",
        blocks: [
          { t: "h3", text: "Training bonds" },
          { t: "p", text: "When an airline pays for, or arranges, your type rating, it usually asks you to commit to stay for a period, or to repay a sum if you leave early. This is a contract between you and the airline; DGCA does not set it. Bond length, amount and how it reduces over time differ by airline and by batch, so we do not quote figures. Before you sign, find out:" },
          {
            t: "ul",
            items: [
              "the exact amount and how it reduces each month or year;",
              "whether it is repaid by salary deductions, a bank guarantee or a lump sum;",
              "what happens if the airline ends your job, suspends training or the aircraft type changes;",
              "and get it read by someone independent before you sign.",
            ],
          },
          { t: "h3", text: "Notice periods" },
          { t: "p", text: "Pilots in India cannot simply resign and leave the next day. DGCA's Civil Aviation Requirement on pilots' notice periods (Section 7, Series X, Part II) required at least **six months'** notice when the Supreme Court upheld it in 2019, and an airline can release a pilot sooner by issuing a no-objection certificate ([Supreme Court judgment, 22 August 2019](" + L.scNotice + ")). The CAR has been revised since (with a longer period proposed for captains) and has been challenged in court, so read the current version on [dgca.gov.in](" + L.dgca + ") and the notice clause in your own contract." },
        ],
      },
      {
        id: "careers",
        title: "Jobs after a CPL",
        blocks: [
          {
            t: "ul",
            items: [
              "**Airline first officer:** the goal for most. It needs a type rating and line training, then years of experience and an ATPL before you can become a captain.",
              "**Flight instructor:** Assistant Flight Instructor and Flight Instructor ratings let you teach at a flying school and build hours while you are paid. The oral exams are held on Pariksha.",
              "**Charter and non-scheduled operators:** smaller aircraft and business jets, corporate and private aviation.",
              "**Aerial work:** survey, photography and similar flying.",
              "**Airline cadet or trainee pilot schemes:** some airlines also recruit CPL holders into their own training pipelines; terms differ by airline (see [Cadet programmes](#cadet)).",
              "**Helicopters:** a separate licence, CPL(H), with its own hours and exams.",
              "**Related ground careers:** for example flight dispatcher, under its own DGCA rules.",
            ],
          },
          { t: "p", text: "Whichever way you go, the first job is usually the hardest to get. Keep your licences current, keep flying if you can, and keep applying." },
        ],
      },
    ],
    sources: [
      { label: "Aircraft Rules, 1937 (Ministry of Civil Aviation copy; Schedule II, Section J: CPL)", url: L.aircraftRules, note: "An older consolidation; later amendments such as 10-year CPL validity (2023) are not in it." },
      { label: "PIB: Bharatiya Vayuyan Niyam, 2026 replace the Aircraft Rules from 1 January 2027 (4 Nov 2026)", url: L.bvn },
      { label: "PIB: CPL and ATPL validity increased to 10 years (Oct 2023)", url: L.pibValidity },
      { label: "Pariksha Flight Crew Examination User Manual, Issue IV (Sept 2026): exam fees and papers", url: L.parikshaManual },
      { label: "CAR Section 7 Series C Part I: medical requirements and IAF centre fees", url: L.carMedical },
      { label: "RTR(R) Certificate and Licence Rules 2025: RTR fees", url: L.rtrRules },
      { label: "CAR Section 7 Series G Part VI: RTR exams", url: L.carRtr },
      { label: "DGCA: indicative timelines and fees for eGCA services (Sept 2026)", url: L.egcaTimelines },
      { label: "DGCA: approved Flying Training Organisations (11 Nov 2026)", url: L.ftoList },
      { label: "DGCA: FTO ranking, April 2026", url: L.ftoRanking },
      { label: "DGCA: approved type-rating training organisations", url: L.atoList },
      { label: "CAR Section 7 Series G Part III: English Language Proficiency", url: L.carElp },
      { label: "CAR Section 7 Series G Part I: conversion of foreign licences", url: L.carConversion },
      { label: "DGCA public notice: caution on pilot training abroad (Dec 2025)", url: L.noticeAbroad },
      { label: "Supreme Court of India: pilots' notice period under the DGCA CAR (22 Aug 2019)", url: L.scNotice },
      { label: "Ministry of Civil Aviation: rules", url: L.mocaRules },
    ],
  },

  // ================================================================ medicals
  {
    slug: "medical",
    navLabel: "Medicals",
    title: "DGCA Class 2 and Class 1 medicals",
    h1: ["DGCA medicals: ", "Class 2 and Class 1"],
    metaTitle: "DGCA Class 1 and Class 2 Medical: Step by Step | EARNWINGS",
    metaDescription:
      "How DGCA Class 2 and Class 1 pilot medicals work: who can examine you, booking on eGCA, tests, the CA-35 certificate, validity by age, official fees at IAF centres and appeals.",
    summary:
      "Who needs Class 2 or Class 1, where to get examined, how to book on eGCA, validity by age, official fees and what happens if you are declared unfit.",
    intro:
      "Every pilot licence depends on a valid medical. Class 2 is for student and private pilots; Class 1 is for commercial and airline pilots. Do them before you commit to expensive training. Everything here is from CAR Section 7 Series C Part I (Revision 7, effective 15 November 2025) and DGCA's eGCA manuals.",
    pdf: "/guides/earnwings-medical-guide.pdf",
    sections: [
      {
        id: "which-class",
        title: "Which class do you need?",
        blocks: [
          { t: "figure", id: "medical-compare", alt: "Comparison of Class 2 and Class 1 medicals" },
          {
            t: "table",
            head: ["Class", "Needed for"],
            rows: [
              ["Class 2", "Student Pilot Licence (SPL), Private Pilot Licence (PPL), microlight licence, FRTOL"],
              ["Class 1", "Commercial Pilot Licence (CPL), Airline Transport Pilot Licence (ATPL), PPL with instrument rating privileges"],
            ],
          },
          { t: "p", text: "You need a Class 2 fit certificate (form CA-35) before your Class 1 initial. You do **not** need to wait for DGCA's separate Class 2 *assessment* document before applying for Class 1." },
        ],
      },
      {
        id: "where",
        title: "Where you can be examined",
        blocks: [
          { t: "h3", text: "Class 2 (initial and renewal)" },
          { t: "p", text: "Any DGCA-empanelled Class 2 examiner (a doctor with an MBBS trained in aviation medicine) or any Class 1 examiner. DGCA publishes the [Class 2 examiner list](" + L.class2List + ")." },
          {
            t: "note",
            tone: "warn",
            title: "Check the examiner is current",
            text: "Some entries in the published Class 2 list show approval dates that have already passed. Choose your examiner inside eGCA when you book, and confirm with the clinic that their DGCA empanelment is valid.",
          },
          { t: "h3", text: "Class 1 initial (your first Class 1)" },
          {
            t: "ul",
            items: [
              "One of three Indian Air Force centres: **AFCME New Delhi**, **IAM Bengaluru** or **MEC (East) Jorhat**, or",
              "One of the DGCA-approved civil Aeromedical Evaluation Centres. The [Class 1 list](" + L.class1List + ") updated on 28 October 2026 names 10 hospitals, including centres in Delhi NCR, Mumbai, Chennai, Bengaluru, Hyderabad, Pune and Indore.",
            ],
          },
          { t: "p", text: "Routine Class 1 renewals can be done at an IAF renewal centre or with a DGCA Class 1 examiner (18 IAF centres and 53 examiners on the same list)." },
          { t: "shot", id: "dgca-personnel-medical", alt: "Annotated screenshot of the DGCA Personnel menu with Class 1 and Class 2 Medical Examiner highlighted", caption: "DGCA's examiner and centre lists are under **Personnel > Medical** on dgca.gov.in." },
        ],
      },
      {
        id: "process",
        title: "How to apply on eGCA, step by step",
        blocks: [
          { t: "figure", id: "medical-steps", alt: "Flow of booking a medical on eGCA" },
          { t: "p", text: "The steps below follow DGCA's [Class 2 eGCA manual](" + L.egcaClass2Manual + ") and [Class 1 eGCA manual](" + L.egcaClass1Manual + "). You need an eGCA ID first (see the [eGCA guide](/guide/egca))." },
          { t: "shot", id: "egca-login-services", alt: "Annotated screenshot of the eGCA login page showing the login fields, the User Manual link and the Indicative Timelines link", caption: "The eGCA login page. After your password and the code, eGCA sends a one-time password (OTP) to your registered mobile and email." },
          {
            t: "steps",
            items: [
              { title: "Log in to eGCA and open Medical services", body: "Enter the OTP eGCA sends you (two-step login since 28 July 2025), then choose \"Issuance of Class 2 Medical\" (or Class 1). You must be between 16 and 65." },
              { title: "Pick an examiner and book an appointment", body: "The CAR says booking on eGCA is the first step. For IAF centres you pay the fee through Bharatkosh." },
              { title: "Fill the e-form", body: "Personal details, address, flying details, your last medical and a medical declaration with a photo. An application ID is generated and you receive the list of blood and other tests to do." },
              { title: "Do the tests and upload the reports before the exam" },
              { title: "Attend the examination", body: "Re-validate your form in front of the examiner. For Class 1 you also sign a \"no impersonation\" undertaking." },
              { title: "Get your CA-35 medical certificate", body: "The examiner issues it and it appears in eGCA." },
              { title: "DGCA medical assessment", body: "Where one is required, it is issued after a DGCA officer approves it. Download it from \"Track Status\" in eGCA." },
            ],
          },
          { t: "shot", id: "egca-medical-mock", alt: "Illustration of the eGCA medical application: Medical services, Issuance of Class 2 Medical, booking an appointment, the e-form, test reports and Track Status", caption: "Illustration, not the actual screen: eGCA's medical screens are behind a login, so this drawing shows the order of the steps from DGCA's manuals." },
          { t: "p", text: "DGCA's own step-by-step manuals, with screenshots, are on the [eGCA User Manuals page](" + L.egcaManuals + ")." },
          { t: "shot", id: "egca-manuals-medical", alt: "Annotated screenshot of the eGCA User Manuals list with the Class 1 issuance, Air Force appointment and Class 2 issuance manuals highlighted", caption: "The manuals you need: Class 1 and Class 2 issuance, and booking at an Air Force centre. Click **View** to open each PDF." },
          {
            t: "note",
            tone: "warn",
            title: "Tell the truth on the declaration",
            text: "You declare past exams, illnesses, surgery and medicines. Under the CAR a false declaration is a serious lapse that the examiner must report to DGCA within a week.",
          },
        ],
      },
      {
        id: "fees",
        title: "Fees",
        blocks: [
          {
            t: "table",
            head: ["Where", "Fee", "Source"],
            rows: [
              ["IAF centre, Class 1 (initial or renewal)", "₹5,000", "[CAR para 4.3](" + L.carMedical + ")"],
              ["IAF centre, Class 2 or 3", "₹3,000", "[CAR para 4.3](" + L.carMedical + ")"],
              ["DGCA medical assessment issue", "Nil (indicative 30 days)", "[eGCA timelines](" + L.egcaTimelines + ")"],
              ["Private examiners and civil hospitals", "Set by the examiner or hospital", "No official figure"],
            ],
          },
        ],
      },
      {
        id: "validity",
        title: "How long a medical lasts",
        blocks: [
          { t: "figure", id: "medical-validity", alt: "Chart of medical validity by age" },
          {
            t: "table",
            head: ["Class", "Validity (CAR para 5.1)"],
            rows: [
              ["Class 1", "12 months up to age 60, then 6 months. For single-pilot commercial operations, 6 months from age 40."],
              ["Class 2", "24 months up to age 50, then 12 months."],
            ],
          },
          { t: "p", text: "From 1 September 2025 DGCA issues the formal medical **assessment** document less often for routine renewals, but you are still examined just as often, and the CA-35 lets you use your licence in between ([DGCA public notice, 15 July 2025](" + L.noticeMedical2025 + "))." },
          {
            t: "note",
            tone: "check",
            title: "When to renew",
            text: "The Aircraft Rules say a renewal within 1 month before expiry continues from the old expiry date; the CAR allows renewal from 45 days before. Renewing in the last month before expiry satisfies both.",
          },
        ],
      },
      {
        id: "unfit",
        title: "If you are declared unfit",
        blocks: [
          {
            t: "ul",
            items: [
              "The possible outcomes are Fit, Fit with limitations (for example \"fit to fly as co-pilot only\"), Temporarily unfit, or Permanently unfit.",
              "If you are temporarily unfit for more than 3 months, or permanently unfit, you can appeal to the medical directorate of DGCA within **90 days**, on eGCA, by email or by post.",
              "A re-initial, post-unfit or special medical needs a No Objection Certificate (NOC) on eGCA first ([NOC manual](" + L.egcaNocManual + ")).",
            ],
          },
          {
            t: "note",
            tone: "check",
            title: "No official list of disqualifying conditions",
            text: "The CAR does not publish a list of diseases. It applies the ICAO Annex 1 Chapter 6 standards (general health, vision and colour perception, hearing) and DGCA's medical circulars. If you have a condition you are worried about, such as a vision or colour-vision issue, consult a DGCA-empanelled examiner before you pay for training.",
          },
        ],
      },
    ],
    sources: [
      { label: "CAR Section 7 Series C Part I, Medical requirements (Rev 7)", url: L.carMedical },
      { label: "DGCA: Class 1 centres and examiners (28 Oct 2026)", url: L.class1List },
      { label: "DGCA: Class 2 examiners", url: L.class2List },
      { label: "eGCA manual: Issuance of Class 2 medical", url: L.egcaClass2Manual },
      { label: "eGCA manual: Issuance of Class 1 medical", url: L.egcaClass1Manual },
      { label: "eGCA manual: Medical NOC", url: L.egcaNocManual },
      { label: "DGCA public notice: medical assessment periodicity (15 Jul 2025)", url: L.noticeMedical2025 },
      { label: "DGCA: indicative timelines and fees for eGCA services", url: L.egcaTimelines },
    ],
  },

  // ==================================================================== eGCA
  {
    slug: "egca",
    navLabel: "eGCA and Computer Number",
    title: "eGCA registration and the Computer Number",
    h1: ["eGCA registration and ", "your Computer Number"],
    metaTitle: "eGCA Registration and DGCA Computer Number Guide | EARNWINGS",
    metaDescription:
      "Step by step: register on DGCA's eGCA portal and get your Pariksha Computer Number. What each form asks, documents, photo and signature specs, DigiLocker, fees and common rejection reasons.",
    summary:
      "Your two DGCA IDs, step by step: the eGCA ID and the Pariksha Computer Number, with every document, the photo and signature specs, and DGCA's own rejection reasons.",
    intro:
      "Before you can take a DGCA exam, book a medical or receive a licence, you need two separate IDs on two separate DGCA portals. Students mix them up all the time. This guide walks through both, field by field, using DGCA's own manuals.",
    pdf: "/guides/earnwings-egca-guide.pdf",
    sections: [
      {
        id: "two-portals",
        title: "Two portals, two IDs",
        blocks: [
          { t: "figure", id: "two-portals", alt: "Diagram of the eGCA and Pariksha portals and what each is for" },
          {
            t: "table",
            head: ["Portal", "What you get", "What it is used for"],
            rows: [
              ["[eGCA](" + L.egcaLogin + ")", "eGCA ID", "Medicals, Student Pilot Licence, PPL/CPL/ATPL issue, e-logbook, RTR practical booking and RTR/FRTOL licence"],
              ["[Pariksha](" + L.pariksha + ")", "Computer Number", "All DGCA theory exams, including the RTR written paper"],
            ],
          },
          { t: "p", text: "Both are free. The eGCA ID needs you to be at least 16. The Computer Number is yours for life and you may only ever hold one." },
        ],
      },
      {
        id: "before",
        title: "Before you start: get your documents right",
        blocks: [
          { t: "p", text: "Almost every rejection comes from documents that do not match each other. Before you open either portal:" },
          {
            t: "ul",
            items: [
              "Your **name** must be exactly as on your Class 10 marksheet and certificate (or your passport, if it was issued later). Title, surname, spelling and middle name all count.",
              "Your **date of birth** must match across every document, \"even by a day or in format\". Only the Class 10 certificate or marksheet, or a municipal birth certificate, is accepted as proof. Aadhaar is **not** accepted as date-of-birth proof.",
              "Have both the **marksheet and the pass certificate** for Class 10 and Class 12, unless your board issues a combined \"marksheet cum certificate\".",
              "Link your **Aadhaar to DigiLocker** and check that your Class 10 and 12 records appear there. This can make the Computer Number instant.",
              "Use an email address and mobile number you will keep for years. Pariksha needs an **Indian mobile number**.",
            ],
          },
        ],
      },
      {
        id: "egca-id",
        title: "Part 1: creating your eGCA ID",
        blocks: [
          { t: "p", text: "Based on DGCA's [eGCA Pilot Registration manual](" + L.egcaPilotManual + "). Its screenshots date from 2019 to 2020, so today's screens may look different; the information asked for is the same." },
          { t: "shot", id: "egca-login-signup", alt: "Annotated screenshot of the eGCA login page with the Sign Up tab, the login fields and the LOG IN button highlighted", caption: "The eGCA login page (from dgca.gov.in, click **eGCA Login** at the top right). New students use **Sign Up**." },
          {
            t: "steps",
            items: [
              { title: "Open the eGCA login page and click Sign Up", body: "On [dgca.gov.in](" + L.dgca + ") the **eGCA Login** link is at the top right (on a phone too). Choose user type \"Pilot\". When asked \"Do you have a Medical File Number (PMR No.) allotted by DGCA?\", a new student answers No." },
              {
                title: "Personal details",
                items: [
                  "First, middle and last name; gender; place of birth; nationality",
                  "Father's, mother's or legal guardian's name (at least one is required)",
                  "Date of birth",
                  "Correspondence address (country, building, area, landmark, state, PIN) and permanent address (or tick \"same as correspondence\")",
                ],
              },
              {
                title: "ID proof and uploads",
                items: [
                  "ID proof type and number. Accepted IDs include passport, driving licence, voter ID, PAN card and a few government-issued photo cards (the manual lists them all).",
                  "Upload: ID proof (JPG or PDF), photograph (JPG), signature (JPG), Class 10 marksheet (PDF), permanent address proof (PDF) and correspondence address proof (PDF).",
                ],
              },
              { title: "Password, email and mobile", body: "The manual's password rule is at least 10 characters with a capital letter, a number and a special character, and no spaces. You verify your email and mobile with one-time passwords (OTPs). Use a mobile and email you will keep: since 28 July 2025 eGCA sends an OTP to them **every time you log in**." },
              { title: "Declaration and submit", body: "Tick the declaration that everything is true and correct. For a new student pilot, the eGCA ID is generated in an active state." },
            ],
          },
          { t: "shot", id: "egca-signup-mock", alt: "Illustration of the eGCA Sign Up form: user type Pilot, the PMR number question answered No, the sections of the form and the declaration", caption: "Illustration, not the actual screen: DGCA's server would not show the Sign Up form to our capture tool, so this drawing follows DGCA's registration manual." },
          { t: "shot", id: "dgca-phone", alt: "Annotated phone screenshot of the DGCA home page with the eGCA Login link highlighted at the top right", caption: "On a phone, **eGCA Login** is at the top right of dgca.gov.in." },
          { t: "p", text: "If your name or date of birth needs correcting later, use the \"Amendment of Personal Details\" service on eGCA. The [eGCA manuals page](" + L.egcaManuals + ") lists a separate manual for it." },
          { t: "shot", id: "egca-manuals-pilot", alt: "Annotated screenshot of the eGCA User Manuals list with Process for Pilot Registration highlighted", caption: "DGCA's own sign-up manual is 'Process for Pilot Registration' on the eGCA User Manuals page." },
          {
            t: "note",
            tone: "check",
            title: "Not stated officially",
            text: "The eGCA registration manual gives no photo size in pixels or millimetres and no fee for creating an ID (we found none). DigiLocker is not mentioned for eGCA; it is used on Pariksha.",
          },
        ],
      },
      {
        id: "computer-number",
        title: "Part 2: your Pariksha Computer Number",
        blocks: [
          { t: "figure", id: "form-wireframe", alt: "Wireframe of the Computer Number application form with numbered notes" },
          { t: "p", text: "Based on the Pariksha [Flight Crew Examination User Manual, Issue IV (September 2026)](" + L.parikshaManual + ") and the [Computer Number FAQ](" + L.parikshaFaq + "). The fee is **nil**." },
          { t: "h3", text: "Two ways to get it" },
          {
            t: "table",
            head: ["Mode", "When it applies", "How long"],
            rows: [
              ["Auto generation (DigiLocker)", "Indian national; Aadhaar matches DigiLocker exactly; Class 10 and 12 from Indian boards available in DigiLocker; photo matches your Aadhaar photo (at least 80%) on a white background; signature meets the spec", "Instant on final submit"],
              ["Manual", "Everything else (for example foreign boards, or records not in DigiLocker)", "Within 12 working days if the application is complete"],
            ],
          },
          {
            t: "note",
            tone: "check",
            title: "Two official documents disagree",
            text: "The September 2026 manual describes instant auto generation. An older Pariksha FAQ still says the number is issued only after scrutiny. We follow the newer manual; if DigiLocker cannot fetch your documents, expect the manual route.",
          },
          { t: "h3", text: "Auto mode, step by step" },
          { t: "shot", id: "pariksha-welcome", alt: "Annotated screenshot of the Pariksha welcome page with Click Here To Proceed highlighted", caption: "Pariksha's first page: click **Click Here To Proceed**." },
          { t: "shot", id: "pariksha-register", alt: "Annotated screenshot of the Pariksha login module with the FLIGHT CREW box and its NEW Candidate Registration, OLD Candidate Registration and Candidate Login links highlighted", caption: "Pilots use the blue **FLIGHT CREW** box. The green AME box on the left is for aircraft maintenance engineers." },
          {
            t: "steps",
            items: [
              { title: "On pariksha.dgca.gov.in click \"Click Here To Proceed\", then \"NEW Candidate Registration\" in the blue FLIGHT CREW box", body: "Not the green AME box, which is for aircraft maintenance engineers. If you got a Computer Number before this portal existed, use \"OLD Candidate Registration\" instead." },
              { title: "Read the instructions, tick the box and choose YES for auto generation" },
              { title: "Enter your details and verify by OTP", body: "An email verification link is sent; it is valid for 24 hours. If it expires you must register again." },
              { title: "Click \"Get Document from DigiLocker\"", body: "Enter your Aadhaar number, the captcha, the OTP sent to your Aadhaar-linked mobile and your DigiLocker PIN." },
              { title: "Check the prefilled details and add your address", body: "Your name and details come from your Class 10 marksheet." },
              { title: "Choose your category (for example CPL)", body: "Education details are prefilled from DigiLocker." },
              { title: "Upload the remaining documents", body: "Your photo is checked against your Aadhaar photo." },
              { title: "Review and Final Submit", body: "The Computer Number is generated and emailed to you. Your login ID is the Computer Number with the prefix \"P-\". Until a Computer Number is issued, you log in with your registered email ID instead." },
            ],
          },
          { t: "shot", id: "pariksha-phone", alt: "Annotated phone screenshot of Pariksha with the FLIGHT CREW box highlighted below the AME box", caption: "On a phone the two boxes are stacked: scroll past AME to FLIGHT CREW." },
          { t: "h3", text: "Manual mode: the form fields" },
          {
            t: "ul",
            items: [
              "Registration category (PPL, CPL, ATPL and others), nationality",
              "\"Are you holding a licence issued by Indian or Foreign Authority?\"",
              "Aadhaar number",
              "Your flying training institute and ground training institute",
              "Whether you have an equivalence certificate",
              "Education: board, year, marks, and a Physics and Mathematics pass",
              "After final submit you get a temporary ID (like P-T2026/0001) and a PDF copy by email. You can withdraw (\"self-reject\") before DGCA processes it.",
            ],
          },
          { t: "p", text: "Pariksha's password rule: at least 8 characters with an uppercase letter, a lowercase letter, a digit and a special character (different from eGCA's)." },
        ],
      },
      {
        id: "specs",
        title: "Photo, signature and document specifications",
        blocks: [
          { t: "figure", id: "photo-spec", alt: "Photo, signature and document size specifications" },
          { t: "p", text: "These are Pariksha's official specifications (manual sections 2.2.3 to 2.2.6 and FAQ 29 to 33)." },
          {
            t: "table",
            head: ["Item", "Specification"],
            rows: [
              ["Photo", "Colour, **45 mm high x 35 mm wide**, white background, no border. Face about 35 x 25 mm (around 70% of the photo). Matt finish, not more than 3 months old. **JPG only, maximum 70 KB.** No selfies, face looking straight ahead."],
              ["Signature", "**20 mm high x 45 mm wide**, white background, no border. **JPG only, maximum 20 KB.** Not in all capitals, not faint, smudged or too small."],
              ["Every other document", "**PDF only, maximum 500 KB each.** Clear and readable: not blurred, cropped or distorted."],
            ],
          },
          {
            t: "note",
            tone: "warn",
            title: "Photo, signature and Aadhaar cannot be changed later",
            text: "Once the Computer Number is issued, no change to these is allowed except with approval in exceptional cases. Get them right the first time.",
          },
          { t: "h3", text: "Documents you may be asked for" },
          {
            t: "ul",
            items: [
              "Date of birth proof (Class 10 certificate or marksheet, or a municipal birth certificate; a regional-language birth certificate must also be in Hindi or English)",
              "Class 10 and Class 12 marksheets and pass certificates",
              "Board Verification Certificates (BVC) for Class 10 and 12 in manual mode. **Not needed if your marksheets were fetched from DigiLocker.** A BVC addressed to you personally is not accepted.",
              "Equivalence certificate (foreign or international boards, or diplomas)",
              "Permanent address proof (self-attested): Aadhaar, passport, voter ID or another government address proof",
              "Security clearance (foreign nationals, OCI and PIO)",
            ],
          },
          { t: "p", text: "No hard copies are needed, and you cannot add documents after final submit." },
        ],
      },
      {
        id: "mistakes",
        title: "Common mistakes (from DGCA's own rejection list)",
        blocks: [
          { t: "p", text: "DGCA publishes the [reasons it rejects Computer Number applications](" + L.parikshaRejections + "). In plain words:" },
          { t: "shot", id: "pariksha-manual", alt: "Annotated screenshot of the Pariksha menu bar with USER MANUAL, Flight Crew MANUAL and Reasons For Computer Number Rejection highlighted", caption: "Both documents are in Pariksha's top menu: **Reasons For Computer Number Rejection**, and **USER MANUAL > Flight Crew MANUAL**." },
          {
            t: "ul",
            items: [
              "Photo or signature not as per the specification.",
              "Date of birth does not match a document, comes from a document that is not accepted, or differs between documents.",
              "Your name, or a parent's name, differs between documents or from the form.",
              "Class 10 or 12 marksheet or certificate missing, unreadable or incomplete.",
              "Class 12 not passed in Physics and Mathematics.",
              "BVC missing or incomplete, marks in it do not match, or its online link or credentials do not work.",
              "Board not recognised, or equivalence certificate missing.",
              "Permanent address does not match its proof.",
              "Anything typed in the form that does not match the documents.",
            ],
          },
          { t: "h3", text: "If your application is rejected" },
          {
            t: "ul",
            items: [
              "**Partial rejection** (a non-basic field is wrong): fix it under the same temporary ID. You have 15 days to respond and at most 3 partial rejections before it becomes a complete rejection.",
              "**Complete rejection** (name, parents' names, date of birth, gender, Aadhaar, year of passing, total marks or qualification wrong): apply again from the start with the same email and mobile.",
              "Pariksha helpdesk: help.pariksha.dgca@gov.in, 011-26106091, 09:30 to 18:00 on working days (from the official FAQ).",
            ],
          },
        ],
      },
    ],
    sources: [
      { label: "eGCA login and sign-up", url: L.egcaLogin },
      { label: "eGCA user manuals (index)", url: L.egcaManuals },
      { label: "eGCA manual: Pilot registration process", url: L.egcaPilotManual },
      { label: "Pariksha portal", url: L.pariksha },
      { label: "Pariksha Flight Crew Examination User Manual, Issue IV (Sept 2026)", url: L.parikshaManual },
      { label: "Pariksha: Computer Number FAQ", url: L.parikshaFaq },
      { label: "Pariksha: reasons for Computer Number rejection", url: L.parikshaRejections },
      { label: "DGCA: indicative timelines and fees for eGCA services", url: L.egcaTimelines },
      { label: "DigiLocker", url: L.digilocker },
    ],
  },

  // ================================================================ pariksha
  {
    slug: "pariksha",
    navLabel: "DGCA exams (Pariksha)",
    title: "DGCA online exams on Pariksha",
    h1: ["DGCA exams on Pariksha: ", "how they work"],
    metaTitle: "DGCA Pariksha Exams: Apply, Subjects, Results | EARNWINGS",
    metaDescription:
      "How DGCA's Pariksha online exams work: sessions and calendar, applying and paying, CPL and ATPL subjects, admit card, exam-day rules, results, how long passes last and retakes.",
    summary:
      "Sessions, applying and paying, CPL and ATPL subjects, admit card, exam-day rules, results, how long a pass counts and when you can retake.",
    intro:
      "DGCA's theory exams are online and run by its Central Examination Organisation through the Pariksha portal. This guide explains the cycle from application to result, using the Pariksha manual (September 2026), DGCA's exam-day instructions and the Aircraft Rules.",
    pdf: "/guides/earnwings-pariksha-guide.pdf",
    sections: [
      {
        id: "sessions",
        title: "Exam sessions and the 2026 calendar",
        blocks: [
          {
            t: "ul",
            items: [
              "**Regular sessions**: four a year (quarterly).",
              "**On-demand sessions (OLODE)**: eight a year, roughly monthly, for flight crew papers, at a higher fee.",
              "The [2026 programme](" + L.parikshaCalendar + ") lists regular sessions on 10 to 14 March, 16 to 20 June, 22 to 26 September and **15 to 19 December 2026**, and on-demand sessions including **18 to 20 November 2026**.",
              "DGCA says the dates are tentative. Always check the notice board on [Pariksha](" + L.pariksha + ").",
              "The application windows open right now are shown in a line at the top of Pariksha's login page. Free seats in on-demand sessions are listed under **Examinations > FC OLODE Available Seats**.",
            ],
          },
          { t: "shot", id: "pariksha-exams-menu", alt: "Annotated screenshot of the Pariksha Examinations menu with Exam Calendar 2026, Syllabus and FC OLODE Available Seats highlighted", caption: "Pariksha's **Examinations** menu: the 2026 calendar, the syllabus and on-demand (OLODE) seat availability." },
          { t: "shot", id: "dgca-personnel-exams", alt: "Annotated screenshot of the DGCA Personnel menu with DGCA examination portal, Tentative Schedule of Examination and Result highlighted", caption: "dgca.gov.in also links to the exams under **Personnel > Examination**: the portal, the tentative schedule and results." },
        ],
      },
      {
        id: "apply",
        title: "How to apply and pay",
        blocks: [
          { t: "figure", id: "pariksha-flow", alt: "Flow of one exam session from application to result" },
          { t: "p", text: "You need a Computer Number first (see the [eGCA guide](/guide/egca)). Then, following section 7.3 of the [Pariksha manual](" + L.parikshaManual + "):" },
          { t: "shot", id: "pariksha-home-notices", alt: "Annotated screenshot of the Pariksha login module showing the open-window dates, Candidate Login, the Pilot notice board and the Examinations menu", caption: "Pariksha after 'Click Here To Proceed': open windows at the top, **Candidate Login** in the FLIGHT CREW box, and the pilot notice board." },
          { t: "shot", id: "pariksha-login", alt: "Annotated screenshot of the Pariksha candidate login form with the Computer Number, password, captcha and Login button highlighted", caption: "The candidate login form. The email ID works only until your Computer Number is issued." },
          {
            t: "steps",
            items: [
              { title: "Log in", body: "Click \"Candidate Login\" in the FLIGHT CREW box, then enter your Computer Number, your Pariksha password and the captcha." },
              { title: "Open Examination and choose the form", body: "\"Pilot Online examination Application Form\" for a regular session, or \"On Demand FC Examination Form\" for OLODE." },
              { title: "Select the open session and your category" },
              { title: "Pick two exam centre choices", body: "DGCA tries to give you your first choice." },
              { title: "Select your papers and slot" },
              { title: "Review, accept the declaration and click Proceed To Payment" },
              { title: "Pay on Bharatkosh", body: "UPI, net banking or card, by 23:00 on the closing date. After a failed payment wait at least an hour before trying again. Keep your payment reference." },
            ],
          },
          { t: "shot", id: "pariksha-apply-mock", alt: "Illustration of the Pariksha application: the Examination menu forms, session and category, two exam centres, papers and slot, and Proceed To Payment", caption: "Illustration, not the actual screen: the application form is behind your login, so this drawing follows section 7.3 of the Pariksha manual." },
          {
            t: "ul",
            items: [
              "Only one application per session, and no changes after submission.",
              "Before you sit CPL papers, update your Pariksha category from PPL to CPL (automatic with DigiLocker, otherwise up to 12 working days).",
              "For technical papers on aircraft over 5,700 kg you must upload a ground-training certificate from a DGCA-approved organisation before applying.",
            ],
          },
        ],
      },
      {
        id: "fees",
        title: "Fees",
        blocks: [
          {
            t: "table",
            head: ["Exam", "Fee per paper"],
            rows: [
              ["Regular session", "₹2,500"],
              ["On-demand session (OLODE)", "₹5,000"],
              ["RTR(R) written, regular or on-demand", "₹2,000"],
              ["ATPL oral (2nd and 3rd attempt)", "₹500"],
            ],
          },
          { t: "p", text: "Fees are non-refundable and cannot be adjusted, even if you are absent. A refund is given only when Bharatkosh shows a successful payment but the service was not delivered (Examination, then Refund of Failed Transactions; processed within 90 days)." },
        ],
      },
      {
        id: "subjects",
        title: "Subjects for CPL and ATPL",
        blocks: [
          { t: "figure", id: "subject-map", alt: "Map of the CPL papers" },
          { t: "p", text: "The Aircraft Rules (Schedule II, Section J) list the CPL written subjects as Air Regulations, Air Navigation, Meteorology, and Aircraft and Engines, plus a signals test; the Bharatiya Vayuyan Niyam, 2026, which replace them from 1 January 2027, list the same subjects. In Pariksha these appear as five separate CPL papers, plus the RTR written paper:" },
          {
            t: "table",
            head: ["Paper", "What it covers, broadly"],
            rows: [
              ["Air Regulations", "Indian and international aviation law, rules of the air, licensing, airspace"],
              ["Air Navigation", "Maps and charts, navigation calculations, instruments, radio navigation aids"],
              ["Aviation Meteorology", "The atmosphere, weather systems, clouds, reports and forecasts (METAR, TAF)"],
              ["Technical General", "Principles of flight, engines and aircraft systems in general"],
              ["Technical Specific", "The particular aircraft type you train on"],
              ["RTR(R) written", "Radio procedures and principles (see the [RTR guide](/guide/rtr))"],
            ],
          },
          {
            t: "ul",
            items: [
              "**ATPL** has written and oral exams in Air Regulations, Air Navigation, Avionics (radio aids and instruments), Aviation Meteorology, and Aircraft and Engines. A current CPL holder is exempt from Air Regulations.",
              "**Instrument Rating** has written and oral exams in Air Regulations, Air Navigation, Meteorology and Instrument Rating.",
              "For the official syllabus, Pariksha points to the latest [CAR Section 7, Series B](" + L.carSyllabus + ").",
            ],
          },
          {
            t: "note",
            tone: "check",
            title: "Not verified: number of questions, duration, negative marking",
            text: "These are set in CAR Section 7 Series B Part I, whose file was empty on DGCA's server when we checked (17 November 2026). A 70% pass mark is widely quoted and appears in the manual's sample screens, but we could not confirm it in the CAR text for CPL papers. Check the [CAR](" + L.carExams + ") or the notice board on Pariksha before your exam.",
          },
        ],
      },
      {
        id: "admit-card",
        title: "Admit card",
        blocks: [
          { t: "p", text: "Download it from Pariksha **three days before** the exam. It shows your date, time and centre. Print it, preferably in colour ([exam instructions](" + L.parikshaInstructions + ")). DGCA announces it on the pilot notice board as \"Download of Admit Cards for the Candidates of FC, AME and RTR (Restricted) ...\", next to the venue list and that session's instructions." },
          { t: "shot", id: "pariksha-notice-board", alt: "Annotated screenshot of the Pariksha pilot notice board with the venue list, admit card, instructions and result notices highlighted", caption: "The pilot notice board (**NOTICE BOARD-PILOT** on the login page opens the full list): venues, admit cards, instructions and results, newest first." },
        ],
      },
      {
        id: "exam-day",
        title: "Exam day",
        blocks: [
          { t: "figure", id: "exam-day", alt: "Timeline of exam day" },
          { t: "p", text: "From DGCA's instructions for the November 2026 on-demand session. Instructions are reissued each session, so read the latest one on Pariksha." },
          {
            t: "ul",
            items: [
              "Entry opens **60 minutes** before the start and **closes 30 minutes** before. You will not be let in late.",
              "Bring your admit card and **one original photo ID**: passport, Aadhaar, voter ID, BCAS airport entry card, defence ID, ration card with photo, a 10th or 12th or degree certificate with a printed photo, or a government health card with photo.",
              "**Not allowed**, even switched off: mobile phones, smart devices, recording devices, **any wristwatch or wrist band**, and calculators other than those permitted below. You may be frisked and DGCA will not store your belongings.",
              "**Allowed** for Air Navigation and composite papers: a navigation computer and a scientific calculator **without multiple memory**. You may not share them.",
              "One toilet break, after the first hour and not in the last 30 minutes.",
              "Sign the attendance sheet before you leave, or your exam may be cancelled.",
              "Report a faulty question on Annexure 3, available from the invigilator.",
              "Using unfair means can lead to expulsion, disqualification in all subjects and a ban of up to 5 years or for life.",
            ],
          },
        ],
      },
      {
        id: "results",
        title: "Results, how long a pass counts, and retakes",
        blocks: [
          {
            t: "ul",
            items: [
              "Results are announced on the Pariksha pilot notice board as \"Declaration of FC Result for ...\" (see the notice board picture above), and your exam history appears when you log in. dgca.gov.in also has a **Result** link under Personnel > Examination.",
              "**How long a pass counts:** for CPL and ATPL, your papers must have been passed within **5 years** before you apply for the licence. For other licences the period is 2.5 years (Aircraft Rules, Schedule II, Section A, para 7; the same in Section A, para 8 of the Bharatiya Vayuyan Niyam, 2026 from 1 January 2027).",
              "**Retakes:** after failing a paper you cannot sit it again for **6 weeks** from the exam date (or a shorter period if the Director General specifies one). With roughly monthly on-demand sessions, you rarely wait long after that.",
            ],
          },
          {
            t: "note",
            tone: "check",
            title: "No official attempt limit found",
            text: "We found no official cap on the number of attempts for CPL theory papers, so we do not state one. ATPL orals have paid second and third attempts.",
          },
        ],
      },
    ],
    sources: [
      { label: "Pariksha portal and notice board", url: L.pariksha },
      { label: "Pariksha Flight Crew Examination User Manual, Issue IV (Sept 2026)", url: L.parikshaManual },
      { label: "Programme of examinations 2026", url: L.parikshaCalendar },
      { label: "Exam-day instructions, OLODE session 08 of 2026", url: L.parikshaInstructions },
      { label: "Pariksha syllabus note", url: L.parikshaSyllabus },
      { label: "CAR Section 7 Series B Part I (exam rules)", url: L.carExams, note: "File was empty on DGCA's server on 17 Nov 2026" },
      { label: "CAR Section 7 Series B Part IV (CPL and IR syllabus)", url: L.carSyllabus },
      { label: "Bharatkosh (fee payment)", url: L.bharatkosh },
    ],
  },

  // ===================================================================== RTR
  {
    slug: "rtr",
    navLabel: "RTR licence",
    title: "The RTR(R) radio licence",
    h1: ["The RTR radio licence, ", "now with DGCA"],
    metaTitle: "RTR(A) / RTR(R) Licence by DGCA: Exam and Fees | EARNWINGS",
    metaDescription:
      "The RTR (Restricted) radio licence for pilots, now issued by DGCA instead of WPC: eligibility, the written and practical exams, fees, validity and what happens to WPC-issued RTRs.",
    summary:
      "Why pilots need it, the move from WPC to DGCA, eligibility, the written and practical exams, fees and validity.",
    intro:
      "To talk to air traffic control on an aircraft radio you need a Radio Telephone Operator (Restricted) certificate and licence, shortened to **RTR** in DGCA's CAR. Many schools still call it **RTR(A)**, the name of the aeronautical radiotelephony licence WPC used to issue; for a pilot it is the same licence. Since 1 December 2025 it is run by DGCA under the RTR Rules 2025, not by WPC.",
    pdf: "/guides/earnwings-rtr-guide.pdf",
    sections: [
      {
        id: "what",
        title: "What it is and why you need it",
        blocks: [
          { t: "p", text: "Nobody may operate an aircraft radio on aeronautical frequencies without a valid RTR(R) certificate and licence (Rule 3 of the [RTR Rules 2025](" + L.rtrRules + ")). A CPL and an ATPL both require a current Flight Radio Telephone Operator's Licence (FRTOL), which DGCA issues on eGCA on the basis of your RTR." },
        ],
      },
      {
        id: "dgca",
        title: "From WPC to DGCA",
        blocks: [
          {
            t: "ul",
            items: [
              "The **Radio Telephone Operator (Restricted) Certificate and Licence Rules, 2025** were notified by the Ministry of Civil Aviation on 25 June 2025 (G.S.R. 413(E)).",
              "DGCA's [CAR Section 7 Series G Part VI](" + L.carRtr + ") took effect on **1 December 2025**.",
              "DGCA started practical exams from 1 January 2026 and licence issue from 28 February 2026, with practical exam centres at DGCA headquarters in New Delhi and, from 1 July 2026, DGCA Chennai.",
              "**Already hold a WPC RTR?** DGCA's [public notice of 6 July 2026](" + L.noticeRtrWpc + ") says RTR certificates or licences issued or renewed by WPC **up to 15 July 2026** are accepted. Licences issued under the old 1954 rules remain valid.",
              "**From 1 January 2027** the RTR Rules 2025 are repealed and replaced by rules 105 to 111 of the Bharatiya Vayuyan Niyam, 2026, with savings for existing licences ([PIB, 4 November 2026](" + L.bvn + ")). The eligibility, the two exams, the fees (₹2,000, ₹500 and ₹5,000) and validity to age 80 are the same in the new text.",
            ],
          },
          { t: "shot", id: "dgca-regulations", alt: "Annotated screenshot of the DGCA Regulations and Guidance menu with the RTR Rules 2025, Civil Aviation Requirements and Public Notices highlighted", caption: "The RTR Rules 2025 are listed under **Regulations and Guidance > Rules** on dgca.gov.in; the RTR CAR is under Civil Aviation Requirements and DGCA's notices under Public Notices." },
        ],
      },
      {
        id: "eligibility",
        title: "Who can apply",
        blocks: [
          {
            t: "ul",
            items: [
              "At least **16 years** old on the date of application.",
              "Passed **Class 10** or equivalent.",
              "A Pariksha **Computer Number** for the written exam (see the [eGCA guide](/guide/egca)).",
              "Non-citizens need security clearance.",
            ],
          },
          { t: "p", text: "The CAR recommends about 48 hours of training at an RTR training organisation, but does not make training compulsory." },
        ],
      },
      {
        id: "exams",
        title: "The two exams",
        blocks: [
          { t: "figure", id: "rtr-process", alt: "Process from Computer Number to RTR licence" },
          {
            t: "table",
            head: ["", "Part 1: written", "Part 2: practical"],
            rows: [
              ["Where", "Pariksha, at an exam centre", "Booked on eGCA; held at DGCA New Delhi or Chennai"],
              ["Format", "50 multiple-choice questions, online, in English", "About 30 minutes: 6 simulated scenarios of about 5 minutes (pre-flight, clearance, flight phases, emergencies), with an aerodrome layout, chart, METAR and NOTAMs on screen"],
              ["Syllabus", "Regulations and procedures, radio principles and practice, radio telephony", "Live radio telephony"],
              ["Pass mark", "70%", "50%"],
              ["Fee", "₹2,000", "₹500 (paid on eGCA via Bharatkosh)"],
              ["Valid for", "A pass counts for 3 years", "Must be passed within 3 years of the written"],
            ],
          },
          {
            t: "ul",
            items: [
              "You get **3 attempts** at the practical. After 3 failures you must pass the written again.",
              "After a failed exam, wait **6 weeks** before retaking.",
              "Practical slots cannot be rescheduled, fees are not refunded, and **being absent counts as an attempt**. The admit card appears on eGCA 3 days before ([practical exam notice](" + L.noticeRtrPractical + ")).",
              "Exemptions from the written exam exist for armed forces and Coast Guard pilots with 1,000 hours, holders of a valid RTR under the 1954 rules, and holders of a valid FRTOL from a Commonwealth country or the Philippines (apply on eGCA).",
            ],
          },
          { t: "shot", id: "pariksha-notice-board", alt: "Annotated screenshot of the Pariksha pilot notice board with the venue list, admit card, instructions and result notices highlighted", caption: "The written paper runs in the normal Pariksha sessions: its admit cards and instructions are posted on the pilot notice board with the flight crew ones ('FC, AME and RTR (Restricted)')." },
        ],
      },
      {
        id: "licence",
        title: "Getting the licence, fees and validity",
        blocks: [
          {
            t: "table",
            head: ["Item", "Official fee"],
            rows: [
              ["RTR(R) licence issue (after passing the practical, on eGCA)", "₹5,000"],
              ["Duplicate", "₹500"],
              ["Appeal", "₹1,000"],
            ],
          },
          { t: "p", text: "The licence is valid **until you turn 80**, unless suspended or cancelled, and can then be extended year by year. The FRTOL on eGCA has its own fees (issue ₹5,000, renewal ₹2,500 per DGCA's [eGCA timelines](" + L.egcaTimelines + ")) and follows your medical validity." },
          {
            t: "note",
            tone: "check",
            title: "Check how RTR and FRTOL fit together for you",
            text: "Exactly when a student applies for the FRTOL after the RTR depends on your licence stage. Read the eGCA manual \"Issuance of FRTOL\" on the [eGCA manuals page](" + L.egcaManuals + ").",
          },
          { t: "shot", id: "egca-login-services", alt: "Annotated screenshot of the eGCA login page showing the login fields, the User Manual link and the Indicative Timelines link", caption: "The practical booking and the licence application are on eGCA. Its **User Manual** link lists the FRTOL manuals, and **Indicative Timelines** lists the fees." },
        ],
      },
    ],
    sources: [
      { label: "RTR(R) Certificate and Licence Rules 2025 (Gazette G.S.R. 413(E))", url: L.rtrRules },
      { label: "PIB: Bharatiya Vayuyan Niyam, 2026 replace the RTR Rules 2025 from 1 January 2027", url: L.bvn },
      { label: "CAR Section 7 Series G Part VI (RTR)", url: L.carRtr },
      { label: "DGCA public notice: acceptance of WPC-issued RTRs (6 Jul 2026)", url: L.noticeRtrWpc },
      { label: "DGCA public notice: conduct of RTR practical exams", url: L.noticeRtrPractical },
      { label: "Pariksha portal (written exam)", url: L.pariksha },
      { label: "eGCA (practical booking and licence)", url: L.egcaLogin },
      { label: "Department of Telecommunications (WPC, the former issuer)", url: L.dot },
    ],
  },

  // ================================================================ glossary
  {
    slug: "glossary",
    navLabel: "Beginner glossary",
    title: "Aviation glossary for beginners",
    h1: ["The beginner's ", "aviation glossary"],
    metaTitle: "Aviation Glossary for Beginners: DGCA Terms | EARNWINGS",
    metaDescription:
      "Plain-English meanings of the words you meet on the way to becoming a pilot in India: DGCA, eGCA, Pariksha, Computer Number, CA-35, FTO, SPL, PPL, CPL, ATPL, FRTOL, ELP, PIC and more.",
    summary:
      "The words you will meet on day one, from DGCA and eGCA to PIC, METAR and type rating, explained in one or two lines each.",
    intro:
      "The pilot world runs on abbreviations. These are the ones you will meet first, on forms, at flying schools and in the guides on this site. For the deeper ground-school vocabulary, see the full [aviation glossary](/aviation-glossary).",
    pdf: "/guides/earnwings-glossary-guide.pdf",
    sections: [
      {
        id: "authorities",
        title: "Authorities and portals",
        blocks: [
          {
            t: "terms",
            items: [
              { term: "DGCA", full: "Directorate General of Civil Aviation", def: "India's aviation safety regulator. It issues pilot licences, approves flying schools and conducts the pilot exams." },
              { term: "MoCA", full: "Ministry of Civil Aviation", def: "The government ministry that makes aviation rules, such as the RTR Rules 2025." },
              { term: "eGCA", full: "e-Governance of Civil Aviation", def: "DGCA's online portal for your pilot ID, medicals, licences, logbook and RTR licence." },
              { term: "Pariksha", def: "DGCA's online exam portal. You get your Computer Number and apply for theory exams here." },
              { term: "CEO", full: "Central Examination Organisation", def: "The DGCA office in New Delhi that runs the pilot theory exams." },
              { term: "Computer Number", def: "Your lifelong exam ID on Pariksha. You need it before you can sit any DGCA exam." },
              { term: "CAR", full: "Civil Aviation Requirements", def: "DGCA's detailed rules. Section 7 covers flight crew licensing, training and medicals." },
              { term: "Aircraft Rules, 1937", def: "India's main aviation rules until 31 December 2026. Schedule II sets out the requirements for each pilot licence." },
              { term: "Bharatiya Vayuyan Niyam, 2026", def: "The rules that replace the Aircraft Rules, 1937 and the RTR Rules 2025 from 1 January 2027. Their First Schedule covers pilot licences." },
              { term: "WPC", full: "Wireless Planning and Coordination wing", def: "Part of the Department of Telecommunications. It issued RTR licences until DGCA took over in December 2025." },
              { term: "ICAO", full: "International Civil Aviation Organization", def: "The UN agency that sets the worldwide standards which India's rules follow." },
              { term: "Bharatkosh", def: "The government's online payment site, used to pay DGCA exam and licence fees." },
              { term: "DigiLocker", def: "The government's digital document wallet. Pariksha can fetch your marksheets from it, which can make your Computer Number instant." },
            ],
          },
        ],
      },
      {
        id: "licences",
        title: "Licences and ratings",
        blocks: [
          {
            t: "terms",
            items: [
              { term: "SPL", full: "Student Pilot Licence", def: "Your first licence, issued through your flying school. It lets you fly solo under an instructor's supervision." },
              { term: "PPL", full: "Private Pilot Licence", def: "Lets you fly for pleasure, not for pay. Needs at least 40 flying hours." },
              { term: "CPL", full: "Commercial Pilot Licence", def: "Lets you fly for pay. Needs at least 200 flying hours and a Class 1 medical." },
              { term: "ATPL", full: "Airline Transport Pilot Licence", def: "The highest licence, needed to command an airliner. Needs at least 1,500 hours." },
              { term: "IR", full: "Instrument Rating", def: "Lets you fly in cloud and poor visibility using instruments only." },
              { term: "ME", full: "Multi-engine", def: "Training and an endorsement to fly aircraft with more than one engine." },
              { term: "Type rating", def: "Training and a qualification to fly one specific aircraft type, such as the A320 or B737." },
              { term: "RTR(R)", full: "Radio Telephone Operator (Restricted)", def: "The radio certificate and licence you need to talk to air traffic control. DGCA's CAR shortens it to RTR; many schools still say RTR(A), the older WPC-era name for the aeronautical licence." },
              { term: "FRTOL", full: "Flight Radio Telephone Operator's Licence", def: "The radio licence on eGCA that a CPL and ATPL require, issued on the basis of your RTR." },
              { term: "ELP", full: "English Language Proficiency", def: "A test of aviation English. Pilots need at least ICAO Level 4." },
              { term: "FIR / AFIR", full: "Flight Instructor Rating / Assistant Flight Instructor Rating", def: "Ratings that let a pilot teach flying." },
            ],
          },
        ],
      },
      {
        id: "medical-terms",
        title: "Medical terms",
        blocks: [
          {
            t: "terms",
            items: [
              { term: "Class 1 medical", def: "The stricter medical, needed for CPL and ATPL. Valid for 12 months up to age 60." },
              { term: "Class 2 medical", def: "The medical for SPL and PPL. Valid for 24 months up to age 50." },
              { term: "CA-35", def: "The medical certificate the examiner issues after a fit medical. It appears in eGCA." },
              { term: "Medical assessment", def: "DGCA's formal approval of your medical, issued after an officer reviews it." },
              { term: "AFCME / IAM / MEC (East)", def: "The three Indian Air Force centres in New Delhi, Bengaluru and Jorhat that can do a first Class 1 medical." },
              { term: "Empanelled examiner", def: "A doctor approved by DGCA to carry out pilot medicals." },
              { term: "NOC", full: "No Objection Certificate", def: "A DGCA clearance needed before some medicals, such as after being declared temporarily unfit." },
            ],
          },
        ],
      },
      {
        id: "training-terms",
        title: "Training and flying",
        blocks: [
          {
            t: "terms",
            items: [
              { term: "FTO", full: "Flying Training Organisation", def: "A DGCA-approved flying school." },
              { term: "ATO", full: "Approved Training Organisation", def: "An organisation approved to give specific training, such as type ratings." },
              { term: "CFI", full: "Chief Flight Instructor", def: "The senior instructor responsible for training at a flying school." },
              { term: "PIC", full: "Pilot in command", def: "The pilot responsible for the flight. CPL rules count PIC hours separately." },
              { term: "Solo", def: "Flying alone, with no instructor on board." },
              { term: "Cross-country", def: "A flight from one aerodrome to another, as opposed to circuits around one airfield." },
              { term: "Circuit", def: "A rectangular pattern flown around an airfield to practise take-offs and landings." },
              { term: "Skill test / check ride", def: "A practical flying test with an examiner." },
              { term: "Logbook", def: "Your record of every flight. DGCA uses an e-logbook on eGCA." },
              { term: "Simulator", def: "A ground-based training device that reproduces a cockpit. Some hours can count towards licences." },
              { term: "Hour building", def: "Flying to reach the hours a licence requires." },
              { term: "Cadet programme", def: "An airline-linked training scheme that selects and trains future pilots, usually self-funded." },
              { term: "Line training", def: "Supervised airline flights on real routes after a type rating." },
              { term: "First officer", def: "The co-pilot, usually in the right-hand seat." },
              { term: "MTOW", full: "Maximum take-off weight", def: "The heaviest an aircraft may weigh at take-off. Exam rules differ for aircraft above 5,700 kg." },
            ],
          },
        ],
      },
      {
        id: "exam-terms",
        title: "Exam terms",
        blocks: [
          {
            t: "terms",
            items: [
              { term: "Regular session", def: "One of DGCA's four exam sessions a year." },
              { term: "OLODE", full: "Online On-Demand Examination", def: "A roughly monthly exam session at a higher fee." },
              { term: "Admit card", def: "Your exam entry pass, downloaded from Pariksha three days before the exam." },
              { term: "BVC", full: "Board Verification Certificate", def: "A letter from your school board confirming your marks, needed if your marksheets are not fetched from DigiLocker." },
              { term: "Technical General / Technical Specific", def: "Exam papers on aircraft and engines in general, and on the type you fly." },
              { term: "Composite paper", def: "A combined paper (for example Air Navigation and Meteorology) taken when converting a foreign licence." },
            ],
          },
        ],
      },
      {
        id: "everyday",
        title: "Words you will hear every day",
        blocks: [
          {
            t: "terms",
            items: [
              { term: "ATC", full: "Air traffic control", def: "The controllers who keep aircraft safely separated and give clearances." },
              { term: "VFR", full: "Visual flight rules", def: "Flying by looking outside, in good weather." },
              { term: "IFR", full: "Instrument flight rules", def: "Flying by instruments, under ATC control, in any weather you are qualified for." },
              { term: "METAR", def: "A coded report of the current weather at an airport." },
              { term: "TAF", def: "A coded weather forecast for an airport." },
              { term: "NOTAM", full: "Notice to Air Missions", def: "A notice about something temporary that affects flights, such as a closed runway." },
              { term: "AIP", full: "Aeronautical Information Publication", def: "The official book of a country's airports, airspace and procedures. In India it is published by AAI." },
              { term: "QNH", def: "The pressure setting that makes your altimeter show height above sea level." },
              { term: "Squawk", def: "A four-digit code set on the transponder so ATC can identify you on radar." },
              { term: "Mayday / Pan-pan", def: "The spoken distress and urgency calls on the radio." },
            ],
          },
          { t: "figure", id: "runway", alt: "Labelled runway diagram" },
          { t: "figure", id: "atc-units", alt: "ATC units in order on a departure" },
          { t: "figure", id: "metar", alt: "A METAR decoded part by part" },
        ],
      },
    ],
    sources: [
      { label: "DGCA", url: L.dgca },
      { label: "Pariksha portal", url: L.pariksha },
      { label: "eGCA", url: L.egcaLogin },
      { label: "Ministry of Civil Aviation", url: L.moca },
    ],
  },
];

/** The canonical on-site path of a guide ("/guide/<slug>" unless it has a top-level URL). */
export const guidePath = (slug) => guideHref(slug);
