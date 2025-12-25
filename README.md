# Freshers Party QR Entry System (Frontend + Google Apps Script Backend)

## Project Summary
A dual-scanner QR entry system for a college Freshers Party:
- Single QR per attendee used for **Gate Entry** and **Food Collection**.
- Freshers: Free entry — QR generated immediately.
- Seniors: Register → Admin verifies manual payment → QR generated.
- Food choice: Veg (Green) / Non-Veg (Red) shown on pass.
- Admin scanners: two web pages (Gate / Food) that verify and mark scanned status in Google Sheet.

---

## What you will find in this zip
- `frontend/` : Static website (deploy on Vercel)
- `apps-script-backend/` : Google Apps Script (.gs) files to paste into an Apps Script project
- `google_sheet_template.csv` : CSV template to create the "Registrations" sheet
- `README_DEPLOY.md` : Step-by-step deploy & debug instructions

---

## Quick notes before starting
1. You must create a Google Sheet and copy the `google_sheet_template.csv` into it (or create sheet manually).
2. Create a Google Apps Script project (script.google.com) and copy each `.gs` file from `apps-script-backend/` into the project as separate files.
3. Replace the placeholder `SPREADSHEET_ID` in `sheet-config.gs` with your actual sheet ID.
4. Deploy the Apps Script as a **Web app** (New deployment → Select "Web app" → set "Execute as: Me" and "Who has access: Anyone" or "Anyone, even anonymous").
5. Copy the deployed web app URL and update `frontend/js/utils.js` const `API_URL`.

---

## Files overview & purpose
- Frontend:
  - `index.html` : registration form
  - `success.html`: displays the party pass + QR, download link
  - `gate-scanner.html` : scanner page for gate
  - `food-scanner.html` : scanner page for food counter
  - `dashboard.html` : admin dashboard (stats)
  - `css/`, `js/`, `assets/` : supportive static files

- Backend (Apps Script):
  - `sheet-config.gs` : sheet constants (put your sheet id here)
  - `Code.gs` : doGet/doPost entry and router
  - `registration.gs` : registration handling
  - `qr-service.gs` : qr generation helpers
  - `admin-gate.gs` : gate verification
  - `admin-food.gs` : food verification
  - `dashboard-service.gs` : stats API
  - `mail-service.gs` : optional email sending helpers
  - `utils.gs` : generic helpers

---

## Security note
- The QR contains a short app-tag (`APP:FRESHER2025`) to reduce casual scanning by other scanners.
- This does NOT make the QR cryptographically secure. For stronger security, add signed tokens (HMAC) and validate on server-side.

---

Open `README_DEPLOY.md` for step-by-step deployment and debugging instructions.
