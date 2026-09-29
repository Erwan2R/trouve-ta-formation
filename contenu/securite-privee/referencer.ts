// Landing organismes « Référencer mon organisme » (Copy_Landing_Organismes.md, maquette « Landing Organismes v3 »).
// Textes validés : ne pas réécrire. Points ouverts de la copy (§15) signalés à Erwan.

export const REFERENCER = {
  title: "Référencer mon organisme de formation en sécurité privée — gratuit",
  description:
    "Référencez gratuitement votre centre de formation à la sécurité privée sur l'annuaire Trouve ta formation. Création de fiche en cinq minutes, sans engagement.",
  ogTitle: "Référencer mon organisme de formation en sécurité privée",
  contact: "contact@trouve-ta-formation.fr",

  enTete: {
    surtitre: "Espace organismes",
    ancres: [
      { href: "#fiche", libelle: "La fiche" },
      { href: "#etapes", libelle: "Étapes" },
      { href: "#gratuit", libelle: "Gratuité" },
      { href: "#questions", libelle: "Questions" },
    ],
    compte: "J'ai déjà un compte",
    creer: "Créer ma fiche",
  },

  hero: {
    bandeau: ["Gratuit", "Sans engagement", "Cinq minutes"],
    h1: "Référencez votre organisme de formation en sécurité privée",
    promesse:
      "Les candidats à une formation en sécurité privée cherchent un centre près de chez eux, titre par titre. Créez la fiche de votre organisme pour apparaître dans leurs résultats — sans commission, sans mise en relation payante.",
    cta: "Créer ma fiche gratuitement",
    mention: "Aucune carte bancaire. Aucun engagement.",
    recherche: "formation ssiap 1 bobigny",
    resultats: ["Résultats · Seine-Saint-Denis", "SSIAP 1"],
    votreFiche: "Votre fiche",
  },

  candidat: {
    surtitre: "Côté candidat",
    h2: "Comment un candidat choisit son centre de formation",
    paragraphes: [
      "Un candidat qui veut passer son TFP APS ou son SSIAP 1 commence rarement par appeler un centre. Il tape sa recherche en ligne, avec le nom du titre et sa ville, puis compare trois ou quatre organismes sur ce qu'il trouve : les titres préparés, le lieu exact, le prix, les financements acceptés, l'agrément CNAPS.",
      "Il choisit ensuite parmi ceux dont il a pu vérifier ces informations. Un centre qui n'apparaît pas dans cette comparaison n'est pas écarté : il n'a jamais été considéré.",
    ],
    requetes: [
      "formation ssiap 1 bobigny",
      "tfp aps financement cpf 93",
      "centre formation agent de sécurité près de chez moi",
    ],
    criteres: ["Titres préparés", "Lieu exact", "Prix", "Financements acceptés", "Agrément CNAPS"],
    conclusion: "Cette recherche a lieu que vous y soyez présent ou non.",
  },

  fiche: {
    surtitre: "Votre fiche",
    h2: "Voici ce à quoi ressemble une fiche complète",
    chapo: "Vous la remplissez, vous la modifiez quand vous voulez, et personne d'autre n'y touche.",
    annotations: [
      { titre: "En-tête et badges", texte: "Agrément CNAPS et Qualiopi mis en avant" },
      { titre: "Bloc formations", texte: "Chaque titre préparé, avec prix, durée et rythme" },
      { titre: "Lieux de formation", texte: "Toutes vos implantations, pas seulement le siège" },
      { titre: "Financements", texte: "CPF, France Travail, OPCO : les filtres que les candidats utilisent le plus" },
      { titre: "Coordonnées", texte: "Téléphone et email visibles, contact direct sans intermédiaire" },
      { titre: "Présentation", texte: "Votre texte, votre positionnement" },
    ],
    mention: "Aucun champ n'est obligatoire pour publier, hors nom, adresse et un moyen de contact.",
  },

  benefices: {
    surtitre: "Six raisons",
    h2: "Ce que le référencement vous apporte",
    liste: [
      {
        titre: "Une fiche trouvable",
        texte: "Votre organisme apparaît dans le catalogue et sur les pages des titres que vous préparez.",
      },
      {
        titre: "Les candidats vous contactent directement",
        texte: "Téléphone et email affichés sur votre fiche. Nous ne nous interposons pas.",
      },
      {
        titre: "Vous apparaissez dans les filtres",
        texte: "Titre, département, financements, accessibilité : les candidats filtrent, votre fiche remonte.",
      },
      { titre: "Toutes vos implantations", texte: "Une seule fiche, autant de lieux de formation que vous en avez." },
      {
        titre: "Modifiable à tout moment",
        texte: "Un tarif change, une session s'ouvre : vous mettez à jour vous-même, sans nous écrire.",
      },
      {
        titre: "Une page pour chaque titre que vous préparez",
        texte: "Vous êtes référencé sur les pages consacrées au TFP APS, au SSIAP, aux spécialités que vous dispensez.",
      },
    ],
  },

  lancement: {
    surtitre: "Lancement · Île-de-France",
    h2: "Où en est l'annuaire aujourd'hui",
    paragraphes: [
      "Trouve ta formation vient d'ouvrir sur la sécurité privée en Île-de-France. Nous n'allons pas vous annoncer une audience que nous n'avons pas encore.",
      "Voilà ce qui est vrai aujourd'hui : le référencement est gratuit, la fiche est publiée immédiatement, et les organismes inscrits maintenant seront en place quand les premières recherches arriveront. Le référencement naturel se construit sur plusieurs mois — les fiches en ligne tôt sont celles qui en profitent en premier.",
    ],
    chute:
      "Nous préférons vous dire cela plutôt que de vous montrer des chiffres que vous auriez raison de trouver douteux.",
    // Au-dessus du seuil d'affichage des compteurs (même paramètre que l'accueil et le catalogue).
    preuve: (n: number) => `${n} organismes de formation à la sécurité privée sont référencés en Île-de-France`,
    preuveTexte: "Votre fiche est gratuite et vous la gérez vous-même.",
  },

  etapes: {
    surtitre: "Inscription",
    h2: "Trois étapes, cinq minutes",
    commencer: "Commencer maintenant",
    liste: [
      {
        titre: "Créez votre compte",
        texte:
          "Une adresse email, un mot de passe, le nom de votre organisme. Vous accédez immédiatement à votre espace.",
      },
      {
        titre: "Complétez votre fiche",
        texte:
          "Coordonnées, agrément, lieux de formation. Le SIRET pré-remplit une partie des champs. Chaque étape est sauvegardée : vous pouvez vous arrêter et reprendre plus tard.",
      },
      {
        titre: "Publiez",
        texte: "Votre fiche est en ligne dès que l'email est validé. Vous la modifiez ensuite quand vous le souhaitez.",
      },
    ],
    enLigne: "En ligne",
    mention:
      "Vous pouvez publier votre fiche sans avoir encore déclaré vos formations, et les ajouter plus tard depuis votre espace.",
  },

  gratuit: {
    surtitre: "Modèle",
    h2: "Pourquoi c'est gratuit",
    paragraphes: [
      "Un annuaire n'a de valeur pour un candidat que s'il est complet. Notre priorité est donc de référencer les organismes, pas de leur facturer leur présence.",
      // Point ouvert §15 : version qui nomme une fonctionnalité future (défaut de la maquette).
      "Le référencement restera gratuit. Nous proposerons plus tard des fonctionnalités optionnelles aux organismes qui les souhaitent — la gestion des inscriptions, par exemple. Elles seront payantes, et elles ne changeront rien à la position des fiches dans le catalogue.",
    ],
    grille: {
      entete: ["Organismes de formation", "Tarif"],
      lignes: [
        { titre: "Référencement de la fiche", detail: "Publication, modification, suppression", tarif: "0 €" },
        {
          titre: "Fonctionnalités optionnelles",
          detail: "La gestion des inscriptions, par exemple",
          tarif: "Plus tard",
        },
        {
          titre: "Meilleur classement",
          detail: "Position des fiches dans le catalogue",
          tarif: "Non vendu",
          barre: true,
        },
      ],
    },
    engagement: "Aucun organisme ne peut acheter un meilleur classement.",
    engagementTexte: "C'est une règle de conception, pas une politique commerciale susceptible d'évoluer.",
  },

  faq: {
    surtitre: "FAQ",
    h2: "Les questions qu'on nous pose",
    questions: [
      {
        question: "Est-ce que je vais être démarché commercialement ?",
        reponse:
          "Non. Nous vous écrivons pour vous proposer le référencement, puis pour vous informer d'évolutions de votre espace. Vous pouvez vous désinscrire de ces envois à tout moment, sans que cela affecte votre fiche.",
      },
      {
        question: "Est-ce que vous revendez mes coordonnées ?",
        reponse:
          "Non, à personne. Les coordonnées affichées sur votre fiche sont publiques parce que vous les publiez ; elles ne sont ni cédées, ni louées, ni exploitées par un tiers.",
      },
      {
        question: "Est-ce que je vais recevoir des contacts non qualifiés ?",
        reponse:
          "Les candidats vous joignent directement, sans que nous filtrions ni ne facturions la mise en relation. Nous ne pouvons donc pas garantir la qualification des demandes — mais vous choisissez quelles coordonnées afficher, et vous pouvez les modifier ou les retirer à tout moment.",
      },
      {
        question: "Puis-je supprimer ma fiche ?",
        reponse:
          "Oui, depuis votre espace, sans avoir à nous écrire ni à justifier votre décision. La fiche disparaît du site.",
      },
      {
        // Toujours déplié (Copy §10). Réponse à faire valider juridiquement avant le premier envoi de prospection.
        question: "D'où vient mon adresse email ?",
        reponse:
          "De sources professionnelles publiques : votre site internet, les registres publics d'organismes de formation, les annuaires professionnels du secteur. Nous ne collectons que des adresses professionnelles, et nous vous contactons à propos de votre activité d'organisme de formation.",
        suite:
          "Vous pouvez demander la suppression de vos données de notre base à tout moment, en écrivant à contact@trouve-ta-formation.fr. La demande est traitée sans condition et sans relance.",
        ouverte: true,
      },
      {
        question: "Comment gagnez-vous de l'argent ?",
        reponse:
          "Pas encore. Le référencement restera gratuit ; des fonctionnalités optionnelles seront proposées plus tard aux organismes qui les souhaitent. Elles n'influenceront pas le classement des fiches.",
      },
    ],
  },

  final: {
    h2: "Créez votre fiche",
    texte: "Gratuit, sans engagement, cinq minutes. Vous pouvez la modifier ou la supprimer à tout moment.",
    secours: "Une question avant de vous inscrire ? Écrivez-nous à",
  },

  pied: ["Mentions légales", "Politique de confidentialité", "Contact"],
};
