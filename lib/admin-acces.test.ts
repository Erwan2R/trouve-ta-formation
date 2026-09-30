import { describe, expect, it } from "vitest";
import { etatAdmin, redirectionAdmin } from "./admin-acces";

const maintenant = Date.UTC(2026, 9, 1, 12);
const il_y_a = (h: number) => Math.floor((maintenant - h * 3600 * 1000) / 1000);
const base = { connecte: true, estAdmin: true, facteurVerifie: true, maintenant };
const jeton = (aal: string, heures = 1) => ({ aal, amr: [{ method: "password", timestamp: il_y_a(heures) }] });

describe("etatAdmin", () => {
  it("exige l'administrateur, le second facteur et une session de moins de 8 heures", () => {
    expect(etatAdmin({ ...base, connecte: false, jeton: null })).toBe("anonyme");
    expect(etatAdmin({ ...base, estAdmin: false, jeton: jeton("aal2") })).toBe("refuse");
    expect(etatAdmin({ ...base, jeton: jeton("aal2", 8.1) })).toBe("expire");
    expect(etatAdmin({ ...base, jeton: { aal: "aal2", amr: [] } })).toBe("expire");
    expect(etatAdmin({ ...base, facteurVerifie: false, jeton: jeton("aal1") })).toBe("a-configurer");
    expect(etatAdmin({ ...base, jeton: jeton("aal1") })).toBe("a-verifier");
    expect(etatAdmin({ ...base, jeton: jeton("aal2", 7.9) })).toBe("ok");
  });
});

describe("redirectionAdmin", () => {
  it("n'ouvre que la page utile à chaque étape", () => {
    expect(redirectionAdmin("anonyme", "/dashboard/")).toBe("/connexion/");
    expect(redirectionAdmin("anonyme", "/connexion/")).toBeNull();
    expect(redirectionAdmin("expire", "/dashboard/")).toBe("/connexion/?erreur=expire");
    expect(redirectionAdmin("a-configurer", "/organismes/")).toBe("/parametres/");
    expect(redirectionAdmin("a-configurer", "/parametres/")).toBeNull();
    expect(redirectionAdmin("a-verifier", "/parametres/")).toBe("/verification/");
    expect(redirectionAdmin("ok", "/connexion/")).toBe("/dashboard/");
    expect(redirectionAdmin("ok", "/organismes/")).toBeNull();
    expect(redirectionAdmin("anonyme", "/auth/verifier/")).toBeNull();
  });
});

describe("codes de récupération", async () => {
  const { genererCodes, normaliserCode } = await import("./codes-recuperation");
  it("génère 10 codes distincts au format XXXX-XXXX et relit une saisie approximative", () => {
    const codes = genererCodes();
    expect(new Set(codes).size).toBe(10);
    codes.forEach((c) => expect(c).toMatch(/^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/));
    expect(normaliserCode(" abcd efgh ")).toBe("ABCD-EFGH");
    expect(normaliserCode("ABCD-EFG")).toBeNull();
  });
});
