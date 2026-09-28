import { describe, expect, it } from "vitest";
import { redirectionsArchivage, resoudrePilier } from "./resolution-pilier";

const t = (id: number, slug: string, o: Partial<Parameters<typeof resoudrePilier>[1][number]> = {}) => ({
  id,
  slug,
  statut: "actif" as "actif" | "archive",
  a_une_page: true,
  archive_le: null,
  remplace_par_id: null,
  titre_proche_id: null,
  ...o,
});

describe("resoudrePilier", () => {
  const nouveau = t(2, "nouveau");
  const proche = t(3, "proche");
  const sansPage = t(4, "sans-page", { a_une_page: false });

  it("titre actif avec page → page ; sans page ou inconnu → null", () => {
    expect(resoudrePilier("nouveau", [nouveau])).toMatchObject({ type: "page", archive: null });
    expect(resoudrePilier("sans-page", [sansPage])).toBeNull();
    expect(resoudrePilier("inconnu", [nouveau])).toBeNull();
  });

  it("archivé remplacé → redirection vers le remplaçant", () => {
    const ancien = t(1, "ancien", { statut: "archive", archive_le: "2027-01-01", remplace_par_id: 2 });
    expect(resoudrePilier("ancien", [ancien, nouveau])).toEqual({ type: "redirection", vers: nouveau });
  });

  it("archivé non remplacé → page avec mention et titre proche", () => {
    const ancien = t(1, "ancien", { statut: "archive", archive_le: "2027-01-01", titre_proche_id: 3 });
    expect(resoudrePilier("ancien", [ancien, proche])).toMatchObject({
      type: "page",
      archive: { depuis: "2027-01-01", proche },
    });
  });

  it("remplaçant sans page → pas de redirection vers une 404, la page archivée reste", () => {
    const ancien = t(1, "ancien", { statut: "archive", archive_le: "2027-01-01", remplace_par_id: 4 });
    expect(resoudrePilier("ancien", [ancien, sansPage])).toMatchObject({ type: "page", archive: { proche: null } });
  });
});

describe("pas de chaîne de redirections", () => {
  it("suit « remplacé par » jusqu'au titre actif final", () => {
    const a = t(1, "a", { statut: "archive", archive_le: "2026-01-01", remplace_par_id: 2 });
    const b = t(2, "b", { statut: "archive", archive_le: "2027-01-01", remplace_par_id: 3 });
    const c = t(3, "c");
    expect(resoudrePilier("a", [a, b, c])).toEqual({ type: "redirection", vers: c });
    expect(redirectionsArchivage("securite-privee", [a, b, c])).toEqual([
      { source: "/securite-privee/a/", destination: "/securite-privee/c/", statusCode: 301 },
      { source: "/securite-privee/b/", destination: "/securite-privee/c/", statusCode: 301 },
    ]);
  });

  it("boucle → aucune redirection", () => {
    const a = t(1, "a", { statut: "archive", archive_le: "2026-01-01", remplace_par_id: 2 });
    const b = t(2, "b", { statut: "archive", archive_le: "2026-01-01", remplace_par_id: 1 });
    expect(redirectionsArchivage("securite-privee", [a, b])).toEqual([]);
  });

  it("le titre proche doit être actif", () => {
    const archiveProche = t(3, "proche-archive", { statut: "archive", archive_le: "2026-01-01" });
    const a = t(1, "a", { statut: "archive", archive_le: "2026-01-01", titre_proche_id: 3 });
    expect(resoudrePilier("a", [a, archiveProche])).toMatchObject({ archive: { proche: null } });
  });
});
