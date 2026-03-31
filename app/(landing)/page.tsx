import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center gap-8 px-[5%] py-24 text-center">
      <h1 className="font-heading text-5xl tracking-tight md:text-6xl">
        Twój ul. Twój miód.
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Adoptuj część ula w Polsce i odbierz miód z własną etykietą.
        Obserwuj pszczoły na żywo i wspieraj lokalne pszczelarstwo.
      </p>
      <div className="flex gap-4">
        <Button render={<Link href="/cennik" />} size="lg">
          Zobacz taryfy
        </Button>
        <Button render={<Link href="/o-nas" />} variant="outline" size="lg">
          Dowiedz się więcej
        </Button>
      </div>
    </section>
  );
}
