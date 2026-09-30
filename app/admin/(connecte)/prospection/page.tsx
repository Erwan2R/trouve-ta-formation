import type { Metadata } from "next";
import { ProspectionAdmin } from "@/components/admin/ProspectionAdmin";
import { exigerAdmin } from "@/lib/admin-serveur";
import { getProspects } from "@/lib/supabase/queries/admin";
import * as actions from "./actions";

export const metadata: Metadata = { title: "Prospection" };
export const dynamic = "force-dynamic";
// Import : une recherche de SIRET par ligne qui n'en a pas (API Recherche d'entreprises, ~3 par seconde).
export const maxDuration = 120;

/**
 * Prospection (décision Erwan 01/10/2026, page hors maquette, minimale) : le fichier du scraping. Il ne crée jamais
 * de fiche publique et n'apparaît pas dans le Fichier client.
 */
export default async function Prospection() {
  await exigerAdmin();
  const { prospects, empreintesExclues } = await getProspects();
  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-[clamp(6px,1vw,12px)] pt-[clamp(18px,3vw,36px)] pb-[clamp(4px,1vw,10px)]">
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">
            Espace admin · Fichier de prospection, jamais publié
          </span>
          <h1 className="text-[clamp(34px,4.6vw,60px)] leading-[0.98] font-extrabold tracking-[-0.045em]">
            Prospection
          </h1>
        </div>
        <span className="flex items-baseline gap-2.5">
          <span className="font-mono text-[34px] tracking-[-0.04em]">{prospects.length}</span>
          <span className="text-[15px] font-bold">prospects</span>
        </span>
      </section>
      <ProspectionAdmin prospects={prospects} empreintesExclues={empreintesExclues} actions={{ ...actions }} />
    </>
  );
}
