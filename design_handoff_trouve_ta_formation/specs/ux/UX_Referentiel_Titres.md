# Spécification UX — Référentiel des titres

**Trouve ta formation — Verticale sécurité privée**
`admin.trouve-ta-formation.fr/referentiel`
Version 1.0 — 31 août 2026

---

## 1. Rôle de la page

Gestion de la liste fermée des titres de formation reconnus sur la verticale — la colonne vertébrale du système de filtres, du catalogue et des pages piliers. Deux fonctions distinctes, cohabitant sur la même page :

1. **Gérer la liste des titres** — ajouter, modifier, consulter.
2. **Arbitrer les demandes d'ajout** formulées par les organismes depuis *Mes formations*, quand un organisme ne trouve pas sa formation dans la liste au moment de déclarer une offre.

C'est la pièce la plus nouvelle de l'environnement Admin : aucune des pages Log existantes ne préfigure sa mécanique, à la différence du Fichier client et de la Fiche client qui reprennent des modèles déjà posés ailleurs.

---

## 2. Structure de la page

Deux onglets, cohérents avec la séparation nette des deux fonctions — gérer la liste établie d'un côté, traiter un flux entrant de l'autre.

| Onglet | Contenu |
|---|---|
| Liste des titres | Tous les titres actifs, groupés par catégorie |
| Demandes en attente | Demandes d'ajout non arbitrées, badge de comptage sur l'onglet |

Le badge de comptage sur l'onglet **Demandes en attente** est la même donnée que celle affichée dans la file correspondante du Dashboard admin — une seule source de vérité, deux points d'accès.

---

## 3. Onglet Liste des titres

### Contenu affiché par titre

- Intitulé
- Catégorie de rattachement (agent de sécurité, SSIAP, sécurité cynophile, sûreté aéroportuaire, etc. — reprise du groupement déjà en place dans la modale de *Mes formations*)
- Nombre d'organismes ayant déclaré une offre sur ce titre (donnée de contexte, utile avant toute modification d'intitulé)

**Le contenu réglementaire de la page pilier associée à chaque titre n'est pas géré depuis cette liste en V1.** Sa structure exacte (édition inline, circuit séparé, autre outil) reste à définir au moment du développement — noté comme point ouvert plutôt que tranché ici par anticipation.

### Actions disponibles

| Action | Effet |
|---|---|
| Ajouter un titre | Formulaire : intitulé, catégorie de rattachement |
| Modifier un titre | Édition de l'intitulé et/ou de la catégorie |

**Aucune action de suppression.** Un titre ne peut jamais être retiré du référentiel une fois créé — seule sa modification (correction d'intitulé, recatégorisation) est possible. Ce choix protège l'intégrité des offres déjà déclarées par les organismes : un titre supprimé casserait silencieusement des rattachements existants sur des fiches publiées, ce qu'aucune page de ce projet ne fait ailleurs (voir par exemple le traitement du retrait d'un lieu dans Ma fiche, qui prévient plutôt que de casser).

**Conséquence d'une modification d'intitulé** — elle se répercute immédiatement sur toutes les offres existantes qui pointent vers ce titre, ainsi que sur la page pilier publique. Pas de version figée par offre : le titre est une référence partagée, pas une copie.

---

## 4. Onglet Demandes en attente

### Ce qu'une demande contient

Reprise du parcours déjà décrit dans *Mes formations* : l'organisme saisit un intitulé libre au moment de la demande (c'est le seul point du produit où une saisie libre existe côté organisme, précisément parce qu'elle ne crée rien tant que l'admin n'a pas validé). La demande affiche :

- Intitulé tel que saisi par l'organisme
- Nom de l'organisme demandeur
- Date de la demande

### Arbitrage

Deux issues possibles, avec une possibilité de correction avant validation :

| Action | Effet |
|---|---|
| Accepter | L'admin peut réécrire l'intitulé (correction d'orthographe, normalisation) et choisir la catégorie avant validation. Une fois accepté, le titre est créé dans le référentiel et devient immédiatement disponible dans la liste de sélection de *Mes formations*, pour cet organisme comme pour tous les autres. |
| Refuser | La demande est classée refusée, aucun titre n'est créé. |

**Pourquoi la réécriture est possible à l'acceptation plutôt qu'un ajout tel quel** — c'est le seul rempart contre la dérive que le référentiel fermé est censé éviter par ailleurs : sans cette étape, deux organismes formulant la même demande avec une orthographe différente ("Agent de sécurité" / "Agent de sécurité privée") créeraient deux titres distincts pour la même réalité.

**Ce que l'acceptation ne fait pas automatiquement** — elle ne rattache aucune offre à l'organisme demandeur. L'organisme doit retourner dans *Mes formations* et cocher le titre nouvellement disponible, exactement comme pour n'importe quel autre titre de la liste. La demande est une porte d'entrée dans le référentiel, pas un raccourci vers la déclaration d'offre.

### Notification du résultat à l'organisme

**Email automatique, pré-rédigé, envoyé à l'issue de l'arbitrage** — accepté ou refusé — reprenant le même principe que les rappels du Fichier client : un template fixe par issue, sans étape d'édition, envoyé à l'adresse de connexion de l'organisme. Ceci tranche le point resté ouvert dans la spec *Mes formations*, qui repoussait la question avec l'ensemble du système de notifications : ce n'est pas un système de notification généralisé, c'est la même mécanique ponctuelle déjà retenue pour les rappels.

---

## 5. Ce qu'il ne faut pas faire

- Permettre la suppression d'un titre, sous quelque forme que ce soit — seule la modification est possible
- Ajouter un titre issu d'une demande sans passer par l'étape de relecture/réécriture de l'intitulé
- Rattacher automatiquement une offre à l'organisme demandeur lors de l'acceptation — l'organisme doit repasser par *Mes formations*
- Laisser une demande sans réponse silencieuse — accepter ou refuser déclenche systématiquement l'email correspondant
- Gérer le contenu réglementaire de la page pilier depuis cette page en V1 — hors périmètre, à spécifier séparément

---

## 6. Points ouverts

- **Structure de gestion du contenu de la page pilier** — noté comme travail à faire lors du développement (édition inline sur cette page, circuit séparé, ou autre outil), sans impact sur la mécanique de gestion des titres elle-même.
- **Contenu exact des deux emails d'arbitrage** (acceptation / refus) — reste à rédiger, hors périmètre de cette spécification UX.
- **Faut-il un historique des demandes refusées, consultable après traitement ?** Non demandé explicitement, à confirmer si une trace est utile (éviter de retraiter deux fois la même demande formulée par deux organismes différents, par exemple).

---

## 7. Documents liés

- **Architecture des pages** — environnement Admin, inventaire des pages
- **UX Mes formations** — origine des demandes d'ajout, lien « Faire une demande », point ouvert sur la notification repris et tranché ici
- **UX Dashboard admin** — file « Demandes de titres en attente », même donnée que le badge de l'onglet
- **UX Fichier client** — mécanique de l'email pré-rédigé automatique, reprise à l'identique ici
- **Note de cadrage** — référentiel fermé des titres, répartition des responsabilités éditeur / organisme
- **À produire** — Blog admin, Analytics, Paramètres admin
