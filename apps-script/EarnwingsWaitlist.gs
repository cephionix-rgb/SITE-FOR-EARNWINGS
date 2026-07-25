/**
 * ============================================================================
 * EARNWINGS — Founder Waitlist backend (Google Apps Script)
 * ============================================================================
 * Records waitlist sign-ups in a Google Sheet (open to all — no hard cap),
 * emails a branded welcome, and hands back the founder perk bundle. No server needed.
 *
 * ── HOW TO DEPLOY ──────────────────────────────────────────────────────────
 * 1. script.google.com ▸ New project (standalone is fine) — OR a Sheet's
 *    Extensions ▸ Apps Script (bound). Either works.
 * 2. Delete any sample code, paste THIS whole file, and Save (💾).
 * 3. Deploy ▸ New deployment ▸ (gear) Web app.
 *      - Execute as:       Me
 *      - Who has access:   Anyone           ← important
 *    Deploy, then authorise (it needs Sheets + Drive access).
 * 4. Copy the "Web app URL" (ends in /exec) — that's the link.
 *
 * No Sheet needed up front: a standalone project auto-creates a spreadsheet
 * called "EARNWINGS Waitlist" in your Drive and remembers it. The "Waitlist"
 * tab + header row are created on the first hit.
 *
 * ── AFTER YOU EDIT THIS CODE ────────────────────────────────────────────────
 * The /exec URL keeps serving the OLD code until you publish a new version:
 *   Deploy ▸ Manage deployments ▸ (pencil) Edit ▸ Version: "New version" ▸ Deploy.
 * The URL stays the same. Re-authorise if prompted.
 * ============================================================================
 */

// ───────────────────────── CONFIG ─────────────────────────
var CAPACITY   = 200;          // "first 200" founder framing only — NOT a hard cap (registration stays open)
var PASS_MARK  = 8;            // "Cadet to Commander" quiz: correct answers (of 10) needed to double perks
var SHEET_NAME = 'Waitlist';
var SHEET_ID   = '';           // leave '' when this script lives inside the Sheet (Extensions ▸ Apps Script)
var SECRET     = '';           // optional anti-spam: set a string to require payload.secret to match ('' = off)

// The founder perk bundle EVERY waitlisted cadet unlocks (Cadet tier):
var PERKS = {
  tier:                  'cadet',
  fullAccessDays:        7,   // use the full app for one week
  rtSessions:            5,   // 5 RT (radio-telephony) sessions
  unlockedChapters:      5,   // first 5 chapters unlocked
  samplePapersPerSubject:1,   // 1 sample paper unlocked in every subject
  mcqChapters:           5,   // MCQs unlocked for those first 5 chapters
  flightPlans:           5,   // 5 flight plans
  captainDoubts:         5,   // 5 doubts to Ask Captain
  weightAndBalance:      5    // 5 weight & balance calculations
};

// Commander tier — earned by scoring 5+/10 on the "Cadet to Commander" quiz.
// Every 5 becomes 10, the week becomes 10 days; the 1 sample paper stays.
var COMMANDER_PERKS = {
  tier:                  'commander',
  fullAccessDays:        10,
  rtSessions:            10,
  unlockedChapters:      10,
  samplePapersPerSubject:1,
  mcqChapters:           10,
  flightPlans:           10,
  captainDoubts:         10,
  weightAndBalance:      10
};

// NOTE: Phone + "Would Pay" are appended at the END on purpose — the code reads
// rows by fixed index (email=3, code=6, perks=9, …), so new columns must not shift them.
var HEADERS = ['Joined At','Position','Name','Email','Exam Target','Source','Code','Status','Redeemed At','Perks (JSON)','Perk Tier','Quiz Score','Phone','Would Pay (/mo)'];

// Links used in the EARNWINGS welcome-email template.
var INSTAGRAM_URL = 'https://www.instagram.com/flywithearnwings/';
var SITE_URL      = 'https://earnwings.com';
var LOGO_URL      = 'https://earnwings.com/assets/logo-full.png'; // header logo (alt text falls back to "EARNWINGS")

// ───────────────────────── ENTRY POINTS ─────────────────────────

/** GET: ?action=stats (default) → seat count; ?action=status&email=..|&code=.. → one cadet. */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || 'stats';
    if (action === 'status') return _json(_status(e.parameter.email, e.parameter.code));
    return _json(_stats());
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

/** POST: default = join the waitlist; { action:'redeem', email|code } = activate perks + start the 1-week clock. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // serialise writes so positions never collide

    var body = {};
    try { body = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (_) { body = {}; }

    if (SECRET && body.secret !== SECRET) return _json({ ok: false, error: 'unauthorized' });
    if (body.company) return _json({ ok: false, error: 'rejected' }); // honeypot field

    if (body.action === 'redeem')  return _json(_redeem(body.email, body.code));
    if (body.action === 'upgrade') return _json(_upgrade(body));
    return _json(_join(body));
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

// ───────────────────────── CORE ─────────────────────────

function _join(body) {
  var email = String(body.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'invalid_email' };

  var sheet = _sheet();
  var rows  = sheet.getDataRange().getValues(); // [header, ...]
  var count = Math.max(0, rows.length - 1);

  // Already on the list? (dedupe by email — column index 3)
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][3]).trim().toLowerCase() === email) {
      return {
        ok: true, alreadyJoined: true,
        position: rows[i][1],
        code: rows[i][6],
        perks: _perks(rows[i][9]),
        remaining: Math.max(0, CAPACITY - count),
        capacity: CAPACITY
      };
    }
  }

  // No hard cap — registration stays open even past the first 200 founder cadets.
  var position = count + 1;
  var code     = 'EW-' + Utilities.getUuid().replace(/-/g, '').slice(0, 8).toUpperCase();
  var joinedAt = new Date().toISOString();
  var phone    = String(body.phone || '').trim();
  var wouldPay = String(body.subscription || body.wouldPay || '').trim();

  sheet.appendRow([
    joinedAt, position,
    String(body.name || ''), email,
    String(body.examTarget || ''), String(body.source || ''),
    code, 'waitlisted', '', JSON.stringify(PERKS), 'Cadet (5s)', '',
    phone, wouldPay
  ]);

  // Fire off the branded thank-you email (never let a mail hiccup fail the join).
  try { _sendWelcomeEmail(email, String(body.name || ''), position); } catch (_) {}

  return {
    ok: true, position: position, code: code, perks: PERKS,
    remaining: Math.max(0, CAPACITY - position), capacity: CAPACITY
  };
}

/** The EARNWINGS branded thank-you email, sent to every new founder cadet. */
function _sendWelcomeEmail(email, name, position) {
  var first = String(name || '').trim().split(' ')[0] || 'Cadet';
  var subject = 'Welcome aboard, ' + first + ' — you’re on the EARNWINGS founder waitlist ✈️';
  var seat = position ? ('Founder cadet #' + position) : 'Founder cadet';

  var perkItems = [
    'Full app access for 1 week',
    '5 radio-telephony (RT) practice sessions',
    'First 5 chapters unlocked',
    '1 sample paper in every subject',
    'MCQs for your first 5 chapters',
    '5 live flight plans',
    '5 Ask-Captain doubts',
    '5 weight & balance calculations'
  ].map(function (p) {
    return '<tr><td style="padding:5px 0;color:#2b3b57;font-size:14px;line-height:1.45;">' +
      '<span style="color:#C9981F;font-weight:800;">&#10003;</span>&nbsp;&nbsp;' + p + '</td></tr>';
  }).join('');

  var html =
  '<!doctype html><html><body style="margin:0;padding:0;background:#e9f1ff;">' +
    // hidden inbox-preview text
    '<div style="display:none;max-height:0;overflow:hidden;opacity:0;">You’re cleared for takeoff — welcome to the EARNWINGS founder waitlist.</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9f1ff;padding:28px 12px;font-family:Arial,Helvetica,sans-serif;">' +
      '<tr><td align="center">' +
        '<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 20px 60px -30px rgba(13,36,80,0.5);">' +
          // brand logo band
          '<tr><td align="center" style="padding:22px 30px 14px;background:#ffffff;">' +
            '<img src="' + LOGO_URL + '" alt="EARNWINGS" height="34" style="height:34px;display:inline-block;border:0;outline:none;text-decoration:none;">' +
          '</td></tr>' +
          // navy hero band
          '<tr><td style="background:linear-gradient(135deg,#0D2450 0%,#1B3A7A 100%);padding:26px 30px;text-align:center;">' +
            '<div style="color:#F5D97A;font-size:11px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;">&#9992; Founder waitlist &#183; confirmed</div>' +
            '<div style="margin-top:10px;color:#ffffff;font-size:24px;font-weight:800;line-height:1.2;">You’re cleared for takeoff, ' + first + '!</div>' +
            '<div style="margin-top:12px;display:inline-block;background:rgba(245,217,122,0.16);color:#F5D97A;font-size:12px;font-weight:700;padding:5px 14px;border-radius:999px;">' + seat + '</div>' +
          '</td></tr>' +
          // body
          '<tr><td style="padding:26px 30px 6px;">' +
            '<p style="margin:0 0 16px;color:#40506e;font-size:15px;line-height:1.65;">Thank you for joining the <b style="color:#1B3A7A;">EARNWINGS founder waitlist</b>. You’ll be among the very first in the cockpit when we open the doors — with founder perks waiting for you:</p>' +
            '<div style="margin:0 0 20px;padding:16px 18px;background:#f5f8ff;border:1px solid #e4ecfb;border-radius:12px;">' +
              '<div style="color:#9a7415;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">Your founder perks</div>' +
              '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + perkItems + '</table>' +
            '</div>' +
            '<p style="margin:0 0 18px;color:#40506e;font-size:15px;line-height:1.65;">We’ll email your boarding call the moment your seat opens. Until then, follow the journey for sneak peeks:</p>' +
            '<table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="padding:2px 0 24px;">' +
              '<a href="' + INSTAGRAM_URL + '" style="display:inline-block;background:linear-gradient(135deg,#F5D97A,#C9981F);color:#3d2c00;text-decoration:none;font-weight:800;font-size:15px;padding:13px 28px;border-radius:999px;">Follow @flywithearnwings on Instagram</a>' +
            '</td></tr></table>' +
          '</td></tr>' +
          // footer
          '<tr><td style="background:#0D2450;padding:20px 30px;text-align:center;color:#7690c0;font-size:12px;line-height:1.7;">' +
            '<a href="' + SITE_URL + '" style="color:#F5D97A;text-decoration:none;font-weight:700;">earnwings.com</a>' +
            '&nbsp;&nbsp;&#183;&nbsp;&nbsp;' +
            '<a href="' + INSTAGRAM_URL + '" style="color:#F5D97A;text-decoration:none;font-weight:700;">Instagram</a>' +
            '<div style="margin-top:8px;color:#5f79ad;">&#169; EARNWINGS &#183; Elevate your aviation journey &#183; Made for DGCA aspirants in India</div>' +
          '</td></tr>' +
        '</table>' +
      '</td></tr>' +
    '</table>' +
  '</body></html>';

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: html,
    name: 'EARNWINGS',
    replyTo: 'cephionix@gmail.com'
  });
}

/** The app calls this when a cadet redeems — flips them to active and starts the 7-day clock. */
function _redeem(email, code) {
  var found = _find(email, code);
  if (!found) return { ok: false, error: 'not_found' };
  var sheet = _sheet();
  var now = new Date();
  var redeemedAt = found.row[8];
  if (!redeemedAt) {
    redeemedAt = now.toISOString();
    sheet.getRange(found.rowNumber, 8).setValue('active');       // Status
    sheet.getRange(found.rowNumber, 9).setValue(redeemedAt);     // Redeemed At
  }
  var perks = _perks(found.row[9]);
  var expiresAt = new Date(new Date(redeemedAt).getTime() + (perks.fullAccessDays || 7) * 86400000).toISOString();
  return { ok: true, redeemedAt: redeemedAt, expiresAt: expiresAt, perks: perks, code: found.row[6], position: found.row[1] };
}

/** The "Cadet to Commander" quiz calls this on 5+/10 — doubles the perks on the cadet's row. */
function _upgrade(body) {
  if (Number(body.score || 0) < PASS_MARK) return { ok: false, error: 'score_too_low' };
  var f = _find(body.email, body.code);
  if (!f) return { ok: false, error: 'not_found' };
  var sheet = _sheet();
  sheet.getRange(f.rowNumber, 10).setValue(JSON.stringify(COMMANDER_PERKS));                    // Perks (JSON)
  sheet.getRange(f.rowNumber, 11).setValue('Commander (10s) ✅').setBackground('#B7E1CD')        // Perk Tier — marked + highlighted green
    .setFontWeight('bold');
  sheet.getRange(f.rowNumber, 12).setValue(Number(body.score || 0));                            // Quiz Score
  return { ok: true, tier: 'commander', perks: COMMANDER_PERKS, position: f.row[1], code: f.row[6] };
}

// ───────────────────────── HELPERS ─────────────────────────

function _sheet() {
  var ss = null;
  if (SHEET_ID) {
    ss = SpreadsheetApp.openById(SHEET_ID);
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet(); // set only when this script is BOUND to a Sheet
    if (!ss) {
      // Standalone script: create a Sheet once, then remember its id in Script Properties.
      var props = PropertiesService.getScriptProperties();
      var savedId = props.getProperty('WAITLIST_SHEET_ID');
      if (savedId) {
        ss = SpreadsheetApp.openById(savedId);
      } else {
        ss = SpreadsheetApp.create('EARNWINGS Waitlist');
        props.setProperty('WAITLIST_SHEET_ID', ss.getId());
      }
    }
  }
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  _ensureHeaders(sh);
  return sh;
}

/** Keep row 1 exactly equal to HEADERS (self-heals a Sheet that was made with older columns). */
function _ensureHeaders(sh) {
  var need = sh.getLastRow() === 0;
  if (!need) {
    var have = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), HEADERS.length)).getValues()[0];
    for (var k = 0; k < HEADERS.length; k++) { if (String(have[k]) !== HEADERS[k]) { need = true; break; } }
  }
  if (need) {
    sh.getRange(1, 1, 1, HEADERS.length)
      .setValues([HEADERS]).setFontWeight('bold').setBackground('#0D2450').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, HEADERS.length);
  }
}

function _stats() {
  var count = Math.max(0, _sheet().getLastRow() - 1);
  return { ok: true, count: count, remaining: Math.max(0, CAPACITY - count), capacity: CAPACITY };
}

function _status(email, code) {
  var f = _find(email, code);
  if (!f) return { ok: true, found: false };
  return {
    ok: true, found: true,
    position: f.row[1], name: f.row[2], email: String(f.row[3]).toLowerCase(),
    code: f.row[6], status: f.row[7], redeemedAt: f.row[8], perks: _perks(f.row[9])
  };
}

function _find(email, code) {
  var sheet = _sheet();
  var rows = sheet.getDataRange().getValues();
  email = String(email || '').trim().toLowerCase();
  code  = String(code  || '').trim().toUpperCase();
  for (var i = 1; i < rows.length; i++) {
    var em = String(rows[i][3]).trim().toLowerCase();
    var cd = String(rows[i][6]).trim().toUpperCase();
    if ((email && em === email) || (code && cd === code)) {
      return { row: rows[i], rowNumber: i + 1 }; // rowNumber is 1-based for getRange
    }
  }
  return null;
}

function _perks(v) { try { return JSON.parse(v); } catch (_) { return PERKS; } }

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
