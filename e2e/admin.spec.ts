import { createClient } from "@supabase/supabase-js";
import { expect, type Page, test } from "@playwright/test";
import { createHmac } from "node:crypto";
import { empreintesDe } from "../lib/prospection";

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

/** Administrateur de dev remis à zéro : mot de passe connu, aucune application, aucun code. */
async function reinitialiserAdmin() {
  const a = (await db.from("administrateurs").select("id").single()).data!;
  const { data: u } = await db.auth.admin.getUserById(a.id);
  for (const f of u.user!.factors ?? []) await db.auth.admin.mfa.deleteFactor({ id: f.id, userId: a.id });
  await db.auth.admin.updateUserById(a.id, { password: MOT_DE_PASSE });
  await db.from("codes_recuperation_admin").delete().eq("admin_id", a.id);
  return { a, email: u.user!.email! };
}

/** Connexion avec un 2FA fraîchement configuré (espace admin entièrement ouvert). */
async function connecterAdmin(page: Page) {
  const { email } = await reinitialiserAdmin();
  await connexion(page, email);
  await page.waitForURL(`${base}/parametres/`);
  const cle = await page.getByText(/^([A-Z2-7]{4} ?)+$/).innerText();
  await page.getByLabel("Code à six chiffres").fill(totp(cle));
  await page.getByRole("button", { name: "Vérifier et activer" }).click();
  await page.getByLabel("J'ai conservé ces codes hors ligne. Ils ne seront plus affichés.").check();
  await page.getByRole("button", { name: "Terminer" }).click();
  await expect(page.getByText("Activée", { exact: true })).toBeVisible();
}

test.describe.configure({ mode: "serial" });

test("connexion admin : 2FA imposé, code TOTP, code de récupération", async ({ page }) => {
  test.setTimeout(120_000);
  const { a, email } = await reinitialiserAdmin();

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
  const { data: stockes } = await db.from("codes_recuperation_admin").select("code_hash").eq("admin_id", a.id);
  expect(stockes).toHaveLength(10);
  expect(stockes!.map((s) => s.code_hash)).not.toContain(codes[0]); // hachés, jamais en clair

  await page.goto(`${base}/dashboard/`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ce qui a besoin de vous");

  // Connexion suivante : code de l'application exigé.
  await deconnexion(page);
  const { data: secret } = await db.auth.admin.mfa.listFactors({ userId: a.id });
  expect(secret!.factors.filter((f) => f.status === "verified")).toHaveLength(1);
  await connexion(page, email);
  await page.waitForURL(`${base}/verification/`);
  await page.goto(`${base}/parametres/`);
  await expect(page).toHaveURL(`${base}/verification/`);
  await page.getByLabel("Code à six chiffres").fill("000000");
  await page.getByRole("button", { name: "Vérifier", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: /./ })).toHaveText(
    "Code incorrect. Vérifiez l'heure de votre appareil et réessayez.",
  );
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
    .eq("admin_id", a.id)
    .not("utilise_le", "is", null);
  expect(utilise).toHaveLength(1);
});

test("modération : rappel, suspension, réactivation, suppression", async ({ page }) => {
  test.setTimeout(120_000);
  const nom = `E2E Admin Organisme ${Date.now()}`;
  const { data: cree } = await db.auth.admin.createUser({
    email: `delivered+admin-${Date.now()}@resend.dev`,
    password: "e2e-organisme-2026",
    email_confirm: true,
    user_metadata: { nom_organisme: nom },
  });
  const { data: compte } = await db.from("comptes_organisme").select("organisme_id").eq("id", cree.user!.id).single();
  const org = compte!.organisme_id;

  await connecterAdmin(page);

  // Tableau de bord → Fichier client filtré sur les fiches sans formation.
  await page.goto(`${base}/dashboard/`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ce qui a besoin de vous");
  await page.getByRole("link", { name: "Voir les fiches sans formation" }).click();
  await page.waitForURL(`${base}/organismes/?sans-formation=1&depuis=dashboard`, { timeout: 30_000 });
  await expect(page.getByText("Depuis le tableau de bord")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sans formation déclarée" })).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Rechercher un organisme").fill(nom);
  await expect(page.getByRole("heading", { name: "1 organisme" })).toBeVisible();

  // Rappel : type obligatoire, pas de valeur par défaut.
  await page.getByRole("button", { name: `Envoyer un rappel à ${nom}` }).click();
  await expect(page.getByRole("button", { name: "Envoyer", exact: true })).toBeDisabled();
  await page.getByRole("radio", { name: "Rappel d'ajout de formation" }).click();
  await page.getByRole("button", { name: "Envoyer", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(`Rappel d'ajout de formation envoyé à ${nom}.`);
  const { data: rappels } = await db.from("rappels_organisme").select("type").eq("organisme_id", org);
  expect(rappels).toEqual([{ type: "ajout_formation" }]);

  // Suspension en confirmation simple.
  await page.getByRole("button", { name: `Suspendre ${nom}` }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Suspendre" }).click();
  await expect(page.getByRole("status")).toContainText(`${nom} suspendu. La fiche est dépubliée.`);
  expect((await db.from("organismes").select("statut").eq("id", org).single()).data!.statut).toBe("suspendu");

  // Fiche client : lecture seule, historique des rappels, mêmes actions.
  await page.getByRole("link", { name: new RegExp(nom) }).click();
  await page.waitForURL(`${base}/organismes/${org}/`, { timeout: 30_000 });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(nom);
  await expect(page.getByText("Compte suspendu", { exact: true })).toBeVisible();
  await expect(page.getByText("Rappel d'ajout de formation")).toBeVisible();
  await expect(page.locator("input:not([type=hidden]), textarea")).toHaveCount(0);
  await page.getByRole("button", { name: "Réactiver le compte" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Réactiver" }).click();
  await expect(page.getByRole("status")).toContainText(`${nom} réactivé.`);
  // Fiche vide : réactivée mais pas publiable (minimum non rempli).
  expect((await db.from("organismes").select("statut").eq("id", org).single()).data!.statut).toBe("brouillon");

  // Suppression : bouton actif seulement après saisie exacte du nom.
  await page.getByRole("button", { name: "Supprimer le compte" }).click();
  const supprimer = page.getByRole("button", { name: "Supprimer définitivement" });
  await expect(supprimer).toBeDisabled();
  await page.getByRole("dialog").getByRole("textbox").fill(nom);
  await supprimer.click();
  await expect(page.getByRole("heading", { name: "Compte supprimé" })).toBeVisible();
  expect((await db.from("organismes").select("id").eq("id", org)).data).toHaveLength(0);
  expect((await db.auth.admin.getUserById(cree.user!.id)).data.user).toBeNull();
});

test("prospection : import, compte rendu, exclusion définitive, passage à « inscrit »", async ({ page }) => {
  test.setTimeout(120_000);
  // Données fictives (SIRET inexistants) : jamais le fichier réel du scraping dans un test.
  const A = {
    siret: "99999999900011",
    siren: "999999999",
    email: "contact@e2e-prospect-a.fr",
    site_web: "https://www.e2e-prospect-a.fr/",
  };
  const B = { siret: null, siren: "999999998", email: "e2e.prospect.b@gmail.com", site_web: null };
  const nettoyer = async () => {
    await db.from("prospects").delete().in("identifiant", [A.siret, B.siren]);
    await db
      .from("exclusions_prospection")
      .delete()
      .in("empreinte", [...empreintesDe(A), ...empreintesDe(B)]);
  };
  await nettoyer();
  // Comme le fichier du scraping : BOM UTF-8, fins de ligne CRLF.
  const csv = Buffer.from(
    String.fromCharCode(0xfeff) +
      [
        "nom_organisme;raison_sociale;siret;siren;site_web;email;titres_prepares",
        `E2E Prospect A;;${A.siret};${A.siren};${A.site_web};${A.email};"TFP APS ; SSIAP 1"`,
        `E2E Prospect B;;;${B.siren};;${B.email};`,
        "E2E Sans identifiant;;;;;;",
      ].join(String.fromCharCode(13, 10)),
  );
  const importer = async () => {
    await page
      .getByLabel("Fichier CSV")
      .setInputFiles({ name: "organismes_idf.csv", mimeType: "text/csv", buffer: csv });
    await page.getByRole("button", { name: "Importer" }).click();
    return page.getByRole("status").filter({ hasText: "Compte rendu" });
  };

  await connecterAdmin(page);
  await page.goto(`${base}/prospection/`);
  let rapport = await importer();
  await expect(rapport).toContainText("2 ajoutés · 0 mis à jour");
  await expect(rapport).toContainText("0 ignorés (liste d'exclusion)");
  await expect(rapport).toContainText("1 lignes ignorées faute de SIRET ou de SIREN");
  await expect(rapport).toContainText("1 adresses de messagerie personnelle (gmail, hotmail, outlook, orange…) sur 2");

  await page.getByLabel("Rechercher un prospect").fill("E2E Prospect");
  await expect(page.getByRole("heading", { name: "2 prospects" })).toBeVisible();
  await page.getByLabel("Statut de E2E Prospect A").selectOption("contacte");
  await expect
    .poll(async () => (await db.from("prospects").select("statut").eq("identifiant", A.siret).single()).data?.statut)
    .toBe("contacte");

  // Demande de suppression : données effacées, identifiants exclus pour toujours.
  await page.getByRole("button", { name: "Demande de suppression pour E2E Prospect A" }).click();
  await page.getByRole("button", { name: "Enregistrer et effacer" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Demande enregistrée" })).toContainText("1 prospect effacé");
  expect((await db.from("prospects").select("id").eq("identifiant", A.siret)).data).toHaveLength(0);
  const { data: exclusions } = await db
    .from("exclusions_prospection")
    .select("empreinte")
    .in("empreinte", empreintesDe(A));
  expect(exclusions).toHaveLength(4);

  // Un nouvel import ne le réintègre pas ; le prospect B est mis à jour sans perdre son statut.
  rapport = await importer();
  await expect(rapport).toContainText("0 ajoutés · 1 mis à jour");
  await expect(rapport).toContainText("1 ignorés (liste d'exclusion)");
  expect((await db.from("prospects").select("id").eq("identifiant", A.siret)).data).toHaveLength(0);

  // Un organisme inscrit renseigne un SIRET de ce SIREN : le prospect passe à « inscrit ».
  const { data: cree } = await db.auth.admin.createUser({
    email: `delivered+prospect-${Date.now()}@resend.dev`,
    password: "e2e-organisme-2026",
    email_confirm: true,
    user_metadata: { nom_organisme: "E2E Inscrit depuis la prospection" },
  });
  const { data: compte } = await db.from("comptes_organisme").select("organisme_id").eq("id", cree.user!.id).single();
  await db
    .from("organismes")
    .update({ siret: `${B.siren}00017` })
    .eq("id", compte!.organisme_id);
  expect((await db.from("prospects").select("statut").eq("identifiant", B.siren).single()).data!.statut).toBe(
    "inscrit",
  );

  await db.auth.admin.deleteUser(cree.user!.id);
  await nettoyer();
});

test("référentiel : ajout, modification, arbitrage des demandes", async ({ page }) => {
  test.setTimeout(120_000);
  const n = Date.now();
  const intitules = [`E2E Titre ${n}`, `E2E Titre corrigé ${n}`, `E2E Demande retenue ${n}`];
  const { data: cree } = await db.auth.admin.createUser({
    email: `delivered+titre-${n}@resend.dev`,
    password: "e2e-organisme-2026",
    email_confirm: true,
    user_metadata: { nom_organisme: `E2E Demandeur ${n}` },
  });
  const { data: compte } = await db.from("comptes_organisme").select("organisme_id").eq("id", cree.user!.id).single();
  const org = compte!.organisme_id;
  await db.from("demandes_titre").insert([
    { organisme_id: org, intitule: `e2e demande a retenir ${n}` },
    { organisme_id: org, intitule: `E2E Demande a refuser ${n}` },
  ]);
  const { data: cat } = await db.from("titres_referentiel").select("categorie").eq("statut", "actif").limit(1).single();

  await connecterAdmin(page);
  await page.goto(`${base}/referentiel/`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Référentiel des titres");

  // Ajout : titre disponible, slug définitif.
  await page.getByRole("button", { name: "Ajouter un titre" }).click();
  await page.getByPlaceholder("Libellé court, acronyme officiel").fill(intitules[0]);
  await page.getByLabel("Catégorie de rattachement").selectOption(cat!.categorie);
  await page.getByRole("button", { name: "Ajouter au référentiel" }).click();
  await expect(page.getByRole("status")).toContainText(`« ${intitules[0]} » ajouté au référentiel`);
  const { data: t } = await db.from("titres_referentiel").select("id, slug").eq("libelle_court", intitules[0]).single();
  expect(t!.slug).toBe(`e2e-titre-${n}`);

  // Modification : intitulé corrigé, slug conservé, aucune suppression possible.
  await page.getByRole("button", { name: `Modifier ${intitules[0]}` }).click();
  await expect(page.getByText("Un titre ne peut pas être supprimé.")).toBeVisible();
  await page.getByLabel("Intitulé", { exact: true }).fill(intitules[1]);
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByRole("status")).toContainText(`« ${intitules[1]} » mis à jour`);
  const { data: t2 } = await db.from("titres_referentiel").select("slug, libelle_long").eq("id", t!.id).single();
  expect(t2).toEqual({ slug: `e2e-titre-${n}`, libelle_long: intitules[1] });

  // Demandes : acceptation après réécriture, refus.
  await page.getByRole("tab", { name: /Demandes en attente/ }).click();
  const retenir = page.getByRole("article").filter({ hasText: `e2e demande a retenir ${n}` });
  await retenir.getByRole("button", { name: "Accepter" }).click();
  await retenir.getByLabel("Intitulé retenu").fill(intitules[2]);
  await retenir.getByLabel("Catégorie de rattachement").selectOption(cat!.categorie);
  await retenir.getByRole("button", { name: "Créer le titre et envoyer l'email" }).click();
  await expect(page.getByRole("status")).toContainText(`« ${intitules[2]} » créé`);
  await expect(page.getByRole("status")).toContainText("Email d'acceptation envoyé");
  const refuser = page.getByRole("article").filter({ hasText: `E2E Demande a refuser ${n}` });
  await refuser.getByRole("button", { name: "Refuser" }).click();
  await refuser.getByRole("button", { name: "Refuser et envoyer l'email" }).click();
  await expect(page.getByRole("status")).toContainText("Demande refusée. Email envoyé");

  const { data: demandes } = await db.from("demandes_titre").select("statut").eq("organisme_id", org).order("id");
  expect(demandes!.map((d) => d.statut)).toEqual(["acceptee", "refusee"]);
  // L'acceptation ne rattache aucune offre à l'organisme demandeur.
  expect((await db.from("organisme_titres").select("titre_id").eq("organisme_id", org)).data).toHaveLength(0);

  await db.auth.admin.deleteUser(cree.user!.id);
  await db.from("titres_referentiel").delete().in("libelle_court", intitules);
});
