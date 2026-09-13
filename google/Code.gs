/**
 * Jenn's orders → Google Sheet.
 *
 * Setup (one time, ~5 minutes):
 * 1. Create a Google Sheet. Rename the first tab "Orders".
 * 2. Extensions → Apps Script. Replace the contents with this file.
 * 3. Project Settings → Script Properties → add SECRET with a long random value.
 * 4. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone.
 * 5. Copy the web app URL into Vercel as ORDERS_WEBHOOK_URL, and the secret as ORDERS_WEBHOOK_SECRET.
 *
 * Every order becomes one row. The header row is written on first use.
 * A charm photo, when attached, is saved to a Drive folder named
 * "Notebook orders - charm photos" and its link goes in the charmPhoto column.
 */

var HEADERS = [
  "orderNumber", "submittedAt", "status", "leather", "size", "roundedEdges",
  "cord", "charm", "charmDescription", "charmPhoto", "stamp", "stampPlacement",
  "name", "email", "phone", "delivery", "address", "notes", "total", "paid",
];

var PHOTO_FOLDER = "Notebook orders - charm photos";

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty("SECRET") || "";
    if (secret && payload.secret !== secret) {
      return respond({ ok: false, error: "unauthorized" });
    }
    var row = payload.row || {};
    if (payload.charmImage && payload.charmImage.dataUrl) {
      row.charmPhoto = savePhoto(payload.charmImage, row.orderNumber);
    }
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders")
      || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    sheet.appendRow(HEADERS.map(function (h) { return row[h] == null ? "" : row[h]; }));
    return respond({ ok: true });
  } catch (err) {
    return respond({ ok: false, error: String(err) });
  }
}

function savePhoto(img, orderNumber) {
  var m = /^data:(image\/[a-z]+);base64,(.+)$/.exec(img.dataUrl);
  if (!m) return "";
  var ext = m[1] === "image/png" ? "png" : m[1] === "image/webp" ? "webp" : "jpg";
  var blob = Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], orderNumber + "-charm." + ext);
  var folders = DriveApp.getFoldersByName(PHOTO_FOLDER);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(PHOTO_FOLDER);
  var file = folder.createFile(blob);
  return file.getUrl();
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
