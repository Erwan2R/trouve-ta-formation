import { NotFoundContent } from "@/components/public/NotFoundContent";
import { VERTICALES } from "@/lib/config/verticales";
import { getDemarches } from "@/lib/supabase/queries/demarches";

// Déclenché par notFound() dans le silo (slug inconnu, fiche retirée) : rendu dans le header/footer du silo.
// Raccourcis vers des pages visibles uniquement (jamais un lien 404 depuis une page 404).
export default async function NotFound() {
  const { listeVisible } = await getDemarches(VERTICALES["securite-privee"]);
  return (
    <NotFoundContent
      accueil={{ href: "/securite-privee/", libelle: "Accueil sécurité privée" }}
      raccourcis={[
        {
          href: "/securite-privee/organismes/",
          titre: "Organismes de formation",
          description: "Les organismes de formation à la sécurité privée référencés en Île-de-France.",
        },
        ...(listeVisible
          ? [
              {
                href: "/securite-privee/demarches/",
                titre: "Démarches CNAPS",
                description: "Autorisation préalable, carte professionnelle et renouvellement, étape par étape.",
              },
            ]
          : []),
      ]}
    />
  );
}
