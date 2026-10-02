# État du projet — Trouve ta formation

> Note de passation au 1er octobre 2026, Sprint 11 (RGPD et sécurité) livré. À lire en entier avant le Sprint 12.
> Elle complète [CLAUDE.md](../CLAUDE.md) (brief technique), [Plan_Sprints.md](../Plan_Sprints.md) (plan) et
> [README.md](../README.md) (environnements, commandes). En cas de contradiction avec une spec du dossier
> `design_handoff_trouve_ta_formation/`, les **décisions d'Erwan listées ici font foi** : elles sont postérieures.

---

## 1. En bref

- **Sprints 0 à 10 terminés** sur la branche `dev` (dev.trouve-ta-formation.fr). La production (`main`) est restée à la
  fin du Sprint 1 ; `preprod` aussi. Erwan a choisi de faire **la mise en production à la fin** (après le Sprint 12).
- **Sprint 11 livré : conformité RGPD et sécurité.** Audit : `docs/AUDIT_RGPD.md` ; registre, procédures (droits,
  violation) et textes de prospection : `docs/CONFORMITE_RGPD.md`. Accord complet d'Erwan le 1er octobre 2026 sur les
  propositions (durées, région, cookie de 30 jours, textes, conditions d'utilisation).
- La mise en production est bloquée par les points de la section 7 (pages légales de la future société d'Erwan,
  base de production à préparer, migrations, réglages).

---

## 2. Règles de travail avec Erwan

- Tout se fait **en français** : échanges, textes, commits.
- Erwan débute : **expliquer chaque action à faire de son côté très simplement, pas à pas** (où cliquer, quoi saisir,
  comment vérifier). Il préfère que Claude fasse lui-même ce qui peut l'être avec les accès fournis.
- **Commits** : français, impératif présent (« Ajoute… », « Corrige… »), terminés par
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Travail sur `dev`, push après chaque étape.
- **Production** : prévenir Erwan et obtenir son accord **avant toute modification** (réglages Vercel de production,
  domaines, DNS, base de production), même réversible. Liberté totale sur dev et preprod.
- **`.env.local`** : ne jamais le modifier soi-même (un conflit d'enregistrement a déjà fait perdre une clé à Erwan).
  Lui dire quelle ligne ajouter. Lire les valeurs sans les afficher : `tr -d '\r' < .env.local | grep '^CLE=' | cut -d= -f2-`.
- **Dossier `scrapping/`** : ne jamais y toucher (projet séparé).
- **Design** : suivre `design_handoff_trouve_ta_formation/` (prototypes, specs ux et copy). Les textes validés ne se
  réécrivent pas ; tout écart ou texte rédigé par Claude est **signalé à Erwan** pour validation.
- **Rien n'est inventé** : durées, RNCP, délais CNAPS, chiffres d'audience. Un contenu à vérifier porte un marqueur
  `[à vérifier]` ou `[à compléter]` (voir « double verrou », section 5.1).

---

## 3. Environnements et accès

### Branches, adresses, bases

| Branche | Site public | Espace organisme | Admin (Sprint 9) | Base Supabase |
|---|---|---|---|---|
| `dev` | dev.trouve-ta-formation.fr | partenaires-dev.trouve-ta-formation.fr | admin-dev.trouve-ta-formation.fr | `trouve-ta-formation-dev` |
| `preprod` | preprod.trouve-ta-formation.fr | partenaires-preprod.… | admin-preprod.… | `trouve-ta-formation-dev` |
| `main` | trouve-ta-formation.fr | partenaires.… (**redirigé en 307** vers le site, temporaire) | admin. (**redirigé en 307**) | `Trouve ta formation` |
| local | localhost:3000 | partenaires.localhost:3000 | admin.localhost:3000 | `trouve-ta-formation-dev` |

- dev et preprod sont protégés par Vercel (connexion Vercel, ou en-tête `x-vercel-protection-bypass` avec
  `VERCEL_BYPASS`) et **jamais indexés** (`robots.txt` bloquant + `X-Robots-Tag: noindex, nofollow`).
- `EST_PRODUCTION = process.env.VERCEL_ENV === "production"` (`lib/env.ts`) pilote tout ce qui diffère en production.

### Services

| Service | Rôle | Identifiants utiles |
|---|---|---|
| **Vercel** | Hébergement, déploiements par branche | projet `prj_TOYSQnxKIwh9pr6FcP6ghvNTDiAQ`, équipe `team_Z68HrzdFpE97R03kU3dHzf0m`, dépôt `Erwan2R/trouve-ta-formation` |
| **Supabase — prod** | Base, authentification, stockage des logos | projet `fuwfzxxgosgxmwtdevzh` (Paris, organisation « TTF ») |
| **Supabase — dev** | Idem pour dev, preprod et local | projet `livkbehsovponxhbctac` (Paris, organisation « TTF ») |
| **Hostinger** | Nom de domaine et zone DNS | accès par l'interface ; le token d'API temporaire a été supprimé |
| **Resend** | Envoi des emails (région Europe) | domaine `trouve-ta-formation.fr` **vérifié** ; clé « Sending access » limitée au domaine |
| **Cloudflare Turnstile** | Anti-robots de l'inscription (invisible) | widget « Inscription Trouve ta formation » dans le compte Cloudflare d'Erwan |

### DNS (Hostinger)

- `@` A → 216.198.79.1 ; `www`, `dev`, `preprod`, `partenaires`, `partenaires-dev`, `partenaires-preprod`, `admin`,
  `admin-dev`, `admin-preprod` CNAME → `c8e113e2fd15ef23.vercel-dns-017.com`.
- Resend : `resend._domainkey` TXT (DKIM), `send` MX + TXT (SPF), `rsend` CNAME, `_dmarc` TXT `v=DMARC1; p=none;`.
- Aucune boîte email sur le domaine (pas de MX sur `@`) : c'est voulu, voir l'adresse de contact (section 4.9).

### Fichiers d'environnement (jamais commités, `.env*` ignoré sauf `.env.example`)

- **`.env.local`** (géré par Erwan) : clés Supabase **de production**, `SUPABASE_ACCESS_TOKEN` (API de gestion),
  `SUPABASE_DB_PASSWORD` (prod), `SUPABASE_DEV_DB_PASSWORD`, `VERCEL_TOKEN`, `VERCEL_BYPASS`,
  `NEXT_PUBLIC_URL_ESPACE_ORGANISME`, `E2E_ORGANISME_EMAIL` / `E2E_ORGANISME_MOT_DE_PASSE` (compte de test),
  `RESEND_SENDING_KEY`, `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` (jeton limité à Turnstile, **expire le
  8 octobre 2026**). Une ligne `RESEND_API_KEY` peut subsister : la clé est révoquée, elle ne sert plus.
- **`.env.development.local`** (créé par Claude) : URL et clés de la **base de dev**. `next dev` le lit en priorité ;
  Playwright aussi (`playwright.config.ts`). Les scripts s'appellent avec
  `node --env-file=<.env.local nettoyé> --env-file=.env.development.local …` pour viser la base de dev.
- **Variables Vercel** : production = base prod ; branches `dev` et `preprod` = base dev (variables propres à la
  branche, qui priment sur les variables « preview »). `RESEND_SENDING_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` et
  `TURNSTILE_SECRET_KEY` existent **pour dev et preprod seulement** : à ajouter en production (avec accord).
  `VERCEL_DEPLOY_HOOK_URL` (deploy hook « archivage-titre-dev ») existe **pour dev seulement**.

### Commandes

```
npm run dev / npm test / npm run build / npm run lint / npm run typecheck
npm run test:e2e        # parcours Playwright (formulaire ×2, inscription, admin ×7), base de dev
npm run db:types        # types depuis le projet lié (prod ; schéma identique à dev)
npx supabase db push -p <mot de passe prod>                        # migrations → PROD (avec accord)
npx supabase db push --db-url "postgresql://postgres.livkbehsovponxhbctac:<mdp encodé>@aws-1-eu-west-3.pooler.supabase.com:5432/postgres" --include-all   # → DEV
node --env-file=… scripts/config-auth-supabase.mjs --projet=dev|prod --smtp --emails   # réglages d'authentification
node --env-file=… scripts/seed-organismes-test.mjs     # 7 organismes fictifs (est_test)
node --env-file=… scripts/compte-test.mjs              # compte organisme de test (recréé à neuf)
node --env-file=.env.local scripts/creer-admin.mjs --projet=dev|prod --email=…   # compte admin unique
```

**Ordre pour une migration** : l'appliquer à la base de dev, tester, puis à la production au moment de la mise en ligne.

---

## 4. État par sprint

| Sprint | Contenu | État |
|---|---|---|
| 0 | Next.js 15, TypeScript strict, Tailwind v4, Supabase, Vercel, Vitest, Playwright | ✅ |
| 1 | Layout public (en-tête, pied de page), composants de base, 404, racine du domaine | ✅ |
| 2 | Accueil sécurité privée | ✅ (compteurs masqués : seuil non fixé) |
| 3 | Pages piliers (gabarit, archivage des titres) | ✅ gabarit — **contenus : 2 brouillons sur 13, aucun publié** |
| 4 | Pages démarches CNAPS | ✅ gabarit — **3 brouillons, aucun publié** (données CNAPS à vérifier) |
| 5 | Catalogue et fiche organisme | ✅ (testé avec organismes fictifs) |
| 6 | Pages départements | ✅ gabarit — **1 brouillon sur 8 (Seine-Saint-Denis), aucun publié** |
| 7 | Formulaire d'affinage | ✅ |
| 8 | Inscription, accompagnement, espace organisme, landing organismes | ✅ en dev — **mise en prod bloquée** (section 7) |
| 9 | Espace admin | ✅ en dev — **mise en prod bloquée** (section 7) |
| 10 | Blog public et blog admin, 404 et racine | ✅ en dev — le blog démarre vide (noindex, hors sitemap) |
| 11 | Conformité RGPD et légale (audit complet puis mise en conformité) | À faire (ajouté par Erwan, 01/10/2026) |
| 12 | Durcissement SEO et lancement | À faire |

### 4.1 Sprints 0–2 — fondations, layout, accueil
- Toutes les pages publiques en rendu serveur ; un seul H1 ; liens en `<a>` ; métadonnées par `lib/seo/metadata.ts`
  (`buildMetadata`) ; JSON-LD par `lib/seo/json-ld.tsx` ; `trailingSlash: true`.
- Typographie française : `fr()` (`lib/typo.ts`) et espaces insécables ; le séparateur de milliers U+202F est remplacé
  par une espace insécable (absent de la police Plus Jakarta Sans).
- Logo : 36 px dans l'en-tête public et à la racine (au lieu des 27 px du handoff, demande d'Erwan), 44 px sur les pages
  de connexion. Favicon « chapeau brique » : `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`.

### 4.2 Sprint 3 — pages piliers
- Route `/securite-privee/[slug]/` résolue dans l'ordre : slug réservé → titre (pilier) → département ayant une page → 404.
- Contenus dans `contenu/securite-privee/piliers/` : `ssiap-1` et `mac-aps` rédigés en brouillon, les 11 autres absents.

### 4.3 Sprint 4 — démarches CNAPS
- Autorisation préalable, carte professionnelle, renouvellement : brouillons avec coût, délai et fenêtre de dépôt
  **vides et masqués** jusqu'à vérification par Erwan sur la FAQ du CNAPS.

### 4.4 Sprint 5 — catalogue et fiche
- Filtres en GET (fonctionnent sans JavaScript), facettes, relâchement du filtre le plus restrictif à zéro résultat,
  pagination numérotée, `noindex, follow` + canonical sur toute version filtrée.
- Fiche : offre = ancre `#titre` sur la fiche (jamais une page), `EducationalOrganization` en JSON-LD, `noindex` au
  palier Basique, panneau de détail d'offre en CSS `:target` (sans JavaScript).
- Anciennes URL de fiche : table `organismes_anciens_slugs` + 301 générées au build, repli 308 dans la page.

### 4.5 Sprint 6 — pages départements
- 8 départements, formes rédactionnelles stockées (`forme_lieu` « en Seine-Saint-Denis », `forme_de` « de
  Seine-Saint-Denis »), jamais concaténées.

### 4.6 Sprint 7 — formulaire d'affinage
- `/securite-privee/formulaire/` : une page (pas une fenêtre), état entièrement dans l'URL, fonctionne sans JavaScript.

### 4.7 Sprint 8 — espace organisme (`partenaires.`)
- Pages : connexion, inscription, mot de passe oublié, accompagnement `/bienvenue/1…7/`, tableau de bord, Ma fiche,
  Mes formations, Paramètres, écran « compte supprimé ».
- Landing publique `/securite-privee/referencer-mon-organisme/` (indexable, dans le sitemap), pages légales
  `/mentions-legales/` et `/confidentialite/` (à compléter).

### 4.8 Sprint 9 — espace admin (`admin.`)
- Pages (URL des specs) : `/connexion/`, `/verification/` (code TOTP ou code de récupération), `/dashboard/`,
  `/organismes/` (Fichier client), `/organismes/[id]/` (Fiche client), `/prospection/`, `/referentiel/`,
  `/analytics/`, `/parametres/`. Code dans `app/admin/`, requêtes dans `lib/supabase/queries/admin.ts`.
- Compte admin de dev : `admin-dev@trouve-ta-formation.fr` (mot de passe : celui du test `e2e/admin.spec.ts`, remis à
  zéro à chaque passage du test, 2FA compris).
- Tests : `e2e/admin.spec.ts` (6 parcours : accès et 2FA, modération, prospection, référentiel, analytics, réglages).
  **Verrou** : `playwright.config.ts` et `e2e/admin.spec.ts` s'arrêtent immédiatement si la base configurée n'est pas
  celle de dev ; le mot de passe de test n'existe donc que sur dev. Les tests utilisent leur **propre compte admin**
  (`e2e-admin@trouve-ta-formation.fr`, `administrateurs.est_test`, base de dev seulement) et ne touchent jamais celui
  d'Erwan. Le compte unique reste la règle pour les vrais comptes (index unique sur les comptes non test).

---

### 4.9 Sprint 10 — blog, 404, racine
- Public : `/securite-privee/blog/` (liste) et `/securite-privee/blog/[slug]/` (article), `/securite-privee/blog/article-retire/`
  (servie en 410). Admin : `/blog/` (liste), `/blog/[id]/` (éditeur Tiptap), auteurs dans Paramètres (section 04),
  onglet Blog d'Analytics.
- Contenu d'un article : document JSON de l'éditeur, contrôlé à l'enregistrement (`lib/blog/validation.ts`) et rendu
  côté serveur (`components/public/blog/CorpsArticle.tsx`).
- Articles et auteur de démonstration : `scripts/seed-blog-test.mjs`, base de dev uniquement (`est_test`).
- 404 (gabarits silo et racine) et racine du domaine alignées sur `Copy_Blog_404_Racine.md`.

### 4.10 Sprint 11 — RGPD, cookies, sécurité
- Pages légales : mentions légales et confidentialité réécrites, **Cookies** (`/cookies/`) et **Conditions
  d'utilisation** (`/conditions-utilisation/`) créées. Informations de l'éditeur centralisées dans
  `contenu/legal/editeur.ts` (en `[à compléter]` → build de production bloqué). Rédaction Claude, relecture
  juridique conseillée.
- Bandeau de consentement (`components/public/GestionConsentement.tsx`, `lib/config/traceurs.ts`) : Tout refuser /
  Personnaliser / Tout accepter, finalités Mesure d'audience (GA4) et Publicité (Google Ads, pixel Meta). Aucun outil
  chargé avant l'accord ; choix conservé 6 mois. **Le bandeau n'apparaît que si un identifiant est configuré**
  (`NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_META_PIXEL_ID`) ; aperçu sur dev par
  `NEXT_PUBLIC_BANDEAU_APERCU=1` (variable Vercel de la branche `dev`). Jamais dans les espaces organisme et admin.
- Export des données de l'organisme (JSON) : Paramètres → « télécharger vos données » (`/parametres/export/`).
- Mention conditions + confidentialité sous le bouton d'inscription.
- Purge automatique quotidienne (`purger_donnees()`, pg_cron 3 h) : comptes non validés 30 j, liens email 30 j après
  expiration, événements 25 mois, prospects 3 ans après le dernier contact (`dernier_contact_le`), demandes de titre
  traitées 3 ans, tentatives 24 h.
- Sécurité : limitation des tentatives (`lib/limite.ts`, table `tentatives_acces`) sur la connexion, le mot de passe
  oublié, l'inscription, la connexion et le 2FA admin ; cookie de session ramené de 400 à 30 jours ; en-têtes HSTS,
  X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy ; contrôle de l'origine sur `/api/evenements/` ;
  vérification du type `.csv` à l'import ; `npm audit` sans vulnérabilité (override `postcss`). Fonctions Vercel à
  Paris (`cdg1`, accord d'Erwan).

## 5. Décisions et leurs raisons

### 5.1 Principes transverses
- **Publication sur déclaration.** Aucune vérification préalable des organismes, ni par l'éditeur ni auprès du CNAPS.
  Aucun texte ne dit « nous vérifions ». Formulation validée : « Les organismes référencés créent et mettent à jour
  eux-mêmes leur fiche. Quand un organisme indique son numéro d'agrément CNAPS, il apparaît sur sa fiche : vérifiez-le
  sur l'espace de consultation du CNAPS avant de vous inscrire. » *Raison : les maquettes promettaient une vérification
  qui n'existe pas (risque de confiance et juridique).*
- **Scraping hors catalogue.** Les données du dossier `scrapping/` ne servent **qu'au fichier de prospection** de
  l'admin. Une fiche publique n'existe qu'après inscription volontaire. *Raison : consentement, qualité, confiance.*
- **Organismes de test** : fictifs, marqués `est_test`, jamais servis en production (filtrés dans `getOrganismes`).
- **Double verrou des contenus éditoriaux.** Une page n'est servie en production que si (1) son drapeau de publication
  est levé en base et (2) son texte ne contient aucun marqueur `[à vérifier]` / `[à compléter]`
  (`contenu/marqueurs.ts`). Les brouillons restent visibles sur dev et preprod. Tous les liens du site passent par le
  calcul `a_une_page` : **jamais de lien vers une 404**. *Raison : ne rien publier d'inexact tout en travaillant la mise
  en page.*
- **Sitemap** : uniquement les pages servies et indexables.
- **Durées des titres** masquées tant que `duree` est vide, affichées automatiquement une fois renseignées.

### 5.2 Archivage des titres (Sprint 3)
- Un titre n'est **jamais supprimé**. Champs `archive_le`, `remplace_par_id`, `titre_proche_id`.
- Archivé et remplacé : **301 directe vers le titre actif final**, jamais de chaîne de redirections (générée au build
  dans `next.config.ts` ; repli 308 dans la page entre deux builds). « Remplacé par » ne peut être ni un titre archivé
  ni le titre lui-même (contrainte en base).
- Archivé sans remplaçant : la page reste, avec « Ce titre n'est plus délivré depuis [date] » et un lien vers le titre
  proche.
- Titres archivés exclus des listes, grilles, menus et du formulaire. Offres sur un titre archivé : conservées en base,
  masquées publiquement, signalées à l'organisme dans « Mes formations ».
- *Raison : ne jamais casser une URL indexée ni perdre l'historique des offres.*
- **Sprint 9** : la 301 n'existe qu'après un build ; prévoir un « deploy hook » Vercel déclenché à l'archivage.

### 5.3 Publication des démarches (Sprint 4)
- Coût, délai d'instruction et fenêtre de renouvellement restent **vides et masqués** tant qu'Erwan ne les a pas
  vérifiés sur la FAQ du CNAPS. **Aucune page démarche ne part en production avant cette vérification.**
- `/securite-privee/demarches/` ne liste que les démarches publiées et n'existe que si au moins une l'est.
- *Raison : information réglementaire, une erreur pénaliserait un candidat.*

### 5.4 Seuils et paliers (Sprints 2, 5, 6, 7)
Tous les seuils réglables vivent dans la table **`parametres`** (l'admin du Sprint 9 devra les rendre éditables) :

| Clé | Valeur | Rôle |
|---|---|---|
| `seuil_page_departement` | 3 organismes au palier Correct | Existence d'une page département (+ texte de 300 mots finalisé) |
| `seuil_page_ville` | 5 | Page ville (non construite) |
| `seuil_proposition_elargissement` | 3 | Formulaire : sous ce nombre, proposer d'élargir |
| `experience_encadrement` | SSIAP 2 : 1 an, SSIAP 3 : 3 ans | Formulaire : valeurs **à vérifier** |

- **Seuil d'affichage des compteurs** (accueil, catalogue, landing) : `seuilCompteurs` dans
  `lib/config/verticales.ts`, **`null` = masqués**, en attente d'Erwan. Un seul paramètre pour toutes les pages.
- **Paliers de complétude** (`lib/organismes/completude.ts`) : Basique = minimum publiable → `noindex` ; Correct =
  ≥ 1 formation + (financements ou présentation) → indexable ; Optimal = Correct + 5 des 7 éléments (logo, SIRET,
  agrément, Qualiopi, horaires, accessibilité, site web). Tri « Pertinence » : Optimal d'abord. Présentation plafonnée à
  1 500 caractères.
- Page département sous le seuil : 404, hors sitemap, libellé non cliquable partout ; aucun voisin avec page → « Voir
  tous les organismes d'Île-de-France → » ; catalogue filtré sur un département qui a sa page → canonical vers elle.
- Catalogue vide : `noindex` et texte validé (« Aucun organisme n'est encore référencé… aucune n'est publiée sans leur
  accord… » + « Vous êtes un organisme de formation ? Référencez-le gratuitement → »).
- **Recherches sans résultat** et **statistiques du formulaire** : uniquement la combinaison de critères et un
  compteur ; ni IP, ni identifiant, ni texte libre ; production seulement.

### 5.5 Formulaire d'affinage (Sprint 7)
- Page dédiée, `noindex`, hors sitemap, **non bloquée dans `robots.txt`** (sinon le `noindex` ne serait pas lu), lien
  de retour vers la page d'origine.
- Relâchement automatique **uniquement à zéro résultat** ; avec 1 ou 2 résultats, « Seul 1 centre correspond… » /
  « Seuls N centres… » + lien d'élargissement, jamais imposé.
- Jamais un titre dont le prérequis n'est pas détenu (TFP APS + « encadrer » → SSIAP 1).
- Déplacement : véhicule → voisins avant rythme ; transports → rythme puis voisins ; proximité → jamais
  d'élargissement géographique. Début : ne filtre pas, adapte le message.
- Aucune coordonnée collectée ; casier judiciaire jamais demandé, seulement affiché comme condition.
- Encadré « carte expirée » masqué en production (traitement d'une carte expirée non vérifié).

### 5.6 Espace organisme et inscription (Sprint 8)
- **Sous-domaine `partenaires.`** : pages dans `app/partenaires/`, le `middleware.ts` réécrit `/dashboard/` en
  `/partenaires/dashboard/` selon l'hôte ; sur le site public, `/partenaires/` n'existe pas.
- **Inscription en 3 champs** (email, mot de passe, nom), **accès immédiat** à l'accompagnement ; la validation de
  l'email bloque la **publication**, pas l'accès.
- **Publication automatique** dès que l'email est validé et que le minimum publiable est atteint : nom, adresse du
  siège, **un moyen de contact (téléphone OU email de contact public)**. Fonction SQL `maj_publication_organisme`.
- Accompagnement en 7 étapes, enregistrement automatique, reprise exacte (`comptes_organisme.onboarding_etape`).
- **2FA** : admin seulement (pas pour les organismes, conforme à la maquette).
- Slug de fiche fixé à l'inscription ; corriger le nom ne le change pas.
- Écarts validés : rythme à 3 valeurs (celles des filtres du catalogue), durée en heures, financements par formation
  **et** au niveau de l'organisme (étape 6, Informations pratiques), nom de l'organisme modifiable dans Identité,
  « Se déconnecter » dans Paramètres et dans le menu du compte.
- Langues : « **Autres langues parlées par l'équipe** » (les formations se déroulent en français, niveau B1 exigé) :
  allemand, anglais, arabe, chinois, espagnol, italien, portugais, roumain, russe, tamoul. Le français n'est pas
  proposé.
- Autocomplétion des adresses par la **Géoplateforme de l'IGN** (successeur de l'API Adresse, gratuit, sans clé).

### 5.7 Validation de l'email gérée par l'application
- *Raison* : le réglage Supabase « connexion avant validation » **ne fonctionne pas** sur ce projet (testé : « Email not
  confirmed »), alors que la spec exige l'accès immédiat.
- Supabase est en `mailer_autoconfirm: true` ; la validation est suivie dans `comptes_organisme.email_verifie_le`.
- Liens envoyés par l'application via Resend : **usage unique, 24 h, jeton stocké haché** (table `liens_email`,
  service role seul). Quota par compte : **1 envoi toutes les 2 minutes, 5 par jour**.
- Changement d'email : la nouvelle adresse n'est prise en compte **qu'au clic** ; la validation suit la nouvelle adresse.
- Le lien « mot de passe oublié » (resté chez Supabase) **vaut aussi validation** de l'adresse, pour qu'un vrai
  propriétaire récupère un compte créé par un tiers.
- Emails de l'application : HTML + texte, Reply-To = adresse de contact. Emails Supabase : HTML seul (10/10 sur
  mail-tester, accepté), sans Reply-To possible → ligne « Pour nous écrire : … » en pied.
- Supabase envoie par Resend (SMTP), limite 30 emails/heure (quota Resend gratuit : 100/jour).
- **Plus tard** : Send Email Hook de Supabase si la délivrabilité pose problème (jamais une réimplémentation) ; DMARC en
  `p=quarantine` quelques semaines après la mise en production ; suppression après 30 jours (précédée d'une relance)
  des comptes non validés sans fiche publiée.

### 5.8 Turnstile
- Cloudflare Turnstile **invisible** sur l'inscription, pour protéger le quota d'emails. Sans clé secrète : contrôle
  ignoré hors production, **inscription refusée en production** (`lib/turnstile.ts`).
- Les navigateurs automatisés (Playwright) sont refusés par Cloudflare : c'est normal. Les tests passent en local, où la
  vérification est ignorée. Vérifié à la main par Erwan sur `partenaires-dev`.

### 5.9 Séparation des bases
- Deux projets Supabase : **prod** (`fuwfzxxgosgxmwtdevzh`) et **dev** (`livkbehsovponxhbctac`, pour dev, preprod et
  local). Schéma et données de référence identiques (vérifié), données de test uniquement en dev.
- La base de prod contient encore des données de test (compte de test, 7 organismes `est_test`) : **à vider au
  moment de la mise en production**, qui doit repartir propre.
- *Raison : aucun vrai organisme ne doit côtoyer des données de test.*

### 5.10 Adresse de contact
- **`contact.trouvetaformation@gmail.com`**, réglage unique `lib/config/contact.ts` (`EMAIL_CONTACT`), utilisé partout
  (landing, pages légales, pied de page, Reply-To, pied des emails). Pas d'adresse sur le domaine.
- Expéditeur : `ne-pas-repondre@trouve-ta-formation.fr`.
- **La prospection ne partira jamais de `trouve-ta-formation.fr`** : un domaine dédié sera utilisé.

### 5.11 Landing organismes et classement
- Structure et textes de la maquette v3. Organisme d'exemple : « **Votre centre de formation** ».
- « Pourquoi c'est gratuit » : version générique (« Nous proposerons plus tard des services optionnels aux organismes
  qui les souhaitent. Ils ne changeront rien à l'ordre de classement des fiches. »).
- **Deux notions distinctes** : le **classement** (ordre naturel du catalogue) ne se vend jamais ; un éventuel
  **emplacement mis en avant** contre rémunération serait distinct du classement et **toujours signalé**. Formulations :
  « Le classement ne s'achète pas. Si un emplacement est un jour mis en avant contre rémunération, il sera toujours
  signalé comme tel. » ; FAQ : « …n'influenceront pas le classement des fiches. Le classement dépend uniquement de la
  pertinence et de la complétude des fiches. Un éventuel emplacement mis en avant contre rémunération serait distinct
  du classement et toujours signalé comme tel. » ; grille « Meilleur classement — Non vendu » inchangée.
- « Cinq minutes » : validé par un essai réel d'Erwan.
- Mobile : les ancres de navigation de l'en-tête sont masquées.

### 5.12 Espace admin (Sprint 9)
- **Accès** : sous-domaine `admin.`, compte **unique** (contrainte en base), mot de passe (12 caractères) puis code
  TOTP obligatoire (Supabase MFA). Tant que le 2FA n'est pas configuré, seule la page Paramètres s'ouvre.
  **Session de 8 heures** au plus depuis la saisie du mot de passe. Règle unique dans `lib/admin-acces.ts`, appliquée
  par le middleware et, sur chaque page et action, par `exigerAdmin()` (`lib/admin-serveur.ts`).
- **Codes de récupération** : 10, format XXXX-XXXX, stockés hachés, affichés une seule fois. En utiliser un retire
  l'application d'authentification : il faut la configurer de nouveau (10 nouveaux codes sont alors générés).
- **Lecture seule** sur le contenu des fiches ; écritures : rappel, suspension, suppression (et référentiel,
  prospection, seuils).
- **Suspension** : fiche invisible du public ; l'organisme se connecte, voit un bandeau et **peut modifier sa fiche**
  (sans effet public). Seul l'admin réactive (l'organisme n'a pas le droit d'écrire le statut) ; publication
  recalculée à la réactivation.
- **Rappels** : 2 types (ajout de formation, complétion de fiche), email fixe, aucun type par défaut ; historique sur
  la Fiche client (table `rappels_organisme`). Lien « Ne plus recevoir ces rappels » (promesse de la FAQ) : jeton signé
  (HMAC, `lib/desabonnement.ts`), page `/desabonnement/` de l'espace organisme avec un bouton (les antivirus des
  messageries ouvrent les liens : un simple clic désabonnerait à leur insu) et désabonnement en un clic depuis la
  messagerie (en-têtes `List-Unsubscribe` / `List-Unsubscribe-Post`). Désabonné : bouton de rappel grisé, envoi refusé.
- **Refus d'une demande de titre** : motif obligatoire (« déjà présent », avec le titre existant, ou « hors
  périmètre »), un email par motif.
- **Fichier client** = tous les organismes, y compris ceux créés en base sans compte (rappel impossible pour eux).
- **Prospection** (page hors maquette, minimale) : table `prospects`, jamais reliée aux fiches ni au Fichier client.
  Import du CSV du scraping, identifiant SIRET sinon SIREN, un prospect connu garde son statut. **Lignes sans SIRET**
  (décision Erwan 01/10/2026) : gardées ; SIRET cherché par l'API Recherche d'entreprises (nom + code postal), retenu
  seulement si une seule entreprise, un seul établissement actif à ce code postal et un nom concordant ; sinon badge
  « SIRET manquant », dédoublonnage par email, domaine ou téléphone. **Liste d'exclusion** :
  SIRET, SIREN, email et domaine du site stockés **en empreintes SHA-256** seulement (on reconnaît l'organisme sans
  garder ses données) ; l'exclusion d'un SIREN écarte tous ses établissements. Un organisme qui renseigne un SIRET
  prospecté fait passer le prospect à « inscrit » (déclencheur).
- **Référentiel** : ajout, modification (intitulé, catégorie ; le slug ne change jamais), archivage (jamais de
  suppression) ; libellé long provisoire = intitulé. Demandes : relecture puis acceptation, ou refus ; un email à
  chaque fois ; aucune offre rattachée automatiquement.
- **Analytics** : suivi interne sans cookie ni IP (table `evenements`, envoi par `sendBeacon` depuis
  `components/public/Mesure.tsx`, robots écartés) ; CTA suivis : téléphone, email, **site web** (lien principal
  configurable reporté). Paliers : un instantané par jour de consultation (`statistiques_quotidiennes`). Onglet Blog
  vide jusqu'au Sprint 10.
- **Seuils** (table `parametres`) éditables dans Paramètres, section 03.

### 5.13 Blog (Sprint 10, décisions Erwan 01/10/2026)
- Catégories : Le métier · Se former · Conditions d'accès · Actualités (pas de « Formations » ni « Réglementation »).
- Auteurs : plusieurs possibles ; au lancement, Erwan seul (« Fondateur de Trouve ta formation » + biographie), sans
  photo (monogramme). L'auteur fictif n'existe que sur dev.
- Accroche de fin d'article : contextuelle, saisie par article (question, phrase, lien, page) ; le générique
  « Vous cherchez la formation qui vous correspond ? / Trouver ma formation » seulement si les champs sont vides.
- Dépublication : page de remplacement → 301 ; sinon 410 (page « article retiré ») ; jamais de 404. Slug modifié
  après publication → 301. Géré dans le middleware (`resolution_article`), **toujours directement vers la destination
  finale** : changements de slug successifs, remplacement lui-même renommé ou dépublié, ancienne adresse d'un article
  dépublié ; une boucle de remplacements répond 410 (test « redirections directes » de `e2e/admin.spec.ts`).
- Audit anti-concurrence obligatoire avant publication (case dans l'éditeur, contrainte en base).
- Le blog démarre vide : la liste est `noindex` et hors sitemap tant qu'aucun article n'est publié.
- Article : colonne de lecture de 700 px, « Dans cet article » à droite et fixe sur ordinateur, en haut sur mobile.
- Pas de photo d'auteur pour l'instant ; confirmation avant publication (fenêtre) ; textes d'interface validés.

### 5.14 Prospection (décisions Erwan 01/10/2026)
- Ordre : **appel téléphonique d'abord**, email seulement si personne ne répond. Statuts : À contacter → Appelé sans
  réponse → Email envoyé → Contacté → Inscrit / Exclu.
- FAQ « D'où vient mon adresse email ? » alignée sur les sources réelles du scraping : « Selon les cas, de votre fiche
  Google, du catalogue Mon Compte Formation ou de votre site internet. Nous ne collectons que les adresses que les
  organismes publient pour leur activité professionnelle… ». Les 5 adresses de messagerie personnelle sont gardées.

---

## 6. Pièges techniques connus

- **Action serveur + sous-domaine** : `redirect()` dans une action serveur de l'espace rend la page cible **sans
  repasser par le middleware** → 404. Renvoyer `{ vers }` et naviguer côté client (`window.location.assign`).
- **`revalidatePath` dans une action** ne rafraîchit pas la page affichée sur le sous-domaine → `router.refresh()`
  côté client. Toute action qui revalide relance le rendu de la page courante : c'est pourquoi la suppression de compte
  passe par `/auth/suppression/`.
- **Route handlers** de l'espace : construire les redirections avec `origineEspace()` (en-tête `host`), pas `request.url`
  (URL interne réécrite).
- **Server Components → Client** : passer `actions={{ ...actions }}`, jamais le module d'actions lui-même.
- **`loading.tsx` au-dessus d'un `[slug]` dynamique** transforme les 404 en 200 : il est cantonné au groupe `(catalogue)`.
- **API de gestion Supabase** : un booléen `false` est parfois ignoré ; pour désactiver
  `mailer_allow_unverified_email_sign_ins`, envoyer `null`, puis activer `mailer_autoconfirm`. Les modèles d'emails
  ne sont modifiables qu'avec un SMTP personnalisé.
- **Déclencheurs en base** écrivant dans une table protégée (historique des prix) : `security definer`.
- **Windows / Git Bash** : pas d'apostrophes dans un heredoc non protégé ; chemins Windows (`C:/…`) pour Node ;
  `.env.local` a des fins de ligne CRLF (`tr -d '\r'`).
- `next.config.ts` n'accepte pas l'alias `@/` : imports relatifs (contenus légaux, piliers).
- **`trailingSlash: true`** vaut aussi pour les routes API : appeler `/api/evenements/` (sans barre finale : 308, que
  `sendBeacon` ne suit pas).
- **Limite de 1 000 lignes** par requête Supabase : lire par pages (`toutLire` dans `queries/admin.ts`).
- **Suppression depuis une page** : la revalidation relance le rendu de la page de l'élément supprimé → `notFound()` ;
  la Fiche client a donc son propre `not-found.tsx` (écran « Compte supprimé »).
- **Playwright** : le navigateur sans interface se présente comme « HeadlessChrome », écarté du suivi comme un robot ;
  le test Analytics prend un User-Agent ordinaire. Sous `next dev`, la première ouverture d'une page compile
  lentement : attendre la navigation (`waitForURL`, 30 s).
- **Tiptap → action serveur** : passer `JSON.parse(JSON.stringify(editor.getJSON()))`, sinon « Cannot access … on the
  server » (objets non transmissibles).
- **Serveur local** : un ancien `next dev` peut rester sur le port 3000 (le nouveau prend 3001 et les tests visent
  3000) ; arrêter les processus sur 3000/3001 et supprimer `.next` en cas d'erreur « Cannot find module ».
- **Python sous Windows** écrit en CRLF par défaut : ouvrir les fichiers avec `newline=''` (le dépôt est en LF).
- **API Recherche d'entreprises** : limite de débit (429) vite atteinte ; appels espacés et nouvelles tentatives.
- **Séquences d'échappement** (`\uFEFF`, `\r\n`) : l'écriture de fichiers par l'outil les transforme parfois en
  caractères réels ; vérifier avec `od -c`. Les longs scripts Python passent mieux par un fichier que par un heredoc.

---

## 7. Ce qui bloque la mise en production

À faire **avec l'accord d'Erwan** (production), dans cet ordre :

1. **Pages légales** : à finaliser au Sprint 11 avec la **société d'Erwan** (en cours de création). Décision du
   1er octobre 2026 : informations de la société en `[à compléter]` → **le build de production reste bloqué** tant
   qu'elles manquent (`next.config.ts`). Version provisoire actuelle : entreprise individuelle (SIREN 882 911 399,
   Bois-Colombes, sans téléphone ni TVA). Relecture juridique conseillée.
2. **Vider la base de production** : compte `espace-test@trouve-ta-formation.fr`, 7 organismes `est_test`, contenus
   des tables `liens_email`, `formulaire_statistiques`, `recherches_sans_resultat`. Appliquer d'abord les migrations
   éventuellement créées depuis.
3. **Réglages d'authentification de production** : `config-auth-supabase.mjs --projet=prod --smtp --emails`
   (seule l'adresse `partenaires.` autorisée, emails Resend en français).
4. **Variables Vercel de production** : `RESEND_SENDING_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
   `TURNSTILE_SECRET_KEY` (le jeton Cloudflare expire le 8 octobre ; ensuite, la clé secrète se lit dans le tableau de
   bord Cloudflare). Sans clé Turnstile, l'inscription est refusée en production.
5. **Retirer les redirections 307** de `partenaires.` et `admin.trouve-ta-formation.fr` dans Vercel.
6. **Migrations à appliquer en production** (toutes déjà appliquées et testées sur la base de dev), dans l'ordre :
   - `20261015_administrateur` — compte admin unique, codes de récupération, liens de changement d'email admin ;
   - `20261016_rappels` — historique des rappels ;
   - `20261017_prospection` — prospects, liste d'exclusion, passage automatique à « inscrit » ;
   - `20261018_analytics` — événements, instantanés quotidiens des paliers ;
   - `20261019_prospects_sans_siret` — prospects sans SIRET ;
   - `20261020_desabonnement_et_admin_test` — désabonnement des rappels, motif de refus, compte admin de test ;
   - `20261021_statuts_prospection` — « Appelé sans réponse », « Email envoyé » ;
   - `20261022_blog` — articles, auteurs (dont Erwan), dépublication ;
   - `20261023_blog_audit` — audit anti-concurrence obligatoire ;
   - `20261024_blog_images` — stockage des images du blog ;
   - `20261025_resolution_article_finale` — redirections du blog sans chaîne ;
   - `20261026_securite_et_conservation` — limitation des tentatives, date de dernier contact, purge quotidienne
     (pg_cron doit être activé sur la base de prod) ;
   - `20261027_suivi_404` — type d'événement `page_404` (pages introuvables, onglet Analytics « Général ») ;
   - `20261028_seuil_bloc_pilier` — seuil du bloc organismes des pages titre (3, décision Erwan 02/10/2026) ;
   - `20261029_referentiel_verifie` — RNCP TFP ASA, durées MAC APS / SSIAP 1 / recyclage, expérience SSIAP 2 en heures.
   Ensuite : créer le compte admin (`creer-admin.mjs --projet=prod`, adresse choisie par Erwan), configurer le 2FA à la
   première connexion ; créer un deploy hook pour `main` et la variable `VERCEL_DEPLOY_HOOK_URL` de production.
   Ne jamais lancer `seed-blog-test.mjs` ni les tests Playwright sur la production (ils le refusent).
7. **Supabase Pro** pour la production (sauvegardes quotidiennes, pas de mise en pause) : décision budgétaire
   d'Erwan. L'offre gratuite n'a aucune sauvegarde automatique.
8. **Avenants de traitement (DPA)** de Vercel, Supabase, Resend, Cloudflare acceptés et archivés (Erwan).
9. Fusion `dev` → `preprod` → vérification → `main`.

Pour la publicité et l'analytics tiers : créer les comptes GA4, Google Ads et Meta, puis poser leurs identifiants
dans les variables Vercel de production (le bandeau apparaît alors seul).

Avant la **première campagne de prospection** (pas bloquant pour la mise en ligne) : script d'appel et pied d'email
de `docs/CONFORMITE_RGPD.md` §4, domaine d'envoi dédié, relecture juridique.

---

## 8. Préparer le Sprint 12 (SEO et lancement)

Voir `Plan_Sprints.md`. Restes du Sprint 11 : informations de la société d'Erwan dans `contenu/legal/editeur.ts`,
relecture juridique des pages légales, boîte email professionnelle à la création de la société.

---

## 9. Points ouverts

### Contenus à rédiger ou vérifier (Erwan)
- Pages piliers : 11 titres sans contenu, 2 brouillons (SSIAP 1, MAC APS) à finaliser.
- Démarches CNAPS : coûts, délais, fenêtre de renouvellement, traitement d'une carte expirée.
- Pages départements : 7 textes de 300 mots à écrire, 1 brouillon (Seine-Saint-Denis).
- Référentiel : durées et RNCP marqués `[À VÉRIFIER]` (TFP ASA notamment).
- Formulaire : parcours de renouvellement d'une carte ASA, conditions d'expérience SSIAP 2 et 3.
- Pages légales : informations de la société d'Erwan (`contenu/legal/editeur.ts`), relecture juridique.
- Proposition de Claude (accord d'Erwan sur le principe) : rédiger les contenus en attente avec sources officielles
  citées, faits non vérifiables marqués `[à vérifier]`.

### Textes validés par Erwan (1er octobre 2026)
- Sprint 9 : les 4 emails (rappels avec lien « Ne plus recevoir ces rappels », demande de titre acceptée, refusée
  avec motif), bandeau de suspension, page Prospection, page de désabonnement, pages Connexion et Vérification admin,
  « Réglages du site », états de la Fiche client (Indexable / Non indexable / Non publiée / Dépubliée), libellés
  Analytics.
- Sprint 10 : textes du blog, page liste vide, article retiré, textes d'interface de l'éditeur ; 404 et racine
  (copy).
- Restent en relecture chez Erwan (sprints précédents) : messages « fiche non publiée / suspendue » de l'espace
  organisme, avertissement titre archivé, demande d'ajout de titre, emails de validation et de changement d'adresse,
  textes de l'accompagnement en 7 étapes.

### Décisions produit en attente
- Seuil d'affichage des compteurs (`seuilCompteurs`).
- Seuils provisoires à confirmer : page département (3 au palier Correct), page ville (5), élargissement (3).
- Note Google des organismes : reportée après le lancement.
- Carte des lieux (géocodage) : non construite.
- Admin : seuil d'alerte visuelle du tableau de bord (non affiché) ; historique des demandes de titre refusées (non
  construit) ; lien CTA principal configurable (reporté) ; photo des auteurs (plus tard).
- Blog : fréquence de publication cible, calendrier de révision des articles réglementaires.

### Technique
- Next.js 16 : montée de version reportée (aucune faille connue sur la 15.5).
- Inscription avec une adresse déjà utilisée : le message indique qu'un compte existe peut-être (choix d'usage,
  permet de savoir qu'une adresse est inscrite ; la limitation des tentatives freine l'énumération).
- Suivi des 404 et propriété Search Console : Sprint 12.
- `llms.txt` à mettre à jour au lancement (blog, landing organismes, espace organisme).
- Jeton Cloudflare à supprimer par Erwan une fois les clés Turnstile de production posées.
