import { Logo } from "@/components/public/Logo";
import { Card } from "@/components/ui/Card";
import { VERTICALES } from "@/lib/config/verticales";
import { buildMetadata } from "@/lib/seo/metadata";

// Racine du domaine (pas de maquette) : aiguillage vers les verticales. Seul lien inter-silo hors footer.
export const metadata = buildMetadata({
  title: "Trouve ta formation — Annuaire indépendant des organismes de formation",
  description:
    "Annuaire indépendant des organismes de formation professionnelle, secteur par secteur, sans commission ni classement payant.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <header className="border-b border-line">
        <div className="container-public py-4">
          <Logo height={27} priority />
        </div>
      </header>
      <main className="container-public py-[clamp(56px,9vw,88px)]">
        <div className="max-w-[900px]">
          <p className="eyebrow text-brique-700">Annuaire indépendant</p>
          <h1 className="mt-4 max-w-[22ch] text-[clamp(32px,4.4vw,54px)] leading-[1.06] font-bold tracking-[-0.03em] text-balance">
            Trouvez un organisme de formation professionnelle
          </h1>
          <p className="mt-5 max-w-[620px] text-[16.5px] leading-[1.6] text-ink-500">
            Trouve ta formation compare les organismes de formation secteur par secteur, sans commission ni classement
            payant. Choisissez votre secteur.
          </p>
        </div>
        <h2 className="sr-only">Secteurs</h2>
        <ul className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-3.5">
          {Object.values(VERTICALES).map((v) => (
            <li key={v.slug}>
              <Card href={`/${v.slug}/`}>
                <span className="eyebrow text-ink-400">{v.region}</span>
                <span className="mt-3 block text-xl leading-tight font-bold tracking-[-0.015em]">{v.nom}</span>
                <span className="mt-2 block text-[14.5px] leading-[1.65] text-ink-500">{v.description}</span>
                <span className="mt-4 block text-[13.5px] font-bold text-brique-700">Voir les formations →</span>
              </Card>
            </li>
          ))}
        </ul>
      </main>
      <footer className="bg-ink-900 py-8 text-ink-300">
        <p className="container-public text-[12.5px] leading-relaxed">
          © 2026 Trouve ta formation — Annuaire indépendant des organismes de formation.
        </p>
      </footer>
    </>
  );
}
