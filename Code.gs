/** Matt's Stories — server-side Apps Script code. */
const APP_TITLE = "Matt's Stories";
const MAX_SECONDS = 20 * 60;

/** Run this ONCE from the Apps Script editor, while signed in as coffsmatt@gmail.com. */
function setupMattStories() {
  const props = PropertiesService.getScriptProperties();
  let folderId = props.getProperty('RECORDINGS_FOLDER_ID');
  let spreadsheetId = props.getProperty('LOG_SPREADSHEET_ID');

  if (!folderId) {
    folderId = DriveApp.createFolder(APP_TITLE + ' recordings').getId();
    props.setProperty('RECORDINGS_FOLDER_ID', folderId);
  }
  if (!spreadsheetId) {
    const book = SpreadsheetApp.create(APP_TITLE + ' recording log');
    const sheet = book.getActiveSheet();
    sheet.setName('Recordings');
    sheet.appendRow([
      'Recorded at', 'Filename', 'Duration (seconds)', 'Audio file',
      'MIME type', 'Upload status', 'Transcription status', 'Transcript link', 'Notes'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange('A1:I1').setFontWeight('bold').setBackground('#d9ead3');
    sheet.setColumnWidths(1, 9, 170);
    sheet.setColumnWidth(4, 330);
    spreadsheetId = book.getId();
    props.setProperty('LOG_SPREADSHEET_ID', spreadsheetId);
  }

  const result = {
    folder: DriveApp.getFolderById(folderId).getUrl(),
    spreadsheet: SpreadsheetApp.openById(spreadsheetId).getUrl()
  };
  Logger.log(JSON.stringify(result));
  return result;
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

function getAppConfig() {
  return { title: APP_TITLE, maxSeconds: MAX_SECONDS };
}

/**
 * Saves an audio data URL and appends a log row. Called only from this web app.
 * @param {{dataUrl:string, filename:string, durationSeconds:number, mimeType:string}} recording
 */
function saveRecording(recording) {
  if (!recording || typeof recording.dataUrl !== 'string') {
    throw new Error('No recording was received. Please try again.');
  }
  const props = PropertiesService.getScriptProperties();
  const folderId = props.getProperty('RECORDINGS_FOLDER_ID');
  const spreadsheetId = props.getProperty('LOG_SPREADSHEET_ID');
  if (!folderId || !spreadsheetId) {
    throw new Error('Initial setup has not been run yet.');
  }

  const duration = Number(recording.durationSeconds);
  if (!Number.isFinite(duration) || duration < 1 || duration > MAX_SECONDS + 3) {
    throw new Error('The recording duration is not valid.');
  }

  const match = recording.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('The audio format was not recognised.');
  const mimeType = match[1];
  const bytes = Utilities.base64Decode(match[2]);
  // A normal 20-minute Opus recording at the page's selected bitrate is well below this.
  if (bytes.length > 15 * 1024 * 1024) {
    throw new Error('This recording is too large to upload. Please try a shorter recording.');
  }

  const safeName = String(recording.filename || 'story.webm')
    .replace(/[\\/:*?"<>|]/g, '-').slice(0, 160);
  const blob = Utilities.newBlob(bytes, mimeType, safeName);
  const file = DriveApp.getFolderById(folderId).createFile(blob);
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Recordings');
  sheet.appendRow([
    new Date(), file.getName(), Math.round(duration), file.getUrl(), mimeType,
    'Saved', 'Not started', '', ''
  ]);
  return { fileUrl: file.getUrl(), filename: file.getName() };
}
