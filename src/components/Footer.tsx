import { CONTACT } from "@/lib/catalog";

export default function Footer() {
  const contact = [
    CONTACT.email && { href: `mailto:${CONTACT.email}`, label: CONTACT.email },
    CONTACT.instagram && { href: `https://instagram.com/${CONTACT.instagram}`, label: `@${CONTACT.instagram}` },
  ].filter((c): c is { href: string; label: string } => Boolean(c));

  return (
    <footer className="px-5 md:px-8 py-10 border-t hairline mt-section flex flex-wrap justify-between gap-x-8 gap-y-3">
      <p className="t-mono text-graphite">MADE BY HAND · SAN FRANCISCO · {new Date().getFullYear()}</p>
      {contact.length > 0 && (
        <p className="t-mono text-graphite">
          {contact.map((c, i) => (
            <span key={c.href}>
              {i > 0 && <span aria-hidden> · </span>}
              <a
                href={c.href}
                className="link"
                {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
              >
                {c.label}
              </a>
            </span>
          ))}
        </p>
      )}
    </footer>
  );
}
