// Imports relatifs : ce contenu est aussi lu par next.config.ts (blocage du build de production).
import { EMAIL_CONTACT } from "../../lib/config/contact";
import { EDITEUR } from "./editeur";
import type { PageLegale } from "./types";

// Conditions d'utilisation des organismes (audit RGPD du 01/10/2026, accord d'Erwan). Rédaction Claude d'après le
// fonctionnement réel du service et les décisions du projet ; relecture juridique indispensable avant publication.
export const CONDITIONS: PageLegale = {
  title: "Conditions d'utilisation",
  description:
    "Conditions d'utilisation de l'annuaire Trouve ta formation pour les organismes de formation : compte, fiche, modération, classement.",
  h1: "Conditions d'utilisation",
  maj: `Dernière mise à jour : ${EDITEUR.dateMaj}`,
  sections: [
    {
      h2: "1. Objet",
      paragraphes: [
        `Trouve ta formation est un annuaire en ligne des organismes de formation, édité par ${EDITEUR.denomination}. Ces conditions s'appliquent aux organismes qui créent un compte pour publier une fiche. La consultation du site par les candidats est libre et gratuite.`,
      ],
    },
    {
      h2: "2. Un service gratuit",
      paragraphes: [
        "La création du compte, la publication et la modification de la fiche, et sa suppression sont gratuites. Des services optionnels payants pourront être proposés plus tard ; ils feront l'objet de conditions distinctes et ne modifieront jamais le classement des fiches.",
      ],
    },
    {
      h2: "3. Compte",
      paragraphes: [
        "Un compte correspond à un organisme et à une seule fiche, quel que soit le nombre de lieux de formation. La personne qui crée le compte déclare être habilitée à représenter l'organisme.",
        "Vous êtes responsable de la confidentialité de vos identifiants. Signalez-nous sans délai toute utilisation de votre compte que vous n'avez pas autorisée.",
        "Votre fiche n'est publiée qu'après la confirmation de votre adresse email et le remplissage d'un minimum d'informations (nom, adresse, un moyen de contact).",
      ],
    },
    {
      h2: "4. Contenu de la fiche",
      paragraphes: [
        "Vous publiez les informations de votre fiche sous votre seule responsabilité. Vous vous engagez à ce qu'elles soient exactes, à jour et licites, en particulier les titres préparés, les prix, les financements acceptés, le numéro d'agrément CNAPS et la certification Qualiopi. L'éditeur ne vérifie pas ces informations avant publication.",
        "Les titres de formation se choisissent dans un référentiel tenu par l'éditeur. Si un titre manque, vous pouvez en demander l'ajout ; l'éditeur accepte ou refuse la demande et vous en informe.",
        "Vous accordez à l'éditeur, pour la durée de publication de votre fiche, le droit gratuit d'afficher son contenu (textes, logo) sur le site et dans les résultats des moteurs de recherche. Vous restez propriétaire de ce contenu.",
      ],
    },
    {
      h2: "5. Ce qui est interdit",
      paragraphes: ["Il est interdit de publier :"],
      puces: [
        "des informations fausses ou trompeuses, notamment sur un agrément, une certification, un taux de réussite ou un financement ;",
        "le contenu d'un autre organisme, ou une fiche pour un organisme que vous ne représentez pas ;",
        "des contenus illicites, injurieux ou portant atteinte aux droits de tiers ;",
        "des coordonnées ou des liens sans rapport avec l'activité de formation de l'organisme.",
      ],
    },
    {
      h2: "6. Modération",
      paragraphes: [
        "L'éditeur peut suspendre une fiche qui ne respecte pas ces conditions, ou le temps de vérifier un signalement. Une fiche suspendue n'est plus visible sur le site ; vous pouvez toujours vous connecter et la corriger, puis demander sa réactivation, que seul l'éditeur peut décider.",
        "En cas de manquement grave ou répété, l'éditeur peut supprimer le compte et la fiche. Sauf urgence, il vous en informe au préalable.",
        `Toute personne peut signaler une fiche inexacte ou illicite à ${EMAIL_CONTACT}.`,
      ],
    },
    {
      h2: "7. Classement des fiches",
      paragraphes: [
        "Les fiches sont classées selon leur pertinence par rapport à la recherche du candidat (titre, lieu, financement, rythme…) et leur niveau de complétude : une fiche complète est mieux classée. Aucun organisme ne peut payer pour améliorer son classement. Si un emplacement est un jour mis en avant contre rémunération, il sera toujours signalé comme tel.",
        "Une fiche peu complète peut être exclue des moteurs de recherche tant qu'elle n'est pas enrichie ; elle reste visible sur le site.",
      ],
    },
    {
      h2: "8. Emails",
      paragraphes: [
        "Nous vous écrivons à propos de votre compte (confirmation d'adresse, changement d'adresse, mot de passe), de vos demandes, et pour vous rappeler de compléter votre fiche. Vous pouvez refuser les rappels en un clic depuis chacun d'eux ; les emails liés à votre compte continuent de vous parvenir.",
      ],
    },
    {
      h2: "9. Suppression du compte",
      paragraphes: [
        "Vous pouvez supprimer votre compte à tout moment depuis votre espace, sans justification. La suppression est immédiate et définitive : la fiche disparaît du site et vos données sont effacées.",
      ],
    },
    {
      h2: "10. Responsabilité",
      paragraphes: [
        "L'éditeur met tout en œuvre pour assurer l'accès au site, sans pouvoir garantir une disponibilité permanente. Il n'est pas partie aux relations entre les organismes et les candidats, et ne peut être tenu responsable des informations publiées par les organismes ni des formations qu'ils dispensent.",
      ],
    },
    {
      h2: "11. Données personnelles",
      paragraphes: [
        "Le traitement des données liées à votre compte et à votre fiche est décrit dans la politique de confidentialité.",
      ],
    },
    {
      h2: "12. Modification des conditions",
      paragraphes: [
        "L'éditeur peut faire évoluer ces conditions. Les modifications importantes vous sont signalées par email au moins 30 jours avant leur entrée en vigueur ; vous pouvez supprimer votre compte si vous ne les acceptez pas.",
      ],
    },
    {
      h2: "13. Droit applicable",
      paragraphes: [
        `Ces conditions sont soumises au droit français. En cas de difficulté, écrivez-nous d'abord à ${EMAIL_CONTACT} pour chercher une solution amiable ; à défaut, les tribunaux compétents sont ceux du ressort du siège de l'éditeur.`,
      ],
    },
  ],
};
