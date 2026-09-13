"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CHARM_PLACEMENTS,
  CORDS,
  DELIVERY,
  LEATHERS,
  SIZES,
  STAMP_MAX,
  STAMP_PLACEMENTS,
  VENMO_HANDLE,
} from "@/lib/catalog";
import { EMPTY_ORDER, priceOf, validate, type Errors, type Order } from "@/lib/order";

type Phase = "editing" | "submitting" | "confirmed";

export default function OrderForm() {
  const [order, setOrder] = useState<Order>(EMPTY_ORDER);
  const [errors, setErrors] = useState<Errors>({});
  const [phase, setPhase] = useState<Phase>("editing");
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");

  const total = useMemo(() => priceOf(order), [order]);

  const leather = LEATHERS.find((l) => l.id === order.leather);
  const cord = CORDS.find((c) => c.id === order.cord);

  function set<K extends keyof Order>(key: K, value: Order[K]) {
    setOrder((o) => ({ ...o, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(order);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = document.querySelector<HTMLElement>("[data-error]");
      first?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    setPhase("submitting");
    setServerError("");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      const data = (await res.json()) as { orderNumber?: string; error?: string };
      if (!res.ok || !data.orderNumber) throw new Error(data.error || "Something went wrong.");
      setOrderNumber(data.orderNumber);
      setPhase("confirmed");
      window.scrollTo({ top: 0 });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Nothing was charged.",
      );
      setPhase("editing");
    }
  }

  if (phase === "confirmed") {
    return <Confirmation order={order} orderNumber={orderNumber} total={total} />;
  }

  const caption = [
    orderNumber || "Nº ____",
    leather?.name.toUpperCase() ?? "CHOOSE A LEATHER",
    SIZES.find((s) => s.id === order.size)?.name.toUpperCase(),
    cord ? `${cord.name.toUpperCase()} CORD` : null,
    order.charm ? "CHARM" : null,
    order.stamp && order.stampText.trim() ? `"${order.stampText.trim().toUpperCase()}"` : null,
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 lg:grid-cols-[55fr_45fr]">
      {/* The cutting table: sticky preview stage */}
      <aside className="bg-suede lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between px-5 md:px-8 py-6 lg:py-10 sticky top-0 z-10 max-h-[180px] lg:max-h-none overflow-hidden">
        <div className="hidden lg:block">
          <h1 className="t-display">Make yours.</h1>
        </div>
        <div className="relative flex-1 my-4 lg:my-10 min-h-[120px]">
          <Preview leather={leather} cord={cord} order={order} />
        </div>
        <p className="t-mono text-graphite truncate">{caption}</p>
      </aside>

      {/* The ticket */}
      <div className="bg-paper border-l hairline px-5 md:px-10 pt-10 pb-40">
        <h1 className="t-heading lg:hidden mb-8">Make yours.</h1>

        <Section n="01" title="Leather" error={errors.leather}>
          <div className="flex flex-wrap gap-4">
            {LEATHERS.map((l) => (
              <button
                key={l.id}
                type="button"
                className="swatch w-16 h-16 md:w-[72px] md:h-[72px] relative overflow-hidden"
                style={{ background: l.tint }}
                aria-pressed={order.leather === l.id}
                aria-label={l.name}
                title={l.name}
                onClick={() => set("leather", l.id)}
              >
                <Image src={l.swatch} alt="" fill sizes="72px" className="object-cover" />
              </button>
            ))}
          </div>
          <p className="t-mono text-graphite mt-4">{leather ? leather.name.toUpperCase() : "PICK ONE"}</p>
        </Section>

        <Section n="02" title="Size" error={errors.size}>
          <Choice
            options={SIZES.map((s) => ({ id: s.id, label: s.name, hint: `${s.dims} · $${s.price}` }))}
            value={order.size}
            onChange={(v) => set("size", v as Order["size"])}
          />
        </Section>

        <Section n="03" title="Edges">
          <Choice
            options={[
              { id: "square", label: "Square corners" },
              { id: "rounded", label: "Rounded corners" },
            ]}
            value={order.roundedEdges ? "rounded" : "square"}
            onChange={(v) => set("roundedEdges", v === "rounded")}
          />
        </Section>

        <Section n="04" title="Cord" error={errors.cord}>
          <div className="flex flex-wrap gap-4">
            {CORDS.map((c) => (
              <button
                key={c.id}
                type="button"
                className="swatch !rounded-full w-7 h-7"
                style={{ background: c.color }}
                aria-pressed={order.cord === c.id}
                aria-label={c.name}
                title={c.name}
                onClick={() => set("cord", c.id)}
              />
            ))}
          </div>
          <p className="t-mono text-graphite mt-4">{cord ? cord.name.toUpperCase() : "PICK ONE"}</p>
        </Section>

        <Section n="05" title="Charm" hint="A small stone on the cord. +$8." error={errors.charmPlacement}>
          <Choice
            options={[
              { id: "no", label: "No charm" },
              { id: "yes", label: "Add a charm" },
            ]}
            value={order.charm ? "yes" : "no"}
            onChange={(v) => {
              set("charm", v === "yes");
              if (v === "no") set("charmPlacement", "");
            }}
          />
          <Expand open={order.charm}>
            <p className="t-label mt-6 mb-3 text-graphite">Where</p>
            <Choice
              options={CHARM_PLACEMENTS.map((p) => ({ id: p.id, label: p.name }))}
              value={order.charmPlacement}
              onChange={(v) => set("charmPlacement", v as Order["charmPlacement"])}
            />
          </Expand>
        </Section>

        <Section
          n="06"
          title="Stamp"
          hint="Initials or a few words, pressed into the leather by hand. +$10."
          error={errors.stampText || errors.stampPlacement}
        >
          <Choice
            options={[
              { id: "no", label: "No stamp" },
              { id: "yes", label: "Add a stamp" },
            ]}
            value={order.stamp ? "yes" : "no"}
            onChange={(v) => {
              set("stamp", v === "yes");
              if (v === "no") {
                set("stampText", "");
                set("stampPlacement", "");
              }
            }}
          />
          <Expand open={order.stamp}>
            <label className="block mt-6">
              <span className="t-label text-graphite">Text</span>
              <div className="relative mt-2">
                <input
                  className="input pr-16 uppercase tracking-[0.08em]"
                  value={order.stampText}
                  maxLength={STAMP_MAX}
                  placeholder="e.g. MAKE IT COUNT"
                  aria-invalid={!!errors.stampText}
                  onChange={(e) => set("stampText", e.target.value)}
                />
                <span className="t-mono text-graphite absolute right-3 top-1/2 -translate-y-1/2">
                  {order.stampText.length} / {STAMP_MAX}
                </span>
              </div>
            </label>
            <p className="t-label mt-6 mb-3 text-graphite">Where</p>
            <Choice
              options={STAMP_PLACEMENTS.map((p) => ({ id: p.id, label: p.name }))}
              value={order.stampPlacement}
              onChange={(v) => set("stampPlacement", v as Order["stampPlacement"])}
            />
          </Expand>
        </Section>

        <Section n="07" title="You" error={errors.name || errors.email || errors.delivery || errors.address}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name" error={errors.name}>
              <input
                className="input"
                autoComplete="name"
                value={order.name}
                aria-invalid={!!errors.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                className="input"
                type="email"
                autoComplete="email"
                value={order.email}
                aria-invalid={!!errors.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
            <Field label="Phone (optional)">
              <input
                className="input"
                type="tel"
                autoComplete="tel"
                value={order.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
          </div>
          <p className="t-label mt-8 mb-3 text-graphite">How you&rsquo;ll get it</p>
          <Choice
            options={DELIVERY.map((d) => ({ id: d.id, label: d.name }))}
            value={order.delivery}
            onChange={(v) => set("delivery", v as Order["delivery"])}
          />
          <Expand open={order.delivery === "delivery"}>
            <div className="mt-6">
              <Field label="Address" error={errors.address}>
                <textarea
                  className="input min-h-24"
                  autoComplete="street-address"
                  value={order.address}
                  aria-invalid={!!errors.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </Field>
            </div>
          </Expand>
          <div className="mt-6">
            <Field label="Anything else (optional)">
              <textarea
                className="input min-h-20"
                value={order.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section n="08" title="Payment">
          <p className="max-w-prose">
            Nothing is charged here. When you reserve, I get your order and
            confirm by hand within a day. Then you Venmo{" "}
            <span className="t-mono">@{VENMO_HANDLE}</span> and I start cutting.
          </p>
        </Section>

        {serverError && (
          <p className="t-mono text-oxblood mt-6" role="alert">
            {serverError.toUpperCase()} NOTHING WAS CHARGED.
          </p>
        )}
      </div>

      {/* Fixed total bar */}
      <div className="fixed bottom-0 inset-x-0 lg:left-[55%] bg-paper border-t hairline px-5 md:px-10 py-4 flex items-center justify-between gap-4 z-20">
        <p key={total} className="t-mono tick">
          TOTAL ${total}
          <span className="hidden md:inline"> · PAY BY VENMO AFTER CONFIRMATION</span>
        </p>
        <button type="submit" className="btn-primary" disabled={phase === "submitting"}>
          {phase === "submitting" ? "Reserving…" : "Reserve my notebook"}
        </button>
      </div>
    </form>
  );
}

function Preview({
  leather,
  cord,
  order,
}: {
  leather?: (typeof LEATHERS)[number];
  cord?: (typeof CORDS)[number];
  order: Order;
}) {
  const passport = order.size === "passport";
  const radius = order.roundedEdges ? 14 : 3;
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="relative shadow-none transition-none"
        style={{
          width: passport ? "38%" : "44%",
          aspectRatio: passport ? "3.5 / 5.5" : "4.33 / 8.25",
          maxHeight: "100%",
          background: leather?.tint ?? "#C99C6B",
          borderRadius: radius,
          opacity: leather ? 1 : 0.45,
        }}
        aria-hidden
      >
        {/* cord */}
        <div
          className="absolute inset-x-0"
          style={{
            top: "48%",
            height: 3,
            background: cord?.color ?? "rgba(28,31,43,0.25)",
          }}
        />
        {order.charm && (
          <div
            className="absolute rounded-full"
            style={{
              top: "calc(48% - 7px)",
              left: order.charmPlacement === "spine" ? "6%" : "44%",
              width: 16,
              height: 16,
              background: "#E9E4DA",
              border: "1px solid rgba(28,31,43,0.4)",
            }}
          />
        )}
        {order.stamp && order.stampText.trim() && (
          <p
            className="deboss t-mono absolute"
            style={
              order.stampPlacement === "spine"
                ? { left: 6, top: "50%", transform: "rotate(-90deg) translateX(-50%)", transformOrigin: "left top", whiteSpace: "nowrap" }
                : { right: 10, bottom: 10, whiteSpace: "nowrap" }
            }
          >
            {order.stampText.trim().toUpperCase()}
          </p>
        )}
      </div>
    </div>
  );
}

function Section({
  n,
  title,
  hint,
  error,
  children,
}: {
  n: string;
  title: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="border-t hairline py-8 grid grid-cols-[3rem_1fr] gap-x-4"
      aria-labelledby={`s-${n}`}
      data-error={error ? "" : undefined}
    >
      <p className="t-mono pt-1">{n}</p>
      <div>
        <h2 id={`s-${n}`} className="t-label mb-5">
          {title}
          {hint && <span className="ml-3 normal-case tracking-normal text-graphite font-normal">{hint}</span>}
        </h2>
        {children}
        {error && (
          <p className="t-mono text-oxblood mt-4" role="alert">
            {error.toUpperCase()}
          </p>
        )}
      </div>
    </section>
  );
}

function Choice({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string; hint?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3">
      {options.map((o) => {
        const selected = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(o.id)}
            className={`text-left pb-1 border-b ${selected ? "border-ink" : "border-transparent"}`}
          >
            <span>{o.label}</span>
            {o.hint && <span className="t-mono text-graphite block">{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

function Expand({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div className="expand" data-open={open ? "true" : "false"} aria-hidden={!open}>
      <div>{open ? children : <div className="pointer-events-none">{children}</div>}</div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="t-label text-graphite">{label}</span>
      <div className="mt-2">{children}</div>
      {error && <span className="t-mono text-oxblood block mt-2">{error.toUpperCase()}</span>}
    </label>
  );
}

function Confirmation({ order, orderNumber, total }: { order: Order; orderNumber: string; total: number }) {
  const leather = LEATHERS.find((l) => l.id === order.leather)?.name ?? "";
  const size = SIZES.find((s) => s.id === order.size)?.name ?? "";
  const cord = CORDS.find((c) => c.id === order.cord)?.name ?? "";
  const note = encodeURIComponent(`${orderNumber} ${leather} ${size}`);
  const venmo = `https://venmo.com/?txn=pay&audience=private&recipients=${VENMO_HANDLE}&amount=${total}&note=${note}`;
  const lines: [string, string][] = [
    ["LEATHER", leather.toUpperCase()],
    ["SIZE", size.toUpperCase()],
    ["EDGES", order.roundedEdges ? "ROUNDED" : "SQUARE"],
    ["CORD", cord.toUpperCase()],
    ["CHARM", order.charm ? (CHARM_PLACEMENTS.find((p) => p.id === order.charmPlacement)?.name.toUpperCase() ?? "YES") : "NONE"],
    ["STAMP", order.stamp ? `"${order.stampText.trim().toUpperCase()}"` : "NONE"],
    ["MADE FOR", order.name.trim().toUpperCase()],
    ["DELIVERY", DELIVERY.find((d) => d.id === order.delivery)?.name.toUpperCase() ?? ""],
  ];
  return (
    <section className="px-5 md:px-8 py-16 lg:py-24 flex justify-center">
      <div className="bg-paper border hairline w-full max-w-xl p-8 md:p-12 text-center">
        <p className="t-mono text-graphite">RESERVED</p>
        <h1 className="t-heading mt-3">{orderNumber}</h1>
        <dl className="t-mono text-left mt-10 border-t hairline">
          {lines.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b hairline py-2">
              <dt className="text-graphite">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 py-3">
            <dt>TOTAL</dt>
            <dd>${total}</dd>
          </div>
        </dl>
        <p className="mt-10 max-w-prose mx-auto">
          I&rsquo;ll confirm by hand within a day. Once I do, Venmo{" "}
          <span className="t-mono">@{VENMO_HANDLE}</span> with the order number
          in the note and I&rsquo;ll start cutting.
        </p>
        <a href={venmo} className="btn-primary inline-block mt-8" target="_blank" rel="noopener">
          Open Venmo · ${total}
        </a>
        <p className="t-mono text-graphite mt-8">I&rsquo;LL WRITE TO {order.email.trim().toUpperCase()}</p>
      </div>
    </section>
  );
}
