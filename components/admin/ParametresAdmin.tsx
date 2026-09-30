"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { Configuration } from "@/app/admin/(connecte)/parametres/actions";
import type { Retour } from "@/lib/supabase/queries/apres-enregistrement";

type Codes = { ok: true; codes: string[] } | { ok: false; erreur: string };
type Actions = {
  changerEmail: (e: string) => Promise<Retour>;
  annulerChangementEmail: () => Promise<Retour>;
  renvoyerLienEmail: () => Promise<Retour>;
  changerMotDePasse: (d: { actuel: string; nouveau: string; confirmation: string }) => Promise<Retour>;
  demarrerConfiguration: () => Promise<Configuration>;
  verifierConfiguration: (facteur: string, code: string) => Promise<Codes>;
  regenererCodes: (code: string) => Promise<Codes>;
};

const carte = "flex flex-col gap-5 rounded-[28px] bg-white p-[clamp(22px,3vw,34px)]";
const bloc = "flex flex-col gap-3.5 rounded-[20px] border border-line px-5 py-[18px]";
const champ =
  "w-full rounded-[14px] border border-line bg-white px-[15px] py-[13px] text-[15px] outline-none focus:border-ink-900";
const surtitre = "font-mono text-[10.5px] tracking-[0.1em] text-ink-400 uppercase";
const bPlein =
  "cursor-pointer rounded-full bg-ink-900 px-[18px] py-3 text-sm font-bold text-white hover:bg-brique-700 disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-400";
const bContour =
  "cursor-pointer rounded-full border border-line-strong bg-white px-[18px] py-3 text-sm font-bold text-ink-900 hover:border-ink-900";
const champCode = (erreur: boolean) =>
  `w-[200px] max-w-full rounded-[14px] border-[1.5px] bg-white px-3.5 py-3 font-mono text-2xl tracking-[0.3em] outline-none focus:border-ink-900 ${erreur ? "border-brique-700" : "border-line"}`;
const MIN = 12;

function Titre({ n, titre }: { n: string; titre: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] text-brique-700">{n}</span>
      <h2 className="text-2xl leading-[1.15] font-extrabold tracking-[-0.025em]">{titre}</h2>
    </div>
  );
}

function ChampCode({ valeur, erreur, onChange }: { valeur: string; erreur: string; onChange: (v: string) => void }) {
  return (
    <>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="000000"
        aria-label="Code à six chiffres"
        className={champCode(!!erreur)}
        value={valeur}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
      />
      {erreur && (
        <span role="alert" className="text-[13px] font-bold text-brique-700">
          {erreur}
        </span>
      )}
    </>
  );
}

/** Paramètres admin (maquette « Parametres Admin ») : 01 Connexion, 02 Authentification à deux facteurs. */
export function ParametresAdmin({
  email,
  nouvelEmail,
  emailConfirme,
  mdpModifieLe,
  tfa,
  actions: a,
}: {
  email: string;
  nouvelEmail: string | null;
  emailConfirme: boolean;
  mdpModifieLe: string | null;
  /** null : 2FA à configurer (premier accès, ou après usage d'un code de récupération). */
  tfa: { activeLe: string | null; codesRestants: number; codesLe: string | null } | null;
  actions: Actions;
}) {
  const router = useRouter();
  const [enCours, demarrer] = useTransition();
  const [toast, setToast] = useState(emailConfirme ? "Nouvel email de connexion confirmé." : "");
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  // 01 · Email
  const [emailMode, setEmailMode] = useState<"repos" | "edition" | "attente">(nouvelEmail ? "attente" : "repos");
  const [saisieEmail, setSaisieEmail] = useState("");
  const [enAttente, setEnAttente] = useState(nouvelEmail ?? "");
  const [erreurEmail, setErreurEmail] = useState("");
  const [renvoye, setRenvoye] = useState(false);

  // 01 · Mot de passe
  const [mdpMode, setMdpMode] = useState<"repos" | "edition">("repos");
  const [mdp, setMdp] = useState({ actuel: "", nouveau: "", confirmation: "" });
  const [mdpFait, setMdpFait] = useState<string | null>(null);
  const [erreurMdp, setErreurMdp] = useState("");
  const erreurLocale = !mdp.actuel
    ? "Saisissez votre mot de passe actuel."
    : mdp.nouveau.length < MIN
      ? `Le nouveau mot de passe doit contenir au moins ${MIN} caractères.`
      : mdp.nouveau === mdp.actuel
        ? "Le nouveau mot de passe doit être différent de l'actuel."
        : mdp.nouveau !== mdp.confirmation
          ? "Les deux mots de passe ne correspondent pas."
          : "";
  const touche = !!(mdp.actuel || mdp.nouveau || mdp.confirmation);

  // 02 · 2FA
  const actif = tfa !== null;
  const [tfaMode, setTfaMode] = useState<"repos" | "configuration" | "regeneration" | "codes">(
    actif ? "repos" : "configuration",
  );
  const [config, setConfig] = useState<Extract<Configuration, { ok: true }> | null>(null);
  const [otp, setOtp] = useState("");
  const [erreurOtp, setErreurOtp] = useState("");
  const [codes, setCodes] = useState<string[]>([]);
  const [conserves, setConserves] = useState(false);
  const [copies, setCopies] = useState(false);

  const ouvrirConfiguration = () => {
    setTfaMode("configuration");
    setOtp("");
    setErreurOtp("");
    setConfig(null);
    demarrer(async () => {
      const r = await a.demarrerConfiguration();
      if (r.ok) setConfig(r);
      else setErreurOtp(r.erreur);
    });
  };
  // Premier accès : la configuration s'ouvre d'elle-même, sans bouton d'annulation.
  useEffect(() => {
    if (!actif) ouvrirConfiguration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recevoirCodes = (r: Codes) => {
    if (!r.ok) return setErreurOtp(r.erreur);
    setCodes(r.codes);
    setConserves(false);
    setCopies(false);
    setOtp("");
    setTfaMode("codes");
  };

  const lancer = (f: () => Promise<Retour>, ok: (r: Extract<Retour, { ok: true }>) => void, ko: (e: string) => void) =>
    demarrer(async () => {
      const r = await f();
      if (r.ok) ok(r);
      else ko(r.erreur);
    });

  const bas = (tfa?.codesRestants ?? 0) <= 3;
  const otpOk = /^\d{6}$/.test(otp);

  return (
    <div className="flex w-full max-w-[880px] flex-col gap-3.5">
      {!actif && tfaMode !== "codes" && (
        <div role="alert" className="flex flex-col gap-1.5 rounded-[22px] bg-ink-900 px-[22px] py-[18px] text-white">
          <span className="font-mono text-[10.5px] tracking-[0.12em] text-brique-400 uppercase">
            Sécurisation du compte à terminer
          </span>
          <span className="text-[15px] leading-[1.55] text-pretty text-line">
            L&apos;authentification à deux facteurs est obligatoire pour le compte administrateur. Configurez-la
            ci-dessous pour accéder au reste de l&apos;espace admin.
          </span>
        </div>
      )}

      <section className={`${carte} border border-line`}>
        <Titre n="01" titre="Connexion" />

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
          {emailMode === "edition" && (
            <div className="flex flex-col gap-3 rounded-2xl bg-cream-100 p-4">
              <label className="flex flex-col gap-[7px]">
                <span className="text-[13.5px] font-bold">Nouvel email de connexion</span>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="nom@trouve-ta-formation.fr"
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
              <span className="text-[13px] leading-[1.55] text-ink-600">
                Un lien de confirmation sera envoyé à cette adresse. L&apos;email actuel reste actif jusqu&apos;à la
                confirmation, pour qu&apos;une faute de frappe ne bloque jamais l&apos;accès au compte.
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
                  className="cursor-pointer text-[13.5px] font-bold text-ink-900 hover:text-brique-700 disabled:cursor-default"
                  onClick={() => lancer(a.renvoyerLienEmail, () => setRenvoye(true), setErreurEmail)}
                >
                  {renvoye ? "Lien renvoyé" : "Renvoyer le lien"}
                </button>
                <button
                  type="button"
                  disabled={enCours}
                  className="cursor-pointer text-[13.5px] font-bold text-brique-700 hover:text-ink-900"
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
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span aria-label="Mot de passe masqué" className="text-base font-bold tracking-[0.18em]">
                  ••••••••••
                </span>
                {(mdpFait || mdpModifieLe) && (
                  <span className="text-[13px] text-ink-500">
                    {mdpFait ? `Modifié aujourd'hui à ${mdpFait}` : `Modifié le ${mdpModifieLe}`}
                  </span>
                )}
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
              <label className="flex flex-col gap-[7px]">
                <span className="text-[13.5px] font-bold">Mot de passe actuel</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  className={champ}
                  value={mdp.actuel}
                  onChange={(e) => (setMdp({ ...mdp, actuel: e.target.value }), setErreurMdp(""))}
                />
              </label>
              <span className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3">
                <label className="flex flex-col gap-[7px]">
                  <span className="text-[13.5px] font-bold">Nouveau mot de passe</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className={champ}
                    value={mdp.nouveau}
                    onChange={(e) => (setMdp({ ...mdp, nouveau: e.target.value }), setErreurMdp(""))}
                  />
                </label>
                <label className="flex flex-col gap-[7px]">
                  <span className="text-[13.5px] font-bold">Confirmer le nouveau mot de passe</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className={champ}
                    value={mdp.confirmation}
                    onChange={(e) => (setMdp({ ...mdp, confirmation: e.target.value }), setErreurMdp(""))}
                  />
                </label>
              </span>
              <span
                role={erreurMdp ? "alert" : undefined}
                className={`text-[13px] leading-[1.55] ${erreurMdp || (touche && erreurLocale) ? "text-brique-700" : "text-ink-500"}`}
              >
                {erreurMdp ||
                  (touche && erreurLocale) ||
                  (erreurLocale ? `Au moins ${MIN} caractères.` : "Les deux mots de passe correspondent.")}
              </span>
              <span className="text-[13px] leading-[1.55] text-ink-600">
                Un email de notification sera envoyé à {email} après le changement.
              </span>
              <span className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!!erreurLocale || enCours}
                  className={bPlein}
                  onClick={() =>
                    lancer(
                      () => a.changerMotDePasse(mdp),
                      (r) => (setMdpFait(r.heure), setMdpMode("repos")),
                      setErreurMdp,
                    )
                  }
                >
                  Enregistrer le mot de passe
                </button>
                <button type="button" className={bContour} onClick={() => setMdpMode("repos")}>
                  Annuler
                </button>
              </span>
            </div>
          )}
          {mdpMode === "repos" && mdpFait && (
            <span role="status" className="flex items-center gap-2 text-[13.5px] leading-[1.55]">
              <span aria-hidden="true" className="block size-[7px] flex-none rounded-full bg-ink-900" />
              Mot de passe modifié. Un email de notification a été envoyé à {email}.
            </span>
          )}
        </div>
      </section>

      <section className={`${carte} ${actif ? "border border-line" : "border-[1.5px] border-brique-700"}`}>
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2.5">
          <Titre n="02" titre="Authentification à deux facteurs" />
          <span
            className={`inline-flex items-center gap-[7px] rounded-full border-[1.5px] py-[5px] pr-3 pl-2.5 text-[12.5px] font-bold whitespace-nowrap ${actif ? "border-solid border-ink-900 text-ink-900" : "border-dashed border-brique-700 text-brique-700"}`}
          >
            <span className={`block size-[7px] rounded-full ${actif ? "bg-brique-700" : "bg-transparent"}`} />
            {actif ? "Activée" : "À configurer"}
          </span>
        </div>

        {tfaMode === "repos" && tfa && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 rounded-[20px] border border-line px-5 py-[18px]">
              <span className="flex min-w-0 flex-col gap-1">
                <span className={surtitre}>Méthode</span>
                <span className="text-base font-bold">Application d&apos;authentification</span>
                {tfa.activeLe && <span className="text-[13px] text-ink-500">Activée le {tfa.activeLe}</span>}
              </span>
              <button type="button" className={bContour} onClick={ouvrirConfiguration}>
                Changer d&apos;appareil
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 rounded-[20px] border border-line px-5 py-[18px]">
              <span className="flex min-w-0 flex-col gap-1">
                <span className={surtitre}>Codes de récupération</span>
                <span className="flex items-baseline gap-2">
                  <span
                    className={`font-mono text-[22px] tracking-[-0.03em] ${bas ? "text-brique-700" : "text-ink-900"}`}
                  >
                    {tfa.codesRestants}
                  </span>
                  <span className="text-[15px] font-bold">
                    {tfa.codesRestants > 1 ? "codes restants" : "code restant"}
                  </span>
                </span>
                {tfa.codesLe && (
                  <span className="text-[13px] text-ink-500">
                    Générés le {tfa.codesLe}.{" "}
                    {bas ? "Pensez à en générer de nouveaux." : "Ils ne peuvent plus être affichés."}
                  </span>
                )}
              </span>
              <button
                type="button"
                className={bContour}
                onClick={() => (setTfaMode("regeneration"), setOtp(""), setErreurOtp(""))}
              >
                Générer de nouveaux codes
              </button>
            </div>
          </div>
        )}

        {tfaMode === "configuration" && (
          <div className="flex flex-col gap-[18px] rounded-[20px] bg-cream-100 p-[clamp(16px,2.4vw,24px)]">
            <span className="text-[14.5px] leading-[1.6] text-pretty text-ink-700">
              {actif
                ? "Configurez l'application sur votre nouvel appareil. L'ancienne configuration reste active jusqu'à la vérification du code."
                : "Deux étapes : scanner le QR code avec votre application, puis saisir le code qu'elle affiche pour confirmer la configuration."}
            </span>
            <div className="flex flex-wrap items-start gap-x-7 gap-y-5">
              <div className="flex flex-none flex-col items-center gap-2">
                <div className="flex size-[176px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-white">
                  {config ? (
                    // QR code SVG fourni par Supabase (data URI) : pas d'optimisation d'image à faire.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={config.qr} alt="QR code à scanner avec l'application d'authentification" width={164} height={164} />
                  ) : (
                    <span className="font-mono text-[11px] text-ink-500">QR code</span>
                  )}
                </div>
                <span className="font-mono text-[10.5px] text-ink-400">Étape 1 · Scanner</span>
              </div>
              <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5">
                <span className="flex flex-col gap-1.5">
                  <span className="text-[13.5px] font-bold">
                    Scannez ce code avec Google Authenticator, Authy ou une application équivalente.
                  </span>
                  <span className="text-[13px] leading-[1.55] text-ink-500">
                    Impossible de scanner ? Saisissez cette clé dans l&apos;application :
                  </span>
                  <span className="self-start rounded-xl border border-line-strong bg-white px-3 py-[9px] font-mono text-sm tracking-[0.08em] [overflow-wrap:anywhere]">
                    {config ? config.cle.replace(/(.{4})(?=.)/g, "$1 ") : "…"}
                  </span>
                </span>
                <label className="flex flex-col gap-[7px]">
                  <span className="text-[13.5px] font-bold">Étape 2 · Code à six chiffres affiché par l&apos;application</span>
                  <ChampCode valeur={otp} erreur={erreurOtp} onChange={(v) => (setOtp(v), setErreurOtp(""))} />
                </label>
                <span className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={!otpOk || !config || enCours}
                    className={bPlein}
                    onClick={() => demarrer(async () => recevoirCodes(await a.verifierConfiguration(config!.facteur, otp)))}
                  >
                    Vérifier et activer
                  </button>
                  {actif && (
                    <button type="button" className={bContour} onClick={() => setTfaMode("repos")}>
                      Annuler
                    </button>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {tfaMode === "regeneration" && (
          <div className="flex flex-col gap-3.5 rounded-[20px] bg-cream-100 p-[clamp(16px,2.4vw,24px)]">
            <span className="text-[14.5px] leading-[1.6] text-pretty text-ink-700">
              Les codes actuels seront invalidés dès la génération des nouveaux. Confirmez avec le code affiché par
              votre application.
            </span>
            <ChampCode valeur={otp} erreur={erreurOtp} onChange={(v) => (setOtp(v), setErreurOtp(""))} />
            <span className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!otpOk || enCours}
                className={bPlein}
                onClick={() => demarrer(async () => recevoirCodes(await a.regenererCodes(otp)))}
              >
                Générer les codes
              </button>
              <button type="button" className={bContour} onClick={() => setTfaMode("repos")}>
                Annuler
              </button>
            </span>
          </div>
        )}

        {tfaMode === "codes" && (
          <div className="flex flex-col gap-4 rounded-[20px] border-[1.5px] border-ink-900 p-[clamp(16px,2.4vw,24px)]">
            <span className="flex flex-col gap-1.5">
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-brique-700 uppercase">
                Affichés une seule fois
              </span>
              <span className="text-lg font-extrabold tracking-[-0.015em]">Vos codes de récupération</span>
              <span className="text-sm leading-[1.6] text-pretty text-ink-700">
                Conservez-les hors ligne (imprimés, ou dans un gestionnaire de mots de passe). Chaque code ne sert
                qu&apos;une fois. C&apos;est le seul moyen de retrouver l&apos;accès si vous perdez l&apos;appareil qui
                porte l&apos;application : aucun autre compte ne peut rétablir le vôtre.
              </span>
            </span>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2 rounded-2xl bg-cream-100 p-3.5">
              {codes.map((c) => (
                <span
                  key={c}
                  className="rounded-[10px] bg-white px-3 py-2.5 text-center font-mono text-[15px] tracking-[0.08em]"
                >
                  {c}
                </span>
              ))}
            </div>
            <span className="flex flex-wrap gap-2">
              <button
                type="button"
                className={bContour}
                onClick={() => {
                  navigator.clipboard?.writeText(codes.join("\n")).catch(() => {});
                  setCopies(true);
                }}
              >
                {copies ? "Codes copiés" : "Copier les codes"}
              </button>
              <button
                type="button"
                className={bContour}
                onClick={() => {
                  const blob = new Blob(
                    [`Trouve ta formation — codes de récupération admin\n\n${codes.join("\n")}\n`],
                    { type: "text/plain" },
                  );
                  const lien = document.createElement("a");
                  lien.href = URL.createObjectURL(blob);
                  lien.download = "codes-recuperation-admin.txt";
                  lien.click();
                  setTimeout(() => URL.revokeObjectURL(lien.href), 1000);
                }}
              >
                Télécharger (.txt)
              </button>
            </span>
            <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-normal">
              <input
                type="checkbox"
                checked={conserves}
                onChange={(e) => setConserves(e.target.checked)}
                className="mt-[3px] size-[17px] flex-none accent-ink-900"
              />
              <span>J&apos;ai conservé ces codes hors ligne. Ils ne seront plus affichés.</span>
            </label>
            <button
              type="button"
              disabled={!conserves}
              className={`${bPlein} self-start px-5`}
              onClick={() => {
                setCodes([]);
                setTfaMode("repos");
                setToast("Authentification à deux facteurs à jour. Les codes ne seront plus affichés.");
                router.refresh();
              }}
            >
              Terminer
            </button>
          </div>
        )}

        <span className="text-[12.5px] leading-normal text-ink-500">
          Seule l&apos;application d&apos;authentification est proposée. Le 2FA ne peut pas être désactivé sur ce
          compte.
        </span>
      </section>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 max-w-[min(92vw,560px)] -translate-x-1/2 rounded-[18px] bg-ink-900 px-[18px] py-3.5 text-sm leading-[1.45] text-white shadow-[0_18px_40px_-18px_rgba(11,11,11,0.6)]"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
