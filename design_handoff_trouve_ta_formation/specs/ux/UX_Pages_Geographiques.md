# Spécification UX — Pages géographiques

**Trouve ta formation — Verticale sécurité privée**
`trouve-ta-formation.fr/securite-privee/[departement]/`
Version 1.0 — 30 août 2026

---

## 1. Rôle de ces pages

Capter les requêtes où le lieu fait partie de la recherche : *formation agent de sécurité Seine-Saint-Denis*, *SSIAP 1 Paris*, *centre de formation sécurité 93*. Intention réelle et fréquente, puisque la formation est en présentiel et que personne ne traverse l'Île-de-France pour aller en cours.

Sans ces pages, aucune page du silo ne répond à cette requête : la page formation traite un titre partout, le catalogue traite les organismes en général.

### Le second rôle, structurant

Ces pages **absorbent le besoin de filtrage géographique sans créer d'URL de filtre indexable.**

C'est la contrepartie de la règle posée dans la structure d'URL : `/organismes/?dept=93` n'est jamais indexable, parce que ce rôle appartient à `/securite-privee/seine-saint-denis/`, qui porte du contenu propre. Sans ces pages, la règle d'indexation n'a pas de solution de repli et le filtre finira par être indexé.

**Conséquence :** la page département affiche l'inventaire local **complet**, pas un échantillon. Un échantillon ne remplace pas le filtre, et le visiteur repart vers le catalogue.

---

## 2. Granularité : département d'abord, ville ensuite

| Niveau | Pages | Verdict |
|---|---|---|
| Région | 1 | Écarté — doublon avec le catalogue |
| **Département** | 8 | **Retenu au lancement** |
| Ville | 50 à 100 | Cas par cas, jamais par génération automatique |

**Pourquoi pas les villes au lancement** — générer une page par commune produit quarante pages annonçant qu'aucun organisme n'est référencé. Google évalue alors la famille entière comme faible, ce qui pénalise le silo au-delà des seules pages vides.

### Conditions de création d'une page ville

Trois conditions **cumulatives**, vérifiées manuellement :

1. **5 organismes minimum.** En dessous, la page n'a pas assez de substance à côté de la page département.
2. **Un volume de recherche réel** sur le couple ville + formation, vérifié avant création.
3. **Du contenu propre**, qui ne se limite pas à ce que dit déjà la page département.

La liste des villes couvertes est maintenue manuellement, comme le référentiel des titres. Jamais de génération automatique.

### Le cas de Paris

Paris est à la fois ville et département. **Traitement retenu : département uniquement, une seule page.** Si le volume le justifie plus tard, descendre aux arrondissements ou aux grands secteurs — jamais créer une page « ville de Paris » qui doublonnerait avec la page département.

---

## 3. Règles anti-cannibalisation

C'est la principale source de doublons internes du silo. Trois frontières à tenir.

**Avec les pages formation** — la page formation liste les zones sans les développer ; la page département liste les titres sans les développer. Chacune renvoie vers l'autre. Aucune des deux ne traite « le TFP APS en Seine-Saint-Denis » en profondeur.

**Avec le catalogue** — le catalogue est la page canonique de l'inventaire global. La page département en est une vue éditorialisée par zone : même listing, mais entouré de contenu que le catalogue n'a pas.

**Avec les futures pages ville** — la page département traite le département dans son ensemble : panorama, comparaison entre les villes, ce qui le distingue des départements voisins. La page ville traite ce qui est spécifique à la ville. La page département **liste** les villes et renvoie vers elles, elle ne les développe pas.

### Interdiction absolue

**Pas de pages titre × département.** `/tfp-aps-seine-saint-denis/` multiplierait 25 titres par 8 départements, soit 200 pages quasi identiques. C'est le piège classique des annuaires, et il détruit l'évaluation du silo entier.

---

## 4. Ordre des blocs

| # | Bloc | Fonction dominante |
|---|---|---|
| 1 | Fil d'Ariane | Maillage remontant |
| 2 | En-tête + ligne de faits | Contexte et snippet |
| 3 | Chapô court | Contenu propre |
| 4 | **Les formations disponibles dans le département** | **Contenu unique** |
| 5 | **Les organismes du département** | **Cœur de page** |
| 6 | Répartition par ville | Orientation et pilotage |
| 7 | **Se former dans ce département** | **Justification éditoriale** |
| 8 | Départements voisins | Maillage latéral |
| 9 | Démarches CNAPS | Maillage adjacent |
| 10 | FAQ | Longue traîne |
| 11 | Footer | Maillage secondaire |

---

## 5. Détail des blocs

### 1. Fil d'Ariane

**Contenu** — `Sécurité privée > [Nom du département]`.

**SEO** — balisage `BreadcrumbList`. Seul lien remontant vers la tête de silo.

---

### 2. En-tête + ligne de faits

**Contenu** — H1 portant le nom du département, une phrase de contexte, puis une ligne de faits : nombre d'organismes, nombre de villes couvertes, nombre de titres disponibles localement.

**Contrainte de hauteur** — même logique que le catalogue : l'en-tête ne doit pas repousser le contenu hors du premier écran.

**Conditionnement** — les compteurs suivent la règle du seuil. Tout ou rien, jamais un compteur partiel.

---

### 3. Chapô court

**Contenu** — 150 mots : ce que le département représente pour ce secteur, ce qu'on y trouve et ce qu'on n'y trouve pas.

**Pourquoi court et ici** — il donne du contenu propre au-dessus de la ligne de flottaison sans repousser le listing. Le développement vit au bloc 7.

---

### 4. Les formations disponibles dans le département

> **Bloc de contenu unique de la page.**

**Contenu** — une grille ou un tableau croisant les titres du référentiel avec le nombre d'organismes qui les proposent localement.

**Pourquoi c'est le bloc le plus précieux** — c'est de la donnée que personne d'autre ne possède, générée par l'inventaire. Et c'est réellement utile : si le SSIAP 3 n'est proposé nulle part dans le département, le visiteur doit le savoir immédiatement plutôt que de filtrer et tomber sur zéro résultat.

**Maillage** — chaque titre est un lien vers sa page formation. Aucun développement du titre ici.

**Règle** — ne lier que vers des pages formation publiées, conformément au statut par titre.

---

### 5. Les organismes du département

> **Cœur de la page.**

**Contenu** — le listing **complet** des organismes ayant au moins un lieu dans le département. Cartes identiques à celles du catalogue, tri par score de complétude, pagination si l'inventaire le justifie.

**Pourquoi complet et pas un échantillon** — c'est ce qui remplace le filtre géographique non indexable. Un échantillon ne remplit pas ce rôle.

**Rappel du modèle** — le rattachement se fait sur **l'ensemble des lieux** d'un organisme, pas seulement son siège. Un organisme dont le siège est à Paris mais qui dispense dans le 93 apparaît sur les deux pages.

**SEO** — balisage `ItemList`, liens `<a>` en dur, pagination numérotée. Mêmes règles que le catalogue.

---

### 6. Répartition par ville

**Contenu** — les villes du département avec leur nombre d'organismes.

**Traitement des liens** — en texte simple tant qu'aucune page ville n'existe. Le jour où une ville remplit les trois conditions de la section 2, son libellé devient un lien.

**Double fonction** — le bloc aide le visiteur à situer les centres, et il indique quelles villes justifieront une page. C'est l'outil de pilotage de l'extension géographique.

---

### 7. Se former dans ce département — informations pratiques

**Contenu** — accès en transports, spécificités du bassin d'emploi local, employeurs du secteur présents dans la zone, particularités éventuelles de l'offre locale.

> **C'est le bloc qui empêche la page d'être un catalogue filtré déguisé.**

**Pourquoi il est indispensable** — sans lui, il n'existe aucune raison éditoriale que cette page soit indexée plutôt que le filtre du catalogue. C'est aussi le bloc le plus coûteux : il ne peut pas être généré, il s'écrit département par département.

---

### 8. Départements voisins

**Contenu** — liens vers les départements limitrophes, avec compteurs.

**Pourquoi** — quelqu'un dans le 93 peut se former dans le 75 ou le 94 sans difficulté. Le bloc évite la page cul-de-sac quand l'offre locale ne convient pas.

---

### 9. Démarches CNAPS

**Contenu** — liens vers les pages démarche.

**Note** — la délégation territoriale compétente est la même pour toute l'Île-de-France. Pas de contenu spécifique par département, uniquement du maillage.

---

### 10. FAQ

**Contenu** — 5 à 8 questions locales : combien de centres dans ce département, quels titres y sont disponibles, faut-il se former dans son département de résidence.

**SEO** — balisage `FAQPage`. Questions distinctes de celles de l'accueil, du catalogue, des pages formation et des autres pages départementales. Sur 8 pages voisines, le risque de FAQ interchangeables est élevé.

---

### 11. Footer

Identique au footer global du silo.

---

## 6. Le risque du gabarit répété

Huit pages construites sur le même squelette, avec pour seule variable le nom du département et les chiffres, forment une famille de pages faibles.

Les blocs 4 et 5 sont générés par la donnée : ils sont uniques mécaniquement, mais ils ne suffisent pas à différencier éditorialement. **Le bloc 7 est le seul contenu réellement rédigé, et c'est donc lui qui justifie la page.**

**Règle : si l'on ne peut pas écrire 300 mots spécifiques sur un département, sa page n'est pas créée.** Mieux vaut six pages solides que huit dont deux sont des coquilles.

---

## 7. Version de lancement

Ces pages sont les plus dépendantes de l'inventaire du silo — davantage que le catalogue, qui reste utile même maigre, alors qu'une page département sans organisme n'a aucune raison d'exister.

Trois positions étaient possibles :

- publier les 8 pages dès le lancement avec un contenu éditorial renforcé
- **ne publier que les départements atteignant un seuil d'organismes**
- garder les pages en `noindex` jusqu'au seuil

**Position retenue : la deuxième.** Une page département existe quand elle a de quoi exister. C'est plus simple à piloter qu'une bascule d'indexation, et cela évite de publier huit pages vides le jour du lancement.

**Conséquence de navigation** — le bloc géographique de l'accueil et le maillage bas du catalogue ne pointent que vers des pages **existantes**. Le libellé d'un département sans page reste non cliquable, exactement comme un titre sans page formation publiée.

---

## 8. Règles d'indexation

- Une page département publiée est indexable et canonique sur sa zone.
- Elle ne doit jamais coexister avec une URL de filtre indexable sur la même zone. C'est l'interdiction absolue posée dans la structure d'URL.
- Pagination : mêmes règles que le catalogue — auto-canonisation de chaque page, jamais de `canonical` vers la page 1.
- Une page département sous le seuil n'est pas publiée. Elle n'est donc ni indexable ni liée.

---

## 9. Règles techniques transverses

- **Rendu côté serveur** pour tout le contenu textuel et tous les liens.
- **Un seul H1**, portant le nom du département.
- Données structurées : `BreadcrumbList`, `ItemList` sur le listing, `FAQPage` sur la FAQ.
- Aucun élément cliquable sans balise `<a>`.
- Carte éventuelle en chargement différé, jamais bloquante.

---

## 10. Ce qu'il ne faut pas mettre

- Une page par couple titre × département
- Une page générée automatiquement pour chaque commune
- Un échantillon d'organismes à la place du listing complet
- Le développement d'un titre de formation — il vit sur sa page
- Un lien vers une page ville ou une page formation non publiée
- Une FAQ interchangeable d'un département à l'autre
- Une page département sans les 300 mots spécifiques du bloc 7

---

## 11. Points ouverts

- **Chiffrer le seuil de publication d'une page département** — distinct du seuil d'affichage des compteurs, qui concerne l'affichage et non l'existence de la page.
- **Confirmer le seuil de 5 organismes** pour la création d'une page ville, une fois la répartition réelle connue.
- **Produire le contenu du bloc 7** pour chaque département : c'est le travail éditorial le plus lourd de cette famille de pages.
- **Décider du traitement de Paris** si le volume justifie une descente aux arrondissements.

---

## 12. Documents liés

- **Note de cadrage** — concept, modèle économique, go-to-market
- **Architecture des pages** — inventaire des pages et de leurs rôles
- **Structure d'URL** — nommage, arborescence, règles d'indexation
- **UX Page d'accueil** — tête de silo
- **UX Catalogue organismes** — page canonique du catalogue
- **UX Landing organismes** — sas de conversion B2B
- **UX Page pilier par titre** — contenu réglementaire des formations
- **UX Fiche organisme** — page produit de l'organisme
- **UX Pages démarche CNAPS** — procédures administratives
- **À produire** — parcours du formulaire d'affinage, blog, pages utilitaires
