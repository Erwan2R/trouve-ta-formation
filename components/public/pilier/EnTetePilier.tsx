import { Breadcrumb } from "@/components/public/Breadcrumb";
import type { ContenuPilier } from "@/contenu/securite-privee/piliers/types";
import type { Titre } from "@/lib/supabase/queries/referentiel";
import { TexteContenu } from "@/components/public/TexteContenu";

function Fait({ label, children, mono = false }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[#F0ECE6] py-[11px] last:border-b-0">
      <dt className="text-[13.5px] text-ink-400">{label}</dt>
      <dd
        className={
          mono
            ? "text-right font-mono text-[13.5px] text-ink-600"
            : "max-w-[58%] text-right text-[15px] leading-[1.45] font-bold"
        }
      >
        {children}
      </dd>
    </div>
  );
}

/** Blocs 1 et 2 — fil d'Ariane, H1, définition, ligne de faits clés (tableau extractible, UX pilier §5.2). */
export function EnTetePilier({
  base,
  nomVerticale,
  titre,
  contenu,
  h1,
  nbOrganismes,
}: {
  base: string;
  nomVerticale: string;
  titre: Titre;
  contenu: ContenuPilier;
  h1: string;
  nbOrganismes: number | null;
}) {
  const { faits, gabarit } = contenu;
  return (
    <section className="border-b border-line-strong bg-cream-200">
      <div className="container-public pt-[18px] pb-10">
        <Breadcrumb
          items={[
            { name: nomVerticale, path: base },
            { name: titre.libelle_court, path: `${base}${titre.slug}/` },
          ]}
        />
        <div className="mt-8 flex flex-wrap items-start gap-[clamp(20px,3vw,48px)]">
          <div className="flex min-w-[min(100%,290px)] flex-[1_1_520px] flex-col gap-3.5">
            <span className="inline-flex items-center gap-[9px] self-start rounded-full border border-line-strong bg-white px-3.5 py-2 font-mono text-[10.5px] tracking-[0.12em] text-ink-600 uppercase">
              <span aria-hidden="true" className="block size-1.5 rounded-full bg-brique-700" />
              {titre.categorie}
              {gabarit === "B" && " · maintien"}
            </span>
            <h1 className="text-[clamp(30px,4vw,50px)] leading-[1.04] font-bold tracking-[-0.035em] text-balance">
              {h1}
            </h1>
            <p className="max-w-[62ch] text-[19px] leading-[1.6] text-pretty text-ink-700">
              <TexteContenu texte={contenu.definition} />
            </p>
          </div>

          <dl className="flex min-w-[min(100%,270px)] flex-[1_1_320px] flex-col rounded-[20px] border border-line-strong bg-white p-[22px]">
            {titre.duree && <Fait label="Durée">{titre.duree}</Fait>}
            {gabarit === "A" && faits.niveau && <Fait label="Niveau de qualification">{faits.niveau}</Fait>}
            {gabarit === "B" && faits.periodicite && <Fait label="Périodicité">{faits.periodicite}</Fait>}
            <Fait label="Prérequis principal">{faits.prerequis}</Fait>
            {faits.cout && <Fait label="Coût indicatif">{faits.cout}</Fait>}
            {nbOrganismes !== null && <Fait label="Organismes en Île-de-France">{nbOrganismes}</Fait>}
            <Fait label="Vérifié le" mono>
              {faits.verifieLe.split("-").reverse().join(".")}
            </Fait>
          </dl>
        </div>
      </div>
    </section>
  );
}
