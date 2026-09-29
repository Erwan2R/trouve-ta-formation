import "server-only";
import type { LieuVue, OffreVue, TitreModale } from "@/components/espace/MesFormations";
import { absoluteUrl } from "@/lib/seo/metadata";
import { getEspace } from "@/lib/supabase/queries/espace";
import { getTousLesTitres, getTitresParCategorie } from "@/lib/supabase/queries/referentiel";

type TitreBrut = { id: number; slug: string; libelle_court: string; libelle_long: string; categorie: string };

/** Données de « Mes formations », partagées avec l'étape 5 de l'accompagnement à l'inscription. */
export async function donneesFormations(): Promise<{
  groupes: { categorie: string; titres: TitreModale[] }[];
  lieux: LieuVue[];
  offres: OffreVue[];
}> {
  const [{ offres, lieux }, groupes, tous] = await Promise.all([
    getEspace(),
    getTitresParCategorie(),
    getTousLesTitres(),
  ]);
  const pages = new Map(tous.map((t) => [t.id, t]));
  const titre = (t: TitreBrut): TitreModale => ({
    id: t.id,
    slug: t.slug,
    court: t.libelle_court,
    long: t.libelle_long,
    categorie: t.categorie,
    duree: pages.get(t.id)?.duree ?? null,
  });
  return {
    groupes: groupes.map((g) => ({ categorie: g.categorie, titres: g.titres.map(titre) })),
    lieux: lieux.map((l) => ({
      id: l.id,
      nom: l.est_siege ? `Siège · ${l.ville}` : l.nom || l.ville,
      adresse: `${l.adresse}, ${l.code_postal} ${l.ville}`,
    })),
    offres: offres.map((o) => ({
      id: o.id,
      titre: {
        ...titre(o.titre),
        archive: o.titre.statut !== "actif",
        // Lien vers la page pilier seulement si elle est publiée (jamais vers une 404).
        lienPage: pages.get(o.titre.id)?.a_une_page ? absoluteUrl(`/securite-privee/${o.titre.slug}/`) : null,
      },
      prixMin: o.prix_min,
      prixMax: o.prix_max,
      duree: o.duree_heures,
      rythmes: o.rythmes,
      financements: o.financements,
      lieux: o.lieux,
    })),
  };
}
