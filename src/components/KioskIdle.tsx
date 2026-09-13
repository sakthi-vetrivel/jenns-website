"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useKiosk, KIOSK_IDLE_MS } from "@/lib/kiosk";

/**
 * In kiosk mode, after two minutes without a touch, go back to the hero so
 * the next customer starts fresh. Leaving /order unmounts the form and clears
 * whatever the last person typed.
 */
export default function KioskIdle() {
  const router = useRouter();
  const pathname = usePathname();
  const kiosk = useKiosk();

  useEffect(() => {
    if (!kiosk || pathname === "/") return;
    let timer = window.setTimeout(reset, KIOSK_IDLE_MS);
    function reset() {
      router.push("/");
    }
    function bump() {
      window.clearTimeout(timer);
      timer = window.setTimeout(reset, KIOSK_IDLE_MS);
    }
    const events = ["pointerdown", "pointermove", "keydown", "touchstart", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, bump));
    };
  }, [kiosk, pathname, router]);

  return null;
}
