import { describe, expect, it } from "vitest";
import { SLUGS_RESERVES } from "@/lib/config/slugs-reserves";
import { DEPARTEMENTS, departementVisible } from ".";

const seuil = { organismes: 3, palier_min: "correct" as const };
const dept = { slug: "seine-saint-denis" };

describe("departementVisible", () => {
  it("sous le seuil : jamais de page, même hors production", () => {
    expect(departementVisible(dept, 2, seuil, false)).toBe(false);
    expect(departementVisible(dept, 0, seuil, true)).toBe(false);
  });

  it("au seuil : aperçu hors production, jamais en production tant que le contenu est un brouillon", () => {
    expect(departementVisible(dept, 3, seuil, false)).toBe(true);
    expect(departementVisible(dept, 3, seuil, true)).toBe(false);
  });

  it("sans contenu rédigé : pas de page", () => {
    expect(departementVisible({ slug: "yvelines" }, 10, seuil, false)).toBe(false);
  });

  it("aucun département sur un slug réservé", () => {
    for (const slug of Object.keys(DEPARTEMENTS)) expect(SLUGS_RESERVES).not.toContain(slug);
  });
});
