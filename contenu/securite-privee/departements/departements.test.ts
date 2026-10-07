import { describe, expect, it } from "vitest";
import { SLUGS_RESERVES } from "@/lib/config/slugs-reserves";
import { sansMarqueur } from "../../marqueurs";
import { DEPARTEMENTS, departementVisible } from ".";

const seuil = { organismes: 3, palier_min: "correct" as const };
const dept = { slug: "seine-saint-denis" };

describe("departementVisible", () => {
  it("sous le seuil : pas de page en production, aperçu hors production", () => {
    expect(departementVisible(dept, 2, seuil, true)).toBe(false);
    expect(departementVisible(dept, 0, seuil, false)).toBe(true);
  });

  it("au seuil : page visible, en production comme en aperçu", () => {
    expect(departementVisible(dept, 3, seuil, false)).toBe(true);
    expect(departementVisible(dept, 3, seuil, true)).toBe(true);
  });

  it("sans contenu rédigé : pas de page", () => {
    expect(departementVisible({ slug: "inexistant" }, 10, seuil, false)).toBe(false);
  });

  it("les 8 départements : rédigés, sans marqueur, au moins 300 mots propres au bloc 7", () => {
    expect(Object.keys(DEPARTEMENTS)).toHaveLength(8);
    for (const [slug, c] of Object.entries(DEPARTEMENTS)) {
      expect(sansMarqueur(c), slug).toBe(true);
      const mots = c.seFormer
        .flatMap((s) => s.paragraphes)
        .join(" ")
        .split(/\s+/).length;
      expect(mots, slug).toBeGreaterThanOrEqual(300);
    }
  });

  it("aucun département sur un slug réservé", () => {
    for (const slug of Object.keys(DEPARTEMENTS)) expect(SLUGS_RESERVES).not.toContain(slug);
  });
});
