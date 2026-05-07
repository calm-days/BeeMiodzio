"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoLink } from "@/components/logo-link";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none sticky top-0 z-40 bg-transparent h-[82px] lg:h-[152px]">
      <nav className="container-page flex items-start justify-between py-4">

        <div className="pointer-events-auto">
          <LogoLink scrolled={scrolled} />
        </div>
        <div className="pointer-events-auto flex items-center gap-6 text-sm">
          <Link
            href="/na-prezent"
            className="font-medium text-white transition-opacity hover:opacity-80"
          >
            Na prezent
          </Link>
          <Link
            href="/dla-biznesu"
            className="font-medium text-white transition-opacity hover:opacity-80"
          >
            Dla biznesu
          </Link>
          <Link
            href="/cennik"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-primary px-4 py-2 font-medium leading-none text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Kup ul
          </Link>
        </div>
      </nav>
    </header>
  );
}
