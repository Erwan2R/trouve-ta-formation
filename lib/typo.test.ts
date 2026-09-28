import { expect, it } from "vitest";
import { fr } from "./typo";

it("insère les espaces insécables françaises", () => {
  expect(fr("Quelle différence ? Voici : un « test » ; ok !")).toBe("Quelle différence ? Voici : un « test » ; ok !");
  expect(fr("http://exemple.fr")).toBe("http://exemple.fr");
});
