"use client";

import { useEffect, useState, useTransition } from "react";
import type { RetourModeration } from "@/app/admin/(connecte)/organismes/actions";
import { TYPES_RAPPEL, type TypeRappel } from "@/contenu/admin/emails";

export type CibleModeration = { id: string; nom: string; statut: string; nbFormations: number; aCompte: boolean };
export type ModeModeration = "rappel" | "suspension" | "suppression";
export type ActionsModeration = {
  envoyerRappel: (id: string, type: TypeRappel) => Promise<RetourModeration>;
  basculerSuspension: (id: string) => Promise<RetourModeration>;
  supprimerOrganisme: (id: string, confirmation: string) => Promise<RetourModeration>;
};

const bContour =
  "cursor-pointer rounded-full border border-line-strong bg-white px-[18px] py-[13px] text-sm font-bold text-ink-900 hover:border-ink-900";
const bPlein = (fond: string) =>
  `cursor-pointer rounded-full px-5 py-[13px] text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-400 ${fond}`;

/**
 * Modales de modération (maquette « Fichier Client ») : rappel sans confirmation mais type obligatoire,
 * suspension en confirmation simple, suppression après saisie du nom de l'organisme.
 */
export function ModaleModeration({
  cible,
  mode,
  actions: a,
  onFermer,
  onFait,
  derniersEnvois,
}: {
  cible: CibleModeration;
  mode: ModeModeration;
  actions: ActionsModeration;
  onFermer: () => void;
  onFait: (message: string, mode: ModeModeration) => void;
  /** Fiche client : date du dernier rappel de chaque type, pour éviter de relancer deux fois pour la même chose. */
  derniersEnvois?: Partial<Record<TypeRappel, string>>;
}) {
  const [enCours, demarrer] = useTransition();
  const [type, setType] = useState<TypeRappel | null>(null);
  const [saisie, setSaisie] = useState("");
  const [erreur, setErreur] = useState("");
  const suspendu = cible.statut === "suspendu";
  const nomOk = saisie.trim() === cible.nom.trim();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const echap = (e: KeyboardEvent) => e.key === "Escape" && onFermer();
    document.addEventListener("keydown", echap);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", echap);
    };
  }, [onFermer]);

  const lancer = (f: () => Promise<RetourModeration>) =>
    demarrer(async () => {
      const r = await f();
      if (r.ok) onFait(r.message, mode);
      else setErreur(r.erreur);
    });

  const pied = (bouton: React.ReactNode) => (
    <span className="flex flex-wrap justify-end gap-2">
      <button type="button" className={bContour} onClick={onFermer}>
        Annuler
      </button>
      {bouton}
    </span>
  );
  const titre = "text-[22px] font-extrabold tracking-[-0.025em]";

  return (
    <div onClick={onFermer} className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/55 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modale-titre"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-[520px] flex-col gap-4 overflow-y-auto rounded-[28px] bg-white p-[clamp(22px,3vw,30px)] shadow-menu"
      >
        <span className="font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase">{cible.nom}</span>

        {mode === "rappel" && (
          <>
            <span className="flex flex-col gap-1.5">
              <span id="modale-titre" className={titre}>
                Envoyer un rappel
              </span>
              <span className="text-sm leading-[1.55] text-ink-500">
                Un email pré-rédigé part à l&apos;adresse de connexion de l&apos;organisme.
              </span>
            </span>
            <div role="radiogroup" aria-label="Type de rappel" className="flex flex-col gap-2">
              {TYPES_RAPPEL.map((t) => {
                const choisi = type === t.type;
                return (
                  <button
                    key={t.type}
                    type="button"
                    role="radio"
                    aria-checked={choisi}
                    onClick={() => (setType(t.type), setErreur(""))}
                    className={`flex cursor-pointer items-center gap-3.5 rounded-[14px] border-[1.5px] px-4 py-3.5 text-left text-[14.5px] font-bold ${choisi ? "border-ink-900 bg-white" : "border-line bg-cream-100"}`}
                  >
                    <span
                      className={`flex size-5 flex-none items-center justify-center rounded-full border-[1.5px] ${choisi ? "border-ink-900" : "border-line-heavy"}`}
                    >
                      <span className={`block size-2.5 rounded-full ${choisi ? "bg-ink-900" : ""}`} />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      {t.libelle}
                      {derniersEnvois && (
                        <span className="font-mono text-[11px] font-normal text-ink-400">
                          {derniersEnvois[t.type] ? `Dernier envoi : ${derniersEnvois[t.type]}` : "Jamais envoyé"}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            {!cible.aCompte && (
              <span className="text-[13px] text-brique-700">Cet organisme n&apos;a pas de compte de connexion.</span>
            )}
          </>
        )}

        {mode === "suspension" && (
          <>
            <span id="modale-titre" className={titre}>
              {suspendu ? "Réactiver ce compte ?" : "Suspendre ce compte ?"}
            </span>
            <span className="text-[14.5px] leading-[1.6] text-ink-700">
              {suspendu
                ? "La fiche sera republiée sur le site public."
                : "Le compte est bloqué et la fiche est dépubliée du site public. L'organisme pourra se connecter et verra un message de suspension. La suspension est réversible."}
            </span>
          </>
        )}

        {mode === "suppression" && (
          <>
            <span id="modale-titre" className={titre}>
              Supprimer le compte et la fiche
            </span>
            <span className="text-[14.5px] leading-[1.6] text-ink-700">
              Le compte, la fiche et{" "}
              {cible.nbFormations === 0
                ? "ses données"
                : `ses ${cible.nbFormations} formation${cible.nbFormations > 1 ? "s déclarées" : " déclarée"}`}{" "}
              sont supprimés immédiatement. Cette action ne peut pas être annulée.
            </span>
            <label className="flex flex-col gap-2">
              <span className="text-[13.5px] leading-normal font-semibold">
                Saisissez le nom de l&apos;organisme : <strong>{cible.nom}</strong>
              </span>
              <input
                type="text"
                autoComplete="off"
                value={saisie}
                onChange={(e) => (setSaisie(e.target.value), setErreur(""))}
                className={`w-full rounded-[14px] border-[1.5px] bg-white px-[15px] py-[13px] text-[15px] outline-none ${nomOk ? "border-brique-700" : "border-line-strong"}`}
              />
            </label>
          </>
        )}

        {erreur && (
          <span role="alert" className="text-[13px] font-bold text-brique-700">
            {erreur}
          </span>
        )}

        {mode === "rappel" &&
          pied(
            <button
              type="button"
              disabled={!type || !cible.aCompte || enCours}
              onClick={() => type && lancer(() => a.envoyerRappel(cible.id, type))}
              className={`${bPlein("bg-ink-900 hover:bg-brique-700")} px-[22px]`}
            >
              Envoyer
            </button>,
          )}
        {mode === "suspension" &&
          pied(
            <button
              type="button"
              disabled={enCours}
              onClick={() => lancer(() => a.basculerSuspension(cible.id))}
              className={bPlein("bg-ink-900 hover:bg-brique-700")}
            >
              {suspendu ? "Réactiver" : "Suspendre"}
            </button>,
          )}
        {mode === "suppression" &&
          pied(
            <button
              type="button"
              disabled={!nomOk || enCours}
              onClick={() => lancer(() => a.supprimerOrganisme(cible.id, saisie))}
              className={bPlein("bg-brique-700 hover:bg-ink-900")}
            >
              Supprimer définitivement
            </button>,
          )}
      </div>
    </div>
  );
}

/** Confirmation d'une action (maquette : pastille noire en bas d'écran, fermeture manuelle ou après 3,8 s). */
export function ToastAdmin({ message, onFermer }: { message: string; onFermer: () => void }) {
  useEffect(() => {
    const t = setTimeout(onFermer, 3800);
    return () => clearTimeout(t);
  }, [message, onFermer]);
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-[120] flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-3.5 rounded-full bg-ink-900 py-3 pr-3 pl-5 text-white shadow-menu"
    >
      <span aria-hidden="true" className="block size-2 flex-none rounded-full bg-brique-400" />
      <span className="text-sm leading-[1.4] font-semibold">{message}</span>
      <button
        type="button"
        aria-label="Fermer"
        onClick={onFermer}
        className="size-[30px] flex-none cursor-pointer rounded-full bg-line-dark text-[15px] text-white"
      >
        ×
      </button>
    </div>
  );
}
