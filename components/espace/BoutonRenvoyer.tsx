"use client";

import { useActionState } from "react";

/** Bouton « Renvoyer l'email de validation » → « Email renvoyé ». */
export function BoutonRenvoyer({
  action,
  libelle,
  fait,
}: {
  action: () => Promise<"ok" | "erreur">;
  libelle: string;
  fait: string;
}) {
  const [etat, envoyer, enCours] = useActionState<"ok" | "erreur" | null>(() => action(), null);
  return (
    <form action={envoyer}>
      <button
        type="submit"
        disabled={enCours || etat === "ok"}
        className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-white px-[26px] py-[18px] text-[15.5px] font-bold text-ink-900 transition-colors hover:bg-brique-400 disabled:cursor-default disabled:hover:bg-white"
      >
        {etat === "ok" ? fait : etat === "erreur" ? "Échec de l'envoi, réessayez" : libelle}
      </button>
    </form>
  );
}
