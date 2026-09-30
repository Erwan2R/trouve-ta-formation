import { defineConfig } from "@playwright/test";

// Variables Supabase pour les tests qui préparent des données : base de DEV d'abord (comme « next dev »),
// puis .env.local pour le reste (compte de test). Un fichier absent (CI) est ignoré ; une variable déjà lue garde sa valeur.
for (const fichier of [".env.development.local", ".env.local"])
  try {
    process.loadEnvFile(fichier);
  } catch {}

// Parcours critiques uniquement (formulaire d'affinage, inscription organisme) — Sprints 7 et 8.
export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
