// Imports relatifs : ce contenu est aussi lu par next.config.ts (blocage du build de production).
import { EMAIL_CONTACT } from "../../lib/config/contact";
import { EDITEUR } from "./editeur";
import type { PageLegale } from "./types";

// Rédaction Claude à partir de ce que fait réellement le site (audit RGPD du 01/10/2026, docs/AUDIT_RGPD.md), avec la
// décision d'Erwan d'utiliser des outils de publicité (Google Ads, Meta) et de mesure d'audience tiers sous
// consentement. Relecture juridique conseillée. Garder aligné sur le registre des traitements.
export const CONFIDENTIALITE: PageLegale = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité du site Trouve ta formation : données traitées, finalités, durées de conservation, cookies et droits.",
  h1: "Politique de confidentialité",
  maj: `Dernière mise à jour : ${EDITEUR.dateMaj}`,
  sections: [
    {
      h2: "Qui est responsable de vos données ?",
      paragraphes: [
        `${EDITEUR.denomination}, éditeur du site trouve-ta-formation.fr (voir les mentions légales), est responsable des traitements décrits ici. Pour toute question sur vos données : ${EMAIL_CONTACT}.`,
      ],
    },
    {
      h2: "Si vous cherchez une formation",
      paragraphes: [
        "Le site ne vous demande aucune coordonnée. Le questionnaire d'orientation ne collecte ni nom, ni email, ni téléphone, et ne pose aucune question sur le casier judiciaire.",
        "Pour améliorer le service, nous tenons nos propres statistiques : pages consultées, clics sur les boutons de contact des fiches, écrans du questionnaire atteints, combinaisons de recherche sans résultat. Elles fonctionnent sans cookie, ne comportent ni adresse IP ni identifiant, et ne permettent d'identifier personne. Le détail des pages consultées est conservé 25 mois ; les totaux, sans limite.",
        "Avec votre accord seulement, nous utilisons aussi des outils de mesure d'audience et de publicité proposés par des tiers (voir « Cookies et publicité » ci-dessous).",
      ],
    },
    {
      h2: "Si vous représentez un organisme inscrit",
      paragraphes: [
        "Pour créer et gérer votre fiche, nous traitons l'adresse email et le mot de passe de votre compte (le mot de passe n'est jamais stocké en clair), les informations que vous publiez sur votre fiche, et, si vous les indiquez, le nom et le téléphone d'un contact interne, jamais publiés.",
        "Ces données servent à publier votre fiche, à sécuriser votre compte et à vous écrire à propos de votre fiche : validation de votre adresse, rappels pour la compléter, réponses à vos demandes. Ce traitement est nécessaire au service que vous demandez en vous inscrivant (conditions d'utilisation). Les rappels reposent sur notre intérêt légitime ; vous pouvez les refuser en un clic depuis chacun d'eux.",
        "Vos données sont conservées tant que votre compte existe. Un compte dont l'adresse n'a jamais été confirmée est supprimé 30 jours après sa création. La suppression du compte depuis votre espace efface immédiatement votre fiche et les données associées. Vous pouvez à tout moment télécharger vos données depuis les paramètres de votre espace.",
      ],
    },
    {
      h2: "Si nous vous avons contacté pour vous proposer le référencement",
      paragraphes: [
        "Nous utilisons les coordonnées professionnelles que votre organisme publie lui-même : fiche Google, catalogue Mon Compte Formation, site internet. Nous pouvons vous appeler, puis vous écrire, uniquement pour vous proposer le référencement de votre organisme.",
        "Ce traitement repose sur notre intérêt légitime à faire connaître le service aux organismes concernés. Les données utilisées sont le nom et la raison sociale de l'organisme, son numéro SIRET, ses coordonnées professionnelles (email, téléphone, site), les départements où il est présent et les titres qu'il prépare. Elles ne sont jamais publiées sur le site et sont conservées au plus trois ans après notre dernier contact.",
        `Vous pouvez vous y opposer à tout moment, sans justification, en le disant lors de notre appel ou en écrivant à ${EMAIL_CONTACT} : vos données sont alors effacées. Seule une empreinte chiffrée de votre SIRET, de votre email et du domaine de votre site est conservée, sans limite de durée, pour garantir que vous ne serez plus jamais recontacté. Les emails de prospection sont envoyés depuis un domaine dédié, distinct de trouve-ta-formation.fr.`,
      ],
    },
    {
      h2: "Cookies et publicité",
      paragraphes: [
        "Sans votre accord, le site ne dépose aucun cookie lorsque vous le consultez. Seuls les espaces organisme et admin utilisent un cookie de session, strictement nécessaire à la connexion.",
        "Avec votre accord, que vous donnez ou refusez dans le bandeau affiché à votre première visite :",
      ],
      puces: [
        "Mesure d'audience (Google Analytics) : comprendre comment le site est utilisé, au-delà de nos propres statistiques. Google Ireland Limited traite alors des données de navigation et un identifiant attribué à votre navigateur.",
        "Publicité (Google Ads, Meta) : mesurer l'efficacité de nos campagnes publicitaires sur Google, Facebook et Instagram, et proposer nos annonces aux personnes susceptibles d'être intéressées. Google Ireland Limited et Meta Platforms Ireland Limited traitent alors des données de navigation et des identifiants publicitaires, et peuvent les rapprocher des comptes que vous détenez chez eux, selon leurs propres politiques.",
      ],
    },
    {
      h2: "Votre choix sur les cookies",
      paragraphes: [
        "Votre choix est conservé 6 mois, puis vous est redemandé. Vous pouvez le modifier ou retirer votre accord à tout moment depuis la page Cookies ou le lien « Gestion des cookies » en bas de chaque page. Refuser ne vous empêche pas d'utiliser le site. Les cookies déposés par ces outils sont conservés au plus 13 mois, et les données collectées au plus 25 mois.",
      ],
    },
    {
      h2: "Qui a accès à vos données ?",
      paragraphes: [
        "Vos données ne sont ni vendues, ni louées, ni cédées. Seul l'éditeur y a accès, ainsi que ses prestataires techniques, qui agissent sur ses instructions :",
      ],
      puces: [
        "Vercel : hébergement du site (traitements exécutés à Paris) ;",
        "Supabase : base de données et authentification (données stockées à Paris) ;",
        "Resend : envoi des emails (région Europe) ;",
        "Cloudflare : protection anti-robots du formulaire d'inscription, qui analyse des informations techniques de votre navigateur sans déposer de cookie.",
      ],
    },
    {
      h2: "Transferts hors de l'Union européenne",
      paragraphes: [
        "Plusieurs de ces prestataires, ainsi que Google et Meta, sont des sociétés américaines ou appartiennent à des groupes américains. Un éventuel transfert de données vers les États-Unis est encadré par le cadre de protection des données UE–États-Unis ou par les clauses contractuelles types de la Commission européenne.",
      ],
    },
    {
      h2: "Sécurité",
      paragraphes: [
        "Les échanges avec le site sont chiffrés. Les mots de passe ne sont jamais stockés en clair. Les tentatives de connexion répétées sont bloquées. L'accès à l'administration du site est protégé par une double authentification. En cas de violation de données présentant un risque pour vous, nous en informerions la CNIL et, si nécessaire, les personnes concernées.",
      ],
    },
    {
      h2: "Journaux techniques",
      paragraphes: [
        "Comme tout site, nos prestataires enregistrent des journaux techniques, dont l'adresse IP, pour assurer la sécurité et le bon fonctionnement du service. Ils sont conservés pendant une courte durée fixée par ces prestataires. Pour limiter les tentatives de connexion répétées, nous conservons aussi, pendant 24 heures, une empreinte chiffrée de l'adresse IP et de l'identifiant utilisés.",
      ],
    },
    {
      h2: "Vos droits",
      paragraphes: [
        `Vous pouvez demander l'accès à vos données, leur rectification, leur effacement, la limitation de leur traitement, leur portabilité, ou vous opposer à leur traitement, en écrivant à ${EMAIL_CONTACT}. Vous pouvez retirer à tout moment un consentement donné, sans que cela remette en cause ce qui a été fait auparavant. Nous répondons dans un délai d'un mois.`,
        "Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL (cnil.fr).",
      ],
    },
  ],
};
