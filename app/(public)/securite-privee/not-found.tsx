import { NotFoundContent } from "@/components/public/NotFoundContent";

// Déclenché par notFound() dans le silo (slug inconnu, fiche retirée) : rendu dans le header/footer du silo.
export default function NotFound() {
  return (
    <NotFoundContent
      accueil={{ href: "/securite-privee/", libelle: "Accueil sécurité privée" }}
      raccourcis={[
        {
          href: "/securite-privee/organismes/",
          titre: "Organismes de formation",
          description: "Tous les organismes agréés par le CNAPS en Île-de-France, titre par titre.",
        },
        {
          href: "/securite-privee/demarches/",
          titre: "Démarches CNAPS",
          description: "Autorisation préalable, carte professionnelle et renouvellement, étape par étape.",
        },
      ]}
    />
  );
}
