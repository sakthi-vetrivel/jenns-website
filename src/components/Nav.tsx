"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/notebooks", label: "Notebooks" },
  { href: "/order", label: "Order" },
] as const;

/**
 * `inset` is the hero variant: no outer padding, a hairline underneath,
 * nav items separated by a slash, as in the approved mockup.
 */
export default function Nav({ inset = false }: { inset?: boolean }) {
  const pathname = usePathname();
  return (
    <header
      className={
        inset
          ? "flex items-center justify-between pb-5 border-b hairline"
          : "flex items-center justify-between px-5 md:px-8 pt-8 pb-4"
      }
    >
      <Link href="/" className="t-wordmark text-ink inline-flex items-center min-h-11" aria-label="Jenn, home">
        JENN
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-3">
        {links.map((l, i) => {
          const current = pathname.startsWith(l.href);
          return (
            <span key={l.href} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="text-graphite">/</span>}
              <Link
                href={l.href}
                aria-current={current ? "page" : undefined}
                className={`text-ink inline-flex items-center min-h-11 px-1 ${current ? "underline underline-offset-4 decoration-1" : ""}`}
              >
                {l.label}
              </Link>
            </span>
          );
        })}
      </nav>
    </header>
  );
}
