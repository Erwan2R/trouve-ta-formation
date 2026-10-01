import type { Metadata } from "next";
import { ListeArticles } from "@/components/admin/blog/ListeArticles";
import { exigerAdmin } from "@/lib/admin-serveur";
import { getArticlesAdmin } from "@/lib/supabase/queries/admin";
import { creerArticle } from "./actions";

export const metadata: Metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function BlogAdmin() {
  await exigerAdmin();
  const articles = await getArticlesAdmin();
  const n = (s: string) => articles.filter((a) => a.statut === s).length;
  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-[clamp(6px,1vw,12px)] pt-[clamp(18px,3vw,36px)] pb-[clamp(4px,1vw,10px)]">
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">
            Espace admin · /securite-privee/blog/
          </span>
          <h1 className="text-[clamp(34px,4.6vw,60px)] leading-[0.98] font-extrabold tracking-[-0.045em]">
            Articles du blog
          </h1>
        </div>
        <span className="flex flex-wrap items-baseline gap-x-[22px] gap-y-1.5">
          <span className="flex items-baseline gap-2">
            <span className="font-mono text-[34px] tracking-[-0.04em]">{n("publie")}</span>
            <span className="text-[15px] font-bold">publiés</span>
          </span>
          <span className="flex items-baseline gap-2">
            <span className="font-mono text-[34px] tracking-[-0.04em] text-ink-400">{n("brouillon")}</span>
            <span className="text-[15px] font-bold text-ink-500">brouillons</span>
          </span>
        </span>
      </section>
      <ListeArticles
        articles={articles.map((a) => ({
          id: a.id,
          titre: a.titre,
          categorie: a.categorie,
          statut: a.statut,
          auteur: a.auteur?.nom ?? null,
          modifieLe: a.updated_at,
        }))}
        creerArticle={creerArticle}
      />
    </>
  );
}
