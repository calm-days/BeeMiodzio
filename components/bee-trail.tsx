"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "motion/react";
import Image from "next/image";

import { easeBeeProgress, pointAt, type SampledPath } from "@/lib/bee-path";
import { createBeeTrailRenderer } from "@/lib/bee-trail-renderer";
import { createBeeScrollAnimation } from "@/lib/bee-scroll-animation";
import { useIsMobile } from "@/hooks/use-mobile";

const BEE_SIZE = 64;
const DEBUG = false;

type Waypoint = { x: number; y: number };

// Coordinate space: x 0–1000 = screen width, y 0–800 = container height

// Exact original hand-tuned desktop Bezier — not editable, not approximated
function buildDesktopPath(w: number, h: number): string {
  const sx = w / 1000, sy = h / 800;
  const s = (x: number, y: number) => `${x * sx},${y * sy}`;
  return [
    `M ${s(888, 0)}`,
    `C ${s(0, 146)} ${s(0, 220)} ${s(629, 391)}`,
    `C ${s(1258, 562)} ${s(919, 453)} ${s(322, 800)}`,
  ].join(" ");
}

const MOBILE_WAYPOINTS: Waypoint[] = [
  { x: 927, y: -9 },
  { x: 644, y: 82 },
  { x: -81, y: 102 },
  { x: -150, y: 200 },
  { x: 305, y: 337 },
  { x: 1009, y: 376 },
  { x: 1150, y: 509 },
  { x: -150, y: 588 },
  { x: 311, y: 740 },
  { x: 943, y: 773 },
];

function segmentDist(p: Waypoint, a: Waypoint, b: Waypoint): number {
  const dx = b.x - a.x, dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

// Converts waypoints to an SVG path string via Catmull-Rom → cubic Bezier.
// Phantom duplicate at each end clamps tangents to zero at start/finish.
function catmullRomToSvg(pts: Waypoint[], w: number, h: number): string {
  if (pts.length < 2) return "";
  const sx = w / 1000;
  const sy = h / 800;
  const s = (x: number, y: number) => `${x * sx},${y * sy}`;
  const p = [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M ${s(p[1].x, p[1].y)}`;
  for (let i = 1; i < p.length - 2; i++) {
    const p0 = p[i - 1], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${s(cp1x, cp1y)} ${s(cp2x, cp2y)} ${s(p2.x, p2.y)}`;
  }
  return d;
}

export function BeeTrail() {
  const beeRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const trailHostRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<{
    path: SampledPath;
    trail: ReturnType<typeof createBeeTrailRenderer>;
    animations: Animation[];
  } | null>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const isMobile = useIsMobile();
  const [mobileWaypoints, setMobileWaypoints] = useState<Waypoint[]>([...MOBILE_WAYPOINTS]);
  const waypoints = mobileWaypoints;
  const setWaypoints = setMobileWaypoints;

  const [size, setSize] = useState({ w: 0, h: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: isMobile
      ? ["start 60%", "end 20%"]
      : ["start 80%", "end 40%"],
  });

  const progress = useTransform(scrollYProgress, easeBeeProgress);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const updateBee = useCallback((p: number) => {
    const runtime = runtimeRef.current;
    const bee = beeRef.current;
    const face = faceRef.current;
    if (!runtime || !bee || !face) return;
    const { path, trail, animations } = runtime;
    const distance = p * path.length;
    const point = pointAt(path, distance);
    posRef.current = point;
    if (animations.length === 0) {
      bee.style.transform = `translate3d(${point.x - BEE_SIZE / 2}px, ${point.y - BEE_SIZE * 0.65}px, 0)`;
      face.style.transform = `scaleX(${pointAt(path, distance + 20).x < pointAt(path, distance - 20).x ? -1 : 1})`;
    }
    trail.draw(distance - BEE_SIZE * 0.6);
  }, []);

  useMotionValueEvent(progress, "change", updateBee);

  const pixelPath = size.w > 0
    ? (isMobile ? catmullRomToSvg(mobileWaypoints, size.w, size.h) : buildDesktopPath(size.w, size.h))
    : "";
  const vb = `0 0 ${size.w} ${size.h}`;

  useEffect(() => {
    const svgPath = pathRef.current;
    const host = trailHostRef.current;
    const container = containerRef.current;
    const bee = beeRef.current;
    const face = faceRef.current;
    if (!pixelPath || !svgPath || !host || !container || !bee || !face) return;
    const length = svgPath.getTotalLength();
    if (length === 0) return;
    const count = Math.ceil(length / 2);
    const path: SampledPath = {
      length,
      points: Array.from({ length: count + 1 }, (_, i) => {
        const point = svgPath.getPointAtLength((i / count) * length);
        return { x: point.x, y: point.y };
      }),
    };
    const trail = createBeeTrailRenderer(host, path);
    const animations = createBeeScrollAnimation(container, bee, face, path, isMobile, BEE_SIZE);
    runtimeRef.current = { path, trail, animations };
    bee.style.visibility = "visible";
    updateBee(progress.get());
    return () => {
      animations.forEach(animation => animation.cancel());
      trail.destroy();
      runtimeRef.current = null;
    };
  }, [pixelPath, isMobile, progress, updateBee]);

  const copyWaypoints = useCallback(() => {
    const str = waypoints.map(wp => `{ x: ${wp.x}, y: ${wp.y} }`).join(",\n  ");
    navigator.clipboard.writeText(`[\n  ${str}\n]`);
  }, [waypoints]);

  const resetWaypoints = useCallback(() => {
    setWaypoints([...MOBILE_WAYPOINTS]);
  }, [setWaypoints]);

  const addWaypoint = useCallback(() => {
    if (size.w === 0) return;
    // Convert bee pixel position → waypoint coordinate space
    const beeWp: Waypoint = {
      x: Math.round(posRef.current.x * 1000 / size.w),
      y: Math.round(posRef.current.y * 800 / size.h),
    };
    setWaypoints(prev => {
      // Find the segment the bee is closest to and insert there
      let minDist = Infinity;
      let insertAt = prev.length;
      for (let i = 0; i < prev.length - 1; i++) {
        const d = segmentDist(beeWp, prev[i], prev[i + 1]);
        if (d < minDist) { minDist = d; insertAt = i + 1; }
      }
      const next = [...prev];
      next.splice(insertAt, 0, beeWp);
      return next;
    });
  }, [size, setWaypoints]);

  const deleteWaypoint = useCallback((i: number) => {
    setWaypoints(prev => prev.length > 2 ? prev.filter((_, j) => j !== i) : prev);
  }, [setWaypoints]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-50">
      {DEBUG && (
        <div className="pointer-events-auto fixed right-4 top-4 z-50 flex gap-2">
          <button
            onClick={resetWaypoints}
            className="rounded-lg bg-black/80 px-3 py-1.5 text-[11px] font-mono text-white/60 shadow-xl hover:text-white"
          >
            Reset
          </button>
          <button
            onClick={addWaypoint}
            className="rounded-lg bg-black/80 px-3 py-1.5 text-[11px] font-mono text-green-400 shadow-xl hover:text-green-300"
          >
            + Add
          </button>
          <button
            onClick={copyWaypoints}
            className="rounded-lg bg-black/80 px-3 py-1.5 text-[11px] font-mono text-amber-400 shadow-xl"
          >
            Copy
          </button>
        </div>
      )}

      <div ref={trailHostRef} aria-hidden="true" className="absolute inset-0 text-indigo-700/40" />
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        viewBox={vb}
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
        style={DEBUG ? { pointerEvents: "none" } : undefined}
      >
        <path ref={pathRef} d={pixelPath} fill="none" stroke="none" />

        {DEBUG && (
          <path
            d={pixelPath}
            fill="none"
            stroke="rgba(255,60,60,0.9)"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
        )}

        {/* Draggable waypoint handles — rendered last so they're on top */}
        {DEBUG && size.w > 0 && waypoints.map((wp, i) => {
          const cx = wp.x * size.w / 1000;
          const cy = wp.y * size.h / 800;
          const offLeft  = cx < -4;
          const offRight = cx > size.w + 4;
          const offScreen = offLeft || offRight;
          // Edge handle X: pinned 20px from the relevant edge
          const edgeCx = offLeft ? 20 : size.w - 20;

          const onPointerDown = (e: React.PointerEvent) => {
            e.stopPropagation();
            (e.currentTarget as Element).setPointerCapture(e.pointerId);
          };

          const onPointerMove = (e: React.PointerEvent) => {
            if (!e.buttons || !svgRef.current) return;
            const rect = svgRef.current.getBoundingClientRect();
            const yWp = Math.round((e.clientY - rect.top) * 800 / size.h);
            if (offScreen) {
              // Only Y is controllable for off-screen points
              setWaypoints(prev => prev.map((p, j) => j === i ? { ...p, y: yWp } : p));
            } else {
              const xWp = Math.round((e.clientX - rect.left) * 1000 / size.w);
              setWaypoints(prev => prev.map((p, j) => j === i ? { x: xWp, y: yWp } : p));
            }
          };

          const delCx = offScreen ? edgeCx : cx + 12;
          const delCy = cy - 14;

          return (
            <g key={i}>
              {offScreen ? (
                /* Edge handle: tab pinned to left/right edge, drag vertically */
                <g
                  style={{ pointerEvents: "all", cursor: "ns-resize", touchAction: "none" }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                >
                  {/* Dashed line across the edge to suggest the point is off-screen */}
                  <line
                    x1={offLeft ? 0 : size.w} y1={cy}
                    x2={edgeCx} y2={cy}
                    stroke="rgba(251,191,36,0.35)" strokeWidth="1" strokeDasharray="3 3"
                    style={{ pointerEvents: "none" }}
                  />
                  {/* Hit area */}
                  <rect x={edgeCx - 16} y={cy - 16} width={32} height={32} fill="rgba(0,0,0,0)" />
                  {/* Pill */}
                  <rect x={edgeCx - 12} y={cy - 10} width={24} height={20} rx={5}
                    fill="black" stroke="rgb(251,191,36)" strokeWidth="1.5" />
                  <text x={edgeCx} y={cy + 4} fontSize="12" fill="rgb(251,191,36)"
                    textAnchor="middle" style={{ pointerEvents: "none", userSelect: "none" }}>
                    ↕
                  </text>
                  {/* Y value label */}
                  <text
                    x={offLeft ? edgeCx + 18 : edgeCx - 18} y={cy + 4}
                    fontSize="10" fill="rgb(251,191,36)" fontFamily="monospace"
                    textAnchor={offLeft ? "start" : "end"}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {wp.y}
                  </text>
                </g>
              ) : (
                /* Normal on-screen dot */
                <>
                  <g
                    style={{ pointerEvents: "all", cursor: "grab", touchAction: "none" }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                  >
                    <circle cx={cx} cy={cy} r={22} fill="rgba(0,0,0,0)" />
                    <circle cx={cx} cy={cy} r={8} fill="white" stroke="rgb(251,191,36)" strokeWidth="2.5" />
                  </g>
                  <text
                    x={cx + 12} y={cy - 8}
                    fontSize="11" fill="rgb(251,191,36)" fontFamily="monospace"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {wp.x},{wp.y}
                  </text>
                </>
              )}
              {/* Delete button */}
              {waypoints.length > 2 && (
                <g
                  style={{ pointerEvents: "all", cursor: "pointer" }}
                  onPointerDown={(e) => { e.stopPropagation(); deleteWaypoint(i); }}
                >
                  <circle cx={delCx} cy={delCy} r={8} fill="rgb(239,68,68)" />
                  <text
                    x={delCx} y={delCy + 4}
                    fontSize="11" fontWeight="bold" fill="white" textAnchor="middle"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    ×
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      <div
        ref={beeRef}
        className="absolute left-0 top-0"
        style={{
          width: BEE_SIZE,
          height: BEE_SIZE,
          visibility: "hidden",
          willChange: "transform",
        }}
      >
        <div ref={faceRef} className="h-full w-full">
          <Image
            src="/bee.webp"
            alt=""
            width={BEE_SIZE}
            height={BEE_SIZE}
            className="h-full w-full object-contain"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
