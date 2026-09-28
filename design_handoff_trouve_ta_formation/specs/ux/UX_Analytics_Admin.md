# Spécification UX — Analytics

**Trouve ta formation — Verticale sécurité privée**
`admin.trouve-ta-formation.fr/analytics`
Version 1.0 — 31 août 2026

---

## 1. Rôle de la page

Statistiques globales et tendances dans le temps. Frontière déjà posée avec le Dashboard admin : le Dashboard répond à « qu'est-ce qui a besoin de moi maintenant ? » (files d'action, instantané), Analytics répond à « comment ça évolue dans le temps ? » (courbes, classements, historique). Aucune action de modération ne vit ici — cette page se consulte, elle ne se manipule pas.

### Infrastructure : tracking interne, pas d'outil externe

Toutes les métriques de cette page sont alimentées par un **système de tracking interne léger**, propre au produit — pas par une intégration Google Analytics ou équivalent.

**Pourquoi ce choix** — les métriques demandées (articles les plus vus, CTA les plus cliqués par organisme, fiches les plus visitées) sont des classements liés aux entités propres du produit (organismes, articles, formations). Un outil externe type GA4 capte nativement le trafic global, mais ces classements précis nécessitent de toute façon des événements personnalisés et une intégration API pour les récupérer sous une forme exploitable — autant construire directement une mécanique interne qui sert les trois familles de métriques de façon uniforme. Bénéfice additionnel : pas de cookie déposé pour cette brique, donc pas de bandeau de consentement à ouvrir comme chantier annexe.

**Mécanique** — une table d'événements simple : type d'événement (vue de fiche organisme, vue d'article, clic CTA téléphone, clic CTA email, clic CTA lien principal), entité concernée, horodatage. Cette page interroge cette table et l'agrège selon la période sélectionnée.

**Ce que ça ne couvre pas** — sources de trafic, mots-clés de recherche, comportement multi-pages détaillé. Cette donnée reste portée par Search Console, en dehors du produit, sans duplication ici.

---

## 2. Structure de la page

**Trois onglets**, sur le modèle déjà retenu pour le Référentiel des titres — plus lisible qu'un scroll continu vu la densité de chaque section.

| Onglet | Contenu |
|---|---|
| Général | Vue d'ensemble du produit dans le temps |
| Blog | Performance des articles |
| Organismes | Performance des fiches et de leurs CTA |

**Sélecteur de période, commun aux trois onglets** — 7 jours / 30 jours / 90 jours / tout, avec 30 jours en sélection par défaut à l'ouverture de la page.

---

## 3. Onglet Général

| Métrique | Forme |
|---|---|
| Nombre d'organismes inscrits | Courbe d'évolution sur la période |
| Répartition par palier (Basique / Correct / Optimal) | Évolution empilée sur la période |
| Nombre de formations publiées | Courbe d'évolution sur la période |
| Trafic sur l'annuaire (vues de page, toutes pages confondues) | Courbe d'évolution sur la période |

**Différence avec le Dashboard** — le Dashboard affiche un instantané de la répartition par palier ; ici, c'est son évolution qui compte, pour voir si le parc d'organismes progresse globalement en qualité de fiche ou stagne.

---

## 4. Onglet Blog

| Métrique | Forme |
|---|---|
| Articles les plus vus sur la période | Classement, top 10, lien vers chaque article publié |
| Vues totales du blog sur la période | Chiffre + courbe d'évolution |

**Pourquoi un classement plutôt qu'une liste exhaustive** — sur un blog qui démarre à dix articles, un classement complet reste lisible ; un top 10 anticipe la croissance du corpus sans devoir revoir la page plus tard.

**Chaque ligne du classement est cliquable** vers l'article correspondant dans l'éditeur du Blog admin — cohérent avec le principe déjà appliqué ailleurs : jamais un chiffre sans action associée, même si ici l'action est une simple navigation plutôt qu'un traitement.

---

## 5. Onglet Organismes

| Métrique | Forme |
|---|---|
| Fiches les plus visitées sur la période | Classement, top 10, lien vers chaque Fiche client |
| Clics CTA les plus fréquents, par organisme | Classement, top 10, avec le détail du type de CTA cliqué |
| Répartition des clics par type de CTA (téléphone / email / lien principal) | Total sur la période, tous organismes confondus |

### Les trois CTA suivis

Repris de la fiche organisme publique : **téléphone**, **email**, et **lien CTA principal** — ce dernier couvrant le lien configuré librement par l'organisme (site web, réseau social, ou autre destination de son choix). Le tracking suit le clic sur le bouton, pas la destination réelle du lien : peu importe où le lien principal pointe, l'événement enregistré reste « clic CTA principal ».

**Dépendance à cadrer séparément** — ce lien CTA principal configurable remplace le champ « site web » actuel de Ma fiche et de la Fiche organisme publique. Cette page suppose cette évolution déjà en place ; la mise à jour des deux spécifications concernées reste à faire indépendamment de celle-ci.

**Pourquoi un classement des clics par organisme, en plus de la répartition globale** — la répartition globale dit quel type de CTA fonctionne le mieux sur l'ensemble du site (donnée produit) ; le classement par organisme identifie qui reçoit le plus de sollicitations (donnée qui prépare directement l'argument de valeur pour une future mise en avant payante, cohérent avec le principe déjà acté que les fonctionnalités payantes ne touchent jamais au classement du catalogue, mais peuvent s'appuyer sur cette donnée pour convaincre).

---

## 6. Ce qu'il ne faut pas faire

- Intégrer Google Analytics ou un outil équivalent en V1 — le tracking reste interne, sans dépôt de cookie ni bandeau de consentement associé
- Afficher des données de trafic global sans les distinguer de l'activité propre au produit (organismes, formations, articles) — deux natures de données différentes, pas à fusionner dans un seul chiffre
- Dupliquer ici l'instantané déjà présent sur le Dashboard admin — cette page ne montre que des tendances et des classements, jamais un état ponctuel isolé
- Traiter les clics CTA d'un organisme comme une action de modération — cette page reste strictement en lecture, aucune action n'en découle directement ici

---

## 7. Points ouverts

- **Mise à jour de Ma fiche et de Fiche organisme** pour intégrer le lien CTA principal configurable, en remplacement du champ « site web » — dépendance directe de l'onglet Organismes, à traiter avant développement.
- **Rétention des données de tracking** — combien de temps conserver le détail événement par événement (utile pour recalculer un classement sur une période personnalisée), avant agrégation ou purge.
- **Export des données** — non demandé à ce stade, à ajouter si un besoin de reporting externe apparaît.

---

## 8. Documents liés

- **UX Dashboard admin** — frontière entre instantané (Dashboard) et tendance (Analytics)
- **UX Fiche organisme** — CTA suivis, à mettre à jour pour le lien principal configurable
- **UX Ma fiche** — champ à faire évoluer en conséquence
- **UX Fiche client** — destination des liens depuis le classement des organismes
- **UX Blog admin** — destination des liens depuis le classement des articles
- **Note de cadrage** — principe du paid features never touching ranking, repris ici pour la justification du classement par organisme
- **À produire** — Paramètres admin
