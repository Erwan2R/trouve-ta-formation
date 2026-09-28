import { describe, expect, it } from "vitest";
import type { Organisme } from "@/lib/supabase/queries/organismes";
import { disponibilites, organismesDuDepartement, villesDuDepartement } from "./departement";

const lieu = (id: number, ville: string, cp: string, est_siege = false) => ({
  id,
  nom: null,
  adresse: "x",
  code_postal: cp,
  ville,
  est_siege,
  departement: cp.slice(0, 2),
});
const org = (lieux: ReturnType<typeof lieu>[], offres: { slug: string; lieux?: number[] }[]) =>
  ({
    lieux,
    siege: lieux.find((l) => l.est_siege) ?? lieux[0],
    offres: offres.map((x) => ({
      titre: { slug: x.slug },
      lieux: lieux.filter((l) => x.lieux?.includes(l.id)),
    })),
  }) as unknown as Organisme;

// Siège à Paris, dispense le SSIAP 1 à Bobigny (93) ; TFP APS au siège.
const parisien = org(
  [lieu(1, "Paris", "75011", true), lieu(2, "Bobigny", "93000")],
  [{ slug: "ssiap-1", lieux: [2] }, { slug: "tfp-aps" }],
);
const montreuil = org([lieu(3, "Montreuil", "93100", true)], [{ slug: "ssiap-1" }]);

describe("page département", () => {
  it("rattachement par lieu, pas seulement le siège", () => {
    expect(organismesDuDepartement([parisien, montreuil], "93")).toHaveLength(2);
  });

  it("disponibilité locale selon le lieu de l'offre ; absent → voisin qui le propose", () => {
    const [ssiap1, tfpAps] = disponibilites([parisien, montreuil], "93", ["ssiap-1", "tfp-aps"]);
    expect(ssiap1).toMatchObject({ nombre: 2, villes: ["Bobigny", "Montreuil"], voisin: null });
    expect(tfpAps).toMatchObject({ nombre: 0, voisin: "75" }); // dispensé au siège parisien seulement
  });

  it("titre absent partout alentour : pas de voisin", () => {
    expect(disponibilites([parisien], "93", ["ssiap-3"])[0].voisin).toBeNull();
  });

  it("villes : décroissant avec compteurs, alphabétique sinon", () => {
    const orgs = [parisien, montreuil, org([lieu(4, "Montreuil", "93100", true)], [])];
    expect(villesDuDepartement(orgs, "93", true).map((v) => v.ville)).toEqual(["Montreuil", "Bobigny"]);
    expect(villesDuDepartement(orgs, "93", false).map((v) => v.ville)).toEqual(["Bobigny", "Montreuil"]);
  });
});
