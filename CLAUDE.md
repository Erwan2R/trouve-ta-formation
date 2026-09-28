# CLAUDE.md — Brief technique · Trouve ta formation

> Ce document est destiné à **Claude Code**. Il définit la stack, les conventions et les règles non négociables pour développer le site. Il ne redéfinit pas le produit — se référer aux specs UX/Copy/Architecture du projet pour le contenu, les blocs de page et le référentiel des 13 titres.

---

## 1. Le projet en une phrase

`trouve-ta-formation.fr` est un annuaire de formations professionnelles, lancé avec une verticale sécurité privée (`/securite-privee/`), conçu pour dominer le SEO organique et être parfaitement lisible par les moteurs de recherche **et** par les LLM (ChatGPT, Perplexity, Claude, Gemini) qui citent des sources.

Codebase unique, multi-verticale par configuration (pas par duplication).

---

## 2. Design — déjà fait

Le design du site est déjà réalisé. Claude Code ne doit **pas** concevoir l'interface : il doit retrouver et suivre les instructions de handoff présentes dans le dossier **`design_handoff_trouve_ta_formation`** (composants, tokens, layouts, specs par page). Consulter ce dossier avant tout Sprint touchant à une page ou un composant visuel, et implémenter fidèlement ce qui y est spécifié plutôt que d'improviser une direction visuelle.

---

## 3. Stack technique (arrêtée)

| Couche           | Choix                                                                                                      | Pourquoi                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Framework        | **Next.js 15, App Router**                                                                                 | SSR/SSG natif, obligatoire pour que tout le contenu indexable soit dans le HTML initial |
| Langage          | **TypeScript strict**                                                                                      | Pas de `any` toléré sur les types de données métier (organisme, titre, offre)           |
| Styles           | **Tailwind CSS**                                                                                           | Rapidité, pas de CSS mort                                                               |
| Base de données  | **Supabase (Postgres)**                                                                                    | Décidé                                                                                  |
| ORM / accès data | **Client Supabase typé**, types générés (`supabase gen types typescript`)                                  | Évite la dérive schéma ↔ code                                                           |
| Auth             | **Supabase Auth**                                                                                          | Comptes organisme + compte admin unique (voir specs Paramètres Organisme / Admin)       |
| Hébergement      | **Vercel**                                                                                                 | Décidé                                                                                  |
| Images           | **next/image**, format WebP obligatoire                                                                    | Core Web Vitals                                                                         |
| Analytics        | **Interne** (pas de GA4)                                                                                   | Décision produit actée                                                                  |
| Tests            | **Vitest** (unitaire) + **Playwright** (parcours critiques : formulaire d'affinage, inscription organisme) | Minimum viable, pas de sur-ingénierie                                                   |

**Non négociable :** aucun contenu textuel indexable ne doit dépendre d'un rendu client-side. Toute page publique (accueil, catalogue, fiches, piliers, démarches, géographiques, blog) est SSR ou SSG. Le rendu client est réservé à l'interactivité (filtres, dashboard organisme/admin).

---

## 4. Structure du repo (cible)

```
/app
  /(public)
    /securite-privee
      /organismes/          → catalogue + [slug]/ fiche organisme
      /demarches/[slug]/    → pages démarche CNAPS
      /[slug]/              → résolu dynamiquement : titre (page pilier) ou zone géo
      layout.tsx            → header/footer intra-silo, pas de lien inter-verticale
    /blog/[slug]/
    /formulaire/            → noindex
    page.tsx                → racine domaine
  /(auth)
    /connexion/
    /inscription/
  /(organisme)               → dashboard, ma-fiche, mes-formations, parametres
  /(admin)                   → dashboard, fichier-client, fiche-client/[id], referentiel-titres, blog-admin, analytics, parametres
  /api                       → route handlers (formulaire, inscription, webhooks)
  sitemap.ts
  robots.ts
/lib
  /supabase                  → client, types générés, requêtes réutilisables
  /seo                        → helpers metadata, JSON-LD par type de page
  /config
    verticales.ts             → config par verticale (nom, filtres, référentiel, sources)
    slugs-reserves.ts          → liste centralisée (voir §5)
/components
  /ui                          → composants génériques
  /public                      → composants propres aux pages publiques
/public
  llms.txt
/supabase
  /migrations                  → SQL versionné
  seed.sql
```

---

## 5. Règles SEO & lisibilité LLM — non négociables

Ces règles s'appliquent à **toute** page publique. Un écart doit être signalé, jamais silencieux.

- **Un seul `<h1>` par page**, portant le sujet exact de la page (nom d'organisme, libellé du titre, nom de la ville…).
- **Hiérarchie de titres propre** : pas de saut de niveau (H2 → H4 interdit).
- **Aucun élément cliquable sans balise `<a href>`** — pas de `<div onClick>` sur un lien de contenu ou de carte.
- **Rendu serveur pour tout texte et tout lien** — voir §2.
- **Données structurées (JSON-LD)** systématiques :
  - `Organization` + `WebSite` au niveau du layout racine
  - `BreadcrumbList` sur toute page profonde
  - `LocalBusiness` ou `EducationalOrganization` sur les fiches organisme
  - `ItemList` sur le catalogue et les pages géographiques/piliers listant des organismes
  - `FAQPage` uniquement où le contenu FAQ est réellement unique (jamais une FAQ dupliquée d'une fiche à l'autre)
  - `HowTo` à évaluer sur les pages démarche
- **Métadonnées** : `title`, `description`, `canonical` générés par un helper centralisé (`lib/seo`), jamais codés en dur page par page.
- **Fichier `/public/llms.txt`** à la racine : résumé structuré du site (nature, verticales, structure des pages, politique de contenu) pour les crawlers IA. À maintenir à jour à chaque ajout de verticale.
- **`sitemap.xml`** généré dynamiquement (`app/sitemap.ts`), un sitemap par verticale si le volume le justifie.
- **`robots.ts`** reflète strictement les règles d'indexation ci-dessous.
- **Core Web Vitals** comme contrainte de dev : images `next/image` dimensionnées, lazy loading sur tout ce qui est hors du premier écran, aucun script bloquant le rendu, cartes/composants tiers en chargement différé.
- **Vitesse de build/déploiement** : les pages statiques (piliers, démarches) sont générées au build ou en ISR ; les pages à fort volume (fiches organisme, géographiques) en ISR avec revalidation adaptée au rythme réel de mise à jour des données.

### Règles d'indexation (résumé — voir `Structure_URL_Annuaire_Securite.md` pour le détail)

| Page                                         | Statut                                                                                                                       |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Catalogue sans filtre                        | Indexable, canonique                                                                                                         |
| Catalogue avec filtre actif                  | `noindex, follow` + canonical vers la version nue                                                                            |
| Filtre géographique / filtre titre           | Ne crée **jamais** d'URL indexable                                                                                           |
| Pages géographiques / piliers éditorialisées | Indexables — ce sont elles qui portent le rôle du filtre                                                                     |
| Formulaire d'affinage + résultats            | `noindex`                                                                                                                    |
| Fiche organisme                              | Indexable, sauf sous le seuil de complétude minimal → `noindex` jusqu'à enrichissement (seuil à définir, cf. points ouverts) |
| Pagination catalogue                         | Numérotée, liens `<a>` en dur, pas de scroll infini, chaque page s'auto-canonise, `noindex, follow` au-delà du seuil décidé  |

---

## 6. Contraintes d'architecture héritées des specs produit

- **Slugs réservés**, à ne jamais attribuer à un titre ou une zone géographique : `organismes`, `demarches`, `blog`, `recherche`, `formulaire`. Centralisés dans `lib/config/slugs-reserves.ts`, vérifiés à chaque ajout au référentiel.
- **Résolution des URLs** `/securite-privee/[slug]/`, dans cet ordre : slug réservé → route fonctionnelle ; sinon titre du référentiel → page pilier ; sinon ville/département couvert → page géographique ; sinon 404.
- **Silo cloisonné** : aucun lien de contenu ou de navigation (header, footer commun excepté) entre deux verticales. Le pied de page est le seul endroit où un lien inter-silo est toléré.
- **Une fiche = un organisme**, quel que soit le nombre de sites (lieux = attribut, pas entité séparée).
- **Pas d'URL par offre en V1** — l'offre (titre × organisme) est une ancre sur la fiche organisme (`/securite-privee/organismes/[slug]/#[titre]`), jamais une page.
- **Référentiel des titres fermé** — aucune saisie libre côté organisme, uniquement une sélection dans la liste maintenue en base.

---

## 7. Schéma Supabase — point de départ (V1)

À affiner en migration SQL, mais la forme est arrêtée :

```
organismes
  id, slug, nom, siret, statut (brouillon/publié/suspendu),
  score_completude, lieux (jsonb ou table liée), created_at, updated_at

titres_referentiel
  id, slug, libelle_court, libelle_long, code_rncp, duree,
  categorie, statut (actif/archivé)

organisme_titres   -- table de liaison = "l'offre"
  organisme_id, titre_id, prix, modalites, financements, lieu_id

comptes_organisme
  id, organisme_id, email, role, totp_active

villes / departements
  id, slug, nom, departement_code, nb_organismes_cache

articles_blog
  id, slug, titre, categorie, statut, published_at

utilisateur_admin
  id, email, totp_active   -- compte unique V1, pas de multi-rôle
```

Champs `score_completude` et seuils `noindex` : logique à implémenter dans `lib/seo`, calcul à définir avec Erwan (point ouvert transverse à plusieurs specs).

---

## 8. Conventions de code

- Composants en **PascalCase**, fichiers utilitaires en **kebab-case**.
- Un composant = un fichier. Pas de fichier "barrel" fourre-tout par dossier sauf `index.ts` d'export explicite.
- Requêtes Supabase centralisées dans `lib/supabase/queries/`, jamais de `supabase.from()` dispersé dans les composants de page.
- Pas de librairie ajoutée sans raison — préférer le natif Next.js / Tailwind avant toute dépendance (cf. principe "lean V1").
- Toute variable d'environnement documentée dans `.env.example`, jamais de secret en dur.
- Commits en français, impératif présent ("Ajoute la page pilier", pas "Added").

---

## 9. Variables d'environnement (`.env.example` à créer)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
```

À compléter au fil des sprints (auth email, éventuel service d'envoi d'email pour l'inscription organisme, etc.).

---

## 10. Documents de référence à lire avant chaque sprint

Claude Code doit consulter les documents projet correspondants avant de coder une famille de pages : Note de cadrage, Architecture des pages, Structure d'URL, UX + Copy de chaque page, Référentiel des 13 titres. Ce brief technique ne remplace pas ces specs — il encadre uniquement le _comment coder_, pas le _quoi afficher_.

---

## 11. Points ouverts qui bloquent certains sprints

- Calcul du score de complétude et seuil de `noindex` fiche organisme
- Seuil d'affichage des compteurs (accueil, catalogue, landing B2B)
- Confirmation du référentiel des 13 titres (RNCP, durées `[À VÉRIFIER]`)
- Seuil de publication d'une page département / ville (5 organismes à confirmer)

Ces points sont traités dans les documents produit correspondants — ne pas les trancher côté code sans validation d'Erwan.
