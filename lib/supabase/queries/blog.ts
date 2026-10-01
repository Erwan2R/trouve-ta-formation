import "server-only";
import { cache } from "react";
import { compterMots, type Noeud } from "@/lib/blog/document";
import { VERTICALES } from "@/lib/config/verticales";
import { EST_PRODUCTION } from "@/lib/env";
import { supabasePublic } from "../client";
import type { Tables } from "../types";
import { getDemarches } from "./demarches";
import { getDepartements, getTitres } from "./referentiel";

export type Auteur = Pick<Tables<"auteurs_blog">, "id" | "nom" | "qualification" | "biographie" | "photo_url">;
/** `mots` : calculé depuis le corps (temps de lecture, seuil de la table des matières), jamais saisi. */
export type Article = Omit<Tables<"articles_blog">, "corps"> & { corps: Noeud; mots: number; auteur: Auteur | null };

const BLOG = `/${VERTICALES["securite-privee"].slug}/blog/`;
export const cheminArticle = (slug: string) => `${BLOG}${slug}/`;

/**
 * Articles publiés (RLS : statut « publie »), du plus récent au plus ancien (UX blog §3.5).
 * Production : jamais d'article ni d'auteur de démonstration.
 */
export const getArticles = cache(async (): Promise<Article[]> => {
  let requete = supabasePublic()
    .from("articles_blog")
    .select("*, auteur:auteurs_blog (id, nom, qualification, biographie, photo_url, est_test)")
    .order("publie_le", { ascending: false });
  if (EST_PRODUCTION) requete = requete.eq("est_test", false);
  const { data, error } = await requete;
  if (error) throw error;
  return data.map(({ auteur, ...a }) => ({
    ...a,
    corps: a.corps as unknown as Noeud,
    mots: compterMots(a.corps as unknown as Noeud),
    auteur: auteur && !(EST_PRODUCTION && auteur.est_test) ? auteur : null,
  }));
});

export async function getArticle(slug: string): Promise<Article | null> {
  return (await getArticles()).find((a) => a.slug === slug) ?? null;
}

/**
 * Pages internes vers lesquelles un article peut renvoyer (liens du corps, accroche, remplacement), visibles dans
 * cet environnement. Seule source de vérité : un lien vers une page absente s'affiche en texte simple, jamais en 404.
 */
export const getPagesInternes = cache(async () => {
  const verticale = VERTICALES["securite-privee"];
  const base = `/${verticale.slug}/`;
  const [titres, { demarches, listeVisible }, departements, articles] = await Promise.all([
    getTitres(),
    getDemarches(verticale),
    getDepartements(),
    getArticles(),
  ]);
  return [
    ...titres
      .filter((t) => t.a_une_page)
      .map((t) => ({ type: "Formation", libelle: `${t.libelle_court} · ${t.libelle_long}`, chemin: `${base}${t.slug}/` })),
    ...demarches
      .filter((d) => d.a_une_page)
      .map((d) => ({ type: "Démarche", libelle: d.libelle, chemin: `${base}demarches/${d.slug}/` })),
    ...(listeVisible ? [{ type: "Démarche", libelle: "Toutes les démarches", chemin: `${base}demarches/` }] : []),
    { type: "Organismes", libelle: "Tous les organismes d'Île-de-France", chemin: `${base}organismes/` },
    ...departements
      .filter((d) => d.a_une_page)
      .map((d) => ({ type: "Département", libelle: d.nom, chemin: `${base}${d.slug}/` })),
    { type: "Formulaire", libelle: "Trouver ma formation (questionnaire)", chemin: `${base}formulaire/` },
    ...articles.map((a) => ({ type: "Article", libelle: a.titre, chemin: cheminArticle(a.slug) })),
  ];
});

export async function getCheminsVisibles(): Promise<Set<string>> {
  return new Set((await getPagesInternes()).map((p) => p.chemin));
}
