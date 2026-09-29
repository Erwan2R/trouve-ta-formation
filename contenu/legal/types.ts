/** Page légale : sections à paragraphes. Tant qu'un marqueur [à compléter] reste, la mise en production est bloquée. */
export type PageLegale = {
  title: string;
  description: string;
  h1: string;
  maj: string;
  sections: { h2: string; paragraphes: string[] }[];
};
