// Outils tiers soumis au consentement (décision Erwan 01/10/2026 : publicité Google Ads et Meta, mesure d'audience
// tierce). Chacun ne s'active que si son identifiant est renseigné ; aucun ne se charge avant l'accord du visiteur.
// Nos statistiques internes (sans cookie ni identifiant) restent hors consentement : voir docs/AUDIT_RGPD.md.

export type CategorieConsentement = "mesure" | "publicite";

export const SERVICES = [
  {
    cle: "ga4",
    nom: "Google Analytics",
    categorie: "mesure" as const,
    identifiant: process.env.NEXT_PUBLIC_GA4_ID ?? "",
    editeur: "Google Ireland Limited",
  },
  {
    cle: "google-ads",
    nom: "Google Ads",
    categorie: "publicite" as const,
    identifiant: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "",
    editeur: "Google Ireland Limited",
  },
  {
    cle: "meta",
    nom: "Meta (Facebook, Instagram)",
    categorie: "publicite" as const,
    identifiant: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
    editeur: "Meta Platforms Ireland Limited",
  },
];

/** Aperçu du bandeau sans identifiant configuré (dev et preprod, pour relecture). Jamais en production. */
export const APERCU_BANDEAU = process.env.NEXT_PUBLIC_BANDEAU_APERCU === "1";

export const servicesActifs = () => SERVICES.filter((s) => s.identifiant || APERCU_BANDEAU);

/** Choix du visiteur : conservé 6 mois (recommandation CNIL), puis redemandé. */
export const COOKIE_CONSENTEMENT = "ttf_consentement";
export const DUREE_CONSENTEMENT_JOURS = 182;
export type Consentement = { mesure: boolean; publicite: boolean; le: string };

export function lireConsentement(cookies: string): Consentement | null {
  const brut = cookies.split("; ").find((c) => c.startsWith(`${COOKIE_CONSENTEMENT}=`));
  if (!brut) return null;
  try {
    const c = JSON.parse(decodeURIComponent(brut.slice(COOKIE_CONSENTEMENT.length + 1))) as Consentement;
    return typeof c.mesure === "boolean" && typeof c.publicite === "boolean" ? c : null;
  } catch {
    return null;
  }
}

export const ecrireConsentement = (c: Consentement, secure: boolean) =>
  `${COOKIE_CONSENTEMENT}=${encodeURIComponent(JSON.stringify(c))}; Max-Age=${DUREE_CONSENTEMENT_JOURS * 86400}; Path=/; SameSite=Lax${secure ? "; Secure" : ""}`;
