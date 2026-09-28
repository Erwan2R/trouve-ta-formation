# Référentiel des titres — Sécurité privée

**Trouve ta formation — Verticale sécurité privée**
Version 1.0 — 1er septembre 2026
Statut : **source unique** pour la grille de l'accueil, le filtre du catalogue, les tableaux des pages démarches et la liste des pages piliers

---

## 1. Rôle de ce document

Le référentiel est une **liste fermée**. Un organisme ne peut rattacher une offre qu'à un titre existant, sans saisie libre — c'est ce qui rend les filtres du catalogue opérants et les pages piliers cohérentes.

Ce document arrête cette liste pour le lancement. Toute modification ultérieure passe par l'onglet référentiel de l'espace admin, avec la règle déjà posée : on modifie un intitulé, on n'en supprime jamais un.

**Quatre objets dépendent directement de ce document :**

| Objet | Ce qu'il en tire |
|---|---|
| Grille de l'accueil, bloc 3 | Une carte par titre, groupées par catégorie |
| Filtre « Formation préparée » du catalogue | Options et groupement |
| Pages piliers | Une page par titre — le nombre de pages à écrire |
| Tableaux des pages démarches | Correspondance titre / activité, et MAC par activité |

---

## 2. Les décisions prises

| Décision | Arbitrage | Confiance |
|---|---|---|
| **Périmètre phase 1 : 12 titres** | Ce qui a une offre dense en Île-de-France et un volume de recherche réel | **Moyenne** — repose sur une estimation du marché francilien, à confirmer par Erwan |
| **CQP PSGE écarté de la phase 1** | Statut réglementaire incertain, en cours de transformation | **Haute** — créer la page maintenant reviendrait à décrire un dispositif en train de changer |
| **Recyclages SSIAP en pages autonomes** | Requête distincte, intention distincte, achat contraint | **Haute** |
| **Slugs par acronyme officiel** | Stabilité, brièveté, aucun risque de collision avec un slug géographique | **Moyenne** — voir la discussion en section 6 |

---

## 3. Le référentiel — phase 1

> **13 titres, 5 catégories.** Ordre d'affichage des catégories tel que listé, du plus large au plus spécialisé.
>
> *Version 1.1 — ajout du MAC A3P, absent de la version initiale.*

### Catégorie 1 — Surveillance humaine

| Libellé court | Libellé long (H1) | Slug | RNCP | Durée |
|---|---|---|---|---|
| **TFP APS** | Titre à finalité professionnelle Agent de prévention et de sécurité | `tfp-aps` | 36648 | `[À VÉRIFIER]` |
| **MAC APS** | Maintien et actualisation des compétences — Agent de prévention et de sécurité | `mac-aps` | — | `[À VÉRIFIER]` |

*L'échéance d'enregistrement du TFP APS au RNCP est fixée au 01/07/2027. À surveiller, sans impact au lancement.*

### Catégorie 2 — Sécurité incendie

| Libellé court | Libellé long (H1) | Slug | RNCP | Durée |
|---|---|---|---|---|
| **SSIAP 1** | SSIAP 1 — Agent de service de sécurité incendie | `ssiap-1` | — | `[À VÉRIFIER]` |
| **SSIAP 2** | SSIAP 2 — Chef d'équipe de service de sécurité incendie | `ssiap-2` | — | `[À VÉRIFIER]` |
| **SSIAP 3** | SSIAP 3 — Chef de service de sécurité incendie | `ssiap-3` | — | `[À VÉRIFIER]` |
| **Recyclage SSIAP 1** | Recyclage SSIAP 1 | `recyclage-ssiap-1` | — | `[À VÉRIFIER]` |
| **Recyclage SSIAP 2** | Recyclage SSIAP 2 | `recyclage-ssiap-2` | — | `[À VÉRIFIER]` |
| **Recyclage SSIAP 3** | Recyclage SSIAP 3 | `recyclage-ssiap-3` | — | `[À VÉRIFIER]` |

**Les remises à niveau ne sont pas des titres du référentiel.** Elles sont traitées comme une section à l'intérieur de chaque page recyclage. Créer six pages là où le volume de recherche en justifie trois disperserait l'autorité sans gain.

### Catégorie 3 — Cynophile

| Libellé court | Libellé long (H1) | Slug | RNCP | Durée |
|---|---|---|---|---|
| **TFP ASC** | Titre à finalité professionnelle Agent de sécurité cynophile | `tfp-asc` | 34486 | `[À VÉRIFIER]` |
| **MAC cynophile** | Maintien et actualisation des compétences — Agent de sécurité cynophile | `mac-cyno` | — | `[À VÉRIFIER]` |

*L'intitulé exact du MAC cynophile est à confirmer : « MAC ASC » et « MAC CYNO » circulent tous les deux, le second étant employé dans les communications de branche relatives aux financements.* `[À VÉRIFIER]`

### Catégorie 4 — Sûreté aéroportuaire

| Libellé court | Libellé long (H1) | Slug | RNCP | Durée |
|---|---|---|---|---|
| **TFP ASA** | Titre à finalité professionnelle Agent de sûreté aéroportuaire | `tfp-asa` | 34487 → **40278 ?** | `[À VÉRIFIER]` |

**Le code RNCP a probablement changé.** Une fiche d'organisme mise à jour en 2026 mentionne le **RNCP 40278** pour l'agent de sûreté aéroportuaire, certifié par l'ADEF, avec une échéance d'enregistrement au 08/09/2028. Le code 34487 relevé sur la liste de branche est donc vraisemblablement l'ancien enregistrement. `[À VÉRIFIER en priorité sur France compétences]`

**Il n'existe pas de « MAC ASA ».** La vérification n'a trouvé aucun stage de maintien portant ce nom, alors que le MAC A3P est largement proposé. L'explication tient au régime : le TFP ASA couvre à la fois le tronc commun de la sécurité privée et les normes de base de la sûreté de l'aviation civile relevant du règlement européen 2015/1998. Le maintien des compétences se scinde donc probablement en deux : le tronc commun d'un côté, la formation périodique aéroportuaire de l'autre, cette seconde relevant de la DGAC et généralement portée par l'employeur.

**Conséquence retenue** — aucun titre « MAC ASA » n'entre au référentiel. Le parcours d'affinage traite ce cas par un message dédié plutôt que par une recommandation, parce que se tromper ici ferait perdre son droit d'exercer à un agent en poste. `[À VÉRIFIER : le parcours exact de renouvellement d'une carte ASA]`

### Catégorie 5 — Protection des personnes

| Libellé court | Libellé long (H1) | Slug | RNCP | Durée |
|---|---|---|---|---|
| **TFP A3P** | Titre à finalité professionnelle Agent de protection physique des personnes | `tfp-a3p` | 35098 | `[À VÉRIFIER]` |
| **MAC A3P** | Maintien et actualisation des compétences — Agent de protection physique des personnes | `mac-a3p` | — | `[À VÉRIFIER]` |

*Le TFP A3P est de niveau de qualification 4, contre 3 pour les titres d'entrée.*

**Ajout en version 1.1.** Le MAC A3P était absent de la version initiale, ce que le parcours d'affinage a révélé : un agent A3P dont la carte arrive à échéance n'avait aucune sortie. La vérification confirme que ce stage existe comme produit de formation identifié, largement proposé, avec une durée de l'ordre de 34 heures selon les organismes. C'est un achat contraint récurrent, donc du trafic bien converti.

---

## 4. Phase 2 — titres différés

| Titre | RNCP / RS | Raison du report | Condition de bascule |
|---|---|---|---|
| **TFP ASRA D** — Agent de sécurité renforcé armé catégorie D | 37616 | Offre rare, public restreint et déjà informé | Demande d'organismes, ou volume de recherche constaté |
| **TFP ASRA B&D** — Agent de sécurité renforcé armé catégories B et D | 37617 | Idem | Idem |
| **TFP A3PRA B&D** — Agent de protection physique des personnes renforcé armé | 39086 | Idem | Idem |
| **TFP CYNO EXPLO** — Agent cynotechnique en détection des explosifs | 37730 | Marché très étroit, et échéance d'enregistrement affichée au 19/07/2026 | Confirmation du statut d'enregistrement |
| **CQP PSGE / surveillance de grands événements** | RS 6214 | Dispositif en cours de transformation — voir section 5 | Publication du cadre pérennisé |

Les titres armés sont certifiés par l'UFACS, les autres par l'ADEF pour la CPNEFP de la branche.

**Mécanisme de bascule** — un titre de phase 2 entre au référentiel lorsqu'un organisme le demande via le circuit prévu dans l'espace admin, ou lorsque la Search Console montre des impressions sur les requêtes correspondantes. Le référentiel étant fermé, cette demande est le signal naturel.

---

## 5. Le cas du CQP PSGE

Ce titre permet d'obtenir une carte professionnelle de surveillance pour les manifestations sportives, récréatives, culturelles ou économiques rassemblant plus de 300 personnes, dans le cadre de la Coupe du monde de rugby 2023 et des JOP 2024. Cette carte ne permet pas d'exercer l'activité dans un autre cadre. La date d'échéance d'enregistrement affichée est le 14/12/2024.

En parallèle, le CNAPS a publié fin juillet 2026 la création d'une spécialité **« surveillance de grands événements »**, présentée comme la pérennisation de la carte mise en place pour ces deux compétitions.

**Conclusion** — le titre existe, mais son cadre change et le titre de remplacement n'est pas identifié. Créer la page maintenant produirait exactement ce que le document démarches interdit : une page décrivant un dispositif obsolète.

**Action** — vérifier le contenu de l'actualité CNAPS du 31 juillet 2026 et identifier la certification associée à la spécialité pérennisée. Si un nouveau titre est enregistré, il entre au référentiel en priorité : c'est un sujet récent, presque pas couvert éditorialement, donc une fenêtre de fraîcheur rare.

---

## 6. Règles de nommage

### Slugs

**Règle : acronyme officiel, en minuscules, tirets.**

Trois raisons. Les acronymes sont stables dans le temps, là où les intitulés métier évoluent. Ils sont courts, ce qui compte sur des URLs déjà profondes de deux niveaux. Et ils ne peuvent structurellement pas entrer en collision avec un slug de département ou de ville, qui vivent au même niveau de l'arborescence.

**Le compromis assumé** — pour trois titres, l'acronyme n'est pas la requête dominante. Un candidat tape plus volontiers *formation agent cynophile* que *TFP ASC*, *agent de sûreté aéroportuaire* que *TFP ASA*, *garde du corps* ou *protection rapprochée* que *TFP A3P*.

Le choix reste l'acronyme, pour deux raisons. Le poids du mot-clé dans l'URL est faible comparé à celui du H1 et du title, qui portent l'intitulé métier complet. Et un référentiel dont la moitié des slugs suit une convention et l'autre moitié une autre devient une source d'erreurs de routing.

**Contrepartie obligatoire** — le H1, le title et le corps de chaque page pilier portent l'intitulé métier en toutes lettres. Pour ces trois titres, le title doit mener avec le métier, pas avec l'acronyme :

> Formation agent de sécurité cynophile (TFP ASC) : programme et organismes

### Libellés

| Contexte | Forme |
|---|---|
| Carte de la grille d'accueil | Libellé court — **TFP APS** |
| Option de filtre du catalogue | Libellé court |
| Ancre de lien | Libellé court |
| H1 de la page pilier | Libellé long |
| Corps de texte | Intitulé métier, l'acronyme entre parenthèses à la première occurrence |

**Vérification des slugs réservés** — aucun des 12 slugs n'entre en conflit avec `organismes`, `demarches`, `blog`, `recherche` ou `formulaire`. Cette vérification est à refaire à chaque ajout au référentiel.

---

## 7. Le SSIAP relève d'un autre régime

> Point structurel, à trancher avant la rédaction des pages piliers.

Les SSIAP ne sont pas des titres à finalité professionnelle de la branche sécurité privée. Ils relèvent de la réglementation applicable aux services de sécurité incendie des établissements recevant du public et des immeubles de grande hauteur, et non du Livre VI du code de la sécurité intérieure qui encadre les activités privées de sécurité.

Conséquence : **un agent exerçant uniquement en sécurité incendie ne relève pas du même régime d'autorisation qu'un agent de surveillance.** En pratique, les deux qualifications se cumulent fréquemment sur un même poste — d'où la confusion générale, y compris chez les professionnels.

`[À VÉRIFIER avant rédaction des pages piliers : l'articulation exacte entre qualification SSIAP et carte professionnelle CNAPS selon le poste occupé.]`

**Trois conséquences déjà identifiées sur les documents produits :**

1. Le tableau de correspondance titre / activité de la page carte professionnelle ne contient que les TFP de branche. Les six titres SSIAP en sont exclus.
2. Le tableau MAC par activité de la page renouvellement exclut de même les recyclages SSIAP, qui ne conditionnent pas la carte professionnelle mais l'exercice de la fonction incendie.
3. Le corps éditorial de l'accueil présente TFP APS et SSIAP 1 comme deux portes d'entrée équivalentes. C'est vrai du point de vue du candidat, faux du point de vue réglementaire. La formulation doit être nuancée sans devenir illisible : les deux mènent à des métiers de la sécurité, mais pas au même cadre d'autorisation.

---

## 8. Les durées : pourquoi aucune n'est renseignée

Aucune durée ne figure dans ce document, et c'est délibéré.

Deux arrêtés récents encadrent la formation aux activités privées de sécurité : l'**arrêté du 23 octobre 2024** relatif aux conditions matérielles et pédagogiques de la formation, et l'**arrêté du 1er septembre 2025** portant cahier des charges applicable à la formation initiale.

Le second a moins d'un an. Toute durée relevée dans une source antérieure à l'automne 2025 est donc suspecte, y compris sur des sites d'organismes qui n'auraient pas mis à jour leurs pages. Les chiffres que j'avais placés dans le document accueil — 175 h pour le TFP APS, 67 h pour le SSIAP 1, 31 h pour le MAC APS — sont des valeurs communément citées, pas des valeurs vérifiées.

**Action** — relever les volumes horaires depuis les textes eux-mêmes, ou depuis les fiches France compétences correspondantes, qui portent les codes RNCP listés dans ce document. C'est le même chantier que la vérification des procédures CNAPS, et il se fait bien au même moment.

**Règle de rédaction en attendant** — la grille de l'accueil affiche la durée en clair, à un seul endroit du site. Le corps éditorial, lui, reste volontairement non chiffré. C'est la décision déjà prise dans le document accueil et elle prend tout son sens ici : une seule donnée à maintenir plutôt que quinze.

---

## 9. Impacts sur les documents déjà produits

> Le coût de reprise annoncé. Le voici, chiffré.

| Document | Ce qui change |
|---|---|
| **Copy Page d'accueil** | Grille du bloc 3 à refaire : 12 cartes au lieu de 11, retrait d'« Agent de sécurité magasin » et de « Transport de fonds », ajout des trois recyclages SSIAP et du MAC cynophile. Menu de navigation et colonne 1 du footer à aligner. Nuance à apporter au corps éditorial sur le régime SSIAP. |
| **Copy Catalogue organismes** | Options du filtre « Formation préparée » et grille du bloc 10 à aligner. Aucun texte rédigé à reprendre. |
| **Copy Pages démarches CNAPS** | Deux tableaux à produire, désormais possibles : correspondance titre / activité (5 TFP concernés, hors SSIAP) et MAC par activité (MAC APS et MAC cynophile). |
| **Copy Landing organismes** | Aucun impact. |

**Ce que ça confirme** — le coût de reprise est réel mais faible : il porte sur des listes et des libellés, jamais sur du texte rédigé. Les documents ont été écrits de façon à ce que ce soit le cas.

---

## 10. Corrections apportées à ma proposition initiale

| Élément | Statut |
|---|---|
| « Agent de sécurité magasin » | **Retiré.** N'existe pas comme titre distinct — la surveillance en magasin relève du TFP APS. |
| « Transport de fonds » | **Retiré.** Régime distinct, aucun titre de branche vérifié. |
| « Protection rapprochée » | **Renommé** en TFP A3P, intitulé officiel. |
| MAC cynophile | **Ajouté.** Absent de ma première liste alors que c'est un achat contraint récurrent. |
| Recyclages SSIAP | **Détaillés** en trois titres au lieu d'une entrée générique. |

---

## 11. Points ouverts

- **Valider le périmètre phase 1** au regard de la densité réelle de l'offre francilienne. C'est le point sur lequel Erwan est mieux placé que moi.
- **Vérifier le code RNCP du TFP ASA** — 34487 ou 40278. Point le plus concret de cette liste.
- **Vérifier le parcours de renouvellement d'une carte ASA**, qui conditionne un message du formulaire d'affinage.
- **Relever les durées réglementaires** depuis les textes ou les fiches France compétences.
- **Vérifier l'intitulé du MAC cynophile** — MAC ASC ou MAC CYNO.
- **Vérifier l'articulation SSIAP / carte professionnelle** avant rédaction des pages piliers.
- **Suivre le dossier « surveillance de grands événements »** et identifier la certification associée.
- **Vérifier le statut d'enregistrement du TFP CYNO EXPLO**, dont l'échéance affichée est passée.
- **Décider du sort des typologies aéroportuaires** — sous-niveaux du TFP ASA ou information de page pilier.

---

## 12. Sources

- UFACS — liste des certifications professionnelles de la sécurité privée, mise à jour avril 2026 : intitulés, codes RNCP, organismes certificateurs, niveaux de qualification
- CNAPS — actualité du 31 juillet 2026 sur la spécialité « surveillance de grands événements »
- France compétences — fiches RNCP correspondant aux codes listés, à consulter pour les durées et les blocs de compétences
- Arrêtés du 23 octobre 2024 et du 1er septembre 2025 sur la formation aux activités privées de sécurité

---

## 13. Documents liés

- **UX Référentiel des titres** — gestion admin de cette liste, circuit des demandes d'ajout
- **Copy Page d'accueil** — grille du bloc 3
- **Copy Catalogue organismes** — filtre principal
- **Copy Pages démarches CNAPS** — tableaux à produire
- **À produire** — copy des pages piliers, une par titre
