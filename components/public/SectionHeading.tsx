/** En-tête de section centré : filet brique 30px, sur-titre mono, H2, chapô (maquette accueil). */
export function SectionHeading({
  surtitre,
  titre,
  chapo,
  id,
}: {
  surtitre?: string;
  titre: string;
  chapo?: string;
  id?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-[13px] text-center">
      <span aria-hidden="true" className="block h-0.5 w-[30px] bg-brique-700" />
      {surtitre && <span className="eyebrow text-brique-700">{surtitre}</span>}
      <h2
        id={id}
        className="max-w-[22ch] text-[clamp(28px,3.2vw,40px)] leading-[1.1] font-bold tracking-[-0.025em] text-balance"
      >
        {titre}
      </h2>
      {chapo && <p className="max-w-[64ch] text-[16.5px] leading-[1.65] text-ink-500">{chapo}</p>}
    </div>
  );
}
