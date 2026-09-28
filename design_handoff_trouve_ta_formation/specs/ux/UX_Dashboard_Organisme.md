# Spécification UX — Dashboard organisme

**Trouve ta formation — Verticale sécurité privée**
`partenaires.trouve-ta-formation.fr/dashboard`
Version 1.0 — 31 août 2026

---

## 1. Rôle de la page

Page d'atterrissage de l'espace connecté, après connexion et après la dernière étape de l'onboarding.

**Deux fonctions, et seulement deux, en V1** : donner à l'organisme une lecture immédiate de l'état de sa fiche, et lui dire précisément quoi faire pour la faire progresser. Pas d'analytics, pas de leads — ces briques sont repoussées à une version ultérieure (voir Architecture des pages).

### Ce que cette page tranche

Le calcul du score de complétude est un point ouvert dans sept documents du projet. Il se tranche ici, puisque c'est cette page qui l'affiche et qui en dépend directement pour sa fonction de relance.

---

## 2. Le score de complétude — trois paliers qualitatifs

Pas de pourcentage. Un pourcentage nu invite à une lecture arithmétique et floue (« il me manque 12 % de quoi ? ») alors qu'un palier qualitatif porte un jugement clair et actionnable.

| Palier | Correspond à | Statut d'indexation de la fiche |
|---|---|---|
| **Basique** | Minimum publiable atteint | `noindex` |
| **Correct** | Fiche utile | Indexable |
| **Optimal** | Fiche complète | Indexable, mise en avant dans le tri du catalogue |

Cette table reprend directement les trois niveaux de remplissage actés dans la spec Inscription, et référence explicitement le seuil de `noindex` déjà mentionné dans quatre autres documents : **une fiche au palier Basique n'a pas assez de substance pour être indexée.**

### Détail du calcul

**Palier Basique** — atteint automatiquement à la publication, puisque c'est la condition de publication elle-même : nom de l'organisme, adresse du siège, un moyen de contact.

**Palier Correct** — Basique, plus :
- au moins une formation déclarée (condition nécessaire, non suffisante — voir plus bas)
- et au moins un des deux éléments restants de la fiche utile : financements acceptés renseignés, ou présentation rédigée

**Pourquoi les formations sont une condition obligatoire du palier Correct et pas un simple critère parmi d'autres** — une fiche sans formation déclarée n'apparaît dans aucun filtre par titre. Elle peut être aussi bien rédigée que possible, elle reste quasiment invisible sur le site public. La faire dépendre d'un score qui l'ignorerait serait incohérent avec le reste du produit.

**Palier Optimal** — Correct, plus au moins 5 des 7 éléments suivants renseignés : logo, SIRET, agrément CNAPS, Qualiopi, horaires, accessibilité, site web. (Le 8ᵉ élément de la fiche complète, les lieux additionnels, est exclu du dénominateur : il ne s'applique pas à un organisme mono-site, et le pénaliser reviendrait à rendre l'Optimal hors d'atteinte pour lui.)

**Recalcul dynamique** — le score n'est pas figé après publication. Si un organisme retire ses formations déclarées, il repasse sous le palier Correct et sa fiche repasse en `noindex`. Le dashboard doit refléter ce recul aussi clairement qu'une progression.

---

## 3. La checklist de relance

**Toujours une action, jamais un score nu.** Le palier seul ne dit pas quoi faire — c'est la règle déjà actée dans la spec Inscription, appliquée ici à sa forme la plus visible.

**Format retenu : une checklist courte de 2 à 3 actions, classées par impact.**

### Logique de classement

1. **Premier critère : l'action qui fait franchir le palier suivant.** Si l'organisme est à Basique, l'action n°1 est toujours liée à ce qui manque pour Correct — en général « ajoutez vos formations », sauf s'il en a déjà déclaré, auquel cas c'est financements ou présentation.
2. **Deuxième critère, à Correct ou au-delà : l'impact business avant l'exhaustivité.** L'agrément CNAPS et Qualiopi passent avant le site web ou les horaires — ce sont eux qui distinguent un centre légal, comme le rappelle la spec Inscription à propos des badges de la fiche.
3. **Jamais plus de 3 actions affichées.** Une checklist longue reproduit le problème qu'elle est censée résoudre : elle redevient une liste de champs vides plutôt qu'une priorité claire.

### Exemple de contenu (organisme au palier Basique, sans formation déclarée)

> **Pour passer au palier Correct :**
> 1. Ajoutez vos formations — c'est ce qui vous rend visible dans les résultats de recherche des candidats
> 2. Renseignez les financements que vous acceptez
> 3. Rédigez une courte présentation de votre organisme

### Cas du palier Optimal atteint

Pas de checklist vide. Message de confirmation sobre, sans nouvelle injonction — l'organisme a fait ce qu'il y avait à faire, le dashboard ne doit pas inventer une exigence supplémentaire pour occuper l'espace.

---

## 4. Ordre des blocs

| # | Bloc | Fonction dominante |
|---|---|---|
| 1 | En-tête — nom de l'organisme, lien vers la fiche publique | Contexte |
| 2 | **Palier de complétude** — badge visuel, statut d'indexation | Cœur de page |
| 3 | **Checklist de relance** | Action |
| 4 | Accès rapides — Ma fiche, Mes formations, Paramètres | Navigation |
| 5 | Rappel du statut de publication | Information |

### 1. En-tête

Nom de l'organisme, et un lien direct « Voir ma fiche publique » — l'organisme doit pouvoir vérifier en un clic ce que voit un visiteur, sans devoir chercher son URL.

### 2. Palier de complétude

Badge visuel des trois paliers (Basique / Correct / Optimal), le palier actuel mis en évidence. Mention explicite et non ambiguë du statut d'indexation : si la fiche est en `noindex`, le dire en toutes lettres — pas une icône seule, un texte court du type « Votre fiche n'apparaît pas encore dans les résultats de recherche ».

**Pourquoi l'expliciter aussi frontalement** — c'est cohérent avec le principe déjà acté sur la fiche publique elle-même : afficher « agrément non renseigné » plutôt que de masquer un manque. Le même principe de transparence s'applique côté organisme sur sa propre visibilité.

### 3. Checklist de relance

Voir section 3. Placée immédiatement sous le palier — c'est la suite logique du constat.

### 4. Accès rapides

Trois raccourcis vers Ma fiche, Mes formations, Paramètres. Chaque item de la checklist pointe directement vers la page et, si possible, le champ concerné plutôt que vers la page en général.

### 5. Rappel du statut de publication

Si la fiche n'est pas encore publiée (email non validé), le dashboard le rappelle en priorité au-dessus de tout le reste — rien ne sert d'afficher un score de complétude sur une fiche qui n'est pas encore en ligne.

---

## 5. Ce qu'il ne faut pas faire

- Afficher un pourcentage brut à côté ou à la place du palier
- Afficher un score sans action associée — règle déjà actée, rappelée ici parce que c'est la page où l'erreur serait la plus facile à commettre
- Dépasser 3 actions dans la checklist
- Masquer le statut `noindex` d'une fiche pour ne pas décourager l'organisme — la transparence prime, comme sur la fiche publique
- Inventer une action quand le palier Optimal est atteint
- Introduire des statistiques de vues ou de leads en V1

---

## 6. Points ouverts

- **Valider les seuils numériques proposés** (1 formation minimum, 1 élément sur 2 pour Correct, 5 sur 7 pour Optimal) — posés ici avec leur rationale, mais à confirmer avant développement.
- **Décider si le recalcul du palier est instantané ou différé** (ex : recalcul à chaque sauvegarde vs. job périodique). Instantané recommandé pour la cohérence avec le principe de transparence, à confirmer selon la charge technique.
- **Définir le comportement du lien « Voir ma fiche publique »** quand la fiche est en `noindex` — elle reste accessible par URL directe, seule l'indexation change, mais l'interface doit le clarifier pour éviter la confusion entre « invisible sur le site » et « invisible sur les moteurs ».

---

## 7. Documents liés

- **Architecture des pages** — environnement Log, inventaire des pages
- **UX Inscription organisme** — trois niveaux de remplissage, parcours d'onboarding, principe de transparence sur les manques
- **UX Fiche organisme** — ce que le score pilote côté public (seuil `noindex`)
- **UX Catalogue organismes** — tri par score de complétude
- **UX Page d'accueil** — sélection de l'échantillon d'organismes, dépendante du score
- **UX Page pilier par titre** — tri du bloc organismes, dépendant du score
- **À produire** — Ma fiche, Mes formations, Paramètres
