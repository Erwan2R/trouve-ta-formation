# Spécification UX — Catalogue organismes

**Trouve ta formation — Verticale sécurité privée**
`trouve-ta-formation.fr/securite-privee/organismes/`
Version 1.0 — 30 août 2026

---

## 1. Rôle de la page

Page canonique du catalogue. Une seule fonction : **permettre de trouver un organisme et de l'éliminer ou le retenir sans avoir à ouvrir sa fiche.**

L'unité listée est l'organisme, jamais la formation. Un organisme apparaît une fois, quel que soit son nombre de sites et de formations déclarées.

### Ce qu'elle n'est pas

- Ce n'est pas la tête de silo. Le corps éditorial transversal, la grille par titre et les démarches vivent sur `/securite-privee/`.
- Ce n'est pas une page géographique. Filtrer sur le 93 ne remplace pas `/securite-privee/seine-saint-denis/`, qui est éditorialisée et indexable.
- Ce n'est pas une page de titre. Filtrer sur SSIAP 1 ne remplace pas la page pilier.

### Intention et requêtes visées

| | |
|---|---|
| Intention | « je cherche un centre » |
| Requêtes | *organisme de formation sécurité privée*, *centre de formation agent de sécurité*, *école agent de sécurité Île-de-France* |
| Requêtes explicitement **non** visées | *formation sécurité privée* → accueil · *formation TFP APS* → page pilier |

---

## 2. Principe d'organisation

**Le premier résultat doit être visible sans scroller, ou presque.** Tout ce qui vit au-dessus du listing est du budget dépensé sur autre chose que ce que le visiteur est venu chercher.

Conséquence : en-tête court, chapô court, et les résultats immédiatement après.

---

## 3. Ordre des blocs

| # | Bloc | Fonction dominante |
|---|---|---|
| 1 | Fil d'Ariane | Maillage remontant |
| 2 | En-tête de page | Contexte |
| 3 | Recherche + tri + bouton carte | Outil |
| 4 | Chapô éditorial court | Contenu propre |
| 5 | Filtres (colonne gauche / tiroir mobile) | Outil |
| 6 | Compteur de résultats | Lisibilité du filtrage |
| 7 | **Listing des organismes** | **Cœur de page** |
| 8 | Pagination | Crawl |
| 9 | Bloc « votre organisme n'est pas référencé ? » | Conversion B2B |
| 10 | Maillage par titre de formation | Distribution d'autorité |
| 11 | Maillage géographique | Distribution d'autorité |
| 12 | Corps éditorial développé | Profondeur sémantique |
| 13 | FAQ | Longue traîne |
| 14 | Footer | Maillage secondaire |

---

## 4. Détail des blocs

### 1. Fil d'Ariane

**Contenu** — `Sécurité privée > Organismes de formation`.

**Pourquoi ici** — c'est le seul lien remontant vers la tête de silo depuis cette page, et la page est en profondeur 2.

**SEO** — balisage `BreadcrumbList`.

---

### 2. En-tête de page

**Contenu** — H1 unique, une phrase de contexte, compteur d'organismes référencés.

**Contrainte de hauteur** — cet en-tête ne doit pas dépasser 120 px. Un en-tête généreux repousse le premier résultat hors du premier écran, ce qui est le seul vrai défaut rédhibitoire d'une page de listing.

**Conditionnement** — le compteur suit la même règle que sur l'accueil : affiché au-dessus du seuil, masqué en dessous. Jamais un compteur partiel.

---

### 3. Recherche + tri + bouton carte

**Contenu** — un champ de recherche par nom d'organisme, un sélecteur de tri, un bouton « Voir sur la carte ».

**Pourquoi la recherche par nom** — usage réel : quelqu'un a reçu un devis d'un centre et vérifie qu'il existe. Valeur cachée : les recherches infructueuses indiquent quels organismes manquent dans la base. C'est de la donnée de prospection gratuite, à logger dès la V1.

**Tri par défaut : score de complétude de fiche.** Ce choix est structurant — c'est l'emplacement de la future mise en avant payante, et il doit exister comme paramètre configurable dès le lancement. Il récompense les organismes qui remplissent leur espace, ce qui sert le go-to-market, et il évite un ordre aléatoire qui rendrait la page instable pour les moteurs.

**Options de tri manuel** — alphabétique, par ville. Aucune ne génère d'URL indexable.

---

### 4. Chapô éditorial court

**Contenu** — 150 mots maximum : ce qu'est un organisme agréé CNAPS, la différence entre agrément CNAPS et certification Qualiopi, ce que le référencement dans l'annuaire signifie et ne signifie pas.

**Pourquoi ici et court** — c'est le contenu qui empêche la page d'être évaluée comme un listing nu. Placé au-dessus des résultats, il donne du contenu au-dessus de la ligne de flottaison sans coûter plus de 120 px. Le développement long vit au bloc 12.

---

### 5. Filtres

**Position** — colonne gauche en desktop. En mobile : tiroir déclenché par un bouton sticky, avec un compteur de filtres actifs. **Ne jamais empiler les filtres verticalement au-dessus des résultats en mobile** — c'est deux écrans de scroll avant le premier organisme.

#### Filtres retenus en V1

| Filtre | Type | Note |
|---|---|---|
| **Localisation** | Hiérarchisé | Département en premier niveau. La ville n'apparaît qu'une fois un département sélectionné, sinon on affiche une liste de 80 communes dont la moitié a un seul organisme. |
| **Type de formation** | Multi-sélection | Filtre principal, celui qui justifie la page. Alimenté par le référentiel fermé. |
| **Financement accepté** | Multi-sélection | CPF, France Travail, OPCO. Le critère qui élimine le plus brutalement : quelqu'un qui n'a que son CPF ne peut pas envisager un centre qui ne le prend pas. |
| **Rythme** | Multi-sélection | Temps plein intensif, cours du soir, week-end. Critère de faisabilité réel pour un candidat déjà en poste — cas fréquent sur les MAC. |
| **Qualiopi** | Booléen | Signal de qualité normé, et condition d'accès aux financements publics. |

#### Règles d'implémentation

- **Afficher le nombre de résultats à côté de chaque option**, et griser celles qui renvoient zéro. Un filtre qui mène à une page vide est une trahison de l'interface.
- **Aucun filtre ne crée d'URL indexable.** Voir section 7.
- **Lien contextuel vers la page éditorialisée** quand un filtre y correspond. L'utilisateur qui coche « Seine-Saint-Denis » voit une bande « Voir la page dédiée à la Seine-Saint-Denis ». Le filtre sert l'usage, la page sert le référencement, et l'usage devient du maillage interne.

#### Filtres écartés et pourquoi

**Prix — reporté en V2.** Le champ ne sera pas rempli de façon fiable : l'ajout de formations n'est pas bloquant à l'inscription, le prix le sera encore moins. Un organisme sans tarif renseigné disparaîtrait de toutes les fourchettes, donc serait puni pour un champ vide. À réévaluer quand le taux de remplissage sera connu — en dessous de 60 %, le filtre fait plus de dégâts qu'il n'apporte.

Si le filtre est activé plus tard : afficher les fiches sans prix **en bas des résultats filtrés**, mention « tarif non communiqué », plutôt que de les exclure.

**Avis — écarté comme filtre, à afficher sur la fiche.** Deux raisons. Techniquement, les avis Google ne sont exploitables que via l'API officielle, avec attribution obligatoire, sans droit de stockage durable ni de construction d'un tri par-dessus. Produit : la note de cadrage exclut explicitement le système d'avis, et un filtre par note ferait basculer le produit dans la catégorie comparateur qu'on a choisi de ne pas occuper. Une bascule ultérieure vers des avis maison créerait en plus une rupture illisible (4,6 étoiles pendant un an, puis « pas encore noté »).

Position retenue : afficher la note Google sur la fiche organisme avec l'attribution requise, sans en faire un filtre ni un critère de tri.

**Format (présentiel / visio) — sans objet.** Les titres de la sécurité privée sont majoritairement en présentiel obligatoire : le CNAPS impose des volumes horaires pratiques encadrés qui ne se font pas à distance. Le filtre afficherait « présentiel » sur la quasi-totalité des fiches. Un filtre dont une valeur écrase toutes les autres n'est pas un filtre. Remplacé par le filtre rythme.

---

### 6. Compteur de résultats

**Contenu** — « 247 organismes » / « 34 organismes correspondent à votre recherche ».

**Pourquoi** — c'est ce qui rend le filtrage lisible. Mise à jour dynamique à chaque changement de filtre.

---

### 7. Listing des organismes

> **Cœur de la page.**

**Contenu de chaque carte** — nom, logo, ville et département du siège, mention des lieux additionnels le cas échéant, titres proposés en puces, financements acceptés, badge Qualiopi si applicable.

**Principe de composition** — chaque carte doit permettre d'éliminer ou de retenir un organisme **sans cliquer**. Un listing où il faut ouvrir chaque fiche pour savoir si elle est pertinente est un listing raté. Les titres proposés sont l'information la plus discriminante : c'est elle qui doit être la plus lisible après le nom.

**Cas de la fiche sans formation déclarée** — elle apparaît dans le catalogue non filtré, jamais dans un filtre par titre. La carte doit rester lisible sans la liste de titres, sans afficher un vide visuel.

**SEO** — balisage `ItemList` avec `ListItem` positionnés. Chaque carte contient un lien `<a>` en dur vers la fiche, jamais un `onClick`. Le nom de l'organisme est l'ancre.

#### Les quatre états

| État | Traitement |
|---|---|
| **Résultats normaux** | Grille standard |
| **Résultat unique** | Mise en page adaptée — la grille est absurde pour un seul élément |
| **Zéro résultat** | Ne jamais afficher une page vide. Proposer le relâchement du filtre le plus restrictif, ou basculer sur le département voisin. Rappeler quels filtres sont actifs. |
| **Chargement** | Squelettes de cartes, pas un spinner, pour éviter le décalage de mise en page (CLS) |

Les trois derniers états sont systématiquement oubliés en spécification et bricolés en développement. Ils sont à maquetter au même titre que l'état nominal.

---

### 8. Pagination

**Contenu** — pagination numérotée classique, liens `<a href>` en dur sur chaque numéro.

**Pas de scroll infini.** Il rend le contenu inaccessible au crawl au-delà du premier lot et casse le retour arrière depuis une fiche organisme. C'est le plus mauvais choix possible sur une page dont le rôle est de faire découvrir des URLs.

**SEO**
- 20 à 30 résultats par page.
- Chaque page paginée s'auto-canonise. Ne jamais poser de `canonical` des pages 2+ vers la page 1 : ce serait désindexer tout l'inventaire au-delà du premier lot.
- Si l'inventaire ne justifie pas l'indexation des pages profondes, `noindex, follow` à partir de la page 2 — jamais `noindex, nofollow`.

---

### 9. Bloc « votre organisme n'est pas référencé ? »

**Contenu** — un bloc court en fin de listing, lien vers la landing B2B.

**Pourquoi ici et pas sur l'accueil** — sur cette page, l'audience B2B est bien plus probable : un dirigeant qui cherche ses concurrents atterrit ici. C'est le meilleur emplacement de conversion organisme après l'email de prise de contact.

---

### 10. Maillage par titre de formation

**Contenu** — grille de liens vers les pages piliers, avec compteur d'organismes par titre.

**Pourquoi ici** — l'utilisateur arrivé en bas d'un listing sans avoir trouvé son bonheur a besoin d'une sortie. Et c'est du maillage descendant vers les pages qui portent le trafic principal.

---

### 11. Maillage géographique

**Contenu** — les 8 départements franciliens et les villes couvertes, avec compteurs.

**SEO** — ces liens ne pointent que vers des pages géographiques éditorialisées existantes, jamais vers un filtre du catalogue.

Ces deux blocs de maillage sont la raison pour laquelle un catalogue vaut mieux qu'un listing nu : ils redistribuent l'autorité de la page vers l'ensemble du silo.

---

### 12. Corps éditorial développé

**Contenu** — 400 à 800 mots : comment vérifier l'agrément CNAPS d'un organisme, ce que garantit Qualiopi, comment se déroule une inscription en formation, les pièges à éviter dans le choix d'un centre.

**Pourquoi ici, en bas** — le visiteur qui filtre ne lit pas. Mais ce contenu donne à la page la substance nécessaire pour ranker sur *organisme de formation sécurité privée*, et il est distinct de celui de l'accueil.

**Règle anti-cannibalisation** — l'accueil traite « quelle formation choisir ». Cette page traite « comment choisir un organisme ». Aucun recoupement.

**SEO** — hiérarchie H2/H3 propre, rendu côté serveur.

---

### 13. FAQ

**Contenu** — 5 à 8 questions spécifiques au choix d'un organisme : comment vérifier un agrément, que vaut Qualiopi, comment un centre est-il référencé ici, faut-il payer pour y figurer.

**SEO** — balisage `FAQPage`. Questions distinctes de celles de l'accueil et des pages piliers, sans quoi le contenu est dupliqué à l'intérieur du silo.

---

### 14. Footer

Identique au footer global du silo.

---

## 5. La carte

**Déclenchement** — la carte n'est pas présente sur la page. Elle s'ouvre au clic sur un bouton dédié, en modale ou overlay.

**Pourquoi ce choix** — la carte est lourde, elle dégrade le LCP, son contenu n'est pas indexable, et elle n'apporte rien à quelqu'un qui n'a pas encore filtré. Un chargement à la demande garantit qu'elle ne pèse jamais sur le rendu initial.

### Trois règles actées

**La carte hérite des filtres actifs.** Si l'utilisateur a filtré sur SSIAP 1 et le 93, la carte affiche ce sous-ensemble. Une carte qui repart de zéro annule le travail de filtrage.

**Pas de changement d'URL.** Modale ou overlay. Si une URL dédiée est retenue, elle est en `noindex` — sinon elle crée un doublon du catalogue sans contenu textuel.

**Les marqueurs représentent les lieux, pas les organismes.** Un organisme avec trois sites produit trois marqueurs, puisque c'est là qu'on se rend physiquement.

**Conséquence à afficher explicitement dans l'interface :** le compteur de la carte ne correspond pas à celui du listing. Écrire « 247 organismes · 310 lieux de formation ». Sans cette mention, l'écart remonte en recette comme un bug.

---

## 6. Version de lancement — le démarrage à froid

Cette page est la plus exposée au catalogue vide. L'accueil peut vivre sans inventaire : elle a ses titres, ses démarches, son corps éditorial. Le catalogue, lui, n'est *que* de l'inventaire.

Avec quinze organismes, la page tient en un écran et la moitié des combinaisons de filtres renvoie zéro.

| Élément | Sous le seuil | Au-dessus du seuil |
|---|---|---|
| Compteur d'organismes | Masqué | Affiché |
| Compteurs par option de filtre | Masqués | Affichés |
| Filtres | Affichés mais options vides grisées | Actifs |
| Pagination | Absente | Présente |
| Corps éditorial | Remonté et développé | Position 12 |

**Point ouvert — indexation du catalogue au lancement.** Deux positions défendables :

- **Indexable dès le lancement**, avec un corps éditorial renforcé pour compenser la faiblesse de l'inventaire. Avantage : pas de bascule à gérer, signal stable.
- **`noindex` tant que l'inventaire est trop faible**, puis passage en indexable. Avantage : une page canonique faible ne pénalise pas le silo. Inconvénient : bascule à piloter, et perte de l'antériorité.

**Recommandation : indexable dès le lancement.** Le risque d'une page canonique faible est réel mais mesuré si le contenu éditorial est substantiel ; le risque d'une bascule mal pilotée l'est davantage. À réévaluer si l'inventaire stagne au-delà de trois mois.

---

## 7. Règles d'indexation

> **Section critique.** Reprise de la structure d'URL, appliquée à cette page.

- La page **sans paramètre** est indexable et canonique.
- Toute URL avec **filtre actif** est en `noindex, follow` avec `canonical` vers la version nue.
- Trois implémentations acceptables : filtrage côté client sans changement d'URL, query string avec `noindex` + `canonical`, ou fragments d'URL (`#dept=93`) invisibles pour les moteurs.

### Interdictions absolues

- **Le filtre géographique ne crée jamais d'URL indexable.** Ce rôle appartient aux pages géographiques éditorialisées. Laisser coexister `/organismes/?dept=93` et `/securite-privee/seine-saint-denis/` crée un doublon interne et laisse le moteur choisir la mauvaise page.
- **Le filtre par titre ne crée jamais d'URL indexable.** Ce rôle appartient à la page pilier.

---

## 8. Règles techniques transverses

- **Rendu côté serveur** pour tout le contenu textuel et tous les liens.
- **Un seul H1.**
- Données structurées : `ItemList` sur le listing, `BreadcrumbList`, `FAQPage` sur la FAQ.
- Aucun élément cliquable sans balise `<a>`. Aucune carte de résultat gérée par `onClick` seul.
- Logos en WebP, dimensions explicites.
- Carte en chargement à la demande, jamais bloquante pour le rendu.

---

## 9. Ce qu'il ne faut pas mettre

- Un scroll infini
- Un `canonical` des pages 2+ vers la page 1
- Des filtres générant des URLs indexables
- Une carte affichée par défaut
- Un filtre alimenté par un champ facultatif peu rempli
- Un filtre dont une valeur écrase toutes les autres
- Le corps éditorial transversal de l'accueil, dupliqué ici

---

## 10. Points ouverts

- **Chiffrer le seuil d'affichage du compteur** — commun à l'accueil et au catalogue, piloté par un seul paramètre de configuration.
- **Définir le calcul du score de complétude** — il pilote le tri par défaut de cette page, la sélection de l'échantillon d'organismes sur l'accueil, et le seuil de `noindex` des fiches.
- **Arrêter la liste des titres du référentiel** — elle alimente le filtre principal.
- **Arbitrer l'indexation du catalogue au lancement** — recommandation en section 6.
- **Décider du log des recherches infructueuses** — valeur de prospection, à cadrer côté données personnelles.

---

## 11. Documents liés

- **Note de cadrage** — concept, modèle économique, go-to-market
- **Architecture des pages** — inventaire des pages et de leurs rôles
- **Structure d'URL** — nommage, arborescence, règles d'indexation
- **UX Page d'accueil** — tête de silo
- **À produire** — spécification UX de la fiche organisme et de la page pilier
