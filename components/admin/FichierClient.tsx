"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { monogramme } from "@/lib/organismes/libelles";
import type { OrganismeAdmin } from "@/lib/supabase/queries/admin";
import { type ActionsModeration, ModaleModeration, type ModeModeration, ToastAdmin } from "./Moderation";

export type FiltresInitiaux = { palier: string; sansFormation: boolean; depuisDashboard: boolean };

const PALIERS = [
  ["", "Tous paliers"],
  ["basique", "Basique"],
  ["correct", "Correct"],
  ["optimal", "Optimal"],
] as const;
const STATUTS = [
  ["", "Tous statuts"],
  ["actif", "Actifs"],
  ["suspendu", "Suspendus"],
] as const;
const LIBELLE_PALIER = { basique: "Basique", correct: "Correct", optimal: "Optimal" };
const PASTILLE_PALIER = {
  basique: "border border-dashed border-ink-300 bg-cream-200",
  correct: "bg-ink-900",
  optimal: "bg-brique-700",
};
const sansAccent = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const dateCourte = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));

const th = "border-b border-line px-3 py-2.5 text-left font-mono text-[10px] font-medium tracking-[0.1em] uppercase";
const td = "border-b border-[#F0ECE6] p-3";
const bAction =
  "cursor-pointer rounded-full border bg-white px-3 py-[7px] text-[12.5px] font-bold whitespace-nowrap hover:border-ink-900";

function Segments({
  options,
  valeur,
  onChange,
  libelle,
}: {
  options: readonly (readonly [string, string])[];
  valeur: string;
  onChange: (v: string) => void;
  libelle: string;
}) {
  return (
    <span
      role="group"
      aria-label={libelle}
      className="flex gap-[3px] rounded-full border border-line bg-cream-100 p-[3px]"
    >
      {options.map(([v, l]) => (
        <button
          key={v}
          type="button"
          aria-pressed={valeur === v}
          onClick={() => onChange(v)}
          className={`cursor-pointer rounded-full px-[13px] py-[9px] text-[13px] font-bold whitespace-nowrap ${valeur === v ? "bg-ink-900 text-white" : "text-ink-700"}`}
        >
          {l}
        </button>
      ))}
    </span>
  );
}

/** Fichier client (UX Fichier client) : les organismes inscrits, filtres et actions de modération en ligne. */
export function FichierClient({
  organismes,
  departements,
  initial,
  actions,
}: {
  organismes: OrganismeAdmin[];
  departements: { code: string; nom: string }[];
  initial: FiltresInitiaux;
  actions: ActionsModeration;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [palier, setPalier] = useState(initial.palier);
  const [statut, setStatut] = useState("");
  const [dep, setDep] = useState("");
  const [sans, setSans] = useState(initial.sansFormation);
  const [tri, setTri] = useState<{ cle: "date" | "n"; sens: 1 | -1 }>({ cle: "date", sens: -1 });
  const [modale, setModale] = useState<{ mode: ModeModeration; id: string } | null>(null);
  const [toast, setToast] = useState("");
  const fermerToast = useCallback(() => setToast(""), []);
  const fermerModale = useCallback(() => setModale(null), []);

  const lignes = useMemo(() => {
    const nq = sansAccent(q.trim());
    return organismes
      .filter(
        (o) =>
          (!nq || sansAccent(o.nom).includes(nq)) &&
          (!palier || o.palier === palier) &&
          (!statut || (statut === "suspendu") === (o.statut === "suspendu")) &&
          (!dep || o.departement === dep) &&
          (!sans || o.nbFormations === 0),
      )
      .sort((a, b) =>
        tri.cle === "date"
          ? tri.sens * a.inscritLe.localeCompare(b.inscritLe)
          : tri.sens * (a.nbFormations - b.nbFormations),
      );
  }, [organismes, q, palier, statut, dep, sans, tri]);

  const depuisDashboard =
    initial.depuisDashboard &&
    ((initial.palier === "basique" && palier === "basique") || (initial.sansFormation && sans));
  const filtres = !!(q || palier || statut || dep || sans);
  const cible = modale && organismes.find((o) => o.id === modale.id);
  const trier = (cle: "date" | "n") => setTri({ cle, sens: tri.cle === cle ? (-tri.sens as 1 | -1) : -1 });
  const fleche = (cle: "date" | "n") => (tri.cle === cle ? (tri.sens < 0 ? "↓" : "↑") : "");

  return (
    <>
      {depuisDashboard && (
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2.5 rounded-[20px] bg-ink-900 px-[18px] py-3.5 text-white">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14.5px]">
            <span className="font-mono text-[10.5px] tracking-[0.12em] text-brique-400 uppercase">
              Depuis le tableau de bord
            </span>
            {initial.palier === "basique" ? "Fiches en noindex (palier Basique)" : "Fiches sans formation déclarée"}
          </span>
          <Link href="/dashboard/" className="text-[13.5px] font-bold text-brique-400 hover:text-white">
            Retour au tableau de bord →
          </Link>
        </div>
      )}

      <section
        aria-label="Filtres"
        className="flex flex-wrap items-center gap-2.5 rounded-3xl border border-line bg-white p-3.5"
      >
        <label className="flex min-w-0 flex-[1_1_260px] items-center gap-3 rounded-full border border-line-strong bg-cream-100 px-[18px]">
          <span aria-hidden="true" className="block size-[11px] flex-none rounded-full border-[1.5px] border-ink-300" />
          <input
            type="search"
            aria-label="Rechercher un organisme"
            placeholder="Rechercher un organisme"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="min-w-0 flex-1 bg-transparent py-3 text-[14.5px] outline-none"
          />
        </label>
        <Segments options={PALIERS} valeur={palier} onChange={setPalier} libelle="Palier" />
        <Segments options={STATUTS} valeur={statut} onChange={setStatut} libelle="Statut du compte" />
        <select
          aria-label="Département"
          value={dep}
          onChange={(e) => setDep(e.target.value)}
          className="rounded-full border border-line bg-cream-100 px-3.5 py-[11px] text-[13.5px] font-semibold outline-none"
        >
          <option value="">Tous les départements</option>
          {departements.map((d) => (
            <option key={d.code} value={d.code}>
              {d.nom} ({d.code})
            </option>
          ))}
        </select>
        <button
          type="button"
          aria-pressed={sans}
          onClick={() => setSans(!sans)}
          className={`inline-flex cursor-pointer items-center gap-[9px] rounded-full border px-3.5 py-2.5 text-[13.5px] font-bold whitespace-nowrap ${sans ? "border-ink-900 bg-ink-900 text-white" : "border-line bg-cream-100 text-ink-700"}`}
        >
          <span
            aria-hidden="true"
            className={`block size-4 rounded-[5px] border-[1.5px] ${sans ? "border-brique-400 bg-brique-400" : "border-line-heavy bg-white"}`}
          />
          Sans formation déclarée
        </button>
        {filtres && (
          <button
            type="button"
            onClick={() => (setQ(""), setPalier(""), setStatut(""), setDep(""), setSans(false))}
            className="cursor-pointer px-1.5 py-2 text-[13.5px] font-bold text-brique-700 hover:text-ink-900"
          >
            Réinitialiser
          </button>
        )}
      </section>

      <section className="flex flex-col gap-2.5 rounded-[28px] border border-line bg-white p-[clamp(14px,2vw,22px)]">
        <span className="flex flex-wrap items-center justify-between gap-2 px-1.5 py-1">
          <h2 className="text-[15px] font-bold">
            {lignes.length === 1 ? "1 organisme" : `${lignes.length} organismes`}
          </h2>
          <span className="font-mono text-[11px] text-ink-400">
            Tri :{" "}
            {tri.cle === "date"
              ? tri.sens < 0
                ? "inscription la plus récente"
                : "inscription la plus ancienne"
              : tri.sens < 0
                ? "plus de formations"
                : "moins de formations"}
          </span>
        </span>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-[13.5px]">
            <thead>
              <tr>
                <th className={`${th} text-ink-400`}>Organisme</th>
                <th className={`${th} text-ink-400`}>Palier</th>
                <th className={`${th} text-ink-400`}>Indexation</th>
                <th className={th} aria-sort={tri.cle === "n" ? (tri.sens < 0 ? "descending" : "ascending") : "none"}>
                  <button
                    type="button"
                    onClick={() => trier("n")}
                    className={`cursor-pointer tracking-[0.1em] uppercase ${tri.cle === "n" ? "text-ink-900" : "text-ink-400"}`}
                  >
                    Formations {fleche("n")}
                  </button>
                </th>
                <th
                  className={th}
                  aria-sort={tri.cle === "date" ? (tri.sens < 0 ? "descending" : "ascending") : "none"}
                >
                  <button
                    type="button"
                    onClick={() => trier("date")}
                    className={`cursor-pointer tracking-[0.1em] uppercase ${tri.cle === "date" ? "text-ink-900" : "text-ink-400"}`}
                  >
                    Inscription {fleche("date")}
                  </button>
                </th>
                <th className={`${th} text-ink-400`}>Statut</th>
                <th className={`${th} text-right text-ink-400`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((o) => {
                const suspendu = o.statut === "suspendu";
                const basique = o.palier === "basique";
                return (
                  <tr key={o.id} className={suspendu ? "bg-[#FCF7F5]" : ""}>
                    <td className={td}>
                      <Link href={`/organismes/${o.id}/`} className="flex items-center gap-3 text-ink-900">
                        <span className="flex size-9 flex-none items-center justify-center rounded-[10px] border border-line bg-cream-200 font-mono text-[11px] text-ink-600">
                          {monogramme(o.nom)}
                        </span>
                        <span className="flex flex-col gap-px">
                          <span className="text-[14.5px] font-bold">{o.nom}</span>
                          {o.lieu && <span className="text-xs text-ink-400">{o.lieu}</span>}
                        </span>
                      </Link>
                    </td>
                    <td className={td}>
                      <span className="inline-flex items-center gap-[7px] font-bold">
                        <span
                          aria-hidden="true"
                          className={`block size-[9px] rounded-[3px] ${PASTILLE_PALIER[o.palier]}`}
                        />
                        {LIBELLE_PALIER[o.palier]}
                      </span>
                    </td>
                    <td className={td}>
                      <span
                        className={`inline-flex items-center rounded-full border-[1.5px] px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] whitespace-nowrap uppercase ${basique ? "border-dashed border-brique-700 bg-white text-brique-700" : "border-cream-200 bg-cream-200 text-ink-600"}`}
                      >
                        {basique ? "noindex" : "Indexable"}
                      </span>
                    </td>
                    <td className={`${td} font-mono text-[13px] ${o.nbFormations === 0 ? "text-brique-700" : ""}`}>
                      {o.nbFormations}
                    </td>
                    <td className={`${td} font-mono text-[12.5px] whitespace-nowrap text-ink-700`}>
                      {dateCourte(o.inscritLe)}
                    </td>
                    <td className={td}>
                      <span
                        className={`inline-flex items-center gap-[7px] text-[13px] font-bold ${suspendu ? "text-brique-700" : ""}`}
                      >
                        <span
                          aria-hidden="true"
                          className={`block size-[7px] rounded-full ${suspendu ? "bg-brique-700" : "bg-ink-900"}`}
                        />
                        {suspendu ? "Suspendu" : "Actif"}
                      </span>
                    </td>
                    <td className={td}>
                      <span className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          aria-label={`Envoyer un rappel à ${o.nom}`}
                          disabled={o.desabonne}
                          title={o.desabonne ? "L'organisme ne souhaite plus recevoir de rappels" : undefined}
                          onClick={() => setModale({ mode: "rappel", id: o.id })}
                          className={`${bAction} border-line-strong disabled:cursor-not-allowed disabled:border-line disabled:text-ink-300 disabled:hover:border-line`}
                        >
                          {o.desabonne ? "Désabonné" : "Rappel"}
                        </button>
                        <button
                          type="button"
                          aria-label={`${suspendu ? "Réactiver" : "Suspendre"} ${o.nom}`}
                          onClick={() => setModale({ mode: "suspension", id: o.id })}
                          className={`${bAction} border-line-strong`}
                        >
                          {suspendu ? "Réactiver" : "Suspendre"}
                        </button>
                        <button
                          type="button"
                          aria-label={`Supprimer ${o.nom}`}
                          onClick={() => setModale({ mode: "suppression", id: o.id })}
                          className={`${bAction} border-brique-200 text-brique-700`}
                        >
                          Supprimer
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {lignes.length === 0 && (
          <div className="flex justify-center rounded-[18px] border-[1.5px] border-dashed border-line-heavy bg-[repeating-linear-gradient(135deg,var(--color-cream-200)_0_7px,var(--color-white)_7px_14px)] p-7">
            <span className="rounded-xl bg-white px-3.5 py-2.5 text-sm text-ink-700">
              Aucun organisme ne correspond à ces critères.
            </span>
          </div>
        )}
      </section>

      {modale && cible && (
        <ModaleModeration
          cible={{ ...cible, aCompte: !!cible.compteId }}
          mode={modale.mode}
          actions={actions}
          onFermer={fermerModale}
          onFait={(message) => {
            setModale(null);
            setToast(message);
            router.refresh();
          }}
        />
      )}
      {toast && <ToastAdmin message={toast} onFermer={fermerToast} />}
    </>
  );
}
