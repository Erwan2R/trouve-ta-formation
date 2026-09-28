import { buildMetadata } from "@/lib/seo/metadata";

// Provisoire : contenu réel au Sprint 2 (UX/Copy Page_Accueil_Securite_Privee). Ne pas fusionner dans main en l'état.
export const metadata = buildMetadata({
  title: "Formations en sécurité privée en Île-de-France",
  description:
    "Annuaire indépendant des organismes de formation en sécurité privée agréés par le CNAPS en Île-de-France.",
  path: "/securite-privee/",
  noindex: true,
});

export default function Page() {
  return (
    <main className="container-public py-[88px]">
      <h1 className="text-[clamp(32px,4.4vw,54px)] leading-[1.06] font-bold tracking-[-0.03em]">
        Formations en sécurité privée en Île-de-France
      </h1>
      <p className="mt-4 text-ink-500">Page en construction (Sprint 2).</p>
    </main>
  );
}
