import { expect, test } from "@playwright/test";

// Chemin critique du formulaire d'affinage : accueil → questions → résultat → modifier → affiner.
test("parcours complet, sans réinitialisation au retour", async ({ page }) => {
  await page.goto("/securite-privee/");
  await page.getByRole("link", { name: "Je ne travaille pas encore dans la sécurité privée" }).click();

  // L'accueil a déjà posé la question 1 : on arrive à l'écran 2.
  await expect(page.getByText("Question 2 sur 6")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("link", { name: /Revenir à la page précédente/ })).toHaveAttribute(
    "href",
    "/securite-privee/",
  );
  await page.getByRole("button", { name: /Assurer la sécurité incendie/ }).click();
  await page.getByRole("button", { name: /Non, pas encore/ }).click();
  await page.getByRole("button", { name: /Salarié/ }).click();

  // Multi-sélection : « Peu importe » exclut les départements (après hydratation).
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Seine-Saint-Denis (93)").check();
  await page.getByLabel("Peu importe, je peux me déplacer").check();
  await expect(page.getByLabel("Seine-Saint-Denis (93)")).not.toBeChecked();
  await page.getByLabel("Seine-Saint-Denis (93)").check();
  await page.getByRole("button", { name: "Continuer" }).click();
  await page.getByRole("button", { name: /Temps plein/ }).click();

  await expect(page.getByRole("heading", { level: 2 })).toContainText("SSIAP 1");
  await expect(page.getByText("Commencez par votre autorisation préalable")).toBeVisible();
  await expect(page.getByText("Avant de vous inscrire, vérifiez que vous remplissez les conditions")).toBeVisible();

  // Modifier : dernière question de filtrage, réponse présélectionnée ; retour sans perte.
  await page.getByRole("link", { name: "Modifier mes réponses" }).click();
  await expect(page.getByRole("button", { name: /Temps plein/ })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: "Retour" }).click();
  await expect(page.getByLabel("Seine-Saint-Denis (93)")).toBeChecked();

  // Affinage : 4 questions, puis résultat affiné.
  await page.goto(page.url().replace(/etape=[^&]*/, "etape=resultat"));
  await page.getByRole("link", { name: /Affiner mes résultats/ }).click();
  await expect(page.getByText("Question 1 sur 4")).toBeVisible();
  await page.getByRole("button", { name: /Un seul pour commencer/ }).click();
  await page.getByRole("button", { name: /En transports en commun/ }).click();
  await page.getByRole("button", { name: /Dans les 3 mois/ }).click();
  await page.getByRole("button", { name: "Voir mes résultats" }).click();
  await expect(page.getByText("Votre résultat affiné")).toBeVisible();
  await expect(page.getByRole("link", { name: /Affiner mes résultats/ })).toHaveCount(0);
});

test("renouvellement ASA : message dédié, aucune recommandation", async ({ page }) => {
  await page.goto("/securite-privee/formulaire/?depart=renouvellement");
  await page.getByRole("button", { name: /TFP ASA/ }).click();
  await expect(page.getByText("suit un parcours particulier")).toBeVisible();
  await expect(page.getByText("Le titre à viser")).toHaveCount(0);
});
