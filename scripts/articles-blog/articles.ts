// Articles rédigés hors du site (Drive « SEO / Articles de blog »), importés par scripts/importer-articles-blog.ts.
// Le corps de chaque article est dans <slug>.md (sous-ensemble Markdown de lib/blog/markdown.ts). Les images sont
// lues dans le dossier passé au script ; `images` associe une clé du Markdown à un nom de fichier réel, et
// `#nom-seo` après le fichier donne le nom publié (WebP). Ordre du tableau = ordre de publication.

export type ArticleSource = {
  slug: string;
  titre: string;
  titre_seo: string;
  meta_description: string;
  extrait: string;
  categorie: "le-metier" | "se-former" | "conditions-acces" | "actualites";
  verifie_le: string; // article réglementaire : date de vérification des sources
  couverture?: { fichier: string; nom: string; alt: string };
  images?: Record<string, string>;
  /** Recadrage vertical (px depuis le haut, hauteur conservée) : retire un texte parasite laissé par la génération. */
  rognages?: Record<string, { haut: number; hauteur?: number }>;
  essentiel: string[];
  a_retenir: string[];
  accroche: { question: string; phrase: string; lien: string; cible: string };
  lies: string[]; // slugs, « À lire aussi »
};

export const ARTICLES: ArticleSource[] = [
  {
    slug: "qcm-ssiap-2-3-questions-corrigees",
    titre: "QCM SSIAP 2 et SSIAP 3 : questions d’examen corrigées",
    titre_seo: "QCM SSIAP 2 et SSIAP 3 : questions corrigées et format",
    meta_description:
      "QCM SSIAP 2 et SSIAP 3 : 40 questions en 40 minutes à l’examen. Entraînez-vous avec 16 questions corrigées et des explications sourcées.",
    extrait:
      "Deux entraînements corrigés pour réviser les QCM SSIAP 2 et SSIAP 3, comprendre le format des épreuves et vérifier les notions clés.",
    categorie: "se-former",
    verifie_le: "2026-10-09",
    couverture: {
      fichier: "Gemini_Generated_Image_inm0ominm0ominm0.jpg",
      nom: "qcm-ssiap-2-ssiap-3-corriges",
      alt: "Deux classeurs d’entraînement aux QCM SSIAP 2 et SSIAP 3 avec des questions à choix multiples cochées",
    },
    rognages: { "Gemini_Generated_Image_inm0ominm0ominm0.jpg": { haut: 180 } }, // mention « (200 x 675 px) »
    essentiel: [
      "Les QCM officiels SSIAP 2 et SSIAP 3 comportent chacun 40 questions à traiter en 40 minutes.",
      "Le QCM SSIAP 2 doit atteindre 12/20 ; pour le SSIAP 3, le QCM et la notice technique sont deux épreuves écrites distinctes.",
      "Les questions ci-dessous sont des exercices originaux fondés sur les référentiels officiels, pas des questions extraites de la banque d’examen.",
      "Le ministère de l’Intérieur indique que les fichiers de QCM officiels sont chiffrés et réservés aux organismes de formation.",
    ],
    a_retenir: [
      "Chronométrez vos entraînements : le format officiel est de 40 questions en 40 minutes pour les deux niveaux.",
      "Pour le SSIAP 2, la note au QCM ne suffit pas : les épreuves orale et pratique restent à valider.",
      "Pour le SSIAP 3, révisez aussi la notice technique de sécurité et les autres thèmes du référentiel, car la certification ne repose pas sur le QCM seul.",
    ],
    accroche: {
      question: "Vous préparez une prochaine session SSIAP ?",
      phrase:
        "Avant de choisir un centre, vérifiez que la formation correspond bien au niveau que vous préparez et consultez sa page dédiée.",
      lien: "Voir la formation SSIAP 2",
      cible: "/securite-privee/ssiap-2/",
    },
    lies: ["qcm-ssiap-1-gratuit-correction", "ssiap-definition-niveaux", "agent-securite-incendie-missions-quotidien"],
  },
  {
    slug: "qcm-ssiap-1-gratuit-correction",
    titre: "QCM SSIAP 1 gratuit avec correction : s’entraîner à l’examen",
    titre_seo: "QCM SSIAP 1 gratuit : test corrigé et conseils de révision",
    meta_description:
      "Entraînez-vous au QCM SSIAP 1 avec un mini-test corrigé de 10 questions, le format officiel de l’épreuve et des conseils pour choisir un QCM fiable.",
    extrait:
      "Mini-test corrigé, format officiel de l’épreuve et repères pour distinguer un QCM d’entraînement des questions officielles.",
    categorie: "se-former",
    verifie_le: "2026-10-13",
    essentiel: [
      "L’épreuve écrite SSIAP 1 prend la forme d’un QCM de 30 questions en 30 minutes.",
      "Une note d’au moins 12/20 à l’écrit ne suffit pas seule : l’épreuve pratique doit aussi être validée.",
      "Le ministère distingue les questionnaires officiels utilisés à l’examen des ressources d’entraînement disponibles sur Internet.",
      "Tinad propose un test en ligne, mais précise que ses questions ne sont pas les questions officielles.",
    ],
    a_retenir: [
      "Entraînez-vous avec des séries chronométrées, mais gardez en tête que le format officiel est de 30 questions en 30 minutes.",
      "Après chaque test, classez les erreurs par thème et relisez les notions concernées avant une nouvelle série.",
      "Utilisez les QCM comme complément : la validation SSIAP 1 comporte également une épreuve pratique.",
    ],
    accroche: {
      question: "Vous préparez l’évaluation SSIAP 1 ?",
      phrase:
        "Retrouvez ce que couvre la qualification et les centres qui la proposent sur la page SSIAP 1, puis utilisez les QCM pour consolider vos révisions.",
      lien: "Voir la formation SSIAP 1",
      cible: "/securite-privee/ssiap-1/",
    },
    lies: [
      "formation-ssiap-1-gratuite-financement",
      "agent-securite-incendie-missions-quotidien",
      "qcm-ssiap-2-3-questions-corrigees",
    ],
  },
  {
    slug: "garde-du-corps-metier-missions-protection-rapprochee",
    titre: "Garde du corps : missions, formation et salaire en 2026",
    titre_seo: "Garde du corps en 2026 : métier, missions et salaire",
    meta_description:
      "Garde du corps en 2026 : missions, formation, carte CNAPS, salaire et assurance. Les étapes pour devenir agent de protection rapprochée en France.",
    extrait:
      "Missions, formation, carte CNAPS, salaire et assurance : ce qu’il faut savoir pour devenir agent de protection rapprochée.",
    categorie: "le-metier",
    verifie_le: "2026-10-13",
    couverture: {
      fichier: "GDC1",
      nom: "garde-du-corps-protection-rapprochee",
      alt: "Un agent de protection rapprochée en costume sombre accompagne discrètement une personne dans une rue de centre-ville",
    },
    images: {
      GDC1: "images-blog/Article 3/Image1 (2).jpg",
      GDC2: "images-blog/Article 3/Image2 (2).jpg#preparation-deplacement-protection-rapprochee",
      GDC3: "images-blog/Article 3/Image3 (2).jpg#equipe-protection-rapprochee",
      GDC4: "images-blog/Article 3/Image3 (3).jpg#formation-agent-protection-physique-personnes",
      GDC5: "images-blog/Article 3/Image4 (2).jpg#choisir-prestataire-protection-rapprochee",
    },
    essentiel: [
      "Garde du corps, agent de protection rapprochée (APR) et agent de protection physique des personnes (A3P) sont les appellations courantes du métier.",
      "Exercer exige une carte professionnelle CNAPS propre à la protection physique des personnes, valable cinq ans.",
      "Le port d’arme n’est possible que sur autorisation distincte, pour protéger une personne exposée à des risques exceptionnels.",
      "Les entreprises de protection rapprochée doivent être autorisées et assurées en responsabilité professionnelle.",
    ],
    a_retenir: [
      "Choisissez une formation adaptée à la protection physique des personnes et vérifiez le titre auprès de sources officielles.",
      "Obtenez la carte professionnelle CNAPS correspondante, puis anticipez le stage MAC et le renouvellement.",
      "Examinez avec réalisme le salaire, le statut, les horaires, les déplacements et l’assurance avant de vous lancer.",
    ],
    accroche: {
      question: "Vous voulez devenir agent de protection rapprochée ?",
      phrase:
        "Le TFP A3P prépare à la protection physique des personnes. Sa page présente la formation et les organismes qui la proposent en Île-de-France.",
      lien: "Voir la formation TFP A3P",
      cible: "/securite-privee/tfp-a3p/",
    },
    lies: [
      "formation-securite-privee-distance",
      "agent-securite-incendie-missions-quotidien",
      "ssiap-definition-niveaux",
    ],
  },
  {
    slug: "agent-securite-incendie-missions-quotidien",
    titre: "Agent SSIAP 1 au quotidien : missions et responsabilités",
    titre_seo: "Agent SSIAP 1 : missions, rôle et quotidien du métier",
    meta_description:
      "L’agent SSIAP 1 prévient les incendies, alerte les secours et aide le public. Découvrez ses missions, son cadre de travail et ses responsabilités.",
    extrait:
      "Prévention, rondes, alerte et assistance : ce que recouvrent concrètement les missions d’un agent SSIAP 1 une fois en poste.",
    categorie: "le-metier",
    verifie_le: "2026-10-14",
    couverture: {
      fichier: "S1",
      nom: "missions-agent-ssiap-1",
      alt: "Les missions de l’agent SSIAP 1 : prévenir les risques, repérer et signaler une anomalie, alerter et appliquer les consignes, assister les personnes et accueillir les secours",
    },
    images: {
      S1: "images-blog/Article 4/Gemini_Generated_Image_1l6mhk1l6mhk1l6m.jpg",
      S2: "images-blog/Article 4/Gemini_Generated_Image_69g27o69g27o69g2.jpg#poste-securite-incendie-agent-ssiap-1",
      S3: "images-blog/Article 4/Gemini_Generated_Image_uy1n9yuy1n9yuy1n.jpg#signaler-anomalie-securite-incendie",
      S4: "images-blog/Article 4/Gemini_Generated_Image_15w0j015w0j015w0.jpg#erp-igh-securite-incendie",
      S5: "images-blog/Article 4/Gemini_Generated_Image_8ca7uw8ca7uw8ca7.jpg#offre-emploi-agent-ssiap-1",
    },
    // Retire le titre et la consigne de génération restés sur l'image (« Style vectoriel pour lisibilité mobile »).
    rognages: { "images-blog/Article 4/Gemini_Generated_Image_uy1n9yuy1n9yuy1n.jpg": { haut: 170, hauteur: 520 } },
    essentiel: [
      "L’agent SSIAP 1 participe à la prévention des incendies et à la sécurité des personnes dans son établissement.",
      "Ses missions comprennent notamment l’alerte des secours, l’évacuation du public, l’assistance aux personnes et l’exploitation du poste de sécurité incendie.",
      "Il exerce sans fonction d’encadrement, sous l’autorité du chef d’équipe lorsqu’il y en a un.",
      "Son travail dépend du bâtiment, de son activité et des consignes de sécurité applicables.",
    ],
    a_retenir: [
      "Le métier comprend une part importante de prévention, de surveillance et de compte rendu, en plus de la réaction aux incidents.",
      "L’agent SSIAP 1 travaille dans un cadre défini et sous l’autorité du chef d’équipe ; il n’occupe pas une fonction d’encadrement.",
      "Les missions exactes et les conditions de travail dépendent du site : vérifiez-les dans l’offre et auprès de l’employeur.",
    ],
    accroche: {
      question: "Vous souhaitez vous orienter vers la sécurité incendie ?",
      phrase:
        "Avant de comparer les annonces, vérifiez les informations sur la qualification et le parcours de formation SSIAP 1.",
      lien: "Consulter la formation SSIAP 1",
      cible: "/securite-privee/ssiap-1/",
    },
    lies: [
      "securite-incendie-prevention-metiers",
      "formation-ssiap-1-gratuite-financement",
      "qcm-ssiap-1-gratuit-correction",
    ],
  },
  {
    slug: "formation-securite-privee-distance",
    titre: "Formation sécurité privée à distance : quelles règles en 2026 ?",
    titre_seo: "MAC APS en ligne : formation sécurité privée à distance en 2026",
    meta_description:
      "En 2026, le MAC APS ne se suit pas intégralement à distance : la dérogation a expiré le 31 décembre 2025. Vérifiez une offre avant de vous inscrire.",
    extrait:
      "Certaines offres affichent encore le distanciel. Vérifiez la date des textes et le format réellement proposé avant tout engagement.",
    categorie: "se-former",
    verifie_le: "2026-10-15",
    couverture: {
      fichier: "Image1.jpg",
      nom: "formation-securite-privee-distance",
      alt: "Ordinateur portable affichant une plateforme de formation en ligne sur un bureau, à côté d’un carnet et d’un stylo",
    },
    essentiel: [
      "Les règles de formation à distance dépendent de l’activité et du stage concernés : une autorisation prévue pour une activité ne s’étend pas aux autres.",
      "Pour le MAC APS en surveillance humaine ou gardiennage, le texte en vigueur ne prévoit pas de réalisation intégrale à distance.",
      "La dérogation temporaire de 2025 a pris fin le 31 décembre 2025.",
      "Une session organisée dans les locaux d’une entreprise avec un formateur présent reste une session en présentiel.",
    ],
    a_retenir: [
      "En 2026, la dérogation temporaire qui permettait certains modules de MAC APS à distance est arrivée à échéance le 31 décembre 2025.",
      "Un stage dans les locaux de l’employeur avec un formateur présent est une session en présentiel, pas un MAC suivi seul sur internet.",
      "Avant de vous inscrire, demandez le format exact, la référence réglementaire actuelle et le justificatif remis à la fin.",
    ],
    accroche: {
      question: "Vous devez renouveler votre carte professionnelle ?",
      phrase:
        "La page MAC APS présente le stage de maintien et d’actualisation des compétences et les organismes qui le proposent en Île-de-France.",
      lien: "Voir la formation MAC APS",
      cible: "/securite-privee/mac-aps/",
    },
    lies: [
      "garde-du-corps-metier-missions-protection-rapprochee",
      "formation-ssiap-1-gratuite-financement",
      "agent-securite-incendie-missions-quotidien",
    ],
  },
  {
    slug: "ssiap-definition-niveaux",
    titre: "SSIAP : définition, signification et niveaux 1, 2, 3… et 4 ?",
    titre_seo: "SSIAP : définition, signification et niveaux 1 à 3",
    meta_description:
      "SSIAP signifie « service de sécurité incendie et d’assistance à personnes ». Découvrez les rôles des SSIAP 1, 2 et 3 et si un niveau 4 existe.",
    extrait:
      "Le SSIAP organise la sécurité incendie et l’assistance aux personnes. Les niveaux officiels vont du SSIAP 1 au SSIAP 3.",
    categorie: "le-metier",
    verifie_le: "2026-10-16",
    couverture: {
      fichier: "Gemini_Generated_Image_xwtmpxwtmpxwtmpx.jpg",
      nom: "ssiap-definition-signification",
      alt: "Le sigle SSIAP développé : service de sécurité incendie et d’assistance à personnes",
    },
    essentiel: [
      "SSIAP signifie service de sécurité incendie et d’assistance à personnes : le sigle désigne le service et les qualifications de ses personnels.",
      "L’arrêté du 2 mai 2005 modifié distingue trois diplômes : SSIAP 1, SSIAP 2 et SSIAP 3.",
      "Il n’existe pas de diplôme SSIAP 4 : le « niveau 4 » est un niveau de diplôme pouvant être requis pour accéder à la formation SSIAP 3.",
    ],
    a_retenir: [
      "Pour comprendre une offre d’emploi, identifiez d’abord la fonction indiquée : agent (SSIAP 1), chef d’équipe (SSIAP 2) ou chef de service (SSIAP 3).",
      "Ne confondez pas un diplôme « de niveau 4 » avec un hypothétique SSIAP 4 : ce sont deux notions différentes.",
      "Pour l’accès à une qualification ou une équivalence, vérifiez la version en vigueur de l’arrêté et les conditions correspondant à votre situation.",
    ],
    accroche: {
      question: "Vous recherchez une formation SSIAP ?",
      phrase:
        "Choisissez la page correspondant au niveau visé et vérifiez les conditions d’accès dans le texte réglementaire en vigueur.",
      lien: "Voir la formation SSIAP 1",
      cible: "/securite-privee/ssiap-1/",
    },
    lies: [
      "securite-incendie-prevention-metiers",
      "agent-securite-incendie-missions-quotidien",
      "qcm-ssiap-1-gratuit-correction",
    ],
  },
  {
    slug: "formation-ssiap-1-gratuite-financement",
    titre: "Formation SSIAP 1 gratuite : CPF, France Travail et autres financements",
    titre_seo: "Formation SSIAP 1 gratuite : CPF, France Travail et aides",
    meta_description:
      "CPF, France Travail, aides régionales : comment financer une formation SSIAP 1 et vérifier si une prise en charge totale est possible avant de s’inscrire.",
    extrait:
      "CPF, France Travail, Région : les financements possibles et les démarches à effectuer avant de vous inscrire à une formation SSIAP 1.",
    categorie: "se-former",
    verifie_le: "2026-10-20",
    couverture: {
      fichier: "Gemini_Generated_Image_3zdz2w3zdz2w3zdz.jpg",
      nom: "formation-ssiap-1-gratuite-financement",
      alt: "Poste de sécurité incendie avec centrale de détection, écrans de contrôle et plan d’évacuation",
    },
    essentiel: [
      "Une prise en charge intégrale est possible, mais dépend de votre situation, du projet professionnel et des places financées disponibles.",
      "France Travail peut financer une formation via une place collective ou étudier une aide individuelle, parfois en complément du CPF.",
      "Depuis le 1er avril 2026, un achat CPF entraîne en général une participation de 150 €, dont les demandeurs d’emploi sont exonérés.",
      "Au 20 octobre 2026, la fiche SSIAP 1 RS5641 de France compétences affiche une échéance au 31 décembre 2026 : vérifiez l’éligibilité de l’offre à l’inscription.",
    ],
    a_retenir: [
      "Une formation gratuite existe surtout lorsqu’une place ou une aide couvre l’ensemble des frais pédagogiques : confirmez le financement pour la session visée.",
      "Le CPF, l’AIF, les places PRF/AFC et les aides régionales ou professionnelles ont des règles différentes et peuvent parfois se compléter après accord.",
      "Avant l’inscription, faites confirmer par écrit le financeur, le reste à charge et les éventuels frais annexes.",
    ],
    accroche: {
      question: "Vous avez identifié le financement ?",
      phrase:
        "Repérez maintenant une session adaptée : la page SSIAP 1 présente la formation et les organismes qui la proposent en Île-de-France.",
      lien: "Voir la formation SSIAP 1",
      cible: "/securite-privee/ssiap-1/",
    },
    lies: [
      "qcm-ssiap-1-gratuit-correction",
      "agent-securite-incendie-missions-quotidien",
      "securite-incendie-prevention-metiers",
    ],
  },
  {
    slug: "securite-incendie-prevention-metiers",
    titre: "Sécurité incendie : définition, prévention et métiers du secteur",
    titre_seo: "Sécurité incendie : définition, prévention et métiers",
    meta_description:
      "Définition de la sécurité incendie, prévention des risques, protection des bâtiments et métiers du secteur : repères pratiques et sources officielles.",
    extrait:
      "Prévention, équipements, évacuation et métiers : les repères essentiels pour comprendre la sécurité incendie dans les bâtiments.",
    categorie: "le-metier",
    verifie_le: "2026-10-20",
    couverture: {
      fichier: "Gemini_Generated_Image_ddhb8xddhb8xddhb.jpg",
      nom: "securite-incendie-definition-prevention",
      alt: "Couloir d’un bâtiment équipé d’une centrale de détection incendie, d’un déclencheur manuel, d’un plan d’évacuation et d’une issue de secours",
    },
    essentiel: [
      "La sécurité incendie réunit les mesures qui évitent un départ de feu, en limitent les effets et organisent la mise en sécurité des personnes.",
      "La prévention agit avant l’incendie ; la protection et les moyens d’intervention réduisent les conséquences si un feu se déclare.",
      "La responsabilité est partagée entre l’employeur ou l’exploitant, les personnes formées, les professionnels spécialisés et les services de secours.",
      "Les règles applicables dépendent notamment de l’usage du bâtiment, de ses risques et de son classement réglementaire.",
    ],
    a_retenir: [
      "La prévention incendie commence par l’identification des combustibles, des sources d’inflammation et des situations à risque propres au site.",
      "La protection incendie repose sur des équipements adaptés, des contrôles réguliers, des consignes comprises et des cheminements d’évacuation accessibles.",
      "Le service de sécurité incendie s’inscrit dans une organisation collective ; son rôle ne dispense pas l’employeur ou l’exploitant de ses responsabilités.",
    ],
    accroche: {
      question: "Vous souhaitez travailler dans la sécurité incendie ?",
      phrase:
        "Le métier d’agent de service de sécurité incendie est une porte d’entrée du secteur. La page SSIAP 1 présente le parcours de formation correspondant.",
      lien: "Voir la formation SSIAP 1",
      cible: "/securite-privee/ssiap-1/",
    },
    lies: [
      "agent-securite-incendie-missions-quotidien",
      "ssiap-definition-niveaux",
      "formation-ssiap-1-gratuite-financement",
    ],
  },
];
