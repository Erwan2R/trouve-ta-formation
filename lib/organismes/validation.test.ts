import { describe, expect, it } from "vitest";
import { annee, codePostal, email, montant, presentation, siret, siteWeb, telephone } from "./validation";

describe("validation des champs de la fiche", () => {
  it("vide = accepté, enregistré à null (aucun champ obligatoire)", () => {
    for (const f of [siret, codePostal, email, telephone, siteWeb, presentation, montant])
      expect(f("  ")).toEqual({ ok: true, valeur: null });
  });
  it("formats", () => {
    expect(siret("123 456 789 00012")).toEqual({ ok: true, valeur: "12345678900012" });
    expect(siret("1234").ok).toBe(false);
    expect(codePostal("93 000")).toEqual({ ok: true, valeur: "93000" });
    expect(annee("2014", 2026)).toEqual({ ok: true, valeur: 2014 });
    expect(annee("2030", 2026).ok).toBe(false);
    expect(email("Contact@AFS.fr")).toEqual({ ok: true, valeur: "contact@afs.fr" });
    expect(telephone("01 48 30 00 00").ok).toBe(true);
    expect(telephone("abc").ok).toBe(false);
    expect(siteWeb("afs-formation.fr")).toEqual({ ok: true, valeur: "https://afs-formation.fr" });
    expect(siteWeb("pas un site").ok).toBe(false);
    expect(presentation("x".repeat(1501)).ok).toBe(false);
    expect(montant("1 490,50 €")).toEqual({ ok: true, valeur: 1490.5 });
  });
});
