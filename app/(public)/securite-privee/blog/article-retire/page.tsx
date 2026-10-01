import type { Metadata } from "next";
import Link from "next/link";
import { NotFoundContent } from "@/components/public/NotFoundContent";
import { getTitres } from "@/lib/supabase/queries/referentiel";

export const metadata: Metadata = { title: "Article retiré", robots: { index: false, follow: true } };

// Article dépublié sans page de remplacement : servi en 410 par le middleware (texte validé par Erwan, 01/10/2026).
// « Les pages consacrées aux formations » : lien vers la grille des titres, seulement si au moins une page existe.
export default async function ArticleRetire() {
  const formations = (await getTitres()).some((t) => t.a_une_page);
  return (
    <NotFoundContent
      titre="Cet article n'est plus disponible"
      texte={
        <>
          Il a été retiré du blog. Les autres articles et{" "}
          {formations ? (
            <Link href="/securite-privee/#formations" className="font-semibold">
              les pages consacrées aux formations
            </Link>
          ) : (
            "les pages consacrées aux formations"
          )}{" "}
          restent accessibles.
        </>
      }
      action={{ href: "/securite-privee/blog/", libelle: "Voir les articles du blog" }}
      sorties={[]}
    />
  );
}
