import type { Metadata } from "next";
import Link from "next/link";
import { FormulaireAcces } from "@/components/espace/FormulaireAcces";
import { sInscrire } from "../actions";

export const metadata: Metadata = { title: "Créer ma fiche" };

/** Création de compte : 3 champs, rien d'autre avant que le compte existe (spec Inscription §3). */
export default function Inscription() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">
          Espace organisme · Gratuit
        </span>
        <h1 className="text-[clamp(28px,3.4vw,38px)] leading-[1.05] font-extrabold tracking-[-0.035em]">
          Créer la fiche de votre organisme
        </h1>
        <p className="text-[15px] leading-[1.6] text-ink-500">
          Trois informations pour commencer. Vous compléterez votre fiche ensuite, à votre rythme.
        </p>
      </div>
      <FormulaireAcces
        action={sInscrire}
        bouton="Créer mon compte"
        turnstile={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined}
        champs={[
          {
            nom: "nom_organisme",
            libelle: "Nom de l'organisme",
            type: "text",
            autocomplete: "organization",
          },
          {
            nom: "email",
            libelle: "Adresse email",
            type: "email",
            autocomplete: "email",
            aide: "Elle sert à vous connecter. Elle n'est jamais affichée sur votre fiche.",
          },
          {
            nom: "mot_de_passe",
            libelle: "Mot de passe",
            type: "password",
            autocomplete: "new-password",
            minLength: 10,
            aide: "Au moins 10 caractères.",
          },
        ]}
      />
      <p className="text-sm text-ink-500">
        Déjà un compte ?{" "}
        <Link href="/connexion/" className="font-bold">
          Se connecter
        </Link>
      </p>
    </>
  );
}
