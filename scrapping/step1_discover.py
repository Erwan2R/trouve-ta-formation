# -*- coding: utf-8 -*-
"""Étape 1 — Découverte des organismes.

Source : catalogue Mon Compte Formation (opendata Caisse des Dépôts), API
publique sans authentification. Pour chaque (titre, département IDF) on
récupère toutes les actions de formation, on en extrait l'organisme
(nom + SIRET) et le(s) titre(s) préparé(s).

Sortie : data/01_discovery.json — une entrée par SIRET, avec la liste des
titres détectés et les département(s) où l'organisme dispense.

Usage :
    python step1_discover.py                # tous les titres, toute l'IDF
    python step1_discover.py --dept 93 --titre TFP_APS   # test ciblé
"""
import argparse
import sys

from config import DEPARTEMENTS_IDF, MCF_DATASET_URL, TITRES, TITRES_BY_KEY
from common import TODAY, http_get_json, load_json, save_json

PAGE = 100  # max autorisé par l'API ODS v2.1


def fetch_actions(titre, code_dept):
    """Toutes les actions de formation pour un titre dans un département."""
    where = 'code_departement="%s" and suggest(intitule_certification, "%s")' % (
        code_dept,
        titre["match"].replace('"', ""),
    )
    select = ",".join([
        "nom_of", "siret", "type_referentiel", "code_rncp", "code_inventaire",
        "intitule_certification", "intitule_formation", "nom_departement",
        "frais_ttc_tot_mean", "nb_session_active",
    ])
    out, offset = [], 0
    while True:
        data = http_get_json(
            MCF_DATASET_URL,
            params={"where": where, "select": select, "limit": PAGE, "offset": offset},
            min_interval=0.5,
        )
        rows = data.get("results", [])
        out.extend(rows)
        offset += PAGE
        if offset >= data.get("total_count", 0) or offset >= 10000 or not rows:
            break
    return out


def title_matches(titre, row):
    """Confirme que la ligne correspond bien au titre visé (anti faux positif
    du moteur de recherche floue)."""
    if titre["codes"]:
        code = row.get("code_rncp") if titre["referentiel"] == "RNCP" else row.get("code_inventaire")
        return str(code) in titre["codes"]
    # titres sans code (MAC / recyclage) : on retombe sur le libellé
    lib = (row.get("intitule_certification") or "").lower()
    needle = titre["match"].split()[0:3]
    return all(w in lib for w in needle)


def run(depts, titres):
    index = {}  # siret -> entrée agrégée
    for titre in titres:
        for code_dept in depts:
            rows = fetch_actions(titre, code_dept)
            kept = [r for r in rows if title_matches(titre, r)]
            print("  %-18s %s (%s) : %3d actions / %d gardées" % (
                titre["key"], DEPARTEMENTS_IDF[code_dept], code_dept, len(rows), len(kept)))
            for r in kept:
                siret = (r.get("siret") or "").strip()
                if not siret:
                    continue
                e = index.setdefault(siret, {
                    "siret": siret,
                    "siren": siret[:9],
                    "nom_of": r.get("nom_of"),
                    "titres": {},          # key -> {label, source_url}
                    "departements": set(),
                    "libelles_formation": set(),
                    "sources": set(),
                })
                src = ("%s?q=%s+%s"
                       % ("https://www.moncompteformation.gouv.fr/espace-prive/html/#/formation/recherche",
                          titre["label"].replace(" ", "+"), code_dept))
                e["titres"][titre["key"]] = {"label": titre["label"], "source_url": src}
                e["departements"].add(code_dept)
                if r.get("intitule_formation"):
                    e["libelles_formation"].add(r["intitule_formation"])
                e["sources"].add("moncompteformation:catalogue")

    # sérialisation
    out = []
    for e in index.values():
        out.append({
            "siret": e["siret"],
            "siren": e["siren"],
            "nom_of": e["nom_of"],
            "titres": e["titres"],
            "departements_mcf": sorted(e["departements"]),
            "libelles_formation": sorted(e["libelles_formation"]),
            "sources": sorted(e["sources"]),
            "date_scraping": TODAY,
        })
    out.sort(key=lambda x: x["nom_of"] or "")
    save_json("01_discovery.json", out)
    print("\n%d organismes distincts (SIRET) découverts." % len(out))
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--dept", action="append", help="code département (répétable)")
    ap.add_argument("--titre", action="append", help="clé de titre (répétable)")
    args = ap.parse_args()

    depts = args.dept or list(DEPARTEMENTS_IDF)
    for d in depts:
        if d not in DEPARTEMENTS_IDF:
            sys.exit("Département hors IDF : %s" % d)
    if args.titre:
        titres = [TITRES_BY_KEY[k] for k in args.titre]
    else:
        titres = TITRES

    print("Découverte — %d titre(s) x %d département(s)\n" % (len(titres), len(depts)))
    run(depts, titres)
