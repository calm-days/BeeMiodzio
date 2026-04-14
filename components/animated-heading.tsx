"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useHeadingConfig } from "@/components/section-config";

export function AnimatedHeading({
  line1,
  line2Before,
  line2After,
}: {
  line1: string;
  line2Before: string;
  line2After: string;
}) {
  const [config] = useHeadingConfig();
  const ref = useRef<HTMLDivElement>(null);
  const [viewKey, setViewKey] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const canTrigger = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Trigger animation when 15% into viewport
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
    // Reset only when fully off-screen
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

  const lineTransition = (idx: number) => ({
    ...spring,
    delay: config.stagger * idx,
  });

  // Width/margin use a smooth tween so letters don't bounce
  const mediaTransition = {
    duration: config.mediaDuration,
    delay: config.mediaDelay,
    ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
    // Height gets the spring for a lively reveal
    height: {
      type: "spring" as const,
      stiffness: config.stiffness,
      damping: config.damping,
      mass: config.mass * (config.mediaDuration / config.duration),
      delay: config.mediaDelay,
    },
  };

  const radius = `${config.mediaRadius}rem`;

  return (
    <div
      ref={ref}
      style={{ marginBottom: `${config.marginBottom}rem` }}
    >
      <h2
        key={viewKey}
        className="flex flex-col items-center font-heading tracking-tight"
        style={{ fontSize: `${config.scale}rem`, lineHeight: config.lineHeight }}
      >
        {/* Line 1 */}
        <span className="block overflow-hidden pb-[0.15em]">
          {shouldAnimate ? (
            <motion.span
              className="block"
              initial={lineInitial}
              animate={lineAnimate}
              transition={lineTransition(0)}
            >
              {line1}
            </motion.span>
          ) : (
            <span className="invisible block">{line1}</span>
          )}
        </span>

        {/* Line 2: word [media] word */}
        <span className="block overflow-hidden pb-[0.15em]">
          {shouldAnimate ? (
            <motion.span
              className="relative inline-flex items-center justify-center"
              initial={lineInitial}
              animate={lineAnimate}
              transition={lineTransition(1)}
            >
              <span>{line2Before}</span>

              {/* Spacer — grows to push words apart; hosts the media block */}
              <motion.span
                className="relative inline-block"
                initial={{ width: `${config.wordGap}em` }}
                animate={{
                  width: `${config.mediaW + config.mediaGap * 2}em`,
                }}
                transition={{
                  duration: config.mediaDuration,
                  delay: Math.max(0, config.mediaDelay - 0.15),
                  ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
                }}
              >
                {/* Image block — centered within the spacer */}
                <motion.span
                  className="absolute left-1/2 top-1/2"
                  style={{
                    width: `${config.mediaW}em`,
                    height: `${config.mediaH}em`,
                    borderRadius: radius,
                    overflow: "hidden",
                    x: "-50%",
                    y: "-50%",
                  }}
                  initial={{ clipPath: `inset(100% 0% 0% 0% round ${radius})` }}
                  animate={{ clipPath: `inset(0% 0% 0% 0% round ${radius})` }}
                  transition={mediaTransition}
                >
                  <Image
                    src="/heading-media.png"
                    alt=""
                    fill
                    className="object-cover"
                  />
                </motion.span>
              </motion.span>

              <span>{line2After}</span>
            </motion.span>
          ) : (
            <span className="invisible inline-flex items-center">
              {line2Before}
              <span
                className="inline-block"
                style={{
                  width: `${config.mediaW}em`,
                  height: `${config.mediaH}em`,
                  marginInline: `${config.mediaGap}em`,
                }}
              />
              {line2After}
            </span>
          )}
        </span>
      </h2>
    </div>
  );
}
