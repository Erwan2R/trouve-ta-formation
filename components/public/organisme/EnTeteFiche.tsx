import { Breadcrumb } from "@/components/public/Breadcrumb";
import { URL_CONSULTATION_CNAPS } from "@/contenu/securite-privee/demarches/liste";
import type { Organisme } from "@/lib/supabase/queries/organismes";
import { LogoOrganisme } from "./LogoOrganisme";

const badge =
  "inline-flex items-center gap-[9px] rounded-xl border border-line-strong bg-white px-[15px] py-2.5 text-[13.5px] font-semibold text-ink-900";

/** Bloc 2 — identité et badges. Aucun badge négatif (Copy fiche §3). */
export function EnTeteFiche({ organisme: o, base }: { organisme: Organisme; base: string }) {
  const autres = o.lieux.length - 1;
  return (
    <section className="border-b border-line-strong bg-cream-200">
      <div className="container-public pt-[18px] pb-11">
        <Breadcrumb
          items={[
            { name: "Sécurité privée", path: base },
            { name: "Organismes", path: `${base}organismes/` },
            { name: o.nom, path: `${base}organismes/${o.slug}/` },
          ]}
        />
        <div className="mt-[34px] flex flex-wrap items-start gap-[clamp(20px,3vw,40px)]">
          <LogoOrganisme
            nom={o.nom}
            logo={o.logo_url}
            taille={96}
            className="rounded-3xl border-line-strong bg-white max-sm:size-[76px]!"
          />
          <div className="flex min-w-[min(100%,280px)] flex-[1_1_420px] flex-col gap-3.5">
            <h1 className="text-[clamp(32px,4.4vw,54px)] leading-[1.02] font-bold tracking-[-0.035em] text-balance">
              {o.nom}
            </h1>
            {o.siege && (
              <p className="text-[16.5px] leading-normal text-ink-500">
                {o.siege.ville} ({o.siege.departement})
                {autres > 0 && (
                  <>
                    {" · "}
                    <a href="#lieux" className="font-semibold">
                      et {autres} autre{autres > 1 ? "s" : ""} lieu{autres > 1 ? "x" : ""} de formation
                    </a>
                  </>
                )}
              </p>
            )}
            {(o.numero_agrement_cnaps || o.qualiopi) && (
              <div className="mt-0.5 flex flex-wrap gap-2">
                {o.numero_agrement_cnaps && (
                  <span className={badge}>
                    <span aria-hidden="true" className="block size-[7px] rounded-full bg-brique-700" />
                    Agréé CNAPS · {o.numero_agrement_cnaps}
                  </span>
                )}
                {o.qualiopi && (
                  <span className={badge}>
                    <span aria-hidden="true" className="block size-[7px] rounded-full bg-brique-700" />
                    Certifié Qualiopi
                  </span>
                )}
              </div>
            )}
            {o.numero_agrement_cnaps && (
              <p className="text-[13.5px] text-ink-400">
                Agrément vérifiable sur{" "}
                <a href={URL_CONSULTATION_CNAPS} rel="noopener" className="font-semibold">
                  l&apos;espace de consultation du CNAPS
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
