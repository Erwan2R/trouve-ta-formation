import { describe, expect, it } from "vitest";
import type { Organisme } from "@/lib/supabase/queries/organismes";
import { faqFiche, listeFr, metaFiche } from "./fiche";

const lieu = (ville: string, cp: string, est_siege = false) => ({
  id: Math.random(),
  nom: null,
  adresse: "1 rue X",
  code_postal: cp,
  ville,
  est_siege,
  departement: cp.slice(0, 2),
});
const offre = (court: string) =>
  ({ titre: { slug: court, libelle_court: court, libelle_long: court, ordre: 1 } }) as Organisme["offres"][number];

const base = {
  nom: "Centre Démo",
  siege: lieu("Bobigny", "93000", true),
  lieux: [lieu("Bobigny", "93000", true)],
  offres: [] as Organisme["offres"],
  financements: [] as string[],
  presentation: null,
  numero_agrement_cnaps: null,
} as unknown as Organisme;

describe("fiche organisme", () => {
  it("listeFr", () => {
    expect(listeFr(["a"])).toBe("a");
    expect(listeFr(["a", "b", "c"])).toBe("a, b et c");
  });

  it("meta description : repli sans formation ne mentionne aucun manque", () => {
    const m = metaFiche(base);
    expect(m.title).toBe("Centre Démo — Formation sécurité privée à Bobigny");
    expect(m.description).toBe(
      "Centre Démo, organisme de formation à la sécurité privée à Bobigny (93). Coordonnées, lieux de formation et informations pratiques.",
    );
  });

  it("meta description : 3 titres max, ordre du référentiel, financements", () => {
    const o = { ...base, offres: ["TFP APS", "MAC APS", "SSIAP 1", "SSIAP 2"].map(offre), financements: ["cpf"] };
    expect(metaFiche(o).description).toBe(
      "Centre Démo forme au TFP APS, au MAC APS et au SSIAP 1 à Bobigny (93). Financements acceptés : CPF. Coordonnées, lieux de formation et informations pratiques.",
    );
  });

  it("title tronqué au-delà de 40 caractères", () => {
    expect(metaFiche({ ...base, nom: "X".repeat(41) }).title).toBe(`${"X".repeat(41)} — Formation sécurité privée`);
  });

  it("FAQ : variante agrément non renseigné, pas de question formations sans formation", () => {
    const faq = faqFiche(base);
    expect(faq.map((q) => q.question)).toEqual([
      "Centre Démo est-il agréé par le CNAPS ?",
      "Où se déroulent les formations de Centre Démo ?",
    ]);
    expect(faq[0].reponse).toMatch(/^Le numéro d'agrément de cet organisme n'est pas renseigné/);
    expect(faqFiche({ ...base, offres: [offre("Recyclage SSIAP 1")] })[0].reponse).toMatch(
      /^Centre Démo prépare au recyclage SSIAP 1\./,
    );
  });
});
