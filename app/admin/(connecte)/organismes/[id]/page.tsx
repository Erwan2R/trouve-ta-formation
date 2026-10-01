import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionsFicheClient } from "@/components/admin/ActionsFicheClient";
import { TYPES_RAPPEL, type TypeRappel } from "@/contenu/admin/emails";
import { exigerAdmin } from "@/lib/admin-serveur";
import { dateCourte } from "@/lib/format-date";
import { FINANCEMENTS, libelle, monogramme, prix, RYTHMES } from "@/lib/organismes/libelles";
import { SITE_URL } from "@/lib/seo/metadata";
import { getFicheClient } from "@/lib/supabase/queries/admin";
import * as actions from "../actions";

export const metadata: Metadata = { title: "Fiche client" };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const surtitre = "font-mono text-[10.5px] tracking-[0.1em] text-ink-400 uppercase";
const carte = "flex flex-col rounded-[28px] border border-line bg-white p-[clamp(20px,3vw,30px)]";
const titre2 = "text-xl font-extrabold tracking-[-0.02em]";
const th =
  "border-b border-line px-3 py-2.5 text-left font-mono text-[10px] font-medium tracking-[0.1em] text-ink-400 uppercase";
const td = "border-b border-[#F0ECE6] px-3 py-3.5 align-top";
const absent = "text-ink-300";
const PALIERS = ["basique", "correct", "optimal"] as const;
const NOM_PALIER = { basique: "Basique", correct: "Correct", optimal: "Optimal" };

function Entete({ titre, meta }: { titre: string; meta: string }) {
  return (
    <span className="flex items-baseline justify-between gap-3">
      <h2 className={titre2}>{titre}</h2>
      <span className={surtitre}>{meta}</span>
    </span>
  );
}

/** Fiche client (UX Fiche client) : lecture seule du contenu ; seules les actions de modération écrivent. */
export default async function FicheClient({ params }: Props) {
  await exigerAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const f = await getFicheClient(id);
  if (!f) notFound();
  const { organisme: o, lieux, offres, compte } = f;
  const suspendu = o.statut === "suspendu";
  const siege = lieux.find((l) => l.est_siege);
  const rang = PALIERS.indexOf(f.palier);
  const derniersEnvois: Partial<Record<TypeRappel, string>> = {};
  for (const r of [...f.rappels].reverse()) derniersEnvois[r.type as TypeRappel] = dateCourte(r.envoye_le);
  const nomLieu = (lieuId: number) => {
    const l = lieux.find((x) => x.id === lieuId);
    return !l ? null : l.est_siege ? "Siège" : (l.nom ?? l.ville);
  };

  const indexation = suspendu
    ? { label: "Dépubliée", phrase: "Compte suspendu : la fiche n'est visible nulle part." }
    : o.statut === "brouillon"
      ? // Cas absent de la maquette (texte Claude) : email non validé ou minimum publiable non rempli.
        { label: "Non publiée", phrase: "La fiche n'est pas encore en ligne : email non validé ou minimum non rempli." }
      : f.palier === "basique"
        ? { label: "Non indexée", phrase: "La fiche n'apparaît pas dans les résultats de recherche." }
        : { label: "Indexée", phrase: "La fiche apparaît dans les résultats de recherche." };

  const identite: [string, string | null][] = [
    ["Raison sociale", o.raison_sociale],
    ["SIRET", o.siret],
    ["Déclaration d’activité", o.numero_declaration_activite],
    ["Année de création", o.annee_creation ? String(o.annee_creation) : null],
    ["Agrément CNAPS", o.numero_agrement_cnaps],
    ["Qualiopi", o.qualiopi ? ["Certifié", o.numero_qualiopi].filter(Boolean).join(" · ") : null],
    ["Siège", siege ? `${siege.adresse}, ${siege.code_postal} ${siege.ville}` : null],
    ["Téléphone public", o.telephone],
    ["Email public", o.email_contact],
    ["Site web", o.site_web],
    ["Horaires", o.horaires],
    ["Accessibilité PMR", o.accessibilite_pmr ? "Oui" : null],
    ["Langues", o.langues.length ? o.langues.join(" · ") : null],
  ];

  return (
    <>
      <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 px-3 pt-2.5 text-[13px] text-ink-400">
        <Link href="/organismes/" className="font-semibold text-ink-600">
          Fichier client
        </Link>
        <span aria-hidden="true" className="text-line-heavy">
          ›
        </span>
        <span className="font-semibold text-ink-900">{o.nom}</span>
      </nav>

      <section
        className={`flex flex-wrap items-center justify-between gap-x-8 gap-y-5 rounded-[28px] border bg-white p-[clamp(20px,3vw,30px)] ${suspendu ? "border-brique-200" : "border-line"}`}
      >
        <div className="flex min-w-0 flex-[1_1_420px] items-center gap-[18px]">
          <span className="flex size-16 flex-none items-center justify-center rounded-[18px] border border-line bg-cream-200 font-mono text-[17px] text-ink-600">
            {monogramme(o.nom)}
          </span>
          <div className="flex min-w-0 flex-col gap-2">
            <span className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[clamp(26px,3.2vw,40px)] leading-[1.02] font-extrabold tracking-[-0.04em]">
                {o.nom}
              </h1>
              <span
                className={`inline-flex items-center gap-[7px] rounded-full border-[1.5px] px-3 py-1.5 font-mono text-[10.5px] tracking-[0.1em] uppercase ${suspendu ? "border-brique-700 bg-brique-050 text-brique-700" : "border-ink-900 bg-ink-900 text-white"}`}
              >
                <span
                  aria-hidden="true"
                  className={`block size-1.5 rounded-full ${suspendu ? "bg-brique-700" : "bg-brique-400"}`}
                />
                {suspendu ? "Suspendu" : "Actif"}
              </span>
            </span>
            <span className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[13.5px] text-ink-500">
              {siege && <span>{`${siege.ville} (${siege.code_postal.slice(0, 2)})`}</span>}
              {siege && <span className="text-line-heavy">·</span>}
              <span>Inscrit le {dateCourte(o.created_at)}</span>
              <a href={`${SITE_URL}/securite-privee/organismes/${o.slug}/`} className="font-bold">
                Voir la fiche publique →
              </a>
            </span>
          </div>
        </div>
        <ActionsFicheClient
          cible={{ id: o.id, nom: o.nom, statut: o.statut, nbFormations: f.nbFormations, aCompte: !!compte }}
          derniersEnvois={derniersEnvois}
          desabonneLe={o.rappels_desabonne_le ? dateCourte(o.rappels_desabonne_le) : null}
          actions={{ ...actions }}
        />
        {suspendu && (
          <div className="flex flex-[1_1_100%] flex-wrap items-center gap-x-3.5 gap-y-1.5 rounded-2xl border border-brique-200 bg-brique-050 px-4 py-3 text-sm leading-normal">
            <span className="font-mono text-[10.5px] tracking-[0.12em] text-brique-700 uppercase">Compte suspendu</span>
            <span>
              La fiche n&apos;est plus visible sur le site public. L&apos;organisme peut se connecter et voit un message
              de suspension, sans pouvoir agir.
            </span>
          </div>
        )}
      </section>

      <div className="flex flex-wrap items-start gap-3.5">
        <div className="flex min-w-0 flex-[2_1_560px] flex-col gap-3.5">
          <section className="flex flex-wrap items-center justify-between gap-x-8 gap-y-[18px] rounded-[28px] bg-ink-900 p-[clamp(20px,3vw,28px)] text-white">
            <div className="flex flex-col gap-1.5">
              <h2 className="font-mono text-[10.5px] tracking-[0.12em] text-brique-400 uppercase">
                Palier de complétude
              </h2>
              <span className="text-[clamp(40px,5vw,60px)] leading-[0.95] font-extrabold tracking-[-0.05em]">
                {NOM_PALIER[f.palier]}
              </span>
            </div>
            <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-3">
              <span className="grid grid-cols-3 gap-1.5">
                {PALIERS.map((p, i) => (
                  <span key={p} className="flex flex-col gap-[7px]">
                    <span
                      aria-hidden="true"
                      className={`block h-2.5 rounded-full ${i < rang ? "bg-white" : i === rang ? "bg-brique-400" : "bg-line-dark"}`}
                    />
                    <span className={`text-[12.5px] font-bold ${i <= rang ? "text-white" : "text-ink-300"}`}>
                      {NOM_PALIER[p]}
                    </span>
                  </span>
                ))}
              </span>
              <span className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-on-dark">
                <span className="inline-flex items-center gap-[7px] rounded-full border border-line-dark px-[11px] py-[5px] font-mono text-[10.5px] tracking-[0.1em] text-white uppercase">
                  <span aria-hidden="true" className="block size-1.5 rounded-full bg-brique-400" />
                  {indexation.label}
                </span>
                {indexation.phrase}
              </span>
            </div>
          </section>

          <section className={`${carte} gap-[18px]`}>
            <Entete titre="Identité et coordonnées" meta="Depuis Ma fiche" />
            <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] border-t border-[#F0ECE6]">
              {identite.map(([l, v]) => (
                <div key={l} className="flex flex-col gap-1 border-b border-[#F0ECE6] py-[13px] pr-4">
                  <dt className={surtitre}>{l}</dt>
                  {v ? (
                    <dd className="text-[14.5px] leading-[1.45] font-semibold [overflow-wrap:anywhere]">{v}</dd>
                  ) : (
                    <dd className="self-start rounded-lg border-[1.5px] border-dashed border-line-heavy px-[9px] py-0.5 text-[12.5px] font-semibold text-ink-500">
                      Non renseigné
                    </dd>
                  )}
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-2">
              <span className={surtitre}>Lieux additionnels</span>
              {lieux.filter((l) => !l.est_siege).length === 0 && (
                <span className="text-sm text-ink-500">Aucun lieu additionnel.</span>
              )}
              {lieux
                .filter((l) => !l.est_siege)
                .map((l) => (
                  <span
                    key={l.id}
                    className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1 rounded-[14px] border border-line bg-cream-100 px-3.5 py-[11px]"
                  >
                    <span className="text-sm font-bold">{l.nom ?? l.ville}</span>
                    <span className="text-[13.5px] text-ink-500">{`${l.adresse}, ${l.code_postal} ${l.ville}`}</span>
                  </span>
                ))}
            </div>
          </section>

          <section className={`${carte} gap-3.5`}>
            <Entete
              titre="Présentation"
              meta={o.presentation?.trim() ? `${o.presentation.trim().length} caractères` : "Vide"}
            />
            {o.presentation?.trim() ? (
              <p className="max-w-[72ch] text-[15.5px] leading-[1.7] whitespace-pre-line text-ink-700">
                {o.presentation.trim()}
              </p>
            ) : (
              <span className="self-start rounded-xl border-[1.5px] border-dashed border-line-heavy px-3.5 py-2.5 text-sm text-ink-500">
                L&apos;organisme n&apos;a pas rédigé de présentation. Le bloc n&apos;apparaît pas sur sa fiche publique.
              </span>
            )}
          </section>

          <section className={`${carte} gap-3.5`}>
            <Entete
              titre={
                offres.length === 0
                  ? "Formations déclarées"
                  : `${offres.length} formation${offres.length > 1 ? "s déclarées" : " déclarée"}`
              }
              meta="Depuis Mes formations"
            />
            {offres.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-[13.5px]">
                  <thead>
                    <tr>
                      {["Titre", "État", "Prix", "Durée", "Rythme", "Modalités", "Lieux", "Financements"].map((t) => (
                        <th key={t} className={th}>
                          {t}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {offres.map((of) => {
                      const t = of.titres_referentiel;
                      const aCompleter = of.prix_min === null || of.duree_heures === null || of.rythmes.length === 0;
                      const p = prix(of.prix_min, of.prix_max);
                      const lieuxOffre = of.offre_lieux.map((x) => nomLieu(x.lieu_id)).filter(Boolean);
                      return (
                        <tr key={of.id}>
                          <td className={`${td} pl-0`}>
                            {t.statut === "actif" ? (
                              <a
                                href={`${SITE_URL}/securite-privee/${t.slug}/`}
                                className="text-[15px] font-extrabold text-ink-900"
                              >
                                {t.libelle_court}
                              </a>
                            ) : (
                              <span className="flex flex-col gap-0.5">
                                <span className="text-[15px] font-extrabold">{t.libelle_court}</span>
                                <span className="text-xs text-brique-700">Titre archivé</span>
                              </span>
                            )}
                          </td>
                          <td className={td}>
                            <span
                              className={`inline-flex items-center rounded-full border-[1.5px] px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] whitespace-nowrap uppercase ${aCompleter ? "border-dashed border-brique-700 bg-white text-brique-700" : "border-ink-900 bg-ink-900 text-white"}`}
                            >
                              {aCompleter ? "À compléter" : "Complète"}
                            </span>
                          </td>
                          <td className={`${td} font-mono text-[12.5px] whitespace-nowrap ${p ? "" : absent}`}>
                            {p ?? "Non renseigné"}
                          </td>
                          <td
                            className={`${td} font-mono text-[12.5px] whitespace-nowrap ${of.duree_heures ? "" : absent}`}
                          >
                            {of.duree_heures ? `${of.duree_heures} h` : "Non renseignée"}
                          </td>
                          <td className={`${td} ${of.rythmes.length ? "" : absent}`}>
                            {of.rythmes.length
                              ? of.rythmes.map((r) => libelle(RYTHMES, r)).join(" · ")
                              : "Non renseigné"}
                          </td>
                          <td className={`${td} ${of.modalites ? "" : absent}`}>{of.modalites ?? "Non renseignées"}</td>
                          <td className={`${td} text-ink-700`}>{lieuxOffre.join(" · ") || "Siège"}</td>
                          <td className={`${td} pr-0 ${of.financements.length ? "text-ink-700" : absent}`}>
                            {of.financements.length
                              ? of.financements.map((x) => libelle(FINANCEMENTS, x)).join(" · ")
                              : "Non renseignés"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex justify-center rounded-[18px] border-[1.5px] border-dashed border-line-heavy bg-[repeating-linear-gradient(135deg,var(--color-cream-200)_0_7px,var(--color-white)_7px_14px)] p-[26px]">
                <span className="max-w-[60ch] rounded-xl bg-white px-3.5 py-2.5 text-center text-sm leading-[1.6] text-ink-700">
                  <strong className="text-ink-900">Aucune formation déclarée.</strong> Cette fiche n&apos;apparaît dans
                  aucun filtre par titre du catalogue.
                </span>
              </div>
            )}
          </section>
        </div>

        <div className="sticky top-24 flex min-w-0 flex-[1_1_300px] flex-col gap-3.5">
          <section className="flex flex-col gap-3.5 rounded-[28px] border border-line bg-white p-[clamp(20px,3vw,26px)]">
            <span className="flex flex-col gap-1.5">
              <h2 className={titre2}>Informations de compte</h2>
              <span className="text-[12.5px] leading-normal text-ink-500">
                Marquées « usage interne » côté organisme. Jamais affichées sur la fiche publique.
              </span>
            </span>
            <dl className="flex flex-col border-t border-[#F0ECE6]">
              <div className="flex flex-col gap-[3px] border-b border-[#F0ECE6] py-3">
                <dt className={surtitre}>Email de connexion</dt>
                <dd className="text-[14.5px] font-semibold [overflow-wrap:anywhere]">
                  {compte?.email ? (
                    <a href={`mailto:${compte.email}`} className="text-ink-900">
                      {compte.email}
                    </a>
                  ) : (
                    <span className={absent}>Aucun compte de connexion</span>
                  )}
                </dd>
              </div>
              <div className="flex flex-col gap-[3px] border-b border-[#F0ECE6] py-3">
                <dt className={surtitre}>Contact principal</dt>
                <dd className={`text-[14.5px] font-semibold ${compte?.contact_nom ? "" : absent}`}>
                  {compte?.contact_nom ?? "Non renseigné"}
                </dd>
              </div>
              <div className="flex flex-col gap-[3px] border-b border-[#F0ECE6] py-3">
                <dt className={surtitre}>Téléphone direct</dt>
                <dd className="font-mono text-sm">
                  {compte?.contact_telephone ? (
                    <a href={`tel:${compte.contact_telephone.replace(/\s/g, "")}`} className="text-ink-900">
                      {compte.contact_telephone}
                    </a>
                  ) : (
                    <span className={absent}>Non renseigné</span>
                  )}
                </dd>
              </div>
              <div className="flex flex-col gap-[3px] py-3">
                <dt className={surtitre}>Connexion au compte</dt>
                <dd className={`text-[14.5px] font-semibold ${suspendu ? "text-brique-700" : ""}`}>
                  {!compte ? "Aucun compte" : suspendu ? "Message de suspension affiché" : "Autorisée"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="flex flex-col gap-3.5 rounded-[28px] border border-line bg-white p-[clamp(20px,3vw,26px)]">
            <h2 className={titre2}>Historique</h2>
            <ol className="flex flex-col">
              {[
                ...f.rappels.map((r) => ({
                  label: TYPES_RAPPEL.find((t) => t.type === r.type)?.libelle ?? r.type,
                  date: r.envoye_le,
                  inscription: false,
                })),
                { label: "Inscription", date: o.created_at, inscription: true },
              ].map((h, i) => (
                <li key={i} className="grid grid-cols-[14px_minmax(0,1fr)] gap-x-3.5">
                  <span aria-hidden="true" className="flex flex-col items-center">
                    <span
                      className={`mt-[5px] block size-2.5 flex-none rounded-full ${h.inscription ? "bg-line-heavy" : "bg-ink-900"}`}
                    />
                    <span className={`my-1 block w-px flex-1 ${h.inscription ? "" : "bg-line"}`} />
                  </span>
                  <span className="flex flex-col gap-0.5 pb-4">
                    <span className="text-sm leading-[1.4] font-bold">{h.label}</span>
                    <span className="font-mono text-[11.5px] text-ink-500">{dateCourte(h.date)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}
