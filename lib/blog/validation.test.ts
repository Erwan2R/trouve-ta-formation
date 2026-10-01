import { describe, expect, it } from "vitest";
import { liensInternes, lienValide, slugArticle, validerDocument } from "./validation";

const P = "https://x.supabase.co/storage/v1/object/public/blog/";
const texte = (t: string, href?: string) => ({
  type: "text",
  text: t,
  ...(href && { marks: [{ type: "link", attrs: { href } }] }),
});
const doc = (...content: unknown[]) => ({ type: "doc", content });

describe("validation du document d'article", () => {
  it("accepte un document conforme", () => {
    const d = doc(
      { type: "heading", attrs: { level: 2 }, content: [texte("Titre")] },
      {
        type: "paragraph",
        content: [
          texte("SSIAP 1", "/securite-privee/ssiap-1/"),
          texte(" source", "https://www.cnaps.interieur.gouv.fr/"),
        ],
      },
      { type: "image", attrs: { src: `${P}photo.webp`, alt: "Une carte professionnelle" } },
    );
    expect(validerDocument(d, P)).toEqual([]);
    expect(liensInternes(d as never)).toEqual(["/securite-privee/ssiap-1/"]);
  });

  it("refuse image sans alt ou étrangère, lien dangereux, H4, H3 orphelin, bloc inconnu", () => {
    expect(validerDocument(doc({ type: "image", attrs: { src: `${P}a.webp`, alt: " " } }), P)).toContain(
      "Chaque image doit avoir un texte alternatif.",
    );
    expect(
      validerDocument(doc({ type: "image", attrs: { src: "https://ailleurs.fr/a.png", alt: "a" } }), P),
    ).toHaveLength(1);
    expect(validerDocument(doc({ type: "paragraph", content: [texte("x", "javascript:alert(1)")] }), P)).toHaveLength(
      1,
    );
    expect(validerDocument(doc({ type: "heading", attrs: { level: 4 }, content: [] }), P)).toHaveLength(1);
    expect(validerDocument(doc({ type: "heading", attrs: { level: 3 }, content: [texte("a")] }), P)).toHaveLength(1);
    expect(validerDocument(doc({ type: "codeBlock" }), P)).toHaveLength(1);
    expect(validerDocument({ type: "paragraph" }, P)).toEqual(["Contenu illisible."]);
  });

  it("vérifie liens et slugs", () => {
    expect(lienValide("http://non-securise.fr")).toBe(false);
    expect(lienValide("/securite-privee/blog/")).toBe(true);
    expect(slugArticle("  Le métier d'agent : nuits & week-ends ")).toBe("le-metier-d-agent-nuits-week-ends");
  });
});
