# Annuaire organismes de formation sécurité privée — IDF

Pipeline de constitution d'une base de prospection : organismes de formation
franciliens préparant à l'un des 13 titres du référentiel (voir `config.py`).

## Principe

Chaque étape écrit un JSON dans `data/`, la dernière produit le CSV.

| Étape | Script | Source | Ce que ça apporte |
|-------|--------|--------|-------------------|
| 1 | `step1_discover.py` | **Catalogue Mon Compte Formation** (opendata Caisse des Dépôts) — API publique | Organismes (nom + SIRET) par titre et département, titres préparés |
| 2 | `step2_enrich_sirene.py` | **API Recherche d'entreprises** (`recherche-entreprises.api.gouv.fr`) | Raison sociale, adresse du siège, **Qualiopi officiel**, n° déclaration d'activité |
| 3 | `step3_enrich_web.py` | **Google Maps** + SERP + site de l'organisme | Adresse du plateau de formation, téléphone, site web, email, note/avis |
| 5 | `step5_discover_maps.py` | **Google Maps** (découverte) | Organismes absents du catalogue CPF |
| 6 | `step6_qualify.py` | site des organismes découverts | SIRET, et **vérification qu'ils préparent bien un des 13 titres** |
| 4 | `step4_build_csv.py` | fusion 1-3 + 5-6 | `data/organismes_idf.csv` + `data/a_verifier.csv` |

Modules partagés : `serp.py` (navigateur Playwright/Chrome : Maps + SERP + rapprochement des noms), `site_reader.py` (lecture des sites d'organismes : crawl, emails, téléphones), `common.py` (HTTP poli, cache, robots).

## Lancer

```bash
pip install playwright        # Chrome de bureau déjà installé suffit

# 1. socle officiel
python step1_discover.py --dept 93 --titre TFP_APS   # ou sans options = toute l'IDF
python step2_enrich_sirene.py
python step3_enrich_web.py

# 2. découverte complémentaire Google Maps
python step5_discover_maps.py --dept 93
python step6_qualify.py

# 3. export
python step4_build_csv.py

python test_matching.py       # non-régression du rapprochement des noms
```

Cache disque dans `data/_cache/` : relancer est gratuit, supprimer le dossier
pour rafraîchir. Le consentement RGPD Google est accepté une fois et mémorisé
dans `data/_browser_state.json`.

## Comment la couche SERP / Maps fonctionne

Les endpoints HTML de Google, DuckDuckGo et Bing renvoient une page de
challenge à un client HTTP simple (`urllib`, `requests`) : c'est pour ça
qu'une première version « sans navigateur » ne ramenait rien. La solution est
un **vrai Chrome piloté par Playwright** (`channel="chrome"`), avec locale
`fr-FR`, et l'acceptation du consentement Google au premier lancement.

État constaté depuis cette connexion :

| Cible | Statut | Note |
|---|---|---|
| **Google Maps** | ✅ marche | source principale : adresse, téléphone, site web, catégorie, note |
| **DuckDuckGo** | ✅ marche | moteur SERP par défaut |
| **Bing** | ✅ marche | secours ; URL réelle à lire dans `<cite>`, pas dans le `href` (`/ck/a?`) |
| Google Search | ❌ bloqué | « trafic exceptionnel sur votre réseau » — blocage IP, pas détection du bot |

Google Search n'est pas nécessaire : Maps donne les coordonnées, DDG/Bing
suffisent pour retrouver un site.

### Le point critique : le rapprochement des noms

Un centre s'immatricule sous un sigle et se présente sur Maps sous le libellé
développé. `serp.name_matches` gère ça par **sous-séquence des initiales** :

- `FSIS FORMATION` ↔ « **F**ormation **S**écurité **I**ncendie et **S**écurité privée » ✅
- `CFIPE` ↔ « **C**entre de **F**ormation et d'**I**nsertion **P**rofessionnelle en **E**ntreprise » ✅

**Le code postal ne valide jamais un rapprochement à lui seul** — seulement
départager des homonymes. Sans cette règle Maps renvoie le centre voisin quand
il ne trouve pas l'organisme, et on récupère le téléphone d'un concurrent
(constaté : CREFOPS → NOUVEL R FORMATION, FPSG → Lefebvre Dalloz,
POINT JAUNE → Afpa Caen).

## Légalité / prudence

- Étapes 1 & 2 : APIs open data publiques, conçues pour l'accès programmatique.
- Sites des organismes : `robots.txt` respecté, 1 req / 2 s, User-Agent
  explicite avec email de contact, pages publiques uniquement.
- Maps / SERP : navigation à cadence humaine (pauses explicites, pas de
  parallélisation), en complément de sources open data — pas en moissonnage
  massif. Ce sont des pages, pas des APIs : à traiter comme telles.
- Alternative conforme aux CGU si le volume augmente : **API Google Places**
  (~200 $ de crédit gratuit / mois) et **SerpAPI**. `step3` sait déjà
  fonctionner avec une URL fournie via `data/manual_sites.csv`.

## Limites connues

- Le catalogue MCF couvre les formations certifiantes **éligibles CPF**. Les
  MAC / recyclages y sont peu présents → `step5` (Maps) et le site de
  l'organisme les rattrapent.
- L'API Recherche d'entreprises ne liste pas exhaustivement les
  établissements d'une entreprise multi-sites. Maps complète (c'est lui qui
  révèle que DATAOS forme à Saint-Denis alors que son siège est Paris 14).
  Pour un inventaire exhaustif, brancher l'API Sirene INSEE (gratuite, sur
  inscription).
- SSIAP = certification du ministère de l'Intérieur (référentiel RS, pas
  RNCP), présente dans le catalogue MCF sous `code_inventaire` 5641/5642/5643.

## Colonnes du CSV

`nom_organisme ; raison_sociale ; siret ; siren ; sites ; nb_sites_idf ;
departements ; adresse_source ; site_web ; email ; email_trouve ; telephone ;
telephone_source ; titres_prepares ; familles ; qualiopi ;
nda_organisme_formation ; maps_nom ; maps_categorie ; maps_note ;
maps_nb_avis ; maps_url ; etat_administratif ; date_creation ; sources ;
url_source_principale ; date_scraping`

`email_trouve = NON` → à prioriser pour une prospection téléphone (la colonne
`telephone` est renseignée à ~95 % grâce à Maps).
