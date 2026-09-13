"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Nav from "@/components/Nav";

const TURN_MS = 700;

const HEADLINE = (
  <>
    Made by hand.
    <br />
    Made for you.
    <br />
    Made to outlast you.
  </>
);

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
    <section className="page-stage relative grid grid-cols-1 lg:grid-cols-12 lg:h-screen lg:min-h-[720px]">
      {/* The page: header, headline, link, tag. This is what turns. */}
      <div
        className="page relative z-10 lg:col-span-5 flex flex-col bg-linen px-5 md:px-8 pt-8 pb-8 lg:overflow-hidden"
        data-turning={turning ? "true" : "false"}
      >
        <Nav inset />

        <div className="hero-copy flex-1 flex flex-col justify-center py-16 lg:py-0">
          <h1 className="t-display stamp lg:whitespace-nowrap lg:w-max relative z-20">{HEADLINE}</h1>
          <a href="/order" onClick={makeYours} className="link inline-block mt-10 text-[1.25rem] w-max">
            Make yours&nbsp;→
          </a>
        </div>

        <div className="border-t hairline pt-6">
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
      <div className="relative lg:col-span-7 min-h-[70vh] lg:min-h-0 order-first lg:order-none overflow-hidden">
        <Image
          src="/images/hero-tan.jpg"
          alt="A tan leather traveler's notebook with a sage cord, a stone charm, and MAKE IT COUNT stamped down its edge, on raw linen over pine."
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover"
        />
        {/* Knockout: a clone of the page column, invisible except the headline in paper,
            positioned exactly where the real column sits so the overflow lands on the photo. */}
        <div
          aria-hidden
          className="hidden lg:flex absolute inset-y-0 flex-col px-8 pt-8 pb-8 pointer-events-none invisible"
          style={{ left: "calc(-100% * 5 / 7)", width: "calc(100% * 5 / 7)" }}
        >
          <Nav inset />
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="t-display stamp whitespace-nowrap w-max text-paper visible">{HEADLINE}</h1>
            <span className="inline-block mt-10 text-[1.25rem] w-max">Make yours&nbsp;→</span>
          </div>
          <div className="border-t pt-6">
            <p className="t-mono text-right leading-relaxed">
              Nº 0142<br />SADDLE VEG-TAN<br />FULL SIZE<br />MADE FOR ______
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
