/**
 * The catalog. Prices confirmed by Jenn on 2026-09-12; cord color is free.
 * Leather swatches should become cropped macro photos (see DESIGN.md); the hex
 * tints are fallbacks for the preview only and are never UI chrome.
 */

export type Leather = {
  id: string;
  name: string;
  tint: string;
  ages: string;
  /** Square macro crop of the real hide, for the order ticket. */
  swatch: string;
  /** Full photograph of a finished notebook in this leather, when Jenn has one. */
  photo?: string;
};

export const LEATHERS: Leather[] = [
  { id: "natural", name: "Natural", tint: "#D3A46A", ages: "Pale now. Darkens to honey in a year of hands.", swatch: "/images/leather-natural.jpg" },
  { id: "saddle", name: "Saddle", tint: "#B5825C", ages: "Warm tan that goes tobacco where you hold it.", swatch: "/images/leather-saddle.jpg" },
  { id: "cognac", name: "Cognac", tint: "#C8783F", ages: "Orange-brown, deepens toward chestnut.", swatch: "/images/leather-cognac.jpg" },
  { id: "mustard", name: "Mustard", tint: "#C9962E", ages: "Softens to ochre; the pull-up marks stay.", swatch: "/images/leather-mustard.jpg" },
  { id: "cherry", name: "Cherry", tint: "#B0202A", ages: "Keeps its red; the edges burnish first.", swatch: "/images/leather-cherry.jpg" },
  { id: "burgundy", name: "Burgundy", tint: "#5E2A32", ages: "Goes almost black at the spine.", swatch: "/images/leather-burgundy.jpg" },
];

export type Size = { id: "full" | "passport" | "keychain"; name: string; dims: string; price: number };

export const SIZES: Size[] = [
  { id: "full", name: "Full size", dims: "4.33 × 8.25 in", price: 75 },
  { id: "passport", name: "Passport", dims: "3.5 × 5.5 in", price: 50 },
  { id: "keychain", name: "Keychain", dims: "Mini, clips to your keys", price: 15 },
];

export type Cord = { id: string; name: string; color: string };

export const CORDS: Cord[] = [
  { id: "sage", name: "Sage", color: "#8A9A7B" },
  { id: "cream", name: "Cream", color: "#E6DCC8" },
  { id: "black", name: "Black", color: "#1A1613" },
  { id: "rust", name: "Rust", color: "#A85A2E" },
  { id: "navy", name: "Navy", color: "#2E3A5C" },
  { id: "mustard", name: "Mustard", color: "#C9962E" },
  { id: "burgundy", name: "Burgundy", color: "#5E2A32" },
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
