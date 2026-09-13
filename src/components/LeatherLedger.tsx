import Image from "next/image";
import Link from "next/link";
import { LEATHERS } from "@/lib/catalog";

/**
 * One leather per viewport when a photograph exists; a ledger row when it
 * doesn't. No grid, no cards. Photos come from Jenn.
 */
export default function LeatherLedger() {
  return (
    <section aria-labelledby="leathers" className="mt-section">
      <div className="px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <h2 id="leathers" className="t-heading lg:col-span-5">
          Ten leathers. One notebook.
        </h2>
        <p className="lg:col-span-5 lg:col-start-7 max-w-prose">
          Every cover is cut from full-grain, vegetable-tanned hide. It arrives
          smooth and leaves with your fingerprints in it. Pick the one you want
          to grow old with.
        </p>
      </div>

      <div className="relative mt-16 aspect-[18/11] w-full">
        <Image
          src="/images/fan-ten.jpg"
          alt="Ten leather traveler's notebooks fanned out on linen: sand, ochre, saddle, terracotta, cherry, chestnut, plum, green, forest, and black."
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <ol>
        {LEATHERS.map((l, i) => (
          <li key={l.id} className="border-t hairline">
            <div className="grid grid-cols-[3rem_1fr] lg:grid-cols-12 items-center gap-4 px-5 md:px-8 py-6">
              <p className="t-mono text-graphite lg:col-span-1">{String(i + 1).padStart(2, "0")}</p>
              <div className="flex items-center gap-5 lg:col-span-4">
                <span className="relative block w-14 h-14 shrink-0 overflow-hidden rounded-sm">
                  <Image src={l.swatch} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <h3 className="t-heading !text-[1.75rem]">{l.name}</h3>
              </div>
              <p className="text-graphite col-start-2 lg:col-start-6 lg:col-span-6">{l.ages}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="px-5 md:px-8 mt-16">
        <Link href="/order" className="link text-[1.25rem]">
          Make yours&nbsp;→
        </Link>
      </div>
    </section>
  );
}
