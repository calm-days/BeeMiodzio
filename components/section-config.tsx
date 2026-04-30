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
  dripOffset: number;       // px — how far the drip SVG slides up under the button (overlap)
  dripInset: number;        // px — how much to trim from each side of the drip SVG (centering inset)
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
  mobileBzzSize: number;    // px — font size (position shared with desktop via bzzRight/bzzOffsetY/groundY)
}

export const defaultHeroConfig: HeroConfig = {
  headingSize: 80,
  headingLineHeight: 0.95,
  headingWidth: 69,
  headingOffsetY: -2,
  subheadingSize: 18,
  buttonGap: 19,
  buttonFontSize: 22,
  buttonPaddingX: 27,
  buttonPaddingY: 12,
  buttonRadius: 15,
  dripOffset: 4,
  dripInset: 6,
  buttonX: 50,
  buttonOffsetY: 30,
  sectionMinHeight: 125,
  bzzRight: 43,
  bzzOffsetY: 9,
  bzzSize: 20,
  groundY: 30,
  mobileLogoHeight: 50,
  mobileMinHeight: 118,
  mobileHeadingSize: 54,
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
  mobileBzzSize: 16,
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
/*  Heading Config (AnimatedHeading)               */
/* ────────────────────────────────────────────── */

export interface HeadingConfig {
  duration: number;
  stagger: number;
  mediaDelay: number;
  mediaDuration: number;
  mediaW: number;
  mediaH: number;
  mediaGap: number;
  mediaRadius: number;
  wordGap: number;
  marginBottom: number;
  scale: number;
  lineHeight: number;
  stiffness: number;
  damping: number;
  mass: number;

  // Mobile overrides — visual only; animation timing stays shared
  mobileScale: number;
  mobileLineHeight: number;
  mobileMarginBottom: number;
  mobileWordGap: number;
  mobileMediaW: number;
  mobileMediaH: number;
  mobileMediaGap: number;
  mobileMediaRadius: number;
}

export const defaultHeadingConfig: HeadingConfig = {
  duration: 1,
  stagger: 0.08,
  mediaDelay: 0.65,
  mediaDuration: 0.5,
  mediaW: 2.8,
  mediaH: 0.85,
  mediaGap: 0.2,
  mediaRadius: 1.05,
  wordGap: 0.17,
  marginBottom: 3.75,
  scale: 6,
  lineHeight: 0.9,
  stiffness: 110,
  damping: 20,
  mass: 1,
  mobileScale: 3.25,
  mobileLineHeight: 0.95,
  mobileMarginBottom: 2,
  mobileWordGap: 0.17,
  mobileMediaW: 2.5,
  mobileMediaH: 0.85,
  mobileMediaGap: 0.2,
  mobileMediaRadius: 0.6,
};

/* ────────────────────────────────────────────── */
/*  Steps Config (Jak to działa)                   */
/* ────────────────────────────────────────────── */

export interface StepsConfig {
  rowGap: number;       // px — vertical space between rows
  imageWidth: number;   // % — image share of row width on desktop
  innerGap: number;     // px — horizontal gap between image and text
  imageRadius: number;  // px — border radius of image
  imageRatio: number;   // aspect ratio as width/height (e.g. 1.33 = 4:3)
  titleSize: number;    // px
  bodySize: number;     // px
  numberSize: number;   // px — number badge size
}

export const defaultStepsConfig: StepsConfig = {
  rowGap: 117,
  imageWidth: 41,
  innerGap: 48,
  imageRadius: 16,
  imageRatio: 1.1,
  titleSize: 29,
  bodySize: 20,
  numberSize: 39,
};

/* ────────────────────────────────────────────── */
/*  Jak to działa — image placement config          */
/* ────────────────────────────────────────────── */

export type JakAlign = "start" | "center" | "end";

export interface JakImage {
  w: number;      // % — width within cell
  ratio: number;  // w/h aspect ratio
  align: JakAlign; // self-alignment on the cross axis
  mt: number;     // px — top margin (can be negative for overlap)
  z: number;      // z-index — higher = on top when images overlap
  round: boolean; // true = 50% border-radius (circle/ellipse), overrides global radius
  skewY?: number; // deg — vertical skew (parallelogram); negative tilts top/bottom edges up to the right, verticals stay vertical
}

export interface JakRow {
  img1: JakImage;
  img2?: JakImage;        // optional second image for multi-image rows
  textPt: number;         // px — Y offset applied as marginTop on text block (negative = pull up)
  textAlign: JakAlign;    // vertical alignment of text within the grid row
  cellGap: number;        // px — vertical gap between img1 and img2 inside the image cell
  imageLeft: boolean;     // true = image column on left, text on right
}

export type JakImageOrder = "before" | "after";

export interface JakMobileRow extends JakRow {
  imageOrder: JakImageOrder; // image cluster placement relative to text on mobile
}

export interface JakMobileConfig {
  rowGap: number;       // px — gap between rows on mobile
  paddingX: number;     // px — extra horizontal padding inside rows on mobile
  titleSize: number;    // px — step title font size on mobile
  bodySize: number;     // px — step body font size on mobile
  textMaxW: number;     // px — max width of text block on mobile
  r1: JakMobileRow;
  r2: JakMobileRow;
  r3: JakMobileRow;
  r4: JakMobileRow;
}

export interface JakConfig {
  rowGap: number;         // px — gap between rows
  colGap: number;         // px — horizontal gap between image column and text column inside each row
  radius: number;         // px — corner radius for all images
  titleSize: number;      // px — step title font size
  bodySize: number;       // px — step body font size
  textMaxW: number;       // px — max width of the text block
  textColPct: number;     // % — width of the text column (image gets the rest)
  r1: JakRow;             // certificate + ule, text right
  r2: JakRow;             // text, portrait + map
  r3: JakRow;             // phone, text (r3.img2 unused)
  r4: JakRow;             // text, jars + jar (overlap)
  mobile: JakMobileConfig; // single-column mobile layout overrides
}

export const defaultJakConfig: JakConfig = {
  rowGap: 40,
  colGap: 73,
  radius: 33,
  titleSize: 38,
  bodySize: 22,
  textMaxW: 603,
  textColPct: 45,
  r1: {
    img1: { w: 74, ratio: 1.333, align: "start", mt: 22, z: 6, round: true },
    img2: { w: 69, ratio: 1.333, align: "end", mt: -92, z: 3, round: false },
    textPt: 276,
    textAlign: "end",
    cellGap: 18,
    imageLeft: true,
  },
  r2: {
    img1: { w: 62, ratio: 0.73, align: "end", mt: -90, z: 2, round: false },
    img2: { w: 69, ratio: 1.08, align: "start", mt: -50, z: 3, round: false },
    textPt: 235,
    textAlign: "center",
    cellGap: 0,
    imageLeft: false,
  },
  r3: {
    img1: { w: 85, ratio: 0.81, align: "start", mt: -59, z: 1, round: false, skewY: -1.5 },
    textPt: 281,
    textAlign: "end",
    cellGap: 24,
    imageLeft: true,
  },
  r4: {
    img1: { w: 78, ratio: 1.333, align: "end", mt: -43, z: 1, round: false },
    img2: { w: 65, ratio: 1, align: "start", mt: -56, z: 2, round: true },
    textPt: 303,
    textAlign: "center",
    cellGap: 12,
    imageLeft: false,
  },
  mobile: {
    rowGap: 95,
    paddingX: 0,
    titleSize: 24,
    bodySize: 16,
    textMaxW: 480,
    r1: {
      img1: { w: 72, ratio: 1.333, align: "start", mt: 0, z: 6, round: true },
      img2: { w: 74, ratio: 1.333, align: "end", mt: -40, z: 3, round: false },
      textPt: 34,
      textAlign: "center",
      cellGap: 0,
      imageLeft: true,
      imageOrder: "before",
    },
    r2: {
      img1: { w: 56, ratio: 0.73, align: "start", mt: 0, z: 2, round: false },
      img2: { w: 72, ratio: 1.43, align: "end", mt: -50, z: 3, round: true },
      textPt: 24,
      textAlign: "start",
      cellGap: 0,
      imageLeft: false,
      imageOrder: "before",
    },
    r3: {
      img1: { w: 100, ratio: 0.81, align: "center", mt: 0, z: 1, round: false, skewY: -1.5 },
      textPt: 24,
      textAlign: "start",
      cellGap: 0,
      imageLeft: true,
      imageOrder: "before",
    },
    r4: {
      img1: { w: 78, ratio: 1.333, align: "start", mt: 0, z: 1, round: false },
      img2: { w: 55, ratio: 1, align: "end", mt: -40, z: 2, round: true },
      textPt: 24,
      textAlign: "start",
      cellGap: 0,
      imageLeft: false,
      imageOrder: "before",
    },
  },
};

/* ────────────────────────────────────────────── */
/*  Prezent Config (Fanned gift cards)             */
/* ────────────────────────────────────────────── */

export interface PrezentConfig {
  rotation: number;          // ° — side card tilt
  overlap: number;           // px — negative margin for card overlap
  verticalOffset: number;    // px — vertical stagger (center up, sides down)
  horizontalOffset: number;  // px — side cards horizontal shift outward
  sideWidth: number;         // px — side card width
  centerWidth: number;       // px — center card width
  cardPadding: number;       // px
  cardRadius: number;        // px
  titleSize: number;         // px
  bodySize: number;          // px
  imageRatio: number;        // width/height
}

export const defaultPrezentConfig: PrezentConfig = {
  rotation: 9.5,
  overlap: 11,
  verticalOffset: 27,
  horizontalOffset: 12,
  sideWidth: 329,
  centerWidth: 361,
  cardPadding: 22,
  cardRadius: 16,
  titleSize: 19,
  bodySize: 15,
  imageRatio: 2,
};

/* ────────────────────────────────────────────── */
/*  Taryfy Config (Plan badges)                    */
/* ────────────────────────────────────────────── */

export interface TaryfyConfig {
  cardRadius: number;        // px — top corner radius of card
  cardPaddingX: number;      // px — horizontal padding inside card
  cardPaddingTop: number;    // px — top padding inside card
  cardPaddingBottom: number; // px — bottom padding inside card (above drip)
  dripHeight: number;        // px — drip pattern height
  titleSize: number;         // px — plan name font size
  priceSize: number;         // px — price font size
  bodySize: number;          // px — body/feature text font size
  featureGap: number;        // px — gap between feature items
}

export const defaultTaryfyConfig: TaryfyConfig = {
  cardRadius: 36,
  cardPaddingX: 30,
  cardPaddingTop: 38,
  cardPaddingBottom: 32,
  dripHeight: 70,
  titleSize: 44,
  priceSize: 42,
  bodySize: 13,
  featureGap: 11,
};

/* ────────────────────────────────────────────── */
/*  Context                                        */
/* ────────────────────────────────────────────── */

interface ConfigCtx {
  hero: HeroConfig;
  setHero: Dispatch<SetStateAction<HeroConfig>>;
  timeline: TimelineConfig;
  setTimeline: Dispatch<SetStateAction<TimelineConfig>>;
  heading: HeadingConfig;
  setHeading: Dispatch<SetStateAction<HeadingConfig>>;
  steps: StepsConfig;
  setSteps: Dispatch<SetStateAction<StepsConfig>>;
  jak: JakConfig;
  setJak: Dispatch<SetStateAction<JakConfig>>;
  prezent: PrezentConfig;
  setPrezent: Dispatch<SetStateAction<PrezentConfig>>;
  taryfy: TaryfyConfig;
  setTaryfy: Dispatch<SetStateAction<TaryfyConfig>>;
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

export function useHeadingConfig() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Wrap with SectionConfigProvider");
  return [ctx.heading, ctx.setHeading] as const;
}

export function useStepsConfig() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Wrap with SectionConfigProvider");
  return [ctx.steps, ctx.setSteps] as const;
}

export function useJakConfig() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Wrap with SectionConfigProvider");
  return [ctx.jak, ctx.setJak] as const;
}

export function usePrezentConfig() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Wrap with SectionConfigProvider");
  return [ctx.prezent, ctx.setPrezent] as const;
}

export function useTaryfyConfig() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Wrap with SectionConfigProvider");
  return [ctx.taryfy, ctx.setTaryfy] as const;
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

type Section = "hero" | "heading" | "steps" | "jak" | "timeline" | "prezent" | "taryfy";
type HeroTab = "heading" | "buttons" | "bzz" | "section" | "mobile";
type TimelineTab = "text" | "cards" | "type";
type HeadingTab = "type" | "media" | "timing" | "spring" | "mobile";
type StepsTab = "layout" | "type";
type PrezentTab = "layout" | "type";
type JakTab = "global" | "r1" | "r2" | "r3" | "r4";

function AlignToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: JakAlign;
  onChange: (v: JakAlign) => void;
}) {
  const options: JakAlign[] = ["start", "center", "end"];
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-zinc-300">{label}</span>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 rounded px-2 py-1 text-[10px] font-medium transition-colors ${
              value === opt
                ? "bg-amber-500 text-zinc-900"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function OrderToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: JakImageOrder;
  onChange: (v: JakImageOrder) => void;
}) {
  const options: JakImageOrder[] = ["before", "after"];
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-zinc-300">{label}</span>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 rounded px-2 py-1 text-[10px] font-medium transition-colors ${
              value === opt
                ? "bg-amber-500 text-zinc-900"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function BoolToggle({
  label,
  value,
  onLabel,
  offLabel,
  onChange,
}: {
  label: string;
  value: boolean;
  onLabel: string;
  offLabel: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-zinc-300">{label}</span>
      <div className="flex gap-1">
        {([true, false] as const).map((v) => (
          <button
            key={String(v)}
            onClick={() => onChange(v)}
            className={`flex-1 rounded px-2 py-1 text-[10px] font-medium transition-colors ${
              value === v
                ? "bg-amber-500 text-zinc-900"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {v ? onLabel : offLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

function JakImgControls({
  label,
  img,
  onChange,
}: {
  label: string;
  img: JakImage;
  onChange: (patch: Partial<JakImage>) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md bg-zinc-800/60 p-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
        {label}
      </p>
      <Slider label="Width" value={img.w} onChange={(v) => onChange({ w: v })} min={20} max={100} unit="%" />
      <Slider label="Aspect" value={img.ratio} onChange={(v) => onChange({ ratio: v })} min={0.4} max={2.5} step={0.01} unit="" />
      <Slider label="Margin top" value={img.mt} onChange={(v) => onChange({ mt: v })} min={-120} max={80} />
      <Slider label="Z-index" value={img.z} onChange={(v) => onChange({ z: v })} min={0} max={10} unit="" />
      <AlignToggle label="Align" value={img.align} onChange={(v) => onChange({ align: v })} />
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-300">Circle</span>
        <button
          onClick={() => onChange({ round: !img.round })}
          className={`rounded px-3 py-1 text-[10px] font-medium transition-colors ${
            img.round
              ? "bg-amber-500 text-zinc-900"
              : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {img.round ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
}

function JakRowControls({
  rowKey,
  row,
  setRow,
  setImg,
}: {
  rowKey: "r1" | "r2" | "r3" | "r4";
  row: JakRow;
  setRow: (rowKey: "r1" | "r2" | "r3" | "r4", patch: Partial<JakRow>) => void;
  setImg: (
    rowKey: "r1" | "r2" | "r3" | "r4",
    imgKey: "img1" | "img2",
    patch: Partial<JakImage>,
  ) => void;
}) {
  return (
    <>
      <BoolToggle
        label="Image side"
        value={row.imageLeft}
        onLabel="Left"
        offLabel="Right"
        onChange={(v) => setRow(rowKey, { imageLeft: v })}
      />
      <Slider
        label="Text Y offset"
        value={row.textPt}
        onChange={(v) => setRow(rowKey, { textPt: v })}
        min={-200}
        max={400}
      />
      <AlignToggle
        label="Text V-align"
        value={row.textAlign}
        onChange={(v) => setRow(rowKey, { textAlign: v })}
      />
      {row.img2 && (
        <Slider
          label="Cell gap"
          value={row.cellGap}
          onChange={(v) => setRow(rowKey, { cellGap: v })}
          min={0}
          max={80}
        />
      )}
      <JakImgControls
        label="Image 1"
        img={row.img1}
        onChange={(patch) => setImg(rowKey, "img1", patch)}
      />
      {row.img2 && (
        <JakImgControls
          label="Image 2"
          img={row.img2}
          onChange={(patch) => setImg(rowKey, "img2", patch)}
        />
      )}
    </>
  );
}

function SettingsPanel() {
  const [hero, setHero] = useHeroConfig();
  const [timeline, setTimeline] = useTimelineConfig();
  const [heading, setHeading] = useHeadingConfig();
  const [steps, setSteps] = useStepsConfig();
  const [jak, setJak] = useJakConfig();
  const [prezent, setPrezent] = usePrezentConfig();
  const [taryfy, setTaryfy] = useTaryfyConfig();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>("hero");
  const [heroTab, setHeroTab] = useState<HeroTab>("heading");
  const [timelineTab, setTimelineTab] = useState<TimelineTab>("text");
  const [headingTab, setHeadingTab] = useState<HeadingTab>("type");
  const [stepsTab, setStepsTab] = useState<StepsTab>("layout");
  const [prezentTab, setPrezentTab] = useState<PrezentTab>("layout");
  const [jakTab, setJakTab] = useState<JakTab>("global");
  const [jakView, setJakView] = useState<"desktop" | "mobile">("desktop");

  const setH = <K extends keyof HeroConfig>(key: K, v: HeroConfig[K]) =>
    setHero((prev) => ({ ...prev, [key]: v }));
  const setT = <K extends keyof TimelineConfig>(key: K, v: TimelineConfig[K]) =>
    setTimeline((prev) => ({ ...prev, [key]: v }));
  const setHd = <K extends keyof HeadingConfig>(key: K, v: HeadingConfig[K]) =>
    setHeading((prev) => ({ ...prev, [key]: v }));
  const setSt = <K extends keyof StepsConfig>(key: K, v: StepsConfig[K]) =>
    setSteps((prev) => ({ ...prev, [key]: v }));
  const setPr = <K extends keyof PrezentConfig>(key: K, v: PrezentConfig[K]) =>
    setPrezent((prev) => ({ ...prev, [key]: v }));
  const setTr = <K extends keyof TaryfyConfig>(key: K, v: TaryfyConfig[K]) =>
    setTaryfy((prev) => ({ ...prev, [key]: v }));
  const setJakRoot = <K extends keyof JakConfig>(key: K, v: JakConfig[K]) =>
    setJak((prev) => ({ ...prev, [key]: v }));
  const setJakRow = (
    rowKey: "r1" | "r2" | "r3" | "r4",
    patch: Partial<JakRow>,
  ) => setJak((prev) => ({ ...prev, [rowKey]: { ...prev[rowKey], ...patch } }));
  const setJakImg = (
    rowKey: "r1" | "r2" | "r3" | "r4",
    imgKey: "img1" | "img2",
    patch: Partial<JakImage>,
  ) =>
    setJak((prev) => {
      const existing = prev[rowKey][imgKey];
      if (!existing) return prev;
      return {
        ...prev,
        [rowKey]: {
          ...prev[rowKey],
          [imgKey]: { ...existing, ...patch },
        },
      };
    });
  const setJakMobileRoot = <K extends keyof JakMobileConfig>(
    key: K,
    v: JakMobileConfig[K],
  ) =>
    setJak((prev) => ({
      ...prev,
      mobile: { ...prev.mobile, [key]: v },
    }));
  const setJakMobileRow = (
    rowKey: "r1" | "r2" | "r3" | "r4",
    patch: Partial<JakMobileRow>,
  ) =>
    setJak((prev) => ({
      ...prev,
      mobile: {
        ...prev.mobile,
        [rowKey]: { ...prev.mobile[rowKey], ...patch },
      },
    }));
  const setJakMobileImg = (
    rowKey: "r1" | "r2" | "r3" | "r4",
    imgKey: "img1" | "img2",
    patch: Partial<JakImage>,
  ) =>
    setJak((prev) => {
      const existing = prev.mobile[rowKey][imgKey];
      if (!existing) return prev;
      return {
        ...prev,
        mobile: {
          ...prev.mobile,
          [rowKey]: {
            ...prev.mobile[rowKey],
            [imgKey]: { ...existing, ...patch },
          },
        },
      };
    });

  const configMap = { hero, heading, steps, jak, timeline, prezent, taryfy } as const;
  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(configMap[section], null, 2));
  };

  const resetConfig = () => {
    if (section === "hero") setHero(defaultHeroConfig);
    else if (section === "heading") setHeading(defaultHeadingConfig);
    else if (section === "steps") setSteps(defaultStepsConfig);
    else if (section === "jak") setJak(defaultJakConfig);
    else if (section === "timeline") setTimeline(defaultTimelineConfig);
    else if (section === "prezent") setPrezent(defaultPrezentConfig);
    else setTaryfy(defaultTaryfyConfig);
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
            {(["hero", "heading", "steps", "jak", "timeline", "prezent", "taryfy"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  section === s
                    ? "bg-amber-500 text-zinc-900"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {{ hero: "Hero", heading: "H2", steps: "Steps", jak: "Jak", timeline: "TL", prezent: "Gift", taryfy: "Price" }[s]}
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
                    <Slider label="Drip bleed" value={hero.dripOffset} onChange={(v) => setH("dripOffset", v)} min={-4} max={20} />
                    <Slider label="Drip inset" value={hero.dripInset} onChange={(v) => setH("dripInset", v)} min={0} max={30} />
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
                    <Slider label="Bzz size" value={hero.mobileBzzSize} onChange={(v) => setH("mobileBzzSize", v)} min={8} max={28} />
                  </>
                )}
              </div>
            </>
          )}

          {/* ── Heading controls ── */}
          {section === "heading" && (
            <>
              <div className="mb-3 flex flex-wrap gap-1">
                {([
                  { id: "type" as const, label: "Type" },
                  { id: "media" as const, label: "Media" },
                  { id: "timing" as const, label: "Time" },
                  { id: "spring" as const, label: "Spring" },
                  { id: "mobile" as const, label: "Mob" },
                ]).map((t) => (
                  <button key={t.id} onClick={() => setHeadingTab(t.id)} className={tabBtnCls(headingTab === t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {headingTab === "type" && (
                  <>
                    <Slider label="Scale" value={heading.scale} onChange={(v) => setHd("scale", v)} min={1} max={10} step={0.25} unit="rem" />
                    <Slider label="Line height" value={heading.lineHeight} onChange={(v) => setHd("lineHeight", v)} min={0.7} max={2} step={0.05} unit="" />
                    <Slider label="Margin bottom" value={heading.marginBottom} onChange={(v) => setHd("marginBottom", v)} min={0} max={5} step={0.25} unit="rem" />
                  </>
                )}
                {headingTab === "media" && (
                  <>
                    <Slider label="Width" value={heading.mediaW} onChange={(v) => setHd("mediaW", v)} min={0.5} max={4} step={0.1} unit="em" />
                    <Slider label="Height" value={heading.mediaH} onChange={(v) => setHd("mediaH", v)} min={0.3} max={2} step={0.05} unit="em" />
                    <Slider label="Gap" value={heading.mediaGap} onChange={(v) => setHd("mediaGap", v)} min={0} max={0.5} step={0.01} unit="em" />
                    <Slider label="Radius" value={heading.mediaRadius} onChange={(v) => setHd("mediaRadius", v)} min={0} max={1.5} step={0.05} unit="rem" />
                    <Slider label="Word gap" value={heading.wordGap} onChange={(v) => setHd("wordGap", v)} min={0} max={0.5} step={0.01} unit="em" />
                  </>
                )}
                {headingTab === "timing" && (
                  <>
                    <Slider label="Duration" value={heading.duration} onChange={(v) => setHd("duration", v)} min={0.1} max={2} step={0.05} unit="s" />
                    <Slider label="Stagger" value={heading.stagger} onChange={(v) => setHd("stagger", v)} min={0} max={0.5} step={0.01} unit="s" />
                    <Slider label="Media delay" value={heading.mediaDelay} onChange={(v) => setHd("mediaDelay", v)} min={0} max={2} step={0.05} unit="s" />
                    <Slider label="Media dur" value={heading.mediaDuration} onChange={(v) => setHd("mediaDuration", v)} min={0.1} max={2} step={0.05} unit="s" />
                  </>
                )}
                {headingTab === "spring" && (
                  <>
                    <Slider label="Stiffness" value={heading.stiffness} onChange={(v) => setHd("stiffness", v)} min={20} max={400} step={5} unit="" />
                    <Slider label="Damping" value={heading.damping} onChange={(v) => setHd("damping", v)} min={5} max={60} step={1} unit="" />
                    <Slider label="Mass" value={heading.mass} onChange={(v) => setHd("mass", v)} min={0.1} max={5} step={0.1} unit="" />
                  </>
                )}
                {headingTab === "mobile" && (
                  <>
                    <Slider label="Scale" value={heading.mobileScale} onChange={(v) => setHd("mobileScale", v)} min={1} max={8} step={0.25} unit="rem" />
                    <Slider label="Line height" value={heading.mobileLineHeight} onChange={(v) => setHd("mobileLineHeight", v)} min={0.7} max={2} step={0.05} unit="" />
                    <Slider label="Margin bottom" value={heading.mobileMarginBottom} onChange={(v) => setHd("mobileMarginBottom", v)} min={0} max={5} step={0.25} unit="rem" />
                    <Slider label="Word gap" value={heading.mobileWordGap} onChange={(v) => setHd("mobileWordGap", v)} min={0} max={0.5} step={0.01} unit="em" />
                    <Slider label="Media W" value={heading.mobileMediaW} onChange={(v) => setHd("mobileMediaW", v)} min={0.5} max={4} step={0.1} unit="em" />
                    <Slider label="Media H" value={heading.mobileMediaH} onChange={(v) => setHd("mobileMediaH", v)} min={0.3} max={2} step={0.05} unit="em" />
                    <Slider label="Media gap" value={heading.mobileMediaGap} onChange={(v) => setHd("mobileMediaGap", v)} min={0} max={0.5} step={0.01} unit="em" />
                    <Slider label="Media radius" value={heading.mobileMediaRadius} onChange={(v) => setHd("mobileMediaRadius", v)} min={0} max={1.5} step={0.05} unit="rem" />
                  </>
                )}
              </div>
            </>
          )}

          {/* ── Steps controls ── */}
          {section === "steps" && (
            <>
              <div className="mb-3 flex flex-wrap gap-1">
                {([
                  { id: "layout" as const, label: "Layout" },
                  { id: "type" as const, label: "Type" },
                ]).map((t) => (
                  <button key={t.id} onClick={() => setStepsTab(t.id)} className={tabBtnCls(stepsTab === t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {stepsTab === "layout" && (
                  <>
                    <Slider label="Row gap" value={steps.rowGap} onChange={(v) => setSt("rowGap", v)} min={0} max={120} />
                    <Slider label="Image width" value={steps.imageWidth} onChange={(v) => setSt("imageWidth", v)} min={30} max={70} unit="%" />
                    <Slider label="Inner gap" value={steps.innerGap} onChange={(v) => setSt("innerGap", v)} min={0} max={80} />
                    <Slider label="Image radius" value={steps.imageRadius} onChange={(v) => setSt("imageRadius", v)} min={0} max={40} />
                    <Slider label="Image ratio" value={steps.imageRatio} onChange={(v) => setSt("imageRatio", v)} min={0.5} max={2} step={0.01} unit="" />
                  </>
                )}
                {stepsTab === "type" && (
                  <>
                    <Slider label="Title size" value={steps.titleSize} onChange={(v) => setSt("titleSize", v)} min={14} max={32} />
                    <Slider label="Body size" value={steps.bodySize} onChange={(v) => setSt("bodySize", v)} min={12} max={24} />
                    <Slider label="Number size" value={steps.numberSize} onChange={(v) => setSt("numberSize", v)} min={20} max={56} />
                  </>
                )}
              </div>
            </>
          )}

          {/* ── Jak to działa (image placement) controls ── */}
          {section === "jak" && (
            <>
              {/* Viewport toggle */}
              <div className="mb-2 flex gap-1">
                {(["desktop", "mobile"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setJakView(v)}
                    className={`flex-1 rounded-md py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                      jakView === v
                        ? "bg-amber-500 text-zinc-900"
                        : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="mb-3 flex flex-wrap gap-1">
                {([
                  { id: "global" as const, label: "All" },
                  { id: "r1" as const, label: "R1" },
                  { id: "r2" as const, label: "R2" },
                  { id: "r3" as const, label: "R3" },
                  { id: "r4" as const, label: "R4" },
                ]).map((t) => (
                  <button key={t.id} onClick={() => setJakTab(t.id)} className={tabBtnCls(jakTab === t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {jakTab === "global" && jakView === "desktop" && (
                  <>
                    <Slider label="Row gap" value={jak.rowGap} onChange={(v) => setJakRoot("rowGap", v)} min={0} max={200} />
                    <Slider label="Col gap" value={jak.colGap} onChange={(v) => setJakRoot("colGap", v)} min={0} max={160} />
                    <Slider label="Text col %" value={jak.textColPct} onChange={(v) => setJakRoot("textColPct", v)} min={30} max={70} unit="%" />
                    <Slider label="Image radius" value={jak.radius} onChange={(v) => setJakRoot("radius", v)} min={0} max={40} />
                    <Slider label="Title size" value={jak.titleSize} onChange={(v) => setJakRoot("titleSize", v)} min={14} max={48} />
                    <Slider label="Body size" value={jak.bodySize} onChange={(v) => setJakRoot("bodySize", v)} min={10} max={24} />
                    <Slider label="Text max-width" value={jak.textMaxW} onChange={(v) => setJakRoot("textMaxW", v)} min={200} max={700} />
                  </>
                )}
                {jakTab === "global" && jakView === "mobile" && (
                  <>
                    <Slider label="Row gap" value={jak.mobile.rowGap} onChange={(v) => setJakMobileRoot("rowGap", v)} min={0} max={120} />
                    <Slider label="Padding X" value={jak.mobile.paddingX} onChange={(v) => setJakMobileRoot("paddingX", v)} min={0} max={48} />
                    <Slider label="Title size" value={jak.mobile.titleSize} onChange={(v) => setJakMobileRoot("titleSize", v)} min={14} max={36} />
                    <Slider label="Body size" value={jak.mobile.bodySize} onChange={(v) => setJakMobileRoot("bodySize", v)} min={10} max={20} />
                    <Slider label="Text max-width" value={jak.mobile.textMaxW} onChange={(v) => setJakMobileRoot("textMaxW", v)} min={200} max={600} />
                  </>
                )}
                {(["r1", "r2", "r3", "r4"] as const).includes(jakTab as "r1") && jakView === "desktop" && (
                  <JakRowControls
                    rowKey={jakTab as "r1" | "r2" | "r3" | "r4"}
                    row={jak[jakTab as "r1" | "r2" | "r3" | "r4"]}
                    setRow={setJakRow}
                    setImg={setJakImg}
                  />
                )}
                {(["r1", "r2", "r3", "r4"] as const).includes(jakTab as "r1") && jakView === "mobile" && (
                  <>
                    <OrderToggle
                      label="Image order"
                      value={jak.mobile[jakTab as "r1" | "r2" | "r3" | "r4"].imageOrder}
                      onChange={(v) =>
                        setJakMobileRow(jakTab as "r1" | "r2" | "r3" | "r4", { imageOrder: v })
                      }
                    />
                    <JakRowControls
                      rowKey={jakTab as "r1" | "r2" | "r3" | "r4"}
                      row={jak.mobile[jakTab as "r1" | "r2" | "r3" | "r4"]}
                      setRow={setJakMobileRow}
                      setImg={setJakMobileImg}
                    />
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

          {/* ── Prezent controls ── */}
          {section === "prezent" && (
            <>
              <div className="mb-3 flex flex-wrap gap-1">
                {([
                  { id: "layout" as const, label: "Layout" },
                  { id: "type" as const, label: "Type" },
                ]).map((t) => (
                  <button key={t.id} onClick={() => setPrezentTab(t.id)} className={tabBtnCls(prezentTab === t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {prezentTab === "layout" && (
                  <>
                    <Slider label="Rotation" value={prezent.rotation} onChange={(v) => setPr("rotation", v)} min={0} max={15} step={0.5} unit="°" />
                    <Slider label="Overlap" value={prezent.overlap} onChange={(v) => setPr("overlap", v)} min={0} max={80} />
                    <Slider label="Vertical offset" value={prezent.verticalOffset} onChange={(v) => setPr("verticalOffset", v)} min={0} max={40} />
                    <Slider label="Horizontal offset" value={prezent.horizontalOffset} onChange={(v) => setPr("horizontalOffset", v)} min={-60} max={60} />
                    <Slider label="Side width" value={prezent.sideWidth} onChange={(v) => setPr("sideWidth", v)} min={200} max={400} />
                    <Slider label="Center width" value={prezent.centerWidth} onChange={(v) => setPr("centerWidth", v)} min={240} max={440} />
                  </>
                )}
                {prezentTab === "type" && (
                  <>
                    <Slider label="Card padding" value={prezent.cardPadding} onChange={(v) => setPr("cardPadding", v)} min={8} max={48} />
                    <Slider label="Card radius" value={prezent.cardRadius} onChange={(v) => setPr("cardRadius", v)} min={0} max={32} />
                    <Slider label="Title size" value={prezent.titleSize} onChange={(v) => setPr("titleSize", v)} min={12} max={28} />
                    <Slider label="Body size" value={prezent.bodySize} onChange={(v) => setPr("bodySize", v)} min={10} max={22} />
                    <Slider label="Image ratio" value={prezent.imageRatio} onChange={(v) => setPr("imageRatio", v)} min={0.5} max={2} step={0.01} unit="" />
                  </>
                )}
              </div>
            </>
          )}

          {/* ── Taryfy controls ── */}
          {section === "taryfy" && (
            <div className="flex flex-col gap-3">
              <Slider label="Card radius" value={taryfy.cardRadius} onChange={(v) => setTr("cardRadius", v)} min={0} max={60} />
              <Slider label="Pad X" value={taryfy.cardPaddingX} onChange={(v) => setTr("cardPaddingX", v)} min={8} max={60} />
              <Slider label="Pad top" value={taryfy.cardPaddingTop} onChange={(v) => setTr("cardPaddingTop", v)} min={8} max={80} />
              <Slider label="Pad bottom" value={taryfy.cardPaddingBottom} onChange={(v) => setTr("cardPaddingBottom", v)} min={8} max={80} />
              <Slider label="Drip height" value={taryfy.dripHeight} onChange={(v) => setTr("dripHeight", v)} min={10} max={140} />
              <Slider label="Title size" value={taryfy.titleSize} onChange={(v) => setTr("titleSize", v)} min={20} max={72} />
              <Slider label="Price size" value={taryfy.priceSize} onChange={(v) => setTr("priceSize", v)} min={20} max={72} />
              <Slider label="Body size" value={taryfy.bodySize} onChange={(v) => setTr("bodySize", v)} min={10} max={20} />
              <Slider label="Feature gap" value={taryfy.featureGap} onChange={(v) => setTr("featureGap", v)} min={4} max={32} />
            </div>
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
  const [heading, setHeading] = useState<HeadingConfig>(defaultHeadingConfig);
  const [steps, setSteps] = useState<StepsConfig>(defaultStepsConfig);
  const [jak, setJak] = useState<JakConfig>(defaultJakConfig);
  const [prezent, setPrezent] = useState<PrezentConfig>(defaultPrezentConfig);
  const [taryfy, setTaryfy] = useState<TaryfyConfig>(defaultTaryfyConfig);

  return (
    <Ctx.Provider value={{ hero, setHero, timeline, setTimeline, heading, setHeading, steps, setSteps, jak, setJak, prezent, setPrezent, taryfy, setTaryfy }}>
      {children}
      <SettingsPanel />
    </Ctx.Provider>
  );
}
