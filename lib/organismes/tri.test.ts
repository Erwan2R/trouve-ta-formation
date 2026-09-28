import { expect, it } from "vitest";
import { trier } from "./tri";

const o = (nom: string, palier: "basique" | "correct" | "optimal", ville = "Paris") => ({
  nom,
  palier,
  siege: { ville },
});

it("Pertinence : Optimal devant Correct devant Basique, puis ordre alphabétique", () => {
  const liste = [o("Alpha", "basique"), o("Bravo", "correct"), o("Zoulou", "optimal"), o("Charlie", "correct")];
  expect(trier(liste, "pertinence").map((x) => x.nom)).toEqual(["Zoulou", "Bravo", "Charlie", "Alpha"]);
});

it("tri alphabétique et par ville", () => {
  const liste = [o("Bravo", "optimal", "Créteil"), o("Alpha", "basique", "Évry")];
  expect(trier(liste, "alpha").map((x) => x.nom)).toEqual(["Alpha", "Bravo"]);
  expect(trier(liste, "ville").map((x) => x.nom)).toEqual(["Bravo", "Alpha"]);
});
