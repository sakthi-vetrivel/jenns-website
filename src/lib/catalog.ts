/**
 * The catalog. Prices confirmed by Jenn on 2026-09-12; cord color is free.
 * Leather swatches should become cropped macro photos (see DESIGN.md); the hex
 * tints are fallbacks for the preview only and are never UI chrome.
 */

export type Leather = {
  id: string;
  name: string;
  /** Fallback tint; the swatch and preview are photographs. */
  tint: string;
  ages: string;
  /** Square crop of the mockup's leather, recolored per leather until Jenn shoots each one. */
  swatch: string;
  /** The mockup's notebook, background removed, recolored per leather, for the live preview. */
  preview: string;
};

export const LEATHERS: Leather[] = [
  { id: "sand", name: "Sand", tint: "#E8C48E", ages: "Pale now. Darkens to honey in a year of hands.", swatch: "/images/closed-hide-sand.jpg", preview: "/images/closed-notebook-sand.webp" },
  { id: "ochre", name: "Ochre", tint: "#D9A03C", ages: "Softens to mustard; the pull-up marks stay.", swatch: "/images/closed-hide-ochre.jpg", preview: "/images/closed-notebook-ochre.webp" },
  { id: "saddle", name: "Saddle", tint: "#B8733A", ages: "Warm tan that goes tobacco where you hold it.", swatch: "/images/closed-hide-saddle.jpg", preview: "/images/closed-notebook-saddle.webp" },
  { id: "terracotta", name: "Terracotta", tint: "#C26A47", ages: "Clay red-brown, deepens toward brick.", swatch: "/images/closed-hide-terracotta.jpg", preview: "/images/closed-notebook-terracotta.webp" },
  { id: "cherry", name: "Cherry", tint: "#B4272F", ages: "Keeps its red; the edges burnish first.", swatch: "/images/closed-hide-cherry.jpg", preview: "/images/closed-notebook-cherry.webp" },
  { id: "chestnut", name: "Chestnut", tint: "#8A4E3A", ages: "Deep brown from day one, gets a sheen.", swatch: "/images/closed-hide-chestnut.jpg", preview: "/images/closed-notebook-chestnut.webp" },
  { id: "plum", name: "Plum", tint: "#5E323A", ages: "Goes almost black at the spine.", swatch: "/images/closed-hide-plum.jpg", preview: "/images/closed-notebook-plum.webp" },
  { id: "green", name: "Green", tint: "#3E7A55", ages: "Grass green that mellows to moss.", swatch: "/images/closed-hide-green.jpg", preview: "/images/closed-notebook-green.webp" },
  { id: "forest", name: "Forest", tint: "#2F4A43", ages: "Blue-green so dark it reads black in low light.", swatch: "/images/closed-hide-forest.jpg", preview: "/images/closed-notebook-forest.webp" },
  { id: "black", name: "Black", tint: "#1A1816", ages: "Takes a sheen. Scratches rub out with a thumb.", swatch: "/images/closed-hide-black.jpg", preview: "/images/closed-notebook-black.webp" },
];

export type Size = { id: "full" | "passport" | "keychain"; name: string; dims: string; price: number };

export const SIZES: Size[] = [
  { id: "full", name: "Full size", dims: "4.33 × 8.25 in", price: 75 },
  { id: "passport", name: "Passport", dims: "3.5 × 5.5 in", price: 50 },
  { id: "keychain", name: "Keychain", dims: "Mini, holds one insert", price: 15 },
];

export type Cord = { id: string; name: string; color: string };

export const CORDS: Cord[] = [
  { id: "snow", name: "Snow", color: "#F5F3EE" },
  { id: "blush", name: "Blush", color: "#E8B4B8" },
  { id: "bubblegum", name: "Bubblegum pink", color: "#F98FBF" },
  { id: "cerise", name: "Cerise red", color: "#DE3163" },
  { id: "burgundy", name: "Burgundy", color: "#6B1F2A" },
  { id: "orange", name: "Orange", color: "#E8792F" },
  { id: "yellow", name: "Yellow", color: "#F2C94C" },
  { id: "doe", name: "Doe", color: "#C9A27E" },
  { id: "aqua", name: "Aqua", color: "#5FC9C2" },
  { id: "teal", name: "Teal", color: "#2E7F86" },
  { id: "forest", name: "Forest green", color: "#2F5D3A" },
  { id: "azure", name: "Azure", color: "#3C8BD9" },
  { id: "lapis", name: "Lapis", color: "#26619C" },
  { id: "navy", name: "Navy", color: "#1F2A4D" },
  { id: "lilac", name: "Lilac", color: "#C8A2C8" },
  { id: "lavender", name: "Lavender", color: "#B6A4D8" },
  { id: "charcoal", name: "Charcoal", color: "#3A3A3A" },
];

export const CHARM_PRICE = 5;
export const STAMP_PRICE = 5;
export const STAMP_MAX = 3;

export const CHARM_PLACEMENTS = [
  { id: "spine", name: "On the spine" },
  { id: "front", name: "On the front" },
] as const;

export const STAMP_PLACEMENTS = [
  { id: "spine", name: "Along the spine" },
  { id: "front", name: "Front, bottom right" },
  { id: "inside", name: "Inside cover" },
] as const;

export const DELIVERY = [
  { id: "meetup", name: "Meet at Noe Valley Town Square" },
  { id: "delivery", name: "Deliver to my address" },
] as const;

export const VENMO_HANDLE = process.env.NEXT_PUBLIC_VENMO_HANDLE ?? "jenn";

/** Static for now; later read from the same Google Sheet the orders land in. */
export const QUEUE = {
  nowMaking: "0141",
  nextOpenSlot: "3 Oct",
};
