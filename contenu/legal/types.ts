/** Page légale : sections à paragraphes. Tant qu'un marqueur [à compléter] reste, la mise en production est bloquée. */
export type SectionLegale = {
  h2: string;
  paragraphes: string[];
  /** Liste à puces affichée après les paragraphes. */
  puces?: string[];
  /** Tableau affiché après les paragraphes (inventaire des cookies, durées de conservation). */
  tableau?: { entetes: string[]; lignes: string[][] };
  /** Bouton « Modifier mes choix » (page Cookies). */
  preferences?: boolean;
};

export type PageLegale = {
  title: string;
  description: string;
  h1: string;
  maj: string;
  sections: SectionLegale[];
};
