import "server-only";
import { EST_PRODUCTION } from "@/lib/env";

/**
 * Cloudflare Turnstile (mode invisible) sur l'inscription : protège le quota d'envoi d'emails (décision Erwan
 * 29/09/2026). Sans clé secrète : refus en production, contrôle ignoré ailleurs (développement local).
 */
export async function verifierTurnstile(jeton: string | null, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (EST_PRODUCTION) console.error("TURNSTILE_SECRET_KEY manquante : inscription refusée");
    return !EST_PRODUCTION;
  }
  if (!jeton) return false;
  const corps = new URLSearchParams({ secret, response: jeton, ...(ip ? { remoteip: ip } : {}) });
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: corps,
    signal: AbortSignal.timeout(8000),
  }).catch(() => null);
  return !!r?.ok && ((await r.json()) as { success: boolean }).success;
}
