import { createClient } from "@supabase/supabase-js";
import { expect, test, type Page } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";

// Espace organisme de bout en bout (audit du 14/10/2026) : un compte neuf parcourt Ma fiche, Mes formations, Paramètres,
// voit sa fiche publiée sur le site, ne peut rien lire ni modifier chez un autre organisme, puis supprime son compte.
// Base de dev uniquement (verrou dans playwright.config.ts).
const base = "http://partenaires.localhost:3000";
const site = "http://localhost:3000";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const db = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const anonyme = () =>
  createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });

const t = Date.now();
const A = {
  email: `delivered+espace${t}@resend.dev`,
  mdp: "Espace-e2e-12345",
  nom: `Centre Espace ${t}`,
  id: "",
  org: "",
  slug: "",
};
const B = {
  email: `delivered+voisin${t}@resend.dev`,
  mdp: "Voisin-e2e-12345",
  nom: `Centre Voisin ${t}`,
  id: "",
  org: "",
};

async function creerCompte(c: typeof A | typeof B) {
  const { data, error } = await db.auth.admin.createUser({
    email: c.email,
    password: c.mdp,
    email_confirm: true,
    user_metadata: { nom_organisme: c.nom },
  });
  if (error) throw error;
  c.id = data.user.id;
  const { data: compte } = await db.from("comptes_organisme").select("organisme_id").eq("id", c.id).single();
  c.org = compte!.organisme_id;
  await db.from("organismes").update({ est_test: true }).eq("id", c.org);
}

test.describe.configure({ mode: "serial" });
let page: Page;
const erreurs: string[] = [];

test.beforeAll(async ({ browser }) => {
  await creerCompte(A);
  await creerCompte(B);
  A.slug = (await db.from("organismes").select("slug").eq("id", A.org).single()).data!.slug;
  page = await browser.newPage();
  page.on("pageerror", (e) => erreurs.push(`${page.url()} : ${e.message}`));
  page.on(
    "console",
    (m) =>
      m.type() === "error" && !/Failed to load resource/.test(m.text()) && erreurs.push(`${page.url()} : ${m.text()}`),
  );
});

test.afterAll(async () => {
  for (const c of [A, B]) if (c.id) await db.auth.admin.deleteUser(c.id).catch(() => {}); // emporte organisme, lieux, offres
  await db.from("demandes_titre").delete().eq("intitule", `Titre inexistant ${t}`);
  await page?.close();
});

/** Contrôles communs à chaque écran : un seul h1, champs et boutons nommés, aucune erreur JavaScript. */
async function auditer() {
  await page.waitForLoadState("networkidle");
  expect(await page.locator("h1").count(), `h1 sur ${page.url()}`).toBe(1);
  const defauts = await page.evaluate(() => ({
    champs: [...document.querySelectorAll("input:not([type=hidden]):not([type=file]),select,textarea")].filter(
      (c) =>
        !(c as HTMLInputElement).labels?.length && !c.getAttribute("aria-label") && !c.getAttribute("aria-labelledby"),
    ).length,
    boutons: [...document.querySelectorAll("button")].filter(
      (b) => !b.textContent?.trim() && !b.getAttribute("aria-label"),
    ).length,
    images: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
  }));
  expect(defauts, `accessibilité sur ${page.url()}`).toEqual({ champs: 0, boutons: 0, images: 0 });
}

async function connecter(email: string, mdp: string) {
  await page.goto(`${base}/connexion/`);
  await page.getByLabel("Adresse email").fill(email);
  await page.getByLabel("Mot de passe").fill(mdp);
  await page.getByRole("button", { name: /Me connecter/ }).click();
}

/** Enregistre une section de Ma fiche et attend la confirmation (ou renvoie le message d'erreur). */
async function enregistrer(section: string) {
  const s = page.locator(section);
  await s.getByRole("button", { name: "Enregistrer" }).click();
  await expect(s.getByText(/Enregistré à|Enregistrée? à/)).toBeVisible({ timeout: 30_000 });
}

test("1. sans session : toutes les pages connectées renvoient vers la connexion", async () => {
  for (const p of [
    "/dashboard/",
    "/ma-fiche/",
    "/formations/",
    "/parametres/",
    "/parametres/export/",
    "/bienvenue/3/",
  ]) {
    await page.goto(`${base}${p}`);
    await expect(page, p).toHaveURL(/\/connexion\//);
  }
});

test("2. connexion, mot de passe oublié, tableau de bord", async () => {
  test.slow();
  for (const p of ["/inscription/", "/connexion/", "/desabonnement/"]) {
    await page.goto(`${base}${p}`);
    await auditer();
  }
  await page.goto(`${base}/mot-de-passe-oublie/`);
  await auditer();
  await page.getByLabel("Adresse email").fill("pas-une-adresse");
  // Champ email natif : le navigateur bloque l'envoi (la validation serveur reste en second rideau).
  expect(await page.getByLabel("Adresse email").evaluate((c: HTMLInputElement) => c.validity.valid)).toBe(false);
  // Même réponse que l'adresse ait un compte ou non : aucune information divulguée.
  await page.getByLabel("Adresse email").fill(`delivered+inconnu${t}@resend.dev`);
  await page
    .getByRole("button")
    .filter({ hasText: /Envoyer|Recevoir/ })
    .click();
  await expect(page.getByRole("status").or(page.getByRole("alert")).filter({ hasText: /\S/ }).first()).toBeVisible();

  await connecter(A.email, "mauvais-mot-de-passe");
  await expect(page.getByText("Adresse email ou mot de passe incorrect.")).toBeVisible();
  await connecter(A.email, A.mdp);
  await page.waitForURL("**/dashboard/", { timeout: 60_000 });
  await auditer();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(A.nom);
  await expect(page.locator("header").getByText("Non publiée")).toBeVisible();
});

test("3. ma fiche : validations refusées, puis chaque section enregistrée et conservée", async () => {
  test.setTimeout(180_000);
  await page.goto(`${base}/ma-fiche/`);
  await auditer();

  // Saisies invalides : message d'erreur, rien d'enregistré.
  const identite = page.locator("#identite");
  await identite.getByLabel("SIRET").fill("123");
  await identite.getByRole("button", { name: "Enregistrer" }).click();
  await expect(identite.getByText(/SIRET/).last()).toBeVisible();
  await expect(identite.getByText(/Enregistré à/)).toHaveCount(0);
  const coord = page.locator("#coordonnees");
  await coord.getByLabel("Email de contact public").fill("pas-un-email");
  await coord.getByRole("button", { name: "Enregistrer" }).click();
  await expect(coord.getByText(/email/i).last()).toBeVisible();
  await expect(coord.getByText(/Enregistré à/)).toHaveCount(0);

  // Identité (SIRET valide : clé de Luhn correcte)
  await identite.getByLabel("SIRET").fill("73282932000074");
  await identite.getByLabel("Raison sociale").fill("Centre Espace SAS");
  await identite.getByLabel("Année de création").fill("2015");
  await enregistrer("#identite");

  // Agrément : Qualiopi certifié avec son numéro
  const agrement = page.locator("#agrement");
  await agrement.getByLabel("Numéro d'autorisation d'exercice CNAPS").fill("FOR-093-2029-01-01-20290000001");
  await agrement.getByRole("radio", { name: "Certifié", exact: true }).click();
  const numQualiopi = agrement.getByLabel(/certificat/i);
  if (await numQualiopi.count()) await numQualiopi.fill("QUALIOPI-E2E-001");
  await enregistrer("#agrement");

  // Coordonnées et siège
  await coord.getByRole("combobox").fill("14 rue de la République");
  await coord.getByLabel("Code postal").fill("93000");
  await coord.getByLabel("Ville").fill("Bobigny");
  await coord.getByLabel("Téléphone").fill("01 48 00 00 00");
  await coord.getByLabel("Site web").fill("https://centre-espace.example.fr");
  await coord.getByLabel("Email de contact public").fill("accueil@centre-espace.example.fr");
  await coord.getByLabel("Horaires d'accueil").fill("Du lundi au vendredi, de 9 h à 18 h");
  await page.keyboard.press("Escape"); // ferme les suggestions d'adresse
  await enregistrer("#coordonnees");

  // Lieu additionnel
  const lieux = page.locator("#lieux");
  await lieux.getByRole("button", { name: "Ajouter un lieu" }).click();
  await lieux.getByLabel("Nom du lieu").fill("Antenne Créteil");
  await lieux.getByRole("combobox").fill("1 avenue du Général de Gaulle");
  await lieux.getByLabel("Code postal").fill("94000");
  await lieux.getByLabel("Ville").fill("Créteil");
  await page.keyboard.press("Escape");
  await enregistrer("#lieux");

  // Informations pratiques et présentation
  const pratique = page.locator("#pratique");
  await pratique.getByRole("button", { name: "CPF" }).click();
  await pratique.getByRole("button", { name: "Anglais" }).click();
  await pratique.getByRole("radio", { name: "Oui", exact: true }).click();
  await enregistrer("#pratique");
  await page
    .getByLabel("Présentation")
    .fill("Centre de test automatisé. Sessions de 12 stagiaires maximum, à Bobigny et Créteil.");
  await enregistrer("#presentation");

  // Logo : format refusé, puis PNG accepté (converti en WebP), puis retiré.
  const fichier = page.locator("#logo input[type=file]");
  await fichier.setInputFiles({ name: "logo.txt", mimeType: "text/plain", buffer: Buffer.from("pas une image") });
  await expect(page.locator("#logo").getByText(/format n'est pas accepté/)).toBeVisible();
  await fichier.setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: readFileSync("app/icon.png") });
  await expect(page.getByRole("button", { name: "Retirer le logo" })).toBeVisible({ timeout: 30_000 });
  const { data: avecLogo } = await db.from("organismes").select("logo_url").eq("id", A.org).single();
  expect(avecLogo!.logo_url).toMatch(/\.webp$/);

  // Tout est conservé au rechargement.
  await page.reload();
  await expect(identite.getByLabel("SIRET")).toHaveValue("73282932000074");
  await expect(coord.getByLabel("Ville")).toHaveValue("Bobigny");
  await expect(lieux.getByLabel("Nom du lieu")).toHaveValue("Antenne Créteil");
  await expect(pratique.getByRole("button", { name: "CPF" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Présentation")).toHaveValue(/Centre de test automatisé/);
});

test("4. mes formations : ajout, détail complété, retrait, demande de titre", async () => {
  test.setTimeout(180_000);
  await page.goto(`${base}/formations/`);
  await auditer();
  await page.getByRole("button", { name: "Ajouter une formation" }).first().click();
  const modale = page.getByRole("dialog");
  await modale.getByRole("searchbox", { name: "Rechercher un titre" }).fill("ssiap 1");
  await expect(modale.getByRole("button", { name: /^TFP APS/ })).toHaveCount(0);
  await modale.getByRole("searchbox", { name: "Rechercher un titre" }).fill("");
  await modale.getByRole("button", { name: /^TFP APS/ }).click();
  await modale.getByRole("button", { name: /^SSIAP 1/ }).click();
  await modale.getByRole("button", { name: /Ajouter la sélection/ }).click();
  await expect(page.getByText("2 formations ajoutées à votre fiche.")).toBeVisible();
  // La liste se met à jour sans rechargement.
  await expect(page.getByRole("listitem").filter({ hasText: "À compléter" })).toHaveCount(2, { timeout: 15_000 });
  await expect(page.getByRole("link", { name: /Mes formations 2/ })).toBeVisible();

  // Détail du TFP APS : prix, durée, rythme, financement → « Complète »
  const tfp = page.getByRole("listitem").filter({ hasText: "Agent de prévention et de sécurité" });
  await tfp.getByRole("button", { name: /Compléter/ }).click();
  const detail = page.getByRole("dialog", { name: "Détail de la formation" });
  await detail.getByLabel(/^Prix/).first().fill("1490");
  await detail.getByLabel("Durée réelle en heures").fill("175");
  await detail.getByRole("button", { name: "Temps plein" }).click();
  await detail.getByRole("button", { name: /CPF/ }).click();
  await detail.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText(/TFP APS est maintenant complète|Formation enregistrée/)).toBeVisible();
  await expect(tfp.getByText("Complète")).toBeVisible({ timeout: 15_000 });
  await expect(tfp).toContainText("1 490 €");

  // Retrait du SSIAP 1, avec confirmation
  const ssiap = page.getByRole("listitem").filter({ hasText: "sécurité incendie" });
  await ssiap.getByRole("button", { name: "Retirer" }).click();
  await ssiap.getByRole("button", { name: "Retirer" }).click();
  await expect(page.getByRole("listitem").filter({ hasText: "sécurité incendie" })).toHaveCount(0, { timeout: 15_000 });

  // Titre absent du référentiel : demande envoyée à l'admin, jamais de saisie libre sur la fiche.
  await page.getByRole("button", { name: "Ajouter une formation" }).first().click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /Faire une demande/ })
    .click();
  await page.getByRole("dialog").getByLabel("Intitulé du titre").fill(`Titre inexistant ${t}`);
  await page.getByRole("dialog").getByRole("button", { name: "Envoyer la demande" }).click();
  await expect(page.getByText("Demande envoyée. Nous vous répondrons par email.")).toBeVisible();
});

test("5. validation de l'email → fiche en ligne et visible sur le site public", async () => {
  test.setTimeout(180_000);
  // Le vrai lien part par email (Resend) : on en fabrique un, même format, usage unique.
  const jeton = randomBytes(32).toString("base64url");
  await db.from("liens_email").insert({
    compte_id: A.id,
    type: "validation",
    email: A.email,
    jeton_hash: createHash("sha256").update(jeton).digest("hex"),
    // Antidaté : le délai de 2 minutes entre deux emails bloquerait le changement d'email de l'étape 6.
    created_at: new Date(Date.now() - 10 * 60_000).toISOString(),
  });
  await page.goto(`${base}/auth/verifier/?t=${jeton}`);
  await page.waitForURL("**/dashboard/**");
  await expect(page.locator("header").getByText("En ligne")).toBeVisible();
  await expect(page.getByRole("link", { name: /Voir ma fiche publique/ })).toBeVisible();
  // Lien à usage unique
  await page.goto(`${base}/auth/verifier/?t=${jeton}`);
  await expect(page).not.toHaveURL(/email=confirme/);

  // Fiche publique : contenu saisi, ancre de l'offre, données structurées, indexabilité
  await page.goto(`${site}/securite-privee/organismes/${A.slug}/`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(A.nom);
  await expect(page.locator("body")).toContainText("Centre de test automatisé");
  await expect(page.locator("body")).toContainText("1 490 €");
  await expect(page.locator("body")).toContainText("Bobigny");
  await expect(page.locator("#tfp-aps")).toHaveCount(1);
  await expect(page.locator("body")).not.toContainText("SSIAP 1 — Agent de service");
  const types = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(types.join(" ")).toMatch(/LocalBusiness|EducationalOrganization/);
  expect(types.join(" ")).toContain("BreadcrumbList");
  // Catalogue et page du titre listent la fiche
  await page.goto(`${site}/securite-privee/organismes/`);
  await expect(page.getByRole("link", { name: new RegExp(A.nom) }).first()).toBeVisible();
  // Données internes jamais publiées
  const html = await (await page.request.get(`${site}/securite-privee/organismes/${A.slug}/`)).text();
  expect(html).not.toContain(A.email);
  expect(html).not.toContain(A.id);
});

test("5 bis. une modification de la fiche en ligne apparaît aussitôt sur le site public", async () => {
  test.setTimeout(120_000);
  // La fiche vient d'être vue (étape 5) : elle est en cache. La modification doit la régénérer.
  await page.goto(`${base}/ma-fiche/`);
  await page.getByLabel("Présentation").fill(`Présentation modifiée ${t}.`);
  await enregistrer("#presentation");
  await page.goto(`${site}/securite-privee/organismes/${A.slug}/`);
  await expect(page.locator("body")).toContainText(`Présentation modifiée ${t}.`);
});

test("6. paramètres : infos du compte, mot de passe, email, export", async () => {
  test.setTimeout(180_000);
  await page.goto(`${base}/parametres/`);
  await auditer();
  await page.getByLabel("Nom du contact principal").fill("Camille Test");
  await page.getByLabel("Téléphone direct").fill("06 00 00 00 00");
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await expect(page.getByText(/Enregistré à/).first()).toBeVisible();

  // Mot de passe : actuel faux, confirmation différente, trop court, puis correct
  const nouveau = "Nouveau-e2e-67890";
  const ouvrirMdp = () => page.getByRole("button", { name: "Modifier" }).nth(1).click();
  const saisir = async (actuel: string, n: string, c: string) => {
    await page.getByLabel("Mot de passe actuel").fill(actuel);
    await page.getByLabel("Nouveau mot de passe", { exact: true }).fill(n);
    await page.getByLabel("Confirmer le nouveau mot de passe").fill(c);
  };
  await ouvrirMdp();
  await saisir(A.mdp, "court", "court");
  await expect(page.getByRole("button", { name: "Enregistrer le mot de passe" })).toBeDisabled();
  await saisir(A.mdp, nouveau, nouveau + "x");
  const bouton = page.getByRole("button", { name: "Enregistrer le mot de passe" });
  if (await bouton.isEnabled()) {
    await bouton.click();
    await expect(page.getByText("Les deux mots de passe ne correspondent pas.")).toBeVisible();
  }
  await saisir("faux-mot-de-passe", nouveau, nouveau);
  await bouton.click();
  await expect(page.getByText("Le mot de passe actuel est incorrect.")).toBeVisible();
  await saisir(A.mdp, nouveau, nouveau);
  await bouton.click();
  await expect(page.getByText("Mot de passe modifié.", { exact: false })).toBeVisible({ timeout: 30_000 });
  A.mdp = nouveau;

  // Changement d'email : lien envoyé, ancien email actif jusqu'à confirmation, demande annulable
  await page.goto(`${base}/parametres/`);
  await page.getByRole("button", { name: "Modifier" }).first().click();
  await page.getByLabel("Nouvel email de connexion").fill(`delivered+nouvel${t}@resend.dev`);
  await page.getByRole("button", { name: "Envoyer le lien de confirmation" }).click();
  await expect(page.getByText(`delivered+nouvel${t}@resend.dev`).first()).toBeVisible();
  const annuler = page.getByRole("button", { name: /Annuler/ }).first();
  if (await annuler.isVisible()) await annuler.click();
  const { data: u } = await db.auth.admin.getUserById(A.id);
  expect(u.user!.email).toBe(A.email);

  // Export RGPD : ses données, et seulement les siennes
  // Requête depuis le navigateur (session et sous-domaine *.localhost résolus par Chromium, pas par Node).
  const reponse = await page.evaluate(async () => {
    const r = await fetch("/parametres/export/");
    return { statut: r.status, disposition: r.headers.get("content-disposition"), json: await r.json() };
  });
  expect(reponse.statut).toBe(200);
  expect(reponse.disposition).toContain("attachment");
  const json = reponse.json;
  expect(json.fiche.nom).toBe(A.nom);
  expect(json.compte.contact_nom).toBe("Camille Test");
  expect(json.formations).toHaveLength(1);
  expect(JSON.stringify(json)).not.toContain(B.nom);
  expect(json.fiche).not.toHaveProperty("est_test");
});

test("7. sécurité : aucun accès aux données d'un autre organisme, aucun champ réservé modifiable", async () => {
  const client = anonyme();
  const { error: connexion } = await client.auth.signInWithPassword({ email: A.email, password: A.mdp });
  expect(connexion).toBeNull();

  // Lecture : la fiche brouillon de B, son compte, ses lieux sont invisibles
  expect((await client.from("organismes").select("id").eq("id", B.org)).data).toEqual([]);
  expect((await client.from("comptes_organisme").select("id").eq("id", B.id)).data).toEqual([]);
  expect((await client.from("lieux").select("id").eq("organisme_id", B.org)).data).toEqual([]);

  // Écriture chez B : aucune ligne touchée ou refus
  await client.from("organismes").update({ nom: "Piraté" }).eq("id", B.org);
  expect((await db.from("organismes").select("nom").eq("id", B.org).single()).data!.nom).toBe(B.nom);
  const titre = (await db.from("titres_referentiel").select("id, slug").eq("statut", "actif").limit(1).single()).data!;
  expect(
    (await client.from("organisme_titres").insert({ organisme_id: B.org, titre_id: titre.id, slug: titre.slug })).error,
  ).not.toBeNull();
  expect(
    (await client.from("lieux").insert({ organisme_id: B.org, adresse: "x", code_postal: "75001", ville: "Paris" }))
      .error,
  ).not.toBeNull();
  expect(
    (await client.storage.from("logos").upload(`${B.org}/intrus.webp`, Buffer.from("x"), { contentType: "image/webp" }))
      .error,
  ).not.toBeNull();

  // Sur sa propre fiche : statut, test, slug et score sont réservés
  for (const champ of [{ statut: "publie" }, { est_test: false }, { slug: "slug-pirate" }, { score_completude: 100 }]) {
    const { error } = await client
      .from("organismes")
      .update(champ as never)
      .eq("id", A.org);
    expect(error, JSON.stringify(champ)).not.toBeNull();
  }
  // Offre hors référentiel actif : refusée
  expect(
    (await client.from("organisme_titres").insert({ organisme_id: A.org, titre_id: 999999, slug: "faux" })).error,
  ).not.toBeNull();

  // Visiteur anonyme : ni comptes, ni fiches brouillon, ni demandes de titre
  const anon = anonyme();
  expect((await anon.from("comptes_organisme").select("id")).data ?? []).toEqual([]);
  expect((await anon.from("organismes").select("id").eq("id", B.org)).data).toEqual([]);
  expect((await anon.from("demandes_titre").select("id")).data ?? []).toEqual([]);
  await client.auth.signOut({ scope: "local" }); // « global » fermerait aussi la session du navigateur
});

test("8. déconnexion puis reconnexion avec le nouveau mot de passe", async () => {
  await page.goto(`${base}/dashboard/`);
  await page.getByRole("button", { name: "Menu du compte" }).click();
  await page.getByRole("menuitem", { name: "Se déconnecter" }).click();
  await page.waitForURL(/\/connexion\//);
  await page.goto(`${base}/ma-fiche/`);
  await expect(page).toHaveURL(/\/connexion\//);
  await connecter(A.email, A.mdp);
  await page.waitForURL("**/dashboard/");
});

test("9. suppression du compte : confirmation exigée, fiche retirée du site, connexion impossible", async () => {
  test.setTimeout(120_000);
  await page.goto(`${base}/parametres/`);
  const confirmation = page.getByLabel(/Pour confirmer, saisissez le nom de votre organisme/);
  const supprimer = page.getByRole("button", { name: "Supprimer définitivement le compte" });
  await confirmation.fill("Mauvais nom");
  await expect(supprimer).toBeDisabled();
  await confirmation.fill(A.nom);
  await supprimer.click();
  await page.waitForURL("**/compte-supprime/**", { timeout: 60_000 });
  await auditer();

  expect((await db.from("organismes").select("id").eq("id", A.org)).data).toEqual([]);
  expect((await db.storage.from("logos").list(A.org)).data ?? []).toEqual([]);
  const fiche = await page.request.get(`${site}/securite-privee/organismes/${A.slug}/`, { maxRedirects: 0 });
  expect([301, 308, 404, 410]).toContain(fiche.status());
  await connecter(A.email, A.mdp);
  await expect(page.getByText("Adresse email ou mot de passe incorrect.")).toBeVisible();
  A.id = "";
});

test("10. aucune erreur JavaScript sur l'ensemble du parcours", async () => {
  expect(erreurs).toEqual([]);
});
