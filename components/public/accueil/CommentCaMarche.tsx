import { SectionHeading } from "@/components/public/SectionHeading";

const ETAPES = [
  {
    titre: "Identifiez votre titre",
    texte:
      "Selon votre situation et le poste que vous visez, un seul titre est généralement pertinent. Le questionnaire vous y amène en quelques questions.",
  },
  {
    titre: "Comparez les organismes",
    texte:
      "Localisation, titres préparés, modalités : les informations viennent des organismes eux-mêmes, qui gèrent leur fiche.",
  },
  {
    titre: "Contactez directement",
    texte:
      "Vous joignez l'organisme de votre choix. Nous ne sommes pas intermédiaires et ne revendons aucune coordonnée.",
  },
];

/** Bloc 7 — lève l'objection « vais-je être démarché ? ». */
export function CommentCaMarche() {
  return (
    <section className="py-[88px]">
      <div className="container-public">
        <SectionHeading titre="Comment ça marche" />
        <ol className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-8">
          {ETAPES.map((e, i) => (
            <li key={e.titre} className="flex flex-col items-center gap-3 text-center">
              <span
                aria-hidden="true"
                className="flex size-[42px] items-center justify-center rounded-full border border-line bg-white font-mono text-[13px] text-brique-700"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[19px] font-bold tracking-[-0.015em]">{e.titre}</h3>
              <p className="max-w-[38ch] text-[15px] leading-[1.7] text-ink-500">{e.texte}</p>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-11 max-w-[820px] rounded-[22px] bg-ink-900 p-[clamp(24px,3vw,36px)] text-center text-[clamp(18px,2.1vw,24px)] leading-[1.45] font-semibold tracking-[-0.015em] text-white">
          Trouve ta formation est un annuaire, pas un courtier.{" "}
          <span className="text-brique-400">
            Aucun organisme ne peut acheter une meilleure position dans nos résultats.
          </span>
        </p>
      </div>
    </section>
  );
}
