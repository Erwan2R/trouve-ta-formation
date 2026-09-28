# Spécification UX — Fiche organisme

**Trouve ta formation — Verticale sécurité privée**
`trouve-ta-formation.fr/securite-privee/organismes/[slug]/`
Version 1.0 — 30 août 2026

---

## 1. Rôle de la page

Page produit de l'organisme. Elle répond à une seule question : **est-ce que ce centre fait ce que je cherche, dans des conditions qui me conviennent, et comment je le contacte.**

C'est la destination de tous les liens du catalogue, de l'échantillon d'accueil et du bloc organismes des pages piliers. C'est aussi ce que la landing B2B promet de montrer au dirigeant : la fiche telle qu'elle pourrait être une fois remplie.

### Ce qu'elle n'est pas

- Ce n'est pas une page de titre. Le programme, les prérequis et le cadre réglementaire vivent sur la page pilier. L'organisme ne les réécrit jamais.
- Ce n'est pas une page géographique. Elle mentionne ses lieux, elle ne traite pas la formation dans un département.

### Intention

Requêtes nominatives principalement : *[nom du centre] avis*, *[nom du centre] formation*, *[nom du centre] adresse*. Volume faible par fiche, mais cumulé sur plusieurs centaines de fiches, c'est un canal réel — et une fiche bien remplie ranke facilement sur son propre nom.

---

## 2. Informations portées par la fiche

### Identité

Nom commercial, raison sociale, logo, **numéro d'agrément CNAPS**, certification Qualiopi, numéro de déclaration d'activité, année de création.

L'agrément CNAPS est l'information la plus importante de la fiche. C'est ce qui distingue un centre légal d'un centre qui ne l'est pas, c'est vérifiable publiquement, et c'est donc le signal de confiance le plus fort dont dispose la page.

### Contact et lieux

Siège social, lieux de formation additionnels avec adresse complète, téléphone, email, site web, horaires d'accueil.

### Formations dispensées

Les titres cochés dans le référentiel fermé. Chaque formation porte ses attributs propres : prix ou fourchette, durée réelle, rythme, lieux où elle est dispensée, financements acceptés.

### Financements et modalités

CPF, France Travail, OPCO, plan de développement des compétences. Accessibilité PMR. Langues d'enseignement.

### Contenu libre

Une présentation rédigée par l'organisme, plafonnée en longueur. C'est ce qui différencie les fiches les unes des autres — sans elle, toutes les fiches se ressemblent et la famille entière est évaluée comme faible.

### Signaux externes

Note Google affichée avec l'attribution requise. Jamais utilisée comme filtre ni comme critère de tri — décision actée dans la spécification du catalogue.

### Ce qui ne doit pas y figurer

Le programme réglementaire, les prérequis officiels, le cadre CNAPS d'un titre. Ils vivent sur la page pilier, une seule fois sur le site.

---

## 3. Ordre des blocs

| # | Bloc | Fonction dominante |
|---|---|---|
| 1 | Fil d'Ariane | Maillage remontant |
| 2 | En-tête — identité et badges | Confiance |
| 3 | Barre d'actions sticky | Conversion |
| 4 | Présentation courte | Contenu propre |
| 5 | **Les formations proposées** | **Cœur de page** |
| 6 | Lieux de formation | Information pratique |
| 7 | Financements acceptés | Critère éliminatoire |
| 8 | Informations pratiques | Complément |
| 9 | Autres organismes du département | **Anti cul-de-sac** |
| 10 | Maillage vers les pages piliers | Distribution d'autorité |
| 11 | FAQ courte | Longue traîne |
| 12 | Footer | Maillage secondaire |

---

## 4. Détail des blocs

### 1. Fil d'Ariane

`Sécurité privée > Organismes > [Nom de l'organisme]`. Balisage `BreadcrumbList`.

C'est la page la plus profonde du silo : le fil d'Ariane est le seul chemin remontant.

---

### 2. En-tête — identité et badges

**Contenu** — logo, nom, ville et département du siège, badge agrément CNAPS, badge Qualiopi si applicable, note Google avec attribution, mention du nombre de lieux si supérieur à un.

**Pourquoi les badges si haut** — sur un secteur réglementé, la première question du visiteur est la légitimité du centre. Un badge d'agrément visible immédiatement fait plus pour la conversion qu'un paragraphe de présentation.

---

### 3. Barre d'actions sticky

**Contenu** — téléphone, site web, itinéraire. En mobile, barre fixe en bas d'écran.

**Pourquoi sticky** — un annuaire paraît daté quand il faut chercher le numéro de téléphone. C'est l'élément qui fait le plus pour la perception de modernité de la fiche, davantage que n'importe quel choix esthétique.

**Emplacement d'extension** — c'est ici que viendra se placer un futur CTA de réservation. Voir section 7.

---

### 4. Présentation courte

**Contenu** — texte rédigé par l'organisme, plafonné.

**Pourquoi plafonné** — sans limite, certains écriront trois lignes et d'autres deux mille mots de copie commerciale. Le plafond protège la lisibilité et évite qu'une fiche devienne un site dans le site.

**Cas fiche vide** — si l'organisme n'a rien rédigé, ne pas afficher un bloc vide ni un texte généré automatiquement. Le bloc disparaît.

---

### 5. Les formations proposées

> **Cœur de la page.**

**Contenu** — une ligne par formation déclarée : intitulé du titre, durée réelle, prix ou fourchette, rythme, lieu. Un bouton ouvre la vue détaillée.

**Principe** — le visiteur doit savoir si le centre fait ce qu'il cherche et à quel prix **sans cliquer**. La vue détaillée sert à approfondir, pas à découvrir.

**Chaque intitulé de titre est un lien vers la page pilier.** C'est le maillage le plus qualitatif de la fiche, et il évite que l'organisme réécrive le contenu réglementaire.

**Cas de la fiche sans formation déclarée** — bloc remplacé par une mention neutre. Ne jamais afficher une liste vide. Conséquence à assumer : cette fiche n'apparaît dans aucun filtre par titre du catalogue.

**SEO** — balisage `ItemList`. Contenu rendu côté serveur, y compris le détail des formations, même s'il est visuellement replié.

---

### 6. Lieux de formation

**Contenu** — le siège et les lieux additionnels, chacun avec adresse complète, et une mini-carte statique par lieu ou une carte unique avec plusieurs marqueurs.

**Pourquoi ce bloc existe séparément** — le modèle de données autorise un organisme à dispenser une formation sur plusieurs sites. Le visiteur doit comprendre où se déroule concrètement la formation qui l'intéresse, ce qui n'est pas nécessairement le siège.

**Technique** — carte statique ou différée. Jamais bloquante pour le rendu.

---

### 7. Financements acceptés

**Contenu** — CPF, France Travail, OPCO, plan de développement des compétences, avec mention de ce que l'organisme accepte réellement.

**Pourquoi un bloc dédié** — c'est le critère qui élimine le plus brutalement. Quelqu'un qui n'a que son CPF ne peut pas envisager un centre qui ne le prend pas, et cette information ne doit pas être noyée dans le détail de chaque formation.

---

### 8. Informations pratiques

Horaires, accessibilité PMR, langues d'enseignement, année de création, numéro de déclaration d'activité.

---

### 9. Autres organismes du département

**Contenu** — 3 à 4 fiches voisines, cartes identiques à celles du catalogue.

**Pourquoi ce bloc est nécessaire** — la fiche organisme est une feuille de l'arbre. Sans sortie latérale, le visiteur qui ne trouve pas son bonheur quitte le site. Ce bloc le retient dans le silo et distribue de l'autorité entre fiches.

**Critère de sélection** — même département, tri par score de complétude. Exclure la fiche courante.

---

### 10. Maillage vers les pages piliers

**Contenu** — liens vers les pages des titres proposés par l'organisme.

Redondant avec les liens du bloc 5, volontairement : c'est du maillage descendant vers les pages qui portent le trafic principal.

---

### 11. FAQ courte

3 à 5 questions, générées à partir des données de la fiche plutôt que rédigées : quels titres prépare ce centre, où se situe-t-il, quels financements accepte-t-il, est-il agréé.

**Vigilance** — sur plusieurs centaines de fiches, une FAQ strictement générée devient un motif répété. À limiter en volume, et à ne pas baliser en `FAQPage` si les questions sont identiques d'une fiche à l'autre.

---

### 12. Footer

Identique au footer global du silo.

---

## 5. La vue détaillée d'une formation

**Décision : pas d'URL propre en V1.** La vue s'ouvre en panneau latéral ou en modale depuis le bloc 5, avec une ancre stable (`#tfp-aps`) permettant le lien direct.

### Pourquoi pas une page autonome

Le contenu réglementaire d'un titre est identique partout. Générer une page par couple organisme × titre produirait des centaines de pages quasi dupliquées, dont le seul contenu unique serait un prix et une adresse. Le risque n'est pas qu'elles ne rankent pas, mais qu'elles dégradent l'évaluation de l'ensemble du silo et pénalisent les pages piliers.

### Contenu de la vue

| Section | Détenteur |
|---|---|
| Intitulé du titre | Référentiel |
| Prix, et ce qu'il comprend | Organisme |
| Durée réelle et rythme | Organisme |
| Lieu où elle est dispensée | Organisme |
| Financements acceptés pour cette formation | Organisme |
| Prochaines sessions, si renseignées | Organisme |
| Modalités d'inscription | Organisme |
| **Lien vers la page pilier** | — |

Le lien vers la page pilier est structurant : la vue détaillée dit ce qui est propre à l'organisme, la page pilier dit ce qui est réglementaire. Aucun recouvrement.

### Contenu rendu côté serveur

Même replié, le contenu de la vue doit être présent dans le DOM au chargement. Il participe à la richesse de la fiche organisme, qui est la page indexée.

---

## 6. Les états de la fiche

| État | Traitement |
|---|---|
| **Fiche complète** | Nominal |
| **Fiche sans formation déclarée** | Bloc 5 remplacé par une mention neutre. Fiche absente de tous les filtres par titre. Candidate au `noindex` selon le score de complétude. |
| **Fiche sans présentation** | Bloc 4 masqué, pas de texte généré |
| **Organisme mono-site** | Bloc 6 simplifié, pas de mention « lieux additionnels » |
| **Fiche sous le seuil de complétude** | `noindex`, accessible par lien direct |

Le seuil de `noindex` est piloté par le score de complétude, comme le tri du catalogue et la sélection de l'échantillon d'accueil.

---

## 7. Extensibilité — préparer la monétisation

> **Section à traiter comme une contrainte d'architecture, pas comme une intention.**

L'objectif est qu'un module vendu plus tard — réservation, formulaire de candidature, gestion de sessions — s'implémente sans refondre le modèle de données ni casser les URLs existantes.

### Le modèle de données à poser dès la V1

```
Organisme
  └── Lieu (siège + lieux additionnels)
  └── Offre (organisme × titre)
        ├── slug stable
        ├── rattachement à un ou plusieurs lieux
        ├── prix, durée réelle, rythme, financements
        └── Session (dates, places, tarif)   ← n'existe pas en V1
```

**L'offre doit avoir une identité stable dès maintenant** : un identifiant et un slug **stocké en base**, jamais généré à la volée depuis le slug du titre. Le jour de la bascule, `#tfp-aps` devient `/tfp-aps/` sans réécriture du modèle et sans casser les liens existants. Sans cet objet, le couple organisme × titre reste implicite et il n'y a rien à quoi rattacher une session, une réservation ou une statistique.

**La session est l'objet manquant.** Elle n'existe pas en V1, mais sa place dans le modèle doit être prévue : c'est elle qui portera dates, places disponibles et tarifs variables.

**Tous les objets sont horodatés.** Date de création et de modification, et trace des changements de prix sur l'offre. Le modèle décrit sinon un état présent — le prix d'aujourd'hui, sans savoir depuis quand. Une réservation a besoin de connaître le tarif applicable au moment où elle a été faite, et l'antériorité d'une fiche est un signal utile. C'est une donnée qui ne se reconstitue pas après coup.

### Ce qu'il ne faut pas construire en avance

La distinction est nette entre « prêt à accueillir » et « déjà construit ». Le schéma doit permettre d'ajouter une table sessions rattachée à une offre identifiée, sans toucher à l'existant. Il ne faut pas pour autant :

- créer une table sessions vide
- développer le module de réservation en désactivé
- prévoir des écrans masqués

Du code mort maintenu pendant un an coûte plus cher qu'une migration bien préparée.

### La condition de bascule vers les pages offre

Le jour où les offres portent des sessions réelles, leur contenu devient unique et vivant, et l'arbitrage SEO s'inverse. Les pages offre deviennent alors justifiées et indexables.

Autrement dit : **le module de réservation et les pages offre arrivent ensemble.** L'un justifie l'autre.

### Capacités par organisme

Chaque fonctionnalité vendable est un **drapeau sur le compte organisme**, présent dès la V1 même si tout est désactivé. Ajouter ce mécanisme après coup impose de reprendre l'ensemble des contrôles d'affichage.

### Emplacements réservés dans l'interface

- **Barre d'actions (bloc 3)** — emplacement du futur CTA de réservation. Il affiche « contacter » aujourd'hui, « réserver » demain, au même endroit.
- **Vue détaillée de formation** — emplacement du bloc sessions, sous les modalités d'inscription.
- **Tri du catalogue** — paramètre de mise en avant payante, déjà prévu comme configurable.

### Règle à acter

**Une fonctionnalité payante ne modifie jamais le classement du catalogue.** La mise en avant payante est un emplacement explicite et identifié, pas un biais dans le tri par défaut. Sans cette règle, le produit bascule dans la catégorie comparateur biaisé que la note de cadrage exclut — et le tri par score de complétude perd sa lisibilité.

### Points à cadrer avant de vendre de la réservation

- **Le paiement.** Une formation financée par le CPF ne se paie pas directement à l'organisme. Le module doit distinguer réservation de place et transaction financière.
- **La responsabilité.** Qui est engagé si une session réservée est annulée. Cadre contractuel à écrire avant la première vente.
- **La fraîcheur des sessions.** Des dates périmées affichées publiquement sont pires que pas de dates. Prévoir une expiration automatique.

---

## 8. Rendu technique

### Framework recommandé

**Next.js, App Router.** La contrainte dominante du projet est le rendu côté serveur de tout le contenu textuel et de tous les liens, ce qui exclut les applications client-only.

Ce que cette stack apporte au projet précisément :

- **Génération statique avec revalidation** — les fiches organisme sont servies instantanément et se régénèrent quand un organisme modifie ses données.
- **Îlots interactifs** — filtres du catalogue, carte, formulaire d'affinage, vue détaillée de formation, sans sacrifier le rendu serveur du reste.
- **Codebase unique** — le site public et l'espace organisme vivent dans le même projet, avec une configuration par verticale comme prévu dans la structure d'URL.
- **Routage par segments dynamiques** — compatible avec la règle de résolution des slugs (réservé → titre → géographie → 404).

**Alternative : Astro**, plus léger, dont le modèle d'îlots convient bien à un site majoritairement statique. Inconvénient : l'espace organisme devient un projet séparé, donc deux bases de code à maintenir.

### Règles transverses

- Rendu côté serveur pour tout le contenu textuel et tous les liens.
- Un seul H1, portant le nom de l'organisme.
- Données structurées : `LocalBusiness` ou `EducationalOrganization` sur l'organisme, `BreadcrumbList`, `ItemList` sur les formations. Plusieurs lieux impliquent plusieurs `address`.
- Logos et images en WebP, dimensions explicites.
- Cartes en chargement différé.
- Aucun élément cliquable sans balise `<a>`.

---

## 9. Ce qu'il ne faut pas mettre

- Le programme réglementaire d'un titre — il vit sur la page pilier
- Une page par couple organisme × titre en V1
- Un bloc vide quand une donnée manque
- Un texte de présentation généré automatiquement
- La note Google en critère de tri ou de filtre
- Une carte bloquante pour le rendu
- Une FAQ générée identique d'une fiche à l'autre, balisée `FAQPage`

---

## 10. Points ouverts

- **Définir le calcul du score de complétude** et le seuil de `noindex` de la fiche. Ce point revient dans cinq documents et bloque désormais plusieurs décisions.
- **Plafonner la présentation libre** — longueur à chiffrer.
- **Décider du balisage** `LocalBusiness` ou `EducationalOrganization`, selon la couverture des propriétés utiles.
- **Confirmer la stack technique** — recommandation en section 8, à valider selon les contraintes existantes.
- **Cadrer le module de réservation** : paiement, responsabilité, expiration des sessions. Avant la première vente, pas avant le développement.

---

## 11. Documents liés

- **Note de cadrage** — concept, modèle économique, go-to-market
- **Architecture des pages** — inventaire des pages et de leurs rôles
- **Structure d'URL** — nommage, arborescence, règles d'indexation
- **UX Page d'accueil** — tête de silo
- **UX Catalogue organismes** — page canonique du catalogue
- **UX Landing organismes** — sas de conversion B2B
- **UX Page pilier par titre** — contenu réglementaire
- **À produire** — spécification UX des pages démarche et géographiques, parcours du formulaire d'affinage
