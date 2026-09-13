import {
  CHARM_PLACEMENTS,
  CHARM_PRICE,
  CORDS,
  DELIVERY,
  DELIVERY_PRICE,
  LEATHERS,
  SIZES,
  STAMP_MAX,
  STAMP_PLACEMENTS,
  STAMP_PRICE,
  VENMO_HANDLE,
} from "./catalog";

export type Order = {
  leather: string;
  size: "full" | "passport" | "keychain";
  roundedEdges: boolean;
  cord: string;
  charm: boolean;
  charmPlacement: "spine" | "front" | "";
  charmDescription: string;
  /** Downscaled JPEG as a data URL, set client-side. Saved to Drive by the sheet script. */
  charmImage: { name: string; dataUrl: string } | null;
  stamp: boolean;
  stampText: string;
  stampPlacement: "spine" | "front" | "inside" | "";
  name: string;
  email: string;
  phone: string;
  delivery: "meetup" | "delivery" | "";
  address: string;
  notes: string;
};

export const EMPTY_ORDER: Order = {
  leather: "chestnut",
  size: "full",
  roundedEdges: false,
  cord: "",
  charm: false,
  charmPlacement: "",
  charmDescription: "",
  charmImage: null,
  stamp: false,
  stampText: "",
  stampPlacement: "",
  name: "",
  email: "",
  phone: "",
  delivery: "",
  address: "",
  notes: "",
};

export function priceOf(o: Pick<Order, "size" | "charm" | "stamp" | "delivery">): number {
  const size = SIZES.find((s) => s.id === o.size) ?? SIZES[0];
  return (
    size.price +
    (o.charm ? CHARM_PRICE : 0) +
    (o.stamp ? STAMP_PRICE : 0) +
    (o.delivery === "delivery" ? DELIVERY_PRICE : 0)
  );
}

export type Errors = Partial<Record<keyof Order, string>>;

/** Raw bytes after client-side downscale; base64 adds ~35%. Stays under Vercel's 4.5 MB body cap. */
export const CHARM_IMAGE_MAX_BYTES = 2_500_000;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(o: Order): Errors {
  const e: Errors = {};
  if (!LEATHERS.some((l) => l.id === o.leather)) e.leather = "Pick a leather.";
  if (!SIZES.some((s) => s.id === o.size)) e.size = "Pick a size.";
  if (!CORDS.some((c) => c.id === o.cord)) e.cord = "Pick a cord color.";
  if (o.charm) {
    if (!CHARM_PLACEMENTS.some((p) => p.id === o.charmPlacement))
      e.charmPlacement = "Where should the charm go?";
    if (!o.charmDescription.trim() && !o.charmImage)
      e.charmDescription = "Describe the charm or add a photo of it.";
    if (o.charmDescription.trim().length > 500) e.charmDescription = "Keep it under 500 characters.";
    if (o.charmImage && o.charmImage.dataUrl.length > CHARM_IMAGE_MAX_BYTES * 1.4)
      e.charmImage = "That photo is too large. Try a smaller one.";
  }
  if (o.stamp) {
    const t = o.stampText.trim();
    if (!t) e.stampText = "What should I stamp?";
    else if (t.length > STAMP_MAX) e.stampText = `Up to ${STAMP_MAX} letters.`;
    if (!STAMP_PLACEMENTS.some((p) => p.id === o.stampPlacement))
      e.stampPlacement = "Where should the stamp go?";
  }
  if (!o.name.trim()) e.name = "I need a name for the tag.";
  if (!EMAIL.test(o.email.trim())) e.email = "That email doesn't look right.";
  if (!DELIVERY.some((d) => d.id === o.delivery)) e.delivery = "Pick a way to get it to you.";
  if (o.delivery === "delivery" && !o.address.trim()) e.address = "Where should it go?";
  return e;
}

/** "042" → "Nº 042". The number itself is issued by the sheet, three digits counting up. */
export function orderLabel(orderNumber: string): string {
  return `Nº ${orderNumber}`;
}

/** Flat, human-readable shape that maps 1:1 to sheet columns. The sheet fills in orderNumber. */
export function toRow(o: Order, total: number) {
  const leather = LEATHERS.find((l) => l.id === o.leather)?.name ?? o.leather;
  const size = SIZES.find((s) => s.id === o.size)?.name ?? o.size;
  const cord = CORDS.find((c) => c.id === o.cord)?.name ?? o.cord;
  return {
    orderNumber: "",
    submittedAt: new Date().toISOString(),
    status: "new",
    leather,
    size,
    roundedEdges: o.roundedEdges ? "yes" : "no",
    cord,
    charm: o.charm ? (CHARM_PLACEMENTS.find((p) => p.id === o.charmPlacement)?.name ?? "yes") : "no",
    charmDescription: o.charm ? o.charmDescription.trim() : "",
    charmPhoto: "", // Drive link, filled in by the sheet script when a photo was attached
    stamp: o.stamp ? o.stampText.trim() : "no",
    stampPlacement: o.stamp ? (STAMP_PLACEMENTS.find((p) => p.id === o.stampPlacement)?.name ?? "") : "",
    name: o.name.trim(),
    email: o.email.trim(),
    phone: o.phone.trim(),
    delivery: DELIVERY.find((d) => d.id === o.delivery)?.name ?? o.delivery,
    address: o.delivery === "delivery" ? o.address.trim() : "",
    deliveryFee: o.delivery === "delivery" ? DELIVERY_PRICE : 0,
    notes: o.notes.trim(),
    total,
    paid: "no",
  };
}

export type OrderRow = ReturnType<typeof toRow>;

/** The spec as label/value pairs, shared by the confirmation and the email fallback. */
export function specLines(o: Order): [string, string][] {
  const leather = LEATHERS.find((l) => l.id === o.leather)?.name ?? "";
  const size = SIZES.find((s) => s.id === o.size)?.name ?? "";
  const cord = CORDS.find((c) => c.id === o.cord)?.name ?? "";
  return [
    ["LEATHER", leather.toUpperCase()],
    ["SIZE", size.toUpperCase()],
    ["CORNERS", o.roundedEdges ? "ROUNDED" : "SQUARE"],
    ["CORD", cord.toUpperCase()],
    [
      "CHARM",
      o.charm
        ? [
            CHARM_PLACEMENTS.find((p) => p.id === o.charmPlacement)?.name.toUpperCase() ?? "YES",
            o.charmImage ? "PHOTO ATTACHED" : null,
          ]
            .filter(Boolean)
            .join(" · ")
        : "NONE",
    ],
    ["STAMP", o.stamp ? `"${o.stampText.trim().toUpperCase()}"` : "NONE"],
    ["MADE FOR", o.name.trim().toUpperCase()],
    [
      "DELIVERY",
      [
        DELIVERY.find((d) => d.id === o.delivery)?.name.toUpperCase() ?? "",
        o.delivery === "delivery" ? `+$${DELIVERY_PRICE}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
    ],
  ];
}

/**
 * Plain-text receipt for the email fallback: everything the sheet row would
 * have carried, so Jenn can enter it by hand. The charm photo can't ride a
 * mailto link; the customer is asked to attach it.
 */
export function receiptText(o: Order, total: number): string {
  const lines: string[] = [];
  for (const [k, v] of specLines(o)) lines.push(`${k}: ${v}`);
  if (o.charm && o.charmDescription.trim()) lines.push(`CHARM DESCRIPTION: ${o.charmDescription.trim()}`);
  if (o.stamp) {
    const where = STAMP_PLACEMENTS.find((p) => p.id === o.stampPlacement)?.name ?? "";
    if (where) lines.push(`STAMP PLACEMENT: ${where.toUpperCase()}`);
  }
  lines.push(`TOTAL: $${total}`);
  lines.push(`VENMO: $${total} to @${VENMO_HANDLE}, memo "Notebook for ${o.name.trim()}"`);
  lines.push("");
  lines.push(`NAME: ${o.name.trim()}`);
  lines.push(`EMAIL: ${o.email.trim()}`);
  if (o.phone.trim()) lines.push(`PHONE: ${o.phone.trim()}`);
  if (o.delivery === "delivery" && o.address.trim()) lines.push(`ADDRESS: ${o.address.trim()}`);
  if (o.notes.trim()) lines.push(`NOTES: ${o.notes.trim()}`);
  if (o.charm && o.charmImage) {
    lines.push("");
    lines.push("(Please attach the charm photo to this email.)");
  }
  return lines.join("\n");
}

/** mailto: link that opens the customer's mail app with the receipt filled in. */
export function receiptMailto(to: string, o: Order, total: number): string {
  const subject = `Notebook order for ${o.name.trim()}`;
  const body = receiptText(o, total);
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
