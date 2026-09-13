/** The home page draws its own header inside the hero's left panel and has no footer. */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex-1">{children}</main>;
}
