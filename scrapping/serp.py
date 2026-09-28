# -*- coding: utf-8 -*-
"""Couche SERP + Google Maps, pilotée par un vrai navigateur (Playwright/Chrome).

Pourquoi un navigateur : les endpoints HTML de Google/DDG/Bing renvoient une
page de challenge à un simple client HTTP. Chrome réel (`channel="chrome"`)
passe, et le consentement RGPD est accepté une fois puis mémorisé dans
`data/_browser_state.json`.

API :
    with Serp() as s:
        s.search_web("CFIPE Bagneux formation sécurité")   -> [url, ...]
        s.search_maps("formation SSIAP Bagneux")           -> [{nom, adresse, telephone, site_web, ...}]

Prérequis : `pip install playwright` (Chrome de bureau déjà installé suffit).

Note d'usage : ces pages ne sont pas des APIs. On y va lentement (pauses
explicites), en volume modeste, pour compléter des données déjà obtenues par
les sources open data. Ne pas paralléliser.
"""
import json
import os
import re
import time
import urllib.parse

from common import DATA_DIR

STATE_PATH = os.path.join(DATA_DIR, "_browser_state.json")
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")

CONSENT_SELECTORS = [
    'button[aria-label*="Tout accepter"]',
    'button:has-text("Tout accepter")',
    'button:has-text("Accept all")',
    '#L2AGLb',
    'button#onetrust-accept-btn-handler',
    '#bnp_btn_accept',
]

BAD_HOSTS = (
    "facebook.", "linkedin.", "instagram.", "youtube.", "twitter.", "tiktok.",
    "pagesjaunes.fr", "societe.com", "verif.com", "pappers.fr", "infonet.fr",
    "score3.fr", "rubypayeur.com", "societeinfo.com", "leguichetpro.com",
    "moncompteformation", "francecompetences", ".gouv.fr", "intercariforef",
    "indeed.", "leboncoin", "manageo", "kompass", "mappy.fr", "fr.mappy.com",
    "118712.fr", "cylex", "gowork.fr", "maformation.fr", "ouformer.com",
    "my-security-job.com", "prepasecu.fr", "wikipedia.org", "annuaire",
    "catalogueformpro.com", "quaidesformations", "oriane.info", "seej.fr",
    "centre.contact", "top-societes.fr", "data-prospection", "findglocal",
    "duckduckgo.com", "bing.com", "google.",
)


STOPWORDS = {"formation", "formations", "centre", "institut", "france", "de",
             "du", "des", "la", "le", "les", "et", "en", "d", "l", "securite",
             "sécurité", "prevention", "academy", "training", "sas", "sarl",
             "groupe", "conseil", "abrege", "sa", "eurl"}


def _slug(s):
    import unicodedata
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


def _tokens(s):
    return [t for t in _slug(s).split() if len(t) > 2 and t not in STOPWORDS]


def _root(url):
    p = urllib.parse.urlparse(url)
    return "%s://%s/" % (p.scheme, p.netloc)


def _acronym_of(phrase):
    return "".join(w[0] for w in _slug(phrase).split() if w)


def _is_subsequence(short, long_):
    it = iter(long_)
    return all(c in it for c in short)


def _syllabic_match(sigle, phrase, part_debuts=0.5):
    """Sigle syllabique : CREFOPS = CEntre REcrutement FOrmation Personnels Sécurité.

    On consomme le sigle lettre à lettre dans la phrase et on exige qu'une
    bonne part des lettres tombe en début de mot — sinon n'importe quelle
    suite de lettres serait « trouvée » dans n'importe quelle phrase.
    """
    mots = _slug(phrase).split()
    if not mots or not sigle:
        return False
    plat = "".join(mots)
    debuts, pos = set(), 0
    for m in mots:
        debuts.add(pos)
        pos += len(m)

    i, aux_debuts = 0, 0
    for c in sigle:
        j = plat.find(c, i)
        if j < 0:
            return False
        if j in debuts:
            aux_debuts += 1
        i = j + 1
    return aux_debuts / len(sigle) >= part_debuts


def acronym_matches(nom, candidate):
    """« FSIS FORMATION » vs « Formation Sécurité Incendie et Sécurité privée ».

    Les organismes s'immatriculent sous un sigle et se présentent sur Maps
    sous le libellé développé (ou l'inverse). Deux tests : sous-séquence des
    initiales (sigle classique), puis sigle syllabique.
    """
    for sigle_src, phrase in ((nom, candidate), (candidate, nom)):
        toks = _slug(sigle_src).split()
        if not toks or len(toks) > 2:
            continue
        sigle = toks[0]
        if not (3 <= len(sigle) <= 8):
            continue
        if _is_subsequence(sigle, _acronym_of(phrase)):
            return True
        # seuil permissif : ce test ne produit qu'une preuve « faible »,
        # que lookup_place n'accepte qu'avec confirmation géographique.
        if len(sigle) >= 4 and len(_slug(phrase).split()) >= 4 \
                and _syllabic_match(sigle, phrase, part_debuts=0.4):
            return True
    return False


def match_strength(nom, candidate, seuil=0.75):
    """Force du rapprochement nom ↔ fiche : "fort", "faible" ou None.

    « fort »   : mots en commun / inclusion / forte similarité — exploitable seul.
    « faible » : correspondance de sigle uniquement. Un sigle est une preuve
                 fragile (« CAPF » colle aussi bien à « Centre Auto Pièces
                 France » qu'à notre centre de formation) : à corroborer par
                 le code postal ou la commune avant de retenir la fiche.
    """
    from difflib import SequenceMatcher
    a, b = _slug(nom), _slug(candidate)
    if not a or not b:
        return None
    if a in b or b in a:
        return "fort"
    ta, tb = set(_tokens(nom)), set(_tokens(candidate))
    commun = ta & tb
    # un seul mot en commun ne suffit que si le nom tient en un mot distinctif :
    # sinon « POINT JAUNE » matcherait « Studio Jaune ».
    if ta and tb and len(commun) / len(ta) >= 0.5:
        if len(commun) >= 2 or len(ta) == 1:
            return "fort"
    if SequenceMatcher(None, a, b).ratio() >= seuil:
        return "fort"
    if acronym_matches(nom, candidate):
        return "faible"
    return None


def name_matches(nom, candidate, seuil=0.75):
    """Rapprochement exploitable seul (sigles exclus)."""
    return match_strength(nom, candidate, seuil) == "fort"


def domain_matches(nom, url):
    """Le domaine reprend-il le nom, un mot distinctif, ou son acronyme ?"""
    host = _slug(urllib.parse.urlparse(url).netloc).replace(" ", "")
    mots = _slug(nom).split()
    # nom complet accolé : « ZD ACADEMY » -> zdacademy.fr
    if len(mots) > 1 and "".join(mots) in host:
        return True
    if any(t in host for t in _tokens(nom) if len(t) > 3):
        return True
    acro = "".join(w[0] for w in mots if w)
    return len(acro) >= 3 and acro in host


def is_official_site(url):
    """Écarte les annuaires tiers : on veut le site propre de l'organisme."""
    if not url or not url.startswith("http"):
        return False
    host = urllib.parse.urlparse(url).netloc.lower()
    return bool(host) and not any(b in host for b in BAD_HOSTS)


class Serp:
    def __init__(self, headless=True, slow_ms=700):
        self._pw = None
        self._browser = None
        self._ctx = None
        self._page = None
        self.headless = headless
        self.slow_ms = slow_ms

    # ------------------------------------------------------------ lifecycle
    def __enter__(self):
        from playwright.sync_api import sync_playwright
        self._pw = sync_playwright().start()
        launch = dict(headless=self.headless,
                      args=["--disable-blink-features=AutomationControlled",
                            "--lang=fr-FR"])
        try:
            self._browser = self._pw.chromium.launch(channel="chrome", **launch)
        except Exception:
            # pas de Chrome de bureau : on retombe sur le Chromium de Playwright
            self._browser = self._pw.chromium.launch(**launch)
        ctx_args = dict(user_agent=UA, locale="fr-FR", timezone_id="Europe/Paris",
                        viewport={"width": 1400, "height": 950})
        if os.path.exists(STATE_PATH):
            ctx_args["storage_state"] = STATE_PATH
        self._ctx = self._browser.new_context(**ctx_args)
        self._ctx.add_init_script(
            "Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
        self._page = self._ctx.new_page()
        return self

    def __exit__(self, *exc):
        try:
            self._ctx.storage_state(path=STATE_PATH)
        except Exception:
            pass
        for obj in (self._browser, self._pw):
            try:
                obj.close() if obj is self._browser else obj.stop()
            except Exception:
                pass

    # ------------------------------------------------------------ helpers
    def _accept_consent(self):
        pg = self._page
        if "consent." not in pg.url and "/consent" not in pg.url:
            return False
        for sel in CONSENT_SELECTORS:
            try:
                if pg.locator(sel).count():
                    pg.locator(sel).first.click(timeout=5000)
                    pg.wait_for_timeout(3500)
                    self._ctx.storage_state(path=STATE_PATH)
                    return True
            except Exception:
                continue
        return False

    def _goto(self, url, wait=2500):
        self._page.goto(url, wait_until="domcontentloaded", timeout=60000)
        self._page.wait_for_timeout(wait)
        if self._accept_consent():
            self._page.wait_for_timeout(wait)

    def _txt(self, sel, attr=None):
        try:
            loc = self._page.locator(sel).first
            if not loc.count():
                return None
            v = loc.get_attribute(attr) if attr else loc.inner_text()
            return (v or "").strip() or None
        except Exception:
            return None

    # ------------------------------------------------------------ web search
    def search_web(self, query, limit=10):
        """Résultats organiques. DuckDuckGo en premier, Bing en secours."""
        for fn in (self._ddg, self._bing):
            try:
                urls = fn(query, limit)
            except Exception:
                urls = []
            urls = [u for u in urls if u and u.startswith("http")]
            if urls:
                return urls[:limit]
            time.sleep(1.5)
        return []

    def _ddg(self, query, limit):
        self._goto("https://duckduckgo.com/?q=%s&kl=fr-fr&ia=web"
                   % urllib.parse.quote(query), wait=3000)
        self._page.wait_for_timeout(1500)
        urls = self._page.eval_on_selector_all(
            "a[data-testid='result-title-a']", "els=>els.map(e=>e.href)")
        return [u for u in urls if "duckduckgo.com/y.js" not in u]

    def _bing(self, query, limit):
        self._goto("https://www.bing.com/search?q=%s&setlang=fr&cc=FR"
                   % urllib.parse.quote(query), wait=3000)
        # Bing enveloppe les href dans /ck/a? : la vraie URL est dans <cite>
        cites = self._page.eval_on_selector_all(
            "li.b_algo cite", "els=>els.map(e=>e.textContent)")
        out = []
        for c in cites:
            c = re.sub(r"\s+", "", (c or "")).split("›")[0]
            if c and not c.startswith("http"):
                c = "https://" + c
            out.append(c)
        return out

    def lookup_place(self, nom, commune="", code_postal=""):
        """Fiche Maps de CET organisme, ou None.

        Le nom DOIT correspondre. Le code postal ne sert qu'à départager
        plusieurs homonymes — jamais à valider seul : Maps renvoie volontiers
        le centre de formation voisin quand il ne trouve pas l'organisme, et
        on récupérerait le téléphone d'un concurrent.
        """
        requetes = ["%s %s" % (nom, commune or code_postal)]
        # Maps répond mal aux raisons sociales à rallonge : on retente avec le
        # sigle, sous lequel l'organisme est en réalité référencé (CREFOPS…).
        sigle = _acronym_of(nom).upper()
        if len(_slug(nom).split()) >= 4 and 3 <= len(sigle) <= 8:
            requetes.append("%s %s" % (sigle, commune or code_postal))

        forts, faibles = [], []
        for q in requetes:
            for pl in self.search_maps(q, max_results=5):
                nm = pl["nom_maps"]
                if sigle and _slug(sigle) in _slug(nm).split():
                    forts.append(pl)
                    continue
                s = match_strength(nom, nm)
                if s == "fort":
                    forts.append(pl)
                elif s == "faible":
                    faibles.append(pl)
            if forts:
                break

        def geo_ok(pl):
            adr = pl.get("adresse") or ""
            return bool((code_postal and code_postal in adr)
                        or (commune and _slug(commune) in _slug(adr)))

        if forts:
            return next((p for p in forts if geo_ok(p)), forts[0])
        # rapprochement par sigle : retenu seulement si la géographie confirme
        return next((p for p in faibles if geo_ok(p)), None)

    def find_official_site(self, nom, commune="", code_postal="", place=None):
        """URL du site propre de l'organisme, ou None.

        Maps d'abord (le champ « site web » de la fiche est fiable), puis SERP
        avec contrôle de correspondance nom <-> domaine. Sans ce contrôle le
        premier résultat est presque toujours un annuaire ou un concurrent.
        """
        if place is None:
            try:
                place = self.lookup_place(nom, commune, code_postal)
            except Exception:
                place = None
        if place and place.get("site_web"):
            return _root(place["site_web"])
        for q in ('"%s" %s formation sécurité' % (nom, commune),
                  '%s %s centre de formation' % (nom, commune)):
            for u in self.search_web(q, limit=10):
                if is_official_site(u) and domain_matches(nom, u):
                    return _root(u)
            time.sleep(1.0)
        return None

    # ------------------------------------------------------------ google maps
    def search_maps(self, query, max_results=40):
        """Fiches Google Maps : nom, adresse, téléphone, site web, catégorie."""
        self._goto("https://www.google.com/maps/search/%s?hl=fr&gl=fr"
                   % urllib.parse.quote(query), wait=4000)
        pg = self._page

        # Résultat unique -> Maps ouvre directement la fiche
        if pg.locator("h1.DUwDvf").count() and not pg.locator("a.hfpxzc").count():
            one = self._read_place_panel()
            return [one] if one else []

        feed = pg.locator('div[role="feed"]')
        if not feed.count():
            return []

        prev, stable = -1, 0
        for _ in range(25):
            n = pg.locator("a.hfpxzc").count()
            if n >= max_results:
                break
            if n == prev:
                stable += 1
                if stable >= 2:
                    break
            else:
                stable = 0
            prev = n
            try:
                feed.first.evaluate("el=>el.scrollTo(0, el.scrollHeight)")
            except Exception:
                pg.mouse.wheel(0, 3000)
            pg.wait_for_timeout(1800)

        cards = pg.locator("a.hfpxzc")
        total = min(cards.count(), max_results)
        out = []
        for i in range(total):
            try:
                cards.nth(i).click(timeout=8000)
                pg.wait_for_timeout(2200)
                rec = self._read_place_panel()
                if rec:
                    rec["requete_maps"] = query
                    out.append(rec)
            except Exception:
                continue
            time.sleep(self.slow_ms / 1000.0)
        return out

    def _read_place_panel(self):
        nom = self._txt("h1.DUwDvf")
        if not nom:
            return None

        def aria(sel, prefix):
            v = self._txt(sel, "aria-label")
            if not v:
                return None
            return re.sub(r"^%s\s*:?\s*" % prefix, "", v, flags=re.I).strip()

        site = self._txt('a[data-item-id="authority"]', "href")
        note = self._txt('div.F7nice span[aria-hidden="true"]')
        avis = self._txt('div.F7nice span[aria-label*="avis"]')
        return {
            "nom_maps": nom,
            "adresse": aria('button[data-item-id="address"]', "Adresse"),
            "telephone": aria('button[data-item-id^="phone"]', "Numéro de téléphone"),
            "site_web": site if is_official_site(site) else None,
            "site_web_brut": site,
            "categorie": self._txt("button.DkEaL"),
            "note": note,
            "nb_avis": re.sub(r"[^\d]", "", avis) if avis else None,
            "maps_url": self._page.url,
        }


def load_places(name="04_maps.json"):
    path = os.path.join(DATA_DIR, name)
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)
