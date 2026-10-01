"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import type { CompteRendu } from "@/app/admin/(connecte)/prospection/actions";
import type { Enums, Tables } from "@/lib/supabase/types";
import { ToastAdmin } from "./Moderation";

type Statut = Enums<"statut_prospect">;
type Actions = {
  importerProspects: (d: FormData) => Promise<{ ok: true; compteRendu: CompteRendu } | { ok: false; erreur: string }>;
  changerStatut: (id: number, statut: Statut) => Promise<{ ok: boolean }>;
  enregistrerSuppression: (
    d: { id: number } | { siret?: string; email?: string; site?: string },
  ) => Promise<{ ok: true; message: string } | { ok: false; erreur: string }>;
};

// Page non spécifiée (décision Erwan : « garde-la minimale ») : libellés et textes rédigés par Claude.
// Ordre du parcours (décision Erwan) : appel d'abord, email si personne ne répond.
const STATUTS: [Statut, string][] = [
  ["a_contacter", "À contacter"],
  ["appele_sans_reponse", "Appelé sans réponse"],
  ["email_envoye", "Email envoyé"],
  ["contacte", "Contacté"],
  ["inscrit", "Inscrit"],
  ["exclu", "Exclu"],
];
const carte = "flex flex-col gap-3.5 rounded-[28px] border border-line bg-white p-[clamp(18px,2.6vw,28px)]";
const surtitre = "font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase";
const th =
  "border-b border-line px-3 py-2.5 text-left font-mono text-[10px] font-medium tracking-[0.1em] text-ink-400 uppercase";
const td = "border-b border-[#F0ECE6] p-3 align-top";
const champ =
  "w-full rounded-[14px] border border-line bg-white px-3.5 py-3 text-[14.5px] outline-none focus:border-ink-900";
const bPlein =
  "cursor-pointer rounded-full bg-ink-900 px-5 py-3 text-sm font-bold text-white hover:bg-brique-700 disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-400";
const bContour =
  "cursor-pointer rounded-full border border-line-strong bg-white px-[18px] py-3 text-sm font-bold text-ink-900 hover:border-ink-900";
const sansAccent = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function ProspectionAdmin({
  prospects,
  empreintesExclues,
  actions: a,
}: {
  prospects: Tables<"prospects">[];
  empreintesExclues: number;
  actions: Actions;
}) {
  const router = useRouter();
  const [enCours, demarrer] = useTransition();
  const [compteRendu, setCompteRendu] = useState<CompteRendu | null>(null);
  const [erreurImport, setErreurImport] = useState("");
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState<Statut | "">("");
  const [suppression, setSuppression] = useState<Tables<"prospects"> | null>(null);
  const [manuel, setManuel] = useState({ siret: "", email: "", site: "" });
  const [erreurManuel, setErreurManuel] = useState("");
  const [toast, setToast] = useState("");
  const fermerToast = useCallback(() => setToast(""), []);

  const lignes = useMemo(() => {
    const nq = sansAccent(q.trim());
    return prospects.filter(
      (p) =>
        (!statut || p.statut === statut) &&
        (!nq || sansAccent(`${p.nom} ${p.raison_sociale ?? ""} ${p.identifiant ?? ""} ${p.email ?? ""}`).includes(nq)),
    );
  }, [prospects, q, statut]);
  const compte = (s: Statut) => prospects.filter((p) => p.statut === s).length;

  const exclure = (d: Parameters<Actions["enregistrerSuppression"]>[0], ok: () => void, ko: (e: string) => void) =>
    demarrer(async () => {
      const r = await a.enregistrerSuppression(d);
      if (!r.ok) return ko(r.erreur);
      ok();
      setToast(r.message);
      router.refresh();
    });

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-3.5">
        <section className={carte}>
          <h2 className="text-xl font-extrabold tracking-[-0.02em]">Importer le fichier du scraping</h2>
          <p className="text-sm leading-[1.6] text-ink-500">
            CSV séparé par des points-virgules (organismes_idf.csv). Un prospect déjà présent garde son statut ; les
            organismes de la liste d&apos;exclusion sont ignorés.
          </p>
          <form
            action={(d) =>
              demarrer(async () => {
                setErreurImport("");
                setCompteRendu(null);
                const r = await a.importerProspects(d);
                if (!r.ok) return setErreurImport(r.erreur);
                setCompteRendu(r.compteRendu);
                router.refresh();
              })
            }
            className="flex flex-wrap items-center gap-2.5"
          >
            <input
              type="file"
              name="fichier"
              accept=".csv,text/csv"
              required
              aria-label="Fichier CSV"
              className="min-w-0 flex-1 text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-line-strong file:bg-white file:px-4 file:py-2 file:text-sm file:font-bold"
            />
            <button type="submit" disabled={enCours} className={bPlein}>
              Importer
            </button>
          </form>
          {erreurImport && (
            <span role="alert" className="text-[13px] font-bold text-brique-700">
              {erreurImport}
            </span>
          )}
          {compteRendu && (
            <div role="status" className="flex flex-col gap-2 rounded-2xl bg-cream-100 p-4 text-sm leading-[1.6]">
              <span className={surtitre}>Compte rendu de l&apos;import</span>
              <ul className="flex flex-col gap-0.5">
                <li>
                  <strong>{compteRendu.ajoutes}</strong> ajoutés · <strong>{compteRendu.misAJour}</strong> mis à jour
                </li>
                <li>
                  <strong>{compteRendu.exclus}</strong> ignorés (liste d&apos;exclusion)
                </li>
                <li>
                  <strong>{compteRendu.siretRetrouves}</strong> SIRET retrouvés (Recherche d&apos;entreprises) ·{" "}
                  <strong>{compteRendu.sansSiret}</strong> prospects sans SIRET
                </li>
                {compteRendu.ignorees > 0 && (
                  <li>
                    <strong>{compteRendu.ignorees}</strong> lignes ignorées (ni SIRET, ni email, ni site, ni téléphone)
                  </li>
                )}
                <li>
                  <strong>{compteRendu.emailsPersonnels}</strong> adresses de messagerie personnelle (gmail, hotmail,
                  outlook, orange…) sur <strong>{compteRendu.emails}</strong> adresses email
                </li>
              </ul>
            </div>
          )}
        </section>

        <section className={carte}>
          <h2 className="text-xl font-extrabold tracking-[-0.02em]">Demande de suppression</h2>
          <p className="text-sm leading-[1.6] text-ink-500">
            Pour une demande reçue par email. Les données correspondantes sont effacées et l&apos;organisme ne pourra
            plus jamais être importé. Depuis la table, utilisez le bouton de la ligne.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-2.5">
            {(
              [
                ["siret", "SIRET ou SIREN", "off"],
                ["email", "Email", "off"],
                ["site", "Site web", "off"],
              ] as const
            ).map(([k, l, ac]) => (
              <label key={k} className="flex flex-col gap-1.5">
                <span className="text-[13px] font-bold">{l}</span>
                <input
                  autoComplete={ac}
                  className={champ}
                  value={manuel[k]}
                  onChange={(e) => (setManuel({ ...manuel, [k]: e.target.value }), setErreurManuel(""))}
                />
              </label>
            ))}
          </div>
          {erreurManuel && (
            <span role="alert" className="text-[13px] font-bold text-brique-700">
              {erreurManuel}
            </span>
          )}
          <button
            type="button"
            disabled={enCours || !(manuel.siret || manuel.email || manuel.site)}
            onClick={() => exclure(manuel, () => setManuel({ siret: "", email: "", site: "" }), setErreurManuel)}
            className={`${bPlein} self-start`}
          >
            Enregistrer la demande
          </button>
          <span className="font-mono text-[11px] text-ink-400">
            {empreintesExclues} identifiant{empreintesExclues > 1 ? "s" : ""} exclu{empreintesExclues > 1 ? "s" : ""}{" "}
            définitivement (conservés sous forme d&apos;empreintes)
          </span>
        </section>
      </div>

      <section
        className="flex flex-wrap items-center gap-2.5 rounded-3xl border border-line bg-white p-3.5"
        aria-label="Filtres"
      >
        <label className="flex min-w-0 flex-[1_1_260px] items-center gap-3 rounded-full border border-line-strong bg-cream-100 px-[18px]">
          <span aria-hidden="true" className="block size-[11px] flex-none rounded-full border-[1.5px] border-ink-300" />
          <input
            type="search"
            aria-label="Rechercher un prospect"
            placeholder="Rechercher un prospect"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="min-w-0 flex-1 bg-transparent py-3 text-[14.5px] outline-none"
          />
        </label>
        <span
          role="group"
          aria-label="Statut"
          className="flex flex-wrap gap-[3px] rounded-full border border-line bg-cream-100 p-[3px]"
        >
          {(
            [["", `Tous · ${prospects.length}`], ...STATUTS.map(([s, l]) => [s, `${l} · ${compte(s)}`])] as [
              Statut | "",
              string,
            ][]
          ).map(([s, l]) => (
            <button
              key={s}
              type="button"
              aria-pressed={statut === s}
              onClick={() => setStatut(s)}
              className={`cursor-pointer rounded-full px-[13px] py-[9px] text-[13px] font-bold whitespace-nowrap ${statut === s ? "bg-ink-900 text-white" : "text-ink-700"}`}
            >
              {l}
            </button>
          ))}
        </span>
      </section>

      <section className="flex flex-col gap-2.5 rounded-[28px] border border-line bg-white p-[clamp(14px,2vw,22px)]">
        <h2 className="px-1.5 py-1 text-[15px] font-bold">
          {lignes.length === 1 ? "1 prospect" : `${lignes.length} prospects`}
        </h2>
        {lignes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-[13.5px]">
              <thead>
                <tr>
                  {["Organisme", "SIRET / SIREN", "Contact", "Titres", "Statut", ""].map((t) => (
                    <th key={t} className={th}>
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lignes.map((p) => (
                  <tr key={p.id}>
                    <td className={td}>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[14.5px] font-bold">{p.nom}</span>
                        {p.raison_sociale && p.raison_sociale !== p.nom && (
                          <span className="text-xs text-ink-400">{p.raison_sociale}</span>
                        )}
                        {p.departements && <span className="text-xs text-ink-400">{p.departements}</span>}
                      </span>
                    </td>
                    <td className={`${td} font-mono text-[12.5px] whitespace-nowrap`}>
                      {p.identifiant ?? (
                        <span className="inline-flex rounded-full border-[1.5px] border-dashed border-brique-700 px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-brique-700 uppercase">
                          SIRET manquant
                        </span>
                      )}
                    </td>
                    <td className={td}>
                      <span className="flex flex-col gap-0.5 text-[13px] [overflow-wrap:anywhere]">
                        {p.email && <a href={`mailto:${p.email}`}>{p.email}</a>}
                        {p.telephone && <span className="font-mono text-[12.5px]">{p.telephone}</span>}
                        {p.site_web && (
                          <a
                            href={p.site_web}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="text-ink-600"
                          >
                            {p.site_web.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                          </a>
                        )}
                        {!p.email && !p.telephone && !p.site_web && <span className="text-ink-300">—</span>}
                      </span>
                    </td>
                    <td className={`${td} max-w-[220px] text-[13px] text-ink-700`}>{p.titres ?? "—"}</td>
                    <td className={td}>
                      <select
                        aria-label={`Statut de ${p.nom}`}
                        value={p.statut}
                        disabled={enCours}
                        onChange={(e) =>
                          demarrer(async () => {
                            await a.changerStatut(p.id, e.target.value as Statut);
                            router.refresh();
                          })
                        }
                        className="rounded-full border border-line bg-cream-100 px-3 py-2 text-[13px] font-semibold outline-none"
                      >
                        {STATUTS.map(([s, l]) => (
                          <option key={s} value={s}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={`${td} text-right`}>
                      <button
                        type="button"
                        aria-label={`Demande de suppression pour ${p.nom}`}
                        onClick={() => setSuppression(p)}
                        className="cursor-pointer rounded-full border border-brique-200 bg-white px-3 py-[7px] text-[12.5px] font-bold whitespace-nowrap text-brique-700 hover:border-ink-900"
                      >
                        Demande de suppression
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center rounded-[18px] border-[1.5px] border-dashed border-line-heavy bg-[repeating-linear-gradient(135deg,var(--color-cream-200)_0_7px,var(--color-white)_7px_14px)] p-7">
            <span className="rounded-xl bg-white px-3.5 py-2.5 text-sm text-ink-700">
              {prospects.length
                ? "Aucun prospect ne correspond à ces critères."
                : "Aucun prospect : importez le fichier du scraping."}
            </span>
          </div>
        )}
      </section>

      {suppression && (
        <div
          onClick={() => setSuppression(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/55 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="suppression-titre"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-[520px] flex-col gap-4 rounded-[28px] bg-white p-[clamp(22px,3vw,30px)] shadow-menu"
          >
            <span className={surtitre}>{suppression.nom}</span>
            <span id="suppression-titre" className="text-[22px] font-extrabold tracking-[-0.025em]">
              Enregistrer la demande de suppression ?
            </span>
            <span className="text-[14.5px] leading-[1.6] text-ink-700">
              {suppression.identifiant
                ? "Les données de ce prospect sont effacées. Son SIRET, son SIREN, son email et le domaine de son site entrent dans la liste d'exclusion : aucun import ne pourra le réintégrer, ni les autres établissements du même SIREN. Cette action ne peut pas être annulée."
                : "Les données de ce prospect sont effacées. Son email et le domaine de son site entrent dans la liste d'exclusion : aucun import ne pourra le réintégrer. Cette action ne peut pas être annulée."}
            </span>
            <span className="flex flex-wrap justify-end gap-2">
              <button type="button" className={bContour} onClick={() => setSuppression(null)}>
                Annuler
              </button>
              <button
                type="button"
                disabled={enCours}
                onClick={() => exclure({ id: suppression.id }, () => setSuppression(null), setToast)}
                className="cursor-pointer rounded-full bg-brique-700 px-5 py-3 text-sm font-bold text-white hover:bg-ink-900"
              >
                Enregistrer et effacer
              </button>
            </span>
          </div>
        </div>
      )}
      {toast && <ToastAdmin message={toast} onFermer={fermerToast} />}
    </>
  );
}
