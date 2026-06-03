/**
 * 6–12 Tutoring — Google Apps Script form receiver
 * --------------------------------------------------
 * This tiny script turns a Google Sheet into a free backend for the
 * contact form. Every submission becomes a new row.
 *
 * SETUP (about 5 minutes) — full walkthrough is in README.md:
 *   1. Create a Google Sheet. Note its tab name (default "Sheet1").
 *   2. Extensions ▸ Apps Script. Delete any sample code.
 *   3. Paste THIS entire file in.
 *   4. Deploy ▸ New deployment ▸ type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   5. Copy the Web app URL it gives you.
 *   6. Paste that URL into GOOGLE_SCRIPT_URL at the top of js/main.js.
 *
 * The first time you deploy, Google will ask you to authorize the
 * script — that's expected.
 */

// If your sheet tab is not named "Sheet1", change it here.
var SHEET_NAME = "TutoringBusiness_ContactFormResponses";

// The columns, in order. The header row is created automatically.
var HEADERS = ["Timestamp", "Name", "Email", "Parent/Student", "Grade", "Subjects", "Message"];

function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(20000); // avoid two submissions colliding

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // Ensure header row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }

    var p = e.parameter || {};
    sheet.appendRow([
      p.timestamp || new Date().toLocaleString(),
      p.name || "",
      p.email || "",
      p.role || "",
      p.grade || "",
      p.subjects || "",
      p.message || ""
    ]);

    lock.releaseLock();
    return json({ result: "success" });
  } catch (err) {
    return json({ result: "error", message: String(err) });
  }
}

// A friendly response if someone opens the URL in a browser.
function doGet() {
  return json({ result: "ok", message: "6–12 Tutoring form endpoint is live." });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
