"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { MoveRight } from "lucide-react";
import { useHeroConfig } from "@/components/section-config";
import { HeroWave } from "@/components/hero-wave";

// Hero image natural dimensions (both bg and fg are the same size)
const IMG_W = 4800;
const IMG_H = 3584;
const IMG_ASPECT = IMG_W / IMG_H;

export function HeroConfigurator() {
  const [config] = useHeroConfig();
  const sectionRef = useRef<HTMLElement>(null);
  const bgWrapRef = useRef<HTMLDivElement>(null);
  const fgWrapRef = useRef<HTMLDivElement>(null);

  // Stage = the image's actual displayed box (object-cover math).
  // x/y are in viewport-relative pixels inside the full-bleed wrapper (0,0 = top-left of 100vw × sectionH area).
  const [stage, setStage] = useState({ w: 0, h: 0, x: 0, y: 0 });

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const vw = window.innerWidth;
      const sh = section.offsetHeight;
      const sectionAspect = vw / sh;

      let w: number, h: number, x: number, y: number;
      if (sectionAspect > IMG_ASPECT) {
        // Wide container — image is width-limited
        w = vw;
        h = vw / IMG_ASPECT;
        x = 0;
        y = (sh - h) / 2;
      } else {
        // Narrow/tall container — image is height-limited
        h = sh;
        w = sh * IMG_ASPECT;
        x = (vw - w) / 2;
        y = 0;
      }
      setStage({ w, h, x, y });
    };

    update();
    const ro = new ResizeObserver(update);
    if (sectionRef.current) ro.observe(sectionRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto max-w-[1440px] min-h-[var(--hero-mobile-h)] px-[15px] pb-8 lg:min-h-[var(--hero-min-h)] lg:px-[30px]"
      style={
        {
          "--hero-min-h": `${config.sectionMinHeight}vh`,
          "--hero-mobile-h": `${config.mobileMinHeight}dvh`,
        } as React.CSSProperties
      }
    >
      {/* Background image — full bleed.
          `bottom` is overridden by config.waveOverflowY so the wrap can extend below the section
          (otherwise the wave's troughs would be clipped by the section edge). */}
      <div
        ref={bgWrapRef}
        className="absolute top-0 -z-10 overflow-hidden"
        style={{
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          width: "100vw",
          bottom: `-${config.waveOverflowY}px`,
        }}
      >
        <Image
          src="/hero-meadow.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Foreground cutout — same position as bg, layered above heading */}
      <div
        ref={fgWrapRef}
        className="pointer-events-none absolute top-0 z-20 overflow-hidden"
        style={{
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          width: "100vw",
          bottom: `-${config.waveOverflowY}px`,
        }}
      >
        <Image
          src="/hero-meadow-fg.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Desktop: stage-anchored layout */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10 hidden lg:block"
        style={{
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          width: "100vw",
        }}
      >
        {/* Stage — matches image's actual displayed box */}
        <div
          className="absolute"
          style={{
            left: `${stage.x}px`,
            top: `${stage.y}px`,
            width: `${stage.w}px`,
            height: `${stage.h}px`,
          }}
        >
          {/* Heading + subheading — anchored by BOTTOM so it sits above ground consistently */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 text-center"
            initial={{ filter: "blur(12px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              width: `${config.headingWidth}%`,
              bottom: `${100 - config.groundY - config.headingOffsetY}%`,
            }}
          >
            <p
              className="mb-4 font-medium uppercase tracking-widest text-white/80"
              style={{ fontSize: `${config.subheadingSize}px` }}
            >
              Pierwszy i jedyny Bee Sharing w Polsce
            </p>
            <h1
              className="font-heading tracking-tight text-white"
              style={{
                fontSize: `${config.headingSize}px`,
                lineHeight: config.headingLineHeight,
              }}
            >
              Twój ul. Twój miód.
              <br />
              Nasza opieka.
            </h1>
          </motion.div>

          {/* Bzz-bzz drip animation */}
          <div
            className="absolute"
            style={{
              width: 0,
              height: 0,
              right: `${config.bzzRight}%`,
              top: `${config.groundY + config.bzzOffsetY}%`,
            }}
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

          {/* Buttons */}
          <div
            className="pointer-events-auto absolute flex -translate-x-1/2"
            style={{
              left: `${config.buttonX}%`,
              top: `${config.groundY + config.buttonOffsetY}%`,
              gap: `${config.buttonGap}px`,
            }}
          >
            <Link
              href="/cennik"
              className="group inline-flex items-center justify-center whitespace-nowrap text-trim-cap bg-primary font-medium leading-none text-primary-foreground transition-colors hover:bg-primary"
              style={{
                fontSize: `${config.buttonFontSize}px`,
                padding: `${config.buttonPaddingY + 1}px ${config.buttonPaddingX}px ${config.buttonPaddingY - 1}px`,
                borderRadius: "9999px",
              }}
            >
              Chcę pszczoły!
              <span aria-hidden className="inline-flex w-0 items-center overflow-hidden transition-[width,opacity,padding] duration-200 ease-out opacity-0 group-hover:w-10 group-hover:pl-2 group-hover:opacity-100">
                <MoveRight className="size-6 shrink-0 -translate-x-1 transition-transform duration-200 ease-out group-hover:translate-x-0" />
              </span>
            </Link>
            <Link
              href="/o-nas"
              className="group inline-flex items-center justify-center whitespace-nowrap text-trim-cap bg-secondary font-medium leading-none text-secondary-foreground transition-colors hover:bg-secondary"
              style={{
                fontSize: `${config.buttonFontSize}px`,
                padding: `${config.buttonPaddingY + 1}px ${config.buttonPaddingX}px ${config.buttonPaddingY - 1}px`,
                borderRadius: "9999px",
              }}
            >
              Dowiedz się więcej
              <span aria-hidden className="inline-flex w-0 items-center overflow-hidden transition-[width,opacity,padding] duration-200 ease-out opacity-0 group-hover:w-10 group-hover:pl-2 group-hover:opacity-100">
                <MoveRight className="size-6 shrink-0 -translate-x-1 transition-transform duration-200 ease-out group-hover:translate-x-0" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile: heading anchored to top, buttons anchored to bottom */}
      <div className="lg:hidden">
        {/* Mobile stage — full-bleed wrapper matching the image box */}
        <div
          className="pointer-events-none absolute inset-y-0 z-10"
          style={{
            left: "50%",
            right: "50%",
            marginLeft: "-50vw",
            marginRight: "-50vw",
            width: "100vw",
          }}
        >
          <div
            className="absolute"
            style={{
              left: `${stage.x}px`,
              top: `${stage.y}px`,
              width: `${stage.w}px`,
              height: `${stage.h}px`,
            }}
          >
            {/* Bzz-bzz drip animation (mobile, stage-anchored) */}
            <div
              className="absolute"
              style={{
                width: 0,
                height: 0,
                right: `${config.bzzRight}%`,
                top: `${config.groundY + config.bzzOffsetY}%`,
              }}
            >
              <p
                className="absolute whitespace-nowrap font-medium"
                style={{
                  fontSize: `${config.mobileBzzSize}px`,
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
                  fontSize: `${config.mobileBzzSize}px`,
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
          </div>
        </div>

        {/* Heading — top (z-10 so it sits BEHIND the fg cutout like desktop) */}
        <motion.div
          className="absolute inset-x-0 z-10 text-center"
          initial={{ filter: "blur(12px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            top: `${config.mobilePaddingTop}px`,
            paddingLeft: `${config.mobilePaddingX}px`,
            paddingRight: `${config.mobilePaddingX}px`,
          }}
        >
          <p
            className="mb-3 font-medium uppercase tracking-widest text-white/80"
            style={{ fontSize: `${config.mobileSubheadingSize}px` }}
          >
            Pierwszy i jedyny Bee Sharing w Polsce
          </p>
          <h1
            className="font-heading tracking-tight text-white"
            style={{
              fontSize: `${config.mobileHeadingSize}px`,
              lineHeight: config.mobileHeadingLineHeight,
            }}
          >
            Twój ul.
            <br />
            Twój miód.
            <br />
            Nasza opieka.
          </h1>
        </motion.div>

        {/* Buttons — anchored to viewport bottom (not section bottom) */}
        <div
          className="absolute inset-x-0 z-30 flex justify-center"
          style={{
            top: `calc(100dvh - ${config.mobilePaddingBottom}px)`,
            transform: "translateY(-100%)",
            gap: `${config.mobileButtonGap}px`,
            paddingLeft: `${config.mobilePaddingX}px`,
            paddingRight: `${config.mobilePaddingX}px`,
          }}
        >
          <Link
            href="/cennik"
            className="group inline-flex items-center justify-center whitespace-nowrap text-trim-cap bg-primary font-medium leading-none text-primary-foreground transition-colors hover:bg-primary"
            style={{
              fontSize: `${config.mobileButtonFontSize}px`,
              padding: `${config.mobileButtonPaddingY + 1}px ${config.mobileButtonPaddingX}px ${config.mobileButtonPaddingY - 1}px`,
              borderRadius: "9999px",
            }}
          >
            Chcę pszczoły!
            <span aria-hidden className="inline-flex w-0 items-center overflow-hidden transition-[width,opacity,padding] duration-200 ease-out opacity-0 group-hover:w-10 group-hover:pl-2 group-hover:opacity-100">
              <MoveRight className="size-6 shrink-0 -translate-x-1 transition-transform duration-200 ease-out group-hover:translate-x-0" />
            </span>
          </Link>
          <Link
            href="/o-nas"
            className="group inline-flex items-center justify-center whitespace-nowrap text-trim-cap bg-secondary font-medium leading-none text-secondary-foreground transition-colors hover:bg-secondary"
            style={{
              fontSize: `${config.mobileButtonFontSize}px`,
              padding: `${config.mobileButtonPaddingY + 1}px ${config.mobileButtonPaddingX}px ${config.mobileButtonPaddingY - 1}px`,
              borderRadius: "9999px",
            }}
          >
            Dowiedz się więcej
            <span aria-hidden className="inline-flex w-0 items-center overflow-hidden transition-[width,opacity,padding] duration-200 ease-out opacity-0 group-hover:w-10 group-hover:pl-2 group-hover:opacity-100">
              <MoveRight className="size-6 shrink-0 -translate-x-1 transition-transform duration-200 ease-out group-hover:translate-x-0" />
            </span>
          </Link>
        </div>
      </div>

      {/* Animated wave clip — carves a wavy bottom edge into the hero images */}
      <HeroWave
        targets={[bgWrapRef, fgWrapRef]}
        height={config.waveHeight}
        speed={config.waveSpeed}
        centerOffsetY={config.waveCenterOffsetY}
      />
    </section>
  );
}
