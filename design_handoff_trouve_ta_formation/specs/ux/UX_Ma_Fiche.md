# Spécification UX — Ma fiche

**Trouve ta formation — Verticale sécurité privée**
`partenaires.trouve-ta-formation.fr/ma-fiche`
Version 1.0 — 31 août 2026

---

## 1. Rôle de la page

Espace de gestion permanent de l'identité, des coordonnées et des lieux de l'organisme — hors formations (page dédiée) et hors compte (Paramètres).

**Distinction avec l'onboarding** — l'onboarding est un parcours guidé sous contrainte d'abandon, découpé en étapes courtes avec sauvegarde automatique et sortie possible à tout moment. Cette page est un espace de gestion consulté à froid, une fois la fiche publiée : la structure diffère en conséquence, sections indépendantes plutôt que flux linéaire.

### Ce que cette page alimente

Une bonne partie du score de complétude défini dans la spec Dashboard : le palier Optimal dépend directement de la plupart des champs gérés ici (logo, SIRET, agrément CNAPS, Qualiopi, horaires, accessibilité, site web). Le palier Correct dépend en partie de la présentation.

Les lieux additionnels déclarés ici alimentent aussi le rattachement des formations dans Mes formations — cette page doit donc logiquement être renseignée avant, ou en parallèle.

---

## 2. Structure de la page

**Sections empilées en scroll continu**, chacune une carte indépendante avec son propre bouton d'enregistrement. Pas d'accordéon, pas d'onglets — six sections ne justifient pas une navigation supplémentaire.

| # | Section | Champs |
|---|---|---|
| 1 | Identité | Raison sociale, SIRET, numéro de déclaration d'activité, année de création |
| 2 | Logo | Upload, aperçu, remplacement |
| 3 | Agrément et certifications | Numéro d'agrément CNAPS, Qualiopi |
| 4 | Coordonnées et siège | Adresse du siège, téléphone, email de contact public, site web, horaires d'accueil |
| 5 | Lieux additionnels | Liste des lieux hors siège, ajout et suppression inline |
| 6 | Informations pratiques | Accessibilité PMR, langues d'enseignement |
| 7 | Présentation | Texte libre plafonné |

**Sauvegarde par section, pas d'auto-save silencieux.** Différence assumée avec l'onboarding : là-bas, l'auto-save protège un parcours long et anxiogène. Ici, l'organisme revient modifier un champ ponctuel — un bouton « Enregistrer » explicite par bloc donne un contrôle clair et une confirmation immédiate (message de succès bref, sans rechargement de page), sans mécanisme invisible qui inquiète plus qu'il ne rassure.

**Lien « Voir ma fiche publique »** en haut de page, cohérent avec le même lien sur le Dashboard — l'organisme doit pouvoir vérifier en un clic le rendu de ses modifications.

---

## 3. Détail des sections

### 1. Identité

Raison sociale, SIRET, numéro de déclaration d'activité, année de création.

**Pré-remplissage depuis le SIRET.** Un lien « Pré-remplir depuis le SIRET » reprend le mécanisme déjà en place à l'onboarding : il complète automatiquement la raison sociale et l'adresse du siège (section 4). Utile pour un organisme qui a laissé le SIRET vide lors de l'inscription et le renseigne après coup.

### 2. Logo

Zone de dépôt avec glisser-déposer et sélection de fichier, aperçu du logo actuel à gauche.

**Formats acceptés en entrée : JPG ou PNG, 2 Mo maximum.** La conversion en WebP se fait côté serveur, cohérent avec la règle technique déjà posée sur les fiches publiques — l'organisme ne doit pas avoir à connaître ce format en amont.

**Recommandation affichée : format carré.** Le logo apparaît dans un espace contraint sur la fiche publique et sur les cartes du catalogue ; un format libre produit des recadrages imprévisibles.

**Cas sans logo** — aperçu par défaut neutre (icône générique), jamais un cadre vide sans explication.

### 3. Agrément et certifications

Numéro d'agrément CNAPS, statut Qualiopi (certifié ou non, avec numéro si certifié).

**Note contextuelle affichée dans le bloc** — rappel que l'agrément CNAPS est le signal de confiance le plus fort de la fiche publique, cohérent avec la spec Fiche organisme. Non bloquant, mais l'absence est explicitement signalée côté public (« agrément non renseigné ») : cette page doit donc donner à l'organisme l'occasion de corriger ce manque à tout moment, pas seulement à l'inscription.

### 4. Coordonnées et siège

Adresse du siège, téléphone, email de contact public, site web, horaires d'accueil.

**Distinction email de contact public / email du compte**, rappelée ici comme à l'onboarding — un champ d'aide courte sous le champ email rappelle la différence, pour éviter qu'un organisme publie par erreur l'adresse de connexion à son espace.

### 5. Lieux additionnels

Liste inline des lieux hors siège, chacun avec un nom optionnel (ex. « Antenne Créteil ») et une adresse complète. Ajout et suppression directs, sans sous-page ni modale dédiée — deux champs par lieu ne justifient pas un flux séparé.

**Conséquence à afficher à la suppression d'un lieu** — si des formations dans Mes formations sont rattachées à ce lieu, le prévenir avant suppression plutôt que de casser silencieusement un rattachement existant. Le lieu doit être détaché des formations concernées, qui reviennent alors au siège par défaut.

**Cas mono-site** — la section reste visible avec son bouton d'ajout, jamais masquée : un organisme mono-site aujourd'hui peut ouvrir une antenne demain, et la fonctionnalité doit rester découvrable.

### 6. Informations pratiques

Accessibilité PMR (oui/non), langues d'enseignement.

**Pourquoi un bloc séparé plutôt qu'un rattachement à Coordonnées** — ce sont des informations pratiques transversales à la fiche entière, pas propres au siège. Les regrouper avec l'adresse et le téléphone créerait une confusion de nature entre coordonnées de contact et caractéristiques de service.

### 7. Présentation

Texte libre, plafonné, avec compteur de caractères affiché en temps réel.

**Plafond à chiffrer** — reste un point ouvert dans la spec Fiche organisme, réaffirmé ici puisque c'est la page où le plafond doit être appliqué concrètement dans l'interface.

**Cas texte vide** — aucun texte généré automatiquement en remplacement. Sur la fiche publique, le bloc disparaît simplement (règle déjà actée).

---

## 4. Ce qu'il ne faut pas faire

- Fusionner toutes les sections en un seul formulaire avec un unique bouton d'enregistrement — perd la lisibilité et le contrôle section par section
- Masquer la section Lieux additionnels pour un organisme mono-site
- Supprimer silencieusement le rattachement d'une formation quand son lieu est retiré
- Afficher un pourcentage de complétude sur cette page — cette logique reste centralisée sur le Dashboard, pour éviter deux sources de vérité sur le même score
- Bloquer l'enregistrement d'une section sur un champ non renseigné, quel qu'il soit — aucun champ de cette page n'est obligatoire au-delà du minimum publiable déjà acquis à la publication
- Générer un texte de présentation automatique quand le champ est vide

---

## 5. Points ouverts

- **Chiffrer le plafond de la présentation libre** — point déjà ouvert dans la spec Fiche organisme, à trancher avant le développement de cette section.
- **Définir le format exact du message de confirmation** à l'enregistrement d'une section (toast, changement d'état du bouton, etc.) — détail de maquettage sans impact sur cette spécification.
- **Décider si le pré-remplissage par SIRET peut écraser des champs déjà modifiés manuellement**, ou seulement compléter des champs vides — à trancher pour éviter qu'un organisme perde une correction volontaire.

---

## 6. Documents liés

- **Note de cadrage** — modèle multi-sites, séparation des responsabilités
- **Architecture des pages** — environnement Log, inventaire des pages
- **UX Inscription organisme** — étapes 1 à 4 et 7 de l'onboarding, reprises ici en gestion permanente
- **UX Dashboard organisme** — score de complétude alimenté par cette page
- **UX Fiche organisme** — rendu public des champs gérés ici, règles techniques (WebP, badges)
- **UX Mes formations** — rattachement des formations aux lieux déclarés ici
- **À produire** — Paramètres
