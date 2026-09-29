import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Parametres } from "@/components/espace/Parametres";
import { getEspace } from "@/lib/supabase/queries/espace";
import * as actions from "./actions";

export const metadata: Metadata = { title: "Paramètres" };

/** Paramètres : connexion, informations internes, suppression du compte. Rien n'y est public (UX Paramètres). */
export default async function PageParametres() {
  const [{ user, compte, organisme, offresActives }, magasin] = await Promise.all([getEspace(), cookies()]);
  return (
    <>
      <section className="flex flex-col gap-2.5 px-[clamp(6px,1vw,12px)] pt-[clamp(18px,3vw,36px)] pb-[clamp(4px,1vw,10px)]">
        <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">
          Espace organisme · {organisme.nom}
        </span>
        <h1 className="text-[clamp(34px,4.6vw,60px)] leading-[0.98] font-extrabold tracking-[-0.045em]">Paramètres</h1>
        <p className="max-w-[60ch] text-base leading-[1.6] text-ink-700">
          La gestion de votre compte. Rien sur cette page n&apos;apparaît sur votre fiche publique.
        </p>
      </section>
      <Parametres
        actions={{ ...actions }}
        email={user.email}
        nouvelEmail={user.nouvelEmail}
        reinitialisation={magasin.get("reinitialisation")?.value === "1"}
        infos={{ contact_nom: compte.contact_nom ?? "", contact_telephone: compte.contact_telephone ?? "" }}
        nomOrganisme={organisme.nom}
        nbFormations={offresActives.length}
      />
    </>
  );
}
