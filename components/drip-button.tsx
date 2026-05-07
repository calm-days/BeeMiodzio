import Link from "next/link";
import type { ReactNode } from "react";

type DripButtonProps = {
  href: string;
  children: ReactNode;
  fontSize: number;
  paddingX: number;
  paddingY: number;
  borderRadius: number;
  dripOffset: number;
  dripInset: number;
};

export function DripButton({
  href,
  children,
  fontSize,
  paddingX,
  paddingY,
  borderRadius,
  dripOffset,
  dripInset,
}: DripButtonProps) {
  return (
    <div className="relative inline-flex flex-col items-center">
      <Link
        href={href}
        className="relative z-10 inline-flex items-center justify-center whitespace-nowrap text-trim-cap bg-primary font-medium leading-none text-primary-foreground transition-colors hover:bg-primary/90"
        style={{
          fontSize: `${fontSize}px`,
          padding: `${paddingY + 1}px ${paddingX}px ${paddingY - 1}px`,
          borderRadius: "9999px",
        }}
      >
        {children}
      </Link>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 201.126 74.676"
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: `calc(100% - ${dripOffset}px)`,
          left: "50%",
          transform: "translateX(-50%)",
          width: `calc(100% - ${dripInset * 2}px)`,
          color: "var(--primary)",
        }}
      >
        <path
          d="M0,0S16.706,0,22.647,8.912s8.912,11.882,14.853,2.97,7.151-8.911,19.913-8.911,18.7,8.911,18.7,20.794S70.3,42.216,73.267,51.127s11.882,8.912,11.882-2.97-3.09-15.481-3.09-24.392S84.526,2.971,93.689,2.971s24.016,8.911,35.9,8.911,14.853-8.911,32.676-8.911,17.824,17.823,23.765,17.823S195.059,0,201,0Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
