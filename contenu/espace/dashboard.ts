// Tableau de bord organisme (maquette « Dashboard Organisme v2 », UX_Dashboard_Organisme.md).
import type { Action } from "@/lib/organismes/relance";
import type { Palier } from "@/lib/organismes/completude";

/** Destination de chaque action : la page et, si possible, le champ concerné (UX §4). */
export const ACTIONS: Record<Action, { titre: string; pourquoi: string; dest: string; href: string; cta: string }> = {
  formations: {
    titre: "Ajoutez vos formations",
    pourquoi: "C'est ce qui vous rend visible dans les résultats de recherche des candidats.",
    dest: "Mes formations",
    href: "/formations/",
    cta: "Ajouter",
  },
  financements: {
    titre: "Renseignez les financements que vous acceptez",
    pourquoi: "CPF, France Travail, OPCO : les candidats filtrent souvent sur ce critère.",
    // Les financements se déclarent par formation (maquette Mes formations), pas dans Ma fiche.
    dest: "Mes formations",
    href: "/formations/",
    cta: "Renseigner",
  },
  presentation: {
    titre: "Rédigez une courte présentation de votre organisme",
    pourquoi: "Quelques lignes sur votre centre, vos publics et votre façon de former.",
    dest: "Ma fiche",
    href: "/ma-fiche/#presentation",
    cta: "Rédiger",
  },
  cnaps: {
    titre: "Indiquez votre numéro d'agrément CNAPS",
    pourquoi: "C'est lui qui distingue un centre autorisé à former.",
    dest: "Ma fiche",
    href: "/ma-fiche/#agrement",
    cta: "Indiquer",
  },
  qualiopi: {
    titre: "Ajoutez votre certification Qualiopi",
    pourquoi: "Elle conditionne l'accès de vos stagiaires aux financements publics.",
    dest: "Ma fiche",
    href: "/ma-fiche/#agrement",
    cta: "Ajouter",
  },
  siret: {
    titre: "Renseignez votre numéro SIRET",
    pourquoi: "Il confirme l'existence légale de votre organisme.",
    dest: "Ma fiche",
    href: "/ma-fiche/#identite",
    cta: "Renseigner",
  },
  logo: {
    titre: "Ajoutez votre logo",
    pourquoi: "Il remplace vos initiales sur votre fiche et dans le catalogue.",
    dest: "Ma fiche",
    href: "/ma-fiche/#logo",
    cta: "Ajouter",
  },
  accessibilite: {
    titre: "Précisez l'accessibilité de vos locaux",
    pourquoi: "Pour certains candidats, c'est un critère éliminatoire.",
    dest: "Ma fiche",
    href: "/ma-fiche/#pratique",
    cta: "Préciser",
  },
  horaires: {
    titre: "Indiquez vos horaires d'accueil",
    pourquoi: "Les candidats savent quand vous joindre.",
    dest: "Ma fiche",
    href: "/ma-fiche/#coordonnees",
    cta: "Indiquer",
  },
  siteweb: {
    titre: "Ajoutez l'adresse de votre site",
    pourquoi: "Les candidats peuvent en savoir plus avant de vous contacter.",
    dest: "Ma fiche",
    href: "/ma-fiche/#coordonnees",
    cta: "Ajouter",
  },
};

export const NOMS_PALIERS: Record<Palier, string> = { basique: "Basique", correct: "Correct", optimal: "Optimal" };

export const INDEXATION: Record<Palier, { etiquette: string; statut: string; phrase: string }> = {
  basique: {
    etiquette: "Non indexée",
    statut: "Non indexée",
    phrase: "Votre fiche n'apparaît pas encore dans les résultats de recherche.",
  },
  correct: {
    etiquette: "Indexée",
    statut: "Indexable",
    phrase: "Votre fiche apparaît dans les résultats de recherche.",
  },
  optimal: {
    etiquette: "Mise en avant",
    statut: "Mise en avant",
    phrase: "Votre fiche apparaît dans les résultats de recherche et elle est mise en avant dans le catalogue.",
  },
};

export const DASHBOARD = {
  basiqueAcces:
    "Elle reste consultable par son adresse directe. Ce sont les moteurs de recherche qui ne l'affichent pas encore.",
  recul: "Votre fiche est repassée du palier Correct au palier Basique : plus aucune formation n'y est déclarée.",
  legende: {
    basiqueSansFormation: "Sans formation déclarée, votre carte n'apparaît dans aucun filtre par titre.",
    basique:
      "Votre carte est dans le catalogue, mais votre fiche n'est pas encore référencée par les moteurs de recherche.",
    correct: "Votre carte apparaît dans le catalogue et votre fiche est référencée par les moteurs de recherche.",
    optimal: "Votre carte remonte en tête du tri du catalogue.",
  },
  checklistTitre: { basique: "Pour passer au palier Correct :", correct: "Pour passer au palier Optimal :" },
  noteBasique: "Une seule de ces deux informations suffit pour atteindre le palier Correct.",
  noteCorrect: (n: number) => `Encore ${n} élément${n > 1 ? "s" : ""} à renseigner pour atteindre le palier Optimal.`,
  etiquettes: ["Priorité", "Ensuite", "Puis"],
  optimalTitre: "Votre fiche est complète.",
  optimalTexte: "Elle apparaît dans les résultats de recherche et elle est mise en avant dans le catalogue.",
  // Non publiée : textes de la maquette (email) ; minimum publiable et suspension : à valider par Erwan.
  nonPubliee: {
    surtitre: "Étape restante",
    titre: "Votre fiche n'est pas encore en ligne",
    email: (email: string) => `Validez votre adresse email pour la publier. Nous avons envoyé un lien à ${email}.`,
    renvoyer: "Renvoyer l'email de validation",
    renvoye: "Email renvoyé",
    minimum:
      "Pour la publier, complétez le minimum : l'adresse du siège et un moyen de contact (téléphone ou email de contact).",
    minimumCta: "Compléter ma fiche",
    emailEtMinimum: (email: string) =>
      `Deux étapes restent : valider votre adresse email (un lien a été envoyé à ${email}) et compléter l'adresse du siège et un moyen de contact.`,
  },
  suspendue: {
    titre: "Votre fiche est suspendue",
    texte: "Elle n'apparaît plus sur le site. Pour en savoir plus, écrivez-nous depuis la page contact.",
  },
};
