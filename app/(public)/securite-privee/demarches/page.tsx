import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { TexteContenu } from "@/components/public/TexteContenu";
import { LISTE_DEMARCHES as L } from "@/contenu/securite-privee/demarches/liste";
import { VERTICALES, type Verticale } from "@/lib/config/verticales";
import { buildMetadata } from "@/lib/seo/metadata";
import { getDemarches } from "@/lib/supabase/queries/demarches";

const verticale: Verticale = VERTICALES["securite-privee"];
const base = `/${verticale.slug}/`;

export const metadata = buildMetadata({ title: L.title, description: L.description, path: `${base}demarches/` });

/** Page de liste des démarches (pas de maquette : composée avec les motifs de la page démarche et de l'accueil). */
export default async function ListeDemarches() {
  const { demarches, listeVisible } = await getDemarches(verticale);
  if (!listeVisible) notFound();

  return (
    <main>
      <section className="border-b border-line-strong bg-cream-200">
        <div className="container-public pt-[18px] pb-12">
          <Breadcrumb
            items={[
              { name: verticale.nom, path: base },
              { name: "Démarches", path: `${base}demarches/` },
            ]}
          />
          <h1 className="mt-8 max-w-[22ch] text-[clamp(30px,4vw,50px)] leading-[1.04] font-bold tracking-[-0.035em] text-balance">
            {L.h1}
          </h1>
          <p className="mt-4 max-w-[62ch] text-[19px] leading-[1.6] text-pretty text-ink-700">
            <TexteContenu texte={L.chapo} />
          </p>

          {/* Schéma d'enchaînement : texte dans le DOM (Copy §4). */}
          <ol className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3.5">
            {L.parcours.map((etape, i) => (
              <li
                key={etape.titre}
                className="flex items-start gap-3 rounded-[18px] border border-line-strong bg-white p-5"
              >
                <span
                  aria-hidden="true"
                  className="flex size-9 flex-none items-center justify-center rounded-full bg-brique-700 font-mono text-[12.5px] text-white"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-[17px] font-bold tracking-[-0.01em]">{etape.titre}</span>
                  <span className="text-sm leading-normal text-ink-400">{etape.texte}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-[88px]">
        <div className="container-public flex flex-col gap-10">
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))] gap-3.5">
            {demarches.map((d, i) => {
              const carte = L.cartes[d.slug];
              const interieur = (
                <>
                  <span className="font-mono text-[12.5px] text-brique-700">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="text-xl font-bold tracking-[-0.015em]">{carte.titre}</h2>
                  <p className="text-[14.5px] leading-[1.65] text-ink-500">
                    <TexteContenu texte={carte.texte} />
                  </p>
                </>
              );
              const style =
                "flex h-full flex-col gap-3 rounded-[18px] border border-line bg-white p-[26px] text-ink-900";
              return (
                <li key={d.slug}>
                  {d.a_une_page ? (
                    <Link
                      href={`${base}demarches/${d.slug}/`}
                      className={`${style} transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ink-900 hover:text-ink-900`}
                    >
                      {interieur}
                    </Link>
                  ) : (
                    <div className={style}>{interieur}</div>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="flex max-w-[74ch] flex-col gap-3 rounded-[22px] border border-line bg-white p-[clamp(24px,3vw,34px)]">
            <p className="text-[17px] leading-[1.7] text-ink-700">
              <TexteContenu texte={L.aptitude.texte} />
            </p>
            <Link href={`${base}#formations`} className="font-bold">
              {L.aptitude.lien}
            </Link>
          </div>

          <p className="max-w-[74ch] border-l-2 border-brique-700 pl-5 text-[17px] leading-[1.7] text-ink-900">
            <TexteContenu texte={L.cloture} />
          </p>
        </div>
      </section>
    </main>
  );
}
