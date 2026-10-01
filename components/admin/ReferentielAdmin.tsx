"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import type { RetourReferentiel } from "@/app/admin/(connecte)/referentiel/actions";
import { intituleDejaPris, slugIndisponible, slugTitre, titresProches } from "@/lib/referentiel-admin";
import { ToastAdmin } from "./Moderation";

type Titre = {
  id: number;
  slug: string;
  libelle_court: string;
  libelle_long: string;
  categorie: string;
  nbOrganismes: number;
};
type Demande = {
  id: number;
  intitule: string;
  demandeLe: string;
  organisme: { id: string; nom: string };
  email: string | null;
};
type Saisie = { intitule: string; categorie: string };
type Actions = {
  ajouterTitre: (s: Saisie) => Promise<RetourReferentiel>;
  modifierTitre: (id: number, s: Saisie) => Promise<RetourReferentiel>;
  accepterDemande: (id: number, s: Saisie) => Promise<RetourReferentiel>;
  refuserDemande: (
    id: number,
    r: { motif: "deja_present" | "hors_perimetre"; existantId: number | null },
  ) => Promise<RetourReferentiel>;
  archiverTitre: (id: number, d: { remplacePar: number | null; proche: number | null }) => Promise<RetourReferentiel>;
};

const champ =
  "rounded-[14px] border border-line-field bg-white px-3.5 py-3 text-[15px] text-ink-900 outline-none focus:border-ink-900";
const bContour =
  "cursor-pointer rounded-full border border-line-field bg-transparent px-[18px] py-[11px] text-sm font-bold text-ink-900 hover:border-ink-900";
const bPlein = (fond: string) =>
  `cursor-pointer rounded-full px-5 py-[11px] text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-line-heavy ${fond}`;
const mono = "font-mono text-[10px] tracking-[0.1em] text-ink-400 uppercase";
const sansAccent = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
const dateCourte = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));

function Proches({ noms }: { noms: string[] }) {
  if (!noms.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[14px] bg-cream-100 px-3.5 py-3 text-[13.5px]">
      <span className="font-bold">Titres proches déjà au référentiel :</span>
      {noms.map((n) => (
        <span key={n} className="rounded-full border border-line-field bg-white px-2.5 py-[3px] font-bold">
          {n}
        </span>
      ))}
    </div>
  );
}

function ChampsTitre({
  saisie,
  onChange,
  categories,
  libelle = "Intitulé",
  aide,
  placeholder,
  avecVide = true,
}: {
  saisie: Saisie;
  onChange: (s: Saisie) => void;
  categories: string[];
  libelle?: string;
  aide?: string;
  placeholder?: string;
  avecVide?: boolean;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3.5">
      <label className="flex flex-col gap-[7px]">
        <span className="text-[13px] font-bold">{libelle}</span>
        <input
          type="text"
          placeholder={placeholder}
          value={saisie.intitule}
          onChange={(e) => onChange({ ...saisie, intitule: e.target.value })}
          className={champ}
        />
        {aide && <span className="text-[12.5px] text-ink-500">{aide}</span>}
      </label>
      <label className="flex flex-col gap-[7px]">
        <span className="text-[13px] font-bold">Catégorie de rattachement</span>
        <select
          value={saisie.categorie}
          onChange={(e) => onChange({ ...saisie, categorie: e.target.value })}
          className={champ}
        >
          {avecVide && <option value="">Choisir une catégorie</option>}
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function Url({ intitule, titres }: { intitule: string; titres: Titre[] }) {
  const slug = slugTitre(intitule);
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-ink-500">
      <span className={mono}>URL page pilier</span>
      <span className="font-mono text-[12.5px] text-ink-900">/securite-privee/{slug || "…"}/</span>
      {intitule.trim() && slugIndisponible(slug, titres) && (
        <span className="font-bold text-brique-700">Slug déjà pris ou réservé.</span>
      )}
    </span>
  );
}

/** Référentiel des titres (UX Référentiel des titres) : liste fermée, ajout et modification, arbitrage des demandes. */
export function ReferentielAdmin({
  titres,
  demandes,
  ongletInitial,
  actions: a,
}: {
  titres: Titre[];
  demandes: Demande[];
  ongletInitial: "liste" | "demandes";
  actions: Actions;
}) {
  const router = useRouter();
  const [enCours, demarrer] = useTransition();
  const [onglet, setOnglet] = useState(ongletInitial);
  const [q, setQ] = useState("");
  const [ajout, setAjout] = useState<Saisie | null>(null);
  const [edition, setEdition] = useState<(Saisie & { id: number }) | null>(null);
  const [arbitrage, setArbitrage] = useState<{ id: number; mode: "accepter" | "refuser"; saisie: Saisie } | null>(null);
  const [archivage, setArchivage] = useState({ remplacePar: "", proche: "" });
  const [refus, setRefus] = useState<{ motif: "" | "deja_present" | "hors_perimetre"; existant: string }>({
    motif: "",
    existant: "",
  });
  const [erreur, setErreur] = useState("");
  const [toast, setToast] = useState("");
  const fermerToast = useCallback(() => setToast(""), []);
  const categories = [...new Set(titres.map((t) => t.categorie))];

  const changerOnglet = (o: "liste" | "demandes") => {
    setOnglet(o);
    window.history.replaceState(null, "", `?onglet=${o}`);
  };
  const lancer = (f: () => Promise<RetourReferentiel>, apres: () => void) =>
    demarrer(async () => {
      setErreur("");
      const r = await f();
      if (!r.ok) return setErreur(r.erreur);
      apres();
      setToast(r.message);
      router.refresh();
    });
  const invalide = (s: Saisie, sauf?: number) =>
    !s.intitule.trim() ||
    !s.categorie ||
    intituleDejaPris(s.intitule, titres, sauf) ||
    (sauf === undefined && slugIndisponible(slugTitre(s.intitule), titres));
  const Erreur = () =>
    erreur ? (
      <span role="alert" className="text-[13px] font-bold text-brique-700">
        {erreur}
      </span>
    ) : null;

  const nq = sansAccent(q.trim());
  const groupes = categories
    .map((c) => ({
      categorie: c,
      titres: titres.filter(
        (t) => t.categorie === c && (!nq || sansAccent(`${t.libelle_court} ${t.libelle_long} ${t.slug}`).includes(nq)),
      ),
    }))
    .filter((g) => g.titres.length);

  return (
    <>
      <section className="sticky top-[84px] z-20 flex flex-wrap items-center gap-2.5 rounded-3xl border border-line bg-white p-2.5 shadow-[0_10px_24px_-20px_rgba(11,11,11,0.35)]">
        <span role="tablist" className="flex gap-[3px] rounded-full border border-line bg-cream-100 p-[3px]">
          <button
            type="button"
            role="tab"
            aria-selected={onglet === "liste"}
            onClick={() => changerOnglet("liste")}
            className={`cursor-pointer rounded-full px-4 py-2.5 text-sm font-bold whitespace-nowrap ${onglet === "liste" ? "bg-ink-900 text-white" : "text-ink-700"}`}
          >
            Liste des titres
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={onglet === "demandes"}
            onClick={() => changerOnglet("demandes")}
            className={`flex cursor-pointer items-center gap-2 rounded-full py-2.5 pr-3 pl-4 text-sm font-bold whitespace-nowrap ${onglet === "demandes" ? "bg-ink-900 text-white" : "text-ink-700"}`}
          >
            Demandes en attente
            <span
              className={`min-w-[22px] rounded-full px-[7px] py-[3px] text-center font-mono text-[11.5px] text-white ${demandes.length ? "bg-brique-700" : "bg-ink-200"}`}
            >
              {demandes.length}
            </span>
          </button>
        </span>
        {onglet === "liste" && (
          <>
            <label className="flex min-w-0 flex-[1_1_240px] items-center gap-3 rounded-full border border-line-strong bg-cream-100 px-[18px]">
              <span
                aria-hidden="true"
                className="block size-[11px] flex-none rounded-full border-[1.5px] border-ink-300"
              />
              <input
                type="search"
                aria-label="Rechercher un titre"
                placeholder="Rechercher un titre, un slug"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="min-w-0 flex-1 bg-transparent py-3 text-[14.5px] outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => (setAjout({ intitule: "", categorie: "" }), setEdition(null), setErreur(""))}
              className="ml-auto inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-brique-700 px-5 py-3 text-sm font-bold whitespace-nowrap text-white hover:bg-ink-900"
            >
              <span aria-hidden="true" className="text-lg leading-none font-medium">
                +
              </span>
              Ajouter un titre
            </button>
          </>
        )}
      </section>

      {onglet === "liste" && (
        <>
          {ajout && (
            <section className="flex flex-col gap-[18px] rounded-[28px] border-[1.5px] border-ink-900 bg-white p-[clamp(18px,2.4vw,28px)]">
              <span className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-[22px] font-extrabold tracking-[-0.02em]">Nouveau titre</h2>
                <span className="text-[13px] text-ink-500">
                  Le titre sera disponible immédiatement dans Mes formations.
                </span>
              </span>
              <ChampsTitre
                saisie={ajout}
                onChange={setAjout}
                categories={categories}
                placeholder="Libellé court, acronyme officiel"
              />
              <Url intitule={ajout.intitule} titres={titres} />
              <Proches noms={titresProches(ajout.intitule, titres)} />
              <Erreur />
              <span className="flex flex-wrap justify-end gap-2.5">
                <button type="button" className={bContour} onClick={() => setAjout(null)}>
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={invalide(ajout) || enCours}
                  onClick={() =>
                    lancer(
                      () => a.ajouterTitre(ajout),
                      () => setAjout(null),
                    )
                  }
                  className={bPlein("bg-brique-700 hover:bg-ink-900")}
                >
                  Ajouter au référentiel
                </button>
              </span>
            </section>
          )}

          <section className="flex flex-col gap-[22px] rounded-[28px] border border-line bg-white p-[clamp(14px,2vw,22px)]">
            {groupes.map((g, i) => (
              <div key={g.categorie} className="flex flex-col">
                <span className="flex items-baseline justify-between gap-3 border-b border-ink-900 px-2 pt-1.5 pb-2.5">
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] text-brique-700">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="text-lg font-extrabold tracking-[-0.015em]">{g.categorie}</h2>
                  </span>
                  <span className="font-mono text-[11px] text-ink-400">
                    {g.titres.length} titre{g.titres.length > 1 ? "s" : ""}
                  </span>
                </span>
                {g.titres.map((t) =>
                  edition?.id === t.id ? (
                    <div key={t.id} className="border-b border-[#F0ECE6]">
                      <div className="my-2.5 flex flex-col gap-3.5 rounded-[20px] border-[1.5px] border-ink-900 bg-cream-100 p-[18px]">
                        <ChampsTitre
                          saisie={edition}
                          onChange={(s) => setEdition({ ...edition, ...s })}
                          categories={categories}
                          avecVide={false}
                        />
                        <span className="text-[13px] text-ink-500">
                          Slug conservé : <span className="font-mono text-ink-900">/securite-privee/{t.slug}/</span>
                        </span>
                        {(edition.intitule.trim() !== t.libelle_court || edition.categorie !== t.categorie) && (
                          <p className="rounded-[14px] bg-white px-3.5 py-3 text-[13.5px] leading-[1.55] text-pretty">
                            <strong>
                              {t.nbOrganismes === 0
                                ? "Aucune offre déclarée sur ce titre."
                                : `Répercuté sur les offres de ${t.nbOrganismes} organisme${t.nbOrganismes > 1 ? "s" : ""}.`}
                            </strong>{" "}
                            La modification s&apos;applique immédiatement, ainsi que sur la page pilier publique.
                          </p>
                        )}
                        <Erreur />
                        <span className="flex flex-wrap items-center justify-end gap-2.5">
                          <span className="mr-auto text-[12.5px] text-ink-500">
                            Un titre ne peut pas être supprimé.
                          </span>
                          <button type="button" className={bContour} onClick={() => setEdition(null)}>
                            Annuler
                          </button>
                          <button
                            type="button"
                            disabled={
                              enCours ||
                              invalide(edition, t.id) ||
                              (edition.intitule.trim() === t.libelle_court && edition.categorie === t.categorie)
                            }
                            onClick={() =>
                              lancer(
                                () => a.modifierTitre(t.id, edition),
                                () => setEdition(null),
                              )
                            }
                            className={bPlein("bg-ink-900 hover:bg-brique-700")}
                          >
                            Enregistrer
                          </button>
                        </span>
                        {/* Archivage : hors maquette (décisions Erwan, section 5.2 de la note de passation). */}
                        <details className="border-t border-line pt-3">
                          <summary className="cursor-pointer text-[13px] font-bold text-brique-700">
                            Archiver ce titre
                          </summary>
                          <div className="mt-3 flex flex-col gap-3">
                            <p className="text-[13px] leading-[1.55] text-ink-700">
                              Le titre disparaît des listes, des filtres et de Mes formations. Les offres déclarées
                              {t.nbOrganismes
                                ? ` (${t.nbOrganismes} organisme${t.nbOrganismes > 1 ? "s" : ""})`
                                : ""}{" "}
                              sont conservées mais masquées sur le site. Remplacé : sa page redirige définitivement vers
                              le remplaçant. Sinon, elle indique que le titre n&apos;est plus délivré.
                            </p>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3">
                              {(
                                [
                                  ["remplacePar", "Remplacé par"],
                                  ["proche", "Titre proche (si aucun remplaçant)"],
                                ] as const
                              ).map(([k, l]) => (
                                <label key={k} className="flex flex-col gap-[7px]">
                                  <span className="text-[13px] font-bold">{l}</span>
                                  <select
                                    value={archivage[k]}
                                    disabled={k === "proche" && !!archivage.remplacePar}
                                    onChange={(e) => setArchivage({ ...archivage, [k]: e.target.value })}
                                    className={champ}
                                  >
                                    <option value="">Aucun</option>
                                    {titres
                                      .filter((x) => x.id !== t.id)
                                      .map((x) => (
                                        <option key={x.id} value={x.id}>
                                          {x.libelle_court}
                                        </option>
                                      ))}
                                  </select>
                                </label>
                              ))}
                            </div>
                            <button
                              type="button"
                              disabled={enCours}
                              onClick={() =>
                                lancer(
                                  () =>
                                    a.archiverTitre(t.id, {
                                      remplacePar: archivage.remplacePar ? Number(archivage.remplacePar) : null,
                                      proche: archivage.proche ? Number(archivage.proche) : null,
                                    }),
                                  () => setEdition(null),
                                )
                              }
                              className={`${bPlein("bg-brique-700 hover:bg-ink-900")} self-start`}
                            >
                              Archiver le titre
                            </button>
                          </div>
                        </details>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={t.id}
                      className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#F0ECE6] px-2 py-3.5"
                    >
                      <span className="flex min-w-0 flex-[1_1_320px] flex-col gap-[3px]">
                        <span className="text-base font-extrabold tracking-[-0.01em]">{t.libelle_court}</span>
                        <span className="text-[13px] leading-[1.45] text-pretty text-ink-500">
                          {t.libelle_long !== t.libelle_court
                            ? t.libelle_long
                            : "Libellé long à rédiger avec la page pilier"}
                        </span>
                      </span>
                      <span className="min-w-0 flex-[0_1_190px] font-mono text-xs [overflow-wrap:anywhere] text-ink-500">
                        /securite-privee/{t.slug}/
                      </span>
                      <span className="flex flex-[0_0_120px] items-baseline justify-end gap-1.5">
                        <span className="font-mono text-lg tracking-[-0.03em]">{t.nbOrganismes}</span>
                        <span className="text-[12.5px] text-ink-500">
                          {t.nbOrganismes > 1 ? "organismes" : "organisme"}
                        </span>
                      </span>
                      <button
                        type="button"
                        aria-label={`Modifier ${t.libelle_court}`}
                        onClick={() => (
                          setEdition({ id: t.id, intitule: t.libelle_court, categorie: t.categorie }),
                          setArchivage({ remplacePar: "", proche: "" }),
                          setAjout(null),
                          setErreur("")
                        )}
                        className="flex-none cursor-pointer rounded-full border border-line-field px-3.5 py-2 text-[13px] font-bold hover:border-ink-900"
                      >
                        Modifier
                      </button>
                    </div>
                  ),
                )}
              </div>
            ))}
            {groupes.length === 0 && (
              <div className="flex justify-center rounded-[18px] border-[1.5px] border-dashed border-line-heavy bg-[repeating-linear-gradient(135deg,var(--color-cream-200)_0_7px,var(--color-white)_7px_14px)] p-7">
                <span className="rounded-xl bg-white px-3.5 py-2.5 text-sm text-ink-700">
                  Aucun titre ne correspond à cette recherche.
                </span>
              </div>
            )}
            <span className="px-2 text-[12.5px] leading-normal text-ink-500">
              Le contenu réglementaire des pages piliers ne se gère pas depuis cette page (point ouvert, V2).
            </span>
          </section>
        </>
      )}

      {onglet === "demandes" && (
        <section className="flex flex-col gap-3 rounded-[28px] border border-line bg-white p-[clamp(14px,2vw,22px)]">
          <span className="flex flex-wrap items-center justify-between gap-2 px-1.5 py-1">
            <h2 className="text-[15px] font-bold">
              {demandes.length === 0
                ? "Aucune demande"
                : demandes.length === 1
                  ? "1 demande à arbitrer"
                  : `${demandes.length} demandes à arbitrer`}
            </h2>
            <span className="font-mono text-[11px] text-ink-400">Tri : la plus ancienne d&apos;abord</span>
          </span>
          {demandes.map((d) => {
            const ouvert = arbitrage?.id === d.id ? arbitrage : null;
            const jours = Math.floor((Date.now() - new Date(d.demandeLe).getTime()) / 86_400_000);
            const email = d.email ?? "l'organisme (aucun compte)";
            return (
              <article
                key={d.id}
                className={`flex flex-col gap-4 rounded-[22px] border bg-white p-[clamp(16px,2vw,22px)] ${ouvert ? "border-ink-900" : "border-line"}`}
              >
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5">
                  <span className="flex min-w-0 flex-[1_1_320px] flex-col gap-1.5">
                    <span className={mono}>Intitulé saisi par l&apos;organisme</span>
                    <span className="text-[clamp(19px,2vw,23px)] leading-[1.2] font-extrabold tracking-[-0.02em]">
                      « {d.intitule} »
                    </span>
                    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13.5px] text-ink-500">
                      <Link href={`/organismes/${d.organisme.id}/`} className="font-bold text-ink-900">
                        {d.organisme.nom}
                      </Link>
                      <span className="text-ink-200">·</span>
                      <span>Demandé le {dateCourte(d.demandeLe)}</span>
                      <span className={`font-mono text-[11.5px] ${jours >= 7 ? "text-brique-700" : "text-ink-400"}`}>
                        {jours === 0 ? "aujourd'hui" : jours === 1 ? "il y a 1 jour" : `il y a ${jours} jours`}
                      </span>
                    </span>
                  </span>
                  {!ouvert && (
                    <span className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => (
                          setArbitrage({ id: d.id, mode: "accepter", saisie: { intitule: d.intitule, categorie: "" } }),
                          setErreur("")
                        )}
                        className="cursor-pointer rounded-full bg-ink-900 px-5 py-[11px] text-sm font-bold text-white hover:bg-brique-700"
                      >
                        Accepter
                      </button>
                      <button
                        type="button"
                        onClick={() => (
                          setArbitrage({ id: d.id, mode: "refuser", saisie: { intitule: "", categorie: "" } }),
                          setRefus({ motif: "", existant: "" }),
                          setErreur("")
                        )}
                        className={bContour}
                      >
                        Refuser
                      </button>
                    </span>
                  )}
                </div>
                <Proches noms={titresProches(d.intitule, titres)} />

                {ouvert?.mode === "accepter" && (
                  <div className="flex flex-col gap-4 border-t border-line pt-[18px]">
                    <span className="text-base font-extrabold">Relire avant validation</span>
                    <ChampsTitre
                      saisie={ouvert.saisie}
                      onChange={(s) => setArbitrage({ ...ouvert, saisie: s })}
                      categories={categories}
                      libelle="Intitulé retenu"
                      aide="Corrigez l'orthographe et normalisez l'intitulé si besoin."
                    />
                    <Url intitule={ouvert.saisie.intitule} titres={titres} />
                    <ul className="flex list-disc flex-col gap-1.5 rounded-[14px] bg-cream-100 py-3.5 pr-4 pl-[34px] text-[13.5px] leading-normal text-ink-700">
                      <li>Le titre devient disponible dans Mes formations pour tous les organismes.</li>
                      <li>
                        Aucune offre n&apos;est rattachée automatiquement : {d.organisme.nom} devra cocher le titre
                        depuis Mes formations.
                      </li>
                      <li>
                        Email d&apos;acceptation envoyé à{" "}
                        <span className="font-mono text-[12.5px] text-ink-900">{email}</span>
                      </li>
                    </ul>
                    <Erreur />
                    <span className="flex flex-wrap justify-end gap-2.5">
                      <button type="button" className={bContour} onClick={() => setArbitrage(null)}>
                        Annuler
                      </button>
                      <button
                        type="button"
                        disabled={invalide(ouvert.saisie) || enCours}
                        onClick={() =>
                          lancer(
                            () => a.accepterDemande(d.id, ouvert.saisie),
                            () => setArbitrage(null),
                          )
                        }
                        className={bPlein("bg-ink-900 hover:bg-brique-700")}
                      >
                        Créer le titre et envoyer l&apos;email
                      </button>
                    </span>
                  </div>
                )}
                {ouvert?.mode === "refuser" && (
                  <div className="flex flex-col gap-3.5 border-t border-line pt-[18px]">
                    <span className="text-base font-extrabold">Motif du refus</span>
                    <div role="radiogroup" aria-label="Motif du refus" className="flex flex-col gap-2">
                      {(
                        [
                          ["deja_present", "Déjà présent au référentiel, sous un autre intitulé"],
                          ["hors_perimetre", "Hors périmètre de la sécurité privée"],
                        ] as const
                      ).map(([m, l]) => (
                        <button
                          key={m}
                          type="button"
                          role="radio"
                          aria-checked={refus.motif === m}
                          onClick={() => setRefus({ ...refus, motif: m })}
                          className={`flex cursor-pointer items-center gap-3.5 rounded-[14px] border-[1.5px] px-4 py-3 text-left text-[14.5px] font-bold ${refus.motif === m ? "border-ink-900 bg-white" : "border-line bg-cream-100"}`}
                        >
                          <span
                            className={`flex size-5 flex-none items-center justify-center rounded-full border-[1.5px] ${refus.motif === m ? "border-ink-900" : "border-line-heavy"}`}
                          >
                            <span className={`block size-2.5 rounded-full ${refus.motif === m ? "bg-ink-900" : ""}`} />
                          </span>
                          {l}
                        </button>
                      ))}
                    </div>
                    {refus.motif === "deja_present" && (
                      <label className="flex flex-col gap-[7px]">
                        <span className="text-[13px] font-bold">Titre déjà présent</span>
                        <select
                          value={refus.existant}
                          onChange={(e) => setRefus({ ...refus, existant: e.target.value })}
                          className={champ}
                        >
                          <option value="">Choisir le titre</option>
                          {titres.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.libelle_court}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    <p className="text-sm leading-[1.55] text-pretty text-ink-700">
                      La demande sera classée refusée et aucun titre ne sera créé. Email de refus envoyé à{" "}
                      <span className="font-mono text-[12.5px] text-ink-900">{email}</span>
                    </p>
                    <Erreur />
                    <span className="flex flex-wrap justify-end gap-2.5">
                      <button type="button" className={bContour} onClick={() => setArbitrage(null)}>
                        Annuler
                      </button>
                      <button
                        type="button"
                        disabled={enCours || !refus.motif || (refus.motif === "deja_present" && !refus.existant)}
                        onClick={() =>
                          refus.motif &&
                          lancer(
                            () =>
                              a.refuserDemande(d.id, {
                                motif: refus.motif as "deja_present" | "hors_perimetre",
                                existantId: refus.existant ? Number(refus.existant) : null,
                              }),
                            () => setArbitrage(null),
                          )
                        }
                        className={bPlein("bg-brique-700 hover:bg-ink-900")}
                      >
                        Refuser et envoyer l&apos;email
                      </button>
                    </span>
                  </div>
                )}
              </article>
            );
          })}
          {demandes.length === 0 && (
            <div className="flex justify-center rounded-[18px] border-[1.5px] border-dashed border-line-heavy bg-[repeating-linear-gradient(135deg,var(--color-cream-200)_0_7px,var(--color-white)_7px_14px)] p-9">
              <span className="rounded-xl bg-white px-3.5 py-2.5 text-sm text-ink-700">Aucune demande en attente.</span>
            </div>
          )}
        </section>
      )}
      {toast && <ToastAdmin message={toast} onFermer={fermerToast} />}
    </>
  );
}
