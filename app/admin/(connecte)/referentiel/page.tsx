import type { Metadata } from "next";
import { ReferentielAdmin } from "@/components/admin/ReferentielAdmin";
import { exigerAdmin } from "@/lib/admin-serveur";
import { getReferentielAdmin } from "@/lib/supabase/queries/admin";
import * as actions from "./actions";

export const metadata: Metadata = { title: "Référentiel des titres" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ onglet?: string }> };

export default async function Referentiel({ searchParams }: Props) {
  await exigerAdmin();
  const [{ titres, demandes }, { onglet }] = await Promise.all([getReferentielAdmin(), searchParams]);
  const nbCategories = new Set(titres.map((t) => t.categorie)).size;
  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-[clamp(6px,1vw,12px)] pt-[clamp(18px,3vw,36px)] pb-[clamp(4px,1vw,10px)]">
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">
            Espace admin · Liste fermée
          </span>
          <h1 className="text-[clamp(34px,4.6vw,60px)] leading-[0.98] font-extrabold tracking-[-0.045em]">
            Référentiel des titres
          </h1>
        </div>
        <span className="flex flex-wrap items-baseline gap-x-[22px] gap-y-1.5">
          <span className="flex items-baseline gap-2">
            <span className="font-mono text-[34px] tracking-[-0.04em]">{titres.length}</span>
            <span className="text-[15px] font-bold">titres</span>
          </span>
          <span className="flex items-baseline gap-2">
            <span className="font-mono text-[34px] tracking-[-0.04em] text-ink-400">{nbCategories}</span>
            <span className="text-[15px] font-bold text-ink-500">catégories</span>
          </span>
        </span>
      </section>
      <ReferentielAdmin
        titres={titres}
        demandes={demandes}
        ongletInitial={onglet === "demandes" ? "demandes" : "liste"}
        actions={{ ...actions }}
      />
    </>
  );
}
