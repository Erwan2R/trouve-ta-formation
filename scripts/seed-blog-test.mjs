// Articles et auteur de DÉMONSTRATION du blog (est_test) : base de dev uniquement, jamais visibles en production.
// Servent à prévisualiser les pages publiques et à tester l'admin. Recréés à neuf à chaque exécution.
// Usage : node --env-file=.env.development.local scripts/seed-blog-test.mjs
import { createClient } from "@supabase/supabase-js";

const DEV = "https://livkbehsovponxhbctac.supabase.co";
if (process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") !== DEV)
  throw new Error("Refusé : ce script ne s'exécute que sur la base de dev.");
const db = createClient(DEV, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// Construction du document (format de l'éditeur).
const t = (text, marks) => ({ type: "text", text, ...(marks && { marks }) });
const lien = (text, href) => t(text, [{ type: "link", attrs: { href } }]);
const p = (...c) => ({ type: "paragraph", content: c.map((x) => (typeof x === "string" ? t(x) : x)) });
const h = (level, text) => ({ type: "heading", attrs: { level }, content: [t(text)] });
const ul = (...items) => ({ type: "bulletList", content: items.map((i) => ({ type: "listItem", content: [p(i)] })) });
const callout = (variante, contenu, chiffre) => ({
  type: "callout",
  attrs: { variante, chiffre: chiffre ?? null },
  content: contenu,
});
const table = (entete, lignes) => ({
  type: "table",
  content: [
    { type: "tableRow", content: entete.map((c) => ({ type: "tableHeader", content: [p(c)] })) },
    ...lignes.map((l) => ({ type: "tableRow", content: l.map((c) => ({ type: "tableCell", content: [p(c)] })) })),
  ],
});
const doc = (...content) => ({ type: "doc", content });

const long = doc(
  p(
    "Un agent de sécurité travaille le plus souvent en horaires décalés : nuits, week-ends et jours fériés font partie du métier. Ses missions varient beaucoup selon le site, d'un poste d'accueil en journée à des rondes de nuit dans un entrepôt.",
  ),
  p(
    "Ce texte est un article de démonstration, rédigé pour prévisualiser la mise en page du blog. Il n'est visible que sur l'environnement de développement et ne sera jamais publié.",
  ),
  h(2, "Une journée type n'existe pas"),
  p(
    "Le métier recouvre des réalités très différentes. Un agent affecté à l'accueil d'un immeuble de bureaux ne vit pas la même journée qu'un agent de surveillance dans un centre commercial ou qu'un agent posté sur un chantier la nuit. Le point commun reste la présence : l'agent est là pour prévenir, observer et alerter, bien plus que pour intervenir.",
  ),
  p(
    "La prise de poste suit en général le même schéma. L'agent consulte la main courante, échange avec l'équipe qu'il remplace, vérifie les consignes particulières du site et contrôle le matériel mis à sa disposition. Ce passage de relais est un moment important : c'est là que se transmettent les informations qui ne figurent dans aucun document.",
  ),
  h(3, "Les postes d'accueil et de contrôle"),
  p(
    "Sur un poste d'accueil, l'agent gère les entrées, oriente les visiteurs et contrôle les accès. Le contact avec le public occupe l'essentiel du temps. La présentation, la courtoisie et la capacité à rester calme face à une personne mécontente comptent autant que la vigilance.",
  ),
  h(3, "Les rondes et la surveillance"),
  p(
    "Sur un site fermé au public, le travail repose davantage sur les rondes et la surveillance des écrans. L'agent suit un parcours défini, vérifie les issues, les éclairages et les équipements, puis consigne ce qu'il a constaté. Ces postes demandent de l'autonomie et une bonne capacité à rester attentif sur la durée, y compris quand il ne se passe rien.",
  ),
  callout("vigilance", [
    p(
      "Les consignes propres à chaque site priment sur les habitudes. Un agent qui change d'affectation doit toujours les relire, même s'il connaît bien le métier.",
    ),
  ]),
  h(2, "Les horaires et le rythme de travail"),
  p(
    "Les plannings sont souvent organisés en vacations longues, avec des rotations entre jour et nuit. Ce rythme a des avantages, comme des jours de repos regroupés, mais il pèse sur la vie personnelle et sur le sommeil. Beaucoup d'agents disent que l'organisation du planning compte autant que le salaire dans le choix d'un employeur.",
  ),
  table(
    ["Type de poste", "Rythme le plus courant", "Ce qui compte"],
    [
      ["Accueil en entreprise", "Journée, en semaine", "Contact avec le public"],
      ["Surveillance de site", "Vacations longues, nuits", "Autonomie, vigilance"],
      ["Événementiel", "Soirées, week-ends", "Gestion des flux de personnes"],
      ["Commerce", "Horaires d'ouverture", "Prévention des vols"],
    ],
  ),
  p(
    "Ce tableau donne des tendances, pas des règles : chaque employeur organise ses plannings à sa façon, et un même agent peut passer d'un type de poste à l'autre au cours de sa carrière.",
  ),
  h(2, "Les conditions de travail"),
  p(
    "Le travail se fait souvent seul, debout ou en mouvement, à l'intérieur comme à l'extérieur. Selon les sites, l'agent dispose d'un local, d'un poste de contrôle équipé d'écrans ou simplement d'un comptoir. L'équipement de base comprend une tenue, un moyen de communication et parfois une lampe ou un détecteur.",
  ),
  p(
    "Les situations difficiles existent, mais elles restent minoritaires dans le quotidien. Elles prennent le plus souvent la forme de :",
  ),
  ul(
    "personnes refusant un contrôle ou une consigne ;",
    "tentatives de vol dans les commerces ;",
    "malaises ou incidents à gérer en attendant les secours ;",
    "longues périodes sans événement, qui mettent la vigilance à l'épreuve.",
  ),
  callout(
    "chiffre",
    [
      p(
        "C'est le nombre de mots à partir duquel la table des matières et l'encadré « L'essentiel » apparaissent sur un article.",
      ),
    ],
    "1 000 mots",
  ),
  h(2, "Évoluer dans le métier"),
  p(
    "Le métier offre des possibilités d'évolution réelles pour ceux qui les recherchent. Certains agents se spécialisent, par exemple dans la sécurité incendie ou la protection des personnes. D'autres prennent des responsabilités d'encadrement et deviennent chefs de poste ou chefs d'équipe.",
  ),
  p(
    "Ces évolutions passent généralement par une formation complémentaire. Les titres concernés et leurs conditions d'accès sont détaillés sur les pages consacrées aux formations, comme celle du ",
    lien("SSIAP 1", "/securite-privee/ssiap-1/"),
    " pour la sécurité incendie.",
  ),
  callout("renvoi", [
    p(
      "Avant d'entrer en formation, il faut obtenir une autorisation préalable. ",
      lien("Voir la démarche →", "/securite-privee/demarches/autorisation-prealable/"),
    ),
  ]),
  h(2, "Le travail en équipe et les relations avec le client"),
  p(
    "Même quand il travaille seul sur son poste, l'agent fait partie d'une équipe. Les consignes sont rédigées par un chef de poste ou un responsable de site, les incidents sont remontés à la hiérarchie, et la continuité du service repose sur des relèves bien faites. Un agent qui note précisément ce qu'il a observé facilite le travail de celui qui le remplace.",
  ),
  p(
    "La relation avec le client du site compte aussi beaucoup. Sur un site où l'agent est présent depuis longtemps, il connaît les habitudes, les personnes et les points sensibles. Cette connaissance du terrain est souvent ce qui distingue un agent apprécié d'un agent simplement présent. Elle se construit avec le temps, et elle explique pourquoi certains agents restent plusieurs années sur la même affectation.",
  ),
  p(
    "À l'inverse, les changements fréquents d'affectation demandent une forte capacité d'adaptation. Chaque nouveau site a ses règles, ses contacts et ses horaires. Certains agents apprécient cette variété, d'autres préfèrent la stabilité : c'est un point à aborder avec l'employeur dès l'embauche.",
  ),
  h(2, "La santé et l'équilibre personnel"),
  p(
    "Le travail de nuit et les horaires irréguliers ont des effets connus sur le sommeil et la fatigue. Les agents qui tiennent dans la durée s'organisent souvent avec soin : horaires de repos réguliers, alimentation adaptée aux vacations de nuit, temps de récupération après une série de nuits. Ces habitudes ne s'improvisent pas et se construisent souvent avec l'expérience.",
  ),
  p(
    "La station debout prolongée, les déplacements pendant les rondes et le travail en extérieur par mauvais temps demandent aussi une certaine endurance physique. Rien d'exceptionnel, mais un point à garder en tête avant de s'engager, en particulier pour quelqu'un qui vient d'un métier de bureau.",
  ),
  p(
    "Enfin, la vie familiale doit composer avec des plannings qui changent. Beaucoup d'agents expliquent qu'ils ont trouvé leur équilibre en choisissant un type de poste compatible avec leurs contraintes : des postes de journée pour certains, des vacations longues regroupées pour d'autres, qui libèrent plusieurs jours consécutifs.",
  ),
  h(2, "Ce que disent les agents"),
  p(
    "Les témoignages reviennent souvent sur les mêmes points. La relation avec l'équipe et avec le client du site fait une grande partie de la qualité du poste. La régularité du planning est un critère de choix important. Enfin, beaucoup soulignent qu'on apprend surtout sur le terrain, au contact d'agents plus expérimentés.",
  ),
  p(
    "Pour quelqu'un qui découvre le secteur, le mieux est souvent de commencer sur un poste simple, d'observer les différents types de missions, puis de choisir une spécialité une fois le métier mieux connu. Les sources officielles, comme le site du ",
    lien("CNAPS", "https://www.cnaps.interieur.gouv.fr/"),
    ", restent la référence pour tout ce qui touche à la réglementation.",
  ),
  p(
    "Ce texte de démonstration se termine ici. Il contient assez de mots pour déclencher l'affichage de la table des matières et de l'encadré de synthèse, afin de vérifier leur rendu avant la publication des vrais articles.",
  ),
);

const court = (texte) => doc(p(texte), h(2, "Section de démonstration"), p(texte));

async function main() {
  await db.from("articles_blog").delete().eq("est_test", true);
  await db.from("auteurs_blog").delete().eq("est_test", true);
  const { data: demo } = await db
    .from("auteurs_blog")
    .insert({ nom: "Auteur de démonstration", qualification: "Profil fictif, base de dev uniquement", est_test: true })
    .select("id")
    .single();
  const { data: erwan } = await db.from("auteurs_blog").select("id").eq("est_test", false).limit(1).single();
  const jours = (n) => new Date(Date.now() - n * 86_400_000).toISOString();
  const base = { est_test: true, statut: "publie" };
  const articles = [
    {
      ...base,
      slug: "demo-quotidien-agent-de-securite",
      titre: "Le quotidien d'un agent de sécurité : horaires, missions, conditions de travail",
      titre_seo: "Le quotidien d'un agent de sécurité : horaires et missions",
      meta_description:
        "Article de démonstration : horaires, missions et conditions de travail d'un agent de sécurité.",
      extrait:
        "Horaires décalés, rondes, accueil : ce que recouvre réellement le métier selon les sites. Article de démonstration.",
      categorie: "le-metier",
      auteur_id: erwan.id,
      corps: long,
      essentiel: [
        "Les horaires décalés (nuits, week-ends, jours fériés) font partie du métier.",
        "Les missions varient fortement d'un site à l'autre.",
        "Les évolutions passent par une spécialisation ou l'encadrement.",
      ],
      a_retenir: [
        "Relire les consignes de chaque site, même avec de l'expérience.",
        "Regarder l'organisation du planning autant que le salaire.",
        "Commencer sur un poste simple avant de choisir une spécialité.",
      ],
      // Exemple de la copy (bloc 8) ; la page de destination doit être visible, sinon l'accroche générique s'affiche.
      accroche_question: "Vérifiez votre situation avant de vous inscrire.",
      accroche_phrase:
        "L'autorisation préalable du CNAPS est la démarche qui tranche cette question, et elle se demande avant l'entrée en formation.",
      accroche_lien: "Voir la démarche",
      accroche_cible: "/securite-privee/demarches/autorisation-prealable/",
      mis_en_avant: true,
      publie_le: jours(20),
      maj_le: jours(3),
    },
    {
      ...base,
      slug: "demo-financer-sa-reconversion",
      titre: "Financer sa reconversion dans la sécurité privée",
      extrait: "Les pistes de financement quand on change de métier. Article de démonstration, sans données réelles.",
      categorie: "se-former",
      auteur_id: demo.id,
      corps: court("Article de démonstration court, utilisé pour prévisualiser les cartes du blog."),
      publie_le: jours(9),
    },
    {
      ...base,
      slug: "demo-casier-judiciaire",
      titre: "Casier judiciaire et sécurité privée : ce qui compte vraiment",
      extrait:
        "Ce qu'examine l'administration avant d'autoriser l'exercice. Article de démonstration, sans données réelles.",
      categorie: "conditions-acces",
      auteur_id: erwan.id,
      reglementaire: true,
      verifie_le: jours(5).slice(0, 10),
      corps: court("Article de démonstration court, marqué comme réglementaire pour afficher la date de vérification."),
      publie_le: jours(6),
    },
    {
      ...base,
      slug: "demo-actualite-reglementaire",
      titre: "Ce qui change pour les agents cette année",
      extrait: "Un exemple d'article d'actualité datée. Article de démonstration, sans données réelles.",
      categorie: "actualites",
      auteur_id: demo.id,
      corps: court("Article de démonstration court, catégorie Actualités."),
      publie_le: jours(2),
    },
    {
      ...base,
      statut: "depublie",
      slug: "demo-article-retire",
      titre: "Article de démonstration retiré",
      categorie: "le-metier",
      corps: court("Dépublié sans remplacement : son adresse doit répondre 410."),
      publie_le: jours(40),
    },
    {
      ...base,
      statut: "depublie",
      slug: "demo-article-remplace",
      titre: "Article de démonstration remplacé",
      categorie: "le-metier",
      corps: court("Dépublié avec remplacement : son adresse doit rediriger en 301."),
      remplacement: "/securite-privee/blog/demo-quotidien-agent-de-securite/",
      publie_le: jours(40),
    },
  ];
  // Une insertion par article : en lot, une colonne absente d'une ligne serait envoyée à null (au lieu du défaut).
  const data = [];
  for (const art of articles) {
    const { data: ligne, error } = await db.from("articles_blog").insert(art).select("id, slug").single();
    if (error) throw error;
    data.push(ligne);
  }
  const id = (s) => data.find((x) => x.slug === s).id;
  await db
    .from("articles_blog")
    .update({
      lies: [id("demo-financer-sa-reconversion"), id("demo-casier-judiciaire"), id("demo-actualite-reglementaire")],
    })
    .eq("id", id("demo-quotidien-agent-de-securite"));
  console.log(`${data.length} articles de démonstration créés sur dev.`);
}
await main();
