"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setKiosk } from "@/lib/kiosk";

/** Open once on the stall iPad. Turns kiosk mode on and goes to the hero. */
export default function KioskOn() {
  const router = useRouter();
  useEffect(() => {
    setKiosk(true);
    router.replace("/");
  }, [router]);
  return <p className="t-mono px-8 py-16">KIOSK MODE ON</p>;
}
