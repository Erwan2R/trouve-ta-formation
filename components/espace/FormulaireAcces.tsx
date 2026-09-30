"use client";

import { useActionState, useEffect } from "react";
import type { EtatFormulaire } from "@/app/partenaires/(acces)/actions";
import { reinitialiserTurnstile, Turnstile } from "./Turnstile";

type Champ = {
  nom: string;
  libelle: string;
  type: string;
  autocomplete: string;
  aide?: string;
  minLength?: number;
  inputMode?: "numeric" | "text";
};

/** Formulaire d'accès : champs empilés, erreur sous le formulaire en brique, bouton plein. */
export function FormulaireAcces({
  action,
  champs,
  bouton,
  turnstile,
}: {
  action: (etat: EtatFormulaire, donnees: FormData) => Promise<EtatFormulaire>;
  champs: Champ[];
  bouton: string;
  /** Clé publique Turnstile : protection anti-robots du formulaire (inscription). */
  turnstile?: string;
}) {
  const [etat, envoyer, enCours] = useActionState(action, null);
  // Rechargement complet : le middleware lit la nouvelle session et réécrit l'URL vers l'espace.
  useEffect(() => {
    if (etat?.vers) window.location.assign(etat.vers);
    else if (etat?.erreur && turnstile) reinitialiserTurnstile();
  }, [etat, turnstile]);
  return (
    <form action={envoyer} className="flex flex-col gap-4">
      {champs.map((c) => (
        <div key={c.nom} className="flex flex-col gap-[7px]">
          <label htmlFor={c.nom} className="text-[13.5px] font-bold text-ink-900">
            {c.libelle}
          </label>
          <input
            id={c.nom}
            name={c.nom}
            type={c.type}
            autoComplete={c.autocomplete}
            required
            minLength={c.minLength}
            inputMode={c.inputMode}
            defaultValue={c.type === "password" ? undefined : etat?.valeurs?.[c.nom]}
            aria-describedby={c.aide ? `${c.nom}-aide` : undefined}
            className="rounded-[14px] border border-line-field bg-white px-[15px] py-3 text-[15px] text-ink-900 outline-none focus:border-ink-900"
          />
          {c.aide && (
            <p id={`${c.nom}-aide`} className="text-[13px] text-ink-500">
              {c.aide}
            </p>
          )}
        </div>
      ))}
      {turnstile && <Turnstile cle={turnstile} />}
      {etat?.erreur && (
        <p role="alert" className="text-[13.5px] font-bold text-brique-700">
          {etat.erreur}
        </p>
      )}
      {etat?.ok && (
        <p role="status" className="text-[13.5px] font-bold text-ink-900">
          {etat.ok}
        </p>
      )}
      <button
        type="submit"
        disabled={enCours || !!etat?.vers}
        className="mt-1 inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full bg-ink-900 px-6 py-4 text-[15.5px] font-bold text-white transition-colors hover:bg-brique-700 disabled:cursor-wait disabled:opacity-60"
      >
        {bouton}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
