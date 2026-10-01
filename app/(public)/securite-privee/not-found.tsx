import { NotFoundContent } from "@/components/public/NotFoundContent";
import { PAGE_404 } from "@/contenu/erreurs-racine";
import { VERTICALES } from "@/lib/config/verticales";
import { getDemarches } from "@/lib/supabase/queries/demarches";
import { getTitres } from "@/lib/supabase/queries/referentiel";

const verticale = VERTICALES["securite-privee"];
const base = `/${verticale.slug}/`;

// Déclenché par notFound() dans le silo, avec le header et le footer du silo (gabarit silo, Copy 404 §8).
// Une 404 du silo ne propose jamais de sortir du silo, et ne renvoie jamais vers une page absente.
export default async function NotFound() {
  const [titres, { demarches }] = await Promise.all([getTitres(), getDemarches(verticale)]);
  const S = PAGE_404.silo;
  return (
    <NotFoundContent
      sorties={[
        {
          titre: S.formations.titre,
          liens: S.formations.slugs.flatMap((slug) => {
            const t = titres.find((x) => x.slug === slug && x.a_une_page);
            return t ? [{ href: `${base}${t.slug}/`, libelle: t.libelle_court }] : [];
          }),
        },
        {
          titre: S.demarches,
          liens: demarches
            .filter((d) => d.a_une_page)
            .map((d) => ({ href: `${base}demarches/${d.slug}/`, libelle: d.libelle })),
        },
        {
          titre: S.organismes.titre,
          liens: [
            { href: `${base}organismes/`, libelle: S.organismes.tous },
            { href: `${base}#departements`, libelle: S.organismes.departement },
          ],
        },
      ]}
    />
  );
}
