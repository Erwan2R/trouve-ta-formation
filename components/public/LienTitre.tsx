import Link from "next/link";
import type { Titre } from "@/lib/supabase/queries/referentiel";

/** Lien contextuel vers une page pilier, ou texte simple tant que la page n'est pas publiée (jamais de 404). */
export function LienTitre({
  titre,
  base,
  children,
}: {
  titre: Titre | undefined;
  base: string;
  children: React.ReactNode;
}) {
  if (!titre?.a_une_page) return <>{children}</>;
  return (
    <Link href={`${base}${titre.slug}/`} className="border-b border-brique-200">
      {children}
    </Link>
  );
}
