import Link from "next/link";

// Première question du formulaire affichée en dur (Copy accueil §4). Le clic ouvre le parcours
// complet en conservant la réponse (Sprint 7 : le paramètre `depart` est lu par le formulaire).
const REPONSES = [
  { depart: "debutant", libelle: "Je ne travaille pas encore dans la sécurité privée" },
  { depart: "renouvellement", libelle: "J'y travaille, ma carte arrive à échéance" },
  { depart: "evolution", libelle: "J'y travaille, je veux évoluer ou me spécialiser" },
];

/** Bloc 4 — accroche du formulaire d'affinage. */
export function AccrocheAffinage({ base }: { base: string }) {
  return (
    <section id="affinage" className="py-[88px]">
      <div className="container-public">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-center gap-10 rounded-[26px] bg-ink-900 p-[clamp(28px,4vw,56px)]">
          <div className="flex flex-col gap-4">
            <span className="eyebrow text-brique-400">Questionnaire</span>
            <h2 className="text-[clamp(26px,2.8vw,36px)] leading-[1.15] font-bold tracking-[-0.02em] text-white">
              Vous ne savez pas quel titre correspond à votre situation ?
            </h2>
            <p className="text-base leading-[1.65] text-on-dark">
              Six questions suffisent pour identifier le titre adapté à votre profil et les organismes qui le préparent
              près de chez vous.
            </p>
          </div>
          <div className="flex flex-col gap-3.5 rounded-[20px] bg-white p-7">
            <h3 className="text-[17px] font-bold tracking-[-0.01em]">Où en êtes-vous aujourd&apos;hui ?</h3>
            <div className="flex flex-col gap-2">
              {REPONSES.map((r) => (
                <Link
                  key={r.depart}
                  href={`${base}formulaire/?depart=${r.depart}`}
                  rel="nofollow"
                  className="flex items-center justify-between gap-4 rounded-[14px] border border-line bg-cream-100 px-[18px] py-4 text-[14.5px] leading-[1.4] font-medium text-ink-900 transition-colors hover:border-brique-700 hover:bg-brique-050 hover:text-ink-900"
                >
                  {r.libelle}
                  <span aria-hidden="true" className="text-[15px] text-brique-700">
                    →
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-0.5 text-[12.5px] leading-normal text-ink-400">
              Sans inscription. Vos réponses ne sont transmises à aucun organisme.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
