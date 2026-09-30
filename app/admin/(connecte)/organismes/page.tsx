import type { Metadata } from "next";
import { FichierClient } from "@/components/admin/FichierClient";
import { exigerAdmin } from "@/lib/admin-serveur";
import { getDepartements, getOrganismesAdmin } from "@/lib/supabase/queries/admin";
import * as actions from "./actions";

export const metadata: Metadata = { title: "Fichier client" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ palier?: string; "sans-formation"?: string; depuis?: string }> };

/** Fichier client : les organismes inscrits. Les prospects du scraping n'y figurent jamais (page Prospection). */
export default async function Organismes({ searchParams }: Props) {
  await exigerAdmin();
  const [organismes, departements, p] = await Promise.all([getOrganismesAdmin(), getDepartements(), searchParams]);
  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-[clamp(6px,1vw,12px)] pt-[clamp(18px,3vw,36px)] pb-[clamp(4px,1vw,10px)]">
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">
            Espace admin · Sécurité privée
          </span>
          <h1 className="text-[clamp(34px,4.6vw,60px)] leading-[0.98] font-extrabold tracking-[-0.045em]">
            Fichier client
          </h1>
        </div>
        <span className="flex items-baseline gap-2.5">
          <span className="font-mono text-[34px] tracking-[-0.04em]">{organismes.length}</span>
          <span className="text-[15px] font-bold">organismes inscrits</span>
        </span>
      </section>
      <FichierClient
        organismes={organismes}
        departements={departements}
        initial={{
          palier: ["basique", "correct", "optimal"].includes(p.palier ?? "") ? p.palier! : "",
          sansFormation: p["sans-formation"] === "1",
          depuisDashboard: p.depuis === "dashboard",
        }}
        actions={{ ...actions }}
      />
    </>
  );
}
