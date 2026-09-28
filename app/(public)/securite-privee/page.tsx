import { AccrocheAffinage } from "@/components/public/accueil/AccrocheAffinage";
import { BandeauB2B } from "@/components/public/accueil/BandeauB2B";
import { CommentCaMarche } from "@/components/public/accueil/CommentCaMarche";
import { CorpsEditorial } from "@/components/public/accueil/CorpsEditorial";
import { Demarches } from "@/components/public/accueil/Demarches";
import { EntreeGeo } from "@/components/public/accueil/EntreeGeo";
import { GrilleTitres } from "@/components/public/accueil/GrilleTitres";
import { Hero } from "@/components/public/accueil/Hero";
import { Reassurance } from "@/components/public/accueil/Reassurance";
import { Faq, type QuestionFaq } from "@/components/public/Faq";
import { VERTICALES, type Verticale } from "@/lib/config/verticales";
import { dateLongue } from "@/lib/format-date";
import { buildMetadata } from "@/lib/seo/metadata";
import { getCompteursAffiches } from "@/lib/supabase/queries/compteurs";
import { getDemarches } from "@/lib/supabase/queries/demarches";
import { getDepartements, getTitres, getTitresParCategorie } from "@/lib/supabase/queries/referentiel";

const verticale: Verticale = VERTICALES["securite-privee"];
const base = `/${verticale.slug}/`;

// Copy_Page_Accueil_Securite_Privee.md §0 (title A, description longue, OG dédié).
export const metadata = buildMetadata({
  title: "Formation sécurité privée en Île-de-France : organismes et titres",
  description:
    "Tous les organismes de formation à la sécurité privée d'Île-de-France, titre par titre et département par département. TFP APS, SSIAP, cynophile, sûreté aéroportuaire : identifiez la formation qui correspond à votre situation.",
  path: base,
  og: {
    title: "Formation sécurité privée en Île-de-France",
    description: "L'annuaire des organismes de formation à la sécurité privée en Île-de-France.",
  },
});

// Copy §10 — questions propres à l'accueil, distinctes du catalogue et des piliers.
const FAQ: QuestionFaq[] = [
  {
    question: "Faut-il un diplôme pour entrer en formation à la sécurité privée ?",
    reponse:
      "Aucun diplôme n'est exigé pour les titres d'entrée dans le métier. Les conditions portent sur l'autorisation préalable du CNAPS, la maîtrise du français et la majorité, pas sur un niveau scolaire.",
  },
  {
    question: "Peut-on se former à la sécurité privée sans autorisation préalable ?",
    reponse:
      "Non. L'autorisation préalable du CNAPS conditionne l'entrée en formation. Elle se demande avant l'inscription, et son instruction prend du temps : c'est la première démarche à engager.",
  },
  {
    question: "Un casier judiciaire empêche-t-il de travailler dans la sécurité privée ?",
    reponse:
      "Pas systématiquement. Le CNAPS examine la nature des mentions au regard des exigences du métier. Certaines condamnations sont rédhibitoires, d'autres non.",
  },
  {
    question: "Combien de temps dure une formation d'agent de sécurité ?",
    reponse:
      "Cela dépend du titre visé. Un titre d'entrée dans le métier représente généralement quelques semaines à temps plein ; un stage de maintien des compétences, quelques jours ; un titre de spécialité, plusieurs mois.",
  },
  {
    question: "Quelle différence entre le TFP APS et le SSIAP 1 ?",
    reponse:
      "Deux métiers distincts. Le TFP APS prépare à la surveillance de sites, de magasins et d'événements. Le SSIAP 1 prépare à la sécurité incendie en établissement recevant du public. Ils se cumulent souvent au cours d'une carrière.",
  },
  {
    question: "Peut-on financer sa formation avec le CPF ?",
    reponse:
      "Oui pour la plupart des titres, sous réserve que l'organisme soit certifié Qualiopi et la formation référencée. Chaque fiche d'organisme indique les financements acceptés.",
  },
  {
    question: "Faut-il refaire une formation complète pour renouveler sa carte professionnelle ?",
    reponse:
      "Non. Le renouvellement passe par un stage de maintien et d'actualisation des compétences, nettement plus court que la formation initiale, à suivre avant l'échéance des cinq ans.",
  },
  {
    question: "Les formations se font-elles à distance ?",
    reponse:
      "Très marginalement. Les titres de la sécurité privée comportent des mises en situation pratiques et des épreuves en présentiel. Certains modules théoriques peuvent être suivis à distance selon l'organisme.",
  },
  {
    question: "Comment vérifier qu'un organisme de formation est habilité ?",
    reponse:
      "L'organisme doit être déclaré auprès du CNAPS pour dispenser des formations à la sécurité privée, et certifié Qualiopi pour accéder aux financements publics. Ces deux informations figurent sur chaque fiche.",
  },
  {
    question: "Trouve ta formation est-il rémunéré par les organismes référencés ?",
    reponse:
      "Non. Le référencement est gratuit et aucun organisme ne peut acheter une meilleure position dans nos résultats.",
  },
];

export default async function AccueilSecuritePrivee() {
  const [titres, groupes, departements] = await Promise.all([getTitres(), getTitresParCategorie(), getDepartements()]);

  const [compteurs, { visibles }] = await Promise.all([
    getCompteursAffiches(verticale.seuilCompteurs),
    getDemarches(verticale),
  ]);

  const derniereMaj = titres.reduce((max, t) => (t.created_at > max ? t.created_at : max), "");
  const ligneChiffres = compteurs
    ? `${compteurs.total} organismes référencés · ${titres.length} titres de formation · ${departements.length} départements franciliens`
    : `${titres.length} titres de formation couverts · ${departements.length} départements franciliens · Mise à jour le ${dateLongue(derniereMaj)}`;

  const deptsOrdonnes = verticale.footerDepartements.flatMap((code) => departements.filter((d) => d.code === code));

  const demarches = <Demarches verticale={verticale} />;

  return (
    <main>
      <Hero base={base} ligneChiffres={ligneChiffres} />
      <GrilleTitres base={base} groupes={groupes} compteurs={compteurs?.parTitre ?? null} />
      <AccrocheAffinage base={base} />
      <EntreeGeo base={base} departements={deptsOrdonnes} compteurs={!!compteurs} />
      {/* Lancement : démarches remontées en position 6. Au-dessus du seuil : échantillon d'organismes (Sprint 5), puis démarches après « Comment ça marche ». */}
      {!compteurs && demarches}
      <CommentCaMarche />
      {compteurs && demarches}
      <Reassurance />
      <CorpsEditorial base={base} titres={new Map(titres.map((t) => [t.slug, t]))} demarchesVisibles={visibles} />
      <Faq titre="Questions fréquentes sur la formation en sécurité privée" questions={FAQ} />
      {/* Derniers articles (bloc 11) : Sprint 10, absent tant qu'aucun article n'est publié. */}
      <div className="pt-[88px]">
        <BandeauB2B base={base} />
      </div>
    </main>
  );
}
