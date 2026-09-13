import type { Metadata } from "next";
import LeatherLedger from "@/components/LeatherLedger";
import { SIZES, dims } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Notebooks · Jenn",
  description: "Ten leathers, three sizes, one notebook made by hand.",
};

export default function Notebooks() {
  return (
    <>
      <section className="px-5 md:px-8 pt-12 lg:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <h1 className="t-display lg:col-span-8">
          A cover that
          <br />
          outlasts its inserts.
        </h1>
        <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end gap-6">
          <p>
            A traveler&rsquo;s notebook is a leather cover with elastic cords that
            hold refillable paper inserts. When one insert fills up, you slide in
            another. The cover stays with you for decades.
          </p>
          <dl className="t-mono leading-loose border-t hairline pt-4">
            {SIZES.map((s) => (
              <div key={s.id} className="flex justify-between gap-4">
                <dt>{s.name.toUpperCase()}</dt>
                <dd>
                  {dims(s)} · ${s.price}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <LeatherLedger />
    </>
  );
}
