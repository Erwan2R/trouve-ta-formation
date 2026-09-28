import Link from "next/link";
import { FINANCEMENTS_FILTRE, libelle, FINANCEMENTS } from "@/lib/organismes/libelles";
import type { Lieu, Organisme } from "@/lib/supabase/queries/organismes";
import { fr } from "@/lib/typo";
import { LogoOrganisme } from "./LogoOrganisme";

const MAX_TITRES = 3;

/**
 * « Bobigny (93) et 2 autres lieux » (Copy catalogue §8.1). `lieu` : lieu mis en avant à la place du siège
 * (page département : le lieu situé dans le département — Copy géo §7).
 */
export function localisation(o: Organisme, lieu: Lieu | null = o.siege): string {
  if (!lieu) return "";
  const autres = o.lieux.length - 1;
  const base = `${lieu.ville} (${lieu.departement})`;
  return autres > 0 ? `${base} et ${autres} autre${autres > 1 ? "s" : ""} lieu${autres > 1 ? "x" : ""}` : base;
}

/**
 * Carte du catalogue : éliminer ou retenir un organisme sans cliquer. Toute la carte est un <a> dont le nom
 * est l'ancre. Sans formation : la présentation courte (ou une ligne neutre générée) remplace les titres.
 * Aucun badge négatif : Qualiopi seulement si renseigné.
 */
export function CarteOrganisme({
  organisme: o,
  base,
  fond = "blanc",
  lieu,
}: {
  organisme: Organisme;
  base: string;
  fond?: "blanc" | "creme";
  lieu?: Lieu | null;
}) {
  const financements = FINANCEMENTS_FILTRE.filter((f) => o.financements.includes(f));
  const autresTitres = o.offres.length - MAX_TITRES;
  return (
    <Link
      href={`${base}organismes/${o.slug}/`}
      className={`flex h-full flex-col gap-3.5 rounded-[18px] border border-line p-5 text-ink-900 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ink-900 hover:text-ink-900 ${fond === "creme" ? "bg-cream-100" : "bg-white"}`}
    >
      <span className="flex flex-wrap items-start gap-[13px]">
        <LogoOrganisme nom={o.nom} logo={o.logo_url} taille={46} className="rounded-[13px]" />
        <span className="flex min-w-40 flex-[1_1_160px] flex-col gap-[3px]">
          <span className="text-[16.5px] leading-[1.3] font-bold tracking-[-0.015em]">{o.nom}</span>
          <span className="text-[13.5px] text-ink-400">{localisation(o, lieu)}</span>
        </span>
        {o.qualiopi && (
          <span className="inline-flex flex-none items-center gap-1.5 rounded-full bg-cream-200 px-[11px] py-[5px] font-mono text-[10.5px] tracking-[0.08em] text-ink-600 uppercase">
            <span aria-hidden="true" className="block size-1.5 rounded-full bg-brique-700" />
            Qualiopi
          </span>
        )}
      </span>

      {o.offres.length > 0 ? (
        <span className="flex flex-wrap gap-1.5">
          {o.offres.slice(0, MAX_TITRES).map((offre) => (
            <span
              key={offre.id}
              className="inline-flex items-center gap-[7px] rounded-[9px] border border-line px-[11px] py-1.5 text-[13.5px] font-semibold"
            >
              <span aria-hidden="true" className="block size-[5px] rounded-full bg-brique-700" />
              {offre.titre.libelle_court}
            </span>
          ))}
          {autresTitres > 0 && (
            <span className="inline-flex items-center px-1 py-1.5 text-[13px] text-ink-400">
              +{autresTitres} titre{autresTitres > 1 ? "s" : ""}
            </span>
          )}
        </span>
      ) : (
        <span className="line-clamp-2 text-[13.5px] leading-normal text-ink-500">
          {o.presentation
            ? fr(o.presentation)
            : `Organisme de formation à la sécurité privée · ${o.siege?.ville ?? ""} (${o.siege?.departement ?? ""})`}
        </span>
      )}

      {financements.length > 0 && (
        <span className="mt-auto flex flex-wrap items-center gap-2.5 border-t border-[#F0ECE6] pt-3 text-[12.5px] text-ink-500">
          <span className="font-mono text-[10.5px] tracking-[0.1em] text-ink-400 uppercase">Financements</span>
          {financements.map((f, i) => (
            <span key={f} className="flex items-center gap-2.5">
              {i > 0 && (
                <span aria-hidden="true" className="text-line-heavy">
                  ·
                </span>
              )}
              {libelle(FINANCEMENTS, f)}
            </span>
          ))}
        </span>
      )}
    </Link>
  );
}
