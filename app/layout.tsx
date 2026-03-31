import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AgentationProvider } from "@/components/agentation-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BeeSharing Poland",
    template: "%s | BeeSharing Poland",
  },
  description: "Twój ul. Twój miód. Adopcja uli w Polsce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <AgentationProvider />
      </body>
    </html>
  );
}
