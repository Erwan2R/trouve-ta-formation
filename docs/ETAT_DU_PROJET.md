# État du projet — Trouve ta formation

> Note de passation au 1er octobre 2026, fin du Sprint 9. À lire en entier avant de lancer le Sprint 10.
> Elle complète [CLAUDE.md](../CLAUDE.md) (brief technique), [Plan_Sprints.md](../Plan_Sprints.md) (plan) et
> [README.md](../README.md) (environnements, commandes). En cas de contradiction avec une spec du dossier
> `design_handoff_trouve_ta_formation/`, les **décisions d'Erwan listées ici font foi** : elles sont postérieures.

---

## 1. En bref

- **Sprints 0 à 9 terminés** sur la branche `dev` (dev.trouve-ta-formation.fr). La production (`main`) est restée à la
  fin du Sprint 1 ; `preprod` aussi.
- **La mise en production des Sprints 8 et 9 est bloquée** par les points de la section 7, dont les textes légaux que
  rédige une société tierce.
- **Prochaine étape : Sprint 10, blog public et blog admin**, sur `dev`. Préparation en section 8.

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
| 10 | Blog public et blog admin | À faire (liens « Blog » déjà présents dans les menus → 404 d'ici là) |
| 11 | Durcissement SEO et lancement | À faire |

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
- **Python sous Windows** écrit en CRLF par défaut : ouvrir les fichiers avec `newline=''` (le dépôt est en LF).
- **API Recherche d'entreprises** : limite de débit (429) vite atteinte ; appels espacés et nouvelles tentatives.
- **Séquences d'échappement** (`\uFEFF`, `\r\n`) : l'écriture de fichiers par l'outil les transforme parfois en
  caractères réels ; vérifier avec `od -c`. Les longs scripts Python passent mieux par un fichier que par un heredoc.

---

## 7. Ce qui bloque la mise en production

À faire **avec l'accord d'Erwan** (production), dans cet ordre :

1. **Pages légales** : rédigées le 1er octobre 2026 avec l'entreprise individuelle d'Erwan (SIREN 882 911 399, ville
   seule, sans téléphone) en attendant sa société ; plus aucun marqueur, le build de production n'est plus bloqué.
   **Relecture juridique conseillée** (prospection, durées) ; à mettre à jour à la création de la société.
   Engagement pris dans la politique : prospects conservés **3 ans au plus après le dernier contact** → purge
   automatique à construire avant la première campagne.
2. **Vider la base de production** : compte `espace-test@trouve-ta-formation.fr`, 7 organismes `est_test`, contenus
   des tables `liens_email`, `formulaire_statistiques`, `recherches_sans_resultat`. Appliquer d'abord les migrations
   éventuellement créées depuis.
3. **Réglages d'authentification de production** : `config-auth-supabase.mjs --projet=prod --smtp --emails`
   (seule l'adresse `partenaires.` autorisée, emails Resend en français).
4. **Variables Vercel de production** : `RESEND_SENDING_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
   `TURNSTILE_SECRET_KEY` (le jeton Cloudflare expire le 8 octobre ; ensuite, la clé secrète se lit dans le tableau de
   bord Cloudflare). Sans clé Turnstile, l'inscription est refusée en production.
5. **Retirer les redirections 307** de `partenaires.` et `admin.trouve-ta-formation.fr` dans Vercel.
6. **Admin** : appliquer à la base de production les migrations `20261015` à `20261021` (administrateur, rappels,
   prospection, analytics) ; créer le compte admin (`creer-admin.mjs --projet=prod`, adresse choisie par Erwan), puis
   configurer le 2FA à la première connexion ; créer un deploy hook pour `main` et la variable
   `VERCEL_DEPLOY_HOOK_URL` de production.
7. Fusion `dev` → `preprod` → vérification → `main`.

Avant l'envoi de la **première campagne de prospection** (pas bloquant pour la mise en ligne) : valider la réponse
« D'où vient mon adresse email ? » contre le fonctionnement réel du scraping et juridiquement ; domaine d'envoi dédié.

---

## 8. Préparer le Sprint 10 (blog)

**Specs à relire** : `UX_Blog_Admin.md`, specs du blog public, prototypes « Blog Admin » et « Editeur Article ».
Éditeur riche : **Tiptap**, accepté par Erwan.

**Déjà en place**
- Lien « Blog » de la barre admin : **retiré** en attendant (`components/admin/NavAdmin.tsx`), à remettre.
- Analytics : onglet Blog vide ; ajouter le type d'événement `vue_article` (contrainte de `evenements.type`) et le
  classement des articles (liens vers l'éditeur).
- Table `articles_blog` prévue dans CLAUDE.md §7, pas encore créée.

---

## 9. Points ouverts

### Contenus à rédiger ou vérifier (Erwan)
- Pages piliers : 11 titres sans contenu, 2 brouillons (SSIAP 1, MAC APS) à finaliser.
- Démarches CNAPS : coûts, délais, fenêtre de renouvellement, traitement d'une carte expirée.
- Pages départements : 7 textes de 300 mots à écrire, 1 brouillon (Seine-Saint-Denis).
- Référentiel : durées et RNCP marqués `[À VÉRIFIER]` (TFP ASA notamment).
- Formulaire : parcours de renouvellement d'une carte ASA, conditions d'expérience SSIAP 2 et 3.
- Mentions légales et politique de confidentialité : rédigées (entreprise individuelle), relecture juridique conseillée.
- Réponse « D'où vient mon adresse email ? » (landing) à valider.
- Textes rédigés par Claude, en relecture chez Erwan : messages « fiche non publiée / suspendue », avertissement titre
  archivé, demande d'ajout de titre, emails (validation, changement d'adresse, notifications), textes de
  l'accompagnement en 7 étapes, pages légales (parties factuelles).

- **Textes du Sprint 9** : emails, bandeau de suspension et page Prospection **validés par Erwan** (01/10/2026). Restent
  à relire : page « Ne plus recevoir ces rappels », pages Connexion et Vérification admin, section « Réglages du
  site », état « Non publiée » de la Fiche client, libellés des écrans du formulaire dans Analytics.
- **Fichier du scraping** (142 lignes) : 107 organismes distincts, dont 17 sans SIRET ni SIREN (52 lignes, beaucoup de
  doublons) ; l'API en retrouve 4 sans ambiguïté. 83 emails, dont 5 de messagerie personnelle (gmail ×2, yahoo,
  orange, outlook) : la FAQ « D'où vient mon adresse email ? » parle d'adresses professionnelles, à valider.

### Décisions produit en attente
- Seuil d'affichage des compteurs (`seuilCompteurs`).
- Seuils provisoires à confirmer : page département (3 au palier Correct), page ville (5), élargissement (3).
- Note Google des organismes : reportée après le lancement.
- Carte des lieux (géocodage) : non construite.
- Admin : seuil d'alerte visuelle du tableau de bord (non affiché) ; historique des demandes de titre refusées (non
  construit) ; durée de
  conservation des événements Analytics (aucune purge aujourd'hui) ; lien CTA principal configurable (reporté).

### Technique
- Aucun suivi des 404 ni propriété Search Console (Sprint 11).
- `llms.txt` à mettre à jour au lancement (landing organismes, espace organisme).
- Jeton Cloudflare à supprimer par Erwan une fois les clés Turnstile de production posées.
