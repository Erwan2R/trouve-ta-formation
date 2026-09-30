import { describe, expect, it } from "vitest";
import { analyserCsv, domaine, empreinte, empreintesDe, estMessageriePersonnelle, lireCsv } from "./prospection";

const ENTETE = "nom_organisme;raison_sociale;siret;siren;site_web;email;titres_prepares;date_scraping";

describe("lireCsv", () => {
  it("gère le BOM, les CRLF et les « ; » entre guillemets", () => {
    expect(lireCsv('\uFEFFa;b\r\n"x ; y";"dit ""oui"""\r\n')).toEqual([
      ["a", "b"],
      ["x ; y", 'dit "oui"'],
    ]);
  });
});

describe("analyserCsv", () => {
  it("identifie par SIRET, sinon SIREN, et écarte les lignes sans identifiant", () => {
    const r = analyserCsv(
      [
        ENTETE,
        'A.F.C.;A.F.C.;504 980 970 00033;504980970;https://www.afc-idf.fr/;contact@afc-idf.fr;"TFP APS ; SSIAP 1";2026-09-01',
        "Sans siret;;;821798592;;jean.dupont@gmail.com;;",
        "83-629;;;;https://www.83-629.fr/;contact@83-629.fr;;",
      ].join("\r\n"),
    );
    if ("erreur" in r) throw new Error(r.erreur);
    expect(r.prospects.map((p) => p.identifiant)).toEqual(["50498097000033", "821798592"]);
    expect(r.prospects[0]).toMatchObject({ siren: "504980970", titres: "TFP APS ; SSIAP 1", scrape_le: "2026-09-01" });
    expect(r.sansIdentifiant).toBe(1);
    expect(r.emails).toBe(2);
    expect(r.emailsPersonnels).toBe(1);
  });

  it("refuse un fichier sans les colonnes attendues", () => {
    expect(analyserCsv("a;b\n1;2")).toHaveProperty("erreur");
  });
});

describe("exclusion", () => {
  it("compare des empreintes normalisées, jamais les valeurs", () => {
    expect(domaine("http://WWW.Adapsa.com/formations")).toBe("adapsa.com");
    expect(domaine("pas une url")).toBeNull();
    expect(estMessageriePersonnelle("x@Hotmail.fr")).toBe(true);
    expect(empreinte("email", " Contact@AFC.fr ")).toBe(empreinte("email", "contact@afc.fr"));
    expect(empreintesDe({ siret: null, siren: "504980970", email: null, site_web: "afc-idf.fr" })).toEqual([
      empreinte("siren", "504980970"),
      empreinte("domaine", "afc-idf.fr"),
    ]);
  });
});
