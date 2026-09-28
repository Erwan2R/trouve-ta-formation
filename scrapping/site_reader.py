# -*- coding: utf-8 -*-
"""Lecture du site d'un organisme : texte, emails, téléphones.

Partagé par les étapes 3 (enrichissement) et 6 (qualification) — les deux
avaient divergé, l'étape 6 trouvait des emails que l'étape 3 ratait.

Politique : `robots.txt` respecté sans exception, 1 requête / 2 s par hôte,
User-Agent explicite portant un email de contact, pages publiques seulement.
Le repli TLS non vérifié ne s'applique qu'aux certificats mal configurés
côté serveur — ce n'est pas un signal d'interdiction, contrairement à
robots.txt qu'on ne contourne jamais.
"""
import html as html_lib
import re
import unicodedata
from urllib.parse import urljoin, urlparse

from common import http_get, robots_allows

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
TEL_RE = re.compile(r"(?<![\d.])(?:\+33|0033|0)\s?[1-9](?:[\s.\-]?\d{2}){4}(?![\d])")

# chemins fréquents, tentés en plus du crawl
PAGES = ["/contact", "/contactez-nous", "/nous-contacter", "/mentions-legales",
         "/mentions-legales/", "/a-propos", "/formations", "/nos-formations",
         "/nos-formations/", "/formation", "/catalogue"]
LIEN_UTILE = re.compile(
    r"formation|catalogue|contact|mentions|ssiap|aps\b|surete|securite|"
    r"cynophile|incendie|nos-offres|prestations|stages?", re.I)
MAX_PAGES = 14

# emails à écarter : prestataires techniques, trackers, gabarits de thème
BAD_EMAIL_DOMAINS = ("sentry.", "wixpress.com", "wix.com", "monagenceduweb",
                     "example.", "domain.com", "email.com", "sentry-next",
                     "monsite.com", "votresite", "adresse.com")
BAD_EMAIL_LOCAL = ("no-reply", "noreply", "postmaster", "mailer-daemon",
                   "exemple", "example", "nom.prenom", "prenom.nom", "votre",
                   "john.doe", "jane.doe", "johndoe", "test@", "email@",
                   "adresse@", "sentry")
BAD_EMAIL_RE = re.compile(
    r"\.(web|dev|digital|graphiste|seo)@(gmail|outlook|hotmail|yahoo)\.")
FAKE_TELS = {"0123456789", "0612345678", "0000000000", "0102030405",
             "0611223344", "0700000000"}

GENERIQUES = ("contact", "info", "accueil", "formation", "inscription",
              "commercial", "secretariat", "contact.formation")
# messageries grand public : très souvent la vraie adresse d'un petit centre
FOURNISSEURS = ("gmail.", "orange.", "yahoo.", "outlook.", "hotmail.", "free.",
                "wanadoo.", "sfr.", "laposte.", "bbox.", "live.")
# prestataires web croisés dans les mentions légales — jamais l'organisme
AGENCES = ("agency", "agence-web", "agenceweb", "webdesign", "webagency",
           "creation-site", "studio-web")


def texte_plat(html):
    t = unicodedata.normalize("NFKD", html_lib.unescape(html or ""))
    t = t.encode("ascii", "ignore").decode().lower()
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t))


def norm_tel(raw):
    """Numéro français normalisé « 01 23 45 67 89 », ou None si invalide."""
    d = re.sub(r"[^\d+]", "", raw or "")
    if d.startswith("+33"):
        d = "0" + d[3:]
    elif d.startswith("0033"):
        d = "0" + d[4:]
    if len(d) != 10 or not d.startswith("0") or d[1] == "0":
        return None
    if d in FAKE_TELS or len(set(d)) <= 2:
        return None
    return "%s %s %s %s %s" % (d[0:2], d[2:4], d[4:6], d[6:8], d[8:10])


def clean_emails(emails, site_host):
    """Filtre le bruit et classe : domaine du site d'abord, puis génériques."""
    site_dom = re.sub(r"^www\.", "", (site_host or "")).lower()
    out = []
    for e in emails:
        e = (e or "").strip().lower().rstrip(".")
        if "@" not in e or " " in e:
            continue
        local, dom = e.rsplit("@", 1)
        if any(b in dom for b in BAD_EMAIL_DOMAINS + AGENCES):
            continue
        if any(local.startswith(b) for b in BAD_EMAIL_LOCAL):
            continue
        if BAD_EMAIL_RE.search(e) or e.endswith(
                (".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg")):
            continue
        out.append(e)

    def rang(e):
        """Domaine du site > messagerie grand public > domaine tiers.

        Sans ce dernier palier, l'adresse de l'agence web trouvée dans les
        mentions légales pouvait passer devant celle de l'organisme
        (constaté : hello@bokertovagency.com devant infocapf@yahoo.fr).
        """
        local, dom = e.rsplit("@", 1)
        if site_dom and (dom == site_dom or dom.endswith("." + site_dom)):
            palier = 0
        elif any(f in dom for f in FOURNISSEURS):
            palier = 1
        else:
            palier = 2
        return (palier, 0 if local in GENERIQUES else 1, e)

    return sorted(dict.fromkeys(out), key=rang)


def lire_site(url):
    """Accueil + chemins usuels + un niveau de liens internes pertinents.

    Retourne {texte, emails, telephones, pages_visitees, incidents}.
    `incidents` n'est renseigné que par l'échec de l'URL d'entrée : les
    chemins devinés renvoient 404 sur la plupart des sites, les compter
    classerait à tort des organismes joignables comme injoignables.
    """
    p = urlparse(url)
    root = "%s://%s" % (p.scheme, p.netloc)
    blob, emails, tels, vues, vus = [], set(), set(), [], set()
    incidents = set()

    def charger(u, essentiel=False):
        if u in vus or len(vues) >= MAX_PAGES:
            return None
        vus.add(u)
        if not robots_allows(u):
            if essentiel:
                incidents.add("robots_interdit")
            return None
        try:
            h = http_get(u, min_interval=2.0, timeout=20, cache=True,
                         tls_fallback=True)
        except Exception as e:
            if essentiel:
                msg = str(e)
                if "getaddrinfo" in msg or "Name or service" in msg:
                    incidents.add("dns_introuvable")
                elif "CERTIFICATE" in msg:
                    incidents.add("tls_invalide")
                elif "HTTP Error 403" in msg:
                    incidents.add("http_403_bloque")
                else:
                    incidents.add("http_echec")
            return None
        vues.append(u)
        blob.append(texte_plat(h))
        emails.update(re.findall(r'mailto:([^"\'?<>\s]+)', h))
        emails.update(EMAIL_RE.findall(h))
        for m in re.findall(r'tel:([+0-9.\s\-]+)', h) + TEL_RE.findall(h):
            t = norm_tel(m)
            if t:
                tels.add(t)
        return h

    accueil = charger(url, essentiel=True)
    for chemin in PAGES:
        charger(root + chemin)

    if accueil:
        liens = re.findall(r'<a[^>]+href="([^"#]+)"[^>]*>(.{0,120}?)</a>',
                           accueil, re.S | re.I)
        cands = []
        for href, libelle in liens:
            absolu = urljoin(url, href).split("?")[0]
            if urlparse(absolu).netloc != p.netloc:
                continue
            if LIEN_UTILE.search(href) or LIEN_UTILE.search(texte_plat(libelle)):
                cands.append(absolu)
        for u in dict.fromkeys(cands):
            if len(vues) >= MAX_PAGES:
                break
            charger(u)

    texte = " ".join(blob)
    if vues and len(texte) < 1500:
        incidents.add("site_illisible")
    return {
        "texte": texte,
        "emails": clean_emails(emails, p.netloc),
        "telephones": sorted(tels),
        "pages_visitees": vues,
        "incidents": sorted(incidents),
    }
