import { RANG_PALIER, type Palier } from "./completude";
import type { Tri } from "./filtres";

type Triable = { nom: string; palier: Palier; siege: { ville: string } | null };

/**
 * « Pertinence » (tri par défaut, jamais affiché sous ce nom) : palier Optimal, puis Correct, puis Basique
 * (UX dashboard §2 : l'Optimal est mis en avant dans le tri), puis nom pour un ordre stable.
 */
export function trier<T extends Triable>(organismes: T[], tri: Tri): T[] {
  const nom = (a: T, b: T) => a.nom.localeCompare(b.nom, "fr");
  return [...organismes].sort((a, b) =>
    tri === "alpha"
      ? nom(a, b)
      : tri === "ville"
        ? (a.siege?.ville ?? "").localeCompare(b.siege?.ville ?? "", "fr") || nom(a, b)
        : RANG_PALIER[b.palier] - RANG_PALIER[a.palier] || nom(a, b),
  );
}
