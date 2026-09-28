import { describe, expect, it } from "vitest";
import { cascade, ecranCourant, etapesInitiales, lireReponses, recommander, type OrganismeCascade } from "./parcours";

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
    expect(ecranCourant({ depart: "debutant", poste: "incendie" }, null, "poste")).toBe("autorisation");
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

  it("encadrement sans expérience : pas encore, titre complémentaire", () => {
    expect(
      recommander({ depart: "evolution", detenu: "ssiap-1", experience: "moins-1-an", objectif: "encadrer" }, actifs),
    ).toMatchObject({ titre: "tfp-aps", gabarit: "encadrement-sans-experience", reference: "ssiap-2" });
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
  const orgs = [o("93", ["ssiap-1"]), o("75", ["ssiap-1"], ["soir"]), o("92", ["ssiap-1"])];
  const c = { titre: "ssiap-1", departements: ["93"], rythme: "soir", financement: null, double: false, pmr: false };
  const voisins = { "93": ["75"] };

  it("relâche seulement à zéro, et propose l'élargissement suivant sans l'imposer", () => {
    expect(cascade(orgs, c, voisins)).toMatchObject({ niveau: 2, liste: [orgs[0]], suivant: { niveau: 3, nombre: 2 } });
    expect(cascade(orgs, { ...c, rythme: null }, voisins).niveau).toBe(1);
    expect(cascade(orgs, c, voisins, 3)).toMatchObject({ niveau: 3, suivant: { niveau: 4, nombre: 3 } });
  });

  it("aucun organisme sur le titre : niveau 5 (catalogue vide compris)", () => {
    expect(cascade([], c, voisins).niveau).toBe(5);
    expect(cascade(orgs, { ...c, pmr: true }, voisins).niveau).toBe(5);
  });
});
