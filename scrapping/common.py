# -*- coding: utf-8 -*-
"""Utilitaires partagés : HTTP poli, cache disque, IO JSON."""
import json
import os
import socket
import time
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser
from datetime import date

from config import USER_AGENT

# Filet de sécurité : urllib.robotparser.RobotFileParser.read() n'accepte pas
# de paramètre timeout et peut donc bloquer indéfiniment sur un hôte dont la
# route (IPv6 en particulier) ne répond jamais (ni succès ni RST). Le timeout
# socket par défaut couvre cet appel (et tout autre urlopen sans timeout
# explicite) sans changer le comportement des appels qui en précisent un.
socket.setdefaulttimeout(20)

# Constaté en prod : sur certains hébergeurs, l'adresse IPv6 annoncée en DNS
# est un vrai trou noir réseau (ni SYN-ACK ni RST ni ICMP unreachable) — le
# connect() reste en SYN_SENT bien au-delà du timeout passé à urlopen(),
# ce dernier ne semblant pas borner cette phase dans ce cas précis. On force
# donc toute résolution DNS à ne renvoyer que des adresses IPv4, qui échouent
# proprement (connexion refusée / injoignable) au lieu de bloquer.
_getaddrinfo_v4_only = socket.getaddrinfo


def _getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return _getaddrinfo_v4_only(host, port, socket.AF_INET, type, proto, flags)


socket.getaddrinfo = _getaddrinfo_ipv4

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CACHE_DIR = os.path.join(DATA_DIR, "_cache")
os.makedirs(CACHE_DIR, exist_ok=True)

TODAY = date.today().isoformat()

_LAST_CALL = {}


def _throttle(host, min_interval):
    now = time.time()
    wait = min_interval - (now - _LAST_CALL.get(host, 0))
    if wait > 0:
        time.sleep(wait)
    _LAST_CALL[host] = time.time()


def http_get(url, params=None, min_interval=1.0, timeout=30, cache=True,
             tls_fallback=False):
    """GET avec cache disque, throttling par host et User-Agent explicite.

    `tls_fallback` : réessaie sans vérification du certificat. Réservé aux
    pages publiques en lecture seule dont le certificat est mal configuré
    côté serveur (cas réel : hubsafetraining.fr). Ce n'est pas un signal
    d'interdiction, contrairement à robots.txt qu'on ne contourne jamais.
    """
    if params:
        url = url + "?" + urllib.parse.urlencode(params)
    host = urllib.parse.urlparse(url).netloc

    cache_path = None
    if cache:
        import hashlib

        key = hashlib.sha1(url.encode("utf-8")).hexdigest()
        cache_path = os.path.join(CACHE_DIR, key + ".txt")
        if os.path.exists(cache_path):
            with open(cache_path, "r", encoding="utf-8") as fh:
                return fh.read()

    _throttle(host, min_interval)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8", errors="replace")
    except urllib.error.URLError as e:
        if not (tls_fallback and "CERTIFICATE_VERIFY_FAILED" in str(e.reason)):
            raise
        import ssl

        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            body = resp.read().decode("utf-8", errors="replace")

    if cache_path:
        with open(cache_path, "w", encoding="utf-8") as fh:
            fh.write(body)
    return body


def http_get_json(url, params=None, **kw):
    return json.loads(http_get(url, params=params, **kw))


_ROBOTS = {}


def robots_allows(url, ua=USER_AGENT):
    """Vérifie robots.txt pour le host de `url` (fail-open si robots injoignable).
    Le parseur est mis en cache par host pour la durée du process."""
    parsed = urllib.parse.urlparse(url)
    host = parsed.netloc
    rp = _ROBOTS.get(host)
    if rp is None:
        rp = urllib.robotparser.RobotFileParser()
        try:
            rp.set_url("%s://%s/robots.txt" % (parsed.scheme, host))
            rp.read()
        except Exception:
            rp = False
        _ROBOTS[host] = rp
    if rp is False:
        return True
    try:
        return rp.can_fetch(ua, url)
    except Exception:
        return True


def load_json(name, default=None):
    path = os.path.join(DATA_DIR, name)
    if not os.path.exists(path):
        return default
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def save_json(name, obj):
    path = os.path.join(DATA_DIR, name)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, ensure_ascii=False, indent=2)
    print("  -> %s (%d entrées)" % (name, len(obj) if hasattr(obj, "__len__") else 0))
