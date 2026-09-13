/**
 * Jenn's orders → Google Sheet.
 *
 * Setup (one time, ~5 minutes):
 * 1. Create a Google Sheet. Rename the first tab "Orders".
 * 2. Extensions → Apps Script. Replace the contents with this file.
 * 3. Project Settings → Script Properties → add SECRET with a long random value.
 *    Optionally add ORDER_START (e.g. 141) to begin numbering there; default 1.
 * 4. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone.
 * 5. Copy the web app URL into Vercel as ORDERS_WEBHOOK_URL, and the secret as ORDERS_WEBHOOK_SECRET.
 *
 * Every order becomes one row. The header row is written on first use.
 * This script hands out the order number: three digits, counting up from
 * ORDER_START, one higher than the highest number already in the sheet.
 * A charm photo, when attached, is saved to a Drive folder named
 * "Notebook orders - charm photos" and its link goes in the charmPhoto column.
 */

var HEADERS = [
  "orderNumber", "submittedAt", "status", "leather", "size", "roundedEdges",
  "cord", "charm", "charmDescription", "charmPhoto", "stamp", "stampPlacement",
  "name", "email", "phone", "delivery", "address", "deliveryFee", "notes", "total", "paid",
];

var PHOTO_FOLDER = "Notebook orders - charm photos";

function doPost(e) {
  // One order at a time, so two customers can't be handed the same number.
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var payload = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty("SECRET") || "";
    if (secret && payload.secret !== secret) {
      return respond({ ok: false, error: "unauthorized" });
    }
    var row = payload.row || {};
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders")
      || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
      // Keep "042" as text so the leading zeros survive.
      sheet.getRange("A:A").setNumberFormat("@");
    }
    row.orderNumber = nextOrderNumber(sheet);
    if (payload.charmImage && payload.charmImage.dataUrl) {
      row.charmPhoto = savePhoto(payload.charmImage, row.orderNumber);
    }
    sheet.appendRow(HEADERS.map(function (h) { return row[h] == null ? "" : row[h]; }));
    return respond({ ok: true, orderNumber: row.orderNumber });
  } catch (err) {
    return respond({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Highest number in column A plus one, never below ORDER_START. Zero-padded to three digits. */
function nextOrderNumber(sheet) {
  var start = parseInt(PropertiesService.getScriptProperties().getProperty("ORDER_START"), 10);
  if (isNaN(start) || start < 1) start = 1;
  var max = start - 1;
  var last = sheet.getLastRow();
  if (last > 1) {
    var values = sheet.getRange(2, 1, last - 1, 1).getValues();
    for (var i = 0; i < values.length; i++) {
      var n = parseInt(values[i][0], 10);
      if (!isNaN(n) && n > max) max = n;
    }
  }
  var next = String(max + 1);
  while (next.length < 3) next = "0" + next;
  return next;
}

function savePhoto(img, orderNumber) {
  var m = /^data:(image\/[a-z]+);base64,(.+)$/.exec(img.dataUrl);
  if (!m) return "";
  var ext = m[1] === "image/png" ? "png" : m[1] === "image/webp" ? "webp" : "jpg";
  var blob = Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], "notebook-" + orderNumber + "-charm." + ext);
  var folders = DriveApp.getFoldersByName(PHOTO_FOLDER);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(PHOTO_FOLDER);
  var file = folder.createFile(blob);
  return file.getUrl();
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
