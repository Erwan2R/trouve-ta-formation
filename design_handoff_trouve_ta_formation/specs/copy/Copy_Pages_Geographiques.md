# Copy — Pages géographiques

**Trouve ta formation — Verticale sécurité privée**
`trouve-ta-formation.fr/securite-privee/[departement]/`
Version 1.0 — 1er septembre 2026
Environnement : **Not Log** — intention candidat, « me former près de chez moi »

---

## 0. Le problème de cette famille

Huit pages, un gabarit. Le même squelette, les mêmes titres de blocs, les mêmes questions de FAQ, avec pour seule variable le nom d'un département et des chiffres.

C'est le même risque que la fiche organisme, mais avec une différence qui le rend plus sévère : **les huit pages sont voisines sur le même sujet.** Trois cents fiches d'organismes portent trois cents noms propres différents et se disputent des requêtes nominatives distinctes. Huit pages départementales se disputent la même requête à un mot près, et si elles disent la même chose, elles se neutralisent entre elles avant même d'affaiblir le silo.

**Le bloc 7 est donc la page.** Tout le reste — listing, grille des titres, répartition par ville, FAQ — est généré par la donnée et sera structurellement similaire d'un département à l'autre. Le seul contenu rédigé est ce qui distingue la Seine-Saint-Denis des Yvelines.

**Ce que je peux et ne peux pas faire.** Je peux poser les gabarits, les règles de variabilisation, la méthode de collecte et un angle éditorial argumenté par département. Je ne peux pas écrire les 300 mots à ta place : ils demandent une connaissance du terrain que je n'ai pas, et une page départementale remplie de généralités inventées est exactement ce que la spécification interdit.

La section 13 est donc construite comme un plan de travail, pas comme une copy finale.

---

## 1. Slugs

| Département | Slug |
|---|---|
| Paris (75) | `paris` |
| Seine-et-Marne (77) | `seine-et-marne` |
| Yvelines (78) | `yvelines` |
| Essonne (91) | `essonne` |
| Hauts-de-Seine (92) | `hauts-de-seine` |
| Seine-Saint-Denis (93) | `seine-saint-denis` |
| Val-de-Marne (94) | `val-de-marne` |
| Val-d'Oise (95) | `val-d-oise` |

**Aucun numéro dans le slug.** `/93/` serait plus court mais illisible hors contexte, et il ouvrirait la porte à des slugs numériques dans le reste de l'arborescence. Le numéro vit dans le H1, le title et les libellés de liens, là où il sert la reconnaissance.

**Vérification de collision** — aucun de ces slugs n'entre en conflit avec les slugs réservés du silo ni avec les 12 slugs du référentiel des titres. À refaire à chaque ajout de page ville.

---

## 2. Métadonnées — gabarits

### Balise `<title>`

```
Formation sécurité privée en [Département] ([nn]) : organismes et titres
```

**Exemple** — *Formation sécurité privée en Seine-Saint-Denis (93) : organismes et titres* — 71 caractères, tronqué à l'affichage mais le mot-clé et la zone sont en tête.

**Variante courte** pour les noms longs — `Formation sécurité privée en Seine-Saint-Denis (93)`.

**Pourquoi reprendre le gabarit de l'accueil** — l'accueil cible « formation sécurité privée en Île-de-France », les pages départementales la même expression avec une zone plus fine. Il n'y a pas de cannibalisation : ce sont des zones emboîtées, pas concurrentes, et le catalogue ne cible aucune zone.

### Meta description — cascade

| Condition | Gabarit |
|---|---|
| **Nominal** | `Les [N] organismes de formation à la sécurité privée en [Département] ([nn]). Titres préparés, villes couvertes, financements acceptés et démarches CNAPS.` |
| **Sous le seuil d'affichage des compteurs** | `Les organismes de formation à la sécurité privée en [Département] ([nn]). Titres préparés, villes couvertes, financements acceptés et démarches CNAPS.` |

### Open Graph

`og:title` reprend le H1. `og:description` reprend les 150 premiers caractères du chapô du bloc 3, qui est du texte rédigé et donc propre à chaque département.

---

## 3. Bloc 1 — Fil d'Ariane

> Sécurité privée › **[Département] ([nn])**

Balisage `BreadcrumbList`.

---

## 4. Bloc 2 — En-tête et ligne de faits

### H1

> **Formation sécurité privée en [Département] ([nn])**

**Variantes écartées** — « Les organismes de formation en Seine-Saint-Denis » perd l'expression cible. « Se former à la sécurité privée en Seine-Saint-Denis » est plus naturel mais moins direct sur la requête.

**Cas de Paris** — le H1 devient **Formation sécurité privée à Paris (75)**. La préposition change, le gabarit doit le prévoir : *en* pour la Seine-Saint-Denis, les Yvelines, l'Essonne ; *dans les* pour les Hauts-de-Seine et le Val-de-Marne ; *dans le* pour le Val-d'Oise ; *à* pour Paris ; *en* pour la Seine-et-Marne.

**Note d'implémentation** — la préposition est une donnée du département, pas une règle calculée. Une table de huit entrées, saisie une fois.

### Phrase de contexte

> Les organismes qui préparent aux titres de la sécurité privée dans le département, avec les titres qu'ils dispensent et les villes où ils sont implantés.

*Fixe. Une seule phrase, volontairement banale : le contenu propre est au chapô juste dessous.*

### Ligne de faits

> **[N] organismes · [M] villes · [P] titres disponibles**

**Le troisième compteur est le plus utile des trois**, et c'est celui qu'aucun concurrent ne peut afficher. Il dit au visiteur, avant tout scroll, si ce qu'il cherche existe localement.

**Sous le seuil** — la ligne entière disparaît. Pas de compteur partiel, règle constante sur tout le silo.

---

## 5. Bloc 3 — Chapô

> 150 mots. **Rédigé par département, jamais généré.**

C'est le premier des deux blocs de texte propre. Sa fonction : donner du contenu unique au-dessus de la ligne de flottaison, sans repousser le listing.

**Structure recommandée, en trois temps**

1. Ce que le département représente pour le secteur — en une phrase, l'angle spécifique retenu
2. Ce qu'on y trouve — les titres bien couverts localement
3. Ce qu'on n'y trouve pas — les titres absents ou rares, avec le département de repli

**Pourquoi le troisième temps compte autant que les deux premiers.** C'est ce qui distingue une page utile d'une page promotionnelle. Un visiteur qui apprend en dix secondes que le SSIAP 3 ne se prépare nulle part dans son département est mieux servi qu'un visiteur à qui on laisse filtrer jusqu'au zéro résultat. Et pour la page, c'est du contenu que personne d'autre ne possède.

**Squelette de rédaction**

> [Angle spécifique du département, une phrase.] Les organismes référencés y préparent principalement au [titres dominants], [précision sur la concentration géographique ou le type d'offre].
>
> [Titre absent ou rare] n'est proposé par aucun centre du département : les organismes les plus proches se trouvent en [département voisin].

**Contrainte** — les titres cités doivent venir de l'inventaire réel, pas d'une rédaction figée. Un chapô écrit à la main qui affirme une absence devenue fausse est un mensonge automatique. Prévoir que les mentions de disponibilité soient des variables, ou réviser les chapôs à chaque évolution notable de l'inventaire.

---

## 6. Bloc 4 — Les formations disponibles dans le département

### Titre de bloc

> **Les titres préparés en [Département]**

### Contenu

Tableau croisant les 12 titres du référentiel avec le nombre d'organismes qui les proposent localement.

| Colonne | Contenu |
|---|---|
| Titre | Libellé court, **lien vers la page pilier** |
| Organismes | Nombre, dans le département |
| Villes | Où le titre est proposé, deux ou trois maximum |

### Les titres absents

**Affichés, grisés, non cliquables**, avec une mention de repli :

> **SSIAP 3** — Non proposé dans le département · *Voir les organismes en [département voisin] →*

**Pourquoi afficher les absents plutôt que les masquer** — c'est le cœur de l'utilité du bloc. Un tableau qui ne montre que ce qui existe ne répond pas à la question du visiteur, qui est « est-ce que ce que je cherche est là ». Et l'affichage des absences produit une variation forte d'un département à l'autre, ce qui sert directement l'objectif anti-gabarit.

**Le lien de repli pointe vers un département voisin qui propose le titre**, choisi automatiquement parmi les limitrophes, par nombre d'organismes décroissant. Si aucun voisin ne le propose, le lien pointe vers la page pilier du titre.

### Groupement

Par catégorie du référentiel, dans l'ordre défini : surveillance humaine, sécurité incendie, cynophile, sûreté aéroportuaire, protection des personnes.

---

## 7. Bloc 5 — Les organismes du département

### Titre de bloc

> **Les organismes de formation en [Département]**

### Ligne sous le titre

> Tous les organismes disposant d'au moins un lieu de formation dans le département.

**Pourquoi cette précision explicite** — le rattachement se fait sur l'ensemble des lieux, pas sur le siège. Un organisme parisien dispensant à Bobigny apparaît sur les deux pages, et un visiteur attentif qui reconnaît une adresse parisienne dans une liste « Seine-Saint-Denis » y verrait une erreur. Une ligne suffit à l'éviter.

### Cartes

Identiques à celles du catalogue. **Listing complet, jamais un échantillon** — c'est ce qui remplace le filtre géographique non indexable.

**Une adaptation par rapport au catalogue** — la ligne de localisation affiche le lieu situé **dans ce département**, pas le siège. Un organisme parisien apparaissant sur la page Seine-Saint-Denis y affiche son adresse de Bobigny.

### Pagination

Mêmes libellés que le catalogue : **Précédent** · **Page 2 sur 4** · **Suivant**.

---

## 8. Bloc 6 — Répartition par ville

### Titre de bloc

> **Où se trouvent les centres**

*Variante écartée : « Répartition par ville », qui est le nom de la fonction, pas ce que le visiteur y cherche.*

### Contenu

Liste des villes du département avec leur nombre d'organismes, par ordre décroissant.

> Bobigny **· 6** · Saint-Denis **· 4** · Montreuil **· 3** · Aubervilliers **· 2** · Pantin **· 1**

**Texte simple tant qu'aucune page ville n'existe.** Le libellé devient un lien le jour où la ville remplit les trois conditions de création.

### Sous le seuil d'affichage des compteurs

Villes listées sans nombre, par ordre alphabétique. Le bloc conserve son utilité d'orientation.

---

## 9. Bloc 7 — Se former dans ce département

> **Le bloc qui justifie l'existence de la page.** Traité en détail en section 13.

### Titre de bloc

> **Se former à la sécurité privée en [Département]**

### Sous-titres recommandés

| H3 | Ce qu'il traite |
|---|---|
| **Le bassin d'emploi** | Ce qui emploie des agents de sécurité dans le département, et ce que ça implique sur les titres à viser |
| **Accéder aux centres de formation** | Transports, concentration géographique de l'offre, temps de trajet réalistes |
| **Ce qui distingue [Département]** | La particularité locale, positive ou négative |

**Ces trois H3 sont un cadre, pas une obligation.** Un département dont la spécificité tient entièrement à un seul fait n'a pas besoin de trois sections. Mieux vaut 300 mots sur un angle réel que 500 sur trois angles étirés.

---

## 10. Bloc 8 — Départements voisins

### Titre de bloc

> **Se former dans un département voisin**

### Ligne d'accompagnement

> Les trajets entre départements franciliens sont courants : élargir sa recherche multiplie souvent l'offre disponible.

### Liens

Départements limitrophes uniquement, nom en toutes lettres puis numéro, avec compteur si au-dessus du seuil. Pages publiées uniquement.

**Cas d'un département dont aucun voisin n'a de page publiée** — le bloc est remplacé par un lien unique vers le catalogue : **Voir tous les organismes d'Île-de-France →**. Situation probable au lancement.

---

## 11. Bloc 9 — Démarches CNAPS

### Titre de bloc

> **Les démarches à accomplir**

### Ligne d'accompagnement

> Les démarches CNAPS sont identiques dans toute l'Île-de-France.

**Pourquoi le dire explicitement** — la question « faut-il faire ses démarches dans son département » est réelle et fréquente. Y répondre en une ligne évite une FAQ locale de plus, et justifie que le bloc soit du maillage pur sans contenu propre.

### Liens

Les trois pages démarche, mêmes ancres que sur l'accueil.

---

## 12. Bloc 10 — FAQ

> **Le second point de risque de duplication**, après le bloc 7. Huit FAQ voisines sur le même sujet.

### Principe de conception

Chaque question doit produire une réponse **substantiellement différente** d'un département à l'autre — pas seulement un nom propre substitué. Le test : deux pages départementales prises au hasard donnent-elles des réponses qui diffèrent par leur contenu, ou seulement par un mot ?

### Les six questions retenues

**Combien d'organismes de formation à la sécurité privée y a-t-il en [Département] ?**
[N] organismes référencés disposent d'au moins un lieu de formation dans le département, répartis principalement sur [2-3 villes]. *(Varie : nombre et villes.)*

**Quelles formations peut-on suivre en [Département] ?**
[Liste des titres disponibles localement, groupés par catégorie]. *(Varie fortement : c'est la question la plus différenciante des six.)*

**Peut-on préparer le [titre absent] en [Département] ?**
Non, aucun organisme référencé ne le propose dans le département. Les centres les plus proches se trouvent en [département voisin]. *(Varie par nature. Question générée à partir du titre absent le plus recherché ; omise si tous les titres sont couverts.)*

**Faut-il se former dans son département de résidence ?**
Non. Votre carte professionnelle est valable sur tout le territoire national, quel que soit le lieu de votre formation. Le seul critère est pratique : la formation se déroule en présentiel, souvent sur plusieurs semaines. *(Ne varie pas — voir ci-dessous.)*

**Comment se rendre dans les centres de formation en [Département] ?**
[Réponse rédigée, tirée du bloc 7.] *(Varie : rédigée par département.)*

**Les démarches CNAPS sont-elles différentes selon le département ?**
Non. Les procédures sont identiques dans toute l'Île-de-France et se déposent sur le même portail. *(Ne varie pas.)*

### Les deux questions invariantes

Deux des six questions donnent la même réponse sur les huit pages. **C'est acceptable, et voici pourquoi** : ce sont des questions que le visiteur se pose réellement à cet endroit du parcours, et les écarter pour préserver un ratio de variation reviendrait à dégrader la page pour un critère technique. Deux réponses identiques sur six questions, dans un ensemble où le reste de la page varie fortement, ne constitue pas un motif dupliqué.

**En revanche, la limite est là.** Une septième question invariante ferait basculer le ratio. Le balisage `FAQPage` est maintenu tant que la majorité des réponses varie ; il doit être retiré si ce n'est plus le cas.

---

## 13. Le bloc 7 — méthode et angles proposés

> **Le travail éditorial le plus lourd du silo, et le seul que je ne peux pas faire à ta place.**

### Ce qu'il faut collecter, par département

| Élément | Où le trouver |
|---|---|
| Principaux employeurs du secteur | Grands ERP, sites logistiques, plateformes aéroportuaires, sièges tertiaires, centres commerciaux |
| Type de postes dominants | Ce qui oriente vers le TFP APS plutôt que le SSIAP, ou l'inverse |
| Accessibilité des centres | Lignes de transport desservant les villes où l'offre se concentre |
| Concentration de l'offre | Une seule ville domine-t-elle, ou l'offre est-elle répartie |
| Particularité locale | Ce qui n'est vrai que là |

### Angles proposés par département

*Fondés sur la géographie économique francilienne, à vérifier et à enrichir. Ce ne sont pas des textes à publier mais des directions de rédaction.*

| Département | Angle dominant proposé |
|---|---|
| **Paris (75)** | Densité tertiaire, hôtellerie, grands magasins, musées et sites patrimoniaux. Marché où la sécurité incendie en ERP et IGH pèse lourd. Offre de formation la plus dense, donc page où la comparaison entre centres est le vrai service rendu. |
| **Seine-Saint-Denis (93)** | Grands équipements, zones d'activité et tertiaire de la Plaine. Une partie de la plateforme de Roissy relève du département, ainsi que l'aéroport du Bourget. Fort vivier de candidats à la formation initiale. |
| **Val-d'Oise (95)** | La plateforme de Roissy structure le bassin. C'est le département où l'angle sûreté aéroportuaire est le plus légitime, et probablement celui où le TFP ASA a le plus de sens localement. |
| **Hauts-de-Seine (92)** | La Défense et les sièges sociaux. Immeubles de grande hauteur, donc marché orienté vers les niveaux SSIAP 2 et 3 davantage que vers la formation initiale. |
| **Val-de-Marne (94)** | Orly et le pôle de Rungis. Mélange de sûreté aéroportuaire, de logistique et de sites industriels. |
| **Seine-et-Marne (77)** | Le pôle de Marne-la-Vallée, gros employeur du secteur événementiel et loisirs, et les zones logistiques de l'est francilien. Département étendu, donc question des trajets particulièrement sensible. |
| **Essonne (91)** | Sud de la plateforme d'Orly, plateau de Saclay, logistique. Offre de formation vraisemblablement plus dispersée. |
| **Yvelines (78)** | Sites industriels et tertiaires de l'ouest, Vélizy. Département où l'offre de formation est probablement la plus rare des huit — à confirmer, car cela conditionne la publication même de la page. |

**Ces angles ont une conséquence directe sur le bloc 4.** Si le TFP ASA n'a de sens que dans le 95, le 93 et le 77, les autres départements afficheront ce titre en absent — et c'est une information juste et utile, pas un manque.

### La règle de publication

**Pas de 300 mots spécifiques, pas de page.** Six pages solides valent mieux que huit dont deux répètent la première en changeant un nom.

**Ordre de production recommandé** — commencer par les départements où l'offre est la plus dense, puisque ce sont ceux dont la page sera publiée en premier et qui reçoivent le plus de recherches. Un département dont la page n'atteint pas le seuil d'inventaire n'a pas besoin de son bloc 7 tout de suite.

---

## 14. Ce qui varie, ce qui ne varie pas

| Élément | Statut |
|---|---|
| H1, title, meta description | **Varie** — nom et numéro |
| Chapô, bloc 3 | **Varie fortement** — rédigé, 150 mots propres |
| Tableau des titres, bloc 4 | **Varie fortement** — disponibilités et absences réelles |
| Listing, bloc 5 | **Varie** — organismes |
| Répartition par ville, bloc 6 | **Varie** — villes et nombres |
| Bloc 7 | **Varie fortement** — rédigé, 300 mots propres |
| Départements voisins, bloc 8 | **Varie** — limitrophes |
| FAQ | **Varie sur 4 questions sur 6** |
| Titres de blocs | **Fixe** — 7 libellés, dont 5 avec le nom du département inséré |
| Phrase de contexte de l'en-tête | **Fixe** — 1 phrase |
| Lignes d'accompagnement des blocs 5, 8, 9 | **Fixe** — 3 phrases |
| 2 réponses de la FAQ | **Fixe** |

**Total du texte strictement fixe : environ 90 mots**, contre 450 mots rédigés propres par page. Le ratio est très favorable, à une condition : que le bloc 7 et le chapô soient réellement écrits. Sans eux, il ne reste que 90 mots fixes et des chiffres, et la famille s'effondre.

---

## 15. Version de lancement

**Position retenue par la spécification** — seuls les départements atteignant le seuil d'inventaire ont une page. Les autres n'existent pas, ne sont pas liés, et leur libellé reste non cliquable dans le bloc géographique de l'accueil et le maillage bas du catalogue.

**Conséquence sur la copy** — au lancement, il est probable que deux ou trois pages seulement existent. Le bloc 8 « départements voisins » sera donc en repli sur la plupart d'entre elles, et le bloc 4 affichera beaucoup d'absences.

**Ce n'est pas un problème, à une condition** : que les absences soient présentées comme de l'information et non comme un manque. La formulation retenue au bloc 4 — « Non proposé dans le département · Voir les organismes en [voisin] » — tient cette ligne. Une formulation du type « Aucun organisme référencé pour ce titre » ne la tiendrait pas.

**Ce qu'il ne faut pas faire au lancement** — publier les huit pages avec un bloc 7 générique pour « avoir la couverture ». C'est le scénario qui produit exactement la famille de pages faibles que toute cette architecture cherche à éviter.

---

## 16. Points de vigilance

| Point | Vérification |
|---|---|
| **Interdiction titre × département** | Aucune page `/tfp-aps-seine-saint-denis/`. La règle est absolue et c'est le piège classique des annuaires. |
| **Coexistence avec le filtre** | Une page département publiée interdit toute URL de filtre indexable sur la même zone. |
| **Rattachement par lieu** | Sur l'ensemble des lieux, jamais le seul siège. À vérifier en recette : un organisme multi-sites doit apparaître sur plusieurs pages. |
| **Adresse affichée** | Celle du lieu situé dans le département, pas celle du siège. |
| **Liens vers pages non publiées** | Ni page ville, ni page pilier, ni département voisin non publié. |
| **Fraîcheur des chapôs** | Un chapô affirmant une absence devenue fausse est un mensonge automatique. À réviser avec l'inventaire. |
| **Balisage `FAQPage`** | Maintenu tant que la majorité des réponses varie. À retirer si une septième question invariante est ajoutée. |
| **Préposition du H1** | Table de huit entrées, saisie à la main. |

---

## 17. Points ouverts

- **Chiffrer le seuil de publication d'une page département.** Distinct du seuil d'affichage des compteurs : l'un décide de l'existence de la page, l'autre de ce qu'elle montre.
- **Écrire les blocs 7**, département par département, en commençant par ceux dont l'offre est la plus dense.
- **Vérifier les angles proposés en section 13** contre la réalité du marché francilien.
- **Confirmer le seuil de 5 organismes** pour la création d'une page ville, une fois la répartition réelle connue.
- **Décider si les chapôs contiennent des variables de disponibilité** ou s'ils sont entièrement rédigés et révisés manuellement.
- **Trancher le sort des Yvelines** si l'offre y est trop rare pour justifier une page.

---

## 18. Documents liés

- **UX Pages géographiques** — structure, granularité, règles anti-cannibalisation
- **Référentiel des titres** — alimente le tableau du bloc 4
- **Copy Catalogue organismes** — cartes du bloc 5, cohérence des libellés et des états
- **Copy Fiche organisme** — destination du listing
- **Copy Pages démarches CNAPS** — destination du bloc 9
- **Copy Page d'accueil** — bloc géographique pointant vers ces pages
- **À produire** — copy des pages piliers, du formulaire d'affinage, du blog
