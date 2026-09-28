# Spécification UX — Paramètres admin

**Trouve ta formation — Verticale sécurité privée**
`admin.trouve-ta-formation.fr/parametres`
Version 1.0 — 31 août 2026

---

## 1. Rôle de la page

Sécurité du compte admin — email de connexion, mot de passe, authentification à deux facteurs. **Un seul compte admin existe en V1** : pas de gestion multi-utilisateurs, pas d'invitation, pas de rôles. Si l'accès doit un jour s'ouvrir à une deuxième personne, c'est un chantier à part entière, pas une extension de cette page.

**Sécurité renforcée par rapport à Paramètres organisme.** Ce compte a accès à l'ensemble des données de tous les organismes et porte des actions de modération irréversibles (suppression de compte, notamment) — le niveau d'exigence sur cette page est supérieur à son équivalent côté organisme, dont elle reprend par ailleurs la structure de base.

---

## 2. Structure de la page

Deux sections empilées. Pas de « zone dangereuse » : contrairement à Paramètres organisme, il n'y a rien à supprimer ici — un compte admin unique ne se révoque pas depuis sa propre interface.

| # | Section | Contenu |
|---|---|---|
| 1 | Connexion | Email de connexion, mot de passe |
| 2 | Authentification à deux facteurs | Activation, méthode |

---

## 3. Détail des sections

### 1. Connexion

**Email de connexion et mot de passe, chacun modifiable indépendamment**, avec un bouton « Modifier » dédié par champ — reprise du principe déjà retenu côté organisme : une action sensible ne doit jamais être à portée d'une modification accidentelle.

**Changement d'email — validation différée**, identique au mécanisme organisme : le nouvel email n'est activé qu'après clic sur un lien de confirmation envoyé à cette nouvelle adresse, l'ancien restant valide jusqu'à confirmation. Même raisonnement ici : une faute de frappe ne doit jamais pouvoir verrouiller l'accès au seul compte admin existant.

**Changement de mot de passe** — mot de passe actuel requis avant saisie du nouveau. **Email de notification envoyé à l'adresse de connexion à chaque changement de mot de passe** — contrairement à Paramètres organisme où ce point restait ouvert, il est tranché ici en position ferme : si le compte admin est un jour compromis, cette notification est le seul signal qui permette de le détecter à temps.

### 2. Authentification à deux facteurs

**Activation via application d'authentification (TOTP)** — Google Authenticator, Authy, ou équivalent. Pas de 2FA par SMS : moins fiable, dépendant d'un opérateur, et pas nécessaire pour un compte unique déjà protégé par un mot de passe fort.

**Flux d'activation** — présentation d'un QR code à scanner, saisie d'un code de vérification à six chiffres pour confirmer que l'application est correctement configurée avant activation effective.

**Codes de récupération** — un jeu de codes à usage unique généré à l'activation, affiché une seule fois avec consigne explicite de les conserver hors ligne. C'est le seul moyen de retrouver l'accès si l'appareil portant l'application d'authentification est perdu — indispensable ici puisqu'il n'existe qu'un compte admin, sans personne d'autre pour rétablir l'accès de l'extérieur.

**Le 2FA est obligatoire, pas optionnel**, cohérent avec le niveau de sécurité attendu pour ce compte : pas de case « activer plus tard », l'activation fait partie du parcours de sécurisation initial du compte.

---

## 4. Ce qu'il ne faut pas faire

- Permettre un changement d'email de connexion sans validation par lien de confirmation
- Laisser le 2FA optionnel — il est obligatoire pour ce compte
- Proposer le SMS comme méthode de 2FA
- Afficher les codes de récupération plus d'une fois après leur génération initiale
- Ajouter une gestion multi-comptes ou un système de rôles — hors périmètre V1, un seul compte admin existe
- Omettre la notification par email au changement de mot de passe, à la différence du point resté ouvert côté organisme

---

## 5. Points ouverts

- **Procédure de récupération si les codes de récupération sont eux-mêmes perdus** — en l'absence d'un deuxième administrateur, ce cas nécessite une procédure hors interface (accès direct en base, comme pour la création manuelle de fiche déjà actée ailleurs dans le projet). À documenter séparément, hors périmètre de cette spécification UX.
- **Durée de validité de la session admin** — délai avant déconnexion automatique, non tranché à ce stade.

---

## 6. Documents liés

- **Architecture des pages** — environnement Admin, inventaire des pages
- **UX Paramètres organisme** — structure de référence, mécanique de changement d'email reprise à l'identique
- **Architecture des pages** — création manuelle de fiche en base, même logique reprise pour la procédure de récupération d'urgence

---

## 7. Environnement Admin — récapitulatif

Avec cette page, les sept pages de l'environnement Admin identifiées dans l'architecture des pages sont désormais spécifiées :

| Page | Statut |
|---|---|
| Dashboard | Spécifié |
| Fichier client | Spécifié |
| Fiche client | Spécifié |
| Référentiel des titres | Spécifié |
| Blog admin | Spécifié |
| Analytics | Spécifié |
| Paramètres admin | Spécifié |

**Dette à traiter avant développement**, identifiée au fil de ces spécifications :
- Mise à jour de la spec Blog publique (ordre des blocs, nouveau CTA générique)
- Mise à jour de Ma fiche et Fiche organisme (lien CTA principal configurable, en remplacement du champ site web)
- Arbitrage du point ouvert transversal Fichier client / Fiche client (connexion possible ou non pour un compte suspendu)
