"use client";

import { useEffect, useRef, useState } from "react";
import { flags } from "@/lib/flags";

const TRANSPARENT_1X1 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

type Props = {
  name: string;
  aspect: string;
  className?: string;
  style?: React.CSSProperties;
  inDurationMs?: number;
};

export function AnimatedDrawing({
  name,
  aspect,
  className,
  style,
  inDurationMs = 533,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLImageElement>(null);
  const [showIn, setShowIn] = useState(false);
  const [showIdle, setShowIdle] = useState(false);
  const canTrigger = useRef(true);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inSrc = `/dlaczego-zdrowy/${name}-in-yellow.webp`;
  const idleSrc = `/dlaczego-zdrowy/${name}-default-yellow.webp`;
  const staticSrc = `/dlaczego-zdrowy/${name}-yellow.webp`;

  useEffect(() => {
    if (!flags.animations) return;
    const inImg = inRef.current;
    if (!inImg) return;
    const onLoad = () => {
      inImg.src = TRANSPARENT_1X1;
    };
    inImg.addEventListener("load", onLoad, { once: true });
    inImg.src = inSrc;
    return () => inImg.removeEventListener("load", onLoad);
  }, [inSrc]);

  useEffect(() => {
    if (!flags.animations) return;
    const el = wrapperRef.current;
    if (!el) return;

    const enter = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && canTrigger.current) {
          canTrigger.current = false;
          if (inRef.current) inRef.current.src = inSrc;
          setShowIn(true);
          setShowIdle(false);
          if (swapTimer.current) clearTimeout(swapTimer.current);
          swapTimer.current = setTimeout(() => {
            setShowIn(false);
            setShowIdle(true);
          }, inDurationMs);
        }
      },
      { rootMargin: "-15% 0px" },
    );
    const exit = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          canTrigger.current = true;
          if (swapTimer.current) {
            clearTimeout(swapTimer.current);
            swapTimer.current = null;
          }
          setShowIn(false);
          setShowIdle(false);
          if (inRef.current && !inRef.current.src.startsWith("data:")) {
            inRef.current.src = TRANSPARENT_1X1;
          }
        }
      },
      { rootMargin: "0px" },
    );
    enter.observe(el);
    exit.observe(el);
    return () => {
      enter.disconnect();
      exit.disconnect();
      if (swapTimer.current) clearTimeout(swapTimer.current);
    };
  }, [inSrc, inDurationMs]);

  if (!flags.animations) {
    return (
      <div className={className} style={style} aria-hidden="true">
        <img
          src={staticSrc}
          alt=""
          className="block w-full select-none"
          style={{ aspectRatio: aspect }}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={className} style={style} aria-hidden="true">
      <div className="relative w-full" style={{ aspectRatio: aspect }}>
        <img
          ref={inRef}
          alt=""
          draggable={false}
          className="absolute inset-0 block h-full w-full select-none"
          style={{
            opacity: showIn ? 1 : 0,
            visibility: showIn ? "visible" : "hidden",
          }}
        />
        <img
          src={idleSrc}
          alt=""
          draggable={false}
          className="absolute inset-0 block h-full w-full select-none"
          style={{
            opacity: showIdle ? 1 : 0,
            visibility: showIdle ? "visible" : "hidden",
          }}
        />
      </div>
    </div>
  );
}
