import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

/**
 * Contenu 404 (pas de maquette : conçu dans les règles du design system).
 * `raccourcis` : pages utiles du silo courant, ou les secteurs depuis la racine.
 */
export function NotFoundContent({
  accueil,
  raccourcis,
}: {
  accueil: { href: string; libelle: string };
  raccourcis: { href: string; titre: string; description: string }[];
}) {
  return (
    <main className="container-public py-[clamp(56px,9vw,88px)]">
      <div className="max-w-[900px]">
        <p className="eyebrow text-brique-700">Erreur 404</p>
        <h1 className="mt-4 max-w-[22ch] text-[clamp(32px,4.4vw,54px)] leading-[1.06] font-bold tracking-[-0.03em] text-balance">
          Cette page n&apos;existe pas ou a été déplacée
        </h1>
        <p className="mt-5 max-w-[620px] text-[16.5px] leading-[1.6] text-ink-500">
          L&apos;adresse est peut-être mal saisie, ou la page a été retirée de l&apos;annuaire. Les informations que
          vous cherchez sont probablement accessibles depuis l&apos;une des entrées ci-dessous.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={accueil.href}>{accueil.libelle}</ButtonLink>
        </div>
      </div>

      {raccourcis.length > 0 && (
        <div className="mt-14 grid grid-cols-[repeat(auto-fill,minmax(min(100%,290px),1fr))] gap-3.5">
          {raccourcis.map((r) => (
            <Card key={r.href} href={r.href}>
              <span className="block text-lg leading-tight font-bold tracking-[-0.015em]">{r.titre}</span>
              <span className="mt-2 block text-[14.5px] leading-[1.65] text-ink-500">{r.description}</span>
              <span className="mt-4 block text-[13.5px] font-bold text-brique-700">Consulter →</span>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
