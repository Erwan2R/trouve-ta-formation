# Spécification UX — Fiche client

**Trouve ta formation — Verticale sécurité privée**
`admin.trouve-ta-formation.fr/organismes/[id]`
Version 1.0 — 31 août 2026

---

## 1. Rôle de la page

Vue complète d'un organisme, accessible depuis le Fichier client. Deux fonctions : **donner à l'admin une lecture exhaustive** de tout ce que l'organisme a renseigné, côté public comme côté interne, et **porter les mêmes actions de modération** que le Fichier client — suspendre, supprimer, envoyer un rappel — avec le contexte complet sous les yeux plutôt qu'en ligne dans une table.

**Strictement en lecture seule côté contenu.** L'admin ne corrige jamais un champ à la place de l'organisme — principe déjà acté dans l'architecture des pages (la création manuelle d'une fiche par l'admin se fait en base de données, sans interface dédiée ; le même raisonnement s'applique à l'édition). Seules les actions de modération sont des actions d'écriture sur cette page.

---

## 2. Ordre des blocs

| # | Bloc | Origine | Contenu |
|---|---|---|---|
| 1 | En-tête | — | Nom de l'organisme, statut du compte, lien « Voir la fiche publique », actions de modération |
| 2 | Score et indexation | Dashboard organisme | Palier (Basique / Correct / Optimal), statut d'indexation |
| 3 | Identité et coordonnées | Ma fiche | Nom, SIRET, agrément CNAPS, Qualiopi, siège, lieux additionnels, horaires, accessibilité, langues, site web |
| 4 | Présentation | Ma fiche | Texte libre rédigé par l'organisme |
| 5 | Formations déclarées | Mes formations | Liste des offres : titre, lieux de rattachement, prix, durée, modalités, financements, rythme, état (Complète / À compléter) |
| 6 | Informations de compte | Paramètres organisme | Email de connexion, nom du contact principal, téléphone direct |
| 7 | Historique | — | Date d'inscription, rappels envoyés (type, date) |

**Principe de composition** — cette page ne réinvente aucun champ : elle reprend, en lecture seule, l'intégralité de ce que l'organisme voit et gère dans son propre espace (Ma fiche, Mes formations, Paramètres, Dashboard), organisée en un seul endroit pour l'admin. Aucune section n'est masquée à l'admin, y compris les informations marquées « usage interne, jamais public » côté organisme (nom du contact, téléphone direct) — l'admin en a l'usage légitime pour joindre l'organisme directement si nécessaire.

### 1. En-tête

Nom de l'organisme, badge de statut du compte (Actif / Suspendu), lien direct « Voir la fiche publique » — même fonction que sur le Dashboard organisme : vérifier en un clic l'effet réel d'un `noindex` ou d'une suspension sur ce que voit un visiteur.

Les trois actions de modération sont regroupées ici, visibles sans défilement :

| Action | Effet | Confirmation |
|---|---|---|
| Envoyer un rappel | Ouvre la modale de sélection du type de rappel, envoie un email pré-rédigé | Aucune |
| Suspendre le compte | Compte bloqué, fiche dépubliée du site public | Confirmation simple |
| Supprimer le compte | Suppression définitive du compte et de la fiche | Confirmation forte (saisie du nom de l'organisme) |

Mécanique identique à celle du Fichier client — voir cette spécification pour le détail de la modale de rappel et le contenu exact des confirmations. Aucune raison de dupliquer une logique différente ici : c'est la même action, seul le point d'entrée change.

**Pourquoi ces actions en en-tête plutôt qu'en zone dangereuse séparée en bas de page** (à la différence de Paramètres organisme) — sur Paramètres organisme, la suppression est une action rare que l'organisme ne doit pas croiser par accident. Ici, ces trois actions sont l'outil de travail principal de l'admin sur cette page : les reléguer en bas nuirait à l'usage quotidien. La friction de confirmation propre à chaque action (section 1, Fichier client) reste le garde-fou contre l'erreur, pas la position dans la page.

### 2. Score et indexation

Palier de complétude et statut d'indexation, repris tels quels du modèle du Dashboard organisme. Lecture seule : l'admin constate, il ne recalcule ni ne force rien manuellement en V1.

### 3. Identité et coordonnées

Reprise intégrale du contenu de Ma fiche : identité (nom, SIRET, agrément CNAPS, Qualiopi), siège, lieux de formation additionnels, informations pratiques (accessibilité, langues), site web, horaires.

### 4. Présentation

Le texte libre rédigé par l'organisme, affiché tel quel. Si vide, mention neutre plutôt qu'un bloc vide silencieux — même principe de transparence appliqué partout ailleurs dans le projet.

### 5. Formations déclarées

Reprise du contenu de Mes formations : chaque offre avec son titre, ses lieux de rattachement, prix, durée, modalités, financements, rythme, et son état (Complète / À compléter). Chaque titre reste un lien vers sa page pilier publique, cohérent avec le maillage déjà en place ailleurs.

**Si aucune formation déclarée** — message explicite reprenant celui de l'état vide de Mes formations, pas une section simplement absente.

### 6. Informations de compte

Email de connexion, nom du contact principal, téléphone direct — reprise de Paramètres organisme. Champs identifiés comme internes côté organisme, mais pleinement visibles ici : c'est l'usage prévu de ces champs (joindre directement le dirigeant, vérification a posteriori), déjà annoncé dans la spec Paramètres organisme elle-même.

### 7. Historique

Date d'inscription. Liste des rappels envoyés depuis le Fichier client ou cette page — type de rappel et date, en ordre chronologique inverse.

**Pourquoi un historique ici alors qu'il n'est pas requis sur le Fichier client** — le Fichier client est un outil d'action rapide sur plusieurs organismes à la fois ; la Fiche client est l'endroit où l'admin a besoin de contexte avant d'agir à nouveau (éviter de relancer deux fois pour la même chose, par exemple). L'historique n'est donc pas dupliqué en liste, il est concentré ici où il est utile.

---

## 3. Ce qu'il ne faut pas faire

- Introduire un mode édition sur un champ quelconque du contenu organisme — aucune section de cette page n'est modifiable directement, seules les trois actions de modération le sont
- Masquer les champs internes (contact principal, téléphone) sous prétexte qu'ils sont marqués « jamais public » côté organisme — cette mention concerne la fiche publique, pas la Fiche client admin
- Dupliquer une logique de confirmation différente de celle déjà actée au Fichier client pour les mêmes actions
- Reléguer les actions de modération en bas de page — elles doivent rester visibles sans défilement, à la différence de la zone dangereuse de Paramètres organisme
- Afficher un score recalculable ou un bouton de recalcul manuel — le score reste piloté uniquement par ce que l'organisme déclare

---

## 4. Points ouverts

- **Un compte suspendu peut-il encore se connecter ?** Point déjà identifié dans la spec Fichier client, non encore tranché — a un impact direct sur ce que cette page doit afficher comme statut de connexion.
- **Faut-il distinguer, dans l'historique, un rappel envoyé depuis le Fichier client d'un rappel envoyé depuis cette page ?** Probablement sans intérêt pratique — à confirmer que la distinction n'apporte rien.

---

## 5. Documents liés

- **UX Fichier client** — mécanique des trois actions de modération et de la modale de rappel, reprise à l'identique ici
- **UX Dashboard organisme** — modèle du score de complétude et des paliers
- **UX Ma fiche** — contenu repris en section 3 et 4
- **UX Mes formations** — contenu repris en section 5
- **UX Paramètres organisme** — contenu repris en section 6, distinction interne / public
- **À produire** — Référentiel des titres, Blog admin, Analytics, Paramètres admin
