import { describe, expect, it } from "vitest";
import { SLUGS_RESERVES } from "@/lib/config/slugs-reserves";
import { PILIERS, h1Pilier, pilierVisible } from ".";
import { ssiap1 } from "./ssiap-1";
import { contenuVerifie } from "./types";

describe("piliers", () => {
  it("production : jamais de page non publiée", () => {
    expect(pilierVisible({ slug: "ssiap-1", page_publiee: false }, true)).toBe(false);
    expect(pilierVisible({ slug: "ssiap-1", page_publiee: true }, true)).toBe(true);
    expect(pilierVisible({ slug: "inexistant", page_publiee: true }, true)).toBe(false);
  });

  it("contenu vérifié : sans marqueur et avec tous les volumes horaires", () => {
    expect(contenuVerifie(ssiap1)).toBe(true);
    const brouillon: typeof ssiap1 = JSON.parse(JSON.stringify(ssiap1));
    brouillon.definition += " [à vérifier]";
    expect(contenuVerifie(brouillon)).toBe(false);
    brouillon.definition = ssiap1.definition;
    brouillon.programme.modules[0].volume = undefined;
    expect(contenuVerifie(brouillon)).toBe(false);
  });

  it("les 13 titres du référentiel sont rédigés et vérifiés", () => {
    const slugs = Object.keys(PILIERS);
    expect(slugs).toHaveLength(13);
    for (const slug of slugs) expect(contenuVerifie(PILIERS[slug]), slug).toBe(true);
  });

  it("FAQ : aucune question posée à l'identique sur deux pages", () => {
    const questions = Object.values(PILIERS).flatMap((c) => c.faq.map((q) => q.question));
    expect(new Set(questions).size).toBe(questions.length);
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
