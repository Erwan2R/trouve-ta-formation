import type { Metadata } from "next";
import { FormulaireAcces } from "@/components/espace/FormulaireAcces";
import { seConnecter } from "../actions";

export const metadata: Metadata = { title: "Connexion" };

type Props = { searchParams: Promise<{ erreur?: string }> };

// Textes rédigés par Claude (page sans maquette) : à valider par Erwan.
const ERREURS: Record<string, string> = {
  expire: "Votre session a expiré au bout de 8 heures. Reconnectez-vous.",
  refuse: "Ce compte n'a pas accès à l'espace admin.",
  lien: "Ce lien n'est plus valable.",
};

export default async function Connexion({ searchParams }: Props) {
  const { erreur } = await searchParams;
  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">Espace admin</span>
        <h1 className="text-[clamp(28px,3.4vw,38px)] leading-[1.05] font-extrabold tracking-[-0.035em]">Connexion</h1>
      </div>
      {erreur && ERREURS[erreur] && (
        <p role="alert" className="rounded-2xl border border-brique-200 bg-brique-050 px-4 py-3 text-sm text-ink-900">
          {ERREURS[erreur]}
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
    </>
  );
}
