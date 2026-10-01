import { describe, expect, it } from "vitest";
import { ancres, compterMots, type Noeud, problemesHierarchie } from "./document";

const p = (t: string): Noeud => ({ type: "paragraph", content: [{ type: "text", text: t }] });
const h = (level: 2 | 3, t: string): Noeud => ({
  type: "heading",
  attrs: { level },
  content: [{ type: "text", text: t }],
});

describe("document d'article", () => {
  it("compte les mots de tous les blocs, sans les ponctuations isolées", () => {
    const doc: Noeud = {
      type: "doc",
      content: [
        p("Un agent travaille — souvent la nuit."),
        h(2, "Les horaires"),
        {
          type: "bulletList",
          content: [
            { type: "listItem", content: [p("Nuit")] },
            { type: "listItem", content: [p("Week-end")] },
          ],
        },
      ],
    };
    expect(compterMots(doc)).toBe(10);
  });

  it("produit des ancres uniques et sans accent, et repère un H3 orphelin", () => {
    const doc: Noeud = {
      type: "doc",
      content: [h(3, "Avant"), h(2, "Les horaires d'été"), h(2, "Les horaires d'été")],
    };
    expect(ancres(doc).map((a) => a.id)).toEqual(["avant", "les-horaires-d-ete", "les-horaires-d-ete-2"]);
    expect(problemesHierarchie(doc)).toHaveLength(1);
    expect(problemesHierarchie({ type: "doc", content: [h(2, "A"), h(3, "B")] })).toEqual([]);
  });
});
