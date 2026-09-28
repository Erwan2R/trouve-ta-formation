// Configuration de l'authentification Supabase (espace organisme, Sprint 8). Idempotent.
// Usage : node --env-file=.env.local scripts/config-auth-supabase.mjs [--emails]
// --emails : applique aussi les modèles d'emails en français (exige un service d'envoi SMTP branché : Resend).
const PROJET = "fuwfzxxgosgxmwtdevzh";

const lien = (type) => `{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=${type}`;
const pied = (texte) =>
  `<p style="font-size:13px;color:#7B746E">${texte}<br>Trouve ta formation — annuaire indépendant des organismes de formation.</p>`;
const gabarit = (titre, corps, bouton, type) =>
  `<div style="font-family:Arial,sans-serif;color:#0B0B0B;max-width:560px;line-height:1.6">
<p style="font-weight:bold;font-size:18px">${titre}</p>${corps}
<p><a href="${lien(type)}" style="display:inline-block;background:#0B0B0B;color:#FFFFFF;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">${bouton}</a></p>
${pied("Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.")}</div>`;
const notification = (titre, corps) =>
  `<div style="font-family:Arial,sans-serif;color:#0B0B0B;max-width:560px;line-height:1.6">
<p style="font-weight:bold;font-size:18px">${titre}</p>${corps}
${pied("Si vous n'êtes pas à l'origine de ce changement, réinitialisez votre mot de passe depuis la page de connexion de votre espace organisme.")}</div>`;

const espace = ["partenaires", "partenaires-dev", "partenaires-preprod"].map(
  (s) => `https://${s}.trouve-ta-formation.fr/**`,
);

const reglages = {
  site_url: "https://partenaires.trouve-ta-formation.fr",
  uri_allow_list: [...espace, "http://partenaires.localhost:3000/**"].join(","),
  // Spec Inscription : accès immédiat à l'espace ; la validation de l'email bloque la publication, pas l'accès.
  mailer_allow_unverified_email_sign_ins: true,
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
    "<p>Votre espace organisme est créé. Confirmez votre adresse email : c'est la condition pour que votre fiche soit publiée dès que son minimum est rempli.</p>",
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

const corps = process.argv.includes("--emails") ? { ...reglages, ...emails } : reglages;
const r = await fetch(`https://api.supabase.com/v1/projects/${PROJET}/config/auth`, {
  method: "PATCH",
  headers: { Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify(corps),
});
console.log(r.ok ? "Configuration appliquée." : `Erreur ${r.status} : ${await r.text()}`);
