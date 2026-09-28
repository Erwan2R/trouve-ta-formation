import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { TexteContenu } from "./TexteContenu";

it("rend le gras, les marqueurs et la typographie", () => {
  const html = renderToStaticMarkup(<TexteContenu texte="**Attention :** six mois [À VÉRIFIER] puis [à compléter]" />);
  expect(html).toBe(
    '<strong>Attention :</strong> six mois <span class="font-mono text-[12.5px] text-brique-700">[à vérifier]</span> puis <span class="font-mono text-[12.5px] text-brique-700">[à compléter]</span>',
  );
});
