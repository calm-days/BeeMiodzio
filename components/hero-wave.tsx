"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";

type HeroWaveProps = {
  targets: Array<RefObject<HTMLElement | null>>;
  height?: number;
  speed?: number;
  harmonics?: number;
  /** px — centerline Y offset from wrap bottom (negative = above bottom). When provided, overrides the default `-V*0.5` placement. */
  centerOffsetY?: number;
};

export function HeroWave({
  targets,
  height = 120,
  speed = 1,
  harmonics = 2,
  centerOffsetY,
}: HeroWaveProps) {
  const reactId = useId();
  const id = `wave-clip-${reactId.replace(/:/g, "-")}`;
  const pathRef = useRef<SVGPathElement>(null);
  const timeRef = useRef(0);
  const seedsRef = useRef<{
    phase: number[];
    freq: number[];
    moff: number;
  } | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const targetsRef = useRef(targets);
  targetsRef.current = targets;

  if (seedsRef.current === null) {
    seedsRef.current = {
      phase: Array.from({ length: harmonics }, () => Math.random() * Math.PI * 2),
      freq: Array.from({ length: harmonics }, () => 0.7 + Math.random() * 0.6),
      moff: Math.random() * 1000,
    };
  }

  useEffect(() => {
    const cssClip = `url(#${id})`;
    const applied: HTMLElement[] = [];
    for (const ref of targetsRef.current) {
      const el = ref.current;
      if (el) {
        el.style.clipPath = cssClip;
        applied.push(el);
      }
    }
    const first = applied[0];
    if (!first) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setBox({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(first);
    return () => {
      ro.disconnect();
      for (const el of applied) el.style.clipPath = "";
    };
  }, [id]);

  useEffect(() => {
    if (box.w === 0 || box.h === 0 || !pathRef.current || !seedsRef.current) return;

    const { phase, freq, moff } = seedsRef.current;
    const SMOOTHING = 0.2;
    const k = harmonics * 3;
    const W = box.w;
    const H = box.h;
    const B = height;
    const V = B * 0.3;
    // Centerline default: half-amplitude above section bottom (so troughs overshoot the seam).
    // When an explicit centerOffsetY is provided, use it directly: centerY = H + centerOffsetY.
    const centerY = centerOffsetY === undefined ? H - V * 0.5 : H + centerOffsetY;

    const ctrl = (
      cur: readonly [number, number],
      prev: readonly [number, number] | undefined,
      next: readonly [number, number] | undefined,
      rev = false,
    ) => {
      const a = prev ?? cur;
      const b = next ?? cur;
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + (rev ? Math.PI : 0);
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) * SMOOTHING;
      return [
        Math.round((cur[0] + Math.cos(ang) * len) * 100) / 100,
        Math.round((cur[1] + Math.sin(ang) * len) * 100) / 100,
      ] as const;
    };

    const buildD = (t: number) => {
      const pts: Array<[number, number]> = [];
      for (let L = 0; L <= k; L++) {
        const te = (L / k) * harmonics * Math.PI * 2;
        const Hi = Math.min(Math.floor((L / k) * harmonics), harmonics - 1);
        const Pe = Math.sin(te - t + phase[Hi]);
        const Qe = Math.sin((L / k) * W * 0.01 + moff) * 0.1;
        const disp = (Pe + Qe) * freq[Hi];
        const x = Math.round(((L / k) * W) * 100) / 100;
        const y = Math.round((centerY + disp * V) * 100) / 100;
        pts.push([x, y]);
      }
      let d = `M 0 ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [c1x, c1y] = ctrl(pts[i - 1], pts[i - 2], pts[i]);
        const [c2x, c2y] = ctrl(pts[i], pts[i - 1], pts[i + 1], true);
        d += ` C ${c1x},${c1y} ${c2x},${c2y} ${pts[i][0]},${pts[i][1]}`;
      }
      d += ` L ${W} 0 L 0 0 Z`;
      return d;
    };

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      pathRef.current.setAttribute("d", buildD(timeRef.current));
      return;
    }

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      timeRef.current += dt * speed;
      if (pathRef.current) pathRef.current.setAttribute("d", buildD(timeRef.current));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [box.w, box.h, height, speed, harmonics, centerOffsetY]);

  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <defs>
        <clipPath id={id} clipPathUnits="userSpaceOnUse">
          <path ref={pathRef} d="" />
        </clipPath>
      </defs>
    </svg>
  );
}
