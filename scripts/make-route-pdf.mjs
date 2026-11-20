// Builds the "Zero to CPL" brochure: public/guides/earnwings-zero-to-cpl.pdf
//
//   npm run route:pdf
//
// A landscape A4 brochure drawn entirely in code (HTML + SVG, no photos, no
// generated images): cover, the one-page route map, one page per stage, costs at
// a glance, where EarnWings helps, and sources. Every fact comes from
// src/content/zeroToCpl.js, which restates facts already sourced in
// src/content/guides.js. The aircraft is the ONE shared A320 drawing
// (src/content/airliner.js). Needs the Playwright Chromium browser.
import { writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import {
  WAYPOINTS, MAIN, BRANCH, SUMMARY, COST_NOTE, ROUTE_DISCLAIMER, ROUTE_UPDATED, OFFICIAL_FEES, TYPICAL_RANGES,
} from "../src/content/zeroToCpl.js";
import { GUIDES } from "../src/content/guides.js";
import { airlinerTopSvg, airlinerSideSvg } from "../src/content/airliner.js";

const ORIGIN = "https://earnwings.org";
const PAGE = "/how-to-become-a-pilot-in-india";
const OUT = join("public", "guides", "earnwings-zero-to-cpl.pdf");
const NAVY = "#1B3A7A", GOLD = "#C9A227", INK = "#0D1629", BODY = "#3D4F75", MUTED = "#5B6B8C";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const url = (href) => (href.startsWith("#") ? `${ORIGIN}${PAGE}${href}` : `${ORIGIN}${href}`);
const short = (href) => url(href).replace("https://", "");
const W = (id) => WAYPOINTS.find((w) => w.id === id);

const chip = (c) => `<span class="chip ${c.kind}">${esc(c.t)}</span>`;
const time = (t) => `<span class="chip time">◷ ${esc(t)}</span>`;

// ------------------------------------------------------------------ helpers
function smooth(p) {
  let d = `M${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] ?? p[i], b = p[i], c = p[i + 1], e = p[i + 2] ?? c;
    d += ` C${(b.x + (c.x - a.x) / 6).toFixed(1)} ${(b.y + (c.y - a.y) / 6).toFixed(1)} ${(c.x - (e.x - b.x) / 6).toFixed(1)} ${(c.y - (e.y - b.y) / 6).toFixed(1)} ${c.x} ${c.y}`;
  }
  return d;
}

/** Progress strip: the 11 stops, the current ones highlighted. */
function strip(on) {
  const xs = MAIN.map((_, i) => 14 + i * 40);
  return `<svg class="strip" viewBox="0 0 430 28" width="430" height="28">
    <path d="M14 14 H${xs[xs.length - 1]}" stroke="${NAVY}" stroke-opacity=".3" stroke-width="2" stroke-dasharray="1 6" stroke-linecap="round"/>
    ${MAIN.map((w, i) => {
      const hit = on.includes(w.id);
      return `<circle cx="${xs[i]}" cy="14" r="10" fill="${hit ? NAVY : "#fff"}" stroke="${NAVY}" stroke-width="1.8"/><text x="${xs[i]}" y="18" text-anchor="middle" font-size="10" font-weight="800" fill="${hit ? "#F5D97A" : NAVY}" font-family="Archivo">${w.n}</text>`;
    }).join("")}
  </svg>`;
}

const foot = (n) => `<div class="foot"><span><b class="ew"><i>EARN</i>WINGS</b> · Zero to CPL · checked ${esc(ROUTE_UPDATED)} · independent, not affiliated with DGCA</span><span>${n}</span></div>`;

// ------------------------------------------------------------------ 1. cover
function cover() {
  // a climbing route across the page with the 11 stops as dots
  const pts = MAIN.map((_, i) => ({ x: 70 + i * 96, y: 560 - Math.pow(i / 10, 1.6) * 330 }));
  const d = smooth(pts);
  const plane = pts[10];
  return `<section class="page cover">
    <div class="sun"></div>
    <div class="cloud c1"></div><div class="cloud c2"></div><div class="cloud c3"></div>
    <div class="brand"><b class="ew"><i>EARN</i>WINGS</b><span>Free pilot guide</span></div>
    <div class="cover-t">
      <span class="eyebrow">Route map · India · ${esc(ROUTE_UPDATED.replace(/^\d+ /, ""))}</span>
      <h1>Zero <em>to</em> CPL</h1>
      <p>How to become a pilot in India, from Class 12 to the right-hand seat, on one map: every stop, the typical time and the cost.</p>
    </div>
    <svg class="cover-route" viewBox="0 0 1123 794" width="1123" height="794">
      <path d="${d}" fill="none" stroke="${NAVY}" stroke-opacity=".35" stroke-width="3" stroke-dasharray="1 11" stroke-linecap="round"/>
      <path d="${smooth(pts.slice(0, 8))}" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linecap="round"/>
      ${pts.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="${i === 10 ? 15 : 11}" fill="${i < 8 ? NAVY : i === 10 ? GOLD : "#fff"}" stroke="${i === 10 ? GOLD : NAVY}" stroke-width="2.5"/><text x="${p.x}" y="${p.y + 4.5}" text-anchor="middle" font-size="12" font-weight="800" font-family="Archivo" fill="${i < 8 ? "#F5D97A" : i === 10 ? "#2a1d00" : NAVY}">${i + 1}</text>`).join("")}
      <g transform="translate(${pts[8].x + 10} ${pts[8].y - 70}) rotate(-17)"><g transform="scale(-1 1)">${airlinerSideSvg(4.2)}</g></g>
    </svg>
    <div class="cover-facts">
      ${SUMMARY.slice(0, 2).map((s) => `<div><b>${esc(s.v)}</b><span>${esc(s.k)}${s.k === "Time" ? ": from joining a school to a CPL, commonly" : ", typical"}</span></div>`).join("")}
      <div><b>11 stops</b><span>with official fees exact and typical ranges marked</span></div>
    </div>
    <p class="cover-small">EARNWINGS is independent and not affiliated with DGCA. Always confirm on the official page before you apply or pay. earnwings.org${PAGE}</p>
  </section>`;
}

// ------------------------------------------------------------------ 2. route map
function routeMap() {
  // 4 columns x 3 rows, winding; the destination spans two cells.
  const X0 = 64, CW = 230, GX = 26, Y = [128, 345, 548];
  const cells = MAIN.map((w, k) => {
    const row = Math.floor(k / 4), pos = k % 4;
    const col = row % 2 === 0 ? pos : 3 - pos;
    const span = k === MAIN.length - 1 ? 2 : 1;
    const x = X0 + col * (CW + GX);
    return { w, x, y: Y[row], width: CW * span + GX * (span - 1), mx: x + (CW * span + GX * (span - 1)) / 2 };
  });
  const m = cells.map((c) => ({ x: c.mx, y: c.y }));
  let d = `M${m[0].x} ${m[0].y}`;
  for (let i = 0; i < m.length - 1; i++) {
    const a = m[i], b = m[i + 1];
    if (Math.abs(a.y - b.y) < 2) d += ` C${a.x + (b.x - a.x) * 0.35} ${a.y - 14} ${b.x - (b.x - a.x) * 0.35} ${b.y - 14} ${b.x} ${b.y}`;
    else { const s = a.x > 560 ? 1 : -1; const r = 190; d += ` C${a.x + s * r} ${a.y} ${b.x + s * r} ${b.y} ${b.x} ${b.y}`; }
  }
  const si = MAIN.findIndex((w) => w.id === "school");
  const conv = { x: (m[si].x + m[si + 1].x) / 2, y: m[si].y - 40 };
  const branch = smooth([m[si], conv, m[si + 1]]);
  const plane = { x: (m[1].x + m[2].x) / 2, y: m[1].y - 11 };
  return `<section class="page map">
    <header class="ph"><div><span class="eyebrow">The route on one map</span><h2>Eleven stops from Class 12 to <em>first officer</em></h2></div>
      <div class="legend"><span class="chip official">₹ Official fee, exact</span><span class="chip typical">₹ Typical range, not official</span><span class="lg-branch"></span><span>Trained abroad: rejoins at conversion</span></div></header>
    <svg class="map-svg" viewBox="0 0 1123 794" width="1123" height="794">
      <path d="${branch}" fill="none" stroke="${GOLD}" stroke-width="2.5" stroke-dasharray="7 7" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="${NAVY}" stroke-opacity=".35" stroke-width="2.6" stroke-dasharray="1 9" stroke-linecap="round"/>
    </svg>
    ${cells.map((c) => `<div class="mc${c.w.id === "fo" ? " dest" : ""}" style="left:${c.x}px;top:${c.y}px;width:${c.width}px">
      <span class="mk">${c.w.n}</span>
      <b>${esc(c.w.title)}</b>
      <div class="chips">${time(c.w.time)}${chip(c.w.cost)}${c.w.id === "school" ? chip(c.w.extra) : ""}</div>
      ${c.w.ew ? `<p class="ewline">✦ EarnWings: ${esc(c.w.ew.t)}</p>` : ""}
    </div>`).join("")}
    <div class="mc conv" style="left:${conv.x - 150}px;top:${conv.y - 66}px;width:300px"><b>${esc(BRANCH.title)}</b><div class="chips">${time(BRANCH.time)}${chip(BRANCH.cost)}</div></div>
    <span class="mk convmk" style="left:${conv.x}px;top:${conv.y}px">⇄</span>
    <svg class="plane" viewBox="0 0 1123 794" width="1123" height="794"><g transform="translate(${plane.x} ${plane.y}) rotate(90)">${airlinerTopSvg(1.5)}</g></svg>
    <div class="sumbar">${SUMMARY.map((s) => `<div><span>${esc(s.k)}</span><b>${esc(s.v)}</b></div>`).join("")}</div>
    ${foot(2)}
  </section>`;
}

// ------------------------------------------------------------------ stage pages
function stopCard(w, big = false) {
  return `<article class="sc${w.branch ? " conv" : ""}${big ? " big" : ""}">
    <div class="sc-h"><span class="mk">${w.branch ? "⇄" : w.n}</span><div><span class="eyebrow">${esc(w.branch ? "Abroad branch" : w.stage)}</span><h3>${esc(w.title)}</h3></div></div>
    <div class="chips">${time(w.time)}${chip(w.cost)}${w.extra ? chip(w.extra) : ""}</div>
    <p>${esc(w.body)}</p>
    <div class="first"><b>What to do first</b>${esc(w.first)}</div>
    <p class="more">Read more: <a href="${url(w.more.href)}">${esc(short(w.more.href))}</a></p>
    ${w.ew ? `<p class="ewline">✦ <b>Where EarnWings helps:</b> ${esc(w.ew.t)}</p>` : ""}
  </article>`;
}

function stage(n, title, sub, ids, extra = "", pageNo) {
  return `<section class="page stage">
    <header class="ph"><div><span class="eyebrow">Stage ${n} of 4</span><h2>${title}</h2><p class="sub">${esc(sub)}</p></div>${strip(ids)}</header>
    <div class="grid g${ids.length}${extra ? " withx" : ""}">${ids.map((id) => stopCard(W(id))).join("")}${extra}</div>
    ${foot(pageNo)}
  </section>`;
}

const papersBox = `<aside class="x"><span class="eyebrow">The five DGCA papers</span>
  <ol class="papers"><li>Air Regulations</li><li>Air Navigation</li><li>Aviation Meteorology</li><li>Technical General</li><li>Technical Specific</li></ol>
  <p>The RTR written is a sixth exam on the same portal, but it belongs to the radio licence. Regular sessions: four a year; on demand: eight a year.</p>
  <span class="eyebrow" style="margin-top:10px">RTR at a glance</span>
  <table class="mini"><tr><th></th><th>Written</th><th>Practical</th></tr><tr><td>Format</td><td>50 questions</td><td>About 30 min</td></tr><tr><td>Pass</td><td>70%</td><td>50%</td></tr><tr><td>Fee</td><td>₹2,000</td><td>₹500</td></tr></table>
  <p>Licence issue ₹5,000. Valid until age 80.</p></aside>`;

const hoursBox = (() => {
  const bars = [["Total flight time", 200, NAVY], ["Pilot in command", 100, "#5BA4E8"], ["Cross-country as PIC", 20, GOLD], ["Instrument time", 10, "#7C5CD6"], ["Night flying", 5, "#E0607E"]];
  return `<aside class="x"><span class="eyebrow">What the 200 CPL hours must include</span>
  <svg viewBox="0 0 220 200" width="100%" style="margin-top:8px">${bars.map(([l, h, c], i) => `<text x="0" y="${14 + i * 39}" font-size="11.5" fill="${BODY}" font-weight="600">${l}</text><rect x="0" y="${20 + i * 39}" width="170" height="10" rx="5" fill="#E8EFFA"/><rect x="0" y="${20 + i * 39}" width="${Math.max(7, (h / 200) * 170)}" height="10" rx="5" fill="${c}"/><text x="178" y="${30 + i * 39}" font-size="12" font-weight="800" fill="${INK}">${h} h</text>`).join("")}</svg>
  <p>Minimums from the licence schedule, carried over unchanged into the Bharatiya Vayuyan Niyam, 2026 (in force from 1 January 2027). Most students fly more. The cross-country includes one flight of at least 300 nm with landings at two other aerodromes.</p></aside>`;
})();

// ------------------------------------------------------------------ costs
function costs() {
  const max = 80, x0 = 250, wpx = 280;
  const sx = (v) => x0 + (v / max) * wpx;
  return `<section class="page costs">
    <header class="ph"><div><span class="eyebrow">Costs at a glance</span><h2>What it costs, <em>start to finish</em></h2><p class="sub">${esc(COST_NOTE)}</p></div></header>
    <div class="cost-grid">
      <div class="panel"><span class="eyebrow">Typical ranges, ₹ lakh (not official)</span>
        <svg viewBox="0 0 640 ${TYPICAL_RANGES.length * 56 + 40}" width="100%">
          ${[0, 20, 40, 60, 80].map((v) => `<line x1="${sx(v)}" x2="${sx(v)}" y1="8" y2="${TYPICAL_RANGES.length * 56 + 8}" stroke="${NAVY}" stroke-opacity=".1"/><text x="${sx(v)}" y="${TYPICAL_RANGES.length * 56 + 28}" font-size="11" text-anchor="middle" fill="${MUTED}">₹${v}L</text>`).join("")}
          ${TYPICAL_RANGES.map((r, i) => { const y = 18 + i * 56; const all = r.l.includes("all-in"); return `<text x="0" y="${y + 14}" font-size="12.5" font-weight="${all ? 800 : 600}" fill="${INK}">${esc(r.l)}</text><rect x="${sx(r.lo)}" y="${y}" width="${Math.max(8, sx(r.hi) - sx(r.lo))}" height="20" rx="10" fill="${all ? NAVY : "#FFF1CC"}" stroke="${all ? NAVY : GOLD}" stroke-width="1.5" ${all ? "" : 'stroke-dasharray="4 3"'}/><text x="${sx(r.hi) + 8}" y="${y + 15}" font-size="12.5" font-weight="800" fill="${INK}">₹${r.lo}–${r.hi} lakh</text>`; }).join("")}
        </svg>
        <p class="small">Time: commonly 18 to 24 months from joining a school to a CPL in India, longer if weather or aircraft shortages slow the flying. Plus living costs for the whole period, medicals' test charges and travel, and any retakes.</p>
      </div>
      <div class="panel"><span class="eyebrow">Official fees (exact)</span>
        <table class="fees">${OFFICIAL_FEES.map(([a, b, c]) => `<tr><td>${esc(a)}<small>${esc(c)}</small></td><td>${esc(b)}</td></tr>`).join("")}</table>
        <p class="small">IAF centre fees; private examiners and civil hospitals set their own. ELP training and test fees are set by the approved organisation, not DGCA. FRTOL issue on eGCA ₹5,000.</p>
      </div>
    </div>
    ${foot(7)}
  </section>`;
}

// ------------------------------------------------------------------ EarnWings
function helps() {
  const tiles = MAIN.filter((w) => w.ew).map((w) => `<div class="tile"><span class="mk">${w.n}</span><div><span class="eyebrow">At stop ${w.n}: ${esc(w.short)}</span><b>${esc(w.ew.t.charAt(0).toUpperCase() + w.ew.t.slice(1))}</b><a href="${url(w.ew.href)}">${esc(short(w.ew.href))}</a></div></div>`).join("");
  return `<section class="page helps">
    <header class="ph"><div><span class="eyebrow">Where EarnWings helps</span><h2>A study app for <em>the stops you study for</em></h2>
    <p class="sub">EarnWings is an independent study app. We are not a flying school or a ground school, and we do not arrange medicals, exams, licences or jobs. Here is where it fits on the route, and nothing more.</p></div></header>
    <div class="tiles">${tiles}</div>
    <div class="free"><b>Free for everyone, no account needed:</b> this route map, the Pilot Guide (medicals, eGCA, Pariksha, RTR and a glossary) and the live aircraft view of Indian airports. <a href="${ORIGIN}/guide">earnwings.org/guide</a></div>
    <svg class="helps-plane" viewBox="0 0 400 140" width="400" height="140"><path d="M10 120 C120 120 220 90 360 30" fill="none" stroke="${NAVY}" stroke-opacity=".3" stroke-width="2.5" stroke-dasharray="1 9" stroke-linecap="round"/><g transform="translate(330 44) rotate(-22)"><g transform="scale(-1 1)">${airlinerSideSvg(2.6)}</g></g></svg>
    ${foot(8)}
  </section>`;
}

// ------------------------------------------------------------------ sources
function sources() {
  const seen = new Set();
  const list = [];
  for (const slug of ["pilot-pathway", "medical", "egca", "pariksha", "rtr"]) {
    for (const s of GUIDES.find((g) => g.slug === slug).sources) {
      if (seen.has(s.url)) continue;
      seen.add(s.url);
      list.push(s);
    }
  }
  return `<section class="page sources">
    <header class="ph"><div><span class="eyebrow">Check it yourself</span><h2>Official sources</h2><p class="sub">Every rule and official fee in this brochure is in EarnWings' Pilot Guide with a link to one of these pages. Last checked ${esc(ROUTE_UPDATED)}. If anything differs, the official page is right.</p></div></header>
    <ol class="src">${list.slice(0, 30).map((s) => `<li><a href="${esc(s.url)}">${esc(s.label)}</a></li>`).join("")}</ol>
    <div class="disc"><b>Independent, not affiliated with DGCA.</b> ${esc(ROUTE_DISCLAIMER)} Costs and timelines not set by any regulator are typical ranges as of November 2026, labelled as such. From 1 January 2027 the Bharatiya Vayuyan Niyam, 2026 replace the Aircraft Rules, 1937 and the RTR Rules 2025; the pilot-licence ages, education, 200-hour breakdown, exam subjects and fees are the same in the new text, but CARs and forms may be reissued, so check the date on any official page you rely on.</div>
    <p class="made">Drawn in code by EarnWings (Cephionix Software Developer OPC Pvt Ltd). Read the full guide: <a href="${ORIGIN}${PAGE}">earnwings.org${PAGE}</a></p>
    ${foot(9)}
  </section>`;
}

// ------------------------------------------------------------------ CSS
const CSS = `
@page{size:297mm 210mm;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:Inter,system-ui,sans-serif;color:${BODY}}
.page{position:relative;width:1123px;height:794px;overflow:hidden;page-break-after:always;break-after:page;
  background:linear-gradient(180deg,#E3F0FF 0%,#F4F9FF 34%,#FFFFFF 70%);padding:40px 56px}
h1,h2,h3,b.ew{font-family:Archivo,Inter,sans-serif;letter-spacing:-.02em;color:${INK};margin:0}
h2{font-size:30px;line-height:1.08;font-weight:800;margin-top:6px}
h2 em,h1 em{font-style:normal;color:#a47610}
.eyebrow{display:block;font:600 10px/1.3 "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#8a6a12}
.sub{margin:8px 0 0;font-size:13px;line-height:1.5;max-width:640px}
.ph{display:flex;justify-content:space-between;align-items:flex-start;gap:24px}
b.ew{font-weight:800;color:${NAVY};letter-spacing:.04em}b.ew i{font-style:normal;color:#B8901A}
.chip{display:inline-block;font-size:10.5px;font-weight:700;line-height:1.3;border-radius:7px;padding:2.5px 7px;margin:0 4px 4px 0}
.chip.time{background:#E4F1FD;color:#1c5a96}.chip.official{background:#FFF1CC;color:#6b5208}
.chip.typical{background:#fff;color:#6b5208;border:1.3px dashed rgba(201,162,39,.85);padding:1.5px 6px}.chip.note{background:#EEF2F8;color:${MUTED}}
.mk{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:#fff;border:2.4px solid ${NAVY};color:${NAVY};font:800 13px/1 Archivo,sans-serif;flex:none}
.foot{position:absolute;left:56px;right:56px;bottom:18px;display:flex;justify-content:space-between;font-size:9px;color:${MUTED};border-top:1px solid rgba(27,58,122,.12);padding-top:7px}
.foot b.ew{font-size:9px}
.ewline{margin:6px 0 0;font-size:10.5px;line-height:1.35;color:#2a4a8a;background:#F2F7FF;border-radius:7px;padding:4px 7px}
a{color:${NAVY}}
/* cover */
.cover{background:linear-gradient(180deg,#BFDCFB 0%,#DCEBFF 40%,#F7FBFF 78%,#FFFFFF 100%)}
.sun{position:absolute;right:120px;top:70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,236,170,.95),rgba(255,236,170,0) 70%)}
.cloud{position:absolute;border-radius:999px;background:#fff;opacity:.9;filter:blur(1px)}
.cloud::before,.cloud::after{content:"";position:absolute;background:#fff;border-radius:50%}
.c1{left:640px;top:120px;width:220px;height:46px}.c1::before{left:40px;top:-30px;width:90px;height:80px}.c1::after{left:110px;top:-20px;width:70px;height:60px}
.c2{left:860px;top:300px;width:170px;height:36px;opacity:.8}.c2::before{left:30px;top:-24px;width:70px;height:62px}.c2::after{left:85px;top:-14px;width:54px;height:46px}
.c3{left:420px;top:640px;width:260px;height:44px;opacity:.7}.c3::before{left:50px;top:-28px;width:96px;height:80px}.c3::after{left:140px;top:-18px;width:70px;height:60px}
.brand{position:relative;z-index:2;display:flex;align-items:baseline;gap:12px}.brand b.ew{font-size:20px}.brand span{font-size:12px;color:${MUTED};font-weight:600}
.cover-t{position:relative;z-index:2;margin-top:50px;max-width:560px}
.cover h1{font-size:104px;line-height:.9;font-weight:800;letter-spacing:-.045em;margin-top:12px}
.cover-t p{font-size:18px;line-height:1.5;color:${BODY};margin:18px 0 0}
.cover-route{position:absolute;left:0;top:0;z-index:1}
.cover-facts{position:absolute;z-index:2;left:56px;bottom:74px;display:flex;gap:14px}
.cover-facts div{background:rgba(255,255,255,.88);border:1px solid rgba(27,58,122,.1);border-radius:16px;padding:12px 16px;width:220px}
.cover-facts b{display:block;font:800 26px/1.05 Archivo,sans-serif;color:${INK}}.cover-facts div:first-child b{color:${NAVY}}
.cover-facts span{font-size:11px;line-height:1.35;color:${MUTED}}
.cover-small{position:absolute;left:56px;bottom:26px;margin:0;font-size:9.5px;color:${MUTED};z-index:2}
/* map */
.map .ph{position:relative;z-index:2}
.legend{display:flex;align-items:center;flex-wrap:wrap;gap:6px 8px;font-size:10.5px;color:${MUTED};max-width:330px;justify-content:flex-end;margin-top:14px}
.lg-branch{display:inline-block;width:26px;border-top:2.5px dashed ${GOLD}}
.map-svg,.plane{position:absolute;left:0;top:0}
.plane{z-index:4;filter:drop-shadow(0 6px 4px rgba(27,58,122,.3))}
.mc{position:absolute;z-index:2;background:#fff;border:1px solid rgba(27,58,122,.13);border-radius:14px;padding:20px 12px 9px;box-shadow:0 14px 26px -22px rgba(27,58,122,.6)}
.mc .mk{position:absolute;left:50%;top:0;transform:translate(-50%,-50%);width:28px;height:28px;font-size:12px}
.mc>b{display:block;font:800 13px/1.22 Archivo,sans-serif;color:${INK};margin-bottom:6px}
.mc .chip{font-size:9.5px;padding:2px 6px;margin:0 3px 3px 0}.mc .chip.typical{padding:1px 5px}
.mc .ewline{font-size:9.5px;padding:3px 6px;margin-top:3px}
.mc.dest{border-color:rgba(201,162,39,.6);background:linear-gradient(180deg,#FFFBEF,#fff)}.mc.dest .mk{border-color:${GOLD};background:${GOLD};color:#2a1d00}
.mc.conv{border-style:dashed;border-color:rgba(201,162,39,.75);background:#FFFDF6;padding:8px 12px 5px}
.convmk{position:absolute;z-index:3;transform:translate(-50%,-50%);width:24px;height:24px;border-color:${GOLD};border-style:dashed;color:#8a6a12;font-size:12px}
.sumbar{position:absolute;left:56px;right:56px;bottom:44px;display:grid;grid-template-columns:repeat(4,1fr);border-radius:14px;overflow:hidden;border:1px solid rgba(27,58,122,.12);background:#fff;z-index:2}
.sumbar div{padding:8px 14px;border-left:1px solid rgba(27,58,122,.1)}.sumbar div:first-child{background:${NAVY};border:0}
.sumbar span{display:block;font:600 8.5px/1.3 "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:${MUTED}}
.sumbar b{font:800 20px/1.1 Archivo,sans-serif;color:${INK}}.sumbar div:first-child b{color:#F5D97A}.sumbar div:first-child span{color:#A9C0E6}
/* stages */
.strip{flex:none;margin-top:12px}
.grid{display:grid;gap:16px;margin-top:22px}
.g1{grid-template-columns:1fr}.g2{grid-template-columns:1fr 1fr}.g3{grid-template-columns:repeat(3,1fr)}.g4{grid-template-columns:repeat(4,1fr)}
.g2.withx{grid-template-columns:1fr 1fr 0.92fr}.g3.withx{grid-template-columns:1fr 1fr 1fr 0.95fr}
.sc{background:#fff;border:1px solid rgba(27,58,122,.12);border-radius:18px;padding:16px 16px 14px;box-shadow:0 18px 30px -26px rgba(27,58,122,.6)}
.sc.conv{border-style:dashed;border-color:rgba(201,162,39,.75);background:#FFFDF6}.sc.conv .mk{border-color:${GOLD};border-style:dashed;color:#8a6a12}
.sc-h{display:flex;gap:10px;align-items:flex-start;margin-bottom:10px}
.sc h3{font-size:16.5px;line-height:1.2;font-weight:800;margin-top:3px}
.sc p{font-size:11.5px;line-height:1.5;margin:6px 0 0}
.first{margin-top:9px;background:#FBF8EE;border-radius:10px;padding:8px 10px;font-size:11.2px;line-height:1.45;color:${INK}}
.first b{display:block;font:600 9px/1.3 "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:#8a6a12;margin-bottom:3px}
.sc .more{font-size:10.5px;color:${MUTED}}.sc .more a{font-weight:700}
.x{background:rgba(255,255,255,.75);border:1px solid rgba(27,58,122,.1);border-radius:18px;padding:16px;font-size:11.5px;line-height:1.5}
.x p{margin:8px 0 0}
.papers{margin:8px 0 0;padding-left:20px;font:700 13px/1.75 Archivo,sans-serif;color:${INK}}
.mini{width:100%;border-collapse:collapse;margin-top:6px;font-size:11px}.mini th{text-align:left;color:${MUTED};font-weight:700;font-size:10px}.mini td,.mini th{padding:3px 4px;border-bottom:1px solid rgba(27,58,122,.08)}
/* costs */
.cost-grid{display:grid;grid-template-columns:1.25fr 1fr;gap:18px;margin-top:20px}
.panel{background:#fff;border:1px solid rgba(27,58,122,.12);border-radius:18px;padding:16px 18px}
.panel svg{margin-top:8px;font-family:Inter,sans-serif}
.small{font-size:10.5px;line-height:1.5;color:${MUTED};margin:8px 0 0}
.fees{width:100%;border-collapse:collapse;margin-top:8px}.fees td{padding:6px 2px;border-bottom:1px solid rgba(27,58,122,.08);font-size:12px;color:${INK};vertical-align:top}
.fees td:last-child{text-align:right;font-weight:800;white-space:nowrap;color:#6b5208}.fees small{display:block;font-size:9.5px;color:${MUTED}}
/* helps */
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:26px;max-width:860px}
.tile{display:flex;gap:12px;background:#fff;border:1px solid rgba(27,58,122,.12);border-radius:18px;padding:16px}
.tile b{display:block;font:800 17px/1.25 Archivo,sans-serif;color:${INK};margin:4px 0}.tile a{font-size:11px;font-weight:700}
.free{margin-top:22px;max-width:860px;background:${NAVY};color:#D5E1F5;border-radius:16px;padding:14px 18px;font-size:12.5px;line-height:1.5}.free b{color:#F5D97A}.free a{color:#fff}
.helps-plane{position:absolute;right:50px;bottom:60px}
/* sources */
.src{columns:2;column-gap:30px;margin:18px 0 0;padding-left:18px;font-size:10.4px;line-height:1.45}.src li{break-inside:avoid;margin-bottom:4px}.src a{text-decoration:none;color:${NAVY}}
.disc{margin-top:16px;background:#F2F7FF;border:1px solid rgba(46,107,229,.22);border-radius:14px;padding:11px 14px;font-size:10.6px;line-height:1.5}.disc b{color:${INK}}
.made{font-size:10px;color:${MUTED};margin:10px 0 0}
`;

const html = `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><title>Zero to CPL: EarnWings route map</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>
${cover()}
${routeMap()}
${stage(1, "Before you pay for <em>anything</em>", "Check you qualify, get your two free DGCA IDs and clear both medicals first: a medical problem is the one thing money cannot fix.", ["class12", "ids", "class2", "class1"], "", 3)}
${stage(2, "Theory and <em>the radio</em>", "The five DGCA papers on Pariksha, then the RTR radio licence and English proficiency. You can study while you fly; these are the parts you sit on paper and on the radio.", ["papers", "rtr"], papersBox, 4)}
${stage(3, "Flying, and <em>the licence</em>", "A DGCA-approved school in India, or a school abroad and a conversion back home. Both roads meet at the CPL.", ["school", "conversion", "cpl"], hoursBox, 5)}
${stage(4, "To the <em>airline</em>", "Selection, a type rating when an airline asks for one, then induction and the right-hand seat.", ["selection", "type", "fo"], "", 6)}
${costs()}
${helps()}
${sources()}
</body></html>`;

mkdirSync(join("public", "guides"), { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1123, height: 794 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  if (process.env.ROUTE_PDF_PNG) {
    await page.screenshot({ path: process.env.ROUTE_PDF_PNG, fullPage: true });
  }
  const pdf = await page.pdf({ width: "297mm", height: "210mm", printBackground: true, preferCSSPageSize: true });
  const doc = await PDFDocument.load(pdf);
  doc.setTitle("Zero to CPL: how to become a pilot in India (EarnWings route map)");
  doc.setAuthor("EarnWings (Cephionix)");
  doc.setSubject("The route from Class 12 to airline first officer in India: every stop, typical time and cost, official fees and sources.");
  doc.setKeywords(["DGCA", "CPL", "pilot", "India", "EarnWings", "route map"]);
  doc.setCreator(`earnwings.org${PAGE}`);
  doc.setProducer("EarnWings route:pdf");
  const bytes = await doc.save();
  writeFileSync(OUT, bytes);
  console.log(`route:pdf: ${OUT}  ${doc.getPageCount()} pages  ${(bytes.length / 1024).toFixed(0)} KB`);
  const dl = join(homedir(), "Downloads");
  if (existsSync(dl)) {
    copyFileSync(OUT, join(dl, "EarnWings_Zero_to_CPL.pdf"));
    console.log(`route:pdf: copied to ${join(dl, "EarnWings_Zero_to_CPL.pdf")}`);
  }
} finally {
  await browser.close();
}
