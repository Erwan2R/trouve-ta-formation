import type { Metadata } from "next";
import Link from "next/link";
import { FormulaireAcces } from "@/components/espace/FormulaireAcces";
import { seConnecter } from "../actions";

export const metadata: Metadata = { title: "Connexion" };

type Props = { searchParams: Promise<{ erreur?: string }> };

export default async function Connexion({ searchParams }: Props) {
  const { erreur } = await searchParams;
  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">Espace organisme</span>
        <h1 className="text-[clamp(28px,3.4vw,38px)] leading-[1.05] font-extrabold tracking-[-0.035em]">Connexion</h1>
      </div>
      {erreur === "lien" && (
        <p role="alert" className="rounded-2xl border border-brique-200 bg-brique-050 px-4 py-3 text-sm text-ink-900">
          Ce lien n&apos;est plus valable. Connectez-vous, ou demandez un nouveau lien.
        </p>
      )}
      <FormulaireAcces
        action={seConnecter}
        bouton="Me connecter"
        champs={[
          { nom: "email", libelle: "Adresse email", type: "email", autocomplete: "email" },
          { nom: "mot_de_passe", libelle: "Mot de passe", type: "password", autocomplete: "current-password" },
        ]}
      />
      <p className="flex flex-wrap justify-between gap-3 text-sm">
        <Link href="/mot-de-passe-oublie/" className="font-bold">
          Mot de passe oublié ?
        </Link>
        <Link href="/inscription/" className="font-bold">
          Créer ma fiche gratuitement
        </Link>
      </p>
    </>
  );
}
