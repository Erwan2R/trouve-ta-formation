// Imports relatifs : ce contenu est aussi lu par next.config.ts (blocage du build de production).
import { EMAIL_CONTACT } from "../../lib/config/contact";
import { A_COMPLETER } from "../marqueurs";
import type { PageLegale } from "./types";

// Textes définitifs en cours de rédaction (Erwan, 30/09/2026). Les faits techniques ci-dessous décrivent ce que
// fait réellement le site : à conserver ou corriger par le rédacteur, jamais à contredire.
export const CONFIDENTIALITE: PageLegale = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité du site Trouve ta formation : données traitées, finalités, durées de conservation et droits.",
  h1: "Politique de confidentialité",
  maj: `Dernière mise à jour : ${A_COMPLETER}`,
  sections: [
    {
      h2: "Responsable du traitement",
      paragraphes: [`${A_COMPLETER} (identité et coordonnées). Pour toute question : ${EMAIL_CONTACT}.`],
    },
    {
      h2: "Visiteurs et candidats",
      paragraphes: [
        "Le site ne demande aucune coordonnée aux candidats. Le questionnaire d'orientation ne collecte ni nom, ni email, ni téléphone, et ne pose aucune question sur le casier judiciaire.",
        "Des statistiques anonymes sont enregistrées pour améliorer le service : écrans du questionnaire atteints, combinaisons de recherche sans résultat. Elles ne comportent ni adresse IP, ni identifiant, ni texte saisi librement.",
        `${A_COMPLETER} (base légale, durée de conservation).`,
      ],
    },
    {
      h2: "Organismes de formation inscrits",
      paragraphes: [
        "Pour créer et gérer une fiche, nous traitons l'adresse email et le mot de passe du compte, les informations publiées sur la fiche, et, si l'organisme les indique, le nom et le téléphone d'un contact interne, jamais publiés.",
        "La suppression du compte depuis l'espace organisme efface immédiatement la fiche et les données associées.",
        `${A_COMPLETER} (finalités, base légale, durées de conservation).`,
      ],
    },
    {
      h2: "Prospection des organismes",
      paragraphes: [
        `${A_COMPLETER} (origine des adresses professionnelles, base légale, droit d'opposition). La prospection est envoyée depuis un domaine dédié, distinct de trouve-ta-formation.fr.`,
      ],
    },
    {
      h2: "Destinataires et prestataires",
      paragraphes: [
        "Vos données ne sont ni vendues, ni louées, ni cédées. Elles sont traitées par nos prestataires techniques : Vercel (hébergement du site), Supabase (base de données et authentification), Resend (envoi des emails, région Europe) et Cloudflare Turnstile (protection anti-robots du formulaire d'inscription).",
        `${A_COMPLETER} (localisation des données et garanties en cas de transfert hors de l'Union européenne).`,
      ],
    },
    {
      h2: "Cookies",
      paragraphes: [
        "Le site n'utilise pas d'outil de mesure d'audience tiers ni de cookie publicitaire. L'espace organisme utilise des cookies de session, nécessaires à la connexion.",
        `${A_COMPLETER}`,
      ],
    },
    {
      h2: "Vos droits",
      paragraphes: [
        `Vous pouvez demander l'accès à vos données, leur rectification, leur effacement, la limitation de leur traitement, ou vous y opposer, en écrivant à ${EMAIL_CONTACT}. Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).`,
        `${A_COMPLETER} (délai de réponse).`,
      ],
    },
  ],
};
