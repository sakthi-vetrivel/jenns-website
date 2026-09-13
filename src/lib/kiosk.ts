/**
 * Kiosk mode: the iPad on Jenn's stall at a fair. Switched on by visiting
 * /kiosk once (stored in localStorage), off via /kiosk/off. In kiosk mode the
 * confirmation shows a Venmo QR code and a "Next customer" control, and an
 * idle timer returns the screen to the hero for the next person.
 */
export const KIOSK_KEY = "jenn:kiosk";
export const KIOSK_IDLE_MS = 120_000;
export const KIOSK_CONFIRM_RESET_MS = 90_000;

export function isKiosk(): boolean {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem(KIOSK_KEY) === "1";
  } catch {
    return false;
  }
}

export function setKiosk(on: boolean) {
  try {
    if (on) window.localStorage.setItem(KIOSK_KEY, "1");
    else window.localStorage.removeItem(KIOSK_KEY);
  } catch {
    /* private mode: kiosk just won't persist */
  }
}

import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

/** Hydration-safe: false on the server and during hydration, then the stored flag. */
export function useKiosk(): boolean {
  return useSyncExternalStore(subscribe, isKiosk, () => false);
}
