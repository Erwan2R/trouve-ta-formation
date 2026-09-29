import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/public/Logo";
import { ApercuFicheAnnotee } from "@/components/public/referencer/ApercuFicheAnnotee";
import { REFERENCER as R } from "@/contenu/securite-privee/referencer";
import { VERTICALES } from "@/lib/config/verticales";
import { URL_ESPACE_ORGANISME } from "@/lib/espace";
import { breadcrumbJsonLd, faqJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getCompteursAffiches } from "@/lib/supabase/queries/compteurs";

const verticale = VERTICALES["securite-privee"];
const base = `/${verticale.slug}/`;
const chemin = `${base}referencer-mon-organisme/`;
const inscription = `${URL_ESPACE_ORGANISME}/inscription/`;
const connexion = `${URL_ESPACE_ORGANISME}/connexion/`;

export const revalidate = 3600;

// Indexable et dans le sitemap (décision Erwan 30/09/2026), sans effort SEO particulier (UX Landing §7).
export const metadata: Metadata = buildMetadata({
  title: R.title,
  description: R.description,
  path: chemin,
  og: { title: R.ogTitle, description: R.description },
});

const conteneur = "mx-auto max-w-[1240px] px-7";
const surtitre = "flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] uppercase";
const h2 = "text-[clamp(28px,3.6vw,46px)] leading-[1.04] font-bold tracking-[-0.035em] text-balance";
const ctaPlein =
  "inline-flex items-center gap-2.5 rounded-full bg-ink-900 font-bold tracking-[-0.01em] text-white hover:bg-brique-700 hover:text-white";

function Surtitre({ children, clair = false }: { children: React.ReactNode; clair?: boolean }) {
  return (
    <span className={`${surtitre} ${clair ? "text-brique-400" : "text-brique-700"}`}>
      <span aria-hidden="true" className={`block h-[1.5px] w-[30px] ${clair ? "bg-brique-400" : "bg-brique-700"}`} />
      {children}
    </span>
  );
}

function Recherche({ texte, petite = false }: { texte: string; petite?: boolean }) {
  return (
    <span
      className={`flex items-center gap-3 rounded-full border border-line-strong bg-cream-100 ${petite ? "px-4 py-3" : "px-[18px] py-3.5"}`}
    >
      <span aria-hidden="true" className="block size-[11px] flex-none rounded-full border-[1.5px] border-ink-300" />
      <span className={`flex-1 ${petite ? "text-[14.5px] leading-[1.4] text-ink-700" : "text-[15.5px]"}`}>{texte}</span>
    </span>
  );
}

/**
 * Landing organismes : sas de conversion entre l'email de prospection et l'inscription (UX Landing organismes).
 * En-tête allégé et pied de page minimal : ni navigation ni maillage du silo candidat.
 */
export default async function ReferencerMonOrganisme() {
  const compteurs = await getCompteursAffiches(verticale.seuilCompteurs);

  return (
    <div className="min-h-screen bg-cream-100">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: verticale.nom, path: base },
            { name: "Référencer mon organisme", path: chemin },
          ]),
          faqJsonLd(
            R.faq.questions.map((q) => ({
              question: q.question,
              reponse: q.suite ? `${q.reponse} ${q.suite}` : q.reponse,
            })),
          ),
        ]}
      />

      <header className="sticky top-0 z-40 border-b border-line bg-cream-100/88 backdrop-blur-md">
        <div className={`${conteneur} flex flex-wrap items-center gap-x-6 gap-y-3 py-3.5`}>
          {/* Logo cliquable vers l'accueil du silo : chemin de sortie assumé, pour la crédibilité (Copy §2). */}
          <Link href={base} className="flex items-center gap-3 text-ink-900 hover:text-ink-900">
            <Logo height={36} priority />
            <span className="border-l border-line pl-3 font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase">
              {R.enTete.surtitre}
            </span>
          </Link>
          {/* Ancres masquées sur mobile : l'en-tête reste sur deux lignes au plus. */}
          <nav aria-label="Sections de la page" className="hidden flex-auto flex-wrap justify-center gap-0.5 md:flex">
            {R.enTete.ancres.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="rounded-full px-3.5 py-[9px] text-sm font-semibold text-ink-700 hover:bg-cream-200 hover:text-ink-900"
              >
                {a.libelle}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <a href={connexion} className="text-sm font-semibold text-ink-900 hover:text-brique-700">
              {R.enTete.compte}
            </a>
            <a href={inscription} className={`${ctaPlein} px-[18px] py-[11px] text-sm`}>
              {R.enTete.creer}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-line bg-[radial-gradient(62%_80%_at_70%_-12%,#FFFFFF_0%,rgba(255,255,255,0)_72%),repeating-conic-gradient(from_178deg_at_70%_-18%,rgba(11,11,11,0.05)_0deg_0.55deg,rgba(11,11,11,0)_0.55deg_3deg)]">
          <div
            className={`${conteneur} flex flex-wrap items-center gap-[clamp(36px,5vw,72px)] pt-[clamp(48px,7vw,96px)] pb-[clamp(48px,6vw,88px)]`}
          >
            <div className="flex min-w-[290px] flex-[1_1_480px] flex-col gap-[22px]">
              <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 self-start rounded-[20px] border border-line bg-white px-4 py-[9px] font-mono text-[11px] tracking-[0.1em] whitespace-nowrap text-ink-600 uppercase">
                {R.hero.bandeau.map((m, i) => (
                  <span key={m} className="contents">
                    {i > 0 && (
                      <span aria-hidden="true" className="text-line-heavy">
                        ·
                      </span>
                    )}
                    {m}
                  </span>
                ))}
              </span>
              <h1 className="max-w-[16ch] text-[clamp(38px,5.4vw,70px)] leading-none font-extrabold tracking-[-0.045em] text-balance">
                {R.hero.h1}
              </h1>
              <p className="max-w-[54ch] text-[clamp(17px,1.7vw,20px)] leading-[1.6] text-pretty text-ink-700">
                {R.hero.promesse}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-[22px] gap-y-3.5">
                <a href={inscription} className={`${ctaPlein} px-[30px] py-[19px] text-[17px]`}>
                  {R.hero.cta}
                  <span aria-hidden="true">→</span>
                </a>
                <span className="text-[13.5px] text-ink-500">{R.hero.mention}</span>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="flex min-w-[290px] flex-[1_1_420px] flex-col gap-3.5 rounded-[26px] border border-line bg-white p-[clamp(16px,2vw,24px)]"
            >
              <span className="flex items-center gap-3 rounded-full border border-line-strong bg-cream-100 px-[18px] py-3.5">
                <span className="block size-[11px] flex-none rounded-full border-[1.5px] border-ink-300" />
                <span className="flex-1 text-[15.5px]">{R.hero.recherche}</span>
                <span className="flex size-8 flex-none items-center justify-center rounded-full bg-ink-900 text-sm text-white">
                  →
                </span>
              </span>
              <span className="flex justify-between gap-2.5 px-1 pt-1 font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase">
                <span>{R.hero.resultats[0]}</span>
                <span>{R.hero.resultats[1]}</span>
              </span>
              <div className="relative flex items-start gap-3.5 rounded-[18px] border-[1.5px] border-ink-900 bg-white p-[18px]">
                <span className="absolute -top-[11px] right-4 rounded-full bg-brique-700 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-white uppercase">
                  {R.hero.votreFiche}
                </span>
                <span className="flex size-[52px] flex-none items-center justify-center rounded-xl border border-line bg-cream-200 font-mono text-[13px] text-ink-600">
                  VC
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-[16.5px] leading-[1.25] font-bold tracking-[-0.015em]">
                    Votre centre de formation
                  </span>
                  <span className="flex flex-wrap gap-[5px]">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-[9px] py-1 text-[11px] font-semibold text-white">
                      <span className="block size-[5px] rounded-full bg-brique-400" />
                      Agréé CNAPS
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-[9px] py-1 text-[11px] font-semibold text-ink-600">
                      <span className="block size-[5px] rounded-full bg-brique-700" />
                      Qualiopi
                    </span>
                  </span>
                  <span className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-ink-500">
                    <span>SSIAP 1 · 70 h · 690 €</span>
                    <span className="text-line-heavy">·</span>
                    <span>Bobigny</span>
                    <span className="text-line-heavy">·</span>
                    <span>CPF · OPCO</span>
                  </span>
                </span>
              </div>
              {[
                ["62%", "40%"],
                ["54%", "46%"],
              ].map(([a, b]) => (
                <div key={a} className="flex items-center gap-3.5 rounded-[18px] border border-line bg-white p-[18px]">
                  <span className="block size-[52px] flex-none rounded-xl border border-line bg-[repeating-linear-gradient(135deg,#ECE8E2_0_6px,#F7F5F1_6px_12px)]" />
                  <span className="flex flex-1 flex-col gap-2">
                    <span className="block h-3 rounded-full bg-cream-300" style={{ width: a }} />
                    <span className="block h-[9px] rounded-full bg-cream-200" style={{ width: b }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className={`${conteneur} flex flex-col gap-[clamp(40px,5vw,72px)] py-[clamp(56px,7vw,96px)]`}>
            <div className="flex flex-wrap items-start gap-[clamp(32px,5vw,80px)]">
              <div className="flex min-w-[280px] flex-[1_1_400px] flex-col gap-5 lg:sticky lg:top-24">
                <Surtitre>{R.candidat.surtitre}</Surtitre>
                <h2 className={`${h2} max-w-[16ch]`}>{R.candidat.h2}</h2>
                {R.candidat.paragraphes.map((p) => (
                  <p key={p} className="max-w-[56ch] text-[17.5px] leading-[1.75] text-pretty text-ink-700">
                    {p}
                  </p>
                ))}
              </div>
              <ol className="flex min-w-[280px] flex-[1_1_440px] flex-col">
                {[
                  {
                    titre: "Il cherche",
                    contenu: (
                      <div className="flex flex-col gap-2.5 rounded-[18px] border border-line bg-white px-5 py-[18px]">
                        {R.candidat.requetes.map((r) => (
                          <Recherche key={r} texte={r} petite />
                        ))}
                      </div>
                    ),
                  },
                  {
                    titre: "Il compare",
                    contenu: (
                      <div className="flex flex-col rounded-[18px] border border-line bg-white px-5 py-[18px]">
                        {R.candidat.criteres.map((c, i) => (
                          <span
                            key={c}
                            className={`flex items-center justify-between gap-3 py-[11px] text-[14.5px] ${i < R.candidat.criteres.length - 1 ? "border-b border-cream-200" : ""}`}
                          >
                            <span>{c}</span>
                            <span className="font-mono text-[11px] text-brique-700">vérifié</span>
                          </span>
                        ))}
                      </div>
                    ),
                  },
                  {
                    titre: "Il choisit",
                    contenu: (
                      <div className="flex flex-col gap-2.5 rounded-[18px] border border-line bg-white px-5 py-[18px]">
                        {["Centre A", "Centre B"].map((c, i) => (
                          <span
                            key={c}
                            className={`flex items-center justify-between gap-3 rounded-[14px] px-4 py-[13px] ${i === 0 ? "border-[1.5px] border-ink-900" : "border border-line"}`}
                          >
                            <span className="text-[15px] font-bold">{c}</span>
                            <span className="font-mono text-[10.5px] tracking-[0.1em] text-ink-600 uppercase">
                              Considéré
                            </span>
                          </span>
                        ))}
                        <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-[14px] border border-dashed border-line-heavy bg-[repeating-linear-gradient(135deg,#ECE8E2_0_7px,#F7F5F1_7px_14px)] px-3.5 py-[11px]">
                          <span className="rounded-full bg-white px-[11px] py-1 text-sm font-bold">
                            Centre sans fiche
                          </span>
                          <span className="rounded-full bg-white px-[11px] py-1 font-mono text-[10.5px] tracking-[0.1em] text-ink-500 uppercase">
                            Jamais considéré
                          </span>
                        </span>
                      </div>
                    ),
                  },
                ].map((e, i, liste) => (
                  <li key={e.titre} className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-5">
                    <span className="flex flex-col items-center">
                      <span
                        className={`flex size-11 flex-none items-center justify-center rounded-full font-mono text-sm text-white ${i < 2 ? "bg-brique-700" : "bg-ink-900"}`}
                      >
                        0{i + 1}
                      </span>
                      {i < liste.length - 1 && (
                        <span aria-hidden="true" className="my-2 block w-px flex-1 bg-line-strong" />
                      )}
                    </span>
                    <div className={`flex flex-col gap-3 ${i < liste.length - 1 ? "pb-7" : ""}`}>
                      <h3 className="pt-[11px] text-xl font-bold tracking-[-0.02em]">{e.titre}</h3>
                      {e.contenu}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col items-center gap-[18px] border-t border-line-strong pt-[clamp(36px,4vw,56px)] text-center">
              <span aria-hidden="true" className="block h-0.5 w-[30px] bg-brique-700" />
              <p className="max-w-[22ch] text-[clamp(30px,4.4vw,58px)] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance">
                {R.candidat.conclusion}
              </p>
            </div>
          </div>
        </section>

        <section id="fiche" className="scroll-mt-[70px] border-y border-line bg-white">
          <div className={`${conteneur} py-[clamp(56px,7vw,96px)]`}>
            <div className="mb-[clamp(28px,3.5vw,44px)] flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
              <div className="flex flex-col gap-3.5">
                <Surtitre>{R.fiche.surtitre}</Surtitre>
                <h2 className={`${h2} max-w-[20ch]`}>{R.fiche.h2}</h2>
              </div>
              <p className="max-w-[44ch] text-[17px] leading-[1.7] text-ink-700">{R.fiche.chapo}</p>
            </div>
            <ApercuFicheAnnotee annotations={R.fiche.annotations} mention={R.fiche.mention} />
          </div>
        </section>

        <section>
          <div className={`${conteneur} py-[clamp(56px,7vw,96px)]`}>
            <div className="mb-[clamp(32px,4vw,52px)] flex flex-col gap-3.5">
              <Surtitre>{R.benefices.surtitre}</Surtitre>
              <h2 className={`${h2} max-w-[22ch]`}>{R.benefices.h2}</h2>
            </div>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))] gap-x-[clamp(20px,3vw,36px)] gap-y-[clamp(28px,3vw,40px)]">
              {R.benefices.liste.map((b, i) => (
                <li key={b.titre} className="flex flex-col gap-2.5 border-t-2 border-ink-900 pt-5">
                  <span className="font-mono text-xs text-brique-700">0{i + 1}</span>
                  <h3 className="text-xl leading-[1.25] font-bold tracking-[-0.02em]">{b.titre}</h3>
                  <span className="text-base leading-[1.65] text-ink-500">{b.texte}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className={`${conteneur} pb-[clamp(56px,7vw,96px)]`}>
            <div className="rounded-[26px] bg-ink-900 p-[clamp(32px,5.5vw,72px)] text-on-dark-strong">
              {compteurs ? (
                // Au-dessus du seuil d'affichage : le bloc d'honnêteté devient un bloc de preuve (Copy §7).
                <div className="flex flex-wrap items-end gap-[clamp(20px,4vw,56px)]">
                  <span className="font-mono text-[clamp(72px,11vw,148px)] leading-[0.9] tracking-[-0.04em] text-white">
                    {compteurs.total}
                  </span>
                  <div className="flex min-w-[260px] flex-[1_1_380px] flex-col gap-3.5">
                    <h2 className="max-w-[30ch] text-[clamp(24px,2.8vw,34px)] leading-[1.12] font-bold tracking-[-0.03em] text-balance text-white">
                      {R.lancement.preuve(compteurs.total)}
                    </h2>
                    <p className="max-w-[60ch] text-lg leading-[1.7] text-on-dark">{R.lancement.preuveTexte}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-start gap-[clamp(24px,5vw,72px)]">
                  <div className="flex min-w-[240px] flex-[1_1_280px] flex-col gap-4">
                    <Surtitre clair>{R.lancement.surtitre}</Surtitre>
                    <h2 className={`${h2} max-w-[14ch] text-white`}>{R.lancement.h2}</h2>
                  </div>
                  <div className="flex min-w-[280px] flex-[1.4_1_440px] flex-col gap-[18px]">
                    {R.lancement.paragraphes.map((p) => (
                      <p key={p} className="max-w-[62ch] text-[17.5px] leading-[1.75] text-pretty text-on-dark">
                        {p}
                      </p>
                    ))}
                    <p className="mt-2 max-w-[36ch] border-t border-line-dark pt-6 text-[clamp(20px,2.2vw,26px)] leading-[1.35] font-bold tracking-[-0.02em] text-pretty text-white">
                      {R.lancement.chute}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="etapes" className="scroll-mt-[70px] border-y border-line bg-white">
          <div className={`${conteneur} py-[clamp(56px,7vw,96px)]`}>
            <div className="mb-[clamp(32px,4vw,52px)] flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
              <div className="flex flex-col gap-3.5">
                <Surtitre>{R.etapes.surtitre}</Surtitre>
                <h2 className={h2}>{R.etapes.h2}</h2>
              </div>
              <a
                href={inscription}
                className="inline-flex items-center gap-2 border-b-[1.5px] border-brique-700 pb-[3px] text-[15.5px] font-bold text-ink-900 hover:text-brique-700"
              >
                {R.etapes.commencer}
                <span aria-hidden="true">→</span>
              </a>
            </div>
            <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-x-5 gap-y-7">
              {R.etapes.liste.map((e, i) => (
                <li key={e.titre} className="flex flex-col gap-[18px]">
                  <span className="flex items-center gap-3.5">
                    <span
                      className={`flex size-11 flex-none items-center justify-center rounded-full font-mono text-sm text-white ${i < 2 ? "bg-brique-700" : "bg-ink-900"}`}
                    >
                      0{i + 1}
                    </span>
                    <span aria-hidden="true" className="block h-px flex-1 bg-line-strong" />
                    {i === 2 && (
                      <span className="flex-none rounded-full border border-line-strong px-3 py-[5px] font-mono text-[10.5px] tracking-[0.1em] text-ink-600 uppercase">
                        {R.etapes.enLigne}
                      </span>
                    )}
                  </span>
                  <span className="flex flex-col gap-2 pr-3">
                    <h3 className="text-[21px] font-bold tracking-[-0.02em]">{e.titre}</h3>
                    <span className="text-base leading-[1.65] text-ink-500">{e.texte}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-[clamp(28px,3.5vw,44px)] max-w-[78ch] rounded-[18px] border border-line bg-cream-100 px-[22px] py-[18px] text-base leading-[1.7] text-ink-700">
              {R.etapes.mention}
            </p>
          </div>
        </section>

        <section id="gratuit" className="scroll-mt-[70px]">
          <div className={`${conteneur} py-[clamp(56px,7vw,96px)]`}>
            <div className="overflow-hidden rounded-[26px] border border-line bg-white">
              <div className="flex flex-wrap items-start gap-[clamp(32px,5vw,72px)] p-[clamp(28px,4.5vw,64px)]">
                <div className="flex min-w-[270px] flex-[1.2_1_420px] flex-col gap-[18px]">
                  <Surtitre>{R.gratuit.surtitre}</Surtitre>
                  <h2 className={h2}>{R.gratuit.h2}</h2>
                  {R.gratuit.paragraphes.map((p) => (
                    <p key={p} className="max-w-[58ch] text-[17.5px] leading-[1.75] text-pretty text-ink-700">
                      {p}
                    </p>
                  ))}
                </div>
                <div className="min-w-[270px] flex-[1_1_360px] rounded-[20px] border border-line-strong bg-cream-100 px-6 pt-1.5 pb-2">
                  <span className="flex justify-between gap-2.5 border-b-[1.5px] border-ink-900 pt-4 pb-3.5 font-mono text-[10.5px] tracking-[0.12em] text-ink-600 uppercase">
                    <span>{R.gratuit.grille.entete[0]}</span>
                    <span>{R.gratuit.grille.entete[1]}</span>
                  </span>
                  {R.gratuit.grille.lignes.map((l, i) => (
                    <div
                      key={l.titre}
                      className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5 py-[18px] ${i < 2 ? "border-b border-dashed border-line-strong" : ""}`}
                    >
                      <span className="flex min-w-0 flex-col gap-1">
                        <span
                          className={`text-base font-bold tracking-[-0.01em] ${l.barre ? "line-through decoration-brique-700 decoration-2" : ""}`}
                        >
                          {l.titre}
                        </span>
                        <span className="text-[13.5px] leading-normal text-ink-500">{l.detail}</span>
                      </span>
                      <span
                        className={
                          i === 0
                            ? "font-mono text-[28px] tracking-[-0.03em]"
                            : `font-mono text-xs tracking-[0.1em] uppercase ${l.barre ? "text-brique-700" : ""}`
                        }
                      >
                        {l.tarif}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-3 border-t border-line bg-cream-200 px-[clamp(28px,4.5vw,64px)] py-[clamp(24px,3.5vw,44px)]">
                <p className="max-w-[26ch] flex-[1_1_440px] text-[clamp(26px,3.4vw,44px)] leading-[1.05] font-extrabold tracking-[-0.04em] text-balance">
                  {R.gratuit.engagement}
                </p>
                <p className="flex-[0_1_380px] text-[16.5px] leading-[1.7] text-ink-700">{R.gratuit.engagementTexte}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="questions" className="scroll-mt-[70px] border-t border-line bg-white">
          <div
            className={`${conteneur} flex flex-wrap items-start gap-[clamp(24px,5vw,72px)] py-[clamp(56px,7vw,96px)]`}
          >
            <div className="flex min-w-[240px] flex-[1_1_280px] flex-col gap-3.5 lg:sticky lg:top-24">
              <Surtitre>{R.faq.surtitre}</Surtitre>
              <h2 className={`${h2} max-w-[14ch]`}>{R.faq.h2}</h2>
            </div>
            <div className="flex min-w-[280px] flex-[1.6_1_480px] flex-col border-t border-line">
              {R.faq.questions.map((q) =>
                q.ouverte ? (
                  // « D'où vient mon adresse email ? » : jamais repliée (Copy §10).
                  <div key={q.question} className="flex flex-col gap-3 border-b border-line py-[22px]">
                    <h3 className="text-lg leading-[1.4] font-bold">{q.question}</h3>
                    <p className="max-w-[70ch] pr-10 text-base leading-[1.7] text-ink-500">{q.reponse}</p>
                    <p className="max-w-[70ch] pr-10 text-base leading-[1.7] text-ink-500">
                      Vous pouvez demander la suppression de vos données de notre base à tout moment, en écrivant à{" "}
                      <a href={`mailto:${R.contact}`} className="font-semibold">
                        {R.contact}
                      </a>
                      . La demande est traitée sans condition et sans relance.
                    </p>
                  </div>
                ) : (
                  <details key={q.question} className="group border-b border-line">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-[22px] text-lg leading-[1.4] font-semibold [&::-webkit-details-marker]:hidden">
                      <h3>{q.question}</h3>
                      <span aria-hidden="true" className="flex-none text-xl text-brique-700 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mb-[22px] max-w-[70ch] pr-10 text-base leading-[1.7] text-ink-500">{q.reponse}</p>
                  </details>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="bg-ink-900 text-on-dark-strong">
          <div className={`${conteneur} pt-[clamp(64px,8vw,112px)]`}>
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-7 pb-[clamp(48px,6vw,80px)]">
              <div className="flex min-w-[280px] flex-[1_1_460px] flex-col gap-[18px]">
                <h2 className="text-[clamp(40px,6vw,80px)] leading-[0.98] font-extrabold tracking-[-0.045em] text-white">
                  {R.final.h2}
                </h2>
                <p className="max-w-[50ch] text-lg leading-[1.7] text-on-dark">{R.final.texte}</p>
              </div>
              <div className="flex flex-col items-start gap-3.5">
                <a
                  href={inscription}
                  className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-5 text-[17px] font-bold tracking-[-0.01em] text-ink-900 hover:bg-brique-700 hover:text-white"
                >
                  {R.hero.cta}
                  <span aria-hidden="true">→</span>
                </a>
                <p className="max-w-[40ch] text-[13.5px] leading-[1.6] text-on-dark">
                  {R.final.secours}{" "}
                  <a href={`mailto:${R.contact}`} className="font-semibold text-brique-400 hover:text-white">
                    {R.contact}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-ink-900">
        <div
          className={`${conteneur} flex flex-wrap items-center justify-between gap-x-6 gap-y-3.5 border-t border-line-dark pt-[26px] pb-[30px]`}
        >
          <span className="flex flex-wrap items-center gap-x-[18px] gap-y-3 text-[13.5px]">
            <Logo height={24} inverse />
            <Link href="/mentions-legales/" className="text-on-dark hover:text-white">
              {R.pied[0]}
            </Link>
            <Link href="/confidentialite/" className="text-on-dark hover:text-white">
              {R.pied[1]}
            </Link>
            <a href={`mailto:${R.contact}`} className="text-on-dark hover:text-white">
              {R.pied[2]}
            </a>
          </span>
          <span className="font-mono text-[11.5px] text-ink-300">© 2026 Trouve ta formation</span>
        </div>
      </footer>
    </div>
  );
}
