"use client";

import { useState } from "react";

/**
 * Filtres : colonne en desktop, tiroir en mobile ouvert par un bouton collant « Filtrer (n) ».
 * Jamais empilés au-dessus des résultats en mobile (UX catalogue §5).
 */
export function TiroirFiltres({ actifs, children }: { actifs: number; children: React.ReactNode }) {
  const [ouvert, setOuvert] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        aria-expanded={ouvert}
        aria-controls="panneau-filtres"
        className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink-900 px-6 py-3.5 text-[15px] font-bold text-white shadow-menu lg:hidden"
      >
        Filtrer{actifs > 0 && ` (${actifs})`}
      </button>
      <div
        id="panneau-filtres"
        className={
          ouvert
            ? "fixed inset-0 z-50 overflow-y-auto bg-cream-100 p-4 lg:static lg:z-auto lg:overflow-visible lg:bg-transparent lg:p-0"
            : "max-lg:hidden"
        }
      >
        {ouvert && (
          <button
            type="button"
            onClick={() => setOuvert(false)}
            className="mb-3 ml-auto flex rounded-full bg-cream-200 px-4 py-2 text-sm font-semibold lg:hidden"
          >
            Fermer
          </button>
        )}
        {children}
      </div>
    </>
  );
}
