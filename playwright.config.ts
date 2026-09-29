import { defineConfig } from "@playwright/test";

// Variables de .env.local (Supabase) pour les tests qui préparent des données ; absent en CI.
try {
  process.loadEnvFile(".env.local");
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
