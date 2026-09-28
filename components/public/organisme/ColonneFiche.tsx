import { FINANCEMENTS, libelle } from "@/lib/organismes/libelles";
import type { Organisme } from "@/lib/supabase/queries/organismes";
import { actionsOrganisme, domaine } from "./actions";

const surtitre = "font-mono text-[10.5px] tracking-[0.12em] text-ink-400 uppercase";
const secondaire =
  "flex flex-1 items-center justify-center rounded-full border border-line-strong bg-white px-4 py-[13px] text-[14.5px] font-semibold text-ink-900 hover:border-ink-900 hover:text-ink-900";

/** Colonne pratique — actions, financements (bloc 7) et informations pratiques (bloc 8). Chaque donnée absente disparaît. */
export function ColonneFiche({ organisme: o }: { organisme: Organisme }) {
  const a = actionsOrganisme(o);
  const infos: [string, React.ReactNode, boolean?][] = [
    ...(o.telephone && a.appeler
      ? [
          [
            "Téléphone",
            <a key="t" href={a.appeler} className="text-ink-900">
              {o.telephone}
            </a>,
          ] as [string, React.ReactNode],
        ]
      : []),
    ...(o.email_contact
      ? [
          [
            "Email",
            <a key="e" href={`mailto:${o.email_contact}`} className="text-ink-900">
              {o.email_contact}
            </a>,
          ] as [string, React.ReactNode],
        ]
      : []),
    ...(o.site_web
      ? [
          [
            "Site internet",
            <a key="s" href={o.site_web} rel="noopener" className="text-ink-900">
              {domaine(o.site_web)}
            </a>,
          ] as [string, React.ReactNode],
        ]
      : []),
    ...(o.horaires ? [["Horaires d'accueil", o.horaires] as [string, React.ReactNode]] : []),
    ...(o.accessibilite_pmr
      ? [["Accessibilité", "Locaux accessibles aux personnes à mobilité réduite"] as [string, React.ReactNode]]
      : []),
    ...(o.langues.length ? [["Langues d'enseignement", o.langues.join(", ")] as [string, React.ReactNode]] : []),
    ...(o.annee_creation ? [["Organisme créé en", String(o.annee_creation)] as [string, React.ReactNode]] : []),
    ...(o.numero_declaration_activite
      ? [
          ["Numéro de déclaration d'activité", o.numero_declaration_activite, true] as [
            string,
            React.ReactNode,
            boolean,
          ],
        ]
      : []),
  ];

  return (
    <aside className="flex min-w-[min(100%,270px)] flex-[1_1_300px] flex-col gap-3 lg:sticky lg:top-[calc(var(--header-h)+84px)]">
      {(a.appeler || a.site || a.itineraire || o.financements.length > 0) && (
        <div className="flex flex-col gap-3.5 rounded-[20px] border border-line bg-white p-[22px]">
          {a.appeler && (
            <a
              href={a.appeler}
              className="flex items-center justify-center rounded-full bg-ink-900 px-[22px] py-4 text-base font-bold text-white hover:bg-brique-700 hover:text-white"
            >
              Appeler
            </a>
          )}
          {(a.site || a.itineraire) && (
            <div className="flex gap-2">
              {a.site && (
                <a href={a.site} rel="noopener" className={secondaire}>
                  Site web
                </a>
              )}
              {a.itineraire && (
                <a href={a.itineraire} rel="noopener" className={secondaire}>
                  Itinéraire
                </a>
              )}
            </div>
          )}
          {o.financements.length > 0 && (
            <div
              id="financements"
              className={`flex flex-col gap-[11px] ${a.appeler || a.site || a.itineraire ? "border-t border-line pt-3.5" : ""}`}
            >
              <h2 className={surtitre}>Financements acceptés</h2>
              <span className="flex flex-wrap gap-1.5">
                {o.financements.map((f) => (
                  <span
                    key={f}
                    className="rounded-[9px] border border-line px-[11px] py-[7px] text-[13.5px] font-semibold"
                  >
                    {libelle(FINANCEMENTS, f)}
                  </span>
                ))}
              </span>
              {o.qualiopi && (
                <span className="text-[13px] leading-[1.6] text-ink-400">
                  La certification Qualiopi conditionne l&apos;accès aux financements publics et mutualisés.
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {infos.length > 0 && (
        <div className="rounded-[20px] border border-line bg-white p-[22px]">
          <h2 className={surtitre}>Informations pratiques</h2>
          <dl className="mt-3.5 flex flex-col gap-[13px]">
            {infos.map(([label, valeur, mono]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <dt className="text-[12.5px] text-ink-400">{label}</dt>
                <dd
                  className={
                    mono ? "font-mono text-[13.5px] text-ink-700" : "text-[14.5px] leading-normal text-ink-700"
                  }
                >
                  {valeur}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </aside>
  );
}
