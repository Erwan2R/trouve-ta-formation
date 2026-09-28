import { FINANCEMENTS, FINANCEMENTS_FILTRE, monogramme } from "@/lib/organismes/libelles";
import type { Action } from "@/lib/organismes/relance";
import type { LieuEspace, OffreEspace } from "@/lib/supabase/queries/espace";
import type { Tables } from "@/lib/supabase/types";

/**
 * « Ce que voit un candidat » (maquette Dashboard) : la carte du catalogue, avec les manques en pointillés
 * et, en brique, le numéro de l'action de la checklist qui les comble.
 */
export function ApercuCarte({
  organisme: o,
  siege,
  nbLieux,
  offres,
  actions,
}: {
  organisme: Tables<"organismes">;
  siege: LieuEspace | null;
  nbLieux: number;
  offres: OffreEspace[];
  actions: Action[];
}) {
  const numero = (k: Action) => {
    const i = actions.indexOf(k);
    return i < 0 ? null : String(i + 1);
  };
  const Pastille = ({ k }: { k: Action }) =>
    numero(k) && (
      <span className="absolute -top-2.5 -right-2.5 flex size-5 items-center justify-center rounded-full bg-brique-700 font-mono text-[10.5px] text-white">
        {numero(k)}
      </span>
    );
  const pointille = (k: Action) => (numero(k) ? "border-brique-700" : "border-line-heavy");
  const autres = nbLieux - 1;
  const financements = FINANCEMENTS_FILTRE.filter((f) => o.financements.includes(f)).map((f) => FINANCEMENTS[f]);

  return (
    <div className="flex w-full max-w-[440px] flex-col gap-3.5 rounded-[18px] border border-line bg-white p-5">
      <span className="flex items-start gap-[13px]">
        <span className="relative flex-none">
          {o.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- aperçu du logo déposé, déjà en WebP
            <img
              src={o.logo_url}
              alt=""
              width={48}
              height={48}
              className="size-12 rounded-[13px] border border-line object-contain"
            />
          ) : (
            <span
              className={`flex size-12 items-center justify-center rounded-[13px] border-[1.5px] border-dashed bg-cream-200 font-mono text-sm text-ink-600 ${numero("logo") ? "border-brique-700" : "border-line"}`}
            >
              {monogramme(o.nom)}
            </span>
          )}
          <Pastille k="logo" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-[7px]">
          <span className="flex flex-col gap-0.5">
            <span className="text-[16.5px] leading-[1.3] font-bold tracking-[-0.015em]">{o.nom}</span>
            {siege && (
              <span className="text-[13px] text-ink-400">
                {siege.ville} ({siege.departement})
                {autres > 0 && ` et ${autres} autre${autres > 1 ? "s" : ""} lieu${autres > 1 ? "x" : ""}`}
              </span>
            )}
          </span>
          <span className="flex flex-wrap gap-1.5">
            {o.numero_agrement_cnaps ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-2.5 py-1 text-[11.5px] font-semibold text-white">
                <span aria-hidden="true" className="block size-[5px] rounded-full bg-brique-400" />
                Agréé CNAPS
              </span>
            ) : (
              <span
                className={`relative inline-flex items-center rounded-full border-[1.5px] border-dashed px-2.5 py-[3px] text-[11.5px] font-semibold text-ink-500 ${pointille("cnaps")}`}
              >
                Agrément non renseigné
                <Pastille k="cnaps" />
              </span>
            )}
            {o.qualiopi ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-2.5 py-1 text-[11.5px] font-semibold text-ink-600">
                <span aria-hidden="true" className="block size-[5px] rounded-full bg-brique-700" />
                Qualiopi
              </span>
            ) : (
              numero("qualiopi") && (
                <span className="relative inline-flex items-center rounded-full border-[1.5px] border-dashed border-brique-700 px-2.5 py-[3px] text-[11.5px] font-semibold text-ink-500">
                  Qualiopi
                  <Pastille k="qualiopi" />
                </span>
              )
            )}
          </span>
        </span>
      </span>
      {offres.length > 0 ? (
        <span className="flex flex-wrap gap-1.5">
          {offres.slice(0, 3).map((x) => (
            <span
              key={x.id}
              className="inline-flex items-center gap-[7px] rounded-[9px] border border-line px-[11px] py-1.5 text-[13px] font-semibold"
            >
              <span aria-hidden="true" className="block size-[5px] rounded-full bg-brique-700" />
              {x.titre.libelle_court}
            </span>
          ))}
        </span>
      ) : (
        <span
          className={`relative flex items-center justify-center rounded-[11px] border-[1.5px] border-dashed px-3.5 py-[11px] text-[13px] font-semibold text-ink-500 ${pointille("formations")}`}
        >
          Aucune formation déclarée
          <Pastille k="formations" />
        </span>
      )}
      <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 border-t border-cream-200 pt-3 text-[12.5px] text-ink-500">
        <span className="font-mono text-[10.5px] tracking-[0.1em] text-ink-400 uppercase">Financements</span>
        {financements.length > 0 ? (
          <span>{financements.join(" · ")}</span>
        ) : (
          <span
            className={`relative rounded-lg border-[1.5px] border-dashed px-[9px] py-[3px] font-semibold text-ink-500 ${pointille("financements")}`}
          >
            Non renseignés
            <Pastille k="financements" />
          </span>
        )}
      </span>
    </div>
  );
}
