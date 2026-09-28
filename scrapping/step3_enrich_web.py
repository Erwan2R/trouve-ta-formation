# -*- coding: utf-8 -*-
"""Étape 3 — Enrichissement web : fiche Google Maps, site officiel, email, tél.

Trois briques :

  A. **Fiche Google Maps** (`serp.Serp.lookup_place`) — pilotée par un vrai
     Chrome headless. Donne adresse du *lieu de formation* (souvent différente
     du siège SIRENE), téléphone, site web, catégorie, note et nb d'avis.
     La fiche n'est retenue que si le nom correspond (y compris via sigle :
     « FSIS FORMATION » ↔ « Formation Sécurité Incendie et Sécurité privée »)
     ou si le code postal SIRENE se retrouve dans l'adresse.

  B. **SERP** (DuckDuckGo puis Bing) en secours quand Maps n'a pas de site web,
     avec contrôle nom ↔ domaine — sinon le 1er résultat est un annuaire.

  C. **Site de l'organisme** : accueil + contact + mentions légales, pour
     l'email. `robots.txt` respecté, 1 req / 2 s, User-Agent explicite.

Sortie : data/03_web.json

Usage :
    python step3_enrich_web.py            # tout
    python step3_enrich_web.py --no-maps  # SERP + site seulement (plus rapide)
    python step3_enrich_web.py --only 12345678900012
"""
import argparse
import os
import re

from common import TODAY, load_json, save_json
from site_reader import lire_site, norm_tel


def scrape_contact(base_url):
    """Email + téléphone depuis les pages publiques du site de l'organisme."""
    lu = lire_site(base_url)
    return {
        "emails": lu["emails"],
        "telephones_site": lu["telephones"],
        "pages_visitees": lu["pages_visitees"],
        "incidents_site": lu["incidents"],
    }


def load_manual_sites():
    """Surcharges manuelles `siret;url` — prioritaires sur Maps et le SERP."""
    path = os.path.join(os.path.dirname(__file__), "data", "manual_sites.csv")
    out = {}
    if not os.path.exists(path):
        return out
    with open(path, "r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line or line.startswith("#") or line.lower().startswith("siret"):
                continue
            parts = re.split(r"[;,\t]", line, maxsplit=1)
            if len(parts) == 2 and parts[1].strip():
                out[parts[0].strip()] = parts[1].strip()
    return out


def run(use_maps=True, only=None):
    rows = load_json("02_enriched.json") or []
    if only:
        rows = [r for r in rows if r["siret"] in only]
    manual = load_manual_sites()
    print("Enrichissement web — %d organismes (maps=%s, %d URL manuelles)"
          % (len(rows), use_maps, len(manual)))

    serp = None
    if use_maps or True:  # le SERP sert aussi de secours pour le site
        from serp import Serp
        serp = Serp().__enter__()

    out = []
    try:
        for i, r in enumerate(rows, 1):
            siret = r["siret"]
            nom = r.get("raison_sociale") or r["nom_of"]
            commune = r.get("siege_commune") or ""
            cp = r.get("siege_code_postal") or ""

            place = None
            if use_maps:
                try:
                    place = serp.lookup_place(nom, commune, cp)
                except Exception as e:
                    print("      [maps ERR] %s" % str(e)[:80])

            site = manual.get(siret)
            source = "manuel" if site else None
            if not site:
                try:
                    site = serp.find_official_site(nom, commune, cp, place=place)
                except Exception:
                    site = None
                if site:
                    source = "maps" if (place and place.get("site_web")) else "serp"

            rec = {
                "siret": siret,
                "site_web": site,
                "site_source": source,
                "emails": [],
                "telephones_site": [],
                "pages_visitees": [],
                "maps_nom": (place or {}).get("nom_maps"),
                "maps_adresse": (place or {}).get("adresse"),
                "maps_telephone": norm_tel((place or {}).get("telephone")),
                "maps_categorie": (place or {}).get("categorie"),
                "maps_note": (place or {}).get("note"),
                "maps_nb_avis": (place or {}).get("nb_avis"),
                "maps_url": (place or {}).get("maps_url"),
                "date_scraping": TODAY,
            }
            if site:
                rec.update(scrape_contact(site))

            # téléphone retenu : Maps d'abord (vérifié par Google), sinon le site
            rec["telephone"] = rec["maps_telephone"] or (
                rec["telephones_site"][0] if rec["telephones_site"] else None)
            rec["email"] = rec["emails"][0] if rec["emails"] else None
            rec["email_trouve"] = bool(rec["email"])

            print("  %3d/%d  %-38s site=%-5s maps=%-5s mail=%-5s tel=%s" % (
                i, len(rows), nom[:38],
                "oui" if site else "NON", "oui" if place else "non",
                "oui" if rec["email"] else "NON", rec["telephone"] or "-"))
            out.append(rec)
    finally:
        if serp:
            serp.__exit__(None, None, None)

    save_json("03_web.json", out)
    print("\nSites %d/%d · fiches Maps %d/%d · emails %d/%d · tél %d/%d" % (
        sum(1 for r in out if r["site_web"]), len(out),
        sum(1 for r in out if r["maps_url"]), len(out),
        sum(1 for r in out if r["email"]), len(out),
        sum(1 for r in out if r["telephone"]), len(out)))
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-maps", action="store_true", help="sauter Google Maps")
    ap.add_argument("--only", action="append", help="limiter à ces SIRET")
    a = ap.parse_args()
    run(use_maps=not a.no_maps, only=set(a.only) if a.only else None)
