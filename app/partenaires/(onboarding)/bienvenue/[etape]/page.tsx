import Link from "next/link";
import { notFound } from "next/navigation";
import { EtapeLieux } from "@/components/espace/EtapeLieux";
import { MaFiche } from "@/components/espace/MaFiche";
import { MesFormations } from "@/components/espace/MesFormations";
import { NavigationEtapes } from "@/components/espace/NavigationEtapes";
import { Logo } from "@/components/public/Logo";
import { ETAPES, ONBOARDING as O } from "@/contenu/espace/onboarding";
import { getEspace } from "@/lib/supabase/queries/espace";
import * as actionsFiche from "../../../(connecte)/ma-fiche/actions";
import { donneesMaFiche } from "../../../(connecte)/ma-fiche/donnees";
import * as actionsFormations from "../../../(connecte)/formations/actions";
import { donneesFormations } from "../../../(connecte)/formations/donnees";
import { noterEtape } from "../../actions";

type Props = { params: Promise<{ etape: string }> };

/**
 * Accompagnement à l'inscription (spec Inscription §6-7) : 7 étapes, chacune franchissable et reportable,
 * enregistrement automatique, progression visible, sortie possible à tout moment.
 */
export default async function EtapeOnboarding({ params }: Props) {
  const n = Number((await params).etape);
  if (!Number.isInteger(n) || n < 1 || n > ETAPES.length) notFound();
  const espace = await getEspace();
  const etape = ETAPES[n - 1];
  const total = ETAPES.length;
  const fiche = (
    <MaFiche
      actions={{ ...actionsFiche }}
      donnees={donneesMaFiche(espace)}
      mode={{ sections: etape.sections ?? [], auto: true }}
    />
  );

  return (
    <>
      <header className="sticky top-3.5 z-30 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[28px] border border-line bg-white/92 px-5 py-3.5 backdrop-blur-md">
        <Logo height={24} priority />
        <div className="flex min-w-[200px] flex-1 flex-col gap-2">
          <span className="flex flex-wrap items-center gap-2.5 font-mono text-[11.5px] tracking-[0.06em] text-ink-600">
            <span>{O.progression(n, total)}</span>
            <span className="text-line-heavy">—</span>
            <span className="text-[10.5px] tracking-[0.12em] text-brique-700 uppercase">{O.restantes(total - n)}</span>
          </span>
          <span aria-hidden="true" className="flex gap-1">
            {ETAPES.map((_, i) => (
              <span
                key={i}
                className={`block h-1 flex-1 rounded-full ${i + 1 < n ? "bg-ink-900" : i + 1 === n ? "bg-brique-700" : "bg-line"}`}
              />
            ))}
          </span>
        </div>
        <Link
          href="/dashboard/"
          className="rounded-full border border-line-strong bg-white px-[18px] py-3 text-sm font-bold text-ink-900 hover:border-ink-900 hover:text-ink-900"
        >
          {O.quitter}
        </Link>
      </header>

      <section className="flex flex-col gap-2.5 px-[clamp(6px,1vw,12px)] pt-[clamp(14px,2.5vw,28px)]">
        <span className="font-mono text-[11px] tracking-[0.12em] text-ink-400 uppercase">{espace.organisme.nom}</span>
        <h1 className="text-[clamp(30px,4vw,48px)] leading-[1.02] font-extrabold tracking-[-0.04em]">{etape.titre}</h1>
        <p className="max-w-[64ch] text-base leading-[1.6] text-ink-700">{etape.intro}</p>
      </section>

      {n === 4 ? (
        <EtapeLieux dejaMultiSite={espace.lieux.some((l) => !l.est_siege)}>{fiche}</EtapeLieux>
      ) : n === 5 ? (
        <MesFormations actions={{ ...actionsFormations }} enTete={false} {...await donneesFormations()} />
      ) : (
        fiche
      )}

      <NavigationEtapes etape={n} total={total} noterEtape={noterEtape} />
    </>
  );
}
