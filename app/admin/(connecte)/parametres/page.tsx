import type { Metadata } from "next";
import { ParametresAdmin } from "@/components/admin/ParametresAdmin";
import { exigerAdmin } from "@/lib/admin-serveur";
import { dateCourte } from "@/lib/format-date";
import { changementEnAttente } from "@/lib/supabase/queries/liens-email";
import { supabaseAdmin } from "@/lib/supabase/serveur";
import * as actions from "./actions";

export const metadata: Metadata = { title: "Paramètres" };

type Props = { searchParams: Promise<{ email?: string }> };

export default async function Parametres({ searchParams }: Props) {
  const { user, admin, etat } = await exigerAdmin("a-configurer");
  const [{ count }, nouvelEmail, { email: retour }] = await Promise.all([
    supabaseAdmin()
      .from("codes_recuperation_admin")
      .select("id", { count: "exact", head: true })
      .eq("admin_id", user.id)
      .is("utilise_le", null),
    changementEnAttente(user.id, "admin_id"),
    searchParams,
  ]);
  return (
    <>
      <section className="flex flex-col gap-2.5 px-[clamp(6px,1vw,12px)] pt-[clamp(18px,3vw,36px)] pb-[clamp(4px,1vw,10px)]">
        <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">
          Espace admin · Compte administrateur unique
        </span>
        <h1 className="text-[clamp(34px,4.6vw,60px)] leading-[0.98] font-extrabold tracking-[-0.045em]">Paramètres</h1>
      </section>
      <ParametresAdmin
        email={user.email ?? ""}
        nouvelEmail={nouvelEmail}
        emailConfirme={retour === "confirme"}
        mdpModifieLe={admin.mdp_modifie_le ? dateCourte(admin.mdp_modifie_le) : null}
        tfa={
          etat === "a-configurer"
            ? null
            : {
                activeLe: admin.tfa_active_le ? dateCourte(admin.tfa_active_le) : null,
                codesRestants: count ?? 0,
                codesLe: admin.codes_generes_le ? dateCourte(admin.codes_generes_le) : null,
              }
        }
        actions={{ ...actions }}
      />
    </>
  );
}
