import Link from "next/link";
import { CarteOrganisme } from "@/components/public/organisme/CarteOrganisme";
import { LienContenu } from "@/components/public/LienContenu";
import { TexteContenu } from "@/components/public/TexteContenu";
import { AUCUN_ORGANISME, CONDITIONS, CONSEILS_DEBUT, RESULTAT } from "@/contenu/securite-privee/formulaire";
import type { Lien } from "@/contenu/securite-privee/demarches/types";
import type { Lieu, Organisme } from "@/lib/supabase/queries/organismes";

const lienSouligne =
  "self-start inline-flex items-center gap-2 border-b-[1.5px] border-brique-700 pb-[3px] text-[15.5px] font-bold text-ink-900 hover:text-brique-700";
const boutonPlein =
  "inline-flex items-center gap-3 rounded-full bg-ink-900 px-6 py-4 text-[15.5px] font-bold text-white transition-colors hover:bg-brique-700 hover:text-white";
const boutonContour =
  "inline-flex items-center rounded-full border border-line-strong bg-white px-[22px] py-[15px] text-[15px] font-bold text-ink-900 transition-colors hover:border-ink-900 hover:text-ink-900";

type Titre = { slug: string; libelle_long: string; court: string; a_une_page: boolean };

/** Écran de résultat (Copy §9) : titre et explication, encart démarche, organismes, alternatives, actions, conditions. */
export function EcranResultat({
  base,
  demarchesVisibles,
  titre,
  fort,
  explication,
  conseil,
  encart,
  organismes,
  message,
  elargir,
  alternatives,
  affiner,
  modifier,
}: {
  base: string;
  demarchesVisibles: Set<string>;
  titre: Titre;
  fort: string | null;
  explication: string;
  /** Réponse « quand commencer » qui adapte le message (O3, décision Erwan 02/10/2026). */
  conseil: "vite" | "renseigne" | null;
  encart: { titre: string; texte: string; lien: Lien } | null;
  /** null : aucun organisme sur ce titre (niveau 5). */
  organismes: { organisme: Organisme; lieu: Lieu | null }[] | null;
  message: string | null;
  elargir: { texte: string; lien: string; libelle: string } | null;
  alternatives: { titre: Titre; ligne: string }[];
  affiner: string | null;
  modifier: string;
}) {
  const pilier = titre.a_une_page && (
    <Link href={`${base}${titre.slug}/`} className={lienSouligne}>
      {RESULTAT.pilier(titre.court)}
    </Link>
  );
  return (
    <div className="flex flex-col gap-[clamp(28px,3.5vw,40px)] px-[clamp(20px,3vw,32px)] py-[clamp(24px,3.5vw,40px)]">
      <div className="flex flex-col gap-3.5">
        <h2 className="flex flex-col gap-2 font-bold">
          <span className="text-[15px] leading-[1.3] font-semibold text-ink-500">{RESULTAT.titreAViser}</span>
          <span className="max-w-[24ch] text-[clamp(26px,3.6vw,40px)] leading-[1.06] tracking-[-0.035em] text-balance">
            {titre.libelle_long}
          </span>
        </h2>
        <p className="max-w-[62ch] text-[17px] leading-[1.7] text-pretty text-ink-700">
          {fort && <strong className="text-ink-900">{fort} </strong>}
          {explication}
        </p>
        {conseil === "renseigne" && titre.a_une_page && (
          <p className="max-w-[62ch] text-[15.5px] leading-[1.65] text-ink-700">{CONSEILS_DEBUT.renseigne}</p>
        )}
        {pilier}
      </div>

      {encart && (
        <div className="flex flex-col gap-2.5 rounded-[20px] bg-ink-900 p-[clamp(22px,3vw,30px)]">
          <span className="eyebrow text-brique-400">{RESULTAT.encartSurtitre}</span>
          <h3 className="text-xl leading-[1.25] font-bold tracking-[-0.02em] text-white">{encart.titre}</h3>
          <p className="max-w-[62ch] text-[15.5px] leading-[1.65] text-on-dark">
            <TexteContenu texte={encart.texte} />
          </p>
          <LienContenu
            lien={encart.lien}
            base={base}
            demarchesVisibles={demarchesVisibles}
            className="mt-1 self-start text-[15px] font-bold text-brique-400 hover:text-white"
          >
            {encart.lien.libelle} →
          </LienContenu>
        </div>
      )}

      {organismes ? (
        <div className="flex flex-col gap-3.5">
          {organismes.length > 0 && (
            <h3 className="text-lg font-bold tracking-[-0.015em]">{RESULTAT.compte(organismes.length)}</h3>
          )}
          {conseil === "vite" && organismes.length > 0 && (
            <p className="max-w-[62ch] text-[15.5px] leading-[1.65] text-ink-700">{CONSEILS_DEBUT.vite}</p>
          )}
          {message && (
            <div className="flex flex-col gap-1.5 rounded-2xl border border-line-strong bg-cream-100 px-[18px] py-4">
              {organismes.length > 0 && <span className="eyebrow text-brique-700">{RESULTAT.elargie}</span>}
              <p className="text-[15px] leading-[1.6]">{message}</p>
            </div>
          )}
          <ol className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-3">
            {organismes.map(({ organisme, lieu }) => (
              <li key={organisme.id}>
                <CarteOrganisme organisme={organisme} base={base} lieu={lieu} />
              </li>
            ))}
          </ol>
          {elargir && (
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[15px] leading-[1.6] text-ink-700">
              {elargir.texte}
              <Link href={elargir.lien} rel="nofollow" className="font-bold text-brique-700 hover:text-ink-900">
                {elargir.libelle}
              </Link>
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-[20px] border border-line-strong bg-cream-100 p-[clamp(20px,3vw,28px)]">
          <h3 className="text-lg leading-[1.35] font-bold tracking-[-0.015em]">{AUCUN_ORGANISME.titre(titre.court)}</h3>
          <p className="max-w-[62ch] text-[15.5px] leading-[1.65] text-ink-700">{AUCUN_ORGANISME.texte}</p>
          <span className="mt-1 flex flex-wrap gap-x-[22px] gap-y-2.5">
            {pilier}
            <LienContenu
              lien={AUCUN_ORGANISME.demarches}
              base={base}
              demarchesVisibles={demarchesVisibles}
              className={lienSouligne}
            >
              {AUCUN_ORGANISME.demarches.libelle} →
            </LienContenu>
          </span>
        </div>
      )}

      {alternatives.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h3 className="text-base font-bold tracking-[-0.01em]">{RESULTAT.alternatives}</h3>
          <ul className="flex flex-col border-t border-line">
            {alternatives.map(({ titre: t, ligne }) => {
              const contenu = (
                <span className="flex flex-col gap-0.5">
                  <span className="text-[15.5px] font-bold">{t.libelle_long}</span>
                  <span className="text-sm leading-normal text-ink-500">{ligne}</span>
                </span>
              );
              return (
                <li key={t.slug} className="border-b border-line">
                  {t.a_une_page ? (
                    <Link
                      href={`${base}${t.slug}/`}
                      className="flex items-center justify-between gap-4 py-3.5 text-ink-900 hover:text-brique-700"
                    >
                      {contenu}
                      <span aria-hidden="true" className="flex-none text-brique-700">
                        →
                      </span>
                    </Link>
                  ) : (
                    <div className="py-3.5">{contenu}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-[18px] gap-y-3">
        {affiner && (
          <Link href={affiner} rel="nofollow" className={boutonPlein}>
            {RESULTAT.affiner}
            <span className="font-mono text-[11.5px] font-normal text-on-dark">{RESULTAT.affinerCout}</span>
          </Link>
        )}
        <Link href={modifier} rel="nofollow" className={boutonContour}>
          {RESULTAT.modifier}
        </Link>
      </div>

      <div className="flex flex-col gap-2 rounded-[18px] border border-line p-[clamp(18px,2.5vw,24px)]">
        <h3 className="text-base leading-[1.35] font-bold tracking-[-0.01em]">{CONDITIONS.titre}</h3>
        <p className="max-w-[66ch] text-[14.5px] leading-[1.65] text-ink-500">{CONDITIONS.texte}</p>
        <LienContenu
          lien={CONDITIONS.lien}
          base={base}
          demarchesVisibles={demarchesVisibles}
          className="self-start text-[14.5px] font-bold text-brique-700 hover:text-ink-900"
        >
          {CONDITIONS.lien.libelle} →
        </LienContenu>
      </div>
    </div>
  );
}
