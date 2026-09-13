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
    <section className="page-stage relative grid grid-cols-1 lg:grid-cols-12 min-h-screen lg:h-screen lg:min-h-[720px] [container-type:inline-size]">
      {/* The page: header, headline, link, tag. This is what turns. */}
      <div
        className="page relative z-10 lg:col-span-5 flex flex-col bg-linen px-5 md:px-8 pt-8 pb-8"
        data-turning={turning ? "true" : "false"}
      >
        <Nav inset />

        <div className="hero-copy flex-1 flex flex-col justify-center py-10 lg:py-0">
          {/* Two copies in one grid cell: ink on the page, paper where the line crosses onto the photo.
              The clip starts at the panel's right edge: 5/12 of the section width, minus the 2rem padding. */}
          <div className="grid lg:w-max">
            <h1 className="t-display stamp col-start-1 row-start-1 lg:whitespace-nowrap">{HEADLINE}</h1>
            <h1
              aria-hidden
              className="t-display stamp col-start-1 row-start-1 hidden lg:block whitespace-nowrap text-paper"
              style={{ clipPath: "inset(0 0 0 calc(41.6667cqw - 2rem))" }}
            >
              {HEADLINE}
            </h1>
          </div>
          <a href="/order" onClick={makeYours} className="link inline-block mt-10 text-[1.25rem] w-max">
            Make yours&nbsp;→
          </a>
        </div>

        <div className="border-t hairline pt-6">
          <p className="t-mono text-right leading-relaxed">
            Nº 0142
            <br />
            CHESTNUT VEG-TAN
            <br />
            FULL SIZE
            <br />
            MADE FOR ______
          </p>
        </div>
      </div>

      {/* The object. It stays put while the page turns around it. */}
      <div className="relative lg:col-span-7 h-[48vh] md:h-[52vh] lg:h-auto lg:min-h-0 order-first lg:order-none overflow-hidden">
        <Image
          src="/images/hero-scene.jpg"
          alt="A closed chestnut leather traveler's notebook with a sage cord and a brass bead, on raw linen over pine, in afternoon light."
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
