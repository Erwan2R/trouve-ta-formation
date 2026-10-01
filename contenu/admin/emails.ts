import { EMAIL_CONTACT } from "@/lib/config/contact";

// Emails envoyés depuis l'espace admin. Textes rédigés par Claude, corrigés et validés par Erwan (01/10/2026).
// Templates fixes : aucune personnalisation à l'envoi (UX Fichier client §4).

const pied = (desabonnement?: string) =>
  `<p style="font-size:13px;color:#7B746E">Vous recevez ce message parce que votre organisme est inscrit sur Trouve ta formation.<br>Pour nous écrire : ${EMAIL_CONTACT}<br>${desabonnement ? `<a href="${desabonnement}" style="color:#7B746E">Ne plus recevoir ces rappels</a><br>` : ""}Trouve ta formation — annuaire indépendant des organismes de formation.</p>`;
const piedTexte = (desabonnement?: string) =>
  [
    "Vous recevez ce message parce que votre organisme est inscrit sur Trouve ta formation.",
    `Pour nous écrire : ${EMAIL_CONTACT}`,
    ...(desabonnement ? [`Ne plus recevoir ces rappels : ${desabonnement}`] : []),
    "--",
    "Trouve ta formation — annuaire indépendant des organismes de formation.",
  ].join(String.fromCharCode(10));

const echapper = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

type Email = { sujet: string; html: string; texte: string };
const SAUT = String.fromCharCode(10, 10);

/** Paragraphes en texte brut : échappés pour le HTML, repris tels quels dans la version texte. */
function composer(
  sujet: string,
  titre: string,
  paragraphes: string[],
  bouton: string,
  lien: string,
  desabonnement?: string,
): Email {
  return {
    sujet,
    html: `<div style="font-family:Arial,sans-serif;color:#0B0B0B;max-width:560px;line-height:1.6">
<p style="font-weight:bold;font-size:18px">${echapper(titre)}</p>${paragraphes.map((p) => `<p>${echapper(p)}</p>`).join("")}
<p><a href="${lien}" style="display:inline-block;background:#0B0B0B;color:#FFFFFF;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">${echapper(bouton)}</a></p>
${pied(desabonnement)}</div>`,
    texte: [titre, ...paragraphes, `${bouton} : ${lien}`, piedTexte(desabonnement)].join(SAUT),
  };
}

export type TypeRappel = "ajout_formation" | "completion_fiche";

/** Libellés de la modale (UX Fichier client §4 : liste fermée mais extensible). */
export const TYPES_RAPPEL: { type: TypeRappel; libelle: string }[] = [
  { type: "ajout_formation", libelle: "Rappel d'ajout de formation" },
  { type: "completion_fiche", libelle: "Rappel de complétion de fiche" },
];

/** Rappels : seuls emails avec le lien « Ne plus recevoir ces rappels » (promesse de la FAQ de la landing). */
export const EMAILS_RAPPEL: Record<TypeRappel, (nom: string, espace: string, desabonnement: string) => Email> = {
  ajout_formation: (nom, espace, desabonnement) =>
    composer(
      "Ajoutez vos formations à votre fiche",
      "Vos formations ne sont pas encore sur votre fiche",
      [
        "Bonjour,",
        `La fiche de ${nom} ne présente encore aucune formation. Tant que c'est le cas, elle n'est pas référencée par Google, et elle n'apparaît pas quand un candidat filtre le catalogue par titre (TFP APS, SSIAP 1…).`,
        "Déclarer une formation prend quelques minutes depuis votre espace : choisissez le titre, puis indiquez le prix, la durée et les financements acceptés.",
      ],
      "Ajouter mes formations",
      `${espace}/formations/`,
      desabonnement,
    ),
  completion_fiche: (nom, espace, desabonnement) =>
    composer(
      "Complétez votre fiche",
      "Votre fiche peut en dire plus",
      [
        "Bonjour,",
        `La fiche de ${nom} contient encore peu d'informations. Une fiche complète (formations, financements acceptés, présentation, agrément CNAPS, horaires) est mise en avant dans le catalogue et aide les candidats à choisir leur centre.`,
        "Votre espace indique ce qui manque : vous complétez la fiche vous-même, en quelques minutes.",
      ],
      "Compléter ma fiche",
      `${espace}/dashboard/`,
      desabonnement,
    ),
};

/** Arbitrage d'une demande de titre (UX Référentiel des titres §4) : un email fixe par issue, toujours envoyé. */
export const EMAIL_DEMANDE_ACCEPTEE = (demande: string, retenu: string, espace: string) =>
  composer(
    "Votre demande de titre est acceptée",
    "Le titre que vous avez demandé est disponible",
    [
      "Bonjour,",
      demande.trim() === retenu.trim()
        ? `Le titre « ${retenu} », que vous avez demandé, figure désormais dans le référentiel des formations.`
        : `Votre demande « ${demande} » est acceptée : le titre figure désormais dans le référentiel des formations sous l'intitulé « ${retenu} ».`,
      "Il n'est pas encore rattaché à votre fiche : pour le déclarer, ouvrez Mes formations et cochez-le, comme n'importe quel autre titre.",
    ],
    "Déclarer cette formation",
    `${espace}/formations/`,
  );

export type MotifRefus = "deja_present" | "hors_perimetre";

/** Refus, selon le motif choisi par l'admin (décision Erwan 01/10/2026). `existant` : titre déjà au référentiel. */
export const EMAIL_DEMANDE_REFUSEE = (motif: MotifRefus, demande: string, espace: string, existant?: string) =>
  motif === "deja_present"
    ? composer(
        "Votre demande de titre n'a pas été retenue",
        "Votre demande de titre n'a pas été retenue",
        [
          "Bonjour,",
          `Le titre « ${demande} » figure déjà dans le référentiel sous l'intitulé « ${existant} ». Vous pouvez le déclarer dès maintenant depuis Mes formations.`,
        ],
        "Déclarer cette formation",
        `${espace}/formations/`,
      )
    : composer(
        "Votre demande de titre n'a pas été retenue",
        "Votre demande de titre n'a pas été retenue",
        [
          "Bonjour,",
          `Le titre « ${demande} » ne sera pas ajouté au référentiel des formations. Le référentiel recense les titres et certifications propres à la sécurité privée, et la formation demandée n'en fait pas partie.`,
          "Pour toute question, répondez simplement à ce message.",
        ],
        "Voir mes formations",
        `${espace}/formations/`,
      );
