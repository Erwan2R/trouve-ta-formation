# Trouve ta formation — Design System

Système de design extrait de la maquette de la page d'accueil « Sécurité privée en Île-de-France » du site **Trouve ta formation**, un annuaire indépendant d'organismes de formation. Le produit compare des organismes agréés par le CNAPS, titre par titre et département par département, sans commission ni classement payant.

Ce positionnement dicte tout le reste : le système doit avoir l'air d'un service d'information, pas d'une place de marché. D'où l'absence d'ombres, de gradients colorés, de badges promotionnels et de superlatifs.

## Sources

- `Accueil Securite Privee mix.dc.html` (racine du projet) — la maquette de référence, elle-même issue de la fusion de deux directions (v1 pour la structure et la typographie, v5 pour le traitement des blocs centrés et des pastilles).
- `Accueil Securite Privee.dc.html`, `Accueil Securite Privee v5.dc.html` — les deux directions d'origine, conservées pour arbitrage.
- `assets/logo-bicolore.png` — le seul asset de marque fourni.

Aucun codebase, dépôt Git ni fichier Figma n'a été fourni : toutes les valeurs de ce système sont relevées directement dans la maquette, sans arrondi.

---

## CONTENT FUNDAMENTALS

**Vouvoiement, toujours.** Le site s'adresse à un candidat qui cherche une information réglementaire : « Trouvez votre formation », « Vous ne savez pas quel titre correspond à votre situation ? ». Le « nous » n'apparaît que pour engager l'éditeur : « Nous ne sommes pas intermédiaires et ne revendons aucune coordonnée. »

**Des affirmations vérifiables, pas des promesses.** Chaque phrase de la maquette pose un fait ou une conséquence. « L'autorisation préalable conditionne l'entrée en formation. À demander avant de s'inscrire, pas après. » Jamais « Lancez-vous dans une carrière passionnante ». Aucune exclamation dans tout le corpus.

**L'incertitude est affichée.** Les durées réglementaires sont préfixées de « ~ » (« ~175 h », « ~14 à 21 h ») parce qu'elles varient. Les données non encore collectées restent en gabarit visible : « [N] organismes », « ~[X] h ». Une information manquante ne se maquille pas.

**Phrases courtes en tête, développement ensuite.** Les titres de cartes font deux à quatre mots (« Carte professionnelle », « Renouvellement de la carte ») ; la description qui suit tient en une ou deux phrases de 15 à 25 mots. Les paragraphes éditoriaux, eux, vont jusqu'à 60 mots et assument la longueur.

**Casse.** Capitale initiale uniquement, dans les titres comme dans les boutons (« Voir les organismes », pas « Voir Les Organismes »). Les seules capitales complètes sont les sur-titres mono (« CNAPS », « LES TITRES ») et les sigles du métier (TFP APS, SSIAP, MAC APS, CNAPS, OPCO, CPF).

**Typographie française respectée.** Espace insécable avant « : », « ? », « ! » et « ; » ; guillemets « … » ; tiret cadratin — pour les incises ; le point médian « · » sépare les listes courtes (« TFP APS · MAC APS · SSIAP 1 »).

**Aucun emoji, nulle part.** Aucune icône décorative non plus. Les seuls glyphes employés sont « → », « + » et « · ».

**Les FAQ sont écrites comme on les pose.** « Faut-il un diplôme pour entrer en formation ? », « Un casier judiciaire empêche-t-il de travailler dans la sécurité privée ? » — et la réponse commence par le verdict (« Non. », « Pas systématiquement. ») avant de l'expliquer.

---

## VISUAL FOUNDATIONS

**Palette.** Un fond crème chaud (`#F7F5F1`), du blanc pour les surfaces qui portent du contenu, six niveaux de gris chaud pour l'encre, et **un seul accent** : la brique `#A83B2A`. La brique ne remplit jamais une grande surface : elle marque un numéro, un sur-titre, un filet de 30px, une pastille de 36px, un soulignement de lien. Quand elle doit vivre sur du noir, elle s'éclaircit en `#E19D8B`. Aucune couleur sémantique (succès, alerte) n'existe : la maquette n'en contient pas.

**Typographie.** Deux familles, pas de troisième. **Plus Jakarta Sans** (400 à 800) pour tout le texte ; **IBM Plex Mono** (400, 500) pour les sur-titres, numéros, durées, compteurs et dates. Les titres sont fluides en `clamp()` avec un interlettrage négatif qui se resserre à mesure que la taille monte (−0,03em en H1, −0,025em en H2, −0,01em en H3). Le corps éditorial est posé en 17px/1,75 ; les textes de carte en 14,5px/1,65. Les titres portent `max-width: 22ch` et `text-wrap: balance` : ils sont volontairement forcés sur deux lignes.

**Pas d'ombre — des filets.** La séparation se fait au filet 1px `#E7E3DD`. Une carte est un rectangle blanc, un rayon de 18px et un filet. Une section change de fond et se borde de filets. **Une seule ombre existe dans tout le système** : `0 24px 60px -24px rgba(11,11,11,0.22)` sous le méga-menu du header, parce qu'il flotte au-dessus du contenu.

**Rayons.** Ils croissent avec la surface : 12px pour une vignette de 52px, 14px pour une option de questionnaire, 16px pour un emplacement d'image, 18px pour une carte, 20px pour un panneau blanc dans un bloc noir, 22px pour un bandeau, 26px pour le grand bloc noir, et 999px pour tout ce qui est pilule (boutons, chips, pastilles de durée, nav).

**Fonds et textures.** Deux fonds par page au maximum, en alternance crème / blanc. Deux textures seulement : les **hachures diagonales à 135°** (`repeating-linear-gradient`, pas 7px) qui tiennent la place de toute image non fournie, et le **fond de rayons du hero** (halo blanc radial + rayons coniques à 5 % de noir) — réservé au hero et jamais réutilisé. Aucun gradient coloré nulle part.

**Imagerie.** Aucune photo n'est fournie. Tous les emplacements sont hachurés et **étiquetés en mono minuscule** décrivant ce qui doit y figurer : « photo — métiers de la sécurité privée », « carte interactive — île-de-france », « visuel article ». Les ratios sont typés : 16/10 pour un article, 16/7 pour une image éditoriale, 5/4 dans une carte, 21/8 pour la carte géographique. Quand les photos arriveront, elles devront être documentaires, en lumière neutre, sans grain ni filtre.

**Survols.** Une carte cliquable passe son filet au noir et se lève de 2px (`translateY(-2px)`). Un bouton noir passe en brique. Un lien de nav prend le fond crème chaud. Une option de questionnaire passe son filet en brique et son fond en brique 050. Un lien de texte passe de brique à noir. Transition unique : 140ms ease. **Aucun état d'appui, aucun changement d'échelle, aucune animation d'entrée** — la maquette n'en contient pas, et en ajouter trahirait la sobriété du système.

**Layout.** Conteneur de 1240px avec une gouttière fixe de 28px ; 900px pour le hero, 880px pour la FAQ. Rythme vertical de 88px par section. Écart de 14px entre cartes, 32px entre familles de cartes. Le header est collant avec un fond translucide `rgba(247,245,241,0.88)` et un `backdrop-filter: blur(12px)` — le seul flou du système. Le sommaire éditorial est collant à 96px.

**Grilles.** Deux régimes distincts, et le choix n'est pas cosmétique. Les grilles de titres de formation sont **fixes** (`repeat(3, minmax(0,1fr))`, `repeat(4, …)`) pour que chaque famille tienne sur une ligne. Tout le reste est en `repeat(auto-fit, minmax(Npx, 1fr))`, avec un N qui dit la densité voulue : 240 pour des règles, 260 pour des étapes, 290 pour des cartes d'information.

**Le noir.** Il isole, il ne décore pas. Trois emplois seulement : le bloc du questionnaire, le panneau de prise de position, le pied de page. Sur noir, le texte est blanc ou `#D0CAC5`, les sur-titres passent en brique 400, et les filets en `#2A2626`.

**Transparence et flou.** Une seule occurrence de chaque : le fond du header. Partout ailleurs, les couleurs sont pleines — jamais de texte en `opacity` réduite ni en `color-mix`.

---

## ICONOGRAPHY

**Il n'y a pas d'iconographie.** C'est un choix du système, pas une lacune : la maquette n'utilise aucune icône, aucun jeu d'icônes, aucune police d'icônes, aucun SVG décoratif.

Les seuls glyphes employés sont des caractères typographiques :

- **→** (U+2192) après un lien de continuation (« Voir toutes les démarches CNAPS → ») et à droite d'une option de questionnaire.
- **+** (signe plus, en brique) comme marqueur de FAQ. Pas de chevron, pas de rotation à l'ouverture.
- **·** (point médian) comme séparateur de listes courtes.
- **▼ / ▲** dans le bouton du méga-menu.

Les repères visuels sont assurés autrement : numéros mono à deux chiffres (« 01 »), pastilles rondes brique de 36px, pastilles blanches cerclées de 42px, filet brique de 30px, filet noir de 2px en tête de règle. Si une icône devenait indispensable, prendre Lucide (trait 1,5px, arrondi) — c'est le jeu le plus proche de cette sobriété — et le signaler comme un ajout au système.

**Logo.** `assets/logo-bicolore.png` est le seul asset fourni. Il s'affiche à 27px de haut dans le header, 30px dans le pied de page, et s'inverse en blanc sur fond noir via `filter: brightness(0) invert(1)`. Aucune déclinaison vectorielle, aucun favicon, aucune version monochrome n'a été fournie.

---

## Index

| Fichier | Contenu |
|---|---|
| `styles.css` | Point d'entrée CSS — uniquement des `@import` |
| `tokens/fonts.css` | Import Google Fonts + familles |
| `tokens/colors.css` | Palette et alias sémantiques |
| `tokens/typography.css` | Échelle de type, interlettrages, mesures de lecture |
| `tokens/spacing.css` | Espacements, conteneurs, rythme |
| `tokens/radius.css` | Rayons |
| `tokens/effects.css` | Ombre unique, hachures, fond du hero, flou du header |
| `tokens/base.css` | Reset et styles de lien |
| `guidelines/*.html` | 17 fiches de fondations (Colors, Type, Spacing, Brand) |
| `ui_kits/site/` | Recréation de la page d'accueil du secteur |
| `assets/logo-bicolore.png` | Logo |
| `SKILL.md` | Enveloppe Agent Skill |

### Composants

**core** — `Button`, `LinkArrow`, `Badge`, `Pill`, `MonoLabel`
**content** — `SectionHeading`, `MediaPlaceholder`, `CalloutQuote`, `Statement`, `Accordion`, `PageNav`
**cards** — `TitleCard`, `StepCard`, `InfoCard`, `ArticleCard`, `OrganismeCard`, `ChoiceOption`, `RuleItem`
**layout** — `Section`, `Hero`, `SiteHeader`, `SiteFooter`, `DarkPanel`, `CtaBanner`

Chaque composant a un `.d.ts` (contrat de props) et un `.prompt.md` (quand l'employer). Chaque dossier a une fiche de prévisualisation.

### Ajouts assumés

- `Section`, `Hero`, `PageNav`, `MonoLabel` n'existent pas comme « composants » dans la maquette : ce sont des motifs répétés à l'identique dans douze blocs, extraits pour éviter de recopier le même rythme vertical et le même en-tête à chaque page.
- `StepCard` fusionne deux traitements de la maquette (pastille brique pleine dans les démarches CNAPS, pastille blanche cerclée dans « comment ça marche ») sous un même `variant`, parce que la sémantique — une séquence ordonnée — est la même.

Aucun autre composant n'a été inventé. Pas de Toast, d'Avatar, de Tabs, de Tooltip : la maquette n'en contient pas.

### Manques connus

- **Aucun fichier de police fourni.** Plus Jakarta Sans et IBM Plex Mono sont chargées depuis Google Fonts. Si la marque possède des fichiers sous licence, les déposer dans `assets/fonts/` et remplacer l'`@import` de `tokens/fonts.css` par des `@font-face`.
- **Aucune photo.** Tous les visuels sont des emplacements hachurés.
- **Un seul écran.** La page d'accueil de secteur. Les pages de titre, de département, de fiche d'organisme, le catalogue et l'espace organisme sont liés mais non maquettés.
- **Logo en PNG uniquement**, sans version vectorielle.
