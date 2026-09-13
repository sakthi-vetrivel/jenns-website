import Image from "next/image";
import Link from "next/link";
import { LEATHERS } from "@/lib/catalog";

/**
 * One leather per viewport when a photograph exists; a ledger row when it
 * doesn't. No grid, no cards. Photos come from Jenn.
 */
export default function LeatherLedger() {
  return (
    <section aria-labelledby="leathers" className="mt-3xl">
      <div className="px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <h2 id="leathers" className="t-heading lg:col-span-5">
          Six leathers. One notebook.
        </h2>
        <p className="lg:col-span-5 lg:col-start-7 max-w-prose">
          Every cover is cut from full-grain, vegetable-tanned hide. It arrives
          smooth and leaves with your fingerprints in it. Pick the one you want
          to grow old with.
        </p>
      </div>

      <div className="relative mt-16 aspect-[18/11] w-full">
        <Image
          src="/images/leathers-fan.jpg"
          alt="Six leather traveler's notebooks fanned out: natural, saddle, cognac, mustard, cherry, and burgundy."
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <ol>
        {LEATHERS.map((l, i) => (
          <li key={l.id} className="border-t hairline">
            {l.photo ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[80vh]">
                <div className="relative lg:col-span-7 min-h-[50vh]">
                  <Image
                    src={l.photo}
                    alt={`A ${l.name.toLowerCase()} leather traveler's notebook.`}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="lg:col-span-4 lg:col-start-9 px-5 md:px-8 py-12 flex flex-col justify-end">
                  <p className="t-mono text-graphite">0{i + 1}</p>
                  <h3 className="t-heading mt-2">{l.name}</h3>
                  <p className="t-mono mt-6">{l.ages.toUpperCase()}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-[3rem_1fr] lg:grid-cols-12 items-baseline gap-4 px-5 md:px-8 py-8">
                <p className="t-mono text-graphite lg:col-span-1">0{i + 1}</p>
                <h3 className="t-heading !text-[1.75rem] lg:col-span-4">{l.name}</h3>
                <p className="t-mono col-start-2 lg:col-start-6 lg:col-span-6">
                  {l.ages.toUpperCase()}
                </p>
              </div>
            )}
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
