// Imports relatifs : ce contenu est aussi lu par next.config.ts (blocage du build de production).
import { EMAIL_CONTACT } from "../../lib/config/contact";
import { EDITEUR } from "./editeur";
import type { PageLegale } from "./types";

// Rédaction Claude (audit RGPD du 01/10/2026, accord d'Erwan), relecture juridique conseillée. Informations de la
// société en cours de création : contenu/legal/editeur.ts.
export const MENTIONS_LEGALES: PageLegale = {
  title: "Mentions légales",
  description: "Mentions légales du site Trouve ta formation : éditeur, directeur de la publication, hébergement.",
  h1: "Mentions légales",
  maj: `Dernière mise à jour : ${EDITEUR.dateMaj}`,
  sections: [
    {
      h2: "Éditeur du site",
      paragraphes: [
        `Le site trouve-ta-formation.fr est édité par ${EDITEUR.denomination}, ${EDITEUR.forme} au capital de ${EDITEUR.capital} euros, immatriculée au registre du commerce et des sociétés de ${EDITEUR.rcs} sous le numéro ${EDITEUR.siren}, dont le siège est situé ${EDITEUR.siege}.`,
        `Numéro de TVA intracommunautaire : ${EDITEUR.tva}.`,
        `Contact : ${EMAIL_CONTACT}.`,
      ],
    },
    {
      h2: "Directeur de la publication",
      paragraphes: [`${EDITEUR.directeur}.`],
    },
    {
      h2: "Hébergement",
      paragraphes: [
        "Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis (vercel.com). Les traitements du serveur s'exécutent dans un centre de données situé à Paris.",
        "Les données sont stockées par le prestataire Supabase, dans un centre de données situé à Paris (France).",
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
      h2: "Classement des fiches",
      paragraphes: [
        "Les fiches sont classées selon leur pertinence par rapport à la recherche et leur niveau de complétude. Aucun organisme ne peut payer pour améliorer son classement. Si un emplacement est un jour mis en avant contre rémunération, il sera toujours signalé comme tel. Le détail figure dans les conditions d'utilisation.",
      ],
    },
    {
      h2: "Informations réglementaires",
      paragraphes: [
        "Les informations sur les titres, les formations et les démarches sont fournies à titre indicatif ; seuls les textes en vigueur et le CNAPS font foi.",
      ],
    },
    {
      h2: "Propriété intellectuelle",
      paragraphes: [
        "Les textes, la présentation et le logo du site sont la propriété de l'éditeur ; leur reproduction sans autorisation est interdite. Les contenus des fiches (textes, logos) restent la propriété des organismes qui les publient.",
      ],
    },
    {
      h2: "Données personnelles et cookies",
      paragraphes: [
        "Le traitement de vos données personnelles est décrit dans la politique de confidentialité, et l'usage des cookies dans la page Cookies, où vous pouvez modifier vos choix à tout moment.",
      ],
    },
  ],
};
