/**
 * NBIL website form handler.
 *
 * Receives submissions from the Next.js API route (`/api/forms`), appends a row
 * to the matching sheet tab, and emails a notification.
 *
 * The script is generic: whatever field labels the site sends become the
 * columns. Adding a new form to the site needs no change here.
 *
 * Setup: Extensions > Apps Script from the target spreadsheet, paste this file,
 * fill in CONFIG, then Deploy > New deployment > Web app
 *   Execute as:      Me
 *   Who has access:  Anyone
 * Copy the /exec URL into the site's GOOGLE_SCRIPT_URL environment variable.
 */

var CONFIG = {
  /** Where notifications go. Comma-separate for several recipients. */
  NOTIFY_EMAIL: 'support@nextbiginnovationlabs.com',

  /** Optional CC on every notification. Leave '' for none. */
  NOTIFY_CC: '',

  /**
   * Shared secret. Set the same value in the site's GOOGLE_SCRIPT_SECRET env
   * var to reject anything that didn't come from the site. Leave '' to skip
   * the check (the /exec URL is then the only thing keeping randoms out).
   */
  SHARED_SECRET: '',

  /** Prefix on the notification subject line. */
  SUBJECT_PREFIX: '[NBIL Website]',

  /** Send an auto-acknowledgement to the person who submitted. */
  SEND_AUTOREPLY: false,
  AUTOREPLY_SUBJECT: 'We received your enquiry - Next Big Innovation Labs',
  AUTOREPLY_SENDER_NAME: 'Next Big Innovation Labs',
};

/** Columns every sheet gets before the form's own fields. */
var BASE_HEADERS = ['Timestamp', 'Form'];
/** Columns every sheet gets after the form's own fields. */
var TRAILING_HEADERS = ['Page', 'User Agent'];

function doPost(e) {
  var lock = LockService.getScriptLock();

  try {
    // Serialise writes so two simultaneous submissions can't claim one row.
    lock.waitLock(30000);

    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut({ ok: false, error: 'Empty request body' });
    }

    var payload = JSON.parse(e.postData.contents);

    if (CONFIG.SHARED_SECRET && payload.secret !== CONFIG.SHARED_SECRET) {
      return jsonOut({ ok: false, error: 'Unauthorized' });
    }

    var sheetName = String(payload.sheet || payload.formId || 'Submissions');
    var fields = Array.isArray(payload.fields) ? payload.fields : [];
    var meta = payload.meta || {};

    if (!fields.length) {
      return jsonOut({ ok: false, error: 'No fields submitted' });
    }

    var sheet = getOrCreateSheet(sheetName);
    var headers = syncHeaders(sheet, fields);
    var row = buildRow(headers, fields, payload, meta);

    sheet.appendRow(row);

    // Notification is best-effort: a mail-quota failure must not lose the row.
    try {
      sendNotification(payload, fields, meta, sheetName);
    } catch (mailErr) {
      console.error('Notification failed: ' + mailErr);
    }

    if (CONFIG.SEND_AUTOREPLY) {
      try {
        sendAutoReply(fields);
      } catch (replyErr) {
        console.error('Auto-reply failed: ' + replyErr);
      }
    }

    return jsonOut({ ok: true });
  } catch (err) {
    console.error(err);
    return jsonOut({ ok: false, error: String(err) });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignored) {}
  }
}

/** Lets you open the /exec URL in a browser to confirm the deployment is live. */
function doGet() {
  return jsonOut({ ok: true, status: 'NBIL form endpoint is running' });
}

function getOrCreateSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

/**
 * Makes sure the header row covers every incoming field, appending any column
 * the sheet hasn't seen before. Existing columns keep their position, so old
 * rows stay aligned when a form gains a field.
 */
function syncHeaders(sheet, fields) {
  var lastCol = sheet.getLastColumn();
  var headers =
    sheet.getLastRow() === 0 || lastCol === 0
      ? []
      : sheet.getRange(1, 1, 1, lastCol).getValues()[0].filter(String);

  if (!headers.length) {
    headers = BASE_HEADERS.concat(
      fields.map(function (f) {
        return String(f.label);
      }),
      TRAILING_HEADERS
    );
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    formatHeaderRow(sheet, headers.length);
    return headers;
  }

  var missing = [];
  fields.forEach(function (f) {
    var label = String(f.label);
    if (headers.indexOf(label) === -1 && missing.indexOf(label) === -1) {
      missing.push(label);
    }
  });

  if (missing.length) {
    // Insert new columns before the trailing meta columns when they exist.
    var insertAt = headers.length;
    for (var t = 0; t < TRAILING_HEADERS.length; t++) {
      var idx = headers.indexOf(TRAILING_HEADERS[t]);
      if (idx !== -1 && idx < insertAt) insertAt = idx;
    }
    headers = headers
      .slice(0, insertAt)
      .concat(missing, headers.slice(insertAt));
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    formatHeaderRow(sheet, headers.length);
  }

  return headers;
}

function formatHeaderRow(sheet, width) {
  var range = sheet.getRange(1, 1, 1, width);
  range.setFontWeight('bold');
  range.setBackground('#e8f1fd');
  sheet.setFrozenRows(1);
}

function buildRow(headers, fields, payload, meta) {
  var values = {};
  fields.forEach(function (f) {
    values[String(f.label)] = String(f.value == null ? '' : f.value);
  });

  values['Timestamp'] = meta.submittedAt ? new Date(meta.submittedAt) : new Date();
  values['Form'] = String(payload.formId || '');
  values['Page'] = String(meta.page || '');
  values['User Agent'] = String(meta.userAgent || '');

  return headers.map(function (h) {
    return Object.prototype.hasOwnProperty.call(values, h) ? values[h] : '';
  });
}

function sendNotification(payload, fields, meta, sheetName) {
  var subject =
    CONFIG.SUBJECT_PREFIX + ' ' + (payload.subject || 'New form submission');

  var rows = fields
    .map(function (f) {
      return (
        '<tr>' +
        '<td style="padding:8px 14px;border-bottom:1px solid #e2e8f0;' +
        'color:#58667a;font:600 12px/1.4 system-ui,sans-serif;' +
        'text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;' +
        'vertical-align:top">' +
        escapeHtml(f.label) +
        '</td>' +
        '<td style="padding:8px 14px;border-bottom:1px solid #e2e8f0;' +
        'color:#0c1626;font:14px/1.5 system-ui,sans-serif">' +
        (escapeHtml(f.value) || '<span style="color:#94a3b8">-</span>') +
        '</td>' +
        '</tr>'
      );
    })
    .join('');

  var html =
    '<div style="background:#f8fafc;padding:24px">' +
    '<div style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden">' +
    '<div style="background:#2d81e4;padding:18px 22px">' +
    '<p style="margin:0;color:#fff;font:600 16px/1.3 system-ui,sans-serif">' +
    escapeHtml(payload.subject || 'New form submission') +
    '</p>' +
    '<p style="margin:4px 0 0;color:#dbeafe;font:13px/1.4 system-ui,sans-serif">' +
    escapeHtml(sheetName) +
    '</p>' +
    '</div>' +
    '<table style="width:100%;border-collapse:collapse">' +
    rows +
    '</table>' +
    '<div style="padding:14px 22px;background:#f8fafc;border-top:1px solid #e2e8f0">' +
    '<p style="margin:0;color:#58667a;font:12px/1.5 system-ui,sans-serif">' +
    'Submitted ' +
    escapeHtml(formatTimestamp(meta.submittedAt)) +
    (meta.page ? ' from ' + escapeHtml(meta.page) : '') +
    '<br>Saved to the "' +
    escapeHtml(sheetName) +
    '" tab of ' +
    escapeHtml(SpreadsheetApp.getActiveSpreadsheet().getName()) +
    '</p>' +
    '</div>' +
    '</div>' +
    '</div>';

  var options = {
    htmlBody: html,
    name: CONFIG.AUTOREPLY_SENDER_NAME,
  };

  if (CONFIG.NOTIFY_CC) options.cc = CONFIG.NOTIFY_CC;

  // Reply straight to the person who submitted, when they gave an address.
  var email = findEmail(fields);
  if (email) options.replyTo = email;

  MailApp.sendEmail(
    CONFIG.NOTIFY_EMAIL,
    subject,
    plainTextBody(fields),
    options
  );
}

function sendAutoReply(fields) {
  var email = findEmail(fields);
  if (!email) return;

  var name = findValue(fields, ['Name', 'First Name', 'Full Name']) || 'there';

  var html =
    '<div style="max-width:560px;font:15px/1.6 system-ui,sans-serif;color:#0c1626">' +
    '<p>Hi ' +
    escapeHtml(name) +
    ',</p>' +
    '<p>Thanks for reaching out to Next Big Innovation Labs. We have received ' +
    'your enquiry and a member of our team will reply within 2 business days.</p>' +
    '<p style="color:#58667a;font-size:13px">This is an automated confirmation. ' +
    'You can reply to this email if you need to add anything.</p>' +
    '</div>';

  MailApp.sendEmail(email, CONFIG.AUTOREPLY_SUBJECT, '', {
    htmlBody: html,
    name: CONFIG.AUTOREPLY_SENDER_NAME,
    replyTo: CONFIG.NOTIFY_EMAIL,
  });
}

function plainTextBody(fields) {
  return fields
    .map(function (f) {
      return f.label + ': ' + (f.value || '-');
    })
    .join('\n');
}

function findEmail(fields) {
  for (var i = 0; i < fields.length; i++) {
    var label = String(fields[i].label).toLowerCase();
    var value = String(fields[i].value || '');
    if (label.indexOf('email') !== -1 && value.indexOf('@') !== -1) {
      return value;
    }
  }
  return '';
}

function findValue(fields, labels) {
  for (var i = 0; i < fields.length; i++) {
    if (labels.indexOf(String(fields[i].label)) !== -1 && fields[i].value) {
      return String(fields[i].value);
    }
  }
  return '';
}

function formatTimestamp(iso) {
  var date = iso ? new Date(iso) : new Date();
  return Utilities.formatDate(
    date,
    Session.getScriptTimeZone(),
    'd MMM yyyy, h:mm a'
  );
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** Run this once from the editor to check the sheet write and the email. */
function testSubmission() {
  var result = doPost({
    postData: {
      contents: JSON.stringify({
        formId: 'quote',
        sheet: 'Quote Requests',
        subject: 'Test submission',
        secret: CONFIG.SHARED_SECRET,
        fields: [
          { label: 'Name', value: 'Test Person' },
          { label: 'Work Email', value: 'test@example.com' },
          { label: 'Organization', value: 'Test Lab' },
          { label: 'Message', value: 'This row came from testSubmission().' },
        ],
        meta: {
          submittedAt: new Date().toISOString(),
          page: 'https://example.com/test',
          userAgent: 'Apps Script test',
        },
      }),
    },
  });
  console.log(result.getContent());
}
