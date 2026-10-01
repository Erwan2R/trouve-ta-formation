import { createClient } from "@supabase/supabase-js";
import { expect, type Page, test } from "@playwright/test";
import { createHmac } from "node:crypto";
import { empreintesDe } from "../lib/prospection";

// Accès admin sur admin.localhost (base de DEV) : mot de passe, 2FA obligatoire, codes de récupération.
// Le test remet à zéro l'administrateur de dev (mot de passe, application d'authentification, codes).
const base = "http://admin.localhost:3000";
const MOT_DE_PASSE = "e2e-admin-Sprint9-!";
// Double verrou (voir playwright.config.ts) : ce fichier remet le compte admin à zéro avec MOT_DE_PASSE ; il ne doit
// jamais toucher la base de production. Arrêt immédiat si la base n'est pas celle de dev.
if (new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://x").hostname !== "livkbehsovponxhbctac.supabase.co")
  throw new Error("Tests admin refusés : la base configurée n'est pas celle de dev.");
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

// Compte admin de TEST, distinct du compte d'Erwan (décision 01/10/2026) : les tests ne touchent jamais au sien.
const EMAIL_ADMIN_TEST = "e2e-admin@trouve-ta-formation.fr";

/** Administrateur de test (créé au besoin), remis à zéro : mot de passe connu, aucune application, aucun code. */
async function reinitialiserAdmin() {
  let a = (await db.from("administrateurs").select("id").eq("est_test", true).maybeSingle()).data;
  if (!a) {
    const { data: cree, error } = await db.auth.admin.createUser({
      email: EMAIL_ADMIN_TEST,
      password: MOT_DE_PASSE,
      email_confirm: true,
    });
    if (error) throw error;
    a = { id: cree.user.id };
    await db.from("administrateurs").insert({ id: a.id, est_test: true });
  }
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

  // « Ne plus recevoir ces rappels » : page sans connexion, un bouton ; le rappel devient impossible côté admin.
  const signature = createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update(`desabonnement:${org}`)
    .digest("base64url");
  const espace = await page.context().browser()!.newPage();
  await espace.goto(`http://partenaires.localhost:3000/desabonnement/?t=${org}.${signature}`);
  await espace.getByRole("button", { name: "Ne plus recevoir ces rappels" }).click();
  await expect(espace.getByRole("heading", { level: 1 })).toHaveText("C'est noté");
  await espace.goto(`http://partenaires.localhost:3000/desabonnement/?t=${org}.faux`);
  await expect(espace.getByText("Ce lien n'est pas valable.")).toBeVisible();
  await espace.close();
  expect(
    (await db.from("organismes").select("rappels_desabonne_le").eq("id", org).single()).data!.rappels_desabonne_le,
  ).not.toBeNull();
  await page.reload();
  await expect(page.getByRole("button", { name: `Envoyer un rappel à ${nom}` })).toBeDisabled();
  await expect(page.getByRole("button", { name: `Envoyer un rappel à ${nom}` })).toHaveText("Désabonné");

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
  // Sans SIRET ni SIREN (et sans adresse : aucune recherche de SIRET) : gardé, dédoublonné par ses contacts.
  const C = { siret: null, siren: null, email: "contact@e2e-prospect-c.fr", site_web: "https://e2e-prospect-c.fr/" };
  const nettoyer = async () => {
    await db.from("prospects").delete().in("identifiant", [A.siret, B.siren]);
    await db.from("prospects").delete().eq("email", C.email);
    await db
      .from("exclusions_prospection")
      .delete()
      .in("empreinte", [...empreintesDe(A), ...empreintesDe(B), ...empreintesDe(C)]);
  };
  await nettoyer();
  // Comme le fichier du scraping : BOM UTF-8, fins de ligne CRLF.
  const csv = Buffer.from(
    String.fromCharCode(0xfeff) +
      [
        "nom_organisme;raison_sociale;siret;siren;site_web;email;titres_prepares",
        `E2E Prospect A;;${A.siret};${A.siren};${A.site_web};${A.email};"TFP APS ; SSIAP 1"`,
        `E2E Prospect B;;;${B.siren};;${B.email};`,
        `E2E Prospect C;;;;${C.site_web};${C.email};`,
        "E2E Prospect C bis;;;;https://www.e2e-prospect-c.fr;;",
        "E2E Sans rien;;;;;;",
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
  await expect(rapport).toContainText("3 ajoutés · 0 mis à jour");
  await expect(rapport).toContainText("0 ignorés (liste d'exclusion)");
  await expect(rapport).toContainText("1 prospects sans SIRET");
  await expect(rapport).toContainText("1 lignes ignorées (ni SIRET, ni email, ni site, ni téléphone)");
  await expect(rapport).toContainText("1 adresses de messagerie personnelle (gmail, hotmail, outlook, orange…) sur 3");

  // « C bis » a le même domaine que C : une seule ligne, avec le badge « SIRET manquant ».
  await page.getByLabel("Rechercher un prospect").fill("E2E Prospect");
  await expect(page.getByRole("heading", { name: "3 prospects" })).toBeVisible();
  await expect(page.getByRole("row").filter({ hasText: "E2E Prospect C" })).toContainText("SIRET manquant");
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

  // Sans SIRET, l'exclusion passe par l'email et le domaine.
  await page.getByRole("button", { name: "Demande de suppression pour E2E Prospect C" }).click();
  await page.getByRole("button", { name: "Enregistrer et effacer" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Demande enregistrée" })).toContainText("1 prospect effacé");

  // Un nouvel import ne réintègre ni A ni C (ni « C bis », même domaine) ; B est mis à jour sans perdre son statut.
  rapport = await importer();
  await expect(rapport).toContainText("0 ajoutés · 1 mis à jour");
  await expect(rapport).toContainText("2 ignorés (liste d'exclusion)");
  expect((await db.from("prospects").select("id").eq("identifiant", A.siret)).data).toHaveLength(0);
  expect((await db.from("prospects").select("id").ilike("nom", "E2E Prospect C%")).data).toHaveLength(0);

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
  // Motif obligatoire ; « déjà présent » exige de désigner le titre existant.
  await expect(refuser.getByRole("button", { name: "Refuser et envoyer l'email" })).toBeDisabled();
  await refuser.getByRole("radio", { name: /Déjà présent/ }).click();
  await expect(refuser.getByRole("button", { name: "Refuser et envoyer l'email" })).toBeDisabled();
  await refuser.getByLabel("Titre déjà présent").selectOption({ label: intitules[2] });
  await refuser.getByRole("button", { name: "Refuser et envoyer l'email" }).click();
  await expect(page.getByRole("status")).toContainText("Demande refusée. Email envoyé");

  const { data: demandes } = await db.from("demandes_titre").select("statut").eq("organisme_id", org).order("id");
  expect(demandes!.map((d) => d.statut)).toEqual(["acceptee", "refusee"]);
  const { data: refusee } = await db
    .from("demandes_titre")
    .select("motif_refus, titre_existant_id")
    .eq("organisme_id", org)
    .eq("statut", "refusee")
    .single();
  const { data: retenu } = await db.from("titres_referentiel").select("id").eq("libelle_court", intitules[2]).single();
  expect(refusee).toEqual({ motif_refus: "deja_present", titre_existant_id: retenu!.id });
  // L'acceptation ne rattache aucune offre à l'organisme demandeur.
  expect((await db.from("organisme_titres").select("titre_id").eq("organisme_id", org)).data).toHaveLength(0);

  // Archivage (jamais de suppression) : remplacé par le titre créé depuis la demande.
  await page.getByRole("tab", { name: "Liste des titres" }).click();
  await page.getByRole("button", { name: `Modifier ${intitules[1]}` }).click();
  await page.getByText("Archiver ce titre").click();
  await page.getByLabel("Remplacé par").selectOption({ label: intitules[2] });
  await page.getByRole("button", { name: "Archiver le titre" }).click();
  await expect(page.getByRole("status")).toContainText(`« ${intitules[1]} » archivé.`);
  const { data: archive } = await db
    .from("titres_referentiel")
    .select("statut, remplace_par_id")
    .eq("id", t!.id)
    .single();
  const { data: remplacant } = await db
    .from("titres_referentiel")
    .select("id")
    .eq("libelle_court", intitules[2])
    .single();
  expect(archive).toEqual({ statut: "archive", remplace_par_id: remplacant!.id });
  await expect(page.getByRole("button", { name: `Modifier ${intitules[1]}` })).toBeHidden();

  await db.auth.admin.deleteUser(cree.user!.id);
  await db.from("titres_referentiel").delete().in("libelle_court", intitules);
});

test("analytics : vues de fiche et clics CTA comptés sans cookie", async ({ browser }) => {
  test.setTimeout(120_000);
  const { data: org } = await db
    .from("organismes")
    .select("id, slug, nom, telephone")
    .eq("statut", "publie")
    .not("telephone", "is", null)
    .limit(1)
    .single();
  const avant = (await db.from("evenements").select("id", { count: "exact", head: true }).eq("organisme_id", org!.id))
    .count!;

  // Visite publique d'un navigateur ordinaire (« HeadlessChrome » est écarté comme robot) : une vue, un clic « Appeler ».
  const context = await browser.newContext({
    baseURL: "http://localhost:3000",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  });
  const page = await context.newPage();
  await page.goto(`/securite-privee/organismes/${org!.slug}/`);
  await page.waitForLoadState("networkidle"); // suivi des clics actif une fois la page hydratée
  await page.evaluate(() =>
    document.querySelectorAll("a[href^='tel:']").forEach((a) => a.addEventListener("click", (e) => e.preventDefault())),
  );
  await page.locator("a[data-cta='telephone']").first().click();
  await expect
    .poll(async () => (await db.from("evenements").select("type").eq("organisme_id", org!.id)).data!.length, {
      timeout: 15_000,
    })
    .toBeGreaterThanOrEqual(avant + 2);
  expect(await context.cookies("http://localhost:3000")).toHaveLength(0);

  await connecterAdmin(page);
  await page.goto(`${base}/analytics/?periode=7&onglet=organismes`);
  await expect(page.getByRole("heading", { name: "Fiches les plus visitées" })).toBeVisible();
  await expect(page.getByRole("link", { name: new RegExp(org!.nom) }).first()).toBeVisible();
  await page.getByRole("link", { name: "Général" }).click();
  await expect(page.getByRole("heading", { name: "Répartition par palier" })).toBeVisible();
  const aujourdhui = new Date().toISOString().slice(0, 10);
  expect((await db.from("statistiques_quotidiennes").select("jour").eq("jour", aujourdhui)).data).toHaveLength(1);
});

test("réglages du site : un seuil se modifie depuis Paramètres", async ({ page }) => {
  test.setTimeout(90_000);
  const lire = async () =>
    (await db.from("parametres").select("valeur").eq("cle", "seuil_proposition_elargissement").single()).data!.valeur;
  const avant = (await lire()) as number;
  await connecterAdmin(page);
  await expect(page.getByRole("heading", { name: "Réglages du site" })).toBeVisible();
  await page.getByLabel("Proposer d'élargir la recherche quand elle trouve moins de").fill(String(avant + 1));
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await expect(page.getByText(/Enregistré à/)).toBeVisible();
  expect(await lire()).toBe(avant + 1);
  await db.from("parametres").update({ valeur: avant }).eq("cle", "seuil_proposition_elargissement");
});

test("blog : rédaction, audit obligatoire, publication, dépublication en 301", async ({ page, request }) => {
  test.setTimeout(180_000);
  const n = Date.now();
  const titre = `E2E article ${n}`;
  await connecterAdmin(page);
  await page.goto(`${base}/blog/`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Articles du blog");
  await page.getByRole("button", { name: "Nouvel article" }).click();
  await page.waitForURL(/\/blog\/[0-9a-f-]{36}\/$/, { timeout: 30_000 });
  const id = page.url().match(/blog\/([0-9a-f-]{36})/)![1];

  await page.getByLabel("Titre de l'article H1").fill(titre);
  await page.getByLabel("Meta description").fill("Article de test de bout en bout.");
  await page.getByLabel("Extrait des cartes").fill("Extrait de test.");
  const corps = page.locator(".ProseMirror");
  await corps.click();
  await page.keyboard.type("Réponse à la question du titre, en deux phrases.");
  await page.getByRole("button", { name: "H2", exact: true }).click();
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "H2", exact: true }).click();
  await page.keyboard.type("Un intertitre");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Voir la page du catalogue.");
  // Lien interne choisi dans la liste des pages (jamais saisi à la main).
  await page.keyboard.press("Shift+Home");
  await page.getByRole("button", { name: "Lien", exact: true }).click();
  await page.getByPlaceholder("Rechercher une page").fill("organismes");
  await page.getByRole("button", { name: /Tous les organismes/ }).click();
  await page.getByRole("button", { name: "Insérer le lien" }).click();

  // Publication refusée tant que l'audit anti-concurrence n'est pas validé.
  await page.getByRole("button", { name: "Publier", exact: true }).click();
  await page.getByRole("button", { name: "Publier maintenant" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "À corriger" })).toContainText(
    "Validez l'audit anti-concurrence avant de publier.",
  );
  await page.getByLabel("J'ai vérifié ces trois points").check();
  await page.getByRole("button", { name: "Publier", exact: true }).click();
  await page.getByRole("button", { name: "Publier maintenant" }).click();
  await expect(page.getByRole("status")).toContainText("Article publié.");

  const { data: a } = await db.from("articles_blog").select("slug, statut, publie_le, corps").eq("id", id).single();
  expect(a!.statut).toBe("publie");
  expect(a!.publie_le).not.toBeNull();
  expect(JSON.stringify(a!.corps)).toContain('"href":"/securite-privee/organismes/"');
  const publique = await request.get(`/securite-privee/blog/${a!.slug}/`);
  expect(publique.status()).toBe(200);
  expect(await publique.text()).toContain(titre);

  // Dépublication avec remplacement : l'ancienne adresse redirige en 301.
  await page.getByRole("button", { name: "Dépublier" }).click();
  await page.getByLabel("Rediriger vers une page de remplacement (301)").check();
  await page.getByRole("dialog").getByPlaceholder("Rechercher une page").fill("organismes");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /Tous les organismes/ })
    .click();
  await page.getByRole("dialog").getByRole("button", { name: "Dépublier" }).click();
  await expect(page.getByRole("status")).toContainText("Article dépublié");
  const redirigee = await request.get(`/securite-privee/blog/${a!.slug}/`, { maxRedirects: 0 });
  expect(redirigee.status()).toBe(301);
  expect(redirigee.headers().location).toContain("/securite-privee/organismes/");

  await db.from("articles_blog").delete().eq("id", id);
});

test("blog : auteurs gérés dans Paramètres", async ({ page }) => {
  test.setTimeout(90_000);
  const nom = `E2E Auteur ${Date.now()}`;
  await connecterAdmin(page);
  await page.getByRole("button", { name: "+ Ajouter un auteur" }).click();
  await page.getByLabel("Nom affiché").fill(nom);
  await page.getByLabel("Qualification (une ligne)").fill("Qualification de test");
  await page.getByRole("button", { name: "Enregistrer", exact: true }).last().click();
  await expect(page.getByText(nom)).toBeVisible();
  const { data } = await db.from("auteurs_blog").select("id").eq("nom", nom).single();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("listitem").filter({ hasText: nom }).getByRole("button", { name: "Supprimer" }).click();
  await expect(page.getByText(nom)).toBeHidden();
  expect((await db.from("auteurs_blog").select("id").eq("id", data!.id)).data).toHaveLength(0);
});

// Captures d'écran à soumettre à Erwan : CAPTURES_DIR=chemin npx playwright test -g "captures"
test("captures de l'admin du blog", async ({ page }) => {
  test.skip(!process.env.CAPTURES_DIR, "Captures uniquement sur demande");
  test.setTimeout(120_000);
  const dir = process.env.CAPTURES_DIR!;
  await page.setViewportSize({ width: 1440, height: 900 });
  await connecterAdmin(page);
  await page.goto(`${base}/blog/`);
  await page.screenshot({ path: `${dir}/admin-blog-liste.png`, fullPage: true });
  const { data } = await db.from("articles_blog").select("id").eq("slug", "demo-quotidien-agent-de-securite").single();
  await page.goto(`${base}/blog/${data!.id}/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${dir}/admin-blog-editeur.png` });
  await page.screenshot({ path: `${dir}/admin-blog-editeur-complet.png`, fullPage: true });
  await page.goto(`${base}/parametres/`);
  await page.getByRole("heading", { name: "Auteurs du blog" }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${dir}/admin-auteurs.png` });
});

test("blog : redirections directes vers la destination finale, jamais de chaîne", async () => {
  const n = Date.now().toString(36);
  const s = (x: string) => `e2e-redir-${x}-${n}`;
  const creer = async (slug: string, champs: Record<string, unknown> = {}) =>
    (
      await db
        .from("articles_blog")
        .insert({ slug, titre: slug, categorie: "le-metier", est_test: true, statut: "publie", ...champs })
        .select("id")
        .single()
    ).data!.id;
  const chemin = (x: string) => `/securite-privee/blog/${s(x)}/`;
  const x = await creer(s("x3"));
  await db.from("articles_blog_anciens_slugs").insert([
    { slug: s("x1"), article_id: x },
    { slug: s("x2"), article_id: x },
  ]);
  await creer(s("y"), { statut: "depublie", remplacement: chemin("x1") });
  await creer(s("z"), { statut: "depublie", remplacement: chemin("y") });
  const w = await creer(s("w2"), { statut: "depublie" });
  await db.from("articles_blog_anciens_slugs").insert({ slug: s("w1"), article_id: w });
  await creer(s("l1"), { statut: "depublie", remplacement: chemin("l2") });
  await creer(s("l2"), { statut: "depublie", remplacement: chemin("l1") });
  const r = async (x: string) => (await db.rpc("resolution_article", { p_slug: s(x) })).data;

  expect(await r("x3")).toEqual([]); // publié : servi tel quel
  expect(await r("x1")).toEqual([{ statut: "deplace", destination: chemin("x3") }]); // ancien slug → actuel
  expect(await r("y")).toEqual([{ statut: "deplace", destination: chemin("x3") }]); // remplacement renommé
  expect(await r("z")).toEqual([{ statut: "deplace", destination: chemin("x3") }]); // deux remplacements
  expect(await r("w1")).toEqual([{ statut: "depublie", destination: null }]); // ancien slug d'un dépublié → 410
  expect(await r("l1")).toEqual([{ statut: "depublie", destination: null }]); // boucle → 410
  expect(await r("jamais")).toEqual([]); // adresse jamais attribuée → 404 normale

  await db.from("articles_blog").delete().like("slug", `e2e-redir-%-${n}`);
});
