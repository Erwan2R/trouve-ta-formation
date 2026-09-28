import { describe, expect, it } from "vitest";
import { SLUGS_RESERVES } from "@/lib/config/slugs-reserves";
import { PILIERS, h1Pilier, pilierVisible } from ".";
import { ssiap1 } from "./ssiap-1";
import { contenuVerifie } from "./types";

describe("piliers", () => {
  it("production : jamais de page non publiée ni de contenu « à vérifier »", () => {
    expect(pilierVisible({ slug: "ssiap-1", page_publiee: false }, true)).toBe(false);
    expect(pilierVisible({ slug: "ssiap-1", page_publiee: true }, true)).toBe(false); // brouillon
    expect(pilierVisible({ slug: "inexistant", page_publiee: true }, true)).toBe(false);
  });

  it("contenu vérifié : sans marqueur et avec tous les volumes horaires", () => {
    const nettoye: typeof ssiap1 = JSON.parse(JSON.stringify(ssiap1).replaceAll(" [à vérifier]", ""));
    expect(contenuVerifie(nettoye)).toBe(false); // volumes manquants
    nettoye.programme.modules.forEach((m) => (m.volume = "10 h"));
    expect(contenuVerifie(nettoye)).toBe(true);
  });

  it("hors production : brouillon prévisualisable", () => {
    expect(pilierVisible({ slug: "ssiap-1", page_publiee: false }, false)).toBe(true);
  });

  it("aucun contenu sur un slug réservé", () => {
    for (const slug of Object.keys(PILIERS)) expect(SLUGS_RESERVES).not.toContain(slug);
  });
});

describe("h1Pilier", () => {
  it("ne double pas l'acronyme", () => {
    const c = { ...ssiap1, h1: undefined };
    expect(h1Pilier({ libelle_court: "SSIAP 1", libelle_long: "SSIAP 1 — Agent de service" }, c)).toBe(
      "SSIAP 1 — Agent de service",
    );
    expect(h1Pilier({ libelle_court: "TFP APS", libelle_long: "Titre à finalité professionnelle APS" }, c)).toBe(
      "TFP APS — Titre à finalité professionnelle APS",
    );
  });
});
