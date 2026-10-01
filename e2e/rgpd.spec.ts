import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

// Sprint 11 : limitation des tentatives de connexion, export des données (portabilité), pages légales.
const base = "http://partenaires.localhost:3000";
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});
const debut = new Date().toISOString();

// Les tentatives notées par ces tests ne doivent pas bloquer les tests suivants (même IP locale).
test.afterAll(async () => {
  await db.from("tentatives_acces").delete().gte("created_at", debut);
});

async function connecter(page: import("@playwright/test").Page, email: string, motDePasse: string) {
  await page.getByLabel("Adresse email").fill(email);
  await page.getByLabel("Mot de passe").fill(motDePasse);
  // Attendre la réponse de l'action serveur : le message d'erreur précédent reste affiché entre deux essais.
  await Promise.all([
    page.waitForResponse((r) => r.request().method() === "POST"),
    page.getByRole("button", { name: /Me connecter/ }).click(),
  ]);
}

test("connexion bloquée après 5 échecs sur le même compte", async ({ page }) => {
  const email = `inconnu+${Date.now()}@resend.dev`;
  await page.goto(`${base}/connexion/`);
  for (let i = 0; i < 5; i++) {
    await connecter(page, email, `mauvais-${i}-motdepasse`);
    await expect(page.getByText(/incorrect/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Me connecter/ })).toBeEnabled();
  }
  await connecter(page, email, "encore-un-mauvais");
  await expect(page.getByText("Trop de tentatives. Réessayez dans 15 minutes.")).toBeVisible();
});

test("l'organisme télécharge ses données en JSON", async ({ page }) => {
  await page.goto(`${base}/connexion/`);
  await connecter(page, process.env.E2E_ORGANISME_EMAIL!, process.env.E2E_ORGANISME_MOT_DE_PASSE!);
  await page.waitForURL(/dashboard|bienvenue/);
  await page.goto(`${base}/parametres/`);
  const [telechargement] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: "télécharger vos données" }).click(),
  ]);
  expect(telechargement.suggestedFilename()).toMatch(/^trouve-ta-formation-.+\.json$/);
  const { readFile } = await import("node:fs/promises");
  const donnees = JSON.parse(await readFile((await telechargement.path())!, "utf8"));
  expect(donnees.compte.email).toBe(process.env.E2E_ORGANISME_EMAIL);
  expect(donnees.fiche.nom).toBeTruthy();
  expect(donnees.fiche).not.toHaveProperty("est_test");
});

test("pages légales et mention à l'inscription", async ({ page }) => {
  for (const [chemin, titre] of [
    ["/cookies/", "Cookies"],
    ["/conditions-utilisation/", "Conditions d'utilisation"],
  ]) {
    await page.goto(chemin);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(titre);
  }
  await page.goto(`${base}/inscription/`);
  await expect(page.getByRole("link", { name: "conditions d'utilisation" })).toHaveAttribute(
    "href",
    /\/conditions-utilisation\/$/,
  );
});
