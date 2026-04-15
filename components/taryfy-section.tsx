"use client";

import { useId } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTaryfyConfig } from "@/components/section-config";

interface Plan {
  name: string;
  price: string;
  renewal: string;
  honey: string;
  features: string[];
  extras?: string[];
  subtitle?: string;
  highlighted?: boolean;
}

const FRACTION_RE = /^([⅛⅓⅔¼½¾⅕⅖⅗⅘⅙⅚⅐⅑⅒])\s*(.*)/;

function BadgeText({
  name,
  className,
  style,
  ariaHidden,
}: {
  name: string;
  className: string;
  style: React.CSSProperties;
  ariaHidden?: boolean;
}) {
  const [config] = useTaryfyConfig();
  const match = name.match(FRACTION_RE);

  if (!match) {
    return (
      <h3 className={className} style={style} aria-hidden={ariaHidden}>
        {name}
      </h3>
    );
  }

  const [, fraction, rest] = match;
  return (
    <h3
      className={className}
      style={{ ...style, display: "inline-flex", alignItems: "center", gap: 10 }}
      aria-hidden={ariaHidden}
    >
      <span
        style={{
          fontSize: config.fractionSize,
          position: "relative",
          top: config.fractionBaseline,
        }}
      >
        {fraction}
      </span>
      {rest && <span>{rest}</span>}
    </h3>
  );
}

function PlanBadge({ name }: { name: string }) {
  const [config] = useTaryfyConfig();
  const maskId = useId();
  const blurRadius = Math.max(2, config.strokeWidth / 2);

  const match = name.match(FRACTION_RE);

  const svgFontStyle: React.CSSProperties = {
    fontSize: config.headingSize,
    fontFamily: '"Homie", ui-sans-serif, system-ui, sans-serif',
    fontWeight: 700,
    letterSpacing: config.letterSpacing,
  };

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        aspectRatio: "33 / 14",
        borderRadius: config.badgeRadius,
        backgroundImage: "url('/honey-badge-bg.png')",
        backgroundSize: `${config.bgScale}%`,
        backgroundPosition: `center ${config.bgPositionY}%`,
      }}
    >
      {/* SVG mask shaped to text outline */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              fill="black"
              stroke="white"
              strokeWidth={config.strokeWidth}
              paintOrder="stroke"
              style={svgFontStyle}
            >
              {match ? (
                <>
                  <tspan
                    style={{ fontSize: config.fractionSize }}
                    dy={config.fractionBaseline}
                  >
                    {match[1]}
                  </tspan>
                  <tspan
                    style={{ fontSize: config.headingSize }}
                    dy={-config.fractionBaseline}
                  >
                    {` ${match[2]}`}
                  </tspan>
                </>
              ) : (
                name
              )}
            </text>
          </mask>
        </defs>
      </svg>

      {/* Backdrop blur clipped to text outline shape */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          backdropFilter: `blur(${blurRadius}px)`,
          WebkitBackdropFilter: `blur(${blurRadius}px)`,
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
        }}
      />

      {/* Crisp text on top */}
      <BadgeText
        name={name}
        className="relative z-10 font-heading text-white"
        style={{
          fontSize: config.headingSize,
          letterSpacing: config.letterSpacing,
        }}
      />
    </div>
  );
}

export function TaryfySection({ plans }: { plans: Plan[] }) {
  return (
    <section className="container-page py-24">
      <h2 className="mb-12 text-center font-heading text-3xl tracking-tight md:text-4xl">
        Taryfy
      </h2>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-2xl border p-8 ${
              plan.highlighted
                ? "border-primary bg-primary/5"
                : "bg-card"
            }`}
          >
            <PlanBadge name={plan.name} />
            {plan.subtitle && (
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {plan.subtitle}
              </p>
            )}
            <p className="mt-2 text-3xl font-bold">
              {plan.price}{" "}
              <span className="text-lg font-normal text-muted-foreground">
                zł
              </span>
            </p>
            <p className="mb-6 text-xs text-muted-foreground">
              raty przez Klarnę &middot; dalej {plan.renewal}
            </p>
            <p className="mb-4 font-medium">{plan.honey}</p>
            <ul className="mb-6 flex-1 space-y-2">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 text-emerald-500">&#10003;</span>
                  {f}
                </li>
              ))}
              {plan.extras?.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 text-emerald-500">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <Button
              render={<Link href="/checkout" />}
              className="w-full"
            >
              Wybieram
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Darmowa dostawa InPost w 1&ndash;3 dni.
      </p>
    </section>
  );
}
