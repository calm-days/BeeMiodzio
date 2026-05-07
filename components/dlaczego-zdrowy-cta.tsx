import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RedrawHeading } from "@/components/redraw-heading";
import { FlowerPop } from "@/components/flower-pop";

export function DlaczegoZdrowyCta() {
  return (
    <section className="container-page relative overflow-hidden py-16 md:py-24">
      <Image
        src="/dlaczego-zdrowy/line-L.png"
        alt=""
        aria-hidden="true"
        width={668}
        height={364}
        className="pointer-events-none absolute left-0 top-1/2 hidden w-[28%] max-w-[360px] -translate-y-1/2 select-none md:block"
      />
      <Image
        src="/dlaczego-zdrowy/line-R.png"
        alt=""
        aria-hidden="true"
        width={832}
        height={364}
        className="pointer-events-none absolute right-0 top-1/2 hidden w-[32%] max-w-[420px] -translate-y-1/2 select-none md:block"
      />

      <FlowerPop className="pointer-events-none absolute right-[8%] top-[28%] hidden w-[110px] md:block lg:w-[140px]" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <RedrawHeading lines={["Dlaczego miód", "jest zdrowy?"]} />

        <Button
          size="lg"
          arrow
          className="mt-10 h-14 px-10 text-base"
          render={<Link href="/dlaczego-miod-jest-zdrowy" />}
        >
          Dowiedz się czemu
        </Button>
      </div>
    </section>
  );
}
