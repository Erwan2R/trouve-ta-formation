"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { CATEGORIES_BLOG } from "@/contenu/securite-privee/blog";
import { exigerAdmin } from "@/lib/admin-serveur";
import type { Noeud } from "@/lib/blog/document";
import { lienValide, slugArticle, validerDocument } from "@/lib/blog/validation";
import { supabaseAdmin } from "@/lib/supabase/serveur";
import type { Json } from "@/lib/supabase/types";

const ECHEC = "L'opération a échoué. Réessayez dans un instant.";
const BLOG = "/securite-privee/blog/";
const prefixeImages = () => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog/`;
const heure = () =>
  new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(new Date());

export type RetourBlog = { ok: true; heure: string; message?: string } | { ok: false; erreurs: string[] };

/** Champs saisis dans l'éditeur. Dates, statut et temps de lecture ne sont jamais saisis (UX Blog admin §3.1). */
export type SaisieArticle = {
  titre: string;
  titre_seo: string;
  meta_description: string;
  slug: string;
  extrait: string;
  categorie: string;
  auteur_id: number | null;
  couverture_url: string | null;
  couverture_alt: string;
  couverture_legende: string;
  reglementaire: boolean;
  verifie_le: string | null;
  corps: Noeud;
  essentiel: string[];
  a_retenir: string[];
  accroche_question: string;
  accroche_phrase: string;
  accroche_lien: string;
  accroche_cible: string | null;
  lies: string[];
  mis_en_avant: boolean;
  audit_ok: boolean;
  audit_note: string;
};

const vide = (s: string) => s.trim() || null;

// Un article publié alimente la liste, l'accueil du blog, les articles liés et le sitemap.
function rafraichir(slugs: string[]) {
  revalidatePath(BLOG);
  for (const s of slugs) revalidatePath(`${BLOG}${s}/`);
  revalidatePath("/sitemap.xml");
}

/** Nouvel article : un brouillon vide, ouvert aussitôt dans l'éditeur. */
export async function creerArticle(): Promise<{ vers: string } | { erreur: string }> {
  await exigerAdmin();
  const admin = supabaseAdmin();
  const { data: auteur } = await admin
    .from("auteurs_blog")
    .select("id")
    .eq("est_test", false)
    .order("id")
    .limit(1)
    .maybeSingle();
  const { data, error } = await admin
    .from("articles_blog")
    .insert({
      titre: "Nouvel article",
      slug: `brouillon-${Date.now().toString(36)}`,
      categorie: CATEGORIES_BLOG[0].cle,
      auteur_id: auteur?.id ?? null,
    })
    .select("id")
    .single();
  if (error) {
    console.error("Nouvel article :", error.message);
    return { erreur: ECHEC };
  }
  return { vers: `/blog/${data.id}/` };
}

/**
 * Enregistrement (brouillon) ou publication / mise à jour en ligne. La publication exige les champs vus par le
 * lecteur et les moteurs, et l'audit anti-concurrence (UX blog §6). Slug modifié après publication : l'ancienne
 * adresse redirige (301). Date de publication au premier passage en ligne ; date de mise à jour ensuite.
 */
export async function enregistrerArticle(id: string, s: SaisieArticle, publier: boolean): Promise<RetourBlog> {
  await exigerAdmin();
  const admin = supabaseAdmin();
  const { data: avant } = await admin
    .from("articles_blog")
    .select("slug, statut, publie_le, audit_valide_le")
    .eq("id", id)
    .maybeSingle();
  if (!avant) return { ok: false, erreurs: [ECHEC] };

  const slug = slugArticle(s.slug || s.titre);
  const erreurs: string[] = [];
  if (s.titre.trim().length < 2) erreurs.push("Le titre est obligatoire.");
  if (!slug || slug === "article-retire") erreurs.push("Choisissez une autre adresse (slug).");
  if (!CATEGORIES_BLOG.some((c) => c.cle === s.categorie)) erreurs.push("Choisissez une catégorie.");
  if (s.titre_seo.length > 70) erreurs.push("Le titre SEO dépasse 70 caractères.");
  if (s.meta_description.length > 160) erreurs.push("La meta description dépasse 160 caractères.");
  if (s.extrait.length > 200) erreurs.push("L'extrait dépasse 200 caractères.");
  if (s.couverture_url && !s.couverture_url.startsWith(prefixeImages())) erreurs.push("Image de couverture invalide.");
  if (s.couverture_url && !s.couverture_alt.trim())
    erreurs.push("L'image de couverture doit avoir un texte alternatif.");
  if (s.accroche_cible && !lienValide(s.accroche_cible)) erreurs.push("Page de l'accroche invalide.");
  erreurs.push(...validerDocument(s.corps, prefixeImages()));
  const { data: pris } = await admin.from("articles_blog").select("id").eq("slug", slug).neq("id", id).maybeSingle();
  if (pris) erreurs.push("Un autre article utilise déjà cette adresse.");

  const enLigne = publier || avant.statut === "publie";
  if (enLigne) {
    if (s.titre.trim().length > 60 && !s.titre_seo.trim())
      erreurs.push("Le titre dépasse 60 caractères : saisissez un titre SEO plus court.");
    if (!s.meta_description.trim()) erreurs.push("La meta description est obligatoire pour publier.");
    if (!s.extrait.trim()) erreurs.push("L'extrait est obligatoire pour publier.");
    if (!s.auteur_id) erreurs.push("Choisissez un auteur.");
    if (s.reglementaire && !s.verifie_le) erreurs.push("Un article réglementaire doit avoir une date de vérification.");
    if (!s.audit_ok) erreurs.push("Validez l'audit anti-concurrence avant de publier.");
  }
  if (erreurs.length) return { ok: false, erreurs };

  const maintenant = new Date().toISOString();
  if (s.mis_en_avant)
    await admin.from("articles_blog").update({ mis_en_avant: false }).neq("id", id).eq("mis_en_avant", true);
  const { error } = await admin
    .from("articles_blog")
    .update({
      titre: s.titre.trim(),
      titre_seo: vide(s.titre_seo),
      meta_description: vide(s.meta_description),
      slug,
      extrait: vide(s.extrait),
      categorie: s.categorie,
      auteur_id: s.auteur_id,
      couverture_url: s.couverture_url,
      couverture_alt: vide(s.couverture_alt),
      couverture_legende: vide(s.couverture_legende),
      reglementaire: s.reglementaire,
      verifie_le: s.reglementaire ? s.verifie_le : null,
      corps: s.corps as unknown as Json,
      essentiel: s.essentiel.map((x) => x.trim()).filter(Boolean),
      a_retenir: s.a_retenir.map((x) => x.trim()).filter(Boolean),
      accroche_question: vide(s.accroche_question),
      accroche_phrase: vide(s.accroche_phrase),
      accroche_lien: vide(s.accroche_lien),
      accroche_cible: s.accroche_cible,
      lies: s.lies.filter((x) => x !== id).slice(0, 3),
      mis_en_avant: s.mis_en_avant,
      audit_valide_le: s.audit_ok ? (avant.audit_valide_le ?? maintenant) : null,
      audit_note: vide(s.audit_note),
      ...(publier && avant.statut !== "publie" && { statut: "publie" as const, remplacement: null }),
      ...(enLigne && !avant.publie_le && { publie_le: maintenant }),
      ...(enLigne && avant.publie_le && { maj_le: maintenant }),
    })
    .eq("id", id);
  if (error) {
    console.error("Article :", error.message);
    return { ok: false, erreurs: [ECHEC] };
  }
  // Ancienne adresse d'un article déjà paru : redirection permanente vers la nouvelle.
  if (avant.publie_le && avant.slug !== slug)
    await admin.from("articles_blog_anciens_slugs").upsert({ slug: avant.slug, article_id: id });
  await admin.from("articles_blog_anciens_slugs").delete().eq("slug", slug);
  if (enLigne || avant.statut !== "brouillon") rafraichir([avant.slug, slug]);
  return {
    ok: true,
    heure: heure(),
    message:
      publier && avant.statut !== "publie"
        ? "Article publié."
        : enLigne
          ? "Article mis à jour en ligne."
          : "Brouillon enregistré.",
  };
}

/** Dépublication (décision Erwan) : page de remplacement → 301 ; sinon 410. L'article reste modifiable et republiable. */
export async function depublierArticle(id: string, remplacement: string | null): Promise<RetourBlog> {
  await exigerAdmin();
  if (remplacement && !/^\/[a-z0-9\-/]*$/.test(remplacement))
    return { ok: false, erreurs: ["Page de remplacement invalide."] };
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("articles_blog")
    .update({ statut: "depublie", remplacement, mis_en_avant: false })
    .eq("id", id)
    .eq("statut", "publie")
    .select("slug")
    .maybeSingle();
  if (error || !data) return { ok: false, erreurs: [ECHEC] };
  rafraichir([data.slug]);
  return {
    ok: true,
    heure: heure(),
    message: remplacement
      ? "Article dépublié : son adresse redirige vers la page choisie."
      : "Article dépublié : son adresse répond « supprimé » (410).",
  };
}

/** Brouillon jamais publié : supprimable (aucune adresse publique à préserver). */
export async function supprimerBrouillon(id: string): Promise<{ vers: string } | { erreur: string }> {
  await exigerAdmin();
  const { data } = await supabaseAdmin()
    .from("articles_blog")
    .delete()
    .eq("id", id)
    .eq("statut", "brouillon")
    .is("publie_le", null)
    .select("id")
    .maybeSingle();
  return data ? { vers: "/blog/" } : { erreur: "Seul un brouillon jamais publié peut être supprimé." };
}

/**
 * Image (couverture ou corps) : nom de fichier choisi (slug propre), convertie en WebP, 1600 px de large au plus.
 * Le texte alternatif est exigé par l'éditeur avant l'insertion.
 */
export async function deposerImage(
  donnees: FormData,
): Promise<{ ok: true; url: string; largeur: number; hauteur: number } | { ok: false; erreur: string }> {
  await exigerAdmin();
  const fichier = donnees.get("image");
  const nom = slugArticle(String(donnees.get("nom") ?? "")) || "image";
  if (!(fichier instanceof File) || fichier.size === 0) return { ok: false, erreur: "Choisissez une image." };
  if (!/^image\/(png|jpeg|webp)$/.test(fichier.type))
    return { ok: false, erreur: "Formats acceptés : JPG, PNG, WebP." };
  if (fichier.size > 2.5 * 1024 * 1024) return { ok: false, erreur: "L'image dépasse 2,5 Mo." };
  let sortie: { data: Buffer; info: { width: number; height: number } };
  try {
    sortie = await sharp(Buffer.from(await fichier.arrayBuffer()))
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    return { ok: false, erreur: "Ce fichier n'a pas pu être lu comme une image." };
  }
  const chemin = `${nom}-${Date.now().toString(36)}.webp`;
  const admin = supabaseAdmin();
  const { error } = await admin.storage.from("blog").upload(chemin, sortie.data, { contentType: "image/webp" });
  if (error) {
    console.error("Image du blog :", error.message);
    return { ok: false, erreur: ECHEC };
  }
  return {
    ok: true,
    url: admin.storage.from("blog").getPublicUrl(chemin).data.publicUrl,
    largeur: sortie.info.width,
    hauteur: sortie.info.height,
  };
}
