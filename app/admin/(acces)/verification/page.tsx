import type { Metadata } from "next";
import { FormulaireAcces } from "@/components/espace/FormulaireAcces";
import { utiliserCodeRecuperation, verifierCode } from "../actions";

export const metadata: Metadata = { title: "Vérification" };

// Second facteur à la connexion. Page sans maquette : textes rédigés par Claude, à valider par Erwan.
export default function Verification() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">Espace admin</span>
        <h1 className="text-[clamp(28px,3.4vw,38px)] leading-[1.05] font-extrabold tracking-[-0.035em]">
          Vérification
        </h1>
        <p className="text-[15px] leading-[1.6] text-ink-600">
          Saisissez le code à six chiffres affiché par votre application d&apos;authentification.
        </p>
      </div>
      <FormulaireAcces
        action={verifierCode}
        bouton="Vérifier"
        champs={[
          {
            nom: "code",
            libelle: "Code à six chiffres",
            type: "text",
            inputMode: "numeric",
            autocomplete: "one-time-code",
          },
        ]}
      />
      <details className="group border-t border-line pt-5">
        <summary className="cursor-pointer text-sm font-bold text-ink-900 hover:text-brique-700">
          Appareil perdu ? Utiliser un code de récupération
        </summary>
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-[13.5px] leading-[1.6] text-ink-600">
            Chaque code ne sert qu&apos;une fois. L&apos;application d&apos;authentification devra ensuite être
            configurée à nouveau, sur votre nouvel appareil.
          </p>
          <FormulaireAcces
            action={utiliserCodeRecuperation}
            bouton="Utiliser ce code"
            champs={[
              { nom: "code_recuperation", libelle: "Code de récupération", type: "text", autocomplete: "off" },
            ]}
          />
        </div>
      </details>
    </>
  );
}
