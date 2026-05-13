"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useHeroConfig } from "@/components/section-config";
import { cn } from "@/lib/utils";

export function LogoLink({ scrolled = false }: { scrolled?: boolean }) {
  const [config] = useHeroConfig();
  return (
    <Link href="/">
      <Image
        src="/logo-yellow.webp"
        alt="BeeMiodzio"
        width={1024}
        height={1024}
        className={cn(
          "h-[var(--mobile-logo-h)] w-auto transition-[height] duration-300",
          scrolled ? "lg:h-[56px]" : "lg:h-[120px]",
        )}
        style={
          {
            "--mobile-logo-h": `${config.mobileLogoHeight}px`,
          } as CSSProperties
        }
        priority
        unoptimized
      />
    </Link>
  );
}
