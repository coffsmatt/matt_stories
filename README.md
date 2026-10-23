# Matt's Stories

This is a Google Apps Script web app that records a story for up to 20 minutes, saves the audio in Google Drive, and appends one row per recording to a Google Sheet.

## Before you start

- Use **Google Chrome** on a computer or Android device for the first test. Safari on current iPhone/iPad versions should also work.
- Sign in to Google as **coffsmatt@gmail.com**. That account will own the Drive folder and the Sheet.
- This version records `audio/webm` (Opus). It is compact and plays in Drive/Chrome; do not expect it to open in every older media player.

## Install and deploy

1. Open [script.new](https://script.new) while signed in as `coffsmatt@gmail.com`.
2. Name the project **Matt's Stories**.
3. In the editor, replace the contents of `Code.gs` with the contents of [Code.gs](./Code.gs).
4. Click **+** beside Files > **HTML**, name it `Index`, then paste in [Index.html](./Index.html).
5. In Project Settings, set the time zone to **Australia/Sydney**. (The included `appsscript.json` is optional if you use the editor setting.)
6. Save. From the function picker, select `setupMattStories`, then click **Run**. Approve Google’s requested Drive and Sheets permissions. This creates:
   - `Matt's Stories recordings` in Drive
   - `Matt's Stories recording log` in Sheets
7. In **Executions** or the run log, open the returned links and confirm both files exist. Keep the Sheet—each recording will add one row.
8. Click **Deploy > New deployment > Web app**. Choose:
   - **Execute as:** Me (`coffsmatt@gmail.com`)
   - **Who has access:** Only myself for the private first test.
9. Click **Deploy**, approve permissions if prompted, and copy the URL ending in `/exec`.

## Test checklist

1. Open the `/exec` URL in Chrome while signed into `coffsmatt@gmail.com`.
2. Press **Start recording** and allow microphone access.
3. Make a 15–30 second test recording, then press **Stop recording**.
4. Wait for the **Saved** message, open its link, and play the audio.
5. Open the log Sheet: it should contain the time, filename, duration, and Drive link.
6. Do one longer test (5–10 minutes) on the actual phone/tablet and Wi-Fi. This validates microphone access, file size, and upload reliability before relying on 20 minutes.

## Everyday use

Bookmark the `/exec` address or add it to the device’s home screen. The person only presses **Start recording**, talks, then presses **Stop recording**. In the final minute the timer flashes red; at 20:00 the recording stops and saves automatically. Keep the page open until it says **Saved**.

## Important privacy and access notes

- Do not choose “Anyone” or “Anyone, even anonymous” for a personal archive. During testing, use **Only myself**.
- If another family member will use a different Google account, share the deployment only with that account and test it. The recordings still go to the owner account because the app executes as the owner.
- Treat the deployment URL as private. It provides access to create recordings in the owner’s Drive folder.
- If you modify code, use **Deploy > Manage deployments > Edit**, create a new version, and deploy it. The `/exec` URL stays the same.

## Transcription later

The `Recordings` sheet deliberately includes `Transcription status` and `Transcript link` columns. A Make scenario can watch new rows where `Upload status` is `Saved`, download the Drive file, transcribe it, create a Google Doc, and update those two fields. Build and test that separately so recording remains dependable even if transcription has a problem.
