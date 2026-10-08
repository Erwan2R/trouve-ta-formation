// Configuration de l'authentification Supabase (espace organisme, Sprint 8). Idempotent.
// Usage : node --env-file=.env.local scripts/config-auth-supabase.mjs --projet=dev|prod [--smtp] [--emails]
// --projet : dev (dev et preprod, local) ou prod. Obligatoire : jamais la production par défaut.
// --smtp   : branche l'envoi sur Resend (clé RESEND_SENDING_KEY, « Sending access » limitée au domaine).
// --emails : applique les modèles d'emails en français (exige l'envoi SMTP branché).
import { readFileSync } from "node:fs";

// Deux projets Supabase (décision Erwan 29/09/2026) : dev et preprod d'un côté, production de l'autre.
const PROJETS = {
  dev: {
    ref: "livkbehsovponxhbctac",
    site: "https://partenaires-dev.trouve-ta-formation.fr",
    autorises: ["partenaires-dev", "partenaires-preprod"],
    local: true,
  },
  prod: { ref: "fuwfzxxgosgxmwtdevzh", site: "https://partenaires.trouve-ta-formation.fr", autorises: ["partenaires"] },
};
const cible = PROJETS[process.argv.find((a) => a.startsWith("--projet="))?.slice(9)];
if (!cible) throw new Error("Préciser --projet=dev ou --projet=prod");
const PROJET = cible.ref;
// Adresse de contact publique : réglage unique dans lib/config/contact.ts (Supabase n'a pas de Reply-To).
const EMAIL_CONTACT = readFileSync(new URL("../lib/config/contact.ts", import.meta.url), "utf8").match(
  /EMAIL_CONTACT = "([^"]+)"/,
)[1];

const lien = (type) => `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=${type}`;
const pied = (texte) =>
  `<p style="font-size:13px;color:#7B746E">${texte}<br>Pour nous écrire : ${EMAIL_CONTACT}<br>Trouve ta formation — l'annuaire des organismes de formation en sécurité privée.</p>`;
const gabarit = (titre, corps, bouton, type) =>
  `<div style="font-family:Arial,sans-serif;color:#0B0B0B;max-width:560px;line-height:1.6">
<p style="font-weight:bold;font-size:18px">${titre}</p>${corps}
<p><a href="${lien(type)}" style="display:inline-block;background:#0B0B0B;color:#FFFFFF;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">${bouton}</a></p>
${pied("Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.")}</div>`;
const notification = (titre, corps) =>
  `<div style="font-family:Arial,sans-serif;color:#0B0B0B;max-width:560px;line-height:1.6">
<p style="font-weight:bold;font-size:18px">${titre}</p>${corps}
${pied("Si vous n'êtes pas à l'origine de ce changement, réinitialisez votre mot de passe depuis la page de connexion de votre espace organisme.")}</div>`;

const espace = cible.autorises.map((s) => `https://${s}.trouve-ta-formation.fr/**`);

const reglages = {
  site_url: cible.site,
  uri_allow_list: [...espace, ...(cible.local ? ["http://partenaires.localhost:3000/**"] : [])].join(","),
  // Spec Inscription §4 : accès immédiat. Le réglage « connexion avant validation » de Supabase ne fonctionne pas
  // sur ce projet : la validation de l'email est gérée par l'application (comptes_organisme.email_verifie_le,
  // liens envoyés par Resend) et Supabase ne l'exige plus (décision Erwan 29/09/2026).
  mailer_allow_unverified_email_sign_ins: false,
  mailer_autoconfirm: true,
  // Spec Paramètres : le lien part vers la nouvelle adresse seulement ; l'ancienne reste valide jusque-là.
  mailer_secure_email_change_enabled: false,
  password_min_length: 10, // organisme ; l'admin (12 caractères) est contrôlé dans l'application
  mailer_notifications_password_changed_enabled: true,
  mailer_notifications_email_changed_enabled: true,
};

// Textes à valider par Erwan (README §8 : « les textes restent à rédiger »).
const emails = {
  mailer_subjects_confirmation: "Confirmez votre adresse email",
  mailer_templates_confirmation_content: gabarit(
    "Confirmez votre adresse email",
    "<p>Votre espace organisme est créé. Confirmez votre adresse email : c'est l'une des deux conditions pour publier votre fiche, avec l'adresse du siège et un moyen de contact.</p>",
    "Confirmer mon adresse",
    "signup",
  ),
  mailer_subjects_email_change: "Confirmez votre nouvelle adresse de connexion",
  mailer_templates_email_change_content: gabarit(
    "Confirmez votre nouvelle adresse de connexion",
    "<p>Vous avez demandé à utiliser {{ .NewEmail }} pour vous connecter à votre espace organisme. Votre adresse actuelle reste active tant que celle-ci n'est pas confirmée.</p>",
    "Confirmer cette adresse",
    "email_change",
  ),
  mailer_subjects_recovery: "Réinitialisez votre mot de passe",
  mailer_templates_recovery_content: gabarit(
    "Réinitialisez votre mot de passe",
    "<p>Vous avez demandé à réinitialiser le mot de passe de votre espace organisme. Ce lien est valable une heure.</p>",
    "Choisir un nouveau mot de passe",
    "recovery",
  ),
  mailer_subjects_password_changed_notification: "Votre mot de passe a été modifié",
  mailer_templates_password_changed_notification_content: notification(
    "Votre mot de passe a été modifié",
    "<p>Le mot de passe de votre espace organisme vient d'être modifié.</p>",
  ),
  mailer_subjects_email_changed_notification: "Votre adresse de connexion a été modifiée",
  mailer_templates_email_changed_notification_content: notification(
    "Votre adresse de connexion a été modifiée",
    "<p>L'adresse de connexion de votre espace organisme est passée de {{ .OldEmail }} à {{ .Email }}.</p>",
  ),
};

// Envoi par Resend (région Europe), expéditeur du domaine vérifié.
const smtp = {
  smtp_host: "smtp.resend.com",
  smtp_port: "465",
  smtp_user: "resend",
  smtp_pass: process.env.RESEND_SENDING_KEY,
  smtp_admin_email: "ne-pas-repondre@trouve-ta-formation.fr",
  smtp_sender_name: "Trouve ta formation",
  // Emails par heure (Supabase : 2 sans SMTP personnalisé). Resend gratuit : 100 par jour, 3 000 par mois.
  rate_limit_email_sent: 30,
};
if (process.argv.includes("--smtp") && !smtp.smtp_pass) throw new Error("RESEND_SENDING_KEY manquante");

const corps = {
  ...reglages,
  ...(process.argv.includes("--smtp") ? smtp : {}),
  ...(process.argv.includes("--emails") ? emails : {}),
};
const r = await fetch(`https://api.supabase.com/v1/projects/${PROJET}/config/auth`, {
  method: "PATCH",
  headers: { Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify(corps),
});
console.log(r.ok ? "Configuration appliquée." : `Erreur ${r.status} : ${await r.text()}`);
