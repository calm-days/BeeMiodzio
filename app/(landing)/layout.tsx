import Link from "next/link";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-border">
        <nav className="flex items-center justify-between px-[5%] py-4">
          <Link href="/" className="font-heading text-xl font-bold text-primary">
            BeeSharing
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/cennik" className="hover:text-primary">Cennik</Link>
            <Link href="/o-nas" className="hover:text-primary">O nas</Link>
            <Link href="/logowanie" className="text-primary font-medium">Zaloguj się</Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2025 BeeSharing Poland. Twój ul. Twój miód.
      </footer>
    </>
  );
}
