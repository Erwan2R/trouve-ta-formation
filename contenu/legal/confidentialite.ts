// Imports relatifs : ce contenu est aussi lu par next.config.ts (blocage du build de production).
import { EMAIL_CONTACT } from "../../lib/config/contact";
import type { PageLegale } from "./types";

// Rédaction Claude (01/10/2026) à partir de ce que fait réellement le site ; relecture juridique conseillée, en
// particulier la prospection et les durées de conservation. Responsable : l'entreprise individuelle d'Erwan.
export const CONFIDENTIALITE: PageLegale = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité du site Trouve ta formation : données traitées, finalités, durées de conservation et droits.",
  h1: "Politique de confidentialité",
  maj: "Dernière mise à jour : 1er octobre 2026",
  sections: [
    {
      h2: "Responsable du traitement",
      paragraphes: [
        `Erwan de Rotalier EI, entrepreneur individuel établi à Bois-Colombes (SIREN 882 911 399), éditeur du site. Pour toute question : ${EMAIL_CONTACT}.`,
      ],
    },
    {
      h2: "Visiteurs et candidats",
      paragraphes: [
        "Le site ne demande aucune coordonnée aux candidats. Le questionnaire d'orientation ne collecte ni nom, ni email, ni téléphone, et ne pose aucune question sur le casier judiciaire.",
        "Des statistiques anonymes sont enregistrées pour améliorer le service : pages vues, clics sur les boutons de contact des fiches, écrans du questionnaire atteints, combinaisons de recherche sans résultat. Elles ne comportent ni adresse IP, ni identifiant, ni cookie, ni texte saisi librement.",
        "Ces statistiques reposent sur l'intérêt légitime de l'éditeur à mesurer et améliorer son service. Comme elles ne permettent d'identifier personne, elles sont conservées sans limite de durée.",
      ],
    },
    {
      h2: "Organismes de formation inscrits",
      paragraphes: [
        "Pour créer et gérer une fiche, nous traitons l'adresse email et le mot de passe du compte, les informations publiées sur la fiche, et, si l'organisme les indique, le nom et le téléphone d'un contact interne, jamais publiés.",
        "Ces données servent à publier la fiche, à sécuriser le compte et à vous écrire à propos de votre fiche (validation de l'adresse, rappels pour la compléter, réponse à vos demandes). Ce traitement est nécessaire au service que vous demandez en vous inscrivant. Vous pouvez refuser les rappels en un clic depuis chacun d'eux.",
        "Les données sont conservées tant que le compte existe. La suppression du compte depuis l'espace organisme efface immédiatement la fiche et les données associées.",
      ],
    },
    {
      h2: "Prospection des organismes",
      paragraphes: [
        "Pour proposer le référencement aux organismes de formation qui ne sont pas encore inscrits, nous utilisons les coordonnées professionnelles qu'ils publient eux-mêmes : fiche Google, catalogue Mon Compte Formation, site internet. Nous pouvons les appeler, puis leur écrire, uniquement à propos de leur activité d'organisme de formation.",
        "Ce traitement repose sur l'intérêt légitime de l'éditeur à faire connaître son service aux professionnels concernés. Ces coordonnées ne sont jamais publiées sur le site et sont conservées au plus trois ans après le dernier contact.",
        `Vous pouvez vous y opposer à tout moment, sans justification, en écrivant à ${EMAIL_CONTACT}. Vos données sont alors effacées ; seule une empreinte chiffrée de votre SIRET, de votre email et du domaine de votre site est conservée, pour garantir que vous ne serez plus jamais recontacté. La prospection par email est envoyée depuis un domaine dédié, distinct de trouve-ta-formation.fr.`,
      ],
    },
    {
      h2: "Destinataires et prestataires",
      paragraphes: [
        "Vos données ne sont ni vendues, ni louées, ni cédées. Elles sont traitées par nos prestataires techniques : Vercel (hébergement du site), Supabase (base de données et authentification), Resend (envoi des emails, région Europe) et Cloudflare Turnstile (protection anti-robots du formulaire d'inscription).",
        "La base de données est hébergée dans l'Union européenne (Paris). Plusieurs de ces prestataires sont des sociétés américaines : un éventuel transfert de données hors de l'Union européenne est encadré par les clauses contractuelles types de la Commission européenne ou par le cadre de protection des données UE–États-Unis.",
      ],
    },
    {
      h2: "Cookies",
      paragraphes: [
        "Le site n'utilise pas d'outil de mesure d'audience tiers ni de cookie publicitaire. L'espace organisme utilise des cookies de session, nécessaires à la connexion.",
        "Ces cookies étant strictement nécessaires au fonctionnement du service, ils ne demandent pas de consentement préalable : aucun bandeau ne s'affiche.",
      ],
    },
    {
      h2: "Vos droits",
      paragraphes: [
        `Vous pouvez demander l'accès à vos données, leur rectification, leur effacement, la limitation de leur traitement, ou vous y opposer, en écrivant à ${EMAIL_CONTACT}. Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).`,
        "Nous répondons dans un délai d'un mois à compter de la réception de votre demande.",
      ],
    },
  ],
};
