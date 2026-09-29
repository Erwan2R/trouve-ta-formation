# Spécification UX — Parcours d'inscription organisme

**Trouve ta formation — Verticale sécurité privée**
`partenaires.trouve-ta-formation.fr`
Version 1.0 — 31 août 2026

---

## 1. Rôle du parcours

Transformer un dirigeant arrivé depuis la landing B2B en **fiche organisme publiée et remplie**.

Deux objectifs qui se contredisent partiellement :

- **Créer le compte**, ce qui suppose le moins de friction possible.
- **Remplir la fiche**, ce qui suppose de collecter beaucoup d'informations.

Le parcours résout la tension en les séparant strictement : création de compte minimale, puis onboarding progressif avec sortie possible à tout moment.

### Enjeu en aval

Le taux de remplissage des fiches détermine le score de complétude, qui pilote le tri du catalogue, la sélection de l'échantillon d'accueil, le tri du bloc organismes des pages formation et le seuil de `noindex` des fiches. Ce parcours conditionne donc la qualité de l'ensemble du site public.

---

## 2. Le parcours

| # | Étape | Friction |
|---|---|---|
| 1 | Clic sur le CTA de la landing B2B → arrivée sur `partenaires.` | — |
| 2 | **Création de compte** — 3 champs | Minimale |
| 3 | Email de validation envoyé, **accès immédiat à l'onboarding** | Différée |
| 4 | **Onboarding en 7 étapes**, avec sortie possible | Progressive |
| 5 | **Publication** — conditionnée à la validation d'email et au minimum publiable | — |
| 6 | Dashboard, avec score de complétude et relances ciblées | — |

---

## 3. Création de compte — 3 champs

**Email · Mot de passe · Nom de l'organisme**

### Pourquoi si peu

À cette étape, le dirigeant n'a encore rien vu du produit. Chaque champ demandé avant la création de compte est un point d'abandon sur un engagement qu'il n'a pas décidé de prendre.

Et les informations sur l'organisme n'ont aucune valeur tant que le compte n'existe pas : un formulaire abandonné à mi-parcours laisse une ligne inutilisable en base.

Le nom de l'organisme est le seul champ métier retenu, parce qu'il personnalise l'email de validation et l'entrée dans l'onboarding.

---

## 4. La validation d'email bloque la publication, pas l'accès

> **Point de conception structurant.**

Si la validation bloque l'entrée dans l'onboarding, le dirigeant sort de son navigateur, va dans sa boîte mail, et une partie ne revient jamais.

S'il entre immédiatement et travaille sur sa fiche, il investit du temps — puis valide son email pour publier ce qu'il vient de construire. **L'engagement précède la friction, pas l'inverse.**

| Action | Validation d'email requise |
|---|---|
| Accéder à l'onboarding | Non |
| Remplir sa fiche | Non |
| Sauvegarder | Non |
| **Publier la fiche** | **Oui** |

---

## 5. Les trois niveaux de remplissage

Aucun champ de qualification n'est bloquant : ni le SIRET, ni le numéro d'agrément CNAPS, ni Qualiopi. La publication reste possible sans eux.

Le seul seuil technique est celui sans lequel la fiche n'existe pas.

| Niveau | Contenu | Statut |
|---|---|---|
| **Minimum publiable** | Nom de l'organisme, adresse du siège, un moyen de contact (téléphone ou email) | Nécessaire à l'existence de la fiche |
| **Fiche utile** | Formations déclarées, financements acceptés, présentation | Fortement incité, non bloquant |
| **Fiche complète** | Logo, SIRET, agrément CNAPS, Qualiopi, lieux additionnels, horaires, accessibilité, site web | Optionnel |

Le score de complétude se calcule sur cette échelle, et c'est lui qui pilote le `noindex` : une fiche au seul minimum publiable n'a pas assez de substance pour être indexée.

### Conséquence à assumer

Sans champ de qualification obligatoire, l'annuaire peut référencer des organismes dont l'agrément n'est pas renseigné.

**Traitement retenu :** afficher explicitement « agrément non renseigné » sur la fiche plutôt que de masquer l'absence. Trois effets — le visiteur dispose de l'information, l'organisme voit ce qui manque sur sa propre fiche, et l'écart avec les fiches complètes crée une incitation à renseigner.

Publication sur déclaration, sans vérification manuelle préalable. Une vérification a posteriori reste possible côté admin.

---

## 6. Les étapes de l'onboarding

Chaque étape est franchissable, reportable, et sauvegardée automatiquement.

### Étape 1 — Identité

Raison sociale, SIRET, numéro de déclaration d'activité, année de création, logo.

**Le SIRET permet de pré-remplir** la raison sociale et l'adresse du siège. Il n'est pas obligatoire, mais le renseigner fait gagner deux étapes au dirigeant — c'est l'argument à mettre en avant dans l'interface, plutôt qu'une contrainte.

### Étape 2 — Agrément et certifications

Numéro d'agrément CNAPS. Certification Qualiopi (oui/non, et numéro si oui).

**L'agrément CNAPS est l'information la plus importante de la fiche publique** : c'est ce qui distingue un centre légal d'un autre. Non obligatoire, mais l'interface indique clairement ce que son absence produit sur la fiche.

### Étape 3 — Coordonnées et siège

Adresse du siège, téléphone, **email de contact public**, site web, horaires d'accueil.

**Distinguer explicitement l'email de contact public de l'email du compte.** Ils diffèrent souvent, et la confusion produit soit une adresse de direction publiée par erreur, soit une adresse générique inutilisable pour les notifications.

### Étape 4 — Lieux de formation

« Dispensez-vous vos formations ailleurs qu'au siège ? »

Question unique, avec ajout dynamique d'adresses si la réponse est oui. La majorité répondra non : l'étape doit pouvoir être franchie en un clic.

Rappel du modèle : un organisme a **une seule fiche**, quel que soit son nombre d'implantations. Les lieux sont des attributs de la fiche.

### Étape 5 — Formations

> **Étape la plus longue et la plus abandonnée du parcours.**

Sélection dans le **référentiel fermé** — aucune saisie libre, sans quoi les filtres du catalogue deviennent inopérants.

Puis, pour chaque titre : prix ou fourchette, durée réelle, rythme, lieux où il est dispensé, financements acceptés.

**Deux mesures contre l'abandon :**

- **Découper en deux temps** — cocher les titres d'abord, détailler ensuite. La sélection seule prend trente secondes.
- **Autoriser la sortie après la sélection**, sans le détail. Une formation cochée sans prix vaut mieux qu'aucune formation : elle fait apparaître l'organisme dans les filtres par titre.

**Titre absent du référentiel** — l'organisme formule une demande, arbitrée côté admin. Ne jamais ouvrir un champ libre en secours.

### Étape 6 — Financements et modalités

CPF, France Travail, OPCO, plan de développement des compétences. Accessibilité PMR. Langues d'enseignement.

Ces champs alimentent directement des filtres du catalogue et du formulaire d'affinage. L'interface peut le dire : « ces informations permettent aux candidats de vous trouver ».

### Étape 7 — Présentation

Texte libre, plafonné en longueur.

**Placé en dernier** parce que c'est ce qui demande le plus de réflexion et de rédaction. Le demander plus tôt bloquerait le parcours sur une page blanche.

C'est pourtant ce qui différencie les fiches les unes des autres. À relancer depuis le dashboard si l'étape est passée.

---

## 7. Principes de conception

**Pré-remplir tout ce qui est vérifiable.** Le SIRET permet de récupérer raison sociale et adresse. Chaque champ pré-rempli est un champ qui n'est pas abandonné.

**Sauvegarde automatique à chaque étape.** Un onboarding en sept étapes sera interrompu. Il doit reprendre exactement là où il s'est arrêté, sans perte.

**Progression visible**, avec le nombre d'étapes restantes. Sur un parcours long, c'est ce qui fait le plus pour le taux de complétion.

**Sortie possible à chaque étape**, avec un rappel de ce qui reste à faire — jamais un blocage.

**Relance différenciée depuis le dashboard.** Ne pas afficher « fiche complète à 40 % » sans dire quoi faire. Afficher l'action manquante la plus rentable : « ajoutez vos formations pour apparaître dans les résultats de recherche des candidats ».

---

## 8. Ce qu'il ne faut pas faire

- Demander des informations sur l'organisme avant la création de compte
- Bloquer l'accès à l'onboarding sur la validation d'email
- Rendre un champ de qualification bloquant
- Ouvrir un champ libre pour les formations
- Perdre les données saisies quand le parcours est interrompu
- Afficher un pourcentage de complétude sans action associée
- Masquer l'absence d'agrément plutôt que de la signaler
- Confondre email du compte et email de contact public

---

## 9. Points ouverts

- **Définir le calcul du score de complétude.** Il se calcule sur les trois niveaux de la section 5 et pilote le tri du catalogue, l'échantillon d'accueil, le bloc organismes des pages formation et le seuil de `noindex`. Point ouvert dans sept documents — c'est ici qu'il se tranche.
- **Chiffrer le plafond de la présentation libre.**
- **Décider du traitement des demandes d'ajout de titre** : délai de réponse, critères d'arbitrage.
- **Cadrer la vérification a posteriori des agréments** : fréquence, action en cas d'écart.
- **Définir la séquence de relance** post-inscription : quand, par quel canal, sur quelle action.

---

## 10. Documents liés

- **Note de cadrage** — modèle d'inscription volontaire, go-to-market
- **Architecture des pages** — environnement Log, parcours d'inscription
- **Structure d'URL** — sous-domaine `partenaires.`
- **UX Landing organismes** — sas de conversion en amont
- **UX Fiche organisme** — ce que ce parcours alimente
- **UX Catalogue organismes** — filtres alimentés par les étapes 5 et 6
- **À produire** — dashboard, ma fiche, mes formations, paramètres
