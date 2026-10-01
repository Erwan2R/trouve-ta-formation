import type { Organisme } from "@/lib/supabase/queries/organismes";
import { actionsOrganisme } from "./actions";

const secondaire =
  "rounded-full border border-line-strong bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 hover:border-ink-900 hover:text-ink-900";

/**
 * Bloc 3 — barre d'actions collante (sous le header du site en desktop, fixée en bas d'écran en mobile).
 * Emplacement réservé : le bouton principal deviendra « Réserver » avec le module de réservation (UX fiche §7).
 */
export function BarreActions({ organisme: o }: { organisme: Organisme }) {
  const a = actionsOrganisme(o);
  if (!a.appeler && !a.site && !a.itineraire) return null;
  return (
    <div className="z-30 border-line bg-white/94 backdrop-blur-md max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:border-t lg:sticky lg:top-[var(--header-h)] lg:border-b">
      <div className="container-public flex flex-wrap items-center gap-3 py-3">
        <span className="flex min-w-0 flex-[1_1_180px] flex-col gap-0.5 max-sm:hidden">
          <span className="truncate text-[15px] font-bold tracking-[-0.015em]">{o.nom}</span>
          <span className="font-mono text-[10.5px] tracking-[0.1em] text-ink-400 uppercase">
            {o.numero_agrement_cnaps ? "Agréé CNAPS · " : ""}
            {o.siege ? `${o.siege.ville} (${o.siege.departement})` : ""}
          </span>
        </span>
        <div className="flex flex-none flex-wrap items-center gap-2 max-sm:w-full max-sm:justify-end">
          {a.itineraire && (
            <a href={a.itineraire} rel="noopener" className={secondaire}>
              Itinéraire
            </a>
          )}
          {a.site && (
            <a href={a.site} data-cta="site" rel="noopener" className={secondaire}>
              Site web
            </a>
          )}
          {a.appeler && (
            <a
              href={a.appeler}
              data-cta="telephone"
              className="rounded-full bg-ink-900 px-5 py-[11px] text-sm font-bold text-white hover:bg-brique-700 hover:text-white"
            >
              Appeler
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
