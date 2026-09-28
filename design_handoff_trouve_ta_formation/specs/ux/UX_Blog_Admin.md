# Spécification UX — Blog admin

**Trouve ta formation — Verticale sécurité privée**
`admin.trouve-ta-formation.fr/blog`
Version 1.0 — 31 août 2026

---

## 1. Rôle du module

Outil de création et de gestion des articles qui alimentent le blog public (`/securite-privee/blog/`). Sa mission : permettre de produire, sans limite technique, tout ce que la spec *Blog et articles* exige côté rendu — encadré de synthèse, table des matières, tableaux, listes, images légendées, call-outs, bloc auteur, accroche contextuelle, articles liés — sans jamais forcer un contournement (copier-coller depuis un autre outil, mise en forme approximative) faute de fonctionnalité disponible.

**Deux pages**, sur le modèle déjà retenu pour Fichier client / Fiche client : une liste de gestion, un éditeur de contenu.

| Page | Rôle |
|---|---|
| Liste des articles | Vue d'ensemble, statuts, accès à l'édition |
| Éditeur d'article | Rédaction complète, métadonnées, composants éditoriaux |

---

## 2. Liste des articles

### Colonnes

| Colonne | Contenu |
|---|---|
| Titre | Lien vers l'éditeur |
| Catégorie | Une des catégories de la liste fermée |
| Statut | Brouillon / Publié |
| Auteur | Nom de l'auteur |
| Dernière modification | Date |

### Filtres et tri

- Filtre par statut (Brouillon / Publié)
- Filtre par catégorie
- Recherche libre par titre
- **Tri par défaut** : dernière modification la plus récente — cohérent avec un usage où l'admin reprend probablement un brouillon en cours plus souvent qu'il ne consulte les articles déjà publiés

### Action principale

Bouton « Nouvel article », toujours visible, ouvre l'éditeur vide.

---

## 3. Éditeur d'article

### 3.1 Métadonnées

Bloc fixe en tête d'éditeur, distinct du corps de l'article.

| Champ | Détail |
|---|---|
| Titre (H1) | Affiché en tête de l'article public |
| Titre SEO | Balise `<title>`, distinct du H1 si besoin — pré-rempli avec le H1, modifiable |
| Meta description | Plafonnée à la longueur affichée par les moteurs, compteur de caractères |
| Slug | Auto-généré depuis le titre, modifiable manuellement |
| Catégorie | Liste fermée (4 catégories maximum, cf. point ouvert de la spec Blog) |
| Auteur | Rattaché à l'article — voir point ouvert en section 6 sur la gestion des auteurs |
| Image de couverture | Upload, avec nom de fichier et texte alternatif à renseigner (voir 3.3) |
| Article réglementaire | Case à cocher — si activée, fait apparaître le champ Date de vérification |
| Date de vérification | Visible uniquement si « Article réglementaire » est coché |

**Dates de publication et de mise à jour** — non saisies manuellement. La date de publication s'enregistre automatiquement au premier passage en statut Publié ; la date de mise à jour s'enregistre automatiquement à chaque modification d'un article déjà publié. Aucune raison de laisser l'admin les modifier à la main : ce sont des faits, pas des choix éditoriaux, et une date falsifiable viderait le signal de fraîcheur de son sens.

**Temps de lecture** — calculé automatiquement à partir du nombre de mots du corps de l'article, jamais saisi.

### 3.2 Corps de l'article — éditeur enrichi

Édition WYSIWYG en un seul flux, sans limite de longueur ni de nombre de composants.

**Mise en forme de texte** : gras, liens (voir 3.4), titres H2/H3 (jamais de saut de niveau imposé — l'éditeur bloque H4 tant qu'aucun H3 n'a été posé avant, pour garantir la hiérarchie propre exigée par la spec Blog).

**Listes** : à puces, numérotées.

**Tableaux** : insertion libre, nombre de lignes et colonnes non limité, édition cellule par cellule.

**Images inline** : voir 3.3.

**Table des matières** : générée automatiquement à partir des H2/H3 du corps, sans action de l'admin. N'apparaît sur la page publique qu'au-delà de 1000 mots, conformément à la règle déjà actée — l'éditeur affiche un indicateur du nombre de mots courants pour que l'admin sache si le seuil est atteint.

### 3.3 Gestion des images

À chaque insertion d'image dans le corps ou en couverture :

- **Nom de fichier** — modifiable avant upload, pour produire un slug propre (ex. `carte-professionnelle-cnaps.webp`) plutôt que le nom brut du fichier local
- **Texte alternatif** — champ obligatoire, l'insertion est bloquée tant qu'il est vide, cohérent avec l'exigence déjà actée dans la spec Blog (« texte alternatif descriptif obligatoire »)
- **Légende visible** — champ optionnel, affiché sous l'image sur la page publique

**Pourquoi bloquer l'insertion sans texte alternatif plutôt que de le rendre simplement recommandé** — une case facultative se vide en pratique sous la pression du rythme de publication. Vu que c'est un point explicitement exigé ailleurs dans le projet, l'éditeur doit le garantir structurellement plutôt que compter sur la discipline éditoriale.

### 3.4 Liens

Deux types, distingués à l'insertion :

- **Lien interne** — sélection assistée parmi les pages piliers, pages démarche, et autres articles du blog (pas de saisie d'URL à la main, pour éviter tout lien cassé vers une page interne)
- **Lien externe** — saisie libre d'URL, pour les liens sortants sourcés déjà identifiés comme un signal de fiabilité fort dans la spec Blog

### 3.5 Call-outs

Trois types fixes, repris tels quels de la spec Blog — pas de type personnalisé :

| Type | Usage |
|---|---|
| Point de vigilance | Une erreur fréquente, un piège réglementaire |
| Chiffre clé | Une donnée à isoler visuellement |
| Renvoi contextuel | Lien vers la page formation ou démarche concernée |

Insertion depuis un menu dédié dans le corps de l'article. **Aucune limite technique posée dans l'éditeur** au nombre de call-outs insérés — la règle de deux à trois maximum par article reste éditoriale, pas un blocage de l'outil, cohérent avec la logique « pas de limite » demandée pour ce module. Un indicateur visuel dans l'éditeur peut signaler le dépassement sans l'empêcher.

### 3.6 Blocs structurels de fin d'article

Trois blocs, dans cet ordre, distincts du flux libre du corps :

| # | Bloc | Contenu | Mode |
|---|---|---|---|
| 1 | Encadré de synthèse | 3 à 4 faits clés | Texte libre, saisi par l'admin |
| 2 | À retenir | 3 points de clôture | Texte libre, saisi par l'admin |
| 3 | Bloc auteur | Nom, qualification, photo | Repris automatiquement du profil auteur sélectionné en métadonnées |

### 3.7 Blocs de conversion — accroche contextuelle et CTA générique

Deux blocs distincts, l'un après l'autre, en toute fin d'article avant les Articles liés.

**1. Accroche formation contextuelle** — lien vers une page formation ou démarche précise, choisie par l'admin (sélection assistée, même mécanique que les liens internes en 3.4). Reprend la règle déjà actée : jamais générique, un lien pertinent au sujet exact de l'article.

**2. CTA générique vers le formulaire d'affinage** — bloc encadré, texte fixe du type « Vous cherchez la formation qui vous correspond ? », bouton renvoyant vers le formulaire d'affinage plutôt que vers le catalogue brut. **Ce bloc n'est pas un composant que l'admin insère ou personnalise** : il est ajouté automatiquement à tout article publié, avec un texte et un lien fixes, exactement comme les call-outs ont un nombre de types fermé. La cohérence entre tous les articles est voulue — c'est un filet de conversion générique par design, il n'a pas vocation à varier d'un article à l'autre.

**Pourquoi les deux coexistent sans se cannibaliser** — l'accroche contextuelle sert le lecteur qui sait déjà quel titre il cherche (lien de contenu, pertinent pour le maillage). Le CTA générique sert celui qui ne le sait pas encore et a besoin d'être orienté (lien de conversion, pas de maillage de contenu). Les deux répondent à des lecteurs différents, pas au même besoin avec une redondance.

### 3.8 Articles liés

Sélection de 3 articles à afficher en fin de page. **Suggestion assistée** — l'éditeur propose des articles de la même catégorie ou d'un thème proche, que l'admin peut accepter tel quel ou ajuster manuellement. Jamais une sélection strictement automatique et non modifiable : l'admin garde la main sur la pertinence finale.

### 3.9 Publication

Deux statuts, pas de programmation :

- **Enregistrer en brouillon** — sauvegarde sans mise en ligne, accessible uniquement depuis l'admin
- **Publier** — mise en ligne immédiate sur le blog public, dès validation par l'admin

**Pas de date de publication programmée en V1** — un article validé part en ligne immédiatement. Ça simplifie le workflow, au prix de devoir séquencer manuellement une publication avec la sortie d'une page formation liée (contrainte déjà identifiée dans la spec Blog), plutôt que de compter sur une programmation automatique.

---

## 4. Ce qu'il ne faut pas faire

- Bloquer ou limiter le nombre de tableaux, d'images, de call-outs ou de blocs dans le corps de l'article — l'outil ne doit poser aucune limite technique, seules les règles éditoriales (ex. 2-3 call-outs) s'appliquent en tant que recommandation, jamais en tant que blocage
- Permettre l'insertion d'une image sans texte alternatif
- Permettre un lien interne cassé via une saisie d'URL libre — tout lien interne passe par la sélection assistée
- Ajouter un type de call-out en dehors des trois fixés
- Laisser l'admin modifier manuellement la date de publication ou de mise à jour
- Permettre un saut de niveau de titre (H2 direct vers H4)
- Rendre le CTA générique de fin d'article personnalisable par article — il doit rester strictement identique partout
- Rendre la sélection des articles liés totalement automatique sans possibilité d'ajustement manuel

---

## 5. Impact sur la spec publique du Blog

**La structure de la page article (section 4 de la spec Blog et articles) doit être mise à jour** pour intégrer le nouveau bloc CTA générique, positionné après le bloc 8 (Accroche formation contextuelle) et avant le bloc 9 (Articles liés). À reporter dans ce document lors de sa prochaine révision.

---

## 6. Points ouverts

- **Gestion des auteurs** — la spec Blog identifie l'auteur affiché sur les articles comme point ouvert. Cette spécification suppose un champ de sélection d'auteur en métadonnées, ce qui implique une gestion des profils auteurs (nom, qualification, photo) quelque part dans l'admin — à trancher : gérée depuis Paramètres admin, ou un profil auteur unique fixé en base sans interface dédiée si un seul auteur est prévu au lancement.
- **Liste définitive des catégories** — toujours un point ouvert de la spec Blog (4 maximum), nécessaire pour peupler le champ Catégorie de l'éditeur.
- **Texte exact du CTA générique** — la formulation proposée (« Vous cherchez la formation qui vous correspond ? ») est un exemple, le texte final reste à arrêter.
- **Comportement de la dépublication** — un article publié peut-il repasser en brouillon (dépublication), ou le statut Publié est-il définitif une fois atteint ? Non précisé jusqu'ici, à trancher pour compléter le workflow de la section 3.9.

---

## 7. Documents liés

- **UX Blog et articles** — structure des pages publiques, règles SEO, composants éditoriaux et leur justification, audit de cannibalisation
- **UX Fichier client / UX Fiche client** — modèle de découpage liste + détail repris ici
- **UX Formulaire d'affinage** — destination du CTA générique de fin d'article
- **À produire** — Analytics, Paramètres admin
