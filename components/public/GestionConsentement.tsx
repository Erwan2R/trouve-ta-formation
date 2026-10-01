"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { BANDEAU_COOKIES as T } from "@/contenu/legal/cookies";
import {
  type CategorieConsentement,
  type Consentement,
  ecrireConsentement,
  lireConsentement,
  servicesActifs,
} from "@/lib/config/traceurs";

/** Ouvre le panneau des préférences depuis n'importe quelle page (lien « Gestion des cookies », page Cookies). */
export const ouvrirPreferences = () => window.dispatchEvent(new Event("ttf:preferences-cookies"));

const bouton =
  "flex-1 cursor-pointer rounded-full border-[1.5px] border-ink-900 px-5 py-3 text-[14.5px] font-bold whitespace-nowrap";

/**
 * Bandeau et préférences de cookies (recommandation CNIL « cookies et autres traceurs ») : « Tout refuser » aussi
 * visible que « Tout accepter », choix par finalité, aucun outil tiers chargé avant l'accord, choix conservé 6 mois et
 * modifiable à tout moment. Absent des espaces organisme et admin, et tant qu'aucun outil tiers n'est configuré.
 */
export function GestionConsentement() {
  const services = servicesActifs();
  const [choix, setChoix] = useState<Consentement | null>(null);
  const [ouvert, setOuvert] = useState(false);
  const [details, setDetails] = useState(false);
  const [brouillon, setBrouillon] = useState({ mesure: false, publicite: false });
  const [prive, setPrive] = useState(true);

  useEffect(() => {
    const espace = /^(admin|partenaires)(-dev|-preprod)?\./.test(location.hostname);
    setPrive(espace);
    if (espace || services.length === 0) return;
    const c = lireConsentement(document.cookie);
    setChoix(c);
    if (!c) setOuvert(true);
    const rouvrir = () => {
      const actuel = lireConsentement(document.cookie);
      setBrouillon({ mesure: !!actuel?.mesure, publicite: !!actuel?.publicite });
      setDetails(true);
      setOuvert(true);
    };
    window.addEventListener("ttf:preferences-cookies", rouvrir);
    return () => window.removeEventListener("ttf:preferences-cookies", rouvrir);
  }, [services.length]);

  if (prive || services.length === 0) return null;
  const categories = (["mesure", "publicite"] as CategorieConsentement[]).filter((c) =>
    services.some((s) => s.categorie === c),
  );

  const enregistrer = (c: { mesure: boolean; publicite: boolean }) => {
    const retrait = (choix?.mesure && !c.mesure) || (choix?.publicite && !c.publicite);
    const nouveau = { ...c, le: new Date().toISOString() };
    document.cookie = ecrireConsentement(nouveau, location.protocol === "https:");
    setChoix(nouveau);
    setOuvert(false);
    setDetails(false);
    // Retrait d'un accord : les scripts déjà chargés ne se déchargent pas, on recharge la page sans eux.
    if (retrait) location.reload();
  };
  const actif = (cat: CategorieConsentement) => !!choix?.[cat];
  const id = (cle: string) => services.find((s) => s.cle === cle)?.identifiant;
  const ga4 = actif("mesure") ? id("ga4") : "";
  const ads = actif("publicite") ? id("google-ads") : "";
  const meta = actif("publicite") ? id("meta") : "";
  const gtag = [ga4, ads].filter(Boolean) as string[];

  return (
    <>
      {gtag.length > 0 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtag[0]}`} strategy="afterInteractive" />
          <Script id="gtag" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${gtag
              .map((g) => `gtag('config',${JSON.stringify(g)});`)
              .join("")}`}
          </Script>
        </>
      )}
      {meta && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(meta)});fbq('track','PageView');`}
        </Script>
      )}

      {ouvert && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="titre-cookies"
          className="fixed inset-x-3 bottom-3 z-[200] mx-auto flex max-w-[680px] flex-col gap-4 rounded-[24px] border border-line bg-white p-[clamp(18px,3vw,26px)] shadow-[0_24px_60px_-24px_rgba(11,11,11,0.35)]"
        >
          <span id="titre-cookies" className="text-[19px] font-bold tracking-[-0.015em]">
            {T.titre}
          </span>
          <p className="text-[14.5px] leading-[1.6] text-ink-600">
            {T.texte}{" "}
            <Link href="/cookies/" className="font-semibold">
              {T.enSavoirPlus}
            </Link>
          </p>
          {details && (
            <ul className="flex flex-col gap-2.5">
              {categories.map((cat) => (
                <li key={cat} className="flex items-start justify-between gap-4 rounded-2xl bg-cream-100 p-4">
                  <span className="flex flex-col gap-1">
                    <span className="text-[15px] font-bold">{T.categories[cat].titre}</span>
                    <span className="text-[13.5px] leading-[1.55] text-ink-500">
                      {T.categories[cat].texte} {T.services}{" "}
                      {services
                        .filter((s) => s.categorie === cat)
                        .map((s) => s.nom)
                        .join(", ")}
                      .
                    </span>
                  </span>
                  <label className="flex flex-none cursor-pointer items-center gap-2 pt-0.5 text-[13.5px] font-semibold">
                    <input
                      type="checkbox"
                      checked={brouillon[cat]}
                      onChange={(e) => setBrouillon({ ...brouillon, [cat]: e.target.checked })}
                      className="size-[18px] accent-ink-900"
                    />
                    {brouillon[cat] ? T.accepte : T.refuse}
                  </label>
                </li>
              ))}
              <li className="rounded-2xl bg-cream-100 p-4 text-[13.5px] leading-[1.55] text-ink-500">
                <span className="text-[15px] font-bold text-ink-900">{T.necessaires.titre}</span> —{" "}
                {T.necessaires.texte}
              </li>
            </ul>
          )}
          <div className="flex flex-wrap gap-2">
            {/* Refuser et accepter : même taille, même style (CNIL). */}
            <button
              type="button"
              onClick={() => enregistrer({ mesure: false, publicite: false })}
              className={`${bouton} bg-white text-ink-900`}
            >
              {T.toutRefuser}
            </button>
            {details ? (
              <button
                type="button"
                onClick={() => enregistrer(brouillon)}
                className={`${bouton} bg-white text-ink-900`}
              >
                {T.enregistrer}
              </button>
            ) : (
              <button type="button" onClick={() => setDetails(true)} className={`${bouton} bg-white text-ink-900`}>
                {T.personnaliser}
              </button>
            )}
            <button
              type="button"
              onClick={() => enregistrer({ mesure: true, publicite: true })}
              className={`${bouton} bg-white text-ink-900`}
            >
              {T.toutAccepter}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
