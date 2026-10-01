"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { CATEGORIES_BLOG, libelleCategorie } from "@/contenu/securite-privee/blog";

type Ligne = { id: string; titre: string; categorie: string; statut: string; auteur: string | null; modifieLe: string };

const STATUTS: Record<string, { libelle: string; classe: string; point: string }> = {
  publie: { libelle: "Publié", classe: "border-solid border-ink-900 bg-white text-ink-900", point: "bg-brique-700" },
  brouillon: {
    libelle: "Brouillon",
    classe: "border-dashed border-ink-200 bg-cream-100 text-ink-500",
    point: "bg-ink-200",
  },
  depublie: {
    libelle: "Dépublié",
    classe: "border-dashed border-brique-700 bg-white text-brique-700",
    point: "bg-transparent",
  },
};
const sansAccent = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

/** « Aujourd'hui · 14:05 », « Hier · 09:12 », sinon la date (maquette « Blog Admin »). */
function quand(iso: string) {
  const d = new Date(iso);
  const jour = (x: Date) => new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(x);
  const hm = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(
    d,
  );
  if (jour(d) === jour(new Date())) return `Aujourd'hui · ${hm}`;
  if (jour(d) === jour(new Date(Date.now() - 86_400_000))) return `Hier · ${hm}`;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(d);
}

/** Liste des articles (UX Blog admin §2) : recherche, statut, catégorie, tri par dernière modification. */
export function ListeArticles({
  articles,
  creerArticle,
}: {
  articles: Ligne[];
  creerArticle: () => Promise<{ vers: string } | { erreur: string }>;
}) {
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState("");
  const [cat, setCat] = useState("");
  const [asc, setAsc] = useState(false);
  const [erreur, setErreur] = useState("");
  const [enCours, demarrer] = useTransition();
  const lignes = useMemo(() => {
    const nq = sansAccent(q.trim());
    return articles
      .filter(
        (a) =>
          (!statut || a.statut === statut) &&
          (!cat || a.categorie === cat) &&
          (!nq || sansAccent(a.titre).includes(nq)),
      )
      .sort((a, b) => (asc ? 1 : -1) * a.modifieLe.localeCompare(b.modifieLe));
  }, [articles, q, statut, cat, asc]);
  const filtres = !!(q || statut || cat);
  const th =
    "border-b border-line px-3 py-2.5 text-left font-mono text-[10px] font-medium tracking-[0.1em] text-ink-400 uppercase";
  const td = "border-b border-[#F0ECE6] px-3 py-3.5";

  return (
    <>
      <section className="sticky top-[84px] z-20 flex flex-wrap items-center gap-2.5 rounded-3xl border border-line bg-white p-3 shadow-[0_10px_24px_-20px_rgba(11,11,11,0.35)]">
        <label className="flex min-w-0 flex-[1_1_260px] items-center gap-3 rounded-full border border-line-strong bg-cream-100 px-[18px]">
          <span aria-hidden="true" className="block size-[11px] flex-none rounded-full border-[1.5px] border-ink-300" />
          <input
            type="search"
            aria-label="Rechercher par titre"
            placeholder="Rechercher par titre"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="min-w-0 flex-1 bg-transparent py-3 text-[14.5px] outline-none"
          />
        </label>
        <span
          role="group"
          aria-label="Statut"
          className="flex gap-[3px] rounded-full border border-line bg-cream-100 p-[3px]"
        >
          {[
            ["", "Tous"],
            ["brouillon", "Brouillons"],
            ["publie", "Publiés"],
            ["depublie", "Dépubliés"],
          ].map(([k, l]) => (
            <button
              key={k}
              type="button"
              aria-pressed={statut === k}
              onClick={() => setStatut(k)}
              className={`cursor-pointer rounded-full px-[13px] py-[9px] text-[13px] font-bold whitespace-nowrap ${statut === k ? "bg-ink-900 text-white" : "text-ink-700"}`}
            >
              {l}
            </button>
          ))}
        </span>
        <select
          aria-label="Catégorie"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-full border border-line bg-cream-100 px-3.5 py-[11px] text-[13.5px] font-semibold outline-none"
        >
          <option value="">Toutes les catégories</option>
          {CATEGORIES_BLOG.map((c) => (
            <option key={c.cle} value={c.cle}>
              {c.libelle}
            </option>
          ))}
        </select>
        {filtres && (
          <button
            type="button"
            onClick={() => (setQ(""), setStatut(""), setCat(""))}
            className="cursor-pointer px-1.5 py-2 text-[13.5px] font-bold text-brique-700"
          >
            Réinitialiser
          </button>
        )}
        <button
          type="button"
          disabled={enCours}
          onClick={() =>
            demarrer(async () => {
              const r = await creerArticle();
              if ("vers" in r) window.location.assign(r.vers);
              else setErreur(r.erreur);
            })
          }
          className="ml-auto inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-brique-700 px-5 py-3 text-sm font-bold whitespace-nowrap text-white hover:bg-ink-900 disabled:cursor-wait"
        >
          <span aria-hidden="true" className="text-lg leading-none font-medium">
            +
          </span>
          Nouvel article
        </button>
      </section>
      {erreur && (
        <p role="alert" className="text-sm font-bold text-brique-700">
          {erreur}
        </p>
      )}

      <section className="flex flex-col gap-2.5 rounded-[28px] border border-line bg-white p-[clamp(14px,2vw,22px)]">
        <span className="flex flex-wrap items-center justify-between gap-2 px-1.5 py-1">
          <h2 className="text-[15px] font-bold">
            {lignes.length === articles.length
              ? `${articles.length} article${articles.length > 1 ? "s" : ""}`
              : `${lignes.length} sur ${articles.length} articles`}
          </h2>
          <span className="font-mono text-[11px] text-ink-400">
            Tri : {asc ? "modification la plus ancienne" : "modification la plus récente"}
          </span>
        </span>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-[13.5px]">
            <thead>
              <tr>
                <th className={th}>Titre</th>
                <th className={th}>Catégorie</th>
                <th className={th}>Statut</th>
                <th className={th}>Auteur</th>
                <th className={`${th} text-right`}>
                  <button
                    type="button"
                    onClick={() => setAsc(!asc)}
                    className="cursor-pointer font-mono text-[10px] tracking-[0.1em] text-ink-900 uppercase"
                  >
                    Dernière modification {asc ? "↑" : "↓"}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((a) => {
                const st = STATUTS[a.statut] ?? STATUTS.brouillon;
                return (
                  <tr key={a.id}>
                    <td className={`${td} max-w-[520px]`}>
                      <Link
                        href={`/blog/${a.id}/`}
                        className="text-[15px] leading-[1.35] font-bold text-pretty text-ink-900"
                      >
                        {a.titre}
                      </Link>
                    </td>
                    <td className={`${td} whitespace-nowrap text-ink-700`}>{libelleCategorie(a.categorie)}</td>
                    <td className={td}>
                      <span
                        className={`inline-flex items-center gap-[7px] rounded-full border-[1.5px] py-1 pr-[11px] pl-[9px] text-[12.5px] font-bold whitespace-nowrap ${st.classe}`}
                      >
                        <span aria-hidden="true" className={`block size-[7px] rounded-full ${st.point}`} />
                        {st.libelle}
                      </span>
                    </td>
                    <td className={`${td} whitespace-nowrap`}>{a.auteur ?? "—"}</td>
                    <td className={`${td} text-right font-mono text-[12.5px] whitespace-nowrap text-ink-700`}>
                      {quand(a.modifieLe)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {lignes.length === 0 && (
          <div className="flex justify-center rounded-[18px] border-[1.5px] border-dashed border-line-heavy bg-[repeating-linear-gradient(135deg,var(--color-cream-200)_0_7px,var(--color-white)_7px_14px)] p-7">
            <span className="rounded-xl bg-white px-3.5 py-2.5 text-sm text-ink-700">
              {articles.length === 0 ? "Aucun article pour l'instant." : "Aucun article ne correspond à ces critères."}
            </span>
          </div>
        )}
      </section>
    </>
  );
}
