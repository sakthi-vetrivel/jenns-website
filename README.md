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
"Orders" tab. A charm photo, when attached, is saved to a Drive folder named
"Notebook orders - charm photos" and its link goes in the `charmPhoto` column.
Set `ORDERS_WEBHOOK_URL` and `ORDERS_WEBHOOK_SECRET` in Vercel.
With no URL set, orders are logged to the server console and still get a number.

## Deploy

Push to `main`; Vercel builds it. Add the three env vars from `.env.example`
in the Vercel project settings.

## Placeholders to replace

- `public/images/*.jpg` are crops of the approved mockups, not real product photos.
- Cord colors, leather names, and the queue values live in `src/lib/catalog.ts`. Prices there are Jenn's (2026-09-12).
- No email is sent yet; Jenn replies from the sheet. Wiring a confirmation email is a follow-up.
