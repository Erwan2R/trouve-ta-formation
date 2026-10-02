import type { Metadata } from "next";
import Link from "next/link";
import { Courbe } from "@/components/admin/Courbe";
import { exigerAdmin } from "@/lib/admin-serveur";
import { lirePeriode, PERIODES, type Periode } from "@/lib/analytics";
import { getAnalytics } from "@/lib/supabase/queries/admin";

export const metadata: Metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ periode?: string; onglet?: string }> };
type Onglet = "general" | "blog" | "organismes";

const fr = (n: number) => n.toLocaleString("fr-FR");
const carte = "flex flex-col gap-3.5 rounded-[26px] border border-line bg-white p-[clamp(20px,2.5vw,26px)]";
const mono = "font-mono text-[10.5px] tracking-[0.1em] text-ink-400 uppercase";
const ligneClassement =
  "grid items-center gap-3 rounded-[10px] border-b border-[#F0ECE6] px-1 py-[11px] text-ink-900 transition-colors hover:bg-cream-100 hover:text-ink-900";
const vide = (texte: string) => (
  <div className="flex justify-center rounded-[18px] border-[1.5px] border-dashed border-line-heavy bg-[repeating-linear-gradient(135deg,var(--color-cream-200)_0_7px,var(--color-white)_7px_14px)] p-7">
    <span className="rounded-xl bg-white px-3.5 py-2.5 text-center text-sm text-ink-700">{texte}</span>
  </div>
);

// Écrans du formulaire d'affinage, dans l'ordre du parcours (libellés Claude : clés techniques de lib/formulaire).
const ECRANS: [string, string][] = [
  ["depart", "Départ"],
  ["poste", "Poste visé"],
  ["specialite", "Spécialité"],
  ["autorisation", "Autorisation préalable"],
  ["detenu", "Titre détenu"],
  ["carte", "Carte professionnelle"],
  ["experience", "Expérience"],
  ["objectif", "Objectif"],
  ["situation", "Situation"],
  ["secteur", "Secteur"],
  ["rythme", "Rythme"],
  ["plusieurs", "Plusieurs titres"],
  ["deplacement", "Déplacement"],
  ["debut", "Date de début"],
  ["pmr", "Accessibilité"],
  ["resultat", "Résultat"],
];

function Entete({ titre, sous, valeur, detail, couleur = "text-ink-900" }: Record<string, string>) {
  return (
    <span className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
      <span className="flex flex-col gap-1">
        <h2 className="text-[15px] font-bold">{titre}</h2>
        <span className="text-[12.5px] text-ink-500">{sous}</span>
      </span>
      <span className="flex flex-col items-end gap-0.5">
        <span className={`font-mono text-[26px] tracking-[-0.04em] ${couleur}`}>{valeur}</span>
        <span className="font-mono text-[11px] text-ink-400">{detail}</span>
      </span>
    </span>
  );
}

const ecart = (s: number[]) => {
  const d = (s.at(-1) ?? 0) - (s[0] ?? 0);
  return `${d >= 0 ? "+" : ""}${fr(d)}`;
};

/** Analytics (UX Analytics admin) : tendances et classements, en lecture seule. Tracking interne, sans cookie. */
export default async function Analytics({ searchParams }: Props) {
  await exigerAdmin();
  const p = await searchParams;
  const periode = lirePeriode(p.periode);
  const onglet: Onglet = p.onglet === "blog" || p.onglet === "organismes" ? p.onglet : "general";
  const a = await getAnalytics(periode);
  const lien = (o: { periode?: Periode; onglet?: Onglet }) =>
    `/analytics/?periode=${o.periode ?? periode}&onglet=${o.onglet ?? onglet}`;
  const libellePeriode = periode === "tout" ? "Depuis l'ouverture" : `${periode} derniers jours`;
  const somme = (s: number[]) => s.reduce((x, y) => x + y, 0);
  const fin = a.organismes.at(-1) ?? 0;
  const ctaTotal = a.ctaTotaux.telephone + a.ctaTotaux.email + a.ctaTotaux.site;
  const ecrans = new Map(
    a.formulaire.filter((f) => f.cle.startsWith("ecran=")).map((f) => [f.cle.slice(6), f.compteur]),
  );
  const maxEcran = Math.max(1, ...ecrans.values());

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-[clamp(6px,1vw,12px)] pt-[clamp(18px,3vw,36px)] pb-[clamp(4px,1vw,10px)]">
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">
            Espace admin · Tracking interne, sans cookie
          </span>
          <h1 className="text-[clamp(34px,4.6vw,60px)] leading-[0.98] font-extrabold tracking-[-0.045em]">Analytics</h1>
        </div>
        <nav aria-label="Période" className="flex gap-[3px] rounded-full border border-line bg-white p-1">
          {PERIODES.map(([k, l]) => (
            <Link
              key={k}
              href={lien({ periode: k })}
              aria-current={k === periode ? "true" : undefined}
              className={`rounded-full px-4 py-2.5 text-[13.5px] font-bold whitespace-nowrap ${k === periode ? "bg-ink-900 text-white hover:text-white" : "text-ink-700 hover:text-ink-900"}`}
            >
              {l}
            </Link>
          ))}
        </nav>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-line-strong px-1.5">
        <nav aria-label="Onglets" className="flex gap-1">
          {(
            [
              ["general", "Général"],
              ["blog", "Blog"],
              ["organismes", "Organismes"],
            ] as [Onglet, string][]
          ).map(([k, l]) => (
            <Link
              key={k}
              href={lien({ onglet: k })}
              aria-current={k === onglet ? "page" : undefined}
              className={`-mb-px border-b-2 px-3.5 py-3 text-[15px] font-bold ${k === onglet ? "border-ink-900 text-ink-900" : "border-transparent text-ink-400 hover:text-ink-900"}`}
            >
              {l}
            </Link>
          ))}
        </nav>
        <span className="font-mono text-[11.5px] text-ink-500">{libellePeriode}</span>
      </div>

      {onglet === "general" && (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-3.5">
            <section className={carte}>
              <Entete
                titre="Organismes inscrits"
                sous="Évolution du nombre de comptes"
                valeur={ecart(a.organismes)}
                detail={`de ${a.organismes[0]} à ${fin}`}
              />
              <Courbe
                series={[{ nom: "Organismes", valeurs: a.organismes, couleur: "#0B0B0B" }]}
                libelles={a.libelles}
              />
            </section>
            <section className={carte}>
              <Entete
                titre="Répartition par palier"
                sous="Évolution empilée"
                valeur={`${Math.round(((a.paliers.optimal.at(-1) ?? 0) / Math.max(1, fin)) * 100)} %`}
                detail="au palier Optimal en fin de période"
                couleur="text-brique-700"
              />
              <span className="flex flex-wrap gap-x-4 gap-y-1.5">
                {[
                  ["Basique", "border border-dashed border-ink-300 bg-cream-200"],
                  ["Correct", "bg-ink-900"],
                  ["Optimal", "bg-brique-700"],
                ].map(([l, c]) => (
                  <span key={l} className="inline-flex items-center gap-[7px] text-[12.5px] font-semibold">
                    <span className={`block size-2.5 rounded-[3px] ${c}`} />
                    {l}
                  </span>
                ))}
              </span>
              <Courbe
                empile
                series={[
                  { nom: "Basique", valeurs: a.paliers.basique, couleur: "hachures" },
                  { nom: "Correct", valeurs: a.paliers.correct, couleur: "#0B0B0B" },
                  { nom: "Optimal", valeurs: a.paliers.optimal, couleur: "#A83B2A" },
                ]}
                libelles={a.libelles}
              />
              <span className="border-t border-[#F0ECE6] pt-2.5 text-[12.5px] leading-normal text-ink-500">
                Un instantané par jour de consultation, à partir de l&apos;ouverture de cette page.
              </span>
            </section>
            <section className={carte}>
              <Entete
                titre="Formations publiées"
                sous="Offres déclarées par les organismes"
                valeur={ecart(a.formations)}
                detail={`de ${a.formations[0]} à ${a.formations.at(-1) ?? 0}`}
              />
              <Courbe
                series={[{ nom: "Formations", valeurs: a.formations, couleur: "#0B0B0B" }]}
                libelles={a.libelles}
              />
            </section>
            <section className={carte}>
              <Entete
                titre="Trafic sur l'annuaire"
                sous={`Vues de page, toutes pages · ${a.parJour ? "par jour" : "par semaine"}`}
                valeur={fr(somme(a.trafic))}
                detail="vues sur la période"
              />
              <Courbe series={[{ nom: "Vues", valeurs: a.trafic, couleur: "#A83B2A" }]} libelles={a.libelles} />
              <span className="border-t border-[#F0ECE6] pt-2.5 text-[12.5px] leading-normal text-ink-500">
                Trafic global, distinct de l&apos;activité des organismes et des articles. Sources et mots-clés : voir
                Search Console.
              </span>
            </section>
          </div>

          {/* Demandé par Erwan (Sprint 9), hors maquette : compteurs anonymes cumulés depuis l'ouverture. */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-3.5">
            <section className={carte}>
              <span className="flex items-baseline justify-between gap-2.5">
                <h2 className="text-[17px] font-extrabold tracking-[-0.02em]">Formulaire : écrans atteints</h2>
                <span className={mono}>Depuis l&apos;ouverture</span>
              </span>
              <span className="text-[12.5px] leading-normal text-ink-500">
                Visites anonymes de chaque écran : l&apos;écart entre deux écrans successifs mesure les abandons.
              </span>
              {ecrans.size === 0 ? (
                vide("Aucun passage enregistré (comptage actif en production uniquement).")
              ) : (
                <ol className="flex flex-col border-t border-[#F0ECE6]">
                  {ECRANS.filter(([k]) => ecrans.has(k)).map(([k, l]) => (
                    <li
                      key={k}
                      className="grid grid-cols-[minmax(0,1fr)_minmax(70px,140px)_64px] items-center gap-3 border-b border-[#F0ECE6] px-1 py-2.5"
                    >
                      <span className="text-sm font-semibold">{l}</span>
                      <span className="block h-2 overflow-hidden rounded-full bg-cream-200">
                        <span
                          className="block h-full rounded-full bg-ink-900"
                          style={{ width: `${(ecrans.get(k)! / maxEcran) * 100}%` }}
                        />
                      </span>
                      <span className="text-right font-mono text-[13px]">{fr(ecrans.get(k)!)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
            <section className={carte}>
              <span className="flex items-baseline justify-between gap-2.5">
                <h2 className="text-[17px] font-extrabold tracking-[-0.02em]">Recherches sans résultat</h2>
                <span className={mono}>Top 10 · depuis l&apos;ouverture</span>
              </span>
              <span className="text-[12.5px] leading-normal text-ink-500">
                Combinaisons de critères (catalogue et formulaire) qui n&apos;ont trouvé aucun organisme. Anonymes.
              </span>
              {a.sansResultat.length === 0 ? (
                vide("Aucune recherche sans résultat.")
              ) : (
                <ol className="flex flex-col border-t border-[#F0ECE6]">
                  {a.sansResultat.map((r) => (
                    <li
                      key={r.combinaison}
                      className="flex items-center justify-between gap-3 border-b border-[#F0ECE6] px-1 py-2.5"
                    >
                      <span className="font-mono text-[12.5px] [overflow-wrap:anywhere] text-ink-700">
                        {decodeURIComponent(r.combinaison).replace(/&/g, " · ").replace(/=/g, " ")}
                      </span>
                      <span className="flex-none font-mono text-[13px]">{fr(r.compteur)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
            <section className={carte}>
              <span className="flex items-baseline justify-between gap-2.5">
                <h2 className="text-[17px] font-extrabold tracking-[-0.02em]">Pages introuvables</h2>
                <span className={mono}>Top 10 · {libellePeriode}</span>
              </span>
              <span className="text-[12.5px] leading-normal text-ink-500">
                Adresses demandées qui ont abouti à une page d&apos;erreur 404. Une adresse qui revient souvent
                mérite une redirection.
              </span>
              {a.introuvables.length === 0 ? (
                vide("Aucune page introuvable sur la période.")
              ) : (
                <ol className="flex flex-col border-t border-[#F0ECE6]">
                  {a.introuvables.map((r) => (
                    <li
                      key={r.chemin}
                      className="flex items-center justify-between gap-3 border-b border-[#F0ECE6] px-1 py-2.5"
                    >
                      <span className="font-mono text-[12.5px] [overflow-wrap:anywhere] text-ink-700">{r.chemin}</span>
                      <span className="flex-none font-mono text-[13px]">{fr(r.compteur)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        </>
      )}

      {/* Onglet Blog (UX Analytics §4) : vues totales et articles les plus vus, liens vers l'éditeur. */}
      {onglet === "blog" && (
        <div className="flex flex-wrap items-start gap-3.5">
          <section className="flex min-w-0 flex-[1_1_360px] flex-col gap-3.5 rounded-[26px] bg-ink-900 p-[clamp(20px,2.5vw,26px)] text-white">
            <span className="font-mono text-[10.5px] tracking-[0.12em] text-brique-400 uppercase">
              Vues totales du blog
            </span>
            <span className="font-mono text-[clamp(48px,6vw,72px)] leading-[0.9] tracking-[-0.05em]">
              {fr(a.blog.total)}
            </span>
            <span className="text-[13px] text-on-dark">{libellePeriode}</span>
            <Courbe
              series={[{ nom: "Vues", valeurs: a.blog.courbe, couleur: "#E19D8B" }]}
              libelles={a.libelles}
              sombre
              hauteur={150}
            />
          </section>
          <section className={`${carte} min-w-0 flex-[1.6_1_520px] gap-2.5`}>
            <span className="flex items-baseline justify-between gap-2.5">
              <h2 className="text-[17px] font-extrabold tracking-[-0.02em]">Articles les plus vus</h2>
              <span className={mono}>Top 10</span>
            </span>
            {a.blog.articles.length === 0 ? (
              vide("Aucune vue d'article sur la période.")
            ) : (
              <ol className="flex flex-col border-t border-[#F0ECE6]">
                {a.blog.articles.map((x, i) => (
                  <li key={x.id}>
                    <Link
                      href={`/blog/${x.id}/`}
                      className={`${ligneClassement} grid-cols-[28px_minmax(0,1fr)_minmax(70px,140px)_64px]`}
                    >
                      <span className="font-mono text-xs text-brique-700">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-sm leading-[1.35] font-semibold">{x.titre}</span>
                      <span className="block h-2 overflow-hidden rounded-full bg-cream-200">
                        <span
                          className={`block h-full rounded-full ${i === 0 ? "bg-brique-700" : "bg-ink-900"}`}
                          style={{ width: `${(x.vues / a.blog.articles[0].vues) * 100}%` }}
                        />
                      </span>
                      <span className="text-right font-mono text-[13px]">{fr(x.vues)}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      )}

      {onglet === "organismes" && (
        <div className="flex flex-col gap-3.5">
          <section className={`${carte} gap-4`}>
            <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
              <h2 className="text-[17px] font-extrabold tracking-[-0.02em]">Clics par type de CTA</h2>
              <span className="text-[12.5px] text-ink-500">Tous organismes confondus · {fr(ctaTotal)} clics</span>
            </span>
            {ctaTotal > 0 && (
              <span aria-hidden="true" className="flex h-11 gap-1">
                <span
                  style={{ flex: `${a.ctaTotaux.telephone} 1 0` }}
                  className="block min-w-1 rounded-xl bg-ink-900"
                />
                <span style={{ flex: `${a.ctaTotaux.email} 1 0` }} className="block min-w-1 rounded-xl bg-brique-700" />
                <span
                  style={{ flex: `${a.ctaTotaux.site} 1 0` }}
                  className="block min-w-1 rounded-xl border border-dashed border-ink-300 bg-cream-200"
                />
              </span>
            )}
            <span className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-3">
              {(
                [
                  ["Téléphone", a.ctaTotaux.telephone, "bg-ink-900"],
                  ["Email", a.ctaTotaux.email, "bg-brique-700"],
                  ["Site web", a.ctaTotaux.site, "border border-dashed border-ink-300 bg-cream-200"],
                ] as [string, number, string][]
              ).map(([l, v, c]) => (
                <span key={l} className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <span className={`block size-2.5 rounded-[3px] ${c}`} />
                    {l}
                  </span>
                  <span className="flex items-baseline gap-2.5">
                    <span className="font-mono text-[28px] tracking-[-0.04em]">{fr(v)}</span>
                    <span className="font-mono text-xs text-ink-500">
                      {ctaTotal ? `${Math.round((v / ctaTotal) * 100)} %` : "—"}
                    </span>
                  </span>
                </span>
              ))}
            </span>
            {/* Décision Erwan : le lien CTA principal configurable est reporté ; on suit le lien « Site web ». */}
            <span className="text-[12.5px] leading-normal text-ink-500">
              Seul le clic est compté, sur le bouton de la fiche publique, quelle que soit la destination.
            </span>
          </section>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-3.5">
            <section className={`${carte} gap-2.5`}>
              <span className="flex items-baseline justify-between gap-2.5">
                <h2 className="text-[17px] font-extrabold tracking-[-0.02em]">Fiches les plus visitées</h2>
                <span className={mono}>Top 10</span>
              </span>
              {a.fichesVues.length === 0 ? (
                vide("Aucune visite de fiche sur la période.")
              ) : (
                <ol className="flex flex-col border-t border-[#F0ECE6]">
                  {a.fichesVues.map((o, i) => (
                    <li key={o.id}>
                      <Link
                        href={`/organismes/${o.id}/`}
                        className={`${ligneClassement} grid-cols-[28px_minmax(0,1fr)_minmax(60px,110px)_56px]`}
                      >
                        <span className="font-mono text-xs text-brique-700">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex min-w-0 flex-col gap-px">
                          <span className="text-sm font-bold">{o.nom}</span>
                          {o.lieu && <span className="text-xs text-ink-400">{o.lieu}</span>}
                        </span>
                        <span className="block h-2 overflow-hidden rounded-full bg-cream-200">
                          <span
                            className="block h-full rounded-full bg-ink-900"
                            style={{ width: `${(o.vues / a.fichesVues[0].vues) * 100}%` }}
                          />
                        </span>
                        <span className="text-right font-mono text-[13px]">{fr(o.vues)}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </section>
            <section className={`${carte} gap-2.5`}>
              <span className="flex items-baseline justify-between gap-2.5">
                <h2 className="text-[17px] font-extrabold tracking-[-0.02em]">Clics CTA par organisme</h2>
                <span className={mono}>Top 10</span>
              </span>
              {a.clicsCta.length === 0 ? (
                vide("Aucun clic sur la période.")
              ) : (
                <ol className="flex flex-col border-t border-[#F0ECE6]">
                  {a.clicsCta.map((o, i) => (
                    <li key={o.id}>
                      <Link
                        href={`/organismes/${o.id}/`}
                        className={`${ligneClassement} grid-cols-[28px_minmax(0,1fr)_minmax(80px,150px)_44px]`}
                      >
                        <span className="font-mono text-xs text-brique-700">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex min-w-0 flex-col gap-px">
                          <span className="text-sm font-bold">{o.nom}</span>
                          <span className="font-mono text-[11px] text-ink-400">
                            Tél. {fr(o.telephone)} · Email {fr(o.email)} · Site {fr(o.site)}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="flex h-2.5 gap-0.5"
                          style={{ width: `${Math.max(12, (o.clics / a.clicsCta[0].clics) * 100)}%` }}
                        >
                          <span style={{ flex: `${o.telephone} 1 0` }} className="block rounded-full bg-ink-900" />
                          <span style={{ flex: `${o.email} 1 0` }} className="block rounded-full bg-brique-700" />
                          <span
                            style={{ flex: `${o.site} 1 0` }}
                            className="block rounded-full border border-dashed border-ink-300 bg-cream-200"
                          />
                        </span>
                        <span className="text-right font-mono text-[13px]">{fr(o.clics)}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
