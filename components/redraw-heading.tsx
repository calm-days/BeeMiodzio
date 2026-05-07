"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { useHeadingConfig } from "@/components/section-config";
import { useIsMobile } from "@/hooks/use-mobile";

export function RedrawHeading({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  const [rawConfig] = useHeadingConfig();
  const isMobile = useIsMobile();
  const config = isMobile
    ? {
        ...rawConfig,
        scale: rawConfig.mobileScale,
        lineHeight: rawConfig.mobileLineHeight,
      }
    : rawConfig;

  const ref = useRef<HTMLDivElement>(null);
  const [viewKey, setViewKey] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const canTrigger = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const enterObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && canTrigger.current) {
          canTrigger.current = false;
          setShouldAnimate(true);
          setViewKey((k) => k + 1);
        }
      },
      { rootMargin: "-15% 0px" },
    );
    const exitObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          canTrigger.current = true;
          setShouldAnimate(false);
        }
      },
      { rootMargin: "0px" },
    );
    enterObserver.observe(el);
    exitObserver.observe(el);
    return () => {
      enterObserver.disconnect();
      exitObserver.disconnect();
    };
  }, []);

  const spring = {
    type: "spring" as const,
    stiffness: config.stiffness,
    damping: config.damping,
    mass: config.mass,
  };

  const lineInitial = {
    y: "100%",
    clipPath: "inset(-100% 0 100% 0)",
  };
  const lineAnimate = {
    y: "0%",
    clipPath: "inset(-10% 0 -20% 0)",
  };

  return (
    <div ref={ref} className={className}>
      <h2
        key={viewKey}
        className="flex flex-col items-center font-heading tracking-tight"
        style={{ fontSize: `${config.scale}rem`, lineHeight: config.lineHeight }}
      >
        {lines.map((line, idx) => (
          <span key={idx} className="block overflow-hidden pb-[0.15em]">
            {shouldAnimate ? (
              <motion.span
                className="block"
                initial={lineInitial}
                animate={lineAnimate}
                transition={{ ...spring, delay: config.stagger * idx }}
              >
                {line}
              </motion.span>
            ) : (
              <span className="invisible block">{line}</span>
            )}
          </span>
        ))}
      </h2>
    </div>
  );
}
