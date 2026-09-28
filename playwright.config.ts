import { defineConfig } from "@playwright/test";

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
