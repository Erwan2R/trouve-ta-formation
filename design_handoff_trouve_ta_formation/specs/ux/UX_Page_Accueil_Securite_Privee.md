# Spécification UX — Page d'accueil

**Trouve ta formation — Verticale sécurité privée**
`trouve-ta-formation.fr/securite-privee/`
Version 1.0 — 29 août 2026

---

## 1. Rôle de la page

Tête de silo éditoriale. Deux fonctions, et rien d'autre :

1. **Orienter** le visiteur vers le bon chemin — par titre, par zone, ou par le formulaire d'affinage.
2. **Distribuer l'autorité** vers les pages qui portent le trafic — piliers, géographiques, démarches.

Tout bloc qui ne sert ni l'un ni l'autre est à supprimer.

### Ce qu'elle n'est pas

- Ce n'est pas le catalogue. Aucun listing paginé, aucun filtre. Le catalogue vit sur `/securite-privee/organismes/`.
- Ce n'est pas une page de titre. Elle traite la transversale (comment choisir entre les titres), jamais un titre en particulier. Développer le SSIAP 1 ici cannibaliserait la page pilier correspondante.
- Ce n'est pas une page B2B. L'intention est candidat.

### Intention et requêtes visées

| | |
|---|---|
| Intention | « je veux me former, par où commencer » |
| Requêtes | *formation sécurité privée*, *devenir agent de sécurité*, requêtes d'exploration |
| Requêtes explicitement **non** visées | *organisme de formation sécurité privée* → catalogue · *formation TFP APS* → page pilier |

---

## 2. Ordre des blocs

| # | Bloc | Fonction dominante |
|---|---|---|
| 1 | Header + navigation | Maillage |
| 2 | Hero | Orientation |
| 3 | Grille par titre de formation | **Maillage principal** |
| 4 | Formulaire d'affinage — accroche | Conversion |
| 5 | Entrée géographique | Maillage secondaire |
| 6 | Échantillon d'organismes | Preuve |
| 7 | Comment ça marche | Réassurance |
| 8 | Démarches CNAPS | Maillage adjacent |
| 9 | Corps éditorial transversal | **Profondeur sémantique** |
| 10 | FAQ | Longue traîne |
| 11 | Derniers articles | Fraîcheur |
| 12 | Bandeau B2B | Conversion secondaire |
| 13 | Footer | Maillage secondaire |

---

## 3. Détail des blocs

### 1. Header + navigation

**Contenu** — logo, entrées de navigation exposant les grandes familles de titres, lien vers le catalogue, lien vers les démarches, lien vers le blog, bouton « Espace organisme ».

**Pourquoi ici** — la navigation est présente sur 100 % des pages du silo, ce qui en fait le lien interne le plus démultiplié du site. Les entrées doivent donc être choisies pour leur valeur de maillage, pas seulement pour l'ergonomie.

**SEO** — liens `<a href>` en dur dans le HTML, rendus côté serveur. Pas de menu construit en JavaScript. Pas de fil d'Ariane sur cette page (racine du silo), mais le `BreadcrumbList` doit être implémenté dès maintenant pour les pages filles.

---

### 2. Hero

**Contenu** — H1 unique contenant le mot-clé principal, une phrase de promesse, deux CTA (primaire vers le formulaire d'affinage, secondaire vers le catalogue), une ligne de chiffres.

**Pourquoi ici** — position évidente ; la vraie contrainte est la hauteur.

**Contrainte de hauteur : 400 px maximum.** Pas de carrousel, pas d'image plein écran, pas de visuel lourd. Un hero haut repousse le premier contenu réel hors du premier scroll et dégrade le LCP. Cette page est un outil d'orientation, pas une page de marque.

**SEO** — un seul H1 sur la page. La ligne de chiffres n'est pas décorative : elle signale l'exhaustivité, qui est la proposition de valeur, et constitue un signal lisible par un évaluateur humain.

**Conditionnement** — le compteur d'organismes n'apparaît qu'au-dessus du seuil défini. En dessous, afficher le nombre de titres couverts et le nombre de départements, ou rien.

---

### 3. Grille par titre de formation

> **Bloc le plus important de la page.**

**Contenu** — une carte par titre du référentiel : nom du titre, une ligne de description, durée réglementaire, compteur d'organismes.

**Pourquoi ici** — deux raisons cumulatives. C'est l'entrée dominante : un candidat sait quel métier il vise avant de savoir quel centre. Et ce sont les liens vers les pages piliers, celles qui portent le trafic principal. Le premier lien d'une page pèse plus que le dernier ; ces liens doivent être hauts.

**SEO**
- Ancres descriptives portant le nom du titre. Jamais « en savoir plus ».
- Le compteur par titre est du contenu unique généré par la donnée, non reproductible par un concurrent.
- **Afficher tous les titres.** Ne pas replier la moitié derrière un « voir plus » en JavaScript : les liens masqués perdent en poids.

---

### 4. Formulaire d'affinage — bloc d'accroche

**Contenu** — pas le formulaire complet, mais sa première question déjà posée à l'écran, avec deux ou trois boutons de réponse. Le clic ouvre le parcours complet.

**Pourquoi ici et pas dans le hero** — placé après la grille de titres, il arrive au moment où le visiteur vient de constater qu'il existe une quinzaine d'options et qu'il ne sait pas laquelle le concerne. C'est le point de friction naturel. Dans le hero, il est ignoré : l'utilisateur n'a pas encore le problème que le formulaire résout.

**Point de conception** — afficher la première question en dur plutôt qu'un bouton « démarrer » augmente nettement l'entrée en parcours. L'engagement commence avant le clic.

**SEO** — le formulaire et ses écrans de résultats sont en `noindex`. Il sert l'expérience et la collecte, pas le référencement.

---

### 5. Entrée géographique

**Contenu** — les 8 départements franciliens, plus les villes réellement couvertes, avec compteur d'organismes par zone. Carte interactive en complément, jamais à la place des liens texte.

**Pourquoi ici** — l'intention géographique est la deuxième après l'intention par titre. Sur ce marché la proximité est un critère de sélection réel, la formation étant en présentiel.

**SEO**
- Ces liens ne pointent que vers des **pages géographiques éditorialisées existantes**. Jamais vers un filtre du catalogue : cela casserait la règle d'indexation posée dans la structure d'URL.
- Ne créer que les pages dont l'inventaire local est non trivial. Mieux vaut 8 départements solides que 20 villes vides.

---

### 6. Échantillon d'organismes

**Contenu** — 6 à 12 fiches : logo, nom, ville et département, titres proposés. Puis un lien vers le catalogue complet.

**Pourquoi ici** — preuve tangible que l'annuaire existe. Placé après les deux blocs de navigation, il ne concurrence pas les chemins d'accès principaux mais donne de la substance.

**Critère de sélection** — score de complétude de fiche. Aligné sur le tri par défaut du catalogue et sur l'emplacement de la future mise en avant payante, qui doit exister comme paramètre configurable dès la V1.

**SEO** — balisage `ItemList`. Chaque carte contient un lien `<a>` en dur vers la fiche.

**Conditionnement** — bloc entier masqué sous le seuil.

---

### 7. Comment ça marche

**Contenu** — trois étapes en format horizontal, iconographie sobre. Identifier → comparer → contacter.

**Pourquoi ici** — ce bloc lève une objection (« que se passe-t-il après le clic, vais-je être démarché ? ») plutôt qu'il n'apporte une information nouvelle. D'où sa position basse. Valeur SEO nulle, valeur de conversion réelle.

---

### 8. Démarches CNAPS

**Contenu** — grille de liens vers les pages démarche : carte professionnelle, autorisation préalable, renouvellement, aptitude professionnelle.

**Pourquoi ici** — deux raisons. C'est ce qui fera crawler des pages à fort volume et faible concurrence. Et c'est un signal de couverture thématique : un site qui traite l'écosystème réglementaire complet est évalué comme plus expert qu'un site qui ne liste que des formations.

**Note lancement** — c'est le bloc le plus solide au démarrage, puisqu'il ne dépend pas de l'inventaire. À remonter en position 6 tant que le seuil n'est pas atteint.

---

### 9. Corps éditorial transversal

**Contenu** — 800 à 1500 mots structurés en H2/H3 : le secteur et ses métiers, comment choisir son titre selon sa situation, les prérequis communs (autorisation préalable, casier, niveau de français), les financements (CPF, France Travail, OPCO, plan de développement), les ordres de grandeur de durée et de coût.

**Pourquoi ici, en bas** — aucun visiteur ne lit ce contenu avant d'avoir cherché. Mais c'est ce qui donne à la page la profondeur sémantique nécessaire pour ranker sur la requête générique, et c'est là que se placent les liens contextuels en plein texte, les plus qualitatifs de la page.

**Règle anti-cannibalisation** — ce corps traite la **comparaison entre titres**. Les pages piliers traitent **chaque titre en profondeur**. Écrire 300 mots sur le SSIAP 1 ici reviendrait à concurrencer sa propre page pilier.

**SEO**
- Hiérarchie H2/H3 propre, sans saut de niveau.
- Rendu côté serveur.
- Accordéons acceptables à condition que le texte soit dans le DOM au chargement, jamais injecté au clic.

---

### 10. FAQ

**Contenu** — 8 à 12 questions issues des « People Also Ask » et des requêtes longue traîne.

**Pourquoi ici** — capture de featured snippets et couverture des micro-intentions que le corps éditorial ne traite pas frontalement.

**SEO** — balisage `FAQPage`. Questions distinctes de celles du catalogue et des pages piliers, sans quoi le contenu est dupliqué à l'intérieur du silo.

---

### 11. Derniers articles

**Contenu** — 3 à 4 cartes vers le blog.

**Pourquoi ici** — signal de fraîcheur sur une page qui, sinon, bouge peu. Et maillage vers le sous-dossier blog.

---

### 12. Bandeau B2B

**Contenu** — une ligne discrète vers la landing page B2B organismes.

**Pourquoi tout en bas** — cette page a une intention candidat. Un bloc B2B visible en haut brouille le message et fait fuir la cible principale. En bas, il capte le dirigeant d'organisme qui a parcouru toute la page, donc le plus qualifié. Le canal B2B principal reste l'email de prise de contact.

---

### 13. Footer

**Contenu** — quatre colonnes : titres les plus recherchés, départements, démarches, pages du site et mentions légales. Plus la ligne discrète vers les autres verticales.

**SEO** — le lien inter-verticales n'apparaît **qu'ici**. Jamais en navigation principale, sous peine de casser le cloisonnement des silos.

---

## 4. Version de lancement — blocs conditionnés

Trois blocs dépendent de l'inventaire, qui sera vide au démarrage. Livrée telle quelle en semaine 1, la page afficherait « 4 organismes référencés », des compteurs à zéro sur la moitié des titres, et un échantillon de trois fiches.

Il faut donc deux états de la même page, pilotés par **un seul paramètre de configuration**.

| Bloc | Sous le seuil | Au-dessus du seuil |
|---|---|---|
| Compteur du hero | Masqué — remplacé par nombre de titres et de départements | Affiché |
| Compteurs par titre | Masqués sur toute la grille | Affichés |
| Compteurs par département | Masqués | Affichés |
| Échantillon d'organismes | Bloc entier masqué | Affiché |
| Démarches CNAPS | Remonté en position 6 | Position 8 |
| Corps éditorial | Remonté et plus développé | Position 9 |

**Règle absolue : ne jamais masquer un compteur isolément.** Afficher « 12 organismes » sur le TFP APS et rien sur le SSIAP 1 rend le vide plus visible que l'absence totale de compteurs. C'est tout ou rien.

**Conséquence produit** — le seuil d'affichage du compteur, noté « à définir » dans la note de cadrage, devient bloquant pour le design de cette page. Il doit être chiffré avant maquettage.

---

## 5. Règles techniques transverses

- **Rendu côté serveur** pour tout le contenu textuel et tous les liens.
- **Un seul H1.**
- Données structurées : `Organization`, `WebSite`, `ItemList` sur l'échantillon d'organismes, `FAQPage` sur la FAQ.
- Images en WebP, dimensions explicites pour éviter le décalage de mise en page.
- Objectif LCP sous 2,5 s — ce qui exclut de faire du hero une image lourde.
- Aucun élément cliquable sans balise `<a>`.
- Carte géographique en chargement différé, jamais bloquante pour le rendu.

---

## 6. Ce qu'il ne faut pas mettre

- Un listing paginé d'organismes — c'est le rôle du catalogue
- Un carrousel dans le hero
- Un moteur de recherche en JavaScript sans équivalent HTML crawlable
- Des filtres générant des URLs indexables
- Un lien vers une autre verticale ailleurs que le pied de page
- Un développement approfondi d'un titre particulier
- Des titres repliés derrière un « voir plus »

---

## 7. Points ouverts

- **Chiffrer le seuil d'affichage du compteur.** Bloquant pour le design.
- **Définir le calcul du score de complétude** — il pilote à la fois le tri du catalogue, la sélection de l'échantillon d'organismes et le seuil de `noindex` des fiches.
- **Arrêter la liste des titres du référentiel** — elle détermine le nombre de cartes du bloc 3 et donc sa mise en page.
- **Bloc de réassurance optionnel** — entre les blocs 7 et 9, la page manque d'un point de respiration. Un bloc court sur l'origine des données, la fréquence de mise à jour et ce que le référencement signifie aurait une valeur E-E-A-T réelle sur un sujet réglementé. À arbitrer au maquettage.

---

## 8. Documents liés

- **Note de cadrage** — concept, modèle économique, go-to-market
- **Architecture des pages** — inventaire des pages et de leurs rôles
- **Structure d'URL** — nommage, arborescence, règles d'indexation
- **À produire** — spécification UX du catalogue, de la fiche organisme et de la page pilier
