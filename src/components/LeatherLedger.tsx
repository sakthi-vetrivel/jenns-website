import Image from "next/image";
import Link from "next/link";
import { LEATHERS } from "@/lib/catalog";

/** The ten leathers: one fan photograph and a strip of names. */
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

      <ul className="px-5 md:px-8 mt-8 flex flex-wrap gap-x-8 gap-y-4">
        {LEATHERS.map((l) => (
          <li key={l.id} className="flex items-center gap-3">
            <span className="relative block w-6 h-6 overflow-hidden rounded-sm">
              <Image src={l.swatch} alt="" fill sizes="24px" className="object-cover" />
            </span>
            <span>{l.name}</span>
          </li>
        ))}
      </ul>

      <div className="px-5 md:px-8 mt-16">
        <Link href="/order" className="link text-[1.25rem]">
          Make yours&nbsp;→
        </Link>
      </div>
    </section>
  );
}
