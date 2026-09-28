import { describe, expect, it } from "vitest";
import {
  aDesFiltres,
  cleRecherche,
  facettes,
  filtrer,
  lireFiltres,
  relachement,
  versQuery,
  type OrganismeFiltrable,
} from "./filtres";

const org = (nom: string, o: Partial<OrganismeFiltrable> = {}): OrganismeFiltrable => ({
  nom,
  qualiopi: false,
  lieux: [{ ville: "Bobigny", departement: "93" }],
  titres: [],
  financements: [],
  rythmes: [],
  ...o,
});

const A = org("Académie Démo", { titres: ["ssiap-1", "tfp-aps"], financements: ["cpf"], qualiopi: true });
const B = org("Centre Béta", {
  titres: ["ssiap-1"],
  financements: ["opco"],
  lieux: [{ ville: "Créteil", departement: "94" }],
});
const C = org("Sans formation", { lieux: [{ ville: "Paris", departement: "75" }] });
const TOUS = [A, B, C];

describe("lireFiltres / versQuery", () => {
  it("aller-retour, ville ignorée sans département, page et tri par défaut omis", () => {
    const f = lireFiltres({ titre: ["ssiap-1", "tfp-aps"], ville: "Bobigny", page: "1", tri: "pertinence" });
    expect(f.villes).toEqual([]);
    expect(versQuery(f)).toBe("?titre=ssiap-1&titre=tfp-aps");
    expect(versQuery(lireFiltres({}))).toBe("");
  });

  it("le tri et la page ne sont pas des filtres (pas de noindex pour eux seuls)", () => {
    expect(aDesFiltres(lireFiltres({ tri: "alpha", page: "3" }))).toBe(false);
    expect(aDesFiltres(lireFiltres({ qualiopi: "1" }))).toBe(true);
  });
});

describe("filtrer", () => {
  it("ET entre dimensions, OU dans une dimension ; fiche sans formation absente des filtres par titre", () => {
    expect(filtrer(TOUS, lireFiltres({ titre: "ssiap-1" }))).toEqual([A, B]);
    expect(filtrer(TOUS, lireFiltres({ titre: "ssiap-1", fin: "cpf" }))).toEqual([A]);
    expect(filtrer(TOUS, lireFiltres({ fin: ["cpf", "opco"] }))).toEqual([A, B]);
    expect(filtrer(TOUS, lireFiltres({}))).toEqual(TOUS);
  });

  it("recherche par nom insensible aux accents et à la casse", () => {
    expect(filtrer(TOUS, lireFiltres({ q: "academie" }))).toEqual([A]);
  });
});

describe("facettes", () => {
  it("compte chaque option avec les autres filtres actifs", () => {
    const n = facettes(TOUS, lireFiltres({ dept: "93" }));
    expect(n.titres.get("ssiap-1")).toBe(1); // seul A est en 93
    expect(n.dept.get("94")).toBe(1); // la dimension elle-même est ignorée pour ses propres compteurs
    expect(n.qualiopi).toBe(1);
  });
});

describe("relachement", () => {
  it("propose le retrait qui rend le plus d'organismes", () => {
    const f = lireFiltres({ titre: "ssiap-1", dept: "75" });
    expect(filtrer(TOUS, f)).toEqual([]);
    const r = relachement(TOUS, f);
    expect(r?.puce.dimension).toBe("dept");
    expect(r?.nombre).toBe(2);
  });

  it("aucune suggestion si aucun retrait unique ne suffit", () => {
    expect(relachement(TOUS, lireFiltres({ q: "zzz", dept: "99" }))).toBeNull();
  });
});

describe("cleRecherche", () => {
  it("combinaison de filtres triée, sans texte libre ni ville", () => {
    expect(cleRecherche(lireFiltres({ titre: ["tfp-aps", "ssiap-1"], dept: "93", ville: "Bobigny", tri: "alpha" }))).toBe(
      "dept=93&titre=ssiap-1&titre=tfp-aps",
    );
  });

  it("recherche par nom ou sans filtre : rien n'est enregistré", () => {
    expect(cleRecherche(lireFiltres({ q: "martin", titre: "ssiap-1" }))).toBeNull();
    expect(cleRecherche(lireFiltres({ tri: "alpha" }))).toBeNull();
  });

  it("valeur hors vocabulaire (injection) : rien n'est enregistré", () => {
    expect(cleRecherche(lireFiltres({ titre: "<script>" }))).toBeNull();
  });
});
