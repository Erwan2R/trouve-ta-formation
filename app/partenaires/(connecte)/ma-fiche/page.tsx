import type { Metadata } from "next";
import { MaFiche } from "@/components/espace/MaFiche";
import { absoluteUrl } from "@/lib/seo/metadata";
import { getEspace } from "@/lib/supabase/queries/espace";
import * as actions from "./actions";
import { donneesMaFiche } from "./donnees";

export const metadata: Metadata = { title: "Ma fiche" };

/** Ma fiche : identité, coordonnées et lieux, sections enregistrées séparément (UX Ma fiche). */
export default async function PageMaFiche() {
  const espace = await getEspace();
  const o = espace.organisme;
  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-[clamp(6px,1vw,12px)] pt-[clamp(18px,3vw,36px)] pb-[clamp(4px,1vw,10px)]">
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">
            Espace organisme · {o.nom}
          </span>
          <h1 className="text-[clamp(34px,4.6vw,60px)] leading-[0.98] font-extrabold tracking-[-0.045em]">Ma fiche</h1>
          <p className="max-w-[60ch] text-base leading-[1.6] text-ink-700">
            L&apos;identité, les coordonnées et les lieux de votre organisme. Chaque section s&apos;enregistre
            séparément.
          </p>
        </div>
        {o.statut === "publie" && (
          <a
            href={absoluteUrl(`/securite-privee/organismes/${o.slug}/`)}
            className="inline-flex items-center gap-2.5 rounded-full bg-ink-900 px-6 py-4 text-[15px] font-bold text-white transition-colors hover:bg-brique-700 hover:text-white"
          >
            Voir ma fiche publique<span aria-hidden="true">→</span>
          </a>
        )}
      </section>
      <MaFiche actions={{ ...actions }} donnees={donneesMaFiche(espace)} />
    </>
  );
}
