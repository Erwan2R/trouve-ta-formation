# Spécification UX — Landing page organismes

**Trouve ta formation — Verticale sécurité privée**
`trouve-ta-formation.fr/securite-privee/referencer-mon-organisme/`
Version 1.0 — 30 août 2026

---

## 1. Rôle de la page

Sas de conversion entre l'email de prise de contact et l'inscription. Une seule fonction : **transformer un dirigeant d'organisme sollicité par email en compte créé.**

La page argumente, `partenaires.trouve-ta-formation.fr` transforme. Le CTA pointe vers l'inscription, jamais vers un formulaire de contact : le parcours doit rester self-service.

### Le changement de logique par rapport aux autres pages

C'est la première page du projet où **le SEO n'est pas le critère principal**. Le trafic vient de l'email de prospection, pas de Google — le volume de recherche sur « référencer mon organisme de formation » est marginal.

Conséquences directes :

- Le maillage interne n'a pas d'importance ici.
- La profondeur sémantique non plus.
- Une page courte qui convertit vaut mieux qu'une page longue qui couvre du champ lexical.
- La page reste indexable, mais c'est un bonus, pas un objectif.

Les règles appliquées à l'accueil et au catalogue ne s'appliquent donc pas à cette page. C'est volontaire.

---

## 2. Emplacement de la page

| Emplacement | Verdict |
|---|---|
| `partenaires.trouve-ta-formation.fr` | Écarté. Le sous-domaine n'a aucune autorité et ne rankera sur rien. Il porte la connexion et l'inscription, pas l'argumentaire. |
| `trouve-ta-formation.fr/referencer-mon-organisme/` | Écarté. Transverse, alors que l'argumentaire est spécifique au secteur au lancement. |
| **`/securite-privee/referencer-mon-organisme/`** | **Retenu.** Dans le silo, donc bénéficie de son autorité. Cohérent avec le cloisonnement : une landing par verticale à l'ouverture de la deuxième. |

---

## 3. Ordre des blocs

| # | Bloc | Fonction dominante |
|---|---|---|
| 1 | Header allégé | Focalisation |
| 2 | Hero | Proposition de valeur |
| 3 | Ce que le candidat cherche | **Poser le problème** |
| 4 | Aperçu de la fiche | **Montrer le produit** |
| 5 | Ce que vous obtenez | Bénéfices |
| 6 | Honnêteté sur le lancement | Crédibilité |
| 7 | Comment ça marche | Levée de friction |
| 8 | Pourquoi c'est gratuit | Levée de suspicion |
| 9 | FAQ B2B | Levée d'objections |
| 10 | CTA final | Conversion |
| 11 | Footer minimal | Sortie |

---

## 4. Détail des blocs

### 1. Header allégé

**Contenu** — logo, un lien « J'ai déjà un compte », rien d'autre.

**Pourquoi pas la navigation du silo** — un dirigeant d'organisme qui arrive ici ne doit pas voir « Trouver ma formation » ou « Les démarches CNAPS ». Ces liens le renvoient vers l'univers candidat et le font sortir du parcours. Toute landing de conversion réduit sa navigation au minimum.

---

### 2. Hero

**Contenu** — proposition de valeur, CTA primaire vers l'inscription, et **la mention de gratuité visible immédiatement**.

**Pourquoi la gratuité si haut** — c'est la première objection. Un dirigeant qui reçoit un email d'annuaire suppose qu'on va lui vendre quelque chose. Si le mot « gratuit » n'est pas au-dessus de la ligne de flottaison, il ferme la page.

**CTA** — pointe vers l'inscription sur `partenaires.`, jamais vers un formulaire de contact. Ajouter une étape humaine dans un parcours self-service divise la conversion.

---

### 3. Ce que le candidat cherche

**Contenu** — le constat avant la solution : ce que les gens tapent, comment ils choisissent leur centre, pourquoi un organisme invisible en ligne perd des inscriptions.

**Pourquoi si haut, contrairement à la page candidat** — sur une landing B2B, poser le problème avant la solution est ce qui rend la solution désirable. Un dirigeant de centre n'a pas nécessairement conscience qu'il a un problème de visibilité. Sur la page candidat, l'utilisateur connaît son problème ; ici, il faut le lui montrer.

---

### 4. Aperçu de la fiche

> **Bloc le plus important de la page.**

**Contenu** — un visuel annoté d'une fiche organisme complète.

**Pourquoi** — montrer le produit vaut mieux que le décrire. C'est aussi ce qui donne envie de remplir : le dirigeant voit ce que sa fiche *pourrait* être, pas ce qu'elle sera par défaut. L'écart entre les deux est le moteur de la complétion.

---

### 5. Ce que vous obtenez

**Contenu** — une fiche organisme, la déclaration des formations dispensées, l'apparition dans les filtres du catalogue, les coordonnées visibles, les lieux de formation, la modification à tout moment.

**Règle de rédaction** — en bénéfices, pas en fonctionnalités. Et sans surpromettre sur le trafic : voir le bloc suivant.

---

### 6. Honnêteté sur le lancement

**Contenu** — annuaire en construction, référencement gratuit, position d'antériorité pour les organismes qui s'inscrivent tôt.

**Pourquoi ce bloc existe** — c'est celui que la plupart des annuaires omettent, et c'est celui qui fait la différence au démarrage. Sans audience à montrer, trois options : mentir, taire, ou assumer. Un dirigeant préfère un discours cadré à des chiffres qu'il sent gonflés — et il les sent.

**Conditionnement au seuil** — tant que le seuil n'est pas atteint, aucun compteur d'organismes inscrits n'est affiché. « 4 organismes nous font déjà confiance » est contre-productif. Même paramètre de configuration que l'accueil et le catalogue.

---

### 7. Comment ça marche

**Contenu** — trois étapes, avec la durée annoncée.

**Pourquoi annoncer la durée** — « cinq minutes » est une information de conversion, pas du remplissage.

**Point à préciser explicitement** — l'ajout des formations n'est pas bloquant. C'est ce qui abaisse la barrière d'entrée à l'inscription. La relance vers cette étape se fait ensuite depuis le dashboard de l'espace organisme.

---

### 8. Pourquoi c'est gratuit

**Contenu** — construction de l'audience et de la base d'organismes, monétisation ultérieure sur des fonctionnalités optionnelles.

**Pourquoi ce bloc n'est pas sautable** — la gratuité sans explication crée de la suspicion, particulièrement auprès d'un public qui reçoit beaucoup de sollicitations commerciales. Le dire vaut mieux que le laisser deviner.

---

### 9. FAQ B2B

**Contenu** — les objections réelles, pas des questions de confort :

- Est-ce que je vais être démarché commercialement ?
- Est-ce que vous revendez mes coordonnées ?
- Puis-je supprimer ma fiche ?
- Comment gagnez-vous de l'argent ?
- **D'où vient mon adresse email ?**

**Sur la dernière question** — elle n'est pas optionnelle. La prospection part d'un fichier constitué par scraping : la question sera posée, et la réponse a une portée juridique. Sous RGPD, la prospection B2B par email est possible sur base d'intérêt légitime lorsque l'objet est en rapport avec la fonction du destinataire, à condition de pouvoir indiquer l'origine des données et d'offrir une opposition simple. Traiter le sujet frontalement sur la page coûte moins cher que d'y répondre individuellement à chaque email.

---

### 10. CTA final

**Contenu** — répétition du CTA du hero.

**Pourquoi** — une landing longue doit refermer. Le lecteur arrivé en bas a lu l'argumentaire ; ne pas lui redonner le chemin est une perte sèche.

---

### 11. Footer minimal

**Contenu** — mentions légales, contact, politique de confidentialité.

**Pas le footer du silo** — celui-ci est un footer de maillage candidat, sans utilité ici, et il rouvre des chemins de sortie vers l'univers candidat.

---

## 5. Trafic et mesure

### Origine du trafic

Le canal principal est l'email de prise de contact. La page reçoit également un trafic secondaire depuis :

- le bandeau B2B en bas de l'accueil
- le bloc « votre organisme n'est pas référencé ? » du catalogue

**Ce trafic candidat parasite est accepté.** Le coût est nul et le bandeau de l'accueil capte le dirigeant qui a parcouru toute la page, donc le plus qualifié.

### Tracking

Paramètre UTM dans l'email de prospection, permettant d'identifier quel objet, quelle formulation et quelle vague convertissent. C'est la seule mesure du go-to-market principal.

**À mettre en place au lancement des campagnes de prospection**, avant l'envoi du premier email.

---

## 6. Ce qu'il ne faut pas mettre

- Un formulaire de contact à la place du CTA d'inscription — une étape humaine dans un parcours self-service
- La navigation complète du silo
- Des logos clients ou des témoignages au lancement, a fortiori inventés
- Un comparatif avec des concurrents
- Une grille tarifaire, même présentée comme « à venir »
- Un compteur d'organismes inscrits sous le seuil
- Le contenu candidat du silo, dupliqué ici

---

## 7. Règles techniques

- Rendu côté serveur.
- Un seul H1.
- Page indexable, mais sans effort d'optimisation particulier — ce n'est pas son canal.
- Le CTA pointe vers `partenaires.trouve-ta-formation.fr` (inscription).
- Visuel de la fiche en WebP, dimensions explicites.

---

## 8. Points ouverts

- **Chiffrer le seuil d'affichage du compteur** — commun à toutes les pages du silo, piloté par un seul paramètre de configuration.
- **Rédiger la réponse sur l'origine des données** — à cadrer avec la politique de confidentialité et le registre de traitement.
- **Décliner la landing par verticale** à l'ouverture de la deuxième verticale, plutôt que de la rendre transverse.

---

## 9. Documents liés

- **Note de cadrage** — concept, modèle économique, go-to-market
- **Architecture des pages** — inventaire des pages et de leurs rôles
- **Structure d'URL** — nommage, arborescence, règles d'indexation
- **UX Page d'accueil** — tête de silo
- **UX Catalogue organismes** — page canonique du catalogue
- **À produire** — spécification UX de la fiche organisme et de la page pilier
