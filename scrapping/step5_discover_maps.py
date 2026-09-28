# -*- coding: utf-8 -*-
"""Étape 5 — Découverte complémentaire via Google Maps.

Le catalogue Mon Compte Formation (étape 1) ne voit que les formations
certifiantes éligibles CPF. Il rate : les organismes qui ne vendent pas sur
le CPF, ceux qui ne font que du MAC / recyclage, et les centres récents pas
encore référencés. Google Maps les voit.

Principe : pour chaque département IDF on interroge Maps sur plusieurs
communes d'ancrage × plusieurs requêtes métier, on filtre sur la pertinence,
on déduplique, puis on résout le SIRET via l'API Recherche d'entreprises.

Les organismes déjà connus de l'étape 1 sont marqués `deja_connu=True`.

Sortie : data/05_maps_discovery.json

Usage :
    python step5_discover_maps.py --dept 93
    python step5_discover_maps.py                 # toute l'IDF (long)
"""
import argparse
import re
import time
import unicodedata

from config import DEPARTEMENTS_IDF, RECHERCHE_ENTREPRISES_URL
from common import TODAY, http_get_json, load_json, save_json

# Requêtes métier — couvrent le référentiel des 13 titres
REQUETES = [
    "centre de formation agent de sécurité",
    "formation SSIAP sécurité incendie",
    "formation TFP APS agent de prévention et de sécurité",
    "formation MAC APS recyclage carte professionnelle",
    "formation agent de sûreté aéroportuaire",
    "formation agent de sécurité cynophile",
]

# Communes d'ancrage : Maps biaise géographiquement, il faut plusieurs points
ANCRAGES = {
    "75": ["Paris 10e", "Paris 15e", "Paris 18e", "Paris 20e"],
    "77": ["Melun", "Meaux", "Chelles", "Torcy"],
    "78": ["Versailles", "Mantes-la-Jolie", "Poissy", "Trappes"],
    "91": ["Évry-Courcouronnes", "Massy", "Corbeil-Essonnes", "Athis-Mons"],
    "92": ["Nanterre", "Boulogne-Billancourt", "Gennevilliers", "Bagneux"],
    "93": ["Bobigny", "Saint-Denis", "Montreuil", "Aulnay-sous-Bois", "Noisy-le-Grand"],
    "94": ["Créteil", "Vitry-sur-Seine", "Ivry-sur-Seine", "Villejuif"],
    "95": ["Cergy", "Argenteuil", "Sarcelles", "Garges-lès-Gonesse"],
}

# Un centre de formation, pas une société de gardiennage ni une auto-école
MOTS_PERTINENTS = ("formation", "academy", "institut", "centre", "école",
                   "ecole", "cfa", "training", "campus", "ifps", "prepa")
MOTS_EXCLUS = ("auto-école", "auto ecole", "conduite", "permis", "coiffure",
               "esthetique", "esthétique", "yoga", "fitness", "boxe",
               "informatique", "langues", "anglais", "immobilier")
CATEGORIES_OK = ("formation", "école", "ecole", "enseignement", "sécurité",
                 "securite", "cours", "centre")


def _slug(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


def pertinent(place):
    """Filtre : centre de formation plausible, dans le périmètre sécurité."""
    blob = _slug("%s %s %s" % (place.get("nom_maps") or "",
                               place.get("categorie") or "",
                               place.get("requete_maps") or ""))
    if any(_slug(m) in blob for m in MOTS_EXCLUS):
        return False
    nom_cat = _slug("%s %s" % (place.get("nom_maps") or "",
                               place.get("categorie") or ""))
    return any(_slug(m) in nom_cat for m in MOTS_PERTINENTS + CATEGORIES_OK)


def code_dept(adresse):
    m = re.search(r"\b(\d{5})\b", adresse or "")
    return m.group(1)[:2] if m else None


def resoudre_siret(nom, dept):
    """SIRET + Qualiopi via l'API Recherche d'entreprises (nom + département)."""
    try:
        data = http_get_json(RECHERCHE_ENTREPRISES_URL,
                             params={"q": nom, "departement": dept, "per_page": 3},
                             min_interval=0.2)
    except Exception:
        return {}
    for r in (data.get("results") or []):
        comp = r.get("complements") or {}
        siege = r.get("siege") or {}
        # on ne retient que si c'est bien un organisme de formation
        if not comp.get("est_organisme_formation"):
            continue
        ndas = comp.get("liste_id_organisme_formation") or []
        return {
            "siret": siege.get("siret"),
            "siren": (siege.get("siret") or "")[:9] or None,
            "raison_sociale": r.get("nom_raison_sociale") or r.get("nom_complet"),
            "siege_adresse": siege.get("adresse"),
            "siege_code_postal": siege.get("code_postal"),
            "siege_commune": siege.get("libelle_commune"),
            "siege_departement": siege.get("departement"),
            "qualiopi": "oui" if comp.get("est_qualiopi") else "non",
            "nda": ndas[0] if ndas else None,
            "etat_administratif": r.get("etat_administratif"),
            "date_creation": r.get("date_creation"),
        }
    return {}


def run(depts, max_par_requete=25):
    from serp import Serp, name_matches

    connus = load_json("01_discovery.json") or []
    noms_connus = [(c["siret"], c.get("nom_of") or "") for c in connus]

    trouves = {}
    with Serp() as s:
        for dept in depts:
            for commune in ANCRAGES[dept]:
                for req in REQUETES:
                    q = "%s %s" % (req, commune)
                    try:
                        places = s.search_maps(q, max_results=max_par_requete)
                    except Exception as e:
                        print("  [ERR] %s : %s" % (q, str(e)[:70]))
                        continue
                    gardes = 0
                    for pl in places:
                        if not pertinent(pl):
                            continue
                        d = code_dept(pl.get("adresse"))
                        if d not in DEPARTEMENTS_IDF:
                            continue
                        key = pl.get("maps_url") or (pl["nom_maps"], pl.get("adresse"))
                        key = _slug(pl["nom_maps"]) + "|" + _slug(pl.get("adresse") or "")
                        if key not in trouves:
                            pl["departement"] = d
                            trouves[key] = pl
                            gardes += 1
                    print("  %-4s %-22s %-52s %2d/%2d gardés (total %d)"
                          % (dept, commune, req[:52], gardes, len(places), len(trouves)))
                    time.sleep(1.0)

    # résolution SIRET + rapprochement avec l'étape 1
    print("\nRésolution SIRET (%d fiches)…" % len(trouves))
    out = []
    for i, pl in enumerate(trouves.values(), 1):
        info = resoudre_siret(pl["nom_maps"], pl["departement"])
        siret = info.get("siret")
        deja = False
        if siret and any(siret == s for s, _ in noms_connus):
            deja = True
        elif any(name_matches(pl["nom_maps"], n) for _, n in noms_connus):
            deja = True
        rec = {
            "nom_maps": pl["nom_maps"],
            "adresse_maps": pl.get("adresse"),
            "telephone_maps": pl.get("telephone"),
            "site_web_maps": pl.get("site_web"),
            "categorie_maps": pl.get("categorie"),
            "note": pl.get("note"),
            "nb_avis": pl.get("nb_avis"),
            "maps_url": pl.get("maps_url"),
            "departement": pl["departement"],
            "requete_maps": pl.get("requete_maps"),
            "deja_connu": deja,
            "source": "google-maps",
            "date_scraping": TODAY,
        }
        rec.update(info)
        out.append(rec)
        if i % 20 == 0:
            print("  %d/%d" % (i, len(trouves)))

    save_json("05_maps_discovery.json", out)
    nouveaux = [r for r in out if not r["deja_connu"]]
    avec_siret = [r for r in nouveaux if r.get("siret")]
    print("\n%d fiches retenues — %d déjà connues, %d NOUVEAUX (%d avec SIRET)"
          % (len(out), len(out) - len(nouveaux), len(nouveaux), len(avec_siret)))
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--dept", action="append", help="code département (répétable)")
    a = ap.parse_args()
    depts = a.dept or list(DEPARTEMENTS_IDF)
    for d in depts:
        if d not in ANCRAGES:
            raise SystemExit("Département hors IDF : %s" % d)
    print("Découverte Maps — %d département(s) × %d ancrages × %d requêtes\n"
          % (len(depts), len(ANCRAGES[depts[0]]), len(REQUETES)))
    run(depts)
