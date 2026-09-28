"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LIENS = [
  { href: "/dashboard/", libelle: "Tableau de bord" },
  { href: "/ma-fiche/", libelle: "Ma fiche" },
  { href: "/formations/", libelle: "Mes formations", compteur: true },
  { href: "/parametres/", libelle: "Paramètres" },
];

/** Navigation de l'espace (maquette Dashboard organisme) : pastille noire sur la page courante. */
export function NavEspace({ nbFormations }: { nbFormations: number }) {
  const chemin = usePathname().replace(/^\/partenaires/, "");
  return (
    <nav aria-label="Espace organisme" className="flex min-w-0 flex-1 flex-wrap gap-0.5">
      {LIENS.map((l) => {
        const actif = chemin.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={actif ? "page" : undefined}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-colors ${
              actif
                ? "bg-ink-900 font-bold text-white hover:text-white"
                : "font-semibold text-ink-700 hover:bg-cream-200 hover:text-ink-900"
            }`}
          >
            {l.libelle}
            {l.compteur && (
              <span
                className={`inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 font-mono text-[11px] font-normal ${actif ? "bg-line-dark text-white" : "bg-cream-200 text-ink-600"}`}
              >
                {nbFormations}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
