import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditeurArticle } from "@/components/admin/blog/EditeurArticle";
import { exigerAdmin } from "@/lib/admin-serveur";
import type { Noeud } from "@/lib/blog/document";
import { EST_PRODUCTION } from "@/lib/env";
import { getArticleAdmin, getArticlesAdmin, getAuteurs } from "@/lib/supabase/queries/admin";
import { getPagesInternes } from "@/lib/supabase/queries/blog";
import * as actions from "../actions";

export const metadata: Metadata = { title: "Éditeur d'article" };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function PageEditeur({ params }: Props) {
  await exigerAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [article, auteurs, pages, tous] = await Promise.all([
    getArticleAdmin(id),
    getAuteurs(),
    getPagesInternes(),
    getArticlesAdmin(),
  ]);
  if (!article) notFound();
  return (
    <EditeurArticle
      article={{ ...article, corps: article.corps as unknown as Noeud }}
      auteurs={auteurs.filter((a) => !(EST_PRODUCTION && a.est_test))}
      pages={pages}
      autres={tous
        .filter((a) => a.id !== id)
        .map((a) => ({ id: a.id, titre: a.titre, categorie: a.categorie, publie: a.statut === "publie" }))}
      actions={{ ...actions }}
    />
  );
}
