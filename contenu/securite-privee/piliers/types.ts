import type { QuestionFaq } from "@/components/public/Faq";

import { sansMarqueur } from "../../marqueurs";

type Section = { h3: string; texte: string };

/**
 * Contenu éditorial d'une page pilier (Copy_Pages_Piliers.md). Texte brut uniquement :
 * les liens (démarches, titres liés) sont posés par le gabarit, jamais écrits à la main.
 */
export type ContenuPilier = {
  /** A = titre d'entrée, B = maintien / recyclage (UX pilier §3). */
  gabarit: "A" | "B";
  /** Remplace le H1 par défaut (« [court] — [long] »). */
  h1?: string;
  /** Remplace le <title> par défaut (titres recherchés sous leur intitulé métier : TFP ASC, ASA, A3P). */
  titleSeo?: string;
  definition: string;
  faits: {
    niveau?: string;
    periodicite?: string;
    prerequis: string;
    cout?: string;
    /** Date de vérification à la source, AAAA-MM-JJ. */
    verifieLe: string;
  };
  /** A : « Ce que permet le … » ; B : « Quand suivre votre … ». Trois H3. */
  bloc4: { h2: string; sections: [Section, Section, Section] };
  /** Conditions 1 (autorisation préalable ou carte valide) et 4 (propres au titre). Moralité et français sont communs. */
  conditions: { premiere: Section; propres: Section };
  programme: { intro: string; modules: { nom: string; volume?: string }[]; evaluation: string };
  duree: string;
  cout: string;
  /** Bloc 10 : une ligne expliquant le rapport. Seuls les titres publiés s'affichent. */
  titresLies: { slug: string; texte: string }[];
  faq: QuestionFaq[];
};

/** Aucun marqueur « à vérifier » et tous les volumes horaires du programme renseignés. */
export function contenuVerifie(c: ContenuPilier): boolean {
  return sansMarqueur(c) && c.programme.modules.every((m) => m.volume);
}
