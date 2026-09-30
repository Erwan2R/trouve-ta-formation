# Spécification UX — Fichier client

**Trouve ta formation — Verticale sécurité privée**
`admin.trouve-ta-formation.fr/organismes`
Version 1.0 — 31 août 2026

---

## 1. Rôle de la page

Liste de tous les organismes inscrits. Deux usages combinés : **retrouver** un organisme précis (recherche, filtres), et **surveiller** l'état du parc d'organismes en un coup d'œil (paliers, indexation), en particulier comme destination des liens filtrés depuis le Dashboard admin (fiches `noindex`, fiches sans formation déclarée).

**Ce n'est pas un simple annuaire consultable** : la liste porte elle-même des actions de gestion (suspension, suppression, relance), sans obliger systématiquement à ouvrir la Fiche client pour agir. C'est le point qui distingue cette page d'une table passive.

---

## 2. Colonnes de la table

| Colonne | Contenu |
|---|---|
| Organisme | Nom, lien vers la Fiche client |
| Palier | Basique / Correct / Optimal |
| Indexation | Indexable / `noindex` |
| Formations | Nombre de formations déclarées |
| Inscription | Date d'inscription |
| Statut du compte | Actif / Suspendu |

---

## 3. Filtres et recherche

- **Recherche libre** par nom d'organisme
- **Filtre par palier** (Basique / Correct / Optimal) — cible des liens « fiches en `noindex` » du Dashboard
- **Filtre par statut de compte** (Actif / Suspendu)
- **Filtre géographique par département** — cohérent avec le principe déjà acté que les pages géographiques publiques raisonnent au département (jamais à la ville), même logique de granularité reprise ici côté admin

**Filtre « sans formation déclarée »** — combinaison implicite de palier et de nombre de formations à 0, cible directe du bloc Dashboard correspondant. Peut être un filtre dédié plutôt qu'une combinaison manuelle des deux critères, pour que le lien du Dashboard pointe vers une URL simple.

**Tri par défaut** — inscription la plus récente en premier. Cohérent avec un usage quotidien où l'admin surveille aussi le flux d'entrée, pas seulement les anomalies.

---

## 4. Actions disponibles depuis la liste

Trois actions accessibles directement en ligne, sans obliger l'ouverture de la Fiche client — mais chacune avec sa propre confirmation, à la hauteur de sa gravité.

| Action | Effet | Confirmation |
|---|---|---|
| Envoyer un rappel | Ouvre une modale de sélection du type de rappel, envoie un email pré-rédigé | Aucune — l'envoi d'un email n'est pas destructif |
| Suspendre le compte | Compte bloqué, fiche dépubliée du site public | Confirmation simple (« Suspendre ce compte ? ») |
| Supprimer le compte | Suppression définitive du compte et de la fiche | Confirmation forte, reprenant le principe déjà acté côté organisme (saisie du nom de l'organisme avant activation du bouton) |

**Pourquoi une friction différente entre suspendre et supprimer** — suspendre est réversible (voir section 6), supprimer ne l'est pas. Le niveau de confirmation doit refléter cette différence, pas être uniforme par principe de prudence générale.

**Pourquoi ces actions en ligne plutôt que renvoyées systématiquement vers la Fiche client** — ce sont des actions fréquentes dans le flux de travail quotidien de l'admin (relancer plusieurs fiches à la suite, par exemple) ; obliger un aller-retour par fiche à chaque fois casserait ce flux. Ces mêmes actions restent aussi disponibles depuis la Fiche client, pour l'admin qui est déjà sur le détail d'un organisme.

### La modale de rappel

Ouverte depuis l'action « Envoyer un rappel ». Contenu minimal en V1 :

- Choix du type de rappel, **liste fermée mais extensible** :
  - Rappel d'ajout de formation
  - Rappel de complétion de fiche
- Bouton de validation : « Envoyer »

**Comportement à l'envoi** — chaque type déclenche un **email pré-rédigé et fixe**, envoyé automatiquement à l'adresse de connexion de l'organisme, sans étape d'édition ni d'aperçu. Pas de champ de personnalisation en V1 : l'objectif est la rapidité d'un geste répétable, pas une communication sur mesure.

**Pourquoi une liste fermée mais extensible** — les deux cas couverts correspondent aux deux manques structurants déjà identifiés ailleurs dans le projet (formation manquante, complétude insuffisante). D'autres types de rappel pourront s'ajouter à cette même liste plus tard (ex. agrément CNAPS manquant) sans changer la mécanique de la modale.

**Ce que cette relance n'est pas** — ce n'est pas un système de notification automatique ou programmé. C'est un geste manuel, déclenché ponctuellement par l'admin, cohérent avec l'absence de système de notification en V1 déjà actée ailleurs dans le projet (voir Mes formations, point ouvert sur la notification d'arbitrage des demandes de titre). Aucun historique des rappels envoyés n'est requis en V1.

---

## 5. Ce que la suspension entraîne

- Fiche immédiatement dépubliée du site public (catalogue, échantillon d'accueil, blocs organismes)
- Le compte reste connectable ou non — **à trancher en point ouvert**, voir section 7
- **Réversible** : un compte suspendu peut être réactivé, contrairement à une suppression

Comportement distinct de la suppression, spécifiée dans Paramètres organisme : la suppression est immédiate, définitive, sans rétention, et supprime les objets Offre associés. La suspension ne supprime rien, elle dépublie seulement.

---

## 6. Ce qu'il ne faut pas faire

- Supprimer un compte sur une simple confirmation en ligne sans friction renforcée — la règle de saisie du nom de l'organisme, déjà actée côté organisme, s'applique aussi ici
- Permettre l'édition du contenu de l'email de rappel au moment de l'envoi — c'est un template fixe en V1, pas un éditeur
- Envoyer un rappel sans que le type soit explicitement choisi — pas de valeur par défaut qui partirait par erreur
- Confondre suspension et suppression dans une action unique ou un intitulé ambigu
- Ajouter un historique des actions de modération en V1 — non demandé, à ne pas anticiper

---

## 7. Points ouverts

- **Un compte suspendu peut-il encore se connecter ?** À trancher : soit il peut se connecter mais voit un message de suspension sans pouvoir agir, soit la connexion elle-même est bloquée. Le premier cas permet à l'organisme de comprendre pourquoi sa fiche a disparu ; le second est plus strict mais plus opaque pour l'organisme.
- **Contenu exact des deux emails pré-rédigés** — reste à rédiger, hors périmètre de cette spécification UX.
- **Faut-il un troisième type de rappel dès la V1** (ex. compte jamais publié / email non validé) ? Laissé ouvert, la liste étant conçue extensible.

---

## 8. Documents liés

- **Architecture des pages** — environnement Admin, inventaire des pages
- **UX Dashboard admin** — origine des liens filtrés (paliers, fiches sans formation)
- **UX Paramètres organisme** — mécanique de suppression de compte côté organisme, reprise ici pour la cohérence de friction
- **UX Pages géographiques** — granularité département, reprise ici pour le filtre géographique
- **À produire** — Fiche client, Référentiel des titres, Blog admin, Analytics, Paramètres admin
