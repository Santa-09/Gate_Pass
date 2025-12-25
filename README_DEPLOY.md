# Deployment & Debugging Guide

## 1) Create Google Sheet
1. Create a new Google Sheet.
2. Rename the first sheet/tab to: `Registrations`
3. Create the following header row (A1..K1):
   ```
   Name,RegNo,Branch,Section,Type,Status,Food,QRURL,EntryConfirmed,FoodConfirmed,Email
   ```
4. (Optional) Import `google_sheet_template.csv` to prefill example rows.

## 2) Create Google Apps Script project
1. Go to https://script.google.com/ and create a new project.
2. Copy each `.gs` file from `apps-script-backend/` in this zip into the Apps Script editor as separate files.
3. Edit `sheet-config.gs` and replace:
   ```
   const SPREADSHEET_ID = 'REPLACE_WITH_YOUR_SHEET_ID';
   ```
   with your spreadsheet ID (the long id from the sheet URL).
4. Save the project.

## 3) Deploy Apps Script as Web App
1. Click "Deploy" → "New deployment".
2. Choose "Web app".
3. For "Execute as": choose **Me**.
4. For "Who has access": choose **Anyone** (or "Anyone, even anonymous" if required).
5. Click "Deploy" and authorize scopes (you will be asked to grant permission to access your Google Sheet and send email if mail is used).
6. Copy the **Web app URL**.

## 4) Configure Frontend
1. Open `frontend/js/utils.js` and set:
   ```js
   const API_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
   ```
2. If you use the Chart API for QR generation (default), no extra setup required.

## 5) Deploy Frontend to Vercel
Option A — Quick deploy via Vercel CLI:
1. Install Vercel CLI: `npm i -g vercel`
2. From inside `frontend/` folder run `vercel` and follow prompts.

Option B — GitHub import:
1. Push `frontend/` to a GitHub repo.
2. Import the repo to Vercel (https://vercel.com/import).

## 6) How the endpoints work (Apps Script)
- `POST` registration:
  - `doPost` with JSON body: `{ "action": "register", "data": { name, regNo, branch, section, type, food, email } }`
- `GET` fetch pass:
  - `doGet?action=getPass&regNo=REGNO`
- `GET` verify entry:
  - `doGet?action=verifyEntry&regNo=REGNO`
- `GET` verify food:
  - `doGet?action=verifyFood&regNo=REGNO`
- `GET` generate QR (admin):
  - `doGet?action=generateQR&regNo=REGNO`
- `GET` stats:
  - `doGet?action=stats`

## 7) Testing / Debugging tips
1. Register a **fresher** via the registration form → you should immediately get a QR.
2. Register a **senior** → sheet shows Status = Pending → the senior has no QR.
3. In the sheet, to approve a senior: set `Status` to `Paid` (manually), then call `doGet?action=generateQR&regNo=REGNO` (browse this URL after deployment) — it will create QR and update QRURL cell.
4. Use `gate-scanner.html` to scan the QR (open on a phone or laptop with camera). The page will call `verifyEntry` and mark `EntryConfirmed`.
5. Use `food-scanner.html` to scan the QR and mark `FoodConfirmed`. The color tag on the pass shows Veg/Non-Veg.

If something fails:
- Open Apps Script → Executions → see logs and errors.
- Use `Logger.log()` in Apps Script to track variables.
- Use browser devtools (Network tab) to inspect requests from frontend to Apps Script.

## 8) Important limitations
- The QR uses Google Chart API for image generation and stores the QR URL into the sheet. This is convenient but not cryptographically secure.
- The "app-tag" reduces accidental scanning, but cannot fully prevent someone from reading the QR content in other scanners.
- To fully secure, use signed JWT/HMAC tokens and validate signature server-side (out of scope for this project iteration).

Happy building! - Santa
