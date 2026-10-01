// Imports relatifs : ce contenu est aussi lu par next.config.ts (blocage du build de production).
import { EMAIL_CONTACT } from "../../lib/config/contact";
import type { PageLegale } from "./types";

// Éditeur provisoire : l'entreprise individuelle d'Erwan, en attendant la création de sa société (01/10/2026).
// Adresse réduite à la ville et aucun téléphone, à sa demande. Rédaction Claude : relecture juridique conseillée.
export const MENTIONS_LEGALES: PageLegale = {
  title: "Mentions légales",
  description: "Mentions légales du site Trouve ta formation : éditeur, directeur de la publication, hébergement.",
  h1: "Mentions légales",
  maj: "Dernière mise à jour : 1er octobre 2026",
  sections: [
    {
      h2: "Éditeur du site",
      paragraphes: [
        "Le site trouve-ta-formation.fr est édité par Erwan de Rotalier EI, entrepreneur individuel, établi à Bois-Colombes (Hauts-de-Seine).",
        "SIREN : 882 911 399.",
        `Contact : ${EMAIL_CONTACT}.`,
      ],
    },
    {
      h2: "Directeur de la publication",
      paragraphes: ["Erwan de Rotalier."],
    },
    {
      h2: "Hébergement",
      paragraphes: [
        "Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis (vercel.com).",
      ],
    },
    {
      h2: "Contenu des fiches organismes",
      paragraphes: [
        "Les fiches des organismes de formation sont créées et mises à jour par les organismes eux-mêmes, sans vérification préalable par l'éditeur. Quand un organisme indique son numéro d'agrément CNAPS, il apparaît sur sa fiche : vérifiez-le sur l'espace de consultation du CNAPS avant de vous inscrire.",
        `Chaque organisme est responsable des informations qu'il publie. Si une fiche vous paraît inexacte, trompeuse ou illicite, signalez-la à ${EMAIL_CONTACT} : l'éditeur peut la suspendre le temps de la vérification.`,
      ],
    },
    {
      h2: "Propriété intellectuelle",
      paragraphes: [
        "Les textes, la présentation et le logo du site sont la propriété de l'éditeur ; leur reproduction sans autorisation est interdite. Les contenus des fiches (textes, logos) restent la propriété des organismes qui les publient.",
      ],
    },
  ],
};
