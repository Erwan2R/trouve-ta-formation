import { Squelettes } from "@/components/public/catalogue/ListingCatalogue";

/**
 * État « chargement » du catalogue : squelettes de cartes (UX catalogue §7).
 * Limité au groupe (catalogue) : placé au-dessus de [slug], il ferait répondre 200 aux fiches inexistantes
 * (le flux part avant le notFound()).
 */
export default function Chargement() {
  return (
    <main className="container-public py-12">
      <Squelettes />
    </main>
  );
}
