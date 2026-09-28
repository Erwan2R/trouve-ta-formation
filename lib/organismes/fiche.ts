import type { Organisme } from "@/lib/supabase/queries/organismes";

/** « a », « a et b », « a, b et c ». */
export function listeFr(elements: string[]): string {
  if (elements.length <= 1) return elements.join("");
  return `${elements.slice(0, -1).join(", ")} et ${elements.at(-1)}`;
}

/** « au TFP APS » ; « au recyclage SSIAP 1 » (minuscule en milieu de phrase). */
const au = (libelle: string) => `au ${libelle.replace(/^Recyclage/, "recyclage")}`;

/** Métadonnées génératives (Copy fiche §1) : title stable nom + ville, description en cascade à trois niveaux. */
export function metaFiche(o: Organisme): { title: string; description: string; ogDescription: string } {
  const ville = o.siege?.ville ?? "";
  const lieu = o.siege ? `${ville} (${o.siege.departement})` : "";
  const title =
    o.nom.length > 40 || !ville
      ? `${o.nom} — Formation sécurité privée`
      : `${o.nom} — Formation sécurité privée à ${ville}`;
  const fin = o.financements.length
    ? ` Financements acceptés : ${listeFr(o.financements.map((f) => ({ cpf: "CPF", france_travail: "France Travail", opco: "OPCO", plan_developpement: "plan de développement des compétences" })[f] ?? f))}.`
    : "";
  const titres = o.offres.map((x) => x.titre.libelle_court); // ordre du référentiel
  const description =
    titres.length === 0
      ? `${o.nom}, organisme de formation à la sécurité privée à ${lieu}. Coordonnées, lieux de formation et informations pratiques.`
      : `${o.nom} forme ${listeFr(titres.slice(0, 3).map(au))} à ${lieu}.${fin} Coordonnées, lieux de formation et informations pratiques.`;
  const ogDescription = o.presentation ? o.presentation.slice(0, 150) : description;
  return { title, description, ogDescription };
}

/** Les trois questions de la FAQ générée (Copy fiche §12) — sans balisage FAQPage. */
export function faqFiche(o: Organisme): { question: string; reponse: string }[] {
  const faq: { question: string; reponse: string }[] = [];
  if (o.offres.length)
    faq.push({
      question: `Quelles formations ${o.nom} prépare-t-il ?`,
      reponse: `${o.nom} prépare ${listeFr(o.offres.map((x) => au(x.titre.libelle_court)))}. Retrouvez le détail de chaque formation, avec les tarifs et les rythmes proposés, dans la section ci-dessus.`,
    });
  faq.push({
    question: `${o.nom} est-il agréé par le CNAPS ?`,
    reponse: o.numero_agrement_cnaps
      ? `Oui. Son numéro d'agrément est le ${o.numero_agrement_cnaps}, vérifiable sur l'espace de consultation du CNAPS.`
      : "Le numéro d'agrément de cet organisme n'est pas renseigné sur sa fiche. Demandez-le directement au centre et vérifiez-le sur l'espace de consultation du CNAPS avant de vous inscrire.",
  });
  if (o.siege)
    faq.push({
      question: `Où se déroulent les formations de ${o.nom} ?`,
      reponse:
        o.lieux.length > 1
          ? `${o.nom} dispose de ${o.lieux.length} lieux de formation, à ${listeFr([...new Set(o.lieux.map((l) => l.ville))])}.`
          : `Les formations se déroulent au ${o.siege.adresse}, à ${o.siege.ville} (${o.siege.departement}).`,
    });
  return faq;
}

/** Bloc 9 : 3 à 4 fiches du même département (fiche exclue), sinon élargi à l'Île-de-France. */
export function autresOrganismes(o: Organisme, tous: Organisme[], rang: (x: Organisme) => number) {
  const autres = tous
    .filter((x) => x.id !== o.id)
    .sort((a, b) => rang(b) - rang(a) || a.nom.localeCompare(b.nom, "fr"));
  const dept = o.siege?.departement;
  const memeDept = autres.filter((x) => x.lieux.some((l) => l.departement === dept));
  return memeDept.length
    ? { departement: dept ?? null, liste: memeDept.slice(0, 4) }
    : { departement: null, liste: autres.slice(0, 4) };
}
