import { EMAIL_CONTACT } from "@/lib/config/contact";

// Emails envoyés depuis l'espace admin. TEXTES RÉDIGÉS PAR CLAUDE, À VALIDER PAR ERWAN (décision 01/10/2026 :
// « emails de rappel et d'arbitrage à me soumettre »). Templates fixes : aucune personnalisation à l'envoi (UX Fichier client §4).

const pied = `<p style="font-size:13px;color:#7B746E">Vous recevez ce message parce que votre organisme est inscrit sur Trouve ta formation.<br>Pour nous écrire : ${EMAIL_CONTACT}<br>Trouve ta formation — annuaire indépendant des organismes de formation.</p>`;
const piedTexte = `Vous recevez ce message parce que votre organisme est inscrit sur Trouve ta formation.
Pour nous écrire : ${EMAIL_CONTACT}
--
Trouve ta formation — annuaire indépendant des organismes de formation.
`;

const echapper = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

type Email = { sujet: string; html: string; texte: string };

/** Paragraphes en texte brut : échappés pour le HTML, repris tels quels dans la version texte. */
function composer(sujet: string, titre: string, paragraphes: string[], bouton: string, lien: string): Email {
  return {
    sujet,
    html: `<div style="font-family:Arial,sans-serif;color:#0B0B0B;max-width:560px;line-height:1.6">
<p style="font-weight:bold;font-size:18px">${echapper(titre)}</p>${paragraphes.map((p) => `<p>${echapper(p)}</p>`).join("")}
<p><a href="${lien}" style="display:inline-block;background:#0B0B0B;color:#FFFFFF;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">${echapper(bouton)}</a></p>
${pied}</div>`,
    texte: `${titre}\n\n${paragraphes.join("\n\n")}\n\n${bouton} : ${lien}\n\n${piedTexte}`,
  };
}

export type TypeRappel = "ajout_formation" | "completion_fiche";

/** Libellés de la modale (UX Fichier client §4 : liste fermée mais extensible). */
export const TYPES_RAPPEL: { type: TypeRappel; libelle: string }[] = [
  { type: "ajout_formation", libelle: "Rappel d'ajout de formation" },
  { type: "completion_fiche", libelle: "Rappel de complétion de fiche" },
];

export const EMAILS_RAPPEL: Record<TypeRappel, (nom: string, espace: string) => Email> = {
  ajout_formation: (nom, espace) =>
    composer(
      "Ajoutez vos formations à votre fiche",
      "Vos formations ne sont pas encore sur votre fiche",
      [
        "Bonjour,",
        `La fiche de ${nom} ne présente encore aucune formation. Tant que c'est le cas, elle n'apparaît pas quand un candidat filtre le catalogue par titre (TFP APS, SSIAP 1…), ni sur les pages consacrées à ces titres.`,
        "Déclarer une formation prend quelques minutes depuis votre espace : choisissez le titre, puis indiquez le prix, la durée et les financements acceptés.",
      ],
      "Ajouter mes formations",
      `${espace}/formations/`,
    ),
  completion_fiche: (nom, espace) =>
    composer(
      "Complétez votre fiche",
      "Votre fiche peut en dire plus",
      [
        "Bonjour,",
        `La fiche de ${nom} contient encore peu d'informations. Une fiche complète (formations, financements acceptés, présentation, agrément CNAPS, horaires) est mieux référencée par les moteurs de recherche et aide les candidats à choisir leur centre.`,
        "Votre espace indique ce qui manque : vous complétez la fiche vous-même, en quelques minutes.",
      ],
      "Compléter ma fiche",
      `${espace}/dashboard/`,
    ),
};
