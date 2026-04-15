import type { Metadata } from "next";
import { PasiekiExplorer } from "./explorer";

export const metadata: Metadata = {
  title: "Baza pasiek — Polska",
  description: "Przeglądarka 5 239 pasiek w Polsce z mapą i filtrami.",
};

export default function PasiekiPage() {
  return <PasiekiExplorer />;
}
