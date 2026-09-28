# Copy — Catalogue organismes

**Trouve ta formation — Verticale sécurité privée**
`trouve-ta-formation.fr/securite-privee/organismes/`
Version 1.0 — 1er septembre 2026
Environnement : **Not Log** — intention candidat, « je cherche un centre »

---

## 0. Le point de départ de cette copy

Cette page est la plus exposée au démarrage à froid. L'accueil vit sans inventaire — il a ses titres, ses démarches, son corps éditorial. Les pages démarches vivent sans inventaire par construction. Le catalogue, lui, n'est *que* de l'inventaire.

**Conséquence sur la rédaction** — la copy des états vides et des états dégradés n'est pas une annexe de ce document, elle en est la moitié. Au lancement, une part significative des visiteurs verra un de ces états plutôt que la page nominale. Ils sont traités en section 8, avec le même soin que les blocs standard.

**Deuxième conséquence** — le corps éditorial du bloc 12 porte à lui seul la crédibilité de la page tant que l'inventaire est faible. C'est lui qui empêche le catalogue d'être évalué comme un listing nu. Il est écrit ici en version longue, celle de l'état de lancement.

---

## 1. Métadonnées

### Balise `<title>`

| # | Proposition | Caractères |
|---|---|---|
| **A — recommandée** | Organismes de formation sécurité privée en Île-de-France | 56 |
| B | Centres de formation à la sécurité privée — Île-de-France | 57 |
| C | Annuaire des organismes de formation sécurité privée (IDF) | 58 |

**Pourquoi A** — elle reprend l'expression cible telle qu'elle est tapée. « Organisme de formation » est le terme des requêtes ; « centre de formation » est le terme du langage courant, moins fréquent en recherche sur ce secteur. Garder les deux dans le corps de page, pas dans le title.

### Meta description

> Tous les organismes de formation à la sécurité privée référencés en Île-de-France. Filtrez par titre préparé, département, financement accepté et rythme. Agrément CNAPS et certification Qualiopi indiqués sur chaque fiche.

*(220 caractères. Variante courte à 152 : « Les organismes de formation à la sécurité privée en Île-de-France, filtrables par titre, département et financement. Agrément CNAPS indiqué. »)*

**Point de vigilance** — la description mentionne des filtres. Si l'inventaire au lancement ne permet pas un filtrage utile, elle promet une expérience que la page ne tient pas. Basculer sur la variante courte tant que le seuil n'est pas atteint.

---

## 2. Bloc 1 — Fil d'Ariane

> Sécurité privée › Organismes de formation

Balisage `BreadcrumbList`. C'est le seul lien remontant vers la tête de silo depuis cette page.

---

## 3. Bloc 2 — En-tête de page

> Contrainte : 120 px. Trois éléments texte, pas quatre.

### H1

| # | Proposition |
|---|---|
| **A — recommandée** | Organismes de formation à la sécurité privée en Île-de-France |
| B | Trouver un centre de formation à la sécurité privée |
| C | Les organismes de formation à la sécurité privée |

**Pourquoi A** — la qualification géographique est notre seul territoire réel et elle appartient au H1, pas au chapô. B est plus orienté action mais perd l'expression cible.

### Phrase de contexte

> Comparez les centres agréés par titre préparé, par département et par financement accepté.

**Variante sous le seuil** — voir section 9. La phrase change quand le compteur disparaît.

### Compteur

> **[N] organismes référencés**

Masqué sous le seuil, comme sur l'accueil. Jamais un compteur partiel.

---

## 4. Bloc 3 — Recherche, tri, carte

### Champ de recherche

| Élément | Libellé |
|---|---|
| Placeholder | Nom d'un organisme |
| Label accessible | Rechercher un organisme par son nom |

**Pourquoi un placeholder aussi étroit** — le champ ne cherche que par nom. Un placeholder du type « Rechercher une formation, une ville, un organisme » promettrait une recherche plein texte qui n'existe pas, et chaque recherche décevante enseigne au visiteur que l'outil ne marche pas.

**Rappel produit** — les recherches infructueuses sont à logger dès la V1. Un visiteur qui tape le nom d'un organisme absent de la base signale exactement quel organisme prospecter. C'est de la donnée de prospection gratuite, à cadrer côté données personnelles.

### Sélecteur de tri

| Valeur | Libellé affiché |
|---|---|
| Par défaut | **Pertinence** |
| Option 2 | Ordre alphabétique |
| Option 3 | Par ville |

**Sur le libellé du tri par défaut** — le tri repose sur le score de complétude de fiche. Ne jamais l'afficher sous ce nom. « Fiches les plus complètes » expose une mécanique interne, suggère un classement de qualité que la complétude ne mesure pas, et deviendrait mensonger le jour où le paramètre porte une mise en avant configurée. « Pertinence » est la convention, elle est neutre, et elle reste vraie dans les deux cas.

**Point de cohérence à tenir** — la promesse d'indépendance affichée sur l'accueil et la landing B2B (« aucun organisme ne peut acheter un meilleur classement ») engage ce sélecteur. Le jour où une mise en avant payante existe, elle ne peut pas modifier cet ordre. Le paramètre configurable prévu dans la spécification doit donc servir un emplacement distinct, pas le tri.

### Bouton carte

> **Voir sur la carte**

*Ouvre une modale, pas une nouvelle page.*

---

## 5. Bloc 4 — Chapô éditorial court

> 150 mots maximum. C'est le contenu qui empêche la page d'être lue comme un listing nu, et il doit tenir dans le budget de hauteur.

**Version recommandée (138 mots)**

> Tous les organismes référencés ici dispensent des formations menant aux titres de la sécurité privée : TFP APS, SSIAP, titres de spécialité.
>
> Deux mentions figurent sur les fiches et il ne faut pas les confondre. **L'autorisation d'exercice délivrée par le CNAPS** conditionne la validité de votre formation : un titre obtenu dans un centre non autorisé ne vous ouvrira pas droit à la carte professionnelle. **La certification Qualiopi** ne dit rien de la légalité du centre, mais elle conditionne l'accès aux financements publics et mutualisés, dont le CPF.
>
> Le référencement dans cet annuaire est gratuit et ne constitue ni une recommandation, ni un label. Les informations proviennent des organismes eux-mêmes, qui gèrent leur fiche. Vérifiez l'autorisation d'un centre avant de vous engager.

**Ce que fait ce chapô** — il donne trois choses en cinq phrases : le champ couvert, la distinction agrément/Qualiopi qui est le vrai point de confusion des candidats, et la limite de ce que le référencement signifie. La dernière phrase est un désengagement, et elle renforce plutôt qu'elle n'affaiblit : elle signale que nous ne vendons pas de la confiance.

**Anti-cannibalisation** — ce chapô parle du *choix d'un centre*. Il ne dit pas un mot sur le choix d'un titre, qui appartient à l'accueil.

---

## 6. Bloc 5 — Filtres

### Titre du panneau

> **Affiner** *(desktop, en tête de colonne)*
> **Filtrer** *(bouton sticky mobile)*

Le bouton mobile porte un compteur de filtres actifs : **Filtrer (3)**.

### Libellés des filtres et de leurs options

| Filtre | Libellé affiché | Options |
|---|---|---|
| Localisation | **Où** | Niveau 1 : les 8 départements. Niveau 2 : villes du département sélectionné uniquement. |
| Type de formation | **Formation préparée** | Alimenté par le référentiel fermé, groupé par catégorie |
| Financement | **Financement accepté** | CPF · France Travail · OPCO |
| Rythme | **Rythme** | Temps plein · Cours du soir · Week-end |
| Qualiopi | **Certification** | Certifié Qualiopi *(case à cocher unique)* |

**Sur « Formation préparée » plutôt que « Type de formation »** — le visiteur ne cherche pas un type, il cherche un titre précis. Le libellé doit correspondre à ce qu'il a en tête. Et « préparée » indique implicitement que l'organisme prépare au titre sans le délivrer, ce qui est exact.

**Sur « Où » plutôt que « Localisation »** — deux caractères contre onze, dans une colonne où la hauteur est comptée. Le sens est identique.

### Compteurs par option

> Seine-Saint-Denis (93) **· 24**

Masqués sous le seuil, sur l'ensemble des filtres. Options à zéro grisées et non cliquables, jamais masquées : une option absente laisse penser que le critère n'existe pas.

### Bande contextuelle vers une page éditorialisée

Déclenchée quand un filtre correspond à une page géographique ou pilier existante.

> **Nous avons une page dédiée à la Seine-Saint-Denis** — organismes, spécificités locales et démarches. **La consulter →**

**Variante titre** — « Voir la page dédiée au SSIAP 1 → ».

**Pourquoi cette bande vaut mieux qu'un simple lien** — elle transforme un usage en maillage interne, et elle rattrape la seule vraie faiblesse de la règle d'indexation : le filtre sert l'usage mais ne peut pas ranker, donc il faut renvoyer l'usage vers la page qui, elle, ranke. Sans cette bande, la règle est purement défensive.

### Bouton de réinitialisation

> **Tout effacer**

Visible uniquement quand au moins un filtre est actif.

---

## 7. Bloc 6 — Compteur de résultats

| Situation | Formulation |
|---|---|
| Sans filtre | **[N] organismes** |
| Avec filtre | **[N] organismes correspondent à votre recherche** |
| Un seul | **1 organisme correspond à votre recherche** |
| Aucun | Voir l'état zéro résultat, section 8 |

**Règle** — ne jamais écrire « [N] résultats ». Le mot « résultat » est celui d'un moteur de recherche ; « organisme » est ce que le visiteur cherche, et le répéter renforce la lisibilité de ce que la page liste.

---

## 8. Bloc 7 — Listing et ses quatre états

### 8.1 Composition d'une carte

> Chaque carte doit permettre d'éliminer ou de retenir un organisme **sans cliquer**.

| Zone | Contenu | Règle de rédaction |
|---|---|---|
| Logo | Image, ou monogramme généré à partir du nom si absent | Jamais un placeholder générique |
| Nom | **Ancre du lien vers la fiche** | Le nom seul, jamais « Voir la fiche » |
| Localisation | Ville (département) | + « et [N] autres lieux » si implantations multiples |
| Titres préparés | Puces, libellés courts du référentiel | **L'information la plus lisible après le nom** |
| Financements | CPF · France Travail · OPCO | En pictogrammes ou libellés courts |
| Badge | Qualiopi | Uniquement si renseigné, jamais « non certifié » |

**Sur le badge** — n'afficher que le positif. Un badge « non certifié Qualiopi » transformerait le catalogue en système de notation, ce que la note de cadrage exclut, et punirait les organismes qui n'ont simplement pas rempli le champ.

**Sur la mention des lieux multiples** — « Bobigny (93) et 2 autres lieux ». C'est une information de proximité, donc un critère de sélection réel sur ce marché où la formation est en présentiel.

### 8.2 Carte d'un organisme sans formation déclarée

> Cas fréquent au lancement : l'ajout de formations n'est pas bloquant à l'inscription.

La carte reste lisible, sans vide visuel à la place de la liste de titres. Deux options :

| Option | Traitement | Verdict |
|---|---|---|
| A | Ligne « Formations non renseignées » | **Écartée** — signale un défaut et dévalorise l'organisme |
| B | **La zone de titres disparaît, la présentation courte prend sa place** | **Retenue** |

**Formulation de repli si la présentation est également vide**

> Organisme de formation à la sécurité privée · Bobigny (93)

Une ligne descriptive neutre, générée, plutôt qu'un blanc. La fiche apparaît dans le catalogue non filtré, jamais dans un filtre par titre.

### 8.3 État « résultat unique »

Mise en page adaptée : carte pleine largeur, avec la présentation courte de l'organisme affichée.

**Ligne au-dessus du résultat**

> Un seul organisme correspond à ces critères. Élargissez votre recherche pour en voir davantage.

**Puis, en dessous du résultat**

> **Voir aussi** — les organismes du [département voisin] · les organismes préparant [titre proche]

**Pourquoi traiter cet état** — un résultat unique dans une grille conçue pour douze cartes produit une page qui a l'air cassée. C'est un état fréquent au lancement, et il est systématiquement oublié en spécification.

### 8.4 État « zéro résultat »

> **Le bloc le plus important de cette section.** Une page vide est le seul défaut vraiment rédhibitoire d'un catalogue.

**Titre**

> **Aucun organisme ne correspond à ces critères**

**Rappel des filtres actifs**

> Votre recherche : **SSIAP 3** · **Essonne (91)** · **CPF**

*Chaque filtre affiché avec une croix permettant de le retirer individuellement.*

**Proposition de relâchement — le filtre le plus restrictif identifié automatiquement**

> **Retirez « Essonne » et 12 organismes correspondent.**
> **Retirer ce filtre →**

**Alternative géographique**

> Ou consultez les organismes préparant le SSIAP 3 dans les départements voisins : **Val-de-Marne (94)** · **Hauts-de-Seine (92)** · **Paris (75)**

**Sorties de secours, en bas**

> **Tout effacer et voir les [N] organismes** · **Voir la page dédiée au SSIAP 3 →**

**Ce qui fait la qualité de cet état** — il ne se contente pas de constater le vide. Il nomme le filtre coupable, chiffre le gain du relâchement, et propose deux sorties latérales. La formulation « Retirez X et 12 organismes correspondent » est plus efficace qu'un « Essayez d'élargir votre recherche » parce qu'elle fait le calcul à la place du visiteur.

**À proscrire absolument** — « Aucun résultat trouvé. » seul, une illustration d'état vide sans action, ou un renvoi vers l'accueil du site.

### 8.5 État de chargement

Squelettes de cartes, pas de spinner, pas de texte. Aucune copy à produire : tout message affiché pendant le chargement crée un décalage de mise en page quand il disparaît.

---

## 9. Bloc 8 — Pagination

| Élément | Libellé |
|---|---|
| Précédent | **Précédent** |
| Suivant | **Suivant** |
| Position | **Page 2 sur 9** |

Liens `<a href>` en dur sur chaque numéro. Pas de scroll infini. Absente sous le seuil.

---

## 10. Bloc 9 — Votre organisme n'est pas référencé

### Titre

> **Vous dirigez un organisme de formation ?**

### Texte

> Le référencement est gratuit. Créez la fiche de votre centre et gérez-la vous-même.
> **Référencer mon organisme →**

**Pourquoi ce bloc est mieux placé ici que sur l'accueil** — l'audience B2B y est bien plus probable. Un dirigeant qui regarde ses concurrents atterrit sur cette page, pas sur la tête de silo. Il est aussi, à ce moment précis, dans l'état d'esprit le plus favorable : il vient de voir la fiche d'un concurrent et pas la sienne.

**Traitement visuel** — même sobriété que le bandeau B2B de l'accueil. L'intention de la page reste candidat.

---

## 11. Bloc 10 — Maillage par titre de formation

### H2

> **Chercher par titre de formation**

### Chapô

> Chaque titre dispose d'une page dédiée : programme, conditions d'accès, durée réglementaire et organismes qui le préparent.

### Grille

Un lien par titre du référentiel, ancre portant le nom du titre, compteur d'organismes conditionné au seuil.

**Anti-cannibalisation** — cette grille est visuellement proche de celle de l'accueil, mais son chapô est différent et son rôle aussi : ici, c'est une sortie pour le visiteur qui n'a rien trouvé dans le listing. Ne pas recopier le chapô de l'accueil.

---

## 12. Bloc 11 — Maillage géographique

### H2

> **Chercher par département**

### Chapô

> La formation se déroule en présentiel : la proximité du centre compte.

### Liens

Les 8 départements franciliens, nom en toutes lettres puis numéro, vers les pages géographiques **éditorialisées existantes uniquement**.

---

## 13. Bloc 12 — Corps éditorial développé

> 400 à 800 mots en version nominale. Ci-dessous la **version longue de lancement** (environ 750 mots), à réduire quand l'inventaire portera lui-même la crédibilité de la page.
>
> **Règle anti-cannibalisation** — l'accueil traite « quelle formation choisir ». Cette page traite « comment choisir un organisme ». Aucun recoupement.

---

### H2 — Comment choisir son organisme de formation

Le choix d'un centre se joue sur quatre points, et un seul d'entre eux est éliminatoire.

---

### H2 — Vérifier que le centre est autorisé par le CNAPS

C'est le point éliminatoire, et c'est celui que les candidats vérifient le moins.

Un organisme qui dispense des formations à la sécurité privée doit détenir une autorisation d'exercice délivrée par le CNAPS. Ce n'est pas une distinction commerciale : c'est une condition de validité. **Un titre obtenu dans un centre non autorisé ne vous ouvrira pas droit à la carte professionnelle.** Vous aurez payé, suivi la formation, passé les épreuves, et vous ne pourrez pas exercer.

Le CNAPS met à disposition un espace public de consultation des titres, qui permet de vérifier l'autorisation d'un organisme comme la validité d'une carte professionnelle. La vérification prend une minute et elle est à faire avant tout versement.

Les fiches de cet annuaire indiquent le numéro d'autorisation quand l'organisme l'a renseigné. Son absence sur une fiche ne signifie pas que le centre n'est pas autorisé — seulement qu'il n'a pas rempli le champ. Dans ce cas, demandez-le au centre, et vérifiez-le vous-même.

`[À VÉRIFIER : intitulé exact du service de consultation publique et de l'autorisation d'exercice des organismes de formation, à confirmer sur le site du CNAPS avant publication. Le service existe à l'adresse espace-consultation.cnaps.interieur.gouv.fr.]`

---

### H2 — Ce que garantit la certification Qualiopi, et ce qu'elle ne garantit pas

Qualiopi est une certification portant sur le processus de l'organisme : la façon dont il conçoit ses formations, informe ses candidats, suit ses stagiaires, recueille leurs retours.

Ce qu'elle vous apporte concrètement : **elle conditionne l'accès aux financements publics et mutualisés.** Sans elle, ni CPF, ni France Travail, ni OPCO. Pour la majorité des candidats, c'est donc un critère décisif, non par qualité mais par financement.

Ce qu'elle ne garantit pas : la qualité pédagogique d'une session, le taux de réussite aux épreuves, la compétence d'un formateur en particulier. Et elle ne remplace en aucun cas l'autorisation du CNAPS — les deux sont indépendantes, et seule la seconde conditionne votre carte professionnelle.

---

### H2 — Vérifier que le centre prépare bien le titre que vous visez

Un organisme peut être autorisé, certifié, et ne pas préparer le titre dont vous avez besoin. C'est fréquent sur les spécialités et sur les MAC, où l'offre est plus rare que sur les titres d'entrée.

Vérifiez également **où** la formation se déroule. Un organisme dont le siège est à Paris peut dispenser ses sessions en grande couronne. Sur des formations de plusieurs semaines en présentiel, le trajet quotidien est un critère de faisabilité, pas de confort.

---

### H2 — Les questions à poser avant de s'inscrire

Quatre questions font le tri, et un centre sérieux y répond sans détour.

**Quel est le prix total, tout compris ?** Les frais d'inscription, de dossier ou de passage d'épreuves sont parfois annoncés séparément du prix de la formation.

**Quel est le rythme exact et sur quelle période ?** Temps plein, cours du soir, week-end : c'est ce qui détermine si vous pouvez suivre la formation en conservant un emploi.

**Que se passe-t-il en cas d'échec aux épreuves ?** Rattrapage inclus ou facturé, délai avant nouvelle présentation.

**Quel financement acceptez-vous, et qui monte le dossier ?** Un centre habitué au CPF ou à France Travail vous fera gagner des semaines sur le montage.

---

### H2 — Les pièges à éviter

**Un centre qui vous propose de vous inscrire sans autorisation préalable du CNAPS.** L'autorisation préalable est requise avant l'entrée en formation. Un organisme qui propose de s'en passer vous expose à une formation sans débouché.

**Un prix nettement inférieur au marché sur un titre à durée réglementée.** Les durées de formation sont fixées par la réglementation, pas par les centres. Un tarif très bas signale souvent un volume horaire réduit, ce qui compromet la validité du titre.

**Une promesse d'embauche présentée comme automatique.** Un centre peut avoir des relations avec des employeurs ; il ne peut pas garantir un poste.

---

**Note de rédaction sur ce corps éditorial** — il ne mentionne aucun titre en développement et ne compare aucun titre entre eux. C'est la frontière avec l'accueil, et elle doit tenir mot à mot. Il ne décrit pas non plus les procédures CNAPS : il les nomme et renvoie aux pages démarches, qui en sont propriétaires.

---

## 14. Bloc 13 — FAQ

*Six questions, spécifiques au choix d'un organisme. Balisage `FAQPage`. Aucun recoupement avec la FAQ de l'accueil ni avec celles des pages démarches.*

**Comment vérifier qu'un organisme est autorisé par le CNAPS ?**
Le CNAPS met à disposition un espace public de consultation des titres, qui permet de vérifier l'autorisation d'un organisme. Demandez son numéro d'autorisation au centre et vérifiez-le avant tout versement.

**Un organisme non certifié Qualiopi peut-il me former légalement ?**
Oui, si le CNAPS l'a autorisé. Qualiopi ne conditionne pas la légalité de la formation, mais l'accès aux financements publics et mutualisés, dont le CPF.

**Comment un organisme est-il référencé dans cet annuaire ?**
Les organismes créent et gèrent eux-mêmes leur fiche. Le référencement est gratuit et volontaire.

**Faut-il payer pour figurer dans le catalogue ?**
Non. Le référencement est gratuit et aucun organisme ne peut acheter une meilleure position dans les résultats.

**Pourquoi certaines fiches n'indiquent-elles aucune formation ?**
Parce que l'organisme n'a pas encore renseigné son offre. Ces fiches apparaissent dans le catalogue complet, mais pas dans les résultats filtrés par titre.

**Les informations des fiches sont-elles vérifiées ?**
Elles proviennent des organismes eux-mêmes. Nous vérifions leur déclaration auprès du CNAPS avant publication, mais les tarifs, rythmes et disponibilités relèvent de leur responsabilité et évoluent. Confirmez-les auprès du centre.

**Note** — la dernière question est celle que la plupart des annuaires évitent. Y répondre honnêtement coûte moins qu'un visiteur qui découvre un tarif obsolète et en tire une conclusion sur l'ensemble du site.

---

## 15. La carte — copy de la modale

### Titre de la modale

> **Les lieux de formation**

### Ligne de compteur

> **[N] organismes · [M] lieux de formation**

**Pourquoi les deux nombres** — un organisme avec trois sites produit trois marqueurs. Sans cette mention explicite, l'écart entre le compteur du listing et celui de la carte remonte en recette comme un bug, et il déroute le visiteur attentif.

### Ligne d'héritage des filtres

> Filtres actifs : **SSIAP 1** · **Seine-Saint-Denis (93)** — **Tout effacer**

### Contenu d'un marqueur au clic

> Nom de l'organisme · Adresse complète du lieu · Titres préparés sur ce site · **Voir la fiche →**

**Précision utile** — quand un organisme dispense des titres différents selon ses sites, le marqueur affiche ceux du lieu concerné, pas ceux de l'organisme entier. C'est la raison d'être du choix « un marqueur par lieu ».

### État vide de la carte

> Aucun lieu de formation ne correspond à ces critères. **Élargir la recherche →**

---

## 16. Version de lancement — la page sous le seuil

### Ce qui change

| Élément | Sous le seuil |
|---|---|
| Compteur d'en-tête | Masqué |
| Phrase de contexte | Version alternative, ci-dessous |
| Compteurs par option de filtre | Masqués, options vides grisées |
| Pagination | Absente |
| Corps éditorial | Remonté juste après le listing, en version longue |
| Meta description | Variante courte, sans promesse de filtrage |

### Phrase de contexte alternative

> **Recommandée**
> Les organismes référencés en Île-de-France, avec les titres qu'ils préparent et les financements qu'ils acceptent. L'annuaire s'enrichit chaque semaine.

**Variantes** — « Un annuaire en construction : les organismes s'y référencent progressivement. » (plus transparent, plus risqué sur une page candidat) · « Comparez les centres agréés par titre préparé et par département. » (la version nominale, qui fonctionne aussi sous le seuil)

**Arbitrage recommandé** — la mention « s'enrichit chaque semaine » n'est acceptable que si elle est vraie. Sur la landing B2B, l'honnêteté sur le lancement est un argument, parce que le lecteur est un professionnel qui décide de nous rejoindre. Sur une page candidat, elle n'a pas la même valeur : le candidat ne cherche pas à savoir où nous en sommes, il cherche un centre. Ne pas transposer le ton du bloc 7 de la landing B2B ici.

### Encadré de lancement — proposition, à arbitrer

Placé entre le listing et le corps éditorial, tant que l'inventaire est faible :

> **Vous ne trouvez pas le centre que vous cherchez ?**
> Notre annuaire se construit progressivement. Consultez les pages consacrées à chaque titre de formation, ou dites-nous quel organisme vous cherchiez.
> **Voir les formations →**

**Recommandation : le retenir, sans le formulaire.** L'idée de collecter le nom de l'organisme manquant est bonne pour la prospection, mais elle ajoute un champ, donc une friction, sur une page candidat, et elle crée un traitement de données à cadrer. Le champ de recherche par nom log déjà ces requêtes : la donnée de prospection est obtenue sans rien demander.

---

## 17. Points de vigilance transverses

| Point | Vérification |
|---|---|
| **Libellé du tri** | « Pertinence », jamais « fiches les plus complètes ». Cohérence à tenir avec la promesse d'indépendance affichée ailleurs. |
| **Badges négatifs** | Aucun. Ni « non certifié », ni « fiche incomplète », ni indicateur de complétude visible. |
| **Vocabulaire** | « Organisme » sur toute la page, jamais « résultat » ni « établissement ». « Centre » est acceptable en corps éditorial pour éviter la répétition. |
| **Frontière avec l'accueil** | Le corps éditorial ne compare aucun titre. Le chapô ne parle pas du choix d'un titre. |
| **Frontière avec les démarches** | Les procédures CNAPS sont nommées et liées, jamais décrites. |
| **Promesse de la meta description** | À aligner sur ce que l'inventaire permet réellement au moment de la mise en ligne. |
| **États vides** | À maquetter au même titre que l'état nominal. Ils seront majoritaires au lancement. |

---

## 18. Points ouverts

- **Chiffrer le seuil d'affichage du compteur** — quatrième document où ce point revient. Il conditionne maintenant l'accueil, le catalogue, la landing B2B et cette page.
- **Arrêter le référentiel des titres** — il alimente le filtre principal, la grille du bloc 10 et les libellés de carte.
- **Définir le calcul du score de complétude** — il pilote le tri par défaut, affiché sous le libellé « Pertinence ».
- **Arbitrer l'indexation du catalogue au lancement** — la spécification recommande l'indexation immédiate ; la copy de ce document est écrite dans cette hypothèse.
- **Vérifier l'intitulé exact du service de consultation publique du CNAPS**, cité dans le corps éditorial et dans la FAQ.
- **Cadrer le log des recherches infructueuses** côté données personnelles.
- **Arbitrer l'encadré de lancement** de la section 16.

---

## 19. Documents liés

- **UX Catalogue organismes** — structure des blocs, filtres retenus et écartés, règles d'indexation
- **Copy Page d'accueil** — frontière éditoriale : « quelle formation » contre « quel organisme »
- **Copy Landing organismes** — destination du bloc 9
- **Copy Pages démarches CNAPS** — propriétaires des procédures citées ici
- **UX Fiche organisme** — destination de chaque carte du listing
- **À produire** — copy des pages piliers, des pages géographiques, de la fiche organisme
