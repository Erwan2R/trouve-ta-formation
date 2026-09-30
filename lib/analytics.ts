// Analytics admin (UX Analytics §2) : périodes 7 / 30 / 90 jours / tout, 30 jours par défaut.
// 7 et 30 jours : un point par jour ; 90 jours et tout : un point par semaine (maquette « Analytics Admin »).

export type Periode = "7" | "30" | "90" | "tout";
export const PERIODES: [Periode, string][] = [
  ["7", "7 jours"],
  ["30", "30 jours"],
  ["90", "90 jours"],
  ["tout", "Tout"],
];
export const lirePeriode = (p: string | undefined): Periode => (p === "7" || p === "90" || p === "tout" ? p : "30");

const JOUR = 86_400_000;
export type Tranche = { fin: number; libelle: string };

const libelleJour = (t: number) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" }).format(t);

/** Tranches de la période, de la plus ancienne à la plus récente ; `ouverture` borne « tout ». */
export function tranches(periode: Periode, maintenant: number, ouverture: number): { debut: number; liste: Tranche[] } {
  const pas = periode === "7" || periode === "30" ? JOUR : 7 * JOUR;
  const jours = periode === "tout" ? Math.max(7, Math.ceil((maintenant - ouverture) / JOUR)) : Number(periode);
  const n = Math.max(2, Math.ceil((jours * JOUR) / pas));
  const liste = Array.from({ length: n }, (_, i) => {
    const fin = maintenant - (n - 1 - i) * pas;
    return { fin, libelle: libelleJour(fin) };
  });
  return { debut: liste[0].fin - pas, liste };
}

/** Nombre d'éléments créés au plus tard à la fin de chaque tranche (courbe cumulée). */
export const cumul = (dates: number[], t: Tranche[]) => t.map((x) => dates.filter((d) => d <= x.fin).length);

/** Nombre d'éléments dans chaque tranche (courbe de trafic). */
export function parTranche(dates: number[], t: Tranche[], debut: number) {
  return t.map((x, i) => {
    const depuis = i === 0 ? debut : t[i - 1].fin;
    return dates.filter((d) => d > depuis && d <= x.fin).length;
  });
}

/** Dernier instantané connu à la fin de chaque tranche (0 avant le premier). */
export function instantanes<T extends { jour: string }>(lignes: T[], t: Tranche[], vide: T): T[] {
  const tries = [...lignes].sort((a, b) => a.jour.localeCompare(b.jour));
  return t.map((x) => {
    const jour = new Date(x.fin).toISOString().slice(0, 10);
    return tries.filter((l) => l.jour <= jour).at(-1) ?? vide;
  });
}
