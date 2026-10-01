# Audit RGPD et légal — Trouve ta formation

> Sprint 11, étape 1. Audit réalisé le 1er octobre 2026 sur la branche `dev` (code, base de dev, site de dev en ligne).
> **Rien n'a été corrigé** : ce document constate et propose. Les corrections attendent les décisions d'Erwan.
> Destinataires : Erwan, et le juriste qui relira les textes. Les points marqués **[à vérifier]** reposent sur des
> informations publiques des prestataires qu'il faut confirmer dans leurs contrats.

---

## 0. Synthèse

**Bandeau cookies : pas nécessaire.** Le site public ne dépose aucun cookie ni aucune donnée dans le navigateur
(mesure faite page par page, section 2). Nos statistiques fonctionnent sans traceur : elles ne relèvent donc même pas
de l'article 82 de la loi Informatique et Libertés, et respectent de toute façon les conditions d'exemption de la CNIL
pour la mesure d'audience, à une condition près à poser (durée de conservation, section 2.3). Les seuls cookies sont
ceux de connexion aux espaces organisme et admin : strictement nécessaires, exemptés de consentement.

**Le reste est globalement sain** (pas de revente, pas de traceur publicitaire, données des candidats non collectées,
mots de passe et jetons hachés, base de données à Paris, double authentification admin). Mais plusieurs points doivent
être réglés avant le lancement, dont trois importants :

| # | Constat | Gravité | Qui décide |
|---|---|---|---|
| 1 | Les **fonctions serveur tournent aux États-Unis** (région Vercel `iad1`, Washington) : emails, mots de passe à la connexion, données des prospects transitent par les États-Unis, alors que la base est à Paris. | Élevée | Erwan (réglage Vercel de production) |
| 2 | **Prospection** : l'information obligatoire des personnes dont on a collecté les coordonnées sans les leur demander (article 14 du RGPD) n'est pas prévue dans le premier contact, et la durée de 3 ans annoncée dans la politique n'est pas appliquée (aucune date de dernier contact, aucune purge). | Élevée | Erwan + juriste |
| 3 | **Registre des traitements** inexistant (obligatoire). Proposé en section 3. | Moyenne | Erwan (validation) |
| 4 | Aucune **durée de conservation appliquée** : rien n'est purgé (comptes jamais validés, liens email, événements statistiques, prospects). | Moyenne | Erwan (durées) |
| 5 | **Inscription** : aucune mention d'information ni lien vers la politique de confidentialité au moment de la collecte. | Moyenne | Code |
| 6 | Lien **« Gestion des cookies »** du pied de page vers une page qui n'existe pas (404). | Faible | Code |
| 7 | Pas de **conditions d'utilisation** pour les organismes, qui publient pourtant du contenu sous leur responsabilité. | Moyenne | Erwan + juriste |
| 8 | Pas de **procédure écrite** de réponse aux demandes de droits ni de gestion d'une fuite de données (notification CNIL sous 72 h). | Moyenne | Erwan (validation) |
| 9 | **Supabase en offre gratuite** (dev et prod) : pas de sauvegarde garantie [à vérifier], journaux conservés un jour, mise en pause du projet après une semaine d'inactivité. Risque de disponibilité et d'intégrité (article 32). | Moyenne | Erwan (budget) |
| 10 | Cookie de session Supabase valable **400 jours** côté navigateur (valeur par défaut). La session admin est bien limitée à 8 h par l'application, mais le cookie organisme reste longtemps. | Faible | Code |

---

## 1. Périmètre et méthode

- **Code** : toutes les routes publiques, l'espace organisme (`partenaires.`), l'espace admin (`admin.`), les API.
- **Base de données** : schéma complet (migrations) et contenu de la base de dev.
- **Mesures réelles** : navigateur automatisé sur 11 pages (site public, landing, inscription avec anti-robots sur dev
  en ligne, connexion organisme et admin), relevé des cookies, du stockage local et des domaines tiers appelés.
- **Prestataires** : réglages lus par les API de Vercel et Supabase (régions, offres).
- **Référentiels** : RGPD (articles 5, 6, 13, 14, 28, 30, 32, 33), loi Informatique et Libertés (article 82),
  recommandations CNIL « cookies et autres traceurs » et « mesure d'audience », Code des postes et des communications
  électroniques (article L.34-5, prospection électronique).

---

## 2. Cookies et traceurs

### 2.1 Ce que le site dépose réellement

| Où | Nom | Durée | Rôle | Consentement |
|---|---|---|---|---|
| Site public (toutes les pages) | — | — | **Aucun cookie, aucun stockage local** | — |
| Inscription organisme | — (Cloudflare Turnstile chargé depuis `challenges.cloudflare.com`) | — | Anti-robots. **Aucun cookie mesuré** sur la page. Turnstile analyse des signaux du navigateur (adresse IP, caractéristiques techniques). | Non (sécurité, strictement nécessaire) — à mentionner dans la politique |
| Espace organisme, après connexion | `sb-<projet>-auth-token` (parfois découpé en `.0`, `.1`) | 400 jours (défaut de la bibliothèque Supabase) | Session de connexion | Non (strictement nécessaire) |
| Espace organisme, lien « mot de passe oublié » | `reinitialisation` | 15 minutes, `httpOnly` | Autorise le choix d'un nouveau mot de passe sans l'actuel | Non |
| Espace admin, après connexion | `sb-<projet>-auth-token` | 400 jours (cookie) ; **8 h** de session imposées par l'application | Session admin | Non |
| dev et preprod uniquement | `_vercel_jwt`, `vercel-experiment-uuid` (domaine `vercel.live`), clés de stockage de session `vc-*` | — | Protection Vercel et barre d'outils Vercel des déploiements de prévisualisation | Hors production |
| Poste local uniquement | `__next_hmr_refresh_hash__` | session | Rechargement à chaud du serveur de développement | Hors production |

**Domaines tiers appelés par le navigateur** : `challenges.cloudflare.com` (Turnstile, page d'inscription uniquement),
`*.supabase.co` (affichage des logos des organismes et des images du blog, stockage public). Aucun outil publicitaire,
aucun réseau social, aucune police Google chargée depuis Google (les polices sont servies par le site).

**Lien « Gestion des cookies »** dans le pied de page : il pointe vers `/cookies/`, qui n'existe pas (404). Voir la
proposition en section 9.3.

### 2.2 La mesure d'audience du site

Fonctionnement (Sprint 9) : à chaque page affichée, le navigateur envoie à `/api/evenements/` le type d'événement
(vue de page, clic sur « Appeler », « Email » ou « Site web » d'une fiche) et le chemin de la page, sans les paramètres
de l'adresse. Le serveur enregistre : type, chemin, organisme concerné le cas échéant, date. **Rien n'est lu ni écrit
dans le navigateur** (pas de cookie, pas d'identifiant), l'adresse IP **n'est pas enregistrée**, les robots sont
écartés.

### 2.3 Faut-il un bandeau ? Réponse : non

1. **L'article 82** (consentement aux traceurs) ne s'applique qu'à la lecture ou l'écriture d'informations dans le
   terminal de l'utilisateur. Notre mesure n'en fait aucune : elle n'est pas un traceur.
2. **Par prudence, elle respecte aussi les conditions d'exemption** de la CNIL pour la mesure d'audience
   (cnil.fr, « Cookies : solutions pour les outils de mesure d'audience ») :

| Condition CNIL | Notre situation |
|---|---|
| Finalité limitée à la mesure d'audience, pour le compte exclusif de l'éditeur | Oui : statistiques internes, aucun tiers |
| Données statistiques anonymes uniquement | Oui : ni identifiant ni IP stockés |
| Pas de recoupement avec d'autres traitements, pas de transmission de données non anonymes à des tiers | Oui |
| Pas de suivi de la navigation sur d'autres sites | Oui |
| Information des utilisateurs (par exemple dans la politique de confidentialité) | **À faire** : la politique actuelle le mentionne en partie ; texte complet proposé en 9.2 |
| Durée de vie des traceurs limitée (13 mois) | Sans objet : aucun traceur |
| Conservation des données collectées 25 mois au plus | **À faire** : aucune purge aujourd'hui → proposition : purge des événements à 25 mois |

3. **Les cookies de connexion** sont strictement nécessaires au service demandé (se connecter) : exemptés.
4. **Turnstile** : aucun cookie mesuré ; c'est une mesure de sécurité. Exempté, mais à mentionner (données traitées
   par Cloudflare).

**Conclusion** : aucun bandeau de consentement. Il faut en revanche une information claire (politique de
confidentialité, page cookies) et la purge à 25 mois. **Toute future intégration** (vidéo YouTube, carte Google,
pixel, outil d'analyse tiers) remettrait la question sur la table : la règle à garder est « rien de tiers sans revoir
ce point ».

---

## 3. Registre des traitements (proposition)

Responsable de traitement : l'éditeur du site (aujourd'hui l'entreprise individuelle d'Erwan, demain sa société).
Contact pour les données : `contact.trouvetaformation@gmail.com`. Pas de délégué à la protection des données
obligatoire (pas de traitement à grande échelle de données sensibles ni de suivi systématique) [à confirmer par le
juriste].

### T1 — Statistiques de fréquentation (anonymes)
- **Finalité** : mesurer l'audience, repérer les recherches sans résultat et les abandons du questionnaire.
- **Données** : type d'événement, chemin de page, organisme concerné, date (`evenements`) ; compteurs agrégés
  (`formulaire_statistiques`, `recherches_sans_resultat`, `statistiques_quotidiennes`). **Aucune donnée personnelle.**
- **Base légale** : intérêt légitime (sans objet au sens strict, les données étant anonymes).
- **Durée** : aujourd'hui illimitée → proposé 25 mois pour `evenements` ; compteurs agrégés sans limite.

### T2 — Comptes et fiches des organismes inscrits
- **Personnes** : dirigeants et contacts des organismes (dont des entrepreneurs individuels, dont le nom est une donnée
  personnelle).
- **Données** : email de connexion et mot de passe (haché par Supabase) ; nom et téléphone du contact interne
  (`comptes_organisme`, jamais publiés) ; contenu de la fiche (nom, adresse, téléphone, email de contact, site, SIRET,
  agrément, logo, présentation, offres) — **publié par l'organisme lui-même** ; liens de validation et de changement
  d'email (adresse, jeton haché, `liens_email`) ; rappels envoyés et désabonnement (`rappels_organisme`,
  `rappels_desabonne_le`) ; demandes de titres ; sessions de connexion (adresse IP et navigateur, tables techniques de
  Supabase).
- **Finalités** : créer et afficher la fiche, sécuriser le compte, envoyer les emails liés au compte et les rappels.
- **Base légale** : exécution du service demandé (contrat / conditions d'utilisation, à rédiger) ; rappels : intérêt
  légitime, avec refus en un clic.
- **Durée** : tant que le compte existe ; suppression immédiate et totale par l'organisme. **Proposé** : comptes jamais
  validés supprimés à 30 jours (décision Erwan déjà prise), liens email purgés 30 jours après expiration, rappels
  conservés avec le compte.
- **Destinataires** : le public (contenu de fiche, par choix de l'organisme), l'admin, les sous-traitants (section 5).

### T3 — Emails transactionnels
- **Données** : adresse du destinataire, contenu du message (validation, changement d'adresse, mot de passe oublié,
  rappels, réponses aux demandes de titre).
- **Base légale** : exécution du service ; rappels : intérêt légitime.
- **Sous-traitant** : Resend (région Europe). Journaux d'envoi conservés par Resend [à vérifier : durée].

### T4 — Prospection des organismes non inscrits
- **Personnes** : organismes de formation repérés par le scraping (107 dans le fichier actuel), dont certains sont des
  personnes physiques (entrepreneurs individuels) ; 5 adresses de messagerie personnelle sur 83.
- **Données** (`prospects`) : nom, raison sociale, SIRET/SIREN, email, téléphone, site web, départements, titres
  préparés, source, date de collecte, statut de contact.
- **Origine** : sources publiques (fiche Google, catalogue Mon Compte Formation, site de l'organisme).
- **Finalité** : proposer le référencement, par téléphone puis par email.
- **Base légale** : **intérêt légitime** (article 6.1.f), en prospection entre professionnels : message en rapport
  avec l'activité professionnelle de la personne, droit d'opposition simple et gratuit (article L.34-5 du CPCE et
  doctrine de la CNIL pour le « B to B »). Le téléphone vers des professionnels n'est pas soumis à Bloctel (réservé
  aux consommateurs) [à confirmer par le juriste, notamment pour les entrepreneurs individuels].
- **Obligation d'information (article 14)** : les coordonnées n'ayant pas été collectées auprès des personnes, il faut
  les informer **au plus tard lors du premier contact** : identité de l'éditeur, finalité, base légale, catégories de
  données, **source**, durée de conservation, droits (opposition notamment) et moyen de les exercer. **Manque
  aujourd'hui** : à intégrer au script d'appel et au premier email (proposition en section 8).
- **Durée annoncée** : 3 ans après le dernier contact. **Non appliquée** : la table n'a pas de date de dernier contact
  (`updated_at` change aussi à chaque import). Proposé : colonne `dernier_contact_le` mise à jour à chaque changement
  de statut, purge automatique à 3 ans.
- **Accès** : admin uniquement. Jamais publié.

### T5 — Liste d'exclusion de la prospection
- **Données** : empreintes SHA-256 du SIRET, du SIREN, de l'email et du domaine du site.
- **Finalité** : garantir qu'une personne qui s'est opposée ne soit plus jamais recontactée.
- **Base légale** : respect du droit d'opposition (obligation légale / intérêt légitime).
- **Point d'attention** : une empreinte SHA-256 sans « sel » reste une **donnée pseudonymisée** au sens du RGPD
  (un email connu peut être reconnu en recalculant son empreinte) : c'est voulu (c'est ce qui permet le filtre), mais
  il ne faut pas la présenter comme « anonyme ». Les textes actuels disent « empreinte chiffrée » : correct.
- **Durée** : aussi longtemps que nécessaire au respect de l'opposition (pas de limite) — justifié, à indiquer.

### T6 — Administration du site
- **Données** : email de l'admin, mot de passe (haché), facteur de double authentification, codes de récupération
  hachés, date de changement de mot de passe ; compte admin de test sur la base de dev uniquement.
- **Base légale** : intérêt légitime (sécurité de l'administration). **Durée** : fonction occupée.

### T7 — Protection anti-robots de l'inscription
- **Données** : adresse IP et signaux techniques du navigateur, traités par Cloudflare (Turnstile).
- **Base légale** : intérêt légitime (sécurité). **Sous-traitant** : Cloudflare.

### T8 — Échanges par email avec l'éditeur
- **Données** : messages reçus sur `contact.trouvetaformation@gmail.com` (demandes, oppositions, questions).
- **Prestataire** : Google (Gmail). Une boîte Gmail grand public n'est pas couverte par un contrat de sous-traitance
  professionnel [à vérifier] → proposé : passer à une boîte professionnelle (Google Workspace avec avenant de
  traitement, ou autre) à la création de la société.
- **Durée** : proposé 3 ans après le dernier échange, sauf obligation de conserver (preuve d'une opposition).

### T9 — Auteurs du blog
- **Données** : nom, qualification, biographie (publiés). **Base légale** : consentement de l'auteur / contrat.
- **Durée** : tant que ses articles sont en ligne.

### T10 — Journaux techniques des prestataires
- **Données** : adresses IP et requêtes dans les journaux de Vercel et de Supabase.
- **Base légale** : intérêt légitime (sécurité, fonctionnement). **Durée** : celle des prestataires (Supabase offre
  gratuite : 1 jour ; Vercel : selon l'offre [à vérifier]).

---

## 4. Durées de conservation

| Données | Aujourd'hui | Proposé |
|---|---|---|
| Événements statistiques (`evenements`) | Illimité | **25 mois**, purge automatique |
| Compteurs agrégés, instantanés des paliers | Illimité | Illimité (anonymes) |
| Comptes organismes actifs et fiches | Jusqu'à suppression | Jusqu'à suppression ; option : avertir puis supprimer après **3 ans sans connexion** (à décider) |
| Comptes jamais validés (email non confirmé) | Illimité | **30 jours** (décision Erwan déjà prise) |
| Liens email (jetons hachés) | Illimité (inutilisables après 24 h) | Purge **30 jours** après expiration |
| Historique des rappels | Avec le compte | Avec le compte |
| Demandes de titre | Illimité | 3 ans, ou suppression avec le compte (déjà le cas) |
| Prospects | Illimité | **3 ans après le dernier contact** (engagement publié), purge automatique |
| Liste d'exclusion | Illimité | Illimité, justifié |
| Compte admin | Fonction | Fonction |
| Emails reçus (Gmail) | Illimité | 3 ans après le dernier échange |
| Journaux prestataires | Défaut prestataire | Défaut prestataire, indiqué dans la politique |

---

## 5. Sous-traitants et transferts

| Prestataire | Rôle | Données | Localisation | Contrat de traitement | Point d'attention |
|---|---|---|---|---|---|
| **Vercel Inc.** (États-Unis) | Hébergement du site et des fonctions serveur | Toutes les requêtes ; données traitées par les fonctions (comptes, prospects, emails) | **Fonctions à Washington (`iad1`)** ; diffusion mondiale | DPA Vercel (inclus dans les conditions) [à vérifier] ; Vercel adhère au cadre UE–États-Unis [à vérifier] | **Passer la région des fonctions à Paris (`cdg1`)** : réglage de production, accord d'Erwan nécessaire |
| **Supabase Inc.** (États-Unis) | Base de données, authentification, stockage des images | Toutes les données | **Paris (`eu-west-3`)** pour dev et prod | DPA Supabase à accepter dans le tableau de bord [à vérifier] | Offre gratuite : sauvegardes, journaux d'un jour, mise en pause après inactivité |
| **Resend** (États-Unis) | Envoi des emails | Adresses et contenus des emails | Région Europe | DPA Resend [à vérifier] | Durée des journaux d'envoi [à vérifier] |
| **Cloudflare Inc.** (États-Unis) | Anti-robots Turnstile | IP, signaux du navigateur | Réseau mondial | DPA Cloudflare ; adhère au cadre UE–États-Unis [à vérifier] | — |
| **Google** | Boîte de contact Gmail | Emails reçus | Mondial | Pas de contrat de sous-traitance pour une boîte grand public [à vérifier] | Boîte professionnelle à prévoir |
| Hostinger | Nom de domaine et DNS | Aucune donnée d'utilisateur | — | — | — |
| API Recherche d'entreprises (État) | Préremplissage du SIRET, recherche de SIRET des prospects | SIRET, noms d'entreprises (données publiques) | France | Sans objet | — |
| GitHub | Code source | **Aucune donnée personnelle** : le fichier du scraping n'est pas versionné (vérifié) | — | — | Garder `scrapping/data/` hors du dépôt |

**Action pour Erwan** : accepter (ou télécharger) les avenants de traitement (DPA) de Vercel, Supabase, Resend et
Cloudflare depuis leurs tableaux de bord, et les ranger dans un dossier « conformité ».

---

## 6. Information des personnes et droits

| Point | Situation | Proposition |
|---|---|---|
| Politique de confidentialité | Existe (version provisoire), incomplète sur certains points (durées, statistiques, Turnstile, transferts) | Version complète en 9.2 |
| Information à l'inscription | **Absente** | Phrase sous le bouton d'inscription : « En créant votre compte, vous acceptez les conditions d'utilisation. Vos données sont traitées comme décrit dans la politique de confidentialité. » (avec liens) |
| Information des prospects (article 14) | **Absente** | Script d'appel et premier email (section 8) |
| Droit d'accès / rectification | L'organisme voit et modifie tout depuis son espace ; sinon par email | Procédure écrite (section 8) |
| Droit à l'effacement | Suppression immédiate du compte depuis l'espace ; prospects : demande par email → liste d'exclusion | Déjà conforme ; à documenter |
| Droit d'opposition | Rappels : un clic ; prospection : email → exclusion définitive | Conforme ; ajouter un lien d'opposition dans les emails de prospection |
| Droit à la portabilité | **Pas d'export** | Bouton « Télécharger mes données » (JSON) dans les Paramètres de l'espace organisme |
| Délai de réponse | Annoncé : un mois | Conforme si la procédure est suivie |

---

## 7. Sécurité (article 32)

**Déjà en place** : connexion chiffrée (HTTPS) partout ; mots de passe hachés (Supabase) ; jetons des liens email et
codes de récupération hachés ; liens de désabonnement signés ; cloisonnement des données par les politiques de la base
(RLS) ; clé de service jamais exposée au navigateur ; double authentification obligatoire et session de 8 h pour
l'admin ; anti-robots à l'inscription ; tests qui refusent de tourner sur la base de production ; base de production
séparée et sans données de test.

**À traiter** :
1. Région des fonctions serveur (constat n° 1).
2. Offre gratuite de Supabase pour la production : sauvegardes et restauration [à vérifier], pause automatique.
   Recommandation : offre payante (sauvegardes quotidiennes) au lancement.
3. Cookie de session organisme de 400 jours : le ramener à une durée cohérente (par exemple 30 jours, renouvelée à
   chaque visite).
4. Procédure de **violation de données** : qui fait quoi, notification à la CNIL sous 72 h si risque, information des
   personnes si risque élevé, registre des incidents (modèle proposé à l'étape suivante).
5. Journal des actions de l'admin (suspension, suppression, import, exclusion) : non requis, utile en cas de litige
   (optionnel).

---

## 8. Prospection : ce qu'il faut ajouter

**Au téléphone** (premier appel), dire en substance :
> « Je suis [prénom], de Trouve ta formation, un annuaire des organismes de formation en sécurité privée. Nous avons
> trouvé vos coordonnées sur [votre fiche Google / le catalogue Mon Compte Formation / votre site]. Je vous appelle pour
> vous proposer d'y référencer gratuitement votre organisme. Si vous ne souhaitez pas être recontacté, je le note tout
> de suite et nous effaçons vos coordonnées. »

Puis, si la personne s'y oppose : enregistrer la demande de suppression dans la page Prospection, immédiatement.

**Premier email** (si personne ne répond), en pied de message :
> Vous recevez ce message parce que les coordonnées de votre organisme figurent sur [source]. Trouve ta formation
> ([éditeur], [adresse]) les utilise, sur la base de son intérêt légitime, uniquement pour vous proposer le
> référencement, et les conserve au plus trois ans après notre dernier contact. Vous pouvez vous y opposer à tout
> moment : [lien ou réponse « STOP »], ou écrire à contact.trouvetaformation@gmail.com. Vous disposez aussi d'un droit
> d'accès, de rectification et d'effacement, et pouvez saisir la CNIL. Détails : [lien vers la politique].

**Dans l'outil** : colonne `dernier_contact_le` (mise à jour à chaque changement de statut), purge automatique à
3 ans, et, quand les emails partiront d'un outil d'envoi, un lien d'opposition qui alimente directement la liste
d'exclusion.

**Procédure de réponse aux demandes de droits** (proposée, une page dans `docs/`) : réception sur l'adresse de
contact → vérification simple de l'identité (réponse depuis l'adresse concernée) → action dans l'admin (suppression,
exclusion, export) → réponse écrite sous un mois → trace de la demande.

---

## 9. Pages légales proposées

Les informations de la société d'Erwan sont en **[à compléter]** : tant qu'elles le restent, la mise en production est
bloquée (règle déjà en place dans `next.config.ts`). Textes à faire relire par un juriste.

### 9.1 Mentions légales

**Éditeur du site**
Le site trouve-ta-formation.fr est édité par [à compléter : dénomination sociale], [à compléter : forme juridique] au
capital de [à compléter] euros, immatriculée au registre du commerce et des sociétés de [à compléter] sous le numéro
[à compléter : SIREN], dont le siège est situé [à compléter : adresse]. Numéro de TVA intracommunautaire :
[à compléter, ou mention « non assujettie »]. Contact : contact.trouvetaformation@gmail.com.

**Directeur de la publication**
[à compléter : nom], [à compléter : qualité, par exemple président].

**Hébergement**
Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis (vercel.com). Les
données sont stockées par Supabase Inc. dans un centre de données situé à Paris (France).

**Contenu des fiches organismes**
Les fiches des organismes de formation sont créées et mises à jour par les organismes eux-mêmes, sans vérification
préalable par l'éditeur. Quand un organisme indique son numéro d'agrément CNAPS, il apparaît sur sa fiche :
vérifiez-le sur l'espace de consultation du CNAPS avant de vous inscrire. Chaque organisme est responsable des
informations qu'il publie. Si une fiche vous paraît inexacte, trompeuse ou illicite, signalez-la à
contact.trouvetaformation@gmail.com : l'éditeur peut la suspendre le temps de la vérification.

**Informations réglementaires**
Les informations sur les titres, les formations et les démarches sont fournies à titre indicatif ; seuls les textes en
vigueur et le CNAPS font foi.

**Propriété intellectuelle**
Les textes, la présentation et le logo du site sont la propriété de l'éditeur ; leur reproduction sans autorisation est
interdite. Les contenus des fiches (textes, logos) restent la propriété des organismes qui les publient.

### 9.2 Politique de confidentialité

**Qui est responsable de vos données ?**
[à compléter : dénomination sociale], éditeur du site (voir les mentions légales). Pour toute question :
contact.trouvetaformation@gmail.com.

**Si vous cherchez une formation**
Le site ne vous demande aucune coordonnée. Le questionnaire d'orientation ne collecte ni nom, ni email, ni téléphone,
et ne pose aucune question sur le casier judiciaire. Pour améliorer le service, nous enregistrons des statistiques
anonymes : pages consultées, clics sur les boutons de contact des fiches, écrans du questionnaire atteints,
combinaisons de recherche sans résultat. Elles ne comportent ni adresse IP, ni identifiant, ni cookie, et ne
permettent d'identifier personne. Le détail des pages consultées est conservé 25 mois ; les totaux, sans limite.

**Si vous représentez un organisme inscrit**
Pour créer et gérer votre fiche, nous traitons l'adresse email et le mot de passe de votre compte, les informations
que vous publiez sur votre fiche, et, si vous les indiquez, le nom et le téléphone d'un contact interne, jamais
publiés. Ces données servent à publier votre fiche, à sécuriser votre compte et à vous écrire à propos de votre fiche
(validation de l'adresse, rappels pour la compléter, réponses à vos demandes). Ce traitement est nécessaire au service
que vous demandez en vous inscrivant. Vous pouvez refuser les rappels en un clic depuis chacun d'eux.
Vos données sont conservées tant que votre compte existe. Un compte dont l'adresse n'a jamais été confirmée est
supprimé après 30 jours. La suppression du compte depuis votre espace efface immédiatement votre fiche et les données
associées. Vous pouvez à tout moment télécharger vos données depuis vos paramètres.

**Si nous vous avons contacté pour vous proposer le référencement**
Nous utilisons les coordonnées professionnelles que votre organisme publie lui-même : fiche Google, catalogue
Mon Compte Formation, site internet. Nous pouvons vous appeler, puis vous écrire, uniquement pour vous proposer le
référencement de votre organisme. Ce traitement repose sur notre intérêt légitime à faire connaître le service aux
organismes concernés. Ces coordonnées ne sont jamais publiées sur le site et sont conservées au plus trois ans après
notre dernier contact. Vous pouvez vous y opposer à tout moment, sans justification, en écrivant à
contact.trouvetaformation@gmail.com : vos données sont alors effacées. Seule une empreinte chiffrée de votre SIRET, de
votre email et du domaine de votre site est conservée, pour garantir que vous ne serez plus jamais recontacté. Les
emails de prospection sont envoyés depuis un domaine dédié, distinct de trouve-ta-formation.fr.

**Qui a accès à vos données ?**
Vos données ne sont ni vendues, ni louées, ni cédées. Seul l'éditeur y a accès, ainsi que ses prestataires techniques,
qui agissent sur ses instructions : Vercel (hébergement du site), Supabase (base de données et authentification,
données stockées à Paris), Resend (envoi des emails, région Europe) et Cloudflare (protection anti-robots du formulaire
d'inscription, qui analyse des informations techniques de votre navigateur). Plusieurs de ces prestataires sont des
sociétés américaines : un éventuel transfert de données hors de l'Union européenne est encadré par les clauses
contractuelles types de la Commission européenne ou par le cadre de protection des données UE–États-Unis.

**Sécurité**
Les échanges avec le site sont chiffrés. Les mots de passe ne sont jamais stockés en clair. L'accès à l'administration
du site est protégé par une double authentification.

**Journaux techniques**
Comme tout site, nos prestataires enregistrent des journaux techniques (dont l'adresse IP) pour assurer la sécurité et
le bon fonctionnement du service. Ils sont conservés pendant une courte durée fixée par ces prestataires
[à compléter après vérification : durée].

**Cookies**
Le site n'utilise ni outil de mesure d'audience tiers, ni cookie publicitaire, et ne dépose aucun cookie lorsque vous
le consultez. Seuls les espaces organisme et admin utilisent un cookie de session, nécessaire à la connexion. Ces
cookies étant strictement nécessaires, aucun consentement n'est demandé. Détail : page Cookies.

**Vos droits**
Vous pouvez demander l'accès à vos données, leur rectification, leur effacement, la limitation de leur traitement,
leur portabilité, ou vous opposer à leur traitement, en écrivant à contact.trouvetaformation@gmail.com. Nous répondons
dans un délai d'un mois. Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
auprès de la CNIL (cnil.fr).

**Mise à jour**
Dernière mise à jour : [à compléter : date de publication].

### 9.3 Page « Cookies » (nouvelle, à l'adresse du lien du pied de page)

**Cookies**
Le site trouve-ta-formation.fr ne dépose aucun cookie lorsque vous le consultez : ni mesure d'audience par un tiers, ni
publicité, ni réseau social. Nos statistiques de fréquentation fonctionnent sans cookie et sans identifiant.
Seuls les espaces réservés utilisent un cookie, au moment de la connexion :

| Cookie | Où | Rôle | Durée |
|---|---|---|---|
| Session de connexion | Espace organisme, espace admin | Vous garder connecté | [à compléter selon la décision : 30 jours proposés] |
| Réinitialisation du mot de passe | Espace organisme | Permettre de choisir un nouveau mot de passe après un lien « mot de passe oublié » | 15 minutes |

Ces cookies sont strictement nécessaires au fonctionnement des espaces réservés : la loi ne prévoit pas de demander
votre consentement pour eux. La page d'inscription utilise aussi un service anti-robots (Cloudflare Turnstile), qui
analyse des informations techniques de votre navigateur sans déposer de cookie.

### 9.4 Conditions d'utilisation pour les organismes (recommandées, à créer)

Plan proposé, à rédiger avec le juriste : objet du service (annuaire gratuit) ; inscription et compte (une fiche par
organisme, exactitude des informations, sécurité des identifiants) ; contenu publié sous la responsabilité de
l'organisme (licence d'affichage accordée à l'éditeur, interdiction des contenus trompeurs ou illicites, mentions
réglementaires, agrément CNAPS déclaré) ; modération (suspension, réactivation par l'éditeur, suppression) ; rappels et
emails ; classement des fiches (règles de pertinence, aucun classement payant, mise en avant éventuelle signalée) —
utile aussi au titre de la transparence des plateformes (article L.111-7 du Code de la consommation [à confirmer]) ;
données personnelles (renvoi à la politique) ; suppression du compte ; responsabilité ; modification des conditions ;
droit applicable.

---

## 10. Plan de mise en conformité proposé

| Ordre | Action | Nature | Prérequis |
|---|---|---|---|
| 1 | Région des fonctions Vercel → Paris (`cdg1`) | Réglage de production | **Accord d'Erwan** |
| 2 | Pages légales complètes (9.1, 9.2, 9.3) avec les informations de la société en `[à compléter]` ; page Cookies ; lien du pied de page corrigé | Code + textes | Validation d'Erwan, relecture juriste |
| 3 | Mention d'information et liens sous le formulaire d'inscription | Code | Texte validé |
| 4 | Purges automatiques : événements (25 mois), comptes jamais validés (30 jours), liens email (30 jours après expiration), prospects (3 ans après le dernier contact, avec `dernier_contact_le`) | Code + migration (dev, puis prod avec accord) | Durées validées (section 4) |
| 5 | Export des données de l'organisme (bouton dans Paramètres) | Code | — |
| 6 | Cookie de session ramené à 30 jours | Code | Durée validée |
| 7 | Registre des traitements (`docs/REGISTRE_TRAITEMENTS.md`), procédure droits, procédure violation de données | Documents | Validation d'Erwan |
| 8 | Script d'appel et pied d'email de prospection (section 8) | Textes | Validation d'Erwan, juriste |
| 9 | Conditions d'utilisation des organismes | Texte + case ou mention à l'inscription | Juriste |
| 10 | DPA des prestataires acceptés et archivés ; offre Supabase de production ; boîte email professionnelle | Démarches Erwan | Budget, création de la société |

**Décisions attendues d'Erwan** : les durées de la section 4 (dont l'option « 3 ans sans connexion »), la durée du
cookie de session, l'accord pour la région Vercel, la relecture des textes des sections 8 et 9, et le principe des
conditions d'utilisation.
