import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
process.env.SUPABASE_SERVICE_ROLE_KEY = "cle-de-test";
const { jetonDesabonnement, lireJetonDesabonnement } = await import("./desabonnement");

describe("lien de désabonnement", () => {
  it("n'accepte que le jeton signé de l'organisme, jamais un jeton modifié", () => {
    const id = "53d39358-9cdb-4c40-981a-63d4a8a3c0fb";
    const autre = "11111111-2222-3333-4444-555555555555";
    const jeton = jetonDesabonnement(id);
    expect(lireJetonDesabonnement(jeton)).toBe(id);
    expect(lireJetonDesabonnement(`${autre}.${jeton.split(".")[1]}`)).toBeNull();
    expect(lireJetonDesabonnement(`${id}.abc`)).toBeNull();
    expect(lireJetonDesabonnement(null)).toBeNull();
  });
});
