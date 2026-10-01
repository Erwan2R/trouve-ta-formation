import type { Metadata } from "next";
import { NotFoundContent } from "@/components/public/NotFoundContent";

export const metadata: Metadata = { title: "Article retiré", robots: { index: false, follow: true } };

// Article dépublié sans page de remplacement : servi en 410 par le middleware (décision Erwan 01/10/2026).
// Texte rédigé par Claude, à valider.
export default function ArticleRetire() {
  return (
    <NotFoundContent
      surtitre="Article retiré"
      titre="Cet article n'est plus disponible"
      texte="Il a été retiré du blog. Les autres articles et les pages consacrées aux formations restent accessibles."
      accueil={{ href: "/securite-privee/blog/", libelle: "Voir les articles du blog" }}
      raccourcis={[]}
    />
  );
}
