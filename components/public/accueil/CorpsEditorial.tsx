import { LienContenu } from "@/components/public/LienContenu";
import { LienTitre } from "@/components/public/LienTitre";
import type { Titre } from "@/lib/supabase/queries/referentiel";

const h2 = "scroll-mt-24 text-[clamp(26px,2.9vw,34px)] leading-[1.15] font-bold tracking-[-0.02em]";
const prose = "text-[17px] leading-[1.75] text-ink-700";
const carteTexte = "text-[14.5px] leading-[1.65] text-ink-500";
const lien = "border-b border-brique-200";

const SOMMAIRE = [
  ["ed-secteur", "Le secteur en Île-de-France"],
  ["ed-titre", "Quel titre choisir"],
  ["ed-conditions", "Conditions communes"],
  ["ed-durees", "Durées et coûts"],
  ["ed-financer", "Financer sa formation"],
  ["ed-apres", "Après la formation"],
] as const;

/**
 * Bloc 9 — comparaison entre titres, jamais un titre développé (anti-cannibalisation).
 * Emplacements photo de la maquette omis tant qu'aucune photo n'est fournie.
 */
export function CorpsEditorial({
  base,
  titres,
  demarchesVisibles,
}: {
  base: string;
  titres: Map<string, Titre>;
  demarchesVisibles: Set<string>;
}) {
  return (
    <section className="border-t border-line bg-white py-[88px]">
      <div className="container-public flex flex-wrap items-start gap-14">
        <nav aria-label="Sur cette page" className="sticky top-24 flex min-w-0 flex-[0_1_200px] flex-col gap-2.5">
          <span className="font-mono text-[10.5px] tracking-[0.14em] text-ink-400 uppercase">Sur cette page</span>
          {SOMMAIRE.map(([id, libelle]) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-sm leading-[1.4] font-medium text-ink-600 hover:text-brique-700"
            >
              {libelle}
            </a>
          ))}
        </nav>

        <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-[72px]">
          <div className="flex flex-col gap-[18px]">
            <h2 id="ed-secteur" className={h2}>
              Le secteur de la sécurité privée en Île-de-France
            </h2>
            <p className={prose}>
              La sécurité privée regroupe des métiers très différents derrière une même appellation. Un agent qui
              surveille un centre commercial, un agent de service de sécurité incendie posté dans une tour de bureaux et
              un maître-chien intervenant sur un chantier relèvent tous du même cadre réglementaire, mais ne suivent pas
              la même formation et ne postulent pas aux mêmes offres.
            </p>
            <p className={prose}>
              L&apos;Île-de-France concentre une part importante de l&apos;activité du secteur : densité
              d&apos;établissements recevant du public, plateformes aéroportuaires, sièges sociaux, événementiel.
              C&apos;est aussi la région où l&apos;offre de formation est la plus dense, ce qui rend le choix d&apos;un
              organisme plus difficile plutôt que plus simple.
            </p>
            <p className="border-l-2 border-brique-700 pl-5 text-[clamp(18px,1.9vw,21px)] leading-normal tracking-[-0.01em] text-ink-900">
              Le point commun à tous ces métiers : ils sont réglementés. Nul ne peut exercer sans{" "}
              <LienContenu
                lien={{ href: "demarches/carte-professionnelle/", libelle: "carte professionnelle" }}
                base={base}
                demarchesVisibles={demarchesVisibles}
                className={lien}
                enLigne
              />
              , et nul n&apos;obtient de carte professionnelle sans un titre reconnu. La formation n&apos;est donc pas
              une option de confort mais une condition d&apos;accès.
            </p>
          </div>

          <div className="flex flex-col gap-[18px]">
            <h2 id="ed-titre" className={h2}>
              Quel titre choisir selon votre situation
            </h2>
            <p className={prose}>
              C&apos;est la question qui bloque la plupart des candidats, et elle se tranche en regardant sa propre
              situation avant de regarder le catalogue.
            </p>
            <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-3.5">
              <div className="flex flex-col gap-3 rounded-[18px] border border-line bg-cream-100 p-6">
                <h3 className="text-lg leading-[1.3] font-bold tracking-[-0.01em]">
                  Vous n&apos;avez jamais travaillé dans la sécurité privée
                </h3>
                <p className={carteTexte}>
                  Deux portes d&apos;entrée dominent. La première mène à la surveillance de sites, de magasins et
                  d&apos;événements : c&apos;est le{" "}
                  <LienTitre titre={titres.get("tfp-aps")} base={base}>
                    TFP APS
                  </LienTitre>
                  , le titre le plus répandu et celui qui ouvre le plus grand nombre d&apos;offres d&apos;emploi. La
                  seconde mène à la sécurité incendie : c&apos;est le SSIAP 1, qui s&apos;exerce en poste fixe dans les
                  établissements recevant du public et les immeubles de grande hauteur.
                </p>
                <p className={carteTexte}>
                  Le choix entre les deux se joue moins sur la difficulté que sur le rythme de travail visé. La
                  surveillance implique davantage de mobilité et de contact avec le public ; la sécurité incendie,
                  davantage de postes fixes, de rondes et de procédures techniques. Les deux titres se cumulent
                  d&apos;ailleurs fréquemment au cours d&apos;une carrière.
                </p>
              </div>
              <div className="flex flex-col gap-3 rounded-[18px] border border-line bg-cream-100 p-6">
                <h3 className="text-lg leading-[1.3] font-bold tracking-[-0.01em]">
                  Vous exercez déjà et votre carte arrive à échéance
                </h3>
                <p className={carteTexte}>
                  Il ne s&apos;agit pas d&apos;une nouvelle formation mais d&apos;un stage de maintien et
                  d&apos;actualisation des compétences, dont le format dépend du titre détenu. Un agent titulaire
                  d&apos;un TFP APS suit un{" "}
                  <LienTitre titre={titres.get("mac-aps")} base={base}>
                    MAC APS
                  </LienTitre>
                  {" "}; un agent SSIAP suit un recyclage correspondant à son niveau. La logique est la même dans les
                  deux cas : une durée courte, une échéance à ne pas dépasser, et une conséquence directe sur la
                  validité de la carte professionnelle.
                </p>
                <p className={carteTexte}>
                  L&apos;erreur la plus fréquente consiste à attendre l&apos;expiration de la carte pour
                  s&apos;inscrire. Les délais de session et les délais d&apos;instruction s&apos;additionnent.
                </p>
              </div>
              <div className="flex flex-col gap-3 rounded-[18px] border border-line bg-cream-100 p-6">
                <h3 className="text-lg leading-[1.3] font-bold tracking-[-0.01em]">
                  Vous exercez et vous voulez évoluer
                </h3>
                <p className={carteTexte}>
                  Deux directions. La progression hiérarchique, d&apos;abord : le{" "}
                  <LienTitre titre={titres.get("ssiap-2")} base={base}>
                    SSIAP 2
                  </LienTitre>{" "}
                  pour encadrer une équipe, le SSIAP 3 pour prendre la responsabilité d&apos;un service de sécurité
                  incendie. La spécialisation, ensuite : cynophile, sûreté aéroportuaire, protection physique des
                  personnes. Les spécialités demandent des formations plus longues et débouchent sur des marchés plus
                  étroits mais moins concurrentiels.
                </p>
                <p className={carteTexte}>
                  Chaque titre fait l&apos;objet d&apos;une page dédiée détaillant son programme, ses conditions
                  d&apos;accès et les organismes qui le préparent en Île-de-France.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[18px]">
            <h2 id="ed-conditions" className={h2}>
              Les conditions communes à toutes les formations
            </h2>
            <p className={prose}>
              Quel que soit le titre visé, plusieurs conditions s&apos;appliquent avant même l&apos;inscription.
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3.5">
              {[
                [
                  "L'autorisation préalable du CNAPS",
                  "C'est la condition la plus mal connue et la plus bloquante. Elle doit être obtenue avant l'entrée en formation, et non après. Elle suppose notamment un casier judiciaire compatible avec l'exercice du métier, examiné par le CNAPS.",
                ],
                [
                  "La maîtrise du français",
                  "Les titres de la sécurité privée exigent un niveau de compréhension et d'expression écrite et orale suffisant, contrôlé à l'entrée en formation. Le niveau attendu varie selon le titre.",
                ],
                [
                  "L'âge et le titre de séjour",
                  "La majorité est requise. Pour les ressortissants étrangers hors Union européenne, un titre de séjour en cours de validité autorisant l'exercice d'une activité professionnelle est nécessaire.",
                ],
              ].map(([titre, texte]) => (
                <div key={titre} className="flex flex-col gap-2.5 border-t-2 border-ink-900 pt-[18px]">
                  <h3 className="text-[17px] leading-[1.3] font-bold tracking-[-0.01em]">{titre}</h3>
                  <p className={carteTexte}>{texte}</p>
                </div>
              ))}
            </div>
            <p className={prose}>
              Ces conditions relèvent de la réglementation et non des organismes : aucun centre ne peut y déroger, et un
              organisme qui proposerait de s&apos;en passer devrait éveiller votre méfiance.
            </p>
          </div>

          <div className="flex flex-col gap-[18px]">
            <h2 id="ed-durees" className={h2}>
              Durées et coûts : les ordres de grandeur
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-6">
              <p className={prose}>
                Les durées sont fixées par la réglementation, pas par les organismes. Elles vont d&apos;une trentaine
                d&apos;heures pour un stage de maintien des compétences à plusieurs centaines d&apos;heures pour les
                titres de spécialité les plus longs. Un titre d&apos;entrée dans le métier représente généralement
                quelques semaines à temps plein.
              </p>
              <p className={prose}>
                Les coûts, eux, varient d&apos;un organisme à l&apos;autre pour un même titre. Cette variation
                s&apos;explique par le format, l&apos;effectif par session, les moyens matériels et
                l&apos;accompagnement proposé — rarement par la qualité seule. Comparer les prix sans comparer ce
                qu&apos;ils recouvrent conduit à de mauvaises décisions.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-[18px]">
            <h2 id="ed-financer" className={h2}>
              Financer sa formation
            </h2>
            <p className={prose}>Plusieurs dispositifs coexistent, et ils ne s&apos;adressent pas aux mêmes profils.</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3.5">
              {[
                [
                  "Autonome",
                  "Le compte personnel de formation",
                  "mobilise les droits acquis au titre de votre activité passée, directement depuis votre espace personnel. C'est la voie la plus autonome.",
                ],
                [
                  "Demandeur d'emploi",
                  "France Travail",
                  "peut financer tout ou partie d'une formation pour un demandeur d'emploi, dans le cadre d'un projet validé avec un conseiller. Certains dispositifs sont adossés à une promesse d'embauche.",
                ],
                [
                  "Salarié",
                  "Les OPCO et le plan de développement des compétences",
                  "concernent les salariés : la formation est alors portée par l'employeur, ce qui est le cas courant des recyclages et des montées en niveau.",
                ],
              ].map(([profil, titre, texte]) => (
                <div key={titre} className="flex flex-col gap-3 rounded-[18px] border border-line bg-cream-100 p-6">
                  <span className="font-mono text-[11.5px] tracking-[0.12em] text-brique-700 uppercase">{profil}</span>
                  <h3 className="text-[17px] font-bold tracking-[-0.01em]">{titre}</h3>
                  <p className={carteTexte}>{texte}</p>
                </div>
              ))}
            </div>
            <p className={prose}>
              Chaque organisme référencé indique les financements qu&apos;il accepte. Vérifiez systématiquement que
              l&apos;organisme est certifié Qualiopi : cette certification conditionne l&apos;accès aux financements
              publics et mutualisés.
            </p>
          </div>

          <div className="flex flex-col gap-[18px] rounded-[22px] border border-line bg-cream-100 p-[clamp(24px,3vw,36px)]">
            <h2 id="ed-apres" className={h2}>
              Après la formation : obtenir sa carte professionnelle
            </h2>
            <p className={prose}>
              L&apos;obtention du titre n&apos;autorise pas encore l&apos;exercice. Elle ouvre le droit à demander la
              carte professionnelle auprès du CNAPS, qui est le document autorisant réellement à travailler. Cette carte
              est valable cinq ans et son renouvellement suppose un stage de maintien des compétences.
            </p>
            <p className={prose}>
              L&apos;enchaînement complet — autorisation préalable, formation, carte professionnelle, renouvellement —
              est détaillé dans nos{" "}
              <LienContenu
                lien={{ href: "demarches/", libelle: "pages consacrées aux démarches CNAPS" }}
                base={base}
                demarchesVisibles={demarchesVisibles}
                className={lien}
                enLigne
              />
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
