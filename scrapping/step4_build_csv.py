# -*- coding: utf-8 -*-
"""Étape 4 — Consolidation et export CSV (1 ligne par organisme).

Fusionne les étapes 1-3 (+ 5 si présente) par SIRET, déduplique sur
SIREN + nom normalisé, agrège les sites franciliens dans une colonne `sites`
(adresses séparées par " ; ").

Sur les adresses : le siège SIRENE et l'adresse Google Maps diffèrent souvent
— c'est normal, le siège social n'est pas le plateau de formation. Les deux
sont conservés comme sites distincts, et `adresse_source` dit d'où vient quoi.

Sortie : data/organismes_idf.csv
"""
import csv
import os
import re
import unicodedata

from config import DEPARTEMENTS_IDF, TITRES_BY_KEY
from common import TODAY, load_json

COLUMNS = [
    "nom_organisme", "raison_sociale", "siret", "siren",
    "sites", "nb_sites_idf", "departements", "adresse_source",
    "site_web", "email", "email_trouve", "telephone", "telephone_source",
    "titres_prepares", "familles", "titres_source",
    "qualiopi", "nda_organisme_formation",
    "maps_nom", "maps_categorie", "maps_note", "maps_nb_avis", "maps_url",
    "etat_administratif", "date_creation",
    "decouvert_par", "sources", "url_source_principale", "date_scraping",
]


TYPES_VOIE = ("rue", "av", "avenue", "bd", "boulevard", "imp", "impasse",
              "all", "allee", "pl", "place", "rte", "route", "chemin", "quai",
              "batiment", "bat", "immeuble", "etage", "cours", "square")


def _cle_adr(a):
    """Clé de comparaison : (n° de voie, mots de la voie).

    SIRENE et Maps écrivent la même adresse différemment — préfixe avec la
    raison sociale (« Illico formation, 79 Rue Rateau… »), plage de numéros
    (« 2 A 4 2 RUE… »), voire un code postal divergent (92200 vs 92220).
    On compare donc sur le seul couple numéro + nom de voie.
    """
    a = unicodedata.normalize("NFKD", a or "").encode("ascii", "ignore").decode()
    a = re.sub(r"[^a-z0-9 ]", " ", a.lower())
    a = re.split(r"\b\d{5}\b", a)[0]          # tout ce qui suit le CP : commune
    nums = re.findall(r"\b(\d{1,4})\b", a)
    num = nums[-1] if nums else ""            # dernier n° avant la voie
    mots = {m for m in a.split()
            if len(m) >= 4 and not m.isdigit() and m not in TYPES_VOIE}
    return num, mots


def _meme_adresse(a, b):
    (na, ma), (nb, mb) = _cle_adr(a), _cle_adr(b)
    if not ma or not mb:
        return False
    if na and nb and na != nb:
        return False
    return len(ma & mb) / min(len(ma), len(mb)) >= 0.6


def _by_siret(name):
    return {r["siret"]: r for r in (load_json(name) or [])}


def _lignes_maps(deja):
    """Organismes découverts par Maps (étape 5) et qualifiés (étape 6).

    On ne retient que ceux dont le site mentionne au moins un des 13 titres :
    `qualifie=None` (site illisible) et `False` (hors périmètre) restent
    dehors — la consigne interdit de deviner ce qu'un organisme dispense.
    """
    from serp import match_strength

    connus_siren = {r["siren"] for r in deja if r["siren"]}
    connus_noms = [(r["nom_organisme"] or "") for r in deja] + \
                  [(r["raison_sociale"] or "") for r in deja if r["raison_sociale"]]
    # (nom, adresse) de chaque site déjà connu, pour le rapprochement faible
    connus_sites = [(r["nom_organisme"] or "", r["raison_sociale"] or "", s)
                    for r in deja for s in (r["sites"] or "").split(" ; ") if s]

    def deja_present(nom, adresse):
        """Sigle + même adresse = même organisme.

        Maps liste parfois un organisme sous son libellé développé et sans
        SIRET (« FORMATION EN SECURITE INCENDIE ET SECURITE PRIVEE » pour
        FSIS FORMATION). Le nom seul est une preuve faible, l'adresse la
        confirme.
        """
        if not adresse:
            return False
        for n1, n2, site in connus_sites:
            if not _meme_adresse(adresse, site):
                continue
            if any(match_strength(nom, k) for k in (n1, n2) if k):
                return True
        return False

    out, par_cle = [], {}
    for q in (load_json("06_qualified.json") or []):
        if not q.get("qualifie"):
            continue
        siren = (q.get("siret") or "")[:9] or None
        nom = q.get("raison_sociale") or q["nom_maps"]
        if siren and siren in connus_siren:
            continue
        # sans SIREN, le rapprochement se fait sur le nom : c'est ce qui
        # rattrape « FORMATION EN SECURITE INCENDIE… » = FSIS FORMATION
        if not siren and any(match_strength(nom, k) == "fort" for k in connus_noms):
            continue
        if not siren and deja_present(nom, q.get("adresse_maps")):
            continue

        sites, srcs = [], []
        for adr, src in ((q.get("siege_adresse"), "sirene"),
                         (q.get("adresse_maps"), "google-maps")):
            if adr and not any(_meme_adresse(adr, s) for s in sites):
                sites.append(adr.strip())
                srcs.append(src)

        # deux fiches Maps du même SIREN = deux sites d'un même organisme
        cle = siren or nom.upper().strip()
        if cle in par_cle:
            ex = par_cle[cle]
            for adr, src in zip(sites, srcs):
                if adr and not any(_meme_adresse(adr, s) for s in ex["_sites"]):
                    ex["_sites"].append(adr)
                    ex["_srcs"].append(src)
            ex["_titres"].update(q.get("titres_detectes") or [])
            ex["email"] = ex["email"] or q.get("email") or ""
            continue

        dept = q.get("departement") or q.get("siege_departement")
        titres = q.get("titres_labels") or []
        ligne = {
            "nom_organisme": q["nom_maps"],
            "raison_sociale": q.get("raison_sociale") or "",
            "siret": q.get("siret") or "",
            "siren": siren or "",
            "sites": " ; ".join(sites),
            "nb_sites_idf": len(sites),
            "departements": "%s %s" % (dept, DEPARTEMENTS_IDF.get(dept, "")) if dept else "",
            "adresse_source": " ; ".join(srcs),
            "site_web": q.get("site_web_maps") or "",
            "email": q.get("email") or "",
            "email_trouve": "oui" if q.get("email") else "NON",
            "telephone": q.get("telephone") or "",
            "telephone_source": "google-maps" if q.get("telephone_maps") else (
                "site-organisme" if q.get("telephone") else ""),
            "titres_prepares": " ; ".join(titres),
            "familles": " ; ".join(sorted(
                {TITRES_BY_KEY[k]["famille"] for k in q.get("titres_detectes", [])})),
            "titres_source": "site-organisme",
            "qualiopi": q.get("qualiopi", "non trouvé"),
            "nda_organisme_formation": q.get("nda") or "",
            "maps_nom": q["nom_maps"],
            "maps_categorie": q.get("categorie_maps") or "",
            "maps_note": q.get("note") or "",
            "maps_nb_avis": q.get("nb_avis") or "",
            "maps_url": q.get("maps_url") or "",
            "etat_administratif": q.get("etat_administratif") or "",
            "date_creation": q.get("date_creation") or "",
            "decouvert_par": "google-maps",
            "sources": "google-maps ; site-organisme",
            "url_source_principale": q.get("maps_url") or "",
            "date_scraping": TODAY,
        }
        ligne["_sites"] = sites
        ligne["_srcs"] = srcs
        ligne["_titres"] = set(q.get("titres_detectes") or [])
        par_cle[cle] = ligne
        out.append(ligne)

    # rematérialise les colonnes agrégées après fusion des fiches
    for r in out:
        r["sites"] = " ; ".join(r.pop("_sites"))
        r["adresse_source"] = " ; ".join(r.pop("_srcs"))
        titres = r.pop("_titres")
        r["nb_sites_idf"] = len([s for s in r["sites"].split(" ; ") if s])
        r["titres_prepares"] = " ; ".join(
            sorted(TITRES_BY_KEY[t]["label"] for t in titres))
        r["familles"] = " ; ".join(sorted(TITRES_BY_KEY[t]["famille"] for t in titres))
    return out


COLONNES_A_VERIFIER = [
    "nom_maps", "statut", "raison", "siret", "raison_sociale", "departement",
    "adresse_maps", "telephone", "email", "site_web_maps", "maps_url",
]

RAISONS = {
    "sans_site": "aucun site web sur la fiche Maps — vérifier par téléphone",
    "robots_interdit": "le robots.txt du site interdit la lecture automatique — consulter à la main",
    "dns_introuvable": "le domaine ne résout plus — site probablement abandonné",
    "http_403_bloque": "le site refuse les requêtes automatisées (403)",
    "http_echec": "le site n'a pas répondu",
    "site_illisible": "page servie mais sans contenu exploitable (site JS)",
    "tls_invalide": "certificat TLS invalide",
}


def _ecrire_a_verifier():
    """Organismes découverts par Maps qu'on n'a PAS pu qualifier.

    Ils ne sont ni retenus ni écartés : le fichier dit pourquoi, pour qu'une
    vérification manuelle rapide tranche. Les exclure silencieusement
    reviendrait à décider sans preuve.
    """
    lignes = []
    for q in (load_json("06_qualified.json") or []):
        if not q.get("a_verifier"):
            continue
        lignes.append({
            "nom_maps": q["nom_maps"],
            "statut": q["statut"],
            "raison": RAISONS.get(q["statut"], ""),
            "siret": q.get("siret") or "",
            "raison_sociale": q.get("raison_sociale") or "",
            "departement": q.get("departement") or "",
            "adresse_maps": q.get("adresse_maps") or "",
            "telephone": q.get("telephone") or "",
            "email": q.get("email") or "",
            "site_web_maps": q.get("site_web_maps") or "",
            "maps_url": q.get("maps_url") or "",
        })
    path = os.path.join(os.path.dirname(__file__), "data", "a_verifier.csv")
    with open(path, "w", encoding="utf-8-sig", newline="") as fh:
        wr = csv.DictWriter(fh, fieldnames=COLONNES_A_VERIFIER, delimiter=";")
        wr.writeheader()
        wr.writerows(lignes)
    if lignes:
        print("-> data/a_verifier.csv     (%d fiches à trancher à la main)" % len(lignes))


def build():
    disc = load_json("01_discovery.json") or []
    enr = _by_siret("02_enriched.json")
    web = _by_siret("03_web.json")

    rows = []
    for d in disc:
        siret = d["siret"]
        e = enr.get(siret, {})
        w = web.get(siret, {})

        # --- sites franciliens : SIRENE + adresse Maps si elle diffère ---
        sites, sources_adr = [], []
        for et in e.get("etablissements_idf", []):
            if et.get("adresse"):
                sites.append(et["adresse"].strip())
                sources_adr.append("sirene")
        if not sites and e.get("siege_dans_idf") and e.get("siege_adresse"):
            sites.append(e["siege_adresse"].strip())
            sources_adr.append("sirene")

        adr_maps = (w.get("maps_adresse") or "").strip()
        if adr_maps and re.search(r"\b(75|77|78|91|92|93|94|95)\d{3}\b", adr_maps):
            sites.append(adr_maps)
            sources_adr.append("google-maps")

        # dédup : deux écritures de la même adresse fusionnent, en conservant
        # la trace des deux sources
        dedup, dedup_src = [], []
        for s, src in zip(sites, sources_adr):
            for i, deja in enumerate(dedup):
                if _meme_adresse(s, deja):
                    if src not in dedup_src[i]:
                        dedup_src[i] += "+" + src
                    break
            else:
                dedup.append(s)
                dedup_src.append(src)
        sites, sources_adr = dedup, dedup_src

        depts = sorted(
            set(d.get("departements_mcf", []))
            | {et["departement"] for et in e.get("etablissements_idf", [])
               if et.get("departement")}
            | {m.group(0)[:2] for m in
               [re.search(r"\b(75|77|78|91|92|93|94|95)\d{3}\b", s) for s in sites] if m}
        )

        titres = d.get("titres", {})
        rows.append({
            "nom_organisme": d.get("nom_of"),
            "raison_sociale": e.get("raison_sociale"),
            "siret": siret,
            "siren": d.get("siren"),
            "sites": " ; ".join(sites),
            "nb_sites_idf": len(sites),
            "departements": " ; ".join(
                "%s %s" % (c, DEPARTEMENTS_IDF.get(c, "")) for c in depts),
            "adresse_source": " ; ".join(sources_adr),
            "site_web": w.get("site_web") or "",
            "email": w.get("email") or "",
            "email_trouve": "oui" if w.get("email") else "NON",
            "telephone": w.get("telephone") or "",
            "telephone_source": ("google-maps" if w.get("maps_telephone")
                                 else "site-organisme" if w.get("telephone") else ""),
            "titres_prepares": " ; ".join(sorted(t["label"] for t in titres.values())),
            "familles": " ; ".join(sorted(
                {TITRES_BY_KEY[k]["famille"] for k in titres})),
            "titres_source": "catalogue-cpf",
            "decouvert_par": "moncompteformation",
            "qualiopi": e.get("qualiopi", "non trouvé"),
            "nda_organisme_formation": e.get("nda") or "",
            "maps_nom": w.get("maps_nom") or "",
            "maps_categorie": w.get("maps_categorie") or "",
            "maps_note": w.get("maps_note") or "",
            "maps_nb_avis": w.get("maps_nb_avis") or "",
            "maps_url": w.get("maps_url") or "",
            "etat_administratif": e.get("etat_administratif") or "",
            "date_creation": e.get("date_creation") or "",
            "sources": " ; ".join(sorted(set(d.get("sources", [])) |
                                         ({"google-maps"} if w.get("maps_url") else set()))),
            "url_source_principale": next(
                (t["source_url"] for t in titres.values()), ""),
            "date_scraping": TODAY,
        })

    rows += _lignes_maps(rows)

    # dédup finale sur SIREN + nom normalisé
    seen, final = set(), []
    for r in rows:
        key = (r["siren"], (r["nom_organisme"] or "").upper().strip())
        if key not in seen:
            seen.add(key)
            final.append(r)
    final.sort(key=lambda x: (x["email_trouve"] == "NON", x["nom_organisme"] or ""))

    out_path = os.path.join(os.path.dirname(__file__), "data", "organismes_idf.csv")
    with open(out_path, "w", encoding="utf-8-sig", newline="") as fh:
        wr = csv.DictWriter(fh, fieldnames=COLUMNS, delimiter=";")
        wr.writeheader()
        wr.writerows(final)

    _ecrire_a_verifier()

    print("-> data/organismes_idf.csv  (%d organismes)" % len(final))
    print("   email      : %d   | sans email : %d" % (
        sum(1 for r in final if r["email_trouve"] == "oui"),
        sum(1 for r in final if r["email_trouve"] == "NON")))
    print("   téléphone  : %d" % sum(1 for r in final if r["telephone"]))
    print("   site web   : %d" % sum(1 for r in final if r["site_web"]))
    print("   fiche Maps : %d" % sum(1 for r in final if r["maps_url"]))
    print("   multi-sites: %d" % sum(1 for r in final if r["nb_sites_idf"] > 1))
    print("   Qualiopi   : %d" % sum(1 for r in final if r["qualiopi"] == "oui"))
    return final


if __name__ == "__main__":
    build()
