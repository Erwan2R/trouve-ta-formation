import { describe, expect, it } from "vitest";
import { cumul, instantanes, lirePeriode, parTranche, tranches } from "./analytics";

const J = 86_400_000;
const maintenant = Date.UTC(2026, 9, 1, 12);

describe("analytics", () => {
  it("découpe par jour sur 7 et 30 jours, par semaine au-delà", () => {
    expect(lirePeriode(undefined)).toBe("30");
    expect(tranches("7", maintenant, 0).liste).toHaveLength(7);
    expect(tranches("30", maintenant, 0).liste).toHaveLength(30);
    expect(tranches("90", maintenant, 0).liste).toHaveLength(13);
    expect(tranches("tout", maintenant, maintenant - 20 * J).liste).toHaveLength(3);
  });

  it("cumule, compte par tranche et reprend le dernier instantané", () => {
    const { debut, liste } = tranches("7", maintenant, 0);
    const dates = [maintenant - 10 * J, maintenant - 3 * J, maintenant - J / 2];
    expect(cumul(dates, liste)).toEqual([1, 1, 1, 2, 2, 2, 3]);
    expect(parTranche(dates, liste, debut)).toEqual([0, 0, 0, 1, 0, 0, 1]);
    const vide = { jour: "", n: 0 };
    const s = instantanes([{ jour: "2026-09-29", n: 4 }], liste, vide);
    expect(s.map((x) => x.n)).toEqual([0, 0, 0, 0, 4, 4, 4]);
  });
});
