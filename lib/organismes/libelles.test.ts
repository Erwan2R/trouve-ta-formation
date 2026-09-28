import { expect, it } from "vitest";
import { monogramme, prix } from "./libelles";

it("prix : valeur, fourchette, absence", () => {
  expect(prix(1490, null)).toBe("1 490 €");
  expect(prix(390, 450)).toBe("390 € – 450 €");
  expect(prix(null, null)).toBeNull();
});

it("monogramme", () => {
  expect(monogramme("Académie Française de Sécurité")).toBe("AF");
  expect(monogramme("formasûr")).toBe("FO");
});
