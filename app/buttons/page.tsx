import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DripButton } from "@/components/drip-button";

const SWATCHES: { label: string; bg: string; fg: string; note?: string }[] = [
  { label: "Page background (beige #F5F0E5)", bg: "#F5F0E5", fg: "#3E2723" },
  { label: "Brand yellow (#FFBE00)", bg: "#FFBE00", fg: "#251F20" },
  { label: "Brand dark (#3E2723)", bg: "#3E2723", fg: "#F5F0E5" },
  { label: "Brand black (#251F20)", bg: "#251F20", fg: "#FFBE00" },
  { label: "Pure white (#FFFFFF)", bg: "#FFFFFF", fg: "#3E2723" },
  { label: "Off-white (oklch 0.96)", bg: "oklch(0.96 0.005 90)", fg: "#3E2723" },
];

function VariantRow({ fg }: { fg: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="lg" arrow>default</Button>
      <Button variant="secondary" size="lg" arrow>secondary</Button>
      <Button
        variant="secondary"
        size="lg"
        arrow
        className="shadow-[inset_0_0_0_1px_var(--foreground)]"
      >
        secondary + outline
      </Button>
      <Button variant="outline" size="lg" arrow>outline</Button>
      <Button variant="ghost" size="lg" arrow>ghost</Button>
      <Button variant="destructive" size="lg" arrow>destructive</Button>
      <Button variant="link" size="lg" style={{ color: fg }}>link</Button>
    </div>
  );
}

function SizeRow() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">xs</Button>
      <Button size="sm">sm</Button>
      <Button size="default">default</Button>
      <Button size="lg">lg</Button>
    </div>
  );
}

function HeroPillRow() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="#"
        className="inline-flex items-center justify-center whitespace-nowrap text-trim-cap bg-primary font-medium leading-none text-primary-foreground transition-colors hover:bg-primary/90"
        style={{
          fontSize: "16px",
          padding: "13px 22px 11px",
          borderRadius: "9999px",
        }}
      >
        Hero pill — yellow
      </Link>
      <Link
        href="#"
        className="inline-flex items-center justify-center whitespace-nowrap text-trim-cap bg-secondary font-medium leading-none text-secondary-foreground transition-colors hover:bg-secondary"
        style={{
          fontSize: "16px",
          padding: "13px 22px 11px",
          borderRadius: "9999px",
        }}
      >
        Hero pill — beige
      </Link>
      <DripButton
        href="#"
        fontSize={16}
        paddingX={22}
        paddingY={12}
        borderRadius={9999}
        dripOffset={4}
        dripInset={6}
      >
        Drip CTA
      </DripButton>
    </div>
  );
}

function Swatch({
  label,
  bg,
  fg,
}: {
  label: string;
  bg: string;
  fg: string;
}) {
  return (
    <section
      className="rounded-2xl p-8"
      style={{ backgroundColor: bg, color: fg }}
    >
      <header className="mb-5 font-heading text-sm uppercase tracking-wider opacity-70">
        {label}
      </header>
      <div className="flex flex-col gap-5">
        <div>
          <p className="mb-2 text-xs opacity-60">Variants @ lg</p>
          <VariantRow fg={fg} />
        </div>
        <div>
          <p className="mb-2 text-xs opacity-60">Sizes (default variant)</p>
          <SizeRow />
        </div>
        <div>
          <p className="mb-2 text-xs opacity-60">Hero / DripButton</p>
          <HeroPillRow />
        </div>
      </div>
    </section>
  );
}

export default function ButtonsDebugPage() {
  return (
    <main className="container-page py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl tracking-tight md:text-4xl">
          Buttons debug
        </h1>
        <p className="mt-2 text-sm opacity-70">
          Brand tokens — yellow #FFBE00 / dark #251F20 · beige #F5F0E5 / brown #3E2723
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {SWATCHES.map((s) => (
          <Swatch key={s.label} label={s.label} bg={s.bg} fg={s.fg} />
        ))}
      </div>
    </main>
  );
}
