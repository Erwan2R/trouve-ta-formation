// IndexNow : signale toutes les URL du sitemap de production à Bing (ChatGPT Search, Copilot, DuckDuckGo, Yahoo,
// Ecosia), Yandex et Seznam, qui recrawlent sans attendre. À lancer après un déploiement qui ajoute ou modifie des
// pages : node scripts/indexnow.mjs   (la clé est publiée dans public/48837719b6c399f80f9e23f6d7ce2964.txt ; ne pas la changer).
const SITE = "https://trouve-ta-formation.fr";
const CLE = "48837719b6c399f80f9e23f6d7ce2964";

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const reponse = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: CLE, keyLocation: `${SITE}/${CLE}.txt`, urlList }),
});
// 200 ou 202 : reçu. 403 : clé introuvable en ligne (déployer d'abord). 422 : URL hors du domaine.
console.log(`${urlList.length} URL envoyées → ${reponse.status} ${reponse.statusText}`);
