import { CONTACT } from "@/lib/catalog";

export default function Footer() {
  const items: React.ReactNode[] = [];
  if (CONTACT.name) items.push(CONTACT.name.toUpperCase());
  if (CONTACT.email) {
    items.push(
      <a href={`mailto:${CONTACT.email}`} className="link">
        {CONTACT.email}
      </a>,
    );
  }
  if (CONTACT.instagram) {
    items.push(
      <a href={`https://instagram.com/${CONTACT.instagram}`} className="link" target="_blank" rel="noopener">
        @{CONTACT.instagram}
      </a>,
    );
  }

  return (
    <footer className="px-5 md:px-8 py-10 border-t hairline mt-section flex flex-wrap justify-between gap-x-8 gap-y-3">
      <p className="t-mono text-graphite">MADE BY HAND · SAN FRANCISCO · {new Date().getFullYear()}</p>
      {items.length > 0 && (
        <p className="t-mono text-graphite">
          {/* The dot travels with the item after it, so a wrap never leaves one dangling. */}
          {items.map((el, i) => (
            <span key={i}>
              {i > 0 && " "}
              <span className="whitespace-nowrap">
                {i > 0 && <span aria-hidden>· </span>}
                {el}
              </span>
            </span>
          ))}
        </p>
      )}
    </footer>
  );
}
