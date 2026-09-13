export default function Footer() {
  return (
    <footer className="px-5 md:px-8 py-12 border-t hairline mt-3xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <p className="max-w-md">
          Every notebook is cut, stitched, and stamped by hand in San Francisco.
          No cart, no checkout. You tell me what you want, I make it, you Venmo me.
        </p>
        <p className="t-mono text-graphite">
          MADE BY HAND · SAN FRANCISCO · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
