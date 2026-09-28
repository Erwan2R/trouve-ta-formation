// Organismes FICTIFS de développement (est_test = true) : jamais servis en production.
// Décision Erwan 01/10/2026 : aucune donnée scrapée dans le catalogue ; fiches publiques = inscriptions volontaires.
// Usage : node --env-file=.env.local scripts/seed-organismes-test.mjs   (idempotent : remplace les organismes de test)
import { createClient } from "@supabase/supabase-js";

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const ok = ({ data, error }) => {
  if (error) throw error;
  return data;
};

const commun = { statut: "publie", est_test: true, langues: ["Français"] };
const ORGANISMES = [
  {
    org: {
      slug: "academie-demo-securite",
      nom: "Académie Démo Sécurité",
      raison_sociale: "ACADEMIE DEMO SECURITE SAS",
      siret: "00000000000001",
      numero_agrement_cnaps: "FOR-093-2099-00-00-TEST0001",
      qualiopi: true,
      numero_declaration_activite: "00000000001",
      annee_creation: 2014,
      telephone: "01 00 00 00 01",
      email_contact: "contact@academie-demo.example",
      site_web: "https://academie-demo.example",
      horaires: "Lundi au vendredi, 9 h – 18 h",
      accessibilite_pmr: true,
      financements: ["cpf", "france_travail", "opco", "plan_developpement"],
      presentation:
        "Centre installé à Bobigny depuis 2014, spécialisé dans la formation initiale des agents de sécurité privée. Sessions de 12 stagiaires maximum, salle de mise en situation et plateau technique incendie sur place à Montreuil. La plupart de nos stagiaires viennent de Seine-Saint-Denis et du Val-d'Oise et sont accompagnés par France Travail. Nos formateurs sont tous en activité ou anciens professionnels du secteur, et le montage des dossiers de financement est fait avec vous au centre.",
    },
    lieux: [
      {
        cle: "siege",
        est_siege: true,
        nom: "Siège",
        adresse: "14 rue de la Démonstration",
        code_postal: "93000",
        ville: "Bobigny",
      },
      {
        cle: "sd",
        nom: "Centre Saint-Denis",
        adresse: "8 avenue de l'Exemple",
        code_postal: "93200",
        ville: "Saint-Denis",
      },
      {
        cle: "mtr",
        nom: "Plateau technique Montreuil",
        adresse: "31 rue du Test",
        code_postal: "93100",
        ville: "Montreuil",
      },
    ],
    offres: [
      {
        titre: "tfp-aps",
        prix_min: 1490,
        duree_heures: 175,
        rythmes: ["temps_plein"],
        lieux: ["siege"],
        prix_compris: "Support de cours, passage des épreuves et une session de rattrapage incluses.",
        inscription:
          "Dossier à déposer au centre ou par email. Autorisation préalable du CNAPS à obtenir avant l'entrée en formation ; le centre vous accompagne dans la demande.",
        financements: ["cpf", "france_travail"],
      },
      {
        titre: "mac-aps",
        prix_min: 390,
        duree_heures: 31,
        rythmes: ["temps_plein"],
        lieux: ["siege"],
        prix_compris: "Support de cours et passage des épreuves inclus.",
        inscription: "Carte professionnelle en cours de validité à présenter à l'inscription.",
        financements: ["opco", "plan_developpement"],
      },
      {
        titre: "ssiap-1",
        prix_min: 690,
        duree_heures: 70,
        rythmes: ["temps_plein"],
        lieux: ["sd"],
        prix_compris: "Support de cours, équipements de protection et passage des épreuves inclus.",
      },
      { titre: "ssiap-2", duree_heures: 67, rythmes: ["soir"], lieux: ["mtr"] },
      { titre: "recyclage-ssiap-1", prix_min: 210, duree_heures: 14, rythmes: ["week_end"], lieux: ["siege"] },
    ],
  },
  {
    org: {
      slug: "centre-demo-saint-denis",
      nom: "Centre Démo Saint-Denis",
      numero_agrement_cnaps: "FOR-093-2099-00-00-TEST0002",
      qualiopi: true,
      telephone: "01 00 00 00 02",
      site_web: "https://centre-demo.example",
      financements: ["cpf", "france_travail"],
      presentation: "Organisme de démonstration centré sur la sécurité incendie, sessions tous les mois.",
    },
    lieux: [
      { cle: "siege", est_siege: true, adresse: "2 place de l'Essai", code_postal: "93200", ville: "Saint-Denis" },
    ],
    offres: [
      { titre: "ssiap-1", prix_min: 650, prix_max: 720, duree_heures: 70, rythmes: ["temps_plein"] },
      { titre: "recyclage-ssiap-1", prix_min: 190, duree_heures: 14, rythmes: ["temps_plein", "week_end"] },
    ],
  },
  {
    org: {
      slug: "institut-demo-est-parisien",
      nom: "Institut Démo Est Parisien",
      telephone: "01 00 00 00 03",
      horaires: "Du lundi au samedi, 8 h 30 – 19 h",
      financements: ["cpf", "opco"],
    },
    lieux: [{ cle: "siege", est_siege: true, adresse: "5 boulevard Fictif", code_postal: "93100", ville: "Montreuil" }],
    offres: [
      { titre: "ssiap-1", prix_min: 700, duree_heures: 70, rythmes: ["soir"] },
      { titre: "ssiap-2", prix_min: 1100, duree_heures: 70, rythmes: ["soir"] },
      { titre: "ssiap-3", duree_heures: 216, rythmes: ["temps_plein"] },
    ],
  },
  {
    org: {
      slug: "formation-demo-aubervilliers",
      nom: "Formation Démo Aubervilliers",
      telephone: "01 00 00 00 04",
      email_contact: "accueil@formation-demo.example",
      financements: ["france_travail"],
    },
    lieux: [
      { cle: "siege", est_siege: true, adresse: "40 rue Imaginaire", code_postal: "93300", ville: "Aubervilliers" },
    ],
    offres: [
      { titre: "tfp-aps", prix_min: 1350, duree_heures: 175, rythmes: ["temps_plein"] },
      { titre: "mac-aps", prix_min: 350, duree_heures: 31, rythmes: ["temps_plein", "week_end"] },
    ],
  },
  {
    org: {
      slug: "securite-demo-creteil",
      nom: "Sécurité Démo Créteil",
      numero_agrement_cnaps: "FOR-094-2099-00-00-TEST0005",
      qualiopi: true,
      telephone: "01 00 00 00 05",
      site_web: "https://securite-demo.example",
      accessibilite_pmr: true,
      financements: ["cpf", "opco"],
      presentation:
        "Centre de démonstration spécialisé dans les formations cynophiles, avec chenil et terrain d'entraînement.",
    },
    lieux: [
      { cle: "siege", est_siege: true, adresse: "12 allée du Prototype", code_postal: "94000", ville: "Créteil" },
    ],
    offres: [
      { titre: "tfp-asc", prix_min: 2400, duree_heures: 210, rythmes: ["temps_plein"] },
      { titre: "mac-cyno", prix_min: 420, duree_heures: 35, rythmes: ["soir", "week_end"] },
    ],
  },
  {
    org: {
      slug: "organisme-demo-paris",
      nom: "Organisme Démo Paris",
      telephone: "01 00 00 00 06",
      presentation: "Organisme de démonstration qui n'a pas encore déclaré ses formations.",
    },
    lieux: [{ cle: "siege", est_siege: true, adresse: "1 rue du Brouillon", code_postal: "75011", ville: "Paris" }],
    offres: [],
  },
  {
    org: {
      slug: "centre-demo-evry",
      nom: "Centre Démo Évry",
      telephone: "01 00 00 00 07",
      presentation: "Petit centre de démonstration en Essonne, sessions de huit stagiaires.",
    },
    lieux: [
      {
        cle: "siege",
        est_siege: true,
        adresse: "3 cours de l'Exemple",
        code_postal: "91000",
        ville: "Évry-Courcouronnes",
      },
    ],
    offres: [{ titre: "tfp-aps", duree_heures: 175, rythmes: ["temps_plein"] }],
  },
];

const titres = new Map(ok(await db.from("titres_referentiel").select("id, slug")).map((t) => [t.slug, t.id]));
ok(await db.from("organismes").delete().eq("est_test", true));

for (const { org, lieux, offres } of ORGANISMES) {
  const { id } = ok(
    await db
      .from("organismes")
      .insert({ ...commun, ...org })
      .select("id")
      .single(),
  );
  const lieuxCrees = ok(
    await db
      .from("lieux")
      // Envoi groupé : une clé absente d'une ligne vaudrait null, d'où les valeurs par défaut explicites.
      .insert(lieux.map(({ cle: _cle, ...l }) => ({ est_siege: false, nom: null, ...l, organisme_id: id })))
      .select("id"),
  );
  const lieuParCle = new Map(lieux.map((l, i) => [l.cle, lieuxCrees[i].id]));
  for (const { titre, lieux: cles = [], ...offre } of offres) {
    const { id: offreId } = ok(
      await db
        .from("organisme_titres")
        .insert({ ...offre, organisme_id: id, titre_id: titres.get(titre), slug: titre })
        .select("id")
        .single(),
    );
    if (cles.length)
      ok(await db.from("offre_lieux").insert(cles.map((c) => ({ offre_id: offreId, lieu_id: lieuParCle.get(c) }))));
  }
  console.log("✓", org.nom);
}
