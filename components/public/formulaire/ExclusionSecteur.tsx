"use client";

import { TOUS_SECTEURS } from "@/lib/formulaire/parcours";

/** « Peu importe » désélectionne les départements, et inversement (Copy §7). Sans JavaScript, le serveur tranche. */
export function ExclusionSecteur({ children }: { children: React.ReactNode }) {
  return (
    <div
      onChange={(e) => {
        const cible = e.target as HTMLInputElement;
        if (cible.name !== "secteur" || !cible.checked) return;
        cible.form?.querySelectorAll<HTMLInputElement>('input[name="secteur"]').forEach((c) => {
          if (c !== cible && (cible.value === TOUS_SECTEURS || c.value === TOUS_SECTEURS)) c.checked = false;
        });
      }}
    >
      {children}
    </div>
  );
}
