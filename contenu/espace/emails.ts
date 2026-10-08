import { EMAIL_CONTACT } from "@/lib/config/contact";

// Emails envoyés par l'application (validation d'adresse, changement d'email). Textes à valider par Erwan,
// alignés sur ceux installés dans Supabase (scripts/config-auth-supabase.mjs).

const pied = `<p style="font-size:13px;color:#7B746E">Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.<br>Pour nous écrire : ${EMAIL_CONTACT}<br>Trouve ta formation — l'annuaire des organismes de formation en sécurité privée.</p>`;
const gabarit = (titre: string, corps: string, bouton: string, lien: string) =>
  `<div style="font-family:Arial,sans-serif;color:#0B0B0B;max-width:560px;line-height:1.6">
<p style="font-weight:bold;font-size:18px">${titre}</p>${corps}
<p><a href="${lien}" style="display:inline-block;background:#0B0B0B;color:#FFFFFF;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">${bouton}</a></p>
<p style="font-size:13px;color:#7B746E">Ce lien est valable 24 heures et ne sert qu'une fois.</p>${pied}</div>`;

/** Version texte (sans HTML), envoyée avec chaque email : lisibilité et délivrabilité. */
const texte = (titre: string, corps: string, lien: string) =>
  `${titre}

${corps}

${lien}

Ce lien est valable 24 heures et ne sert qu'une fois.

Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.
Pour nous écrire : ${EMAIL_CONTACT}
--
Trouve ta formation — l'annuaire des organismes de formation en sécurité privée.
`;

export const EMAIL_VALIDATION = {
  sujet: "Confirmez votre adresse email",
  html: (lien: string) =>
    gabarit(
      "Confirmez votre adresse email",
      "<p>Votre espace organisme est créé. Confirmez votre adresse email : c'est l'une des deux conditions pour publier votre fiche, avec l'adresse du siège et un moyen de contact.</p>",
      "Confirmer mon adresse",
      lien,
    ),
  texte: (lien: string) =>
    texte(
      "Confirmez votre adresse email",
      "Votre espace organisme est créé. Confirmez votre adresse email : c'est l'une des deux conditions pour publier votre fiche, avec l'adresse du siège et un moyen de contact. Pour confirmer, ouvrez ce lien :",
      lien,
    ),
};

export const EMAIL_CHANGEMENT = {
  sujet: "Confirmez votre nouvelle adresse de connexion",
  html: (lien: string, email: string, espace = "votre espace organisme") =>
    gabarit(
      "Confirmez votre nouvelle adresse de connexion",
      `<p>Vous avez demandé à utiliser ${email} pour vous connecter à ${espace}. Votre adresse actuelle reste active tant que celle-ci n'est pas confirmée.</p>`,
      "Confirmer cette adresse",
      lien,
    ),
  texte: (lien: string, email: string, espace = "votre espace organisme") =>
    texte(
      "Confirmez votre nouvelle adresse de connexion",
      `Vous avez demandé à utiliser ${email} pour vous connecter à ${espace}. Votre adresse actuelle reste active tant que celle-ci n'est pas confirmée. Pour confirmer, ouvrez ce lien :`,
      lien,
    ),
};
