import type { QuestionFaq } from "@/components/public/Faq";

// Copy_Page_Catalogue_Organismes.md — textes validés. Frontière : cette page traite « comment choisir un organisme »,
// jamais « quelle formation choisir » (accueil) ni le détail d'une procédure CNAPS (pages démarches).

export const CATALOGUE = {
  title: "Organismes de formation sécurité privée en Île-de-France",
  description:
    "Tous les organismes de formation à la sécurité privée référencés en Île-de-France. Filtrez par titre préparé, département, financement accepté et rythme. Agrément CNAPS et certification Qualiopi indiqués sur chaque fiche.",
  /** Sous le seuil : pas de promesse de filtrage que l'inventaire ne tient pas (Copy §1). */
  descriptionLancement:
    "Les organismes de formation à la sécurité privée en Île-de-France, filtrables par titre, département et financement. Agrément CNAPS indiqué.",
  h1: "Organismes de formation à la sécurité privée en Île-de-France",
  contexte: "Comparez les centres agréés par titre préparé, par département et par financement accepté.",
  contexteLancement:
    "Les organismes référencés en Île-de-France, avec les titres qu'ils préparent et les financements qu'ils acceptent.",
  chapo:
    "Tous les organismes référencés ici dispensent des formations menant aux titres de la sécurité privée : TFP APS, SSIAP, titres de spécialité. Deux mentions figurent sur les fiches et il ne faut pas les confondre. **L'autorisation d'exercice délivrée par le CNAPS** conditionne la validité de votre formation : un titre obtenu dans un centre non autorisé ne vous ouvrira pas droit à la carte professionnelle. **La certification Qualiopi** ne dit rien de la légalité du centre, mais elle conditionne l'accès aux financements publics et mutualisés, dont le CPF.",
  chapoMention:
    "Le référencement dans cet annuaire est gratuit et ne constitue ni une recommandation, ni un label. Les informations proviennent des organismes eux-mêmes, qui gèrent leur fiche. Vérifiez l'autorisation d'un centre avant de vous engager.",
};

/**
 * Catalogue entièrement vide (aucun organisme inscrit) — état de lancement absent des specs.
 * PROPOSITION à valider par Erwan : sobre, sans promesse de volume ni de rythme d'inscription.
 */
export const CATALOGUE_VIDE = {
  titre: "Aucun organisme n'est encore référencé",
  texte:
    "Les organismes de formation créent eux-mêmes leur fiche dans cet annuaire. En attendant les premières inscriptions, les pages consacrées à chaque titre de formation détaillent le programme, les conditions d'accès et les démarches à accomplir.",
  lien: "Voir les formations →",
};

export const GUIDE = {
  h2: "Comment choisir son organisme de formation",
  intro: "Le choix d'un centre se joue sur quatre points, et un seul d'entre eux est éliminatoire.",
  sections: [
    {
      id: "g-cnaps",
      h3: "Vérifier que le centre est autorisé par le CNAPS",
      paragraphes: [
        "C'est le point éliminatoire, et c'est celui que les candidats vérifient le moins.",
        "Un organisme qui dispense des formations à la sécurité privée doit détenir une autorisation d'exercice délivrée par le CNAPS. Ce n'est pas une distinction commerciale : c'est une condition de validité. **Un titre obtenu dans un centre non autorisé ne vous ouvrira pas droit à la carte professionnelle.** Vous aurez payé, suivi la formation, passé les épreuves, et vous ne pourrez pas exercer.",
        "Le CNAPS met à disposition un espace public de consultation des titres, qui permet de vérifier l'autorisation d'un organisme comme la validité d'une carte professionnelle. La vérification prend une minute et elle est à faire avant tout versement.",
        "Les fiches de cet annuaire indiquent le numéro d'autorisation quand l'organisme l'a renseigné. Son absence sur une fiche ne signifie pas que le centre n'est pas autorisé — seulement qu'il n'a pas rempli le champ. Dans ce cas, demandez-le au centre, et vérifiez-le vous-même.",
      ],
    },
    {
      id: "g-qualiopi",
      h3: "Ce que garantit la certification Qualiopi, et ce qu'elle ne garantit pas",
      paragraphes: [
        "Qualiopi est une certification portant sur le processus de l'organisme : la façon dont il conçoit ses formations, informe ses candidats, suit ses stagiaires, recueille leurs retours.",
        "Ce qu'elle vous apporte concrètement : **elle conditionne l'accès aux financements publics et mutualisés.** Sans elle, ni CPF, ni France Travail, ni OPCO. Pour la majorité des candidats, c'est donc un critère décisif, non par qualité mais par financement.",
        "Ce qu'elle ne garantit pas : la qualité pédagogique d'une session, le taux de réussite aux épreuves, la compétence d'un formateur en particulier. Et elle ne remplace en aucun cas l'autorisation du CNAPS — les deux sont indépendantes, et seule la seconde conditionne votre carte professionnelle.",
      ],
    },
    {
      id: "g-titre",
      h3: "Vérifier que le centre prépare bien le titre que vous visez",
      paragraphes: [
        "Un organisme peut être autorisé, certifié, et ne pas préparer le titre dont vous avez besoin. C'est fréquent sur les spécialités et sur les MAC, où l'offre est plus rare que sur les titres d'entrée.",
        "Vérifiez également **où** la formation se déroule. Un organisme dont le siège est à Paris peut dispenser ses sessions en grande couronne. Sur des formations de plusieurs semaines en présentiel, le trajet quotidien est un critère de faisabilité, pas de confort.",
      ],
    },
    {
      id: "g-questions",
      h3: "Les questions à poser avant de s'inscrire",
      paragraphes: [
        "Quatre questions font le tri, et un centre sérieux y répond sans détour.",
        "**Quel est le prix total, tout compris ?** Les frais d'inscription, de dossier ou de passage d'épreuves sont parfois annoncés séparément du prix de la formation.",
        "**Quel est le rythme exact et sur quelle période ?** Temps plein, cours du soir, week-end : c'est ce qui détermine si vous pouvez suivre la formation en conservant un emploi.",
        "**Que se passe-t-il en cas d'échec aux épreuves ?** Rattrapage inclus ou facturé, délai avant nouvelle présentation.",
        "**Quel financement acceptez-vous, et qui monte le dossier ?** Un centre habitué au CPF ou à France Travail vous fera gagner des semaines sur le montage.",
      ],
    },
    {
      id: "g-pieges",
      h3: "Les pièges à éviter",
      paragraphes: [
        "**Un centre qui vous propose de vous inscrire sans autorisation préalable du CNAPS.** L'autorisation préalable est requise avant l'entrée en formation. Un organisme qui propose de s'en passer vous expose à une formation sans débouché.",
        "**Un prix nettement inférieur au marché sur un titre à durée réglementée.** Les durées de formation sont fixées par la réglementation, pas par les centres. Un tarif très bas signale souvent un volume horaire réduit, ce qui compromet la validité du titre.",
        "**Une promesse d'embauche présentée comme automatique.** Un centre peut avoir des relations avec des employeurs ; il ne peut pas garantir un poste.",
      ],
    },
  ],
};

export const FAQ_CATALOGUE: QuestionFaq[] = [
  {
    question: "Comment vérifier qu'un organisme est autorisé par le CNAPS ?",
    reponse:
      "Le CNAPS met à disposition un espace public de consultation des titres, qui permet de vérifier l'autorisation d'un organisme. Demandez son numéro d'autorisation au centre et vérifiez-le avant tout versement.",
  },
  {
    question: "Un organisme non certifié Qualiopi peut-il me former légalement ?",
    reponse:
      "Oui, si le CNAPS l'a autorisé. Qualiopi ne conditionne pas la légalité de la formation, mais l'accès aux financements publics et mutualisés, dont le CPF.",
  },
  {
    question: "Comment un organisme est-il référencé dans cet annuaire ?",
    reponse: "Les organismes créent et gèrent eux-mêmes leur fiche. Le référencement est gratuit et volontaire.",
  },
  {
    question: "Faut-il payer pour figurer dans le catalogue ?",
    reponse:
      "Non. Le référencement est gratuit et aucun organisme ne peut acheter une meilleure position dans les résultats.",
  },
  {
    question: "Pourquoi certaines fiches n'indiquent-elles aucune formation ?",
    reponse:
      "Parce que l'organisme n'a pas encore renseigné son offre. Ces fiches apparaissent dans le catalogue complet, mais pas dans les résultats filtrés par titre.",
  },
  {
    question: "Les informations des fiches sont-elles vérifiées ?",
    // Formulation validée par Erwan le 29/09/2026 (publication sur déclaration).
    reponse:
      "Elles proviennent des organismes eux-mêmes, qui créent et mettent à jour leur fiche. Les tarifs, rythmes et disponibilités relèvent de leur responsabilité et évoluent : confirmez-les auprès du centre, et vérifiez son numéro d'agrément sur l'espace de consultation du CNAPS.",
  },
];
