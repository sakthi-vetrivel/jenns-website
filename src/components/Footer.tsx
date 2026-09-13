export default function Footer() {
  return (
    <footer className="px-5 md:px-8 py-10 border-t hairline mt-section">
      <p className="t-mono text-graphite">MADE BY HAND · SAN FRANCISCO · {new Date().getFullYear()}</p>
    </footer>
  );
}
