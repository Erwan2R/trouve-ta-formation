"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const envoyer = (type: string) =>
  navigator.sendBeacon?.(
    "/api/evenements/",
    new Blob([JSON.stringify({ type, chemin: location.pathname })], { type: "application/json" }),
  );

/**
 * Tracking interne sans cookie (UX Analytics admin) : une vue par page affichée, un clic par CTA de fiche
 * (liens marqués data-cta). Rien sur les espaces organisme et admin.
 */
export function Mesure() {
  const chemin = usePathname();
  const actif = typeof window !== "undefined" && !/^(admin|partenaires)(-dev|-preprod)?\./.test(location.hostname);
  useEffect(() => {
    if (actif) envoyer("vue_page");
  }, [chemin, actif]);
  useEffect(() => {
    if (!actif) return;
    const clic = (e: MouseEvent) => {
      const cta = (e.target as Element | null)?.closest?.("a[data-cta]")?.getAttribute("data-cta");
      if (cta) envoyer(`clic_${cta}`);
    };
    document.addEventListener("click", clic, true);
    return () => document.removeEventListener("click", clic, true);
  }, [actif]);
  return null;
}
