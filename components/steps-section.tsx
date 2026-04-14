"use client";

import { BeeTrail } from "@/components/bee-trail";
import { useStepsConfig } from "@/components/section-config";

type Step = {
  title: string;
  text: string;
};

export function StepsSection({ steps }: { steps: Step[] }) {
  const [config] = useStepsConfig();

  return (
    <section className="container-page py-24">
      <h2 className="mb-16 text-center font-heading text-3xl tracking-tight md:text-4xl">
        Jak to działa
      </h2>

      <div className="relative mx-auto max-w-5xl">
        <BeeTrail />
        <div className="flex flex-col" style={{ gap: `${config.rowGap}px` }}>
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex flex-col items-center md:flex-row ${
                i % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
              style={{ gap: `${config.innerGap}px` }}
            >
              {/* Image */}
              <div
                className="w-full shrink-0 bg-muted"
                style={{
                  maxWidth: `${config.imageWidth}%`,
                  aspectRatio: `${config.imageRatio}`,
                  borderRadius: `${config.imageRadius}px`,
                }}
              />

              {/* Text */}
              <div className="flex flex-1 flex-col justify-center py-4 md:py-0">
                <div className="mb-2 flex items-start gap-3">
                  <span
                    className="flex shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground"
                    style={{
                      width: `${config.numberSize}px`,
                      height: `${config.numberSize}px`,
                      fontSize: `${config.numberSize * 0.44}px`,
                    }}
                  >
                    {i + 1}
                  </span>
                  <h3
                    className="font-heading tracking-tight"
                    style={{ fontSize: `${config.titleSize}px` }}
                  >
                    {step.title}
                  </h3>
                </div>
                <p
                  className="text-muted-foreground"
                  style={{
                    paddingLeft: `${config.numberSize + 12}px`,
                    fontSize: `${config.bodySize}px`,
                  }}
                >
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
