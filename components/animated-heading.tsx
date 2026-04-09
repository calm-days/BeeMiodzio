"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";

const DEBUG = false;

type Config = {
  duration: number;
  stagger: number;
  mediaDelay: number;
  mediaDuration: number;
  mediaW: number;
  mediaH: number;
  mediaGap: number;
  mediaRadius: number;
  wordGap: number;
  ease1: number;
  ease2: number;
  ease3: number;
  ease4: number;
  marginBottom: number;
  scale: number;
  lineHeight: number;
  stiffness: number;
  damping: number;
  mass: number;
};

const DEFAULT: Config = {
  duration: 1,
  stagger: 0.08,
  mediaDelay: 0.5,
  mediaDuration: 0.65,
  mediaW: 2.5,
  mediaH: 0.75,
  mediaGap: 0.2,
  mediaRadius: 1.05,
  wordGap: 0.17,
  ease1: 0.33,
  ease2: 1,
  ease3: 0.68,
  ease4: 1,
  marginBottom: 2.5,
  scale: 6.25,
  lineHeight: 1,
  stiffness: 120,
  damping: 18,
  mass: 1,
};

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
}) {
  return (
    <label className="flex items-center gap-2 text-[11px]">
      <span className="w-20 shrink-0 font-mono">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full accent-amber-400"
      />
      <span className="w-12 shrink-0 text-right font-mono text-[10px]">
        {value}{unit || ""}
      </span>
    </label>
  );
}

function DebugPanel({
  config,
  onChange,
  onReplay,
}: {
  config: Config;
  onChange: (c: Config) => void;
  onReplay: () => void;
}) {
  const set = (key: keyof Config) => (v: number) =>
    onChange({ ...config, [key]: v });

  const code = JSON.stringify(config, null, 2);

  return (
    <div className="pointer-events-auto fixed left-4 top-4 z-50 flex max-h-[90vh] w-72 flex-col gap-0.5 overflow-y-auto rounded-xl border bg-black/90 p-4 text-white shadow-2xl">
      <p className="mb-2 text-xs font-bold">Heading Tuner</p>

      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
        Timing
      </p>
      <Slider label="duration" value={config.duration} onChange={set("duration")} min={0.1} max={2} step={0.05} unit="s" />
      <Slider label="stagger" value={config.stagger} onChange={set("stagger")} min={0} max={0.5} step={0.01} unit="s" />
      <Slider label="media delay" value={config.mediaDelay} onChange={set("mediaDelay")} min={0} max={2} step={0.05} unit="s" />
      <Slider label="media dur" value={config.mediaDuration} onChange={set("mediaDuration")} min={0.1} max={2} step={0.05} unit="s" />

      <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
        Media Block
      </p>
      <Slider label="width" value={config.mediaW} onChange={set("mediaW")} min={0.5} max={4} step={0.1} unit="em" />
      <Slider label="height" value={config.mediaH} onChange={set("mediaH")} min={0.3} max={2} step={0.05} unit="em" />
      <Slider label="gap" value={config.mediaGap} onChange={set("mediaGap")} min={0} max={0.5} step={0.01} unit="em" />
      <Slider label="radius" value={config.mediaRadius} onChange={set("mediaRadius")} min={0} max={1.5} step={0.05} unit="rem" />
      <Slider label="word gap" value={config.wordGap} onChange={set("wordGap")} min={0} max={0.5} step={0.01} unit="em" />

      <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
        Spring
      </p>
      <Slider label="stiffness" value={config.stiffness} onChange={set("stiffness")} min={20} max={400} step={5} />
      <Slider label="damping" value={config.damping} onChange={set("damping")} min={5} max={60} step={1} />
      <Slider label="mass" value={config.mass} onChange={set("mass")} min={0.1} max={5} step={0.1} />

      <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
        Spacing &amp; Scale
      </p>
      <Slider label="scale" value={config.scale} onChange={set("scale")} min={1} max={10} step={0.25} unit="rem" />
      <Slider label="line-height" value={config.lineHeight} onChange={set("lineHeight")} min={0.7} max={2} step={0.05} />
      <Slider label="margin-bot" value={config.marginBottom} onChange={set("marginBottom")} min={0} max={5} step={0.25} unit="rem" />

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onChange({ ...DEFAULT })}
          className="flex-1 rounded bg-white/10 px-2 py-1 text-[10px] hover:bg-white/20"
        >
          Reset
        </button>
        <button
          onClick={onReplay}
          className="flex-1 rounded bg-amber-500/20 px-2 py-1 text-[10px] text-amber-300 hover:bg-amber-500/30"
        >
          Replay
        </button>
      </div>
      <button
        onClick={() => navigator.clipboard.writeText(code)}
        className="mt-1 rounded bg-white/5 px-2 py-1 text-[10px] text-white/60 hover:bg-white/10"
      >
        Copy config
      </button>
    </div>
  );
}

export function AnimatedHeading({
  line1,
  line2Before,
  line2After,
}: {
  line1: string;
  line2Before: string;
  line2After: string;
}) {
  const [config, setConfig] = useState<Config>({ ...DEFAULT });
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

  const replay = () => {
    setShouldAnimate(false);
    requestAnimationFrame(() => {
      setViewKey((k) => k + 1);
      setShouldAnimate(true);
    });
  };

  const ease: [number, number, number, number] = [
    config.ease1, config.ease2, config.ease3, config.ease4,
  ];

  const lineInitial = {
    y: "100%",
    clipPath: "inset(-100% 0 100% 0)",
  };
  const lineAnimate = {
    y: "0%",
    clipPath: "inset(-10% 0 -20% 0)",
  };

  const spring = {
    type: "spring" as const,
    stiffness: config.stiffness,
    damping: config.damping,
    mass: config.mass,
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
    <>
      {DEBUG && (
        <DebugPanel config={config} onChange={setConfig} onReplay={replay} />
      )}

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
                className="relative inline-flex items-baseline justify-center"
                initial={lineInitial}
                animate={lineAnimate}
                transition={lineTransition(1)}
              >
                <span>{line2Before}</span>

                {/* Invisible spacer — grows to push words apart */}
                <motion.span
                  className="inline-block"
                  initial={{ width: `${config.wordGap}em` }}
                  animate={{
                    width: `${config.mediaW + config.mediaGap * 2}em`,
                  }}
                  transition={{
                    duration: config.mediaDuration,
                    delay: Math.max(0, config.mediaDelay - 0.15),
                    ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
                  }}
                />

                <span>{line2After}</span>

                {/* Image block — absolute, centered, reveals independently */}
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
            ) : (
              <span className="invisible inline-flex items-baseline">
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
    </>
  );
}
