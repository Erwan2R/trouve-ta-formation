# Conformité RGPD — registre et procédures

> Document de travail interne, tenu à jour par l'éditeur. Il reprend l'audit (`docs/AUDIT_RGPD.md`) avec les
> décisions d'Erwan du 01/10/2026. Rédaction Claude : relecture par un juriste conseillée avant le lancement.
> Les mentions « [à vérifier] » restent à confirmer.

Responsable de traitement : l'éditeur du site (entreprise individuelle d'Erwan, puis sa société une fois créée).
Contact : `contact.trouvetaformation@gmail.com`. Pas de délégué à la protection des données obligatoire [à confirmer].

---

## 1. Registre des traitements

| # | Traitement | Personnes | Données | Base légale | Durée | Destinataires et prestataires |
|---|---|---|---|---|---|---|
| T1 | Statistiques internes | Visiteurs | Type d'événement, page, organisme concerné, date. Sans cookie, sans identifiant, sans IP | Intérêt légitime | Événements : 25 mois (purge auto) ; compteurs agrégés : sans limite | Admin ; Supabase |
| T2 | Mesure d'audience tierce | Visiteurs ayant accepté | Identifiants en ligne, pages vues, données techniques (Google Analytics) | **Consentement** (bandeau) | Cookies : 13 mois max ; choix : 6 mois | Google Ireland |
| T3 | Publicité (SEA et réseaux sociaux) | Visiteurs ayant accepté | Identifiants publicitaires, pages vues, conversions (Google Ads, pixel Meta) | **Consentement** (bandeau) | Cookies : 13 mois max | Google Ireland, Meta Platforms Ireland |
| T4 | Comptes et fiches des organismes | Dirigeants et contacts des organismes | Email, mot de passe haché, contact interne, contenu de la fiche, liens email, rappels, demandes de titre, sessions | Exécution du service (conditions d'utilisation) ; rappels : intérêt légitime | Tant que le compte existe ; non validé : 30 jours ; liens email : 30 jours après expiration ; demandes traitées : 3 ans | Public (fiche), admin ; Supabase, Vercel |
| T5 | Emails liés au compte | Organismes inscrits | Adresse, contenu du message | Exécution du service ; rappels : intérêt légitime | Journaux Resend [à vérifier] | Resend (région Europe) |
| T6 | Prospection des organismes non inscrits | Organismes repérés (dont entrepreneurs individuels) | Nom, raison sociale, SIRET, email, téléphone, site, départements, titres, source, statut | Intérêt légitime (prospection entre professionnels) | 3 ans après le dernier contact (purge auto) | Admin uniquement ; Supabase, Vercel |
| T7 | Liste d'exclusion | Personnes opposées à la prospection | Empreintes SHA-256 (SIRET, SIREN, email, domaine) — données pseudonymisées | Respect du droit d'opposition | Sans limite (nécessaire au respect de l'opposition) | Admin uniquement |
| T8 | Administration | Admin | Email, mot de passe haché, double authentification, codes de récupération hachés | Intérêt légitime (sécurité) | Durée de la fonction | — |
| T9 | Anti-robots et limitation des tentatives | Visiteurs des formulaires d'accès | IP et signaux du navigateur (Turnstile) ; empreinte de l'IP ou de l'email par tentative | Intérêt légitime (sécurité) | Tentatives : 24 h (purge auto) | Cloudflare |
| T10 | Échanges par email | Toute personne qui écrit | Messages reçus | Intérêt légitime | 3 ans après le dernier échange | Google (Gmail) |
| T11 | Auteurs du blog | Auteurs | Nom, qualification, biographie (publiés) | Accord de l'auteur | Tant que ses articles sont en ligne | Public |
| T12 | Journaux techniques | Visiteurs | IP, requêtes | Intérêt légitime | Défaut des prestataires | Vercel (fonctions à Paris, `cdg1`), Supabase (Paris) |

**Sous-traitants** : Vercel, Supabase, Resend, Cloudflare, Google, Meta. **À faire par Erwan** : accepter ou télécharger
les avenants de traitement (DPA) depuis leurs tableaux de bord et les ranger dans un dossier « conformité ». Remplacer
la boîte Gmail par une boîte professionnelle à la création de la société.

La purge automatique (`purger_donnees()`, chaque nuit à 3 h) applique les durées marquées « purge auto ».

---

## 2. Répondre à une demande de droits

Délai légal : **un mois** à compter de la réception (prolongeable de deux mois si la demande est complexe, en
prévenant la personne dans le premier mois). Gratuit.

1. **Recevoir.** La demande arrive sur l'adresse de contact (ou par téléphone pendant une prospection : la noter tout
   de suite).
2. **Vérifier l'identité, simplement.** Une demande envoyée depuis l'adresse concernée suffit. Sinon, demander de
   répondre depuis cette adresse. Ne jamais demander de pièce d'identité sans doute sérieux.
3. **Agir.**

   | Demande | Organisme inscrit | Prospect |
   |---|---|---|
   | Accès / copie | Paramètres → « télécharger vos données » | Copier sa ligne de la page Prospection dans la réponse |
   | Rectification | L'organisme modifie sa fiche ; sinon l'admin | Corriger dans la page Prospection |
   | Effacement | Paramètres → Supprimer le compte (ou l'admin depuis la fiche de l'organisme) | Page Prospection → Supprimer (ajoute à la liste d'exclusion) |
   | Opposition | Rappels : lien de désabonnement ; sinon l'admin | Page Prospection → Supprimer |
   | Portabilité | Export JSON des Paramètres | Sans objet |

4. **Répondre par écrit**, en disant ce qui a été fait. Modèle :
   > Bonjour, nous avons bien reçu votre demande du [date]. [Vos coordonnées ont été supprimées et ne seront plus
   > utilisées / Vous trouverez vos données en pièce jointe / …]. Pour toute question : contact.trouvetaformation@gmail.com.
   > Vous pouvez aussi adresser une réclamation à la CNIL (www.cnil.fr).
5. **Garder une trace** : date de réception, demande, action, date de réponse (tableau ci-dessous). Ne pas y recopier
   plus de données que nécessaire.

| Reçue le | Personne (organisme) | Demande | Action | Répondu le |
|---|---|---|---|---|
| | | | | |

---

## 3. Violation de données

Une violation, c'est la perte, la fuite, la modification ou l'accès non autorisé à des données personnelles : clé de
service publiée par erreur, compte admin piraté, export envoyé à la mauvaise personne, base supprimée, etc.

1. **Contenir, tout de suite.** Couper l'accès : changer le mot de passe admin, régénérer les clés Supabase (anon et
   service) et le jeton Vercel, les remplacer dans Vercel, redéployer. Révoquer les sessions (Supabase → Auth).
2. **Évaluer, dans la journée.** Quelles données, combien de personnes, depuis quand, quel risque pour elles (simple
   email professionnel exposé ≠ mots de passe en clair).
3. **Notifier la CNIL sous 72 h** après en avoir eu connaissance, **sauf** si la violation ne présente pas de risque
   pour les personnes. Téléservice : notifications.cnil.fr. On peut notifier en deux temps si tout n'est pas connu.
4. **Informer les personnes** sans tarder si le risque est **élevé** (ex. : mots de passe, données permettant une
   usurpation) : ce qui s'est passé, les conséquences, ce qui a été fait, ce qu'elles doivent faire.
5. **Consigner** chaque violation, même sans notification : obligation légale.

| Date de découverte | Faits | Données et personnes | Risque | Mesures | CNIL notifiée | Personnes informées |
|---|---|---|---|---|---|---|
| | | | | | | |

---

## 4. Prospection : ce qu'il faut dire

Les coordonnées des prospects n'ont pas été collectées auprès d'eux : il faut les informer **au premier contact**.

**Script d'appel** (premier appel) :
> « Bonjour, je suis [prénom], de Trouve ta formation, un annuaire en ligne des organismes de formation en sécurité
> privée. Nous avons trouvé vos coordonnées sur [votre fiche Google / le catalogue Mon Compte Formation / votre site].
> Je vous appelle pour vous proposer d'y référencer gratuitement votre organisme. Si vous ne souhaitez pas être
> recontacté, je le note tout de suite et nous effaçons vos coordonnées. »

Si la personne s'y oppose : page Prospection → Supprimer, pendant l'appel. Si elle accepte un email : lui dire que le
détail de l'utilisation de ses coordonnées figure en bas du message.

**Pied du premier email** (envoyé depuis la boîte de contact) :
> Vous recevez ce message parce que les coordonnées de votre organisme figurent sur [source]. Trouve ta formation
> ([éditeur], [ville]) les utilise uniquement pour vous proposer le référencement, sur la base de son intérêt
> légitime, et les conserve au plus trois ans après notre dernier contact. Pour ne plus être contacté, répondez
> simplement « STOP » : vos coordonnées seront effacées. Vous disposez aussi d'un droit d'accès, de rectification et
> d'effacement, et pouvez saisir la CNIL. Plus d'informations : https://trouve-ta-formation.fr/confidentialite/
