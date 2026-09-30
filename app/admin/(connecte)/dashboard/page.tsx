import type { Metadata } from "next";
import Link from "next/link";
import { exigerAdmin } from "@/lib/admin-serveur";
import { getDemandesEnAttente, getOrganismesAdmin } from "@/lib/supabase/queries/admin";

export const metadata: Metadata = { title: "Tableau de bord" };
export const dynamic = "force-dynamic"; // UX Dashboard admin §4 : chiffres calculés à chaque chargement

const surtitre = "font-mono text-[10.5px] tracking-[0.12em] uppercase";
const chiffre = "font-mono leading-[0.85] tracking-[-0.05em]";
const bouton =
  "mt-auto inline-flex items-center gap-2.5 self-start rounded-full px-5 py-[13px] text-[14.5px] font-bold transition-colors";

const anciennete = (iso: string) => {
  const jours = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return { jours, texte: jours === 0 ? "aujourd'hui" : jours === 1 ? "depuis 1 jour" : `depuis ${jours} jours` };
};

/**
 * Dashboard admin (UX Dashboard admin) : « qu'est-ce qui a besoin de moi maintenant ? ».
 * Vue d'ensemble, puis trois files, chacune avec son lien d'action. Pas de seuil d'alerte visuelle (point ouvert §4).
 */
export default async function Dashboard() {
  await exigerAdmin();
  const [organismes, demandes] = await Promise.all([getOrganismesAdmin(), getDemandesEnAttente()]);
  const n = { basique: 0, correct: 0, optimal: 0 };
  organismes.forEach((o) => n[o.palier]++);
  const sansFormation = organismes.filter((o) => o.nbFormations === 0);
  const recoupement = sansFormation.filter((o) => o.palier === "basique").length;
  const heure = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(
    new Date(),
  );

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-[clamp(6px,1vw,12px)] pt-[clamp(18px,3vw,36px)] pb-[clamp(4px,1vw,10px)]">
        <div className="flex flex-col gap-2.5">
          <span className={`${surtitre} text-[11px] text-ink-400`}>Espace admin · Sécurité privée</span>
          <h1 className="text-[clamp(34px,4.6vw,60px)] leading-[0.98] font-extrabold tracking-[-0.045em]">
            Ce qui a besoin de vous
          </h1>
        </div>
        <span className="font-mono text-[11.5px] text-ink-500">Chiffres calculés au chargement · {heure}</span>
      </section>

      <section className="flex flex-wrap items-center gap-[clamp(24px,4vw,56px)] rounded-[28px] border border-line bg-white p-[clamp(22px,3vw,34px)]">
        <h2 className="sr-only">Vue d&apos;ensemble</h2>
        <div className="flex flex-[0_1_auto] flex-col gap-1.5">
          <span className={`${surtitre} text-ink-400`}>Organismes inscrits</span>
          <span className={`${chiffre} text-[clamp(64px,8vw,104px)] leading-[0.9]`}>{organismes.length}</span>
        </div>
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3.5">
          <span className={`${surtitre} text-ink-400`}>Répartition par palier</span>
          <span aria-hidden="true" className="flex h-14 gap-1 overflow-hidden rounded-2xl">
            <span
              style={{ flex: `${n.basique} 1 0` }}
              className="block min-w-1 rounded-xl border border-dashed border-line-heavy bg-[repeating-linear-gradient(135deg,var(--color-cream-300)_0_7px,var(--color-cream-100)_7px_14px)]"
            />
            <span style={{ flex: `${n.correct} 1 0` }} className="block min-w-1 rounded-xl bg-ink-900" />
            <span style={{ flex: `${n.optimal} 1 0` }} className="block min-w-1 rounded-xl bg-brique-700" />
          </span>
          <span className="grid grid-cols-3 gap-3">
            {(
              [
                ["Basique", n.basique, "border border-dashed border-ink-300 bg-cream-200"],
                ["Correct", n.correct, "bg-ink-900"],
                ["Optimal", n.optimal, "bg-brique-700"],
              ] as const
            ).map(([libelle, valeur, pastille]) => (
              <span key={libelle} className="flex flex-col gap-[3px]">
                <span className="flex items-center gap-[7px] text-sm font-bold">
                  <span className={`block size-[9px] rounded-[3px] ${pastille}`} />
                  {libelle}
                </span>
                <span className="font-mono text-[22px] tracking-[-0.03em]">{valeur}</span>
              </span>
            ))}
          </span>
        </div>
      </section>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-3.5">
        <section className="col-span-full flex flex-wrap items-stretch gap-[clamp(20px,4vw,48px)] rounded-[28px] bg-ink-900 p-[clamp(22px,3vw,34px)] text-white">
          <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5">
            <h2 className={`${surtitre} text-brique-400`}>02 · À arbitrer</h2>
            <span className="flex items-end gap-4">
              <span className={`${chiffre} text-[clamp(64px,8vw,104px)]`}>{demandes.length}</span>
              <span className="max-w-[16ch] pb-1.5 text-[17px] leading-[1.3] font-bold">
                {demandes.length === 1 ? "demande de titre en attente" : "demandes de titres en attente"}
              </span>
            </span>
            <p className="max-w-[48ch] text-[14.5px] leading-[1.6] text-on-dark">
              Des organismes attendent votre réponse pour déclarer un titre absent du référentiel.
            </p>
            <Link
              href="/referentiel/?onglet=demandes"
              className={`${bouton} bg-white py-[15px] text-[15px] text-ink-900 hover:bg-brique-400 hover:text-ink-900`}
            >
              Arbitrer les demandes<span aria-hidden="true">→</span>
            </Link>
          </div>
          {demandes.length > 0 ? (
            <div className="flex min-w-0 flex-[1.3_1_380px] flex-col gap-2">
              <span className={`${surtitre} text-ink-300`}>Les plus anciennes</span>
              {demandes.slice(0, 3).map((d) => {
                const age = anciennete(d.created_at);
                return (
                  <Link
                    key={d.id}
                    href="/referentiel/?onglet=demandes"
                    className="flex items-center justify-between gap-3.5 rounded-2xl border border-line-dark bg-[#1A1818] px-4 py-3.5 text-white transition-colors hover:border-ink-300 hover:text-white"
                  >
                    <span className="flex min-w-0 flex-col gap-[3px]">
                      <span className="text-[15px] font-bold">{d.intitule}</span>
                      <span className="text-[13px] text-on-dark">{d.organismes.nom}</span>
                    </span>
                    <span
                      className={`flex-none font-mono text-[11.5px] ${age.jours >= 7 ? "text-brique-400" : "text-ink-300"}`}
                    >
                      {age.texte}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex min-w-0 flex-[1.3_1_380px] items-center justify-center rounded-[18px] border-[1.5px] border-dashed border-line-dark p-7">
              <span className="text-[15px] text-on-dark">Aucune demande en attente.</span>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3.5 rounded-[28px] border border-line bg-white p-[clamp(22px,3vw,30px)]">
          <h2 className={`${surtitre} text-brique-700`}>03 · Alerte SEO</h2>
          <span className="flex items-end gap-3.5">
            <span className={`${chiffre} text-[clamp(52px,6vw,76px)]`}>{n.basique}</span>
            <span className="pb-1 text-base leading-[1.3] font-bold">fiches en noindex</span>
          </span>
          <p className="text-[14.5px] leading-[1.6] text-ink-500">
            Restées au palier Basique, elles ne sont pas indexées par les moteurs de recherche.
          </p>
          <span className="text-[13px] leading-[1.55] text-ink-500">
            Signal à surveiller : vous ne pouvez pas compléter une fiche à la place de l&apos;organisme. Un contact hors
            plateforme reste possible au cas par cas.
          </span>
          <Link
            href="/organismes/?palier=basique&depuis=dashboard"
            className={`${bouton} bg-ink-900 text-white hover:bg-brique-700 hover:text-white`}
          >
            Voir les fiches au palier Basique<span aria-hidden="true">→</span>
          </Link>
        </section>

        <section className="flex flex-col gap-3.5 rounded-[28px] border border-line bg-white p-[clamp(22px,3vw,30px)]">
          <h2 className={`${surtitre} text-brique-700`}>04 · Alerte visibilité</h2>
          <span className="flex items-end gap-3.5">
            <span className={`${chiffre} text-[clamp(52px,6vw,76px)]`}>{sansFormation.length}</span>
            <span className="pb-1 text-base leading-[1.3] font-bold">fiches sans formation déclarée</span>
          </span>
          <p className="text-[14.5px] leading-[1.6] text-ink-500">
            Elles n&apos;apparaissent dans aucun filtre par titre du catalogue.
          </p>
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-cream-100 px-3 py-1.5 text-[12.5px] text-ink-600">
            <span aria-hidden="true" className="block size-1.5 rounded-full bg-ink-300" />
            Dont {recoupement} également en noindex
          </span>
          <Link
            href="/organismes/?sans-formation=1&depuis=dashboard"
            className={`${bouton} bg-ink-900 text-white hover:bg-brique-700 hover:text-white`}
          >
            Voir les fiches sans formation<span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </>
  );
}
