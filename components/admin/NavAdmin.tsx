"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Maquette « Navigation admin ». Blog : avec le Sprint 10. Prospection : page ajoutée (décision Erwan, hors maquette).
const LIENS = [
  { href: "/dashboard/", libelle: "Tableau de bord" },
  { href: "/fichier-client/", libelle: "Fichier client" },
  { href: "/prospection/", libelle: "Prospection" },
  { href: "/referentiel-titres/", libelle: "Référentiel des titres" },
  { href: "/analytics/", libelle: "Analytics" },
  { href: "/parametres/", libelle: "Paramètres" },
];

export function NavAdmin() {
  const chemin = usePathname().replace(/^\/admin/, "");
  return (
    <nav
      aria-label="Espace admin"
      className="flex min-w-0 flex-1 flex-nowrap gap-0.5 overflow-x-auto [scrollbar-width:none]"
    >
      {LIENS.map((l) => {
        const actif = chemin.startsWith(l.href) || (l.href === "/fichier-client/" && chemin.startsWith("/fiche-client/"));
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={actif ? "page" : undefined}
            className={`rounded-full px-3 py-[9px] text-[13.5px] whitespace-nowrap transition-colors ${
              actif
                ? "bg-white font-bold text-ink-900 hover:text-ink-900"
                : "font-semibold text-on-dark hover:bg-line-dark hover:text-white"
            }`}
          >
            {l.libelle}
          </Link>
        );
      })}
    </nav>
  );
}
