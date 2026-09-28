import type { Metadata } from "next";
import { MaFiche } from "@/components/espace/MaFiche";
import { absoluteUrl } from "@/lib/seo/metadata";
import { getEspace } from "@/lib/supabase/queries/espace";
import * as actions from "./actions";

export const metadata: Metadata = { title: "Ma fiche" };

/** Ma fiche : identité, coordonnées et lieux, sections enregistrées séparément (UX Ma fiche). */
export default async function PageMaFiche() {
  const { organisme: o, siege, lieux, offres, user } = await getEspace();
  const s = (v: string | number | null) => (v === null ? "" : String(v));
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
      <MaFiche
        actions={{ ...actions }}
        donnees={{
          emailCompte: user.email,
          identite: {
            nom: o.nom,
            raison_sociale: s(o.raison_sociale),
            siret: s(o.siret),
            numero_declaration_activite: s(o.numero_declaration_activite),
            annee_creation: s(o.annee_creation),
          },
          logo: o.logo_url,
          agrement: {
            numero_agrement_cnaps: s(o.numero_agrement_cnaps),
            qualiopi: o.qualiopi,
            numero_qualiopi: s(o.numero_qualiopi),
          },
          coordonnees: {
            adresse: s(siege?.adresse ?? null),
            code_postal: s(siege?.code_postal ?? null),
            ville: s(siege?.ville ?? null),
            telephone: s(o.telephone),
            site_web: s(o.site_web),
            email_contact: s(o.email_contact),
            horaires: s(o.horaires),
          },
          lieux: lieux
            .filter((l) => !l.est_siege)
            .map((l) => ({
              id: l.id,
              nom: s(l.nom),
              adresse: l.adresse,
              code_postal: l.code_postal,
              ville: l.ville,
              formations: offres.filter((x) => x.lieux.includes(l.id)).map((x) => x.titre.libelle_court),
            })),
          pratique: { accessibilite_pmr: o.accessibilite_pmr, langues: o.langues },
          presentation: { presentation: s(o.presentation) },
        }}
      />
    </>
  );
}
