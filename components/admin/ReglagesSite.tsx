"use client";

import { useState, useTransition } from "react";
import type { Reglages } from "@/app/admin/(connecte)/parametres/actions";
import type { Retour } from "@/lib/supabase/queries/apres-enregistrement";

const champ =
  "w-full rounded-[14px] border border-line bg-white px-[15px] py-3 text-[15px] outline-none focus:border-ink-900";
const PALIERS = [
  ["basique", "Basique"],
  ["correct", "Correct"],
  ["optimal", "Optimal"],
];

function Nombre({
  libelle,
  valeur,
  onChange,
  aide,
}: {
  libelle: string;
  valeur: number;
  onChange: (n: number) => void;
  aide?: string;
}) {
  return (
    <label className="flex flex-col gap-[7px]">
      <span className="text-[13.5px] font-bold">{libelle}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        className={`${champ} font-mono`}
        value={Number.isNaN(valeur) ? "" : valeur}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
      {aide && <span className="text-[12.5px] text-ink-500">{aide}</span>}
    </label>
  );
}

/**
 * Section 03 de Paramètres admin : les seuils de la table `parametres`, provisoires depuis les Sprints 6 et 7.
 * Hors maquette (décision Erwan : « rendre les seuils éditables ») : libellés rédigés par Claude, à valider.
 */
export function ReglagesSite({
  initial,
  enregistrer,
}: {
  initial: Reglages;
  enregistrer: (r: Reglages) => Promise<Retour>;
}) {
  const [r, setR] = useState(initial);
  const [base, setBase] = useState(initial);
  const [statut, setStatut] = useState<{ heure?: string; erreur?: string }>({});
  const [enCours, demarrer] = useTransition();
  const modifie = JSON.stringify(r) !== JSON.stringify(base);
  const seuil = (k: "departement" | "ville", titre: string, aide: string) => (
    <div className="flex flex-col gap-3 rounded-[20px] border border-line px-5 py-[18px]">
      <span className="flex flex-col gap-1">
        <span className="font-mono text-[10.5px] tracking-[0.1em] text-ink-400 uppercase">{titre}</span>
        <span className="text-[13px] leading-[1.55] text-ink-500">{aide}</span>
      </span>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
        <Nombre
          libelle="Nombre d'organismes"
          valeur={r[k].organismes}
          onChange={(n) => setR({ ...r, [k]: { ...r[k], organismes: n } })}
        />
        <label className="flex flex-col gap-[7px]">
          <span className="text-[13.5px] font-bold">Palier minimal</span>
          <select
            className={champ}
            value={r[k].palier_min}
            onChange={(e) => setR({ ...r, [k]: { ...r[k], palier_min: e.target.value } })}
          >
            {PALIERS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );

  return (
    <section className="flex flex-col gap-5 rounded-[28px] border border-line bg-white p-[clamp(22px,3vw,34px)]">
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] text-brique-700">03</span>
        <h2 className="text-2xl leading-[1.15] font-extrabold tracking-[-0.025em]">Réglages du site</h2>
        <p className="text-[14.5px] leading-[1.6] text-ink-500">
          Seuils appliqués aux pages publiques. Une modification s&apos;applique à tout le site dans la minute.
        </p>
      </div>
      {seuil(
        "departement",
        "Page département",
        "Une page département existe à partir de ce nombre d'organismes ayant un lieu dans le département, à ce palier au moins (et avec un texte finalisé).",
      )}
      {seuil("ville", "Page ville", "Même règle pour une page ville (pages villes pas encore construites).")}
      <div className="flex flex-col gap-3 rounded-[20px] border border-line px-5 py-[18px]">
        <span className="font-mono text-[10.5px] tracking-[0.1em] text-ink-400 uppercase">
          Formulaire d&apos;affinage
        </span>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
          <Nombre
            libelle="Proposer d'élargir la recherche quand elle trouve moins de"
            aide="organismes. À zéro résultat, l'élargissement est automatique."
            valeur={r.elargissement}
            onChange={(n) => setR({ ...r, elargissement: n })}
          />
          <Nombre
            libelle="Expérience pour le SSIAP 2"
            aide="années, SSIAP 1 détenu"
            valeur={r.experience["ssiap-2"]}
            onChange={(n) => setR({ ...r, experience: { ...r.experience, "ssiap-2": n } })}
          />
          <Nombre
            libelle="Expérience pour le SSIAP 3"
            aide="années, SSIAP 2 détenu"
            valeur={r.experience["ssiap-3"]}
            onChange={(n) => setR({ ...r, experience: { ...r.experience, "ssiap-3": n } })}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-[18px]">
        <span
          role="status"
          className={`text-[13px] ${statut.erreur || modifie ? "text-brique-700" : "text-ink-600"} ${statut.erreur ? "font-bold" : ""}`}
        >
          {statut.erreur ??
            (modifie ? "Modifications non enregistrées" : statut.heure ? `Enregistré à ${statut.heure}` : "")}
        </span>
        <span className="flex gap-2">
          {modifie && (
            <button
              type="button"
              onClick={() => setR(base)}
              className="cursor-pointer rounded-full border border-line-strong bg-white px-[18px] py-3 text-sm font-bold hover:border-ink-900"
            >
              Annuler
            </button>
          )}
          <button
            type="button"
            disabled={!modifie || enCours}
            onClick={() =>
              demarrer(async () => {
                const res = await enregistrer(r);
                if (!res.ok) return setStatut({ erreur: res.erreur });
                setBase(r);
                setStatut({ heure: res.heure });
              })
            }
            className="cursor-pointer rounded-full bg-ink-900 px-5 py-[13px] text-sm font-bold text-white hover:bg-brique-700 disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-400"
          >
            Enregistrer
          </button>
        </span>
      </div>
    </section>
  );
}
