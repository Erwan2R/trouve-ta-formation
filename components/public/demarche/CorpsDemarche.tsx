import Link from "next/link";
import { LienContenu } from "@/components/public/LienContenu";
import { TexteContenu } from "@/components/public/TexteContenu";
import { URL_CNAPS } from "@/contenu/securite-privee/demarches/liste";
import type { ContenuDemarche } from "@/contenu/securite-privee/demarches/types";
import { dateLongue } from "@/lib/format-date";
import { JsonLd, faqJsonLd } from "@/lib/seo/json-ld";
import type { Demarche } from "@/lib/supabase/queries/demarches";
import type { Titre } from "@/lib/supabase/queries/referentiel";
import { fr } from "@/lib/typo";

const h2 = "scroll-mt-40 text-[clamp(25px,3vw,34px)] leading-[1.1] font-bold tracking-[-0.025em]";
const h2Petit = "scroll-mt-40 text-[clamp(22px,2.4vw,28px)] leading-[1.15] font-bold tracking-[-0.02em]";
const prose = "max-w-[70ch] text-[17px] leading-[1.75] text-pretty text-ink-700";
const note = "max-w-[70ch] text-base leading-[1.7] text-ink-500";
const filet = "border-[#DFD9D2]";
const bloc = "flex flex-col gap-[18px]";

/** Blocs 4 à 13 d'une page démarche (UX démarches §3). Aucun contenu de formation n'est développé ici. */
export function CorpsDemarche({
  base,
  demarche,
  contenu,
  titres,
  demarchesVisibles,
}: {
  base: string;
  demarche: Demarche;
  contenu: ContenuDemarche;
  titres: Titre[];
  demarchesVisibles: Set<string>;
}) {
  const formations = contenu.formations.titres.flatMap(({ slug, texte }) => {
    const t = titres.find((x) => x.slug === slug);
    return t?.a_une_page ? [{ titre: t, texte: texte ?? t.accroche ?? "" }] : [];
  });
  const lignesDelais: [string, string][] = [
    ...(demarche.delai_instruction ? [["Délai d'instruction", demarche.delai_instruction] as [string, string]] : []),
    ...contenu.delais.lignes,
  ];

  return (
    <div className="flex min-w-[min(100%,300px)] flex-[999_1_560px] flex-col gap-[46px]">
      <div className="flex flex-col gap-4">
        <h2 id="qui" className={h2}>
          {contenu.qui.h2}
        </h2>
        {contenu.qui.paragraphes.map((p) => (
          <p key={p} className={prose}>
            <TexteContenu texte={p} />
          </p>
        ))}
        {contenu.qui.encart && (
          <div className="flex max-w-[70ch] flex-col gap-1.5 border-l-2 border-brique-700 py-1 pl-5">
            <span className="font-mono text-[10.5px] tracking-[0.12em] text-brique-700 uppercase">
              {contenu.qui.encart.surtitre}
            </span>
            <p className="text-[17px] leading-[1.7] text-ink-900">
              <TexteContenu texte={contenu.qui.encart.texte} />
            </p>
          </div>
        )}
      </div>

      <div className={bloc}>
        <h2 id="conditions" className={h2}>
          {contenu.conditions.h2}
        </h2>
        {contenu.conditions.intro && (
          <p className={prose}>
            <TexteContenu texte={contenu.conditions.intro} />
          </p>
        )}
        {contenu.conditions.sections.map((s) => (
          <div key={s.h3} className="flex flex-col gap-2.5">
            <h3 className="text-[18.5px] font-bold tracking-[-0.015em]">{fr(s.h3)}</h3>
            {s.paragraphes.map((p) => (
              <p key={p} className={prose}>
                <TexteContenu texte={p} />
              </p>
            ))}
            {s.lien && (
              <p>
                <LienContenu lien={s.lien} base={base} demarchesVisibles={demarchesVisibles} className="font-bold" />
              </p>
            )}
          </div>
        ))}
        {/* Copy §3.3 : lien sortant vers la source officielle, dans le corps du texte. */}
        <p className={`mt-1.5 border-t ${filet} pt-4 ${note}`}>
          Cette procédure est décrite officiellement sur{" "}
          <a href={URL_CNAPS} rel="noopener" className="font-semibold">
            le site du CNAPS
          </a>
          . Nous la reformulons ici pour la rendre plus lisible, mais en cas de divergence, c&apos;est le site officiel
          qui fait foi.
        </p>
      </div>

      <div className={bloc}>
        <h2 id="pieces" className={h2}>
          Les pièces à réunir
        </h2>
        {contenu.pieces.intro && (
          <p className={note}>
            <TexteContenu texte={contenu.pieces.intro} />
          </p>
        )}
        <ul className={`flex max-w-[74ch] flex-col border-t ${filet}`}>
          {contenu.pieces.liste.map((p) => (
            <li key={p} className={`flex items-start gap-3.5 border-b ${filet} py-[15px]`}>
              <span aria-hidden="true" className="mt-[9px] block size-[7px] flex-none rounded-full bg-brique-700" />
              <span className="text-[16.5px] leading-[1.65] text-ink-900">
                <TexteContenu texte={p} />
              </span>
            </li>
          ))}
        </ul>
        {contenu.pieces.source && (
          <p className="text-[13.5px] leading-[1.6] text-ink-500">
            Source :{" "}
            <a href={contenu.pieces.source.href} className="font-semibold">
              {contenu.pieces.source.libelle}
            </a>
            , vérifiée le {dateLongue(contenu.pieces.source.verifieLe)}.
          </p>
        )}
        {contenu.pieces.encart && (
          <div className="flex max-w-[74ch] flex-col gap-[7px] rounded-[18px] border border-line bg-white px-[22px] py-5">
            <span className="font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase">
              {contenu.pieces.encart.surtitre}
            </span>
            <p className="text-[17px] leading-[1.4] font-bold">{fr(contenu.pieces.encart.titre)}</p>
            <p className="text-base leading-[1.7] text-ink-500">
              <TexteContenu texte={contenu.pieces.encart.texte} />
            </p>
          </div>
        )}
      </div>

      <div className={bloc}>
        <h2 id="depot" className={h2}>
          Déposer sa demande sur Dracar Ultimate
        </h2>
        <p className={prose}>
          <TexteContenu texte={contenu.depot.intro} />
        </p>
        <ol className={`flex max-w-[74ch] flex-col border-t ${filet}`}>
          {contenu.depot.etapes.map((e, i) => (
            <li key={e.h3} className={`flex items-start gap-4 border-b ${filet} py-[18px]`}>
              <span aria-hidden="true" className="flex-none pt-1 font-mono text-xs text-brique-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-[5px]">
                <h3 className="text-[17.5px] font-bold tracking-[-0.015em]">{fr(e.h3)}</h3>
                <p className="text-base leading-[1.7] text-ink-500">
                  <TexteContenu texte={e.texte} />
                </p>
              </div>
            </li>
          ))}
        </ol>
        {contenu.depot.alerte && (
          <div className="flex max-w-[74ch] flex-col gap-[7px] rounded-[18px] bg-ink-900 px-6 py-[22px]">
            <span className="font-mono text-[10.5px] tracking-[0.12em] text-brique-400 uppercase">
              À ne pas manquer
            </span>
            <p className="text-[17.5px] leading-[1.4] font-bold text-white">{fr(contenu.depot.alerte.titre)}</p>
            <p className="text-base leading-[1.7] text-on-dark">
              <TexteContenu texte={contenu.depot.alerte.texte} />
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 id="delais" className={h2}>
          Combien de temps faut-il compter
        </h2>
        {!demarche.delai_instruction && (
          <p className={note}>
            <TexteContenu texte={contenu.delais.intro} />
          </p>
        )}
        <dl className={`flex max-w-[74ch] flex-col border-t ${filet}`}>
          {lignesDelais.map(([label, texte]) => (
            <div key={label} className={`flex flex-wrap items-baseline gap-x-5 gap-y-1.5 border-b ${filet} py-3.5`}>
              <dt className="w-[210px] flex-none text-base font-bold">{label}</dt>
              <dd className="flex-[1_1_220px] text-base leading-[1.65] text-ink-500">
                <TexteContenu texte={texte} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={bloc}>
        <h2 id="refus" className={h2}>
          {contenu.refus.h2}
        </h2>
        <div className={`flex max-w-[76ch] flex-col border-t ${filet}`}>
          {contenu.refus.sections.map((s, i) => (
            <details key={s.titre} open={i === 0} className={`border-b ${filet}`}>
              <summary className="flex cursor-pointer items-center justify-between gap-5 py-[18px] text-[17.5px] font-semibold">
                <h3>{fr(s.titre)}</h3>
                <span aria-hidden="true" className="flex-none text-lg text-brique-700">
                  +
                </span>
              </summary>
              {s.texte && (
                <p className="mb-[18px] max-w-[70ch] text-base leading-[1.7] text-ink-500">
                  <TexteContenu texte={s.texte} />
                </p>
              )}
              {s.liste && (
                <ul className="mb-[18px] max-w-[70ch] list-disc pl-5 text-base leading-[1.75] text-ink-500">
                  {s.liste.map((l) => (
                    <li key={l}>
                      <TexteContenu texte={l} />
                    </li>
                  ))}
                </ul>
              )}
            </details>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3.5 rounded-[22px] border border-line bg-white p-[clamp(24px,3vw,34px)]">
        <h2
          id="ensuite"
          className="scroll-mt-40 text-[clamp(23px,2.8vw,30px)] leading-[1.12] font-bold tracking-[-0.025em]"
        >
          {contenu.ensuite.h2}
        </h2>
        {contenu.ensuite.paragraphes.map((p) => (
          <p key={p} className="max-w-[66ch] text-[17.5px] leading-[1.75] text-pretty text-ink-700">
            <TexteContenu texte={p} />
          </p>
        ))}
        <div className="mt-1 flex flex-wrap gap-2.5">
          {contenu.ensuite.liens.map((l, i) => (
            <LienContenu
              key={l.href}
              lien={l}
              base={base}
              demarchesVisibles={demarchesVisibles}
              className={
                i === 0
                  ? "inline-flex items-center gap-2.5 rounded-full bg-ink-900 px-[22px] py-[15px] text-[15.5px] font-bold text-white hover:bg-brique-700 hover:text-white"
                  : "inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white px-[22px] py-[15px] text-[15.5px] font-semibold text-ink-900 hover:border-ink-900 hover:text-ink-900"
              }
            >
              {l.libelle} <span aria-hidden="true">→</span>
            </LienContenu>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        <h2 id="formations" className={h2Petit}>
          {contenu.formations.h2}
        </h2>
        {formations.length === 0 ? (
          // Aucune page formation publiée : renvoi vers la grille des titres de l'accueil (ancres du contenu toujours valides).
          <p>
            <Link href={`${base}#formations`} className="font-bold">
              Voir les titres de la sécurité privée →
            </Link>
          </p>
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-2.5">
            {formations.map(({ titre, texte }) => (
              <li key={titre.slug} className="flex">
                <Link
                  href={`${base}${titre.slug}/`}
                  className="flex w-full flex-col gap-1 rounded-[14px] border border-line bg-white px-[18px] py-4 text-ink-900 hover:border-ink-900 hover:text-ink-900"
                >
                  <span className="text-base font-bold">{titre.libelle_court}</span>
                  <span className="text-[13.5px] leading-normal text-ink-400">{fr(texte)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={bloc}>
        <JsonLd data={faqJsonLd(contenu.faq)} />
        <h2 id="faq" className={h2Petit}>
          {contenu.faqTitre}
        </h2>
        <div className={`flex max-w-[80ch] flex-col border-t ${filet}`}>
          {contenu.faq.map((q) => (
            <details key={q.question} className={`border-b ${filet}`}>
              <summary className="flex cursor-pointer items-start justify-between gap-5 py-[19px] text-[16.5px] leading-[1.4] font-semibold">
                <h3>{fr(q.question)}</h3>
                <span aria-hidden="true" className="flex-none text-lg text-brique-700">
                  +
                </span>
              </summary>
              <p className="mb-5 pr-10 text-base leading-[1.7] text-ink-500">
                <TexteContenu texte={q.reponse} />
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
