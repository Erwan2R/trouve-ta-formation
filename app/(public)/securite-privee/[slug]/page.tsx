import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PageDepartement, metadataDepartement } from "@/components/public/departement/PageDepartement";
import { PagePilier, metadataPilier } from "@/components/public/pilier/PagePilier";
import { estSlugReserve } from "@/lib/config/slugs-reserves";
import { resoudrePilier } from "@/lib/resolution-pilier";
import { getDepartements, getTousLesTitres } from "@/lib/supabase/queries/referentiel";

type Props = { params: Promise<{ slug: string }> };

/**
 * Résolution de /securite-privee/[slug]/ (CLAUDE.md §6), dans cet ordre :
 * slug réservé → route dédiée (jamais ici) ; titre du référentiel → page pilier (ou redirection d'archive) ;
 * département ayant une page (seuil + contenu) → page géographique ; sinon 404.
 */
async function resoudre(slug: string) {
  if (estSlugReserve(slug)) return null;
  const pilier = resoudrePilier(slug, await getTousLesTitres());
  if (pilier) return pilier;
  const departement = (await getDepartements()).find((d) => d.slug === slug && d.a_une_page);
  return departement ? ({ type: "departement", departement } as const) : null;
}

export async function generateStaticParams() {
  const [titres, departements] = await Promise.all([getTousLesTitres(), getDepartements()]);
  return [
    ...titres.filter((t) => t.a_une_page).map((t) => ({ slug: t.slug })),
    ...departements.filter((d) => d.a_une_page).map((d) => ({ slug: d.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await resoudre((await params).slug);
  if (page?.type === "page") return metadataPilier(page.titre);
  if (page?.type === "departement") return metadataDepartement(page.departement);
  return {};
}

export default async function PageSlug({ params }: Props) {
  const page = await resoudre((await params).slug);
  if (!page) notFound();
  // Next.js : redirection permanente 308 ici en secours ; la 301 est générée au build (next.config.ts).
  if (page.type === "redirection") permanentRedirect(`/securite-privee/${page.vers.slug}/`);
  if (page.type === "departement") return <PageDepartement departement={page.departement} />;
  return <PagePilier titre={page.titre} archive={page.archive} />;
}
