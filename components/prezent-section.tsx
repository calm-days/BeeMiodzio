"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePrezentConfig } from "@/components/section-config";

const gifts = [
  {
    label: "Dla kogoś, kto ma już wszystko",
    desc: "Coś co będzie wspominał przez lata. Własny ul i prawdziwy miód — z jego imieniem na etykiecie.",
    image: "/prezent/1.png",
  },
  {
    label: "Dla dziecka",
    desc: "Najlepsza lekcja przyrody, jaką można mieć. Obserwują, kibicują, a jesienią dostają słoiczek z miodem — od swoich pszczół!",
    image: "/prezent/2.png",
  },
  {
    label: "Dla mamy lub taty",
    desc: "Dzieci wyleciały z gniazda. Czas zadbać o kogoś innego. Nowe hobby, poczucie troski i zapas prawdziwego miodu na co dzień.",
    image: "/prezent/3.png",
  },
];

export function PrezentSection() {
  const [c] = usePrezentConfig();

  return (
    <section className="container-page py-24">
      <h2 className="mb-4 text-center font-heading text-5xl tracking-tight md:text-6xl">
        Prezent, który trwa cały rok
      </h2>

      <p className="mx-auto mb-6 max-w-2xl text-center">
        Podaruj udział w ulu — z certyfikatem, kamerami i miodem na koniec
        sezonu
      </p>

      {/* Fanned cards — desktop transforms via inline styles, mobile stacks */}
      <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-center md:gap-0">
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
              className="relative max-md:!w-full max-md:!transform-none max-md:!m-0"
              style={desktopStyle}
            >
              <Image
                src={gift.image}
                alt={gift.label}
                width={1200}
                height={967}
                quality={95}
                className="mb-3"
                style={{
                  width: c.imageWidth > 0 ? `${c.imageWidth}px` : "100%",
                  height: c.imageHeight > 0 ? `${c.imageHeight}px` : "auto",
                  objectFit: c.imageWidth > 0 && c.imageHeight > 0 ? "contain" : undefined,
                }}
                sizes="(min-width: 768px) 720px, 100vw"
              />
              <p
                className="font-heading tracking-tight"
                style={{ fontSize: `${c.titleSize}px` }}
              >
                {gift.label}
              </p>
              <p
                className="mt-1"
                style={{ fontSize: `${c.bodySize}px` }}
              >
                {gift.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <Button
          size="lg"
          arrow
          className="h-14 px-10 text-base"
          render={<Link href="/checkout" />}
        >
          Podaruj ul
        </Button>
        <Button
          variant="secondary"
          size="lg"
          arrow
          className="h-14 px-10 text-base shadow-[inset_0_0_0_1px_var(--foreground)]"
          render={<Link href="/prezent" />}
        >
          Dowiedz się więcej
        </Button>
      </div>
    </section>
  );
}
