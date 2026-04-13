"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

/* ────────────────────────────────────────────── */
/*  Hero Config                                    */
/* ────────────────────────────────────────────── */

export interface HeroConfig {
  headingSize: number;
  headingLineHeight: number;
  headingWidth: number;     // % of stage
  headingOffsetY: number;   // % of stage — offset from groundY (negative = above)
  subheadingSize: number;
  buttonGap: number;
  buttonFontSize: number;
  buttonPaddingX: number;
  buttonPaddingY: number;
  buttonRadius: number;
  buttonX: number;          // % of stage
  buttonOffsetY: number;    // % of stage — offset from groundY
  sectionMinHeight: number;
  bzzRight: number;         // % of stage (from right)
  bzzOffsetY: number;       // % of stage — offset from groundY
  bzzSize: number;
  groundY: number;          // % of stage — top of opaque region (meadow/beehive top)

  // Mobile overrides
  mobileLogoHeight: number;
  mobileMinHeight: number;        // dvh — section min-height on mobile
  mobileHeadingSize: number;
  mobileHeadingLineHeight: number;
  mobileSubheadingSize: number;
  mobilePaddingTop: number;       // px — top padding of content
  mobilePaddingBottom: number;    // px — bottom padding (above buttons)
  mobilePaddingX: number;         // px — horizontal padding
  mobileButtonFontSize: number;
  mobileButtonPaddingX: number;
  mobileButtonPaddingY: number;
  mobileButtonRadius: number;
  mobileButtonGap: number;
}

export const defaultHeroConfig: HeroConfig = {
  headingSize: 92,
  headingLineHeight: 0.95,
  headingWidth: 69,
  headingOffsetY: -2,
  subheadingSize: 18,
  buttonGap: 19,
  buttonFontSize: 22,
  buttonPaddingX: 27,
  buttonPaddingY: 12,
  buttonRadius: 15,
  buttonX: 50,
  buttonOffsetY: 30,
  sectionMinHeight: 125,
  bzzRight: 43,
  bzzOffsetY: 9,
  bzzSize: 20,
  groundY: 30,
  mobileLogoHeight: 50,
  mobileMinHeight: 114,
  mobileHeadingSize: 59,
  mobileHeadingLineHeight: 1.05,
  mobileSubheadingSize: 13,
  mobilePaddingTop: 85,
  mobilePaddingBottom: 73,
  mobilePaddingX: 10,
  mobileButtonFontSize: 16,
  mobileButtonPaddingX: 20,
  mobileButtonPaddingY: 14,
  mobileButtonRadius: 12,
  mobileButtonGap: 12,
};

/* ────────────────────────────────────────────── */
/*  Timeline Config                                */
/* ────────────────────────────────────────────── */

export interface TimelineConfig {
  textSize: number;
  textLeading: number;
  cardWidth: number;
  cardGap: number;
  cardPadding: number;
  rotationMax: number;
  cardTitleSize: number;
  cardTitleWeight: number;
  cardBodySize: number;
  labelSize: number;
}

export const defaultTimelineConfig: TimelineConfig = {
  textSize: 11,
  textLeading: 0.9,
  cardWidth: 439,
  cardGap: 52,
  cardPadding: 26,
  rotationMax: 3,
  cardTitleSize: 19,
  cardTitleWeight: 700,
  cardBodySize: 17,
  labelSize: 16,
};

/* ────────────────────────────────────────────── */
/*  Context                                        */
/* ────────────────────────────────────────────── */

interface ConfigCtx {
  hero: HeroConfig;
  setHero: Dispatch<SetStateAction<HeroConfig>>;
  timeline: TimelineConfig;
  setTimeline: Dispatch<SetStateAction<TimelineConfig>>;
}

const Ctx = createContext<ConfigCtx | null>(null);

export function useHeroConfig() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Wrap with SectionConfigProvider");
  return [ctx.hero, ctx.setHero] as const;
}

export function useTimelineConfig() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Wrap with SectionConfigProvider");
  return [ctx.timeline, ctx.setTimeline] as const;
}

/* ────────────────────────────────────────────── */
/*  Slider                                         */
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

/* ────────────────────────────────────────────── */
/*  Settings Panel                                 */
/* ────────────────────────────────────────────── */

type Section = "hero" | "timeline";
type HeroTab = "heading" | "buttons" | "bzz" | "section" | "mobile";
type TimelineTab = "text" | "cards" | "type";

function SettingsPanel() {
  const [hero, setHero] = useHeroConfig();
  const [timeline, setTimeline] = useTimelineConfig();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>("hero");
  const [heroTab, setHeroTab] = useState<HeroTab>("heading");
  const [timelineTab, setTimelineTab] = useState<TimelineTab>("text");

  const setH = <K extends keyof HeroConfig>(key: K, v: HeroConfig[K]) =>
    setHero((prev) => ({ ...prev, [key]: v }));
  const setT = <K extends keyof TimelineConfig>(key: K, v: TimelineConfig[K]) =>
    setTimeline((prev) => ({ ...prev, [key]: v }));

  const copyConfig = () => {
    const data = section === "hero" ? hero : timeline;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const resetConfig = () => {
    if (section === "hero") setHero(defaultHeroConfig);
    else setTimeline(defaultTimelineConfig);
  };

  const heroTabs: { id: HeroTab; label: string }[] = [
    { id: "heading", label: "H1" },
    { id: "buttons", label: "Btn" },
    { id: "bzz", label: "Bzz" },
    { id: "section", label: "Sec" },
    { id: "mobile", label: "Mob" },
  ];

  const timelineTabs: { id: TimelineTab; label: string }[] = [
    { id: "text", label: "Text" },
    { id: "cards", label: "Cards" },
    { id: "type", label: "Type" },
  ];

  const tabBtnCls = (active: boolean) =>
    `rounded px-2 py-1 text-[10px] font-medium transition-colors ${
      active
        ? "bg-amber-500 text-zinc-900"
        : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
    }`;

  return (
    <div className="fixed right-4 top-20 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="mb-1 ml-auto flex size-9 items-center justify-center rounded-lg bg-zinc-900 text-zinc-300 shadow-lg transition-colors hover:bg-zinc-800"
        title={open ? "Close settings" : "Open settings"}
      >
        {open ? "\u2715" : "\u2699"}
      </button>

      {open && (
        <div className="max-h-[calc(100vh-120px)] w-64 overflow-y-auto rounded-xl bg-zinc-900/95 p-3 shadow-2xl backdrop-blur-md">
          {/* Section selector */}
          <div className="mb-3 flex gap-1">
            {(["hero", "timeline"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  section === s
                    ? "bg-amber-500 text-zinc-900"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {s === "hero" ? "Hero" : "Timeline"}
              </button>
            ))}
          </div>

          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold capitalize text-white">
              {section}
            </h3>
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

          {/* ── Hero controls ── */}
          {section === "hero" && (
            <>
              <div className="mb-3 flex flex-wrap gap-1">
                {heroTabs.map((t) => (
                  <button key={t.id} onClick={() => setHeroTab(t.id)} className={tabBtnCls(heroTab === t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {heroTab === "heading" && (
                  <>
                    <Slider label="Font size" value={hero.headingSize} onChange={(v) => setH("headingSize", v)} min={36} max={200} />
                    <Slider label="Width" value={hero.headingWidth} onChange={(v) => setH("headingWidth", v)} min={20} max={100} unit="%" />
                    <Slider label="Y from ground" value={hero.headingOffsetY} onChange={(v) => setH("headingOffsetY", v)} min={-60} max={60} unit="%" />
                    <Slider label="Subheading size" value={hero.subheadingSize} onChange={(v) => setH("subheadingSize", v)} min={8} max={36} />
                    <Slider label="Line height" value={hero.headingLineHeight} onChange={(v) => setH("headingLineHeight", v)} min={0.5} max={2} step={0.05} unit="" />
                  </>
                )}
                {heroTab === "buttons" && (
                  <>
                    <Slider label="X (stage)" value={hero.buttonX} onChange={(v) => setH("buttonX", v)} min={0} max={100} unit="%" />
                    <Slider label="Y from ground" value={hero.buttonOffsetY} onChange={(v) => setH("buttonOffsetY", v)} min={-60} max={60} unit="%" />
                    <Slider label="Gap" value={hero.buttonGap} onChange={(v) => setH("buttonGap", v)} min={0} max={80} />
                    <Slider label="Font size" value={hero.buttonFontSize} onChange={(v) => setH("buttonFontSize", v)} min={8} max={48} />
                    <Slider label="Padding X" value={hero.buttonPaddingX} onChange={(v) => setH("buttonPaddingX", v)} min={0} max={80} />
                    <Slider label="Padding Y" value={hero.buttonPaddingY} onChange={(v) => setH("buttonPaddingY", v)} min={0} max={48} />
                    <Slider label="Border radius" value={hero.buttonRadius} onChange={(v) => setH("buttonRadius", v)} min={0} max={60} />
                  </>
                )}
                {heroTab === "bzz" && (
                  <>
                    <Slider label="From right (stage)" value={hero.bzzRight} onChange={(v) => setH("bzzRight", v)} min={-20} max={50} unit="%" />
                    <Slider label="Y from ground" value={hero.bzzOffsetY} onChange={(v) => setH("bzzOffsetY", v)} min={-60} max={60} unit="%" />
                    <Slider label="Font size" value={hero.bzzSize} onChange={(v) => setH("bzzSize", v)} min={10} max={36} />
                  </>
                )}
                {heroTab === "section" && (
                  <>
                    <Slider label="Ground Y (opaque top)" value={hero.groundY} onChange={(v) => setH("groundY", v)} min={0} max={100} unit="%" />
                    <Slider label="Min height (desktop)" value={hero.sectionMinHeight} onChange={(v) => setH("sectionMinHeight", v)} min={0} max={200} unit="vh" />
                  </>
                )}
                {heroTab === "mobile" && (
                  <>
                    <Slider label="Min height" value={hero.mobileMinHeight} onChange={(v) => setH("mobileMinHeight", v)} min={60} max={200} unit="dvh" />
                    <Slider label="Logo height" value={hero.mobileLogoHeight} onChange={(v) => setH("mobileLogoHeight", v)} min={40} max={140} />
                    <Slider label="Heading size" value={hero.mobileHeadingSize} onChange={(v) => setH("mobileHeadingSize", v)} min={20} max={72} />
                    <Slider label="Heading line height" value={hero.mobileHeadingLineHeight} onChange={(v) => setH("mobileHeadingLineHeight", v)} min={0.7} max={1.5} step={0.05} unit="" />
                    <Slider label="Subheading size" value={hero.mobileSubheadingSize} onChange={(v) => setH("mobileSubheadingSize", v)} min={8} max={20} />
                    <Slider label="Padding top" value={hero.mobilePaddingTop} onChange={(v) => setH("mobilePaddingTop", v)} min={40} max={200} />
                    <Slider label="Padding bottom" value={hero.mobilePaddingBottom} onChange={(v) => setH("mobilePaddingBottom", v)} min={16} max={120} />
                    <Slider label="Padding X" value={hero.mobilePaddingX} onChange={(v) => setH("mobilePaddingX", v)} min={0} max={40} />
                    <Slider label="Btn font" value={hero.mobileButtonFontSize} onChange={(v) => setH("mobileButtonFontSize", v)} min={10} max={24} />
                    <Slider label="Btn padding X" value={hero.mobileButtonPaddingX} onChange={(v) => setH("mobileButtonPaddingX", v)} min={8} max={40} />
                    <Slider label="Btn padding Y" value={hero.mobileButtonPaddingY} onChange={(v) => setH("mobileButtonPaddingY", v)} min={4} max={24} />
                    <Slider label="Btn radius" value={hero.mobileButtonRadius} onChange={(v) => setH("mobileButtonRadius", v)} min={0} max={30} />
                    <Slider label="Btn gap" value={hero.mobileButtonGap} onChange={(v) => setH("mobileButtonGap", v)} min={0} max={32} />
                  </>
                )}
              </div>
            </>
          )}

          {/* ── Timeline controls ── */}
          {section === "timeline" && (
            <>
              <div className="mb-3 flex flex-wrap gap-1">
                {timelineTabs.map((t) => (
                  <button key={t.id} onClick={() => setTimelineTab(t.id)} className={tabBtnCls(timelineTab === t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {timelineTab === "text" && (
                  <>
                    <Slider label="Font size" value={timeline.textSize} onChange={(v) => setT("textSize", v)} min={6} max={28} unit="vw" />
                    <Slider label="Line height" value={timeline.textLeading} onChange={(v) => setT("textLeading", v)} min={0.5} max={1.5} step={0.05} unit="" />
                    <Slider label="Label size" value={timeline.labelSize} onChange={(v) => setT("labelSize", v)} min={8} max={24} />
                  </>
                )}
                {timelineTab === "cards" && (
                  <>
                    <Slider label="Card width" value={timeline.cardWidth} onChange={(v) => setT("cardWidth", v)} min={240} max={560} />
                    <Slider label="Card gap" value={timeline.cardGap} onChange={(v) => setT("cardGap", v)} min={8} max={80} />
                    <Slider label="Card padding" value={timeline.cardPadding} onChange={(v) => setT("cardPadding", v)} min={8} max={48} />
                    <Slider label="Max rotation" value={timeline.rotationMax} onChange={(v) => setT("rotationMax", v)} min={0} max={10} step={0.5} unit="°" />
                  </>
                )}
                {timelineTab === "type" && (
                  <>
                    <Slider label="Title size" value={timeline.cardTitleSize} onChange={(v) => setT("cardTitleSize", v)} min={10} max={28} />
                    <Slider label="Title weight" value={timeline.cardTitleWeight} onChange={(v) => setT("cardTitleWeight", v)} min={400} max={900} step={100} unit="" />
                    <Slider label="Body size" value={timeline.cardBodySize} onChange={(v) => setT("cardBodySize", v)} min={10} max={22} />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────── */
/*  Provider                                       */
/* ────────────────────────────────────────────── */

export function SectionConfigProvider({ children }: { children: ReactNode }) {
  const [hero, setHero] = useState<HeroConfig>(defaultHeroConfig);
  const [timeline, setTimeline] = useState<TimelineConfig>(defaultTimelineConfig);

  return (
    <Ctx.Provider value={{ hero, setHero, timeline, setTimeline }}>
      {children}
      <SettingsPanel />
    </Ctx.Provider>
  );
}
