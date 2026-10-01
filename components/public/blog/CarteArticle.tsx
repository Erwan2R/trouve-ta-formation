import Link from "next/link";
import { BLOG, libelleCategorie, MOTS_PAR_MINUTE } from "@/contenu/securite-privee/blog";
import { dateLongue } from "@/lib/format-date";
import { cheminArticle, type Article } from "@/lib/supabase/queries/blog";
import { fr } from "@/lib/typo";

export const minutesDeLecture = (mots: number) => Math.max(1, Math.round(mots / MOTS_PAR_MINUTE));

/**
 * Carte d'article (Copy blog §3, bloc 5) : catégorie · titre · extrait rédigé · date · temps de lecture.
 * Toute la carte est un lien dont le titre est l'ancre. `data-categorie` : filtre côté client de la page liste.
 */
export function CarteArticle({ article: a, grand = false }: { article: Article; grand?: boolean }) {
  return (
    <Link
      href={cheminArticle(a.slug)}
      data-categorie={a.categorie}
      className={`group flex h-full flex-col gap-3 rounded-[22px] border border-line bg-white text-ink-900 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ink-900 hover:text-ink-900 ${grand ? "p-[clamp(24px,3.4vw,44px)]" : "p-[22px]"}`}
    >
      <span className="inline-flex items-center gap-2 self-start rounded-full bg-cream-200 px-3 py-[5px] font-mono text-[10.5px] tracking-[0.1em] text-ink-600 uppercase">
        <span aria-hidden="true" className="block size-1.5 rounded-full bg-brique-700" />
        {libelleCategorie(a.categorie)}
      </span>
      <span
        className={
          grand
            ? "max-w-[30ch] text-[clamp(26px,3.2vw,40px)] leading-[1.08] font-bold tracking-[-0.03em] text-balance"
            : "text-[19px] leading-[1.25] font-bold tracking-[-0.015em] text-balance"
        }
      >
        {fr(a.titre)}
      </span>
      {a.extrait && (
        <span
          className={`text-pretty text-ink-500 ${grand ? "max-w-[60ch] text-[17px] leading-[1.6]" : "text-[15px] leading-[1.55]"}`}
        >
          {fr(a.extrait)}
        </span>
      )}
      <span className="mt-auto flex flex-wrap gap-x-2.5 gap-y-1 pt-1 font-mono text-[12px] text-ink-400">
        {a.publie_le && <time dateTime={a.publie_le}>{dateLongue(a.publie_le)}</time>}
        <span aria-hidden="true">·</span>
        <span>{BLOG.article.lecture(minutesDeLecture(a.mots))}</span>
      </span>
    </Link>
  );
}
