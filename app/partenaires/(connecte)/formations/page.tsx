import type { Metadata } from "next";
import { MesFormations } from "@/components/espace/MesFormations";
import * as actions from "./actions";
import { donneesFormations } from "./donnees";

export const metadata: Metadata = { title: "Mes formations" };

/** Mes formations : offres déclarées, sélection dans le référentiel fermé, détail par offre (UX Mes formations). */
export default async function PageFormations() {
  return <MesFormations actions={{ ...actions }} {...await donneesFormations()} />;
}
