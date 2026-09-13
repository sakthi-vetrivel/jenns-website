"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/notebooks", label: "Notebooks" },
  { href: "/order", label: "Order" },
] as const;

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="flex items-center justify-between px-5 md:px-8 pt-8 pb-4">
      <Link
        href="/"
        className="t-heading !text-[1.5rem] tracking-[0.12em] text-ink"
        aria-label="Jenn, home"
      >
        JENN
      </Link>
      <nav aria-label="Primary" className="flex gap-6">
        {links.map((l) => {
          const current = pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={current ? "page" : undefined}
              className={`text-ink ${current ? "underline underline-offset-4 decoration-1" : ""}`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
