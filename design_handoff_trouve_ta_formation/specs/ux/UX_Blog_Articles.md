# Spécification UX — Blog et articles

**Trouve ta formation — Verticale sécurité privée**
`trouve-ta-formation.fr/securite-privee/blog/`
`trouve-ta-formation.fr/securite-privee/blog/[slug]/`
Version 1.0 — 31 août 2026

---

## 1. Rôle du blog

Trois fonctions que les pages structurantes du silo ne peuvent pas remplir.

**L'actualité datée.** Une évolution réglementaire, un changement de plateforme CNAPS, une modification des règles de financement. Ces sujets portent une date, donc ils ne peuvent pas vivre sur une page permanente.

**Les sujets métier.** Salaire, conditions de travail, quotidien d'un agent, évolution de carrière. Requêtes à fort volume, en amont de l'intention formation, que les pages formation n'ont pas vocation à traiter.

**La longue traîne périphérique.** Casier judiciaire, ressortissants étrangers, condition physique. Micro-intentions trop spécifiques pour une page formation, trop nombreuses pour une FAQ.

### Bénéfice indirect

Le silo est composé de pages qui bougent peu. Un site qui publie régulièrement envoie un signal d'activité, et le blog est ce qui fait crawler le silo plus souvent.

### Statut au lancement

Dix articles sont prêts. Le blog est donc un **actif de lancement**, pas un chantier différé : avec les pages formation et les pages démarche, il forme la troisième famille de contenu qui travaille sans dépendre de l'inventaire d'organismes.

Le lien blog figure en navigation principale dès le lancement.

---

## 2. Les trois territoires légitimes

| Territoire | Exemples | Ce qui le rend légitime |
|---|---|---|
| **Actualité datée** | Évolution réglementaire, changement de plateforme, nouvelles règles de financement | Porte une date, donc inadapté à une page permanente |
| **Métier** | Salaire, conditions de travail, quotidien, carrière | En amont de l'intention formation |
| **Longue traîne périphérique** | Casier, nationalité, aptitude physique | Trop spécifique pour une page formation |

### La règle qui prime sur tout le reste

**Un article ne traite jamais un titre du référentiel ni une procédure CNAPS.** Si le sujet mérite une page structurante, il va sur la page structurante.

Un blog qui redit ce que le silo dit déjà est un générateur de cannibalisation interne. C'est le piège le plus fréquent : des articles sur les mêmes sujets que les pages principales, avec un angle légèrement différent, et le moteur ne sait plus laquelle servir.

---

## 3. Page liste — ordre des blocs

| # | Bloc | Fonction dominante |
|---|---|---|
| 1 | Fil d'Ariane | Maillage remontant |
| 2 | En-tête + chapô court | Contenu propre |
| 3 | Filtres par catégorie | Navigation |
| 4 | Article mis en avant | Hiérarchie |
| 5 | **Listing des articles** | Cœur de page |
| 6 | Pagination | Crawl |
| 7 | Maillage vers les pages structurantes | Distribution d'autorité |
| 8 | Footer | Maillage secondaire |

### 1. Fil d'Ariane

`Sécurité privée > Blog`. Balisage `BreadcrumbList`.

### 2. En-tête + chapô court

**Contenu** — H1, et un chapô de 100 mots maximum.

**Pourquoi un chapô** — une page liste n'a que des titres et des extraits : elle est faible par nature. Le chapô lui donne un minimum de contenu propre.

### 3. Filtres par catégorie

**Contenu** — liens texte par catégorie, filtrage côté client.

**Aucune URL indexable.** Même règle que les filtres du catalogue.

**Pas de pages catégorie au lancement.** Avec dix articles répartis en quatre catégories, `/blog/categorie/actualites/` serait une page à deux articles, donc une page faible de plus. Les pages catégorie seront créées quand une catégorie atteindra une quinzaine d'articles.

### 4. Article mis en avant

**Contenu** — un seul article, en grand format.

**Pourquoi** — sur dix articles, une grille uniforme ne hiérarchise rien. Ce bloc permet aussi de pousser l'article le plus stratégique, pas seulement le plus récent.

### 5. Listing des articles

**Contenu de chaque carte** — titre, extrait, catégorie, date, temps de lecture.

**Tri par date décroissante**, contrairement au catalogue. C'est ce que le lecteur attend d'un blog.

**SEO** — balisage `ItemList`, liens `<a>` en dur.

### 6. Pagination

Numérotée, classique, 10 à 12 articles par page. Elle ne servira pas au lancement, mais le composant doit exister. Mêmes règles que le catalogue : auto-canonisation, jamais de `canonical` vers la page 1.

### 7. Maillage vers les pages structurantes

**Contenu** — liens vers les pages formation de la phase 1 et vers les pages démarche.

**Pourquoi** — c'est ce qui empêche la page liste d'être un cul-de-sac et ce qui la fait participer à la distribution d'autorité du silo.

### 8. Footer

Identique au footer global du silo.

---

## 4. Page article — ordre des blocs

| # | Bloc | Fonction dominante |
|---|---|---|
| 1 | Fil d'Ariane | Maillage remontant |
| 2 | En-tête — H1, dates, temps de lecture, catégorie | Contexte |
| 3 | Encadré de synthèse | **Capture de snippet** |
| 4 | Table des matières ancrée | Navigation, si > 1000 mots |
| 5 | **Corps de l'article** | Cœur de page |
| 6 | À retenir | Clôture |
| 7 | Bloc auteur | **E-E-A-T** |
| 8 | Accroche formation contextuelle | Conversion |
| 9 | Articles liés | Maillage latéral |
| 10 | Footer | Maillage secondaire |

### 1. Fil d'Ariane

`Sécurité privée > Blog > [Titre de l'article]`. Balisage `BreadcrumbList`.

### 2. En-tête

**Contenu** — H1, date de publication, **date de mise à jour**, temps de lecture, catégorie.

**Pourquoi les deux dates** — sur un sujet réglementé, un article non révisé perd sa crédibilité. Afficher « mis à jour le » est un signal de fraîcheur réel, et cela oblige à réviser.

**Pour les articles réglementaires** — ajouter une date de dernière vérification, distincte de la date de mise à jour, sur le modèle des pages démarche.

### 3. Encadré de synthèse

**Contenu** — trois ou quatre faits, pour les articles longs.

**Pourquoi** — il sert le lecteur pressé et capture les featured snippets. Même logique que l'encadré des pages démarche.

### 4. Table des matières ancrée

Uniquement au-delà de 1000 mots. En dessous, elle encombre. Ancres en dur.

### 5. Corps de l'article

**Règle d'ouverture** — l'article commence par répondre à la question du titre en deux ou trois phrases, avant tout développement. C'est ce qui capture les snippets et ce qui empêche le retour immédiat vers les résultats.

**Hiérarchie** — H2/H3 propre, sans saut de niveau. Rendu côté serveur.

**Maillage** — les liens contextuels en plein texte vers les pages formation et démarche sont les plus qualitatifs de l'article. Un lien dans le corps du texte vaut mieux que dix en pied de page.

Voir section 5 pour les composants éditoriaux disponibles.

### 6. À retenir

**Contenu** — trois points en fin d'article.

**Pourquoi** — il donne une raison de finir la lecture et récapitule pour le lecteur en diagonale.

### 7. Bloc auteur

**Contenu** — nom, une ligne de qualification, photo.

**Pourquoi ce bloc compte** — c'est le seul endroit du site où une expertise identifiée peut être posée. Sur un secteur réglementé, savoir qui écrit compte. Signal E-E-A-T réel.

**SEO** — balisage `Person` rattaché à l'`Article`.

### 8. Accroche formation contextuelle

**Contenu** — un renvoi vers la page formation ou démarche liée au sujet de l'article.

**Règle** — contextuelle, jamais générique. Un article sur le salaire renvoie vers le TFP APS. Un article sur le renouvellement renvoie vers le MAC APS. Un bloc « trouvez votre formation » identique sur tous les articles ne convertit pas et n'apporte aucun maillage utile.

### 9. Articles liés

Trois articles, même catégorie ou même thème. Évite la feuille morte dans le silo.

### 10. Footer

Identique au footer global du silo.

---

## 5. Composants éditoriaux

> **Principe : la mise en forme sert la lecture, pas le référencement.** Aucun bonus n'est attribué à un encadré coloré. Ce qui est mesuré, c'est le comportement du lecteur — reste-t-il, ou repart-il vers un autre résultat. Les composants comptent parce qu'ils facilitent la lecture.

### Les leviers réels, par ordre d'impact

| Composant | Pourquoi il compte |
|---|---|
| **Réponse en premier paragraphe** | Capture les featured snippets, empêche le retour immédiat |
| **Tableaux** | Très souvent repris en position 0 dès qu'il y a comparaison |
| **Listes structurées** | Conditions, pièces, étapes — correspond au format que la requête cherche |
| **Liens sortants sourcés** | Sur un sujet réglementé, signal de fiabilité fort. L'absence de lien sortant est un signal négatif |
| **Images légendées et annotées** | Une capture annotée d'un formulaire officiel est du contenu que personne d'autre n'a. Texte alternatif descriptif obligatoire |

### Call-outs

Trois types justifient leur existence :

| Type | Usage |
|---|---|
| **Point de vigilance** | Une erreur fréquente, un piège réglementaire |
| **Chiffre clé** | Une donnée à isoler visuellement |
| **Renvoi contextuel** | Lien vers la page formation ou démarche concernée |

Le troisième est le plus utile : c'est un emplacement de maillage identifié, réutilisable d'un article à l'autre.

**Règle : deux ou trois call-outs maximum par article.** Un article truffé d'encadrés n'a plus de hiérarchie — quand tout est mis en avant, rien ne l'est. Le texte reste dans le DOM au chargement, jamais injecté au clic.

### À éviter

- Table des matières sur un article de moins de 1000 mots
- Accordéons masquant du contenu au chargement
- FAQ balisée `FAQPage` en fin d'article — elle concurrence les pages structurantes sur les rich results
- Images décoratives génériques, qui coûtent en poids sans rien apporter

### Le levier le plus rentable n'est pas dans la mise en forme

Un article qui traite un sujet mal traité ailleurs rankera mieux qu'un article parfaitement formaté sur un sujet saturé.

Angles réellement disponibles sur ce secteur : les cas de refus de carte professionnelle, la reconversion après quarante ans, l'écart entre les grilles salariales affichées et la réalité en Île-de-France. Les sources institutionnelles ne traitent pas ces sujets, et les sites concurrents non plus.

---

## 6. Audit de cannibalisation — à faire avant publication

> **Chantier à mener sur les dix articles existants.**

Ils ont été écrits avant que les pages formation existent. C'est le scénario classique où le blog cannibalise le silo, parce qu'au moment de la rédaction il n'y avait pas de page vers laquelle renvoyer.

### Trois questions par article

1. **Traite-t-il un titre du référentiel ?** Si oui, son contenu alimente la page formation. L'article est réécrit sous angle métier, ou abandonné.
2. **Traite-t-il une procédure CNAPS ?** Même arbitrage avec la page démarche.
3. **Renvoie-t-il vers au moins une page structurante ?** Si non, ajouter le maillage avant publication.

### Le cas le plus probable

Un article du type « Comment devenir agent de sécurité » recoupe frontalement la page TFP APS. Deux traitements possibles :

- **Réécriture sous angle métier** — le quotidien, les conditions de travail, les débouchés — avec renvoi vers la page formation pour le parcours de certification.
- **Fusion** dans la page formation, et abandon de l'article.

### Contrainte de séquencement

**Publier les pages formation de la phase 1 avant ou en même temps que les articles concernés.**

Si les articles sortent d'abord, le moteur les indexe sur des requêtes de titre, et la page formation devra ensuite les déloger sur son propre site. C'est pénible à rattraper et évitable.

### Surveillance continue

Si un article existant commence à ranker sur une requête de titre, c'est le signal qu'il doit être fusionné dans la page formation — pas conservé en l'état.

---

## 7. Règles techniques transverses

- **Rendu côté serveur** pour tout le contenu textuel et tous les liens.
- **Un seul H1** par page.
- Hiérarchie H2/H3 propre, sans saut de niveau.
- Données structurées : `BlogPosting` ou `Article` sur l'article, `Person` sur l'auteur, `BreadcrumbList`, `ItemList` sur la page liste.
- **Pas de `FAQPage`** sur les articles.
- Images en WebP, dimensions explicites, texte alternatif descriptif.
- Ancres de table des matières en dur.
- Aucun élément cliquable sans balise `<a>`.

---

## 8. Ce qu'il ne faut pas mettre

- Un article traitant un titre du référentiel ou une procédure CNAPS
- Des pages catégorie sous une quinzaine d'articles
- Des filtres de catégorie générant des URLs indexables
- Une accroche formation générique, identique sur tous les articles
- Un article sans lien vers au moins une page structurante
- Une FAQ balisée en fin d'article
- Un article réglementaire sans date de vérification

---

## 9. Points ouverts

- **Mener l'audit des dix articles existants** selon la grille de la section 6. Bloquant avant publication.
- **Arrêter la liste des catégories** — quatre au maximum au lancement.
- **Identifier l'auteur** affiché sur les articles, et rédiger sa ligne de qualification.
- **Définir la fréquence de publication** cible après le lancement, faute de quoi le signal de fraîcheur s'éteint.
- **Inscrire la révision des articles réglementaires** dans le même calendrier éditorial que les pages démarche.

---

## 10. Documents liés

- **Note de cadrage** — concept, modèle économique, go-to-market
- **Architecture des pages** — inventaire des pages et de leurs rôles
- **Structure d'URL** — nommage, arborescence, règles d'indexation
- **UX Page d'accueil** — tête de silo
- **UX Catalogue organismes** — page canonique du catalogue
- **UX Landing organismes** — sas de conversion B2B
- **UX Page pilier par titre** — contenu réglementaire des formations
- **UX Fiche organisme** — page produit de l'organisme
- **UX Pages démarche CNAPS** — procédures administratives
- **UX Pages géographiques** — inventaire par département
- **À produire** — parcours du formulaire d'affinage, 404, racine du domaine
