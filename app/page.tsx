import { buildMetadata } from "@/lib/seo/metadata";

// Contenu réel au Sprint 1 (UX_404_Racine_Domaine.md).
export const metadata = buildMetadata({
  title: "Trouve ta formation",
  description: "Annuaire indépendant des formations professionnelles.",
  path: "/",
});

export default function Home() {
  return (
    <main>
      <h1>Trouve ta formation</h1>
      <a href="/securite-privee/">Sécurité privée</a>
    </main>
  );
}
