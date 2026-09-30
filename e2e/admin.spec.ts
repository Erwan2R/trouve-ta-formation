import { createClient } from "@supabase/supabase-js";
import { expect, type Page, test } from "@playwright/test";
import { createHmac } from "node:crypto";

// Accès admin sur admin.localhost (base de DEV) : mot de passe, 2FA obligatoire, codes de récupération.
// Le test remet à zéro l'administrateur de dev (mot de passe, application d'authentification, codes).
const base = "http://admin.localhost:3000";
const MOT_DE_PASSE = "e2e-admin-Sprint9-!";
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

/** Code TOTP (RFC 6238, SHA-1, 30 s, 6 chiffres) calculé depuis la clé affichée sous le QR code. */
function totp(cle: string, decalage = 0) {
  const bits = [...cle.replace(/[\s=]/g, "")]
    .map((c) => "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".indexOf(c).toString(2).padStart(5, "0"))
    .join("");
  const secret = Buffer.from(bits.match(/.{8}/g)!.map((b) => parseInt(b, 2)));
  const compteur = Buffer.alloc(8);
  compteur.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000) + decalage));
  const h = createHmac("sha1", secret).update(compteur).digest();
  return String((h.readUInt32BE(h[19] & 15) & 0x7fffffff) % 1e6).padStart(6, "0");
}

async function connexion(page: Page, email: string, mdp = MOT_DE_PASSE) {
  await page.goto(`${base}/connexion/`);
  await page.getByLabel("Adresse email").fill(email);
  await page.getByLabel("Mot de passe").fill(mdp);
  await page.getByRole("button", { name: "Me connecter" }).click();
}

async function deconnexion(page: Page) {
  await page.getByRole("button", { name: "Menu du compte" }).click();
  await page.getByRole("menuitem", { name: "Se déconnecter" }).click();
  await page.waitForURL(`${base}/connexion/`);
}

test("connexion admin : 2FA imposé, code TOTP, code de récupération", async ({ page }) => {
  test.setTimeout(120_000);
  const { data: a } = await db.from("administrateurs").select("id").single();
  const { data: u } = await db.auth.admin.getUserById(a!.id);
  const email = u.user!.email!;
  for (const f of u.user!.factors ?? []) await db.auth.admin.mfa.deleteFactor({ id: f.id, userId: a!.id });
  await db.auth.admin.updateUserById(a!.id, { password: MOT_DE_PASSE });
  await db.from("codes_recuperation_admin").delete().eq("admin_id", a!.id);

  // L'espace admin n'existe que sur son sous-domaine.
  expect((await page.goto("http://localhost:3000/admin/connexion/"))!.status()).toBe(404);
  await page.goto(`${base}/dashboard/`);
  await expect(page).toHaveURL(`${base}/connexion/`);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  await connexion(page, email, "mauvais-mot-de-passe");
  await expect(page.getByRole("alert").filter({ hasText: /./ })).toHaveText("Adresse email ou mot de passe incorrect.");

  // Premier accès : seule la page Paramètres est ouverte tant que le 2FA n'est pas configuré.
  await connexion(page, email);
  await page.waitForURL(`${base}/parametres/`);
  await expect(page.getByText("Sécurisation du compte à terminer")).toBeVisible();
  await page.goto(`${base}/dashboard/`);
  await expect(page).toHaveURL(`${base}/parametres/`);

  const cle = page.getByText(/^([A-Z2-7]{4} ?)+$/);
  await expect(cle).toBeVisible();
  const cleTexte = await cle.innerText();
  await page.getByLabel("Code à six chiffres").fill("000000");
  await page.getByRole("button", { name: "Vérifier et activer" }).click();
  await expect(page.getByText("Code incorrect. Vérifiez l'heure de votre appareil et réessayez.")).toBeVisible();
  await page.getByLabel("Code à six chiffres").fill(totp(cleTexte));
  await page.getByRole("button", { name: "Vérifier et activer" }).click();

  await expect(page.getByText("Vos codes de récupération")).toBeVisible();
  const codes = await page.getByText(/^[A-Z2-9]{4}-[A-Z2-9]{4}$/).allInnerTexts();
  expect(codes).toHaveLength(10);
  await expect(page.getByRole("button", { name: "Terminer" })).toBeDisabled();
  await page.getByLabel("J'ai conservé ces codes hors ligne. Ils ne seront plus affichés.").check();
  await page.getByRole("button", { name: "Terminer" }).click();
  await expect(page.getByText("Activée", { exact: true })).toBeVisible();
  await expect(page.getByText("codes restants")).toBeVisible();
  await expect(page.getByText("Sécurisation du compte à terminer")).toBeHidden();
  const { data: stockes } = await db.from("codes_recuperation_admin").select("code_hash").eq("admin_id", a!.id);
  expect(stockes).toHaveLength(10);
  expect(stockes!.map((s) => s.code_hash)).not.toContain(codes[0]); // hachés, jamais en clair

  await page.goto(`${base}/dashboard/`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tableau de bord");

  // Connexion suivante : code de l'application exigé.
  await deconnexion(page);
  const { data: secret } = await db.auth.admin.mfa.listFactors({ userId: a!.id });
  expect(secret!.factors.filter((f) => f.status === "verified")).toHaveLength(1);
  await connexion(page, email);
  await page.waitForURL(`${base}/verification/`);
  await page.goto(`${base}/parametres/`);
  await expect(page).toHaveURL(`${base}/verification/`);
  await page.getByLabel("Code à six chiffres").fill("000000");
  await page.getByRole("button", { name: "Vérifier", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: /./ })).toHaveText("Code incorrect. Vérifiez l'heure de votre appareil et réessayez.");
  await page.getByLabel("Code à six chiffres").fill(totp(cleTexte));
  await page.getByRole("button", { name: "Vérifier", exact: true }).click();
  await page.waitForURL(`${base}/dashboard/`);
  await deconnexion(page);
  await connexion(page, email);
  await page.waitForURL(`${base}/verification/`);

  // Appareil perdu : un code de récupération, puis reconfiguration obligatoire.
  await page.getByText("Appareil perdu ? Utiliser un code de récupération").click();
  await page.getByLabel("Code de récupération").fill(codes[3].toLowerCase().replace("-", " "));
  await page.getByRole("button", { name: "Utiliser ce code" }).click();
  await page.waitForURL(`${base}/parametres/`);
  await expect(page.getByText("Sécurisation du compte à terminer")).toBeVisible();
  const { data: utilise } = await db
    .from("codes_recuperation_admin")
    .select("id")
    .eq("admin_id", a!.id)
    .not("utilise_le", "is", null);
  expect(utilise).toHaveLength(1);
});
