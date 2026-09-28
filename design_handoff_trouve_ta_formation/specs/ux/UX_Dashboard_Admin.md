# Spécification UX — Dashboard admin

**Trouve ta formation — Verticale sécurité privée**
`admin.trouve-ta-formation.fr/dashboard`
Version 1.0 — 31 août 2026

---

## 1. Rôle de la page

Page d'atterrissage de l'espace admin, après connexion.

**Une seule fonction en V1** : dire à l'admin ce qui a besoin de son arbitrage maintenant, avec un accès direct à l'action. Pas de tableau de bord généraliste, pas d'historique ni de courbes de tendance — cette lecture-là appartient à Analytics (voir Architecture des pages). Le Dashboard répond à « qu'est-ce qui a besoin de moi maintenant ? », Analytics répond à « comment ça évolue dans le temps ? ». Le cloisonnement entre les deux pages est net et volontaire.

### Ce que cette page ne fait pas

L'inscription d'un organisme est automatique — aucune validation admin dans le funnel, la fiche est créée sans arbitrage. Le Dashboard n'a donc **aucune file d'attente liée à l'inscription**. Le seul pouvoir de modération de l'admin (bloquer ou supprimer un compte) est une action ponctuelle exercée depuis la Fiche client, pas un backlog à traiter — elle n'apparaît donc pas ici.

---

## 2. Ordre des blocs

| # | Bloc | Contenu | Fonction dominante |
|---|---|---|---|
| 1 | Vue d'ensemble chiffrée | Nombre total d'organismes inscrits, répartition par palier de complétude | Contexte |
| 2 | File — Demandes de titres en attente | Nombre de demandes non arbitrées | Action prioritaire |
| 3 | File — Fiches en `noindex` | Nombre de fiches au palier Basique | Alerte SEO |
| 4 | File — Fiches sans formation déclarée | Nombre de fiches invisibles dans les filtres du catalogue | Alerte visibilité |

**Principe directeur, repris du Dashboard organisme** : jamais un chiffre affiché sans action cliquable associée. Un compteur seul, sans lien vers l'endroit où agir, reproduit l'erreur déjà écartée côté organisme.

### 1. Vue d'ensemble chiffrée

Deux chiffres, sans plus :
- Nombre total d'organismes inscrits
- Répartition par palier (Basique / Correct / Optimal), reprenant les trois paliers déjà définis dans la spec Dashboard organisme

Ce bloc est un instantané, pas une série temporelle. Il donne l'échelle du système avant de présenter les files d'action — il ne se clique pas vers une action précise, à la différence des trois blocs suivants.

### 2. File — Demandes de titres en attente

Nombre de demandes d'ajout de titre non encore arbitrées, formulées par les organismes depuis *Mes formations*. Lien direct vers le Référentiel des titres, idéalement filtré sur les demandes en attente plutôt que vers la page générale.

**Pourquoi en premier parmi les files** — c'est la seule action qui bloque un tiers (l'organisme attend un arbitrage) et qui ne peut être traitée que par l'admin ; les deux files suivantes sont des constats sur l'état du catalogue, pas des demandes en attente de quelqu'un.

### 3. File — Fiches en `noindex`

Nombre de fiches restées au palier Basique, donc non indexées. Lien vers le Fichier client, filtré sur ce palier.

**Ce que ce bloc ne suppose pas** — l'admin n'a pas d'action directe pour faire progresser une fiche à la place de l'organisme (pas d'édition de contenu organisme prévue en V1). Le lien mène à la liste filtrée pour permettre, au cas par cas, un contact manuel hors plateforme si l'admin le juge utile — ce n'est pas une file qui se vide par un clic, mais un signal à surveiller.

### 4. File — Fiches sans formation déclarée

Nombre de fiches n'ayant déclaré aucune offre, donc absentes de tout filtre par titre du catalogue. Lien vers le Fichier client, filtré sur ce critère.

**Distinction avec le bloc 3** — une fiche peut être indexable (palier Correct ou Optimal) et malgré tout n'avoir déclaré ses formations que partiellement, ou une fiche récente peut être encore en dessous du palier Correct précisément parce qu'elle n'a rien déclaré. Les deux files se recoupent souvent sans être identiques ; les séparer évite de masquer l'un des deux signaux derrière l'autre.

---

## 3. Ce qu'il ne faut pas faire

- Faire apparaître une file ou un compteur lié à la validation des inscriptions — ce contrôle n'existe pas, l'inscription est automatique
- Faire remonter les comptes bloqués ou supprimés comme une file à traiter — c'est une action ponctuelle localisée sur la Fiche client, pas un backlog
- Introduire des courbes de tendance ou un historique — c'est le rôle d'Analytics, pas du Dashboard
- Afficher un compteur sans lien vers l'endroit où agir
- Dupliquer ici la logique de traitement des demandes de titres (l'arbitrage lui-même se fait sur le Référentiel des titres, pas sur le Dashboard)

---

## 4. Points ouverts

- **Seuil d'alerte visuelle** — à partir de combien de demandes de titres en attente (ou de fiches en `noindex`) le bloc doit-il se distinguer visuellement (couleur, badge) plutôt que rester un compteur neutre ? Sans historique de volume réel avant lancement, ce seuil est difficile à fixer a priori.
- **Fraîcheur des chiffres** — calcul à la demande (à chaque chargement de page) ou job périodique ? Un calcul à la demande est cohérent avec le principe de transparence déjà retenu ailleurs dans le projet, à confirmer selon la charge technique à l'échelle du volume d'organismes attendu.

---

## 5. Documents liés

- **Architecture des pages** — environnement Admin, inventaire des pages
- **UX Dashboard organisme** — paliers de complétude, principe « jamais un score sans action »
- **UX Mes formations** — origine des demandes d'ajout de titre
- **À produire** — Fichier client, Fiche client, Référentiel des titres, Blog admin, Analytics, Paramètres admin
