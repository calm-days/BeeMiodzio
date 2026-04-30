"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { flags } from "@/lib/flags";
import { useTimelineConfig } from "@/components/section-config";

type TimelineStep = {
  label: string;
  text: string;
  image?: string;
};

type Props = {
  steps: TimelineStep[];
};

const BASE_ROTATIONS = [-1, 0.83, -0.67, 1, -0.5, 0.67];

export function TimelineSection({ steps }: Props) {
  const [config] = useTimelineConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const [startPad, setStartPad] = useState(0);
  const [vw, setVw] = useState(1440);

  // "end 50%" — tracking continues after sticky releases,
  // so cards keep drifting left as the section scrolls away
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 50%"],
  });

  const cardW = config.cardWidth;
  const gap = config.cardGap;
  const rotations = BASE_ROTATIONS.map((r) => r * config.rotationMax);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const contentW = 1440;
      const pagePx = 30;
      setVw(w);
      setStartPad(Math.max(pagePx, (w - contentW) / 2));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const xStart = vw - startPad - cardW / 2;
  // 1.5 cards visible — sticky releases here, global scroll resumes
  const xRelease = -(startPad + (steps.length - 2) * (cardW + gap) + cardW / 2);
  // All cards off screen — cards keep drifting to this point after release
  const xEnd = -(startPad + (steps.length - 1) * (cardW + gap) + cardW);
  const travel = Math.abs(xStart - xRelease);

  const x = useTransform(scrollYProgress, [0, 1], [xStart, xEnd]);

  const textStyle = {
    fontSize: `clamp(6rem, ${config.textSize}vw, ${config.textSize * 1.15}rem)`,
    lineHeight: config.textLeading,
  };

  if (!flags.animations) {
    return (
      <section className="bg-[#F3BB11] py-20">
        <div className="container-page relative">
          <h2 className="mb-12 font-heading text-3xl tracking-tight text-white md:text-4xl">
            Co i kiedy otrzymasz
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.label} className="rounded-2xl bg-white p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="bg-[#F3BB11] px-2 py-0.5 text-xs font-bold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-bold uppercase tracking-wide text-neutral-900">
                    {step.label}
                  </p>
                </div>
                <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-sm bg-neutral-200">
                    {step.image && (
                      <Image src={step.image} alt={step.label} fill className="object-cover" sizes="400px" />
                    )}
                  </div>
                <p className="text-sm text-neutral-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      style={{ height: `${travel}px` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden bg-[#F3BB11]">
        {/* Giant background text */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col justify-center overflow-hidden select-none"
          aria-hidden="true"
        >
          {["CO I KIEDY", "OTRZYMASZ"].map((line) => (
            <span
              key={line}
              className="block whitespace-nowrap pl-[max(var(--page-px),calc((100vw-var(--page-max-w))/2))] font-heading text-black uppercase"
              style={textStyle}
            >
              {line}
            </span>
          ))}
        </div>

        {/* Brand label — top */}
        <div className="container-page relative z-20 pt-12">
          <p
            className="font-semibold tracking-[0.3em] text-white uppercase"
            style={{ fontSize: `${config.labelSize}px` }}
          >
            BeeMiodzio
          </p>
        </div>

        {/* Cards strip — vertically centered */}
        <div className="relative z-10 flex flex-1 items-center">
          <motion.div
            style={{
              x,
              paddingLeft:
                "max(var(--page-px), calc((100vw - var(--page-max-w)) / 2))",
            }}
            className="flex items-start"
          >
            {steps.map((step, i) => (
              <article
                key={step.label}
                style={{
                  width: cardW,
                  minWidth: cardW,
                  marginLeft: i > 0 ? gap : 0,
                  padding: `${config.cardPadding}px`,
                  transform: `rotate(${rotations[i % rotations.length]}deg)`,
                }}
                className="shrink-0 rounded-2xl bg-white shadow-2xl"
              >
                <h3
                  className="mb-3 tracking-wide text-neutral-900 uppercase"
                  style={{
                    fontSize: `${config.cardTitleSize}px`,
                    fontWeight: config.cardTitleWeight,
                  }}
                >
                  {step.label}
                </h3>
                <div className="relative mb-4">
                  <span className="absolute -left-1 -top-1 z-10 inline-flex items-center bg-[#F3BB11] px-2.5 py-1 text-xs font-bold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-200">
                    {step.image && (
                      <Image src={step.image} alt={step.label} fill className="object-cover" sizes="400px" />
                    )}
                  </div>
                </div>
                <p
                  className="leading-relaxed text-neutral-600"
                  style={{ fontSize: `${config.cardBodySize}px` }}
                >
                  {step.text}
                </p>
              </article>
            ))}
          </motion.div>
        </div>

        {/* Brand label — bottom */}
        <div className="container-page relative z-20 pb-10 text-right">
          <p
            className="font-semibold tracking-[0.3em] text-white uppercase"
            style={{ fontSize: `${config.labelSize}px` }}
          >
            Twój ul. Twój miód.
          </p>
        </div>
      </div>
    </section>
  );
}
