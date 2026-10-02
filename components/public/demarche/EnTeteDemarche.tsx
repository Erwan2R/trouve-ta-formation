import { Breadcrumb } from "@/components/public/Breadcrumb";
import { TexteContenu } from "@/components/public/TexteContenu";
import { BANDEAU_DRACAR, URL_DRACAR } from "@/contenu/securite-privee/demarches/liste";
import type { ContenuDemarche } from "@/contenu/securite-privee/demarches/types";
import type { Demarche } from "@/lib/supabase/queries/demarches";

function Ligne({ label, children, mono = false }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5 border-b border-[#F0ECE6] py-[11px] last:border-b-0">
      <dt className="text-[13.5px] text-ink-400">{label}</dt>
      <dd
        className={
          mono
            ? "text-right font-mono text-[13.5px] text-ink-600"
            : "flex-[1_1_170px] text-right text-[14.5px] leading-[1.45] font-semibold"
        }
      >
        {children}
      </dd>
    </div>
  );
}

/** « Dracar Ultimate » devient un lien sortant vers le portail officiel. */
function AvecLienDracar({ texte }: { texte: string }) {
  const [avant, apres] = texte.split("Dracar Ultimate");
  if (apres === undefined) return <>{texte}</>;
  return (
    <>
      {avant}
      <a href={URL_DRACAR} rel="noopener" className="font-bold">
        Dracar Ultimate
      </a>
      {apres}
    </>
  );
}

/**
 * Blocs 1 et 2 — fil d'Ariane, H1, datation, définition, encadré de synthèse.
 * Délai, validité, fenêtre et date viennent de la base : un champ vide n'est pas affiché. Pas de ligne « Coût » :
 * aucune source officielle ne le fixe (décision Erwan 02/10/2026).
 */
export function EnTeteDemarche({
  base,
  nomVerticale,
  demarche,
  contenu,
  listeVisible,
}: {
  base: string;
  nomVerticale: string;
  demarche: Demarche;
  contenu: ContenuDemarche;
  listeVisible: boolean;
}) {
  const date = demarche.verifie_le?.split("-").reverse().join(".");
  const quand = demarche.fenetre_depot ?? contenu.encadre.quand;
  return (
    <section className="border-b border-line-strong bg-cream-200">
      <div className="container-public pt-[18px] pb-10">
        <Breadcrumb
          items={[
            { name: nomVerticale, path: base },
            ...(listeVisible ? [{ name: "Démarches", path: `${base}demarches/` }] : []),
            { name: demarche.libelle, path: `${base}demarches/${demarche.slug}/` },
          ]}
        />
        <div className="mt-8 flex flex-wrap items-start gap-[clamp(20px,3vw,48px)]">
          <div className="flex min-w-[min(100%,290px)] flex-[1_1_500px] flex-col gap-3.5">
            <span className="inline-flex items-center gap-[9px] self-start rounded-full border border-line-strong bg-white px-3.5 py-2 font-mono text-[10.5px] tracking-[0.12em] text-ink-600 uppercase">
              <span aria-hidden="true" className="block size-1.5 rounded-full bg-brique-700" />
              Étape {contenu.etape} sur 4 du parcours
            </span>
            <h1 className="text-[clamp(30px,4vw,50px)] leading-[1.04] font-bold tracking-[-0.035em] text-balance">
              <TexteContenu texte={contenu.h1} />
            </h1>
            {date && (
              <p className="font-mono text-xs tracking-[0.02em] text-ink-400">
                Vérifié le {date}
                {BANDEAU_DRACAR && " · Procédure mise à jour depuis le passage à Dracar Ultimate"}
              </p>
            )}
            <p className="max-w-[62ch] text-[19px] leading-[1.6] text-pretty text-ink-700">
              <TexteContenu texte={contenu.definition} />
            </p>
          </div>

          <dl className="flex min-w-[min(100%,280px)] flex-[1_1_330px] flex-col rounded-[20px] border border-line-strong bg-white p-[22px]">
            <Ligne label="À qui">{contenu.encadre.aQui}</Ligne>
            {quand && <Ligne label="Quand">{quand}</Ligne>}
            <Ligne label="Où">
              <AvecLienDracar texte={contenu.encadre.ou} />
            </Ligne>
            <Ligne label="Pièces principales">{contenu.encadre.pieces}</Ligne>
            {demarche.delai_instruction && <Ligne label="Délai d'instruction">{demarche.delai_instruction}</Ligne>}
            {demarche.validite && <Ligne label="Validité">{demarche.validite}</Ligne>}
            {date && (
              <Ligne label="Dernière vérification" mono>
                {date}
              </Ligne>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
