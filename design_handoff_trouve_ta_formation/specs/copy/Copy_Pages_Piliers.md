# Copy — Pages piliers par titre

**Trouve ta formation — Verticale sécurité privée**
`trouve-ta-formation.fr/securite-privee/[titre]/`
Version 1.0 — 1er septembre 2026
Environnement : **Not Log** — 13 pages, deux gabarits

---

## 0. Ce que ce document contient, et ce qu'il ne contient pas

C'est la famille de pages qui portera le plus de trafic du silo, et la seule dont le contenu est réglementaire à 80 %.

**Conséquence directe** : je ne peux pas écrire les treize pages. Les durées, les volumes horaires par module, les modalités d'évaluation, les conditions d'expérience du SSIAP 2 et 3, les contraintes propres au titre cynophile — rien de tout cela n'est vérifié, et l'arrêté du 1er septembre 2025 portant cahier des charges de la formation initiale a moins d'un an. Produire treize pages aujourd'hui reviendrait à produire treize pages truffées de `[À VÉRIFIER]` sur les sections qui font leur valeur.

**Ce document contient donc :**

- Les deux gabarits en copy complète — libellés, gabarits de métadonnées, formulations, règles de rédaction
- Le plan de différenciation titre par titre, qui est la condition de survie de la famille
- La réconciliation entre le référentiel et le phasage de publication
- La grille de vérification à mener avant écriture

**Ce qu'il faudra produire ensuite** : le contenu réglementaire de chaque page, une fois la vérification faite. C'est un travail de rédaction, pas de conception.

---

## 1. Réconciliation référentiel / publication

> La spécification a été écrite avant que le référentiel soit arrêté. Elle parle de 23 à 25 pages et d'une phase 1 à 6 pages, avec des titres qui n'ont pas été retenus. Voici l'alignement.

**Les deux listes ne sont pas la même chose**, et la spécification le pose déjà avec son système de statut par titre :

| | Référentiel | Pages piliers |
|---|---|---|
| Contenu | Les titres cochables par les organismes | Les pages éditoriales publiées |
| État actuel | **13 titres actifs** | **0 publiée** |
| Rythme | Fixé d'un coup | Par vagues |

Un titre actif sans page publiée existe dans le filtre du catalogue et dans les fiches organisme, mais son libellé n'est pas cliquable. C'est le statut « actif, page non publiée » de la spécification, et il doit être implémenté dès la V1 sous peine de générer des 404 depuis la grille de l'accueil.

### Phasage de publication proposé

| Vague | Pages | Titres |
|---|---|---|
| **1** | 6 | TFP APS · MAC APS · SSIAP 1 · Recyclage SSIAP 1 · SSIAP 2 · Recyclage SSIAP 2 |
| **2** | 4 | SSIAP 3 · Recyclage SSIAP 3 · TFP ASC · MAC cynophile |
| **3** | 3 | TFP ASA · TFP A3P · MAC A3P |

**Ce qui change par rapport à la spécification** — elle proposait le TFP ASC en phase 1 et laissait les recyclages SSIAP 2 et 3 en phase 2. Je regroupe plutôt **par paires titre + maintien**.

**Pourquoi les paires** — le bloc « titres liés » d'une page pilier renvoie vers le MAC associé, et ne peut lier que vers des pages publiées. Publier le SSIAP 2 sans son recyclage produit une page dont le maillage latéral principal est amputé. Publier les deux ensemble donne à chacune sa sortie naturelle, et la paire couvre les deux intentions du même public à cinq ans d'écart.

**Pourquoi la vague 3 en dernier** — ce sont les trois titres qui portent le plus de `[À VÉRIFIER]` : les typologies aéroportuaires, le code RNCP incertain du TFP ASA, le parcours de renouvellement ASA non élucidé. Ils se positionneront facilement, personne ne les traite correctement, mais ils demandent le plus de travail de vérification.

---

## 2. Les deux gabarits

| | **Gabarit A — Titre d'entrée** | **Gabarit B — Maintien et recyclage** |
|---|---|---|
| Pages concernées | 7 : TFP APS, SSIAP 1, 2, 3, TFP ASC, TFP ASA, TFP A3P | 6 : MAC APS, MAC cynophile, MAC A3P, Recyclages SSIAP 1, 2, 3 |
| Question dominante | Qu'est-ce que c'est, est-ce pour moi | Quand dois-je le faire, combien, où |
| Bloc 4 | **Ce que c'est et à quoi ça mène** | **Quand faire ce stage** |
| Position du coût | Bloc 7 | **Bloc 5, remonté** |
| Bloc débouchés | Présent | Absent |

**Près de la moitié des pages sont en gabarit B.** Ce n'est pas un cas particulier, c'est une famille à part entière, et c'est celle dont le trafic convertit le mieux : le visiteur a une échéance légale, une obligation, et un achat contraint dans les mois qui viennent.

---

## 3. Métadonnées — gabarits

### Gabarit A

| Champ | Gabarit |
|---|---|
| `<title>` | `Formation [libellé court] : programme, conditions et organismes` |
| Meta description | `Le [libellé long] : programme, durée, conditions d'accès et financements. Les organismes qui le préparent en Île-de-France.` |

**Exception pour trois titres** — le TFP ASC, le TFP ASA et le TFP A3P sont plus recherchés sous leur intitulé métier que sous leur acronyme. Leur title mène avec le métier :

> `Formation agent de sécurité cynophile (TFP ASC) : programme et organismes`
> `Formation agent de sûreté aéroportuaire (TFP ASA) : programme et organismes`
> `Formation agent de protection physique des personnes (TFP A3P) : programme et organismes`

C'est la contrepartie assumée du choix de slugs par acronyme fait dans le référentiel : le poids du mot-clé se joue dans le title et le H1, pas dans l'URL.

### Gabarit B

| Champ | Gabarit |
|---|---|
| `<title>` | `[libellé court] : quand le faire, durée et organismes` |
| Meta description | `Le [libellé long] est obligatoire pour renouveler votre carte professionnelle. Quand le suivre, combien de temps, quels organismes le proposent en Île-de-France.` |

**Le title de gabarit B mène avec le calendrier**, pas avec le programme. C'est la question du visiteur : il sait ce qu'est un MAC, il veut savoir quand le faire.

---

## 4. Bloc 1 — Fil d'Ariane

> Sécurité privée › **[Libellé court]**

Balisage `BreadcrumbList`. Le libellé court, jamais le libellé long : le fil d'Ariane n'est pas un titre.

---

## 5. Bloc 2 — En-tête et ligne de faits clés

> **Le bloc le plus rentable de la page.**

### H1

**Gabarit A** — le libellé long du référentiel.

> **SSIAP 1 — Agent de service de sécurité incendie**

**Gabarit B** — le libellé long également.

> **MAC APS — Maintien et actualisation des compétences des agents de prévention et de sécurité**

**Règle** — l'acronyme en premier, l'intitulé développé ensuite, séparés par un tiret. C'est la forme sous laquelle le titre est reconnu par les professionnels, et elle contient les deux formulations de recherche.

### Phrase de définition

**Gabarit A — une phrase, ce que le titre permet de faire**

> Le SSIAP 1 est le titre d'entrée de la sécurité incendie. Il permet d'exercer comme agent de service de sécurité incendie dans les établissements recevant du public et les immeubles de grande hauteur.

**Gabarit B — une phrase, l'obligation et son échéance**

> Le MAC APS est le stage obligatoire pour renouveler votre carte professionnelle d'agent de prévention et de sécurité. Il se suit avant l'échéance des cinq ans, et sans lui le renouvellement n'est pas possible.

### Ligne de faits clés

| Champ | Gabarit A | Gabarit B |
|---|---|---|
| Durée | `[À VÉRIFIER]` | `[À VÉRIFIER]` |
| Niveau de qualification | Niveau 3 ou 4 | *Sans objet* |
| Prérequis principal | Autorisation préalable du CNAPS | Carte professionnelle en cours de validité |
| Coût indicatif | `[À VÉRIFIER]` | `[À VÉRIFIER]` |
| **Périodicité** | *Sans objet* | **Tous les 5 ans** |
| Organismes en Île-de-France | Compteur, conditionné au seuil | Compteur, conditionné au seuil |
| Vérifié le | Date | Date |

**Traitement en tableau, pas en texte rédigé.** Sur une requête de titre, le moteur cherche une réponse courte et factuelle à extraire ; un tableau est plus extractible qu'un paragraphe qui contient les mêmes informations.

**La date de vérification est affichée**, comme sur les pages démarche. Sur du contenu réglementaire, c'est un signal de fraîcheur que la concurrence n'affiche pas.

---

## 6. Bloc 3 — Table des matières

**Libellé**

> **Sur cette page**

Ancres en dur. C'est ce qui permet à celui qui sait déjà d'aller directement au coût ou aux organismes, sans traverser 1 500 mots.

---

## 7. Bloc 4 — le bloc qui distingue les deux gabarits

### Gabarit A — Ce que c'est et à quoi ça mène

**H2** — **Ce que permet le [libellé court]**

**Trois H3**

| H3 | Contenu |
|---|---|
| **Les métiers accessibles** | Postes concrets, types de sites, conditions d'exercice réelles |
| **Ce que la carte professionnelle autorise** | Quelles activités le titre ouvre sur la carte, et lesquelles il n'ouvre pas |
| **Les débouchés en Île-de-France** | Types d'employeurs, sans développement géographique par département |

**Règle sur le troisième H3** — il nomme des types d'employeurs, jamais des départements. Le développement territorial appartient aux pages géographiques, et c'est la principale source de cannibalisation à venir dans le silo.

### Gabarit B — Quand faire ce stage

**H2** — **Quand suivre votre [libellé court]**

**Trois H3**

| H3 | Contenu |
|---|---|
| **La fenêtre à respecter** | Quand le stage peut être suivi, quand la demande doit être déposée `[À VÉRIFIER]` |
| **Ce qui se passe si vous dépassez l'échéance** | Conséquence sur le droit d'exercer, et ce qu'il faut faire alors `[À VÉRIFIER]` |
| **Un stage par activité détenue** | Une carte portant plusieurs mentions demande une attestation par activité |

**Ce bloc est la raison d'être du gabarit B**, et il est entièrement suspendu à la vérification de la fenêtre de dépôt du renouvellement — point numéro 1 de la liste de vérification des pages démarche. Les six pages de gabarit B ne peuvent pas être écrites avant.

---

## 8. Bloc 5 — Prérequis et conditions d'accès

**H2** — **Les conditions pour s'inscrire**

### Structure commune

| H3 | Contenu | Frontière |
|---|---|---|
| **L'autorisation préalable du CNAPS** | Trois lignes, ce qu'elle est, quand la demander | Le détail appartient à la page démarche |
| **Les conditions de moralité** | Deux lignes | Le détail appartient à la page démarche |
| **Le niveau de français** | Le niveau exigé et comment le justifier `[À VÉRIFIER]` | Propre à cette page |
| **Les conditions propres au titre** | Expérience, aptitude, contraintes particulières | **Propre à cette page — c'est ici que la différenciation se joue** |

**Le lien contextuel vers la page démarche est en plein texte**, dans le premier H3. C'est le maillage le plus qualitatif de la page, et il évite de réécrire la procédure.

**Formulation type du renvoi**

> L'autorisation préalable se demande avant l'inscription, en ligne auprès du CNAPS, et son instruction prend du temps. **Voir comment faire la demande →**

**Gabarit B** — le premier H3 est remplacé : le prérequis est une carte professionnelle en cours de validité, pas une autorisation préalable. Un agent dont la carte est déjà expirée relève d'un cas particulier `[À VÉRIFIER]`.

---

## 9. Bloc 6 — Programme et déroulé

**H2** — **Le programme de la formation**

**Contenu réglementaire pur**, écrit une seule fois sur le site, jamais repris ailleurs. Modules, volumes horaires, modalités d'évaluation, épreuves.

`[À COMPLÉTER par titre — à relever depuis les fiches France compétences correspondant aux codes RNCP du référentiel, et depuis les arrêtés applicables.]`

**Format recommandé** — un tableau des modules avec leur volume horaire, suivi d'un paragraphe sur les modalités d'évaluation. Le tableau est ce qui sera repris en position zéro sur les requêtes « programme [titre] ».

**Ce que ce bloc ne fait pas** — il ne compare pas ce titre à un autre. Une phrase du type « contrairement au SSIAP 1, le SSIAP 2 comporte… » appartient au bloc « titres liés », pas ici.

---

## 10. Bloc 7 — Durée, coût, financement

**H2** — **Combien de temps et combien ça coûte**

*Gabarit B : ce bloc remonte en position 5, avant les prérequis.*

### Structure

| H3 | Contenu |
|---|---|
| **La durée** | Durée réglementaire, et ce qui la fait varier selon les organismes |
| **Le coût** | Ordre de grandeur, et ce que le prix recouvre |
| **Les financements possibles** | CPF, France Travail, OPCO, plan de développement |

**Sur le coût** — donner une fourchette et expliquer sa largeur, plutôt qu'un chiffre unique. La variation entre organismes s'explique par le format, l'effectif par session, les moyens matériels — rarement par la qualité seule.

**Sur les financements** — ce bloc dit quels dispositifs sont mobilisables pour ce titre. Il ne dit pas comment monter un dossier : cela relèverait d'un article de blog, catégorie « Se former ».

**Phrase de clôture, commune**

> Les organismes référencés indiquent les financements qu'ils acceptent. Vérifiez qu'un centre est certifié Qualiopi : cette certification conditionne l'accès aux financements publics et mutualisés.

---

## 11. Bloc 8 — Les organismes qui préparent ce titre

> **Bloc pivot.** C'est là que le contenu éditorial devient de l'inventaire.

**H2** — **Où préparer le [libellé court] en Île-de-France**

### Contenu

6 à 10 fiches maximum, cartes identiques à celles du catalogue, tri par score de complétude. Aucune pagination, aucun filtre.

### Lien de fin de bloc

> **Voir tous les organismes qui préparent le [libellé court] →**

*Pointe vers le catalogue filtré, non indexable. C'est de l'usage, pas du référencement.*

### Sous le seuil : bloc entièrement masqué

**Copy de remplacement**

> **Vous cherchez un centre pour le [libellé court] ?**
> Consultez les organismes de formation référencés en Île-de-France, ou dites-nous ce que vous cherchez.
> **Voir tous les organismes →**

**Pourquoi masquer plutôt qu'afficher deux fiches** — sur la page censée porter le trafic principal du silo, un bloc « les organismes » contenant deux cartes donne une impression de vide plus dommageable que son absence. La spécification tranche déjà dans ce sens.

---

## 12. Bloc 9 — Où se former en Île-de-France

**H2** — **Se former près de chez soi**

### Contenu

Liens vers les pages géographiques publiées, avec compteurs conditionnés au seuil.

### Ligne d'accompagnement

> La formation se déroule en présentiel : chaque département dispose de sa page, avec les organismes qui y sont implantés.

> **Règle anti-cannibalisation la plus importante de cette famille de pages.**
>
> Ce bloc **liste** les zones. Il ne développe rien. Pas une phrase sur le TFP APS en Seine-Saint-Denis, pas un paragraphe par département, pas de comparaison entre zones.
>
> C'est la page géographique qui traite le croisement titre × territoire. Écrire deux paragraphes par département ici viderait huit pages de leur substance pour enrichir une seule, et créerait exactement la duplication interne que l'interdiction des pages titre × département cherche à éviter.

**Contrôle à faire à chaque itération éditoriale** — ce bloc grossit naturellement. Quelqu'un ajoutera un jour « le SSIAP 1 est particulièrement demandé dans les Hauts-de-Seine ». C'est le début de la cannibalisation.

---

## 13. Bloc 10 — Titres liés

**H2** — **Les titres du même parcours**

### Ce qu'il contient, par gabarit

| Gabarit A | Gabarit B |
|---|---|
| Le maintien associé | Le titre initial correspondant |
| Le niveau supérieur, s'il existe | Les autres maintiens de la même filière |
| Les titres du même métier | Le titre de niveau supérieur, si une progression est en jeu |

### Format

Un lien par titre, avec **une ligne expliquant le rapport** — pas une simple liste.

> **SSIAP 2** — Le niveau supérieur, pour encadrer une équipe d'agents SSIAP 1.
> **Recyclage SSIAP 1** — Le stage à suivre tous les trois ans pour conserver votre qualification.
> **TFP APS** — Le titre de la surveillance. Beaucoup d'agents cumulent les deux.

**Pourquoi une ligne d'explication et pas une liste** — c'est ce qui fait exister le référentiel comme un ensemble cohérent plutôt qu'une collection de pages isolées, et c'est du contenu spécifique à chaque page, qui compte dans le ratio de différenciation.

**Règle absolue** — ne lier que vers des pages **publiées**. Avec un phasage en trois vagues, ce bloc sera partiel pendant plusieurs mois. Un titre non publié n'apparaît pas, même grisé.

---

## 14. Bloc 11 — Démarches associées

**H2** — **Les démarches à accomplir**

| Gabarit A | Gabarit B |
|---|---|
| Autorisation préalable — **avant la formation** | Renouvellement de la carte — **après le stage** |
| Carte professionnelle — **après l'obtention du titre** | Autorisation préalable, si la carte est expirée |

**Chaque lien porte une mention de position chronologique.** C'est ce qui distingue ce bloc d'une liste de liens : il replace la démarche dans le parcours du visiteur.

---

## 15. Bloc 12 — FAQ

> **Le point de risque de cette famille**, comme sur les pages géographiques : treize FAQ voisines sur des sujets proches.

### Principe

**Aucune question ne doit pouvoir être posée à l'identique sur une autre page pilier.** Le test : la question contient-elle une spécificité du titre, ou seulement son nom substitué ?

| À écarter | À retenir |
|---|---|
| « Combien coûte le [titre] ? » | « Le SSIAP 2 est-il accessible sans expérience professionnelle ? » |
| « Où passer le [titre] ? » | « Faut-il posséder son propre chien pour passer le TFP ASC ? » |
| « Le [titre] est-il éligible au CPF ? » | « Le recyclage SSIAP 1 remplace-t-il le MAC APS ? » |

Les trois questions de gauche donnent la même réponse structurelle sur treize pages. Elles appartiennent au corps de la page, pas à la FAQ.

**6 à 10 questions par page**, balisage `FAQPage`, spécifiques au titre.

**Une question systématique et légitime** — la question qui distingue ce titre de son voisin le plus proche. Elle est différente sur chaque page par construction : « Quelle différence entre le SSIAP 1 et le TFP APS ? », « Quelle différence entre le recyclage et la remise à niveau SSIAP ? », « Quelle différence entre le MAC APS et le recyclage SSIAP ? »

---

## 16. Bloc 13 — Accroche formulaire d'affinage

**Gabarit A**

> **Ce titre ne correspond pas à votre situation ?**
> Six questions suffisent pour identifier celui qui vous convient.
> **Trouver mon titre →**

**Gabarit B**

> **Vous ne savez pas quel stage correspond à votre carte ?**
> Indiquez le titre que vous détenez, nous vous orientons vers le maintien correspondant.
> **Vérifier mon cas →**

**Pourquoi une variante par gabarit** — l'accroche de gabarit A s'adresse à quelqu'un qui hésite entre des métiers ; celle de gabarit B à quelqu'un qui sait ce qu'il fait mais ignore quel stage lui incombe, ce qui est fréquent sur les cartes à plusieurs mentions.

---

## 17. Le plan de différenciation — la condition de survie de la famille

> **Règle : au moins 40 % de contenu réellement spécifique par page.** Une page qui pourrait être obtenue par rechercher-remplacer depuis une autre est une page à réécrire.

Le gabarit garantit une part de similarité. La différenciation se joue dans quatre endroits : le bloc 4, les conditions propres au titre du bloc 5, le programme du bloc 6, et la FAQ.

### L'angle spécifique de chaque page

| Titre | Ce qui n'existe que sur cette page |
|---|---|
| **TFP APS** | Le titre le plus large du secteur : c'est la page qui doit expliquer l'étendue des activités couvertes, et pourquoi elle en fait le titre le plus employable. |
| **MAC APS** | Le maintien le plus courant, donc celui où la question du cumul d'activités sur une même carte se pose le plus. |
| **SSIAP 1** | Le régime distinct — ERP et IGH, pas Livre VI. C'est la page qui doit expliquer que la sécurité incendie n'est pas régie par le même cadre que la surveillance. `[À VÉRIFIER]` |
| **SSIAP 2** | La condition d'expérience professionnelle, absente du SSIAP 1. Le passage du poste d'exécution à l'encadrement. `[À VÉRIFIER]` |
| **SSIAP 3** | La responsabilité d'un service entier, la durée nettement supérieure, un public de reconversion interne. |
| **Recyclage SSIAP 1, 2, 3** | La périodicité triennale, distincte des cinq ans de la carte professionnelle. Et la distinction recyclage / remise à niveau, traitée en section à l'intérieur de chaque page. |
| **TFP ASC** | Les contraintes propres au chien : détention, aptitude de l'animal, certificat vétérinaire, statut du binôme. Aucun autre titre ne porte cela. `[À VÉRIFIER]` |
| **MAC cynophile** | Le maintien porte sur le binôme, pas seulement sur l'agent. |
| **TFP ASA** | La double réglementation : sécurité privée et sûreté de l'aviation civile relevant du règlement européen. Les typologies de certification. Le badge aéroportuaire. `[À VÉRIFIER]` |
| **TFP A3P** | Niveau de qualification 4, formation nettement plus longue, marché étroit et sélectif. La distinction entre protection physique et « garde du corps » du langage courant. |
| **MAC A3P** | Le seul maintien portant sur des gestes techniques réellement pratiques. |

**Ce tableau est la commande de rédaction.** Chaque ligne dit ce que la page doit contenir et que les douze autres ne contiennent pas. Une page dont l'angle spécifique n'est pas développé sur au moins deux sections est une page qui n'aurait pas dû être publiée dans cette vague.

### Le cas des trois recyclages SSIAP

Trois pages très proches, c'est le point faible de la famille. La différenciation tient à trois choses : le niveau de qualification concerné, la durée, et le contenu du recyclage lui-même. Si après vérification ces trois éléments ne suffisent pas à produire trois pages distinctes, la solution est **une page unique « Recyclage SSIAP » avec trois sections**, pas trois pages qui se ressemblent.

**Décision à prendre après la vérification des durées et des contenus**, pas avant. Cela ferait passer le référentiel de 13 à 11 titres.

---

## 18. La grille de vérification avant écriture

> Aucune page pilier ne s'écrit avant que sa ligne soit remplie.

| # | Point | Pages concernées | Source |
|---|---|---|---|
| 1 | **Fenêtre de dépôt du renouvellement** | Les 6 pages de gabarit B | FAQ CNAPS |
| 2 | **Durées réglementaires** | Les 13 | Fiches France compétences, arrêtés |
| 3 | **Programme et modules par titre** | Les 13 | Fiches France compétences |
| 4 | **Conditions d'expérience SSIAP 2 et 3** | 2 pages | Arrêté sécurité incendie |
| 5 | **Régime SSIAP et articulation avec la carte professionnelle** | 6 pages | Arrêté sécurité incendie, CNAPS |
| 6 | **Contraintes cynophiles** | 2 pages | Fiche RNCP 34486, arrêtés |
| 7 | **Code RNCP du TFP ASA** — 34487 ou 40278 | 1 page | France compétences |
| 8 | **Typologies aéroportuaires et badge** | 1 page | DGAC, règlement UE 2015/1998 |
| 9 | **Niveau de français exigé et justificatifs** | Les 13 | Arrêté du 31 mars 2022 |
| 10 | **Distinction recyclage / remise à niveau SSIAP** | 3 pages | Arrêté sécurité incendie |

**Ordre de travail recommandé** — les points 1 à 5 débloquent les six pages de la vague 1. Les points 6 et 10 débloquent la vague 2. Les points 7 et 8 débloquent la vague 3. Il n'est pas nécessaire d'avoir tout vérifié pour commencer à publier.

---

## 19. Points de vigilance

| Point | Vérification |
|---|---|
| **Bloc 9 non développé** | Aucune phrase sur un département. C'est le contrôle le plus important, et celui qui se relâchera en premier. |
| **Programme écrit une seule fois** | Le contenu réglementaire d'un titre n'existe nulle part ailleurs sur le site. |
| **Titres liés publiés uniquement** | Pendant le phasage, ce bloc est partiel. Un titre non publié n'apparaît pas, même grisé. |
| **FAQ spécifique** | Aucune question posable à l'identique sur une autre page pilier. |
| **Statut par titre implémenté** | Sans lui, la grille de l'accueil pointe vers des 404. |
| **Ratio de différenciation** | À contrôler sur deux pages voisines avant publication de chaque vague. |
| **Séquencement avec le blog** | Les articles qui recoupent un titre attendent la publication de sa page. |
| **Slugs vérifiés** | Contre les slugs réservés et les slugs géographiques, à chaque ajout. |

---

## 20. Points ouverts

- **Mener la vérification de la section 18**, au moins ses cinq premiers points, avant d'écrire la vague 1.
- **Trancher le sort des trois recyclages SSIAP** : trois pages ou une page à trois sections, après vérification.
- **Implémenter le statut par titre** — actif page publiée, actif page non publiée, archivé. Bloquant pour la grille de l'accueil.
- **Valider le phasage en trois vagues** proposé en section 1.
- **Décider du balisage `Course`** sur le titre lui-même, selon l'évolution des recommandations.
- **Chiffrer le seuil d'affichage du compteur** — septième document où ce point revient.
- **Mettre à jour la grille de l'accueil** pour le regroupement par catégorie, cohérent avec le référentiel.

---

## 21. Documents liés

- **UX Page pilier par titre** — structure, deux gabarits, statut par titre, phasage
- **Référentiel des titres** — les 13 titres, leurs libellés, leurs slugs, leurs codes RNCP
- **Copy Pages démarches CNAPS** — propriétaire des procédures citées, et source de la vérification n° 1
- **Copy Pages géographiques** — l'autre côté de la frontière du bloc 9
- **Copy Catalogue organismes** — cartes du bloc 8
- **Copy Formulaire d'affinage** — destination du bloc 13
- **Copy Blog** — séquencement de publication conditionné par ces pages
