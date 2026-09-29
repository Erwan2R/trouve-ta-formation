import type { Metadata } from "next";
import { Logo } from "@/components/public/Logo";
import { SITE_URL } from "@/lib/seo/metadata";

export const metadata: Metadata = { title: "Compte supprimé" };

/** Écran noir de confirmation après suppression du compte (maquette Paramètres). */
export default function CompteSupprime() {
  return (
    <main className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900 p-6">
      <div className="flex max-w-[560px] flex-col items-center gap-4 text-center">
        <Logo height={26} inverse />
        <h1 className="mt-3 text-[clamp(28px,4vw,44px)] leading-[1.05] font-extrabold tracking-[-0.035em] text-white">
          Votre compte a été supprimé
        </h1>
        <p className="text-base leading-[1.65] text-on-dark">
          Votre fiche n&apos;est plus visible sur le site et vos données ont été effacées.
        </p>
        <a
          href={`${SITE_URL}/`}
          className="mt-2 inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-[15px] text-[15px] font-bold text-ink-900 hover:text-ink-900"
        >
          Retour au site<span aria-hidden="true">→</span>
        </a>
      </div>
    </main>
  );
}
