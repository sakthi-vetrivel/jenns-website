"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const TURN_MS = 700;

export default function Hero() {
  const router = useRouter();
  const [turning, setTurning] = useState(false);
  const started = useRef(false);

  function makeYours(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (started.current) return;
    started.current = true;
    router.prefetch("/order");
    setTurning(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => router.push("/order"), reduced ? 200 : TURN_MS);
  }

  return (
    <section className="page-stage relative grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-6rem)]">
      {/* The page: linen ground, headline, link. This is what turns. */}
      <div
        className="page relative z-10 lg:col-span-5 flex flex-col justify-between px-5 md:px-8 pb-8 pt-12 lg:pt-24 bg-linen"
        data-turning={turning ? "true" : "false"}
      >
        <div>
          <h1 className="t-display stamp lg:whitespace-nowrap lg:w-max relative z-20">
            Made by hand.
            <br />
            Made for you.
            <br />
            Made to outlast you.
          </h1>
          <a
            href="/order"
            onClick={makeYours}
            className="link inline-block mt-10 text-[1.25rem]"
          >
            Make yours&nbsp;→
          </a>
        </div>
        <div className="hidden lg:block border-t hairline pt-6 mt-16 self-end w-full">
          <p className="t-mono text-right leading-relaxed">
            Nº 0142
            <br />
            SADDLE VEG-TAN
            <br />
            FULL SIZE
            <br />
            MADE FOR ______
          </p>
        </div>
      </div>

      {/* The object. It stays put while the page turns around it. */}
      <div className="relative lg:col-span-7 min-h-[60vh] lg:min-h-0 order-first lg:order-none">
        <Image
          src="/images/hero-tan.jpg"
          alt="A tan leather traveler's notebook with a sage cord, a stone charm, and MAKE IT COUNT stamped down its edge."
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
      </div>

      <p className="t-mono lg:hidden px-5 pt-4 text-graphite">
        Nº 0142 · SADDLE VEG-TAN · FULL SIZE · MADE FOR ______
      </p>
    </section>
  );
}
