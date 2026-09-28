# -*- coding: utf-8 -*-
"""Tests du rapprochement nom d'organisme ↔ fiche Google Maps.

C'est le point le plus fragile du pipeline : un mauvais rapprochement injecte
le téléphone d'un concurrent dans le fichier de prospection. Chaque cas ci-
dessous vient d'une erreur réellement observée sur le département 93.

    python test_matching.py
"""
import sys

from serp import match_strength, domain_matches

CREF = "CENTRE DE RECRUTEMENT ET DE FORMATION DES PERSONNELS DE SECURITE"

# (raison sociale, nom de la fiche Maps, force attendue)
CAS_NOMS = [
    # --- rapprochements francs ---
    ("SYS ACADEMY", "SYS ACADEMY", "fort"),
    ("ILLICO FORMATION", "illico Formation", "fort"),
    ("ZD ACADEMY", "Zd academy", "fort"),
    ("A2S INSTITUT", "A2s institut", "fort"),
    ("POINT BLEU", "Point Bleu Formation", "fort"),
    ("POINT JAUNE", "Le Point Jaune", "fort"),
    ("ABRICITY UNIVERSITY", "ABRICITY", "fort"),
    ("INSTITUT AERO FORMATIONS", "Institut Aero Formations", "fort"),
    ("CAPF", "CAPF", "fort"),

    # --- sigles : preuve faible, à corroborer par la géographie ---
    # FSIS = Formation Sécurité Incendie et Sécurité privée
    ("FSIS FORMATION", "FORMATION EN SECURITE INCENDIE ET SECURITE PRIVEE", "faible"),
    # CFIPE = Centre de Formation et d'Insertion Professionnelle en Entreprise
    ("CFIPE", "CENTRE DE FORMATION ET D'INSERTION PROFESIONNELLE EN ENTREPRISE", "faible"),
    # CREFOPS : sigle syllabique (CEntre REcrutement FOrmation Personnels Sécurité)
    (CREF, "CREFOPS", "faible"),
    # même sigle, tout autre métier : d'où l'exigence de confirmation géo
    ("CAPF", "Centre Auto Pieces France", "faible"),

    # --- faux rapprochements observés en production ---
    ("POINT JAUNE", "Studio Jaune", None),        # un seul mot en commun
    ("POINT JAUNE", "Afpa - Centre de Caen", None),
    ("NOUVEL R FORMATION", CREF, None),           # même rue, organismes distincts
    ("PSIS FORMATION", "Afpa - Centre de Caen", None),
    ("DATAOS", "Studio Data", None),
]

# (raison sociale, URL, doit matcher)
CAS_DOMAINES = [
    ("FSIS FORMATION", "https://forfsis.fr/", True),
    ("CFIPE", "https://www.cfipe.fr/", True),
    ("ZD ACADEMY", "https://zdacademy.fr/", True),
    ("NOUVEL R FORMATION", "https://nouvelrformation.com/", True),
    ("CFIPE", "https://mescertifs.fr/organisme/cfipe", False),
    ("FSIS FORMATION", "https://certivigilpro.com/centres/620", False),
]


def main():
    echecs = []

    for nom, cand, attendu in CAS_NOMS:
        got = match_strength(nom, cand)
        if got != attendu:
            echecs.append("nom   %-46s <-> %-46s attendu=%s obtenu=%s"
                          % (nom[:46], cand[:46], attendu, got))

    for nom, url, attendu in CAS_DOMAINES:
        got = domain_matches(nom, url)
        if got != attendu:
            echecs.append("domaine %-30s <-> %-44s attendu=%s obtenu=%s"
                          % (nom[:30], url[:44], attendu, got))

    total = len(CAS_NOMS) + len(CAS_DOMAINES)
    if echecs:
        print("%d/%d ECHEC(S) :" % (len(echecs), total))
        for e in echecs:
            print("  " + e)
        return 1
    print("OK — %d cas" % total)
    return 0


if __name__ == "__main__":
    sys.exit(main())
