"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import { BeeTrail } from "@/components/bee-trail";
import {
  useJakConfig,
  useHeadingConfig,
  type JakAlign,
  type JakImage as JakImageCfg,
  type JakMobileRow,
} from "@/components/section-config";

type Step = { title: string; text: string };

const ALIGN_MAP: Record<JakAlign, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
};

function Ph({
  label,
  cfg,
  radius,
}: {
  label: string;
  cfg: JakImageCfg;
  radius: number;
}) {
  return (
    <div
      className="relative flex items-center justify-center border border-dashed border-border bg-muted/60 p-4 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
      style={{
        width: `${cfg.w}%`,
        aspectRatio: cfg.ratio,
        alignSelf: ALIGN_MAP[cfg.align],
        marginTop: cfg.mt,
        borderRadius: cfg.round ? "50%" : radius,
        zIndex: cfg.z,
      }}
    >
      {label}
    </div>
  );
}

function buildSkewMask(offY: number, r: number, negative: boolean): string {
  // viewBox 0 0 100 100, stretched to container via preserveAspectRatio="none".
  // offY is the vertical offset (in viewBox units = % of height) at the indented corners.
  // r is the corner-radius (in viewBox units, applied symmetrically — visually scales with container).
  // slantNear / slantFar snap the curve endpoints onto the true slanted edge instead of
  // the viewBox y-axis; without this, the path cuts into the shape at indented corners
  // and bulges out at non-indented ones, making the four corners look unequally rounded.
  const slantNear = (offY * (100 - r)) / 100;
  const slantFar = (offY * r) / 100;
  const path = negative
    ? // skew<0: top-left & bottom-right indented
      `M 0 ${offY + r} Q 0 ${offY} ${r} ${slantNear} L ${100 - r} ${slantFar} Q 100 0 100 ${r} L 100 ${100 - offY - r} Q 100 ${100 - offY} ${100 - r} ${100 - slantNear} L ${r} ${100 - slantFar} Q 0 100 0 ${100 - r} Z`
    : // skew>0: top-right & bottom-left indented
      `M ${r} ${slantFar} L ${100 - r} ${slantNear} Q 100 ${offY} 100 ${offY + r} L 100 ${100 - r} Q 100 100 ${100 - r} ${100 - slantFar} L ${r} ${100 - slantNear} Q 0 ${100 - offY} 0 ${100 - offY - r} L 0 ${r} Q 0 0 ${r} ${slantFar} Z`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='${path}' fill='black'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

function Img({
  src,
  alt,
  cfg,
  radius,
  children,
}: {
  src: string;
  alt: string;
  cfg: JakImageCfg;
  radius: number;
  children?: ReactNode;
}) {
  const skew = cfg.skewY ?? 0;
  const offsetPct = skew
    ? Math.abs(cfg.ratio * Math.tan((skew * Math.PI) / 180) * 100)
    : 0;
  // Corner radius in viewBox units (~ % of the smaller side of the box).
  const cornerR = skew ? 4 : 0;
  const maskImage = skew ? buildSkewMask(offsetPct, cornerR, skew < 0) : undefined;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${cfg.w}%`,
        aspectRatio: cfg.ratio,
        alignSelf: ALIGN_MAP[cfg.align],
        marginTop: cfg.mt,
        borderRadius: cfg.round ? "50%" : skew ? 0 : radius,
        zIndex: cfg.z,
        WebkitMaskImage: maskImage,
        maskImage,
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 40vw, 90vw"
        className="object-cover"
      />
      {children}
    </div>
  );
}

function Body({
  title,
  text,
  offsetY,
  vAlign,
  titleSize,
  bodySize,
  maxWidth,
  className,
}: {
  title: string;
  text: string;
  offsetY: number;
  vAlign: JakAlign;
  titleSize: number;
  bodySize: number;
  maxWidth: number;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col ${className ?? ""}`}
      style={{
        marginTop: offsetY,
        maxWidth,
        alignSelf: ALIGN_MAP[vAlign],
      }}
    >
      <h3
        className="mb-3 font-heading leading-tight tracking-tight"
        style={{ fontSize: titleSize }}
      >
        {title}
      </h3>
      <p
        className="leading-relaxed"
        style={{ fontSize: bodySize }}
      >
        {text}
      </p>
    </div>
  );
}

type MobileImgInput = {
  src: string;
  alt: string;
  overlay?: ReactNode;
};

function MobileRow({
  row,
  radius,
  title,
  text,
  titleSize,
  bodySize,
  textMaxW,
  img1,
  img2,
}: {
  row: JakMobileRow;
  radius: number;
  title: string;
  text: string;
  titleSize: number;
  bodySize: number;
  textMaxW: number;
  img1: MobileImgInput;
  img2?: MobileImgInput;
}) {
  const cluster = (
    <div className="flex flex-col" style={{ gap: row.cellGap }}>
      <Img src={img1.src} alt={img1.alt} cfg={row.img1} radius={radius}>
        {img1.overlay}
      </Img>
      {row.img2 && img2 && (
        <Img src={img2.src} alt={img2.alt} cfg={row.img2} radius={radius}>
          {img2.overlay}
        </Img>
      )}
    </div>
  );
  return (
    <div className="flex flex-col">
      {row.imageOrder === "before" ? cluster : null}
      <Body
        title={title}
        text={text}
        offsetY={row.textPt}
        vAlign={row.textAlign}
        titleSize={titleSize}
        bodySize={bodySize}
        maxWidth={textMaxW}
      />
      {row.imageOrder === "after" ? cluster : null}
    </div>
  );
}

export function JakToDzialaWireframe({ steps }: { steps: Step[] }) {
  const [cfg] = useJakConfig();
  const [heading] = useHeadingConfig();

  return (
    <section className="relative py-24">
      <div className="absolute inset-x-0 bottom-0 -top-[200px] -z-20 overflow-hidden">
        <Image
          src="/jak-to-dziala-bg2.png"
          alt=""
          fill
          className="object-cover object-top"
          priority={false}
          aria-hidden
        />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent to-[var(--background)]" />
      <div className="container-page relative">
      <div className="relative">
        <BeeTrail />

        <h2
          className="relative mb-16 hidden text-center font-heading tracking-tight md:block"
          style={{
            fontSize: `${heading.scale}rem`,
            lineHeight: heading.lineHeight,
          }}
        >
          Jak to działa
        </h2>
        <h2
          className="relative mb-16 text-center font-heading tracking-tight md:hidden"
          style={{
            fontSize: `${heading.mobileScale}rem`,
            lineHeight: heading.mobileLineHeight,
          }}
        >
          Jak to działa
        </h2>

        {/* Desktop layout */}
        <div
          className="relative hidden flex-col md:flex"
          style={{ gap: cfg.rowGap }}
        >
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: `${100 - cfg.textColPct}fr ${cfg.textColPct}fr`, columnGap: cfg.colGap }}>
            <div
              className="flex flex-col"
              style={{ gap: cfg.r1.cellGap, order: cfg.r1.imageLeft ? 1 : 2 }}
            >
              <Img
                src="/jak%20to%20dziala/ule.png"
                alt="Ule na leśnej pasiece"
                cfg={cfg.r1.img1}
                radius={cfg.radius}
              />
              {cfg.r1.img2 && (
                <Img
                  src="/jak%20to%20dziala/hf_20260428_200222_0f56bf96-3248-4d18-89c5-277d41d19793.png"
                  alt="Certyfikat w eleganckim pudełku"
                  cfg={cfg.r1.img2}
                  radius={cfg.radius}
                />
              )}
            </div>
            <div style={{ order: cfg.r1.imageLeft ? 2 : 1 }}>
              <Body
                title={steps[0].title}
                text={steps[0].text}
                offsetY={cfg.r1.textPt}
                vAlign={cfg.r1.textAlign}
                titleSize={cfg.titleSize}
                bodySize={cfg.bodySize}
                maxWidth={cfg.textMaxW}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: `${100 - cfg.textColPct}fr ${cfg.textColPct}fr`, columnGap: cfg.colGap }}>
            <div
              className="flex flex-col"
              style={{ gap: cfg.r2.cellGap, order: cfg.r2.imageLeft ? 1 : 2 }}
            >
              <Img
                src="/jak%20to%20dziala/piotr.png"
                alt="Pszczelarz Piotr na pasiece"
                cfg={cfg.r2.img1}
                radius={cfg.radius}
              />
              {cfg.r2.img2 && (
                <Img
                  src="/jak%20to%20dziala/Screenshot%202026-04-23%20at%2016.29.53.png"
                  alt="Mapa pasieki z lotu ptaka"
                  cfg={cfg.r2.img2}
                  radius={cfg.radius}
                >
                  <motion.div
                    className="pointer-events-none absolute left-1/2 top-1/2 w-[18%] drop-shadow-lg"
                    style={{
                      x: "-50%",
                      y: "-50%",
                      transformOrigin: "center bottom",
                    }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src="/pin-on-map.png"
                      alt=""
                      width={400}
                      height={400}
                      className="h-auto w-full"
                    />
                  </motion.div>
                </Img>
              )}
            </div>
            <div style={{ order: cfg.r2.imageLeft ? 2 : 1 }}>
              <Body
                title={steps[1].title}
                text={steps[1].text}
                offsetY={cfg.r2.textPt}
                vAlign={cfg.r2.textAlign}
                titleSize={cfg.titleSize}
                bodySize={cfg.bodySize}
                maxWidth={cfg.textMaxW}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div style={{ display: "grid", gridTemplateColumns: `${100 - cfg.textColPct}fr ${cfg.textColPct}fr`, columnGap: cfg.colGap }}>
            <div
              className="flex"
              style={{ order: cfg.r3.imageLeft ? 1 : 2 }}
            >
              <Img
                src="/jak%20to%20dziala/hf_20260428_180817_bf93eb1d-e357-464b-a182-03247fa6d4e8.png"
                alt="Telefon z panelem klienta — Twój ul #5"
                cfg={cfg.r3.img1}
                radius={cfg.radius}
              />
            </div>
            <div style={{ order: cfg.r3.imageLeft ? 2 : 1 }}>
              <Body
                title={steps[2].title}
                text={steps[2].text}
                offsetY={cfg.r3.textPt}
                vAlign={cfg.r3.textAlign}
                titleSize={cfg.titleSize}
                bodySize={cfg.bodySize}
                maxWidth={cfg.textMaxW}
              />
            </div>
          </div>

          {/* Row 4 */}
          <div style={{ display: "grid", gridTemplateColumns: `${100 - cfg.textColPct}fr ${cfg.textColPct}fr`, columnGap: cfg.colGap }}>
            <div
              className="flex flex-col"
              style={{ gap: cfg.r4.cellGap, order: cfg.r4.imageLeft ? 1 : 2 }}
            >
              <Img
                src="/jak%20to%20dziala/shipment.png"
                alt="Słoiczki miodu w pudełku wysyłkowym"
                cfg={cfg.r4.img1}
                radius={cfg.radius}
              />
              {cfg.r4.img2 && (
                <Img
                  src="/jak%20to%20dziala/hf_20260429_063236_ba207393-d1ff-43e9-8bc5-34d5e8186f44.png"
                  alt="Personalizowany słoik miodu"
                  cfg={cfg.r4.img2}
                  radius={cfg.radius}
                />
              )}
            </div>
            <div style={{ order: cfg.r4.imageLeft ? 2 : 1 }}>
              <Body
                title={steps[3].title}
                text={steps[3].text}
                offsetY={cfg.r4.textPt}
                vAlign={cfg.r4.textAlign}
                titleSize={cfg.titleSize}
                bodySize={cfg.bodySize}
                maxWidth={cfg.textMaxW}
              />
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div
          className="relative flex flex-col md:hidden"
          style={{
            gap: cfg.mobile.rowGap,
            paddingLeft: cfg.mobile.paddingX,
            paddingRight: cfg.mobile.paddingX,
          }}
        >
          <MobileRow
            row={cfg.mobile.r1}
            radius={cfg.radius}
            title={steps[0].title}
            text={steps[0].text}
            titleSize={cfg.mobile.titleSize}
            bodySize={cfg.mobile.bodySize}
            textMaxW={cfg.mobile.textMaxW}
            img1={{ src: "/jak%20to%20dziala/ule.png", alt: "Ule na leśnej pasiece" }}
            img2={{
              src: "/jak%20to%20dziala/hf_20260428_200222_0f56bf96-3248-4d18-89c5-277d41d19793.png",
              alt: "Certyfikat w eleganckim pudełku",
            }}
          />
          <MobileRow
            row={cfg.mobile.r2}
            radius={cfg.radius}
            title={steps[1].title}
            text={steps[1].text}
            titleSize={cfg.mobile.titleSize}
            bodySize={cfg.mobile.bodySize}
            textMaxW={cfg.mobile.textMaxW}
            img1={{
              src: "/jak%20to%20dziala/piotr.png",
              alt: "Pszczelarz Piotr na pasiece",
            }}
            img2={{
              src: "/jak%20to%20dziala/Screenshot%202026-04-23%20at%2016.29.53.png",
              alt: "Mapa pasieki z lotu ptaka",
              overlay: (
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-1/2 w-[18%] drop-shadow-lg"
                  style={{
                    x: "-50%",
                    y: "-50%",
                    transformOrigin: "center bottom",
                  }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src="/pin-on-map.png"
                    alt=""
                    width={400}
                    height={400}
                    className="h-auto w-full"
                  />
                </motion.div>
              ),
            }}
          />
          <MobileRow
            row={cfg.mobile.r3}
            radius={cfg.radius}
            title={steps[2].title}
            text={steps[2].text}
            titleSize={cfg.mobile.titleSize}
            bodySize={cfg.mobile.bodySize}
            textMaxW={cfg.mobile.textMaxW}
            img1={{
              src: "/jak%20to%20dziala/hf_20260428_180817_bf93eb1d-e357-464b-a182-03247fa6d4e8.png",
              alt: "Telefon z panelem klienta — Twój ul #5",
            }}
          />
          <MobileRow
            row={cfg.mobile.r4}
            radius={cfg.radius}
            title={steps[3].title}
            text={steps[3].text}
            titleSize={cfg.mobile.titleSize}
            bodySize={cfg.mobile.bodySize}
            textMaxW={cfg.mobile.textMaxW}
            img1={{
              src: "/jak%20to%20dziala/shipment.png",
              alt: "Słoiczki miodu w pudełku wysyłkowym",
            }}
            img2={{
              src: "/jak%20to%20dziala/hf_20260429_063236_ba207393-d1ff-43e9-8bc5-34d5e8186f44.png",
              alt: "Personalizowany słoik miodu",
            }}
          />
        </div>
      </div>
      </div>
    </section>
  );
}
