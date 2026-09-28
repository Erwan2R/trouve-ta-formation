import Link from "next/link";
import { aDesFiltres, facettes, type Filtres, type OrganismeFiltrable } from "@/lib/organismes/filtres";
import { FINANCEMENTS, FINANCEMENTS_FILTRE, RYTHMES } from "@/lib/organismes/libelles";
import type { Departement, Titre } from "@/lib/supabase/queries/referentiel";
import { FormAuto } from "./FormAuto";

function Option({
  type,
  nom,
  valeur,
  libelle,
  coche,
  nombre,
  compteurs,
  gras = false,
}: {
  type: "checkbox" | "radio";
  nom: string;
  valeur: string;
  libelle: string;
  coche: boolean;
  nombre: number;
  compteurs: boolean;
  gras?: boolean;
}) {
  // Option à zéro : grisée et non cliquable, jamais masquée (Copy catalogue §6).
  const inactive = nombre === 0 && !coche;
  return (
    <label
      className={`-mx-2 flex items-center gap-2.5 rounded-[9px] px-2 py-1.5 text-sm ${inactive ? "cursor-not-allowed text-ink-300" : "cursor-pointer text-ink-700 hover:bg-cream-100"}`}
    >
      <input
        type={type}
        name={nom}
        value={valeur}
        defaultChecked={coche}
        disabled={inactive}
        className="size-[15px] accent-ink-900"
      />
      <span className={`flex-1 ${coche || gras ? "font-semibold text-ink-900" : ""}`}>{libelle}</span>
      {compteurs && <span className="font-mono text-xs text-ink-400">{nombre}</span>}
    </label>
  );
}

function Groupe({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <details open className="border-b border-line last:border-b-0">
      <summary className="flex cursor-pointer items-center justify-between gap-3 py-4 text-sm font-bold">
        {titre}
        <span aria-hidden="true" className="text-[11px] text-ink-400">
          ▾
        </span>
      </summary>
      <fieldset className="flex flex-col gap-0.5 pb-3.5">
        <legend className="sr-only">{titre}</legend>
        {children}
      </fieldset>
    </details>
  );
}

/** Bloc 5 — filtres « Affiner ». Compteurs par option masqués sous le seuil (tout ou rien). */
export function FiltresCatalogue({
  action,
  filtres: f,
  organismes,
  departements,
  groupesTitres,
  villes,
  compteurs,
}: {
  action: string;
  filtres: Filtres;
  organismes: OrganismeFiltrable[];
  departements: Departement[];
  groupesTitres: { categorie: string; titres: Titre[] }[];
  villes: string[];
  compteurs: boolean;
}) {
  const n = facettes(organismes, f);
  const commun = { compteurs };
  return (
    <div className="rounded-[20px] border border-line bg-white px-5 pt-5 pb-2">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
        <h2 className="text-base font-bold tracking-[-0.01em]">Affiner</h2>
        {aDesFiltres(f) && (
          <Link href={action} className="text-[13px] font-semibold">
            Tout effacer
          </Link>
        )}
      </div>
      <FormAuto action={action}>
        {f.q && <input type="hidden" name="q" value={f.q} />}
        {f.tri !== "pertinence" && <input type="hidden" name="tri" value={f.tri} />}

        <Groupe titre="Où">
          {departements.map((d) => (
            <Option
              key={d.code}
              {...commun}
              type="radio"
              nom="dept"
              valeur={d.code}
              libelle={`${d.nom} (${d.code})`}
              coche={f.dept === d.code}
              nombre={n.dept.get(d.code) ?? 0}
            />
          ))}
          {/* Niveau 2 : les villes du département choisi uniquement. */}
          {f.dept && villes.length > 0 && (
            <div className="mt-1 ml-3 flex flex-col gap-0.5 border-l border-line pl-3">
              {villes.map((v) => (
                <Option
                  key={v}
                  {...commun}
                  type="checkbox"
                  nom="ville"
                  valeur={v}
                  libelle={v}
                  coche={f.villes.includes(v)}
                  nombre={n.villes.get(v) ?? 0}
                />
              ))}
            </div>
          )}
        </Groupe>

        <Groupe titre="Formation préparée">
          {groupesTitres.map((g) => (
            <div key={g.categorie} className="mt-1 flex flex-col gap-0.5 first:mt-0">
              <span className="pt-1.5 pb-1 font-mono text-[10px] tracking-[0.12em] text-ink-400 uppercase">
                {g.categorie}
              </span>
              {g.titres.map((t) => (
                <Option
                  key={t.slug}
                  {...commun}
                  type="checkbox"
                  nom="titre"
                  valeur={t.slug}
                  libelle={t.libelle_court}
                  coche={f.titres.includes(t.slug)}
                  nombre={n.titres.get(t.slug) ?? 0}
                />
              ))}
            </div>
          ))}
        </Groupe>

        <Groupe titre="Financement accepté">
          {FINANCEMENTS_FILTRE.map((fin) => (
            <Option
              key={fin}
              {...commun}
              type="checkbox"
              nom="fin"
              valeur={fin}
              libelle={FINANCEMENTS[fin]}
              coche={f.fin.includes(fin)}
              nombre={n.fin.get(fin) ?? 0}
            />
          ))}
        </Groupe>

        <Groupe titre="Rythme">
          {(Object.keys(RYTHMES) as (keyof typeof RYTHMES)[]).map((r) => (
            <Option
              key={r}
              {...commun}
              type="checkbox"
              nom="rythme"
              valeur={r}
              libelle={RYTHMES[r]}
              coche={f.rythmes.includes(r)}
              nombre={n.rythmes.get(r) ?? 0}
            />
          ))}
        </Groupe>

        <Groupe titre="Certification">
          <Option
            {...commun}
            type="checkbox"
            nom="qualiopi"
            valeur="1"
            libelle="Certifié Qualiopi"
            coche={f.qualiopi}
            nombre={n.qualiopi}
          />
        </Groupe>
      </FormAuto>
    </div>
  );
}
