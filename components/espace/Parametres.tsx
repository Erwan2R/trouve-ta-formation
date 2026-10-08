"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Retour } from "@/lib/supabase/queries/apres-enregistrement";

type Actions = {
  changerEmail: (e: string) => Promise<Retour>;
  annulerChangementEmail: () => Promise<Retour>;
  renvoyerLienEmail: () => Promise<Retour>;
  changerMotDePasse: (d: { actuel: string; nouveau: string; confirmation: string }) => Promise<Retour>;
  enregistrerInfos: (d: { contact_nom: string; contact_telephone: string }) => Promise<Retour>;
  supprimerCompte: (c: string) => Promise<Retour>;
  seDeconnecter: () => Promise<void>;
};

const carte = "flex flex-col gap-5 rounded-[28px] border border-line bg-white p-[clamp(22px,3vw,34px)]";
const bloc = "flex flex-col gap-3.5 rounded-[20px] border border-line px-5 py-[18px]";
const champBase =
  "w-full rounded-[14px] border border-line px-[15px] py-[13px] text-[15px] outline-none focus:border-ink-900";
const champ = `${champBase} bg-white`;
const surtitre = "font-mono text-[10.5px] tracking-[0.1em] text-ink-400 uppercase";
const bPlein =
  "cursor-pointer rounded-full bg-ink-900 px-[18px] py-3 text-sm font-bold text-white hover:bg-brique-700 disabled:cursor-default disabled:bg-line disabled:text-ink-400";
const bContour =
  "cursor-pointer rounded-full border border-line-strong bg-white px-[18px] py-3 text-sm font-bold text-ink-900 hover:border-ink-900";

export function Parametres({
  email,
  nouvelEmail,
  reinitialisation,
  infos,
  nomOrganisme,
  nbFormations,
  actions: a,
}: {
  email: string;
  nouvelEmail: string | null;
  reinitialisation: boolean;
  infos: { contact_nom: string; contact_telephone: string };
  nomOrganisme: string;
  nbFormations: number;
  actions: Actions;
}) {
  const router = useRouter();
  const [enCours, demarrer] = useTransition();
  const [emailMode, setEmailMode] = useState<"repos" | "edition" | "attente">(nouvelEmail ? "attente" : "repos");
  const [saisieEmail, setSaisieEmail] = useState("");
  const [enAttente, setEnAttente] = useState(nouvelEmail ?? "");
  const [erreurEmail, setErreurEmail] = useState("");
  const [renvoye, setRenvoye] = useState(false);

  const [mdpMode, setMdpMode] = useState<"repos" | "edition">(reinitialisation ? "edition" : "repos");
  const [mdp, setMdp] = useState({ actuel: "", nouveau: "", confirmation: "" });
  const [mdpFait, setMdpFait] = useState<string | null>(null);
  const [erreurMdp, setErreurMdp] = useState("");
  const erreurLocale =
    !reinitialisation && !mdp.actuel
      ? "Saisissez votre mot de passe actuel."
      : mdp.nouveau.length < 10
        ? "Le nouveau mot de passe doit contenir au moins 10 caractères."
        : mdp.nouveau !== mdp.confirmation
          ? "Les deux mots de passe ne correspondent pas."
          : "";
  const touche = !!(mdp.actuel || mdp.nouveau || mdp.confirmation);

  const [info, setInfo] = useState(infos);
  const [infoEnregistree, setInfoEnregistree] = useState(infos);
  const [infoStatut, setInfoStatut] = useState<{ heure?: string; erreur?: string }>({});
  const infoSale = JSON.stringify(info) !== JSON.stringify(infoEnregistree);

  const [saisieSuppr, setSaisieSuppr] = useState("");
  const [erreurSuppr, setErreurSuppr] = useState("");
  const supprOk = saisieSuppr.trim() === nomOrganisme.trim();

  const lancer = (f: () => Promise<Retour>, ok: (r: Extract<Retour, { ok: true }>) => void, ko: (e: string) => void) =>
    demarrer(async () => {
      const r = await f();
      if (r.ok) ok(r);
      else ko(r.erreur);
    });

  return (
    <div className="flex w-full max-w-[880px] flex-col gap-3.5">
      <section className={carte}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] text-brique-700">01</span>
            <h2 className="text-2xl leading-[1.15] font-extrabold tracking-[-0.025em]">Connexion</h2>
          </div>
          <button
            type="button"
            onClick={() =>
              demarrer(async () => {
                await a.seDeconnecter();
                window.location.assign("/connexion/");
              })
            }
            className="cursor-pointer text-[13.5px] font-bold text-ink-700 hover:text-brique-700"
          >
            Se déconnecter
          </button>
        </div>

        <div className={bloc}>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
            <span className="flex min-w-0 flex-col gap-1">
              <span className={surtitre}>Email de connexion</span>
              <span className="text-base font-bold [overflow-wrap:anywhere]">{email}</span>
            </span>
            {emailMode === "repos" && (
              <button
                type="button"
                className={bContour}
                onClick={() => (setEmailMode("edition"), setSaisieEmail(""), setErreurEmail(""))}
              >
                Modifier
              </button>
            )}
          </div>
          <span className="text-[13px] leading-[1.55] text-ink-500">
            Votre identifiant, jamais affiché publiquement. L&apos;email de contact visible sur votre fiche se gère dans{" "}
            <Link href="/ma-fiche/#coordonnees" className="font-bold">
              Ma fiche
            </Link>
            .
          </span>
          {emailMode === "edition" && (
            <div className="flex flex-col gap-3 rounded-2xl bg-cream-100 p-4">
              <label className="flex flex-col gap-[7px]">
                <span className="text-[13.5px] font-bold">Nouvel email de connexion</span>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="nom@organisme.fr"
                  className={champ}
                  value={saisieEmail}
                  onChange={(e) => (setSaisieEmail(e.target.value), setErreurEmail(""))}
                />
              </label>
              {erreurEmail && (
                <span role="alert" className="text-[13px] font-bold text-brique-700">
                  {erreurEmail}
                </span>
              )}
              <span className="text-[13px] leading-[1.55] text-ink-500">
                Nous enverrons un lien de confirmation à cette adresse. Votre email actuel reste actif jusqu&apos;à la
                confirmation.
              </span>
              <span className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={enCours}
                  className={bPlein}
                  onClick={() =>
                    lancer(
                      () => a.changerEmail(saisieEmail),
                      () => (setEnAttente(saisieEmail.trim()), setEmailMode("attente"), setRenvoye(false)),
                      setErreurEmail,
                    )
                  }
                >
                  Envoyer le lien de confirmation
                </button>
                <button type="button" className={bContour} onClick={() => setEmailMode("repos")}>
                  Annuler
                </button>
              </span>
            </div>
          )}
          {emailMode === "attente" && (
            <div className="flex flex-col gap-2.5 rounded-2xl border border-brique-200 bg-brique-050 p-4">
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-brique-700 uppercase">
                En attente de confirmation
              </span>
              <span className="text-[14.5px] leading-[1.55]">
                Un lien a été envoyé à <strong>{enAttente}</strong>. Tant qu&apos;il n&apos;est pas confirmé, vous
                continuez à vous connecter avec {email}.
              </span>
              {erreurEmail && (
                <span role="alert" className="text-[13px] font-bold text-brique-700">
                  {erreurEmail}
                </span>
              )}
              <span className="flex flex-wrap gap-x-4 gap-y-2">
                <button
                  type="button"
                  disabled={enCours || renvoye}
                  className="cursor-pointer text-[13.5px] font-bold text-ink-900 disabled:cursor-default"
                  onClick={() => lancer(a.renvoyerLienEmail, () => setRenvoye(true), setErreurEmail)}
                >
                  {renvoye ? "Lien renvoyé" : "Renvoyer le lien"}
                </button>
                <button
                  type="button"
                  disabled={enCours}
                  className="cursor-pointer text-[13.5px] font-bold text-brique-700"
                  onClick={() => lancer(a.annulerChangementEmail, () => setEmailMode("repos"), setErreurEmail)}
                >
                  Annuler le changement
                </button>
              </span>
            </div>
          )}
        </div>

        <div className={bloc}>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
            <span className="flex flex-col gap-1">
              <span className={surtitre}>Mot de passe</span>
              <span className="flex items-center gap-3">
                <span aria-label="Mot de passe masqué" className="text-base font-bold tracking-[0.18em]">
                  ••••••••••
                </span>
                {mdpFait && <span className="text-[13px] text-ink-500">Modifié aujourd&apos;hui à {mdpFait}</span>}
              </span>
            </span>
            {mdpMode === "repos" && (
              <button
                type="button"
                className={bContour}
                onClick={() => (
                  setMdpMode("edition"),
                  setMdp({ actuel: "", nouveau: "", confirmation: "" }),
                  setMdpFait(null),
                  setErreurMdp("")
                )}
              >
                Modifier
              </button>
            )}
          </div>
          {mdpMode === "edition" && (
            <div className="flex flex-col gap-3 rounded-2xl bg-cream-100 p-4">
              {reinitialisation ? (
                <span className="text-[13.5px] leading-[1.55] font-bold">Choisissez votre nouveau mot de passe.</span>
              ) : (
                <label className="flex flex-col gap-[7px]">
                  <span className="text-[13.5px] font-bold">Mot de passe actuel</span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    className={champ}
                    value={mdp.actuel}
                    onChange={(e) => setMdp({ ...mdp, actuel: e.target.value })}
                  />
                </label>
              )}
              <span className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3">
                <label className="flex flex-col gap-[7px]">
                  <span className="text-[13.5px] font-bold">Nouveau mot de passe</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className={champ}
                    value={mdp.nouveau}
                    onChange={(e) => setMdp({ ...mdp, nouveau: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-[7px]">
                  <span className="text-[13.5px] font-bold">Confirmer le nouveau mot de passe</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className={champ}
                    value={mdp.confirmation}
                    onChange={(e) => setMdp({ ...mdp, confirmation: e.target.value })}
                  />
                </label>
              </span>
              <span
                role={erreurMdp ? "alert" : undefined}
                className={`text-[13px] leading-[1.55] ${erreurMdp || (touche && erreurLocale) ? "font-bold text-brique-700" : "text-ink-500"}`}
              >
                {erreurMdp ||
                  (touche && erreurLocale) ||
                  (erreurLocale ? "Au moins 10 caractères." : "Les deux mots de passe correspondent.")}
              </span>
              <span className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!!erreurLocale || enCours}
                  className={bPlein}
                  onClick={() =>
                    lancer(
                      () => a.changerMotDePasse(mdp),
                      (r) => (setMdpFait(r.heure), setMdpMode("repos"), router.replace("/parametres/")),
                      setErreurMdp,
                    )
                  }
                >
                  Enregistrer le mot de passe
                </button>
                {!reinitialisation && (
                  <button type="button" className={bContour} onClick={() => setMdpMode("repos")}>
                    Annuler
                  </button>
                )}
              </span>
            </div>
          )}
          {mdpMode === "repos" && mdpFait && (
            <span role="status" className="flex items-center gap-2 text-[13.5px] leading-[1.55]">
              <span aria-hidden="true" className="block size-[7px] flex-none rounded-full bg-ink-900" />
              Mot de passe modifié. Un email de confirmation a été envoyé à {email}.
            </span>
          )}
        </div>
      </section>

      <section className={carte}>
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2.5">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] text-brique-700">02</span>
            <h2 className="text-2xl leading-[1.15] font-extrabold tracking-[-0.025em]">Informations du compte</h2>
          </div>
          <span className="inline-flex items-center gap-[7px] rounded-full border-[1.5px] border-dashed border-ink-300 px-3 py-[5px] font-mono text-[10.5px] tracking-[0.1em] text-ink-600 uppercase">
            Usage interne, jamais public
          </span>
        </div>
        <p className="-mt-1.5 max-w-[62ch] text-[14.5px] leading-[1.6] text-ink-500">
          Ces coordonnées nous servent à vous joindre directement si besoin, par exemple pour une vérification
          d&apos;autorisation d&apos;exercice. Elles ne remplacent pas celles de votre fiche.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
          <label className="flex flex-col gap-[7px]">
            <span className="text-[13.5px] font-bold">Nom du contact principal</span>
            <input
              autoComplete="name"
              className={`${champBase} bg-cream-100 focus:bg-white`}
              value={info.contact_nom}
              onChange={(e) => (setInfo({ ...info, contact_nom: e.target.value }), setInfoStatut({}))}
            />
          </label>
          <label className="flex flex-col gap-[7px]">
            <span className="text-[13.5px] font-bold">Téléphone direct</span>
            <input
              type="tel"
              autoComplete="tel"
              className={`${champBase} bg-cream-100 font-mono text-[14.5px] focus:bg-white`}
              value={info.contact_telephone}
              onChange={(e) => (setInfo({ ...info, contact_telephone: e.target.value }), setInfoStatut({}))}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-[18px]">
          <span
            role="status"
            className={`flex items-center gap-2 text-[13px] ${infoStatut.erreur || infoSale ? "text-brique-700" : "text-ink-600"} ${infoStatut.erreur ? "font-bold" : ""}`}
          >
            {infoStatut.erreur ??
              (infoSale
                ? "Modifications non enregistrées"
                : infoStatut.heure
                  ? `Enregistré à ${infoStatut.heure}`
                  : "")}
          </span>
          <span className="flex gap-2">
            {infoSale && (
              <button type="button" className={bContour} onClick={() => setInfo(infoEnregistree)}>
                Annuler
              </button>
            )}
            <button
              type="button"
              disabled={!infoSale || enCours}
              className={`${bPlein} px-5 py-[13px]`}
              onClick={() =>
                lancer(
                  () => a.enregistrerInfos(info),
                  (r) => (setInfoEnregistree(info), setInfoStatut({ heure: r.heure }), router.refresh()),
                  (e) => setInfoStatut({ erreur: e }),
                )
              }
            >
              Enregistrer
            </button>
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-[18px] rounded-[28px] border-[1.5px] border-brique-700 bg-white p-[clamp(22px,3vw,34px)]">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] tracking-[0.12em] text-brique-700 uppercase">
            03 · Zone dangereuse
          </span>
          <h2 className="text-2xl leading-[1.15] font-extrabold tracking-[-0.025em]">Supprimer le compte</h2>
        </div>
        <p className="max-w-[62ch] text-[15px] leading-[1.65] text-ink-700">
          La suppression est immédiate et définitive. Elle ne peut pas être annulée. Vous pouvez d&apos;abord{" "}
          <a href="/parametres/export/" download className="font-bold underline">
            télécharger vos données
          </a>{" "}
          (fichier JSON).
        </p>
        <ul className="flex flex-col border-t border-cream-200">
          {[
            "Votre fiche est retirée du catalogue, de la page d'accueil et des pages formation.",
            nbFormations === 0
              ? "Vos formations déclarées sont supprimées avec le compte."
              : nbFormations === 1
                ? "Votre formation déclarée est supprimée avec le compte."
                : `Vos ${nbFormations} formations déclarées sont supprimées avec le compte.`,
            "Toutes vos données sont effacées au même moment.",
          ].map((t, i) => (
            <li key={t} className="flex gap-3 border-b border-cream-200 py-[11px] text-[14.5px] leading-[1.55]">
              <span className="flex-none pt-[3px] font-mono text-[11px] text-brique-700">0{i + 1}</span>
              {t}
            </li>
          ))}
        </ul>
        <label className="flex flex-col gap-2">
          <span className="text-[13.5px] leading-normal font-semibold">
            Pour confirmer, saisissez le nom de votre organisme : <strong>{nomOrganisme}</strong>
          </span>
          <input
            autoComplete="off"
            className={`w-full rounded-[14px] border-[1.5px] bg-white px-[15px] py-[13px] text-[15px] outline-none ${supprOk ? "border-brique-700" : "border-line-strong"}`}
            value={saisieSuppr}
            onChange={(e) => (setSaisieSuppr(e.target.value), setErreurSuppr(""))}
          />
        </label>
        {erreurSuppr && (
          <span role="alert" className="text-[13px] font-bold text-brique-700">
            {erreurSuppr}
          </span>
        )}
        <button
          type="button"
          disabled={!supprOk || enCours}
          onClick={() =>
            lancer(
              () => a.supprimerCompte(saisieSuppr),
              () => window.location.assign("/auth/suppression/"),
              setErreurSuppr,
            )
          }
          className="cursor-pointer self-start rounded-full bg-brique-700 px-[22px] py-[15px] text-[14.5px] font-bold text-white hover:bg-ink-900 disabled:cursor-default disabled:bg-line disabled:text-ink-400"
        >
          Supprimer définitivement le compte
        </button>
      </section>
    </div>
  );
}
