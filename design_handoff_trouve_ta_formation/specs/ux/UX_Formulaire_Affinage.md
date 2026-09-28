# Spécification UX — Formulaire d'affinage

**Trouve ta formation — Verticale sécurité privée**
Parcours transversal, sans URL indexable
Version 1.0 — 31 août 2026

---

## 1. Rôle du parcours

Guider un visiteur qui ne sait pas quel titre viser jusqu'à une recommandation motivée, accompagnée des organismes qui la préparent près de chez lui.

C'est la particularité produit identifiée dans la note de cadrage : plutôt que de laisser le visiteur naviguer seul dans un annuaire brut, il est orienté vers une sélection restreinte et pertinente.

### Ce qu'il recommande

**Un titre d'abord, des organismes ensuite.** Le problème principal du candidat n'est pas de choisir un centre, c'est de savoir quel titre correspond à sa situation. La recommandation porte donc sur le titre, et la liste d'organismes en découle.

### Où il vit

Parcours en modale ou overlay, ouvert depuis les blocs d'accroche de l'accueil et des pages formation. **Pas d'URL indexable** — ni le parcours ni les écrans de résultats. Si un état est reflété dans l'URL pour permettre le partage, il est en `noindex`.

---

## 2. Deux mécaniques dans un même parcours

Le parcours n'est pas un entonnoir uniforme. Il enchaîne deux logiques différentes.

| Phase | Mécanique | Objet |
|---|---|---|
| **Identification du titre** | Arbre à branches — les questions dépendent des réponses précédentes | Quel titre correspond à la situation |
| **Filtrage des organismes** | Questions plates, identiques quelle que soit la branche | Lesquels sont accessibles |

Conséquence de conception : ne jamais poser à quelqu'un qui vient renouveler sa carte les questions destinées à un débutant. C'est le principe qui justifie les branches.

---

## 3. La règle qui arbitre la longueur

> **Chaque question doit soit couper l'arbre, soit filtrer la liste d'organismes.**

Une question dont la réponse ne change ni le titre recommandé ni la liste finale est supprimée, même si la donnée serait intéressante à collecter. Collecter n'est pas une justification suffisante : chaque écran supplémentaire fait perdre des répondants.

Une exception assumée : les questions qui changent le **message** du résultat sans filtrer (échéance de carte, délai souhaité). Elles sont conservées parce qu'elles modifient ce que le visiteur voit.

---

## 4. Structure en deux temps

Le parcours donne une première recommandation rapidement, puis propose de l'affiner.

| Temps | Écrans | Sortie |
|---|---|---|
| **Recommandation initiale** | 5 à 7 selon la branche | Titre + organismes filtrés |
| **Affinage optionnel** | 4 questions supplémentaires | Liste resserrée |

Celui qui est décidé s'arrête au premier résultat. Celui qui hésite continue. Le parcours fait donc six écrans pour les uns et jusqu'à douze pour les autres, sans perdre personne en route.

**Barre de progression avec nombre d'étapes restantes affiché.** C'est ce qui fait le plus pour le taux de complétion sur un questionnaire à branches, où le visiteur ne peut pas estimer la longueur.

**Une seule question par écran**, sauf les questions de filtrage final qui peuvent être regroupées.

---

## 5. L'arbre — phase d'identification

### Q1 — La question qui coupe tout

**« Où en êtes-vous aujourd'hui ? »**

| Réponse | Branche |
|---|---|
| Je ne travaille pas encore dans la sécurité privée | **A — Entrée** |
| J'y travaille, ma carte arrive à échéance | **B — Renouvellement** |
| J'y travaille, je veux évoluer ou me spécialiser | **C — Progression** |

Elle sépare trois populations qui n'ont aucune question en commun. C'est la seule question posée à tout le monde dans cette phase.

---

### Branche A — Entrée dans le métier

**A2 — « Quel type de poste vous intéresse ? »**
Surveillance de sites et de magasins · Sécurité incendie en établissement recevant du public · Une spécialité

**A3 — conditionnelle, uniquement si « une spécialité »**
Sécurité cynophile · Sûreté aéroportuaire · Protection rapprochée · Transport de fonds

**A4 — « Avez-vous votre autorisation préalable du CNAPS ? »**
Oui · Non · Je ne sais pas ce que c'est

Cette question ne change pas le titre recommandé mais elle change **le résultat**. Sans autorisation préalable, la première étape n'est pas de choisir un centre : c'est d'accomplir la démarche. L'écran de résultat affiche alors les deux, dans l'ordre chronologique.

**Sorties** — TFP APS · SSIAP 1 · titre de la spécialité choisie

---

### Branche B — Renouvellement

**B2 — « Quel titre détenez-vous ? »** — liste issue du référentiel.

**B3 — « Où en est votre carte professionnelle ? »**
Déjà expirée · Moins de 3 mois · 3 à 12 mois · Plus d'un an

L'échéance ne change pas le titre mais elle change le message affiché, et elle peut orienter vers une remise à niveau plutôt qu'un maintien selon l'ancienneté du dépassement — cas fréquent côté SSIAP.

**Sortie** — le MAC correspondant, directement. Deux questions suffisent : la réponse est mécanique.

---

### Branche C — Progression

**C2 — « Quel titre détenez-vous ? »**

**C3 — « Quelle est votre expérience dans le secteur ? »**
Moins d'un an · 1 à 3 ans · Plus de 3 ans

Nécessaire : certains titres d'encadrement et le SSIAP 2 exigent une expérience professionnelle. Sans cette question, le parcours peut recommander un titre inaccessible.

**C4 — « Vers quoi souhaitez-vous aller ? »**
Encadrer une équipe · Aller vers la sécurité incendie · Me spécialiser

**Sortie** — titre de niveau supérieur ou titre de la spécialité visée.

---

## 6. Questions communes — phase de filtrage

Posées après l'identification du titre, quelle que soit la branche.

### S1 — « Quelle est votre situation actuelle ? »

Demandeur d'emploi · Salarié · En reconversion · Intérimaire · Étudiant

**Pourquoi cette question plutôt qu'une question sur le financement** — beaucoup de candidats ne savent pas répondre à « comment financez-vous », mais tous savent répondre à « quelle est votre situation ». Le financement probable en est déduit : France Travail pour un demandeur d'emploi, employeur ou OPCO pour un salarié.

Gain double : meilleure pertinence et meilleur taux de complétion.

### S2 — « Dans quels secteurs cherchez-vous ? »

Les 8 départements franciliens, en multi-sélection, plus « peu importe, je peux me déplacer ».

**Granularité départementale, pas communale.** Le périmètre du site est l'Île-de-France : le risque n'est pas d'afficher un organisme hors région, c'est d'en afficher un à l'autre bout de la région.

### S3 — « Quel rythme vous conviendrait ? »

Temps plein · Cours du soir · Week-end · Peu importe

---

## 7. Affinage optionnel

Proposé depuis l'écran de première recommandation, jamais imposé.

### O1 — « Souhaitez-vous passer plusieurs titres ? »

Un seul pour commencer · Une double compétence

Le cumul TFP APS + SSIAP 1 est fréquent : c'est ce qui rend un profil employable à la fois en surveillance et en établissement recevant du public. Cette question filtre réellement — elle ne retient que les organismes proposant les deux titres — et elle produit une recommandation que le candidat n'aurait pas formulée seul.

### O2 — « Comment vous déplacez-vous ? »

En transports en commun · J'ai un véhicule · Je cherche à proximité immédiate

Ne filtre pas directement mais **pilote la cascade de relâchement** : quelqu'un de motorisé accepte un centre à quarante minutes, quelqu'un en transports non.

### O3 — « Quand souhaitez-vous commencer ? »

Dès que possible · Dans les 3 mois · Dans l'année · Je me renseigne

Ne filtre rien en V1, faute de sessions. Conservée pour deux raisons : elle change le message du résultat, et elle distingue un visiteur prêt à s'engager d'un visiteur en exploration. Elle prendra sa pleine valeur avec le module de sessions.

### O4 — « Avez-vous besoin d'un accès PMR ? »

Case unique. L'accessibilité est un champ de la fiche organisme, donc filtrable dès la V1. Pour la minorité concernée, c'est un critère éliminatoire absolu.

---

## 8. Questions écartées et pourquoi

| Question | Raison de l'écarter |
|---|---|
| **Casier judiciaire** | Les données relatives aux infractions relèvent d'un régime RGPD restrictif. Ne pas collecter. À afficher comme condition sur l'écran de résultat, avec lien vers la page démarche. |
| **Niveau de français** | Prérequis réel mais question maladroite et peu fiable — personne ne se déclare insuffisant. À traiter en information, pas en question. |
| **Budget** | Le filtre prix a été écarté du catalogue faute de données fiables. Le poser ici serait incohérent : la réponse ne pourrait pas être appliquée. |
| **Présentiel / distanciel** | Sans objet sur cette verticale, comme sur le catalogue. |

---

## 9. La cascade de relâchement

> **Il doit être impossible d'aboutir à un écran vide.**

Le titre recommandé est toujours garanti : chaque branche débouche sur une sortie. La liste d'organismes ne l'est pas — au lancement, une combinaison exigeante peut ne renvoyer personne.

Relâchement dans cet ordre, avec affichage systématique de ce qui a été élargi :

| Niveau | Critères appliqués |
|---|---|
| 1 | Titre + département + rythme + situation |
| 2 | Retrait du rythme — le critère le moins bloquant |
| 3 | Extension aux départements limitrophes |
| 4 | Toute l'Île-de-France |
| 5 | Aucun organisme sur ce titre : page formation, démarches associées, et **titres proches** |

**Le niveau 5 en détail** — un SSIAP 1 pour qui visait le SSIAP 2 sans avoir l'expérience requise, un TFP APS pour qui visait une spécialité non couverte localement. La recommandation de titre reste affichée, avec sa page formation : le visiteur repart avec une réponse, même sans organisme.

**Règle d'affichage** — le message dit toujours ce qui a été élargi. « Aucun centre ne propose ce rythme en Seine-Saint-Denis, voici les centres du 93 et des départements voisins. » Un élargissement silencieux donne l'impression que le formulaire n'a pas écouté.

---

## 10. L'écran de résultat

Ordre des éléments :

| # | Élément |
|---|---|
| 1 | **Le titre recommandé**, avec une phrase expliquant pourquoi |
| 2 | Lien vers la page formation du titre |
| 3 | Encart démarche, si l'autorisation préalable manque |
| 4 | **Les organismes filtrés**, cartes identiques au catalogue |
| 5 | Message de relâchement, le cas échéant |
| 6 | Un ou deux titres alternatifs |
| 7 | Bouton « affiner davantage » vers les questions optionnelles |
| 8 | Bouton « modifier mes réponses », sans repartir de zéro |

**Sur la phrase d'explication** — elle n'est pas décorative. Une recommandation sans justification est perçue comme arbitraire, et le candidat repart vérifier ailleurs. Exemple de forme : « Vous visez la sécurité incendie et vous débutez dans le secteur : le SSIAP 1 est le titre d'entrée de cette filière. »

**Sur la modification des réponses** — revenir en arrière ne doit jamais réinitialiser le parcours. Un visiteur qui a répondu à huit questions et se voit tout recommencer abandonne.

---

## 11. Données personnelles

**Aucune collecte de coordonnées en V1.** L'architecture des pages exclut explicitement les leads du lancement : demander un email à la fin du parcours ajouterait une friction pour une donnée non exploitable, et ferait basculer le formulaire dans un traitement de données personnelles avec les obligations associées.

**Réponses collectées de façon anonyme**, à des fins d'analyse produit : quelles branches sont empruntées, où le parcours est abandonné, quelles combinaisons ne renvoient aucun organisme.

Cette dernière donnée a une valeur opérationnelle directe : elle indique quels titres et quels départements manquent dans l'inventaire, donc où concentrer la prospection.

**À ne jamais collecter** — casier judiciaire, données de santé, tout élément relevant d'une catégorie particulière au sens du RGPD. Le besoin d'accès PMR est traité comme un critère d'accessibilité du lieu, pas comme une information sur la personne : la question porte sur le besoin d'un accès adapté, pas sur une situation médicale.

**Le jour où les leads sont activés**, le consentement devient nécessaire et le parcours change de nature juridique. À cadrer à ce moment-là, pas avant.

---

## 12. Règles techniques

- Parcours en modale ou overlay, sans changement d'URL indexable.
- Si un état est reflété dans l'URL pour permettre le partage d'un résultat, il est en `noindex`.
- Le parcours et ses écrans de résultats ne sont jamais indexés.
- Navigation arrière possible à tout moment, sans perte des réponses saisies.
- Les cartes d'organismes du résultat sont les mêmes composants que celles du catalogue.
- Liens `<a>` en dur vers les pages formation et les fiches organisme.

---

## 13. Ce qu'il ne faut pas faire

- Poser une question qui ne change ni le titre ni la liste
- Afficher un écran de résultat vide
- Élargir les critères sans le dire
- Réinitialiser le parcours quand le visiteur revient en arrière
- Demander un email en V1
- Collecter une information sur le casier judiciaire
- Recommander un titre sans expliquer pourquoi
- Indexer un écran du parcours

---

## 14. Points ouverts

- **Arrêter la liste des titres du référentiel** — elle alimente les sorties de branche B et C.
- **Définir la table de correspondance** situation professionnelle → financements probables.
- **Décider du seuil de relâchement automatique** : à partir de combien de résultats considère-t-on qu'il faut élargir. Zéro, ou moins de trois ?
- **Mesurer les abandons par écran** dès le lancement, pour arbitrer la longueur sur données réelles plutôt que par principe.
- **Cadrer le passage aux leads** : consentement, finalité, durée de conservation, avant toute activation.

---

## 15. Documents liés

- **Note de cadrage** — le formulaire comme particularité produit
- **Architecture des pages** — inventaire des pages et de leurs rôles
- **Structure d'URL** — règle de non-indexation du formulaire
- **UX Page d'accueil** — bloc d'accroche, position 4
- **UX Page pilier par titre** — bloc d'accroche, position 13
- **UX Catalogue organismes** — cartes d'organismes réutilisées dans le résultat
- **UX Fiche organisme** — destination des résultats
- **À produire** — 404 et racine du domaine, puis environnement Log
