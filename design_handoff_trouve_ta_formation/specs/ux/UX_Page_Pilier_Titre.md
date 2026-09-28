# Spécification UX — Page pilier par titre

**Trouve ta formation — Verticale sécurité privée**
`trouve-ta-formation.fr/securite-privee/[titre]/`
Version 1.0 — 30 août 2026

---

## 1. Rôle de la page

Une page par titre du référentiel. Elle traite **un titre en profondeur** et elle est le seul endroit du site où vit le contenu réglementaire de ce titre.

C'est le canal de trafic principal du silo, pour trois raisons cumulatives :

- **Elle vise les requêtes qui convertissent.** *Formation TFP APS*, *SSIAP 1 Paris*, *recyclage carte professionnelle* sont tapées par des gens qui savent ce qu'ils veulent. Le générique attire du volume, le titre attire des candidats.
- **Elle ne dépend pas de l'inventaire.** Le contenu réglementaire est le même avec quatre organismes inscrits ou trois cents. Avec les pages démarche, c'est ce qui porte le trafic pendant la constitution de la base.
- **Elle protège contre le contenu dupliqué.** Ni le catalogue, ni la fiche organisme, ni les pages géographiques ne réécrivent le programme d'un titre. L'organisme non plus : il déclare son prix, ses lieux, son rythme.

### Position dans le silo

Page la plus liée en interne : grille de l'accueil, maillage bas du catalogue, cartes du listing, fiches organisme, pages géographiques. Elle redistribue vers les organismes qui dispensent le titre, les démarches associées et les titres du même parcours.

---

## 2. La tension à résoudre : deux intentions dans une requête

*Formation TFP APS* est tapé par deux personnes différentes :

| Profil | Attente |
|---|---|
| Ne sait pas ce que c'est | Comprendre : à quoi ça sert, pour quel métier, quelles conditions |
| Sait déjà | Trouver : où le faire, combien ça coûte, quand |

La page doit servir les deux sans choisir. **Réponse retenue : information réglementaire en haut, inventaire au milieu, approfondissement en bas**, avec une table des matières ancrée.

Deux erreurs à éviter :

- Mettre les organismes tout en bas, après 1500 mots — la moitié du trafic est perdue avant d'y arriver.
- Les mettre tout en haut — la page devient un catalogue filtré déguisé et perd sa raison d'être éditoriale.

---

## 3. Deux gabarits, pas un

**Décision actée.** Les titres d'entrée et les formations de recyclage n'ont pas la même intention de recherche, donc pas le même ordre de blocs.

| | Gabarit A — Titre d'entrée | Gabarit B — MAC / recyclage |
|---|---|---|
| Exemples | TFP APS, SSIAP 1, TFP ASC | MAC APS, MAC SSIAP, remises à niveau |
| Profil du visiteur | Découvre le métier | Est déjà titulaire, connaît le secteur |
| Question dominante | « qu'est-ce que c'est, est-ce pour moi » | « quand dois-je le faire, combien, où » |
| Ordre des blocs de fond | Définition → débouchés → prérequis → programme → coût | Échéance et obligation → coût → prérequis → programme |
| Bloc « à quoi ça mène » | Présent | Absent |
| Bloc « quand le faire » | Absent | **Présent, en haut** |

Le reste de la structure (en-tête, organismes, maillage, FAQ) est identique. Un seul composant, deux configurations d'ordre.

---

## 4. Ordre des blocs — gabarit A (titre d'entrée)

| # | Bloc | Fonction dominante |
|---|---|---|
| 1 | Fil d'Ariane | Maillage remontant |
| 2 | En-tête + ligne de faits clés | **Capture de snippet** |
| 3 | Table des matières ancrée | Navigation |
| 4 | Ce que c'est / à quoi ça mène | Compréhension |
| 5 | Prérequis et conditions d'accès | **Passerelle démarches** |
| 6 | Programme et déroulé | Profondeur |
| 7 | Durée, coût, financement | Question la plus posée |
| 8 | **Les organismes qui préparent ce titre** | **Bloc pivot** |
| 9 | Où se former en Île-de-France | Maillage géographique |
| 10 | Titres liés | Maillage latéral |
| 11 | Démarches associées | Maillage adjacent |
| 12 | FAQ | Longue traîne |
| 13 | Accroche formulaire d'affinage | Conversion |
| 14 | Footer | Maillage secondaire |

**Gabarit B** — mêmes blocs, avec l'ordre de fond modifié : 4 devient « quand faire ce recyclage » et remonte avant les prérequis ; le bloc débouchés disparaît ; le bloc coût remonte en position 5.

---

## 5. Détail des blocs

### 1. Fil d'Ariane

**Contenu** — `Sécurité privée > [Intitulé du titre]`.

**SEO** — balisage `BreadcrumbList`. Seul lien remontant vers la tête de silo.

---

### 2. En-tête + ligne de faits clés

**Contenu** — H1 portant l'intitulé exact du titre, une phrase de définition, puis une ligne de faits : durée réglementaire, niveau de qualification, prérequis principal, ordre de grandeur de coût, nombre d'organismes en Île-de-France.

> **Bloc le plus rentable de la page.**

**Pourquoi** — c'est ce que le visiteur cherche en premier, c'est ce qui capture les featured snippets, et c'est ce qui différencie la page d'un article de blog générique. À traiter comme de la donnée structurée alimentée par le référentiel, pas comme du texte rédigé au cas par cas.

**Conditionnement** — le compteur d'organismes suit la règle du seuil, comme partout ailleurs.

**Vigilance contenu** — les durées et intitulés officiels doivent être vérifiés à la source (France Compétences, ADEF, arrêtés applicables) et datés. Une erreur factuelle sur un prérequis ou une durée coûte cher en crédibilité sur un sujet réglementé.

---

### 3. Table des matières ancrée

**Contenu** — liens d'ancre vers les sections de la page.

**Pourquoi** — sur une page de 1500 mots servant deux intentions, c'est ce qui permet à celui qui sait déjà d'aller directement aux organismes ou au coût.

**SEO** — ancres en dur, jamais en JavaScript. Bénéfice secondaire : les ancres peuvent remonter comme sitelinks dans les résultats.

---

### 4. Ce que c'est / à quoi ça mène

**Contenu** — définition du titre, métiers accessibles, cadre légal, ce que la carte professionnelle autorise.

**Gabarit B** — remplacé par « quand faire ce recyclage » : périodicité, échéance, conséquence d'un dépassement.

---

### 5. Prérequis et conditions d'accès

**Contenu** — âge, casier judiciaire, niveau de français, autorisation préalable du CNAPS, conditions particulières au titre.

**Pourquoi ce bloc est critique** — c'est le point où un candidat découvre qu'il ne peut pas s'inscrire immédiatement. C'est donc la passerelle naturelle vers les pages démarche.

**Maillage** — un lien contextuel en plein texte vers la page démarche correspondante vaut mieux que dix liens en pied de page.

---

### 6. Programme et déroulé

**Contenu** — modules, volumes horaires, modalités d'évaluation, épreuves d'examen.

**Règle** — contenu réglementaire pur, identique quel que soit l'organisme. Écrit une seule fois, ici, jamais repris ailleurs sur le site.

---

### 7. Durée, coût, financement

**Contenu** — ordres de grandeur de tarif, éligibilité CPF, France Travail, OPCO, plan de développement des compétences.

**Pourquoi ici** — c'est la deuxième question la plus posée après « qu'est-ce que c'est ». En gabarit B, elle est la première : ce bloc remonte.

---

### 8. Les organismes qui préparent ce titre

> **Bloc pivot de la page.** C'est là que le contenu éditorial devient de l'inventaire.

**Contenu** — 6 à 10 fiches maximum, cartes identiques à celles du catalogue, tri par score de complétude. Puis un lien vers le catalogue filtré sur ce titre.

**Trois règles**

- **Pas de pagination, pas de filtres.** Sinon la page duplique `/organismes/?titre=[slug]`, que la structure d'URL interdit précisément d'indexer.
- **Le lien vers le catalogue** pointe vers la version filtrée, non indexable. C'est de l'usage, pas du référencement.
- **Balisage `ItemList`**, liens `<a>` en dur.

**Conditionnement** — sous le seuil, ce bloc est masqué entièrement. Avec deux organismes affichés, il est plus dommageable qu'absent : il donne une impression de vide sur la page censée porter le trafic.

---

### 9. Où se former en Île-de-France

**Contenu** — liens vers les pages géographiques, avec compteurs par zone.

**Règle anti-cannibalisation** — ce bloc **liste** les zones, il ne développe rien. C'est la page géographique qui traite « TFP APS en Seine-Saint-Denis ». Écrire deux paragraphes par département ici viderait les pages géographiques de leur substance.

C'est la principale source de cannibalisation à venir dans le silo. À surveiller à chaque itération éditoriale.

---

### 10. Titres liés

**Contenu** — le MAC associé, le titre de niveau supérieur, les titres du même parcours métier.

**Pourquoi** — c'est ce qui fait exister le référentiel comme un ensemble cohérent plutôt qu'une collection de pages isolées. Maillage latéral de très bonne qualité, et il retient le visiteur dans le silo.

**Règle** — ne lier que vers des pages piliers **publiées**. Voir section 7 sur le statut des titres.

---

### 11. Démarches associées

**Contenu** — carte professionnelle, autorisation préalable, renouvellement.

**Pourquoi** — trafic adjacent à faible concurrence, et cohérence thématique du silo.

---

### 12. FAQ

**Contenu** — 6 à 10 questions spécifiques à ce titre.

**SEO** — balisage `FAQPage`. Questions distinctes de celles de l'accueil, du catalogue et des autres pages piliers. Sur 25 pages piliers, le risque de FAQ interchangeables est réel : chaque question doit être spécifique au titre traité.

---

### 13. Accroche formulaire d'affinage

**Contenu** — bloc court : « ce titre ne correspond pas à votre situation ? ».

**Pourquoi ici** — le visiteur qui a lu toute la page sans se décider est exactement la cible du formulaire.

---

### 14. Footer

Identique au footer global du silo.

---

## 6. Le risque du gabarit répété

Vingt-cinq pages construites sur le même squelette, c'est le chemin le plus court vers une famille de pages évaluées comme faibles, dont une ou deux seulement rankent.

**Règle : au moins 40 % de contenu réellement spécifique par page.** Pas seulement les noms et les chiffres changés — des angles différents.

Exemples concrets de ce qui doit différer :

- Un MAC n'a pas de bloc débouchés, mais il a un bloc échéance que le titre d'entrée n'a pas.
- Un SSIAP 2 a un prérequis d'expérience professionnelle que le SSIAP 1 n'a pas.
- Un TFP ASC porte des contraintes propres au chien (détention, certificat vétérinaire) qui n'existent nulle part ailleurs.
- Les titres d'encadrement s'adressent à un public déjà en poste, avec une logique de progression de carrière.

Une page pilier qui pourrait être obtenue par rechercher-remplacer depuis une autre est une page à réécrire.

---

## 7. Le référentiel a deux niveaux

**Point structurant, à implémenter dès la V1.**

La liste des titres du référentiel et la liste des pages piliers publiées ne sont pas la même chose. Un titre peut être cochable par les organismes sans que sa page éditoriale existe encore.

Il faut donc un **statut par titre** :

| Statut | Cochable par l'organisme | Page pilier | Lien depuis la grille d'accueil |
|---|---|---|---|
| Actif, page publiée | Oui | Oui | Lien vers la page |
| Actif, page non publiée | Oui | Non | Libellé non cliquable, ou masqué |
| Archivé | Non | Redirection ou 410 | Absent |

Sans ce statut, la grille de l'accueil et les blocs « titres liés » pointeront vers des 404.

**Cas de l'archivage** — un titre dont l'enregistrement RNCP expire doit sortir du référentiel. La page existante ne doit pas être supprimée sèchement : redirection vers le titre qui le remplace, ou conservation avec mention explicite du statut. Vérification de la liste à prévoir périodiquement.

---

## 8. Périmètre et phasage

Le référentiel complet représente **23 à 25 pages piliers** : les titres de la branche (surveillance, cynophile, sûreté aéroportuaire, protection rapprochée, transport de fonds, vidéoprotection, encadrement), leurs MAC respectifs, et les trois niveaux SSIAP avec leurs maintiens et remises à niveau.

Elles ne seront pas produites en une fois. Phasage retenu :

| Phase | Pages | Contenu |
|---|---|---|
| **1** | 6 | TFP APS, MAC APS, SSIAP 1, SSIAP 2, MAC SSIAP 1, TFP ASC |
| **2** | 6 | SSIAP 3, MAC SSIAP 2 et 3, TFP ASA, TFP APR, remises à niveau |
| **3** | reste | Transport de fonds, vidéoprotection, chef d'équipe, dirigeant, MAC des titres rares |

**Logique du phasage** — la phase 1 concentre l'essentiel du volume de recherche et couvre les deux familles (branche et SSIAP). La phase 3 porte peu de volume mais se positionne facilement : presque personne ne traite ces titres correctement.

---

## 9. Conséquences sur les autres pages

**Grille de l'accueil (bloc 3)** — elle était pensée pour une quinzaine de cartes à plat. Avec 25 titres, elle devient un mur. À regrouper par famille : surveillance humaine, sécurité incendie, spécialités, encadrement, recyclages. La spécification UX de l'accueil est à mettre à jour sur ce point.

**Structure d'URL** — la liste des slugs réservés doit être vérifiée contre chaque slug de titre ajouté au référentiel.

**Filtre du catalogue** — alimenté par les titres actifs, qu'ils aient ou non une page publiée.

---

## 10. Règles techniques transverses

- **Rendu côté serveur** pour tout le contenu textuel et tous les liens.
- **Un seul H1**, portant l'intitulé officiel du titre.
- Hiérarchie H2/H3 propre, sans saut de niveau.
- Données structurées : `BreadcrumbList`, `FAQPage`, `ItemList` sur le bloc organismes. Envisager `Course` sur le titre lui-même, à valider selon l'évolution des recommandations Google.
- Ancres de table des matières en dur.
- Accordéons acceptables si le texte est dans le DOM au chargement.
- Aucun élément cliquable sans balise `<a>`.

---

## 11. Ce qu'il ne faut pas mettre

- Un listing paginé ou filtrable d'organismes — c'est le rôle du catalogue
- Un développement géographique par département — c'est le rôle des pages géographiques
- Le contenu réglementaire répété depuis une autre page du silo
- Un lien vers une page pilier non publiée
- Une FAQ interchangeable d'un titre à l'autre
- Des chiffres réglementaires non sourcés ni datés

---

## 12. Points ouverts

- **Arrêter la liste exacte du référentiel** et vérifier chaque titre à la source (France Compétences, ADEF, arrêtés applicables). Bloquant pour l'ouverture des inscriptions.
- **Chiffrer le seuil d'affichage du compteur** — commun à toutes les pages du silo.
- **Définir le calcul du score de complétude** — il pilote le tri du bloc organismes.
- **Décider du traitement des titres archivés** — redirection ou conservation avec mention.
- **Mettre à jour la grille de l'accueil** pour le regroupement par famille.

---

## 13. Documents liés

- **Note de cadrage** — concept, modèle économique, go-to-market
- **Architecture des pages** — inventaire des pages et de leurs rôles
- **Structure d'URL** — nommage, arborescence, règles d'indexation
- **UX Page d'accueil** — tête de silo
- **UX Catalogue organismes** — page canonique du catalogue
- **UX Landing organismes** — sas de conversion B2B
- **À produire** — spécification UX de la fiche organisme, des pages démarche et géographiques
