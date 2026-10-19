const PLAYTIME_SHEET_NAME = "Playtime";
const PLAYTIME_HEADERS = [
  "Player ID",
  "Name",
  "Lifetime Seconds",
  "Last Updated"
];
const MAX_PLAYTIME_SECONDS = 3153600000;

function getLeaderboardSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheets()[0];

  if (!sheet) {
    throw new Error("The spreadsheet needs a leaderboard sheet in the first tab.");
  }

  const playerIdHeader = String(sheet.getRange(1, 4).getValue() || "").trim();
  if (!playerIdHeader) {
    const existingColumnValues = sheet.getLastRow() > 1
      ? sheet.getRange(2, 4, sheet.getLastRow() - 1, 1).getValues()
      : [];
    if (existingColumnValues.some(row => String(row[0] || "").trim())) {
      throw new Error("The fourth leaderboard column already contains data.");
    }
    sheet.getRange(1, 4).setValue("Player ID");
  } else if (playerIdHeader !== "Player ID") {
    throw new Error("The fourth leaderboard column must be named Player ID.");
  }

  return sheet;
}

function getPlaytimeSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(PLAYTIME_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(PLAYTIME_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(PLAYTIME_HEADERS);
    return sheet;
  }

  const headers = sheet
    .getRange(1, 1, 1, Math.max(4, sheet.getLastColumn()))
    .getValues()[0]
    .map(value => String(value || "").trim());

  if (headers[1] === "Session ID" && headers[3] === "Session Seconds") {
    const oldRows = sheet.getDataRange().getValues();
    const totals = new Map();

    for (let i = 1; i < oldRows.length; i++) {
      const playerId = String(oldRows[i][0] || "").trim();
      const name = String(oldRows[i][2] || "").trim();
      const seconds = Number(oldRows[i][3]);

      if (!playerId || !Number.isFinite(seconds) || seconds < 0) continue;

      const player = totals.get(playerId) || { name: "", seconds: 0 };
      player.name = name || player.name;
      player.seconds += Math.floor(seconds);
      totals.set(playerId, player);
    }

    sheet.clearContents();
    sheet.appendRow(PLAYTIME_HEADERS);

    for (const [playerId, player] of totals) {
      sheet.appendRow([playerId, player.name, player.seconds, new Date()]);
    }

    return sheet;
  }

  if (
    headers[0] !== "Player ID" ||
    headers[1] !== "Name" ||
    headers[2] !== "Lifetime Seconds"
  ) {
    throw new Error("Unexpected columns in the Playtime sheet.");
  }

  return sheet;
}

function getPlayerIdsByName_() {
  const rows = getPlaytimeSheet_().getDataRange().getValues();
  const idsByName = new Map();

  for (let i = 1; i < rows.length; i++) {
    const playerId = String(rows[i][0] || "").trim();
    const nameKey = String(rows[i][1] || "").trim().toLowerCase();
    if (!playerId || !nameKey) continue;

    if (!idsByName.has(nameKey)) idsByName.set(nameKey, new Set());
    idsByName.get(nameKey).add(playerId);
  }

  return idsByName;
}

function migrateLegacyScorePlayerIds_(sheet) {
  const rows = sheet.getDataRange().getValues();
  const idsByName = getPlayerIdsByName_();

  for (let i = 1; i < rows.length; i++) {
    const nameKey = String(rows[i][0] || "").trim().toLowerCase();
    const playerId = String(rows[i][3] || "").trim();
    const matchingIds = idsByName.get(nameKey);

    if (!playerId && matchingIds && matchingIds.size === 1) {
      sheet.getRange(i + 1, 4).setValue([...matchingIds][0]);
    }
  }

  return idsByName;
}

function textResponse_(message) {
  return ContentService.createTextOutput(message);
}

function doPost(e) {
  let data;

  try {
    const contents = e && e.postData ? e.postData.contents : "";
    data = JSON.parse(contents || "{}");
  } catch (error) {
    return textResponse_("Invalid JSON");
  }

  if (data.action === "playtime") return savePlaytime_(data);
  if (data.action === "rename") return renamePlayer_(data);
  return saveScore_(data);
}

function saveScore_(data) {
  const lock = LockService.getScriptLock();
  let lockAcquired = false;

  try {
    lock.waitLock(5000);
    lockAcquired = true;

    const sheet = getLeaderboardSheet_();
    const playerId = String(data.playerId || "").trim();
    const name = String(data.name || "").trim().slice(0, 16);
    const score = Number(data.score);

    if (!name || !Number.isFinite(score) || score <= 0) {
      return textResponse_("Invalid score");
    }

    migrateLegacyScorePlayerIds_(sheet);
    const rows = sheet.getDataRange().getValues();
    const matches = [];

    for (let i = 1; i < rows.length; i++) {
      const existingId = String(rows[i][3] || "").trim();
      const existingName = String(rows[i][0] || "").trim().toLowerCase();

      if (
        (playerId && existingId === playerId) ||
        (!playerId && existingName === name.toLowerCase())
      ) {
        const existingScore = Number(rows[i][1]);
        matches.push({
          rowNumber: i + 1,
          score: Number.isFinite(existingScore) ? existingScore : 0,
          timestamp: rows[i][2]
        });
      }
    }

    if (matches.length === 0) {
      sheet.appendRow([name, score, new Date(), playerId]);
      return textResponse_("OK");
    }

    const bestMatch = matches.reduce((best, match) =>
      match.score > best.score ? match : best
    );
    const bestScore = Math.max(score, bestMatch.score);
    const timestamp = score > bestMatch.score ? new Date() : bestMatch.timestamp || new Date();

    sheet.getRange(bestMatch.rowNumber, 1, 1, 4)
      .setValues([[name, bestScore, timestamp, playerId || ""]]);

    matches
      .filter(match => match.rowNumber !== bestMatch.rowNumber)
      .sort((a, b) => b.rowNumber - a.rowNumber)
      .forEach(match => sheet.deleteRow(match.rowNumber));

    return textResponse_("OK");
  } catch (error) {
    console.error(error);
    return textResponse_("Score write failed");
  } finally {
    if (lockAcquired) lock.releaseLock();
  }
}

function renamePlayer_(data) {
  const playerId = String(data.playerId || "").trim();
  const oldName = String(data.oldName || "").trim().slice(0, 16);
  const name = String(data.name || "").trim().slice(0, 16);

  if (!playerId || !oldName || !name) {
    return textResponse_("Invalid name update");
  }

  const lock = LockService.getScriptLock();
  let lockAcquired = false;

  try {
    lock.waitLock(5000);
    lockAcquired = true;

    const sheet = getLeaderboardSheet_();
    const playtimeSheet = getPlaytimeSheet_();
    const idsByName = migrateLegacyScorePlayerIds_(sheet);
    const playtimeRows = playtimeSheet.getDataRange().getValues();

    for (let i = 1; i < playtimeRows.length; i++) {
      if (String(playtimeRows[i][0] || "").trim() === playerId) {
        playtimeSheet.getRange(i + 1, 2).setValue(name);
        playtimeSheet.getRange(i + 1, 4).setValue(new Date());
      }
    }

    const oldNameIds = idsByName.get(oldName.toLowerCase());
    const canClaimLegacyRows =
      oldNameIds && oldNameIds.size === 1 && oldNameIds.has(playerId);
    const rows = sheet.getDataRange().getValues();
    const matches = [];

    for (let i = 1; i < rows.length; i++) {
      const existingId = String(rows[i][3] || "").trim();
      const existingName = String(rows[i][0] || "").trim().toLowerCase();

      if (
        existingId === playerId ||
        (!existingId && canClaimLegacyRows && existingName === oldName.toLowerCase())
      ) {
        const score = Number(rows[i][1]);
        matches.push({
          rowNumber: i + 1,
          score: Number.isFinite(score) ? score : 0,
          timestamp: rows[i][2]
        });
      }
    }

    if (matches.length) {
      const bestMatch = matches.reduce((best, match) =>
        match.score > best.score ? match : best
      );
      sheet.getRange(bestMatch.rowNumber, 1, 1, 4).setValues([[
        name,
        bestMatch.score,
        bestMatch.timestamp || new Date(),
        playerId
      ]]);

      matches
        .filter(match => match.rowNumber !== bestMatch.rowNumber)
        .sort((a, b) => b.rowNumber - a.rowNumber)
        .forEach(match => sheet.deleteRow(match.rowNumber));
    }

    return textResponse_("OK");
  } catch (error) {
    console.error(error);
    return textResponse_("Name update failed");
  } finally {
    if (lockAcquired) lock.releaseLock();
  }
}

function savePlaytime_(data) {
  const playerId = String(data.playerId || "").trim();
  const name = String(data.name || "").trim().slice(0, 16);
  const seconds = Number(data.seconds);

  if (
    !playerId ||
    !name ||
    !Number.isSafeInteger(seconds) ||
    seconds <= 0 ||
    seconds > MAX_PLAYTIME_SECONDS
  ) {
    return textResponse_("Invalid playtime");
  }

  const lock = LockService.getScriptLock();
  let lockAcquired = false;

  try {
    lock.waitLock(5000);
    lockAcquired = true;

    const sheet = getPlaytimeSheet_();
    const rows = sheet.getDataRange().getValues();
    const matches = [];

    for (let i = 1; i < rows.length; i++) {
      const existingId = String(rows[i][0] || "").trim();
      if (existingId === playerId) {
        const existingSeconds = Number(rows[i][2]);
        matches.push({
          rowNumber: i + 1,
          seconds: Number.isSafeInteger(existingSeconds) ? existingSeconds : 0
        });
      }
    }

    if (matches.length === 0) {
      sheet.appendRow([playerId, name, seconds, new Date()]);
      return textResponse_("OK");
    }

    const canonicalRow = matches[0];
    const lifetimeSeconds = matches.reduce(
      (highest, match) => Math.max(highest, match.seconds),
      seconds
    );

    sheet.getRange(canonicalRow.rowNumber, 1, 1, 4).setValues([[
      playerId,
      name,
      lifetimeSeconds,
      new Date()
    ]]);

    matches
      .filter(match => match.rowNumber !== canonicalRow.rowNumber)
      .sort((a, b) => b.rowNumber - a.rowNumber)
      .forEach(match => sheet.deleteRow(match.rowNumber));

    return textResponse_("OK");
  } catch (error) {
    console.error(error);
    return textResponse_("Playtime write failed");
  } finally {
    if (lockAcquired) lock.releaseLock();
  }
}

function doGet() {
  const sheet = getLeaderboardSheet_();
  const rows = sheet.getDataRange().getValues();
  const leaderboard = rows.slice(1).map(row => ({
    name: row[0],
    score: row[1],
    timestamp: row[2]
  }));

  return ContentService
    .createTextOutput(JSON.stringify(leaderboard))
    .setMimeType(ContentService.MimeType.JSON);
}
