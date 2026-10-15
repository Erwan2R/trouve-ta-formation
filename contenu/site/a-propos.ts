import { EMAIL_CONTACT } from "@/lib/config/contact";
import { EDITEUR } from "@/contenu/legal/editeur";
import type { PageLegale } from "@/contenu/legal/types";

// Rédaction Claude (15/10/2026, carte blanche d'Erwan) : uniquement des faits vérifiables — ce que fait le site, ses
// conditions d'utilisation publiées, la société éditrice. Rien sur la personne d'Erwan (consigne).
export const A_PROPOS: PageLegale = {
  title: "À propos de Trouve ta formation — annuaire indépendant",
  description:
    "Trouve ta formation compare les organismes de formation professionnelle, titre par titre. Gratuit, sans commission ni classement payant.",
  h1: "À propos de Trouve ta formation",
  maj: "Dernière mise à jour : 15 octobre 2026",
  sections: [
    {
      h2: "Ce que fait l'annuaire",
      paragraphes: [
        "Trouve ta formation est un annuaire indépendant des organismes de formation professionnelle. Chaque organisme y présente ses formations dans un format identique : prix, durée, rythmes, financements acceptés, lieux et numéro d'autorisation d'exercice. Vous pouvez ainsi les comparer titre par titre et département par département.",
        "Pour chaque titre, une page présente le programme, les prérequis, la durée et le coût. D'autres pages détaillent les démarches à faire auprès du CNAPS avant et après la formation.",
      ],
    },
    {
      h2: "Un annuaire indépendant",
      paragraphes: ["Trois règles encadrent l'annuaire :"],
      puces: [
        "**Gratuit pour tous.** La consultation est libre. Pour les organismes, la création du compte, la publication de la fiche et sa suppression sont gratuites.",
        "**Aucune commission.** L'annuaire ne perçoit rien sur les inscriptions en formation.",
        "**Aucun classement payant.** Aucun organisme ne peut payer pour être mieux placé. Si un emplacement est un jour mis en avant contre rémunération, il sera toujours signalé comme tel.",
      ],
    },
    {
      h2: "Une première verticale : la sécurité privée en Île-de-France",
      paragraphes: [
        "L'annuaire ouvre secteur par secteur. Le premier est la sécurité privée en Île-de-France : 13 titres, des formations initiales comme le TFP APS ou le SSIAP 1 jusqu'aux recyclages et aux stages de maintien et d'actualisation des compétences (MAC), ainsi que les trois démarches CNAPS : autorisation préalable, carte professionnelle et renouvellement.",
      ],
      liens: [{ texte: "Les formations à la sécurité privée en Île-de-France", href: "/securite-privee/" }],
    },
    {
      h2: "Qui édite le site",
      paragraphes: [
        `Trouve ta formation est édité par ${EDITEUR.denomination}, ${EDITEUR.forme} dont le siège est situé ${EDITEUR.siege}. Le fonctionnement de l'annuaire est détaillé dans notre méthode de référencement.`,
      ],
      liens: [
        { texte: "Notre méthode de référencement", href: "/methode-de-referencement/" },
        { texte: "Mentions légales", href: "/mentions-legales/" },
        { texte: "Conditions d'utilisation", href: "/conditions-utilisation/" },
      ],
    },
    {
      h2: "Nous contacter",
      paragraphes: [
        `Une question, une information inexacte à signaler, une suggestion : écrivez-nous à ${EMAIL_CONTACT}.`,
      ],
    },
  ],
};
