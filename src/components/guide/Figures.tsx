import type { ReactNode } from "react";

// Original, code-drawn illustrations for the Pilot Guide (SVG + HTML/CSS).
// No photos, no generated imagery, no copies of government screens: forms are
// drawn as simplified wireframes and labelled as illustrations. Every number in
// here is one already stated (and sourced) in src/content/guides.js.
//
// Used by the guide pages AND the PDF print template through the "figure" block.

const NAVY = "#1B3A7A";
const INK = "#0D1629";
const GOLD = "#C9981F";
const GOLD_L = "#F5D97A";
const SKY = "#5BA4E8";
const BODY = "#3D4F75";
const MUTED = "#5B6B8C";
const LINE = "rgba(27,58,122,0.14)";

export const FIG_CSS = `
.fig{margin:6px 0 4px;border:1px solid ${LINE};border-radius:20px;background:linear-gradient(180deg,#FBFDFF,#F2F7FF);padding:18px;break-inside:avoid}
.fig-cap{display:flex;justify-content:space-between;gap:12px;margin-top:12px;font-size:13px;color:${MUTED};line-height:1.45}
.fig-tag{flex:none;font-size:10.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${GOLD}}
.fig svg{display:block;width:100%;height:auto}
.fig-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
@media (max-width:640px){
  .fig{padding:12px;border-radius:16px}
  .fig-scroll>svg{min-width:600px}
  .fig-scroll::after{content:"Swipe sideways to see the whole diagram";display:block;font-size:11.5px;color:${MUTED};margin-top:6px}
  .fig-cap{flex-direction:column-reverse;gap:4px}
}
@media print{.fig-scroll>svg{min-width:0}.fig-scroll::after{display:none}}
.fig-steps{display:grid;gap:10px}
.fig-step{display:flex;gap:12px;align-items:flex-start;background:#fff;border:1px solid ${LINE};border-radius:14px;padding:12px 14px;position:relative}
.fig-ico{flex:none;width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:${NAVY};color:${GOLD_L};font-weight:900;font-size:15px}
.fig-step>div>b{display:block;color:${INK};font-size:15px;line-height:1.3}
.fig-step>div>span{display:block;color:${BODY};font-size:13.5px;line-height:1.5;margin-top:2px}
.fig-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.fig-chip{font-size:11.5px;font-weight:800;border-radius:8px;padding:3px 9px;line-height:1.4;background:#FFF3D6;color:#8a6a12}
.fig-chip.sky{background:#E4F1FD;color:#1c6cb3}
.fig-chip.grey{background:#EEF2F8;color:${MUTED}}
.fig-arrow{display:flex;justify-content:center;color:${GOLD};font-size:18px;line-height:1;margin:-4px 0}
.fig-two{display:grid;grid-template-columns:1fr;gap:12px}
@media (min-width:700px){.fig-two{grid-template-columns:1fr 1fr}}
.fig-card{background:#fff;border:1px solid ${LINE};border-radius:16px;padding:14px 16px}
.fig-card h4{margin:0 0 8px;font-size:16px;font-weight:900;color:${INK};display:flex;align-items:center;gap:8px}
.fig-card dl{margin:0;display:grid;gap:8px}
.fig-card dt{font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:${MUTED}}
.fig-card dd{margin:1px 0 0;font-size:14px;color:${BODY};line-height:1.45}
.fig-badge{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:28px;padding:0 8px;border-radius:9px;font-size:13px;font-weight:900}
.fig-timeline{position:relative;padding-left:28px}
.fig-timeline::before{content:"";position:absolute;left:11px;top:6px;bottom:6px;width:3px;border-radius:3px;background:linear-gradient(${GOLD_L},${NAVY})}
.fig-tl{position:relative;margin-bottom:10px}
.fig-tl::before{content:"";position:absolute;left:-23px;top:14px;width:13px;height:13px;border-radius:50%;background:#fff;border:3px solid ${GOLD}}
.fig-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
@media (min-width:700px){.fig-grid{grid-template-columns:repeat(3,1fr)}}
.fig-metar{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:clamp(13px,2.6vw,17px);font-weight:700;display:flex;flex-wrap:wrap;gap:6px;line-height:1}
.fig-metar span{padding:7px 8px;border-radius:8px;color:#fff}
.fig-legend{display:grid;grid-template-columns:1fr;gap:6px;margin-top:12px}
@media (min-width:700px){.fig-legend{grid-template-columns:1fr 1fr}}
.fig-legend div{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;color:${BODY};line-height:1.4}
.fig-legend i{flex:none;width:12px;height:12px;border-radius:4px;margin-top:3px}
`;

function Fig({ children, caption, tag = "Illustration", wide = false }: { children: ReactNode; caption: string; tag?: string; wide?: boolean }) {
  return (
    <figure className="fig">
      {wide ? <div className="fig-scroll">{children}</div> : children}
      <figcaption className="fig-cap">
        <span>{caption}</span>
        <span className="fig-tag">{tag}</span>
      </figcaption>
    </figure>
  );
}

function Steps({ items }: { items: { n: string; t: string; d?: string; chips?: { t: string; c?: string }[] }[] }) {
  return (
    <div className="fig-steps">
      {items.map((s, i) => (
        <div key={i}>
          <div className="fig-step">
            <span className="fig-ico">{s.n}</span>
            <div>
              <b>{s.t}</b>
              {s.d && <span>{s.d}</span>}
              {s.chips && (
                <div className="fig-chips">
                  {s.chips.map((c) => <em key={c.t} className={`fig-chip ${c.c || ""}`} style={{ fontStyle: "normal" }}>{c.t}</em>)}
                </div>
              )}
            </div>
          </div>
          {i < items.length - 1 && <div className="fig-arrow" aria-hidden>&#8595;</div>}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- pathway
type Stop = { t: string; d: string; chips?: { t: string; c?: string }[] };
function PathwayRoadmap() {
  const stops: Stop[] = [
    { t: "Class 12 with Physics and Maths", d: "The education rule for a CPL. A pass in both subjects.", chips: [{ t: "School" }] },
    { t: "Medicals: Class 2, then Class 1", d: "Do these before paying big fees. First Class 1 at an IAF centre or a DGCA-approved hospital.", chips: [{ t: "IAF fee: Class 2 ₹3,000 · Class 1 ₹5,000", c: "sky" }] },
    { t: "Your DGCA IDs", d: "eGCA ID (medicals, licences) and Pariksha Computer Number (exams).", chips: [{ t: "Computer Number: free", c: "sky" }] },
    { t: "Flying school and Student Pilot Licence", d: "Join a DGCA-approved FTO. SPL from age 16, issued through your school.", chips: [{ t: "SPL fee ₹1,000", c: "sky" }] },
    { t: "DGCA theory papers on Pariksha", d: "Air Regulations, Navigation, Meteorology, Technical General and Specific.", chips: [{ t: "₹2,500 per paper (regular)", c: "sky" }] },
    { t: "RTR radio licence and English (ELP Level 4+)", d: "RTR written and practical with DGCA; ELP test after approved training.", chips: [{ t: "RTR: ₹2,000 + ₹500 + ₹5,000", c: "sky" }] },
    { t: "CPL: at least 200 flying hours", d: "Skill tests, then apply on eGCA. Age 18 and a Class 1 medical.", chips: [{ t: "Commonly 18-24 months to here", c: "grey" }, { t: "Typically ₹45-70 lakh all-in", c: "grey" }] },
    { t: "Instrument Rating and multi-engine", d: "Fly in cloud on instruments, and aircraft with two engines." },
    { t: "Type rating", d: "One aircraft type (for example A320 or B737) in a simulator, then base training.", chips: [{ t: "Typically ₹15-35 lakh", c: "grey" }] },
    { t: "Airline first officer", d: "Line training on real routes. Captain later, with an ATPL (1,500 hours).", chips: [{ t: "The right-hand seat" }] },
  ];
  return (
    <Fig caption="The usual order from school to an airline. Blue tags are official fees; grey tags are indicative ranges that vary by school and are not set by any regulator." tag="Roadmap">
      <div className="fig-timeline">
        {stops.map((s, i) => (
          <div key={i} className="fig-tl">
            <div className="fig-step" style={{ padding: "10px 14px" }}>
              <span className="fig-ico" style={{ width: 32, height: 32, fontSize: 13, background: i === stops.length - 1 ? GOLD : NAVY, color: i === stops.length - 1 ? INK : GOLD_L }}>{i + 1}</span>
              <div>
                <b>{s.t}</b>
                <span>{s.d}</span>
                {s.chips && (
                  <div className="fig-chips">{s.chips.map((c) => <em key={c.t} className={`fig-chip ${c.c || ""}`} style={{ fontStyle: "normal" }}>{c.t}</em>)}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Fig>
  );
}

function CplHours() {
  // 200 h total; the required parts are minimums inside it.
  const bars = [
    { l: "Total flight time", h: 200, c: NAVY },
    { l: "Pilot in command", h: 100, c: SKY },
    { l: "Cross-country as PIC", h: 20, c: GOLD },
    { l: "Instrument time", h: 10, c: "#7C5CD6" },
    { l: "Night flying", h: 5, c: "#E0607E" },
  ];
  return (
    <Fig wide caption="CPL minimum flying hours (Aircraft Rules, Schedule II). The coloured parts are minimums that sit inside the 200 total." tag="Chart">
      <svg viewBox="0 0 640 230" role="img" aria-label="Bar chart of CPL minimum hours">
        {bars.map((b, i) => {
          const y = 14 + i * 42;
          const w = (b.h / 200) * 420;
          return (
            <g key={b.l}>
              <text x="0" y={y + 19} fontSize="14" fill={BODY} fontFamily="Inter, sans-serif" fontWeight="600">{b.l}</text>
              <rect x="180" y={y} width="420" height="26" rx="8" fill="#E8EFFA" />
              <rect x="180" y={y} width={Math.max(w, 10)} height="26" rx="8" fill={b.c} />
              <text x={180 + Math.max(w, 10) + 8} y={y + 18} fontSize="14" fill={INK} fontWeight="800" fontFamily="Inter, sans-serif">{b.h} h</text>
            </g>
          );
        })}
      </svg>
    </Fig>
  );
}

// ---------------------------------------------------------------- medical
function MedicalCompare() {
  return (
    <Fig caption="Class 2 against Class 1 at a glance. From CAR Section 7 Series C Part I (Rev 7)." tag="Comparison">
      <div className="fig-two">
        {[
          { t: "Class 2", col: SKY, rows: [["Needed for", "SPL, PPL, FRTOL"], ["Who can examine", "Any DGCA-empanelled Class 2 or Class 1 examiner"], ["Validity", "24 months up to age 50, then 12"], ["Fee at an IAF centre", "₹3,000"]] },
          { t: "Class 1", col: GOLD, rows: [["Needed for", "CPL, ATPL"], ["First (initial) exam", "IAF: AFCME New Delhi, IAM Bengaluru, MEC (East) Jorhat, or a DGCA-approved civil hospital"], ["Validity", "12 months up to age 60, then 6"], ["Fee at an IAF centre", "₹5,000"]] },
        ].map((c) => (
          <div key={c.t} className="fig-card" style={{ borderTop: `4px solid ${c.col}` }}>
            <h4><span className="fig-badge" style={{ background: c.col, color: c.col === GOLD ? INK : "#fff" }}>{c.t.slice(-1)}</span>{c.t}</h4>
            <dl>{c.rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
        ))}
      </div>
    </Fig>
  );
}

function MedicalValidity() {
  const x = (age: number) => 70 + ((age - 16) / (65 - 16)) * 540;
  return (
    <Fig wide caption="How long each medical lasts at different ages (single-pilot commercial flying has a shorter Class 1 period from age 40)." tag="Chart">
      <svg viewBox="0 0 640 170" role="img" aria-label="Medical validity by age">
        {[16, 30, 40, 50, 60, 65].map((a) => (
          <g key={a}>
            <line x1={x(a)} x2={x(a)} y1="20" y2="132" stroke={LINE} />
            <text x={x(a)} y="152" fontSize="13" textAnchor="middle" fill={MUTED} fontFamily="Inter, sans-serif">{a}</text>
          </g>
        ))}
        <text x="0" y="57" fontSize="14" fontWeight="800" fill={INK} fontFamily="Inter, sans-serif">Class 1</text>
        <rect x={x(16)} y="38" width={x(60) - x(16)} height="28" rx="7" fill={GOLD} />
        <text x={(x(16) + x(60)) / 2} y="57" fontSize="13" fontWeight="800" textAnchor="middle" fill={INK} fontFamily="Inter, sans-serif">12 months</text>
        <rect x={x(60)} y="38" width={x(65) - x(60)} height="28" rx="7" fill="#E9C665" />
        <text x={(x(60) + x(65)) / 2} y="57" fontSize="12" fontWeight="800" textAnchor="middle" fill={INK} fontFamily="Inter, sans-serif">6 mo</text>
        <text x="0" y="107" fontSize="14" fontWeight="800" fill={INK} fontFamily="Inter, sans-serif">Class 2</text>
        <rect x={x(16)} y="88" width={x(50) - x(16)} height="28" rx="7" fill={SKY} />
        <text x={(x(16) + x(50)) / 2} y="107" fontSize="13" fontWeight="800" textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif">24 months</text>
        <rect x={x(50)} y="88" width={x(65) - x(50)} height="28" rx="7" fill="#8CC0EE" />
        <text x={(x(50) + x(65)) / 2} y="107" fontSize="13" fontWeight="800" textAnchor="middle" fill={INK} fontFamily="Inter, sans-serif">12 months</text>
        <text x={x(40)} y="14" fontSize="11.5" textAnchor="middle" fill={MUTED} fontFamily="Inter, sans-serif">40: single-pilot Class 1 drops to 6 mo</text>
      </svg>
    </Fig>
  );
}

function MedicalSteps() {
  return (
    <Fig caption="Booking a medical on eGCA, from DGCA's Class 1 and Class 2 eGCA manuals." tag="Flow">
      <Steps
        items={[
          { n: "1", t: "eGCA → Medical services", d: "Choose Class 2 or Class 1 issuance." },
          { n: "2", t: "Pick an examiner, book a slot", d: "IAF centres: pay on Bharatkosh." },
          { n: "3", t: "Fill the e-form, get your test list", d: "Personal, flying and medical history with a photo." },
          { n: "4", t: "Upload test reports, attend the exam" },
          { n: "5", t: "CA-35 certificate in eGCA", d: "DGCA's medical assessment follows where required.", chips: [{ t: "Assessment fee: nil", c: "sky" }] },
        ]}
      />
    </Fig>
  );
}

// ------------------------------------------------------------------- eGCA
function TwoPortals() {
  return (
    <Fig wide caption="Two DGCA portals, two IDs. Students mix them up all the time." tag="Diagram">
      <svg viewBox="0 0 640 316" role="img" aria-label="Diagram: you, eGCA and Pariksha">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={GOLD} />
          </marker>
        </defs>
        <circle cx="320" cy="46" r="34" fill={NAVY} />
        <text x="320" y="51" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily="Inter, sans-serif">You</text>
        <path d="M296 72 C 240 110, 180 110, 168 128" fill="none" stroke={GOLD} strokeWidth="2.5" markerEnd="url(#arr)" />
        <path d="M344 72 C 400 110, 460 110, 472 128" fill="none" stroke={GOLD} strokeWidth="2.5" markerEnd="url(#arr)" />
        {[
          { x: 20, t: "eGCA", id: "eGCA ID", items: ["Medicals", "Student Pilot Licence", "PPL / CPL / ATPL issue", "e-logbook", "RTR practical and licence"], c: NAVY },
          { x: 330, t: "Pariksha", id: "Computer Number", items: ["All DGCA theory exams", "RTR written paper", "Admit cards", "Results", "Free, valid for life"], c: "#2E6BE5" },
        ].map((b) => (
          <g key={b.t}>
            <rect x={b.x} y="132" width="290" height="178" rx="18" fill="#fff" stroke={LINE} />
            <rect x={b.x} y="132" width="290" height="44" rx="18" fill={b.c} />
            <rect x={b.x} y="160" width="290" height="16" fill={b.c} />
            <text x={b.x + 18} y="160" fontSize="17" fontWeight="900" fill="#fff" fontFamily="Inter, sans-serif">{b.t}</text>
            <text x={b.x + 272} y="160" textAnchor="end" fontSize="12.5" fontWeight="700" fill={GOLD_L} fontFamily="Inter, sans-serif">{b.id}</text>
            {b.items.map((it, i) => (
              <g key={it}>
                <circle cx={b.x + 24} cy={198 + i * 21} r="3.5" fill={GOLD} />
                <text x={b.x + 36} y={203 + i * 21} fontSize="13.5" fill={BODY} fontFamily="Inter, sans-serif">{it}</text>
              </g>
            ))}
          </g>
        ))}
      </svg>
    </Fig>
  );
}

function FormWireframe() {
  const call = (n: number, x: number, y: number) => (
    <g key={n}>
      <circle cx={x} cy={y} r="12" fill={GOLD} />
      <text x={x} y={y + 4.5} textAnchor="middle" fontSize="12.5" fontWeight="900" fill={INK} fontFamily="Inter, sans-serif">{n}</text>
    </g>
  );
  const field = (y: number, label: string, w = 300) => (
    <g>
      <text x="40" y={y - 6} fontSize="11.5" fill={MUTED} fontFamily="Inter, sans-serif" fontWeight="700">{label}</text>
      <rect x="40" y={y} width={w} height="24" rx="6" fill="#fff" stroke="#C9D6EA" />
    </g>
  );
  const notes = [
    "Category: PPL, CPL, ATPL and others",
    "Name exactly as on your Class 10 certificate",
    "Date of birth: Class 10 or municipal certificate only",
    "Aadhaar number (must match DigiLocker for auto mode)",
    "Board, year, marks; pass in Physics and Maths",
    "Photo JPG ≤70 KB · signature JPG ≤20 KB · PDFs ≤500 KB",
    "Final Submit: no documents can be added after",
  ];
  return (
    <Fig wide caption="What the Computer Number form asks for, as a simplified wireframe. Not the real screen: the real portal looks different and may change." tag="Illustration, not a screenshot">
      <svg viewBox="0 0 640 420" role="img" aria-label="Wireframe of the Computer Number application form with numbered notes">
        <rect x="20" y="10" width="340" height="400" rx="16" fill="#F7FAFF" stroke={LINE} />
        <rect x="20" y="10" width="340" height="36" rx="16" fill={NAVY} />
        <rect x="20" y="30" width="340" height="16" fill={NAVY} />
        <text x="40" y="34" fontSize="13" fontWeight="800" fill="#fff" fontFamily="Inter, sans-serif">New candidate registration</text>
        {field(80, "Registration category", 180)}
        {field(130, "Full name")}
        {field(180, "Date of birth", 150)}
        {field(230, "Aadhaar number", 220)}
        {field(280, "Education details")}
        <text x="40" y="324" fontSize="11.5" fill={MUTED} fontFamily="Inter, sans-serif" fontWeight="700">Uploads</text>
        <rect x="40" y="330" width="62" height="40" rx="6" fill="#fff" stroke="#C9D6EA" strokeDasharray="4 3" />
        <rect x="110" y="340" width="92" height="30" rx="6" fill="#fff" stroke="#C9D6EA" strokeDasharray="4 3" />
        <rect x="210" y="330" width="40" height="40" rx="6" fill="#fff" stroke="#C9D6EA" strokeDasharray="4 3" />
        <text x="230" y="355" textAnchor="middle" fontSize="10" fill={MUTED} fontFamily="Inter, sans-serif">PDF</text>
        <rect x="262" y="378" width="78" height="24" rx="12" fill={GOLD} />
        <text x="301" y="394" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK} fontFamily="Inter, sans-serif">Final Submit</text>
        {[96, 146, 196, 246, 296, 350, 390].map((y, i) => call(i + 1, 352, y))}
        {notes.map((n, i) => (
          <g key={i}>
            {call(i + 1, 392, 40 + i * 54)}
            <foreignObject x="410" y={28 + i * 54} width="225" height="50">
              <div style={{ fontSize: 12.5, lineHeight: 1.35, color: BODY, fontFamily: "Inter, sans-serif" }}>{n}</div>
            </foreignObject>
          </g>
        ))}
      </svg>
    </Fig>
  );
}

function PhotoSpec() {
  return (
    <Fig wide caption="Pariksha's official specifications for the photo, signature and documents (FC manual, sections 2.2.3 to 2.2.6)." tag="Specification">
      <svg viewBox="0 0 640 300" role="img" aria-label="Photo and signature size specifications">
        {/* photo: 35 x 45 mm at 4 px/mm */}
        <g transform="translate(40 30)">
          <rect width="140" height="180" rx="4" fill="#fff" stroke={NAVY} strokeWidth="2" />
          <ellipse cx="70" cy="80" rx="50" ry="62" fill="#E8EFFA" stroke={SKY} strokeDasharray="5 4" />
          <circle cx="70" cy="66" r="24" fill="#C9D6EA" />
          <path d="M30 142 C 36 108, 104 108, 110 142 Z" fill="#C9D6EA" />
          <line x1="0" y1="198" x2="140" y2="198" stroke={GOLD} strokeWidth="2" />
          <text x="70" y="216" textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily="Inter, sans-serif">35 mm wide</text>
          <line x1="158" y1="0" x2="158" y2="180" stroke={GOLD} strokeWidth="2" />
          <text x="170" y="94" fontSize="13" fontWeight="800" fill={INK} fontFamily="Inter, sans-serif">45 mm</text>
          <text x="0" y="244" fontSize="13" fontWeight="800" fill={NAVY} fontFamily="Inter, sans-serif">PHOTO</text>
          <text x="0" y="262" fontSize="12.5" fill={BODY} fontFamily="Inter, sans-serif">Colour, white background, face about 70%</text>
          <text x="0" y="280" fontSize="12.5" fill={BODY} fontFamily="Inter, sans-serif">JPG only, max 70 KB</text>
        </g>
        {/* signature: 45 x 20 mm at 4 px/mm */}
        <g transform="translate(330 60)">
          <rect width="180" height="80" rx="4" fill="#fff" stroke={NAVY} strokeWidth="2" />
          <path d="M22 52 C 40 20, 52 64, 70 36 S 98 58, 112 34 S 140 48, 158 30" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="0" y1="98" x2="180" y2="98" stroke={GOLD} strokeWidth="2" />
          <text x="90" y="116" textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily="Inter, sans-serif">45 mm wide</text>
          <line x1="198" y1="0" x2="198" y2="80" stroke={GOLD} strokeWidth="2" />
          <text x="208" y="45" fontSize="13" fontWeight="800" fill={INK} fontFamily="Inter, sans-serif">20 mm</text>
          <text x="0" y="148" fontSize="13" fontWeight="800" fill={NAVY} fontFamily="Inter, sans-serif">SIGNATURE</text>
          <text x="0" y="166" fontSize="12.5" fill={BODY} fontFamily="Inter, sans-serif">White background, not all capitals</text>
          <text x="0" y="184" fontSize="12.5" fill={BODY} fontFamily="Inter, sans-serif">JPG only, max 20 KB</text>
          <rect x="0" y="200" width="250" height="38" rx="10" fill="#FFF3D6" />
          <text x="14" y="224" fontSize="12.5" fontWeight="800" fill="#8a6a12" fontFamily="Inter, sans-serif">All other documents: PDF only, max 500 KB</text>
        </g>
      </svg>
    </Fig>
  );
}

// --------------------------------------------------------------- Pariksha
function ParikshaFlow() {
  return (
    <Fig caption="One exam session, from application to result (Pariksha FC manual, Ch. 7, and the session instructions)." tag="Flow">
      <Steps
        items={[
          { n: "1", t: "Log in with your Computer Number", d: "Open Examination and the form for the session." },
          { n: "2", t: "Session, category, two centre choices" },
          { n: "3", t: "Choose papers and slot" },
          { n: "4", t: "Pay on Bharatkosh by 23:00 on the closing date", chips: [{ t: "₹2,500 per paper regular", c: "sky" }, { t: "₹5,000 on-demand", c: "sky" }] },
          { n: "5", t: "Download the admit card", d: "Three days before the exam." },
          { n: "6", t: "Sit the exam", d: "Results on the Pariksha notice board. A fail means a 6-week wait to retake." },
        ]}
      />
    </Fig>
  );
}

function ExamDayTimeline() {
  const pts = [
    { x: 40, t: "−60 min", d: "Entry opens" },
    { x: 150, t: "−30 min", d: "Entry closes" },
    { x: 260, t: "Start", d: "Exam begins" },
    { x: 380, t: "+60 min", d: "One toilet break allowed" },
    { x: 500, t: "Last 30 min", d: "No breaks" },
    { x: 600, t: "End", d: "Sign the sheet" },
  ];
  return (
    <Fig wide caption="Exam-day timing from DGCA's session instructions. Instructions are reissued each session, so check the current one." tag="Timeline">
      <svg viewBox="0 0 640 200" role="img" aria-label="Exam day timeline">
        <rect x="40" y="58" width="220" height="12" rx="6" fill="#E4F1FD" />
        <rect x="260" y="58" width="340" height="12" rx="6" fill={NAVY} />
        <rect x="500" y="58" width="100" height="12" rx="6" fill="#E0607E" />
        <rect x="150" y="58" width="110" height="12" fill="#FDE8EC" />
        {pts.map((p, i) => (
          <g key={p.t}>
            <circle cx={p.x} cy="64" r="9" fill="#fff" stroke={i === 1 ? "#E0607E" : GOLD} strokeWidth="3.5" />
            <text x={p.x} y={i % 2 ? 108 : 36} textAnchor="middle" fontSize="13.5" fontWeight="900" fill={INK} fontFamily="Inter, sans-serif">{p.t}</text>
            <text x={p.x} y={i % 2 ? 126 : 20} textAnchor="middle" fontSize="12" fill={BODY} fontFamily="Inter, sans-serif">{p.d}</text>
          </g>
        ))}
        <g transform="translate(40 150)">
          <rect width="270" height="40" rx="10" fill="#E8F7EF" />
          <text x="14" y="25" fontSize="12.5" fontWeight="800" fill="#0b7a5a" fontFamily="Inter, sans-serif">Bring: admit card + one original photo ID</text>
          <rect x="290" width="270" height="40" rx="10" fill="#FDE8EC" />
          <text x="304" y="25" fontSize="12.5" fontWeight="800" fill="#b81d3c" fontFamily="Inter, sans-serif">Banned: phones, any watch or wrist band</text>
        </g>
      </svg>
    </Fig>
  );
}

function SubjectMap() {
  const papers = [
    { t: "Air Regulations", d: "Law, rules of the air", c: NAVY, note: "ATPL: exempt if you hold a CPL" },
    { t: "Air Navigation", d: "Charts, calculations, nav aids", c: "#2E6BE5", note: "Nav computer + scientific calculator allowed" },
    { t: "Aviation Meteorology", d: "Weather, METAR, TAF", c: SKY },
    { t: "Technical General", d: "Flight, engines, systems", c: "#7C5CD6" },
    { t: "Technical Specific", d: "Your aircraft type", c: "#9a5bd8" },
    { t: "RTR(R) written", d: "50 MCQs, 70% to pass", c: GOLD },
  ];
  return (
    <Fig caption="The CPL papers you sit on Pariksha. A pass counts for 5 years towards a CPL or ATPL." tag="Subject map">
      <div className="fig-grid">
        {papers.map((p) => (
          <div key={p.t} className="fig-card" style={{ borderLeft: `5px solid ${p.c}`, padding: "12px 14px" }}>
            <b style={{ color: INK, fontSize: 14.5, display: "block" }}>{p.t}</b>
            <span style={{ color: BODY, fontSize: 13, display: "block", marginTop: 2 }}>{p.d}</span>
            {p.note && <em className="fig-chip" style={{ fontStyle: "normal", display: "inline-block", marginTop: 8 }}>{p.note}</em>}
          </div>
        ))}
      </div>
    </Fig>
  );
}

// --------------------------------------------------------------------- RTR
function RtrProcess() {
  return (
    <Fig caption="The RTR(R) route since DGCA took over from WPC (RTR Rules 2025; CAR Section 7 Series G Part VI)." tag="Process">
      <Steps
        items={[
          { n: "1", t: "Computer Number on Pariksha", d: "Age 16+, Class 10 pass." },
          { n: "2", t: "Part 1: written exam (Pariksha)", d: "50 multiple-choice questions in English.", chips: [{ t: "Pass 70%", c: "sky" }, { t: "₹2,000", c: "sky" }, { t: "Valid 3 years", c: "grey" }] },
          { n: "3", t: "Part 2: practical (book on eGCA)", d: "About 30 minutes: 6 simulated radio scenarios at DGCA New Delhi or Chennai.", chips: [{ t: "Pass 50%", c: "sky" }, { t: "₹500", c: "sky" }, { t: "3 attempts", c: "grey" }] },
          { n: "4", t: "Licence on eGCA", d: "Valid until you turn 80.", chips: [{ t: "₹5,000", c: "sky" }] },
        ]}
      />
    </Fig>
  );
}

// ---------------------------------------------------------------- glossary
function RunwayDiagram() {
  return (
    <Fig wide caption="A runway and the words around it. Runway numbers are the magnetic heading in tens of degrees: landing on 09 you face east (090°), on 27 west (270°). On a real runway each number is painted to be read from its own approach end." tag="Diagram">
      <svg viewBox="0 0 640 250" role="img" aria-label="Runway diagram with labels">
        <rect x="0" y="0" width="640" height="250" rx="14" fill="#E3F0DA" />
        <rect x="40" y="70" width="560" height="56" rx="4" fill="#3B4252" />
        {Array.from({ length: 13 }).map((_, i) => <rect key={i} x={130 + i * 30} y="96" width="16" height="4" fill="#fff" />)}
        {Array.from({ length: 6 }).map((_, i) => <rect key={"a" + i} x="50" y={76 + i * 8} width="22" height="4" fill="#fff" />)}
        {Array.from({ length: 6 }).map((_, i) => <rect key={"b" + i} x="568" y={76 + i * 8} width="22" height="4" fill="#fff" />)}
        <text x="90" y="105" fontSize="20" fontWeight="900" fill="#fff" fontFamily="Oswald, sans-serif">09</text>
        <text x="528" y="105" fontSize="20" fontWeight="900" fill="#fff" fontFamily="Oswald, sans-serif">27</text>
        <rect x="250" y="126" width="22" height="58" fill="#5B6270" />
        <rect x="200" y="184" width="240" height="44" rx="4" fill="#8A909C" />
        <line x1="261" y1="128" x2="261" y2="184" stroke={GOLD_L} strokeWidth="2" />
        <rect x="470" y="190" width="26" height="40" rx="3" fill={NAVY} />
        <rect x="464" y="182" width="38" height="12" rx="3" fill={SKY} />
        {[
          { x: 60, y: 54, t: "Threshold markings" },
          { x: 230, y: 54, t: "Centreline" },
          { x: 286, y: 160, t: "Taxiway" },
          { x: 250, y: 244, t: "Apron (parking)" },
          { x: 510, y: 214, t: "Control tower" },
        ].map((l) => <text key={l.t} x={l.x} y={l.y} fontSize="13" fontWeight="800" fill={INK} fontFamily="Inter, sans-serif">{l.t}</text>)}
        <path d="M600 40 l 0 -18 m -6 6 l 6 -6 l 6 6" stroke={INK} strokeWidth="2" fill="none" />
        <text x="600" y="54" textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily="Inter, sans-serif">N</text>
      </svg>
    </Fig>
  );
}

function AtcUnits() {
  const units = [
    { t: "Clearance", d: "Route clearance before start" },
    { t: "Ground", d: "Pushback and taxi" },
    { t: "Tower", d: "Runway: take-off and landing" },
    { t: "Approach", d: "Radar for departures and arrivals" },
    { t: "Area control", d: "En route at cruise" },
  ];
  return (
    <Fig wide caption="Who you talk to on a typical departure, in order. Small airfields combine several of these on one frequency." tag="Diagram">
      <svg viewBox="0 0 640 170" role="img" aria-label="ATC units in order">
        <path d="M20 140 C 160 140, 240 120, 330 90 S 520 30, 630 20" fill="none" stroke={GOLD} strokeWidth="3" strokeDasharray="3 9" strokeLinecap="round" />
        {units.map((u, i) => {
          const x = 20 + i * 125;
          return (
            <g key={u.t}>
              <rect x={x} y={i < 2 ? 96 : i < 3 ? 70 : 34 - (i - 3) * 10} width="112" height="58" rx="12" fill="#fff" stroke={LINE} />
              <text x={x + 10} y={(i < 2 ? 96 : i < 3 ? 70 : 34 - (i - 3) * 10) + 23} fontSize="13" fontWeight="900" fill={NAVY} fontFamily="Inter, sans-serif">{u.t}</text>
              <foreignObject x={x + 8} y={(i < 2 ? 96 : i < 3 ? 70 : 34 - (i - 3) * 10) + 28} width="100" height="30">
                <div style={{ fontSize: 10.5, lineHeight: 1.25, color: BODY, fontFamily: "Inter, sans-serif" }}>{u.d}</div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </Fig>
  );
}

function MetarBreakdown() {
  const parts = [
    { t: "METAR", c: "#5B6B8C", d: "Report type: routine observation" },
    { t: "VIDP", c: NAVY, d: "Station: Delhi (ICAO code)" },
    { t: "180530Z", c: "#2E6BE5", d: "Day 18, 05:30 UTC" },
    { t: "27006KT", c: "#0E8A6A", d: "Wind from 270° at 6 knots" },
    { t: "3500", c: "#7C5CD6", d: "Visibility 3,500 metres" },
    { t: "HZ", c: "#B2721A", d: "Weather: haze" },
    { t: "NSC", c: "#5BA4E8", d: "No significant cloud" },
    { t: "18/09", c: "#E0607E", d: "Temperature 18 °C, dew point 9 °C" },
    { t: "Q1015", c: "#9a5bd8", d: "QNH 1015 hPa" },
    { t: "NOSIG", c: "#8A6A12", d: "No significant change expected" },
  ];
  return (
    <Fig caption="A METAR, decoded part by part. This is a made-up example in the standard format, not a real report." tag="Example">
      <div className="fig-metar">{parts.map((p) => <span key={p.t} style={{ background: p.c }}>{p.t}</span>)}</div>
      <div className="fig-legend">
        {parts.map((p) => (
          <div key={p.t}><i style={{ background: p.c }} /><span><b style={{ color: INK }}>{p.t}</b> {p.d}</span></div>
        ))}
      </div>
    </Fig>
  );
}

export const FIGURES: Record<string, () => JSX.Element> = {
  "pathway-roadmap": PathwayRoadmap,
  "cpl-hours": CplHours,
  "medical-compare": MedicalCompare,
  "medical-validity": MedicalValidity,
  "medical-steps": MedicalSteps,
  "two-portals": TwoPortals,
  "form-wireframe": FormWireframe,
  "photo-spec": PhotoSpec,
  "pariksha-flow": ParikshaFlow,
  "exam-day": ExamDayTimeline,
  "subject-map": SubjectMap,
  "rtr-process": RtrProcess,
  "runway": RunwayDiagram,
  "atc-units": AtcUnits,
  "metar": MetarBreakdown,
};
