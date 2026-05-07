"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { flags } from "@/lib/flags";

const flowerStyle: React.CSSProperties = {
  WebkitMaskImage: "url(/dlaczego-zdrowy/flower.png)",
  maskImage: "url(/dlaczego-zdrowy/flower.png)",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

export function FlowerPop({ className }: { className?: string }) {
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

  if (!flags.animations) {
    return (
      <div className={className} aria-hidden="true">
        <div className="aspect-[300/236] w-full bg-primary" style={flowerStyle} />
      </div>
    );
  }

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <motion.div
        key={viewKey}
        className="aspect-[300/236] w-full bg-primary origin-center"
        style={flowerStyle}
        initial={{ scale: 0 }}
        animate={shouldAnimate ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
