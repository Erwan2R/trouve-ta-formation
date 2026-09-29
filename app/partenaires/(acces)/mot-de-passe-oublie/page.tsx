import type { Metadata } from "next";
import Link from "next/link";
import { FormulaireAcces } from "@/components/espace/FormulaireAcces";
import { reinitialiserMotDePasse } from "../actions";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default function MotDePasseOublie() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">Espace organisme</span>
        <h1 className="text-[clamp(28px,3.4vw,38px)] leading-[1.05] font-extrabold tracking-[-0.035em]">
          Mot de passe oublié
        </h1>
        <p className="text-[15px] leading-[1.6] text-ink-500">
          Indiquez l&apos;adresse email de connexion à votre espace. Nous vous enverrons un lien pour choisir un nouveau
          mot de passe.
        </p>
      </div>
      <FormulaireAcces
        action={reinitialiserMotDePasse}
        bouton="Recevoir le lien"
        champs={[{ nom: "email", libelle: "Adresse email", type: "email", autocomplete: "email" }]}
      />
      <Link href="/connexion/" className="text-sm font-bold">
        ← Retour à la connexion
      </Link>
    </>
  );
}
