import { describe, expect, it } from "vitest";
import { estIndexable, palier, type DonneesCompletude } from "./completude";

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

describe("palier", () => {
  it("sans formation : Basique (noindex), quelle que soit la richesse de la fiche", () => {
    const riche = { ...vide, presentation: "Texte", financements: ["cpf"], qualiopi: true, site_web: "x" };
    expect(palier(riche)).toBe("basique");
    expect(estIndexable(palier(riche))).toBe(false);
  });

  it("formation + (financements ou présentation) : Correct", () => {
    expect(palier({ ...vide, nbFormations: 1 })).toBe("basique");
    expect(palier({ ...vide, nbFormations: 1, financements: ["cpf"] })).toBe("correct");
    expect(palier({ ...vide, nbFormations: 1, presentation: "  " })).toBe("basique"); // blanc = vide
    expect(palier({ ...vide, nbFormations: 1, presentation: "Centre à Bobigny" })).toBe("correct");
  });

  it("Optimal à partir de 5 des 7 éléments", () => {
    const correct = { ...vide, nbFormations: 2, financements: ["cpf"] };
    const quatre = { ...correct, logo_url: "l", siret: "s", qualiopi: true, horaires: "h" };
    expect(palier(quatre)).toBe("correct");
    expect(palier({ ...quatre, site_web: "w" })).toBe("optimal");
  });
});
