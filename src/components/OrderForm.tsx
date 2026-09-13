"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useKiosk, KIOSK_CONFIRM_RESET_MS } from "@/lib/kiosk";
import {
  CHARM_PLACEMENTS,
  CHARM_PRICE,
  CORDS,
  DELIVERY,
  DELIVERY_PRICE,
  dims,
  LEATHERS,
  SIZES,
  STAMP_MAX,
  STAMP_PLACEMENTS,
  STAMP_PRICE,
  VENMO_HANDLE,
  venmoUrl,
} from "@/lib/catalog";
import { CHARM_IMAGE_MAX_BYTES, EMPTY_ORDER, priceOf, validate, type Errors, type Order } from "@/lib/order";

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
      // The error markup renders on the next frame; scroll after React commits it.
      requestAnimationFrame(() => {
        const first = document.querySelector<HTMLElement>("[data-error]");
        first?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
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
    <form onSubmit={submit} noValidate className="grid grid-cols-1 lg:grid-cols-[46fr_54fr] xl:grid-cols-[55fr_45fr] bg-suede">
      {/* The cutting table: sticky preview stage */}
      <aside className="lg:sticky lg:top-0 lg:h-screen flex flex-col px-5 md:px-12 py-6 lg:py-10 sticky top-0 z-10 max-h-[200px] md:max-h-[300px] lg:max-h-none overflow-hidden">
        <p className="t-label text-graphite text-center hidden lg:block">Order no.</p>
        <h1 className="t-heading text-center mt-2 hidden lg:block tracking-[0.04em]">
          {orderNumber || (
            <>
              JN-
              <span className="inline-block w-[4ch] border-b border-ink align-baseline" aria-label="pending" />
            </>
          )}
        </h1>
        <div className="relative flex-1 my-3 lg:my-8 min-h-[140px]">
          <Preview leather={leather} cord={cord} order={order} />
        </div>
        <p className="t-mono text-graphite text-center truncate">{caption}</p>
      </aside>

      {/* The ticket */}
      <div className="lg:py-8 lg:pr-8">
        <div className="ticket-edge bg-paper px-5 md:px-8 xl:px-10 pt-10 pb-40 lg:pb-32">
          <div className="flex items-baseline justify-between pb-6 border-b hairline">
            <span className="t-label text-graphite">Make yours</span>
            <span className="flex items-baseline gap-6">
              <button
                type="button"
                className="link t-mono"
                onClick={() => {
                  setOrder(EMPTY_ORDER);
                  setErrors({});
                  window.scrollTo({ top: 0 });
                }}
              >
                START OVER
              </button>
            </span>
          </div>
          <h1 className="t-heading lg:hidden mt-8 tracking-[0.04em]">
            {orderNumber || (
              <>
                JN-
                <span className="inline-block w-[4ch] border-b border-ink align-baseline" aria-label="pending" />
              </>
            )}
          </h1>

        <Section n="01" title="Choose your leather" error={errors.leather}>
          <div className="flex flex-wrap gap-4">
            {LEATHERS.map((l) => (
              <button
                key={l.id}
                type="button"
                className="swatch w-16 h-16 md:w-[72px] md:h-[72px] relative overflow-hidden rounded-sm"
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

        <Section n="02" title="Choose your size" error={errors.size}>
          <div className="flex flex-wrap gap-3">
            {SIZES.map((sz) => (
              <button
                key={sz.id}
                type="button"
                className="option-box"
                aria-pressed={order.size === sz.id}
                onClick={() => set("size", sz.id)}
              >
                <span className="t-label block">{sz.name}</span>
                <span className="t-mono text-graphite block mt-1">
                  {dims(sz)} · ${sz.price}
                </span>
              </button>
            ))}
          </div>
        </Section>

        <Section n="03" title="Corners">
          <Choice
            options={[
              { id: "square", label: "Square corners" },
              { id: "rounded", label: "Rounded corners" },
            ]}
            value={order.roundedEdges ? "rounded" : "square"}
            onChange={(v) => set("roundedEdges", v === "rounded")}
          />
        </Section>

        <Section n="04" title="Choose your cord" hint="Any color, no charge." error={errors.cord}>
          <div className="flex flex-wrap gap-4">
            {CORDS.map((c) => (
              <button
                key={c.id}
                type="button"
                className="swatch !rounded-full w-10 h-10"
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

        <Section
          n="05"
          title="Add a charm"
          hint={`A small stone or trinket on the cord. +$${CHARM_PRICE}.`}
          error={errors.charmPlacement || errors.charmDescription || errors.charmImage}
        >
          <Choice
            options={[
              { id: "no", label: "No charm" },
              { id: "yes", label: "Add a charm" },
            ]}
            value={order.charm ? "yes" : "no"}
            onChange={(v) => {
              set("charm", v === "yes");
              if (v === "no") {
                set("charmPlacement", "");
                set("charmDescription", "");
                set("charmImage", null);
              }
            }}
          />
          <Expand open={order.charm}>
            <p className="t-label mt-6 mb-3 text-graphite">Where</p>
            <Choice
              options={CHARM_PLACEMENTS.map((p) => ({ id: p.id, label: p.name }))}
              value={order.charmPlacement}
              onChange={(v) => set("charmPlacement", v as Order["charmPlacement"])}
            />
            <div className="mt-6">
              <Field label="Describe the charm" error={errors.charmDescription}>
                <textarea
                  className="input min-h-24"
                  value={order.charmDescription}
                  maxLength={500}
                  placeholder="e.g. a small rose quartz disc in a gold bezel, or one you already own"
                  aria-invalid={!!errors.charmDescription}
                  onChange={(e) => set("charmDescription", e.target.value)}
                />
              </Field>
            </div>
            <div className="mt-6">
              <CharmPhoto
                image={order.charmImage}
                error={errors.charmImage}
                onChange={(img) => set("charmImage", img)}
              />
            </div>
          </Expand>
        </Section>

        <Section
          n="06"
          title="Add a stamp"
          hint={`Up to ${STAMP_MAX} letters, pressed into the leather by hand. +$${STAMP_PRICE}.`}
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
                  placeholder="e.g. JLH"
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

        <Section n="07" title="Where it goes" error={errors.name || errors.email || errors.delivery || errors.address}>
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
            options={DELIVERY.map((d) => ({ id: d.id, label: d.name, hint: d.price ? `+$${d.price}` : "No charge" }))}
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
            Full payment up front, to <span className="t-mono">@{VENMO_HANDLE}</span> on Venmo. Reserve
            first: that gives your order a number, and the Venmo button that follows carries the total
            and the number as the memo so Jenn can match the payment to your notebook.
          </p>
          <button type="submit" className="btn-primary mt-6" disabled={phase === "submitting"}>
            {phase === "submitting" ? "Reserving…" : `Reserve & pay $${total} with Venmo`}
          </button>
        </Section>

        {serverError && (
          <p className="t-mono text-oxblood mt-6" role="alert">
            {serverError.toUpperCase()} NOTHING WAS CHARGED.
          </p>
        )}
        </div>
      </div>

      {/* Fixed total bar */}
      <div className="fixed bottom-0 inset-x-0 lg:left-[46%] xl:left-[55%] lg:right-8 bg-paper border-t hairline px-5 md:px-8 xl:px-10 py-4 flex items-center justify-between gap-4 z-20">
        <p key={total} className="t-mono tick">
          TOTAL ${total}
          <span className="hidden xl:inline"> · PAY BY VENMO AFTER CONFIRMATION</span>
        </p>
        <button type="submit" className="btn-primary" disabled={phase === "submitting"}>
          {phase === "submitting" ? "Reserving…" : "Reserve & pay with Venmo"}
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
  const size = SIZES.find((sz) => sz.id === order.size) ?? SIZES[0];
  const full = SIZES[0];
  // Height relative to the stage so the three sizes read at true relative scale.
  const heightPct = Math.max(44, Math.round((size.height / full.height) * 78));
  const radius = order.roundedEdges ? "4% / 2.6%" : "0.6% / 0.4%";
  const src = leather?.preview ?? "/images/cover-sand.webp";
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="relative"
        style={{ height: `${heightPct}%`, aspectRatio: `${size.width} / ${size.height}`, maxWidth: "80%" }}
      >
        {/* The cover: the rendered notebook squared off, so corners are drawn here. */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: radius,
            opacity: leather ? 1 : 0.5,
            boxShadow: "-14px 18px 22px rgba(40,32,24,0.22), -3px 4px 6px rgba(40,32,24,0.18)",
          }}
          aria-hidden
        >
          <Image src={src} alt="" fill sizes="45vw" className="object-fill" />
          {cord && (
            <div
              className="absolute left-0 right-0"
              style={{
                top: "50%",
                height: size.id === "keychain" ? 2 : 3,
                background: cord.color,
                boxShadow: "0 1px 1px rgba(0,0,0,0.25)",
              }}
            />
          )}
          {order.charm && order.charmPlacement !== "spine" && (
            <div
              className="absolute rounded-full"
              style={{
                top: "calc(50% - 9px)",
                left: "46%",
                width: 20,
                height: 20,
                background: "radial-gradient(circle at 35% 35%, #F4EFE6, #C9C0B2)",
                border: "1px solid rgba(120,100,60,0.6)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.35)",
              }}
            />
          )}
          {order.stamp && order.stampText.trim() && (
            <p
              className="deboss t-mono absolute text-[0.95rem] tracking-[0.2em]"
              style={
                order.stampPlacement === "spine"
                  ? { left: "5%", top: "62%", transform: "rotate(-90deg)", transformOrigin: "left top", whiteSpace: "nowrap" }
                  : order.stampPlacement === "inside"
                    ? { left: "50%", bottom: "6%", transform: "translateX(-50%)", opacity: 0.5, whiteSpace: "nowrap" }
                    : { right: "8%", bottom: "6%", whiteSpace: "nowrap" }
              }
            >
              {order.stampText.trim().toUpperCase()}
            </p>
          )}
        </div>

        {/* Spine charm: a small loop at the top of the spine, a short chain, and the stone
            dangling off the top-left corner. Sits lower on a keychain so it clears the ring. */}
        {order.charm && order.charmPlacement === "spine" && (
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            className="absolute overflow-visible"
            style={{ width: "40%", left: "-30%", top: size.id === "keychain" ? "6%" : "-14%" }}
          >
            <defs>
              <linearGradient id="charm-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#E2C990" />
                <stop offset="0.5" stopColor="#B08D57" />
                <stop offset="1" stopColor="#6F532B" />
              </linearGradient>
              <radialGradient id="charm-stone" cx="0.35" cy="0.35" r="0.7">
                <stop offset="0" stopColor="#FBF7F0" />
                <stop offset="0.6" stopColor="#E3D9CB" />
                <stop offset="1" stopColor="#B9AD9C" />
              </radialGradient>
            </defs>
            {/* jump ring on the spine edge */}
            <circle cx="80" cy="72" r="4" fill="none" stroke="url(#charm-gold)" strokeWidth="2" />
            {/* fine chain out from the corner */}
            <g fill="none" stroke="url(#charm-gold)" strokeWidth="1.8" strokeLinecap="round">
              <ellipse cx="72" cy="64" rx="3.4" ry="2" transform="rotate(-45 72 64)" />
              <ellipse cx="65" cy="57" rx="2" ry="3.4" transform="rotate(-45 65 57)" />
              <ellipse cx="58" cy="50" rx="3.4" ry="2" transform="rotate(-45 58 50)" />
              <ellipse cx="51" cy="43" rx="2" ry="3.4" transform="rotate(-45 51 43)" />
            </g>
            {/* bezel and stone */}
            <circle cx="40" cy="32" r="11" fill="url(#charm-gold)" />
            <circle cx="40" cy="32" r="8.5" fill="url(#charm-stone)" />
            <circle cx="40" cy="32" r="11" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" />
          </svg>
        )}

        {/* Keychain: a brass grommet on the spine, a short chain, and a split ring. */}
        {size.id === "keychain" && (
          <svg
            aria-hidden
            viewBox="0 0 140 140"
            className="absolute overflow-visible"
            style={{ width: "62%", left: "-46%", top: "-30%" }}
          >
            <defs>
              <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#E2C990" />
                <stop offset="0.5" stopColor="#B08D57" />
                <stop offset="1" stopColor="#6F532B" />
              </linearGradient>
            </defs>
            {/* grommet set into the spine edge */}
            <circle cx="112" cy="112" r="7.5" fill="url(#brass)" stroke="#5A431F" strokeWidth="1" />
            <circle cx="112" cy="112" r="3" fill="#D6CCBC" stroke="#8A6320" strokeWidth="0.8" />
            {/* chain: alternating links climbing up-left */}
            <g fill="none" stroke="url(#brass)" strokeWidth="3.2" strokeLinecap="round">
              <ellipse cx="103" cy="103" rx="5.5" ry="3.2" transform="rotate(-45 103 103)" />
              <ellipse cx="94" cy="94" rx="3.2" ry="5.5" transform="rotate(-45 94 94)" />
              <ellipse cx="85" cy="85" rx="5.5" ry="3.2" transform="rotate(-45 85 85)" />
              <ellipse cx="76" cy="76" rx="3.2" ry="5.5" transform="rotate(-45 76 76)" />
              <ellipse cx="67" cy="67" rx="5.5" ry="3.2" transform="rotate(-45 67 67)" />
            </g>
            {/* split ring */}
            <circle cx="46" cy="46" r="20" fill="none" stroke="url(#brass)" strokeWidth="4.5" />
            <circle cx="46" cy="46" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="30 200" />
            <path d="M46 26 a20 20 0 0 1 14 6" fill="none" stroke="#5A431F" strokeWidth="1.2" />
          </svg>
        )}

        {/* Dimension lines: width below, height to the right. */}
        <div className="absolute left-0 right-0 -bottom-9 flex flex-col items-center" aria-hidden>
          <div className="w-full flex items-center">
            <span className="w-px h-3 bg-graphite" />
            <span className="flex-1 h-px bg-graphite" />
            <span className="w-px h-3 bg-graphite" />
          </div>
          <span className="t-mono text-graphite mt-1">{size.width} IN</span>
        </div>
        <div className="absolute top-0 bottom-0 -right-9 flex items-center" aria-hidden>
          <div className="h-full flex flex-col items-center">
            <span className="h-px w-3 bg-graphite" />
            <span className="flex-1 w-px bg-graphite" />
            <span className="h-px w-3 bg-graphite" />
          </div>
          <span className="t-mono text-graphite ml-1 [writing-mode:vertical-rl]">{size.height} IN</span>
        </div>
      </div>
      {!leather && (
        <p className="t-mono text-graphite absolute bottom-0 left-0 right-0 text-center">START WITH A LEATHER</p>
      )}
    </div>
  );
}

function CharmPhoto({
  image,
  error,
  onChange,
}: {
  image: Order["charmImage"];
  error?: string;
  onChange: (img: Order["charmImage"]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");

  async function pick(file: File | undefined) {
    if (!file) return;
    setLocalError("");
    if (!file.type.startsWith("image/")) {
      setLocalError("That isn't an image.");
      return;
    }
    setBusy(true);
    try {
      onChange({ name: file.name, dataUrl: await downscale(file) });
    } catch {
      setLocalError("Couldn't read that photo. Try a JPG or PNG.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="t-label text-graphite">Photo of the charm (optional)</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {image ? (
        <div className="mt-2 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.dataUrl}
            alt="Your charm"
            className="w-20 h-20 object-cover border hairline bg-suede"
          />
          <div>
            <p className="t-mono truncate max-w-[14rem]">{image.name.toUpperCase()}</p>
            <button
              type="button"
              className="link t-mono mt-1"
              onClick={() => {
                onChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              REMOVE
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="btn-ghost mt-2"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Reading…" : "Add a photo"}
        </button>
      )}
      {(localError || error) && (
        <p className="t-mono text-oxblood mt-2" role="alert">
          {(localError || error || "").toUpperCase()}
        </p>
      )}
    </div>
  );
}

/** Resize to at most 1600px on the long side and re-encode as JPEG until it fits the cap. */
async function downscale(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const long = Math.max(bitmap.width, bitmap.height);
  const scale = Math.min(1, 1600 / long);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  for (const q of [0.82, 0.7, 0.55, 0.4]) {
    const url = canvas.toDataURL("image/jpeg", q);
    if (url.length * 0.75 <= CHARM_IMAGE_MAX_BYTES) return url;
  }
  throw new Error("too large");
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
            className={`text-left min-h-11 py-2 border-b ${selected ? "border-ink" : "border-transparent"}`}
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
  const router = useRouter();
  const [qr, setQr] = useState<string>("");
  const kiosk = useKiosk();
  const leather = LEATHERS.find((l) => l.id === order.leather)?.name ?? "";
  const size = SIZES.find((s) => s.id === order.size)?.name ?? "";
  const cord = CORDS.find((c) => c.id === order.cord)?.name ?? "";
  const venmo = venmoUrl(total, orderNumber);

  useEffect(() => {
    let live = true;
    QRCode.toString(venmo, { type: "svg", margin: 0, color: { dark: "#1C1F2B", light: "#F9F6F1" } })
      .then((svg) => {
        if (live) setQr(svg);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [venmo]);

  useEffect(() => {
    if (!kiosk) return;
    const t = window.setTimeout(() => router.push("/"), KIOSK_CONFIRM_RESET_MS);
    return () => window.clearTimeout(t);
  }, [kiosk, router]);

  const lines: [string, string][] = [
    ["LEATHER", leather.toUpperCase()],
    ["SIZE", size.toUpperCase()],
    ["CORNERS", order.roundedEdges ? "ROUNDED" : "SQUARE"],
    ["CORD", cord.toUpperCase()],
    [
      "CHARM",
      order.charm
        ? [
            CHARM_PLACEMENTS.find((p) => p.id === order.charmPlacement)?.name.toUpperCase() ?? "YES",
            order.charmImage ? "PHOTO ATTACHED" : null,
          ]
            .filter(Boolean)
            .join(" · ")
        : "NONE",
    ],
    ["STAMP", order.stamp ? `"${order.stampText.trim().toUpperCase()}"` : "NONE"],
    ["MADE FOR", order.name.trim().toUpperCase()],
    [
      "DELIVERY",
      [
        DELIVERY.find((d) => d.id === order.delivery)?.name.toUpperCase() ?? "",
        order.delivery === "delivery" ? `+$${DELIVERY_PRICE}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
    ],
  ];
  return (
    <section className="px-5 md:px-8 py-12 lg:py-20 flex justify-center bg-suede min-h-screen">
      <div className="ticket-edge bg-paper w-full max-w-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-start">
        <div>
          <p className="t-mono text-graphite">RESERVED</p>
          <h1 className="t-heading mt-3">{orderNumber}</h1>
          <dl className="t-mono mt-8 border-t hairline">
            {lines.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b hairline py-2">
                <dt className="text-graphite">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 py-3">
              <dt>TOTAL</dt>
              <dd>${total}</dd>
            </div>
          </dl>
          <p className="mt-8 max-w-prose">
            {kiosk ? (
              <>
                Scan the code to pay <span className="t-mono">@{VENMO_HANDLE}</span> the full amount on
                Venmo. Jenn will confirm within a day and start cutting.
              </>
            ) : (
              <>
                Your notebook is reserved. The button opens Venmo with the full amount and your order
                number as the memo. Once it lands, I&rsquo;ll confirm within a day and start cutting.
              </>
            )}
          </p>
          {!kiosk && (
            <a href={venmo} className="btn-primary inline-block mt-8" target="_blank" rel="noopener">
              Pay ${total} to @{VENMO_HANDLE} on Venmo
            </a>
          )}
          <p className="t-mono text-graphite mt-8">I&rsquo;LL WRITE TO {order.email.trim().toUpperCase()}</p>
        </div>
        <div className="flex flex-col items-center gap-4 md:pt-2">
          {qr && (
            <div
              className="w-44 h-44 md:w-52 md:h-52 [&>svg]:w-full [&>svg]:h-full"
              aria-label={`Venmo payment QR code for ${orderNumber}`}
              role="img"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
          )}
          <p className="t-mono text-graphite text-center">
            VENMO @{VENMO_HANDLE.toUpperCase()}
            <br />${total} · {orderNumber}
          </p>
          {kiosk && (
            <button type="button" className="btn-ghost mt-4" onClick={() => router.push("/")}>
              Next customer
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
