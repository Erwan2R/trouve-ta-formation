"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FORMATIONS as F, SYNONYMES } from "@/contenu/espace/formations";
import { FINANCEMENTS, RYTHMES, prix } from "@/lib/organismes/libelles";
import type { Retour } from "@/lib/supabase/queries/apres-enregistrement";
import type { DetailOffre } from "@/app/partenaires/(connecte)/formations/actions";

export type TitreModale = {
  id: number;
  slug: string;
  court: string;
  long: string;
  duree: string | null;
  categorie: string;
};
export type OffreVue = {
  id: string;
  titre: TitreModale & { archive: boolean; remplacant: { id: number; court: string } | null; lienPage: string | null };
  prixMin: number | null;
  prixMax: number | null;
  duree: number | null;
  rythmes: string[];
  financements: string[];
  lieux: number[];
};
export type LieuVue = { id: number; nom: string; adresse: string };

type Actions = {
  ajouterOffres: (ids: number[]) => Promise<Retour>;
  enregistrerOffre: (d: DetailOffre) => Promise<Retour>;
  retirerOffre: (id: string) => Promise<Retour>;
  demanderTitre: (t: string) => Promise<Retour>;
};

const manquants = (o: { prixMin: unknown; duree: unknown; rythmes: string[] }) =>
  [
    o.prixMin === null || o.prixMin === "" ? "prix" : null,
    o.duree === null || o.duree === "" ? "durée" : null,
    o.rythmes.length ? null : "rythme",
  ].filter((x): x is string => !!x);
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const surtitre = "font-mono text-[10.5px] tracking-[0.12em] uppercase";

function Case({ coche, desactive }: { coche: boolean; desactive?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-[22px] flex-none items-center justify-center rounded-[7px] border-[1.5px] ${desactive ? "border-line-heavy bg-line-heavy" : coche ? "border-ink-900 bg-ink-900" : "border-line-heavy bg-white"}`}
    >
      <span className="block size-2 rounded-[2px] bg-white" />
    </span>
  );
}

function Fermer({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Fermer"
      onClick={onClick}
      className="flex size-10 flex-none cursor-pointer items-center justify-center rounded-full border border-line bg-cream-100 text-xl leading-none hover:border-ink-900"
    >
      ×
    </button>
  );
}

export function MesFormations({
  offres,
  groupes,
  lieux,
  actions: a,
  enTete = true,
}: {
  offres: OffreVue[];
  groupes: { categorie: string; titres: TitreModale[] }[];
  lieux: LieuVue[];
  actions: Actions;
  /** false dans l'accompagnement à l'inscription : la page d'étape porte déjà le titre. */
  enTete?: boolean;
}) {
  const [toast, setToast] = useState<string | null>(null);
  const [ajout, setAjout] = useState<{ q: string; sel: number[]; demande: string | null } | null>(null);
  const [edition, setEdition] = useState<(DetailOffre & { erreur?: string; fourchette: boolean }) | null>(null);
  const [confirmer, setConfirmer] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();
  // Sous-domaine réécrit : revalidatePath ne rafraîchit pas la page affichée, on le demande explicitement.
  const router = useRouter();
  const multiSite = lieux.length > 1;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    document.body.style.overflow = ajout || edition ? "hidden" : "";
    const echap = (e: KeyboardEvent) => e.key === "Escape" && (setAjout(null), setEdition(null));
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
  }, [ajout, edition]);

  const lancer = (action: () => Promise<Retour>, succes: () => void) =>
    demarrer(async () => {
      const r = await action();
      if (!r.ok) return setToast(r.erreur);
      succes();
      router.refresh();
    });

  const actives = offres.filter((o) => !o.titre.archive);
  const n = actives.length;
  const completes = actives.filter((o) => manquants(o).length === 0).length;
  const declares = new Set(offres.map((o) => o.titre.id));
  const nomDe = (id: number) => groupes.flatMap((g) => g.titres).find((t) => t.id === id)?.court ?? "";
  const q = norm(ajout?.q.trim() ?? "");
  const groupesFiltres = groupes
    .map((g) => ({
      ...g,
      titres: g.titres.filter((t) => !q || norm(`${t.court} ${t.long} ${SYNONYMES[t.slug] ?? ""}`).includes(q)),
    }))
    .filter((g) => g.titres.length);
  const ouvrirAjout = () => {
    setConfirmer(null);
    setAjout({ q: "", sel: [], demande: null });
  };

  const boutonAjout = (grand = false) => (
    <button
      type="button"
      onClick={ouvrirAjout}
      className={`inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-ink-900 font-bold text-white hover:bg-brique-700 ${grand ? "mt-1.5 px-7 py-[18px] text-base" : "px-6 py-4 text-[15px]"}`}
    >
      <span aria-hidden="true" className="text-lg leading-none text-brique-400">
        +
      </span>
      Ajouter une formation
    </button>
  );

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-[clamp(6px,1vw,12px)] pt-[clamp(18px,3vw,36px)] pb-[clamp(4px,1vw,10px)]">
        <div className="flex flex-col gap-2.5">
          {enTete && (
            <h1 className="text-[clamp(34px,4.6vw,60px)] leading-[0.98] font-extrabold tracking-[-0.045em]">
              Mes formations
            </h1>
          )}
          <span className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
            <span className="text-[17px] font-bold tracking-[-0.01em]">{F.compte(n)}</span>
            {n > 0 && <span className="font-mono text-[11.5px] text-ink-500">{F.repartition(completes, n)}</span>}
          </span>
        </div>
        {boutonAjout()}
      </section>

      {offres.length > 0 ? (
        <ol className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-3.5">
          {offres.map((o) => {
            const m = manquants(o);
            const incomplete = m.length > 0;
            const confirme = confirmer === o.id;
            const prixTexte = prix(o.prixMin, o.prixMax);
            const lignes = [
              ["Prix", prixTexte, "Non renseigné"],
              ["Durée réelle", o.duree ? `${o.duree} h` : null, "Non renseignée"],
              ["Rythme", o.rythmes.map((r) => RYTHMES[r as keyof typeof RYTHMES]).join(" · ") || null, "Non renseigné"],
            ] as const;
            const intitule = (
              <>
                <span className="text-[26px] leading-[1.05] font-extrabold tracking-[-0.035em]">{o.titre.court}</span>
                <span className="text-[13.5px] leading-[1.45] text-ink-500">
                  {o.titre.long}
                  {o.titre.lienPage && " →"}
                </span>
              </>
            );
            return (
              <li
                key={o.id}
                className={`flex flex-col gap-[18px] rounded-[26px] border bg-white p-6 ${confirme ? "border-brique-200" : incomplete ? "border-line-strong" : "border-line"}`}
              >
                <span className="flex items-center justify-between gap-2.5">
                  <span className={`text-ink-400 ${surtitre}`}>{o.titre.categorie}</span>
                  {o.titre.archive ? (
                    <span className="inline-flex items-center rounded-full border-[1.5px] border-dashed border-ink-300 px-[11px] py-1 font-mono text-[10.5px] tracking-[0.08em] text-ink-500 uppercase">
                      Titre archivé
                    </span>
                  ) : incomplete ? (
                    <span className="inline-flex items-center gap-[7px] rounded-full border-[1.5px] border-dashed border-brique-700 px-[11px] py-1 font-mono text-[10.5px] tracking-[0.08em] text-brique-700 uppercase">
                      À compléter
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-[7px] rounded-full bg-ink-900 px-[11px] py-[5px] font-mono text-[10.5px] tracking-[0.08em] text-white uppercase">
                      <span aria-hidden="true" className="block size-1.5 rounded-full bg-brique-400" />
                      Complète
                    </span>
                  )}
                </span>
                {o.titre.lienPage ? (
                  <a href={o.titre.lienPage} className="flex flex-col gap-1 text-ink-900 hover:text-ink-900">
                    {intitule}
                  </a>
                ) : (
                  <span className="flex flex-col gap-1">{intitule}</span>
                )}
                {o.titre.archive && (
                  <div className="flex flex-col items-start gap-3 rounded-2xl border border-line-strong bg-cream-100 px-4 py-3 text-[13.5px] leading-[1.55]">
                    <p>{o.titre.remplacant ? F.remplace(o.titre.remplacant.court) : F.archive}</p>
                    {o.titre.remplacant && (
                      <button
                        type="button"
                        disabled={enCours}
                        onClick={() => {
                          const r = o.titre.remplacant!;
                          lancer(
                            () => a.ajouterOffres([r.id]),
                            () => setToast(F.toast.ajout([r.court])),
                          );
                        }}
                        className="cursor-pointer rounded-full bg-ink-900 px-[18px] py-2.5 text-sm font-bold text-white hover:bg-brique-700 disabled:cursor-default disabled:bg-line disabled:text-ink-400"
                      >
                        {F.ajouterRemplacant(o.titre.remplacant.court)}
                      </button>
                    )}
                  </div>
                )}
                <div className="flex flex-col border-t border-cream-200">
                  {lignes.map(([etiquette, valeur, vide]) => (
                    <span
                      key={etiquette}
                      className="flex items-center justify-between gap-3 border-b border-cream-200 py-[11px]"
                    >
                      <span className={`text-ink-400 ${surtitre} tracking-[0.1em]`}>{etiquette}</span>
                      {valeur ? (
                        <span className="text-right text-[14.5px] font-bold">{valeur}</span>
                      ) : (
                        <span className="rounded-lg border-[1.5px] border-dashed border-line-heavy px-[9px] py-[3px] text-[12.5px] font-semibold text-ink-500">
                          {vide}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
                {multiSite && (
                  <span className="flex flex-wrap gap-1.5">
                    {(o.lieux.length ? lieux.filter((l) => o.lieux.includes(l.id)) : lieux.slice(0, 1)).map((l) => (
                      <span
                        key={l.id}
                        className="inline-flex items-center gap-[7px] rounded-full bg-cream-200 px-3 py-1.5 text-[12.5px] font-semibold text-ink-700"
                      >
                        <span aria-hidden="true" className="block size-[5px] rounded-full bg-brique-700" />
                        {l.nom}
                      </span>
                    ))}
                  </span>
                )}
                {confirme ? (
                  <div className="mt-auto flex flex-col gap-3 rounded-[18px] border border-brique-200 bg-brique-050 p-4">
                    <span className="text-[14.5px] font-bold">Retirer le {o.titre.court} de votre fiche ?</span>
                    {n === 1 && !o.titre.archive && (
                      <span className="text-[13.5px] leading-[1.55]">
                        {F.derniere}{" "}
                        <button
                          type="button"
                          onClick={ouvrirAjout}
                          className="cursor-pointer font-bold text-brique-700 underline decoration-brique-200 underline-offset-[3px]"
                        >
                          Ajouter une autre formation
                        </button>
                      </span>
                    )}
                    <span className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={enCours}
                        onClick={() =>
                          lancer(
                            () => a.retirerOffre(o.id),
                            () => {
                              setConfirmer(null);
                              setToast(F.toast.retrait(o.titre.court, n === 1 && !o.titre.archive));
                            },
                          )
                        }
                        className="cursor-pointer rounded-full bg-brique-700 px-4 py-2.5 text-[13.5px] font-bold text-white hover:bg-ink-900"
                      >
                        Retirer
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmer(null)}
                        className="cursor-pointer rounded-full border border-line-strong bg-white px-4 py-2.5 text-[13.5px] font-bold hover:border-ink-900"
                      >
                        Annuler
                      </button>
                    </span>
                  </div>
                ) : (
                  <span className="mt-auto flex items-center justify-between gap-2.5">
                    {!o.titre.archive ? (
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmer(null);
                          setEdition({
                            id: o.id,
                            prixMin: o.prixMin?.toString() ?? "",
                            prixMax: o.prixMax?.toString() ?? "",
                            duree: o.duree?.toString() ?? "",
                            rythmes: o.rythmes,
                            financements: o.financements,
                            lieux: o.lieux,
                            fourchette: o.prixMax !== null,
                          });
                        }}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-[18px] py-3 text-sm font-bold ${incomplete ? "border-ink-900 bg-ink-900 text-white hover:bg-brique-700" : "border-line-strong bg-white text-ink-900 hover:border-ink-900"}`}
                      >
                        {incomplete ? "Compléter" : "Modifier"}
                        <span aria-hidden="true">→</span>
                      </button>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      onClick={() => setConfirmer(o.id)}
                      className="cursor-pointer px-0.5 py-1.5 text-[13.5px] font-bold text-brique-700 hover:text-ink-900"
                    >
                      Retirer
                    </button>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <section className="rounded-[28px] border border-line bg-white p-[clamp(18px,3vw,28px)]">
          <div className="flex flex-col items-center gap-4 rounded-[22px] border-[1.5px] border-dashed border-line-heavy bg-[repeating-linear-gradient(135deg,#F2EFE9_0_7px,#FFFFFF_7px_14px)] px-[clamp(20px,4vw,48px)] py-[clamp(32px,6vw,72px)] text-center">
            <span className={`rounded-full border border-line bg-white px-3.5 py-1.5 text-brique-700 ${surtitre}`}>
              {F.vide.surtitre}
            </span>
            <h2 className="max-w-[22ch] text-[clamp(26px,3.2vw,40px)] leading-[1.05] font-extrabold tracking-[-0.035em] text-balance">
              {F.vide.titre}
            </h2>
            <p className="max-w-[58ch] rounded-[14px] bg-white px-3.5 py-2.5 text-[15.5px] leading-[1.65] text-ink-700">
              {F.vide.texte}
            </p>
            {boutonAjout(true)}
          </div>
        </section>
      )}

      {ajout && (
        <div
          onClick={() => setAjout(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/55 p-[clamp(8px,3vw,32px)]"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Ajouter une formation"
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full w-full max-w-[720px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-24px_rgba(11,11,11,0.22)]"
          >
            <div className="flex flex-none flex-col gap-4 border-b border-line px-[clamp(20px,3vw,30px)] pt-[22px] pb-[18px]">
              <span className="flex items-center justify-between gap-4">
                <h2 className="text-[22px] font-extrabold tracking-[-0.025em]">Ajouter une formation</h2>
                <Fermer onClick={() => setAjout(null)} />
              </span>
              <label className="flex items-center gap-3 rounded-full border border-line-strong bg-cream-100 px-[18px]">
                <span
                  aria-hidden="true"
                  className="block size-[11px] flex-none rounded-full border-[1.5px] border-ink-300"
                />
                <input
                  type="search"
                  autoFocus
                  aria-label="Rechercher un titre"
                  placeholder="Rechercher un titre"
                  value={ajout.q}
                  onChange={(e) => setAjout({ ...ajout, q: e.target.value })}
                  className="min-w-0 flex-1 border-0 bg-transparent py-3.5 text-[15px] outline-none"
                />
              </label>
            </div>
            <div className="flex flex-auto flex-col gap-1.5 overflow-y-auto px-[clamp(20px,3vw,30px)] pt-2 pb-5">
              {groupesFiltres.map((g) => (
                <div key={g.categorie} className="flex flex-col gap-1.5 pt-3.5">
                  <span className={`text-ink-400 ${surtitre}`}>{g.categorie}</span>
                  {g.titres.map((t) => {
                    const deja = declares.has(t.id);
                    const coche = deja || ajout.sel.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        disabled={deja}
                        aria-pressed={coche}
                        onClick={() =>
                          setAjout({
                            ...ajout,
                            sel: coche ? ajout.sel.filter((x) => x !== t.id) : [...ajout.sel, t.id],
                          })
                        }
                        className={`flex items-center gap-3.5 rounded-[14px] border-[1.5px] px-4 py-3 text-left ${deja ? "cursor-default border-cream-200 bg-cream-100" : coche ? "cursor-pointer border-ink-900 bg-white" : "cursor-pointer border-line bg-white hover:border-ink-900"}`}
                      >
                        <Case coche={coche} desactive={deja} />
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className={`text-[15px] font-bold ${deja ? "text-ink-500" : ""}`}>{t.court}</span>
                          <span className="text-[12.5px] leading-[1.45] text-ink-500">{t.long}</span>
                        </span>
                        {deja && (
                          <span className="flex-none font-mono text-[10px] tracking-[0.1em] text-ink-500 uppercase">
                            Déjà ajouté
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
              {groupesFiltres.length === 0 && (
                <span className="pt-7 pb-2 text-center text-[14.5px] text-ink-500">
                  Aucun titre ne correspond à « {ajout.q} ».
                </span>
              )}
              {ajout.demande === null ? (
                <button
                  type="button"
                  onClick={() => setAjout({ ...ajout, demande: ajout.q })}
                  className="mt-3.5 cursor-pointer self-start text-left text-sm font-semibold text-ink-700"
                >
                  {F.demande.lien} <span className="font-bold text-brique-700">{F.demande.cta}</span>
                </button>
              ) : (
                <div className="mt-3.5 flex flex-col gap-2.5 rounded-[18px] border border-line-strong bg-cream-100 p-4">
                  <label className="flex flex-col gap-[7px]">
                    <span className="text-[13.5px] font-bold">{F.demande.libelle}</span>
                    <input
                      value={ajout.demande}
                      maxLength={150}
                      onChange={(e) => setAjout({ ...ajout, demande: e.target.value })}
                      className="rounded-[14px] border border-line bg-white px-[15px] py-3 text-[15px] outline-none focus:border-ink-900"
                    />
                    <span className="text-[13px] text-ink-500">{F.demande.aide}</span>
                  </label>
                  <button
                    type="button"
                    disabled={enCours || ajout.demande.trim().length < 2}
                    onClick={() =>
                      lancer(
                        () => a.demanderTitre(ajout.demande ?? ""),
                        () => {
                          setAjout(null);
                          setToast(F.toast.demande);
                        },
                      )
                    }
                    className="cursor-pointer self-start rounded-full bg-ink-900 px-[18px] py-3 text-sm font-bold text-white hover:bg-brique-700 disabled:cursor-default disabled:bg-line disabled:text-ink-400"
                  >
                    {F.demande.envoyer}
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-none flex-wrap items-center justify-between gap-3 border-t border-line px-[clamp(20px,3vw,30px)] py-3.5">
              <span className="text-[13px] leading-normal text-ink-500">
                Vous compléterez prix, durée et rythme ensuite.
              </span>
              <button
                type="button"
                disabled={ajout.sel.length === 0 || enCours}
                onClick={() =>
                  lancer(
                    () => a.ajouterOffres(ajout.sel),
                    () => {
                      setToast(F.toast.ajout(ajout.sel.map(nomDe)));
                      setAjout(null);
                    },
                  )
                }
                className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-ink-900 px-[22px] py-3.5 text-[15px] font-bold text-white hover:bg-brique-700 disabled:cursor-default disabled:bg-line disabled:text-ink-400"
              >
                Ajouter la sélection
                {ajout.sel.length > 0 && (
                  <span className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-brique-400 px-1.5 font-mono text-[11.5px] text-ink-900">
                    {ajout.sel.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {edition &&
        (() => {
          const o = offres.find((x) => x.id === edition.id)!;
          const { fourchette } = edition;
          const m = manquants({
            prixMin: edition.prixMin || null,
            duree: edition.duree || null,
            rythmes: edition.rythmes,
          });
          const basculer = (cle: "rythmes" | "financements", v: string) =>
            setEdition({
              ...edition,
              [cle]: edition[cle].includes(v) ? edition[cle].filter((x) => x !== v) : [...edition[cle], v],
            });
          const champ = "min-w-0 flex-1 border-0 bg-transparent py-[13px] font-mono text-[15px] outline-none";
          return (
            <div onClick={() => setEdition(null)} className="fixed inset-0 z-[100] flex justify-end bg-ink-900/55 p-3">
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Détail de la formation"
                onClick={(e) => e.stopPropagation()}
                className="flex h-full w-full max-w-[540px] flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_24px_60px_-24px_rgba(11,11,11,0.22)]"
              >
                <div className="flex flex-none flex-col gap-3 border-b border-line px-[26px] pt-[22px] pb-5">
                  <span className="flex items-center justify-between gap-4">
                    <span className={`text-ink-400 ${surtitre}`}>{o.titre.categorie}</span>
                    <Fermer onClick={() => setEdition(null)} />
                  </span>
                  <span className="flex flex-col gap-1">
                    <h2 className="text-[32px] leading-none font-extrabold tracking-[-0.04em]">{o.titre.court}</h2>
                    <span className="text-sm leading-[1.45] text-ink-500">{o.titre.long}</span>
                  </span>
                  <span className="text-[13px] leading-[1.55] text-ink-500">
                    L&apos;intitulé, la durée réglementaire et le programme figurent sur la{" "}
                    {o.titre.lienPage ? (
                      <a href={o.titre.lienPage} className="font-bold">
                        page du titre
                      </a>
                    ) : (
                      "page du titre"
                    )}
                    . Vous renseignez ici ce qui vous est propre.
                  </span>
                </div>

                <div className="flex flex-auto flex-col gap-6 overflow-y-auto px-[26px] py-[22px]">
                  <div className="flex flex-col gap-2.5">
                    <span className="flex items-center justify-between gap-2.5">
                      <span className="text-sm font-bold">Prix</span>
                      <span className="flex gap-[3px] rounded-full border border-line bg-cream-100 p-[3px]">
                        {(
                          [
                            ["Prix unique", false],
                            ["Fourchette", true],
                          ] as const
                        ).map(([t, v]) => (
                          <button
                            key={t}
                            type="button"
                            aria-pressed={fourchette === v}
                            onClick={() => setEdition({ ...edition, fourchette: v })}
                            className={`cursor-pointer rounded-full px-3 py-[7px] text-[12.5px] font-bold ${fourchette === v ? "bg-ink-900 text-white" : "text-ink-700"}`}
                          >
                            {t}
                          </button>
                        ))}
                      </span>
                    </span>
                    {fourchette ? (
                      <span className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2.5">
                        <label className="flex items-center gap-2 rounded-[14px] border border-line bg-cream-100 px-3.5">
                          <span className="text-xs text-ink-400">de</span>
                          <input
                            inputMode="numeric"
                            aria-label="Prix minimum"
                            className={champ}
                            value={edition.prixMin}
                            onChange={(e) =>
                              setEdition({ ...edition, prixMin: e.target.value.replace(/[^\d ,]/g, "") })
                            }
                          />
                          <span className="font-mono text-[13px] text-ink-500">€</span>
                        </label>
                        <span aria-hidden="true" className="text-line-heavy">
                          ·
                        </span>
                        <label className="flex items-center gap-2 rounded-[14px] border border-line bg-cream-100 px-3.5">
                          <span className="text-xs text-ink-400">à</span>
                          <input
                            inputMode="numeric"
                            aria-label="Prix maximum"
                            className={champ}
                            value={edition.prixMax}
                            onChange={(e) =>
                              setEdition({ ...edition, prixMax: e.target.value.replace(/[^\d ,]/g, "") })
                            }
                          />
                          <span className="font-mono text-[13px] text-ink-500">€</span>
                        </label>
                      </span>
                    ) : (
                      <label className="flex items-center gap-2.5 rounded-[14px] border border-line bg-cream-100 px-4">
                        <input
                          inputMode="numeric"
                          aria-label="Prix"
                          placeholder="1 490"
                          className={champ}
                          value={edition.prixMin}
                          onChange={(e) => setEdition({ ...edition, prixMin: e.target.value.replace(/[^\d ,]/g, "") })}
                        />
                        <span className="font-mono text-[13px] text-ink-500">€ TTC</span>
                      </label>
                    )}
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <span className="text-sm font-bold">Durée réelle</span>
                    <label className="flex items-center gap-2.5 rounded-[14px] border border-line bg-cream-100 px-4">
                      <input
                        inputMode="numeric"
                        aria-label="Durée réelle en heures"
                        placeholder="175"
                        className={champ}
                        value={edition.duree}
                        onChange={(e) => setEdition({ ...edition, duree: e.target.value.replace(/\D/g, "") })}
                      />
                      <span className="font-mono text-[13px] text-ink-500">heures</span>
                    </label>
                    {o.titre.duree && (
                      <span className="text-[12.5px] text-ink-500">
                        Durée réglementaire indicative : {o.titre.duree}. Indiquez la durée réelle de votre formation.
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <span className="text-sm font-bold">Rythme</span>
                    <span className="flex flex-wrap gap-2">
                      {Object.entries(RYTHMES).map(([cle, texte]) => {
                        const actif = edition.rythmes.includes(cle);
                        return (
                          <button
                            key={cle}
                            type="button"
                            aria-pressed={actif}
                            onClick={() => basculer("rythmes", cle)}
                            className={`cursor-pointer rounded-full border px-[15px] py-[9px] text-sm font-semibold ${actif ? "border-ink-900 bg-ink-900 text-white" : "border-line-strong bg-white text-ink-700 hover:border-ink-900"}`}
                          >
                            {texte}
                          </button>
                        );
                      })}
                    </span>
                  </div>

                  {multiSite && (
                    <div className="flex flex-col gap-2.5">
                      <span className="text-sm font-bold">Lieux de rattachement</span>
                      {lieux.map((l, i) => {
                        const actif = edition.lieux.length ? edition.lieux.includes(l.id) : i === 0;
                        const courants = edition.lieux.length ? edition.lieux : [lieux[0].id];
                        return (
                          <button
                            key={l.id}
                            type="button"
                            aria-pressed={actif}
                            onClick={() =>
                              setEdition({
                                ...edition,
                                lieux: actif ? courants.filter((x) => x !== l.id) : [...courants, l.id],
                              })
                            }
                            className={`flex cursor-pointer items-center gap-3 rounded-[14px] border-[1.5px] bg-cream-100 px-3.5 py-3 text-left ${actif ? "border-ink-900" : "border-line"}`}
                          >
                            <Case coche={actif} />
                            <span className="flex flex-col gap-px">
                              <span className="text-[14.5px] font-bold">{l.nom}</span>
                              <span className="text-[12.5px] text-ink-500">{l.adresse}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex flex-col gap-2.5">
                    <span className="text-sm font-bold">Financements acceptés</span>
                    <span className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-2">
                      {Object.entries(FINANCEMENTS).map(([cle, texte]) => {
                        const actif = edition.financements.includes(cle);
                        return (
                          <button
                            key={cle}
                            type="button"
                            aria-pressed={actif}
                            onClick={() => basculer("financements", cle)}
                            className={`flex cursor-pointer items-center gap-3 rounded-[14px] border-[1.5px] bg-cream-100 px-3.5 py-3 text-left text-sm font-semibold ${actif ? "border-ink-900" : "border-line"}`}
                          >
                            <Case coche={actif} />
                            {texte}
                          </button>
                        );
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-none flex-col gap-3 border-t border-line px-[26px] py-4">
                  <span className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[13px] leading-normal text-ink-500">
                    <span
                      className={`inline-flex items-center gap-[7px] rounded-full border-[1.5px] px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] uppercase ${m.length ? "border-dashed border-brique-700 bg-white text-brique-700" : "border-ink-900 bg-ink-900 text-white"}`}
                    >
                      {m.length ? "À compléter" : "Complète"}
                    </span>
                    {m.length ? `Il manque : ${m.join(", ")}.` : "Prix, durée réelle et rythme sont renseignés."}
                  </span>
                  {edition.erreur && (
                    <span role="alert" className="text-[13px] font-bold text-brique-700">
                      {edition.erreur}
                    </span>
                  )}
                  <span className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEdition(null)}
                      className="cursor-pointer rounded-full border border-line-strong bg-white px-[18px] py-[13px] text-sm font-bold hover:border-ink-900"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      disabled={enCours}
                      onClick={() =>
                        demarrer(async () => {
                          const { erreur: _e, fourchette: _f, ...d } = edition;
                          const r = await a.enregistrerOffre({ ...d, prixMax: fourchette ? d.prixMax : "" });
                          if (!r.ok) return setEdition({ ...edition, erreur: r.erreur });
                          setEdition(null);
                          router.refresh();
                          setToast(
                            manquants(o).length > 0 && m.length === 0
                              ? F.toast.complete(o.titre.court)
                              : F.toast.enregistree,
                          );
                        })
                      }
                      className="cursor-pointer rounded-full bg-ink-900 px-[22px] py-[13px] text-sm font-bold text-white hover:bg-brique-700 disabled:cursor-wait disabled:opacity-60"
                    >
                      Enregistrer
                    </button>
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[120] flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-3.5 rounded-full bg-ink-900 py-3 pr-3 pl-5 text-white shadow-[0_24px_60px_-24px_rgba(11,11,11,0.22)]"
        >
          <span aria-hidden="true" className="block size-2 flex-none rounded-full bg-brique-400" />
          <span className="text-sm leading-[1.4] font-semibold">{toast}</span>
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setToast(null)}
            className="size-[30px] flex-none cursor-pointer rounded-full bg-line-dark text-[15px] text-white"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
