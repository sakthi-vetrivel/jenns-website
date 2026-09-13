import { NextResponse } from "next/server";
import { toRow, validate, priceOf, type Order } from "@/lib/order";

export const runtime = "nodejs";

/**
 * Receives an order, validates it, and forwards a flat row to the Google Apps
 * Script web app (ORDERS_WEBHOOK_URL) that appends it to Jenn's sheet.
 * Without the env var (local dev) it logs the row and still returns a number.
 */
export async function POST(req: Request) {
  let body: Order;
  try {
    body = (await req.json()) as Order;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const errors = validate(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Please check the form.", errors }, { status: 422 });
  }

  const orderNumber = makeOrderNumber();
  const row = toRow(body, orderNumber, priceOf(body));

  const url = process.env.ORDERS_WEBHOOK_URL;
  const secret = process.env.ORDERS_WEBHOOK_SECRET ?? "";

  if (!url) {
    console.warn("[order] ORDERS_WEBHOOK_URL not set; row not sent:", row);
    return NextResponse.json({ orderNumber, stored: false });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids Apps Script CORS preflight
      body: JSON.stringify({ secret, row }),
      redirect: "follow", // Apps Script responds with a 302 to the result
      cache: "no-store",
    });
    const text = await res.text();
    let ok = res.ok;
    try {
      ok = ok && (JSON.parse(text) as { ok?: boolean }).ok !== false;
    } catch {
      /* non-JSON body: trust the status */
    }
    if (!ok) {
      console.error("[order] sheet rejected row:", res.status, text.slice(0, 300));
      return NextResponse.json({ error: "Couldn't save your order. Try again in a minute." }, { status: 502 });
    }
  } catch (err) {
    console.error("[order] sheet unreachable:", err);
    return NextResponse.json({ error: "Couldn't reach the order sheet. Try again in a minute." }, { status: 502 });
  }

  return NextResponse.json({ orderNumber, stored: true });
}

/** JN-YYMMDD-XXXX, e.g. JN-260912-K7Q2. Readable on a Venmo note, unique enough. */
function makeOrderNumber() {
  const d = new Date();
  const ymd = [d.getFullYear() % 100, d.getMonth() + 1, d.getDate()]
    .map((n) => String(n).padStart(2, "0"))
    .join("");
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const tail = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `JN-${ymd}-${tail}`;
}
