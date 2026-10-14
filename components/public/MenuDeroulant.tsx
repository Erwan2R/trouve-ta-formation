"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Referme le menu et ses sous-menus. */
function fermer(menu: HTMLDetailsElement | null) {
  if (!menu) return;
  menu.querySelectorAll("details").forEach((d) => (d.open = false));
  menu.open = false;
}

/**
 * Menu déroulant du header (méga-menu « Les formations », menu burger) : <details> natif, liens rendus côté serveur
 * (passés en enfants). Ajout client : fermeture au clic en dehors, sur Échap et à chaque changement de page (le header
 * persiste d'une page à l'autre).
 */
export function MenuDeroulant({ className, children }: { className?: string; children: React.ReactNode }) {
  const menu = useRef<HTMLDetailsElement>(null);
  const chemin = usePathname();
  useEffect(() => fermer(menu.current), [chemin]);
  useEffect(() => {
    const dehors = (e: PointerEvent) => {
      if (menu.current?.open && !menu.current.contains(e.target as Node)) fermer(menu.current);
    };
    const echap = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !menu.current?.open) return;
      fermer(menu.current);
      menu.current.querySelector("summary")?.focus();
    };
    document.addEventListener("pointerdown", dehors);
    document.addEventListener("keydown", echap);
    return () => {
      document.removeEventListener("pointerdown", dehors);
      document.removeEventListener("keydown", echap);
    };
  }, []);
  return (
    <details ref={menu} className={className}>
      {children}
    </details>
  );
}
