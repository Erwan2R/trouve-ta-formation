import Link from "next/link";
import { Logo } from "@/components/public/Logo";
import { PiedMinimal } from "@/components/public/PiedMinimal";
import { RACINE } from "@/contenu/erreurs-racine";
import { VERTICALES } from "@/lib/config/verticales";
import { buildMetadata } from "@/lib/seo/metadata";

// Racine du domaine (Copy racine §10) : un point de passage, pas une destination. Copy volontairement brève,
// aucun contenu éditorial sur la formation en général, pied de page minimal (pas celui du silo).
export const metadata = {
  ...buildMetadata({ title: RACINE.title, description: RACINE.description, path: "/" }),
  title: { absolute: RACINE.title },
};

export default function Racine() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="container-public py-4">
          <Logo height={36} priority />
        </div>
      </header>
      <main className="container-public w-full flex-1 py-[clamp(56px,9vw,96px)]">
        <h1 className="text-[clamp(36px,5vw,62px)] leading-[1.02] font-bold tracking-[-0.04em]">{RACINE.h1}</h1>
        <p className="mt-4 max-w-[48ch] text-[clamp(18px,2vw,21px)] leading-[1.5] text-ink-600">
          {RACINE.positionnement}
        </p>

        <ul className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(min(100%,360px),1fr))] gap-3.5">
          {Object.values(VERTICALES).map((v) => {
            const c = RACINE.verticales[v.slug];
            return (
              <li key={v.slug}>
                <Link
                  href={`/${v.slug}/`}
                  className="flex h-full flex-col gap-2.5 rounded-[22px] border border-line bg-white p-[26px] text-ink-900 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ink-900 hover:text-ink-900"
                >
                  <span className="text-[22px] leading-tight font-bold tracking-[-0.02em]">{c.nom}</span>
                  <span className="text-[15px] leading-[1.6] text-ink-500">{c.texte}</span>
                  <span className="mt-2 text-[14.5px] font-bold text-brique-700">{c.lien} →</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-[15px] text-ink-500">{RACINE.aVenir}</p>

        <p className="mt-16 border-t border-line pt-6 text-[15px] text-ink-600">
          {RACINE.b2b.texte}{" "}
          <Link href="/securite-privee/referencer-mon-organisme/" className="font-bold">
            {RACINE.b2b.lien} →
          </Link>
        </p>
      </main>
      <PiedMinimal />
    </div>
  );
}
