import { describe, expect, it } from "vitest";
import { palier, type DonneesCompletude } from "./completude";
import { actionsRelance, manquantsOptimal } from "./relance";

const vide: DonneesCompletude = {
  nbFormations: 0,
  financements: [],
  presentation: null,
  logo_url: null,
  siret: null,
  numero_agrement_cnaps: null,
  qualiopi: false,
  horaires: null,
  accessibilite_pmr: false,
  site_web: null,
};
const run = (o: DonneesCompletude) => actionsRelance(o, palier(o));

describe("checklist de relance", () => {
  it("Basique sans formation : les formations d'abord, puis financements et présentation", () => {
    expect(run(vide)).toEqual(["formations", "financements", "presentation"]);
  });
  it("Basique avec formations : l'une des deux informations suffit", () => {
    expect(run({ ...vide, nbFormations: 2 })).toEqual(["financements", "presentation"]);
  });
  it("Correct : agrément et Qualiopi avant le reste, jamais plus de 3", () => {
    const correct = { ...vide, nbFormations: 1, presentation: "x" };
    expect(run(correct)).toEqual(["cnaps", "qualiopi", "siret"]);
    expect(manquantsOptimal(correct)).toBe(5);
  });
  it("Optimal : aucune action inventée", () => {
    const optimal = {
      ...vide,
      nbFormations: 1,
      presentation: "x",
      siret: "1",
      logo_url: "l",
      qualiopi: true,
      numero_agrement_cnaps: "a",
      horaires: "h",
    };
    expect(run(optimal)).toEqual([]);
  });
});
