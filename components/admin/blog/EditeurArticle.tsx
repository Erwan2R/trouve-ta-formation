"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { RetourBlog, SaisieArticle } from "@/app/admin/(connecte)/blog/actions";
import { BLOG, CATEGORIES_BLOG, MOTS_PAR_MINUTE, SEUIL_MOTS_SOMMAIRE } from "@/contenu/securite-privee/blog";
import { ancres, compterMots, type Noeud, problemesHierarchie } from "@/lib/blog/document";
import { liensInternes, slugArticle } from "@/lib/blog/validation";
import type { Tables } from "@/lib/supabase/types";
import { EXTENSIONS, VARIANTES_CALLOUT } from "./extensions";

type Page = { type: string; libelle: string; chemin: string };
type Autre = { id: string; titre: string; categorie: string; publie: boolean };
type Auteur = { id: number; nom: string; qualification: string };
type Actions = {
  enregistrerArticle: (id: string, s: SaisieArticle, publier: boolean) => Promise<RetourBlog>;
  depublierArticle: (id: string, remplacement: string | null) => Promise<RetourBlog>;
  supprimerBrouillon: (id: string) => Promise<{ vers: string } | { erreur: string }>;
  deposerImage: (
    d: FormData,
  ) => Promise<{ ok: true; url: string; largeur: number; hauteur: number } | { ok: false; erreur: string }>;
};

const carte = "flex flex-col gap-5 rounded-[26px] border border-line bg-white p-[clamp(20px,2.6vw,30px)]";
const surtitre = "font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase";
const champ =
  "w-full rounded-[14px] border border-line-strong bg-cream-100 px-3.5 py-3 text-[15px] text-ink-900 outline-none focus:border-ink-900";
const label = "text-[13px] font-bold";
const bOutil =
  "cursor-pointer rounded-[10px] px-2.5 py-2 text-[13px] font-bold text-ink-900 hover:bg-cream-200 disabled:cursor-not-allowed disabled:text-ink-200 aria-pressed:bg-ink-900 aria-pressed:text-white";
const bContour =
  "cursor-pointer rounded-full border border-line-strong bg-white px-4 py-3 text-[13.5px] font-bold whitespace-nowrap text-ink-900 hover:border-ink-900";
const bPlein =
  "cursor-pointer rounded-full px-5 py-3 text-[13.5px] font-bold whitespace-nowrap text-white disabled:cursor-not-allowed disabled:bg-line-heavy";

function Compteur({ n, max }: { n: number; max: number }) {
  return (
    <span className={`font-mono text-[11px] ${n > max ? "text-brique-700" : "text-ink-400"}`}>{`${n} / ${max}`}</span>
  );
}

function Modale({
  titre,
  sous,
  onFermer,
  children,
}: {
  titre: string;
  sous?: string;
  onFermer: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const echap = (e: KeyboardEvent) => e.key === "Escape" && onFermer();
    document.addEventListener("keydown", echap);
    return () => document.removeEventListener("keydown", echap);
  }, [onFermer]);
  return (
    <div onClick={onFermer} className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/55 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titre}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-[560px] flex-col gap-4 overflow-y-auto rounded-[28px] bg-white p-[clamp(22px,3vw,30px)] shadow-menu"
      >
        <span className="flex flex-col gap-1.5">
          <span className="text-[22px] font-extrabold tracking-[-0.025em]">{titre}</span>
          {sous && <span className="text-sm leading-[1.55] text-ink-500">{sous}</span>}
        </span>
        {children}
      </div>
    </div>
  );
}

/** Sélection d'une page interne du site (jamais d'adresse interne saisie à la main, UX Blog admin §3.4). */
function ChoixPage({ pages, valeur, onChoix }: { pages: Page[]; valeur: string | null; onChoix: (c: string) => void }) {
  const [q, setQ] = useState("");
  const n = q.toLowerCase();
  const liste = pages.filter((p) => !n || `${p.type} ${p.libelle} ${p.chemin}`.toLowerCase().includes(n));
  return (
    <div className="flex flex-col gap-2.5">
      <input
        type="search"
        placeholder="Rechercher une page"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className={champ}
      />
      <div className="flex max-h-[300px] flex-col gap-1 overflow-y-auto">
        {liste.map((p) => (
          <button
            key={p.chemin}
            type="button"
            onClick={() => onChoix(p.chemin)}
            className={`flex cursor-pointer items-center gap-3 rounded-[14px] border-[1.5px] px-3.5 py-2.5 text-left ${valeur === p.chemin ? "border-ink-900 bg-white" : "border-transparent bg-cream-100"}`}
          >
            <span className="w-[86px] flex-none font-mono text-[10px] tracking-[0.08em] text-brique-700 uppercase">
              {p.type}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-sm font-bold">{p.libelle}</span>
              <span className="font-mono text-[11px] break-all text-ink-500">{p.chemin}</span>
            </span>
          </button>
        ))}
        {liste.length === 0 && (
          <span className="px-1 py-2.5 text-[13.5px] text-ink-500">Aucune page ne correspond.</span>
        )}
      </div>
    </div>
  );
}

/**
 * Éditeur d'article (UX Blog admin §3, maquette « Editeur Article ») : métadonnées, corps enrichi (Tiptap), blocs de
 * fin, accroche contextuelle, articles liés, audit anti-concurrence, publication et dépublication.
 */
export function EditeurArticle({
  article: a,
  auteurs,
  pages,
  autres,
  actions,
}: {
  article: Omit<Tables<"articles_blog">, "corps"> & { corps: Noeud };
  auteurs: Auteur[];
  pages: Page[];
  autres: Autre[];
  actions: Actions;
}) {
  const [s, setS] = useState<SaisieArticle>(() => ({
    titre: a.titre,
    titre_seo: a.titre_seo ?? "",
    meta_description: a.meta_description ?? "",
    slug: a.slug,
    extrait: a.extrait ?? "",
    categorie: a.categorie,
    auteur_id: a.auteur_id,
    couverture_url: a.couverture_url,
    couverture_alt: a.couverture_alt ?? "",
    couverture_legende: a.couverture_legende ?? "",
    reglementaire: a.reglementaire,
    verifie_le: a.verifie_le,
    corps: a.corps,
    essentiel: a.essentiel.length ? a.essentiel : ["", "", ""],
    a_retenir: a.a_retenir.length ? a.a_retenir : ["", "", ""],
    accroche_question: a.accroche_question ?? "",
    accroche_phrase: a.accroche_phrase ?? "",
    accroche_lien: a.accroche_lien ?? "",
    accroche_cible: a.accroche_cible,
    lies: a.lies,
    mis_en_avant: a.mis_en_avant,
    audit_ok: !!a.audit_valide_le,
    audit_note: a.audit_note ?? "",
  }));
  const [statut, setStatut] = useState(a.statut);
  const [modifie, setModifie] = useState(false);
  const [slugManuel, setSlugManuel] = useState(!a.slug.startsWith("brouillon-"));
  const [erreurs, setErreurs] = useState<string[]>([]);
  const [enregistre, setEnregistre] = useState("");
  const [toast, setToast] = useState("");
  const [modale, setModale] = useState<null | "lien" | "image" | "couverture" | "depublier" | "publier">(null);
  const [menuCallout, setMenuCallout] = useState(false);
  const [enCours, demarrer] = useTransition();
  const maj = (p: Partial<SaisieArticle>) => (setS((x) => ({ ...x, ...p })), setModifie(true));

  const editeur = useEditor({
    extensions: EXTENSIONS,
    content: a.corps,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-editeur min-h-[320px] max-w-[760px] px-[clamp(12px,2vw,28px)] py-5 text-[17px] leading-[1.7] text-ink-700 outline-none",
      },
    },
    // Copie en JSON pur : certains objets de Tiptap ne se transmettent pas tels quels à une action serveur.
    onUpdate: ({ editor }) => maj({ corps: JSON.parse(JSON.stringify(editor.getJSON())) as Noeud }),
  });
  const etat = useEditorState({
    editor: editeur,
    selector: ({ editor }) => ({
      gras: !!editor?.isActive("bold"),
      lien: !!editor?.isActive("link"),
      h2: !!editor?.isActive("heading", { level: 2 }),
      h3: !!editor?.isActive("heading", { level: 3 }),
      tableau: !!editor?.isActive("table"),
      selection: !!editor && !editor.state.selection.empty,
    }),
  });

  // Quitter la page avec des modifications non enregistrées : demande de confirmation du navigateur.
  useEffect(() => {
    const avertir = (e: BeforeUnloadEvent) => modifie && e.preventDefault();
    window.addEventListener("beforeunload", avertir);
    return () => window.removeEventListener("beforeunload", avertir);
  }, [modifie]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  const mots = useMemo(() => compterMots(s.corps), [s.corps]);
  const sommaire = useMemo(() => ancres(s.corps), [s.corps]);
  const nbCallouts = useMemo(() => JSON.stringify(s.corps).split('"type":"callout"').length - 1, [s.corps]);
  const hierarchie = problemesHierarchie(s.corps);
  const minutes = Math.max(1, Math.round(mots / MOTS_PAR_MINUTE));
  const structurantes = new Set(
    pages.filter((p) => p.type === "Formation" || p.type === "Démarche").map((p) => p.chemin),
  );
  const maillage =
    liensInternes(s.corps).some((l) => structurantes.has(l)) ||
    (!!s.accroche_cible && structurantes.has(s.accroche_cible));
  const auteur = auteurs.find((x) => x.id === s.auteur_id);
  const enLigne = statut === "publie";
  const suggestions = autres.filter((x) => x.publie && x.categorie === s.categorie && !s.lies.includes(x.id));

  const lancer = (publier: boolean) =>
    demarrer(async () => {
      const r = await actions.enregistrerArticle(a.id, s, publier);
      if (!r.ok) return (setErreurs(r.erreurs), setModale(null), window.scrollTo({ top: 0, behavior: "smooth" }));
      setErreurs([]);
      setModifie(false);
      setEnregistre(r.heure);
      setModale(null);
      if (publier) setStatut("publie");
      setS((x) => ({ ...x, slug: slugArticle(x.slug || x.titre) }));
      if (r.message) setToast(r.message);
    });

  return (
    <>
      {/* Barre de publication */}
      <div className="sticky top-[84px] z-[25] flex flex-wrap items-center gap-x-3.5 gap-y-2 rounded-full border border-line bg-white py-[7px] pr-[7px] pl-[18px] shadow-[0_10px_24px_-20px_rgba(11,11,11,0.35)]">
        <Link href="/blog/" className="text-[13.5px] font-bold whitespace-nowrap text-ink-900">
          ← Articles
        </Link>
        <span aria-hidden="true" className="block h-[22px] w-px bg-line" />
        <span
          className={`inline-flex items-center gap-[7px] rounded-full border-[1.5px] py-1 pr-[11px] pl-[9px] text-[12.5px] font-bold whitespace-nowrap ${enLigne ? "border-ink-900 text-ink-900" : statut === "depublie" ? "border-dashed border-brique-700 text-brique-700" : "border-dashed border-ink-200 bg-cream-100 text-ink-500"}`}
        >
          <span
            aria-hidden="true"
            className={`block size-[7px] rounded-full ${enLigne ? "bg-brique-700" : "bg-ink-200"}`}
          />
          {enLigne ? "Publié" : statut === "depublie" ? "Dépublié" : "Brouillon"}
        </span>
        <span className="min-w-0 flex-[1_1_160px] truncate text-sm font-bold">{s.titre}</span>
        <span className="font-mono text-[11px] whitespace-nowrap text-ink-400">
          {modifie ? "Modifications non enregistrées" : enregistre ? `Enregistré à ${enregistre}` : ""}
        </span>
        {!enLigne && !a.publie_le && statut === "brouillon" && (
          <button
            type="button"
            disabled={enCours}
            onClick={() =>
              confirm("Supprimer définitivement ce brouillon ?") &&
              demarrer(async () => {
                const r = await actions.supprimerBrouillon(a.id);
                if ("vers" in r) window.location.assign(r.vers);
                else setErreurs([r.erreur]);
              })
            }
            className="cursor-pointer px-2 text-[13px] font-bold text-brique-700"
          >
            Supprimer
          </button>
        )}
        {enLigne && (
          <button type="button" onClick={() => setModale("depublier")} className={bContour}>
            Dépublier
          </button>
        )}
        {!enLigne && (
          <button type="button" disabled={enCours} onClick={() => lancer(false)} className={bContour}>
            Enregistrer en brouillon
          </button>
        )}
        <button
          type="button"
          disabled={enCours || !s.titre.trim()}
          onClick={() => (enLigne ? lancer(false) : setModale("publier"))}
          className={`${bPlein} bg-brique-700 hover:bg-ink-900`}
        >
          {enLigne ? "Mettre à jour" : statut === "depublie" ? "Republier" : "Publier"}
        </button>
      </div>

      {erreurs.length > 0 && (
        <div
          role="alert"
          className="flex flex-col gap-1.5 rounded-[18px] border border-brique-200 bg-brique-050 px-5 py-4 text-sm"
        >
          <span className="font-bold text-brique-700">À corriger avant d&apos;enregistrer :</span>
          <ul className="list-disc pl-5 text-ink-900">
            {erreurs.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-start gap-3.5">
        <main className="flex min-w-0 flex-[1_1_640px] flex-col gap-3.5">
          {/* Métadonnées */}
          <section className={carte}>
            <span className={surtitre}>Métadonnées</span>
            <label className="flex flex-col gap-2">
              <span className={label}>
                Titre de l&apos;article <span className="font-mono text-[10.5px] font-medium text-ink-400">H1</span>
              </span>
              <textarea
                rows={2}
                value={s.titre}
                onChange={(e) =>
                  maj({ titre: e.target.value, ...(!slugManuel && { slug: slugArticle(e.target.value) }) })
                }
                className={`${champ} resize-none text-[clamp(22px,2.4vw,30px)] leading-[1.15] font-extrabold tracking-[-0.03em]`}
              />
            </label>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-x-5 gap-y-[18px]">
              <label className="flex flex-col gap-2">
                <span className="flex items-baseline justify-between gap-2">
                  <span className={label}>
                    Titre SEO <span className="font-mono text-[10.5px] font-medium text-ink-400">&lt;title&gt;</span>
                  </span>
                  <Compteur n={(s.titre_seo || s.titre).length} max={60} />
                </span>
                <input
                  value={s.titre_seo}
                  placeholder={s.titre}
                  onChange={(e) => maj({ titre_seo: e.target.value })}
                  className={champ}
                />
                <span className="text-[12.5px] text-ink-500">
                  Vide : le titre de l&apos;article est repris (obligatoire s&apos;il dépasse 60 caractères).
                </span>
              </label>
              <label className="flex flex-col gap-2">
                <span className="flex items-baseline justify-between gap-2">
                  <span className={label}>Slug</span>
                  <span className="font-mono text-[10.5px] tracking-[0.08em] text-ink-400 uppercase">
                    {slugManuel ? "Manuel" : "Auto"}
                  </span>
                </span>
                <span className="flex items-center overflow-hidden rounded-[14px] border border-line-strong bg-cream-100 pl-3.5">
                  <span className="font-mono text-[12.5px] text-ink-400">/blog/</span>
                  <input
                    value={s.slug}
                    onChange={(e) => (setSlugManuel(true), maj({ slug: e.target.value.toLowerCase() }))}
                    className="min-w-0 flex-1 bg-transparent py-[13px] pr-3.5 pl-0.5 font-mono text-[13px] outline-none"
                  />
                </span>
                {slugManuel && (
                  <button
                    type="button"
                    onClick={() => (setSlugManuel(false), maj({ slug: slugArticle(s.titre) }))}
                    className="cursor-pointer self-start text-[12.5px] font-bold text-brique-700"
                  >
                    Regénérer depuis le titre
                  </button>
                )}
                {a.publie_le && s.slug !== a.slug && (
                  <span className="text-[12.5px] text-ink-500">
                    L&apos;ancienne adresse redirigera vers la nouvelle (301).
                  </span>
                )}
              </label>
            </div>
            <label className="flex flex-col gap-2">
              <span className="flex items-baseline justify-between gap-2">
                <span className={label}>Meta description</span>
                <Compteur n={s.meta_description.length} max={155} />
              </span>
              <textarea
                rows={2}
                value={s.meta_description}
                onChange={(e) => maj({ meta_description: e.target.value })}
                placeholder="Rédigée pour cet article, jamais reprise du texte"
                className={`${champ} resize-none`}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="flex items-baseline justify-between gap-2">
                <span className={label}>Extrait des cartes</span>
                <span className="font-mono text-[11px] text-ink-400">
                  {s.extrait.trim() ? s.extrait.trim().split(/\s+/).length : 0} / 20 mots
                </span>
              </span>
              <textarea
                rows={2}
                value={s.extrait}
                onChange={(e) => maj({ extrait: e.target.value })}
                placeholder="Rédigé, jamais les premiers mots de l'article"
                className={`${champ} resize-none`}
              />
            </label>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-5 gap-y-[18px]">
              <label className="flex flex-col gap-2">
                <span className={label}>Catégorie</span>
                <select
                  value={s.categorie}
                  onChange={(e) => maj({ categorie: e.target.value })}
                  className={`${champ} font-semibold`}
                >
                  {CATEGORIES_BLOG.map((c) => (
                    <option key={c.cle} value={c.cle}>
                      {c.libelle}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className={label}>Auteur</span>
                <select
                  value={s.auteur_id ?? ""}
                  onChange={(e) => maj({ auteur_id: e.target.value ? Number(e.target.value) : null })}
                  className={`${champ} font-semibold`}
                >
                  <option value="">Choisir un auteur</option>
                  {auteurs.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.nom}
                    </option>
                  ))}
                </select>
                <span className="text-[12.5px] text-ink-500">Profils gérés dans Paramètres.</span>
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <span className={label}>Image de couverture</span>
              {s.couverture_url ? (
                <div className="flex flex-wrap items-center gap-3.5 rounded-2xl border border-line-strong bg-cream-100 p-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.couverture_url}
                    alt={s.couverture_alt}
                    className="h-[72px] w-32 flex-none rounded-[10px] object-cover"
                  />
                  <span className="flex min-w-0 flex-[1_1_220px] flex-col gap-2">
                    <input
                      value={s.couverture_alt}
                      onChange={(e) => maj({ couverture_alt: e.target.value })}
                      placeholder="Texte alternatif (obligatoire)"
                      className={`${champ} bg-white py-2 text-[13.5px] ${s.couverture_alt.trim() ? "" : "border-brique-700"}`}
                    />
                  </span>
                  <button type="button" onClick={() => setModale("couverture")} className={`${bContour} py-2`}>
                    Remplacer
                  </button>
                  <button
                    type="button"
                    onClick={() => maj({ couverture_url: null, couverture_alt: "" })}
                    className="cursor-pointer text-[13px] font-bold text-brique-700"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setModale("couverture")}
                  className="flex min-h-[72px] cursor-pointer items-center justify-center rounded-2xl border-[1.5px] border-dashed border-line-heavy bg-cream-100 text-sm font-bold"
                >
                  + Ajouter une image de couverture
                </button>
              )}
              <span className="text-[12.5px] text-ink-500">
                Utilisée pour l&apos;aperçu des partages et la carte mise en avant.
              </span>
            </div>
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3.5">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={s.reglementaire}
                  onChange={(e) => maj({ reglementaire: e.target.checked })}
                  className="size-[18px] accent-ink-900"
                />
                Article réglementaire
              </label>
              {s.reglementaire && (
                <label className="flex flex-col gap-1.5">
                  <span className="text-[12.5px] font-bold">Date de vérification</span>
                  <input
                    type="date"
                    value={s.verifie_le ?? ""}
                    onChange={(e) => maj({ verifie_le: e.target.value || null })}
                    className={`${champ} py-2.5 font-mono text-[13px]`}
                  />
                </label>
              )}
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={s.mis_en_avant}
                  onChange={(e) => maj({ mis_en_avant: e.target.checked })}
                  className="size-[18px] accent-ink-900"
                />
                Mis en avant sur la page du blog
              </label>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {[
                [
                  "Publication",
                  a.publie_le ? new Date(a.publie_le).toLocaleDateString("fr-FR") : "Au premier passage en ligne",
                ],
                ["Mise à jour", a.maj_le ? new Date(a.maj_le).toLocaleDateString("fr-FR") : "—"],
                ["Temps de lecture", BLOG.article.lecture(minutes)],
              ].map(([t, v]) => (
                <span key={t} className="flex flex-col gap-1 bg-[#FBFAF7] px-3.5 py-3">
                  <span className="font-mono text-[10px] tracking-[0.1em] text-ink-400 uppercase">{t}</span>
                  <span className="text-sm font-bold">{v}</span>
                </span>
              ))}
            </div>
          </section>

          {/* Corps */}
          <section className="flex flex-col rounded-[26px] border border-line bg-white pb-[clamp(20px,2.6vw,30px)]">
            <div className="sticky top-[152px] z-[15] flex flex-wrap items-center gap-1 rounded-t-[26px] border-b border-[#F0ECE6] bg-white px-3 py-2.5">
              <button
                type="button"
                title="Paragraphe"
                onClick={() => editeur?.chain().focus().setParagraph().run()}
                className={bOutil}
              >
                ¶
              </button>
              <button
                type="button"
                aria-pressed={etat?.h2}
                onClick={() => editeur?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={bOutil}
              >
                H2
              </button>
              <button
                type="button"
                aria-pressed={etat?.h3}
                disabled={!sommaire.some((t) => t.niveau === 2) && !etat?.h3}
                title="Un H3 suit toujours un H2"
                onClick={() => editeur?.chain().focus().toggleHeading({ level: 3 }).run()}
                className={bOutil}
              >
                H3
              </button>
              <span aria-hidden="true" className="mx-1.5 block h-[22px] w-px bg-line" />
              <button
                type="button"
                aria-pressed={etat?.gras}
                onClick={() => editeur?.chain().focus().toggleBold().run()}
                className={`${bOutil} text-sm font-extrabold`}
              >
                B
              </button>
              {etat?.lien ? (
                <button type="button" onClick={() => editeur?.chain().focus().unsetLink().run()} className={bOutil}>
                  Retirer le lien
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!etat?.selection}
                  title="Sélectionnez d'abord le texte"
                  onClick={() => setModale("lien")}
                  className={`${bOutil} underline underline-offset-[3px]`}
                >
                  Lien
                </button>
              )}
              <span aria-hidden="true" className="mx-1.5 block h-[22px] w-px bg-line" />
              <button
                type="button"
                onClick={() => editeur?.chain().focus().toggleBulletList().run()}
                className={bOutil}
              >
                • Liste
              </button>
              <button
                type="button"
                onClick={() => editeur?.chain().focus().toggleOrderedList().run()}
                className={bOutil}
              >
                1. Liste
              </button>
              <button
                type="button"
                onClick={() => editeur?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                className={bOutil}
              >
                Tableau
              </button>
              <button type="button" onClick={() => setModale("image")} className={bOutil}>
                Image
              </button>
              <span className="relative">
                <button
                  type="button"
                  aria-expanded={menuCallout}
                  onClick={() => setMenuCallout(!menuCallout)}
                  className={bOutil}
                >
                  Call-out ▾
                </button>
                {menuCallout && (
                  <span className="absolute top-[calc(100%+6px)] left-0 z-10 flex w-[260px] flex-col rounded-2xl border border-line bg-white p-1.5 shadow-menu">
                    {VARIANTES_CALLOUT.map((c) => (
                      <button
                        key={c.variante}
                        type="button"
                        onClick={() => {
                          editeur
                            ?.chain()
                            .focus()
                            .insertContent({
                              type: "callout",
                              attrs: { variante: c.variante },
                              content: [{ type: "paragraph" }],
                            })
                            .run();
                          setMenuCallout(false);
                        }}
                        className="flex cursor-pointer flex-col gap-0.5 rounded-[11px] px-3 py-2.5 text-left hover:bg-cream-100"
                      >
                        <span className="text-[13.5px] font-bold">{c.libelle}</span>
                        <span className="text-xs text-ink-500">{c.usage}</span>
                      </button>
                    ))}
                  </span>
                )}
              </span>
              {etat?.tableau && (
                <span className="flex w-full flex-wrap gap-1.5 pt-1.5">
                  {(
                    [
                      ["+ Ligne", () => editeur?.chain().focus().addRowAfter().run()],
                      ["+ Colonne", () => editeur?.chain().focus().addColumnAfter().run()],
                      ["− Ligne", () => editeur?.chain().focus().deleteRow().run()],
                      ["− Colonne", () => editeur?.chain().focus().deleteColumn().run()],
                      ["Supprimer le tableau", () => editeur?.chain().focus().deleteTable().run()],
                    ] as const
                  ).map(([l, f]) => (
                    <button
                      key={l}
                      type="button"
                      onClick={f}
                      className="cursor-pointer rounded-full border border-line-strong bg-cream-100 px-3 py-1.5 text-xs font-bold"
                    >
                      {l}
                    </button>
                  ))}
                </span>
              )}
              <span className="ml-auto px-1.5 font-mono text-[11.5px] whitespace-nowrap text-ink-500">{mots} mots</span>
            </div>
            <EditorContent editor={editeur} />
          </section>

          {/* Fin d'article */}
          <section className={carte}>
            <span className="flex flex-wrap items-baseline justify-between gap-x-3.5 gap-y-1.5">
              <span className={surtitre}>Fin d&apos;article · ordre fixe</span>
              <span className="text-[12.5px] text-ink-500">
                « L&apos;essentiel » s&apos;affiche en tête d&apos;article, au-delà de 1 000 mots.
              </span>
            </span>
            {(
              [
                ["essentiel", BLOG.article.essentiel, "Un fait, une ligne, sans impératif", 4],
                ["a_retenir", BLOG.article.aRetenir, "Une conséquence pratique, une ligne", 3],
              ] as const
            ).map(([cle, titre, ph, max]) => (
              <div key={cle} className="flex flex-col gap-2.5">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-base font-extrabold">{titre}</span>
                  <span className="font-mono text-[11px] text-ink-400">{max === 4 ? "3 ou 4 points" : "3 points"}</span>
                </span>
                {s[cle].map((v, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="w-5 flex-none text-right font-mono text-[11px] text-brique-700">0{i + 1}</span>
                    <input
                      value={v}
                      placeholder={ph}
                      onChange={(e) => maj({ [cle]: s[cle].map((x, j) => (j === i ? e.target.value : x)) })}
                      className={`${champ} py-2.5`}
                    />
                    <button
                      type="button"
                      aria-label="Retirer ce point"
                      onClick={() => maj({ [cle]: s[cle].filter((_, j) => j !== i) })}
                      className="size-8 flex-none cursor-pointer rounded-lg text-ink-300 hover:text-brique-700"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {s[cle].length < max && (
                  <button
                    type="button"
                    onClick={() => maj({ [cle]: [...s[cle], ""] })}
                    className="ml-7 cursor-pointer self-start text-[13px] font-bold text-brique-700"
                  >
                    + Ajouter un point
                  </button>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-base font-extrabold">Bloc auteur</span>
                <span className="font-mono text-[10.5px] tracking-[0.08em] text-ink-400 uppercase">
                  Repris du profil
                </span>
              </span>
              <span className="flex flex-col gap-0.5 rounded-2xl border border-dashed border-line-heavy bg-cream-100 p-3.5">
                <span className="text-[15px] font-extrabold">{auteur?.nom ?? "Aucun auteur choisi"}</span>
                {auteur && <span className="text-[13.5px] text-ink-500">{auteur.qualification}</span>}
              </span>
            </div>
          </section>

          {/* Accroche contextuelle */}
          <section className={carte}>
            <span className="flex flex-col gap-1">
              <span className={surtitre}>Conversion · accroche formation contextuelle</span>
              <span className="text-[13px] text-ink-500">
                Une page formation ou démarche liée au sujet exact de l&apos;article. Si les champs restent vides,
                l&apos;accroche générique s&apos;affiche : « {BLOG.article.accrocheGenerique.question} » ·{" "}
                {BLOG.article.accrocheGenerique.lien}.
              </span>
            </span>
            <label className="flex flex-col gap-2">
              <span className={label}>Question ou situation</span>
              <input
                value={s.accroche_question}
                onChange={(e) => maj({ accroche_question: e.target.value })}
                placeholder="Vous voulez entrer dans le métier ?"
                className={champ}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className={label}>Phrase d&apos;orientation</span>
              <input
                value={s.accroche_phrase}
                onChange={(e) => maj({ accroche_phrase: e.target.value })}
                placeholder="Le TFP APS est le titre qui ouvre le plus grand nombre de postes en surveillance."
                className={champ}
              />
            </label>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-5">
              <label className="flex flex-col gap-2">
                <span className={label}>Texte du lien</span>
                <input
                  value={s.accroche_lien}
                  onChange={(e) => maj({ accroche_lien: e.target.value })}
                  placeholder="Tout savoir sur le TFP APS"
                  className={champ}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className={label}>Page de destination</span>
                <select
                  value={s.accroche_cible ?? ""}
                  onChange={(e) => maj({ accroche_cible: e.target.value || null })}
                  className={champ}
                >
                  <option value="">Choisir une page</option>
                  {pages
                    .filter((p) => p.type !== "Article" && p.type !== "Formulaire")
                    .map((p) => (
                      <option key={p.chemin} value={p.chemin}>
                        {p.type} · {p.libelle}
                      </option>
                    ))}
                </select>
              </label>
            </div>
          </section>

          {/* Articles liés */}
          <section className={carte}>
            <span className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="flex flex-col gap-1">
                <span className="text-base font-extrabold">{BLOG.article.aLireAussi}</span>
                <span className="text-[13px] text-ink-500">Trois articles publiés, même catégorie ou même thème.</span>
              </span>
              {suggestions.length > 0 && s.lies.length < 3 && (
                <button
                  type="button"
                  onClick={() => maj({ lies: [...s.lies, ...suggestions.map((x) => x.id)].slice(0, 3) })}
                  className="cursor-pointer text-[13px] font-bold text-brique-700"
                >
                  Suggérer (même catégorie)
                </button>
              )}
            </span>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-2.5">
              {[0, 1, 2].map((i) => (
                <select
                  key={i}
                  aria-label={`Article lié ${i + 1}`}
                  value={s.lies[i] ?? ""}
                  onChange={(e) => {
                    const lies = [...s.lies];
                    lies[i] = e.target.value;
                    maj({ lies: lies.filter(Boolean) });
                  }}
                  className={champ}
                >
                  <option value="">—</option>
                  {autres
                    .filter((x) => x.publie)
                    .map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.titre}
                      </option>
                    ))}
                </select>
              ))}
            </div>
          </section>
        </main>

        {/* Repères */}
        <aside className="sticky top-[152px] flex min-w-[260px] flex-[0_1_300px] flex-col gap-3">
          <section className="flex flex-col gap-3 rounded-3xl bg-ink-900 p-5 text-white">
            <span className="font-mono text-[10.5px] tracking-[0.12em] text-brique-400 uppercase">
              Longueur du corps
            </span>
            <span className="flex items-baseline gap-2.5">
              <span className="font-mono text-[44px] leading-[0.9] tracking-[-0.05em]">{mots}</span>
              <span className="text-sm text-on-dark">mots · {BLOG.article.lecture(minutes)}</span>
            </span>
            <span className="block h-2 overflow-hidden rounded-full bg-line-dark">
              <span
                className={`block h-full rounded-full ${mots >= SEUIL_MOTS_SOMMAIRE ? "bg-brique-400" : "bg-on-dark"}`}
                style={{ width: `${Math.min(100, (mots / SEUIL_MOTS_SOMMAIRE) * 100)}%` }}
              />
            </span>
            <span className="text-[13px] leading-normal text-on-dark">
              {mots > SEUIL_MOTS_SOMMAIRE
                ? "Au-delà de 1 000 mots : la table des matières et « L'essentiel » s'affichent sur la page publique."
                : `Table des matières et « L'essentiel » masqués : ils apparaissent au-delà de 1 000 mots (encore ${SEUIL_MOTS_SOMMAIRE - mots + 1}).`}
            </span>
          </section>
          <section className="flex flex-col gap-2.5 rounded-3xl border border-line bg-white px-5 py-[18px]">
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-[15px] font-extrabold">Table des matières</span>
              <span className="font-mono text-[10px] tracking-[0.08em] text-ink-400 uppercase">Auto</span>
            </span>
            {sommaire.length ? (
              <ol className="flex flex-col gap-1.5">
                {sommaire.map((t) => (
                  <li key={t.id} className={t.niveau === 3 ? "pl-4 text-[13px] text-ink-500" : "text-sm font-bold"}>
                    {t.texte || "(intertitre vide)"}
                  </li>
                ))}
              </ol>
            ) : (
              <span className="text-[13px] text-ink-500">Générée à partir des H2 et H3 du corps.</span>
            )}
            {hierarchie.map((h) => (
              <span
                key={h}
                className="rounded-[10px] bg-brique-050 px-2.5 py-2 text-[12.5px] leading-snug text-brique-700"
              >
                {h}
              </span>
            ))}
          </section>
          <section className="flex flex-col gap-2 rounded-3xl border border-line bg-white px-5 py-[18px]">
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-[15px] font-extrabold">Call-outs</span>
              <span
                className={`font-mono text-xl tracking-[-0.03em] ${nbCallouts > 3 ? "text-brique-700" : "text-ink-900"}`}
              >
                {nbCallouts}
              </span>
            </span>
            <span className={`text-[13px] leading-normal ${nbCallouts > 3 ? "text-brique-700" : "text-ink-500"}`}>
              {nbCallouts > 3
                ? "Au-delà des 2 à 3 recommandés par article. L'insertion reste possible."
                : nbCallouts === 0
                  ? "Recommandé : 2 à 3 par article."
                  : "Dans la recommandation de 2 à 3 par article."}
            </span>
          </section>
          {/* Audit anti-concurrence (UX blog §6, décision Erwan) : obligatoire avant publication. */}
          <section
            className={`flex flex-col gap-3 rounded-3xl border-[1.5px] bg-white px-5 py-[18px] ${s.audit_ok ? "border-line" : "border-brique-700"}`}
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-[15px] font-extrabold">Audit anti-concurrence</span>
              <span className="font-mono text-[10px] tracking-[0.08em] text-ink-400 uppercase">Avant publication</span>
            </span>
            <ul className="flex flex-col gap-1.5 text-[13px] leading-snug text-ink-700">
              <li>1. L&apos;article ne traite pas un titre du référentiel.</li>
              <li>2. Il ne traite pas une procédure CNAPS.</li>
              <li>
                3. Il renvoie vers au moins une page formation ou démarche.{" "}
                <span className={`font-bold ${maillage ? "text-ink-900" : "text-brique-700"}`}>
                  {maillage ? "Lien détecté." : "Aucun lien détecté."}
                </span>
              </li>
            </ul>
            <label className="flex cursor-pointer items-start gap-2.5 text-[13.5px] font-bold">
              <input
                type="checkbox"
                checked={s.audit_ok}
                onChange={(e) => maj({ audit_ok: e.target.checked })}
                className="mt-0.5 size-[18px] flex-none accent-ink-900"
              />
              J&apos;ai vérifié ces trois points
            </label>
            <textarea
              rows={3}
              value={s.audit_note}
              onChange={(e) => maj({ audit_note: e.target.value })}
              placeholder="Note d'audit (pages concernées, arbitrage…)"
              className={`${champ} resize-none text-[13.5px]`}
            />
          </section>
        </aside>
      </div>

      {modale === "lien" && (
        <ModaleLien
          pages={pages}
          onFermer={() => setModale(null)}
          onValider={(href) => {
            editeur?.chain().focus().extendMarkRange("link").setLink({ href }).run();
            setModale(null);
          }}
        />
      )}
      {(modale === "image" || modale === "couverture") && (
        <ModaleImage
          titre={modale === "image" ? "Insérer une image" : "Image de couverture"}
          deposer={actions.deposerImage}
          onFermer={() => setModale(null)}
          onValider={(img) => {
            if (modale === "couverture")
              maj({ couverture_url: img.url, couverture_alt: img.alt, couverture_legende: img.legende });
            else
              editeur
                ?.chain()
                .focus()
                .insertContent({
                  type: "image",
                  attrs: {
                    src: img.url,
                    alt: img.alt,
                    legende: img.legende || null,
                    largeur: img.largeur,
                    hauteur: img.hauteur,
                  },
                })
                .run();
            setModale(null);
          }}
        />
      )}
      {modale === "publier" && (
        <Modale
          titre={statut === "depublie" ? "Republier l'article ?" : "Publier l'article ?"}
          sous="Il part en ligne immédiatement sur le blog public. La date de publication est enregistrée automatiquement."
          onFermer={() => setModale(null)}
        >
          <span className="rounded-[14px] bg-cream-100 px-3.5 py-3 text-[15px] leading-snug font-bold">{s.titre}</span>
          <span className="flex justify-end gap-2">
            <button type="button" onClick={() => setModale(null)} className={bContour}>
              Annuler
            </button>
            <button
              type="button"
              disabled={enCours}
              onClick={() => lancer(true)}
              className={`${bPlein} bg-brique-700 hover:bg-ink-900`}
            >
              Publier maintenant
            </button>
          </span>
        </Modale>
      )}
      {modale === "depublier" && (
        <ModaleDepublication
          pages={pages.filter((p) => p.chemin !== `/securite-privee/blog/${a.slug}/`)}
          enCours={enCours}
          onFermer={() => setModale(null)}
          onValider={(remplacement) =>
            demarrer(async () => {
              const r = await actions.depublierArticle(a.id, remplacement);
              if (!r.ok) return setErreurs(r.erreurs);
              setStatut("depublie");
              setModale(null);
              if (r.message) setToast(r.message);
            })
          }
        />
      )}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-ink-900 px-5 py-[13px] text-sm font-semibold text-white shadow-menu"
        >
          {toast}
        </div>
      )}
    </>
  );
}

function ModaleLien({
  pages,
  onFermer,
  onValider,
}: {
  pages: Page[];
  onFermer: () => void;
  onValider: (href: string) => void;
}) {
  const [onglet, setOnglet] = useState<"interne" | "externe">("interne");
  const [cible, setCible] = useState<string | null>(null);
  const [url, setUrl] = useState("https://");
  const urlOk = /^https:\/\/[^\s.]+\.[^\s]+$/.test(url);
  return (
    <Modale
      titre="Insérer un lien"
      sous="Les pages du site se choisissent dans la liste ; les sources externes se saisissent en https."
      onFermer={onFermer}
    >
      <span className="flex gap-[3px] self-start rounded-full border border-line bg-cream-100 p-[3px]">
        {(
          [
            ["interne", "Lien interne"],
            ["externe", "Lien externe"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            type="button"
            aria-pressed={onglet === k}
            onClick={() => setOnglet(k)}
            className={`cursor-pointer rounded-full px-3.5 py-[9px] text-[13px] font-bold ${onglet === k ? "bg-ink-900 text-white" : "text-ink-700"}`}
          >
            {l}
          </button>
        ))}
      </span>
      {onglet === "interne" ? (
        <ChoixPage pages={pages} valeur={cible} onChoix={setCible} />
      ) : (
        <label className="flex flex-col gap-2">
          <span className={label}>URL de destination</span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value.trim())}
            className={`${champ} font-mono text-[13.5px]`}
          />
          <span className="text-[12.5px] text-ink-500">
            Pour les sources externes (textes officiels, CNAPS…). Adresses https uniquement.
          </span>
        </label>
      )}
      <span className="flex justify-end gap-2">
        <button type="button" onClick={onFermer} className={bContour}>
          Annuler
        </button>
        <button
          type="button"
          disabled={onglet === "interne" ? !cible : !urlOk}
          onClick={() => onValider(onglet === "interne" ? cible! : url)}
          className={`${bPlein} bg-ink-900 hover:bg-brique-700`}
        >
          Insérer le lien
        </button>
      </span>
    </Modale>
  );
}

type ImageDeposee = { url: string; alt: string; legende: string; largeur: number; hauteur: number };

/** Image (UX Blog admin §3.3) : nom de fichier propre, texte alternatif obligatoire (insertion bloquée sinon), légende. */
function ModaleImage({
  titre,
  deposer,
  onFermer,
  onValider,
}: {
  titre: string;
  deposer: Actions["deposerImage"];
  onFermer: () => void;
  onValider: (i: ImageDeposee) => void;
}) {
  const [fichier, setFichier] = useState<File | null>(null);
  const [apercu, setApercu] = useState("");
  const [nom, setNom] = useState("");
  const [alt, setAlt] = useState("");
  const [legende, setLegende] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, demarrer] = useTransition();
  const champFichier = useRef<HTMLInputElement>(null);
  const bloque = !fichier ? "Choisissez une image." : !alt.trim() ? "Le texte alternatif est obligatoire." : "";
  return (
    <Modale titre={titre} onFermer={onFermer}>
      <button
        type="button"
        onClick={() => champFichier.current?.click()}
        className="relative flex min-h-[150px] cursor-pointer items-center justify-center overflow-hidden rounded-[18px] border-[1.5px] border-dashed border-line-heavy bg-cream-100"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {apercu && <img src={apercu} alt="" className="absolute inset-0 size-full object-cover" />}
        <span className="relative rounded-xl bg-white px-3.5 py-2.5 text-[13.5px] font-bold">
          {fichier ? "Changer d'image" : "Choisir une image (JPG, PNG, WebP)"}
        </span>
      </button>
      <input
        ref={champFichier}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          setFichier(f);
          setApercu(f ? URL.createObjectURL(f) : "");
          if (f && !nom) setNom(slugArticle(f.name.replace(/\.[a-z0-9]+$/i, "")));
        }}
      />
      <label className="flex flex-col gap-2">
        <span className={label}>Nom de fichier</span>
        <input
          value={nom}
          onChange={(e) => setNom(slugArticle(e.target.value))}
          placeholder="carte-professionnelle-cnaps"
          className={`${champ} font-mono text-[13.5px]`}
        />
        <span className="text-[12.5px] text-ink-500">
          Minuscules, chiffres et tirets. Converti en WebP à l&apos;envoi.
        </span>
      </label>
      <label className="flex flex-col gap-2">
        <span className={label}>
          Texte alternatif <span className="text-brique-700">· obligatoire</span>
        </span>
        <textarea
          rows={2}
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Décrivez ce que montre l'image"
          className={`${champ} resize-none`}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className={label}>
          Légende visible <span className="font-normal text-ink-400">· facultative</span>
        </span>
        <input
          value={legende}
          onChange={(e) => setLegende(e.target.value)}
          placeholder="Affichée sous l'image"
          className={champ}
        />
      </label>
      <span className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2">
        {(bloque || erreur) && (
          <span className="mr-auto text-[12.5px] font-semibold text-brique-700">{erreur || bloque}</span>
        )}
        <button type="button" onClick={onFermer} className={bContour}>
          Annuler
        </button>
        <button
          type="button"
          disabled={!!bloque || enCours}
          onClick={() =>
            demarrer(async () => {
              const d = new FormData();
              d.set("image", fichier!);
              d.set("nom", nom);
              const r = await deposer(d);
              if (!r.ok) return setErreur(r.erreur);
              onValider({
                url: r.url,
                alt: alt.trim(),
                legende: legende.trim(),
                largeur: r.largeur,
                hauteur: r.hauteur,
              });
            })
          }
          className={`${bPlein} bg-ink-900 hover:bg-brique-700`}
        >
          {enCours ? "Envoi…" : "Insérer l'image"}
        </button>
      </span>
    </Modale>
  );
}

/** Dépublication (décision Erwan) : une page de remplacement → redirection 301 ; aucune → réponse 410. */
function ModaleDepublication({
  pages,
  enCours,
  onFermer,
  onValider,
}: {
  pages: Page[];
  enCours: boolean;
  onFermer: () => void;
  onValider: (remplacement: string | null) => void;
}) {
  const [avecRemplacement, setAvecRemplacement] = useState(false);
  const [cible, setCible] = useState<string | null>(null);
  return (
    <Modale
      titre="Dépublier l'article ?"
      sous="Il quitte le blog public. Son adresse ne renverra jamais une page introuvable : elle redirige vers une page de remplacement, ou répond « supprimé » (410)."
      onFermer={onFermer}
    >
      <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold">
        <input
          type="radio"
          checked={!avecRemplacement}
          onChange={() => setAvecRemplacement(false)}
          className="accent-ink-900"
        />
        Sans remplacement (410)
      </label>
      <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold">
        <input
          type="radio"
          checked={avecRemplacement}
          onChange={() => setAvecRemplacement(true)}
          className="accent-ink-900"
        />
        Rediriger vers une page de remplacement (301)
      </label>
      {avecRemplacement && <ChoixPage pages={pages} valeur={cible} onChoix={setCible} />}
      <span className="flex justify-end gap-2">
        <button type="button" onClick={onFermer} className={bContour}>
          Annuler
        </button>
        <button
          type="button"
          disabled={enCours || (avecRemplacement && !cible)}
          onClick={() => onValider(avecRemplacement ? cible : null)}
          className={`${bPlein} bg-brique-700 hover:bg-ink-900`}
        >
          Dépublier
        </button>
      </span>
    </Modale>
  );
}
