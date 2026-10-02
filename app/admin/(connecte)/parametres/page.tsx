import type { Metadata } from "next";
import { ParametresAdmin } from "@/components/admin/ParametresAdmin";
import { AuteursBlog } from "@/components/admin/AuteursBlog";
import { ReglagesSite } from "@/components/admin/ReglagesSite";
import { exigerAdmin } from "@/lib/admin-serveur";
import { EST_PRODUCTION } from "@/lib/env";
import { dateCourte } from "@/lib/format-date";
import { getAuteurs } from "@/lib/supabase/queries/admin";
import { changementEnAttente } from "@/lib/supabase/queries/liens-email";
import { supabaseAdmin } from "@/lib/supabase/serveur";
import * as actions from "./actions";

export const metadata: Metadata = { title: "Paramètres" };

type Props = { searchParams: Promise<{ email?: string }> };

export default async function Parametres({ searchParams }: Props) {
  const { user, admin, etat } = await exigerAdmin("a-configurer");
  const [{ count }, nouvelEmail, { email: retour }, { data: parametres }, auteurs] = await Promise.all([
    supabaseAdmin()
      .from("codes_recuperation_admin")
      .select("id", { count: "exact", head: true })
      .eq("admin_id", user.id)
      .is("utilise_le", null),
    changementEnAttente(user.id, "admin_id"),
    searchParams,
    supabaseAdmin().from("parametres").select("cle, valeur"),
    getAuteurs(),
  ]);
  const v = Object.fromEntries((parametres ?? []).map((p) => [p.cle, p.valeur])) as Record<string, never>;
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
      {etat === "ok" && (
        <div className="w-full max-w-[880px]">
          <ReglagesSite
            initial={{
              departement: v.seuil_page_departement,
              ville: v.seuil_page_ville,
              elargissement: v.seuil_proposition_elargissement,
              pilier: v.seuil_bloc_organismes_pilier ?? 3,
              experience: v.experience_encadrement,
            }}
            enregistrer={actions.enregistrerReglages}
          />
          <div className="mt-3.5">
            <AuteursBlog
              auteurs={auteurs
                .filter((x) => !(EST_PRODUCTION && x.est_test))
                .map((x) => ({ ...x, biographie: x.biographie ?? "" }))}
              enregistrer={actions.enregistrerAuteur}
              supprimer={actions.supprimerAuteur}
            />
          </div>
        </div>
      )}
    </>
  );
}
