"use client";

import Link from "next/link";
import { useEffect, useTransition } from "react";
import { ONBOARDING as O } from "@/contenu/espace/onboarding";

/** Pied de l'accompagnement : étape précédente, continuer (jamais bloquant), terminer. Note la progression. */
export function NavigationEtapes({
  etape,
  total,
  noterEtape,
}: {
  etape: number;
  total: number;
  noterEtape: (e: number | null) => Promise<void>;
}) {
  const [enCours, demarrer] = useTransition();
  useEffect(() => {
    void noterEtape(etape);
  }, [etape, noterEtape]);
  const bouton =
    "inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-ink-900 px-6 py-4 text-[15px] font-bold text-white hover:bg-brique-700 hover:text-white";
  return (
    <nav
      aria-label="Étapes"
      className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-line bg-white px-[clamp(18px,3vw,28px)] py-4"
    >
      {etape > 1 ? (
        <Link href={`/bienvenue/${etape - 1}/`} className="text-[15px] font-bold text-ink-900 hover:text-brique-700">
          {O.precedent}
        </Link>
      ) : (
        <span />
      )}
      <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="text-[13px] text-ink-500">{O.sauvegarde}</span>
        {etape < total ? (
          <Link href={`/bienvenue/${etape + 1}/`} className={bouton}>
            {O.continuer}
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <button
            type="button"
            disabled={enCours}
            onClick={() =>
              demarrer(async () => {
                await noterEtape(null);
                window.location.assign("/dashboard/");
              })
            }
            className={bouton}
          >
            {O.terminer}
            <span aria-hidden="true">→</span>
          </button>
        )}
      </span>
    </nav>
  );
}
