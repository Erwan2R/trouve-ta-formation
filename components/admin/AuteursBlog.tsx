"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { SaisieAuteur } from "@/app/admin/(connecte)/parametres/actions";
import type { Retour } from "@/lib/supabase/queries/apres-enregistrement";

type Auteur = SaisieAuteur & { id: number; nbArticles: number; est_test: boolean };

const champ =
  "w-full rounded-[14px] border border-line bg-white px-[15px] py-3 text-[15px] outline-none focus:border-ink-900";
const bPlein =
  "cursor-pointer rounded-full bg-ink-900 px-[18px] py-3 text-sm font-bold text-white hover:bg-brique-700 disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-400";
const bContour =
  "cursor-pointer rounded-full border border-line-strong bg-white px-[18px] py-3 text-sm font-bold text-ink-900 hover:border-ink-900";

/**
 * Paramètres admin, section 04 : profils des auteurs du blog (nom, qualification, biographie de deux phrases).
 * Jamais d'identité inventée (Copy blog §5) : l'auteur de démonstration n'existe que sur la base de dev.
 */
export function AuteursBlog({
  auteurs,
  enregistrer,
  supprimer,
}: {
  auteurs: Auteur[];
  enregistrer: (id: number | null, a: SaisieAuteur) => Promise<Retour>;
  supprimer: (id: number) => Promise<Retour>;
}) {
  const router = useRouter();
  const [edition, setEdition] = useState<(SaisieAuteur & { id: number | null }) | null>(null);
  const [erreur, setErreur] = useState("");
  const [enCours, demarrer] = useTransition();
  const lancer = (f: () => Promise<Retour>) =>
    demarrer(async () => {
      const r = await f();
      if (!r.ok) return setErreur(r.erreur);
      setErreur("");
      setEdition(null);
      router.refresh();
    });

  const formulaire = edition && (
    <div className="flex flex-col gap-3 rounded-2xl bg-cream-100 p-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3">
        <label className="flex flex-col gap-[7px]">
          <span className="text-[13.5px] font-bold">Nom affiché</span>
          <input
            value={edition.nom}
            onChange={(e) => setEdition({ ...edition, nom: e.target.value })}
            className={champ}
          />
        </label>
        <label className="flex flex-col gap-[7px]">
          <span className="text-[13.5px] font-bold">Qualification (une ligne)</span>
          <input
            value={edition.qualification}
            onChange={(e) => setEdition({ ...edition, qualification: e.target.value })}
            className={champ}
          />
        </label>
      </div>
      <label className="flex flex-col gap-[7px]">
        <span className="text-[13.5px] font-bold">Biographie (deux phrases au plus)</span>
        <textarea
          rows={3}
          value={edition.biographie}
          onChange={(e) => setEdition({ ...edition, biographie: e.target.value })}
          className={`${champ} resize-none`}
        />
      </label>
      {erreur && (
        <span role="alert" className="text-[13px] font-bold text-brique-700">
          {erreur}
        </span>
      )}
      <span className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={enCours}
          onClick={() => lancer(() => enregistrer(edition.id, edition))}
          className={bPlein}
        >
          Enregistrer
        </button>
        <button type="button" onClick={() => (setEdition(null), setErreur(""))} className={bContour}>
          Annuler
        </button>
      </span>
    </div>
  );

  return (
    <section className="flex flex-col gap-5 rounded-[28px] border border-line bg-white p-[clamp(22px,3vw,34px)]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] text-brique-700">04</span>
          <h2 className="text-2xl leading-[1.15] font-extrabold tracking-[-0.025em]">Auteurs du blog</h2>
        </div>
        {!edition && (
          <button
            type="button"
            onClick={() => setEdition({ id: null, nom: "", qualification: "", biographie: "" })}
            className={bContour}
          >
            + Ajouter un auteur
          </button>
        )}
      </div>
      <p className="-mt-1.5 max-w-[62ch] text-[14.5px] leading-[1.6] text-ink-500">
        Affichés en fin d&apos;article. Une identité réelle avec un rôle honnête, jamais une expertise empruntée.
      </p>
      {edition?.id === null && formulaire}
      <ul className="flex flex-col gap-3">
        {auteurs.map((a) =>
          edition?.id === a.id ? (
            <li key={a.id}>{formulaire}</li>
          ) : (
            <li
              key={a.id}
              className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2.5 rounded-[20px] border border-line px-5 py-[18px]"
            >
              <span className="flex min-w-0 flex-[1_1_300px] flex-col gap-1">
                <span className="flex flex-wrap items-center gap-2 text-base font-bold">
                  {a.nom}
                  {a.est_test && (
                    <span className="rounded-full border border-dashed border-ink-300 px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-ink-500 uppercase">
                      Démonstration · dev
                    </span>
                  )}
                </span>
                <span className="text-[14px] text-ink-500">{a.qualification}</span>
                {a.biographie && <span className="text-[13.5px] leading-[1.55] text-ink-700">{a.biographie}</span>}
                <span className="font-mono text-[11.5px] text-ink-400">
                  {a.nbArticles} article{a.nbArticles > 1 ? "s" : ""}
                </span>
              </span>
              <span className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEdition({ id: a.id, nom: a.nom, qualification: a.qualification, biographie: a.biographie ?? "" })
                  }
                  className={bContour}
                >
                  Modifier
                </button>
                {a.nbArticles === 0 && (
                  <button
                    type="button"
                    disabled={enCours}
                    onClick={() => confirm(`Supprimer l'auteur ${a.nom} ?`) && lancer(() => supprimer(a.id))}
                    className="cursor-pointer px-2 text-[13.5px] font-bold text-brique-700"
                  >
                    Supprimer
                  </button>
                )}
              </span>
            </li>
          ),
        )}
      </ul>
      {erreur && !edition && (
        <span role="alert" className="text-[13px] font-bold text-brique-700">
          {erreur}
        </span>
      )}
    </section>
  );
}
