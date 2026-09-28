import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ColonneDemarche } from "@/components/public/demarche/ColonneDemarche";
import { CorpsDemarche } from "@/components/public/demarche/CorpsDemarche";
import { EnTeteDemarche } from "@/components/public/demarche/EnTeteDemarche";
import { SommaireAncres } from "@/components/public/SommaireAncres";
import { DEMARCHES } from "@/contenu/securite-privee/demarches";
import { VERTICALES, type Verticale } from "@/lib/config/verticales";
import { buildMetadata } from "@/lib/seo/metadata";
import { getDemarches } from "@/lib/supabase/queries/demarches";
import { getTitres } from "@/lib/supabase/queries/referentiel";

const verticale: Verticale = VERTICALES["securite-privee"];
const base = `/${verticale.slug}/`;

type Props = { params: Promise<{ slug: string }> };

async function resoudre(slug: string) {
  const { demarches, listeVisible } = await getDemarches(verticale);
  const demarche = demarches.find((d) => d.slug === slug && d.a_une_page);
  return demarche ? { demarche, demarches, listeVisible } : null;
}

export async function generateStaticParams() {
  const { demarches } = await getDemarches(verticale);
  return demarches.filter((d) => d.a_une_page).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await resoudre((await params).slug);
  if (!page) return {};
  const contenu = DEMARCHES[page.demarche.slug];
  return buildMetadata({
    title: contenu.title,
    description: contenu.description,
    path: `${base}demarches/${page.demarche.slug}/`,
  });
}

export default async function PageDemarche({ params }: Props) {
  const page = await resoudre((await params).slug);
  if (!page) notFound();
  const { demarche, demarches, listeVisible } = page;
  const contenu = DEMARCHES[demarche.slug];
  const titres = await getTitres();
  const visibles = new Set(demarches.filter((d) => d.a_une_page).map((d) => d.slug));

  return (
    <main>
      {!(demarche.page_publiee && demarche.verifie_le) && (
        <p className="bg-brique-700 px-7 py-2 text-center font-mono text-xs tracking-[0.08em] text-white uppercase">
          Aperçu — démarche non publiée ou non vérifiée, invisible en production
        </p>
      )}
      <EnTeteDemarche
        base={base}
        nomVerticale={verticale.nom}
        demarche={demarche}
        contenu={contenu}
        listeVisible={listeVisible}
      />
      <SommaireAncres
        ancres={[
          { id: "qui", libelle: contenu.qui.sommaire },
          { id: "conditions", libelle: "Les conditions" },
          { id: "pieces", libelle: "Les pièces à fournir" },
          { id: "depot", libelle: "Déposer la demande" },
          { id: "delais", libelle: "Délais et suivi" },
          { id: "refus", libelle: contenu.refus.sommaire ?? "En cas de refus" },
          { id: "ensuite", libelle: "Ce qu'il faut faire ensuite", principale: true },
        ]}
      />
      <section className="bg-cream-100">
        <div className="container-public flex flex-wrap items-start gap-[clamp(24px,3vw,44px)] pt-12 pb-14">
          <CorpsDemarche
            base={base}
            demarche={demarche}
            contenu={contenu}
            titres={titres}
            demarchesVisibles={visibles}
          />
          <ColonneDemarche base={base} courante={demarche} demarches={demarches} listeVisible={listeVisible} />
        </div>
      </section>
    </main>
  );
}
