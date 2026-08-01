// Single source of truth for /aviation-glossary, imported by BOTH the React page
// AND scripts/gen-routes.mjs, so the crawlable shell carries the same text the
// page renders. Plain .js so Node can import it.
//
// WHY: student pilots search terms one at a time — "FTO full form", "what is
// METAR", "difference between QNH and QFE", "what is an ATS airway". Each entry
// is a long-tail entry point, and together they tell Google what this site is
// about far more precisely than marketing copy can.
//
// TRUTHFULNESS: definitions explain what a term MEANS. They deliberately avoid
// regulatory specifics that change or that we cannot verify — exam fees, pass
// marks, validity periods, medical intervals. If a number would need checking
// against a current CAR before publishing, it is not in here.

export const GLOSSARY_H1 = ["Aviation & DGCA ", "glossary"];
export const GLOSSARY_INTRO =
  "The words that get thrown at you on day one of ground school, explained in plain English — licences, navigation, weather, airspace and radio telephony. Every one of them appears somewhere inside EARNWINGS.";

export const GLOSSARY_CATEGORIES = [
  "Licences & exams",
  "Training & FTO",
  "Navigation",
  "Weather",
  "Airspace & ATC",
  "Aircraft & performance",
  "Radio telephony",
  "Documents & currency",
];

/** @type {{term:string, full?:string, category:string, def:string}[]} */
export const GLOSSARY = [
  // ── Licences & exams ─────────────────────────────────────────────────────
  {
    term: "DGCA",
    full: "Directorate General of Civil Aviation",
    category: "Licences & exams",
    def: "India's civil aviation regulator. It sets the syllabus, conducts the ground examinations and issues pilot licences. EARNWINGS follows its syllabus and exam pattern but is an independent study platform, not affiliated with or approved by the DGCA.",
  },
  {
    term: "CPL",
    full: "Commercial Pilot Licence",
    category: "Licences & exams",
    def: "The licence that allows you to be paid to fly. Earning it means clearing the DGCA ground subjects, meeting the required flying hours and passing the skill test — the goal most Indian student pilots are working towards.",
  },
  {
    term: "ATPL",
    full: "Airline Transport Pilot Licence",
    category: "Licences & exams",
    def: "The highest level of pilot licence, required to act as pilot-in-command of a scheduled airliner. The ground subjects go deeper than CPL, and many pilots clear the ATPL papers while flying as a First Officer.",
  },
  {
    term: "PPL",
    full: "Private Pilot Licence",
    category: "Licences & exams",
    def: "A licence to fly privately, not for hire or reward. Usually the first licence a student earns, and a stepping stone to the CPL.",
  },
  {
    term: "RTR (A)",
    full: "Radio Telephony Restricted (Aeronautical)",
    category: "Licences & exams",
    def: "The licence that permits you to operate an aircraft radio, examined separately from the flying licence. It has a written/oral component on regulations and equipment, and a practical component on standard phraseology.",
  },
  {
    term: "Computer Number",
    category: "Licences & exams",
    def: "The unique candidate number the DGCA issues to a student pilot. You need it before you can register for the ground examinations, and it follows you through your licensing.",
  },
  {
    term: "Class 1 Medical",
    category: "Licences & exams",
    def: "The medical fitness assessment required for a commercial licence, carried out by a DGCA-authorised medical examiner. A Class 2 medical is the lower standard used for private flying.",
  },
  {
    term: "Skill Test",
    category: "Licences & exams",
    def: "The practical flight test with an examiner that you must pass for a licence or rating to be issued. Often called a checkride.",
  },

  // ── Training & FTO ────────────────────────────────────────────────────────
  {
    term: "FTO",
    full: "Flying Training Organisation",
    category: "Training & FTO",
    def: "A DGCA-approved flying school where you do your actual flying training — aircraft, instructors, and the operational side of becoming a pilot. Ground classes may run alongside your flying slots, which is exactly the gap a self-paced app fills.",
  },
  {
    term: "Ground school",
    category: "Training & FTO",
    def: "The theory half of pilot training: the subjects you must clear in the DGCA examinations before a licence is issued. Also called ground classes.",
  },
  {
    term: "CGI",
    full: "Chief Ground Instructor",
    category: "Training & FTO",
    def: "The instructor responsible for the ground-training syllabus at an FTO — the person who owns what is taught on the theory side and to what standard.",
  },
  {
    term: "CFI",
    full: "Chief Flight Instructor",
    category: "Training & FTO",
    def: "The instructor responsible for flying training at an FTO, including standards, checks and student progress in the air.",
  },
  {
    term: "First solo",
    category: "Training & FTO",
    def: "The first time you fly an aircraft alone, without an instructor on board. A milestone every pilot remembers, and usually the moment training stops feeling theoretical.",
  },
  {
    term: "Cross-country",
    category: "Training & FTO",
    def: "A flight between two aerodromes beyond the local training area, requiring real navigation and flight planning rather than circuits.",
  },
  {
    term: "Circuit",
    category: "Training & FTO",
    def: "The standard rectangular pattern flown around an aerodrome for takeoffs and landings, with defined legs: upwind, crosswind, downwind, base and final.",
  },
  {
    term: "Night rating",
    category: "Training & FTO",
    def: "The training and privilege that allows you to fly at night, with its own requirements for instrument flying and night landings.",
  },
  {
    term: "Instrument rating",
    category: "Training & FTO",
    def: "The rating that lets you fly by sole reference to instruments in cloud or poor visibility, under Instrument Flight Rules.",
  },
  {
    term: "Type rating",
    category: "Training & FTO",
    def: "The training and licence endorsement required to fly a specific aircraft type, such as an A320 or B737. Usually the last step before an airline job.",
  },
  {
    term: "Logbook",
    category: "Training & FTO",
    def: "The formal record of every flight you make — date, aircraft, route, time, and the capacity you flew in. Your hours only count if they are logged and certified.",
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  {
    term: "ATS airway",
    full: "Air Traffic Services airway",
    category: "Navigation",
    def: "A published corridor in the sky, defined by waypoints and navigation aids, along which controlled traffic flies. Real flight planning means routing along airways that actually exist rather than drawing a straight line on a map.",
  },
  {
    term: "Waypoint",
    category: "Navigation",
    def: "A defined geographic position used for navigation, identified by a five-letter name. Airways are strung together from waypoints.",
  },
  {
    term: "ARINC 424",
    category: "Navigation",
    def: "The international data standard describing navigation databases — airways, waypoints, aerodromes and procedures — in the form aircraft navigation systems consume.",
  },
  {
    term: "VOR",
    full: "VHF Omnidirectional Range",
    category: "Navigation",
    def: "A ground-based navigation aid that transmits radials, letting an aircraft determine its bearing to or from the station. A backbone of conventional airway navigation.",
  },
  {
    term: "NDB",
    full: "Non-Directional Beacon",
    category: "Navigation",
    def: "An older ground-based beacon that an aircraft's ADF instrument points towards. Simple, affected by weather and terrain, and still examinable.",
  },
  {
    term: "DME",
    full: "Distance Measuring Equipment",
    category: "Navigation",
    def: "Equipment that measures slant-range distance between the aircraft and a ground station, usually paired with a VOR or ILS.",
  },
  {
    term: "ILS",
    full: "Instrument Landing System",
    category: "Navigation",
    def: "A precision approach aid providing both lateral guidance (localiser) and vertical guidance (glideslope) down to the runway.",
  },
  {
    term: "RNAV",
    full: "Area Navigation",
    category: "Navigation",
    def: "Navigation that allows an aircraft to fly any desired path within the coverage of navigation aids or satellite navigation, rather than only directly to or from ground beacons.",
  },
  {
    term: "RNP",
    full: "Required Navigation Performance",
    category: "Navigation",
    def: "RNAV with on-board performance monitoring and alerting — the aircraft not only navigates to a required accuracy but knows when it cannot.",
  },
  {
    term: "Dead reckoning",
    category: "Navigation",
    def: "Calculating your position from a known starting point using heading, speed and elapsed time. The foundation of the navigation paper, and what you fall back on when the aids fail.",
  },
  {
    term: "Great circle",
    category: "Navigation",
    def: "The shortest path between two points on the Earth's surface. Its track direction changes continuously, which is why long routes look curved on a flat chart.",
  },
  {
    term: "Rhumb line",
    category: "Navigation",
    def: "A path crossing every meridian at the same angle — a constant track. Easier to fly than a great circle, but longer.",
  },
  {
    term: "Magnetic variation",
    category: "Navigation",
    def: "The angular difference between true north and magnetic north at a given place. It changes with location and slowly over time, and must be applied when converting between true and magnetic directions.",
  },
  {
    term: "Deviation",
    category: "Navigation",
    def: "The error in a magnetic compass caused by the aircraft's own metal and electrical systems, recorded on a compass correction card.",
  },
  {
    term: "Drift",
    category: "Navigation",
    def: "The sideways displacement of an aircraft caused by wind. Correcting for it is the difference between your heading and your track.",
  },

  // ── Weather ───────────────────────────────────────────────────────────────
  {
    term: "METAR",
    category: "Weather",
    def: "A routine observation of actual weather at an aerodrome, issued in a coded format: wind, visibility, present weather, cloud, temperature, dew point and pressure. It tells you what the weather IS right now.",
  },
  {
    term: "TAF",
    full: "Terminal Aerodrome Forecast",
    category: "Weather",
    def: "A coded forecast of expected weather at an aerodrome over a defined period. Where a METAR is an observation, a TAF is a prediction — which is what you plan against.",
  },
  {
    term: "SIGMET",
    full: "Significant Meteorological Information",
    category: "Weather",
    def: "A warning of weather hazardous to aircraft in flight, such as thunderstorms, severe turbulence, icing or volcanic ash, covering a region rather than a single aerodrome.",
  },
  {
    term: "QNH",
    category: "Weather",
    def: "The altimeter setting that makes your altimeter read height above mean sea level. Set QNH and your altimeter shows altitude — the setting used for terrain separation.",
  },
  {
    term: "QFE",
    category: "Weather",
    def: "The altimeter setting that makes your altimeter read zero on the aerodrome. Useful in the circuit, because the instrument then shows height above the field.",
  },
  {
    term: "ISA",
    full: "International Standard Atmosphere",
    category: "Weather",
    def: "An agreed model atmosphere — 15°C and 1013.25 hPa at sea level, with defined lapse rates — used as the reference for performance calculations and altimetry.",
  },
  {
    term: "Density altitude",
    category: "Weather",
    def: "Pressure altitude corrected for temperature: the altitude the aircraft's engine and wings think they are at. High, hot and humid means high density altitude and badly degraded performance.",
  },
  {
    term: "VFR / IFR",
    full: "Visual / Instrument Flight Rules",
    category: "Weather",
    def: "The two sets of rules a flight operates under. VFR requires flying with visual reference to the ground in defined minimum weather; IFR allows flight by instruments in cloud, with an instrument rating and an ATC clearance.",
  },
  {
    term: "Ceiling",
    category: "Weather",
    def: "The height above ground of the lowest cloud layer reported as broken or overcast. With visibility, it decides whether an approach is legal.",
  },

  // ── Airspace & ATC ────────────────────────────────────────────────────────
  {
    term: "ATC",
    full: "Air Traffic Control",
    category: "Airspace & ATC",
    def: "The service that separates aircraft and sequences traffic, issuing clearances and instructions by radio. Learning to talk to ATC fluently is as examinable as any other subject.",
  },
  {
    term: "FIR",
    full: "Flight Information Region",
    category: "Airspace & ATC",
    def: "A large volume of airspace within which flight information and alerting services are provided. Crossing from one FIR into another has its own radio procedure.",
  },
  {
    term: "CTR",
    full: "Control Zone",
    category: "Airspace & ATC",
    def: "Controlled airspace around an aerodrome, extending from the surface upwards, that you need a clearance to enter.",
  },
  {
    term: "TMA",
    full: "Terminal Control Area",
    category: "Airspace & ATC",
    def: "Controlled airspace, usually where several airways converge near a busy aerodrome, handling arriving and departing traffic.",
  },
  {
    term: "ATZ",
    full: "Aerodrome Traffic Zone",
    category: "Airspace & ATC",
    def: "The airspace immediately around an aerodrome within which traffic must comply with its procedures.",
  },
  {
    term: "NOTAM",
    full: "Notice to Airmen",
    category: "Airspace & ATC",
    def: "A notice of anything temporarily changed or hazardous that a pilot must know — a closed runway, an unserviceable navigation aid, restricted airspace. Checking NOTAMs is part of every real flight plan, not an afterthought.",
  },
  {
    term: "AIRAC",
    full: "Aeronautical Information Regulation and Control",
    category: "Airspace & ATC",
    def: "The fixed 28-day cycle on which aeronautical data changes take effect worldwide, so everyone switches to new charts and navigation data on the same date.",
  },
  {
    term: "eAIP",
    full: "electronic Aeronautical Information Publication",
    category: "Airspace & ATC",
    def: "The official national publication of aeronautical information — aerodrome details, procedures, airspace and charts — issued electronically and updated on the AIRAC cycle.",
  },
  {
    term: "SID",
    full: "Standard Instrument Departure",
    category: "Airspace & ATC",
    def: "A published departure procedure taking you from the runway to the enroute structure, so a clearance can be issued by name instead of read out step by step.",
  },
  {
    term: "STAR",
    full: "Standard Terminal Arrival Route",
    category: "Airspace & ATC",
    def: "A published arrival procedure connecting the enroute structure to the start of an approach.",
  },
  {
    term: "IAP",
    full: "Instrument Approach Procedure",
    category: "Airspace & ATC",
    def: "The published procedure flown from the end of the arrival down to a point where you can land visually, with defined tracks, altitudes and minima.",
  },
  {
    term: "Squawk",
    category: "Airspace & ATC",
    def: "The four-digit transponder code ATC assigns so your aircraft is identified on radar. Certain codes are reserved for emergencies, radio failure and unlawful interference.",
  },

  // ── Aircraft & performance ────────────────────────────────────────────────
  {
    term: "W&B",
    full: "Weight and Balance",
    category: "Aircraft & performance",
    def: "The calculation confirming the aircraft is within its weight limits and its centre of gravity is inside the permitted envelope. Get it wrong and the aircraft may be unflyable regardless of engine power.",
  },
  {
    term: "CG",
    full: "Centre of Gravity",
    category: "Aircraft & performance",
    def: "The point through which the aircraft's total weight acts. Its position changes with loading and fuel burn, and directly affects stability and control.",
  },
  {
    term: "MTOW",
    full: "Maximum Take-Off Weight",
    category: "Aircraft & performance",
    def: "The greatest weight at which the aircraft is certified to begin its take-off run.",
  },
  {
    term: "ZFW",
    full: "Zero Fuel Weight",
    category: "Aircraft & performance",
    def: "The weight of the aircraft with everything on board except usable fuel — the structural limit that fuel loading cannot fix.",
  },
  {
    term: "TORA / TODA / ASDA / LDA",
    category: "Aircraft & performance",
    def: "The declared distances for a runway: Take-Off Run Available, Take-Off Distance Available, Accelerate-Stop Distance Available and Landing Distance Available. Performance calculations are worked against them.",
  },
  {
    term: "Powerplant",
    category: "Aircraft & performance",
    def: "The engine and everything that makes it work — induction, fuel, ignition, lubrication, cooling and propeller. One of the DGCA ground subjects in its own right.",
  },

  // ── Radio telephony ───────────────────────────────────────────────────────
  {
    term: "Phraseology",
    category: "Radio telephony",
    def: "The standard words and structure used on the radio, so a transmission means exactly one thing to every listener regardless of accent or language. Not a style preference — a safety system.",
  },
  {
    term: "MAYDAY",
    category: "Radio telephony",
    def: "The spoken distress signal, said three times, declaring grave and imminent danger requiring immediate assistance. It gives you absolute priority.",
  },
  {
    term: "PAN-PAN",
    category: "Radio telephony",
    def: "The spoken urgency signal, said three times, for a serious situation that does not yet require immediate assistance — a step below MAYDAY.",
  },
  {
    term: "Readback",
    category: "Radio telephony",
    def: "Repeating a clearance or instruction back to ATC so both parties confirm it was received correctly. Certain items must always be read back.",
  },
  {
    term: "Light gun signals",
    category: "Radio telephony",
    def: "Coloured light signals used by a control tower to direct an aircraft whose radio has failed — steady green, red, flashing signals, each with a defined meaning in the air and on the ground.",
  },
];
