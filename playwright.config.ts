import { defineConfig } from "@playwright/test";

// Variables Supabase pour les tests qui préparent des données : base de DEV d'abord (comme « next dev »),
// puis .env.local pour le reste (compte de test). Un fichier absent (CI) est ignoré ; une variable déjà lue garde sa valeur.
for (const fichier of [".env.development.local", ".env.local"])
  try {
    process.loadEnvFile(fichier);
  } catch {}

// Verrou : les tests créent, modifient et suppriment des comptes (dont le compte admin, remis à zéro avec un mot de
// passe connu). Ils ne s'exécutent JAMAIS contre une autre base que celle de dev : arrêt immédiat sinon.
const BASE_DE_DEV = "https://livkbehsovponxhbctac.supabase.co";
if (process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") !== BASE_DE_DEV)
  throw new Error(`Tests refusés : NEXT_PUBLIC_SUPABASE_URL doit être la base de dev (${BASE_DE_DEV}).`);

// Parcours critiques uniquement (formulaire d'affinage, inscription organisme) — Sprints 7 et 8.
export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:3000" },
  // Serveur toujours lancé ici, jamais réutilisé : un « npm run start » lancé à la main lit .env.local (base de PROD)
  // et le verrou ci-dessus ne le verrait pas (incident du 14/10/2026). Lancé d'ici, il hérite des variables de dev.
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
