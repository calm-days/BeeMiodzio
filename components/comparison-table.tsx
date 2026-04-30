"use client";

import Image from "next/image";
import { Check, X } from "lucide-react";
import { Fragment, useRef, useState, useEffect, type ReactNode } from "react";

type Row = {
  attribute: string;
  bad: ReactNode;
  good: ReactNode;
  badInfo?: ReactNode;
  goodInfo?: ReactNode;
};

function Tooltip({ trigger, info, font }: { trigger: ReactNode; info: ReactNode; font?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", dismiss);
    document.addEventListener("touchstart", dismiss);
    return () => {
      document.removeEventListener("mousedown", dismiss);
      document.removeEventListener("touchstart", dismiss);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span
        className="cursor-default underline decoration-2 underline-offset-2"
        style={{ textDecorationColor: "#F3BB11" }}
        onClick={() => setOpen((v) => !v)}
      >
        {trigger}
      </span>
      <div
        className={`absolute bottom-full left-1/2 z-10 w-[21rem] -translate-x-1/2 transition-opacity ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`relative rounded-2xl px-5 py-4 text-left text-sm leading-relaxed text-zinc-900 shadow-xl ${font ?? ""}`}
          style={{ backgroundColor: "#F3BB11" }}
        >
          {info}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent" style={{ borderTopColor: "#F3BB11" }} />
        </div>
      </div>
    </div>
  );
}

function renderCell(value: ReactNode, tone: "bad" | "good") {
  if (value === "✓") {
    return (
      <Check
        aria-label="tak"
        className="mx-auto h-7 w-7 stroke-[2.5] text-emerald-600 md:h-8 md:w-8"
      />
    );
  }
  if (value === "✗") {
    return (
      <X
        aria-label="nie"
        className="mx-auto h-7 w-7 stroke-[2.5] text-red-600 md:h-8 md:w-8"
      />
    );
  }
  return value;
}

export function ComparisonTable({
  rows,
  leftLabel,
  rightLabel,
}: {
  rows: Row[];
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div className="relative mx-auto py-11 md:max-w-[70%]">
      {/* Light yellow fill behind the winner column */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-1/3 rounded-3xl bg-gradient-to-b from-yellow-50/30 via-amber-50/60 to-amber-100/80"
      />

      {/* Rounded dashed ring around the winner (right) column */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-1/3 rounded-3xl border-2 border-dashed border-foreground/40"
      />

      {/* Vertical divider between col 1 (attribute) and col 2 — matches ring height */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/3 w-0 border-l-2 border-dashed border-foreground/40"
      />

      <div className="relative grid grid-cols-3">
        {/* Product mockup row (no borders) */}
        <div />
        <div className="flex items-end justify-center p-4">
          <Image
            src="/miod-z-polki.png"
            alt="Anonimowy słoik z półki"
            width={200}
            height={200}
            className="h-32 w-auto"
            style={{ filter: "brightness(0) invert(0.6)" }}
          />
        </div>
        <div className="flex items-end justify-center p-4">
          <Image
            src="/sloik-beemiodzio.png"
            alt="Słoik miodu BeeMiodzio"
            width={520}
            height={749}
            className="h-auto w-28"
          />
        </div>

        {/* Column-header label row (no dividers above/below — below comes from first data divider) */}
        <div />
        <div className="p-3 text-center text-lg font-heading text-muted-foreground">
          {leftLabel}
        </div>
        <div className="p-3 text-center text-lg font-heading text-foreground">
          {rightLabel}
        </div>

        {/* Data rows, each preceded by a full-width divider that bleeds left+right past the grid */}
        {rows.map((row, i) => (
          <Fragment key={i}>
            <div
              aria-hidden
              className="col-span-3 border-t-2 border-dashed border-foreground/40"
              style={{
                marginLeft: "calc(-1 * var(--page-px))",
                marginRight: "calc(-0.4 * var(--page-px))",
              }}
            />
            <div className="flex items-center px-3 py-5 text-xs font-medium leading-snug md:text-sm">
              {row.attribute}
            </div>
            <div className="flex items-center justify-center px-3 py-5 text-center text-xs text-muted-foreground md:text-sm">
              {row.badInfo
                ? <Tooltip trigger={row.bad} info={row.badInfo} />
                : renderCell(row.bad, "bad")}
            </div>
            <div className="flex items-center justify-center px-3 py-5 text-center text-xs font-semibold md:text-sm">
              {row.goodInfo
                ? <Tooltip trigger={row.good} info={row.goodInfo} font="font-normal" />
                : renderCell(row.good, "good")}
            </div>
          </Fragment>
        ))}

        {/* Bottom bleed divider */}
        <div
          aria-hidden
          className="col-span-3 border-t-2 border-dashed border-foreground/40"
          style={{
            marginLeft: "calc(-1 * var(--page-px))",
            marginRight: "calc(-0.4 * var(--page-px))",
          }}
        />
      </div>
    </div>
  );
}
