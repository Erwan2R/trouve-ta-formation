import Link from "next/link";
import { PIED_MINIMAL } from "@/contenu/erreurs-racine";
import { EMAIL_CONTACT } from "@/lib/config/contact";
import { Logo } from "./Logo";

/** Pied de page minimal (racine du domaine, landing organismes) : aucun maillage de silo. */
export function PiedMinimal({ conteneur = "container-public" }: { conteneur?: string }) {
  return (
    <footer className="bg-ink-900">
      <div
        className={`${conteneur} flex flex-wrap items-center justify-between gap-x-6 gap-y-3.5 border-t border-line-dark pt-[26px] pb-[30px]`}
      >
        <span className="flex flex-wrap items-center gap-x-[18px] gap-y-3 text-[13.5px]">
          <Logo height={24} inverse />
          <Link href="/mentions-legales/" className="text-on-dark hover:text-white">
            {PIED_MINIMAL[0]}
          </Link>
          <Link href="/confidentialite/" className="text-on-dark hover:text-white">
            {PIED_MINIMAL[1]}
          </Link>
          <Link href="/conditions-utilisation/" className="text-on-dark hover:text-white">
            {PIED_MINIMAL[3]}
          </Link>
          <Link href="/cookies/" className="text-on-dark hover:text-white">
            {PIED_MINIMAL[4]}
          </Link>
          <a href={`mailto:${EMAIL_CONTACT}`} className="text-on-dark hover:text-white">
            {PIED_MINIMAL[2]}
          </a>
        </span>
        <span className="font-mono text-[11.5px] text-ink-300">© 2026 Trouve ta formation</span>
      </div>
    </footer>
  );
}
