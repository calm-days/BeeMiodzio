"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RedrawHeading } from "@/components/redraw-heading";
import { AnimatedDrawing } from "@/components/animated-drawing";
import { useDlaczegoConfig } from "@/components/section-config";
import { useIsMobile } from "@/hooks/use-mobile";

export function DlaczegoZdrowyCta() {
  const [config] = useDlaczegoConfig();
  const isMobile = useIsMobile();

  const lightbulb = isMobile ? config.lightbulbMobile : config.lightbulb;
  const flower = isMobile ? config.flowerMobile : config.flower;
  const lineL = isMobile ? config.lineLMobile : config.lineL;
  const lineR = isMobile ? config.lineRMobile : config.lineR;
  const paddingY = isMobile ? config.paddingYMobile : config.paddingY;

  return (
    <section
      className="container-page relative overflow-hidden"
      style={{ paddingTop: paddingY, paddingBottom: paddingY }}
    >
      <Image
        src="/dlaczego-zdrowy/line-L.webp"
        alt=""
        aria-hidden="true"
        width={668}
        height={364}
        className="pointer-events-none absolute -translate-y-1/2 select-none"
        style={{
          left: `${lineL.offset}%`,
          top: `${lineL.top}%`,
          width: `${lineL.width}%`,
          maxWidth: 480,
          height: "auto",
        }}
      />
      <Image
        src="/dlaczego-zdrowy/line-R.webp"
        alt=""
        aria-hidden="true"
        width={832}
        height={364}
        className="pointer-events-none absolute -translate-y-1/2 select-none"
        style={{
          right: `${lineR.offset}%`,
          top: `${lineR.top}%`,
          width: `${lineR.width}%`,
          maxWidth: 520,
          height: "auto",
        }}
      />

      <AnimatedDrawing
        name="flower"
        aspect="300 / 236"
        className="pointer-events-none absolute"
        style={{
          left: `${lightbulb.offset}%`,
          top: `${lightbulb.top}%`,
          width: lightbulb.width,
        }}
      />
      <AnimatedDrawing
        name="flower"
        aspect="300 / 236"
        className="pointer-events-none absolute"
        style={{
          right: `${flower.offset}%`,
          top: `${flower.top}%`,
          width: flower.width,
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <RedrawHeading lines={["Dlaczego miód", "jest zdrowy?"]} />

        <Button
          size="lg"
          arrow
          className="mt-10 h-14 px-10 text-base"
          render={<Link href="/dlaczego-miod-jest-zdrowy" />}
        >
          Dowiedz się czemu
        </Button>
      </div>
    </section>
  );
}
