# Copy — Blog, 404 et racine du domaine

**Trouve ta formation — Verticale sécurité privée**
`/securite-privee/blog/` · pages d'erreur · `trouve-ta-formation.fr/`
Version 1.0 — 1er septembre 2026
Environnement : **Not Log**

---

## 0. Pourquoi ces trois objets dans un même document

Ils n'ont rien en commun sur le fond, mais ils partagent une caractéristique : **aucun des trois n'est une page de conversion, et chacun est régulièrement traité comme s'il en était une.**

Le blog devient un aspirateur à trafic qui cannibalise le silo. La 404 devient une page de marque avec illustration et message d'humour. La racine devient une page d'accueil corporate optimisée sur des requêtes génériques. Les trois erreurs coûtent cher et se ressemblent : elles consistent à donner à la page un rôle qu'elle ne peut pas tenir.

La copy de ces trois objets est donc écrite en retenue.

---

# Partie 1 — Le blog

## 1. Les catégories

> Quatre au maximum au lancement, pour dix articles. C'est un point ouvert de la spécification, voici ma proposition.

| Catégorie | Ce qu'elle contient | Territoire |
|---|---|---|
| **Le métier** | Salaire, quotidien, conditions de travail, évolution de carrière | Métier |
| **Se former** | Financements, reconversion, choisir un centre, réussir sa formation | Périphérique |
| **Conditions d'accès** | Casier judiciaire, nationalité, aptitude physique, niveau de français | Longue traîne |
| **Actualités** | Évolutions réglementaires, changements de plateforme, nouvelles règles | Actualité datée |

**Pourquoi celles-là** — chacune correspond à un des trois territoires légitimes définis par la spécification, avec « Se former » et « Conditions d'accès » qui se partagent la longue traîne périphérique. Aucune ne peut accueillir un article sur un titre du référentiel ou une procédure CNAPS : la structure elle-même écarte la cannibalisation.

**Le piège à éviter** — une catégorie « Formations ». Elle appellerait mécaniquement des articles sur les titres, c'est-à-dire exactement ce que la règle interdit. Le nom d'une catégorie est une invitation à écrire dedans.

**Ordre d'affichage** — Le métier, Se former, Conditions d'accès, Actualités. Les trois premières sont permanentes, la dernière est datée : la placer en fin évite qu'un blog sans actualité récente paraisse à l'abandon.

---

## 2. Page liste — métadonnées

| Champ | Valeur |
|---|---|
| `<title>` | Le blog de la sécurité privée : métier, formation et réglementation |
| Meta description | Salaires, conditions d'accès, financements, évolutions réglementaires : nos articles sur les métiers de la sécurité privée et l'accès à la formation. |

**Ce que le title ne fait pas** — il ne cible pas « formation sécurité privée », qui appartient à l'accueil. Une page liste de blog qui se bat sur la requête principale du silo est une page qui se bat contre sa propre tête de silo.

---

## 3. Page liste — les blocs

### Bloc 2 — En-tête et chapô

**H1**

> **Le blog de la sécurité privée**

*Variantes écartées* — « Actualités et conseils » (fourre-tout, aucun signal thématique) · « Nos articles » (le possessif n'apporte rien).

**Chapô — 95 mots**

> Les métiers de la sécurité privée s'apprennent en formation, mais tout ne s'y explique pas. Combien gagne un agent en Île-de-France, ce que change réellement un casier judiciaire, comment financer sa formation quand on est en reconversion, ce que modifie une évolution réglementaire pour ceux qui exercent déjà.
>
> Ces articles traitent ce qui entoure la formation : le métier lui-même, les conditions d'accès et l'actualité du secteur. Le détail des titres et des démarches administratives est ailleurs sur le site, sur les pages qui leur sont consacrées.

**Ce que fait la dernière phrase** — elle dit au lecteur où trouver le reste, et elle pose la frontière éditoriale à la vue de tous. C'est aussi un rappel utile pour quiconque écrira un article plus tard : la règle est affichée sur la page, pas seulement dans une spécification.

### Bloc 3 — Filtres par catégorie

| Élément | Libellé |
|---|---|
| Option par défaut | **Tous les articles** |
| Options | Les quatre catégories, libellés exacts |

Liens texte, filtrage côté client, aucune URL indexable.

### Bloc 4 — Article mis en avant

**Aucun libellé de bloc.** Le format visuel signale la mise en avant ; un intertitre « À la une » ajoute du texte sans information.

**Sur le choix de l'article** — le bloc permet de pousser l'article le plus stratégique, pas le plus récent. Au lancement, c'est celui qui traite le sujet le moins couvert par la concurrence, pas celui qui vise le plus gros volume.

### Bloc 5 — Listing

**Titre de bloc** — aucun si le filtre est sur « Tous les articles ». Sinon, le nom de la catégorie sélectionnée.

**Contenu de carte** — Catégorie · Titre · Extrait de 20 mots maximum · Date · Temps de lecture.

**Sur l'extrait** — rédigé, jamais les premiers mots de l'article. La règle d'ouverture veut que l'article commence par répondre à la question du titre ; reprendre ce début en extrait afficherait la réponse avant le clic.

**Format du temps de lecture** — **4 min de lecture**. Le mot « lecture » est nécessaire : « 4 min » seul est ambigu.

### Bloc 7 — Maillage vers les pages structurantes

**Titre de bloc**

> **Aller plus loin**

**Deux colonnes**

> **Les formations** — les titres de la phase 1, publiés uniquement
> **Les démarches** — autorisation préalable, carte professionnelle, renouvellement

---

## 4. Page article — métadonnées

### Gabarits

| Champ | Règle |
|---|---|
| `<title>` | Le titre de l'article, sans suffixe de marque. Si le H1 dépasse 60 caractères, une version courte est saisie séparément. |
| Meta description | Rédigée article par article, jamais générée depuis le chapô. |

**Sur l'absence de suffixe de marque** — sur un blog sans notoriété, « | Trouve ta formation » consomme 22 caractères pour un signal nul. À réintroduire quand le nom sera recherché.

---

## 5. Page article — les blocs

### Bloc 2 — En-tête

| Élément | Format |
|---|---|
| Catégorie | **Le métier** — lien vers la liste filtrée |
| H1 | Titre de l'article |
| Dates | **Publié le [date]** · **Mis à jour le [date]** |
| Date de vérification | **Informations vérifiées le [date]** — articles réglementaires uniquement |
| Temps de lecture | **6 min de lecture** |

**Sur la date de vérification** — distincte de la mise à jour, et affichée uniquement sur les articles portant des données réglementaires. Une date de vérification sur un article de salaire n'a pas de sens et dilue le signal là où il compte.

**Règle** — la date de mise à jour ne s'affiche que si elle diffère de la date de publication. Afficher les deux dates identiques donne l'impression d'un article jamais révisé, ce qui est vrai mais inutilement souligné le jour de la publication.

### Bloc 3 — Encadré de synthèse

**Libellé**

> **L'essentiel**

*Variantes écartées* — « En résumé » (annonce un résumé, donc autorise à ne pas lire) · « Ce qu'il faut savoir » (long, et prétentieux sur un sujet où le lecteur en sait parfois plus que nous).

**Format** — trois ou quatre puces, une ligne chacune, faits uniquement. Aucune puce ne commence par un verbe à l'impératif : c'est une synthèse, pas un conseil.

**Articles de plus de 1000 mots uniquement.**

### Bloc 4 — Table des matières

**Libellé**

> **Dans cet article**

*Plus court que « Sommaire » et « Table des matières », et moins scolaire.*

### Bloc 5 — Corps

**La règle d'ouverture, en pratique.** Les deux ou trois premières phrases répondent à la question du titre, sans préambule.

| À faire | À ne pas faire |
|---|---|
| « Un agent de sécurité débutant en Île-de-France gagne environ [X] euros nets par mois. Ce montant varie selon les majorations de nuit, de dimanche et de jours fériés, qui peuvent représenter une part importante du salaire réel. » | « Le métier d'agent de sécurité attire de nombreux candidats chaque année. Mais quelle rémunération peut-on réellement en attendre ? C'est ce que nous allons voir. » |

Le second exemple est la forme la plus répandue sur ce secteur, et c'est précisément ce qui laisse la place.

### Libellés des call-outs

| Type | Libellé |
|---|---|
| Point de vigilance | **À savoir** |
| Chiffre clé | *Pas de libellé — le chiffre est le libellé* |
| Renvoi contextuel | **Sur le même sujet** |

**Sur « À savoir » plutôt que « Attention »** — le second est alarmiste et s'use vite quand il apparaît deux fois par article. Le premier informe sans dramatiser.

**Deux ou trois call-outs maximum.** Quand tout est mis en avant, rien ne l'est.

### Bloc 6 — À retenir

**Libellé**

> **À retenir**

Trois points, une ligne chacun. Ils ne répètent pas l'encadré de synthèse : celui-ci ouvre sur des faits, celui-là ferme sur des conséquences pratiques.

**Test** — si les trois points de clôture pourraient être copiés-collés dans l'encadré d'ouverture, l'un des deux blocs est inutile sur cet article.

### Bloc 7 — Bloc auteur

**Structure**

> **[Prénom Nom]**
> [Une ligne de qualification]
> [Deux phrases de biographie, maximum]

**Point ouvert important** — l'auteur n'est pas identifié, et c'est un vrai sujet. Ce bloc est le seul endroit du site où une expertise nommée peut être posée, et sur un secteur réglementé c'est un signal de fiabilité réel.

**Trois options, par ordre de solidité :**

| Option | Verdict |
|---|---|
| Un professionnel du secteur, nommé, avec sa qualification réelle | **La meilleure** — un ancien agent, un formateur, un responsable d'exploitation. Le signal est authentique et vérifiable. |
| Erwan, nommé, avec une ligne honnête sur son rôle | **Acceptable** — « Fondateur de Trouve ta formation. Je documente le secteur de la sécurité privée à partir des textes officiels et des retours des organismes référencés. » |
| Un auteur générique du type « La rédaction » | **À éviter** — aucun signal, et le balisage `Person` devient vide de sens |

**Ce qu'il ne faut pas faire** — inventer une identité, une photo ou des états de service. C'est un signal négatif si c'est découvert, et sur un secteur où les professionnels se connaissent, ça se découvre.

**Recommandation** — la deuxième option au lancement, avec bascule vers la première dès qu'un contributeur du métier est disponible. Une ligne honnête sur un rôle réel vaut mieux qu'une expertise empruntée.

### Bloc 8 — Accroche formation contextuelle

**Contextuelle, jamais générique.** Un bloc identique sur les dix articles ne convertit pas et n'apporte aucun maillage utile.

**Gabarit**

> **[Question ou situation liée au sujet de l'article]**
> [Une phrase orientant vers la page structurante concernée.]
> **[Ancre descriptive] →**

**Exemples par territoire**

| Sujet de l'article | Accroche |
|---|---|
| Salaire d'un agent | **Vous voulez entrer dans le métier ?** Le TFP APS est le titre qui ouvre le plus grand nombre de postes en surveillance. **Tout savoir sur le TFP APS →** |
| Casier judiciaire | **Vérifiez votre situation avant de vous inscrire.** L'autorisation préalable du CNAPS est la démarche qui tranche cette question, et elle se demande avant l'entrée en formation. **Voir la démarche →** |
| Renouvellement de carte | **Votre carte arrive à échéance ?** Le stage de maintien des compétences doit être suivi avant le dépôt de votre demande. **Voir les délais de renouvellement →** |
| Financement de la formation | **Trouvez un centre qui accepte votre financement.** Les organismes référencés indiquent les financements qu'ils acceptent. **Voir les organismes d'Île-de-France →** |

### Bloc 9 — Articles liés

**Libellé**

> **À lire aussi**

Trois articles, même catégorie ou même thème.

---

## 6. L'audit de cannibalisation — grille de décision

> Chantier bloquant avant publication, sur les dix articles existants. La spécification pose les trois questions ; voici la grille de décision et la copy des cas de figure.

### La grille

| Constat | Décision |
|---|---|
| L'article traite un titre du référentiel | Réécriture sous angle métier, ou fusion dans la page pilier et abandon |
| L'article traite une procédure CNAPS | Fusion dans la page démarche et abandon. La réécriture est rarement possible : une procédure n'a pas d'angle métier. |
| L'article recoupe partiellement une page structurante | Réécriture avec suppression de la partie recoupée, et remplacement par un lien |
| L'article ne renvoie vers aucune page structurante | Ajout du maillage contextuel avant publication |
| L'article est propre et maillé | Publication |

### Le cas le plus probable, et comment le traiter

Un article du type « Comment devenir agent de sécurité » recoupe frontalement la page TFP APS.

**La réécriture sous angle métier consiste à changer la question à laquelle l'article répond.** « Comment devenir agent de sécurité » devient « Le quotidien d'un agent de sécurité : horaires, missions, conditions de travail ». Le premier appelle un parcours de certification, qui appartient à la page pilier. Le second appelle un témoignage de terrain, que la page pilier n'a pas vocation à porter.

**Test de séparation** — si l'article réécrit et la page pilier peuvent coexister sans qu'un lecteur ait l'impression de lire deux fois la même chose, la réécriture est réussie.

### La contrainte de séquencement

**Publier les pages piliers de la phase 1 avant ou en même temps que les articles concernés.** Si les articles sortent d'abord, ils s'indexent sur des requêtes de titre, et la page pilier devra ensuite les déloger sur son propre site.

**Conséquence pratique sur le calendrier** — les dix articles ne peuvent pas partir au lancement si les pages piliers ne sont pas prêtes. Les articles sans recoupement peuvent partir ; les autres attendent. L'audit doit donc produire deux lots, pas seulement des décisions.

---

## 7. Angles à privilégier

> La spécification note que le levier le plus rentable n'est pas dans la mise en forme mais dans le choix du sujet. Voici les angles réellement disponibles.

| Angle | Pourquoi il est disponible |
|---|---|
| **Les cas de refus de carte professionnelle** | Le CNAPS publie sa jurisprudence et son recueil de décisions. Personne ne les exploite éditorialement. C'est la ressource la plus sous-utilisée du secteur. |
| **L'écart entre grille salariale et salaire réel** | Les majorations de nuit, de dimanche et de jours fériés font l'essentiel de l'écart, et les sources institutionnelles ne le disent pas. |
| **La reconversion après quarante ans** | Public réel et important sur ce secteur, quasi absent du contenu existant. |
| **Ce qui a changé avec Dracar Ultimate** | Sujet d'actualité datée. La plupart des sites du secteur décrivent encore l'ancien système : fenêtre de fraîcheur ouverte maintenant, fermée dans un an. |
| **La spécialité « surveillance de grands événements »** | Annoncée fin juillet 2026, presque pas couverte. Même logique de fenêtre. |

**Les deux derniers sont des articles d'actualité**, donc périssables, et c'est précisément leur intérêt : ils appartiennent au blog et ne peuvent pas vivre sur une page permanente.

---

# Partie 2 — La page 404

## 8. Copy

### H1

> **Cette page n'existe pas**

**Variantes écartées** — « Oups, page introuvable » (l'humour sur une erreur agace) · « Erreur 404 » (jargon technique en H1) · « Page non trouvée » (formulation de machine).

### Phrase d'explication

> La page que vous cherchez a peut-être été déplacée, ou son adresse comporte une erreur.

**Une ligne, pas deux.** Aucune excuse, aucun ton badin, aucune illustration.

### Sorties — gabarit silo

> **Les formations les plus recherchées**
> TFP APS · MAC APS · SSIAP 1 · SSIAP 2 · SSIAP 3
>
> **Les démarches CNAPS**
> Autorisation préalable · Carte professionnelle · Renouvellement
>
> **Chercher un organisme**
> Voir tous les organismes d'Île-de-France · Chercher par département

### Sorties — gabarit racine

> **Choisissez un secteur**
> Sécurité privée

**Pourquoi deux gabarits** — le cloisonnement entre verticales s'applique à la page d'erreur comme au reste. Une 404 dans le silo ne propose pas de sortir du silo.

### Ce que la page ne contient pas

- Pas de barre de recherche — il n'y a pas de moteur global au lancement, et une recherche vide aggrave la situation
- Pas d'illustration — la page doit se charger instantanément
- Pas de redirection automatique — elle casse le retour arrière et empêche de comprendre
- Pas de code d'erreur en gros caractères

**Sur le ton** — la tentation de la 404 amusante est forte et elle est mauvaise ici. Le visiteur de cette page cherche une information réglementaire pour un projet professionnel. Une blague à ce moment-là dit que nous ne prenons pas son problème au sérieux.

---

## 9. Les 404 comme donnée de pilotage

Les URLs demandées et non trouvées indiquent quoi construire. `/securite-privee/montreuil/` demandée régulièrement est le signal qu'une page ville mérite d'exister — le même type de signal que les recherches infructueuses du catalogue.

**Trois sources à croiser** — logs serveur, rapport de couverture Search Console, et le champ de recherche par nom du catalogue.

**À mettre en place dès le lancement**, faute de quoi le signal des premiers mois est perdu et ne se rattrape pas.

---

# Partie 3 — La racine du domaine

## 10. Copy

> `trouve-ta-formation.fr/` est un point de passage, pas une destination. La copy tient en cinq lignes, et c'est volontaire.

### Métadonnées

| Champ | Valeur |
|---|---|
| `<title>` | Trouve ta formation — l'annuaire des organismes de formation |
| Meta description | Trouve ta formation référence les organismes de formation secteur par secteur. Première verticale ouverte : la sécurité privée en Île-de-France. |

**Aucun effort d'optimisation au-delà.** Aucune chance de se positionner sur « formation » seul, aucun intérêt à essayer.

### H1

> **Trouve ta formation**

Le nom du site. C'est le seul endroit où il est légitime en H1.

### Phrase de positionnement

> L'annuaire des organismes de formation, secteur par secteur.

**Variantes** — « Trouvez l'organisme de formation qui correspond à votre projet » (orientée bénéfice, mais promet une expérience que cette page ne rend pas) · « Des annuaires spécialisés, secteur par secteur » (plus exact sur l'architecture, moins clair pour un visiteur).

### Sélecteur de verticales

> **Sécurité privée**
> Organismes de formation en Île-de-France : TFP APS, SSIAP, spécialités.
> **Voir les formations en sécurité privée →**

### Ligne sur les verticales à venir

> D'autres secteurs ouvriront progressivement.

**Une phrase, sans liste, sans date, sans formulaire d'alerte.** Elle justifie qu'un sélecteur ne contienne qu'une entrée. Annoncer des secteurs précis créerait une attente et daterait la page si le calendrier bouge.

### Lien espace organisme

> Vous dirigez un organisme de formation ? **Référencez-vous gratuitement →**

*Une ligne, en pied de contenu. Cette page reçoit peu de trafic, mais celui qu'elle reçoit est plus probablement professionnel qu'ailleurs.*

### Footer

Footer minimal, identique à celui de la landing B2B : mentions légales, politique de confidentialité, contact.

**Pas le footer du silo.** Les quatre colonnes de maillage sécurité privée n'ont rien à faire à la racine du domaine, et elles briseraient le cloisonnement.

---

## 11. Points de vigilance transverses

| Point | Vérification |
|---|---|
| **Frontière blog / silo** | Aucun article ne traite un titre du référentiel ni une procédure CNAPS. La règle est affichée dans le chapô de la page liste, à la vue de tous. |
| **Accroche formation contextuelle** | Une par article, différente à chaque fois. Un bloc générique répété est le signal d'un maillage paresseux. |
| **Pas de `FAQPage` sur les articles** | Elle concurrencerait les pages structurantes sur les rich results. |
| **Séquencement de publication** | Pages piliers avant ou en même temps que les articles qui les recoupent. |
| **Vrai code HTTP 404** | Jamais une page d'erreur servie en 200. |
| **Cloisonnement sur la 404** | Deux gabarits, jamais un sélecteur de verticales dans le silo. |
| **Racine non optimisée** | Aucun contenu éditorial sur la formation en général. |
| **Titres archivés** | 301 vers le remplaçant s'il existe, 410 sinon. Jamais une 404. |

---

## 12. Points ouverts

- **Identifier l'auteur des articles** et rédiger sa ligne de qualification. Recommandation en section 5 : une identité réelle avec un rôle honnête, jamais une expertise empruntée.
- **Mener l'audit des dix articles** selon la grille de la section 6, en produisant deux lots : publiables au lancement, et suspendus aux pages piliers.
- **Valider les quatre catégories** proposées en section 1.
- **Définir la fréquence de publication** après le lancement. Sans cadence, le signal de fraîcheur s'éteint et le blog perd sa fonction principale.
- **Mettre en place le suivi des 404** dès le lancement.
- **Inscrire la révision des articles réglementaires** dans le même calendrier semestriel que les pages démarche.
- **Réévaluer la racine** à l'ouverture de la deuxième verticale.

---

## 13. Documents liés

- **UX Blog et articles** — structure, territoires légitimes, composants éditoriaux
- **UX 404 et racine du domaine** — règles techniques, cloisonnement, titres archivés
- **Référentiel des titres** — la frontière que les articles ne franchissent pas
- **Copy Pages démarches CNAPS** — l'autre frontière, et la source des angles d'actualité
- **Copy Page d'accueil** — footer global du silo
- **À produire** — copy des pages piliers, dont dépend le séquencement de publication du blog
