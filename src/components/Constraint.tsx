import { QUEUE } from "@/lib/catalog";

/** The constraint, said out loud, and the live queue. Mono only here. */
export default function Constraint() {
  return (
    <section aria-label="How ordering works" className="mt-4xl px-5 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 lg:col-start-4 bg-paper border hairline p-8 md:p-12">
          <p className="t-mono leading-loose">
            NO CART. NO CHECKOUT.
            <br />
            YOU TELL ME WHAT YOU WANT.
            <br />
            I MAKE IT. YOU VENMO ME.
          </p>
          <p className="t-mono leading-loose mt-8 text-graphite">
            NOW MAKING Nº {QUEUE.nowMaking}
            <br />
            NEXT OPEN SLOT {QUEUE.nextOpenSlot.toUpperCase()}
          </p>
        </div>
      </div>
    </section>
  );
}
