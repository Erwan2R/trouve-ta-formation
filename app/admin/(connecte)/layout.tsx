import { NavAdmin } from "@/components/admin/NavAdmin";
import { MenuCompte } from "@/components/espace/MenuCompte";
import { Logo } from "@/components/public/Logo";
import { exigerAdmin } from "@/lib/admin-serveur";
import { seDeconnecter } from "./parametres/actions";

/** Pages connectées de l'admin : barre noire en pilule, badge « Admin », initiales du compte. */
export default async function AdminConnecteLayout({ children }: { children: React.ReactNode }) {
  const { user } = await exigerAdmin("a-configurer");
  const email = user.email ?? "";
  const initiales = email
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0].toUpperCase())
    .join("");
  return (
    <div className="mx-auto flex max-w-[1320px] flex-col gap-3.5">
      <header className="sticky top-3.5 z-30 flex flex-wrap items-center gap-x-[18px] gap-y-2.5 rounded-full bg-ink-900 py-2 pr-2 pl-5">
        <span className="flex items-center gap-3">
          <Logo height={22} inverse priority />
          <span className="rounded-full bg-brique-700 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-white uppercase">
            Admin
          </span>
        </span>
        <NavAdmin />
        <span className="ml-auto flex-none">
          <MenuCompte initiales={initiales} nom="Administrateur" email={email} seDeconnecter={seDeconnecter} sombre />
        </span>
      </header>
      {children}
    </div>
  );
}
