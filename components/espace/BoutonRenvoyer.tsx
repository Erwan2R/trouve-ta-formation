"use client";

import { useActionState } from "react";

type Resultat = { ok: true } | { ok: false; erreur: string };

/** Bouton « Renvoyer l'email de validation » → « Email renvoyé » ; affiche la limite atteinte le cas échéant. */
export function BoutonRenvoyer({
  action,
  libelle,
  fait,
}: {
  action: () => Promise<Resultat>;
  libelle: string;
  fait: string;
}) {
  const [etat, envoyer, enCours] = useActionState<Resultat | null>(() => action(), null);
  return (
    <form action={envoyer} className="flex flex-col items-start gap-2">
      <button
        type="submit"
        disabled={enCours || etat?.ok === true}
        className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-white px-[26px] py-[18px] text-[15.5px] font-bold text-ink-900 transition-colors hover:bg-brique-400 disabled:cursor-default disabled:hover:bg-white"
      >
        {etat?.ok ? fait : libelle}
      </button>
      {etat && !etat.ok && (
        <p role="alert" className="max-w-[40ch] text-[13.5px] leading-normal font-bold text-brique-400">
          {etat.erreur}
        </p>
      )}
    </form>
  );
}
