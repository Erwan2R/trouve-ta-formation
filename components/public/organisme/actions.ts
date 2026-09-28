import type { Organisme } from "@/lib/supabase/queries/organismes";

/** Liens d'action de la fiche. Une action sans donnée n'existe pas (jamais de bouton grisé — Copy fiche §4). */
export function actionsOrganisme(o: Organisme) {
  const adresse = o.siege ? `${o.siege.adresse}, ${o.siege.code_postal} ${o.siege.ville}` : null;
  return {
    appeler: o.telephone ? `tel:${o.telephone.replace(/[^\d+]/g, "")}` : null,
    site: o.site_web,
    itineraire: adresse ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresse)}` : null,
  };
}

/** « academie-demo.example » depuis « https://academie-demo.example/ ». */
export const domaine = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
