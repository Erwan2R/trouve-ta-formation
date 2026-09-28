# Spécification UX — Mes formations

**Trouve ta formation — Verticale sécurité privée**
`partenaires.trouve-ta-formation.fr/formations`
Version 1.0 — 31 août 2026

---

## 1. Rôle de la page

Espace de gestion permanent des formations déclarées par l'organisme — ajout, retrait, modification, à tout moment, indépendamment de l'onboarding.

**Distinction avec l'étape 5 de l'onboarding** — l'onboarding est un parcours guidé sous contrainte d'abandon, découpé pour ne pas décourager un dirigeant qui découvre le produit. Cette page est un espace de gestion durable, consulté à froid, sans la même pression de complétion immédiate. La structure diffère en conséquence : une liste de gestion permanente plutôt qu'un flux linéaire.

### Enjeu

Chaque formation déclarée est un objet **Offre** (organisme × titre) qui doit exister comme ligne identifiée en base dès la V1, avec un identifiant et un slug stables — condition posée dans la spec Fiche organisme pour permettre le futur module de réservation sans migration du modèle de données.

C'est aussi la page qui conditionne directement le palier « Correct » du score de complétude défini dans la spec Dashboard : sans formation déclarée, une fiche ne peut pas dépasser le palier Basique et reste en `noindex`.

---

## 2. Séparation des responsabilités

Règle actée dans la note de cadrage, rappelée ici parce que c'est la page où l'erreur serait la plus facile à commettre.

| Contenu | Détenteur | Où il vit |
|---|---|---|
| Intitulé officiel, durée réglementaire, programme, prérequis, débouchés, cadre CNAPS | Éditeur | Page pilier du titre |
| Prix ou fourchette, durée réelle, rythme, lieux, financements acceptés | Organisme | Cette page |

**L'organisme ne saisit jamais l'intitulé d'une formation.** Il sélectionne dans le référentiel fermé — aucune saisie libre, sans quoi les filtres du catalogue deviennent inopérants.

---

## 3. Structure de la page

**Liste de gestion permanente + modale d'ajout.**

| # | Bloc | Fonction dominante |
|---|---|---|
| 1 | En-tête — compteur de formations déclarées | Contexte |
| 2 | Bouton « Ajouter une formation » | Action principale |
| 3 | **Grille de cartes** — une par formation déclarée | Cœur de page |
| 4 | État vide (si aucune formation) | Alerte |

### 1. En-tête

« X formations déclarées sur votre fiche ». Compteur simple, mis à jour en temps réel.

### 2. Bouton d'ajout

Ouvre la modale décrite en section 4. Toujours visible, en haut de page.

### 3. Grille de cartes

Une carte par offre. Contenu de chaque carte :

- Intitulé du titre, en lien vers la page pilier correspondante — le même principe de maillage que sur la fiche publique
- Badge d'état : **Complète** ou **À compléter**
- Prix ou fourchette, durée réelle, rythme (si renseignés — sinon mention neutre « non renseigné(e) », jamais un champ vide silencieux)
- Lieux de rattachement, sous forme de chips — **masqués entièrement si l'organisme est mono-site**, puisqu'il n'y a alors aucun choix à représenter et qu'afficher un chip unique n'apporte rien
- Deux actions : **Modifier** (ou **Compléter** si l'état est incomplet), et **Retirer**

**Pourquoi un badge par carte plutôt qu'un renvoi systématique au Dashboard** — le Dashboard donne la priorité globale de la fiche. Cette page donne le détail formation par formation. Les deux se complètent : le Dashboard dit quoi faire en premier, cette page permet d'agir formation par formation une fois qu'on y est.

### 4. État vide

Si aucune formation n'est déclarée, la grille est remplacée par un message explicite : la fiche n'apparaît alors dans aucun filtre par titre du catalogue, seulement dans le catalogue non filtré et la recherche nominative. Le bouton d'ajout reste l'action centrale de cet état.

**Ne jamais afficher une grille vide sans explication** — c'est la même règle de transparence que sur le Dashboard et sur la fiche publique.

---

## 4. La modale d'ajout

Ouverte depuis le bouton principal. Ne change pas d'URL.

### Contenu

- Champ de recherche par intitulé
- Liste du référentiel fermé, **groupée par catégorie de titre** (agent de sécurité, SSIAP, sécurité cynophile, sûreté aéroportuaire, etc.)
- Case à cocher par titre, sélection multiple
- Les titres déjà déclarés apparaissent **cochés et désactivés**, avec la mention « déjà ajouté » — visible, mais non modifiable depuis cette liste
- Lien « Votre titre n'est pas dans la liste ? Faire une demande », menant au formulaire de demande d'ajout arbitré côté admin — jamais de champ de saisie libre en secours
- Bouton de validation : « Ajouter la sélection »

### Comportement à la validation

Chaque titre nouvellement coché crée une **Offre** — une ligne en base, avec son identifiant et son slug propres, à l'état **À compléter**. La modale se ferme, la grille se met à jour immédiatement avec les nouvelles cartes.

**Aucune saisie de détail n'est demandée dans la modale.** Le principe déjà acté dans le parcours d'inscription s'applique aussi ici, en continu : cocher d'abord, détailler ensuite, et une formation cochée sans détail vaut mieux qu'aucune formation déclarée puisqu'elle rend déjà la fiche visible dans les filtres par titre.

---

## 5. Le détail d'une formation

Ouvert via **Modifier** ou **Compléter** sur une carte. Modale ou panneau, au choix du design final — pas de changement d'URL dans les deux cas.

### Champs

| Champ | Type | Note |
|---|---|---|
| Prix ou fourchette | Numérique | Fourchette optionnelle (min/max) |
| Durée réelle | Numérique + unité | Distincte de la durée réglementaire, qui vit sur la page pilier |
| Rythme | Sélection fermée | Temps plein, soir et weekend, alternance, etc. |
| Lieux de rattachement | Cases à cocher multi-sélection | **N'apparaît que si l'organisme a déclaré au moins un lieu additionnel dans Ma fiche.** En mono-site, la formation est rattachée automatiquement et silencieusement au siège. |
| Financements acceptés | Cases à cocher | CPF, France Travail, OPCO, plan de développement des compétences |

### Recalcul de l'état à la sauvegarde

Une offre passe de **À compléter** à **Complète** dès que prix (ou fourchette), durée réelle et rythme sont renseignés. Financements et lieux additionnels ne conditionnent pas ce passage — ils enrichissent la fiche mais ne bloquent pas l'état complet d'une formation mono-site sans financement déclaré.

**Ce seuil est distinct de celui du score de complétude du Dashboard**, qui raisonne au niveau de la fiche entière et non formation par formation. Les deux logiques coexistent sans se substituer l'une à l'autre.

---

## 6. Retrait d'une formation

Action directe depuis la carte, avec confirmation simple (pas de double étape complexe — le risque est faible, il n'y a pas encore de session ni de réservation attachée à une offre en V1).

**Conséquence à afficher si c'est la dernière formation retirée** — avertir explicitement que la fiche sort de tous les filtres par titre, avec un lien direct pour en rajouter une plutôt que de laisser l'organisme découvrir la conséquence après coup.

**Ce que le retrait ne fait pas** — il ne supprime pas l'historique de la demande d'ajout de titre si applicable, et il n'empêche pas de recocher le même titre plus tard, ce qui recrée une nouvelle offre avec un nouvel identifiant. Sans session ni réservation en jeu en V1, cette perte de continuité n'a pas de conséquence pratique.

---

## 7. Ce qu'il ne faut pas faire

- Ouvrir un champ de saisie libre pour un titre, en modale d'ajout comme en secours d'une demande refusée
- Demander le détail (prix, durée, rythme) au moment de la sélection dans la modale
- Afficher un chip de lieu unique quand l'organisme est mono-site
- Laisser une carte « À compléter » sans action visible dessus
- Bloquer le retrait d'une formation par une confirmation à plusieurs étapes
- Dupliquer la logique de score du Dashboard au niveau de chaque carte — le badge de carte est un état local, pas un pourcentage

---

## 8. Points ouverts

- **Emplacement du détail** — modale ou panneau latéral pour l'édition d'une offre. Choix laissé au maquettage, sans impact sur cette spécification.
- **Comportement de la recherche dans la modale** — recherche uniquement sur l'intitulé, ou également sur des synonymes courants (ex. « agent de sécurité » remontant TFP APS et CQP APS) ? À trancher avec la liste définitive du référentiel.
- **Notification du statut de la demande d'ajout de titre** — l'organisme doit-il être informé (email, badge dans l'interface) de l'arbitrage admin, positif ou négatif ? Repoussé avec l'ensemble du système de notifications si celui-ci n'existe pas encore en V1.

---

## 9. Documents liés

- **Note de cadrage** — référentiel fermé des titres, répartition des responsabilités éditeur / organisme
- **Architecture des pages** — environnement Log, inventaire des pages
- **UX Inscription organisme** — étape 5 de l'onboarding, logique en deux temps reprise ici
- **UX Dashboard organisme** — score de complétude, palier Correct conditionné par cette page
- **UX Fiche organisme** — modèle de données Offre, affichage public des formations déclarées
- **À produire** — Ma fiche (source des lieux additionnels), Paramètres
