# -*- coding: utf-8 -*-
"""Étape 6 — Qualification des organismes découverts via Maps.

Deux corrections sur la sortie de `step5` :

  A. **SIRET manquant** — la recherche entreprise part du libellé Maps, qui
     porte souvent un suffixe commercial (« SESIFORM Saint-Denis Formation
     agent de sécurité », « CAMAS Paris Roissy », « Formation Aéroportuaire |
     GLOB'AZ training »). On nettoie le libellé puis on retente.

  B. **Hors périmètre** — Maps ramène des centres de formation qui ne
     préparent aucun des 13 titres (extincteur, bilan de compétences, GRETA
     généraliste…). On lit le site de l'organisme et on ne garde que ceux qui
     mentionnent explicitement au moins un titre du référentiel.

La consigne est de ne rien inventer : un organisme sans site lisible reste
`qualifie=None` (à vérifier à la main), il n'est ni retenu ni écarté.

Sortie : data/06_qualified.json
"""
import re

from config import DEPARTEMENTS_IDF, TITRES_BY_KEY
from common import TODAY, load_json, save_json
from site_reader import lire_site, norm_tel
from step5_discover_maps import ANCRAGES, resoudre_siret

# Motifs de détection des 13 titres. Les sigles courts (ASA, ASC, A3P) sont
# ancrés sur des mots entiers et souvent précédés de « TFP » : sans cela
# « asa » matcherait « asap », « casa »…
MOTIFS = {
    "TFP_APS": r"\btfp[\s\-]*aps\b|\bcqp[\s\-]*aps\b|agent de prevention et de securite|\btitre[\s\-]*aps\b",
    "MAC_APS": r"\bmac[\s\-]*aps\b|recyclage\s+aps\b|maintien et actualisation des competences.{0,30}(aps|prevention)",
    "SSIAP_1": r"\bssiap[\s\-]*1\b",
    "SSIAP_2": r"\bssiap[\s\-]*2\b",
    "SSIAP_3": r"\bssiap[\s\-]*3\b",
    "RECYCLAGE_SSIAP_1": r"(recyclage|remise a niveau)[\s\-]*ssiap[\s\-]*1\b",
    "RECYCLAGE_SSIAP_2": r"(recyclage|remise a niveau)[\s\-]*ssiap[\s\-]*2\b",
    "RECYCLAGE_SSIAP_3": r"(recyclage|remise a niveau)[\s\-]*ssiap[\s\-]*3\b",
    "TFP_ASC": r"\btfp[\s\-]*asc\b|agent de securite cynophile|maitre[\s\-]*chien",
    "MAC_CYNO": r"\bmac[\s\-]*(asc|cynophile)\b|recyclage\s+cynophile",
    "TFP_ASA": r"\btfp[\s\-]*asa\b|agent de suret[ée] aeroportuaire|suret[ée] aeroportuaire",
    "TFP_A3P": r"\btfp[\s\-]*a3p\b|\ba3p\b|protection physique des personnes",
}

# suffixes commerciaux à retirer du libellé Maps pour retrouver l'entreprise
SUFFIXES = re.compile(
    r"\s*[|–—-]\s*.*$|\s*\b(formation|formations|centre de formation|"
    r"agent de securite|securite incendie|training)\b.*$", re.I)


def nom_pour_recherche(nom_maps, communes):
    """Libellé Maps -> raison sociale plausible."""
    n = nom_maps
    for c in communes:
        n = re.sub(r"\b%s\b" % re.escape(c), " ", n, flags=re.I)
    n = SUFFIXES.sub("", n)
    n = re.sub(r"[(),]", " ", n)
    n = re.sub(r"\s+", " ", n).strip(" -|")
    return n if len(n) >= 3 else nom_maps


def titres_dans(texte):
    return [k for k, motif in MOTIFS.items() if re.search(motif, texte)]


def run():
    fiches = load_json("05_maps_discovery.json") or []
    nouveaux = [f for f in fiches if not f["deja_connu"]]
    communes = sorted({c for lst in ANCRAGES.values() for c in lst}
                      | set(DEPARTEMENTS_IDF.values()))
    print("Qualification — %d fiches Maps nouvelles" % len(nouveaux))

    out = []
    for i, f in enumerate(nouveaux, 1):
        rec = dict(f)

        # A. SIRET manquant : on retente avec un libellé nettoyé
        if not rec.get("siret"):
            propre = nom_pour_recherche(f["nom_maps"], communes)
            if propre.lower() != f["nom_maps"].lower():
                rec.update({k: v for k, v in
                            resoudre_siret(propre, f["departement"]).items() if v})
            rec["nom_recherche"] = propre

        # B. périmètre : les 13 titres, lus sur le site de l'organisme
        site = f.get("site_web_maps")
        lu = lire_site(site) if site else None
        titres = titres_dans(lu["texte"]) if lu else []

        # Le statut dit POURQUOI. « hors périmètre » n'est prononcé que si on
        # a réellement lu le catalogue : un site injoignable ou interdit par
        # robots.txt est un « à vérifier », pas un rejet.
        if not site:
            statut = "sans_site"
        elif titres:
            statut = "retenu"
        elif lu["incidents"]:
            statut = lu["incidents"][0]
        elif len(lu["pages_visitees"]) < 2:
            statut = "site_illisible"
        else:
            statut = "hors_perimetre"

        rec["titres_detectes"] = titres
        rec["titres_labels"] = sorted(TITRES_BY_KEY[t]["label"] for t in titres)
        rec["emails"] = lu["emails"] if lu else []
        rec["email"] = rec["emails"][0] if rec["emails"] else None
        rec["telephone"] = norm_tel(f.get("telephone_maps")) or (
            lu["telephones"][0] if lu and lu["telephones"] else None)
        rec["pages_visitees"] = lu["pages_visitees"] if lu else []
        rec["statut"] = statut
        rec["qualifie"] = statut == "retenu"
        rec["a_verifier"] = statut not in ("retenu", "hors_perimetre")
        out.append(rec)

        print("  %2d/%d  %-42s %-16s siret=%-9s %s" % (
            i, len(nouveaux), f["nom_maps"][:42], statut,
            rec.get("siret") or "-", ",".join(rec["titres_labels"])[:38]))

    save_json("06_qualified.json", out)
    from collections import Counter
    compte = Counter(r["statut"] for r in out)
    print("\nStatuts : " + " · ".join("%s=%d" % kv for kv in compte.most_common()))
    print("Retenus %d · à vérifier à la main %d · rejetés %d" % (
        compte["retenu"], sum(1 for r in out if r["a_verifier"]),
        compte["hors_perimetre"]))
    print("SIRET résolus : %d/%d · emails : %d" % (
        sum(1 for r in out if r.get("siret")), len(out),
        sum(1 for r in out if r.get("email"))))
    return out


if __name__ == "__main__":
    run()
