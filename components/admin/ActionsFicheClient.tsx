"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { TypeRappel } from "@/contenu/admin/emails";
import {
  type ActionsModeration,
  type CibleModeration,
  ModaleModeration,
  type ModeModeration,
  ToastAdmin,
} from "./Moderation";

const bouton = "cursor-pointer rounded-full px-[18px] py-[13px] text-sm font-bold transition-colors";

/** Actions de modération de la Fiche client, en en-tête (UX Fiche client §1) : même mécanique que le Fichier client. */
export function ActionsFicheClient({
  cible,
  derniersEnvois,
  desabonneLe,
  actions,
}: {
  cible: CibleModeration;
  derniersEnvois: Partial<Record<TypeRappel, string>>;
  /** Date du désabonnement des rappels, ou null. */
  desabonneLe: string | null;
  actions: ActionsModeration;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<ModeModeration | null>(null);
  const [toast, setToast] = useState("");
  const fermer = useCallback(() => setMode(null), []);
  const fermerToast = useCallback(() => setToast(""), []);
  const suspendu = cible.statut === "suspendu";

  return (
    <>
      <div className="flex flex-none flex-wrap gap-2">
        <button
          type="button"
          disabled={!!desabonneLe}
          title={
            desabonneLe ? `L'organisme ne souhaite plus recevoir de rappels (depuis le ${desabonneLe})` : undefined
          }
          onClick={() => setMode("rappel")}
          className={`${bouton} bg-ink-900 text-white hover:bg-brique-700 disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-400`}
        >
          {desabonneLe ? "Rappels refusés" : "Envoyer un rappel"}
        </button>
        <button
          type="button"
          onClick={() => setMode("suspension")}
          className={`${bouton} border border-ink-900 bg-white text-ink-900 hover:bg-cream-200`}
        >
          {suspendu ? "Réactiver le compte" : "Suspendre le compte"}
        </button>
        <button
          type="button"
          onClick={() => setMode("suppression")}
          className={`${bouton} border border-brique-700 bg-white text-brique-700 hover:bg-brique-050`}
        >
          Supprimer le compte
        </button>
      </div>
      {mode && (
        <ModaleModeration
          cible={cible}
          mode={mode}
          actions={actions}
          derniersEnvois={derniersEnvois}
          onFermer={fermer}
          onFait={(message, m) => {
            setMode(null);
            // Suppression : la page se recharge sans l'organisme et affiche son écran de fin (not-found.tsx).
            if (m === "suppression") return router.refresh();
            setToast(message);
            router.refresh();
          }}
        />
      )}
      {toast && <ToastAdmin message={toast} onFermer={fermerToast} />}
    </>
  );
}
