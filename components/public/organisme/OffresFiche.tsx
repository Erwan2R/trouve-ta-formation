import Link from "next/link";
import { FINANCEMENTS, RYTHMES, libelle, prix } from "@/lib/organismes/libelles";
import type { Offre, Organisme } from "@/lib/supabase/queries/organismes";
import type { Titre } from "@/lib/supabase/queries/referentiel";
import { fr } from "@/lib/typo";
import { actionsOrganisme } from "./actions";

const surtitre = "font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase";
const puce = "rounded-[9px] border border-line px-3 py-[7px] text-[13.5px] font-semibold";

const lieuTexte = (o: Organisme, offre: Offre) =>
  (offre.lieux.length ? offre.lieux : o.siege ? [o.siege] : []).map(
    (l) => `${l.nom ?? (l.est_siege ? "Siège" : l.ville)} — ${l.adresse}, ${l.code_postal} ${l.ville}`,
  );

/** Ligne de faits : « 175 heures · Temps plein · Saint-Denis » (ville seulement si différente du siège). */
function faits(o: Organisme, offre: Offre): string {
  const villes = offre.lieux.map((l) => l.ville).filter((v) => v !== o.siege?.ville);
  return [
    offre.duree_heures && `${offre.duree_heures} heures`,
    offre.rythmes.map((r) => libelle(RYTHMES, r)).join(", "),
    [...new Set(villes)].join(", "),
  ]
    .filter(Boolean)
    .join(" · ");
}

/**
 * Bloc 5 — les formations, cœur de la fiche. Chaque intitulé mène à la page pilier (si publiée).
 * Vue détaillée : panneau ouvert par l'ancre stable `#[slug]` (CSS :target, sans JavaScript), rendu côté
 * serveur et présent dans le DOM au chargement (UX fiche §5).
 */
export function OffresFiche({
  organisme: o,
  base,
  titres,
}: {
  organisme: Organisme;
  base: string;
  titres: Map<string, Titre>;
}) {
  const appeler = actionsOrganisme(o).appeler;

  if (o.offres.length === 0)
    return (
      <div className="flex max-w-[68ch] flex-col gap-3.5 rounded-[22px] border border-line bg-white p-[clamp(24px,3vw,34px)]">
        <h2 id="offre" className="text-[clamp(25px,3vw,34px)] leading-[1.1] font-bold tracking-[-0.025em]">
          Formations
        </h2>
        <p className="text-[17px] leading-[1.7] text-ink-700">
          Cet organisme n&apos;a pas encore détaillé son offre de formation. Contactez-le directement pour connaître les
          titres qu&apos;il prépare.
        </p>
        {appeler && (
          <a
            href={appeler}
            className="self-start rounded-full bg-ink-900 px-[22px] py-[13px] text-[15px] font-bold text-white hover:bg-brique-700 hover:text-white"
          >
            Appeler l&apos;organisme
          </a>
        )}
      </div>
    );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-baseline justify-between gap-3 pb-[18px]">
        <h2 id="offre" className="scroll-mt-40 text-[clamp(25px,3vw,34px)] leading-[1.1] font-bold tracking-[-0.025em]">
          Les formations proposées
        </h2>
        <span className="font-mono text-xs text-ink-400">
          {o.offres.length} titre{o.offres.length > 1 ? "s" : ""} · déclarés par l&apos;organisme
        </span>
      </div>

      <ol className="flex flex-col border-t border-[#DFD9D2]">
        {o.offres.map((offre) => {
          const t = titres.get(offre.titre.slug);
          const montant = prix(offre.prix_min, offre.prix_max);
          return (
            <li
              key={offre.id}
              className="flex flex-wrap items-baseline gap-x-6 gap-y-3.5 border-b border-[#DFD9D2] py-[22px]"
            >
              <div className="flex min-w-[190px] flex-[1_1_220px] flex-col gap-1.5">
                <h3 className="text-[22px] leading-[1.2] font-bold tracking-[-0.02em]">
                  {t?.a_une_page ? (
                    <Link href={`${base}${t.slug}/`} className="text-ink-900 hover:text-brique-700">
                      {offre.titre.libelle_court}
                    </Link>
                  ) : (
                    offre.titre.libelle_court
                  )}
                </h3>
                {faits(o, offre) && <span className="text-sm text-ink-400">{faits(o, offre)}</span>}
              </div>
              {montant ? (
                <span className="min-w-[110px] flex-none text-xl font-bold tracking-[-0.02em]">{montant}</span>
              ) : (
                <span className="min-w-[110px] flex-none text-[15.5px] font-semibold text-ink-500">
                  Prix sur demande
                </span>
              )}
              <a
                href={`#${offre.slug}`}
                className="flex-none rounded-full border border-[#D8D2CA] px-5 py-[11px] text-sm font-semibold text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-white"
              >
                Détails<span className="sr-only"> de la formation {offre.titre.libelle_court}</span>
              </a>

              {/* Vue détaillée : visible quand l'URL cible #slug. */}
              <div
                id={offre.slug}
                role="dialog"
                aria-labelledby={`${offre.slug}-titre`}
                className="fixed inset-0 z-[60] hidden justify-end bg-ink-900/45 target:flex"
              >
                <a href="#offre" aria-hidden="true" tabIndex={-1} className="flex-1" />
                <div className="flex h-full w-[min(560px,100%)] flex-col overflow-y-auto bg-white">
                  <div className="sticky top-0 flex items-start gap-4 border-b border-line bg-white px-[26px] py-[22px]">
                    <div className="flex flex-1 flex-col gap-[5px]">
                      <span
                        id={`${offre.slug}-titre`}
                        className="text-[21px] leading-[1.2] font-bold tracking-[-0.02em]"
                      >
                        {offre.titre.libelle_long}
                      </span>
                      <span className="text-sm text-ink-400">chez {o.nom}</span>
                    </div>
                    <a
                      href="#offre"
                      aria-label="Fermer le détail de la formation"
                      className="flex size-9 flex-none items-center justify-center rounded-full bg-cream-200 text-[15px] text-ink-600 hover:text-ink-900"
                    >
                      ×
                    </a>
                  </div>
                  <div className="flex flex-col gap-[22px] px-[26px] pt-6 pb-8">
                    <div className="flex flex-col gap-[5px]">
                      <span className={surtitre}>Tarif</span>
                      <span className="text-2xl font-bold tracking-[-0.02em]">{montant ?? "Prix sur demande"}</span>
                      {offre.prix_compris && (
                        <p className="text-[14.5px] leading-[1.65] text-ink-500">{fr(offre.prix_compris)}</p>
                      )}
                    </div>
                    <dl className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 border-y border-line py-[18px]">
                      {offre.duree_heures && (
                        <div className="flex flex-col gap-1">
                          <dt className={surtitre}>Durée</dt>
                          <dd className="text-[15.5px] font-semibold">{offre.duree_heures} heures</dd>
                        </div>
                      )}
                      {offre.rythmes.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <dt className={surtitre}>Rythme</dt>
                          <dd className="text-[15.5px] font-semibold">
                            {offre.rythmes.map((r) => libelle(RYTHMES, r)).join(", ")}
                          </dd>
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <dt className={surtitre}>Lieu</dt>
                        {lieuTexte(o, offre).map((l) => (
                          <dd key={l} className="text-[15px] leading-normal font-semibold">
                            {l}
                          </dd>
                        ))}
                      </div>
                    </dl>
                    <div className="flex flex-col gap-[9px]">
                      <span className={surtitre}>Financements acceptés</span>
                      {offre.financements.length > 0 ? (
                        <span className="flex flex-wrap gap-[7px]">
                          {offre.financements.map((f) => (
                            <span key={f} className={puce}>
                              {libelle(FINANCEMENTS, f)}
                            </span>
                          ))}
                        </span>
                      ) : (
                        <a href="#financements" className="text-[14.5px] font-semibold">
                          Voir les financements acceptés par l&apos;organisme
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col gap-[9px]">
                      <span className={surtitre}>Comment s&apos;inscrire</span>
                      <p className="text-[15px] leading-[1.7] text-ink-700">
                        {fr(
                          offre.inscription ??
                            "Contactez l'organisme directement pour connaître les modalités d'inscription et les prochaines dates.",
                        )}
                      </p>
                      {appeler && (
                        <a
                          href={appeler}
                          className="mt-1 self-start rounded-full bg-ink-900 px-[22px] py-[13px] text-[15px] font-bold text-white hover:bg-brique-700 hover:text-white"
                        >
                          Appeler l&apos;organisme
                        </a>
                      )}
                    </div>
                    {/* Emplacement réservé « Prochaines sessions » (module de réservation) : rien en V1. */}
                    {t?.a_une_page && (
                      <Link
                        href={`${base}${t.slug}/`}
                        className="flex items-start gap-3 rounded-2xl border border-line bg-cream-100 px-5 py-[18px] text-[15px] leading-[1.55] font-semibold text-ink-900 hover:border-ink-900 hover:text-ink-900"
                      >
                        Tout savoir sur le {offre.titre.libelle_court}
                        {" "}: programme, conditions d&apos;accès et durée réglementaire
                        <span aria-hidden="true" className="flex-none text-brique-700">
                          →
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
