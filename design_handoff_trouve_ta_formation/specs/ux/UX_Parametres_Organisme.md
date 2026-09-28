# Spécification UX — Paramètres

**Trouve ta formation — Verticale sécurité privée**
`partenaires.trouve-ta-formation.fr/parametres`
Version 1.0 — 31 août 2026

---

## 1. Rôle de la page

Gestion du compte lui-même — connexion, sécurité, informations internes — par opposition à Ma fiche et Mes formations qui gèrent le contenu public. La séparation est stricte : rien sur cette page n'est visible sur la fiche publique.

C'est la plus simple des quatre pages de l'environnement Log : peu de décisions structurantes, essentiellement du CRUD de compte classique.

---

## 2. Structure de la page

Trois sections empilées, cohérentes avec le principe déjà retenu sur Ma fiche (cartes indépendantes, pas d'onglets pour un si petit nombre de blocs).

| # | Section | Contenu |
|---|---|---|
| 1 | Connexion | Email de connexion, mot de passe |
| 2 | Informations du compte | Nom du contact principal, téléphone direct |
| 3 | Zone dangereuse | Suppression du compte |

---

## 3. Détail des sections

### 1. Connexion

**Email de connexion et mot de passe, chacun modifiable indépendamment**, avec un bouton « Modifier » dédié par champ plutôt qu'un formulaire ouvert en permanence — ce sont des actions sensibles, elles ne doivent pas être à portée d'une modification accidentelle.

**Distinction avec l'email de contact public** — l'email de connexion est l'identifiant du compte, jamais affiché publiquement. L'email de contact public, géré dans Ma fiche, est une coordonnée visible sur la fiche organisme. Les deux objets sont déjà distingués ailleurs dans le projet (spec Inscription, spec Ma fiche) ; cette page ne fait que refléter cette séparation côté paramètres.

**Changement d'email — validation différée.** Le nouvel email n'est activé qu'après clic sur un lien de confirmation envoyé à cette nouvelle adresse. L'email de connexion actuel reste valide tant que le nouveau n'est pas confirmé.

**Pourquoi ce choix** — un changement immédiat sur simple saisie expose à deux risques : une faute de frappe qui verrouille l'organisme hors de son propre compte, ou une prise de contrôle du compte si l'accès à la session est compromis sans que l'attaquant connaisse le mot de passe. Le lien de confirmation élimine les deux : l'ancien email reste actif jusqu'à preuve que le nouveau est atteignable et légitime.

**Changement de mot de passe** — mot de passe actuel requis avant saisie du nouveau, règle standard de sécurité, sans particularité propre à ce projet.

### 2. Informations du compte

Nom du contact principal, téléphone direct.

**Explicitement marqué « usage interne, jamais public »** dans l'interface. Ces champs ne remplacent pas l'email de contact public de Ma fiche : ils servent à joindre directement le dirigeant si besoin (notification importante, vérification d'agrément a posteriori côté admin), indépendamment de ce qu'il a choisi de publier.

### 3. Zone dangereuse

Suppression du compte. Visuellement isolée (bordure de couleur danger), pour ne jamais être confondue avec une action anodine du reste de la page.

**Suppression immédiate et définitive**, pas de délai de rétention. La fiche est dépubliée et les données supprimées au même moment.

**Confirmation forte** avant exécution : l'organisme doit saisir le nom de son organisme dans un champ de confirmation avant que le bouton de suppression ne devienne actif — pas une simple case à cocher ou un « êtes-vous sûr ». C'est une action sans retour possible, la friction de confirmation doit être à la hauteur.

**Ce que la suppression entraîne** — retrait immédiat de la fiche du catalogue, de l'échantillon d'accueil et de tout bloc organismes des pages formation. Les formations associées (objets Offre) sont supprimées avec le compte.

---

## 4. Ce qu'il ne faut pas faire

- Fusionner email de connexion et mot de passe dans un seul formulaire ouvert en permanence
- Activer un nouvel email de connexion avant confirmation par lien
- Confondre les champs de cette page avec l'email de contact public ou toute autre donnée publique de la fiche
- Permettre la suppression du compte sur une simple case à cocher — la confirmation doit demander une action délibérée (saisie du nom de l'organisme)
- Afficher un champ ou une action qui n'existe pas encore (notifications, export de données) plutôt que de les omettre proprement

---

## 5. Points ouverts

- **Cadrer la conformité RGPD de la suppression immédiate** — vérifier qu'une suppression sans délai de rétention est compatible avec d'éventuelles obligations de conservation (facturation future, litiges). Point à trancher avec le passage à la monétisation, sans impact sur la V1 où aucune donnée financière n'est en jeu.
- **Définir le canal de notification en cas de changement de mot de passe** (email de confirmation à l'ancienne adresse) — bonne pratique de sécurité standard, à confirmer côté implémentation.
- **Décider si la suppression du compte doit envoyer un email de confirmation** avant exécution, en plus de la saisie du nom de l'organisme — couche de sécurité supplémentaire à évaluer selon la charge de développement.

---

## 6. Documents liés

- **Architecture des pages** — environnement Log, inventaire des pages
- **UX Inscription organisme** — création de compte, distinction email de connexion / email de contact public
- **UX Ma fiche** — email de contact public, dont cette page ne gère jamais le contenu
- **UX Dashboard organisme** — ce que devient la fiche à la suppression du compte
- **UX Mes formations** — objets Offre supprimés avec le compte
