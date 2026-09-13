import Footer from "@/components/Footer";

/** The home page draws its own header inside the hero's left panel. */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
