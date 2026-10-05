import { describe, expect, it } from "vitest";
import {
  cascade,
  ecranCourant,
  etapesInitiales,
  lireOrigine,
  lireReponses,
  optionDisponible,
  ordreRelachement,
  recommander,
  type OrganismeCascade,
} from "./parcours";

const actifs = new Set(["tfp-aps", "ssiap-1", "ssiap-2", "ssiap-3", "mac-aps", "recyclage-ssiap-1", "tfp-asc"]);
const DEPTS = ["75", "92", "93", "94"];

describe("arbre", () => {
  it("total recalculé selon la branche", () => {
    expect(etapesInitiales({ depart: "debutant" })).toHaveLength(6);
    expect(etapesInitiales({ depart: "debutant", poste: "specialite" })).toHaveLength(7);
    expect(etapesInitiales({ depart: "renouvellement", detenu: "tfp-asa" })).toEqual(["depart", "detenu"]);
  });

  it("l'accueil arrive à l'écran 2 ; on avance après une réponse ; résultat à la fin", () => {
    expect(ecranCourant({ depart: "debutant" }, null, null)).toBe("poste");
    expect(ecranCourant({ depart: "debutant", poste: "surveillance" }, null, "poste")).toBe("autorisation");
    // Filière incendie : pas de question d'autorisation préalable du CNAPS.
    expect(ecranCourant({ depart: "debutant", poste: "incendie" }, null, "poste")).toBe("situation");
    const complet = {
      depart: "renouvellement",
      detenu: "tfp-aps",
      carte: "expiree",
      situation: "salarie",
      secteur: ["75"],
      rythme: "soir",
    };
    expect(ecranCourant(complet, null, "rythme")).toBe("resultat");
    expect(ecranCourant(complet, null, "pmr")).toBe("resultat");
  });

  it("retour sans réinitialiser ; écran demandé trop loin → premier sans réponse", () => {
    const r = { depart: "debutant", poste: "surveillance", autorisation: "oui" };
    expect(ecranCourant(r, "poste", null)).toBe("poste");
    expect(ecranCourant(r, "resultat", null)).toBe("situation");
    expect(ecranCourant(r, "plusieurs", null)).toBe("situation");
  });

  it("« peu importe » et départements s'excluent ; valeurs inconnues ignorées", () => {
    expect(lireReponses({ secteur: ["tous", "93"] }, DEPTS).secteur).toEqual(["93"]);
    expect(lireReponses({ secteur: "tous", depart: "pirate" }, DEPTS)).toMatchObject({
      secteur: ["tous"],
      depart: undefined,
    });
  });
});

describe("recommandation", () => {
  it("renouvellement : le stage correspondant ; ASA : message dédié", () => {
    expect(recommander({ depart: "renouvellement", detenu: "ssiap-1" }, actifs)).toMatchObject({
      titre: "recyclage-ssiap-1",
    });
    expect(recommander({ depart: "renouvellement", detenu: "tfp-asa" }, actifs)).toEqual({ type: "asa" });
  });

  it("encadrer sans SSIAP : SSIAP 1 d'abord, sauf avec le bac → SSIAP 3 directement", () => {
    const r = { depart: "evolution", detenu: "tfp-aps", objectif: "encadrer", experience: "non" };
    expect(recommander(r, actifs)).toMatchObject({ titre: "ssiap-1", gabarit: "encadrement-prerequis" });
    expect(recommander({ ...r, experience: "bac" }, actifs)).toMatchObject({
      titre: "ssiap-3",
      gabarit: "encadrement-diplome",
    });
  });

  it("SSIAP 1 + heures d'exercice → SSIAP 2 ; SSIAP 2 + expérience ou bac → SSIAP 3 ; sinon pas encore", () => {
    const r = { depart: "evolution", detenu: "ssiap-1", objectif: "encadrer", experience: "oui" };
    expect(recommander(r, actifs)).toMatchObject({ titre: "ssiap-2" });
    expect(recommander({ ...r, experience: "non" }, actifs)).toMatchObject({ titre: "tfp-aps", reference: "ssiap-2" });
    expect(recommander({ ...r, detenu: "ssiap-2", experience: "bac" }, actifs)).toMatchObject({ titre: "ssiap-3" });
    expect(recommander({ ...r, detenu: "ssiap-2", experience: "non" }, actifs)).toMatchObject({
      titre: "tfp-aps",
      reference: "ssiap-3",
    });
  });

  it("la question expérience ne vient qu'après l'objectif « encadrer »", () => {
    expect(etapesInitiales({ depart: "evolution", objectif: "incendie" })).not.toContain("experience");
    expect(etapesInitiales({ depart: "evolution", objectif: "encadrer" }).slice(0, 4)).toEqual([
      "depart",
      "detenu",
      "objectif",
      "experience",
    ]);
  });

  it("SSIAP 3 détenu : pas d'option « encadrer » ; SSIAP détenu : pas d'option « vers l'incendie »", () => {
    expect(optionDisponible("objectif", "encadrer", { detenu: "ssiap-3" }, actifs)).toBe(false);
    expect(optionDisponible("objectif", "incendie", { detenu: "ssiap-1" }, actifs)).toBe(false);
    expect(optionDisponible("objectif", "encadrer", { detenu: "tfp-aps" }, actifs)).toBe(true);
  });

  it("titre de sortie archivé : aucune recommandation (option masquée en amont)", () => {
    expect(recommander({ depart: "renouvellement", detenu: "tfp-a3p" }, actifs)).toBeNull();
  });
});

describe("cascade", () => {
  const o = (d: string, titres: string[], rythmes: string[] = ["temps_plein"]): OrganismeCascade => ({
    titres,
    rythmes,
    financements: ["cpf"],
    accessibilite_pmr: false,
    lieux: [{ departement: d }],
  });
  // 93 : temps plein ; 75 (voisin) : soir ; 77 (hors voisinage) : soir.
  const orgs = [o("93", ["ssiap-1"]), o("75", ["ssiap-1"], ["soir"]), o("77", ["ssiap-1"], ["soir"])];
  const c = { titre: "ssiap-1", departements: ["93"], rythme: "soir", financement: null, double: false, pmr: false };
  const voisins = { "93": ["75"] };
  const run = (deplacement?: string, minimum = 0) =>
    cascade(orgs, c, voisins, ordreRelachement(c, deplacement), minimum);

  it("transports : le rythme d'abord ; relâche seulement à zéro et propose la suite sans l'imposer", () => {
    expect(run("transports")).toMatchObject({ applique: ["rythme"], liste: [orgs[0]], suivant: { nombre: 2 } });
    expect(cascade(orgs, { ...c, rythme: null }, voisins, ["voisins", "region"]).applique).toEqual([]);
  });

  it("véhicule : les voisins avant le rythme", () => {
    expect(run("vehicule")).toMatchObject({ applique: ["voisins"], liste: [orgs[1]] });
  });

  it("proximité immédiate : jamais d'élargissement géographique", () => {
    expect(ordreRelachement(c, "proximite")).toEqual(["rythme"]);
    const r = cascade([orgs[1]], c, voisins, ordreRelachement(c, "proximite"));
    expect(r).toMatchObject({ liste: [], aucun: false, suivant: null });
  });

  it("élargissement choisi par le visiteur", () => {
    expect(run("transports", 2)).toMatchObject({
      applique: ["rythme", "voisins"],
      suivant: { applique: 3, nombre: 3 },
    });
  });

  it("aucun organisme sur le titre : niveau 5 (catalogue vide compris)", () => {
    expect(cascade([], c, voisins, ["region"]).aucun).toBe(true);
    expect(cascade(orgs, { ...c, pmr: true }, voisins, ["region"]).aucun).toBe(true);
  });
});

it("page d'origine : chemin interne de la verticale uniquement", () => {
  const b = "/securite-privee/";
  expect(lireOrigine("/securite-privee/ssiap-1/", b)).toBe("/securite-privee/ssiap-1/");
  expect(lireOrigine("https://evil.example/", b)).toBeNull();
  expect(lireOrigine("/securite-privee/formulaire/", b)).toBeNull();
  expect(lireOrigine("//evil.example/securite-privee/", b)).toBeNull();
});
