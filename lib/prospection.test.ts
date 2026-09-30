import { describe, expect, it } from "vitest";
import {
  analyserCsv,
  domaine,
  empreinte,
  empreintesDe,
  estMessageriePersonnelle,
  lireCsv,
  siretSansAmbiguite,
} from "./prospection";

describe("lireCsv", () => {
  it("gère le BOM, les CRLF et les « ; » entre guillemets", () => {
    expect(lireCsv('\uFEFFa;b\r\n"x ; y";"dit ""oui"""\r\n')).toEqual([
      ["a", "b"],
      ["x ; y", 'dit "oui"'],
    ]);
  });
});

describe("analyserCsv", () => {
  it("identifie par SIRET, sinon SIREN, garde les lignes sans SIRET qui ont un contact", () => {
    const r = analyserCsv(
      [
        "nom_organisme;raison_sociale;siret;siren;sites;site_web;email;telephone;titres_prepares;date_scraping",
        'A.F.C.;A.F.C.;504 980 970 00033;504980970;"24 bd Vaillant 94200 Ivry";https://www.afc-idf.fr/;contact@afc-idf.fr;;"TFP APS ; SSIAP 1";2026-09-01',
        "Sans siret;;;821798592;;;jean.dupont@gmail.com;;;",
        "83-629;;;;66 Av. des Champs-Élysées, 75008 Paris;https://www.83-629.fr/;contact@83-629.fr;01 89 47 00 14;;",
        "83-629 bis;;;;;https://83-629.fr;;;;",
        "Sans rien;;;;;;;;;",
      ].join("\r\n"),
    );
    if ("erreur" in r) throw new Error(r.erreur);
    expect(r.prospects.map((p) => p.identifiant)).toEqual(["50498097000033", "821798592", null]);
    expect(r.prospects[0]).toMatchObject({ siren: "504980970", titres: "TFP APS ; SSIAP 1", scrape_le: "2026-09-01" });
    expect(r.prospects[2]).toMatchObject({ siret: null, siren: null, codePostal: "75008" });
    expect(r.ignorees).toBe(1); // « Sans rien » ; « 83-629 bis » est un doublon (même domaine)
    expect(r.emails).toBe(3);
    expect(r.emailsPersonnels).toBe(1);
  });

  it("refuse un fichier sans les colonnes attendues", () => {
    expect(analyserCsv("a;b\n1;2")).toHaveProperty("erreur");
  });
});

describe("siretSansAmbiguite", () => {
  const entreprise = (etabs: { siret: string; code_postal: string; etat_administratif: string }[]) => ({
    siren: "753659978",
    nom_complet: "MICKAEL MINGEAU (83-629)",
    matching_etablissements: etabs,
  });
  const actif = { siret: "75365997800039", code_postal: "75008", etat_administratif: "A" };
  it("n'accepte qu'une seule entreprise, un seul établissement actif au code postal, et un nom concordant", () => {
    expect(siretSansAmbiguite({ total_results: 1, results: [entreprise([actif])] }, "83-629", "75008")).toBe(
      "75365997800039",
    );
    expect(
      siretSansAmbiguite({ total_results: 2, results: [entreprise([actif]), entreprise([actif])] }, "83-629", "75008"),
    ).toBeNull();
    expect(
      siretSansAmbiguite(
        { total_results: 1, results: [entreprise([actif, { ...actif, siret: "75365997800047" }])] },
        "83-629",
        "75008",
      ),
    ).toBeNull();
    expect(
      siretSansAmbiguite(
        { total_results: 1, results: [entreprise([{ ...actif, etat_administratif: "F" }])] },
        "83-629",
        "75008",
      ),
    ).toBeNull();
    expect(
      siretSansAmbiguite({ total_results: 1, results: [entreprise([actif])] }, "Sécurité Plus", "75008"),
    ).toBeNull();
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
