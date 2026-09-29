// Imports relatifs : ce contenu est aussi lu par next.config.ts (blocage du build de production).
import { EMAIL_CONTACT } from "../../lib/config/contact";
import { A_COMPLETER } from "../marqueurs";
import type { PageLegale } from "./types";

// Textes définitifs en cours de rédaction (Erwan, 30/09/2026) : structure et champs à compléter.
export const MENTIONS_LEGALES: PageLegale = {
  title: "Mentions légales",
  description: "Mentions légales du site Trouve ta formation : éditeur, directeur de la publication, hébergement.",
  h1: "Mentions légales",
  maj: `Dernière mise à jour : ${A_COMPLETER}`,
  sections: [
    {
      h2: "Éditeur du site",
      paragraphes: [
        `Le site trouve-ta-formation.fr est édité par ${A_COMPLETER} (nom ou raison sociale, forme juridique, capital social).`,
        `Siège : ${A_COMPLETER}. SIREN : ${A_COMPLETER}. Numéro de TVA intracommunautaire : ${A_COMPLETER}.`,
        `Contact : ${EMAIL_CONTACT}.`,
      ],
    },
    {
      h2: "Directeur de la publication",
      paragraphes: [`${A_COMPLETER} (nom et qualité).`],
    },
    {
      h2: "Hébergement",
      paragraphes: [`Le site est hébergé par ${A_COMPLETER} (dénomination, adresse et téléphone de l'hébergeur).`],
    },
    {
      h2: "Contenu des fiches organismes",
      paragraphes: [
        "Les fiches des organismes de formation sont créées et mises à jour par les organismes eux-mêmes, sans vérification préalable par l'éditeur. Quand un organisme indique son numéro d'agrément CNAPS, il apparaît sur sa fiche : vérifiez-le sur l'espace de consultation du CNAPS avant de vous inscrire.",
        `${A_COMPLETER} (responsabilité de l'éditeur et signalement d'un contenu).`,
      ],
    },
    {
      h2: "Propriété intellectuelle",
      paragraphes: [`${A_COMPLETER}`],
    },
  ],
};
