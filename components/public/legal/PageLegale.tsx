import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/public/Logo";
import { TexteContenu } from "@/components/public/TexteContenu";
import { sansMarqueur } from "@/contenu/marqueurs";
import type { PageLegale as Contenu } from "@/contenu/legal/types";
import { EST_PRODUCTION } from "@/lib/env";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo/json-ld";

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
            </section>
          ))}
        </article>
      </main>
    </>
  );
}
