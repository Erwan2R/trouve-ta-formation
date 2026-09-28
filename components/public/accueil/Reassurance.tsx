const ENCARTS = [
  {
    surtitre: "Réglementaire",
    texte:
      "Les informations réglementaires — durées, conditions d'accès, démarches — sont établies à partir des textes en vigueur et des publications du CNAPS, et revues à chaque évolution réglementaire.",
  },
  {
    surtitre: "Classement",
    texte:
      "Aucun organisme ne peut acheter une meilleure position dans nos résultats. Le classement du catalogue repose sur la complétude des fiches, jamais sur une contrepartie financière.",
  },
];

/** Bloc optionnel « D'où viennent ces informations » (variante `reassurance` de la maquette, activée). */
export function Reassurance() {
  return (
    <section className="pb-[88px]">
      <div className="container-public">
        <div className="flex flex-col items-center gap-3.5 text-center">
          <span aria-hidden="true" className="block h-0.5 w-[30px] bg-brique-700" />
          <h2 className="text-[clamp(26px,2.9vw,36px)] leading-[1.12] font-bold tracking-[-0.025em]">
            D&apos;où viennent ces informations
          </h2>
          <p className="max-w-[64ch] text-[clamp(17px,1.9vw,21px)] leading-[1.55] tracking-[-0.01em] text-ink-900">
            Les organismes référencés créent et mettent à jour eux-mêmes leur fiche. Nous vérifions leur déclaration
            auprès du CNAPS avant publication.
          </p>
        </div>
        <div className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))] gap-3.5">
          {ENCARTS.map((e) => (
            <div key={e.surtitre} className="flex flex-col gap-2.5 rounded-[18px] border border-line bg-white p-[26px]">
              <span className="eyebrow text-brique-700">{e.surtitre}</span>
              <p className="text-[15.5px] leading-[1.7] text-ink-600">{e.texte}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
