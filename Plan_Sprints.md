# Plan de sprints — Trouve ta formation

> Découpage du développement pour Claude Code. Chaque sprint est livrable indépendamment et suit l'ordre de dépendance du produit : les pages piliers et démarches ne dépendent pas de l'inventaire d'organismes et peuvent porter du trafic pendant que la base se constitue — elles sont donc priorisées avant les environnements organisme/admin complets.

Se référer à `CLAUDE.md` pour la stack, les règles SEO et les conventions. Se référer aux specs UX/Copy correspondantes avant chaque sprint.

---

## Sprint 0 — Setup & fondations

**Objectif :** un repo qui build, déploie sur Vercel, et respecte les règles SEO/techniques dès le premier commit.

- Initialiser le projet Next.js 15 (App Router, TypeScript strict, Tailwind)
- Configurer ESLint + Prettier + Vitest + Playwright (config minimale, pas de tests encore)
- Créer le repo Supabase, connecter le projet, générer les types TypeScript
- Écrire les premières migrations SQL (`organismes`, `titres_referentiel`, `organisme_titres`, `villes`, `departements` — schéma de base, voir CLAUDE.md §6)
- Créer `.env.example` et configurer les variables sur Vercel
- Mettre en place `app/sitemap.ts` et `app/robots.ts` (squelette, même vide de contenu au départ)
- Créer `/public/llms.txt` (première version : nature du site, verticale sécurité privée, structure des pages)
- Mettre en place `lib/seo` : helper de génération de metadata (title/description/canonical) et helper JSON-LD réutilisable
- Créer `lib/config/verticales.ts` et `lib/config/slugs-reserves.ts`
- Déployer un premier build vide sur Vercel, vérifier le pipeline CI/CD

---

## Sprint 1 — Layout global & intégration du design

**Objectif :** header, footer, composants UI de base, cohérents sur tout le site.

**Le design est déjà fait.** Avant ce sprint, lire l'intégralité du dossier **`design_handoff_trouve_ta_formation`** (tokens, composants, specs par page) et implémenter fidèlement ce qui y est défini — ne rien reconcevoir.

- Layout racine : header, footer (seul endroit où un lien inter-verticale est toléré), fil d'Ariane réutilisable (`BreadcrumbList` inclus), conformes au handoff
- Composants UI de base (`components/ui`) : boutons, cartes, badges, champs de formulaire — repris du handoff, pas improvisés
- Page 404 + page racine du domaine (cf. `UX_404_Racine_Domaine.md`)
- Vérification Core Web Vitals sur le layout vide (Lighthouse en CI si possible)

---

## Sprint 2 — Page d'accueil sécurité privée

**Objectif :** tête de silo, `/securite-privee/`.

- Implémenter les blocs de la page d'accueil selon `UX_Page_Accueil_Securite_Privee.md` et `Copy_Page_Accueil_Securite_Privee.md`
- Metadata + JSON-LD (`Organization`, `WebSite`)
- Liens vers pages piliers, démarches, catalogue (même si ces pages n'existent pas encore — prévoir les routes)
- Compteurs dynamiques (organismes, formations) — logique de calcul en attente du seuil d'affichage (point ouvert), prévoir un flag de config

---

## Sprint 3 — Pages piliers (référentiel des 13 titres)

**Objectif :** `/securite-privee/[titre-slug]/` — la famille de pages qui porte le trafic avant que l'inventaire d'organismes existe.

- Résolution dynamique du slug (titre du référentiel, cf. règle §5 de CLAUDE.md)
- Gabarit A et Gabarit B selon `UX_Page_Pilier_Titre.md` et `Copy_Pages_Piliers.md`
- Table des matières à ancres en dur
- JSON-LD `BreadcrumbList`, `FAQPage` où pertinent
- Seed des 13 titres en base (données `[À VÉRIFIER]` marquées comme telles, ne pas publier sans validation)
- Sitemap : intégrer les pages piliers

---

## Sprint 4 — Pages démarches CNAPS

**Objectif :** `/securite-privee/demarches/[slug]/`.

- Implémenter selon `UX_Pages_Demarches_CNAPS.md` et `Copy_Pages_Demarches_CNAPS.md`
- Accordéons acceptables si texte dans le DOM au chargement (contrainte SEO)
- Liens contextuels en plein texte vers les pages piliers concernées
- Date de vérification affichée sur chaque procédure
- JSON-LD `HowTo` si retenu (point ouvert — statuer avant de coder le balisage)

---

## Sprint 5 — Catalogue & fiche organisme

**Objectif :** `/securite-privee/organismes/` (catalogue) et `/securite-privee/organismes/[slug]/` (fiche).

- Catalogue : listing, filtres (titre, géographie) en `noindex` + canonical, pagination numérotée sans scroll infini
- Bande contextuelle « Voir la page dédiée à [zone/titre] » quand un filtre correspond à une page éditorialisée existante
- Fiche organisme selon `UX_Fiche_Organisme.md` et `Copy_Fiche_Organisme.md`
- Ancres `#[titre]` pour chaque offre (pas d'URL dédiée, cf. règle produit)
- JSON-LD `LocalBusiness`/`EducationalOrganization`, `ItemList` sur le catalogue
- Logique de `score_completude` et seuil `noindex` — implémenter le calcul dès que le seuil est validé par Erwan (sinon, coder la mécanique avec un seuil par défaut modifiable en config)

---

## Sprint 6 — Pages géographiques

**Objectif :** `/securite-privee/[ville-ou-departement-slug]/`.

- Implémenter selon `UX_Pages_Geographiques.md` et `Copy_Pages_Geographiques.md`
- Résolution dans la chaîne de slugs (après titres, avant 404)
- Seuil de création de page ville (5 organismes, à confirmer) piloté par config, pas en dur
- JSON-LD `ItemList`, `BreadcrumbList`

---

## Sprint 7 — Formulaire d'affinage

**Objectif :** parcours de qualification visiteur → résultats.

- Arbre de questions selon `UX_Formulaire_Affinage.md` et `Copy_Formulaire_Affinage.md`
- Toutes les pages du parcours en `noindex`
- Redirection vers résultats filtrés (catalogue en mode filtré, pas de nouvelle page indexable)
- Test Playwright du parcours complet (chemin critique)

---

## Sprint 8 — Inscription & espace organisme

**Objectif :** de l'inscription au dashboard organisme.

- Inscription (`UX_Inscription_Organisme.md`) — automatique, pas de validation admin
- Auth Supabase (email + mot de passe), 2FA TOTP obligatoire (pas de SMS)
- Dashboard organisme (`UX_Dashboard_Organisme.md`)
- Ma fiche (`UX_Ma_Fiche.md`) — édition des infos affichées publiquement
- Mes formations (`UX_Mes_Formations.md`) — sélection dans le référentiel fermé, aucune saisie libre
- Paramètres organisme (`UX_Parametres_Organisme.md`) — changement email avec confirmation par lien, notification email au changement de mot de passe
- Test Playwright du parcours inscription → première publication de fiche

---

## Sprint 9 — Espace admin

**Objectif :** back-office complet, compte admin unique.

- Dashboard admin (`UX_Dashboard_Admin.md`)
- Fichier client / Fiche client (`UX_Fichier_Client.md`, `UX_Fiche_Client.md`)
- Référentiel des titres — interface de gestion + arbitrage des demandes d'ajout organisme (`UX_Referentiel_Titres.md`)
- ~~Blog admin~~ → reporté au Sprint 10, avec le blog public (décision Erwan 30/09/2026)
- Prospection (page ajoutée, décision Erwan) : import du scraping, liste d'exclusion permanente
- Analytics admin (`UX_Analytics_Admin.md`) — interne, pas de GA4
- Paramètres admin (`UX_Parametres_Admin.md`) — 2FA obligatoire, codes de récupération affichés une seule fois
- Création manuelle de fiche organisme en base (pas d'interface dédiée en V1 — documenter la procédure SQL)

---

## Sprint 10 — Blog public et blog admin

**Objectif :** `/blog/[slug]/` et sa gestion dans l'espace admin.

- Implémenter selon `UX_Blog_Articles.md`
- Catégories (4 maximum au lancement)
- Ligne de qualification auteur
- Blog admin (`UX_Blog_Admin.md`), éditeur Tiptap (accepté par Erwan)
- Analytics : onglet Blog (articles les plus vus)

---

## Sprint 11 — Conformité RGPD et légale (ajouté par Erwan, 01/10/2026)

**Objectif :** être irréprochable sur le plan légal avant le lancement : audit complet, puis mise en conformité.

**1. Audit (livrable : rapport écrit, point par point, avec ce qui est conforme, ce qui manque et la correction proposée)**
- Cartographie de toutes les données personnelles : quoi, où (tables, journaux, prestataires), pourquoi, combien de temps, qui y accède
- Registre des traitements (obligatoire, même pour une petite structure) : candidats, organismes inscrits, prospection, admin, statistiques
- Bases légales de chaque traitement, en particulier la prospection B2B par téléphone et par email (CNIL, Bloctel pour les numéros de téléphone, règles de prospection électronique)
- Prestataires sous-traitants : contrats (DPA), localisation des données, transferts hors UE (Vercel, Supabase, Resend, Cloudflare)
- Cookies et traceurs : inventaire réel sur chaque sous-domaine, confirmation qu'aucun consentement n'est requis
- Droits des personnes : accès, rectification, effacement, opposition, portabilité — délais et procédure effective
- Sécurité : chiffrement, droits d'accès, 2FA admin, journalisation, gestion d'une violation de données (procédure de notification CNIL sous 72 h)
- Mentions légales, politique de confidentialité, CGU (conditions d'utilisation pour les organismes inscrits : à rédiger ?)
- Conformité des formulaires (information au moment de la collecte : inscription, prospection)

**2. Mise en conformité (selon les résultats de l'audit)**
- Purge automatique des prospects 3 ans après le dernier contact (engagement de la politique de confidentialité)
- Purge des comptes organismes jamais validés (30 jours, décision Erwan) et des journaux techniques
- Mention d'information à l'inscription (lien vers la politique), mention d'information dans les emails de prospection
- Procédure documentée de réponse aux demandes de droits, et outil d'export des données d'un organisme (portabilité)
- Registre des traitements tenu dans `docs/`
- Toute page ou tout texte manquant identifié par l'audit (CGU, page cookies, etc.)

**3. Validation**
- Relecture par un juriste des textes légaux et du registre (recommandée avant lancement)
- Mise à jour des mentions légales à la création de la société d'Erwan

---

## Sprint 12 — Durcissement SEO & lancement

**Objectif :** validation finale avant mise en production.

- Audit Lighthouse / Core Web Vitals sur toutes les familles de pages
- Vérification exhaustive du plan d'indexation (tableau §4 de `CLAUDE.md`) sur chaque type de page en environnement de préproduction
- Vérification `sitemap.xml`, `robots.txt`, `llms.txt` finaux
- Vérification des données structurées (outil de test Google Rich Results sur un échantillon de chaque type de page)
- Mise en place du suivi des 404
- Une propriété Search Console pour le dossier `/securite-privee/`
- Création du compte Google Analytics 4 avec Erwan, pose de `NEXT_PUBLIC_GA4_ID` dans Vercel et vérification du bandeau cookies (pas de Google Ads ni de pixel Meta au lancement)
- Revue des points `[À VÉRIFIER]` restants avec Erwan avant publication du contenu réglementaire concerné

---

## Notes de suivi

- Chaque sprint doit être précédé d'une relecture des specs correspondantes par Claude Code — ne pas coder à partir de la mémoire d'un sprint précédent si une spec a été mise à jour entre-temps.
- Tout point marqué `[À VÉRIFIER]` dans les specs produit ne doit pas être codé en dur sans validation — prévoir un mécanisme de configuration modifiable plutôt qu'une valeur figée dans le code.
