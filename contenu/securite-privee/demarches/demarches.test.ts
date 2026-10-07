import { describe, expect, it } from "vitest";
import { DEMARCHES, demarcheVisible, listeDemarchesVisible } from ".";

const ok = { slug: "carte-professionnelle", page_publiee: true, verifie_le: "2026-10-01" };

describe("demarcheVisible", () => {
  it("production : non publiée, non datée ou brouillon → invisible", () => {
    expect(demarcheVisible({ ...ok, page_publiee: false }, true)).toBe(false);
    expect(demarcheVisible({ ...ok, verifie_le: null }, true)).toBe(false);
    expect(demarcheVisible(ok, true)).toBe(true); // contenu finalisé (relevé CNAPS du 07/10/2026)
  });

  it("production : publiée, datée, contenu finalisé → visible", () => {
    const original = DEMARCHES["carte-professionnelle"];
    DEMARCHES["carte-professionnelle"] = JSON.parse(
      JSON.stringify(original).replace(/ ?\[à (vérifier|compléter)\]/g, ""),
    );
    expect(demarcheVisible(ok, true)).toBe(true);
    expect(demarcheVisible({ ...ok, cout: "[à vérifier]" } as typeof ok, true)).toBe(false); // marqueur en base
    DEMARCHES["carte-professionnelle"] = original;
  });

  it("hors production : brouillon prévisualisable ; slug inconnu jamais", () => {
    expect(demarcheVisible({ ...ok, page_publiee: false, verifie_le: null }, false)).toBe(true);
    expect(demarcheVisible({ ...ok, slug: "inconnue" }, false)).toBe(false);
  });

  it("liste : aucune démarche visible → pas de page", () => {
    expect(listeDemarchesVisible(0, false)).toBe(false);
    expect(listeDemarchesVisible(1, false)).toBe(true);
    expect(listeDemarchesVisible(3, true)).toBe(true); // texte de la liste vérifié (Dracar Ultimate, 18 février 2026)
  });
});
