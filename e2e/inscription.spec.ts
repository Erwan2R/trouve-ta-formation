import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";

// Chemin critique du Sprint 8 : inscription → accompagnement → validation de l'email → fiche publiée.
// Espace organisme sur partenaires.localhost (sous-domaine). Adresse de test Resend : délivrée, jamais lue.
const base = "http://partenaires.localhost:3000";
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});
const email = `delivered+e2e${Date.now()}@resend.dev`;

test.afterAll(async () => {
  const { data } = await db.auth.admin.listUsers({ perPage: 1000 });
  const u = data.users.find((x) => x.email === email);
  if (u) await db.auth.admin.deleteUser(u.id); // supprime aussi l'organisme de test
});

test("inscription jusqu'à la première publication de la fiche", async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto(`${base}/inscription/`);
  await page.getByLabel("Nom de l'organisme").fill("Centre E2E Inscription");
  await page.getByLabel("Adresse email").fill(email);
  await page.getByLabel("Mot de passe").fill("Motdepasse-e2e-123");
  await page.getByRole("button", { name: /Créer mon compte/ }).click();

  // Accès immédiat : la validation de l'email bloque la publication, pas l'accès.
  await page.waitForURL("**/bienvenue/1/");
  await expect(page.getByText("Étape 1 sur 7")).toBeVisible();
  await page.getByRole("link", { name: /Continuer/ }).click();
  await page.waitForURL("**/bienvenue/2/");
  await page.getByRole("link", { name: /Continuer/ }).click();

  // Étape 3 : minimum publiable (adresse du siège + un moyen de contact), enregistré automatiquement.
  await page.waitForURL("**/bienvenue/3/");
  const coord = page.locator("#coordonnees");
  await coord.getByRole("combobox").fill("14 rue de la République");
  await coord.getByLabel("Code postal").fill("93000");
  await coord.getByLabel("Ville").fill("Bobigny");
  await coord.getByLabel("Email de contact public").fill("accueil@centre-e2e.fr");
  await expect(coord.getByText(/Enregistré à/)).toBeVisible({ timeout: 30_000 });
  await page.getByRole("link", { name: /Continuer/ }).click();

  // Étape 4 : franchissable en un clic ; étape 5 : cocher un titre suffit.
  await page.getByRole("button", { name: /Non, uniquement au siège/ }).click();
  await page.waitForURL("**/bienvenue/5/");
  await page.getByRole("button", { name: "Ajouter une formation" }).first().click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /^TFP APS/ })
    .click();
  await page.getByRole("button", { name: /Ajouter la sélection/ }).click();
  await expect(page.getByText("TFP APS ajouté à votre fiche.")).toBeVisible();
  await page.getByRole("link", { name: /Continuer/ }).click();
  await page.waitForURL("**/bienvenue/6/");
  await page.getByRole("link", { name: /Continuer/ }).click();
  await page.waitForURL("**/bienvenue/7/");
  await page.getByRole("button", { name: /Terminer/ }).click();

  // Tableau de bord : tant que l'email n'est pas validé, la fiche n'est pas en ligne.
  await page.waitForURL("**/dashboard/");
  await expect(page.getByText("Votre fiche n'est pas encore en ligne")).toBeVisible();

  // Le vrai lien part par email (Resend) : on en fabrique un pour ce compte, même format, usage unique.
  const { data } = await db.auth.admin.listUsers({ perPage: 1000 });
  const id = data.users.find((x) => x.email === email)!.id;
  const jeton = randomBytes(32).toString("base64url");
  await db
    .from("liens_email")
    .insert({ compte_id: id, type: "validation", email, jeton_hash: createHash("sha256").update(jeton).digest("hex") });
  await page.goto(`${base}/auth/verifier/?t=${jeton}`);

  // Première publication : fiche en ligne, lien vers la fiche publique.
  await page.waitForURL("**/dashboard/**");
  await expect(page.locator("header").getByText("En ligne")).toBeVisible();
  await expect(page.getByRole("link", { name: /Voir ma fiche publique/ })).toBeVisible();
});
