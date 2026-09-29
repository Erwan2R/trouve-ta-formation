import "server-only";

const EXPEDITEUR = "Trouve ta formation <ne-pas-repondre@trouve-ta-formation.fr>";

/** Envoi transactionnel par l'API Resend (clé « Sending access » limitée au domaine). */
export async function envoyerEmail(d: { a: string; sujet: string; html: string }): Promise<boolean> {
  const cle = process.env.RESEND_SENDING_KEY;
  if (!cle) {
    console.error("RESEND_SENDING_KEY manquante : email non envoyé");
    return false;
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: EXPEDITEUR, to: [d.a], subject: d.sujet, html: d.html }),
    signal: AbortSignal.timeout(10000),
  }).catch((e: Error) => (console.error("Resend :", e.message), null));
  if (!r?.ok) console.error("Resend :", r?.status, r && (await r.text()).slice(0, 200));
  return !!r?.ok;
}
