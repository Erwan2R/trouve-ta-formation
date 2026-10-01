import { getEspace } from "@/lib/supabase/queries/espace";

/**
 * Droit à la portabilité (RGPD art. 20) : toutes les données du compte et de la fiche, en JSON. Lecture sous la session
 * de l'organisme (RLS propriétaire) ; sans session, getEspace redirige vers la connexion.
 */
export async function GET() {
  const { user, compte, organisme, lieux, offres } = await getEspace();
  const { est_test: _test, palier_max: _palier, ...fiche } = organisme;
  const contenu = {
    exporte_le: new Date().toISOString(),
    compte: { email: user.email, ...compte },
    fiche,
    lieux: lieux.map(({ departement: _d, ...l }) => l),
    formations: offres.map(({ titre, ...o }) => ({ ...o, titre: titre.libelle_long })),
  };
  return new Response(JSON.stringify(contenu, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="trouve-ta-formation-${organisme.slug}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
