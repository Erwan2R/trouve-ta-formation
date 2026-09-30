"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { seDeconnecter as deconnexionOrganisme } from "@/app/partenaires/(connecte)/parametres/actions";

/**
 * Menu du compte (pastille aux initiales) : identité du compte, Paramètres, Se déconnecter.
 * Espace admin : sa propre action de déconnexion et la pastille sombre de la barre noire.
 */
export function MenuCompte({
  initiales,
  nom,
  email,
  seDeconnecter = deconnexionOrganisme,
  sombre = false,
}: {
  initiales: string;
  nom: string | null;
  email: string;
  seDeconnecter?: () => Promise<void>;
  sombre?: boolean;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [enCours, demarrer] = useTransition();
  const racine = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ouvert) return;
    const fermer = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !racine.current?.contains(e.target as Node))
        setOuvert(false);
    };
    document.addEventListener("mousedown", fermer);
    document.addEventListener("keydown", fermer);
    return () => (document.removeEventListener("mousedown", fermer), document.removeEventListener("keydown", fermer));
  }, [ouvert]);

  return (
    <div ref={racine} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={ouvert}
        aria-label="Menu du compte"
        onClick={() => setOuvert(!ouvert)}
        className={`flex size-[42px] cursor-pointer items-center justify-center rounded-full font-mono text-xs text-white hover:bg-brique-700 ${sombre ? "bg-line-dark" : "bg-ink-900"}`}
      >
        {initiales}
      </button>
      {ouvert && (
        <div
          role="menu"
          className="absolute top-[calc(100%+8px)] right-0 z-40 flex w-64 flex-col gap-1 rounded-[20px] border border-line bg-white p-2 shadow-[0_24px_60px_-24px_rgba(11,11,11,0.22)]"
        >
          <span className="flex flex-col gap-0.5 border-b border-cream-200 px-3 pt-2 pb-3">
            {nom && <span className="text-sm font-bold">{nom}</span>}
            <span className="text-[13px] [overflow-wrap:anywhere] text-ink-500">{email}</span>
          </span>
          <Link
            role="menuitem"
            href="/parametres/"
            onClick={() => setOuvert(false)}
            className="rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-900 hover:bg-cream-100 hover:text-ink-900"
          >
            Paramètres
          </Link>
          <button
            role="menuitem"
            type="button"
            disabled={enCours}
            onClick={() =>
              demarrer(async () => {
                await seDeconnecter();
                window.location.assign("/connexion/");
              })
            }
            className="cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-brique-700 hover:bg-brique-050"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
