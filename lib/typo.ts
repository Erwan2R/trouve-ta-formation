/** Typographie française : espace insécable avant « ? : ; ! » et à l'intérieur des guillemets. */
export function fr(texte: string): string {
  return texte.replace(/ ([?:;!»])/g, " $1").replace(/« /g, "« ");
}
