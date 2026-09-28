# Handoff : Trouve ta formation — Verticale sécurité privée

## 1. Vue d'ensemble

Trouve ta formation est un annuaire indépendant d'organismes de formation. Cette verticale couvre la sécurité privée en Île-de-France. L'annuaire compare des organismes agréés par le CNAPS, titre par titre et département par département, sans commission ni classement payant.

Le produit comprend trois environnements :

| Environnement | Domaine | Utilisateur | Pages |
|---|---|---|---|
| Site public (Not Log) | `trouve-ta-formation.fr/securite-privee/` | Candidat, agent en exercice, dirigeant d'organisme | 9 gabarits |
| Espace organisme (Log) | `partenaires.trouve-ta-formation.fr/` | Organisme de formation référencé | 4 pages |
| Espace admin | `admin.trouve-ta-formation.fr/` | Éditeur (compte unique) | 7 pages + éditeur d'article |

## 2. À propos des fichiers de design

Les fichiers de `prototypes/` sont des **références de design réalisées en HTML** : ce sont des prototypes qui montrent l'apparence et le comportement attendus. Ce n'est **pas du code de production à copier**.

La mission consiste à **recréer ces designs dans l'environnement du codebase cible** (React, Vue, Next, Nuxt, etc.) en suivant ses conventions et ses bibliothèques. S'il n'existe pas encore de codebase, choisir le framework le plus adapté : un rendu serveur (Next.js ou Nuxt) est recommandé pour le site public, qui est fortement orienté SEO.

Format des prototypes :
- Chaque fichier `.dc.html` s'ouvre directement dans un navigateur (il charge `support.js`, le runtime du prototype, à ignorer en production).
- Le balisage est entre `<x-dc>` et `</x-dc>`. Tous les styles sont **inline**, donc chaque valeur exacte (couleur, taille, espacement) se lit directement sur l'élément.
- La logique (données d'exemple, états, handlers) est dans `<script data-dc-script>`, sous la forme d'une classe `Component` avec `state` et `renderVals()`. Les trous `{{ nom }}` du template correspondent aux clés renvoyées par `renderVals()`.
- `<sc-for list="{{ x }}" as="y">` correspond à une boucle et `<sc-if value="{{ x }}">` à un rendu conditionnel.
- `style-hover="…"` décrit l'état `:hover`, et `style-focus="…"` l'état `:focus`.
- L'attribut `data-props` du `<script>` liste les **variantes d'état** du prototype (voir §7). Ce sont des leviers de revue, pas des réglages utilisateur.
- `data-screen-label` nomme chaque bloc : utilisez ces noms pour faire le lien avec les specs.

## 3. Fidélité

**Haute fidélité (hifi).** Couleurs, typographie, espacements, rayons, états de survol, textes et interactions sont définitifs. L'interface doit être reproduite au pixel près. Les textes sont validés, **ne pas les réécrire** : ils suivent `specs/copy/`.

Les exceptions, qui sont des gabarits volontaires, sont listées en §11.

## 4. Contenu du dossier

```
design_handoff_trouve_ta_formation/
├── README.md                 ← ce document (autosuffisant)
├── design_system/
│   ├── DESIGN_SYSTEM.md      ← fondations : ton, palette, typo, rayons, règles (à lire en premier)
│   ├── styles.css            ← point d'entrée (@import)
│   └── tokens/               ← colors, typography, spacing, radius, effects, fonts, base
├── prototypes/               ← 20 écrans HTML de référence + assets/logo-bicolore.png
└── specs/
    ├── Referentiel_Titres_Securite_Privee.md   ← liste fermée des 13 titres (source unique)
    ├── copy/                 ← textes définitifs par page
    └── ux/                   ← spécifications fonctionnelles par page
```

**Ordre de priorité en cas de conflit :** d'abord le prototype pour tout ce qui est visuel et pour les interactions, ensuite `specs/ux/` pour les règles métier, enfin `specs/copy/` pour les textes. Les prototypes intègrent des arbitrages postérieurs aux specs, listés en §9.

## 5. Design tokens

Les tokens CSS complets sont dans `design_system/tokens/`. Voici les valeurs relevées dans les prototypes.

### 5.1 Couleurs

| Rôle | Hex | Usage |
|---|---|---|
| Encre | `#0B0B0B` | Texte principal, boutons primaires, blocs noirs, nav admin |
| Blanc | `#FFFFFF` | Surfaces de contenu (cartes, panneaux) |
| **Brique (accent unique)** | `#A83B2A` | Numéros, sur-titres, liens, CTA d'ajout, badges de compteur, erreurs |
| Brique sur noir | `#E19D8B` | Sur-titres et liens sur fond `#0B0B0B` |
| Brique 050 | `#FAF0ED` | Fond d'encart « en attente » (bordure `#E2B6AC`) |
| Crème (site public) | `#F7F5F1` | Fond de page public, fonds de champs et de sous-panneaux |
| Crème chaud (espaces Log/Admin) | `#F2EFE9` | Fond de page des espaces connectés, survol de nav |
| Survol ligne | `#FBFAF7` | Survol d'une ligne de tableau |
| Filet | `#E7E3DD` | Bordure 1px par défaut (cartes, sections) |
| Filet champ | `#E2DDD6` / `#D6D0C9` | Bordure de bouton secondaire / de champ de formulaire |
| Filet léger | `#F0ECE6` | Séparateur de lignes de tableau |
| Filet fort | `#C7C1BC` | Bordure pointillée des hachures, boutons désactivés |
| Encre 900 | `#3C3A37` | Texte courant secondaire |
| Encre 800 | `#45423E` / `#4C4946` | Liens de nav public / texte d'accompagnement |
| Encre 600 | `#6B6560` | Aide et notes |
| Encre 500 | `#7B746E` | Sur-titres mono, métadonnées |
| Encre 400 | `#8D8681` / `#A39C96` | Placeholder / statut inactif (brouillon) |
| Sur noir : texte | `#D0CAC5` | Texte secondaire sur `#0B0B0B` |
| Sur noir : filet / survol | `#2A2626` | Filets, avatar, survol de nav sur noir |
| Sur noir : carte | `#1A1818` | Carte à l'intérieur d'un bloc noir |
| Désactivé (fond / texte) | `#E7E3DD` / `#7B746E` | Bouton primaire désactivé (Paramètres) |

Il n'y a **aucune couleur sémantique** (pas de vert ni d'orange). Le succès s'exprime par un point noir de 7px suivi d'un texte. L'erreur s'exprime par un texte `#A83B2A` en 700.

### 5.2 Typographie

- **Plus Jakarta Sans** 400/500/600/700/800 : tout le texte.
- **IBM Plex Mono** 400/500 : sur-titres, numéros (`01`), compteurs, dates, slugs, URL, codes.
- Chargement : `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap`
- `body` : `-webkit-font-smoothing: antialiased`.

| Style | Valeurs |
|---|---|
| H1 site public (hero) | `clamp(32px,4.4vw,54px)` / 1.06 / −0.03em / 700 / `text-wrap: balance` |
| H1 espaces Log/Admin | `clamp(34px,4.6vw,60px)` / 0.98 / −0.045em / 800 |
| H2 section publique | `clamp(25px,3vw,34px)` / 1.1 / −0.025em / 700, `max-width: 22ch` fréquent |
| H2 carte Log/Admin | `24px` / 1.15 / −0.025em / 800 |
| H2 sous-section | `clamp(22px,2.4vw,28px)` / 1.15 / −0.02em / 700 |
| H2 groupe (Référentiel) | `18px` / −0.015em / 800 |
| Corps éditorial | `17px` / 1.75 |
| Corps carte | `14.5px` / 1.65 |
| Chapô hero | `16.5px` / 1.6, couleur `#4C4946`, `max-width: 620px` |
| UI courante | 13.5–15px ; boutons 14px / 700 (600 sur le site public) |
| Sur-titre mono | 10–11px, `letter-spacing: 0.1–0.14em`, `text-transform: uppercase`, couleur `#7B746E` ou `#A83B2A` |
| Compteur mono (KPI) | 34px / −0.04em (en-tête) ; `clamp(64px,8vw,104px)` / 0.85 / −0.05em (Dashboard admin) |
| En-tête de tableau | Mono 10px / 0.1em / uppercase / 500 / `#7B746E` |

### 5.3 Rayons

`999px` pour toutes les pilules (boutons, nav, chips, champs de recherche, badges) · `99px` pour les pastilles et points ronds · `9px` · `12px` · `14px` pour les champs de formulaire · `16px` pour les sous-panneaux · `18px` pour une carte publique ou un état vide · `20px` pour une ligne de réglage · `22px` pour une carte de demande · `24px` pour la barre de filtres collante · `26px` pour le grand bloc noir public · `28px` pour une section de carte Log/Admin.

### 5.4 Ombres (liste exhaustive)

- `0 24px 60px -24px rgba(11,11,11,0.22)` : méga-menu, modales.
- `0 10px 24px -20px rgba(11,11,11,0.35)` : barre de filtres ou d'onglets collante (admin).
- `0 18px 40px -18px rgba(11,11,11,0.6)` : toast.

Il n'y a aucune autre ombre : la séparation se fait par les filets.

### 5.5 Textures

- **Hachures** (emplacement d'image, état vide) : `background-image: repeating-linear-gradient(135deg,#F2EFE9 0 7px,#FFFFFF 7px 14px); border:1.5px dashed #C7C1BC`, avec au centre une étiquette blanche en rayon 8–12px.
- **Rayons du hero** (accueil uniquement) : `radial-gradient(62% 80% at 50% -12%, #FFFFFF 0%, rgba(255,255,255,0) 72%), repeating-conic-gradient(from 178deg at 50% -18%, rgba(11,11,11,0.05) 0deg 0.55deg, rgba(11,11,11,0) 0.55deg 3deg)`.

### 5.6 Mouvement

Une transition unique : `140ms ease` sur `background`, `border-color` et `color`. Une carte publique cliquable a en plus `translateY(-2px)` et un filet qui passe au noir. Il n'y a pas d'animation d'entrée ni de changement d'échelle.

### 5.7 Layout

- Site public : conteneur `max-width:1240px`, gouttière `28px`. Hero à 900px, FAQ à 880px. Rythme vertical de 88px par section. Header collant `rgba(247,245,241,0.88)` avec `backdrop-filter: blur(12px)`.
- Espaces Log/Admin : conteneur `max-width:1320px`, padding de page `14px clamp(12px,2vw,24px) 48–64px`, pile verticale `gap:14px`. Les pages Paramètres ont une colonne de contenu à `max-width:880px`.
- Grilles : `repeat(auto-fit, minmax(min(100%,Npx),1fr))` avec N = 220/240/260/290/340 selon la densité. Les grilles de titres sont fixes (3 ou 4 colonnes).
- Tout est fluide : utiliser `clamp()` pour les paddings (`clamp(14px,2vw,22px)` pour une carte liste, `clamp(22px,3vw,34px)` pour une carte de section) et `flex-wrap` pour les rangées d'actions.

## 6. Composants récurrents

### 6.1 Navigation admin (identique sur les 7 pages admin)

- `header` collant (`top:14px; z-index:30`), fond `#0B0B0B`, `border-radius:999px`, `padding:8px 8px 8px 20px`, flex wrap `gap:10px 18px`.
- Logo `assets/logo-bicolore.png` en `height:22px`, inversé en blanc (`filter:brightness(0) invert(1)`), suivi du badge « Admin » (fond `#A83B2A`, mono 10px uppercase 0.12em, padding `4px 10px`).
- Liens dans l'ordre : Tableau de bord · Fichier client · Référentiel des titres · Blog · Analytics · Paramètres.
  - Lien inactif : `#D0CAC5`, 13.5px / 600, padding `9px 12px`, survol fond `#2A2626` et texte blanc.
  - Lien actif : fond `#FFFFFF`, texte `#0B0B0B` / 700.
- Le lien « Référentiel des titres » porte un badge brique qui affiche le nombre de demandes en attente.
- Avatar « ER » à droite : 42px, fond `#2A2626`, mono 12px, `title="Erwan · Administrateur"`.
- La nav défile horizontalement si elle manque de place (`overflow-x:auto; scrollbar-width:none`).

### 6.2 Navigation organisme

Même géométrie que la nav admin, mais sur fond clair : `rgba(255,255,255,0.92)` avec blur 12px et filet `#E7E3DD`. Le lien actif est noir avec texte blanc. Liens : Tableau de bord · Ma fiche · Mes formations (avec compteur mono dans une pastille `#F2EFE9`) · Paramètres.

### 6.3 En-tête de page Log/Admin

Sur-titre mono (« Espace admin · … ») au-dessus du H1 ; à droite, des KPI mono de 34px suivis d'un libellé 15px / 700. Padding `clamp(18px,3vw,36px) clamp(6px,1vw,12px) clamp(4px,1vw,10px)`.

### 6.4 Barre de filtres / onglets collante (admin)

Carte blanche, rayon 24px, padding 10–12px, collante à `top:84px`, avec l'ombre 5.4 n°2. Elle contient :
- **Recherche pilule** : fond `#F7F5F1`, filet `#E2DDD6`, loupe dessinée en CSS (cercle de 11px, bordure 1.5px `#8D8681`), input 14.5px.
- **Segmented control** : conteneur `#F7F5F1` avec padding 3px ; option active noire à texte blanc, option inactive transparente en `#3C3A37`.
- **CTA d'ajout** : brique `#A83B2A`, padding `12px 20px`, avec un « + » de 18px / 500. Il passe en `#0B0B0B` au survol.

### 6.5 Boutons

| Type | Style |
|---|---|
| Primaire | fond `#0B0B0B`, blanc, 14px / 700, padding `11–12px 18–20px`, pilule, survol `#A83B2A` |
| Accent | fond `#A83B2A`, survol `#0B0B0B` |
| Secondaire | fond blanc ou transparent, filet `#E2DDD6`/`#D6D0C9`, texte noir, survol filet noir |
| Lien d'action | transparent, sans bordure, 13.5px / 700, brique puis noir au survol |
| Désactivé | fond `#C7C1BC` (ou `#E7E3DD` avec texte `#7B746E`), `cursor:not-allowed` |

### 6.6 Badges de statut

Pilule avec un point de 7px à gauche, 12.5px / 700, padding `4px 11px 4px 9px`.
- Actif / publié / accepté : bordure pleine 1.5px `#0B0B0B` et point `#A83B2A`.
- Brouillon / refusé / inactif : bordure pointillée 1.5px `#A39C96`, fond `#F7F5F1` et point `#A39C96`.

### 6.7 Champs de formulaire

`font-size:15px; border:1px solid #D6D0C9 (ou #E7E3DD); border-radius:14px; padding:11–13px 14–15px; background:#FFF`, focus avec bordure `#0B0B0B`. Libellé au-dessus : 13–13.5px / 700, `gap:7px`. Aide sous le champ : 12.5–13px en `#6B6560`. Erreur : 13px / 700 en `#A83B2A`.

### 6.8 Édition inline (patron transversal)

Une valeur sensible n'est jamais éditable directement. La ligne affiche la valeur et un bouton « Modifier ». Au clic, un sous-panneau `#F7F5F1` (rayon 16–20px) s'ouvre avec les champs, un message sur les conséquences, et les boutons Enregistrer et Annuler. Ce patron sert pour l'email et le mot de passe (Paramètres), les titres (Référentiel) et l'arbitrage des demandes.

### 6.9 Toast

Fixé en bas au centre (`bottom:24px`), fond `#0B0B0B`, texte blanc 14px, rayon 18px, `max-width:min(92vw,560px)`, `role="status"`. Il disparaît après environ 4,2 s.

### 6.10 Modales (Fichier client, Fiche client, Éditeur)

Voile sombre, panneau blanc de rayon 26–28px avec l'ombre 5.4 n°1. Les actions irréversibles (suppression) exigent de saisir le nom exact de l'organisme avant de pouvoir valider.

## 7. Écrans

Pour chaque écran : fichier prototype, route cible, spec, blocs (`data-screen-label`) et variantes d'état (`data-props`). Le détail pixel est dans le prototype, les règles métier sont dans la spec.

### 7.1 Site public

| Écran | Prototype | Route | Specs |
|---|---|---|---|
| Accueil verticale | `Accueil Securite Privee mix.dc.html` | `/securite-privee/` | ux + copy Page_Accueil |
| Catalogue organismes | `Catalogue Organismes.dc.html` | `/securite-privee/organismes/` | ux + copy Page_Catalogue |
| Fiche organisme | `Fiche Organisme v2.dc.html` | `/securite-privee/organismes/[slug]/` | ux + copy Fiche_Organisme |
| Page pilier titre (13 pages, 2 gabarits) | `Page Pilier Titre v3.dc.html` | `/securite-privee/[titre]/` | ux Page_Pilier + copy Pages_Piliers |
| Page département | `Page Departement.dc.html` | `/securite-privee/[departement]/` | ux + copy Pages_Geographiques |
| Page démarche CNAPS | `Page Demarche CNAPS.dc.html` | `/securite-privee/demarches/[demarche]/` | ux + copy Demarches_CNAPS |
| Formulaire d'affinage (modale) | `Formulaire Affinage.dc.html` | ouvert depuis le bloc 4 de l'accueil | ux + copy Formulaire_Affinage |
| Landing organismes (B2B) | `Landing Organismes v3.dc.html` | `/securite-privee/referencer-mon-organisme/` | ux + copy Landing_Organismes |

**Blocs et variantes :**
- **Accueil** : Hero · Grille par titre · Formulaire d'affinage · Entrée géographique · Démarches CNAPS · Échantillon d'organismes · Comment ça marche · Réassurance · Corps éditorial · FAQ · Derniers articles · Bandeau B2B · Footer. Variantes : `compteurs` (compteurs et échantillon affichés une fois le seuil d'organismes atteint), `reassurance`, `ctaPrimaire` (3 libellés à arbitrer).
- **Catalogue** : En-tête · Chapô · Recherche, tri et carte · Listing · Filtres · Maillage titres · Maillage géographique · Corps éditorial · FAQ · Footer. Variantes : `etat` (Résultats / Résultat unique / Zéro résultat / Chargement), `compteurs` (compteurs et pagination au-dessus du seuil), `bande`.
- **Fiche organisme** : En-tête · Barre d'actions collante · Corps · Colonne pratique · Autres organismes · Footer. Variantes : `etat` (complète / sans formation / sans présentation / mono-site), `noteGoogle`, `mentionAdresses`.
- **Page pilier** : En-tête · Faits clés · Table des matières · Contenu réglementaire · Colonne latérale · Accroche formulaire · Footer. Variantes : `titre` (gabarit A « titre d'entrée » avec SSIAP 1, gabarit B « MAC/recyclage » avec MAC APS), `compteurOrganismes`, `blocOrganismes` (off : texte de remplacement).
- **Département** : En-tête · Chapô · Sommaire · Titres préparés · Organismes · Villes et maillages · Colonne latérale · Footer. Variantes : `compteurs`, `voisinsPublies` (off : repli vers le catalogue).
- **Démarche CNAPS** : En-tête · Encadré de synthèse · Table des matières · Corps · Colonne latérale · Footer. Variantes : `dateVerif` (date de fraîcheur affichée), `bandeauDracar`.
- **Formulaire d'affinage** : questionnaire pas à pas, puis résultat (titre recommandé, encart démarche, organismes, relâchement, titres alternatifs). Variantes : `etatDepart` (8 états, dont Carte expirée, Renouvellement ASA, Aucun organisme), `seuilRelachement` (Zéro résultat / Moins de trois).
- **Landing organismes** : Hero · Vue candidat · Aperçu de fiche annoté · Ce que vous obtenez · Honnêteté sur le lancement · Comment ça marche · Pourquoi c'est gratuit · FAQ B2B · CTA final · Footer. Variantes : `seuilAtteint` (le bloc « honnêteté » devient un bloc « preuve »), `nbOrganismes`, `fonctionnalitePayanteNommee`, `ligneSecours`.

Le header et le footer publics sont identiques sur toutes les pages publiques : nav pilule blanche centrée (« Les formations ▾ » ouvre le méga-menu · Organismes · Démarches CNAPS · Blog), footer `#0B0B0B` avec colonnes en sur-titres `#E19D8B`. Dans les prototypes, les liens internes publics sont des ancres `#…` : les brancher sur les routes ci-dessus.

### 7.2 Espace organisme (`partenaires.`)

| Écran | Prototype | Route | Variantes |
|---|---|---|---|
| Tableau de bord | `Dashboard Organisme v2.dc.html` | `/dashboard` | `etat` : Non publiée / Basique sans formation / Basique avec formations / Correct / Optimal / Recul |
| Ma fiche | `Ma Fiche.dc.html` | `/ma-fiche` | `lieux` (Multi-sites / Mono-site), `plafond` de la présentation (800 / 1500 / 2500 caractères) |
| Mes formations | `Mes Formations.dc.html` | `/formations` | `etat` (Trois formations / Aucune), `lieux`, `synonymes` (recherche par synonymes dans la modale d'ajout) |
| Paramètres | `Parametres.dc.html` | `/parametres` | — |

- **Dashboard** : statut de publication, jauge et palier de complétude (Basique / Correct / Optimal), aperçu « ce que voit un candidat », checklist de relance, accès rapides.
- **Ma fiche** : sommaire puis 7 sections numérotées (Identité avec résultat SIRET · Logo · Agrément et certifications · Coordonnées et siège · Lieux additionnels, avec confirmation avant retrait · Informations pratiques · Présentation avec compteur de caractères).
- **Mes formations** : grille de formations, modale d'ajout par lot depuis le référentiel fermé (groupé par catégorie, avec un lien « Faire une demande » si le titre est absent), panneau de détail, confirmation de retrait, état vide.
- **Paramètres** : 01 Connexion (email avec validation différée, mot de passe) · 02 Informations du compte · 03 Zone dangereuse (suppression confirmée en saisissant le nom de l'organisme, puis écran noir « Votre compte a été supprimé »).

### 7.3 Espace admin (`admin.`)

| Écran | Prototype | Route | Variantes |
|---|---|---|---|
| Tableau de bord | `Dashboard Admin.dc.html` | `/dashboard` | `demandes`, `basique`, `correct`, `optimal`, `sansFormation`, `recoupement`, `seuilAlerte` |
| Fichier client | `Fichier Client.dc.html` | `/organismes` | `filtreInitial` (arrivée depuis le Dashboard), `connexionSuspendu` |
| Fiche client | `Fiche Client.dc.html` | `/organismes/[id]` | `statut` (Actif / Suspendu), `sansFormation`, `presentationVide`, `connexionSuspendu` |
| Référentiel des titres | `Referentiel Titres.dc.html` | `/referentiel` (onglet `#demandes`) | `demandes` (0–7), `historique` |
| Blog | `Blog Admin.dc.html` | `/blog` | — |
| Éditeur d'article | `Editeur Article.dc.html` | `/blog/[id]`, `/blog/nouveau` | `depublication`, `auteurs` (Plusieurs profils / Profil unique) |
| Analytics | `Analytics Admin.dc.html` | `/analytics` | — |
| Paramètres | `Parametres Admin.dc.html` | `/parametres` | `etat2fa` (active / a-configurer) |

**Dashboard admin.** H1 « Ce qui a besoin de vous ». Les blocs sont 01 Vue d'ensemble (répartition des fiches par palier) · 02 Demandes de titres (bloc noir pleine largeur avec un grand compteur mono et les 3 demandes les plus anciennes ; badge d'alerte au-delà de `seuilAlerte`) · 03 Fiches en noindex · 04 Fiches sans formation. Chaque file renvoie vers la page filtrée correspondante.

**Fichier client.** Recherche, filtres, table des organismes avec sélection multiple et actions groupées (rappel par email pré-rédigé, suspension, suppression). Chaque action ouvre une modale dédiée.

**Fiche client.** Lecture seule, en 7 sections : En-tête, Score et indexation, Identité et coordonnées, Présentation, Formations déclarées, Informations de compte, Historique. Une barre d'actions de modération est disponible (Rappel · Suspendre/Réactiver · Supprimer, en modales).

**Référentiel des titres.**
- Onglet **Liste** : 13 titres groupés en 5 catégories (numéro mono brique, H2 18px / 800, filet noir 1px sous l'en-tête de groupe). Chaque ligne affiche le libellé court (16px / 800), le libellé long (13px `#6B6560`), l'URL mono `/securite-privee/[slug]/`, le compteur d'organismes et un bouton Modifier.
- **Aucune suppression possible.** L'édition inline porte sur l'intitulé et la catégorie. Le slug est conservé. Un message d'impact s'affiche si la valeur change (« Répercuté sur les offres de N organismes »).
- **Ajouter un titre** : panneau à bordure noire 1.5px, avec l'aperçu d'URL, le blocage des slugs réservés (`organismes`, `demarches`, `blog`, `recherche`, `formulaire`) ou déjà pris, et une alerte « Titres proches ».
- Onglet **Demandes** (badge = même donnée que le Dashboard) : les demandes sont classées de la plus ancienne à la plus récente. Chaque carte affiche l'intitulé saisi entre guillemets, l'organisme (lien vers la Fiche client), la date et l'ancienneté (en brique à partir de 7 jours).
- **Accepter** ouvre une relecture obligatoire : intitulé modifiable, catégorie obligatoire, aperçu du slug, et trois rappels (disponible pour tous · aucune offre rattachée automatiquement · email envoyé à l'adresse de connexion). **Refuser** demande une confirmation. Chaque issue envoie l'email pré-rédigé et affiche un toast.
- Historique des demandes traitées : optionnel (point ouvert).

**Blog.** Table des articles triée par dernière modification (tri inversible). Filtres : titre, statut (segmented Tous / Brouillons / Publiés), catégorie. Le CTA « Nouvel article » ouvre l'éditeur.

**Éditeur d'article.**
- Barre de publication collante, puis les métadonnées : titre, titre SEO, slug, image de couverture et meta description plafonnée à **155 caractères**.
- Champs automatiques non modifiables : dates de publication et de mise à jour, temps de lecture.
- Corps en texte riche : paragraphes, H2/H3/H4, gras, listes, tableaux et images.
  - H3 exige un H2 existant, et H4 exige un H3.
  - L'**alt est obligatoire** avant d'insérer une image.
  - Liens : internes (choisis dans une liste) ou externes (saisis).
  - 3 types d'encadrés, avec un avertissement au-delà de 3 encadrés (non bloquant).
- Panneau « Repères » : nombre de mots comparé au seuil de 1000, et table des matières générée depuis les H2/H3.
- Fin d'article : résumé, « À retenir », auteur, formation liée, CTA et articles liés.

**Analytics.** Période de 7, 30 ou 90 jours. Onglets Général / Blog / Organismes, plus une répartition des CTA. Un lien d'article ouvre l'éditeur, un lien d'organisme ouvre la Fiche client.

**Paramètres admin.**
- **01 Connexion.** Le changement d'email est différé : un lien de confirmation part vers la nouvelle adresse et l'ancienne reste active. Le changement de mot de passe exige l'actuel, au moins 12 caractères et un mot de passe différent de l'actuel. Un email de notification est **toujours** envoyé.
- **02 2FA, obligatoire.** Seule l'application TOTP est proposée, sans SMS, et le 2FA ne peut pas être désactivé.
  - État actif : lignes « Méthode » (Changer d'appareil) et « Codes de récupération », avec le nombre restant, en brique s'il en reste 3 ou moins.
  - Configuration : QR code, clé manuelle mono et code à 6 chiffres. L'ancienne configuration reste active jusqu'à la vérification.
  - Codes de récupération : 10 codes au format `XXXX-XXXX`, **affichés une seule fois**. Copier et Télécharger (.txt) sont disponibles. « Terminer » reste désactivé tant que la case « J'ai conservé ces codes » n'est pas cochée.
  - État `a-configurer` : un bandeau noir bloquant s'affiche en haut et il n'y a pas de bouton Annuler.

## 8. Interactions et comportements transverses

- **Survols** : voir §5.6 et §6.5. Il n'y a pas d'état `:active` spécifique.
- **Validation de formulaire** : les boutons de validation restent désactivés tant que les conditions ne sont pas remplies. Les messages d'erreur s'affichent sous le champ, en brique 700.
- **Emails automatiques pré-rédigés**, un template fixe par issue et sans étape d'édition : rappel (Fichier client), acceptation et refus de demande de titre, notification de changement de mot de passe (admin), lien de confirmation de changement d'email. Les textes restent à rédiger.
- **Deep links** : Dashboard admin → `Referentiel Titres#demandes` ; Dashboard admin → Fichier client pré-filtré (noindex, sans formation) ; Analytics → Éditeur et Fiche client.
- **Responsive** : tout est en flex-wrap ou en grilles auto-fit. Les tableaux larges sont dans un conteneur `overflow-x:auto` avec `min-width` (860px pour le blog). Les navs pilules défilent horizontalement.
- **Typographie française** : espace insécable avant `: ? ! ;`, guillemets « », point médian `·` comme séparateur. Aucun emoji ni icône. Les seuls glyphes sont → + · ▾ ↑ ↓.
- **Données de démo** : la date de référence des prototypes est le 23–24 sept. 2026. Les dates relatives s'écrivent « Aujourd'hui · 10:12 », « Hier · … » puis « 18 sept. 2026 ».

## 9. Arbitrages postérieurs aux specs (font foi)

- Le 2FA admin est obligatoire, en TOTP uniquement. Le mot de passe admin fait au moins 12 caractères, contre 10 côté organisme.
- Référentiel : le slug n'est jamais modifié après création. Un intitulé exactement identique à un titre existant est bloqué.
- Éditeur : l'alt d'image est obligatoire, la hiérarchie H2 > H3 > H4 est imposée, la meta description est limitée à 155 caractères, l'avertissement au-delà de 3 encadrés n'est pas bloquant, et les dates et le temps de lecture sont calculés automatiquement.
- Le Blog est accessible depuis toutes les navs admin.

## 10. State management (par écran admin/Log)

- **Référentiel** : `titles[]` (id, court, long, slug, cat, n, isNew), `q`, `editId` et brouillon `{court, cat}`, `adding` et brouillon, `decisions{requestId: 'Acceptée'|'Refusée'}`, `openReq{id, mode}` et brouillon, `toast`. Les demandes en attente viennent de la même source que le Dashboard.
- **Paramètres (Log et Admin)** : `emailMode: idle|edit|pending`, `pendingEmail`, `pwdMode: idle|edit`, `pw{cur,next,conf}`. En admin s'ajoutent `tfaMode: idle|setup|regen|codes`, `otp`, `codes[]` (en mémoire uniquement, jamais renvoyés par l'API après fermeture) et `codesLeft`.
- **Blog** : `q`, `statut`, `cat` et `asc` pour le tri. **Éditeur** : le document (blocs), les métadonnées, les modales (image, publication) et les compteurs dérivés (mots, table des matières).
- **Fichier client** : filtres, sélection multiple, modale ouverte. **Dashboard organisme** : palier dérivé des champs remplis (voir `specs/ux/UX_Dashboard_Organisme.md`).

## 11. Gabarits volontaires et points ouverts

- **Images** : aucune photo n'est fournie. Tous les visuels sont des emplacements hachurés, étiquetés en mono. Le QR code du 2FA est aussi un emplacement : il doit être généré en production.
- **Données** : les organismes, compteurs, emails, auteurs, catégories du blog et adresses sont des données de démo à remplacer.
- **Textes `[À VÉRIFIER]`** dans le référentiel (durées, RNCP du TFP ASA, intitulé du MAC cynophile) : ne pas les inventer.
- **Points ouverts** :
  - dépublication d'article (variante `depublication`) ;
  - bascule entre plusieurs profils d'auteur et un profil unique ;
  - libellé du CTA d'accueil ;
  - historique des demandes refusées ;
  - connexion d'un compte suspendu (bloquée ou avec message de suspension) ;
  - durée de session admin ;
  - procédure en cas de perte des codes de récupération (hors interface) ;
  - gestion du contenu des pages piliers (hors V1).

## 12. Assets

- `prototypes/assets/logo-bicolore.png` : seul asset de marque, en PNG uniquement. Hauteurs : 22px (nav admin), 24px (nav organisme), 27px (header public), 30px (footer). Sur fond noir, il s'inverse avec `filter: brightness(0) invert(1)`.
- Polices : Google Fonts (voir §5.2).
- Icônes : aucune (voir `design_system/DESIGN_SYSTEM.md`, section Iconography).
