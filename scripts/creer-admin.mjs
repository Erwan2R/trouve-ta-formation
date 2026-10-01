// Création du compte administrateur unique (Sprint 9). Une seule fois par base : la base refuse un second admin.
// Usage : node --env-file=.env.local scripts/creer-admin.mjs --projet=dev|prod --email=adresse@exemple.fr
// Un mot de passe provisoire (24 caractères) est affiché une fois : à la première connexion, l'espace admin
// impose la configuration de l'authentification à deux facteurs ; changer ensuite le mot de passe dans Paramètres.
// Production : uniquement avec l'accord d'Erwan (règle du projet).
import { randomBytes } from "node:crypto";

const PROJETS = { dev: "livkbehsovponxhbctac", prod: "fuwfzxxgosgxmwtdevzh" };
const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3);
const ref = PROJETS[arg("projet")];
const email = arg("email")?.trim().toLowerCase();
if (!ref || !email) throw new Error("Préciser --projet=dev|prod et --email=…");
const jeton = process.env.SUPABASE_ACCESS_TOKEN;
if (!jeton) throw new Error("SUPABASE_ACCESS_TOKEN manquant (.env.local)");

// Clé service role lue à la volée par l'API de gestion : elle n'est jamais écrite sur disque.
const cles = await fetch(`https://api.supabase.com/v1/projects/${ref}/api-keys?reveal=true`, {
  headers: { Authorization: `Bearer ${jeton}` },
}).then((r) => r.json());
const service = cles.find((c) => c.name === "service_role")?.api_key;
if (!service) throw new Error("Clé service_role introuvable");
const url = `https://${ref}.supabase.co`;
const entetes = { apikey: service, Authorization: `Bearer ${service}`, "Content-Type": "application/json" };

const existant = await fetch(`${url}/rest/v1/administrateurs?select=id&est_test=eq.false`, { headers: entetes }).then((r) => r.json());
if (existant.length) throw new Error("Un administrateur existe déjà sur cette base (compte unique).");

const motDePasse = randomBytes(18).toString("base64url");
const r = await fetch(`${url}/auth/v1/admin/users`, {
  method: "POST",
  headers: entetes,
  // Sans nom_organisme : le déclencheur d'inscription ne crée pas d'organisme.
  body: JSON.stringify({ email, password: motDePasse, email_confirm: true }),
});
const user = await r.json();
if (!r.ok) throw new Error(`Création du compte : ${JSON.stringify(user)}`);
const a = await fetch(`${url}/rest/v1/administrateurs`, {
  method: "POST",
  headers: entetes,
  body: JSON.stringify({ id: user.id, mdp_modifie_le: new Date().toISOString() }),
});
if (!a.ok) throw new Error(`Administrateur : ${await a.text()}`);
console.log(`Administrateur créé sur ${arg("projet")} : ${email}\nMot de passe provisoire : ${motDePasse}`);
