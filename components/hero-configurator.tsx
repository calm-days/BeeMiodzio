"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "motion/react";

/* ────────────────────────────────────────────── */
/*  Cloud config                                  */
/* ────────────────────────────────────────────── */

interface CloudConfig {
  x: number;       // % from left (can be negative)
  y: number;       // % from top (can be negative)
  width: number;   // px
  opacity: number;
  blur: number;    // px
  speed: number;   // parallax speed multiplier (0 = static, 1 = full scroll speed)
  src: string;
}

interface SkyConfig {
  colorTop: string;
  colorBottom: string;
  enabled: boolean;
}

const defaultSky: SkyConfig = {
  colorTop: "#62AAD7",
  colorBottom: "#3C85BE",
  enabled: true,
};

const defaultClouds: CloudConfig[] = [
  { x: 26,  y: -5,  width: 700, opacity: 0.51, blur: 6, speed: 0.52, src: "/clouds/cloud-bg-1.png" },
  { x: -17, y: 4,   width: 810, opacity: 0.5,  blur: 4, speed: 0.55, src: "/clouds/cloud-bg-1.png" },
  { x: 67,  y: -15, width: 730, opacity: 0.58, blur: 6, speed: 0.64, src: "/clouds/cloud-bg-2.png" },
];

/* ────────────────────────────────────────────── */
/*  Hero layout config (existing)                 */
/* ────────────────────────────────────────────── */

interface HeroConfig {
  headingSize: number;
  headingTopOffset: number;
  headingLineHeight: number;
  headingWidth: number;
  imageWidth: number;
  textSize: number;
  leftTextX: number;
  leftTextY: number;
  leftTextWidth: number;
  rightTextX: number;
  rightTextY: number;
  rightTextWidth: number;
  buttonBottomOffset: number;
  buttonGap: number;
  buttonFontSize: number;
  buttonPaddingX: number;
  buttonPaddingY: number;
  buttonRadius: number;
  buttonX: number;
  sectionPaddingTop: number;
  sectionMinHeight: number;
  bzzRight: number;
  bzzTop: number;
  bzzSize: number;
}

const defaultConfig: HeroConfig = {
  headingSize: 102,
  headingTopOffset: 129,
  headingLineHeight: 0.9,
  headingWidth: 69,
  imageWidth: 62,
  textSize: 22,
  leftTextX: 3,
  leftTextY: 36,
  leftTextWidth: 28,
  rightTextX: 3,
  rightTextY: 36,
  rightTextWidth: 28,
  buttonBottomOffset: 156,
  buttonGap: 14,
  buttonFontSize: 19,
  buttonPaddingX: 28,
  buttonPaddingY: 13,
  buttonRadius: 27,
  buttonX: 50,
  sectionPaddingTop: 82,
  sectionMinHeight: 85,
  bzzRight: 31,
  bzzTop: 24,
  bzzSize: 15,
};

/* ────────────────────────────────────────────── */
/*  Slider component                              */
/* ────────────────────────────────────────────── */

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "px",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-300">{label}</span>
        <span className="text-xs tabular-nums text-zinc-400">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-700 accent-amber-500"
      />
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-zinc-300">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-8 cursor-pointer rounded border border-zinc-600 bg-transparent"
        />
        <span className="text-xs tabular-nums text-zinc-400">{value}</span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────── */
/*  Parallax cloud                                */
/* ────────────────────────────────────────────── */

function ParallaxCloud({
  cloud,
  zIndex = 0,
  scrollYProgress,
}: {
  cloud: CloudConfig;
  zIndex?: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const y = useTransform(scrollYProgress, [0, 1], [0, cloud.speed * -600]);

  return (
    <motion.div
      className="absolute"
      style={{
        zIndex,
        left: `${cloud.x}%`,
        top: `${cloud.y}%`,
        width: `${cloud.width}px`,
        opacity: cloud.opacity,
        filter: `blur(${cloud.blur}px)`,
        y,
      }}
    >
      <Image
        src={cloud.src}
        alt=""
        width={1000}
        height={500}
        className="h-auto w-full"
        priority
      />
    </motion.div>
  );
}

/* ────────────────────────────────────────────── */
/*  Main component                                */
/* ────────────────────────────────────────────── */

export function HeroConfigurator() {
  const [config, setConfig] = useState<HeroConfig>(defaultConfig);
  const [sky, setSky] = useState<SkyConfig>(defaultSky);
  const [clouds, setClouds] = useState<CloudConfig[]>(defaultClouds);
  const [open, setOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const [activeTab, setActiveTab] = useState<
    "heading" | "image" | "left" | "right" | "buttons" | "bzz" | "section" | "sky" | "c1" | "c2" | "c3"
  >("sky");

  const set = <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  const setCloud = (i: number, key: keyof CloudConfig, value: number | string) =>
    setClouds((prev) => prev.map((c, j) => (j === i ? { ...c, [key]: value } : c)));

  const copyConfig = () => {
    const out = JSON.stringify({ hero: config, sky, clouds }, null, 2);
    navigator.clipboard.writeText(out);
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    setSky(defaultSky);
    setClouds(defaultClouds);
  };

  const tabs = [
    { id: "sky" as const, label: "Sky" },
    { id: "c1" as const, label: "C1" },
    { id: "c2" as const, label: "C2" },
    { id: "c3" as const, label: "C3" },
    { id: "heading" as const, label: "H1" },
    { id: "image" as const, label: "Img" },
    { id: "left" as const, label: "L" },
    { id: "right" as const, label: "R" },
    { id: "buttons" as const, label: "Btn" },
    { id: "bzz" as const, label: "Bzz" },
    { id: "section" as const, label: "Sec" },
  ];

  const cloudTabIndex = { c1: 0, c2: 1, c3: 2 } as const;

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto max-w-[1440px] px-[30px] pb-8"
      style={{
        paddingTop: `${config.sectionPaddingTop}px`,
        minHeight: `${config.sectionMinHeight}vh`,
      }}
    >
      {/* Sky gradient background — full bleed */}
      {sky.enabled && (
        <div
          className="absolute inset-y-0 -z-20"
          style={{
            left: "50%",
            right: "50%",
            marginLeft: "-50vw",
            marginRight: "-50vw",
            width: "100vw",
            background: `linear-gradient(to bottom, ${sky.colorTop}, ${sky.colorBottom})`,
          }}
        />
      )}

      {/* Cloud layers — full bleed wrapper, screen blends with sky */}
      <div
        className="pointer-events-none absolute inset-y-0 -z-10 overflow-hidden"
        style={{
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          width: "100vw",
          mixBlendMode: "screen",
        }}
      >
        {clouds.map((cloud, i) => (
          <ParallaxCloud key={i} cloud={cloud} zIndex={i === 0 ? 10 : 0} scrollYProgress={scrollYProgress} />
        ))}
      </div>

      {/* Desktop: free-form layout */}
      <div className="relative hidden md:block">
        <motion.h1
          className="relative z-0 mx-auto text-center font-heading tracking-tight"
          initial={{ filter: "blur(12px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            fontSize: `${config.headingSize}px`,
            lineHeight: config.headingLineHeight,
            marginBottom: `-${config.headingTopOffset}px`,
            width: `${config.headingWidth}%`,
          }}
        >
          Lepsze od miodu są tylko pszczoły
        </motion.h1>

        <div
          className="relative z-10 mx-auto"
          style={{ width: `${config.imageWidth}%` }}
        >
          <Image
            src="/hero.png"
            alt="Ul na leśnej pasiece otoczony kwiatami"
            width={1200}
            height={1200}
            priority
            className="w-full"
          />

          {/* Bzz-bzz drip animation — anchored to right edge of image */}
          <div
            className="pointer-events-none absolute"
            style={{ width: 0, height: 0, right: `${config.bzzRight}%`, top: `${config.bzzTop}%` }}
          >
            <p
              className="absolute whitespace-nowrap font-medium"
              style={{
                fontSize: `${config.bzzSize}px`,
                fontFamily: "var(--font-mono)",
                color: "rgba(255,255,255,0.95)",
                textShadow: "0 1px 8px rgba(0,0,0,0.3)",
                opacity: 0,
                animation: "2s linear infinite backwards bzz-1",
                transformOrigin: "center center",
              }}
            >
              *Bzzz*
            </p>
            <p
              className="absolute whitespace-nowrap font-medium"
              style={{
                fontSize: `${config.bzzSize}px`,
                fontFamily: "var(--font-mono)",
                color: "rgba(255,255,255,0.95)",
                textShadow: "0 1px 8px rgba(0,0,0,0.3)",
                opacity: 0,
                animation: "2s linear 1s infinite backwards bzz-2",
                transformOrigin: "center center",
              }}
            >
              *Bzzz*
            </p>
          </div>

          <div
            className="absolute flex"
            style={{
              bottom: `${config.buttonBottomOffset}px`,
              gap: `${config.buttonGap}px`,
              left: `${config.buttonX}%`,
              transform: "translateX(-50%)",
            }}
          >
            <Link
              href="/cennik"
              className="inline-flex items-center justify-center whitespace-nowrap bg-primary font-medium leading-none text-primary-foreground transition-colors hover:bg-primary/90"
              style={{
                fontSize: `${config.buttonFontSize}px`,
                padding: `${config.buttonPaddingY}px ${config.buttonPaddingX}px`,
                borderRadius: `${config.buttonRadius}px`,
              }}
            >
              Chcę pszczoły!
            </Link>
            <Link
              href="/o-nas"
              className="inline-flex items-center justify-center whitespace-nowrap border border-border bg-background/80 font-medium leading-none backdrop-blur-sm transition-colors hover:bg-accent"
              style={{
                fontSize: `${config.buttonFontSize}px`,
                padding: `${config.buttonPaddingY}px ${config.buttonPaddingX}px`,
                borderRadius: `${config.buttonRadius}px`,
              }}
            >
              Dowiedz się więcej
            </Link>
          </div>
        </div>

        <p
          className="absolute text-white/80"
          style={{
            fontSize: `${config.textSize}px`,
            left: `${config.leftTextX}%`,
            top: `${config.leftTextY}%`,
            width: `${config.leftTextWidth}%`,
          }}
        >
          Kup własny ul na leśnej pasiece i co roku otrzymuj swój własny miód o
          gwarantowanej jakości. My opiekujemy się pasieką, Ty kontrolujesz
          proces przez stronę.
        </p>

        <p
          className="absolute text-white/80"
          style={{
            fontSize: `${config.textSize}px`,
            right: `${config.rightTextX}%`,
            top: `${config.rightTextY}%`,
            width: `${config.rightTextWidth}%`,
          }}
        >
          Miód z Twojego ula zostanie rozlany do wybranych przez Ciebie słoików
          z imienną etykietą i wysłany kurierem do dowolnego miasta.
        </p>
      </div>

      {/* Mobile: stacked */}
      <div className="flex flex-col items-center gap-8 md:hidden">
        <motion.h1
          className="text-center font-heading text-5xl tracking-tight"
          initial={{ filter: "blur(12px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Lepsze od miodu są tylko pszczoły
        </motion.h1>
        <div className="relative w-full">
          <Image
            src="/hero.png"
            alt="Ul na leśnej pasiece otoczony kwiatami"
            width={1200}
            height={1200}
            priority
            className="w-full"
          />
          <div className="absolute inset-x-0 bottom-6 flex justify-center gap-4">
            <Button render={<Link href="/cennik" />} size="lg">
              Chcę pszczoły!
            </Button>
            <Button
              render={<Link href="/o-nas" />}
              variant="outline"
              size="lg"
              className="bg-background/80 backdrop-blur-sm"
            >
              Dowiedz się więcej
            </Button>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">
          Kup własny ul na leśnej pasiece i co roku otrzymuj swój własny miód o
          gwarantowanej jakości. My opiekujemy się pasieką, Ty kontrolujesz
          proces przez stronę.
        </p>
        <p className="text-lg text-muted-foreground">
          Miód z Twojego ula zostanie rozlany do wybranych przez Ciebie słoików
          z imienną etykietą i wysłany kurierem do dowolnego miasta.
        </p>
      </div>

      {/* Settings panel */}
      <div className="fixed right-4 top-20 z-50 hidden md:block">
        <button
          onClick={() => setOpen(!open)}
          className="mb-1 ml-auto flex size-9 items-center justify-center rounded-lg bg-zinc-900 text-zinc-300 shadow-lg transition-colors hover:bg-zinc-800"
          title={open ? "Close settings" : "Open settings"}
        >
          {open ? "\u2715" : "\u2699"}
        </button>

        {open && (
          <div className="max-h-[calc(100vh-120px)] w-64 overflow-y-auto rounded-xl bg-zinc-900/95 p-3 shadow-2xl backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Hero</h3>
              <div className="flex gap-1.5">
                <button
                  onClick={resetConfig}
                  className="rounded px-2 py-0.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                >
                  Reset
                </button>
                <button
                  onClick={copyConfig}
                  className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-400 transition-colors hover:bg-amber-500/30"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Tabs — two rows */}
            <div className="mb-3 flex flex-wrap gap-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`rounded px-2 py-1 text-[10px] font-medium transition-colors ${
                    activeTab === t.id
                      ? "bg-amber-500 text-zinc-900"
                      : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {/* Sky tab */}
              {activeTab === "sky" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-300">Enabled</span>
                    <button
                      onClick={() => setSky((s) => ({ ...s, enabled: !s.enabled }))}
                      className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                        sky.enabled
                          ? "bg-amber-500 text-zinc-900"
                          : "bg-zinc-700 text-zinc-400"
                      }`}
                    >
                      {sky.enabled ? "ON" : "OFF"}
                    </button>
                  </div>
                  <ColorInput
                    label="Top color"
                    value={sky.colorTop}
                    onChange={(v) => setSky((s) => ({ ...s, colorTop: v }))}
                  />
                  <ColorInput
                    label="Bottom color"
                    value={sky.colorBottom}
                    onChange={(v) => setSky((s) => ({ ...s, colorBottom: v }))}
                  />
                </>
              )}

              {/* Cloud tabs */}
              {(["c1", "c2", "c3"] as const).map(
                (tab) =>
                  activeTab === tab && (
                    <div key={tab} className="flex flex-col gap-3">
                      <Slider
                        label="X position"
                        value={clouds[cloudTabIndex[tab]].x}
                        onChange={(v) => setCloud(cloudTabIndex[tab], "x", v)}
                        min={-100}
                        max={150}
                        unit="%"
                      />
                      <Slider
                        label="Y position"
                        value={clouds[cloudTabIndex[tab]].y}
                        onChange={(v) => setCloud(cloudTabIndex[tab], "y", v)}
                        min={-100}
                        max={150}
                        unit="%"
                      />
                      <Slider
                        label="Width"
                        value={clouds[cloudTabIndex[tab]].width}
                        onChange={(v) => setCloud(cloudTabIndex[tab], "width", v)}
                        min={50}
                        max={2000}
                        step={10}
                      />
                      <Slider
                        label="Opacity"
                        value={clouds[cloudTabIndex[tab]].opacity}
                        onChange={(v) => setCloud(cloudTabIndex[tab], "opacity", v)}
                        min={0}
                        max={1}
                        step={0.01}
                        unit=""
                      />
                      <Slider
                        label="Blur"
                        value={clouds[cloudTabIndex[tab]].blur}
                        onChange={(v) => setCloud(cloudTabIndex[tab], "blur", v)}
                        min={0}
                        max={40}
                      />
                      <Slider
                        label="Parallax speed"
                        value={clouds[cloudTabIndex[tab]].speed}
                        onChange={(v) => setCloud(cloudTabIndex[tab], "speed", v)}
                        min={-1}
                        max={1}
                        step={0.01}
                        unit=""
                      />
                      {/* Cloud source picker */}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-zinc-300">Source</span>
                        <div className="flex gap-1">
                          {["/clouds/cloud-bg-1.png", "/clouds/cloud-bg-2.png", "/clouds/cloud-bg-3.png"].map(
                            (src, si) => (
                              <button
                                key={src}
                                onClick={() => setCloud(cloudTabIndex[tab], "src", src)}
                                className={`flex-1 rounded py-1 text-[10px] font-medium transition-colors ${
                                  clouds[cloudTabIndex[tab]].src === src
                                    ? "bg-amber-500 text-zinc-900"
                                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                                }`}
                              >
                                {si + 1}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )
              )}

              {activeTab === "heading" && (
                <>
                  <Slider
                    label="Font size"
                    value={config.headingSize}
                    onChange={(v) => set("headingSize", v)}
                    min={36}
                    max={200}
                  />
                  <Slider
                    label="Width"
                    value={config.headingWidth}
                    onChange={(v) => set("headingWidth", v)}
                    min={20}
                    max={100}
                    unit="%"
                  />
                  <Slider
                    label="Line height"
                    value={config.headingLineHeight}
                    onChange={(v) => set("headingLineHeight", v)}
                    min={0.5}
                    max={2}
                    step={0.05}
                    unit=""
                  />
                  <Slider
                    label="Overlap into image"
                    value={config.headingTopOffset}
                    onChange={(v) => set("headingTopOffset", v)}
                    min={-100}
                    max={400}
                  />
                </>
              )}

              {activeTab === "image" && (
                <Slider
                  label="Width"
                  value={config.imageWidth}
                  onChange={(v) => set("imageWidth", v)}
                  min={10}
                  max={100}
                  unit="%"
                />
              )}

              {activeTab === "left" && (
                <>
                  <Slider
                    label="X (from left)"
                    value={config.leftTextX}
                    onChange={(v) => set("leftTextX", v)}
                    min={-50}
                    max={80}
                    unit="%"
                  />
                  <Slider
                    label="Y (from top)"
                    value={config.leftTextY}
                    onChange={(v) => set("leftTextY", v)}
                    min={-50}
                    max={100}
                    unit="%"
                  />
                  <Slider
                    label="Width"
                    value={config.leftTextWidth}
                    onChange={(v) => set("leftTextWidth", v)}
                    min={5}
                    max={80}
                    unit="%"
                  />
                  <Slider
                    label="Font size"
                    value={config.textSize}
                    onChange={(v) => set("textSize", v)}
                    min={8}
                    max={48}
                  />
                </>
              )}

              {activeTab === "right" && (
                <>
                  <Slider
                    label="X (from right)"
                    value={config.rightTextX}
                    onChange={(v) => set("rightTextX", v)}
                    min={-50}
                    max={80}
                    unit="%"
                  />
                  <Slider
                    label="Y (from top)"
                    value={config.rightTextY}
                    onChange={(v) => set("rightTextY", v)}
                    min={-50}
                    max={100}
                    unit="%"
                  />
                  <Slider
                    label="Width"
                    value={config.rightTextWidth}
                    onChange={(v) => set("rightTextWidth", v)}
                    min={5}
                    max={80}
                    unit="%"
                  />
                </>
              )}

              {activeTab === "buttons" && (
                <>
                  <Slider
                    label="X position"
                    value={config.buttonX}
                    onChange={(v) => set("buttonX", v)}
                    min={0}
                    max={100}
                    unit="%"
                  />
                  <Slider
                    label="Bottom offset"
                    value={config.buttonBottomOffset}
                    onChange={(v) => set("buttonBottomOffset", v)}
                    min={-200}
                    max={500}
                  />
                  <Slider
                    label="Gap"
                    value={config.buttonGap}
                    onChange={(v) => set("buttonGap", v)}
                    min={0}
                    max={80}
                  />
                  <Slider
                    label="Font size"
                    value={config.buttonFontSize}
                    onChange={(v) => set("buttonFontSize", v)}
                    min={8}
                    max={48}
                  />
                  <Slider
                    label="Padding X"
                    value={config.buttonPaddingX}
                    onChange={(v) => set("buttonPaddingX", v)}
                    min={0}
                    max={80}
                  />
                  <Slider
                    label="Padding Y"
                    value={config.buttonPaddingY}
                    onChange={(v) => set("buttonPaddingY", v)}
                    min={0}
                    max={48}
                  />
                  <Slider
                    label="Border radius"
                    value={config.buttonRadius}
                    onChange={(v) => set("buttonRadius", v)}
                    min={0}
                    max={60}
                  />
                </>
              )}

              {activeTab === "bzz" && (
                <>
                  <Slider
                    label="From right"
                    value={config.bzzRight}
                    onChange={(v) => set("bzzRight", v)}
                    min={-20}
                    max={50}
                    unit="%"
                  />
                  <Slider
                    label="From top"
                    value={config.bzzTop}
                    onChange={(v) => set("bzzTop", v)}
                    min={-10}
                    max={80}
                    unit="%"
                  />
                  <Slider
                    label="Font size"
                    value={config.bzzSize}
                    onChange={(v) => set("bzzSize", v)}
                    min={10}
                    max={36}
                  />
                </>
              )}

              {activeTab === "section" && (
                <>
                  <Slider
                    label="Padding top"
                    value={config.sectionPaddingTop}
                    onChange={(v) => set("sectionPaddingTop", v)}
                    min={0}
                    max={300}
                  />
                  <Slider
                    label="Min height"
                    value={config.sectionMinHeight}
                    onChange={(v) => set("sectionMinHeight", v)}
                    min={0}
                    max={200}
                    unit="vh"
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
