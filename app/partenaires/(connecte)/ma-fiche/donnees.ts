import "server-only";
import type { DonneesMaFiche } from "@/components/espace/MaFiche";
import { soumisAutorisationCnaps } from "@/lib/organismes/cnaps";
import type { Espace } from "@/lib/supabase/queries/espace";

/** Données de « Ma fiche », partagées avec les étapes de l'accompagnement à l'inscription. */
export function donneesMaFiche({ organisme: o, siege, lieux, offres, user }: Espace): DonneesMaFiche {
  const s = (v: string | number | null) => (v === null ? "" : String(v));
  return {
    emailCompte: user.email,
    identite: {
      nom: o.nom,
      raison_sociale: s(o.raison_sociale),
      siret: s(o.siret),
      numero_declaration_activite: s(o.numero_declaration_activite),
      annee_creation: s(o.annee_creation),
    },
    logo: o.logo_url,
    soumisCnaps: soumisAutorisationCnaps(offres.map((x) => x.titre.slug)),
    agrement: {
      numero_agrement_cnaps: s(o.numero_agrement_cnaps),
      qualiopi: o.qualiopi,
      numero_qualiopi: s(o.numero_qualiopi),
    },
    coordonnees: {
      adresse: s(siege?.adresse ?? null),
      code_postal: s(siege?.code_postal ?? null),
      ville: s(siege?.ville ?? null),
      telephone: s(o.telephone),
      site_web: s(o.site_web),
      email_contact: s(o.email_contact),
      horaires: s(o.horaires),
    },
    lieux: lieux
      .filter((l) => !l.est_siege)
      .map((l) => ({
        id: l.id,
        nom: s(l.nom),
        adresse: l.adresse,
        code_postal: l.code_postal,
        ville: l.ville,
        formations: offres.filter((x) => x.lieux.includes(l.id)).map((x) => x.titre.libelle_court),
      })),
    pratique: { financements: o.financements, accessibilite_pmr: o.accessibilite_pmr, langues: o.langues },
    presentation: { presentation: s(o.presentation) },
  };
}
