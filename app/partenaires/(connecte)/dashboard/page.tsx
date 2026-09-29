import type { Metadata } from "next";
import Link from "next/link";
import { BoutonRenvoyer } from "@/components/espace/BoutonRenvoyer";
import { ApercuCarte } from "@/components/espace/ApercuCarte";
import { Jauge } from "@/components/espace/Jauge";
import { ACTIONS, DASHBOARD as D, INDEXATION, NOMS_PALIERS } from "@/contenu/espace/dashboard";
import { ONBOARDING } from "@/contenu/espace/onboarding";
import { dateCourte } from "@/lib/format-date";
import { RANG_PALIER, type Palier } from "@/lib/organismes/completude";
import { minimumPubliable } from "@/lib/organismes/publication";
import { actionsRelance, manquantsOptimal } from "@/lib/organismes/relance";
import { absoluteUrl } from "@/lib/seo/metadata";
import { getEspace } from "@/lib/supabase/queries/espace";
import { renvoyerValidation } from "./actions";

export const metadata: Metadata = { title: "Tableau de bord" };

const PALIERS: Palier[] = ["basique", "correct", "optimal"];
const carte = "rounded-[28px] p-[clamp(22px,3vw,32px)]";
const surtitre = "font-mono text-[10.5px] tracking-[0.12em] uppercase";

/** Tableau de bord : état de la fiche et quoi faire pour la faire progresser (UX Dashboard). */
export default async function Dashboard() {
  const { organisme: o, siege, lieux, user, compte, offresActives, financements, palier: p } = await getEspace();
  const donnees = { ...o, financements, nbFormations: offresActives.length };
  const actions = actionsRelance(donnees, p);
  const publiee = o.statut === "publie";
  const minimum = minimumPubliable(o, siege);
  const rang = RANG_PALIER[p];
  const recul = p === "basique" && offresActives.length === 0 && RANG_PALIER[o.palier_max as Palier] > 0;
  const urlPublique = absoluteUrl(`/securite-privee/organismes/${o.slug}/`);
  const nb = offresActives.length;

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-[clamp(6px,1vw,12px)] pt-[clamp(18px,3vw,36px)] pb-[clamp(4px,1vw,10px)]">
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">
            Espace organisme{siege ? ` · ${siege.ville} (${siege.departement})` : ""}
          </span>
          <h1 className="max-w-[20ch] text-[clamp(34px,4.6vw,60px)] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance">
            {o.nom}
          </h1>
        </div>
        {publiee && (
          <a
            href={urlPublique}
            className="inline-flex items-center gap-2.5 rounded-full bg-ink-900 px-6 py-4 text-[15px] font-bold text-white transition-colors hover:bg-brique-700 hover:text-white"
          >
            Voir ma fiche publique<span aria-hidden="true">→</span>
          </a>
        )}
      </section>

      {compte.onboarding_etape !== null && (
        <section className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-[28px] border-[1.5px] border-ink-900 bg-white p-[clamp(22px,3vw,32px)]">
          <span className="flex flex-col gap-1.5">
            <h2 className="text-[clamp(20px,2.2vw,26px)] font-extrabold tracking-[-0.025em]">
              {ONBOARDING.reprendre.titre}
            </h2>
            <span className="text-[15px] text-ink-700">{ONBOARDING.reprendre.texte(compte.onboarding_etape)}</span>
          </span>
          <Link
            href={`/bienvenue/${compte.onboarding_etape}/`}
            className="inline-flex items-center gap-2.5 rounded-full bg-ink-900 px-6 py-4 text-[15px] font-bold text-white hover:bg-brique-700 hover:text-white"
          >
            {ONBOARDING.reprendre.cta}
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      )}

      {!publiee && (
        <section className="flex flex-wrap items-center justify-between gap-x-12 gap-y-6 rounded-[28px] bg-ink-900 bg-[radial-gradient(60%_120%_at_100%_0%,#2A2626_0%,rgba(42,38,38,0)_70%)] p-[clamp(26px,4vw,48px)]">
          <div className="flex min-w-[260px] flex-[1_1_440px] flex-col gap-3">
            <span className={`flex items-center gap-2.5 text-[11px] text-brique-400 ${surtitre}`}>
              <span aria-hidden="true" className="block h-[1.5px] w-[30px] bg-brique-400" />
              {o.statut === "suspendu" ? "Fiche suspendue" : D.nonPubliee.surtitre}
            </span>
            <h2 className="text-[clamp(28px,3.4vw,44px)] leading-[1.04] font-extrabold tracking-[-0.035em] text-white">
              {o.statut === "suspendu" ? D.suspendue.titre : D.nonPubliee.titre}
            </h2>
            <p className="max-w-[56ch] text-base leading-[1.65] text-on-dark">
              {o.statut === "suspendu"
                ? D.suspendue.texte
                : !user.confirme && !(minimum.siege && minimum.contact)
                  ? D.nonPubliee.emailEtMinimum(user.email)
                  : !user.confirme
                    ? D.nonPubliee.email(user.email)
                    : D.nonPubliee.minimum}
            </p>
          </div>
          {o.statut !== "suspendu" &&
            (!user.confirme ? (
              <BoutonRenvoyer action={renvoyerValidation} libelle={D.nonPubliee.renvoyer} fait={D.nonPubliee.renvoye} />
            ) : (
              <Link
                href="/ma-fiche/#coordonnees"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-[26px] py-[18px] text-[15.5px] font-bold text-ink-900 hover:bg-brique-400 hover:text-ink-900"
              >
                {D.nonPubliee.minimumCta}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
        </section>
      )}

      {publiee && (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-3.5">
            <section className={`flex flex-col gap-[18px] bg-ink-900 text-white ${carte}`}>
              <span className="flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-bold tracking-[-0.01em]">Complétude de votre fiche</h2>
                <span
                  className={`inline-flex items-center gap-[7px] rounded-full border border-line-dark px-3 py-1.5 text-white ${surtitre} ${rang > 0 ? "bg-line-dark" : ""}`}
                >
                  <span
                    aria-hidden="true"
                    className={`block size-1.5 rounded-full ${rang === 1 ? "bg-white" : "bg-brique-400"}`}
                  />
                  {INDEXATION[p].etiquette}
                </span>
              </span>
              <div className="relative mx-auto mt-1.5 w-full max-w-[380px]">
                <Jauge rang={rang} />
                <span className="absolute inset-x-0 bottom-1 flex flex-col items-center gap-1 text-center">
                  <span className={`text-brique-400 ${surtitre} tracking-[0.14em]`}>Palier actuel</span>
                  <span className="text-[clamp(40px,5vw,58px)] leading-[0.95] font-extrabold tracking-[-0.05em]">
                    {NOMS_PALIERS[p]}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 border-t border-line-dark pt-3.5">
                {PALIERS.map((x, i) => (
                  <span key={x} className="flex flex-col gap-[3px] px-1">
                    <span
                      className={`flex items-center gap-[7px] text-sm font-bold ${i <= rang ? "text-white" : "text-ink-300"}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`block size-2 rounded-[3px] ${i < rang ? "bg-white" : i === rang ? "bg-brique-400" : "bg-line-dark"}`}
                      />
                      {NOMS_PALIERS[x]}
                    </span>
                    <span className="text-xs leading-[1.4] text-ink-300">{INDEXATION[x].statut}</span>
                  </span>
                ))}
              </div>
              <p className="text-base leading-[1.55] font-bold text-pretty text-white">{INDEXATION[p].phrase}</p>
              {p === "basique" && <p className="-mt-2 text-sm leading-[1.6] text-on-dark">{D.basiqueAcces}</p>}
              {recul && (
                <div className="flex flex-col gap-1 rounded-2xl border border-brique-400 px-4 py-3.5">
                  <span className={`text-brique-400 ${surtitre}`}>Recul de palier</span>
                  <span className="text-sm leading-[1.55] text-white">{D.recul}</span>
                </div>
              )}
            </section>

            <section className={`flex flex-col gap-4 border border-line bg-white ${carte}`}>
              <span className="flex flex-wrap items-baseline justify-between gap-x-3.5 gap-y-1.5">
                <h2 className="text-[15px] font-bold tracking-[-0.01em]">Ce que voit un candidat</h2>
                <span className={`text-ink-400 ${surtitre}`}>Votre carte dans le catalogue</span>
              </span>
              <div className="flex flex-1 items-center justify-center rounded-[20px] border border-line bg-[repeating-linear-gradient(135deg,#ECE8E2_0_7px,#F7F5F1_7px_14px)] p-[clamp(18px,3.5vw,40px)]">
                <ApercuCarte
                  organisme={o}
                  siege={siege}
                  offres={offresActives}
                  nbLieux={lieux.length}
                  actions={actions}
                />
              </div>
              <p className="text-sm leading-[1.6] text-ink-700">
                {p === "basique" ? (nb === 0 ? D.legende.basiqueSansFormation : D.legende.basique) : D.legende[p]}
              </p>
            </section>
          </div>

          <section className={`flex flex-col gap-5 border border-line bg-white ${carte}`}>
            {p === "optimal" ? (
              <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3 py-2">
                <span className="flex flex-col gap-3">
                  <span aria-hidden="true" className="block h-0.5 w-[30px] bg-brique-700" />
                  <h2 className="text-[clamp(26px,3vw,38px)] leading-[1.05] font-extrabold tracking-[-0.035em]">
                    {D.optimalTitre}
                  </h2>
                </span>
                <p className="max-w-[52ch] text-[15.5px] leading-[1.65] text-ink-700">{D.optimalTexte}</p>
              </div>
            ) : (
              <>
                <span className="flex flex-wrap items-end justify-between gap-x-5 gap-y-2">
                  <span className="flex flex-col gap-1.5">
                    <span className={`flex items-center gap-2.5 text-[11px] text-brique-700 ${surtitre}`}>
                      <span aria-hidden="true" className="block h-[1.5px] w-[30px] bg-brique-700" />À faire
                    </span>
                    <h2 className="text-[clamp(22px,2.4vw,28px)] font-extrabold tracking-[-0.03em]">
                      {D.checklistTitre[p]}
                    </h2>
                  </span>
                  {(p === "correct" || nb > 0) && (
                    <span className="max-w-[44ch] text-[13.5px] leading-[1.55] text-ink-500">
                      {p === "correct" ? D.noteCorrect(manquantsOptimal(donnees)) : D.noteBasique}
                    </span>
                  )}
                </span>
                <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3">
                  {actions.map((k, i) => {
                    const a = ACTIONS[k];
                    const premier = i === 0;
                    return (
                      <li
                        key={k}
                        className={`flex min-h-[230px] flex-col gap-3.5 rounded-[22px] border p-[22px] ${premier ? "border-ink-900 bg-ink-900" : "border-line bg-cream-100"}`}
                      >
                        <span className="flex items-center justify-between gap-2.5">
                          <span
                            className={`flex size-9 items-center justify-center rounded-full font-mono text-[13px] text-white ${premier ? "bg-brique-700" : "bg-ink-900"}`}
                          >
                            0{i + 1}
                          </span>
                          <span className={`${surtitre} ${premier ? "text-brique-400" : "text-ink-400"}`}>
                            {D.etiquettes[i]}
                          </span>
                        </span>
                        <span className="flex flex-col gap-1.5">
                          <span
                            className={`text-[17.5px] leading-[1.3] font-bold tracking-[-0.015em] ${premier ? "text-white" : "text-ink-900"}`}
                          >
                            {a.titre}
                          </span>
                          <span className={`text-sm leading-[1.55] ${premier ? "text-on-dark" : "text-ink-500"}`}>
                            {a.pourquoi}
                          </span>
                        </span>
                        <span
                          className={`mt-auto flex items-center justify-between gap-2.5 border-t pt-3.5 ${premier ? "border-line-dark" : "border-line"}`}
                        >
                          <span className={`font-mono text-[10.5px] ${premier ? "text-on-dark" : "text-ink-500"}`}>
                            {a.dest}
                          </span>
                          <Link
                            href={a.href}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-[11px] text-[13.5px] font-bold transition-colors hover:bg-brique-700 hover:text-white ${premier ? "bg-white text-ink-900" : "bg-ink-900 text-white"}`}
                          >
                            {a.cta}
                            <span aria-hidden="true">→</span>
                          </Link>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </>
            )}
          </section>
        </>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-3.5">
        {[
          { href: "/ma-fiche/", titre: "Ma fiche", texte: "Coordonnées, présentation, agréments" },
          {
            href: "/formations/",
            titre: "Mes formations",
            texte:
              nb === 0 ? "Aucune formation déclarée" : nb === 1 ? "1 formation déclarée" : `${nb} formations déclarées`,
          },
          { href: "/parametres/", titre: "Paramètres", texte: "Compte, email, mot de passe" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex flex-col gap-[18px] rounded-3xl border border-line bg-white p-[22px] text-ink-900 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ink-900 hover:text-ink-900"
          >
            <span className="flex items-center justify-between">
              <span className={`text-ink-400 ${surtitre}`}>Accès rapide</span>
              <span
                aria-hidden="true"
                className="flex size-[34px] items-center justify-center rounded-full bg-cream-200 text-brique-700"
              >
                →
              </span>
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-[19px] font-extrabold tracking-[-0.02em]">{a.titre}</span>
              <span className="text-[13.5px] text-ink-500">{a.texte}</span>
            </span>
          </Link>
        ))}
        {publiee && o.publie_le && (
          <div className="flex flex-col gap-3 rounded-3xl border border-line-strong bg-cream-100 p-[22px]">
            <span className={`text-ink-400 ${surtitre}`}>Publication</span>
            <span className="flex flex-col gap-1">
              <span className="text-[19px] font-extrabold tracking-[-0.02em]">Fiche en ligne</span>
              <span className="text-[13px] text-ink-500">Depuis le {dateCourte(o.publie_le)}</span>
            </span>
            <span className="mt-auto rounded-xl border border-line bg-white px-3 py-2.5 font-mono text-[11px] leading-[1.4] break-all text-ink-600">
              …/organismes/
              <wbr />
              {o.slug}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
