import { describe, expect, it } from "vitest";
import { estSlugReserve } from "@/lib/config/slugs-reserves";
import { buildMetadata } from "./metadata";
import { breadcrumbJsonLd } from "./json-ld";

describe("seo", () => {
  it("canonical pointe vers la version nue pour une page filtrée en noindex", () => {
    const m = buildMetadata({
      title: "t",
      description: "d",
      path: "/securite-privee/organismes/?titre=ssiap-1",
      canonicalPath: "/securite-privee/organismes/",
      noindex: true,
    });
    expect(m.alternates?.canonical).toBe("http://localhost:3000/securite-privee/organismes/");
    expect(m.robots).toEqual({ index: false, follow: true });
  });

  it("page indexable : pas de directive robots", () => {
    expect(buildMetadata({ title: "t", description: "d", path: "/" }).robots).toBeUndefined();
  });

  it("fil d'Ariane numéroté à partir de 1 avec URLs absolues", () => {
    const b = breadcrumbJsonLd([{ name: "Accueil", path: "/securite-privee/" }]);
    expect(b.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Accueil", item: "http://localhost:3000/securite-privee/" },
    ]);
  });

  it("slugs réservés", () => {
    expect(estSlugReserve("organismes")).toBe(true);
    expect(estSlugReserve("ssiap-1")).toBe(false);
  });
});
