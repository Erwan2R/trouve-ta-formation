# -*- coding: utf-8 -*-
"""Étape 2 — Enrichissement entreprise (adresse, raison sociale, Qualiopi).

Source : API Recherche d'entreprises (recherche-entreprises.api.gouv.fr),
API publique de l'État, sans authentification.

Pour chaque SIRET issu de l'étape 1 :
  - raison sociale / nom complet
  - adresse du siège (+ code postal, commune, département, coordonnées GPS)
  - est_qualiopi (booléen officiel Annuaire des Entreprises)
  - est_organisme_formation + n° de déclaration d'activité (NDA)
  - liste des établissements ouverts en IDF (best effort, via matching)

Limite connue : l'API /search ne renvoie pas de façon fiable TOUS les
établissements d'une entreprise. Les sites de formation secondaires sont
complétés aux étapes 3 (site de l'organisme) et 4 (SERP / Maps).

Sortie : data/02_enriched.json
"""
from config import DEPARTEMENTS_IDF, RECHERCHE_ENTREPRISES_URL
from common import TODAY, http_get_json, load_json, save_json


def _fmt_etab(e):
    return {
        "siret": e.get("siret"),
        "adresse": e.get("adresse"),
        "code_postal": e.get("code_postal"),
        "commune": e.get("libelle_commune"),
        "departement": e.get("departement"),
        "coordonnees": e.get("coordonnees"),
        "etat": e.get("etat_administratif"),
        "est_siege": e.get("est_siege", False),
    }


def enrich_one(disc):
    siret = disc["siret"]
    data = http_get_json(
        RECHERCHE_ENTREPRISES_URL,
        params={"q": siret, "per_page": 1, "page": 1},
        min_interval=0.15,
    )
    results = data.get("results") or []
    if not results:
        # fallback : recherche par SIREN
        data = http_get_json(
            RECHERCHE_ENTREPRISES_URL,
            params={"q": disc["siren"], "per_page": 1, "page": 1},
            min_interval=0.15,
        )
        results = data.get("results") or []
    if not results:
        return {**disc, "enrich_status": "introuvable"}

    r = results[0]
    comp = r.get("complements") or {}
    siege = r.get("siege") or {}

    etabs = {siege.get("siret"): _fmt_etab(siege)} if siege.get("siret") else {}
    for e in (r.get("matching_etablissements") or []):
        if e.get("siret"):
            etabs[e["siret"]] = _fmt_etab(e)

    etabs_idf = [e for e in etabs.values()
                 if e.get("departement") in DEPARTEMENTS_IDF and e.get("etat") == "A"]

    ndas = comp.get("liste_id_organisme_formation") or []

    return {
        **disc,
        "raison_sociale": r.get("nom_raison_sociale") or r.get("nom_complet"),
        "nom_complet": r.get("nom_complet"),
        "siege_adresse": siege.get("adresse"),
        "siege_code_postal": siege.get("code_postal"),
        "siege_commune": siege.get("libelle_commune"),
        "siege_departement": siege.get("departement"),
        "siege_coordonnees": siege.get("coordonnees"),
        "siege_dans_idf": siege.get("departement") in DEPARTEMENTS_IDF,
        "qualiopi": ("oui" if comp.get("est_qualiopi") is True
                     else "non" if comp.get("est_qualiopi") is False
                     else "non trouvé"),
        "est_organisme_formation": comp.get("est_organisme_formation"),
        "nda": ndas[0] if ndas else None,
        "etat_administratif": r.get("etat_administratif"),
        "date_creation": r.get("date_creation"),
        "etablissements_idf": etabs_idf,
        "nombre_etablissements_ouverts": r.get("nombre_etablissements_ouverts"),
        "enrich_status": "ok",
        "enrich_source": "recherche-entreprises.api.gouv.fr",
        "date_scraping": TODAY,
    }


def run():
    disc = load_json("01_discovery.json") or []
    print("Enrichissement entreprise — %d organismes" % len(disc))
    out = []
    for i, d in enumerate(disc, 1):
        rec = enrich_one(d)
        flag = ""
        if rec.get("enrich_status") != "ok":
            flag = "  [!] " + rec.get("enrich_status", "")
        elif not rec.get("siege_dans_idf") and rec.get("departements_mcf"):
            flag = "  [i] siège hors IDF, forme en %s" % ",".join(rec["departements_mcf"])
        print("  %3d/%d  %-45s Qualiopi=%s%s" % (
            i, len(disc), (rec.get("raison_sociale") or rec["nom_of"] or "")[:45],
            rec.get("qualiopi", "?"), flag))
        out.append(rec)
    save_json("02_enriched.json", out)
    n_q = sum(1 for r in out if r.get("qualiopi") == "oui")
    print("\nQualiopi confirmé : %d / %d" % (n_q, len(out)))
    return out


if __name__ == "__main__":
    run()
