import { randomInt } from "node:crypto";

// Codes de récupération admin (UX Paramètres admin §2) : 10 codes XXXX-XXXX, sans caractères ambigus (0/O, 1/I).
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function genererCodes(n = 10): string[] {
  const bloc = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  return Array.from({ length: n }, () => `${bloc()}-${bloc()}`);
}

/** Saisie tolérante (minuscules, espaces, sans tiret) ramenée au format stocké ; null si ce n'est pas un code. */
export function normaliserCode(saisie: string): string | null {
  const c = saisie.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return c.length === 8 ? `${c.slice(0, 4)}-${c.slice(4)}` : null;
}
