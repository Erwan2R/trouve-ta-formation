/**
 * Contenu rédigé d'une page département (Copy_Pages_Geographiques.md §5, §9, §12, §13).
 * « Pas de 300 mots spécifiques, pas de page » : sans ce contenu (vérifié), la page n'existe pas.
 * Les mentions de disponibilité des titres ne sont jamais écrites ici : elles sont calculées depuis l'inventaire.
 */
export type ContenuDepartement = {
  /** Chapô, bloc 3 : l'angle du département (≈ 150 mots avec la phrase de disponibilité générée). */
  chapo: string[];
  /** Bloc 7 « Se former à la sécurité privée [prép.] [Département] » : H3 libres, ≥ 300 mots au total. */
  seFormer: {
    h3: string;
    paragraphes: string[];
    /** Lien vers la page d’un titre (slug), affiché seulement si cette page est publiée. */
    lienTitre?: string;
  }[];
  /** Réponse à « Comment se rendre dans les centres de formation [prép.] [Département] ? » (FAQ, rédigée). */
  acces: string;
  /** Libellé court de l'ancre du sommaire (« Se former dans le 93 »). */
  ancreSeFormer?: string;
};
