# Jenn's notebooks

Marketing and custom-order site for handmade leather traveler's notebooks.
No cart: customers configure a notebook, reserve it, and pay by Venmo after
Jenn confirms. Every order lands as a row in a Google Sheet.

Design source of truth: [DESIGN.md](DESIGN.md). Read it before touching any UI.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in the three values
npm run dev
```

## Pages

- `/` hero, the constraint statement and queue, one leather per viewport
- `/notebooks` sizes and the leather ledger
- `/order` the ticket: leather, size, edges, cord, charm, stamp, contact + delivery, payment
- `POST /api/order` validates and forwards one row to the sheet

## Orders → Google Sheet

`google/Code.gs` has the Apps Script and a five-step setup. The site posts
`{ secret, row }` to the deployed web app URL; the script appends `row` to the
"Orders" tab and answers with the order number. Numbers are three digits and
count up (Nº 001, 002, …), one higher than the highest already in the sheet;
set the `ORDER_START` script property to begin somewhere else. A charm photo,
when attached, is saved to a Drive folder named "Notebook orders - charm
photos" and its link goes in the `charmPhoto` column.
Set `ORDERS_WEBHOOK_URL` and `ORDERS_WEBHOOK_SECRET` in Vercel.
With no URL set, the row is logged to the server console and the customer
sees the do-it-by-hand receipt (screenshot, email Jenn, pay on Venmo)
instead of a confirmation.

## The iPad at the stall

1. On the iPad, open the site in Safari and go to `/kiosk` once. That turns
   kiosk mode on for that browser and lands on the cover.
2. Share → Add to Home Screen, then open it from the home screen so it runs
   full-screen. Optional: Settings → Accessibility → Guided Access to lock
   the iPad to the app.
3. Tap "Make yours" to turn the page into the order ticket. After a customer
   reserves, the confirmation shows a Venmo QR code they scan with their own
   phone, and a "Next customer" button. Two minutes without a touch returns
   to the cover on its own.
4. `/kiosk/off` turns it back into the normal site.

Kiosk mode only changes the confirmation (QR + Next customer) and the idle
reset. Everyone else who opens the link on a phone or laptop gets the same
site without those.

## Deploy

Push to `main`; Vercel builds it. Add the three env vars from `.env.example`
in the Vercel project settings.

## Placeholders to replace

- Hero, previews, and swatches are cut from the approved AI mockups (`design/reference/`), not real product photos. Jenn's real photos are in `design/photos/` for when she wants to switch.
- Cord colors, leather names, and the queue values live in `src/lib/catalog.ts`. Prices there are Jenn's (2026-09-12).
- No email is sent yet; Jenn replies from the sheet. Wiring a confirmation email is a follow-up.
