"use client";

import type { CSSProperties } from "react";
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
const ACCENT_AMBER = "#C68A14";
const CARD_BG = "#FFF4D2";

const HIVE_IMAGES = ["/taryfy/1:8.png", "/taryfy/1:3.png", "/taryfy/caly.png"] as const;
const TIER_MIN_HEIGHT = [620, 680, 740] as const;

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

function Divider() {
  return (
    <div
      aria-hidden="true"
      className="h-px w-full"
      style={{ backgroundColor: ACCENT_AMBER, opacity: 0.55 }}
    />
  );
}

function WybieramButton() {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full border-[1.5px] border-foreground bg-transparent px-5 py-2.5 text-[15px] font-semibold leading-none text-foreground transition-colors group-hover/card:bg-foreground group-hover/card:text-[#FFF4D2]"
    >
      Wybieram!
    </span>
  );
}

function PlanCard({ plan, tier }: { plan: Plan; tier: 0 | 1 | 2 }) {
  const [config] = useTaryfyConfig();
  const hiveSrc = HIVE_IMAGES[tier];
  const tierMinHeight = TIER_MIN_HEIGHT[tier];

  return (
    <Link
      href="/checkout"
      className="group/card relative isolate flex flex-col min-h-[var(--card-mh-mobile)] text-foreground transition-transform duration-300 hover:-translate-y-1 md:min-h-[var(--card-mh-desktop)]"
      style={{
        borderRadius: `${config.cardRadius}px`,
        backgroundColor: CARD_BG,
        paddingLeft: config.cardPaddingX,
        paddingRight: config.cardPaddingX,
        paddingTop: config.cardPaddingTop,
        paddingBottom: config.cardPaddingBottom,
        "--card-mh-mobile": `${config.cardMinHeight}px`,
        "--card-mh-desktop": `${tierMinHeight}px`,
      } as CSSProperties}
    >
      {/* Header: title + honey amount */}
      <div className="flex flex-col items-start">
        <h3
          className="font-heading leading-[0.95] tracking-tight"
          style={{ fontSize: config.titleSize }}
        >
          {plan.name}
        </h3>
        <p
          className="mt-3 font-semibold leading-[1.3]"
          style={{ fontSize: config.subtitleSize }}
        >
          {plan.honey}
        </p>
      </div>

      <div className="mt-4">
        <Divider />
      </div>

      {/* Price block */}
      <p
        className="mt-5 font-bold leading-[1] tracking-tight"
        style={{ fontSize: config.priceSize }}
      >
        od {plan.price} zł
      </p>
      <p
        className="mt-3 leading-[1.4]"
        style={{ fontSize: config.bodySize }}
      >
        Dalej {plan.renewal} · Zapłać <KlarnaBadge /> wygodnie na raty z Klarną
      </p>

      <div className="mt-5">
        <Divider />
      </div>

      {/* Features list */}
      <ul
        className="mt-5 flex flex-col"
        style={{ gap: config.featureGap }}
      >
        {plan.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2.5 leading-[1.35] font-semibold"
            style={{ fontSize: config.bodySize }}
          >
            <CheckIcon />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {plan.extras && (
        <>
          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{ backgroundColor: ACCENT_AMBER, opacity: 0.55 }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT_AMBER }}>
              Dodatkowe korzyści
            </p>
            <div className="h-px flex-1" style={{ backgroundColor: ACCENT_AMBER, opacity: 0.55 }} />
          </div>
          <ul
            className="mt-4 flex flex-col"
            style={{ gap: config.featureGap }}
          >
            {plan.extras.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2.5 leading-[1.35] font-semibold"
                style={{ fontSize: config.bodySize }}
              >
                <CheckIcon />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Footer: button + hive (fills remaining space) */}
      <div
        className="relative mt-auto flex items-end justify-between"
        style={{ paddingTop: config.footerPaddingTop }}
      >
        <WybieramButton />
        <div
          className="relative shrink-0"
          style={{ width: config.hiveSize, height: config.hiveSize }}
        >
          <Image
            src={hiveSrc}
            alt=""
            fill
            sizes={`${config.hiveSize}px`}
            className="object-contain object-bottom"
          />
        </div>
      </div>
    </Link>
  );
}

export function TaryfySection({ plans }: { plans: Plan[] }) {
  return (
    <section className="container-page pt-4 pb-24">
      <h2 className="mb-10 text-center font-heading text-5xl tracking-tight md:text-6xl">
        Taryfy
      </h2>

      <div className="mx-auto grid max-w-5xl items-end gap-5 md:grid-cols-3">
        {plans.map((plan, idx) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            tier={idx as 0 | 1 | 2}
          />
        ))}
      </div>

      <p className="mt-10 text-center text-sm">
        Darmowa dostawa InPost w 1–3 dni.
      </p>
    </section>
  );
}
