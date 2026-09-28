# Spécification UX — Pages démarche CNAPS

**Trouve ta formation — Verticale sécurité privée**
`trouve-ta-formation.fr/securite-privee/demarches/[demarche]/`
Version 1.0 — 30 août 2026

---

## 1. Rôle de ces pages

Traiter les procédures administratives que tout candidat à un métier de la sécurité privée doit accomplir. Elles constituent le **canal de trafic adjacent** du silo.

Trois raisons de les produire tôt :

- **Elles ne dépendent pas de l'inventaire.** Comme les pages formation, elles portent le trafic pendant que la base d'organismes se constitue.
- **La concurrence y est plus faible.** *Demande de carte professionnelle CNAPS*, *renouvellement carte agent de sécurité* sont des requêtes à volume réel que peu d'acteurs traitent correctement.
- **Elles signalent la couverture thématique du silo.** Un site qui traite l'écosystème réglementaire complet est évalué comme plus expert qu'un site qui ne liste que des formations.

### La particularité de ce trafic

Le visiteur d'une page démarche n'est pas toujours en recherche de formation. Quelqu'un qui renouvelle sa carte a déjà son titre. La page doit donc capter ce trafic sans surestimer sa conversion, et le rediriger vers ce qui le concerne réellement — pour un renouvellement, le MAC correspondant.

---

## 2. Périmètre : trois pages, pas quatre

La liste initiale mélangeait deux natures d'objets.

| Objet | Nature | Traitement |
|---|---|---|
| Autorisation préalable | Procédure administrative | **Page démarche** |
| Carte professionnelle | Procédure administrative | **Page démarche** |
| Renouvellement | Procédure administrative | **Page démarche** |
| Aptitude professionnelle | Condition réglementaire | Pas une page démarche |

L'aptitude professionnelle n'est pas une démarche : c'est ce qu'on obtient en passant un titre. Lui consacrer une page démarche créerait un doublon avec les pages formation, qui traitent déjà comment on l'acquiert.

À traiter comme une section du corps éditorial de l'accueil, ou comme un article de blog.

**Une page de liste** `/securite-privee/demarches/` regroupe les trois, avec un chapô court expliquant l'enchaînement des procédures.

---

## 3. Ordre des blocs

| # | Bloc | Fonction dominante |
|---|---|---|
| 1 | Fil d'Ariane | Maillage remontant |
| 2 | En-tête + encadré de synthèse | **Capture de snippet** |
| 3 | Table des matières ancrée | Navigation |
| 4 | À qui s'adresse cette démarche | Tri du visiteur |
| 5 | Les conditions à remplir | **Passerelle formation** |
| 6 | Les pièces à fournir | Bloc le plus consulté |
| 7 | Comment faire la demande | Procédure |
| 8 | Délais et suivi | Question fréquente |
| 9 | Refus, recours, cas particuliers | **Longue traîne** |
| 10 | Ce qu'il faut faire ensuite | **Conversion** |
| 11 | Formations concernées | Maillage descendant |
| 12 | Autres démarches | Maillage latéral |
| 13 | FAQ | Longue traîne |
| 14 | Footer | Maillage secondaire |

---

## 4. Détail des blocs

### 1. Fil d'Ariane

**Contenu** — `Sécurité privée > Démarches > [Intitulé de la démarche]`.

**SEO** — balisage `BreadcrumbList`. Page en profondeur 3, c'est le seul chemin remontant.

---

### 2. En-tête + encadré de synthèse

**Contenu** — H1 portant l'intitulé de la démarche, une phrase de définition, puis un encadré factuel : à qui elle s'adresse, délai indicatif d'instruction, coût, autorité compétente, lieu de dépôt.

> **Bloc le plus rentable de la page.**

**Pourquoi** — sur une requête de procédure, le moteur cherche une réponse courte et factuelle. Elle doit être présente en haut, sous forme de données structurées plutôt que de texte rédigé.

**Datation** — la date de dernière vérification figure dans cet encadré, visible du lecteur. Voir section 5.

---

### 3. Table des matières ancrée

**Contenu** — liens d'ancre vers les sections.

**Pourquoi** — le visiteur qui connaît déjà la procédure vient chercher une information précise, le plus souvent la liste des pièces. Il doit y accéder en un clic.

**SEO** — ancres en dur. Les ancres peuvent remonter comme sitelinks dans les résultats.

---

### 4. À qui s'adresse cette démarche

**Contenu** — qui doit l'accomplir, dans quel cas, à quel moment du parcours.

**Pourquoi ce bloc en premier** — c'est le tri. Celui qui n'est pas concerné doit le comprendre en quelques secondes et être renvoyé vers la démarche ou la page qui le concerne. Une page qui laisse le visiteur découvrir au bloc 6 qu'il n'était pas au bon endroit est une page qui rebondit.

---

### 5. Les conditions à remplir

**Contenu** — nationalité ou titre de séjour, casier judiciaire, condition de moralité, aptitude professionnelle, conditions particulières à la démarche.

**Pourquoi ce bloc est critique** — l'aptitude professionnelle s'obtient par un titre. C'est donc ici que se joue la passerelle vers les pages formation, en lien contextuel en plein texte.

**Maillage** — un lien contextuel dans le corps du texte vaut mieux que dix liens en pied de page.

---

### 6. Les pièces à fournir

**Contenu** — liste concrète et exhaustive des documents.

**Pourquoi** — c'est le bloc le plus consulté de la page, et celui qui justifie à lui seul son existence. C'est aussi le plus repris et partagé.

---

### 7. Comment faire la demande

**Contenu** — le déroulé étape par étape : plateforme utilisée, création de compte, dépôt, accusé de réception, ce qu'on reçoit et quand.

> **Bloc le plus périssable de la page.**

**Vigilance** — les modalités de dépôt des démarches CNAPS ont évolué récemment vers un portail unique. Une page qui décrit un parcours obsolète est activement nuisible : elle fait perdre du temps au visiteur et détruit la crédibilité du site sur l'ensemble du silo.

C'est ce bloc qui déclenche la révision prioritaire à chaque évolution connue.

---

### 8. Délais et suivi

**Contenu** — durée d'instruction indicative, comment suivre l'état du dossier, que faire en l'absence de réponse.

---

### 9. Refus, recours, cas particuliers

**Contenu** — motifs de refus les plus fréquents, voies de recours, situations non standard.

**Pourquoi ce bloc compte** — c'est là que se trouve la longue traîne, et c'est ce qui différencie la page d'une paraphrase du site officiel. Les sources institutionnelles traitent mal les cas de refus ; c'est un angle disponible.

---

### 10. Ce qu'il faut faire ensuite

**Contenu** — la suite logique du parcours. L'autorisation préalable précède l'entrée en formation ; la formation permet la demande de carte ; la carte doit être renouvelée après cinq ans, ce qui suppose un MAC.

> **Bloc de conversion de la page.**

**Pourquoi** — c'est ce qui transforme un trafic administratif en trafic formation. Chaque démarche s'inscrit dans un enchaînement, et le visiteur ne connaît pas toujours l'étape suivante.

---

### 11. Formations concernées

**Contenu** — liens vers les pages formation liées à cette démarche.

Le renouvellement renvoie vers les MAC. L'autorisation préalable renvoie vers les titres d'entrée. La carte professionnelle renvoie vers l'ensemble des titres donnant accès à une carte.

**Règle** — ne lier que vers des pages formation **publiées**, conformément au statut par titre défini dans la spécification des pages formation.

---

### 12. Autres démarches

**Contenu** — liens vers les deux autres pages démarche, et vers la page de liste.

Maillage latéral. Il fait exister les démarches comme un parcours cohérent plutôt que comme trois pages isolées.

---

### 13. FAQ

**Contenu** — 6 à 10 questions spécifiques à cette procédure.

**SEO** — balisage `FAQPage`. Questions distinctes de celles de l'accueil, du catalogue et des pages formation. Sur trois pages démarche traitant des procédures voisines, le risque de FAQ interchangeables est réel.

---

### 14. Footer

Identique au footer global du silo.

---

## 5. Fraîcheur et fiabilité

> **C'est le seul type de page du site qui se dégrade seule si on n'y touche pas.**

Ces pages décrivent une réglementation qui évolue. Trois règles à appliquer sans exception.

### Datation visible

Chaque page porte une **date de dernière vérification**, affichée dans l'encadré de synthèse. Le lecteur sait à quelle date l'information était exacte, et c'est un signal E-E-A-T lisible par un évaluateur.

### Sourçage

Chaque affirmation réglementaire cite son texte source — arrêté, article du code de la sécurité intérieure, page officielle du CNAPS. Une procédure décrite sans source est invérifiable.

### Lien vers la source officielle

**Contre-intuitif, mais nécessaire.** Un lien sortant vers la source officielle est le signal de fiabilité le plus fort sur ce type de contenu. Il ne fait pas perdre de trafic à une page qui explique mieux que l'original — et l'absence de lien sortant sur une page réglementaire est un signal négatif.

### Procédure de révision

- **Vérification semestrielle** de l'ensemble des pages démarche.
- **Révision immédiate** à chaque évolution connue de la procédure ou de la plateforme.
- Le bloc 7 est le point de contrôle prioritaire : c'est celui qui se périme en premier.

---

## 6. Règles anti-cannibalisation

**Avec les pages formation** — la page démarche mentionne qu'un titre est nécessaire et renvoie vers lui. Elle ne développe jamais le programme, la durée ou le contenu d'une formation.

**Entre pages démarche** — les trois procédures partagent des conditions communes (moralité, casier, nationalité). Elles doivent être traitées sous un angle différent sur chaque page, ou traitées en profondeur sur une seule et référencées depuis les autres. Trois blocs « conditions » identiques créent du contenu dupliqué à l'intérieur du silo.

**Avec l'accueil** — le corps éditorial de l'accueil mentionne les prérequis communs. Il ne détaille aucune procédure.

---

## 7. Règles techniques transverses

- **Rendu côté serveur** pour tout le contenu textuel et tous les liens.
- **Un seul H1.**
- Hiérarchie H2/H3 propre, sans saut de niveau.
- Données structurées : `BreadcrumbList`, `FAQPage`. Envisager `HowTo` sur le bloc 7, à valider selon l'évolution des recommandations Google.
- Ancres de table des matières en dur.
- Accordéons acceptables si le texte est dans le DOM au chargement.
- Aucun élément cliquable sans balise `<a>`.

---

## 8. Ce qu'il ne faut pas mettre

- Le contenu d'une formation — il vit sur la page formation
- Une paraphrase du site officiel sans valeur ajoutée
- Une procédure non datée
- Une affirmation réglementaire non sourcée
- Un lien vers une page formation non publiée
- Des blocs « conditions » identiques d'une démarche à l'autre
- Une page démarche pour l'aptitude professionnelle — ce n'est pas une démarche

---

## 9. Points ouverts

- **Arrêter la liste définitive des démarches couvertes** — trois retenues, à confirmer.
- **Vérifier chaque procédure à la source** avant publication, et dater la vérification.
- **Décider du balisage `HowTo`** sur le bloc procédure.
- **Inscrire la révision semestrielle** dans un calendrier éditorial, faute de quoi elle ne sera pas faite.

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
- **À produire** — spécification UX des pages géographiques, parcours du formulaire d'affinage
