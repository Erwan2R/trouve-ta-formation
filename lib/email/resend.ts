import "server-only";
import { EMAIL_CONTACT, EXPEDITEUR_EMAILS } from "@/lib/config/contact";

/** Envoi transactionnel par l'API Resend (clé « Sending access » limitée au domaine). */
export async function envoyerEmail(d: { a: string; sujet: string; html: string; texte: string }): Promise<boolean> {
  const cle = process.env.RESEND_SENDING_KEY;
  if (!cle) {
    console.error("RESEND_SENDING_KEY manquante : email non envoyé");
    return false;
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
    // Réponse à un email transactionnel : vers l'adresse de contact publique, jamais vers ne-pas-repondre@.
    body: JSON.stringify({
      from: EXPEDITEUR_EMAILS,
      reply_to: EMAIL_CONTACT,
      to: [d.a],
      subject: d.sujet,
      html: d.html,
      text: d.texte,
    }),
    signal: AbortSignal.timeout(10000),
  }).catch((e: Error) => (console.error("Resend :", e.message), null));
  if (!r?.ok) console.error("Resend :", r?.status, r && (await r.text()).slice(0, 200));
  return !!r?.ok;
}
