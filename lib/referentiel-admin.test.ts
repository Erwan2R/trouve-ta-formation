import { describe, expect, it } from "vitest";
import { intituleDejaPris, slugIndisponible, slugTitre, titresProches } from "./referentiel-admin";

const titres = [
  {
    id: 1,
    slug: "tfp-aps",
    libelle_court: "TFP APS",
    libelle_long: "Titre à finalité professionnelle Agent de prévention et de sécurité",
  },
  { id: 2, slug: "ssiap-1", libelle_court: "SSIAP 1", libelle_long: "SSIAP 1 — Agent de service de sécurité incendie" },
];

describe("référentiel admin", () => {
  it("dérive un slug stable et refuse les slugs pris ou réservés", () => {
    expect(slugTitre("Agent de sûreté magasin")).toBe("agent-de-surete-magasin");
    expect(slugTitre("  SST — Sauveteur ")).toBe("sst-sauveteur");
    expect(slugIndisponible("ssiap-1", titres)).toBe(true);
    expect(slugIndisponible("organismes", titres)).toBe(true);
    expect(slugIndisponible("", titres)).toBe(true);
    expect(slugIndisponible("palpation-de-securite", titres)).toBe(false);
  });

  it("détecte les doublons et les titres proches", () => {
    expect(intituleDejaPris("ssiap 1", titres)).toBe(true);
    expect(intituleDejaPris("SSIAP 1", titres, 2)).toBe(false);
    expect(titresProches("Recyclage prévention incendie", titres)).toEqual(["TFP APS", "SSIAP 1"]);
    expect(titresProches("Palpation", titres)).toEqual([]);
  });
});
