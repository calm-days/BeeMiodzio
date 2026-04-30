"use client";

import Image from "next/image";
import Link from "next/link";
import { useTaryfyConfig } from "@/components/section-config";

interface Plan {
  name: string;
  price: string;
  renewal: string;
  honey: string;
  features: string[];
  extras?: string[];
  highlighted?: boolean;
}

const KLARNA_PINK = "#FFA8CD";
const ACCENT_GREEN = "#3BA56B";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="mt-[3px] h-[18px] w-[18px] flex-none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="11" fill={ACCENT_GREEN} />
      <path
        d="M 7 12.5 L 10.5 16 L 17 9"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KlarnaBadge() {
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-md px-1.5 py-px text-[11px] font-bold leading-[1.4] text-foreground"
      style={{ backgroundColor: KLARNA_PINK }}
    >
      Klarna.
    </span>
  );
}

function BestSellerBadge() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-0 z-30"
      style={{ transform: "translate(-50%, -52%) rotate(-4deg)" }}
      aria-label="Bestseller"
    >
      <Image
        src="/bestseller-badge.png"
        alt="Bestseller"
        width={70}
        height={82}
        className="object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
        priority
      />
    </div>
  );
}

function DripShape({
  height,
  fill,
  fillOpacity,
}: {
  height: number;
  fill: string;
  fillOpacity?: number;
}) {
  // Use the honey drip image as a CSS mask, fill with the requested color.
  // The negative marginTop pulls the drip up so its solid top edge overlaps
  // the card body above, eliminating any sub-pixel seam.
  return (
    <div
      aria-hidden="true"
      style={{
        height,
        width: "100%",
        marginTop: -1,
        backgroundColor: fill,
        opacity: fillOpacity,
        WebkitMaskImage: "url(/honey-drip-mask.png)",
        maskImage: "url(/honey-drip-mask.png)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskPosition: "top center",
        maskPosition: "top center",
      }}
    />
  );
}

function DarkOverlay({
  percent,
  cardRadius,
  dripHeight,
}: {
  percent: number;
  cardRadius: number;
  dripHeight: number;
}) {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 top-0 z-[1] flex flex-col"
      style={{ height: `${percent}%` }}
      aria-hidden="true"
    >
      <div
        className="bg-primary"
        style={{
          flex: "1 1 0",
          minHeight: 0,
          borderRadius: `${cardRadius}px ${cardRadius}px 0 0`,
        }}
      />
      <DripShape height={dripHeight} fill="var(--primary)" />
    </div>
  );
}

function PlanCard({ plan, tier }: { plan: Plan; tier: 1 | 2 | 3 }) {
  const [config] = useTaryfyConfig();
  const overlayPercent = tier === 1 ? 25 : tier === 2 ? 33 : 100;
  const hasBottomDrip = tier === 3;

  return (
    <Link
      href="/checkout"
      className="relative isolate block text-foreground transition-transform duration-300 hover:-translate-y-1"
    >
      {plan.highlighted && <BestSellerBadge />}

      {/* Layer 0: Light base — only for tiers 1 & 2; tier 3 is fully covered by DarkOverlay */}
      {!hasBottomDrip && (
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
          style={{
            backgroundColor: "var(--primary)",
            opacity: 0.35,
            borderRadius: `${config.cardRadius}px`,
          }}
        />
      )}

      {/* Layer 1: Dark overlay — same shape, variable height by tier */}
      <DarkOverlay
        percent={overlayPercent}
        cardRadius={config.cardRadius}
        dripHeight={config.dripHeight}
      />

      {/* Layer 10: Content */}
      <div
        className="relative z-10"
        style={{
          paddingLeft: config.cardPaddingX,
          paddingRight: config.cardPaddingX,
          paddingTop: config.cardPaddingTop,
          paddingBottom: config.cardPaddingBottom + (hasBottomDrip ? config.dripHeight : 0),
        }}
      >
        <h3
          className="font-heading leading-[1] tracking-tight"
          style={{ fontSize: config.titleSize }}
        >
          {plan.name}
        </h3>
        <p
          className="mt-2 opacity-75"
          style={{ fontSize: config.bodySize }}
        >
          {plan.honey}
        </p>

        <p
          className="mt-10 font-heading leading-[1] tracking-tight"
          style={{ fontSize: config.priceSize }}
        >
          od {plan.price} zł
        </p>

        <div className="mt-4 flex items-end gap-2.5">
          <p
            className="flex-1 leading-[1.4]"
            style={{ fontSize: config.bodySize - 1 }}
          >
            Dalej {plan.renewal} · Zapłać wygodnie na raty z Klarną
          </p>
          <KlarnaBadge />
        </div>

        <div className="my-5 border-t border-foreground/15" />

        <ul
          className="flex flex-col"
          style={{ gap: config.featureGap }}
        >
          {plan.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 leading-[1.35]"
              style={{ fontSize: config.bodySize }}
            >
              <CheckIcon />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {plan.extras && (
          <>
            <div className="my-4 border-t border-foreground/15" />
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] opacity-70">
              Dodatkowe korzyści
            </p>
            <ul
              className="mt-4 flex flex-col"
              style={{ gap: config.featureGap }}
            >
              {plan.extras.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 leading-[1.35]"
                  style={{ fontSize: config.bodySize }}
                >
                  <CheckIcon />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Link>
  );
}

export function TaryfySection({ plans }: { plans: Plan[] }) {
  return (
    <section className="container-page py-24">
      <h2 className="mb-16 text-center font-heading text-3xl tracking-tight md:text-4xl">
        Taryfy
      </h2>

      <div className="mx-auto grid max-w-5xl items-start gap-6 md:grid-cols-3">
        {plans.map((plan, idx) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            tier={(idx + 1) as 1 | 2 | 3}
          />
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Darmowa dostawa InPost w 1–3 dni.
      </p>
    </section>
  );
}
