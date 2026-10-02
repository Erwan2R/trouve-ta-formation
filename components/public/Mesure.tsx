"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const envoyer = (type: string) =>
  navigator.sendBeacon?.(
    "/api/evenements/",
    new Blob([JSON.stringify({ type, chemin: location.pathname })], { type: "application/json" }),
  );

/**
 * Tracking interne sans cookie (UX Analytics admin) : une vue par page affichée (ou une 404), un clic par CTA de fiche
 * (liens marqués data-cta). Rien sur les espaces organisme et admin.
 */
export function Mesure() {
  const chemin = usePathname();
  const actif = typeof window !== "undefined" && !/^(admin|partenaires)(-dev|-preprod)?\./.test(location.hostname);
  useEffect(() => {
    // Page introuvable : repérée par l'attribut posé par NotFoundContent (404 racine et 404 du silo).
    if (actif) envoyer(document.querySelector("[data-page-404]") ? "page_404" : "vue_page");
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
