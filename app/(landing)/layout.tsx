import { SectionConfigProvider } from "@/components/section-config";
import { SiteHeader } from "@/components/site-header";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <SectionConfigProvider>
      <SiteHeader />
      <main className="flex-1 -mt-[82px] lg:-mt-[152px]">{children}</main>
      <footer className="container-page border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2025 BeeSharing Poland. Twój ul. Twój miód.
      </footer>
    </SectionConfigProvider>
  );
}
