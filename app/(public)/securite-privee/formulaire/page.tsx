import Link from "next/link";
import { after } from "next/server";
import { EcranQuestion, type GroupeOptions } from "@/components/public/formulaire/EcranQuestion";
import { EcranResultat } from "@/components/public/formulaire/EcranResultat";
import { LienContenu } from "@/components/public/LienContenu";
import { sansMarqueur } from "@/contenu/marqueurs";
import {
  ASA,
  ELARGISSEMENT,
  ENCADREMENT_PREREQUIS,
  ORIGINE,
  ENCARTS,
  EXPLICATIONS,
  FORMULAIRE,
  METIERS,
  QUESTIONS,
  questionExperience,
  type Question,
  RELACHEMENT,
  RESULTAT,
  TITRES_DETENUS_GROUPES,
  sansExperience,
} from "@/contenu/securite-privee/formulaire";
import { VERTICALES, type Verticale } from "@/lib/config/verticales";
import { EST_PRODUCTION } from "@/lib/env";
import {
  AFFINAGE,
  FINANCEMENT_PROBABLE,
  TOUS_SECTEURS,
  alternatives,
  cascade,
  cleFormulaire,
  ecranCourant,
  etapesInitiales,
  lireOrigine,
  lireReponses,
  ordreRelachement,
  optionDisponible,
  recommander,
  versParams,
  type Etape,
  type Recommandation,
  type Reponses,
} from "@/lib/formulaire/parcours";
import { trier } from "@/lib/organismes/tri";
import { DEPARTEMENTS_VOISINS } from "@/lib/organismes/voisins";
import { buildMetadata } from "@/lib/seo/metadata";
import { supabasePublic } from "@/lib/supabase/client";
import { getDemarches } from "@/lib/supabase/queries/demarches";
import { getOrganismes } from "@/lib/supabase/queries/organismes";
import { getExperienceEncadrement, getSeuilPropositionElargissement } from "@/lib/supabase/queries/parametres";
import { getDepartements, getTitres, type Titre } from "@/lib/supabase/queries/referentiel";

const verticale: Verticale = VERTICALES["securite-privee"];
const base = `/${verticale.slug}/`;
const action = `${base}formulaire/`;

// Parcours et résultats jamais indexés (UX §12) ; robots.ts l'exclut aussi.
export const metadata = buildMetadata({
  title: FORMULAIRE.title,
  description: FORMULAIRE.description,
  path: action,
  noindex: true,
});

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** « le recyclage SSIAP 1 » dans une phrase, « le TFP APS » tel quel. */
const court = (t: Titre) => t.libelle_court.replace(/^Recyclage/, "recyclage");
/** « en Seine-Saint-Denis », « à Paris ou dans les Yvelines ». */
const ouFr = (formes: string[]) =>
  formes.length > 1 ? `${formes.slice(0, -1).join(", ")} ou ${formes.at(-1)}` : formes[0];

export default async function Formulaire({ searchParams }: Props) {
  const params = await searchParams;
  const [titres, departements, organismes, { visibles }, seuil, experienceMin] = await Promise.all([
    getTitres(), // titres actifs seulement : les archivés sont exclus des questions et des résultats
    getDepartements(),
    getOrganismes(),
    getDemarches(verticale),
    getSeuilPropositionElargissement(),
    getExperienceEncadrement(),
  ]);
  const actifs = new Set(titres.map((t) => t.slug));
  const parSlug = new Map(titres.map((t) => [t.slug, t]));
  const deptsOrdonnes = verticale.footerDepartements.flatMap((c) => departements.filter((d) => d.code === c));
  const un = (k: string) => (Array.isArray(params[k]) ? params[k][0] : params[k]) ?? null;

  const r = lireReponses(
    params,
    departements.map((d) => d.code),
  );
  let ecran = ecranCourant(r, un("etape"), un("apres"));
  const reco = ecran === "resultat" ? recommander(r, actifs) : null;
  if (ecran === "resultat" && !reco) ecran = "depart"; // réponse devenue sans sortie (titre archivé entre-temps)

  // Page d'origine : conservée tout au long du parcours pour le lien de retour.
  const depuis = lireOrigine(params.depuis, base);
  const persistants: Record<string, string> = depuis ? { depuis } : {};
  const lien = (extra: Record<string, string>) => `${action}?${versParams(r, { ...persistants, ...extra })}`;
  // Écrans atteints (suivi des abandons) : compteur anonyme par écran, production seulement, après la réponse.
  const compter = (cle: string) =>
    EST_PRODUCTION &&
    after(async () => {
      const { error } = await supabasePublic().rpc("compter_formulaire", { p_cle: cle });
      if (error) console.error("Statistique formulaire :", error.message);
    });
  compter(`ecran=${ecran}`);
  const initiales = etapesInitiales(r);
  const affinage = ecran !== "resultat" && AFFINAGE.includes(ecran);

  let corps: React.ReactNode;
  let entete: React.ReactNode;

  if (ecran !== "resultat") {
    const question = ecran === "experience" ? questionExperience(r.detenu, experienceMin) : QUESTIONS[ecran];
    const etapes = affinage ? AFFINAGE : initiales;
    const i = etapes.indexOf(ecran);
    const precedent = i > 0 ? etapes[i - 1] : affinage ? "resultat" : null;
    // Le total n'est connu qu'une fois la branche choisie (Copy §2) : jamais un total inexact.
    const total = affinage || r.depart ? etapes.length : null;
    entete = (
      <div className="flex flex-col gap-[9px]">
        <span className="flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.06em] text-ink-600">
          <span>{total ? `Question ${i + 1} sur ${total}` : `Question ${i + 1}`}</span>
          {affinage && (
            <>
              <span className="text-line-heavy">—</span>
              <span className="text-[10.5px] tracking-[0.12em] text-brique-700 uppercase">Affinage</span>
            </>
          )}
        </span>
        {total && (
          <span aria-hidden="true" className="flex gap-1">
            {etapes.map((e, j) => (
              <span
                key={e}
                className={`block h-1 flex-1 rounded-full ${j < i ? "bg-ink-900" : j === i ? "bg-brique-700" : "bg-line"}`}
              />
            ))}
          </span>
        )}
      </div>
    );
    corps = (
      <EcranQuestion
        etape={ecran}
        question={question}
        groupes={groupes(ecran, question, r, actifs, deptsOrdonnes)}
        type={ecran === "secteur" ? "multiple" : ecran === "pmr" ? "case" : "unique"}
        reponses={r}
        persistants={persistants}
        action={action}
        retour={precedent ? lien({ etape: precedent }) : null}
      />
    );
  } else if (reco?.type === "asa") {
    entete = <span className="eyebrow text-brique-700">{RESULTAT.surtitre}</span>;
    corps = (
      <div className="flex max-w-[64ch] flex-col gap-3.5 px-[clamp(20px,3vw,32px)] py-[clamp(24px,3.5vw,40px)]">
        <h2 className="text-[clamp(23px,3vw,30px)] leading-[1.15] font-bold tracking-[-0.025em] text-balance">
          {ASA.titre}
        </h2>
        {ASA.paragraphes.map((p) => (
          <p key={p} className="text-[16.5px] leading-[1.7] text-ink-700">
            {p}
          </p>
        ))}
        <span className="mt-1.5 flex flex-wrap gap-3">
          <LienContenu
            lien={ASA.lien}
            base={base}
            demarchesVisibles={visibles}
            className="inline-flex items-center gap-2.5 rounded-full bg-ink-900 px-6 py-[15px] text-[15.5px] font-bold text-white hover:bg-brique-700 hover:text-white"
          >
            {ASA.lien.libelle} →
          </LienContenu>
          <Link
            href={lien({ etape: "detenu" })}
            rel="nofollow"
            className="inline-flex items-center rounded-full border border-line-strong bg-white px-[22px] py-[15px] text-[15px] font-bold text-ink-900 hover:border-ink-900"
          >
            {RESULTAT.modifier}
          </Link>
        </span>
      </div>
    );
  } else {
    const rec = reco as Extract<Recommandation, { type: "titre" }>;
    const titre = parSlug.get(rec.titre)!;
    const ref = rec.reference ? parSlug.get(rec.reference) : undefined;
    const metier = METIERS[rec.reference ?? ""] ?? "";
    const explication = EXPLICATIONS[rec.gabarit](
      court(titre),
      rec.gabarit.startsWith("entree-spec") || rec.gabarit === "specialisation" ? metier : ref ? court(ref) : "",
    );

    const secteur = r.secteur?.includes(TOUS_SECTEURS) ? null : (r.secteur ?? null);
    const criteres = {
      titre: rec.titre,
      departements: secteur,
      rythme: r.rythme && r.rythme !== "indifferent" ? r.rythme : null,
      financement: FINANCEMENT_PROBABLE[r.situation ?? ""] ?? null,
      double: r.plusieurs === "deux" && (rec.titre === "tfp-aps" || rec.titre === "ssiap-1"),
      pmr: r.pmr === "1",
    };
    const demande = Number(un("elargir"));
    const minimum = Number.isInteger(demande) && demande > 0 ? demande : 0;
    const ordre = ordreRelachement(criteres, r.deplacement);
    const { applique, liste, aucun, suivant } = cascade(organismes, criteres, DEPARTEMENTS_VOISINS, ordre, minimum);
    if (r.debut && QUESTIONS.debut.options?.some((o) => o.valeur === r.debut)) compter(`debut=${r.debut}`);

    // Aucun centre avec tous les critères : combinaison de critères + compteur (jamais de réponse personnelle), production seulement.
    if (EST_PRODUCTION && (applique.length > 0 || liste.length === 0) && minimum === 0 && organismes.length > 0)
      await supabasePublic()
        .rpc("enregistrer_recherche_sans_resultat", { p_combinaison: cleFormulaire(criteres) })
        .then(({ error }) => error && console.error("Enregistrement recherche sans résultat :", error.message));

    const formes = (secteur ?? []).map((c) => departements.find((d) => d.code === c)!.forme_lieu);
    const ou = formes.length ? ouFr(formes) : null;
    const t = court(titre);
    const dernier = applique.at(-1);
    const message = aucun
      ? null
      : liste.length === 0
        ? RELACHEMENT.proximite(t, ou ?? "en Île-de-France")
        : !dernier
          ? null
          : minimum > 0
            ? ELARGISSEMENT.choisi[dernier]
            : dernier === "region"
              ? RELACHEMENT.region(t)
              : dernier === "voisins"
                ? criteres.rythme && !applique.includes("rythme")
                  ? RELACHEMENT.voisinsAvantRythme(t, ou!)
                  : RELACHEMENT.voisins(t, ou!)
                : applique.includes("voisins")
                  ? RELACHEMENT.rythmeApresVoisins(t, ou!)
                  : RELACHEMENT.rythme(t, ou, formes.length > 1);
    // Les départements choisis d'abord, puis la pertinence (Optimal en tête).
    const tries = trier(liste, "pertinence").sort(
      (a, b) =>
        Number(b.lieux.some((l) => secteur?.includes(l.departement))) -
        Number(a.lieux.some((l) => secteur?.includes(l.departement))),
    );
    const encart = rec.encart ? ENCARTS[rec.encart] : null;
    const affine = AFFINAGE.some((e) => r[e as Exclude<Etape, "secteur">]);

    entete = <span className="eyebrow text-brique-700">{affine ? RESULTAT.surtitreAffine : RESULTAT.surtitre}</span>;
    corps = (
      <EcranResultat
        base={base}
        demarchesVisibles={visibles}
        titre={{ ...titre, court: t }}
        fort={
          rec.gabarit === "encadrement-prerequis"
            ? ENCADREMENT_PREREQUIS.fort
            : rec.gabarit === "encadrement-sans-experience" && ref
              ? sansExperience(ref.libelle_court)
              : null
        }
        conseil={r.debut === "vite" || r.debut === "renseigne" ? r.debut : null}
        explication={explication}
        // Contenu à vérifier : aperçu sur dev/preprod seulement (double verrou).
        encart={encart && (sansMarqueur(encart) || !EST_PRODUCTION) ? encart : null}
        organismes={
          aucun
            ? null
            : tries.map((o) => ({
                organisme: o,
                lieu: o.lieux.find((l) => secteur?.includes(l.departement)) ?? o.siege,
              }))
        }
        message={message}
        elargir={
          suivant && liste.length > 0 && liste.length < seuil
            ? {
                texte: ELARGISSEMENT.proposition(liste.length),
                lien: lien({ etape: "resultat", elargir: String(suivant.applique) }),
                libelle: ELARGISSEMENT.lien(suivant.nombre),
              }
            : null
        }
        alternatives={alternatives(rec, actifs).map(([slug, ligne]) => ({
          titre: { ...parSlug.get(slug)!, court: court(parSlug.get(slug)!) },
          ligne,
        }))}
        affiner={affine ? null : lien({ etape: AFFINAGE[0] })}
        modifier={lien({ etape: initiales.at(-1)! })}
      />
    );
  }

  return (
    <main className="bg-cream-100 px-[clamp(8px,3vw,32px)] py-[clamp(16px,4vw,56px)]">
      {depuis && (
        <div className={`mx-auto mb-4 w-full ${ecran === "resultat" ? "max-w-[980px]" : "max-w-[720px]"}`}>
          <Link href={depuis} className="text-[15px] font-bold text-ink-900 hover:text-brique-700">
            {ORIGINE}
          </Link>
        </div>
      )}
      <div
        className={`mx-auto flex w-full flex-col overflow-hidden rounded-[26px] border border-line bg-white shadow-[0_24px_60px_-24px_rgba(11,11,11,0.22)] ${ecran === "resultat" ? "max-w-[980px]" : "max-w-[720px]"}`}
      >
        <div className="flex flex-col gap-3.5 border-b border-line px-[clamp(20px,3vw,32px)] pt-[18px] pb-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-[15px] leading-[1.35] font-bold tracking-[-0.01em]">{FORMULAIRE.h1}</h1>
            <Link
              href={depuis ?? base}
              aria-label="Fermer"
              className="flex size-10 flex-none items-center justify-center rounded-full border border-line bg-cream-100 text-xl leading-none text-ink-900 hover:border-ink-900 hover:text-ink-900"
            >
              ×
            </Link>
          </div>
          {entete}
        </div>
        {corps}
      </div>
    </main>
  );
}

/** Options d'un écran : titres archivés exclus, titres détenus groupés, départements « Nom (93) ». */
function groupes(
  ecran: Etape,
  question: Question,
  r: Reponses,
  actifs: Set<string>,
  departements: { code: string; nom: string }[],
): GroupeOptions[] {
  if (ecran === "detenu")
    return TITRES_DETENUS_GROUPES.map((g) => ({
      nom: g.nom,
      options: g.titres.filter((o) => optionDisponible("detenu", o.valeur, r, actifs)),
    })).filter((g) => g.options.length > 0);
  if (ecran === "secteur")
    return [
      { options: departements.map((d) => ({ valeur: d.code, libelle: `${d.nom} (${d.code})` })) },
      { options: [{ valeur: TOUS_SECTEURS, libelle: "Peu importe, je peux me déplacer" }] },
    ];
  if (ecran === "pmr") return [{ options: [{ valeur: "1", libelle: "Oui, j'en ai besoin" }] }];
  return [{ options: (question.options ?? []).filter((o) => optionDisponible(ecran, o.valeur, r, actifs)) }];
}
