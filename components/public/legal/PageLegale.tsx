import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/public/Logo";
import { TexteContenu } from "@/components/public/TexteContenu";
import { sansMarqueur } from "@/contenu/marqueurs";
import type { PageLegale as Contenu } from "@/contenu/legal/types";
import { EST_PRODUCTION } from "@/lib/env";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { BoutonPreferences } from "./BoutonPreferences";

/** Page légale (pas de maquette) : sobre, transverse aux verticales, comme la racine du domaine. */
export function PageLegale({ contenu: c, chemin }: { contenu: Contenu; chemin: string }) {
  // Double verrou : jamais servie en production avec un champ à compléter (le build de production échoue aussi).
  if (EST_PRODUCTION && !sansMarqueur(c)) notFound();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: c.h1, path: chemin }])} />
      <header className="border-b border-line">
        <div className="container-public py-4">
          <Link href="/" aria-label="Trouve ta formation, accueil">
            <Logo height={36} priority />
          </Link>
        </div>
      </header>
      <main className="container-public py-[clamp(48px,8vw,80px)]">
        <article className="max-w-[760px]">
          <h1 className="text-[clamp(32px,4.4vw,52px)] leading-[1.06] font-bold tracking-[-0.03em]">{c.h1}</h1>
          <p className="mt-3 font-mono text-xs text-ink-400">
            <TexteContenu texte={c.maj} />
          </p>
          {c.sections.map((s) => (
            <section key={s.h2} className="mt-10 flex flex-col gap-3">
              <h2 className="text-[22px] leading-[1.2] font-bold tracking-[-0.02em]">{s.h2}</h2>
              {s.paragraphes.map((p) => (
                <p key={p} className="text-base leading-[1.75] text-ink-700">
                  <TexteContenu texte={p} />
                </p>
              ))}
              {s.puces && (
                <ul className="flex list-disc flex-col gap-2 pl-6 text-base leading-[1.7] text-ink-700 marker:text-brique-700">
                  {s.puces.map((p) => (
                    <li key={p}>
                      <TexteContenu texte={p} />
                    </li>
                  ))}
                </ul>
              )}
              {s.tableau && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-left text-[14.5px]">
                    <thead>
                      <tr>
                        {s.tableau.entetes.map((e) => (
                          <th
                            key={e}
                            scope="col"
                            className="border-b border-line-heavy py-2.5 pr-4 font-mono text-[10.5px] font-medium tracking-[0.1em] text-ink-400 uppercase"
                          >
                            {e}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.tableau.lignes.map((l) => (
                        <tr key={l.join()}>
                          {l.map((c, i) => (
                            <td
                              key={i}
                              className={`border-b border-line py-3 pr-4 align-top leading-[1.5] ${i === 0 ? "font-semibold" : "text-ink-700"}`}
                            >
                              {c}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {s.preferences && <BoutonPreferences />}
            </section>
          ))}
        </article>
      </main>
    </>
  );
}
