# Prompt à envoyer à Claude Code

---

## Contexte

Je construis un annuaire d'organismes de formation dans le secteur de la sécurité privée (`trouve-ta-formation.fr`, verticale sécurité privée, lancement en Île-de-France). J'ai besoin d'un outil de scraping qui me permette de constituer une base de prospection : les organismes seront ensuite contactés par email pour les inviter à créer leur fiche sur l'annuaire (référencement volontaire et gratuit).

## Objectif

Construire un script de scraping qui identifie les organismes de formation préparant à un ou plusieurs des titres suivants, et qui collecte leurs informations de contact.

## Cible : les organismes

Organismes de formation professionnelle qui dispensent au moins un des 13 titres suivants (référentiel fermé) :

**Surveillance humaine** — TFP APS, MAC APS
**Sécurité incendie** — SSIAP 1, SSIAP 2, SSIAP 3, Recyclage SSIAP 1, Recyclage SSIAP 2, Recyclage SSIAP 3
**Cynophile** — TFP ASC (agent de sécurité cynophile), MAC cynophile
**Sûreté aéroportuaire** — TFP ASA
**Protection des personnes** — TFP A3P (agent de protection physique des personnes)

Ne pas inclure : organismes qui dispensent uniquement des formations hors de ce périmètre (secourisme seul, sécurité incendie ERP hors SSIAP, etc.), sauf s'ils proposent aussi un des titres ci-dessus.

## Zone géographique

Île-de-France uniquement, soit les 8 départements : Paris (75), Seine-et-Marne (77), Yvelines (78), Essonne (91), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94), Val-d'Oise (95).

Un organisme avec plusieurs sites : ne retenir que s'il a au moins un site en Île-de-France, mais collecter tous ses sites franciliens (un organisme peut avoir plusieurs lieux de formation dans plusieurs départements).

## Données à collecter par organisme

- Nom de l'organisme (raison sociale)
- SIRET si trouvable
- Adresse(s) complète(s) du ou des sites franciliens, avec département
- Site web
- Email de contact (priorité : email direct, sinon formulaire de contact)
- Téléphone
- Titre(s) préparé(s) parmi les 13 ci-dessus, tels qu'affichés par l'organisme
- Certification Qualiopi (oui/non/non trouvé)
- Source de la donnée (URL de la page où l'info a été trouvée)
- Date du scraping

## Sources à envisager

- Annuaire officiel Qualiopi (data.esr.gouv.fr ou liste des organismes certifiés)
- Répertoire France compétences (organismes rattachés aux codes RNCP des titres ciblés)
- Recherche Google ciblée par titre + département (ex: "SSIAP 1 formation Seine-Saint-Denis")
- Sites des fédérations professionnelles du secteur si liste d'organismes agréés publiée
- Annuaires généralistes (Pages Jaunes, Google Maps) en dernier recours, pour compléter les coordonnées

Vérifie la légalité et les conditions d'utilisation de chaque source avant de scraper (respect des robots.txt, pas de contournement de protections anti-bot).

## Format de sortie attendu

Un fichier CSV (ou Google Sheet si tu préfères connecter Google Sheets), une ligne par organisme, avec les colonnes listées ci-dessus. Si un organisme a plusieurs sites en IDF, soit une ligne par site avec le nom d'organisme répété, soit une colonne "sites" qui liste les adresses séparées par un point-virgule — propose-moi les deux options avant de trancher.

## Contraintes

- Dédupliquer les organismes qui apparaissent dans plusieurs sources (matching sur nom + SIRET si dispo, sinon nom + adresse)
- Ne jamais inventer une donnée manquante : laisser le champ vide plutôt que de deviner
- Flaguer les organismes dont l'email n'a pas pu être trouvé (utile pour prioriser la prospection)
- Me proposer d'abord un plan (sources retenues, structure du script, volumétrie estimée) avant de lancer un scraping massif

## Ce que j'attends de toi pour démarrer

1. Confirme les sources que tu comptes utiliser et pourquoi
2. Propose la structure du script (langage, librairies)
3. Fais un test sur un département (ex: Seine-Saint-Denis, 93) et un seul titre (TFP APS) avant de généraliser
