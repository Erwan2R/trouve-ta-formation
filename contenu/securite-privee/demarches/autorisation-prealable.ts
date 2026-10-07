import type { ContenuDemarche } from "./types";

// Copy_Pages_Demarches_CNAPS.md §5. Relevé CNAPS d'Erwan du 07/10/2026 (FAQ « Demande de titre », « Formation »,
// « Militaires… », « Dracar Ultimate », rubrique Jurisprudence), fiche « Demande - Autorisation préalable » et écrans Dracar Ultimate.
export const autorisationPrealable: ContenuDemarche = {
  etape: 1,
  title: "Autorisation préalable CNAPS : conditions, pièces et démarche 2026",
  description:
    "L'autorisation préalable du CNAPS est obligatoire avant d'entrer en formation à la sécurité privée. Conditions, casier judiciaire, pièces à fournir et dépôt sur Dracar Ultimate.",
  h1: "Autorisation préalable du CNAPS : la démarche avant d'entrer en formation",
  definition:
    "L'autorisation préalable est le feu vert du CNAPS pour commencer une formation à la sécurité privée. Sans elle, aucun organisme ne peut vous accueillir en formation, et un centre qui accepterait de le faire vous exposerait à ne jamais obtenir votre carte.",
  encadre: {
    aQui: "Toute personne entrant en formation sans carte professionnelle en cours de validité",
    quand: "Avant l'inscription en formation, jamais après",
    ou: "En ligne sur Dracar Ultimate, espace usager du CNAPS",
    pieces: "Pièce d'identité, justificatif de domicile de moins de 3 mois, justificatif de pré-inscription",
  },
  qui: {
    h2: "Qui doit demander une autorisation préalable",
    sommaire: "Qui doit la demander",
    paragraphes: [
      "Vous devez la demander si vous voulez entrer en formation à la sécurité privée et que vous ne détenez pas de carte professionnelle en cours de validité. C'est le cas de la très grande majorité des candidats : ceux qui préparent un TFP APS ou un titre de spécialité sans avoir jamais exercé. La sécurité incendie (SSIAP) n'est pas concernée : elle ne relève pas du CNAPS.",
      "Vous n'en avez pas besoin si vous détenez déjà une carte professionnelle valide. Un agent en poste qui suit une formation complémentaire entre en formation sans nouvelle autorisation, **sauf pour une formation à la surveillance armée ou à la sûreté aéroportuaire** : l'autorisation préalable reste alors obligatoire. Un agent dont la carte a expiré en a aussi besoin pour suivre son MAC.",
    ],
    encart: {
      surtitre: "Ne pas confondre",
      texte:
        "L'autorisation **provisoire** concerne une situation différente : être employé pour une activité de sécurité privée sans détenir encore la carte professionnelle. Les deux figurent sur le même formulaire historique et sont constamment mélangées.",
    },
  },
  conditions: {
    h2: "Les conditions que le CNAPS vérifie",
    intro:
      "L'autorisation préalable n'est pas une formalité d'inscription : c'est une enquête administrative. Le CNAPS vérifie que rien, dans votre situation personnelle, ne s'oppose à l'exercice d'un métier de la sécurité privée.",
    sections: [
      {
        h3: "L'enquête administrative et le casier judiciaire",
        paragraphes: [
          "Le CNAPS consulte le bulletin n° 2 de votre casier judiciaire, le fichier de traitement des antécédents judiciaires et le fichier des personnes recherchées.",
          "Vous ne pouvez pas consulter vous-même votre bulletin n° 2 : seul le bulletin n° 3, plus restreint, est délivré aux particuliers. Si la consultation des fichiers révèle une incompatibilité possible, le CNAPS peut, dans certains cas, vous inviter à présenter vos observations avant de décider. Mieux vaut l'apprendre à ce stade, avant de payer une formation, qu'au moment de la carte professionnelle.",
          "**Une condamnation n'est pas automatiquement rédhibitoire.** Le CNAPS apprécie la nature des faits, leur ancienneté et leur compatibilité avec l'exercice du métier. Une inscription au fichier des antécédents judiciaires n'est pas une condamnation et ne ferme pas nécessairement la porte, mais elle peut suffire à motiver un refus.",
        ],
      },
      {
        h3: "Nationalité et titre de séjour",
        paragraphes: [
          "Les ressortissants français et européens fournissent une pièce d'identité en cours de validité.",
          "À l'exception des citoyens de l'Union européenne, les ressortissants étrangers doivent séjourner en France de manière régulière et continue depuis au moins cinq ans, avec un titre de séjour autorisant une activité salariée. La justice administrative a confirmé qu'une interruption non justifiée fait échouer cette condition.",
          "Tous les ressortissants étrangers, européens compris, justifient d'un niveau de français B1 et fournissent l'équivalent du bulletin n° 3 du casier judiciaire de leur pays de naissance, daté de moins de trois mois et traduit en français par un traducteur assermenté. Les bénéficiaires d'une protection internationale (réfugiés, protection subsidiaire) en sont dispensés.",
        ],
      },
      {
        h3: "L'aptitude professionnelle n'est pas contrôlée ici",
        paragraphes: [
          "L'autorisation préalable ne vérifie pas vos compétences : elle intervient précisément avant que vous les acquériez. L'aptitude professionnelle s'obtient par la réussite d'un titre reconnu, et elle est contrôlée au moment de la demande de carte professionnelle.",
        ],
        lien: { href: "#formations", libelle: "Voir les formations qui donnent l'aptitude professionnelle →" },
      },
    ],
  },
  pieces: {
    intro: "Le formulaire de demande sur Dracar Ultimate fait foi : il indique les pièces propres à votre situation.",
    liste: [
      "Une pièce d'identité : pour un Français, la carte nationale d'identité ou le passeport (le permis de conduire n'est pas accepté) ; pour un ressortissant de l'UE ou de l'EEE, une pièce mentionnant la date et le lieu de naissance, à défaut un extrait d'acte de naissance ; pour les autres, un titre de séjour en cours de validité portant autorisation d'exercer une activité salariée",
      "Un justificatif de domicile de moins de trois mois : facture de téléphone fixe, d'internet, d'électricité, de gaz ou d'eau, quittance de loyer, titre de propriété, attestation d'assurance habitation ou relevé CAF. Une personne hébergée joint la pièce d'identité de son hébergeant et une lettre signée de lui",
      "Un justificatif de pré-inscription délivré par l'organisme de formation",
      "Pour les ressortissants étrangers, européens compris : un justificatif du niveau de français B1, et l'équivalent du bulletin n° 3 du casier judiciaire du pays de naissance, de moins de trois mois, traduit par un traducteur assermenté",
      "Pour une formation à la surveillance armée renforcée des sites sensibles ou à la sûreté aéroportuaire : une lettre d'intention d'embauche se rapportant à cette activité, émise par une entreprise autorisée par le CNAPS",
    ],
    source: {
      href: "https://www.cnaps.interieur.gouv.fr/Actualites/Nouvelles-obligations-pour-les-demandes-de-titres",
      libelle: "CNAPS, « Nouvelles obligations pour les demandes de titres »",
      verifieLe: "2026-10-02",
    },
    encart: {
      surtitre: "Le point qui déroute le plus de candidats",
      titre: "Le justificatif de pré-inscription se demande au centre de formation, avant la demande d'autorisation.",
      texte:
        "La démarche paraît circulaire, alors qu'elle ne l'est pas : vous demandez au centre un document attestant que vous êtes pré-inscrit ; l'inscription définitive n'intervient qu'une fois l'autorisation obtenue.",
    },
  },
  depot: {
    intro:
      "Depuis 2026, la demande se dépose exclusivement en ligne sur Dracar Ultimate, le portail du CNAPS. L'envoi postal et l'ancien téléservice ne sont plus opérants.",
    etapes: [
      {
        h3: "Créer votre espace personnel",
        texte:
          "Un usager, un compte. Votre adresse email sert d'identifiant. Le compte est personnel : ni votre centre de formation, ni un futur employeur ne peut déposer la demande à votre place.",
      },
      {
        h3: "Réunir vos pièces au format numérique",
        texte:
          "Les documents se téléversent, aux formats .jpeg, .jpg, .png, .tiff ou .pdf. Des scans lisibles évitent une demande de pièce complémentaire, qui rallonge l'instruction. Un brouillon de demande est conservé trois mois, puis supprimé automatiquement.",
      },
      {
        h3: "Remplir et déposer le formulaire",
        texte:
          "Dans « Déposer une demande », choisissez « Autorisation préalable », puis l'activité visée : une seule par demande, parmi 19 (surveillance humaine ou gardiennage, chien, sûreté aéroportuaire, protection physique des personnes…). Le formulaire compte ensuite quatre étapes : la première porte sur votre identité (sexe, nom de naissance, tous les prénoms de votre carte d'identité, nationalité, e-mail), la deuxième sur votre date et votre lieu de naissance. Préparez vos pièces au format numérique avant de commencer.",
      },
      {
        h3: "Suivre l'instruction depuis votre espace",
        texte:
          "Les échanges avec le service instructeur passent par la messagerie interne du portail. Les notifications arrivent par email, mais le détail n'est visible que dans votre espace. Répondre par email classique à une demande de complément ne fonctionne pas.",
      },
    ],
    alerte: {
      titre: "Consultez votre messagerie Dracar pendant l'instruction.",
      texte:
        "Une demande de pièce complémentaire arrive dans le portail, avec un délai de réponse limité. Sans réponse dans le temps imparti, le dossier peut être classé sans suite — et la démarche est à reprendre depuis le début.",
    },
  },
  delais: {
    intro:
      "Selon le CNAPS, une demande d'autorisation préalable est traitée en environ une semaine, pour un dossier complet et sans vérification complémentaire. L'enquête peut prendre plus de temps si vous êtes connu des services de police ou de gendarmerie. Sans réponse au bout de deux mois, la demande est considérée comme rejetée.",
    lignes: [
      ["Ce qui l'allonge", "Dossier incomplet, pièce illisible, demande de complément"],
      ["Suivre son dossier", "Depuis l'espace usager, rubrique de suivi et messagerie interne"],
      [
        "Sans réponse prolongée",
        "Messagerie de votre espace Dracar Ultimate ; à défaut, délégation territoriale de votre lieu de résidence. Le CNAPS n'indique pas de délai de relance.",
      ],
    ],
  },
  refus: {
    h2: "Si votre demande est refusée",
    sections: [
      {
        titre: "Les motifs de refus les plus fréquents",
        texte:
          "Les décisions publiées par le CNAPS et confirmées par la justice administrative portent surtout sur des violences, y compris conjugales, sur mineur ou sur une personne dépositaire de l'autorité publique, même lorsqu'elles n'ont donné lieu qu'à un rappel à la loi ; des infractions routières récentes et répétées (conduite sans permis, refus d'obtempérer) ; le faux et l'escroquerie ; les agressions sexuelles, y compris en l'absence de condamnation lorsque les faits ne sont pas sérieusement contestés ; et une interruption du titre de séjour.",
      },
      {
        titre: "Les voies de recours",
        texte:
          "Dans les deux mois suivant la décision, vous pouvez former un recours gracieux auprès du directeur du CNAPS, par email à cnaps-rg@interieur.gouv.fr ou par courrier. Sans réponse pendant deux mois, ce recours est rejeté ; vous disposez alors de deux nouveaux mois pour saisir le tribunal administratif. Vous pouvez aussi saisir directement le tribunal administratif de votre domicile, dans les deux mois suivant la décision.",
      },
      {
        titre: "Cas particuliers",
        liste: [
          "Militaires, policiers et gendarmes : le CNAPS leur consacre une rubrique de sa FAQ. Les réservistes de la garde nationale relèvent de conditions particulières (article R. 612-41-1 du code de la sécurité intérieure) : trois ans de service au moins, au moins 110 jours d'activité dont 20 en missions opérationnelles, et une formation fixée par arrêté",
          "Demande après un refus antérieur",
          "Changement de situation en cours d'instruction",
        ],
      },
    ],
  },
  ensuite: {
    h2: "Une fois l'autorisation obtenue",
    paragraphes: [
      "Votre autorisation est valable six mois, durée stricte : c'est le délai pour vous inscrire en formation. Si elle expire avant, vous devez demander une nouvelle autorisation. Elle ne permet pas, en revanche, d'être employé comme agent de sécurité.",
      "L'étape suivante est le choix du titre et de l'organisme. Le titre dépend du métier que vous visez : la surveillance de sites et de magasins passe par le TFP APS, les spécialités par des titres propres. Si vous acceptez le « circuit court » lors de votre demande, votre carte professionnelle sera générée automatiquement après la réussite à l'examen.",
    ],
    liens: [
      { href: "organismes/", libelle: "Trouver un organisme en Île-de-France" },
      { href: "#formations", libelle: "Comparer les titres de la sécurité privée" },
    ],
  },
  formations: {
    h2: "Les formations accessibles avec une autorisation préalable",
    titres: [
      { slug: "tfp-aps", texte: "Surveillance de sites et de magasins" },
      { slug: "tfp-asc", texte: "Agent de sécurité cynophile" },
      { slug: "tfp-asa", texte: "Agent de sûreté aéroportuaire" },
      { slug: "tfp-a3p", texte: "Protection physique des personnes" },
    ],
  },
  faqTitre: "Questions fréquentes sur l'autorisation préalable",
  faq: [
    {
      question: "Peut-on commencer une formation sans autorisation préalable ?",
      reponse:
        "Non. Un organisme qui vous accepterait sans autorisation vous ferait suivre une formation qui ne débouchera pas sur une carte professionnelle.",
    },
    {
      question: "Combien de temps l'autorisation préalable est-elle valable ?",
      reponse: "Six mois. Passé ce délai sans entrée en formation, la demande est à renouveler.",
    },
    {
      question: "Le centre de formation peut-il faire la demande à ma place ?",
      reponse:
        "Non. La demande est personnelle et se dépose depuis votre propre espace sur Dracar Ultimate. Le centre vous délivre en revanche le justificatif de pré-inscription nécessaire au dossier.",
    },
    {
      question: "Une inscription au fichier des antécédents judiciaires bloque-t-elle la demande ?",
      reponse:
        "Pas automatiquement. Ce n'est pas une condamnation, mais le CNAPS en tient compte dans son appréciation. La nature des faits et leur ancienneté comptent.",
    },
    {
      question: "Faut-il refaire une autorisation préalable pour une seconde formation ?",
      reponse:
        "Non si vous détenez alors une carte professionnelle en cours de validité, sauf pour une formation au port d'arme ou à la sûreté aéroportuaire, qui demande toujours une autorisation préalable.",
    },
    {
      question: "Que faire si je n'ai pas de réponse ?",
      reponse:
        "Passez par la messagerie de votre espace Dracar Ultimate, liée à votre demande en cours ; sans messagerie, adressez-vous à la délégation territoriale de votre lieu de résidence. Le CNAPS n'indique pas de délai de relance, mais un silence de plus de deux mois après l'enregistrement de la demande vaut rejet implicite, que vous pouvez contester.",
    },
  ],
};
