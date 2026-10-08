import { describe, expect, it } from "vitest";
import { soumisAutorisationCnaps } from "./cnaps";

describe("soumisAutorisationCnaps", () => {
  it("seul un organisme qui ne prépare que des titres SSIAP en est exclu", () => {
    expect(soumisAutorisationCnaps(["ssiap-1", "recyclage-ssiap-1"])).toBe(false);
    expect(soumisAutorisationCnaps(["ssiap-1", "tfp-aps"])).toBe(true);
    expect(soumisAutorisationCnaps([])).toBe(true);
  });
});
