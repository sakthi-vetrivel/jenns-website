"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setKiosk } from "@/lib/kiosk";

export default function KioskOff() {
  const router = useRouter();
  useEffect(() => {
    setKiosk(false);
    router.replace("/");
  }, [router]);
  return <p className="t-mono px-8 py-16">KIOSK MODE OFF</p>;
}
