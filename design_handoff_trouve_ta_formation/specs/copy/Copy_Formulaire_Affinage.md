# Copy — Formulaire d'affinage

**Trouve ta formation — Verticale sécurité privée**
Parcours transversal, sans URL indexable
Version 1.0 — 1er septembre 2026
Environnement : **Not Log** — intention candidat, « je ne sais pas quel titre viser »

---

## 0. La contrainte qui gouverne toute cette copy

Le public de ce parcours n'est pas celui des autres pages.

Les titres de la sécurité privée exigent un niveau de français correspondant au B1 du cadre européen, vérifié à l'entrée en formation. Le prérequis existe précisément parce qu'une part importante des candidats n'a pas le français comme langue maternelle. C'est un public que le secteur connaît bien et que la plupart des sites du domaine servent mal.

**Conséquence : toute la copy de ce parcours s'écrit au niveau B1.** Ce n'est pas une simplification condescendante, c'est une contrainte fonctionnelle. Un questionnaire mal compris produit des réponses fausses, donc des recommandations fausses.

Les règles appliquées dans tout ce document :

| Règle | Contre-exemple |
|---|---|
| Une proposition par phrase | « Si vous détenez déjà un titre et que votre carte arrive à échéance, indiquez-le. » |
| Verbes concrets, voix active | « Une autorisation préalable est-elle en votre possession ? » |
| Aucun sigle sans glose à sa première apparition | « Avez-vous votre AP ? » |
| Le vocabulaire du candidat, pas de l'administration | « Modalité de financement envisagée » |
| Options courtes, parallèles entre elles | Une option de trois mots à côté d'une de quinze |

**Corollaire sur les libellés d'options** — elles doivent être lisibles sans relire la question. Sur mobile, dans une modale, le visiteur voit souvent les options avant l'intitulé.

---

## 1. Ouverture du parcours

### Points d'entrée

Le parcours s'ouvre depuis l'accueil (bloc 4) et depuis les pages piliers. Sur l'accueil, la première question est déjà affichée en dur : le visiteur qui clique une réponse arrive donc à l'écran 2, pas à l'écran 1.

**Conséquence de copy** — le parcours n'a pas d'écran d'accueil. Pas de « Bienvenue », pas d'explication préalable, pas de bouton « Commencer ». Le visiteur est déjà entré.

### Titre de la modale

> **Trouver la formation adaptée à votre situation**

*Affiché en permanence en haut de la modale, quelle que soit l'étape.*

**Variantes écartées** — « Questionnaire d'orientation » (scolaire, et le mot questionnaire annonce de la longueur) · « Quelle formation pour vous ? » (redondant avec la première question).

### Bouton de fermeture

Croix simple, sans confirmation. Un visiteur qui veut sortir sort.

---

## 2. Barre de progression

> **L'élément qui fait le plus pour le taux de complétion** sur un questionnaire à branches, où le visiteur ne peut pas estimer la longueur.

| Contexte | Affichage |
|---|---|
| Pendant la recommandation initiale | **Question 3 sur 6** |
| Pendant l'affinage optionnel | **Question 2 sur 4** — *Affinage* |

**Sur l'affichage du total** — il doit être exact, pas rassurant. Une branche à cinq écrans affiche cinq, une branche à sept affiche sept. Annoncer six partout et en imposer sept produit exactement l'abandon qu'on cherche à éviter, au pire moment : la dernière question.

**Note d'implémentation** — le total est connu dès la réponse à Q1, puisque la branche est déterminée. Il peut varier d'une unité en branche A selon la réponse à A2, qui déclenche ou non A3. Prévoir un total recalculé, pas figé.

---

## 3. Q1 — la question qui coupe tout

> **Où en êtes-vous aujourd'hui ?**

| Option | Branche |
|---|---|
| Je ne travaille pas encore dans la sécurité privée | A — Entrée |
| Je travaille dans la sécurité, ma carte arrive à échéance | B — Renouvellement |
| Je travaille dans la sécurité, je veux évoluer | C — Progression |

**Modifications par rapport à la spécification** — « J'y travaille » devient « Je travaille dans la sécurité ». Le pronom adverbial suppose que le visiteur relie l'option à l'intitulé, ce qui est exactement ce que le niveau B1 rend incertain. La troisième option perd « ou me spécialiser », redondant avec « évoluer » et allongeant l'option sans la préciser.

**Aucune phrase d'aide sous la question.** Les trois options sont autoportantes.

---

## 4. Branche A — Entrée dans le métier

### A2

> **Quel type de poste vous intéresse ?**

| Option | Sortie |
|---|---|
| Surveiller des sites, des magasins, des événements | **TFP APS** |
| Assurer la sécurité incendie dans un bâtiment | **SSIAP 1** |
| Un métier spécialisé | → A3 |

**Sur la reformulation des options** — la spécification proposait « Surveillance de sites et de magasins » et « Sécurité incendie en établissement recevant du public ». Les deux sont des intitulés de fonction, pas des descriptions de travail. Les verbes à l'infinitif décrivent ce qu'on fait, ce qui est plus lisible pour quelqu'un qui découvre le secteur. Et « établissement recevant du public » est du vocabulaire réglementaire : un candidat qui ne sait pas ce que c'est ne peut pas répondre.

### A3 — conditionnelle

> **Quelle spécialité vous intéresse ?**

| Option | Sortie |
|---|---|
| Travailler avec un chien | **TFP ASC** |
| Travailler dans un aéroport | **TFP ASA** |
| Protéger une personne | **TFP A3P** |

**Correction par rapport à la spécification** — l'option « Transport de fonds » est retirée. Ce métier ne correspond à aucun titre du référentiel arrêté, et le proposer produirait une branche sans sortie.

**Sur les formulations** — « Travailler avec un chien » plutôt que « Sécurité cynophile ». Un candidat qui connaît le mot cynophile connaît déjà le titre et n'a pas besoin de ce parcours.

### A4

> **Avez-vous déjà demandé votre autorisation préalable au CNAPS ?**

| Option | Effet sur le résultat |
|---|---|
| Oui, je l'ai obtenue | Aucun |
| Non, pas encore | Encart démarche en tête de résultat |
| Je ne sais pas ce que c'est | Encart démarche, avec une phrase d'explication |

### Phrase d'aide sous la question

> C'est l'autorisation du CNAPS qui permet d'entrer en formation. Elle se demande avant de s'inscrire.

**Pourquoi une phrase d'aide ici et nulle part ailleurs** — c'est la seule question du parcours qui porte sur une notion administrative que le visiteur peut ignorer. Sans elle, l'option « je ne sais pas ce que c'est » devient la réponse par défaut de gens qui l'ont pourtant obtenue. Deux phrases courtes, pas un paragraphe.

**Sur la formulation de la question** — « Avez-vous déjà demandé » plutôt que « Avez-vous votre ». La demande et l'obtention sont deux états différents, et un candidat en cours d'instruction doit pouvoir se situer. L'option « Oui, je l'ai obtenue » lève l'ambiguïté du côté des réponses.

---

## 5. Branche B — Renouvellement

### B2

> **Quel titre avez-vous obtenu ?**

Liste issue du référentiel, groupée par catégorie.

### Table de correspondance titre détenu → titre recommandé

| Titre détenu | Sortie |
|---|---|
| TFP APS | **MAC APS** |
| TFP ASC | **MAC cynophile** |
| SSIAP 1 | **Recyclage SSIAP 1** |
| SSIAP 2 | **Recyclage SSIAP 2** |
| SSIAP 3 | **Recyclage SSIAP 3** |
| **TFP A3P** | **MAC A3P** |
| **TFP ASA** | **Aucune recommandation — message dédié, voir ci-dessous** |

### Le trou révélé par ce parcours, et sa résolution

La version initiale du référentiel contenait le TFP ASA et le TFP A3P sans les maintiens de compétences correspondants. Un agent titulaire de l'un des deux aboutissait donc à une recommandation impossible. Vérification faite, les deux cas ne sont pas de même nature.

**Le MAC A3P existe** comme produit de formation identifié, largement proposé, d'une durée de l'ordre de 34 heures. Il entre au référentiel en version 1.1, et la branche B a désormais une sortie propre pour le TFP A3P.

**Le MAC ASA n'existe pas** sous ce nom. Le TFP ASA couvre à la fois le tronc commun de la sécurité privée et les normes de base de la sûreté de l'aviation civile relevant du règlement européen 2015/1998. Le maintien des compétences se scinde vraisemblablement en deux parcours distincts, dont l'un relève de la DGAC et non du CNAPS, et qui est généralement porté par l'employeur.

### Pourquoi je ne recommande rien dans ce cas

L'hypothèse la plus probable est que le tronc commun se maintient par le MAC APS. Elle est plausible, elle n'est pas vérifiée, et **c'est exactement le type de recommandation qu'il ne faut pas faire à l'aveugle** : un agent qui suit le mauvais stage découvre son erreur au moment du dépôt, avec une carte qui expire.

La copy dit donc ce qu'elle sait, et renvoie vers la page démarche.

### Copy du message — branche B, titre ASA

> **Le renouvellement d'une carte de sûreté aéroportuaire suit un parcours particulier.**
> Votre métier relève à la fois de la réglementation de la sécurité privée et de celle de la sûreté aérienne. Le maintien de vos compétences ne passe pas par un stage unique, et une partie est généralement organisée par votre employeur.
> Rapprochez-vous de votre employeur ou de votre centre de formation habituel, et consultez notre page sur le renouvellement de la carte professionnelle pour les délais de dépôt.
>
> **Voir la démarche de renouvellement →**

**Ce que fait cette formulation** — elle explique pourquoi le parcours s'arrête là, plutôt que de laisser croire à une lacune de l'annuaire. Un agent ASA sait que son métier est doublement réglementé ; lui dire que nous le savons aussi vaut mieux que de lui servir une recommandation générique.

`[À VÉRIFIER : le parcours exact de renouvellement d'une carte ASA. Si le MAC APS suffit pour le tronc commun, ce message devient une recommandation normale avec une mention sur la partie aéroportuaire.]`

### B3

> **Quand votre carte expire-t-elle ?**

| Option | Message associé sur le résultat |
|---|---|
| Elle est déjà expirée | Urgence, orientation prioritaire vers la page démarche |
| Dans moins de 3 mois | Urgence, mention du délai d'instruction |
| Dans 3 à 12 mois | Nominal |
| Dans plus d'un an | Mention de la fenêtre de dépôt |

**Sur la formulation** — « Où en est votre carte professionnelle ? » devient « Quand votre carte expire-t-elle ? ». La première question est vague et admet des réponses hors sujet ; la seconde appelle une date, et le visiteur a cette date sur sa carte.

**Dépendance** — les messages de résultat associés à cette question dépendent de la fenêtre de dépôt du renouvellement, qui fait partie des données `[À VÉRIFIER]` du document démarches. C'est le point de vérification numéro 1 de ce chantier, et il bloque cette branche autant que la page démarche.

---

## 6. Branche C — Progression

### C2

> **Quel titre avez-vous obtenu ?**

Même liste que B2.

### C3

> **Depuis combien de temps travaillez-vous dans la sécurité ?**

Moins d'un an · Entre 1 et 3 ans · Plus de 3 ans

**Sur la reformulation** — « Quelle est votre expérience dans le secteur ? » appelle une réponse qualitative. « Depuis combien de temps » appelle une durée, ce que les options proposent.

### C4

> **Vers quoi voulez-vous aller ?**

| Option | Sortie |
|---|---|
| Encadrer une équipe | **SSIAP 2** ou **SSIAP 3** selon le titre détenu et l'expérience |
| Aller vers la sécurité incendie | **SSIAP 1** |
| Me spécialiser | → sous-question identique à A3 |

### Le cas de l'expérience insuffisante

Certains titres d'encadrement exigent une expérience professionnelle. Un visiteur qui vise l'encadrement sans l'avoir doit recevoir une réponse utile, pas un refus.

**Copy du résultat dans ce cas**

> **Le SSIAP 2 demande une expérience professionnelle que vous n'avez pas encore.** C'est le titre à viser ensuite. En attendant, vous pouvez élargir vos compétences avec un titre complémentaire : beaucoup d'agents cumulent le TFP APS et le SSIAP 1, ce qui ouvre davantage de postes.

**Pourquoi cette formulation** — elle ne dit pas non, elle dit « pas encore » et propose une action immédiate. C'est aussi le seul endroit du parcours où la double compétence est recommandée spontanément, alors qu'elle est ailleurs une question optionnelle.

`[À VÉRIFIER : les conditions d'expérience exactes du SSIAP 2 et du SSIAP 3, à relever en même temps que les durées.]`

---

## 7. Questions communes — filtrage

### S1

> **Quelle est votre situation aujourd'hui ?**

Demandeur d'emploi · Salarié · En reconversion · Intérimaire · Étudiant

**Aucune phrase d'aide.** La question sur le financement est déduite, pas posée, et il ne faut surtout pas l'expliquer : un visiteur à qui on annonce que sa réponse déterminera son financement répondra stratégiquement plutôt que sincèrement.

### S2

> **Où cherchez-vous une formation ?**

Les 8 départements en multi-sélection, plus une option finale :

> **Peu importe, je peux me déplacer**

**Sur le libellé des départements** — nom en toutes lettres puis numéro, comme partout sur le site : **Seine-Saint-Denis (93)**.

**Comportement de l'option « peu importe »** — elle désélectionne les autres, et inversement. Une multi-sélection qui autorise « peu importe » coché avec trois départements produit une donnée incohérente.

### S3

> **Quel rythme vous conviendrait ?**

Temps plein · Cours du soir · Week-end · Peu importe

**Mention sous les options**

> La formation se déroule en présentiel, souvent sur plusieurs semaines.

**Pourquoi cette mention** — c'est le moment où le visiteur décide de son rythme, donc le moment où l'information est actionnable. La donner plus tôt serait du bruit, plus tard serait trop tard.

---

## 8. Affinage optionnel

### Le bouton qui y mène, depuis l'écran de résultat

> **Affiner mes résultats** — 4 questions de plus

**Sur l'annonce du nombre** — un bouton « Affiner » sans indication de coût est ouvert par curiosité puis abandonné. Annoncer quatre questions produit moins de clics mais bien plus de complétions.

### O1

> **Voulez-vous passer plusieurs titres ?**

Un seul pour commencer · Deux titres pour être plus employable

**Sur la seconde option** — « Une double compétence » est du vocabulaire de recruteur. « Pour être plus employable » dit le bénéfice, qui est la vraie raison de la question.

**Mention sous les options**

> Beaucoup d'agents passent le TFP APS et le SSIAP 1. Cela permet de travailler à la fois en surveillance et en sécurité incendie.

### O2

> **Comment vous déplacez-vous ?**

En transports en commun · J'ai un véhicule · Je cherche tout près de chez moi

### O3

> **Quand voulez-vous commencer ?**

Dès que possible · Dans les 3 mois · Dans l'année · Je me renseigne seulement

**Sur la dernière option** — « Je me renseigne » devient « Je me renseigne seulement ». Le mot final autorise explicitement le visiteur à ne pas s'engager, ce qui augmente la sincérité de la réponse et la qualité de la donnée.

### O4

> **Avez-vous besoin d'un accès adapté aux personnes à mobilité réduite ?**

Case unique.

**Formulation volontairement portée sur le lieu, pas sur la personne.** La question porte sur le besoin d'un accès adapté, jamais sur une situation médicale. C'est la règle posée par la spécification en matière de données personnelles, et elle se joue dans le choix des mots autant que dans le traitement technique.

---

## 9. Écran de résultat

### Ordre et libellés

| # | Élément | Libellé |
|---|---|---|
| 1 | Titre recommandé | **Le titre à viser : [libellé long]** |
| 2 | Phrase d'explication | *Voir gabarits ci-dessous* |
| 3 | Lien page pilier | **Tout savoir sur le [libellé court] →** |
| 4 | Encart démarche | *Conditionnel* |
| 5 | Titre du listing | **[N] organismes correspondent à votre recherche** |
| 6 | Message de relâchement | *Conditionnel* |
| 7 | Titres alternatifs | **Vous pourriez aussi envisager** |
| 8 | Bouton affinage | **Affiner mes résultats** — 4 questions de plus |
| 9 | Bouton retour | **Modifier mes réponses** |

### Les gabarits de phrase d'explication

> **L'élément le plus important de l'écran.** Une recommandation sans justification est perçue comme arbitraire, et le candidat repart la vérifier ailleurs.

**Structure commune** — reprendre la situation déclarée, puis nommer le titre comme la conséquence logique.

| Branche | Gabarit |
|---|---|
| **A — surveillance** | Vous débutez dans le secteur et vous voulez surveiller des sites ou des magasins : le TFP APS est le titre d'entrée de ce métier. C'est aussi celui qui ouvre le plus grand nombre d'offres d'emploi. |
| **A — incendie** | Vous débutez dans le secteur et vous visez la sécurité incendie : le SSIAP 1 est le titre d'entrée de cette filière. Il s'exerce en poste fixe, dans les bâtiments recevant du public. |
| **A — spécialité** | Vous débutez et vous visez [métier] : le [titre] est le titre qui y donne accès. C'est une formation plus longue que celles d'entrée dans le métier, pour un marché plus étroit. |
| **B** | Vous détenez le [titre détenu] et votre carte arrive à échéance : le [MAC ou recyclage] est le stage qui vous permet de la renouveler. |
| **C — encadrement** | Vous détenez le [titre détenu] et vous voulez encadrer une équipe : le [titre] est le niveau suivant de cette filière. |
| **C — incendie** | Vous travaillez déjà en surveillance et vous voulez aller vers la sécurité incendie : le SSIAP 1 est le titre d'entrée de cette filière. Le cumul avec votre titre actuel est fréquent et recherché par les employeurs. |
| **C — spécialité** | Vous voulez vous spécialiser vers [métier] : le [titre] est le titre correspondant. |

**Règle de rédaction** — deux phrases maximum. La première justifie, la seconde apporte une information que le visiteur n'avait pas. Une phrase seule est sèche, trois deviennent un article.

### Encart démarche — branche A, sans autorisation préalable

> **Commencez par votre autorisation préalable**
> Vous ne pouvez pas entrer en formation sans elle. Elle se demande en ligne auprès du CNAPS, et son instruction prend du temps. Faites cette démarche avant de contacter un organisme.
> **Voir comment faire la demande →**

**Position : avant le listing d'organismes**, jamais après. L'ordre chronologique de la réalité doit être l'ordre de l'écran.

### Encart démarche — branche B, carte expirée

> **Votre carte est expirée**
> Vous ne pouvez pas exercer tant qu'elle ne l'est plus. Inscrivez-vous à un stage dès que possible, puis déposez votre demande de renouvellement.
> **Voir la démarche de renouvellement →**

`[À VÉRIFIER : le traitement d'une carte déjà expirée — renouvellement tardif ou nouvelle demande initiale. La réponse change ce message.]`

### Titres alternatifs

> **Vous pourriez aussi envisager**
> [1 ou 2 titres, avec une ligne chacun]

Un titre alternatif est toujours affiché, même quand la recommandation est certaine. Il sert de porte de sortie au visiteur qui pense que le questionnaire s'est trompé — et lui évite de repartir.

---

## 10. Les messages de relâchement

> **Il doit être impossible d'aboutir à un écran vide.** Chaque niveau dit explicitement ce qui a été élargi.

| Niveau | Message |
|---|---|
| **2 — rythme retiré** | Aucun centre ne propose ce rythme en [département]. Voici tous les organismes du département qui préparent au [titre]. |
| **3 — départements voisins** | Aucun centre ne prépare au [titre] en [département]. Voici les organismes des départements voisins. |
| **4 — toute la région** | Le [titre] est rarement proposé en Île-de-France. Voici tous les organismes de la région qui le préparent. |
| **5 — aucun organisme** | *Voir ci-dessous* |

### Niveau 5 — aucun organisme sur ce titre

> **Aucun organisme référencé ne prépare au [titre] en Île-de-France.**
> Notre annuaire se construit progressivement : cela ne veut pas dire qu'aucun centre ne le propose. Consultez la page du titre pour connaître le programme et les conditions d'accès, et regardez les titres proches ci-dessous.
>
> **Tout savoir sur le [titre] →** · **Voir les démarches à accomplir →**

**Ce qui rend ce message acceptable** — il distingue « nous n'avons pas » de « cela n'existe pas ». C'est une nuance que la plupart des annuaires n'écrivent pas, et elle évite au visiteur de renoncer à un projet réalisable. La recommandation de titre reste affichée : il repart avec une réponse.

**Règle absolue** — un élargissement silencieux donne l'impression que le formulaire n'a pas écouté. Le message est affiché même quand le relâchement produit beaucoup de résultats.

---

## 11. Navigation et sortie

| Élément | Libellé |
|---|---|
| Retour en arrière | **Retour** |
| Modifier depuis le résultat | **Modifier mes réponses** |
| Fermeture | Croix, sans confirmation |

**Le retour ne réinitialise jamais rien.** Un visiteur qui a répondu à huit questions et se voit tout recommencer abandonne. Les réponses saisies restent affichées et pré-sélectionnées.

**« Modifier mes réponses » ramène à la dernière question de filtrage**, pas à Q1. Le visiteur qui veut changer de branche remonte question par question.

**Aucun message de confirmation à la fermeture.** « Êtes-vous sûr de vouloir quitter ? » sur un questionnaire non sollicité est une friction hostile, et le taux de récupération est négligeable.

---

## 12. Ce qui n'est jamais demandé — et comment le dire quand même

Trois informations sont des conditions réelles d'accès à la formation, mais ne peuvent pas être posées en question. Elles s'affichent sur l'écran de résultat, sous forme d'information.

### Encart des conditions, en bas du résultat

> **Avant de vous inscrire, vérifiez que vous remplissez les conditions**
> La formation à la sécurité privée demande une autorisation du CNAPS, qui vérifie notamment votre casier judiciaire. Elle demande aussi un niveau de français correspondant au niveau B1, vérifié à l'entrée en formation.
> **Voir toutes les conditions →**

**Pourquoi ces deux sujets sont traités là et pas en question**

Le casier judiciaire relève d'un régime de données particulièrement protégé : la question ne doit pas être posée, et la réponse ne doit pas être stockée. L'information, elle, est utile et doit être donnée.

Le niveau de français est un prérequis réel, mais une question à ce sujet ne produirait aucune donnée fiable : personne ne se déclare insuffisant. L'écrire en information permet au visiteur concerné d'anticiper le test, ce qu'une question n'aurait pas permis.

**Point de vigilance de rédaction** — cet encart doit rester factuel et court. Le développer transformerait l'écran de résultat en page de conditions, ce qui empiète sur la page démarche autorisation préalable, propriétaire du sujet.

---

## 13. Texte fixe et texte variable

| Élément | Statut |
|---|---|
| Questions et options | **Fixe** — environ 40 libellés |
| Phrases d'aide | **Fixe** — 5 mentions |
| Phrase d'explication du résultat | **Variable** — 7 gabarits, remplis par les réponses |
| Encarts démarche | **Conditionnel** — 2 variantes |
| Messages de relâchement | **Conditionnel** — 4 variantes |
| Encart des conditions | **Fixe** — 1 bloc |

**Aucun enjeu de duplication ici**, puisque le parcours n'est jamais indexé. C'est le seul document de cette série où la copy peut être écrite pour l'humain seul, sans arbitrage SEO. Elle doit donc être la plus soignée du lot sur le plan de la compréhension.

---

## 14. Points de vigilance

| Point | Vérification |
|---|---|
| **Niveau de langue** | À tester sur un lecteur non natif avant mise en ligne. C'est le seul contrôle qui compte vraiment sur ce parcours. |
| **Aucune branche sans sortie** | Le cas TFP ASA et TFP A3P en branche B doit être tranché avant développement. |
| **Total d'étapes exact** | Recalculé par branche, jamais figé à une valeur moyenne. |
| **Élargissement toujours annoncé** | Sur les quatre niveaux, sans exception. |
| **Retour sans réinitialisation** | À vérifier en recette sur chaque branche. |
| **Aucune collecte de coordonnées** | Ni email, ni téléphone, ni nom, en V1. |
| **Aucune donnée sur le casier** | Ni posée, ni déduite, ni stockée. |
| **Cohérence avec le bloc 4 de l'accueil** | La mention « vos réponses ne sont transmises à aucun organisme » doit rester exacte. |

---

## 15. Points ouverts

- **Vérifier le parcours de renouvellement d'une carte ASA.** Si le MAC APS couvre le tronc commun, le message dédié de la branche B devient une recommandation normale.
- **Vérifier les conditions d'expérience du SSIAP 2 et du SSIAP 3**, qui conditionnent la branche C.
- **Vérifier la fenêtre de dépôt du renouvellement**, qui conditionne les messages de la branche B.
- **Vérifier le traitement d'une carte déjà expirée**, qui conditionne un encart.
- **Décider du seuil de relâchement automatique** : zéro résultat, ou moins de trois.
- **Faire relire le parcours par un lecteur non natif** avant mise en ligne.
- **Mesurer les abandons par écran** dès le lancement, pour arbitrer la longueur sur données réelles.

---

## 16. Documents liés

- **UX Formulaire d'affinage** — arbre, mécaniques, cascade de relâchement, données personnelles
- **Référentiel des titres** — alimente les sorties des trois branches ; trou identifié en section 5
- **Copy Page d'accueil** — bloc 4, où Q1 est affichée en dur
- **Copy Pages démarches CNAPS** — destination des encarts démarche
- **Copy Catalogue organismes** — cartes réutilisées dans le listing du résultat
- **À produire** — copy des pages piliers, du blog, du 404 et de la racine du domaine
