"use client";

import Script from "next/script";

declare global {
  interface Window {
    turnstile?: { reset: (el?: string) => void };
  }
}

/**
 * Widget Cloudflare Turnstile (invisible si le widget est configuré ainsi côté Cloudflare) : il ajoute au formulaire
 * un champ caché « cf-turnstile-response », vérifié côté serveur. Chargé seulement sur l'inscription.
 */
export function Turnstile({ cle }: { cle: string }) {
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
      <div className="cf-turnstile" data-sitekey={cle} data-language="fr" data-appearance="interaction-only" />
    </>
  );
}

/** Jeton à usage unique : à régénérer après un envoi refusé. */
export const reinitialiserTurnstile = () => window.turnstile?.reset();
