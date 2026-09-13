import { NextResponse } from "next/server";
import { toRow, validate, priceOf, type Order } from "@/lib/order";
import { CHARM_IMAGE_MAX_BYTES } from "@/lib/order";
import { diagnoseSheetResponse, snippet } from "@/lib/sheet";

export const runtime = "nodejs";

/**
 * Health check: GET /api/order asks the Apps Script's doGet what it is and
 * names the problem if Google answers with a page instead. No secrets in the
 * reply. Open it in a browser after changing the deployment.
 */
export async function GET() {
  const url = process.env.ORDERS_WEBHOOK_URL;
  const secretSet = Boolean(process.env.ORDERS_WEBHOOK_SECRET);
  if (!url) {
    return NextResponse.json({ ok: false, webhook: "missing", secretSet, fix: "Set ORDERS_WEBHOOK_URL in Vercel." });
  }
  try {
    const res = await fetch(url, { redirect: "follow", cache: "no-store" });
    const text = await res.text();
    const d = diagnoseSheetResponse(res.status, text);
    return NextResponse.json({
      ok: d.code === "ok",
      webhook: url.endsWith("/exec") ? "exec" : url.includes("/dev") ? "dev (wrong: use the /exec URL)" : "set",
      secretSet,
      status: res.status,
      code: d.code,
      fix: d.fix || undefined,
      scriptVersion: d.json?.version,
      reply: d.json ?? snippet(text),
    });
  } catch (err) {
    return NextResponse.json({ ok: false, webhook: "set", secretSet, code: "unreachable", fix: String(err) });
  }
}

/**
 * Receives an order, validates it, and forwards a flat row to the Google Apps
 * Script web app (ORDERS_WEBHOOK_URL) that appends it to Jenn's sheet. The
 * sheet hands out the order number (three digits, counting up), so an order
 * only has a number once it has landed. Without the env var (local dev) the
 * row is logged and the response says it wasn't stored.
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

  const charmImage = body.charm && body.charmImage ? body.charmImage : null;
  if (charmImage) {
    const ok =
      typeof charmImage.dataUrl === "string" &&
      /^data:image\/(jpeg|png|webp);base64,/.test(charmImage.dataUrl) &&
      charmImage.dataUrl.length <= CHARM_IMAGE_MAX_BYTES * 1.4;
    if (!ok) return NextResponse.json({ error: "That charm photo couldn't be read." }, { status: 422 });
  }

  const row = toRow(body, priceOf(body));

  const url = process.env.ORDERS_WEBHOOK_URL;
  const secret = process.env.ORDERS_WEBHOOK_SECRET ?? "";

  if (!url) {
    console.warn("[order] ORDERS_WEBHOOK_URL not set; row not sent:", {
      ...row,
      charmPhoto: charmImage ? `(photo attached, ${Math.round(charmImage.dataUrl.length * 0.75 / 1024)} KB)` : "",
    });
    return NextResponse.json({ stored: false });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids Apps Script CORS preflight
      body: JSON.stringify({ secret, row, charmImage }),
      redirect: "follow", // Apps Script responds with a 302 to the result
      cache: "no-store",
    });
    const text = await res.text();
    const d = diagnoseSheetResponse(res.status, text);
    const orderNumber = d.json?.orderNumber;
    if (d.code !== "ok" || typeof orderNumber !== "string" || !orderNumber) {
      console.error("[order] sheet rejected row:", res.status, d.code, snippet(text));
      // Google answers with a page, not JSON, for every misconfiguration; d.fix names it.
      // The customer sees the short line; GET /api/order shows the full diagnosis.
      const msg =
        d.code === "unknown" || d.code === "html"
          ? "Couldn't save your order. Try again in a minute."
          : "The order sheet isn't accepting orders yet.";
      return NextResponse.json({ error: msg, code: d.code, fix: d.fix }, { status: 502 });
    }
    return NextResponse.json({ orderNumber, stored: true });
  } catch (err) {
    console.error("[order] sheet unreachable:", err);
    return NextResponse.json({ error: "Couldn't reach the order sheet. Try again in a minute." }, { status: 502 });
  }
}
