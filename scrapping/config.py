# -*- coding: utf-8 -*-
"""Référentiel fermé des 13 titres + zone géographique IDF + endpoints.

Chaque titre est décrit par :
  - key         : identifiant court utilisé en interne / dans le CSV
  - label       : libellé affiché
  - famille     : regroupement métier
  - referentiel : "RNCP" | "RS" | "AUTRE"
  - codes       : liste des codes RNCP / codes inventaire (RS) connus
  - match       : expression passée à suggest() sur intitule_certification
                  (recherche floue moncompteformation)
  - mac         : True si c'est un recyclage / MAC (peu ou pas dans le
                  catalogue CPF -> détecté surtout via le site de l'organisme)
"""

DEPARTEMENTS_IDF = {
    "75": "Paris",
    "77": "Seine-et-Marne",
    "78": "Yvelines",
    "91": "Essonne",
    "92": "Hauts-de-Seine",
    "93": "Seine-Saint-Denis",
    "94": "Val-de-Marne",
    "95": "Val-d'Oise",
}

TITRES = [
    # --- Surveillance humaine ---
    {
        "key": "TFP_APS",
        "label": "TFP APS",
        "famille": "Surveillance humaine",
        "referentiel": "RNCP",
        "codes": ["36648", "41394", "42158"],
        "match": "agent de prévention et de sécurité",
        "mac": False,
    },
    {
        "key": "MAC_APS",
        "label": "MAC APS",
        "famille": "Surveillance humaine",
        "referentiel": "AUTRE",
        "codes": [],
        "match": "maintien et actualisation des compétences agent de prévention",
        "mac": True,
    },
    # --- Sécurité incendie ---
    {
        "key": "SSIAP_1",
        "label": "SSIAP 1",
        "famille": "Sécurité incendie",
        "referentiel": "RS",
        "codes": ["5641"],
        "match": "service de sécurité incendie et d'assistance aux personnes niveau 1",
        "mac": False,
    },
    {
        "key": "SSIAP_2",
        "label": "SSIAP 2",
        "famille": "Sécurité incendie",
        "referentiel": "RS",
        "codes": ["5642"],
        "match": "service de sécurité incendie et d'assistance aux personnes niveau 2",
        "mac": False,
    },
    {
        "key": "SSIAP_3",
        "label": "SSIAP 3",
        "famille": "Sécurité incendie",
        "referentiel": "RS",
        "codes": ["5643"],
        "match": "service de sécurité incendie et d'assistance aux personnes niveau 3",
        "mac": False,
    },
    {
        "key": "RECYCLAGE_SSIAP_1",
        "label": "Recyclage SSIAP 1",
        "famille": "Sécurité incendie",
        "referentiel": "AUTRE",
        "codes": [],
        "match": "recyclage service de sécurité incendie niveau 1",
        "mac": True,
    },
    {
        "key": "RECYCLAGE_SSIAP_2",
        "label": "Recyclage SSIAP 2",
        "famille": "Sécurité incendie",
        "referentiel": "AUTRE",
        "codes": [],
        "match": "recyclage service de sécurité incendie niveau 2",
        "mac": True,
    },
    {
        "key": "RECYCLAGE_SSIAP_3",
        "label": "Recyclage SSIAP 3",
        "famille": "Sécurité incendie",
        "referentiel": "AUTRE",
        "codes": [],
        "match": "recyclage service de sécurité incendie niveau 3",
        "mac": True,
    },
    # --- Cynophile ---
    {
        "key": "TFP_ASC",
        "label": "TFP ASC",
        "famille": "Cynophile",
        "referentiel": "RNCP",
        "codes": ["34486", "40271", "41662"],
        "match": "agent de sécurité cynophile",
        "mac": False,
    },
    {
        "key": "MAC_CYNO",
        "label": "MAC cynophile",
        "famille": "Cynophile",
        "referentiel": "AUTRE",
        "codes": [],
        "match": "maintien et actualisation des compétences agent de sécurité cynophile",
        "mac": True,
    },
    # --- Sûreté aéroportuaire ---
    {
        "key": "TFP_ASA",
        "label": "TFP ASA",
        "famille": "Sûreté aéroportuaire",
        "referentiel": "RNCP",
        "codes": ["40278"],
        "match": "agent de sûreté aéroportuaire",
        "mac": False,
    },
    # --- Protection des personnes ---
    {
        "key": "TFP_A3P",
        "label": "TFP A3P",
        "famille": "Protection des personnes",
        "referentiel": "RNCP",
        "codes": ["38002", "40374"],
        "match": "agent de protection physique des personnes",
        "mac": False,
    },
]

TITRES_BY_KEY = {t["key"]: t for t in TITRES}

# --- Endpoints (tous publics, sans authentification) ---
MCF_DATASET_URL = (
    "https://opendata.caissedesdepots.fr/api/explore/v2.1/catalog/"
    "datasets/moncompteformation_catalogueformation/records"
)
RECHERCHE_ENTREPRISES_URL = "https://recherche-entreprises.api.gouv.fr/search"

USER_AGENT = (
    "trouve-ta-formation-annuaire/0.1 (+contact: erwanderota.pro@gmail.com) "
    "prospection annuaire formation sécurité privée"
)
