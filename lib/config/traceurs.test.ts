import { describe, expect, it } from "vitest";
import { COOKIE_CONSENTEMENT, ecrireConsentement, lireConsentement } from "./traceurs";

describe("consentement aux cookies", () => {
  it("relit le choix enregistré et ignore un cookie absent ou altéré", () => {
    const c = { mesure: false, publicite: true, le: "2026-10-01T10:00:00.000Z" };
    const ecrit = ecrireConsentement(c, true).split(";")[0];
    expect(lireConsentement(`autre=1; ${ecrit}`)).toEqual(c);
    expect(ecrireConsentement(c, true)).toContain("Max-Age=15724800");
    expect(lireConsentement("autre=1")).toBeNull();
    expect(lireConsentement(`${COOKIE_CONSENTEMENT}=pas-du-json`)).toBeNull();
    expect(lireConsentement(`${COOKIE_CONSENTEMENT}=${encodeURIComponent('{"mesure":"oui"}')}`)).toBeNull();
  });
});
