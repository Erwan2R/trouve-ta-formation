import Link from "next/link";
import { CarteOrganisme } from "@/components/public/organisme/CarteOrganisme";
import { LogoOrganisme } from "@/components/public/organisme/LogoOrganisme";
import { localisation } from "@/components/public/organisme/CarteOrganisme";
import { puces, relachement, versQuery, type Filtres, type Puce } from "@/lib/organismes/filtres";
import { FINANCEMENTS, FINANCEMENTS_FILTRE, RYTHMES, libelle } from "@/lib/organismes/libelles";
import { DEPARTEMENTS_VOISINS } from "@/lib/organismes/voisins";
import type { Organisme } from "@/lib/supabase/queries/organismes";
import type { Departement, Titre } from "@/lib/supabase/queries/referentiel";
import { fr } from "@/lib/typo";

const bouton =
  "rounded-full border border-line-strong bg-white px-5 py-3 text-sm font-semibold text-ink-900 hover:border-ink-900 hover:text-ink-900";

type Contexte = {
  action: string;
  base: string;
  filtres: Filtres;
  departements: Departement[];
  titres: Map<string, Titre>;
};

/** Libellé lisible d'une puce de filtre. */
function libellePuce(p: Puce, c: Contexte): string {
  switch (p.dimension) {
    case "dept": {
      const d = c.departements.find((x) => x.code === p.valeur);
      return d ? `${d.nom} (${d.code})` : p.valeur;
    }
    case "titres":
      return c.titres.get(p.valeur)?.libelle_court ?? p.valeur;
    case "fin":
      return libelle(FINANCEMENTS, p.valeur);
    case "rythmes":
      return libelle(RYTHMES, p.valeur);
    case "qualiopi":
      return "Certifié Qualiopi";
    case "q":
      return `« ${p.valeur} »`;
    default:
      return p.valeur;
  }
}

/** « Votre recherche : » — chaque filtre retirable individuellement. */
export function PucesFiltres(c: Contexte) {
  const liste = puces(c.filtres);
  if (liste.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[13px] text-ink-400">Votre recherche{" "}:</span>
      {liste.map((p) => (
        <Link
          key={`${p.dimension}-${p.valeur}`}
          href={`${c.action}${versQuery(p.sans)}`}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pr-2 pl-3.5 text-[13px] font-semibold text-ink-900 hover:border-ink-900 hover:text-ink-900"
        >
          {fr(libellePuce(p, c))}
          <span
            aria-hidden="true"
            className="flex size-[19px] items-center justify-center rounded-full bg-cream-200 text-ink-400"
          >
            ×
          </span>
          <span className="sr-only">Retirer ce filtre</span>
        </Link>
      ))}
      <Link href={c.action} className="px-1 py-1.5 text-[13px] font-semibold">
        Tout effacer
      </Link>
    </div>
  );
}

/**
 * Départements voisins du filtre « Où » (décision Erwan 01/10/2026) : lien vers la page département si elle existe,
 * libellé simple sinon ; si aucun voisin n'a de page, le bloc devient « Voir tous les organismes d'Île-de-France → ».
 */
function Voisins({ c, intro }: { c: Contexte; intro: string }) {
  if (!c.filtres.dept) return null;
  const voisins = (DEPARTEMENTS_VOISINS[c.filtres.dept] ?? []).flatMap((code) =>
    c.departements.filter((d) => d.code === code),
  );
  if (!voisins.some((d) => d.a_une_page))
    return (
      <p className="text-[14.5px] leading-[1.7]">
        <Link href={c.action} className="font-semibold">
          Voir tous les organismes d&apos;Île-de-France →
        </Link>
      </p>
    );
  return (
    <p className="text-[14.5px] leading-[1.7] text-ink-500">
      {fr(intro)}{" "}
      {voisins.map((d, i) => (
        <span key={d.code}>
          {i > 0 && " · "}
          {d.a_une_page ? (
            <Link href={`${c.base}${d.slug}/`}>
              {d.nom} ({d.code})
            </Link>
          ) : (
            `${d.nom} (${d.code})`
          )}
        </span>
      ))}
    </p>
  );
}

/** Page pilier visible correspondant à un filtre « titre » unique (bande contextuelle, sorties de secours). */
export function titreDedie(c: Contexte): Titre | null {
  if (c.filtres.titres.length !== 1) return null;
  const t = c.titres.get(c.filtres.titres[0]);
  return t?.a_une_page ? t : null;
}

export function EtatZero({ tous, ...c }: Contexte & { tous: Organisme[] }) {
  const r = relachement(tous, c.filtres);
  const dedie = titreDedie(c);
  return (
    <div className="flex flex-col gap-[18px] rounded-[20px] border border-line bg-white p-[clamp(22px,2.6vw,32px)]">
      <p className="text-xl font-bold tracking-[-0.02em]">Aucun organisme ne correspond à ces critères</p>
      {r && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-cream-100 px-5 py-[18px]">
          <span className="text-[15.5px] leading-[1.45] font-bold">
            {fr(`Retirez « ${libellePuce(r.puce, c)} » et `)}
            {r.nombre} organisme{r.nombre > 1 ? "s" : ""} correspond{r.nombre > 1 ? "ent" : ""}.
          </span>
          <Link
            href={`${c.action}${versQuery(r.puce.sans)}`}
            className="flex-none rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white hover:bg-brique-700 hover:text-white"
          >
            Retirer ce filtre →
          </Link>
        </div>
      )}
      <Voisins c={c} intro="Ou consultez les organismes des départements voisins :" />
      <div className="flex flex-wrap gap-2.5 border-t border-[#F0ECE6] pt-4">
        <Link href={c.action} className={bouton}>
          Tout effacer et voir tous les organismes
        </Link>
        {dedie && (
          <Link href={`${c.base}${dedie.slug}/`} className={bouton}>
            Voir la page dédiée au {dedie.libelle_court} →
          </Link>
        )}
      </div>
    </div>
  );
}

/** Résultat unique : carte pleine largeur avec la présentation (Copy catalogue §8.3). */
export function EtatUnique({ organisme: o, ...c }: Contexte & { organisme: Organisme }) {
  const financements = FINANCEMENTS_FILTRE.filter((f) => o.financements.includes(f));
  return (
    <div className="flex flex-col gap-3.5">
      <p className="text-[14.5px] leading-[1.6] text-ink-500">
        Un seul organisme correspond à ces critères. Élargissez votre recherche pour en voir davantage.
      </p>
      <Link
        href={`${c.base}organismes/${o.slug}/`}
        className="grid gap-[26px] rounded-[20px] border border-line bg-white p-[26px] text-ink-900 hover:border-ink-900 hover:text-ink-900 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
      >
        <span className="flex min-w-0 flex-col gap-3.5">
          <span className="flex items-start gap-3.5">
            <LogoOrganisme nom={o.nom} logo={o.logo_url} taille={54} className="rounded-[14px]" />
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-xl leading-[1.25] font-bold tracking-[-0.02em]">{o.nom}</span>
              <span className="text-sm text-ink-400">{localisation(o)}</span>
            </span>
          </span>
          {o.presentation && <span className="text-[15px] leading-[1.7] text-ink-500">{fr(o.presentation)}</span>}
          {financements.length > 0 && (
            <span className="flex flex-wrap items-center gap-2.5 border-t border-[#F0ECE6] pt-1 text-[13px] text-ink-500">
              <span className="font-mono text-[10.5px] tracking-[0.1em] text-ink-400 uppercase">Financements</span>
              {financements.map((f) => libelle(FINANCEMENTS, f)).join(" · ")}
            </span>
          )}
        </span>
        {o.offres.length > 0 && (
          <span className="flex min-w-0 flex-col gap-2">
            <span className="font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase">Titres préparés</span>
            <span className="flex flex-wrap gap-1.5">
              {o.offres.map((x) => (
                <span
                  key={x.id}
                  className="inline-flex items-center gap-[7px] rounded-[9px] border border-line px-[11px] py-1.5 text-[13.5px] font-semibold"
                >
                  <span aria-hidden="true" className="block size-[5px] rounded-full bg-brique-700" />
                  {x.titre.libelle_court}
                </span>
              ))}
            </span>
          </span>
        )}
      </Link>
      <Voisins c={c} intro="Voir aussi les départements voisins :" />
    </div>
  );
}

export function Grille({ organismes, base }: { organismes: Organisme[]; base: string }) {
  return (
    <ol className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-3.5">
      {organismes.map((o) => (
        <li key={o.id}>
          <CarteOrganisme organisme={o} base={base} />
        </li>
      ))}
    </ol>
  );
}

/** État « chargement » : squelettes de cartes, pas de spinner ni de texte (aucun décalage de mise en page). */
export function Squelettes() {
  return (
    <div aria-hidden="true" className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-3.5">
      {[80, 70, 76, 66].map((l) => (
        <span key={l} className="flex animate-pulse flex-col gap-3.5 rounded-[18px] border border-line bg-white p-5">
          <span className="flex gap-[13px]">
            <span className="block size-[46px] rounded-[13px] bg-[#EEEAE4]" />
            <span className="flex flex-1 flex-col gap-2">
              <span className="block h-[15px] rounded-full bg-[#EEEAE4]" style={{ width: `${l}%` }} />
              <span className="block h-3 w-2/5 rounded-full bg-cream-200" />
            </span>
          </span>
          <span className="flex gap-1.5">
            <span className="block h-[29px] w-[82px] rounded-[9px] bg-cream-200" />
            <span className="block h-[29px] w-[82px] rounded-[9px] bg-cream-200" />
          </span>
          <span className="block h-[13px] w-3/5 rounded-full bg-cream-200" />
        </span>
      ))}
    </div>
  );
}
