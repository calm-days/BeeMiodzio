"use client";

import Image from "next/image";
import { Check, HelpCircle, Slash } from "lucide-react";
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

function GoodCell({ value }: { value: ReactNode }) {
  if (value === "✓") {
    return (
      <span
        aria-label="tak"
        className="mx-auto flex h-7 w-7 items-center justify-center rounded-full md:h-9 md:w-9"
        style={{ backgroundColor: "#F3BB11" }}
      >
        <Check className="h-4 w-4 stroke-[3] text-zinc-900 md:h-5 md:w-5" />
      </span>
    );
  }
  return <>{value}</>;
}

function BadCell({ value }: { value: ReactNode }) {
  if (value === "✗") {
    return (
      <span
        aria-label="nie"
        className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border-2 border-foreground/25 md:h-9 md:w-9"
      >
        <Slash className="h-3.5 w-3.5 stroke-[2] text-foreground/40 md:h-4 md:w-4" />
      </span>
    );
  }
  if (value === "✓") {
    return (
      <span
        aria-label="tak"
        className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border-2 border-foreground/25 md:h-9 md:w-9"
      >
        <HelpCircle className="h-3.5 w-3.5 stroke-[2] text-foreground/40 md:h-4 md:w-4" />
      </span>
    );
  }
  return <span className="text-muted-foreground">{value}</span>;
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
    <div className="relative mx-auto py-2 md:max-w-[82%]">
      {/* Soft yellow highlight panel behind the winner (middle) column.
          Mobile (grid-cols-3): col 2 spans 33.333%–66.666%.
          Desktop (1.5fr 1fr 1fr, sum 3.5fr): col 2 spans 42.857%–71.428%. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/3 w-1/3 rounded-[2rem] md:left-[42.857%] md:w-[28.571%]"
        style={{ backgroundColor: "#FBE891" }}
      />

      <div className="relative grid grid-cols-3 md:grid-cols-[1.5fr_1fr_1fr]">
        {/* Product mockup row */}
        <div />
        <div className="flex h-36 items-end justify-center px-4 pt-2 pb-2 md:h-44">
          <Image
            src="/sloik-beemiodzio.png"
            alt="Słoik miodu BeeMiodzio"
            width={520}
            height={749}
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="flex h-36 items-end justify-center px-4 pt-2 pb-2 md:h-44">
          <Image
            src="/miod-z-polki.png"
            alt="Anonimowy słoik z półki"
            width={200}
            height={200}
            className="h-[78%] w-auto object-contain"
            style={{ filter: "brightness(0) invert(0.72)" }}
          />
        </div>

        {/* Pill-shaped column labels */}
        <div />
        <div className="flex justify-center pb-4">
          <span
            className="rounded-full px-4 py-1.5 text-sm font-medium text-zinc-900"
            style={{ backgroundColor: "#F3BB11" }}
          >
            {rightLabel}
          </span>
        </div>
        <div className="flex justify-center pb-4">
          <span className="rounded-full bg-foreground/10 px-4 py-1.5 text-sm font-medium text-foreground/60">
            {leftLabel}
          </span>
        </div>

        {/* Data rows with solid thin separators */}
        {rows.map((row, i) => (
          <Fragment key={i}>
            <div
              aria-hidden
              className="col-span-3 border-t border-foreground/15"
            />
            <div className="flex items-center px-3 py-3 text-sm font-medium leading-snug md:text-base">
              {row.attribute}
            </div>
            <div className="flex items-center justify-center px-3 py-3 text-center text-sm font-medium md:text-base">
              {row.goodInfo
                ? <Tooltip trigger={row.good} info={row.goodInfo} font="font-normal" />
                : <GoodCell value={row.good} />}
            </div>
            <div className="flex items-center justify-center px-3 py-3 text-center text-sm md:text-base">
              {row.badInfo
                ? <Tooltip trigger={row.bad} info={row.badInfo} />
                : <BadCell value={row.bad} />}
            </div>
          </Fragment>
        ))}

        {/* Bottom spacer so the yellow highlight panel extends past the last row (no bottom separator). */}
        <div className="col-span-3 h-2" />
      </div>
    </div>
  );
}
