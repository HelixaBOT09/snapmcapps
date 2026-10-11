# Snap MC Staff Application Portal — Starter Prototype

## Run it on Android
1. Download and extract `snapmc_staff_portal.zip`.
2. Open `index.html` in a browser, or upload the three files to a static host.
3. Test the application form. Demo submissions are stored only in the current browser's local storage.
4. Open the Dashboard section and enter the demo PIN `snapdemo`.
5. Use Export CSV to download the demo submissions.

## Important limitations
This is a front-end prototype, not a production application service.
- Submissions do not reach a shared database or Discord.
- Local storage is tied to one browser/device and can be edited or cleared by the user.
- The demo PIN is visible in the JavaScript and is NOT security.
- Do not collect real applicant information with this prototype on a public site.

## Before a real launch
Add a backend/database such as Supabase, configure row-level security and server-side validation, implement secure staff authentication, and send Discord notifications from a server-side function with the webhook stored as a secret. Never put admin keys or webhook URLs in browser JavaScript.
