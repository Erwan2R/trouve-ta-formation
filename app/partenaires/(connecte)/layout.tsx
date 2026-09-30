import { Logo } from "@/components/public/Logo";
import { MenuCompte } from "@/components/espace/MenuCompte";
import { NavEspace } from "@/components/espace/NavEspace";
import { EMAIL_CONTACT } from "@/lib/config/contact";
import { getEspace } from "@/lib/supabase/queries/espace";

/** Pages connectées : barre de navigation en pilule, statut de publication, initiales du compte. */
export default async function EspaceConnecteLayout({ children }: { children: React.ReactNode }) {
  const { organisme, compte, user, offresActives } = await getEspace();
  const enLigne = organisme.statut === "publie";
  const initiales = (compte.contact_nom ?? user.email)
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0].toUpperCase())
    .join("");
  return (
    <div className="mx-auto flex max-w-[1320px] flex-col gap-3.5">
      <header className="sticky top-3.5 z-30 flex flex-wrap items-center gap-x-[18px] gap-y-2.5 rounded-full border border-line bg-white/92 py-2 pr-2 pl-5 backdrop-blur-md">
        <Logo height={24} priority />
        <NavEspace nbFormations={offresActives.length} />
        <span className="ml-auto flex flex-none items-center gap-2">
          <span
            className={`inline-flex items-center gap-[7px] rounded-full border px-[13px] py-2 font-mono text-[10.5px] tracking-[0.1em] uppercase ${enLigne ? "border-ink-900 bg-ink-900 text-white" : "border-line-heavy bg-white text-ink-600"}`}
          >
            <span
              aria-hidden="true"
              className={`block size-1.5 rounded-full ${enLigne ? "bg-brique-400" : "bg-brique-700"}`}
            />
            {enLigne ? "En ligne" : organisme.statut === "suspendu" ? "Suspendue" : "Non publiée"}
          </span>
          <MenuCompte initiales={initiales} nom={compte.contact_nom} email={user.email} />
        </span>
      </header>
      {organisme.statut === "suspendu" && (
        // Décision Erwan : un compte suspendu se connecte, peut modifier sa fiche (sans effet public) ; seul l'admin
        // réactive (le statut n'est pas modifiable par l'organisme). Texte Claude, à valider.
        <div role="alert" className="flex flex-col gap-1.5 rounded-[22px] bg-ink-900 px-[22px] py-[18px] text-white">
          <span className="font-mono text-[10.5px] tracking-[0.12em] text-brique-400 uppercase">Fiche suspendue</span>
          <span className="text-[15px] leading-[1.55] text-pretty text-line">
            Votre fiche a été suspendue par l&apos;équipe de Trouve ta formation : elle n&apos;est plus visible sur le
            site. Vous pouvez la modifier : corrigez-la, puis écrivez-nous à{" "}
            <a href={`mailto:${EMAIL_CONTACT}`} className="font-bold text-brique-400 hover:text-white">
              {EMAIL_CONTACT}
            </a>{" "}
            pour demander sa réactivation. Elle restera invisible jusque-là.
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
