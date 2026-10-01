import Link from "next/link";
import { Logo } from "@/components/public/Logo";
import { NotFoundContent } from "@/components/public/NotFoundContent";
import { PiedMinimal } from "@/components/public/PiedMinimal";
import { PAGE_404, RACINE } from "@/contenu/erreurs-racine";
import { VERTICALES } from "@/lib/config/verticales";

// 404 hors silo (gabarit racine, Copy 404 §8) : la seule sortie est le choix d'un secteur.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="container-public py-4">
          <Link href="/" className="inline-block">
            <Logo height={36} priority />
          </Link>
        </div>
      </header>
      <NotFoundContent
        sorties={[
          {
            titre: PAGE_404.racine.titre,
            liens: Object.values(VERTICALES).map((v) => ({
              href: `/${v.slug}/`,
              libelle: RACINE.verticales[v.slug].nom,
            })),
          },
        ]}
      />
      <PiedMinimal />
    </div>
  );
}
