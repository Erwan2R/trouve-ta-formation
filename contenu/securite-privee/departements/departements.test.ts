import { describe, expect, it } from "vitest";
import { SLUGS_RESERVES } from "@/lib/config/slugs-reserves";
import { sansMarqueur } from "../../marqueurs";
import { DEPARTEMENTS, departementVisible, motsBloc7 } from ".";

const seuil = { organismes: 3, palier_min: "correct" as const };
const dept = { slug: "seine-saint-denis", bloc7_valide: true };
const nonValide = { ...dept, bloc7_valide: false };

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
    expect(departementVisible({ slug: "inexistant", bloc7_valide: true }, 10, seuil, false)).toBe(false);
  });

  it("les 8 départements sont rédigés, sans marqueur", () => {
    expect(Object.keys(DEPARTEMENTS)).toHaveLength(8);
    for (const [slug, c] of Object.entries(DEPARTEMENTS)) expect(sansMarqueur(c), slug).toBe(true);
  });

  it("production : seuil atteint ET bloc 7 validé, quel que soit le nombre de mots", () => {
    expect(departementVisible(nonValide, 10, seuil, true)).toBe(false);
    expect(departementVisible(nonValide, 10, seuil, false)).toBe(true); // aperçu hors production
    expect(departementVisible(dept, 2, seuil, true)).toBe(false);
    expect(motsBloc7(DEPARTEMENTS[dept.slug])).toBeGreaterThan(0); // compteur indicatif
  });

  it("aucune phrase du bloc 7 n'apparaît sur deux départements", () => {
    const vues = new Map<string, string>();
    for (const [slug, c] of Object.entries(DEPARTEMENTS))
      for (const phrase of c.seFormer.flatMap((s) => s.paragraphes).flatMap((p) => p.split(/(?<=[.!?])\s+/))) {
        const deja = vues.get(phrase);
        expect(deja === undefined || deja === slug, `« ${phrase} » : ${deja} et ${slug}`).toBe(true);
        vues.set(phrase, slug);
      }
  });

  it("aucun département sur un slug réservé", () => {
    for (const slug of Object.keys(DEPARTEMENTS)) expect(SLUGS_RESERVES).not.toContain(slug);
  });
});
