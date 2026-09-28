// Compte organisme de TEST pour le développement et Playwright (email déjà confirmé, organisme est_test).
// Usage : node --env-file=.env.local scripts/compte-test.mjs   (idempotent : recrée le compte à neuf)
import { createClient } from "@supabase/supabase-js";

const email = process.env.E2E_ORGANISME_EMAIL ?? "espace-test@trouve-ta-formation.fr";
const password = process.env.E2E_ORGANISME_MOT_DE_PASSE;
if (!password) throw new Error("E2E_ORGANISME_MOT_DE_PASSE manquant (.env.local)");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { data: liste } = await db.auth.admin.listUsers({ perPage: 1000 });
const existant = liste.users.find((u) => u.email === email);
if (existant) await db.auth.admin.deleteUser(existant.id); // supprime aussi son organisme (trigger)
const { data, error } = await db.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { nom_organisme: "Centre Test Espace" },
});
if (error) throw error;
const { data: compte } = await db.from("comptes_organisme").select("organisme_id").eq("id", data.user.id).single();
await db.from("organismes").update({ est_test: true }).eq("id", compte.organisme_id);
console.log(`Compte de test prêt : ${email}`);
