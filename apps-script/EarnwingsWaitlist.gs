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
  unlockedChapters:      2,   // first 2 chapters unlocked in EVERY subject (all 5)
  samplePapersPerSubject:1,   // 1 sample paper unlocked in every subject
  mcqChapters:           2,   // MCQs for the first 2 chapters
  flightPlans:           5,   // 5 flight plans
  captainDoubts:         5,   // 5 doubts to Ask Captain
  weightAndBalance:      5    // 5 weight & balance calculations
};

// Commander tier — earned by scoring 5+/10 on the "Cadet to Commander" quiz.
// Every 5 becomes 10, the week becomes 10 days; chapters/MCQs double to the
// first 4 per subject; the 1 sample paper stays.
var COMMANDER_PERKS = {
  tier:                  'commander',
  fullAccessDays:        10,
  rtSessions:            10,
  unlockedChapters:      4,   // first 4 chapters unlocked in EVERY subject
  samplePapersPerSubject:1,
  mcqChapters:           4,   // MCQs for the first 4 chapters
  flightPlans:           10,
  captainDoubts:         10,
  weightAndBalance:      10
};

// NOTE: Phone + "Would Pay" are appended at the END on purpose — the code reads
// rows by fixed index (email=3, code=6, perks=9, …), so new columns must not shift them.
var HEADERS = ['Joined At','Position','Name','Email','Exam Target','Source','Code','Status','Redeemed At','Perks (JSON)','Perk Tier','Quiz Score','Phone','Would Pay (/mo)'];

// Links used in the EARNWINGS welcome-email template.
var INSTAGRAM_URL = 'https://www.instagram.com/flywithearnwings/';
var SITE_URL      = 'https://earnwings.org';
var LOGO_URL      = 'https://earnwings.org/assets/logo-full.png'; // header logo (alt text falls back to "EARNWINGS")

// ───────────────────────── ENTRY POINTS ─────────────────────────

/** GET: ?action=stats (default) → seat count; ?action=status&email=..|&code=.. → one cadet. */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || 'stats';
    if (action === 'status')   return _json(_status(e.parameter.email, e.parameter.code));
    if (action === 'selftest') return _json(_selftest(e.parameter.to)); // ← open /exec?action=selftest&to=you@mail.com
    return _json(_stats());
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

/**
 * Live mail check THROUGH THE DEPLOYED WEB APP (not just the editor).
 * Open in a browser:  <your /exec URL>?action=selftest&to=you@example.com
 * It returns whether the deployment can actually send, the exact error if not,
 * and the remaining Gmail quota — so "mail not sending" is never a mystery again.
 */
function _selftest(to) {
  var quota = -1;
  try { quota = MailApp.getRemainingDailyQuota(); } catch (_) {}
  to = String(to || '').trim();
  if (!to) { try { to = Session.getEffectiveUser().getEmail(); } catch (_) {} }
  if (!to) return { ok: false, error: 'no_recipient — add &to=you@example.com', remainingQuota: quota };
  var r = _sendWelcomeEmailSafe(to, 'Test Cadet', 0);
  return { ok: r.sent, sent: r.sent, error: r.error, to: to, remainingQuota: quota };
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

  // Fire off the branded thank-you email. Never let a mail hiccup fail the join,
  // but DO surface the result so failures are visible (not silently swallowed).
  var mail = _sendWelcomeEmailSafe(email, String(body.name || ''), position, code);

  return {
    ok: true, position: position, code: code, perks: PERKS,
    remaining: Math.max(0, CAPACITY - position), capacity: CAPACITY,
    emailSent: mail.sent, emailError: mail.error
  };
}

/**
 * Sends the welcome email but NEVER throws — returns { sent, error } instead.
 * If the deployment lacks the Gmail permission (the usual "mail not sending"
 * cause) or the daily quota is spent, you get a clear reason back rather than
 * a silent miss. Errors are also written to the Apps Script execution log.
 */
function _sendWelcomeEmailSafe(email, name, position, code) {
  try {
    if (MailApp.getRemainingDailyQuota() <= 0) {
      Logger.log('MAIL SKIPPED: daily quota exhausted (to ' + email + ')');
      return { sent: false, error: 'quota_exhausted' };
    }
    _sendWelcomeEmail(email, name, position, code);
    return { sent: true, error: '' };
  } catch (err) {
    Logger.log('MAIL ERROR to ' + email + ': ' + err);
    return { sent: false, error: String(err) };
  }
}

/** The EARNWINGS branded thank-you email, sent to every new founder cadet. */
function _sendWelcomeEmail(email, name, position, code) {
  var full      = String(name || '').trim();
  var first     = full.split(' ')[0] || 'Cadet';
  var passenger = full ? full : 'Future Captain';
  var ref       = String(code || '').trim() || 'EW-FOUNDER';
  var seat      = _seatFromCode(ref); // unique per cadet, derived from their boarding ref (not their waitlist position)
  var subject   = first + ', your EARNWINGS boarding pass is confirmed ✈️';
  var barcode   =
    '<div style="font-family:\'Courier New\',monospace;font-size:26px;line-height:1;letter-spacing:1px;color:#0D1629;">' +
    '&#9646;&#9647;&#9646;&#9646;&#9647;&#9646;&#9647;&#9647;&#9646;&#9647;&#9646;&#9646;&#9647;&#9646;&#9646;&#9647;&#9646;&#9647;&#9646;' +
    '</div>';

  var perkItems = [
    'Full app access for 1 week',
    '5 radio-telephony (RT) practice sessions',
    'First 2 chapters of all 5 subjects unlocked',
    '1 sample paper in every subject',
    'MCQs for your first 2 chapters',
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
    '<div style="display:none;max-height:0;overflow:hidden;opacity:0;">' + _esc(first) + ', your founder seat is confirmed — welcome aboard EARNWINGS.</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9f1ff;padding:28px 12px;font-family:Arial,Helvetica,sans-serif;">' +
      '<tr><td align="center">' +
        '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">' +

          // logo
          '<tr><td align="center" style="padding:4px 0 16px;">' +
            '<img src="' + LOGO_URL + '" alt="EARNWINGS" height="34" style="height:34px;display:inline-block;border:0;outline:none;text-decoration:none;">' +
          '</td></tr>' +

          // ===== THE BOARDING PASS =====
          '<tr><td>' +
            '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 22px 60px -30px rgba(13,36,80,0.55);">' +
              // header strip
              '<tr><td style="background:linear-gradient(135deg,#0D2450 0%,#1B3A7A 100%);padding:13px 22px;">' +
                '<table role="presentation" width="100%"><tr>' +
                  '<td align="left" style="color:#F5D97A;font-size:15px;font-weight:800;letter-spacing:0.5px;">&#9992;&#65039;&nbsp; EARNWINGS</td>' +
                  '<td align="right" style="color:#cdd8ef;font-size:11px;font-weight:800;letter-spacing:2.5px;">BOARDING PASS</td>' +
                '</tr></table>' +
              '</td></tr>' +
              // main + tear-off stub
              '<tr><td>' +
                '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
                  // MAIN
                  '<td valign="top" style="width:63%;padding:20px 22px;">' +
                    '<div style="color:#9a7415;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">Passenger</div>' +
                    '<div style="color:#0D1629;font-size:23px;font-weight:800;line-height:1.15;text-transform:uppercase;margin:3px 0 16px;">' + _esc(passenger) + '</div>' +
                    // route: Ground School --✈-- Your Wings
                    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
                      '<td valign="bottom" style="width:42%;">' +
                        '<div style="color:#9aa9c4;font-size:9px;font-weight:800;letter-spacing:1.5px;">FROM</div>' +
                        '<div style="color:#1B3A7A;font-size:15px;font-weight:800;">Ground School</div>' +
                      '</td>' +
                      '<td valign="bottom" align="center" style="width:16%;border-bottom:2px dotted #cbb06a;padding-bottom:5px;">' +
                        '<span style="font-size:17px;color:#C9981F;">&#9992;&#65039;</span>' +
                      '</td>' +
                      '<td valign="bottom" align="right" style="width:42%;">' +
                        '<div style="color:#9aa9c4;font-size:9px;font-weight:800;letter-spacing:1.5px;">TO</div>' +
                        '<div style="color:#1B3A7A;font-size:15px;font-weight:800;">Your Wings</div>' +
                      '</td>' +
                    '</tr></table>' +
                    // class / flight / status
                    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;"><tr>' +
                      '<td valign="top" style="width:34%;">' + _field('Class', 'Founder Cadet') + '</td>' +
                      '<td valign="top" style="width:30%;">' + _field('Flight', 'EW-001') + '</td>' +
                      '<td valign="top" style="width:36%;">' + _field('Status', 'Confirmed') + '</td>' +
                    '</tr></table>' +
                  '</td>' +
                  // STUB
                  '<td valign="top" align="center" style="width:37%;padding:20px 14px;background:#FFF8E6;border-left:2px dashed #E3CE93;">' +
                    '<div style="color:#9a7415;font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">Founder Cadet</div>' +
                    '<div style="color:#0D1629;font-size:30px;font-weight:800;line-height:1;margin:8px 0 2px;">' + _esc(seat) + '</div>' +
                    '<div style="color:#9aa9c4;font-size:9px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">Seat</div>' +
                    '<div style="margin:14px 0 6px;">' + barcode + '</div>' +
                    '<div style="color:#5f7499;font-size:10px;font-weight:700;letter-spacing:0.5px;">REF ' + _esc(ref) + '</div>' +
                  '</td>' +
                '</tr></table>' +
              '</td></tr>' +
            '</table>' +
          '</td></tr>' +

          '<tr><td style="height:14px;line-height:14px;font-size:0;">&nbsp;</td></tr>' +

          // ===== MESSAGE + PERKS =====
          '<tr><td style="background:#ffffff;border-radius:16px;box-shadow:0 22px 60px -34px rgba(13,36,80,0.5);padding:24px 26px;">' +
            '<div style="color:#0D1629;font-size:20px;font-weight:800;line-height:1.25;">Welcome aboard, ' + _esc(first) + '! &#9992;&#65039;</div>' +
            '<p style="margin:10px 0 16px;color:#40506e;font-size:15px;line-height:1.65;">Your <b style="color:#1B3A7A;">founder seat</b> on EARNWINGS is confirmed. You&#8217;ll be among the very first in the cockpit when we open the doors &#8212; and these founder perks are already loaded onto your boarding pass:</p>' +
            '<div style="margin:0 0 20px;padding:16px 18px;background:#f5f8ff;border:1px solid #e4ecfb;border-radius:12px;">' +
              '<div style="color:#9a7415;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">Included with your seat</div>' +
              '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + perkItems + '</table>' +
            '</div>' +
            '<table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="padding:2px 0 4px;">' +
              '<a href="' + INSTAGRAM_URL + '" style="display:inline-block;background:linear-gradient(135deg,#F5D97A,#C9981F);color:#3d2c00;text-decoration:none;font-weight:800;font-size:15px;padding:13px 30px;border-radius:999px;">Follow the journey on Instagram</a>' +
            '</td></tr></table>' +
          '</td></tr>' +

          // footer
          '<tr><td style="padding:18px 10px 4px;text-align:center;color:#7690c0;font-size:12px;line-height:1.7;">' +
            '<a href="' + SITE_URL + '" style="color:#1B3A7A;text-decoration:none;font-weight:700;">earnwings.org</a>' +
            '&nbsp;&nbsp;&#183;&nbsp;&nbsp;' +
            '<a href="' + INSTAGRAM_URL + '" style="color:#1B3A7A;text-decoration:none;font-weight:700;">@flywithearnwings</a>' +
            '<div style="margin-top:8px;color:#8ea0c4;">&#169; EARNWINGS &#183; Elevate your aviation journey &#183; Made for DGCA aspirants in India</div>' +
          '</td></tr>' +

        '</table>' +
      '</td></tr>' +
    '</table>' +
  '</body></html>';

  var text =
    first + ', welcome aboard EARNWINGS!\n\n' +
    'BOARDING PASS — Founder Cadet\n' +
    'Passenger: ' + passenger + '\n' +
    'Flight EW-001   From: Ground School   To: Your Wings   Seat ' + seat + '\n' +
    'Boarding ref: ' + ref + '\n\n' +
    'Included with your founder seat:\n' +
    '- Full app access for 1 week\n' +
    '- 5 RT practice sessions\n' +
    '- First 2 chapters of all 5 subjects unlocked\n' +
    '- 1 sample paper in every subject\n' +
    '- MCQs for your first 2 chapters\n' +
    '- 5 flight plans\n' +
    '- 5 Ask-Captain doubts\n' +
    '- 5 weight & balance calculations\n\n' +
    'Follow the journey: ' + INSTAGRAM_URL + '\n' + SITE_URL;

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: html,
    body: text,
    name: 'EARNWINGS',
    replyTo: 'cephionix@gmail.com'
  });
}

/**
 * RUN THIS ONCE from the editor to fix "mail not sending".
 * Pick `testEmail` in the function dropdown → Run → APPROVE the permission popup
 * (that grant is the Gmail-send permission the web app was missing). You'll get a
 * test email at TEST_TO — check inbox AND spam. After this, every signup emails.
 */
function testEmail() {
  var TEST_TO = 'cephionix@gmail.com'; // ← change to any address you can check
  _sendWelcomeEmail(TEST_TO, 'Arjun Mehta', 1, 'EW-TEST01');
  Logger.log('Test welcome email sent to ' + TEST_TO + ' — check inbox & spam.');
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

/** Minimal HTML-escape so a cadet's name can't break the email markup. */
function _esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * A stable, unique-looking seat for the boarding pass, derived from the cadet's
 * boarding ref (their EW-xxxx code). Same cadet always gets the same seat, but it
 * reveals nothing about their real waitlist position. e.g. "27C", "8F".
 */
function _seatFromCode(code) {
  var s = String(code || 'EW-FOUNDER');
  var h = 0;
  for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; }
  var row = (h % 48) + 1;                    // rows 1..48
  var letter = 'ABCDEF'.charAt((h >>> 6) % 6); // seats A..F
  return row + letter;
}

/** A tiny "LABEL / value" block used inside the boarding pass. */
function _field(label, value) {
  return '<div style="color:#9aa9c4;font-size:9px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">' + label + '</div>' +
         '<div style="color:#1B3A7A;font-size:14px;font-weight:800;margin-top:1px;">' + value + '</div>';
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
