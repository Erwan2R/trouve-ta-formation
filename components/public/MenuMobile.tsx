"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Menu burger mobile : <details> natif, liens rendus côté serveur (passés en enfants). Seul ajout client : le header
 * persiste entre deux pages, on referme donc le menu à chaque changement de page.
 */
export function MenuMobile({ children }: { children: React.ReactNode }) {
  const menu = useRef<HTMLDetailsElement>(null);
  const chemin = usePathname();
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [chemin]);
  return (
    <details ref={menu} className="group ml-auto xl:hidden">
      {children}
    </details>
  );
}
