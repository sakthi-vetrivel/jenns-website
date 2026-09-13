import {
  CHARM_PLACEMENTS,
  CHARM_PRICE,
  CORDS,
  DELIVERY,
  LEATHERS,
  SIZES,
  STAMP_MAX,
  STAMP_PLACEMENTS,
  STAMP_PRICE,
} from "./catalog";

export type Order = {
  leather: string;
  size: "full" | "passport";
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
  leather: "",
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

export function priceOf(o: Pick<Order, "size" | "charm" | "stamp">): number {
  const size = SIZES.find((s) => s.id === o.size) ?? SIZES[0];
  return size.price + (o.charm ? CHARM_PRICE : 0) + (o.stamp ? STAMP_PRICE : 0);
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
    else if (t.length > STAMP_MAX) e.stampText = `Up to ${STAMP_MAX} characters.`;
    if (!STAMP_PLACEMENTS.some((p) => p.id === o.stampPlacement))
      e.stampPlacement = "Where should the stamp go?";
  }
  if (!o.name.trim()) e.name = "I need a name for the tag.";
  if (!EMAIL.test(o.email.trim())) e.email = "That email doesn't look right.";
  if (!DELIVERY.some((d) => d.id === o.delivery)) e.delivery = "Pick a way to get it to you.";
  if (o.delivery === "delivery" && !o.address.trim()) e.address = "Where should it go?";
  return e;
}

/** Flat, human-readable shape that maps 1:1 to sheet columns. */
export function toRow(o: Order, orderNumber: string, total: number) {
  const leather = LEATHERS.find((l) => l.id === o.leather)?.name ?? o.leather;
  const size = SIZES.find((s) => s.id === o.size)?.name ?? o.size;
  const cord = CORDS.find((c) => c.id === o.cord)?.name ?? o.cord;
  return {
    orderNumber,
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
    notes: o.notes.trim(),
    total,
    paid: "no",
  };
}

export type OrderRow = ReturnType<typeof toRow>;
