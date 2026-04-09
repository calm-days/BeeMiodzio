"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { flags } from "@/lib/flags";

type Card = {
  title: string;
  text: string;
};

type Props = {
  heading: string;
  cards: Card[];
};

const CARD_W = 400;
const GAP = 24;
const SIDE_PAD = 5;

export function ScrollCards({ heading, cards }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyContentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Travel must cover: the left padding offset + full strip + enough to push last card off-screen
  const totalStripWidth = cards.length * CARD_W + (cards.length - 1) * GAP;
  const [startPad, setStartPad] = useState(0);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const contentW = 1440; // --page-max-w
      const pagePx = 30;    // --page-px
      setStartPad(Math.max(pagePx, (vw - contentW) / 2));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const travel = startPad + totalStripWidth + CARD_W;
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  // Heading scrolls up off the top edge of the viewport
  const headingY = useTransform(scrollYProgress, [0, 0.15], [0, -200]);

  useEffect(() => {
    if (stickyContentRef.current) {
      setContentHeight(stickyContentRef.current.offsetHeight);
    }
  }, []);


  if (!flags.animations) {
    return (
      <section className="container-page py-24">
        <h2 className="mb-12 text-center font-heading text-3xl tracking-tight md:text-4xl">
          {heading}
        </h2>
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
          {cards.map((card) => (
            <div key={card.title}>
              <p className="mb-2 font-medium">{card.title}</p>
              <p className="text-muted-foreground">{card.text}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const stickyTop = 96;
  // Pull next section up aggressively so it starts scrolling in sooner
  const overlap = contentHeight > 0 ? `calc(-100vh + ${contentHeight + stickyTop}px - 80vh)` : "0px";

  return (
    <>
      <section
        ref={containerRef}
        style={{ height: `${travel}px`, marginBottom: overlap }}
        className="relative z-0"
      >
        {/* No overflow-hidden — heading scrolls off the top edge naturally */}
        <div ref={stickyContentRef} className="sticky top-24">
          <motion.h2
            style={{ y: headingY }}
            className="mb-10 px-[max(var(--page-px),calc((100vw-var(--page-max-w))/2))] font-heading text-3xl tracking-tight md:text-4xl"
          >
            {heading}
          </motion.h2>
          <motion.div
            style={{ x, paddingLeft: "max(var(--page-px), calc((100vw - var(--page-max-w)) / 2))" }}
            className="flex pb-4"
          >
            {cards.map((card, i) => (
              <div
                key={card.title}
                style={{
                  width: CARD_W,
                  minWidth: CARD_W,
                  marginLeft: i > 0 ? GAP : 0,
                }}
                className="shrink-0 rounded-2xl border bg-card p-8 shadow-sm"
              >
                <p className="mb-3 text-lg font-medium">{card.title}</p>
                <p className="text-muted-foreground">{card.text}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
