"use client";

import { useEffect, useState } from "react";
import { BLOG, CATEGORIES_BLOG, libelleCategorie } from "@/contenu/securite-privee/blog";

/**
 * Filtres par catégorie (UX blog §3.3, Copy §3) : liens texte vers une ancre (#le-metier…), filtrage côté client,
 * aucune URL indexable. Sans JavaScript, tous les articles restent affichés. Avec un filtre : l'article mis en avant
 * est masqué et le listing prend le nom de la catégorie pour titre.
 */
// ponytail: filtre la page de liste affichée ; à revoir quand la pagination servira (au-delà de 12 articles).
export function FiltreCategories({ presentes }: { presentes: string[] }) {
  const [actif, setActif] = useState("");
  useEffect(() => {
    const lire = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      setActif(CATEGORIES_BLOG.some((c) => c.cle === h) ? h : "");
    };
    lire();
    window.addEventListener("hashchange", lire);
    return () => window.removeEventListener("hashchange", lire);
  }, []);
  useEffect(() => {
    document.querySelectorAll<HTMLElement>("#listing-blog [data-categorie]").forEach((el) => {
      const li = el.closest("li")!;
      // L'article mis en avant n'apparaît dans le listing qu'avec un filtre (sinon il est déjà en grand au-dessus).
      li.hidden = (!!li.dataset.enAvant && !actif) || (!!actif && el.dataset.categorie !== actif);
    });
    const enAvant = document.getElementById("article-en-avant");
    if (enAvant) enAvant.hidden = !!actif;
    const titre = document.getElementById("titre-listing");
    if (titre) {
      titre.hidden = !actif;
      titre.textContent = actif ? libelleCategorie(actif) : "";
    }
  }, [actif]);

  const lien = (cle: string, libelle: string) => (
    <a
      key={cle || "tous"}
      href={cle ? `#${cle}` : "#"}
      onClick={(e) => {
        if (!cle) {
          e.preventDefault();
          history.replaceState(null, "", location.pathname + location.search);
          setActif("");
        }
      }}
      aria-current={actif === cle ? "true" : undefined}
      className={`rounded-full px-4 py-2.5 text-[14px] font-semibold whitespace-nowrap ${actif === cle ? "bg-ink-900 text-white hover:text-white" : "border border-line bg-white text-ink-600 hover:border-ink-900 hover:text-ink-900"}`}
    >
      {libelle}
    </a>
  );
  return (
    <nav aria-label="Catégories" className="flex flex-wrap gap-2">
      {lien("", BLOG.liste.tous)}
      {CATEGORIES_BLOG.filter((c) => presentes.includes(c.cle)).map((c) => lien(c.cle, c.libelle))}
    </nav>
  );
}
