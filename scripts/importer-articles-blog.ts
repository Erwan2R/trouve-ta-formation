// Import des articles rédigés hors du site (scripts/articles-blog/) : images converties en WebP (comme l'éditeur),
// déposées dans le stockage du blog, corps converti au format de l'éditeur et validé comme à l'enregistrement.
// Un article dont le slug existe déjà est ignoré (jamais d'écrasement d'un article retouché dans l'admin).
//
//   Dev (publiés, pour prévisualiser) :
//     npx jiti scripts/importer-articles-blog.ts --env dev --images "C:/Users/erwan/Downloads" --publier
//   Production (brouillons : l'audit anti-concurrence et la publication se font dans l'admin) :
//     npx jiti scripts/importer-articles-blog.ts --env prod --images "C:/Users/erwan/Downloads" --confirmer-prod
//   --sans-images-manquantes : importe quand même si une image est absente du dossier (elle est omise).
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { markdownVersDocument } from "../lib/blog/markdown";
import { validerDocument } from "../lib/blog/validation";
import { ARTICLES, type ArticleSource } from "./articles-blog/articles";

const { values: o } = parseArgs({
  options: {
    env: { type: "string" },
    images: { type: "string" },
    publier: { type: "boolean", default: false },
    "confirmer-prod": { type: "boolean", default: false },
    "sans-images-manquantes": { type: "boolean", default: false },
  },
});
const DEV = "https://livkbehsovponxhbctac.supabase.co";
if (o.env !== "dev" && o.env !== "prod") throw new Error("Précisez --env dev ou --env prod.");
if (!o.images || !existsSync(o.images)) throw new Error("Précisez le dossier des images : --images <dossier>.");
process.loadEnvFile(o.env === "dev" ? ".env.development.local" : ".env.local");
const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "");
if (o.env === "dev" && URL_SUPABASE !== DEV)
  throw new Error(".env.development.local ne pointe pas vers la base de dev.");
if (o.env === "prod") {
  if (URL_SUPABASE === DEV) throw new Error(".env.local pointe vers la base de dev.");
  if (!o["confirmer-prod"]) throw new Error("Écriture en production : ajoutez --confirmer-prod.");
  if (o.publier) throw new Error("En production, la publication se fait dans l'admin (audit anti-concurrence).");
}
const db = createClient(URL_SUPABASE, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const PREFIXE = `${URL_SUPABASE}/storage/v1/object/public/blog/`;
const DOSSIER = join(process.cwd(), "scripts", "articles-blog");

type Image = { src: string; largeur: number; hauteur: number };
type Rognage = NonNullable<ArticleSource["rognages"]>[string];

/** Même traitement que l'éditeur (deposerImage) : rotation EXIF, 1600 px de large au plus, WebP qualité 82. */
async function deposer(fichier: string, nom: string, rognage?: Rognage): Promise<Image | null> {
  const chemin = join(o.images!, fichier);
  if (!existsSync(chemin)) {
    if (o["sans-images-manquantes"]) return (console.warn(`  ⚠ image absente, omise : ${fichier}`), null);
    throw new Error(`Image absente : ${chemin} (ou relancer avec --sans-images-manquantes)`);
  }
  let image = sharp(chemin).rotate();
  if (rognage) {
    const { width, height } = await image.metadata();
    const hauteur = rognage.hauteur ?? height! - rognage.haut;
    image = sharp(await image.extract({ left: 0, top: rognage.haut, width: width!, height: hauteur }).toBuffer());
  }
  const { data, info } = await image
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });
  const cle = `${nom}-${Date.now().toString(36)}.webp`;
  const { error } = await db.storage.from("blog").upload(cle, data, { contentType: "image/webp" });
  if (error) throw error;
  return { src: `${PREFIXE}${cle}`, largeur: info.width, hauteur: info.height };
}

async function preparer(a: ArticleSource) {
  const md = readFileSync(join(DOSSIER, `${a.slug}.md`), "utf8");
  // Images du corps, déposées avant la conversion (celle-ci est synchrone).
  const deposees = new Map<string, Image | null>();
  for (const [, ref] of md.matchAll(/^!\[[^\]]+\]\(([^)\s]+)/gm)) {
    const [cle, nomSeo] = ref.split("#");
    const [fichier, nomConfig] = (a.images?.[cle] ?? cle).split("#");
    deposees.set(ref, await deposer(fichier, nomSeo || nomConfig || `${a.slug}-image`, a.rognages?.[fichier]));
  }
  const sansManquantes = md.replace(/^!\[[^\]]+\]\(([^)\s]+)[^\n]*\n?/gm, (l, ref) => (deposees.get(ref) ? l : ""));
  const corps = markdownVersDocument(sansManquantes, (ref) => deposees.get(ref)!);
  const erreurs = validerDocument(corps, PREFIXE);
  if (erreurs.length) throw new Error(`${a.slug} : ${erreurs.join(" ")}`);
  const c = a.couverture;
  const fichierCouverture = c && (a.images?.[c.fichier]?.split("#")[0] ?? c.fichier);
  const couverture = c ? await deposer(fichierCouverture!, c.nom, a.rognages?.[fichierCouverture!]) : null;
  return { corps, couverture };
}

function controler(a: ArticleSource) {
  const e: string[] = [];
  if (a.titre_seo.length > 70) e.push(`titre SEO de ${a.titre_seo.length} caractères`);
  if (a.meta_description.length > 160) e.push(`meta description de ${a.meta_description.length} caractères`);
  if (a.extrait.length > 200) e.push(`extrait de ${a.extrait.length} caractères`);
  if (a.lies.length > 3 || a.lies.includes(a.slug)) e.push("articles liés invalides");
  if (e.length) throw new Error(`${a.slug} : ${e.join(", ")}`);
}

async function main() {
  ARTICLES.forEach(controler);
  const { data: auteur, error: errAuteur } = await db
    .from("auteurs_blog")
    .select("id")
    .eq("est_test", false)
    .order("id")
    .limit(1)
    .single();
  if (errAuteur) throw errAuteur;
  const { data: existants } = await db
    .from("articles_blog")
    .select("slug")
    .in(
      "slug",
      ARTICLES.map((a) => a.slug),
    );
  const deja = new Set(existants?.map((x) => x.slug));
  const depart = Date.now();
  for (const [i, a] of ARTICLES.entries()) {
    if (deja.has(a.slug)) {
      console.log(`= ${a.slug} existe déjà, ignoré`);
      continue;
    }
    console.log(`+ ${a.slug}`);
    const { corps, couverture } = await preparer(a);
    const maintenant = new Date(depart + i * 1000).toISOString(); // ordre de publication = ordre du tableau
    const { error } = await db.from("articles_blog").insert({
      slug: a.slug,
      titre: a.titre,
      titre_seo: a.titre_seo,
      meta_description: a.meta_description,
      extrait: a.extrait,
      categorie: a.categorie,
      auteur_id: auteur.id,
      couverture_url: couverture?.src ?? null,
      couverture_alt: couverture ? a.couverture!.alt : null,
      reglementaire: true,
      verifie_le: a.verifie_le,
      corps: corps as never,
      essentiel: a.essentiel,
      a_retenir: a.a_retenir,
      accroche_question: a.accroche.question,
      accroche_phrase: a.accroche.phrase,
      accroche_lien: a.accroche.lien,
      accroche_cible: a.accroche.cible,
      ...(o.publier && {
        statut: "publie" as const,
        publie_le: maintenant,
        audit_valide_le: maintenant,
        audit_note: "Import des articles rédigés hors du site (base de dev).",
      }),
    });
    if (error) throw error;
  }
  // « À lire aussi » : résolu une fois tous les articles présents. Mis à jour aussi pour les articles jamais
  // publiés (brouillons importés), afin qu'ils recommandent les nouveaux ; un article déjà paru n'est jamais touché.
  const { data: ids } = await db
    .from("articles_blog")
    .select("id, slug, publie_le")
    .in(
      "slug",
      ARTICLES.map((a) => a.slug),
    );
  const id = new Map(ids?.map((x) => [x.slug, x.id]));
  const jamaisParus = new Set(ids?.filter((x) => !x.publie_le).map((x) => x.slug));
  for (const a of ARTICLES.filter((x) => !deja.has(x.slug) || jamaisParus.has(x.slug)))
    await db
      .from("articles_blog")
      .update({ lies: a.lies.map((s) => id.get(s)).filter((x): x is string => !!x) })
      .eq("slug", a.slug);
  console.log(`Terminé (${o.env}${o.publier ? ", publiés" : ", brouillons"}).`);
}

await main();
