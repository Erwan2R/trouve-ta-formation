# Copy — Page d'accueil

**Trouve ta formation — Verticale sécurité privée**
`trouve-ta-formation.fr/securite-privee/`
Version 1.0 — 1er septembre 2026
Environnement : **Not Log** (visiteur non connecté)

---

## 0. Métadonnées de la page

### Balise `<title>`

| # | Proposition | Caractères |
|---|---|---|
| **A — recommandée** | Formation sécurité privée en Île-de-France : organismes et titres | 65 |
| B | Formation sécurité privée Île-de-France — Trouve ta formation | 61 |
| C | Devenir agent de sécurité en Île-de-France : toutes les formations | 66 |

**Pourquoi A** — elle place le mot-clé principal en tête, ajoute la qualification géographique qui est notre seul territoire réel, et annonce les deux objets de la page (organismes + titres) plutôt que la marque. La marque n'a aucune notoriété au lancement : lui donner 22 caractères de titre est du gaspillage. À réintroduire quand le nom sera recherché en direct.

### Meta description

> Tous les organismes de formation à la sécurité privée d'Île-de-France, titre par titre et département par département. TFP APS, SSIAP, cynophile, sûreté aéroportuaire : identifiez la formation qui correspond à votre situation.

*(228 caractères — Google en affichera ~155, mais le surplus n'est pas pénalisant et sert les requêtes longues.)*

**Variante courte (155 c.)**

> Organismes de formation à la sécurité privée en Île-de-France : TFP APS, SSIAP, cynophile, aéroportuaire. Trouvez le titre adapté à votre situation.

### Open Graph

| Champ | Valeur |
|---|---|
| `og:title` | Formation sécurité privée en Île-de-France |
| `og:description` | L'annuaire des organismes de formation à la sécurité privée en Île-de-France. |
| `og:type` | website |

---

## 1. Header + navigation

**Rôle copy** — les libellés de navigation sont les ancres les plus répétées du site. Chacun doit contenir un mot-clé, jamais un verbe creux.

| Élément | Libellé | Destination |
|---|---|---|
| Logo | Trouve ta formation *(baseline en petit : « Sécurité privée »)* | `/securite-privee/` |
| Nav 1 | **Les formations** *(menu déroulant)* | ancres vers piliers |
| Nav 2 | **Organismes** | `/securite-privee/organismes/` |
| Nav 3 | **Démarches CNAPS** | `/securite-privee/demarches/` |
| Nav 4 | **Blog** | `/securite-privee/blog/` |
| CTA | **Espace organisme** | `partenaires.trouve-ta-formation.fr` |

### Contenu du menu « Les formations »

Groupé par catégorie, tous les titres visibles, aucun repli.

```
AGENT DE SÉCURITÉ            SÉCURITÉ INCENDIE           SPÉCIALITÉS
TFP APS                      SSIAP 1                     Agent cynophile
MAC APS                      SSIAP 2                     Sûreté aéroportuaire
Agent de sécurité magasin    SSIAP 3                     Protection rapprochée
                             Recyclage SSIAP             Transport de fonds
```

**À ne pas écrire** — « Nos formations » (nous n'en dispensons aucune), « Catalogue » (ambigu avec le catalogue d'organismes), « Découvrir » (ancre sans valeur).

---

## 2. Hero

> Contrainte : 400 px de hauteur. La copy doit tenir en 3 éléments texte + 2 boutons + 1 ligne.

### H1 — propositions

| # | Proposition |
|---|---|
| **A — recommandée** | Trouvez votre formation en sécurité privée en Île-de-France |
| B | Formation sécurité privée en Île-de-France : tous les organismes, tous les titres |
| C | Se former à la sécurité privée en Île-de-France |

**Pourquoi A** — elle contient l'expression exacte *formation sécurité privée*, ajoute la qualification géographique, et le verbe à l'impératif oriente vers l'action sans promettre autre chose que ce que fait la page. B est plus complet sémantiquement mais long à l'affichage sur mobile ; à retenir si le H1 tient sur deux lignes dans la maquette.

### Phrase de promesse

> **Recommandée**
> Comparez les organismes agréés d'Île-de-France, titre par titre et département par département. Un annuaire indépendant, sans commission ni classement payant.

**Variantes**

- *Orientée problème* — « Quinze titres, des dizaines d'organismes, des règles CNAPS qui changent : cette page vous aide à savoir par où commencer. »
- *Orientée exhaustivité* — « L'ensemble des organismes de formation à la sécurité privée référencés en Île-de-France, avec les titres qu'ils préparent et les démarches à accomplir. »

**Point d'attention** — « sans commission ni classement payant » est la phrase la plus différenciante de la page. Elle doit être vraie et le rester : elle correspond directement à la règle produit selon laquelle une fonctionnalité payante ne modifie jamais le classement du catalogue. Si cette règle bouge un jour, cette ligne saute.

### CTA

| Niveau | Libellé | Destination |
|---|---|---|
| Primaire | **Quelle formation pour moi ?** | ouvre le formulaire d'affinage |
| Secondaire | **Voir les organismes** | `/securite-privee/organismes/` |

**Variantes du CTA primaire** — « Trouver ma formation en 2 minutes » (plus explicite sur l'effort, plus performant en général, mais engage sur une durée qu'il faut tenir) · « Je ne sais pas quel titre viser » (très qualifiant, moins large).

**À éviter** — « Commencer », « C'est parti », « Découvrir » : aucune information sur ce qui se passe après le clic.

### Ligne de chiffres — état de lancement

> **14 titres de formation couverts · 8 départements franciliens · Mise à jour le 1er septembre 2026**

### Ligne de chiffres — au-dessus du seuil

> **[N] organismes référencés · 14 titres de formation · 8 départements franciliens**

**Pourquoi la date au lancement** — tant que le compteur d'organismes est masqué, la ligne perd sa fonction de signal d'exhaustivité. La date de mise à jour la remplace : sur un sujet réglementaire, la fraîcheur est un signal de qualité au moins aussi lisible que le volume, pour un moteur comme pour un évaluateur humain. Elle doit être générée automatiquement, jamais saisie en dur.

---

## 3. Grille par titre de formation

> Bloc le plus important de la page.

### H2

> **Quelle formation en sécurité privée suivre ?**

**Variantes** — « Les formations à la sécurité privée, titre par titre » · « Choisir son titre de formation »

### Chapô

> Chaque métier de la sécurité privée correspond à un titre précis, reconnu par le CNAPS et exigé pour obtenir sa carte professionnelle. Voici ceux qui se préparent en Île-de-France.

### Cartes — proposition de référentiel

*Liste à valider. Les durées sont des ordres de grandeur à vérifier contre les textes en vigueur avant publication.*

| Titre (ancre du lien) | Ligne de description | Durée |
|---|---|---|
| **TFP APS** | Le titre d'entrée dans le métier. Surveillance de sites, de magasins et d'événements. | ~175 h |
| **MAC APS** | Le recyclage obligatoire pour renouveler sa carte professionnelle d'agent de prévention et de sécurité. | ~31 h |
| **Agent de sécurité magasin** | Prévention des vols et gestion des flux en surface de vente. | ~[X] h |
| **SSIAP 1** | Agent de sécurité incendie en établissement recevant du public ou immeuble de grande hauteur. | ~67 h |
| **SSIAP 2** | Chef d'équipe. Encadrement d'une équipe d'agents SSIAP 1. | ~70 h |
| **SSIAP 3** | Chef de service. Responsabilité du service de sécurité incendie d'un établissement. | ~216 h |
| **Recyclage SSIAP** | Le maintien des compétences obligatoire tous les trois ans, quel que soit le niveau. | ~14 à 21 h |
| **Agent cynophile** | Surveillance avec un chien. Le titre porte sur le binôme, pas seulement sur l'agent. | ~[X] h |
| **Sûreté aéroportuaire** | Contrôle des passagers, des bagages et des accès en zone aéroportuaire. | ~[X] h |
| **Protection rapprochée** | Protection physique des personnes. Le titre le plus long et le plus sélectif du secteur. | ~[X] h |
| **Transport de fonds** | Convoyage de valeurs. Formation longue, débouchés concentrés sur peu d'employeurs. | ~[X] h |

**Règles de rédaction des lignes de description**

- Une phrase, maximum 15 mots. C'est un aiguillage, pas un résumé.
- Elle dit **à qui le titre s'adresse**, jamais ce qu'il contient. Le contenu appartient à la page pilier.
- Aucune de ces lignes ne doit pouvoir être reprise telle quelle en chapô de la page pilier correspondante — sinon on duplique à l'intérieur du silo.

**Ancres** — le lien porte le nom du titre seul (« SSIAP 1 »), jamais « en savoir plus ». Le titre complet développé (« SSIAP 1 — Agent de service de sécurité incendie ») est réservé au H1 de la page pilier.

**Compteur** — masqué au lancement, sur toute la grille. Au-dessus du seuil : « **[N] organismes** ». Jamais « [N] organismes proposent cette formation » : trop long dans une carte, et redondant avec le contexte.

---

## 4. Formulaire d'affinage — bloc d'accroche

### H2

> **Vous ne savez pas quel titre correspond à votre situation ?**

**Variantes** — « Onze titres, un seul vous concerne » (plus fort, mais dépend du nombre final de titres) · « Répondez à 6 questions, on vous oriente »

### Sous-titre

> Six questions suffisent pour identifier le titre adapté à votre profil et les organismes qui le préparent près de chez vous.

**À tenir** — si le parcours fait sept écrans en branche longue, écrire « six questions » est un engagement non tenu, visible dès la barre de progression. Formuler « moins de deux minutes » si le nombre d'écrans varie trop selon les branches.

### Première question affichée en dur

> **Où en êtes-vous aujourd'hui ?**
>
> - Je ne travaille pas encore dans la sécurité privée
> - J'y travaille, ma carte arrive à échéance
> - J'y travaille, je veux évoluer ou me spécialiser

*Le clic sur une réponse ouvre le parcours complet en conservant la réponse. Le visiteur arrive donc à l'écran 2, pas à l'écran 1.*

### Mention sous les boutons

> Sans inscription. Vos réponses ne sont transmises à aucun organisme.

**Pourquoi cette mention ici** — c'est le point exact où le visiteur se demande ce qu'on fera de ses réponses. La lever avant le clic coûte une ligne et évite l'abandon. Elle doit être cohérente au mot près avec ce que dit réellement le parcours au moment de la collecte de coordonnées, sinon elle devient un problème RGPD plutôt qu'un argument.

---

## 5. Entrée géographique

### H2

> **Se former près de chez soi en Île-de-France**

**Variantes** — « Les organismes de formation par département » · « Où se former en Île-de-France »

### Chapô

> Les formations à la sécurité privée se déroulent en présentiel : la proximité du centre est un critère de choix réel. Sélectionnez votre département.

### Libellés des liens

Nom du département en toutes lettres, numéro en second : **Seine-Saint-Denis (93)**, **Hauts-de-Seine (92)**, **Val-de-Marne (94)**, **Paris (75)**, **Essonne (91)**, **Yvelines (78)**, **Val-d'Oise (95)**, **Seine-et-Marne (77)**.

**Pourquoi le nom avant le numéro** — c'est la forme majoritaire des requêtes (*formation sécurité Seine-Saint-Denis* devance *formation sécurité 93*), et le numéro seul est ambigu hors contexte. Le numéro reste affiché parce qu'il est massivement utilisé à l'oral en Île-de-France.

**Compteur** — masqué au lancement, comme le reste. Au-dessus du seuil : « Seine-Saint-Denis (93) — [N] organismes ».

**Rappel structurel** — ces liens ne pointent que vers des pages géographiques éditorialisées existantes. Un département sans page ne s'affiche pas dans ce bloc, il ne s'affiche pas grisé non plus.

---

## 6. Échantillon d'organismes

> Bloc entier masqué au lancement.

### H2

> **Quelques organismes référencés**

**Variantes** — « Ils sont référencés sur Trouve ta formation » · « Découvrir des organismes »

**Pourquoi une formulation modeste** — « Les meilleurs organismes » ou « Notre sélection » impliquent un jugement de valeur que le tri par score de complétude ne justifie pas, et contredisent la promesse d'indépendance du hero. « Quelques » assume que c'est un échantillon.

### Contenu de carte

Nom de l'organisme · Ville (département) · Les titres préparés, en libellés courts séparés par des points médians.

### Lien de fin de bloc

> **Voir les [N] organismes d'Île-de-France →**

Ancre descriptive, jamais « Voir tout ».

---

## 7. Comment ça marche

### H2

> **Comment ça marche**

### Trois étapes

| # | Titre | Texte |
|---|---|---|
| 1 | **Identifiez votre titre** | Selon votre situation et le poste que vous visez, un seul titre est généralement pertinent. Le questionnaire vous y amène en quelques questions. |
| 2 | **Comparez les organismes** | Localisation, titres préparés, modalités : les informations viennent des organismes eux-mêmes, qui gèrent leur fiche. |
| 3 | **Contactez directement** | Vous joignez l'organisme de votre choix. Nous ne sommes pas intermédiaires et ne revendons aucune coordonnée. |

### Ligne de clôture

> Trouve ta formation est un annuaire, pas un courtier. Aucun organisme ne peut acheter une meilleure position dans nos résultats.

**Pourquoi cette ligne** — c'est le bloc qui lève l'objection « vais-je être démarché ». La lever explicitement vaut mieux que de l'ignorer, et cette phrase a une valeur E-E-A-T réelle sur un marché où la plupart des comparateurs sont rémunérés à la mise en relation.

---

## 8. Démarches CNAPS

> Remonté en position 6 au lancement.

### H2

> **Les démarches CNAPS, étape par étape**

**Variantes** — « Carte professionnelle et autorisation préalable : les démarches » · « Vos démarches administratives »

### Chapô

> Se former ne suffit pas : l'exercice de la sécurité privée est conditionné à des autorisations délivrées par le CNAPS. Elles s'enchaînent dans un ordre précis.

### Trois cartes

| Ancre | Ligne |
|---|---|
| **Autorisation préalable** | Elle conditionne l'entrée en formation. À demander avant de s'inscrire, pas après. |
| **Carte professionnelle** | Délivrée après l'obtention du titre, elle autorise l'exercice du métier. |
| **Renouvellement de la carte** | Valable cinq ans, elle se renouvelle après un stage de maintien des compétences. |

### Lien de fin de bloc

> **Voir toutes les démarches CNAPS →**

**Note anti-cannibalisation** — ces trois lignes ne développent aucune procédure. Elles disent *quand* la démarche intervient, jamais *comment* la faire. Le « comment » appartient exclusivement aux pages démarche, qui sont les pages à plus fort volume et plus faible concurrence du silo : les affaiblir depuis l'accueil serait le pire arbitrage possible.

---

## 9. Corps éditorial transversal

> 1 100 mots environ. Hiérarchie H2/H3 stricte, sans saut de niveau. Rendu côté serveur.

---

### H2 — Le secteur de la sécurité privée en Île-de-France

La sécurité privée regroupe des métiers très différents derrière une même appellation. Un agent qui surveille un centre commercial, un agent de service de sécurité incendie posté dans une tour de bureaux et un maître-chien intervenant sur un chantier relèvent tous du même cadre réglementaire, mais ne suivent pas la même formation et ne postulent pas aux mêmes offres.

L'Île-de-France concentre une part importante de l'activité du secteur : densité d'établissements recevant du public, plateformes aéroportuaires, sièges sociaux, événementiel. C'est aussi la région où l'offre de formation est la plus dense, ce qui rend le choix d'un organisme plus difficile plutôt que plus simple.

Le point commun à tous ces métiers : ils sont réglementés. Nul ne peut exercer sans carte professionnelle, et nul n'obtient de carte professionnelle sans un titre reconnu. La formation n'est donc pas une option de confort mais une condition d'accès.

---

### H2 — Quel titre choisir selon votre situation

C'est la question qui bloque la plupart des candidats, et elle se tranche en regardant sa propre situation avant de regarder le catalogue.

#### H3 — Vous n'avez jamais travaillé dans la sécurité privée

Deux portes d'entrée dominent. La première mène à la surveillance de sites, de magasins et d'événements : c'est le TFP APS, le titre le plus répandu et celui qui ouvre le plus grand nombre d'offres d'emploi. La seconde mène à la sécurité incendie : c'est le SSIAP 1, qui s'exerce en poste fixe dans les établissements recevant du public et les immeubles de grande hauteur.

Le choix entre les deux se joue moins sur la difficulté que sur le rythme de travail visé. La surveillance implique davantage de mobilité et de contact avec le public ; la sécurité incendie, davantage de postes fixes, de rondes et de procédures techniques. Les deux titres se cumulent d'ailleurs fréquemment au cours d'une carrière.

#### H3 — Vous exercez déjà et votre carte arrive à échéance

Il ne s'agit pas d'une nouvelle formation mais d'un stage de maintien et d'actualisation des compétences, dont le format dépend du titre détenu. Un agent titulaire d'un TFP APS suit un MAC APS ; un agent SSIAP suit un recyclage correspondant à son niveau. La logique est la même dans les deux cas : une durée courte, une échéance à ne pas dépasser, et une conséquence directe sur la validité de la carte professionnelle.

L'erreur la plus fréquente consiste à attendre l'expiration de la carte pour s'inscrire. Les délais de session et les délais d'instruction s'additionnent.

#### H3 — Vous exercez et vous voulez évoluer

Deux directions. La progression hiérarchique, d'abord : le SSIAP 2 pour encadrer une équipe, le SSIAP 3 pour prendre la responsabilité d'un service de sécurité incendie. La spécialisation, ensuite : cynophile, sûreté aéroportuaire, protection physique des personnes, transport de fonds. Les spécialités demandent des formations plus longues et débouchent sur des marchés plus étroits mais moins concurrentiels.

Chaque titre fait l'objet d'une page dédiée détaillant son programme, ses conditions d'accès et les organismes qui le préparent en Île-de-France.

---

### H2 — Les conditions communes à toutes les formations

Quel que soit le titre visé, plusieurs conditions s'appliquent avant même l'inscription.

**L'autorisation préalable du CNAPS.** C'est la condition la plus mal connue et la plus bloquante. Elle doit être obtenue avant l'entrée en formation, et non après. Elle suppose notamment un casier judiciaire compatible avec l'exercice du métier, examiné par le CNAPS.

**La maîtrise du français.** Les titres de la sécurité privée exigent un niveau de compréhension et d'expression écrite et orale suffisant, contrôlé à l'entrée en formation. Le niveau attendu varie selon le titre.

**L'âge et le titre de séjour.** La majorité est requise. Pour les ressortissants étrangers hors Union européenne, un titre de séjour en cours de validité autorisant l'exercice d'une activité professionnelle est nécessaire.

Ces conditions relèvent de la réglementation et non des organismes : aucun centre ne peut y déroger, et un organisme qui proposerait de s'en passer devrait éveiller votre méfiance.

---

### H2 — Durées et coûts : les ordres de grandeur

Les durées sont fixées par la réglementation, pas par les organismes. Elles vont d'une trentaine d'heures pour un stage de maintien des compétences à plusieurs centaines d'heures pour les titres de spécialité les plus longs. Un titre d'entrée dans le métier représente généralement quelques semaines à temps plein.

Les coûts, eux, varient d'un organisme à l'autre pour un même titre. Cette variation s'explique par le format, l'effectif par session, les moyens matériels et l'accompagnement proposé — rarement par la qualité seule. Comparer les prix sans comparer ce qu'ils recouvrent conduit à de mauvaises décisions.

---

### H2 — Financer sa formation

Plusieurs dispositifs coexistent, et ils ne s'adressent pas aux mêmes profils.

**Le compte personnel de formation** mobilise les droits acquis au titre de votre activité passée, directement depuis votre espace personnel. C'est la voie la plus autonome.

**France Travail** peut financer tout ou partie d'une formation pour un demandeur d'emploi, dans le cadre d'un projet validé avec un conseiller. Certains dispositifs sont adossés à une promesse d'embauche.

**Les OPCO et le plan de développement des compétences** concernent les salariés : la formation est alors portée par l'employeur, ce qui est le cas courant des recyclages et des montées en niveau.

Chaque organisme référencé indique les financements qu'il accepte. Vérifiez systématiquement que l'organisme est certifié Qualiopi : cette certification conditionne l'accès aux financements publics et mutualisés.

---

### H2 — Après la formation : obtenir sa carte professionnelle

L'obtention du titre n'autorise pas encore l'exercice. Elle ouvre le droit à demander la carte professionnelle auprès du CNAPS, qui est le document autorisant réellement à travailler. Cette carte est valable cinq ans et son renouvellement suppose un stage de maintien des compétences.

L'enchaînement complet — autorisation préalable, formation, carte professionnelle, renouvellement — est détaillé dans nos pages consacrées aux démarches CNAPS.

---

**Règles de rédaction du corps éditorial**

- Aucun titre n'est développé sur plus de deux phrases. Le seuil au-delà duquel ce bloc concurrence une page pilier est bas.
- Les liens contextuels en plein texte sont les plus qualitatifs de la page : un lien par H3 minimum, ancre descriptive, jamais deux liens vers la même destination.
- Aucun chiffre réglementaire n'est écrit en dur ici sans avoir été vérifié. Les formulations volontairement non chiffrées ci-dessus (« une trentaine d'heures », « plusieurs centaines ») sont un choix, pas une approximation à combler : elles évitent d'avoir à maintenir la même donnée à quinze endroits du site.

---

## 10. FAQ

### H2

> **Questions fréquentes sur la formation en sécurité privée**

*Balisage `FAQPage`. Ces dix questions doivent rester distinctes de celles du catalogue et des pages piliers — un contrôle de non-recouvrement est à faire avant mise en ligne.*

**1. Faut-il un diplôme pour entrer en formation à la sécurité privée ?**
Aucun diplôme n'est exigé pour les titres d'entrée dans le métier. Les conditions portent sur l'autorisation préalable du CNAPS, la maîtrise du français et la majorité, pas sur un niveau scolaire.

**2. Peut-on se former à la sécurité privée sans autorisation préalable ?**
Non. L'autorisation préalable du CNAPS conditionne l'entrée en formation. Elle se demande avant l'inscription, et son instruction prend du temps : c'est la première démarche à engager.

**3. Un casier judiciaire empêche-t-il de travailler dans la sécurité privée ?**
Pas systématiquement. Le CNAPS examine la nature des mentions au regard des exigences du métier. Certaines condamnations sont rédhibitoires, d'autres non.

**4. Combien de temps dure une formation d'agent de sécurité ?**
Cela dépend du titre visé. Un titre d'entrée dans le métier représente généralement quelques semaines à temps plein ; un stage de maintien des compétences, quelques jours ; un titre de spécialité, plusieurs mois.

**5. Quelle différence entre le TFP APS et le SSIAP 1 ?**
Deux métiers distincts. Le TFP APS prépare à la surveillance de sites, de magasins et d'événements. Le SSIAP 1 prépare à la sécurité incendie en établissement recevant du public. Ils se cumulent souvent au cours d'une carrière.

**6. Peut-on financer sa formation avec le CPF ?**
Oui pour la plupart des titres, sous réserve que l'organisme soit certifié Qualiopi et la formation référencée. Chaque fiche d'organisme indique les financements acceptés.

**7. Faut-il refaire une formation complète pour renouveler sa carte professionnelle ?**
Non. Le renouvellement passe par un stage de maintien et d'actualisation des compétences, nettement plus court que la formation initiale, à suivre avant l'échéance des cinq ans.

**8. Les formations se font-elles à distance ?**
Très marginalement. Les titres de la sécurité privée comportent des mises en situation pratiques et des épreuves en présentiel. Certains modules théoriques peuvent être suivis à distance selon l'organisme.

**9. Comment vérifier qu'un organisme de formation est habilité ?**
L'organisme doit être déclaré auprès du CNAPS pour dispenser des formations à la sécurité privée, et certifié Qualiopi pour accéder aux financements publics. Ces deux informations figurent sur chaque fiche.

**10. Trouve ta formation est-il rémunéré par les organismes référencés ?**
Non. Le référencement est gratuit et aucun organisme ne peut acheter une meilleure position dans nos résultats.

---

## 11. Derniers articles

### H2

> **Comprendre le secteur**

**Variantes** — « Derniers articles » (neutre, moins de valeur sémantique) · « Nos guides sur la sécurité privée »

**Pourquoi « Comprendre le secteur »** — un H2 « Derniers articles » n'apporte aucun signal thématique. Le remplacer par une formulation porteuse fait travailler le bloc deux fois : fraîcheur *et* champ lexical.

### Contenu de carte

Titre de l'article · Date de publication · Une ligne d'accroche de 12 mots maximum.

### Lien de fin de bloc

> **Tous nos articles sur la sécurité privée →**

---

## 12. Bandeau B2B

> Une ligne discrète, pleine largeur, fond neutre.

**Proposition recommandée**

> **Vous êtes un organisme de formation ?** Référencez votre centre gratuitement et gérez votre fiche. — **En savoir plus →**

**Variantes**

- « Vous formez à la sécurité privée en Île-de-France ? Rejoignez l'annuaire. »
- « Organismes de formation : créez votre fiche gratuitement. »

**Ce qu'il ne faut pas faire ici** — donner à ce bandeau un traitement visuel de bloc de conversion (fond coloré, gros bouton, illustration). L'intention de la page est candidat ; un bandeau B2B voyant brouille le message pour 95 % des visiteurs afin d'en capter 5 %. Le canal B2B principal reste l'email de prise de contact.

---

## 13. Footer

### Colonne 1 — Formations

> **Formations les plus recherchées**
> TFP APS · MAC APS · SSIAP 1 · SSIAP 2 · SSIAP 3 · Agent cynophile · Sûreté aéroportuaire
> *Toutes les formations →*

### Colonne 2 — Départements

> **Se former par département**
> Paris (75) · Seine-Saint-Denis (93) · Hauts-de-Seine (92) · Val-de-Marne (94) · Essonne (91) · Yvelines (78) · Val-d'Oise (95) · Seine-et-Marne (77)

### Colonne 3 — Démarches

> **Démarches CNAPS**
> Autorisation préalable · Carte professionnelle · Renouvellement de la carte
> *Toutes les démarches →*

### Colonne 4 — Le site

> **Trouve ta formation**
> À propos · Notre méthode de référencement · Blog · Contact · Espace organisme
> Mentions légales · Politique de confidentialité · Gestion des cookies

### Ligne inter-verticales

> Trouve ta formation référence aussi des organismes dans d'autres secteurs. **Voir tous les secteurs →**

*Seul point de contact autorisé entre verticales hors racine du domaine. Jamais en navigation principale.*

### Ligne de bas de page

> © 2026 Trouve ta formation — Annuaire indépendant des organismes de formation. Les informations réglementaires sont fournies à titre indicatif ; seuls les textes en vigueur et le CNAPS font foi.

**Pourquoi cette dernière phrase** — elle est nécessaire juridiquement sur un contenu réglementaire, et elle constitue un signal de sérieux plutôt qu'un aveu de faiblesse.

---

## 14. Bloc de réassurance — proposition pour le point ouvert

> La spécification UX notait un bloc de respiration possible entre les positions 7 et 9. Voici la copy si l'arbitrage le retient.

### H2

> **D'où viennent ces informations**

### Texte

> Les organismes référencés créent et mettent à jour eux-mêmes leur fiche. Quand un organisme indique son numéro d'agrément CNAPS, il apparaît sur sa fiche : vérifiez-le sur l'espace de consultation du CNAPS avant de vous inscrire.
>
> Les informations réglementaires — durées, conditions d'accès, démarches — sont établies à partir des textes en vigueur et des publications du CNAPS, et revues à chaque évolution réglementaire.
>
> Aucun organisme ne peut acheter une meilleure position dans nos résultats. Le classement du catalogue repose sur la complétude des fiches, jamais sur une contrepartie financière.

**Recommandation** — le retenir. Sur un sujet réglementé, l'origine des données et la fréquence de mise à jour sont les deux signaux E-E-A-T les plus lisibles, et ils tiennent en trois phrases. Le coût est nul, l'apport est réel.

---

## 15. Cohérence transverse — à vérifier avant intégration

| Point | Vérification |
|---|---|
| **Répétition du mot-clé** | *formation sécurité privée* et ses variantes apparaissent naturellement dans le title, le H1, deux H2 et le corps éditorial. Ne pas en ajouter : la densité actuelle est suffisante et un ajout supplémentaire deviendrait visible. |
| **Une seule promesse d'indépendance** | Elle apparaît dans le hero, le bloc 7, la FAQ et le bloc de réassurance. Quatre occurrences est un maximum ; en supprimer une si le bloc 14 est retenu. |
| **Aucun titre développé** | Le TFP APS et le SSIAP 1 sont les deux titres les plus cités sur la page. Vérifier qu'aucun n'excède deux phrases consécutives hors grille. |
| **Ancres uniques** | Deux liens vers la même destination avec des ancres différentes dans le corps éditorial diluent le signal. Un lien par destination. |
| **Chiffres réglementaires** | Aucune durée, aucun montant, aucune condition ne part en production sans vérification contre les textes en vigueur. |
| **Cohérence avec le formulaire** | La mention « vos réponses ne sont transmises à aucun organisme » du bloc 4 doit correspondre exactement au traitement réel des données dans le parcours d'affinage. |

---

## 16. Points ouverts

- **Arrêter la liste des titres du référentiel.** Elle conditionne la grille du bloc 3, le menu de navigation et la colonne 1 du footer. C'est la dépendance la plus bloquante de ce document.
- **Vérifier les durées réglementaires** de chaque titre avant publication.
- **Chiffrer le seuil d'affichage du compteur**, qui détermine laquelle des deux versions de la ligne de chiffres part en production.
- **Arbitrer le bloc 14.** Recommandation : le retenir.
- **Valider le CTA primaire du hero** entre la formulation orientée bénéfice et celle orientée durée.

---

## 17. Documents liés

- **UX Page d'accueil** — structure des blocs, conditionnement, règles techniques
- **UX Formulaire d'affinage** — arbre des questions, dont la Q1 reprise au bloc 4
- **UX Pages démarches CNAPS** — périmètre des trois démarches
- **Structure d'URL** — destinations de tous les liens de cette page
- **À produire** — copy du catalogue, des pages piliers, des pages géographiques, des pages démarches
