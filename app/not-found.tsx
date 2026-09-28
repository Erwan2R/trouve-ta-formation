import Link from "next/link";
import { Logo } from "@/components/public/Logo";
import { NotFoundContent } from "@/components/public/NotFoundContent";
import { VERTICALES } from "@/lib/config/verticales";

// 404 hors silo (URL inconnue à la racine) : pas de header de verticale, on renvoie vers les secteurs.
export default function NotFound() {
  return (
    <>
      <header className="border-b border-line">
        <div className="container-public py-4">
          <Link href="/" className="inline-block">
            <Logo height={27} priority />
          </Link>
        </div>
      </header>
      <NotFoundContent
        accueil={{ href: "/", libelle: "Accueil Trouve ta formation" }}
        raccourcis={Object.values(VERTICALES).map((v) => ({
          href: `/${v.slug}/`,
          titre: `${v.nom} · ${v.region}`,
          description: v.description,
        }))}
      />
    </>
  );
}
