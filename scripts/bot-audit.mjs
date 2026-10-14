// Bot d'audit du site public (admin exclu) : parcourt toutes les pages et produit un rapport navigateur / front / SEO / backend.
// Lecture seule : aucun formulaire soumis. Le navigateur headless est ignoré par /api/evenements (statistiques intactes).
// Usage : node scripts/bot-audit.mjs [https://trouve-ta-formation.fr] [--max=300]
// Rapport : test-results/audit/rapport.md (+ rapport.json)
import { chromium, request as pwRequest } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = (process.argv.find((a) => a.startsWith("http")) ?? "https://trouve-ta-formation.fr").replace(/\/$/, "");
const MAX = Number(process.argv.find((a) => a.startsWith("--max="))?.slice(6) ?? 300);
const HOTE = new URL(BASE).host;
const ESPACE = BASE.replace("://", "://partenaires.");
const SORTIE = "test-results/audit";

const problemes = []; // { gravite: "critique" | "majeur" | "mineur", categorie, page, message }
const signaler = (gravite, categorie, page, message) => problemes.push({ gravite, categorie, page, message });
const pages = new Map(); // url → résultat

const api = await pwRequest.newContext({ ignoreHTTPSErrors: false, maxRedirects: 0 });

// ---------- 1. Backend & infrastructure ----------
async function statut(url, options = {}) {
  try {
    const r = await api.fetch(url, { maxRedirects: 0, ...options });
    return {
      code: r.status(),
      location: r.headers()["location"],
      headers: r.headers(),
      corps: options.corps ? await r.text() : "",
    };
  } catch (e) {
    return { code: 0, erreur: e.message };
  }
}

async function auditBackend() {
  const res = {};
  const accueil = await statut(`${BASE}/`);
  res.accueil = accueil.code;
  if (accueil.code !== 200) signaler("critique", "backend", "/", `Accueil en ${accueil.code}`);
  for (const h of [
    "strict-transport-security",
    "x-frame-options",
    "x-content-type-options",
    "referrer-policy",
    "permissions-policy",
  ])
    if (!accueil.headers?.[h]) signaler("majeur", "sécurité", "/", `En-tête de sécurité absent : ${h}`);
  if (accueil.headers?.["x-robots-tag"])
    signaler("critique", "seo", "/", `X-Robots-Tag présent en prod : ${accueil.headers["x-robots-tag"]}`);
  if (accueil.headers?.["content-security-policy"] === undefined)
    signaler("mineur", "sécurité", "/", "Pas de Content-Security-Policy (protection XSS supplémentaire)");

  // Redirections canoniques
  const http = await statut(BASE.replace("https://", "http://") + "/");
  res.http = `${http.code} → ${http.location}`;
  if (!(http.code >= 300 && http.code < 400 && http.location?.startsWith("https://")))
    signaler("majeur", "backend", "http://", `HTTP ne redirige pas vers HTTPS (${res.http})`);
  const www = await statut(BASE.replace("://", "://www.") + "/");
  res.www = `${www.code} → ${www.location ?? ""}`;
  if (www.code === 0) signaler("mineur", "backend", "www", `www.${HOTE} ne répond pas (${www.erreur?.split("\n")[0]})`);
  else if (!(www.code >= 300 && www.code < 400) || !www.location?.includes(`//${HOTE}`))
    signaler(
      "majeur",
      "seo",
      "www",
      `www ne redirige pas vers le domaine principal (${res.www}) : contenu dupliqué possible`,
    );
  const sansSlash = await statut(`${BASE}/securite-privee`);
  res.slash = `${sansSlash.code} → ${sansSlash.location}`;
  if (![301, 308].includes(sansSlash.code))
    signaler("mineur", "seo", "/securite-privee", `URL sans « / » final : ${res.slash}`);

  // 404
  const absent = await statut(`${BASE}/securite-privee/page-qui-n-existe-pas-${Date.now()}/`);
  res.page404 = absent.code;
  if (absent.code !== 404)
    signaler("critique", "seo", "/404", `Une page inexistante répond ${absent.code} au lieu de 404 (soft 404)`);
  for (const p of ["/partenaires/", "/admin/"]) {
    const r = await statut(`${BASE}${p}`);
    if (r.code !== 404) signaler("majeur", "sécurité", p, `${p} sur le domaine public répond ${r.code} (attendu 404)`);
  }

  // Fichiers pour robots et LLM
  for (const f of ["/robots.txt", "/sitemap.xml", "/llms.txt", "/favicon.ico"]) {
    const r = await statut(`${BASE}${f}`, { corps: true });
    res[f] = r.code;
    if (r.code !== 200) signaler("majeur", "seo", f, `${f} répond ${r.code}`);
    if (f === "/robots.txt" && /Disallow:\s*\/\s*$/m.test(r.corps))
      signaler("critique", "seo", f, "robots.txt bloque tout le site");
    if (f === "/llms.txt" && r.code === 200 && r.corps.length < 300)
      signaler("mineur", "llm", f, "llms.txt très court");
  }

  // API événements : méthodes et validation
  const ev = `${BASE}/api/evenements/`;
  const get = await statut(ev);
  if (get.code !== 405) signaler("mineur", "backend", "/api/evenements", `GET répond ${get.code} (attendu 405)`);
  const invalide = await statut(ev, {
    method: "POST",
    data: { type: "inconnu", chemin: "/" },
    headers: { "user-agent": "audit-humain" },
  });
  if (invalide.code !== 400)
    signaler("majeur", "backend", "/api/evenements", `POST invalide répond ${invalide.code} (attendu 400)`);
  const origine = await statut(ev, {
    method: "POST",
    data: { type: "vue_page", chemin: "/" },
    headers: { origin: "https://pirate.example", "user-agent": "audit-humain" },
  });
  if (origine.code !== 403)
    signaler("majeur", "sécurité", "/api/evenements", `POST d'une origine tierce répond ${origine.code} (attendu 403)`);
  const robot = await statut(ev, {
    method: "POST",
    data: { type: "vue_page", chemin: "/" },
    headers: { "user-agent": "Googlebot" },
  });
  if (robot.code !== 204)
    signaler("mineur", "backend", "/api/evenements", `POST d'un robot répond ${robot.code} (attendu 204 ignoré)`);
  res.api = { get: get.code, invalide: invalide.code, origineTierce: origine.code, robot: robot.code };

  // Espace organisme : pages publiques accessibles, pages connectées protégées
  for (const p of ["/connexion/", "/inscription/", "/mot-de-passe-oublie/"]) {
    const r = await statut(`${ESPACE}${p}`);
    if (r.code !== 200) signaler("critique", "espace-organisme", `partenaires${p}`, `Répond ${r.code}`);
  }
  for (const p of ["/dashboard/", "/ma-fiche/", "/formations/", "/parametres/", "/parametres/export/"]) {
    const r = await statut(`${ESPACE}${p}`);
    if (!(r.code >= 300 && r.code < 400 && r.location?.includes("connexion")))
      signaler(
        "critique",
        "sécurité",
        `partenaires${p}`,
        `Page connectée accessible sans session (${r.code} ${r.location ?? ""})`,
      );
  }
  return res;
}

// ---------- 2. Sitemap ----------
async function lireSitemap() {
  const r = await statut(`${BASE}/sitemap.xml`, { corps: true });
  return [...r.corps.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

// ---------- 3. Navigateur : une page ----------
const OBSERVATEUR = () => {
  window.__lcp = 0;
  window.__cls = 0;
  new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__lcp = e.startTime))).observe({
    type: "largest-contentful-paint",
    buffered: true,
  });
  new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && (window.__cls += e.value))).observe(
    { type: "layout-shift", buffered: true },
  );
};

async function analyserPage(contexte, url) {
  const page = await contexte.newPage();
  const res = { url, console: [], erreursJs: [], requetesEchouees: [] };
  page.on(
    "console",
    (m) =>
      m.type() === "error" &&
      !m.text().startsWith("Failed to load resource") &&
      res.console.push(m.text().slice(0, 200)),
  );
  page.on("pageerror", (e) => res.erreursJs.push(e.message.slice(0, 200)));
  page.on(
    "requestfailed",
    (r) =>
      !/\/api\/evenements|[?&]_rsc=/.test(r.url()) && res.requetesEchouees.push(`${r.failure()?.errorText} ${r.url()}`),
  );
  page.on(
    "response",
    (r) =>
      r.status() >= 400 &&
      r.url() !== url &&
      res.requetesEchouees.push(`${r.status()} ${r.url().replace(/[?&]_rsc=[^&]*/, "")}`),
  );
  const t0 = Date.now();
  let reponse;
  try {
    reponse = await page.goto(url, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(800);
  } catch (e) {
    res.statut = 0;
    signaler("critique", "navigateur", url, `Chargement impossible : ${e.message.split("\n")[0]}`);
    await page.close();
    return res;
  }
  res.statut = reponse?.status() ?? 0;
  res.urlFinale = page.url();
  res.chargementMs = Date.now() - t0;

  Object.assign(
    res,
    await page.evaluate(() => {
      const meta = (n) => document.querySelector(`meta[name="${n}"]`)?.getAttribute("content") ?? null;
      const titres = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
        n: +h.tagName[1],
        t: h.textContent.trim().slice(0, 80),
      }));
      const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
        try {
          const d = JSON.parse(s.textContent);
          const types = [];
          const parcourir = (o) =>
            o && typeof o === "object" && (o["@type"] && types.push(o["@type"]), Object.values(o).forEach(parcourir));
          parcourir(d);
          return { ok: true, types: types.flat() };
        } catch (e) {
          return { ok: false, erreur: e.message };
        }
      });
      const interactifs =
        "a[href],button,input,select,textarea,label,summary,[role=button],[role=link],[role=tab],[role=checkbox],[role=radio],[tabindex]";
      const cliquablesSansLien = [...document.querySelectorAll("body *")]
        .filter((el) => getComputedStyle(el).cursor === "pointer" && !el.closest(interactifs))
        .slice(0, 5)
        .map(
          (el) => `<${el.tagName.toLowerCase()} class="${(el.className?.baseVal ?? el.className ?? "").slice(0, 60)}">`,
        );
      const nav = performance.getEntriesByType("navigation")[0];
      return {
        lang: document.documentElement.lang,
        titre: document.title,
        description: meta("description"),
        robots: meta("robots"),
        canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
        ogTitre: document.querySelector('meta[property="og:title"]')?.content ?? null,
        ogImage: document.querySelector('meta[property="og:image"]')?.content ?? null,
        titres,
        jsonld,
        liens: [...document.querySelectorAll("a[href]")].map((a) => a.href),
        liensVides: [...document.querySelectorAll("a")].filter(
          (a) => !a.getAttribute("href") || a.getAttribute("href") === "#",
        ).length,
        liensSansNom: [...document.querySelectorAll("a[href]")].filter(
          (a) => !a.textContent.trim() && !a.getAttribute("aria-label") && !a.querySelector("img[alt]:not([alt=''])"),
        ).length,
        boutonsSansNom: [...document.querySelectorAll("button")].filter(
          (b) => !b.textContent.trim() && !b.getAttribute("aria-label"),
        ).length,
        imagesSansAlt: [...document.querySelectorAll("img")]
          .filter((i) => !i.hasAttribute("alt"))
          .map((i) => i.src.slice(0, 100)),
        imagesSansDimensions: [...document.querySelectorAll("img")].filter(
          (i) => !i.getAttribute("width") && !i.hasAttribute("data-nimg"),
        ).length,
        champsSansLabel: [
          ...document.querySelectorAll("input:not([type=hidden]):not([type=submit]),select,textarea"),
        ].filter((c) => !c.labels?.length && !c.getAttribute("aria-label") && !c.getAttribute("aria-labelledby"))
          .length,
        cliquablesSansLien,
        ttfb: nav ? Math.round(nav.responseStart) : null,
        domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
        lcp: Math.round(window.__lcp),
        cls: Math.round(window.__cls * 1000) / 1000,
        mots: document.body.innerText.split(/\s+/).filter(Boolean).length,
        poidsKo: Math.round(
          performance.getEntriesByType("resource").reduce((s, r) => s + (r.transferSize || 0), nav?.transferSize || 0) /
            1024,
        ),
      };
    }),
  );

  // Mobile : débordement horizontal
  await page.setViewportSize({ width: 375, height: 800 });
  await page.waitForTimeout(300);
  res.debordementMobile = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  // Barre qui défile ou coupe son contenu (header du 14/10/2026 : liens cachés sans débordement de la page).
  res.coupesMobile = await page.evaluate(() =>
    [...document.querySelectorAll("header, header *, nav")]
      .filter(
        (e) => e.checkVisibility() && e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflowX !== "visible",
      )
      .map(
        (e) =>
          `<${e.tagName.toLowerCase()}${e.getAttribute("aria-label") ? ` « ${e.getAttribute("aria-label")} »` : ""}>`,
      ),
  );
  await page.close();

  // HTML brut (sans JavaScript) : ce que voient Google au 1er passage et les robots des LLM
  const brut = await api
    .get(url, { maxRedirects: 5 })
    .then((r) => r.text())
    .catch(() => "");
  res.h1Brut = (brut.match(/<h1[\s>]/g) ?? []).length;
  res.motsBruts = brut
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return res;
}

// ---------- 4. Vérifications par page ----------
function verifierPage(r, dansSitemap) {
  const u = r.url.replace(BASE, "") || "/";
  if (r.statut >= 400) return signaler(r.statut >= 500 ? "critique" : "majeur", "navigateur", u, `Répond ${r.statut}`);
  if (!r.titre) return;
  const noindex = /noindex/.test(r.robots ?? "");
  r.indexable = !noindex;

  r.erreursJs.forEach((e) => signaler("majeur", "navigateur", u, `Erreur JavaScript : ${e}`));
  r.console.forEach((e) => signaler("mineur", "navigateur", u, `Console : ${e}`));
  [...new Set(r.requetesEchouees)].forEach((e) =>
    signaler(/^5|ERR_/.test(e) ? "majeur" : "mineur", "réseau", u, `Ressource en échec : ${e.slice(0, 160)}`),
  );

  const h1 = r.titres.filter((t) => t.n === 1).length;
  if (h1 !== 1) signaler("majeur", "seo", u, `${h1} balise(s) <h1> (règle : exactement 1)`);
  for (let i = 1; i < r.titres.length; i++)
    if (r.titres[i].n > r.titres[i - 1].n + 1)
      signaler("mineur", "seo", u, `Saut de titre H${r.titres[i - 1].n} → H${r.titres[i].n} (« ${r.titres[i].t} »)`);
  if (r.h1Brut === 0 && h1 > 0) signaler("critique", "seo", u, "Le <h1> n'est pas dans le HTML serveur (rendu client)");
  if (r.motsBruts < r.mots * 0.6)
    signaler("majeur", "seo", u, `Seulement ${r.motsBruts} mots dans le HTML serveur contre ${r.mots} affichés`);

  if (!r.titre) signaler("critique", "seo", u, "Pas de <title>");
  else if (r.titre.length > 65)
    signaler("mineur", "seo", u, `Title long (${r.titre.length} car.) : tronqué dans Google`);
  else if (r.titre.length < 20) signaler("mineur", "seo", u, `Title court (${r.titre.length} car.)`);
  if (!r.description) signaler(noindex ? "mineur" : "majeur", "seo", u, "Pas de meta description");
  else if (r.description.length > 160)
    signaler("mineur", "seo", u, `Description longue (${r.description.length} car.)`);
  else if (r.description.length < 70) signaler("mineur", "seo", u, `Description courte (${r.description.length} car.)`);
  if (!r.canonical) signaler(noindex ? "mineur" : "majeur", "seo", u, "Pas de canonical");
  else if (!noindex && r.canonical !== r.urlFinale)
    signaler("majeur", "seo", u, `Canonical vers une autre URL : ${r.canonical}`);
  if (!r.ogTitre || !r.ogImage)
    signaler(
      "mineur",
      "partage",
      u,
      `Open Graph incomplet (${!r.ogTitre ? "og:title " : ""}${!r.ogImage ? "og:image" : ""})`,
    );
  if (r.lang !== "fr") signaler("mineur", "accessibilité", u, `Attribut lang = « ${r.lang} »`);

  r.jsonld.filter((j) => !j.ok).forEach((j) => signaler("majeur", "seo", u, `JSON-LD invalide : ${j.erreur}`));
  const types = r.jsonld.flatMap((j) => j.types ?? []);
  r.typesJsonLd = [...new Set(types)];
  const profondeur = u.split("/").filter(Boolean).length;
  if (profondeur >= 2 && !types.includes("BreadcrumbList") && !noindex)
    signaler("mineur", "seo", u, "Pas de BreadcrumbList (page profonde)");
  if (/\/organismes\/[^/]+\/$/.test(u) && !types.some((t) => ["LocalBusiness", "EducationalOrganization"].includes(t)))
    signaler("majeur", "seo", u, "Fiche organisme sans JSON-LD LocalBusiness/EducationalOrganization");
  if (u === "/" && !(types.includes("Organization") && types.includes("WebSite")))
    signaler("majeur", "seo", u, "Accueil sans JSON-LD Organization + WebSite");

  if (dansSitemap && noindex) signaler("majeur", "seo", u, "Page dans le sitemap mais en noindex");
  if (!dansSitemap && !noindex && r.statut === 200) signaler("mineur", "seo", u, "Page indexable absente du sitemap");

  if (r.liensVides) signaler("mineur", "accessibilité", u, `${r.liensVides} lien(s) sans href`);
  if (r.liensSansNom) signaler("majeur", "accessibilité", u, `${r.liensSansNom} lien(s) sans texte ni aria-label`);
  if (r.boutonsSansNom)
    signaler("majeur", "accessibilité", u, `${r.boutonsSansNom} bouton(s) sans texte ni aria-label`);
  if (r.champsSansLabel)
    signaler("majeur", "accessibilité", u, `${r.champsSansLabel} champ(s) de formulaire sans label`);
  r.imagesSansAlt.forEach((s) => signaler("majeur", "accessibilité", u, `Image sans alt : ${s}`));
  if (r.imagesSansDimensions)
    signaler(
      "mineur",
      "performance",
      u,
      `${r.imagesSansDimensions} image(s) sans dimensions (décalage de mise en page)`,
    );
  r.cliquablesSansLien.forEach((c) => signaler("mineur", "seo", u, `Élément cliquable hors <a>/<button> : ${c}`));

  r.coupesMobile?.forEach((c) => signaler("majeur", "mobile", u, `Contenu coupé sur mobile (375px) dans ${c}`));
  if (r.debordementMobile > 2)
    signaler("majeur", "mobile", u, `Débordement horizontal de ${r.debordementMobile}px sur mobile (375px)`);
  if (r.ttfb > 1500) signaler("majeur", "performance", u, `Temps de réponse serveur ${r.ttfb} ms`);
  else if (r.ttfb > 600) signaler("mineur", "performance", u, `Temps de réponse serveur ${r.ttfb} ms`);
  if (r.lcp > 4000) signaler("majeur", "performance", u, `LCP ${r.lcp} ms (> 4 s)`);
  else if (r.lcp > 2500) signaler("mineur", "performance", u, `LCP ${r.lcp} ms (> 2,5 s)`);
  if (r.cls > 0.1) signaler("majeur", "performance", u, `CLS ${r.cls} (> 0,1)`);
  if (!noindex && r.mots < 250 && !/conditions|mentions|cookies|confidentialite/.test(u))
    signaler("mineur", "contenu", u, `Contenu mince : ${r.mots} mots`);
}

// ---------- 5. Liens externes ----------
async function verifierExternes(liens) {
  const resultats = await Promise.all(
    [...liens].slice(0, 80).map(async ([lien, origine]) => {
      let r = await statut(lien, { method: "HEAD", maxRedirects: 5, timeout: 10000 });
      if (r.code === 405 || r.code === 403 || r.code === 0) r = await statut(lien, { maxRedirects: 5, timeout: 10000 });
      return [lien, origine, r.code];
    }),
  );
  for (const [lien, origine, code] of resultats)
    if (code >= 404 || code === 0)
      signaler("mineur", "liens", origine, `Lien externe cassé (${code || "injoignable"}) : ${lien}`);
  return resultats.length;
}

// ---------- Programme ----------
console.log(`Audit de ${BASE} (max ${MAX} pages)…`);
const backend = await auditBackend();
const sitemap = await lireSitemap();
const normaliser = (u) => u.split("#")[0];
const sitemapSet = new Set(sitemap.map(normaliser));
const extras = [
  "/",
  "/securite-privee/organismes/?page=2",
  "/conditions-utilisation/",
  "/confidentialite/",
  "/cookies/",
  "/mentions-legales/",
  "/securite-privee/formulaire/",
];
const file = [...new Set([...sitemap, ...extras.map((p) => BASE + p)])];
const vus = new Set(file.map(normaliser));
const externes = new Map();
const liensCasses = [];

const navigateur = await chromium.launch();
const contexte = await navigateur.newContext({ viewport: { width: 1366, height: 900 }, locale: "fr-FR" });
await contexte.addInitScript(OBSERVATEUR);
await (await contexte.newPage()).goto(BASE + "/").catch(() => {});

// ponytail: parcours séquentiel par lots de 4 ; suffisant jusqu'à quelques centaines de pages.
while (file.length && pages.size < MAX) {
  const lot = file.splice(0, 4);
  const resultats = await Promise.all(lot.map((u) => analyserPage(contexte, u)));
  for (const r of resultats) {
    pages.set(r.url, r);
    process.stdout.write(`  ${r.statut} ${r.url.replace(BASE, "")}\n`);
    for (const lien of r.liens ?? []) {
      const l = normaliser(lien);
      let cible;
      try {
        cible = new URL(l);
      } catch {
        continue;
      }
      if (!/^https?:$/.test(cible.protocol)) continue;
      if (cible.host === HOTE) {
        // Filtres du catalogue : on en échantillonne quelques-uns sans tous les parcourir.
        if (cible.search && [...vus].filter((v) => v.includes("?")).length > 6) continue;
        if (!vus.has(l)) {
          vus.add(l);
          file.push(l);
        }
      } else if (!cible.host.endsWith(HOTE)) externes.set(l, r.url.replace(BASE, ""));
    }
  }
}
await navigateur.close();

for (const r of pages.values()) {
  verifierPage(r, sitemapSet.has(r.url));
  if (r.statut >= 400) liensCasses.push(r.url);
}
// Sitemap : URL listées en erreur ou redirigées
for (const u of sitemap) {
  const r = pages.get(u);
  if (r && r.urlFinale && r.urlFinale !== u)
    signaler("majeur", "seo", u.replace(BASE, ""), `URL du sitemap redirigée vers ${r.urlFinale}`);
}
// Doublons de title / description entre pages indexables
const indexables = [...pages.values()].filter((p) => p.indexable);
for (const champ of ["titre", "description"]) {
  const groupes = {};
  indexables.forEach((p) => p[champ] && (groupes[p[champ]] ??= []).push(p.url.replace(BASE, "")));
  Object.entries(groupes)
    .filter(([, us]) => us.length > 1)
    .forEach(([v, us]) =>
      signaler("majeur", "seo", us.join(", "), `${champ} identique sur ${us.length} pages : « ${v.slice(0, 70)} »`),
    );
}
const nbExternes = await verifierExternes(externes);
await api.dispose();

// ---------- Rapport ----------
mkdirSync(SORTIE, { recursive: true });
const ordre = { critique: 0, majeur: 1, mineur: 2 };
problemes.sort((a, b) => ordre[a.gravite] - ordre[b.gravite] || a.categorie.localeCompare(b.categorie));
const compte = (g) => problemes.filter((p) => p.gravite === g).length;
const moyenne = (k) => Math.round(indexables.reduce((s, p) => s + (p[k] || 0), 0) / (indexables.length || 1));
const md = [
  `# Rapport d'audit — ${BASE}`,
  `Généré le ${new Date().toLocaleString("fr-FR")} · ${pages.size} pages parcourues · ${indexables.length} indexables · ${sitemap.length} URL dans le sitemap · ${nbExternes} liens externes testés`,
  ``,
  `**${compte("critique")} critiques · ${compte("majeur")} majeurs · ${compte("mineur")} mineurs**`,
  ``,
  `## Backend`,
  "```json",
  JSON.stringify(backend, null, 2),
  "```",
  `## Performance moyenne (pages indexables)`,
  `TTFB ${moyenne("ttfb")} ms · LCP ${moyenne("lcp")} ms · poids ${moyenne("poidsKo")} Ko · ${moyenne("mots")} mots`,
  ``,
  `## Problèmes`,
  ...["critique", "majeur", "mineur"].flatMap((g) => {
    const liste = problemes.filter((p) => p.gravite === g);
    const groupes = new Map();
    liste.forEach((p) =>
      groupes.set(`[${p.categorie}] ${p.message}`, [...(groupes.get(`[${p.categorie}] ${p.message}`) ?? []), p.page]),
    );
    const lignes = [...groupes].map(
      ([m, ps]) =>
        `- ${m} — ${ps.length > 3 ? `${ps.length} pages, dont \`${ps.slice(0, 3).join("`, `")}\`` : `\`${ps.join("`, `")}\``}`,
    );
    return liste.length ? [``, `### ${g[0].toUpperCase() + g.slice(1)}s (${liste.length})`, ...lignes] : [];
  }),
  ``,
  `## Pages`,
  `| Statut | Page | Index | H1 | Mots | TTFB | LCP | JSON-LD |`,
  `|---|---|---|---|---|---|---|---|`,
  ...[...pages.values()].map(
    (p) =>
      `| ${p.statut} | ${p.url.replace(BASE, "") || "/"} | ${p.indexable ? "oui" : "non"} | ${p.titres?.filter((t) => t.n === 1).length ?? "-"} | ${p.mots ?? "-"} | ${p.ttfb ?? "-"} | ${p.lcp ?? "-"} | ${(p.typesJsonLd ?? []).join(", ")} |`,
  ),
].join("\n");
writeFileSync(`${SORTIE}/rapport.md`, md);
writeFileSync(
  `${SORTIE}/rapport.json`,
  JSON.stringify({ base: BASE, backend, problemes, pages: [...pages.values()].map(({ liens, ...p }) => p) }, null, 2),
);
console.log(
  `\n${compte("critique")} critiques · ${compte("majeur")} majeurs · ${compte("mineur")} mineurs → ${SORTIE}/rapport.md`,
);
