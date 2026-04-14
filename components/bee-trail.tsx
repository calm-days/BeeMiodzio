"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "motion/react";
import Image from "next/image";

const BEE_SIZE = 64;
const DEBUG = false;

type PathPoints = {
  x0: number; y0: number;
  cx1a: number; cy1a: number; cx1b: number; cy1b: number;
  x1: number; y1: number;
  cx2a: number; cy2a: number; cx2b: number; cy2b: number;
  x2: number; y2: number;
};

const DEFAULT_POINTS: PathPoints = {
  x0: 100, y0: 20,
  cx1a: 100, cy1a: 200, cx1b: 613, cy1b: 180,
  x1: 920, y1: 400,
  cx2a: 920, cy2a: 620, cx2b: 0, cy2b: 566,
  x2: 99, y2: 751,
};

function buildPath(pts: PathPoints, w: number, h: number): string {
  const sx = w / 1000;
  const sy = h / 800;
  const s = (x: number, y: number) => `${x * sx},${y * sy}`;
  const p = pts;
  // Mirror cx2a/cy2a through the midpoint so the tangent is always continuous
  const cx2a = 2 * p.x1 - p.cx1b;
  const cy2a = 2 * p.y1 - p.cy1b;
  return [
    `M ${s(p.x0, p.y0)}`,
    `C ${s(p.cx1a, p.cy1a)} ${s(p.cx1b, p.cy1b)} ${s(p.x1, p.y1)}`,
    `C ${s(cx2a, cy2a)} ${s(p.cx2b, p.cy2b)} ${s(p.x2, p.y2)}`,
  ].join(" ");
}

function PointSlider({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max: number;
}) {
  return (
    <label className="flex items-center gap-2 text-[11px]">
      <span className="w-10 shrink-0 font-mono">{label}</span>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full accent-amber-400"
      />
      <span className="w-8 shrink-0 text-right font-mono">{value}</span>
    </label>
  );
}

function DebugPanel({
  pts,
  onChange,
}: {
  pts: PathPoints;
  onChange: (pts: PathPoints) => void;
}) {
  const set = (key: keyof PathPoints) => (v: number) =>
    onChange({ ...pts, [key]: v });

  const groups: { title: string; fields: { key: keyof PathPoints; max: number }[] }[] = [
    {
      title: "Start",
      fields: [
        { key: "x0", max: 1000 }, { key: "y0", max: 800 },
      ],
    },
    {
      title: "Control 1a",
      fields: [
        { key: "cx1a", max: 1000 }, { key: "cy1a", max: 800 },
      ],
    },
    {
      title: "Control 1b",
      fields: [
        { key: "cx1b", max: 1000 }, { key: "cy1b", max: 800 },
      ],
    },
    {
      title: "Mid",
      fields: [
        { key: "x1", max: 1000 }, { key: "y1", max: 800 },
      ],
    },
    {
      title: "Control 2b",
      fields: [
        { key: "cx2b", max: 1000 }, { key: "cy2b", max: 800 },
      ],
    },
    {
      title: "End",
      fields: [
        { key: "x2", max: 1000 }, { key: "y2", max: 800 },
      ],
    },
  ];

  const code = `x0:${pts.x0} y0:${pts.y0} cx1a:${pts.cx1a} cy1a:${pts.cy1a} cx1b:${pts.cx1b} cy1b:${pts.cy1b} x1:${pts.x1} y1:${pts.y1} cx2a:${pts.cx2a} cy2a:${pts.cy2a} cx2b:${pts.cx2b} cy2b:${pts.cy2b} x2:${pts.x2} y2:${pts.y2}`;

  return (
    <div className="pointer-events-auto fixed right-4 top-4 z-50 flex max-h-[90vh] w-64 flex-col gap-1 overflow-y-auto rounded-xl border bg-black/90 p-4 text-white shadow-2xl">
      <p className="mb-1 text-xs font-bold">Bee Path Tuner</p>
      {groups.map((g) => (
        <div key={g.title}>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            {g.title}
          </p>
          {g.fields.map((f) => (
            <PointSlider
              key={f.key}
              label={f.key}
              value={pts[f.key]}
              onChange={set(f.key)}
              max={f.max}
            />
          ))}
        </div>
      ))}
      <button
        onClick={() => onChange({ ...DEFAULT_POINTS })}
        className="mt-2 rounded bg-white/10 px-2 py-1 text-[10px] hover:bg-white/20"
      >
        Reset
      </button>
      <button
        onClick={() => navigator.clipboard.writeText(code)}
        className="rounded bg-amber-500/20 px-2 py-1 text-[10px] text-amber-300 hover:bg-amber-500/30"
      >
        Copy values
      </button>
    </div>
  );
}

export function BeeTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);

  const [pts, setPts] = useState<PathPoints>({ ...DEFAULT_POINTS });
  const [pos, setPos] = useState({ x: 0, y: 0, angle: 0, flip: false });
  const [totalLength, setTotalLength] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 40%"],
  });

  // Ease only at the edges, linear in the middle
  const progress = useTransform(scrollYProgress, (v) => {
    const t = Math.max(0, Math.min(1, v));
    const e = 0.15; // edge zone size
    // Linear span = 1 - 2*e = 0.7
    // Quadratic edges each contribute half their zone: e/2 each
    // Total range: e/2 + (1-2e) + e/2 = 1-e
    // We need to normalize so output spans 0..1
    const total = 1 - e; // e/2 + (1-2e) + e/2
    if (t < e) {
      const n = t / e; // 0..1
      return (e * 0.5 * n * n) / total;
    }
    if (t > 1 - e) {
      const n = (1 - t) / e; // 1..0
      return 1 - (e * 0.5 * n * n) / total;
    }
    return ((e * 0.5) + (t - e)) / total;
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!pathRef.current || size.w === 0) return;
    setTotalLength(pathRef.current.getTotalLength());
  }, [size, pts]);

  const updateBee = useCallback(
    (p: number) => {
      const path = pathRef.current;
      const trail = trailRef.current;
      if (!path || !trail || totalLength === 0) return;

      const len = p * totalLength;
      const pt = path.getPointAtLength(len);

      // Use a bigger lookahead to avoid jitter, and clamp so we don't overshoot
      const lookAhead = Math.min(len + 20, totalLength);
      const behind = Math.max(len - 20, 0);
      const ptA = path.getPointAtLength(behind);
      const ptB = path.getPointAtLength(lookAhead);
      const rawAngle =
        Math.atan2(ptB.y - ptA.y, ptB.x - ptA.x) * (180 / Math.PI);

      const goingLeft = Math.abs(rawAngle) > 90;
      // Rotation disabled — bee stays upright, only flips direction
      const angle = 0;
      const flip = p > 0.5 ? true : goingLeft;

      setPos({ x: pt.x, y: pt.y, angle, flip });

      const trailGap = BEE_SIZE * 0.6;
      const revealed = Math.max(0, len - trailGap);
      trail.style.strokeDashoffset = String(totalLength - revealed);
    },
    [totalLength],
  );

  useMotionValueEvent(progress, "change", updateBee);

  useEffect(() => {
    if (totalLength > 0) updateBee(progress.get());
  }, [totalLength, updateBee, progress]);

  const pixelPath = size.w > 0 ? buildPath(pts, size.w, size.h) : "";
  const vb = `0 0 ${size.w} ${size.h}`;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      {DEBUG && <DebugPanel pts={pts} onChange={setPts} />}

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={vb}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path ref={pathRef} d={pixelPath} fill="none" stroke="none" />

        <defs>
          <mask id="trail-reveal">
            <path
              ref={trailRef}
              d={pixelPath}
              fill="none"
              stroke="white"
              strokeWidth="20"
              strokeDasharray={totalLength || 1}
              strokeDashoffset={totalLength || 1}
            />
          </mask>
        </defs>

        {/* Debug: show full path + control points */}
        {DEBUG && (
          <>
            <path
              d={pixelPath}
              fill="none"
              stroke="rgba(255,100,100,0.3)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            {/* Control point lines */}
            {(() => {
              const sx = size.w / 1000;
              const sy = size.h / 800;
              return (
                <>
                  <line x1={pts.x0 * sx} y1={pts.y0 * sy} x2={pts.cx1a * sx} y2={pts.cy1a * sy} stroke="rgba(255,200,0,0.4)" strokeWidth="1" />
                  <line x1={pts.x1 * sx} y1={pts.y1 * sy} x2={pts.cx1b * sx} y2={pts.cy1b * sy} stroke="rgba(255,200,0,0.4)" strokeWidth="1" />
                  <line x1={pts.x1 * sx} y1={pts.y1 * sy} x2={(2 * pts.x1 - pts.cx1b) * sx} y2={(2 * pts.y1 - pts.cy1b) * sy} stroke="rgba(100,200,255,0.4)" strokeWidth="1" />
                  <line x1={pts.x2 * sx} y1={pts.y2 * sy} x2={pts.cx2b * sx} y2={pts.cy2b * sy} stroke="rgba(100,200,255,0.4)" strokeWidth="1" />
                  {/* Points */}
                  {Object.entries(pts).map(([key, val], i) => {
                    const isX = key.includes("x") || key.startsWith("cx");
                    if (!isX) return null;
                    const yKey = key.replace("x", "y").replace("X", "Y") as keyof PathPoints;
                    // Map cx1a -> cy1a, x0 -> y0, etc.
                    const mappedYKey = key.replace(/x/i, (m) => m === "x" ? "y" : "Y") as keyof PathPoints;
                    if (!(mappedYKey in pts)) return null;
                    const isControl = key.startsWith("c");
                    return (
                      <circle
                        key={key}
                        cx={val * (size.w / 1000)}
                        cy={pts[mappedYKey] * (size.h / 800)}
                        r={isControl ? 4 : 6}
                        fill={isControl ? "rgba(255,200,0,0.7)" : "rgba(255,100,100,0.8)"}
                      />
                    );
                  })}
                </>
              );
            })()}
          </>
        )}

        <path
          d={pixelPath}
          fill="none"
          stroke="currentColor"
          className="text-indigo-700/40"
          strokeWidth="4"
          strokeDasharray="6 12"
          strokeLinecap="round"
          mask="url(#trail-reveal)"
        />
      </svg>

      <div
        className="absolute"
        style={{
          left: pos.x - BEE_SIZE / 2,
          top: pos.y - BEE_SIZE * 0.65,
          width: BEE_SIZE,
          height: BEE_SIZE,
          transform: `scaleX(${pos.flip ? -1 : 1}) rotate(${pos.angle}deg)`,
          willChange: "transform, left, top",
        }}
      >
        <Image
          src="/bee.png"
          alt=""
          width={BEE_SIZE}
          height={BEE_SIZE}
          className="h-full w-full object-contain"
          priority
        />
      </div>
    </div>
  );
}
