"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePrezentConfig } from "@/components/section-config";

const gifts = [
  {
    label: "Dla kogoś, kto ma już wszystko",
    desc: "Udział w ulu, kamery na żywo i miód pod drzwi",
  },
  {
    label: "Dla dziecka",
    desc: "Certyfikat pszczelarza i przygoda na cały rok",
  },
  {
    label: "Dla mamy lub taty",
    desc: "Hobby bez wysiłku — ogląda, kibicuje, dostaje miód",
  },
];

export function PrezentSection() {
  const [c] = usePrezentConfig();

  return (
    <section className="container-page py-24">
      <h2 className="mb-4 text-center font-heading text-3xl tracking-tight md:text-4xl">
        Prezent, który trwa cały rok
      </h2>

      <p className="mx-auto mb-16 max-w-md text-center text-muted-foreground">
        Podaruj udział w ulu — z certyfikatem, kamerami i miodem na koniec
        sezonu
      </p>

      {/* Fanned cards — desktop transforms via inline styles, mobile stacks */}
      <div className="mx-auto flex max-w-3xl flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-center md:gap-0">
        {gifts.map((gift, i) => {
          const isCenter = i === 1;
          const isLeft = i === 0;

          const desktopStyle: React.CSSProperties = {
            width: isCenter ? c.centerWidth : c.sideWidth,
            padding: c.cardPadding,
            borderRadius: c.cardRadius,
            transform: isCenter
              ? `translateY(-${c.verticalOffset}px)`
              : `rotate(${isLeft ? -c.rotation : c.rotation}deg) translate(${isLeft ? -c.horizontalOffset : c.horizontalOffset}px, ${c.verticalOffset}px)`,
            marginRight: isLeft ? -c.overlap : undefined,
            marginLeft: !isLeft && !isCenter ? -c.overlap : undefined,
            zIndex: isCenter ? 20 : 10,
          };

          return (
            <div
              key={gift.label}
              className="relative rounded-2xl border bg-card p-6 shadow-lg max-md:!w-full max-md:!transform-none max-md:!m-0"
              style={desktopStyle}
            >
              <div
                className="mb-3 w-full rounded-xl bg-muted"
                style={{ aspectRatio: `${c.imageRatio}` }}
              />
              <p
                className="font-heading tracking-tight"
                style={{ fontSize: `${c.titleSize}px` }}
              >
                {gift.label}
              </p>
              <p
                className="mt-1 text-muted-foreground"
                style={{ fontSize: `${c.bodySize}px` }}
              >
                {gift.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex items-center justify-center gap-3">
        <Button variant="outline" size="lg" render={<Link href="/prezent" />}>
          Dowiedz się więcej
        </Button>
        <Button size="lg" render={<Link href="/checkout" />}>
          Podaruj ul
        </Button>
      </div>
    </section>
  );
}
