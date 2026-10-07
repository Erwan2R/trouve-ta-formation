import type { Metadata } from "next";
import type { Titre } from "@/lib/supabase/queries/referentiel";
import Link from "next/link";
import { ColonnePilier } from "@/components/public/pilier/ColonnePilier";
import { CorpsPilier } from "@/components/public/pilier/CorpsPilier";
import { EnTetePilier } from "@/components/public/pilier/EnTetePilier";
import { SommairePilier } from "@/components/public/pilier/SommairePilier";
import { PILIERS, h1Pilier } from "@/contenu/securite-privee/piliers";
import { VERTICALES, type Verticale } from "@/lib/config/verticales";
import { buildMetadata } from "@/lib/seo/metadata";
import { trier } from "@/lib/organismes/tri";
import { getCompteursAffiches } from "@/lib/supabase/queries/compteurs";
import { getOrganismes } from "@/lib/supabase/queries/organismes";
import { getSeuilBlocPilier } from "@/lib/supabase/queries/parametres";
import { getDemarches } from "@/lib/supabase/queries/demarches";
import { dateLongue } from "@/lib/format-date";
import { releveDuCnaps } from "@/lib/formulaire/parcours";
import { getDepartements, getTitres } from "@/lib/supabase/queries/referentiel";

const verticale: Verticale = VERTICALES["securite-privee"];
const base = `/${verticale.slug}/`;

/** Métadonnées d'une page pilier (Copy piliers §3 : gabarit A mène avec le programme, B avec le calendrier). */
export function metadataPilier(titre: Titre): Metadata {
  const contenu = PILIERS[titre.slug];
  const court = titre.libelle_court;
  return buildMetadata(
    contenu.gabarit === "A"
      ? {
          title: contenu.titleSeo ?? `Formation ${court} : programme, conditions et organismes`,
          description: `Le ${titre.libelle_long} : programme, durée, conditions d'accès et financements. Les organismes qui le préparent en Île-de-France.`,
          path: `${base}${titre.slug}/`,
        }
      : {
          title: contenu.titleSeo ?? `${court} : quand le faire, durée et organismes`,
          description: releveDuCnaps(titre.slug)
            ? `Le ${court} est obligatoire pour renouveler votre carte professionnelle. Quand le suivre, combien de temps, quels organismes le proposent en Île-de-France.`
            : `Le ${court} est obligatoire tous les trois ans pour continuer d'exercer. Quand le suivre, combien de temps, quels organismes le proposent en Île-de-France.`,
          path: `${base}${titre.slug}/`,
        },
  );
}

/** Page pilier (gabarits A et B) — la résolution du slug et les redirections sont faites par la route. */
export async function PagePilier({
  titre,
  archive,
}: {
  titre: Titre;
  archive: { depuis: string; proche: Titre | null } | null;
}) {
  const contenu = PILIERS[titre.slug];

  const [titres, departements, compteurs, { visibles }, organismes, seuilBloc] = await Promise.all([
    getTitres(),
    getDepartements(),
    getCompteursAffiches(verticale.seuilCompteurs),
    getDemarches(verticale),
    getOrganismes(),
    getSeuilBlocPilier(),
  ]);
  // Bloc 8 : 10 fiches au plus, tri par complétude ; masqué sous le seuil (UX pilier §8).
  const proposent = organismes.filter((o) => o.titres.includes(titre.slug));
  const organismesBloc = proposent.length >= seuilBloc ? trier(proposent, "pertinence").slice(0, 10) : [];
  const nbOrganismes = compteurs ? (compteurs.parTitre.get(titre.slug) ?? 0) : null;
  const titresLies = contenu.titresLies.flatMap(({ slug, texte }) => {
    const t = titres.find((x) => x.slug === slug);
    return t?.a_une_page ? [{ titre: t, texte }] : [];
  });
  const deptsPublies = verticale.footerDepartements.flatMap((code) =>
    departements.filter((d) => d.code === code && d.a_une_page),
  );
  const accroche =
    contenu.gabarit === "A"
      ? {
          titre: "Ce titre ne correspond pas à votre situation ?",
          texte: "Six questions suffisent pour identifier celui qui vous convient.",
          cta: "Trouver mon titre",
          href: `${base}formulaire/?depuis=${base}${titre.slug}/`,
        }
      : {
          titre: releveDuCnaps(titre.slug)
            ? "Vous ne savez pas quel stage correspond à votre carte ?"
            : "Vous ne savez pas quel stage correspond à votre diplôme ?",
          texte: "Indiquez le titre que vous détenez, nous vous orientons vers le maintien correspondant.",
          cta: "Vérifier mon cas",
          href: `${base}formulaire/?depart=renouvellement&depuis=${base}${titre.slug}/`,
        };

  return (
    <main>
      {archive && (
        <p className="border-b border-brique-200 bg-brique-050 px-7 py-3 text-center text-[14.5px] text-ink-900">
          <strong>Ce titre n&apos;est plus délivré depuis le {dateLongue(archive.depuis)}.</strong>
          {archive.proche && (
            <>
              {" "}
              Titre le plus proche :{" "}
              <Link href={`${base}${archive.proche.slug}/`} className="font-bold">
                {archive.proche.libelle_court} →
              </Link>
            </>
          )}
        </p>
      )}
      {!titre.page_publiee && (
        <p className="bg-brique-700 px-7 py-2 text-center font-mono text-xs tracking-[0.08em] text-white uppercase">
          Aperçu — page non publiée, invisible en production
        </p>
      )}
      <EnTetePilier
        base={base}
        nomVerticale={verticale.nom}
        titre={titre}
        contenu={contenu}
        h1={h1Pilier(titre, contenu)}
        nbOrganismes={nbOrganismes}
      />
      <SommairePilier gabarit={contenu.gabarit} />
      <section className="bg-cream-100">
        <div className="container-public flex flex-wrap items-start gap-[clamp(24px,3vw,44px)] pt-12 pb-14">
          <CorpsPilier
            base={base}
            titre={titre}
            contenu={contenu}
            departements={deptsPublies}
            demarchesVisibles={visibles}
            organismes={organismesBloc}
          />
          <ColonnePilier
            base={base}
            titre={titre}
            gabarit={contenu.gabarit}
            nbOrganismes={nbOrganismes}
            titresLies={titresLies}
            demarchesVisibles={visibles}
          />
        </div>
      </section>
      <section id="affinage" className="border-t border-line bg-white">
        <div className="container-public flex flex-wrap items-center justify-between gap-6 py-14">
          <div className="flex min-w-[min(100%,280px)] flex-[1_1_440px] flex-col gap-2.5">
            <h2 className="text-[clamp(22px,2.4vw,30px)] leading-[1.15] font-bold tracking-[-0.025em]">
              {accroche.titre}
            </h2>
            <p className="max-w-[60ch] text-[16.5px] leading-[1.65] text-ink-500">{accroche.texte}</p>
          </div>
          <Link
            href={accroche.href}
            rel="nofollow"
            className="inline-flex flex-none items-center gap-2.5 rounded-full bg-ink-900 px-[26px] py-[17px] text-base font-bold text-white hover:bg-brique-700 hover:text-white"
          >
            {accroche.cta} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
