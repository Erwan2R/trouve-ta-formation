"use client";

import { ouvrirPreferences } from "@/components/public/GestionConsentement";
import { servicesActifs } from "@/lib/config/traceurs";

/** Page Cookies : rouvre le panneau des préférences (donner, refuser ou retirer son accord). */
export function BoutonPreferences() {
  // Sans outil tiers configuré, il n'y a aucun choix à faire : pas de bouton.
  if (servicesActifs().length === 0) return null;
  return (
    <button
      type="button"
      onClick={ouvrirPreferences}
      className="mt-2 cursor-pointer self-start rounded-full bg-ink-900 px-5 py-3 text-[15px] font-bold text-white hover:bg-brique-700"
    >
      Modifier mes choix
    </button>
  );
}
