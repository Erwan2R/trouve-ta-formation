# Copy — Fiche organisme

**Trouve ta formation — Verticale sécurité privée**
`trouve-ta-formation.fr/securite-privee/organismes/[slug]/`
Version 1.0 — 1er septembre 2026
Environnement : **Not Log** — intention candidat, « est-ce que ce centre me convient »

---

## 0. Le problème central de cette famille de pages

Les quatre pages écrites jusqu'ici sont uniques. Celle-ci existera en plusieurs centaines d'exemplaires, générés depuis le même gabarit.

**Conséquence sur la rédaction : chaque phrase écrite ici sera répétée à l'identique des centaines de fois.** Un chapô de bloc légèrement trop rédigé, une FAQ un peu trop verbeuse, une mention de repli un peu trop présente, et l'ensemble de la famille devient un motif reconnaissable. C'est le mécanisme par lequel un annuaire se fait évaluer comme du contenu de faible valeur — non pas parce qu'une page est mauvaise, mais parce que trois cents pages se ressemblent.

**La copy de ce document est donc écrite à l'inverse des précédentes.** Là où l'accueil et le catalogue cherchaient la richesse éditoriale, celle-ci cherche l'économie : le minimum de texte fixe, le maximum de texte issu des données. Un libellé de bloc de deux mots vaut mieux qu'un chapô de deux lignes.

**Le seul vrai levier de différenciation entre fiches, c'est la présentation libre rédigée par l'organisme.** Elle est traitée en section 17, avec la copy d'accompagnement à afficher dans l'espace organisme — parce que la qualité de ce champ ne se décide pas ici, elle se décide dans l'interface où le dirigeant le remplit.

---

## 1. Métadonnées — gabarits génératifs

> Aucune métadonnée n'est rédigée à la main. Chaque champ est un gabarit avec une cascade de repli selon les données disponibles.

### Balise `<title>`

**Gabarit unique**

```
[Nom de l'organisme] — Formation sécurité privée à [Ville]
```

**Pourquoi un seul gabarit et pas une cascade** — le nom et la ville suffisent à rendre le title unique sur l'ensemble des fiches. Faire varier le title selon les formations déclarées produirait des titles instables : un organisme qui ajoute un titre verrait son title changer, avec le risque de désindexation temporaire que ça implique. La stabilité prime.

**Garde-fou de longueur** — si le nom de l'organisme dépasse 40 caractères, tronquer le gabarit à `[Nom] — Formation sécurité privée`. La ville reste dans le H1 et le corps de page.

### Meta description — cascade à trois niveaux

| Condition | Gabarit |
|---|---|
| **3 formations ou plus déclarées** | `[Nom] forme au [titre 1], [titre 2] et [titre 3] à [Ville] ([dép.]). Financements acceptés : [liste]. Coordonnées, lieux de formation et informations pratiques.` |
| **1 à 2 formations déclarées** | `[Nom] forme au [titre 1] à [Ville] ([dép.]). Financements acceptés : [liste]. Coordonnées, lieux de formation et informations pratiques.` |
| **Aucune formation déclarée** | `[Nom], organisme de formation à la sécurité privée à [Ville] ([dép.]). Coordonnées, lieux de formation et informations pratiques.` |

**Sur le repli sans formation** — il ne mentionne aucun manque. « Formations non renseignées » dans une meta description serait un signal négatif affiché en résultat de recherche, sur une fiche qui n'a rien fait de mal.

**Ordre des titres cités** — celui du référentiel, pas celui de saisie par l'organisme. Un ordre stable évite que la description change à chaque modification de la fiche.

### Open Graph

| Champ | Valeur |
|---|---|
| `og:title` | `[Nom de l'organisme]` |
| `og:description` | Les 150 premiers caractères de la présentation libre, ou le repli de la meta description |
| `og:image` | Logo de l'organisme, ou visuel générique du silo |

---

## 2. Bloc 1 — Fil d'Ariane

> Sécurité privée › Organismes › **[Nom de l'organisme]**

Balisage `BreadcrumbList`. C'est le seul chemin remontant de la page la plus profonde du silo.

**Troncature** — si le nom dépasse la largeur disponible en mobile, tronquer le nom, jamais les segments parents. Un fil d'Ariane amputé de son niveau intermédiaire perd sa fonction.

---

## 3. Bloc 2 — En-tête, identité et badges

### H1

> **[Nom de l'organisme]**

Le nom seul. Pas de « Formation sécurité privée chez [Nom] », pas de ville accolée. Le H1 d'une fiche produit porte le nom du produit, et la requête cible est nominative.

### Ligne de localisation

> [Ville] ([dép.]) · **et [N] autres lieux de formation**

*Second segment affiché uniquement si l'organisme est multi-sites. Lien d'ancre vers le bloc 6.*

### Badges

| Badge | Libellé affiché | Condition |
|---|---|---|
| Agrément CNAPS | **Agréé CNAPS · [numéro]** | Numéro renseigné |
| Qualiopi | **Certifié Qualiopi** | Champ coché |

**Aucun badge négatif.** Ni « agrément non renseigné », ni « non certifié ». Un champ vide n'est pas un défaut avéré, et l'afficher comme tel punirait un organisme qui n'a pas fini de remplir sa fiche.

**Mention sous le badge CNAPS**

> Vérifiable sur l'espace de consultation du CNAPS

*Lien sortant. Court, factuel, et c'est le signal de confiance le plus fort de la page : nous invitons à vérifier ce que nous affichons.* `[À VÉRIFIER : intitulé exact du service]`

### Note Google

> **4,2** · 38 avis Google

Attribution requise. Jamais de note affichée sans son volume d'avis : une note de 5,0 sur deux avis induit en erreur.

---

## 4. Bloc 3 — Barre d'actions

| Action | Libellé desktop | Libellé mobile |
|---|---|---|
| Téléphone | **Appeler** | Icône + **Appeler** |
| Site web | **Site web** | Icône seule |
| Itinéraire | **Itinéraire** | Icône seule |

**Sur « Appeler » plutôt que le numéro affiché** — le numéro reste visible dans le bloc 8. Dans une barre sticky, un libellé d'action est plus lisible qu'une suite de chiffres, et le clic déclenche l'appel sur mobile.

**Actions absentes** — si l'organisme n'a pas renseigné de site web, le bouton disparaît. Jamais un bouton grisé : il donne l'impression d'une fonctionnalité cassée plutôt que d'une donnée manquante.

**Emplacement réservé** — le futur CTA de réservation prend la place du bouton principal, sous le libellé **Réserver**. Rien à écrire aujourd'hui, mais la barre doit être conçue pour accueillir un troisième niveau hiérarchique.

---

## 5. Bloc 4 — Présentation

**Aucun libellé de bloc.** Le texte de l'organisme s'affiche directement, sans titre « Présentation » ni « À propos ». Un intertitre fixe répété sur trois cents fiches ajoute du bruit sans rien apporter.

**Bloc entièrement masqué si le champ est vide.** Pas de texte généré, pas de mention de repli.

---

## 6. Bloc 5 — Les formations proposées

> Cœur de la page.

### Titre de bloc

> **Les formations proposées**

*Variante écartée : « Nos formations ». La fiche est rédigée par le site, pas par l'organisme ; le possessif créerait une ambiguïté sur qui parle.*

### Ligne de formation

| Zone | Contenu | Règle |
|---|---|---|
| Intitulé | **Libellé court du référentiel** | Lien vers la page pilier |
| Durée | [N] heures | Donnée de l'organisme, pas du référentiel |
| Prix | [N] € ou fourchette | « Prix sur demande » si non renseigné |
| Rythme | Temps plein · Cours du soir · Week-end | |
| Lieu | Ville, si différent du siège | Affiché seulement si pertinent |
| Action | **Détails** | Ouvre la vue détaillée |

**Sur « Prix sur demande »** — c'est le seul repli de la page qui nomme une absence, et il est acceptable parce qu'il correspond à une pratique commerciale réelle. « Prix non renseigné » ne le serait pas : la première formule décrit une position de l'organisme, la seconde un défaut de sa fiche.

**Sur la durée** — c'est la durée réelle annoncée par l'organisme, qui peut différer du minimum réglementaire. Ne pas la présenter comme une donnée officielle ; le cadre réglementaire appartient à la page pilier.

### État sans formation déclarée

> **Formations**
> Cet organisme n'a pas encore détaillé son offre de formation. Contactez-le directement pour connaître les titres qu'il prépare.

**Pourquoi cette formulation** — « pas encore détaillé son offre » place le manque du côté d'un travail en cours, pas d'un défaut. Et la seconde phrase transforme l'état vide en action : c'est la seule chose utile qu'on puisse offrir au visiteur à ce stade.

**Conséquence assumée** — cette fiche n'apparaît dans aucun filtre par titre du catalogue, et elle est candidate au `noindex` selon son score de complétude.

---

## 7. Bloc 6 — Lieux de formation

### Titre de bloc

| Cas | Libellé |
|---|---|
| Mono-site | **Adresse** |
| Multi-sites | **Lieux de formation** |

### Composition d'un lieu

> **[Nom du lieu ou « Siège »]**
> [Adresse complète]
> Formations dispensées ici : [libellés courts]

**Sur la dernière ligne** — elle n'apparaît que si l'organisme dispense des titres différents selon ses sites. C'est la raison d'être du bloc : un candidat qui découvre en fin de parcours que « sa » formation se déroule à 40 km du siège a perdu son temps.

### Mention de vigilance

> Les adresses sont déclarées par l'organisme. Confirmez le lieu exact de votre session lors de votre inscription.

**Arbitrage** — recommandation : la retenir, mais en petit et une seule fois sur la page. Sur des formations en présentiel de plusieurs semaines, le lieu est un critère de faisabilité, et l'écart entre siège déclaré et salle réelle est fréquent dans ce secteur.

---

## 8. Bloc 7 — Financements acceptés

### Titre de bloc

> **Financements acceptés**

### Affichage

Liste des financements cochés, en libellés pleins : **CPF** · **France Travail** · **OPCO** · **Plan de développement des compétences**.

**Aucune mention des financements non acceptés.** Le visiteur déduit l'absence ; l'afficher transformerait le bloc en tableau comparatif à charge.

### État vide

> Bloc masqué. Aucun repli.

**Pourquoi masquer plutôt que replier ici** — un bloc « Financements acceptés » suivi d'une mention de non-renseignement est plus dommageable qu'utile sur le critère le plus éliminatoire de la page. Le visiteur qui a besoin du CPF appellera.

### Précision sous la liste

> La certification Qualiopi conditionne l'accès aux financements publics et mutualisés.

*Affichée uniquement si l'organisme est certifié Qualiopi. Une ligne, factuelle, qui donne du sens au badge de l'en-tête.*

---

## 9. Bloc 8 — Informations pratiques

### Titre de bloc

> **Informations pratiques**

### Libellés des champs

| Champ | Libellé |
|---|---|
| Téléphone | **Téléphone** |
| Email | **Email** |
| Site web | **Site internet** |
| Horaires | **Horaires d'accueil** |
| Accessibilité | **Accessibilité** — Locaux accessibles aux personnes à mobilité réduite |
| Langues | **Langues d'enseignement** |
| Création | **Organisme créé en [année]** |
| Déclaration | **Numéro de déclaration d'activité** |

**Chaque ligne dont la donnée est absente disparaît.** Le bloc entier disparaît si aucune donnée n'est renseignée — cas improbable, puisqu'un moyen de contact est obligatoire à la publication.

**Sur l'accessibilité** — n'afficher que le positif. Une mention « locaux non accessibles » serait une information utile au visiteur concerné, mais elle repose sur un champ non coché, qui ne signifie pas la même chose qu'un « non ». Tant que le champ est une case à cocher et non un choix explicite, la mention négative n'est pas fiable.

---

## 10. Bloc 9 — Autres organismes du département

### Titre de bloc

> **Autres organismes en [Département]**

*Le nom du département, pas « dans le même département » : le nom propre rend le titre unique d'une fiche à l'autre, et il est plus informatif.*

### Cartes

Identiques à celles du catalogue. Trois à quatre, même département, fiche courante exclue.

### Lien de fin de bloc

> **Voir tous les organismes en [Département] →**

*Pointe vers la page géographique si elle existe, vers le catalogue filtré sinon.*

### Cas du département sans autre organisme

> Titre remplacé par **Autres organismes en Île-de-France**, sélection élargie à la région.

**Pourquoi élargir plutôt que masquer** — c'est le bloc anti cul-de-sac. Une fiche sans sortie latérale renvoie le visiteur vers son moteur de recherche. Au lancement, où beaucoup de départements n'auront qu'un ou deux organismes, ce repli sera la règle plutôt que l'exception.

---

## 11. Bloc 10 — Maillage vers les pages piliers

### Titre de bloc

> **En savoir plus sur ces formations**

*Variante écartée : « Les titres préparés par cet organisme ». Elle décrit ce que fait l'organisme, alors que le bloc sert à envoyer le visiteur vers autre chose.*

### Contenu

Un lien par titre déclaré, ancre portant le libellé court du référentiel.

### Ligne d'accompagnement

> Programme, conditions d'accès et durée réglementaire de chaque titre.

**Sur la redondance avec le bloc 5** — elle est volontaire et acceptée par la spécification. Le bloc 5 sert la comparaison, celui-ci sert la distribution d'autorité vers les pages qui portent le trafic principal. Le libellé du bloc justifie la répétition auprès du lecteur : ce n'est pas le même service rendu.

### Bloc masqué si aucune formation déclarée.

---

## 12. Bloc 11 — FAQ courte

> **Le bloc le plus risqué de la page.** La spécification signale déjà qu'une FAQ générée devient un motif répété sur plusieurs centaines de fiches.

### Recommandation : trois questions, aucun balisage `FAQPage`

**Pourquoi pas de balisage** — le balisage suppose un contenu de FAQ propre à la page. Ici, les questions sont identiques d'une fiche à l'autre et seules les réponses varient. Baliser reviendrait à déclarer comme unique un contenu qui ne l'est pas, sur trois cents pages simultanément. Le gain potentiel en affichage enrichi ne vaut pas ce pari.

### Les trois questions

**Quelles formations [Nom] prépare-t-il ?**
[Nom] prépare au [liste des titres]. Retrouvez le détail de chaque formation, avec les tarifs et les rythmes proposés, dans la section ci-dessus.

**[Nom] est-il agréé par le CNAPS ?**
Oui. Son numéro d'agrément est le [numéro], vérifiable sur l'espace de consultation du CNAPS.
*Variante sans numéro renseigné : « Le numéro d'agrément de cet organisme n'est pas renseigné sur sa fiche. Demandez-le directement au centre et vérifiez-le sur l'espace de consultation du CNAPS avant de vous inscrire. »*

**Où se déroulent les formations de [Nom] ?**
*Mono-site :* Les formations se déroulent à [adresse], à [Ville] ([dép.]).
*Multi-sites :* [Nom] dispose de [N] lieux de formation, à [liste des villes].

### Ce qui rend ces trois questions acceptables

Chacune produit une réponse **substantiellement différente** d'une fiche à l'autre — noms de titres, numéro d'agrément, adresses. Une question du type « Comment contacter cet organisme ? » produirait une réponse de structure identique partout et devrait être écartée.

**Règle de contrôle** — si une quatrième question est envisagée un jour, le test est celui-ci : deux fiches prises au hasard donnent-elles des réponses qui diffèrent par autre chose qu'un nom propre ? Si non, elle n'entre pas.

**La variante « agrément non renseigné » mérite attention.** C'est la seule mention négative de toute la page, et elle est assumée : sur le point qui conditionne la validité du titre du candidat, l'omission n'est pas acceptable. La formulation ne dit pas que l'organisme n'est pas agréé — elle dit que nous ne le savons pas et indique comment le savoir.

---

## 13. Bloc 12 — Footer

Footer global du silo, identique à celui de l'accueil.

---

## 14. La vue détaillée d'une formation

> S'ouvre en panneau depuis le bloc 5. Contenu rendu côté serveur même replié.

### Titre du panneau

> **[Libellé long du titre]**
> chez [Nom de l'organisme]

*La seconde ligne évite l'ambiguïté quand le panneau est atteint par ancre directe.*

### Sections et libellés

| Libellé | Contenu | Repli si absent |
|---|---|---|
| **Tarif** | Prix ou fourchette | « Prix sur demande » |
| **Ce que comprend le tarif** | Texte libre de l'organisme | Section masquée |
| **Durée** | Durée réelle annoncée | Section masquée |
| **Rythme** | Temps plein · Cours du soir · Week-end | Section masquée |
| **Lieu** | Adresse du site où la formation est dispensée | Adresse du siège |
| **Financements acceptés** | Liste, propre à cette formation | Renvoi au bloc 7 |
| **Prochaines sessions** | Dates | Section masquée |
| **Comment s'inscrire** | Texte libre de l'organisme | Repli, ci-dessous |

### Repli du bloc d'inscription

> Contactez l'organisme directement pour connaître les modalités d'inscription et les prochaines dates.

### Lien de bas de panneau

> **Tout savoir sur le [libellé court] : programme, conditions d'accès et durée réglementaire →**

**Pourquoi cette ancre longue plutôt qu'un simple nom de titre** — c'est le lien le plus stratégique de la fiche. Il énumère ce que le visiteur ne trouvera pas dans le panneau, ce qui rend le clic utile et évite que l'organisme soit tenté de recopier le contenu réglementaire dans ses champs libres.

### Emplacement réservé

Le bloc **Prochaines sessions** est aujourd'hui masqué faute de données. C'est l'emplacement du futur module de réservation, sous les modalités d'inscription. Rien à écrire, mais la place est tenue.

---

## 15. Les états de la fiche

| État | Traitement copy |
|---|---|
| **Fiche complète** | Nominal |
| **Sans formation déclarée** | Bloc 5 en état vide, blocs 10 et 11 partiellement masqués, meta description en repli niveau 3 |
| **Sans présentation** | Bloc 4 entièrement masqué, `og:description` en repli |
| **Mono-site** | Bloc 6 titré « Adresse », pas de mention de lieux additionnels |
| **Sans site web** | Bouton de la barre d'actions retiré |
| **Sans agrément renseigné** | Badge absent, variante de la question 2 de la FAQ |
| **Sous le seuil de complétude** | `noindex`. Aucune différence visible côté visiteur. |

**Principe transverse** — un état dégradé ne se signale jamais au visiteur, sauf sur l'agrément CNAPS. Partout ailleurs, la donnée manquante fait disparaître son bloc sans commentaire.

---

## 16. Ce qui varie, ce qui ne varie pas

> Tableau de contrôle anti-duplication. À vérifier sur trois fiches réelles avant mise en production.

| Élément | Statut |
|---|---|
| H1 | **Varie** — nom de l'organisme |
| Title | **Varie** — nom + ville |
| Meta description | **Varie** — nom, ville, titres, financements |
| Présentation | **Varie** — texte propre, ou bloc absent |
| Liste des formations | **Varie** — titres, prix, durées, rythmes |
| Lieux | **Varie** — adresses |
| Réponses de la FAQ | **Varie** — titres, numéro d'agrément, adresses |
| Bloc « autres organismes » | **Varie** — département et sélection |
| Titres de blocs | **Fixe** — 7 libellés |
| Questions de la FAQ | **Fixe** — 3 questions |
| Mentions de repli | **Fixe** — 5 formulations |
| Ligne d'accompagnement du bloc 10 | **Fixe** — 1 ligne |

**Total du texte fixe : environ 60 mots par fiche.** C'est l'objectif, et c'est ce qui rend la famille défendable. Chaque ajout de texte rédigé au gabarit augmente ce total sur toutes les fiches à la fois.

**Test de contrôle avant mise en production** — prendre les deux fiches les moins remplies de la base et comparer leur contenu textuel. Si la proportion de texte identique dépasse la moitié, il faut soit enrichir la donnée, soit relever le seuil de `noindex`, soit retirer du texte fixe.

---

## 17. La présentation libre — copy d'accompagnement dans l'espace organisme

> **La section la plus utile de ce document.** Elle ne concerne pas la page publique mais l'interface où le dirigeant remplit le champ. C'est là que se joue la différenciation de toute la famille de pages.

### Le raisonnement

Le texte fixe est réduit au minimum, les données sont structurées et se ressemblent d'un organisme à l'autre — même département, mêmes titres, mêmes financements. **La présentation libre est le seul contenu véritablement unique de la fiche.** Si les organismes la laissent vide ou y collent trois lignes génériques, les fiches se ressemblent quoi qu'on fasse au gabarit.

Or ce champ est rempli dans l'espace organisme, pas ici. La copy qui l'accompagne là-bas détermine donc la qualité de la page publique.

### Plafond recommandé

**1 500 caractères**, soit environ 250 mots. Assez pour dire quelque chose de propre, trop court pour y coller une plaquette commerciale ou y recopier le programme réglementaire d'un titre.

**Minimum indicatif : 300 caractères**, affiché comme repère et non comme contrainte bloquante. Un champ obligatoire à l'inscription serait contraire à la règle de friction minimale déjà posée.

### Libellé du champ

> **Présentez votre organisme**

### Texte d'aide sous le champ

> Ce texte est le seul contenu de votre fiche qui vous soit propre : c'est lui qui la distingue des autres. Quelques pistes — depuis quand vous existez, ce qui caractérise votre pédagogie, vos équipements, votre public habituel, ce qui se passe concrètement pendant une session chez vous.
>
> Inutile de décrire le programme officiel d'un titre : il figure déjà sur la page de la formation, et vos stagiaires y ont accès depuis votre fiche.

### Placeholder

> Ex. : Centre installé à Bobigny depuis 2014, spécialisé dans la formation initiale. Sessions de 12 stagiaires maximum, salle de mise en situation et plateau technique incendie sur place. La plupart de nos stagiaires viennent de Seine-Saint-Denis et du Val-d'Oise et sont accompagnés par France Travail.

**Pourquoi un exemple aussi concret** — un placeholder abstrait produit des réponses abstraites. Celui-ci montre trois choses reproductibles : de l'ancienneté, un détail matériel vérifiable, un public. Un dirigeant qui le lit sait quoi écrire.

### Ce que le texte d'aide ne doit pas faire

- Promettre un gain de visibilité chiffré
- Mentionner le score de complétude ou le tri du catalogue — le lien entre remplissage et position ne doit jamais être explicite, sous peine de transformer le champ en levier de manipulation
- Imposer des mots-clés ou une longueur minimale contraignante

**Point de cohérence** — la promesse d'indépendance affichée publiquement (« aucun organisme ne peut acheter un meilleur classement ») ne dit rien de la complétude, qui reste un critère de tri légitime. Mais l'écrire noir sur blanc dans l'espace organisme créerait une course au remplissage artificiel. Le champ se justifie par sa valeur pour le candidat, pas par son effet sur le classement.

---

## 18. Points de vigilance

| Point | Vérification |
|---|---|
| **Volume de texte fixe** | Environ 60 mots. Tout ajout se paie sur des centaines de pages. |
| **Aucun badge ni mention négative** | Sauf l'agrément CNAPS non renseigné, seule exception assumée. |
| **Pas de balisage `FAQPage`** | Les questions sont identiques d'une fiche à l'autre. |
| **Un seul H1** | Le nom de l'organisme. |
| **Frontière avec la page pilier** | Aucun contenu réglementaire sur la fiche. À contrôler aussi côté organisme : la présentation libre ne doit pas devenir un programme de formation recopié. |
| **Frontière avec la page géographique** | La fiche mentionne ses lieux, elle ne traite pas la formation dans un département. |
| **Ordre des titres cités** | Toujours celui du référentiel, jamais celui de saisie. |

---

## 19. Points ouverts

- **Définir le calcul du score de complétude et le seuil de `noindex`** — sixième document où ce point revient. Il pilote désormais le tri du catalogue, l'échantillon d'accueil, l'indexation des fiches et le test de contrôle de la section 16.
- **Valider le plafond de 1 500 caractères** de la présentation libre.
- **Arbitrer la mention de vigilance sur les adresses** au bloc 6.
- **Vérifier l'intitulé exact de l'espace de consultation du CNAPS**, cité trois fois sur cette page.
- **Décider du balisage** `LocalBusiness` ou `EducationalOrganization`.
- **Prévoir le contrôle a posteriori** de la présentation libre : un organisme qui y recopie un programme réglementaire crée de la duplication interne avec la page pilier. À traiter dans les outils de modération admin.

---

## 20. Documents liés

- **UX Fiche organisme** — structure des blocs, modèle de données, extensibilité
- **Référentiel des titres** — libellés courts et longs, ordre d'affichage
- **Copy Catalogue organismes** — cartes du bloc 9, cohérence des libellés
- **Copy Landing organismes** — ce bloc promet au dirigeant la fiche décrite ici
- **UX Ma fiche** — interface où se remplit la présentation libre de la section 17
- **À produire** — copy des pages piliers, des pages géographiques, du formulaire d'affinage
