"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Copy, RotateCcw, Settings, X } from "lucide-react";

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

  // Hero wave (animated wavy bottom edge)
  waveHeight: number;        // px — wave envelope height (controls amplitude; V = waveHeight * 0.3)
  waveCenterOffsetY: number; // px — centerline Y offset from wrap bottom (negative = above bottom; trough dips ~|offset|+amplitude below this)
  waveOverflowY: number;     // px — extra height bgWrap/fgWrap extend below the section so the wave's troughs are visible (not clipped)
  waveSpeed: number;         // unitless — animation speed multiplier
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
  waveHeight: 120,
  waveCenterOffsetY: -78,
  waveOverflowY: 0,
  waveSpeed: 0.5,
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
  mediaW: 4,
  mediaH: 1.05,
  mediaGap: 0.29,
  mediaRadius: 1.05,
  wordGap: 0.17,
  marginBottom: 1.5,
  scale: 4.75,
  lineHeight: 1.1,
  stiffness: 110,
  damping: 20,
  mass: 1,
  mobileScale: 3.75,
  mobileLineHeight: 0.9,
  mobileMarginBottom: 2,
  mobileWordGap: 0.17,
  mobileMediaW: 2.5,
  mobileMediaH: 0.85,
  mobileMediaGap: 0.26,
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
  imageRatio: number;        // width/height (legacy — kept for backwards compat)
  imageWidth: number;        // px — displayed image width (0 = auto, fills card)
  imageHeight: number;       // px — displayed image height (0 = auto, preserves aspect)
}

export const defaultPrezentConfig: PrezentConfig = {
  rotation: 0,
  overlap: 66,
  verticalOffset: 20,
  horizontalOffset: 44,
  sideWidth: 460,
  centerWidth: 520,
  cardPadding: 22,
  cardRadius: 16,
  titleSize: 19,
  bodySize: 15,
  imageRatio: 2,
  imageWidth: 0,
  imageHeight: 0,
};

/* ────────────────────────────────────────────── */
/*  Taryfy Config (Plan badges)                    */
/* ────────────────────────────────────────────── */

export interface TaryfyConfig {
  cardRadius: number;        // px — corner radius of card
  cardPaddingX: number;      // px — horizontal padding inside card
  cardPaddingTop: number;    // px — top padding inside card
  cardPaddingBottom: number; // px — bottom padding inside card
  cardMinHeight: number;     // px — minimum card height (for staircase visual)
  titleSize: number;         // px — plan name font size
  subtitleSize: number;      // px — "Do X kg miodu rocznie" font size
  priceSize: number;         // px — price font size
  bodySize: number;          // px — body/feature text font size
  featureGap: number;        // px — gap between feature items
  hiveSize: number;          // px — hive illustration width/height
  footerPaddingTop: number;  // px — space above button/hive footer
}

export const defaultTaryfyConfig: TaryfyConfig = {
  cardRadius: 28,
  cardPaddingX: 28,
  cardPaddingTop: 32,
  cardPaddingBottom: 28,
  cardMinHeight: 540,
  titleSize: 54,
  subtitleSize: 13,
  priceSize: 38,
  bodySize: 13,
  featureGap: 12,
  hiveSize: 130,
  footerPaddingTop: 32,
};

/* ────────────────────────────────────────────── */
/*  Dlaczego Config (Why-honey CTA section)        */
/* ────────────────────────────────────────────── */

export interface DlaczegoDrawing {
  offset: number;  // % from its anchored side
  top: number;     // % from top
  width: number;   // px
}

export interface DlaczegoCurve {
  offset: number;  // % from its anchored side (negative bleeds outside)
  top: number;     // % from top (50 = vertically centered)
  width: number;   // % of section width
}

export interface DlaczegoConfig {
  paddingY: number;        // px desktop vertical padding
  paddingYMobile: number;  // px mobile vertical padding

  lightbulb: DlaczegoDrawing;       // anchored left
  flower: DlaczegoDrawing;          // anchored right
  lineL: DlaczegoCurve;             // anchored left
  lineR: DlaczegoCurve;             // anchored right

  lightbulbMobile: DlaczegoDrawing;
  flowerMobile: DlaczegoDrawing;
  lineLMobile: DlaczegoCurve;
  lineRMobile: DlaczegoCurve;
}

export const defaultDlaczegoConfig: DlaczegoConfig = {
  paddingY: 112,
  paddingYMobile: 56,

  lightbulb: { offset: 24, top: 4, width: 106 },
  flower: { offset: 25, top: 53, width: 121 },
  lineL: { offset: 0, top: 50, width: 29 },
  lineR: { offset: 0, top: 50, width: 31 },

  lightbulbMobile: { offset: 4, top: 0, width: 58 },
  flowerMobile: { offset: 4, top: 6, width: 60 },
  lineLMobile: { offset: -10, top: 60, width: 55 },
  lineRMobile: { offset: -10, top: 60, width: 60 },
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
  dlaczego: DlaczegoConfig;
  setDlaczego: Dispatch<SetStateAction<DlaczegoConfig>>;
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

export function useDlaczegoConfig() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Wrap with SectionConfigProvider");
  return [ctx.dlaczego, ctx.setDlaczego] as const;
}

/* ────────────────────────────────────────────── */
/*  Slider                                         */
/* ────────────────────────────────────────────── */

function Slider({
  label,
  value,
  onChange,
  defaultValue,
  min,
  max,
  step = 1,
  unit = "px",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  defaultValue?: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? formatNum(value, step);
  const showRevert = defaultValue !== undefined && !nearlyEqual(value, defaultValue, step);

  const commit = (raw: string) => {
    const n = Number(raw);
    if (Number.isFinite(n)) {
      const clamped = Math.max(min, Math.min(max, n));
      const snapped = step ? Math.round(clamped / step) * step : clamped;
      onChange(Number(snapped.toFixed(stepDecimals(step))));
    }
    setDraft(null);
  };

  return (
    <div className="group/row flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[11px] font-medium text-zinc-300">{label}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => defaultValue !== undefined && onChange(defaultValue)}
            className={`rounded p-0.5 transition-opacity ${
              showRevert
                ? "text-zinc-500 opacity-0 group-hover/row:opacity-100 hover:bg-zinc-800 hover:text-zinc-200"
                : "pointer-events-none opacity-0"
            }`}
            title={defaultValue !== undefined ? `Reset to ${formatNum(defaultValue, step)}${unit ?? ""}` : ""}
            aria-label="Reset to default"
            tabIndex={showRevert ? 0 : -1}
          >
            <RotateCcw className="size-3" />
          </button>
          <input
            type="text"
            inputMode="decimal"
            value={display}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              else if (e.key === "Escape") {
                setDraft(null);
                (e.target as HTMLInputElement).blur();
              }
            }}
            className="w-12 rounded bg-zinc-800/70 px-1.5 py-0.5 text-right font-mono text-[11px] tabular-nums text-zinc-200 outline-none ring-1 ring-transparent transition-colors hover:bg-zinc-800 focus:bg-zinc-800 focus:ring-amber-500/40"
          />
          {unit !== "" && (
            <span className="w-6 text-right font-mono text-[10px] uppercase text-zinc-500">{unit}</span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-amber-500"
      />
    </div>
  );
}

function stepDecimals(step: number) {
  if (!Number.isFinite(step) || step >= 1) return 0;
  const s = String(step);
  const i = s.indexOf(".");
  return i === -1 ? 0 : s.length - i - 1;
}

function formatNum(n: number, step: number) {
  return n.toFixed(stepDecimals(step));
}

function nearlyEqual(a: number, b: number, step: number) {
  const eps = step ? step / 2 : 1e-9;
  return Math.abs(a - b) < eps;
}

/* ────────────────────────────────────────────── */
/*  Settings Panel                                 */
/* ────────────────────────────────────────────── */

type Section = "hero" | "heading" | "steps" | "jak" | "timeline" | "prezent" | "taryfy" | "dlaczego";
type DlaczegoTab = "desktop" | "mobile";
type HeroTab = "heading" | "buttons" | "bzz" | "section" | "wave" | "mobile";
type TimelineTab = "text" | "cards" | "type";
type HeadingTab = "type" | "media" | "timing" | "spring" | "mobile";
type StepsTab = "layout" | "type";
type PrezentTab = "layout" | "type";
type JakTab = "global" | "r1" | "r2" | "r3" | "r4";

function SegmentedControl<T extends string | number>({
  value,
  options,
  onChange,
  className = "",
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={`inline-flex rounded-md bg-zinc-800/60 p-0.5 ring-1 ring-inset ring-zinc-800 ${className}`}>
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
            value === opt.value
              ? "bg-zinc-700/90 text-zinc-50 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] font-medium text-zinc-300">{label}</span>
      {children}
    </div>
  );
}

function AlignToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: JakAlign;
  onChange: (v: JakAlign) => void;
}) {
  return (
    <FieldRow label={label}>
      <SegmentedControl
        value={value}
        onChange={onChange}
        options={[
          { value: "start", label: "Start" },
          { value: "center", label: "Center" },
          { value: "end", label: "End" },
        ]}
      />
    </FieldRow>
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
  return (
    <FieldRow label={label}>
      <SegmentedControl
        value={value}
        onChange={onChange}
        options={[
          { value: "before", label: "Before" },
          { value: "after", label: "After" },
        ]}
      />
    </FieldRow>
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
    <FieldRow label={label}>
      <SegmentedControl
        value={value ? "on" : "off"}
        onChange={(v) => onChange(v === "on")}
        options={[
          { value: "on", label: onLabel },
          { value: "off", label: offLabel },
        ]}
      />
    </FieldRow>
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
    <div className="flex flex-col gap-2 rounded-md border border-zinc-800/70 bg-zinc-900/40 p-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-300/90">
        {label}
      </p>
      <Slider label="Width" value={img.w} onChange={(v) => onChange({ w: v })} min={20} max={100} unit="%" />
      <Slider label="Aspect" value={img.ratio} onChange={(v) => onChange({ ratio: v })} min={0.4} max={2.5} step={0.01} unit="" />
      <Slider label="Margin top" value={img.mt} onChange={(v) => onChange({ mt: v })} min={-120} max={80} />
      <Slider label="Z-index" value={img.z} onChange={(v) => onChange({ z: v })} min={0} max={10} unit="" />
      <AlignToggle label="Align" value={img.align} onChange={(v) => onChange({ align: v })} />
      <BoolToggle
        label="Circle"
        value={img.round}
        onLabel="Yes"
        offLabel="No"
        onChange={(v) => onChange({ round: v })}
      />
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

function bindSlider<T extends object>(
  current: T,
  defaults: T,
  setKey: <K extends keyof T>(key: K, v: T[K]) => void,
) {
  return function S<K extends keyof T & string>(
    k: K,
    label: string,
    min: number,
    max: number,
    step: number = 1,
    unit: string = "px",
  ) {
    return (
      <Slider
        key={k}
        label={label}
        value={current[k] as number}
        defaultValue={defaults[k] as number}
        onChange={(v) => setKey(k, v as T[K])}
        min={min}
        max={max}
        step={step}
        unit={unit}
      />
    );
  };
}

function IconBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex size-6 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
    >
      {children}
    </button>
  );
}

function SubTabs<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-0.5">
      {options.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
            value === t.id
              ? "bg-zinc-800 text-zinc-50"
              : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

const SECTIONS: { id: Section; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "heading", label: "Heading" },
  { id: "steps", label: "Steps" },
  { id: "jak", label: "Jak" },
  { id: "timeline", label: "Timeline" },
  { id: "prezent", label: "Prezent" },
  { id: "taryfy", label: "Taryfy" },
  { id: "dlaczego", label: "Dlaczego" },
];

const SECTION_LABEL: Record<Section, string> = {
  hero: "Hero",
  heading: "Heading",
  steps: "Steps",
  jak: "Jak to działa",
  timeline: "Timeline",
  prezent: "Prezent",
  taryfy: "Taryfy",
  dlaczego: "Dlaczego miód jest zdrowy",
};

function DlaczegoDrawingBlock({
  label,
  value,
  defaults,
  onChange,
}: {
  label: string;
  value: DlaczegoDrawing;
  defaults: DlaczegoDrawing;
  onChange: (field: keyof DlaczegoDrawing, v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-zinc-800/70 bg-zinc-900/40 p-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-300/90">
        {label}
      </p>
      <Slider
        label="Offset (from side)"
        value={value.offset}
        defaultValue={defaults.offset}
        onChange={(v) => onChange("offset", v)}
        min={-30}
        max={50}
        unit="%"
      />
      <Slider
        label="Top"
        value={value.top}
        defaultValue={defaults.top}
        onChange={(v) => onChange("top", v)}
        min={-10}
        max={90}
        unit="%"
      />
      <Slider
        label="Width"
        value={value.width}
        defaultValue={defaults.width}
        onChange={(v) => onChange("width", v)}
        min={20}
        max={300}
      />
    </div>
  );
}

function DlaczegoCurveBlock({
  label,
  value,
  defaults,
  onChange,
}: {
  label: string;
  value: DlaczegoCurve;
  defaults: DlaczegoCurve;
  onChange: (field: keyof DlaczegoCurve, v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-zinc-800/70 bg-zinc-900/40 p-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-300/90">
        {label}
      </p>
      <Slider
        label="Offset (from side)"
        value={value.offset}
        defaultValue={defaults.offset}
        onChange={(v) => onChange("offset", v)}
        min={-40}
        max={40}
        unit="%"
      />
      <Slider
        label="Top (50 = center)"
        value={value.top}
        defaultValue={defaults.top}
        onChange={(v) => onChange("top", v)}
        min={0}
        max={100}
        unit="%"
      />
      <Slider
        label="Width"
        value={value.width}
        defaultValue={defaults.width}
        onChange={(v) => onChange("width", v)}
        min={5}
        max={100}
        unit="%"
      />
    </div>
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
  const [dlaczego, setDlaczego] = useDlaczegoConfig();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>("hero");
  const [heroTab, setHeroTab] = useState<HeroTab>("heading");
  const [timelineTab, setTimelineTab] = useState<TimelineTab>("text");
  const [headingTab, setHeadingTab] = useState<HeadingTab>("type");
  const [stepsTab, setStepsTab] = useState<StepsTab>("layout");
  const [prezentTab, setPrezentTab] = useState<PrezentTab>("layout");
  const [jakTab, setJakTab] = useState<JakTab>("global");
  const [jakView, setJakView] = useState<"desktop" | "mobile">("desktop");
  const [dlaczegoTab, setDlaczegoTab] = useState<DlaczegoTab>("desktop");

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
  const setDl = <K extends keyof DlaczegoConfig>(key: K, v: DlaczegoConfig[K]) =>
    setDlaczego((prev) => ({ ...prev, [key]: v }));
  const setDlPart = <
    K extends keyof DlaczegoConfig,
    P extends keyof DlaczegoConfig[K] & string,
  >(
    key: K,
    field: P,
    v: number,
  ) =>
    setDlaczego((prev) => ({
      ...prev,
      [key]: { ...(prev[key] as object), [field]: v },
    }));
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

  const slH = bindSlider(hero, defaultHeroConfig, setH);
  const slHd = bindSlider(heading, defaultHeadingConfig, setHd);
  const slSt = bindSlider(steps, defaultStepsConfig, setSt);
  const slT = bindSlider(timeline, defaultTimelineConfig, setT);
  const slPr = bindSlider(prezent, defaultPrezentConfig, setPr);
  const slTr = bindSlider(taryfy, defaultTaryfyConfig, setTr);
  const slDl = bindSlider(dlaczego, defaultDlaczegoConfig, setDl);
  const jakFlat = jak as unknown as Record<string, number>;
  const jakDefaults = defaultJakConfig as unknown as Record<string, number>;
  const slJ = bindSlider(jakFlat, jakDefaults, setJakRoot as unknown as <K extends string>(k: K, v: number) => void);
  const slJM = bindSlider(
    jak.mobile as unknown as Record<string, number>,
    defaultJakConfig.mobile as unknown as Record<string, number>,
    setJakMobileRoot as unknown as <K extends string>(k: K, v: number) => void,
  );

  const configMap = { hero, heading, steps, jak, timeline, prezent, taryfy, dlaczego } as const;
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
    else if (section === "taryfy") setTaryfy(defaultTaryfyConfig);
    else setDlaczego(defaultDlaczegoConfig);
  };

  const heroTabs: { id: HeroTab; label: string }[] = [
    { id: "heading", label: "Heading" },
    { id: "buttons", label: "Buttons" },
    { id: "bzz", label: "Bzz" },
    { id: "section", label: "Section" },
    { id: "wave", label: "Wave" },
    { id: "mobile", label: "Mobile" },
  ];
  const headingTabs: { id: HeadingTab; label: string }[] = [
    { id: "type", label: "Type" },
    { id: "media", label: "Media" },
    { id: "timing", label: "Timing" },
    { id: "spring", label: "Spring" },
    { id: "mobile", label: "Mobile" },
  ];
  const stepsTabs: { id: StepsTab; label: string }[] = [
    { id: "layout", label: "Layout" },
    { id: "type", label: "Typography" },
  ];
  const timelineTabs: { id: TimelineTab; label: string }[] = [
    { id: "text", label: "Text" },
    { id: "cards", label: "Cards" },
    { id: "type", label: "Typography" },
  ];
  const prezentTabs: { id: PrezentTab; label: string }[] = [
    { id: "layout", label: "Layout" },
    { id: "type", label: "Typography" },
  ];
  const jakTabs: { id: JakTab; label: string }[] = [
    { id: "global", label: "Global" },
    { id: "r1", label: "Row 1" },
    { id: "r2", label: "Row 2" },
    { id: "r3", label: "Row 3" },
    { id: "r4", label: "Row 4" },
  ];

  return (
    <div className="fixed right-4 top-20 z-50">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/95 text-zinc-300 shadow-lg backdrop-blur-md transition-colors hover:bg-zinc-900 hover:text-zinc-100"
          title="Open inspector"
          aria-label="Open inspector"
        >
          <Settings className="size-4" />
        </button>
      ) : (
        <div className="flex h-[calc(100vh-120px)] w-[420px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur-md">
          {/* Sidebar */}
          <aside className="flex w-[110px] shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-900/30">
            <div className="flex h-9 items-center border-b border-zinc-800/80 px-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Inspector
              </p>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-1.5">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSection(s.id)}
                  className={`flex items-center rounded-md px-2.5 py-1.5 text-left text-xs transition-colors ${
                    section === s.id
                      ? "bg-amber-500/10 text-amber-300"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content pane */}
          <section className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <header className="flex h-9 items-center justify-between border-b border-zinc-800/80 px-2.5">
              <h3 className="truncate text-xs font-semibold text-zinc-100">
                {SECTION_LABEL[section]}
              </h3>
              <div className="flex items-center gap-0.5">
                <IconBtn onClick={resetConfig} title="Reset section to defaults">
                  <RotateCcw className="size-3.5" />
                </IconBtn>
                <IconBtn onClick={copyConfig} title="Copy section JSON">
                  <Copy className="size-3.5" />
                </IconBtn>
                <IconBtn onClick={() => setOpen(false)} title="Close inspector">
                  <X className="size-3.5" />
                </IconBtn>
              </div>
            </header>

            {/* Sub-navigation */}
            {section === "dlaczego" && (
              <div className="flex flex-col gap-1.5 border-b border-zinc-800/80 px-2.5 py-2">
                <SegmentedControl
                  value={dlaczegoTab}
                  onChange={setDlaczegoTab}
                  options={[
                    { value: "desktop", label: "Desktop" },
                    { value: "mobile", label: "Mobile" },
                  ]}
                  className="self-start"
                />
              </div>
            )}
            {section !== "taryfy" && section !== "dlaczego" && (
              <div className="flex flex-col gap-1.5 border-b border-zinc-800/80 px-2.5 py-2">
                {section === "jak" && (
                  <SegmentedControl
                    value={jakView}
                    onChange={setJakView}
                    options={[
                      { value: "desktop", label: "Desktop" },
                      { value: "mobile", label: "Mobile" },
                    ]}
                    className="self-start"
                  />
                )}
                {section === "hero" && <SubTabs value={heroTab} options={heroTabs} onChange={setHeroTab} />}
                {section === "heading" && <SubTabs value={headingTab} options={headingTabs} onChange={setHeadingTab} />}
                {section === "steps" && <SubTabs value={stepsTab} options={stepsTabs} onChange={setStepsTab} />}
                {section === "timeline" && <SubTabs value={timelineTab} options={timelineTabs} onChange={setTimelineTab} />}
                {section === "prezent" && <SubTabs value={prezentTab} options={prezentTabs} onChange={setPrezentTab} />}
                {section === "jak" && <SubTabs value={jakTab} options={jakTabs} onChange={setJakTab} />}
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
              {section === "hero" && heroTab === "heading" && (
                <>
                  {slH("headingSize", "Font size", 36, 200)}
                  {slH("headingWidth", "Width", 20, 100, 1, "%")}
                  {slH("headingOffsetY", "Y from ground", -60, 60, 1, "%")}
                  {slH("subheadingSize", "Subheading size", 8, 36)}
                  {slH("headingLineHeight", "Line height", 0.5, 2, 0.05, "")}
                </>
              )}
              {section === "hero" && heroTab === "buttons" && (
                <>
                  {slH("buttonX", "X (stage)", 0, 100, 1, "%")}
                  {slH("buttonOffsetY", "Y from ground", -60, 60, 1, "%")}
                  {slH("buttonGap", "Gap", 0, 80)}
                  {slH("buttonFontSize", "Font size", 8, 48)}
                  {slH("buttonPaddingX", "Padding X", 0, 80)}
                  {slH("buttonPaddingY", "Padding Y", 0, 48)}
                  {slH("buttonRadius", "Border radius", 0, 60)}
                  {slH("dripOffset", "Drip bleed", -4, 20)}
                  {slH("dripInset", "Drip inset", 0, 30)}
                </>
              )}
              {section === "hero" && heroTab === "bzz" && (
                <>
                  {slH("bzzRight", "From right (stage)", -20, 50, 1, "%")}
                  {slH("bzzOffsetY", "Y from ground", -60, 60, 1, "%")}
                  {slH("bzzSize", "Font size", 10, 36)}
                </>
              )}
              {section === "hero" && heroTab === "section" && (
                <>
                  {slH("groundY", "Ground Y (opaque top)", 0, 100, 1, "%")}
                  {slH("sectionMinHeight", "Min height (desktop)", 0, 200, 1, "vh")}
                </>
              )}
              {section === "hero" && heroTab === "wave" && (
                <>
                  {slH("waveHeight", "Amplitude (height)", 0, 400)}
                  {slH("waveCenterOffsetY", "Centerline Y offset", -200, 200)}
                  {slH("waveOverflowY", "Overflow below section", 0, 300)}
                  {slH("waveSpeed", "Speed", 0, 4, 0.05, "")}
                </>
              )}
              {section === "hero" && heroTab === "mobile" && (
                <>
                  {slH("mobileMinHeight", "Min height", 60, 200, 1, "dvh")}
                  {slH("mobileLogoHeight", "Logo height", 40, 140)}
                  {slH("mobileHeadingSize", "Heading size", 20, 72)}
                  {slH("mobileHeadingLineHeight", "Heading line height", 0.7, 1.5, 0.05, "")}
                  {slH("mobileSubheadingSize", "Subheading size", 8, 20)}
                  {slH("mobilePaddingTop", "Padding top", 40, 200)}
                  {slH("mobilePaddingBottom", "Padding bottom", 16, 120)}
                  {slH("mobilePaddingX", "Padding X", 0, 40)}
                  {slH("mobileButtonFontSize", "Button font", 10, 24)}
                  {slH("mobileButtonPaddingX", "Button padding X", 8, 40)}
                  {slH("mobileButtonPaddingY", "Button padding Y", 4, 24)}
                  {slH("mobileButtonRadius", "Button radius", 0, 30)}
                  {slH("mobileButtonGap", "Button gap", 0, 32)}
                  {slH("mobileBzzSize", "Bzz size", 8, 28)}
                </>
              )}

              {section === "heading" && headingTab === "type" && (
                <>
                  {slHd("scale", "Scale", 1, 10, 0.25, "rem")}
                  {slHd("lineHeight", "Line height", 0.7, 2, 0.05, "")}
                  {slHd("marginBottom", "Margin bottom", 0, 5, 0.25, "rem")}
                </>
              )}
              {section === "heading" && headingTab === "media" && (
                <>
                  {slHd("mediaW", "Width", 0.5, 4, 0.1, "em")}
                  {slHd("mediaH", "Height", 0.3, 2, 0.05, "em")}
                  {slHd("mediaGap", "Gap", 0, 0.5, 0.01, "em")}
                  {slHd("mediaRadius", "Radius", 0, 1.5, 0.05, "rem")}
                  {slHd("wordGap", "Word gap", 0, 0.5, 0.01, "em")}
                </>
              )}
              {section === "heading" && headingTab === "timing" && (
                <>
                  {slHd("duration", "Duration", 0.1, 2, 0.05, "s")}
                  {slHd("stagger", "Stagger", 0, 0.5, 0.01, "s")}
                  {slHd("mediaDelay", "Media delay", 0, 2, 0.05, "s")}
                  {slHd("mediaDuration", "Media duration", 0.1, 2, 0.05, "s")}
                </>
              )}
              {section === "heading" && headingTab === "spring" && (
                <>
                  {slHd("stiffness", "Stiffness", 20, 400, 5, "")}
                  {slHd("damping", "Damping", 5, 60, 1, "")}
                  {slHd("mass", "Mass", 0.1, 5, 0.1, "")}
                </>
              )}
              {section === "heading" && headingTab === "mobile" && (
                <>
                  {slHd("mobileScale", "Scale", 1, 8, 0.25, "rem")}
                  {slHd("mobileLineHeight", "Line height", 0.7, 2, 0.05, "")}
                  {slHd("mobileMarginBottom", "Margin bottom", 0, 5, 0.25, "rem")}
                  {slHd("mobileWordGap", "Word gap", 0, 0.5, 0.01, "em")}
                  {slHd("mobileMediaW", "Media width", 0.5, 4, 0.1, "em")}
                  {slHd("mobileMediaH", "Media height", 0.3, 2, 0.05, "em")}
                  {slHd("mobileMediaGap", "Media gap", 0, 0.5, 0.01, "em")}
                  {slHd("mobileMediaRadius", "Media radius", 0, 1.5, 0.05, "rem")}
                </>
              )}

              {section === "steps" && stepsTab === "layout" && (
                <>
                  {slSt("rowGap", "Row gap", 0, 120)}
                  {slSt("imageWidth", "Image width", 30, 70, 1, "%")}
                  {slSt("innerGap", "Inner gap", 0, 80)}
                  {slSt("imageRadius", "Image radius", 0, 40)}
                  {slSt("imageRatio", "Image ratio", 0.5, 2, 0.01, "")}
                </>
              )}
              {section === "steps" && stepsTab === "type" && (
                <>
                  {slSt("titleSize", "Title size", 14, 32)}
                  {slSt("bodySize", "Body size", 12, 24)}
                  {slSt("numberSize", "Number size", 20, 56)}
                </>
              )}

              {section === "jak" && jakTab === "global" && jakView === "desktop" && (
                <>
                  {slJ("rowGap", "Row gap", 0, 200)}
                  {slJ("colGap", "Column gap", 0, 160)}
                  {slJ("textColPct", "Text column", 30, 70, 1, "%")}
                  {slJ("radius", "Image radius", 0, 40)}
                  {slJ("titleSize", "Title size", 14, 48)}
                  {slJ("bodySize", "Body size", 10, 24)}
                  {slJ("textMaxW", "Text max-width", 200, 700)}
                </>
              )}
              {section === "jak" && jakTab === "global" && jakView === "mobile" && (
                <>
                  {slJM("rowGap", "Row gap", 0, 120)}
                  {slJM("paddingX", "Padding X", 0, 48)}
                  {slJM("titleSize", "Title size", 14, 36)}
                  {slJM("bodySize", "Body size", 10, 20)}
                  {slJM("textMaxW", "Text max-width", 200, 600)}
                </>
              )}
              {section === "jak" && (["r1", "r2", "r3", "r4"] as const).includes(jakTab as "r1") && jakView === "desktop" && (
                <JakRowControls
                  rowKey={jakTab as "r1" | "r2" | "r3" | "r4"}
                  row={jak[jakTab as "r1" | "r2" | "r3" | "r4"]}
                  setRow={setJakRow}
                  setImg={setJakImg}
                />
              )}
              {section === "jak" && (["r1", "r2", "r3", "r4"] as const).includes(jakTab as "r1") && jakView === "mobile" && (
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

              {section === "timeline" && timelineTab === "text" && (
                <>
                  {slT("textSize", "Font size", 6, 28, 1, "vw")}
                  {slT("textLeading", "Line height", 0.5, 1.5, 0.05, "")}
                  {slT("labelSize", "Label size", 8, 24)}
                </>
              )}
              {section === "timeline" && timelineTab === "cards" && (
                <>
                  {slT("cardWidth", "Card width", 240, 560)}
                  {slT("cardGap", "Card gap", 8, 80)}
                  {slT("cardPadding", "Card padding", 8, 48)}
                  {slT("rotationMax", "Max rotation", 0, 10, 0.5, "°")}
                </>
              )}
              {section === "timeline" && timelineTab === "type" && (
                <>
                  {slT("cardTitleSize", "Title size", 10, 28)}
                  {slT("cardTitleWeight", "Title weight", 400, 900, 100, "")}
                  {slT("cardBodySize", "Body size", 10, 22)}
                </>
              )}

              {section === "prezent" && prezentTab === "layout" && (
                <>
                  {slPr("rotation", "Rotation", 0, 15, 0.5, "°")}
                  {slPr("overlap", "Overlap", 0, 160)}
                  {slPr("verticalOffset", "Vertical offset", 0, 80)}
                  {slPr("horizontalOffset", "Horizontal offset", -120, 120)}
                  {slPr("sideWidth", "Side width", 200, 640)}
                  {slPr("centerWidth", "Center width", 240, 700)}
                </>
              )}
              {section === "prezent" && prezentTab === "type" && (
                <>
                  {slPr("cardPadding", "Card padding", 8, 48)}
                  {slPr("cardRadius", "Card radius", 0, 32)}
                  {slPr("titleSize", "Title size", 12, 28)}
                  {slPr("bodySize", "Body size", 10, 22)}
                  {slPr("imageWidth", "Image width (0=auto)", 0, 500)}
                  {slPr("imageHeight", "Image height (0=auto)", 0, 500)}
                </>
              )}

              {section === "dlaczego" && dlaczegoTab === "desktop" && (
                <>
                  {slDl("paddingY", "Padding Y", 0, 200)}
                  <DlaczegoDrawingBlock
                    label="Lightbulb"
                    value={dlaczego.lightbulb}
                    defaults={defaultDlaczegoConfig.lightbulb}
                    onChange={(field, v) => setDlPart("lightbulb", field, v)}
                  />
                  <DlaczegoDrawingBlock
                    label="Flower"
                    value={dlaczego.flower}
                    defaults={defaultDlaczegoConfig.flower}
                    onChange={(field, v) => setDlPart("flower", field, v)}
                  />
                  <DlaczegoCurveBlock
                    label="Line — Left"
                    value={dlaczego.lineL}
                    defaults={defaultDlaczegoConfig.lineL}
                    onChange={(field, v) => setDlPart("lineL", field, v)}
                  />
                  <DlaczegoCurveBlock
                    label="Line — Right"
                    value={dlaczego.lineR}
                    defaults={defaultDlaczegoConfig.lineR}
                    onChange={(field, v) => setDlPart("lineR", field, v)}
                  />
                </>
              )}
              {section === "dlaczego" && dlaczegoTab === "mobile" && (
                <>
                  {slDl("paddingYMobile", "Padding Y", 0, 160)}
                  <DlaczegoDrawingBlock
                    label="Lightbulb"
                    value={dlaczego.lightbulbMobile}
                    defaults={defaultDlaczegoConfig.lightbulbMobile}
                    onChange={(field, v) => setDlPart("lightbulbMobile", field, v)}
                  />
                  <DlaczegoDrawingBlock
                    label="Flower"
                    value={dlaczego.flowerMobile}
                    defaults={defaultDlaczegoConfig.flowerMobile}
                    onChange={(field, v) => setDlPart("flowerMobile", field, v)}
                  />
                  <DlaczegoCurveBlock
                    label="Line — Left"
                    value={dlaczego.lineLMobile}
                    defaults={defaultDlaczegoConfig.lineLMobile}
                    onChange={(field, v) => setDlPart("lineLMobile", field, v)}
                  />
                  <DlaczegoCurveBlock
                    label="Line — Right"
                    value={dlaczego.lineRMobile}
                    defaults={defaultDlaczegoConfig.lineRMobile}
                    onChange={(field, v) => setDlPart("lineRMobile", field, v)}
                  />
                </>
              )}

              {section === "taryfy" && (
                <>
                  {slTr("cardRadius", "Card radius", 0, 60)}
                  {slTr("cardPaddingX", "Padding X", 8, 60)}
                  {slTr("cardPaddingTop", "Padding top", 8, 80)}
                  {slTr("cardPaddingBottom", "Padding bottom", 8, 80)}
                  {slTr("cardMinHeight", "Card min height", 400, 800)}
                  {slTr("titleSize", "Title size", 20, 72)}
                  {slTr("subtitleSize", "Subtitle size", 10, 24)}
                  {slTr("priceSize", "Price size", 20, 72)}
                  {slTr("bodySize", "Body size", 10, 20)}
                  {slTr("featureGap", "Feature gap", 4, 32)}
                  {slTr("hiveSize", "Hive size", 60, 200)}
                  {slTr("footerPaddingTop", "Footer top padding", 0, 80)}
                </>
              )}
            </div>
          </section>
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
  const [dlaczego, setDlaczego] = useState<DlaczegoConfig>(defaultDlaczegoConfig);

  return (
    <Ctx.Provider value={{ hero, setHero, timeline, setTimeline, heading, setHeading, steps, setSteps, jak, setJak, prezent, setPrezent, taryfy, setTaryfy, dlaczego, setDlaczego }}>
      {children}
      <SettingsPanel />
    </Ctx.Provider>
  );
}
