// Imports relatifs : ce contenu est aussi lu par next.config.ts (blocage du build de production).
import { EDITEUR } from "./editeur";
import type { PageLegale } from "./types";

// Page Cookies et bandeau de consentement (audit RGPD et décision d'Erwan du 01/10/2026 : publicité Google Ads et
// Meta, mesure d'audience tierce, sous consentement). Rédaction Claude, relecture juridique conseillée.

export const BANDEAU_COOKIES = {
  titre: "Vos choix sur les cookies",
  texte:
    "Avec votre accord, nous utilisons des cookies pour mesurer l'audience du site et l'efficacité de nos publicités sur Google, Facebook et Instagram. Vous pouvez accepter, refuser ou choisir par finalité, et changer d'avis à tout moment.",
  enSavoirPlus: "En savoir plus",
  toutRefuser: "Tout refuser",
  personnaliser: "Personnaliser",
  enregistrer: "Enregistrer mes choix",
  toutAccepter: "Tout accepter",
  accepte: "Accepté",
  refuse: "Refusé",
  services: "Outils concernés :",
  categories: {
    mesure: {
      titre: "Mesure d'audience",
      texte: "Comprendre comment le site est utilisé, pour l'améliorer.",
    },
    publicite: {
      titre: "Publicité",
      texte: "Mesurer l'efficacité de nos annonces et les proposer aux personnes susceptibles d'être intéressées.",
    },
  },
  necessaires: {
    titre: "Cookies nécessaires",
    texte: "Toujours actifs : ils permettent la connexion aux espaces réservés et ne demandent pas d'accord.",
  },
};

export const COOKIES: PageLegale = {
  title: "Cookies",
  description:
    "Les cookies utilisés sur le site Trouve ta formation, leur rôle, leur durée, et comment modifier vos choix.",
  h1: "Cookies",
  maj: `Dernière mise à jour : ${EDITEUR.dateMaj}`,
  sections: [
    {
      h2: "Ce que fait le site sans votre accord",
      paragraphes: [
        "Sans votre accord, le site ne dépose aucun cookie lorsque vous le consultez. Nos propres statistiques de fréquentation fonctionnent sans cookie et sans identifiant : elles ne permettent d'identifier personne.",
        "Les espaces réservés (organismes, administration) utilisent des cookies strictement nécessaires à la connexion. La loi ne prévoit pas de demander votre accord pour eux.",
      ],
      tableau: {
        entetes: ["Cookie", "Où", "Rôle", "Durée"],
        lignes: [
          [
            "Session de connexion",
            "Espaces organisme et admin",
            "Vous garder connecté",
            "30 jours, renouvelés à chaque visite",
          ],
          [
            "Réinitialisation du mot de passe",
            "Espace organisme",
            "Choisir un nouveau mot de passe après un lien « mot de passe oublié »",
            "15 minutes",
          ],
          ["Choix sur les cookies", "Tout le site", "Mémoriser votre accord ou votre refus", "6 mois"],
        ],
      },
    },
    {
      h2: "Ce que font les outils tiers, avec votre accord",
      paragraphes: [
        "Les outils suivants ne sont chargés que si vous les acceptez dans le bandeau ou ci-dessous. Leurs cookies sont conservés au plus 13 mois.",
      ],
      tableau: {
        entetes: ["Finalité", "Outil", "Éditeur", "Rôle"],
        lignes: [
          ["Mesure d'audience", "Google Analytics", "Google Ireland Limited", "Statistiques de visite détaillées"],
          [
            "Publicité",
            "Google Ads",
            "Google Ireland Limited",
            "Mesure des campagnes sur Google, proposition de nos annonces",
          ],
          [
            "Publicité",
            "Meta (Facebook, Instagram)",
            "Meta Platforms Ireland Limited",
            "Mesure des campagnes sur Facebook et Instagram, proposition de nos annonces",
          ],
        ],
      },
    },
    {
      h2: "Modifier vos choix",
      paragraphes: [
        "Vous pouvez donner, refuser ou retirer votre accord à tout moment. Votre choix est conservé 6 mois, puis vous est redemandé. Refuser ne vous empêche pas d'utiliser le site.",
        "La page d'inscription des organismes utilise aussi un service anti-robots (Cloudflare Turnstile), qui analyse des informations techniques de votre navigateur sans déposer de cookie.",
      ],
      preferences: true,
    },
  ],
};
