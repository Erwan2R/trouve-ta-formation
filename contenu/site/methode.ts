import { EMAIL_CONTACT } from "@/lib/config/contact";
import type { PageLegale } from "@/contenu/legal/types";

// Rédaction Claude (15/10/2026, carte blanche d'Erwan). Faits réglementaires vérifiés le 15/10/2026 :
// - autorisation des organismes de formation : code de la sécurité intérieure, art. L625-2 (Légifrance) ;
// - liste des organismes autorisés publiée par le CNAPS (page « Se former aux métiers de la sécurité privée »,
//   liste par activité mise à jour en septembre 2025).
// Le reste décrit le fonctionnement réel du site (publication sur déclaration, référentiel fermé, palier noindex,
// classement des conditions d'utilisation §7).
export const METHODE: PageLegale = {
  title: "Notre méthode de référencement des organismes de formation",
  description:
    "Qui peut figurer sur Trouve ta formation, d'où viennent les informations des fiches, comment les organismes sont classés et comment signaler une erreur.",
  h1: "Notre méthode de référencement",
  maj: "Dernière mise à jour : 15 octobre 2026",
  sections: [
    {
      h2: "1. Seuls les organismes inscrits apparaissent",
      paragraphes: [
        "Une fiche n'existe que si l'organisme l'a créée lui-même, gratuitement, depuis son espace. Nous ne créons aucune fiche à la place d'un organisme et ne publions aucune donnée collectée ailleurs.",
        "Un compte correspond à un organisme et à une seule fiche, quel que soit le nombre de ses lieux de formation.",
      ],
    },
    {
      h2: "2. Des informations déclarées par l'organisme",
      paragraphes: [
        "Les informations d'une fiche sont saisies par l'organisme, sous sa responsabilité : formations, prix, durées, rythmes, financements acceptés, lieux et coordonnées. **Nous ne les vérifions pas avant publication.**",
        "En sécurité privée, l'activité d'un organisme de formation est soumise à une autorisation d'exercice délivrée par le CNAPS (article L625-2 du code de la sécurité intérieure). L'organisme indique son numéro sur sa fiche ; une fiche qui ne le renseigne pas affiche « autorisation d'exercice non renseignée ». Avant de vous inscrire, vérifiez-le sur le site du CNAPS, qui publie la liste des organismes de formation autorisés.",
      ],
      liens: [
        {
          texte: "Liste des organismes de formation autorisés (CNAPS)",
          href: "https://www.cnaps.interieur.gouv.fr/Demarches-en-ligne/Vous-etes-un-particulier/Se-former-aux-metiers-de-la-securite-privee/Se-former-aux-metiers-de-la-securite-privee",
        },
        {
          texte: "Article L625-2 du code de la sécurité intérieure (Légifrance)",
          href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045453722",
        },
      ],
    },
    {
      h2: "3. Une liste de titres fermée",
      paragraphes: [
        "Un organisme ne peut pas inventer une formation. Il choisit les titres qu'il prépare dans un référentiel que nous maintenons : 13 titres pour la sécurité privée. S'il prépare un titre absent de la liste, il nous en fait la demande et nous l'examinons avant tout ajout.",
      ],
    },
    {
      h2: "4. Quand une fiche est mise en ligne",
      paragraphes: [
        "Une fiche est publiée dès que l'organisme a validé son adresse email et renseigné au minimum l'adresse de son siège et un moyen de contact.",
        "Une fiche encore peu complète reste consultable sur le site, mais nous demandons aux moteurs de recherche de ne pas l'indexer tant qu'elle n'est pas enrichie.",
      ],
    },
    {
      h2: "5. Comment les organismes sont classés",
      paragraphes: ["L'ordre d'affichage dépend de deux critères :"],
      puces: [
        "**la pertinence par rapport à votre recherche** : titre, lieu, financement, rythme ;",
        "**le niveau de complétude de la fiche** : une fiche complète est mieux classée qu'une fiche partielle.",
      ],
    },
    {
      h2: "6. Les pages formations et démarches",
      paragraphes: [
        "Les pages qui présentent chaque titre et chaque démarche CNAPS sont rédigées par l'équipe de Trouve ta formation et affichent leur date de dernière vérification. Les pages démarches citent leurs sources officielles.",
      ],
      liens: [{ texte: "Les démarches CNAPS", href: "/securite-privee/demarches/" }],
    },
    {
      h2: "7. Signaler une erreur",
      paragraphes: [
        `Une information vous semble inexacte ou trompeuse ? Écrivez-nous à ${EMAIL_CONTACT}. Nous pouvons suspendre une fiche le temps de vérifier un signalement. En cas de manquement grave ou répété aux conditions d'utilisation, la fiche et le compte peuvent être supprimés.`,
      ],
      liens: [{ texte: "Conditions d'utilisation", href: "/conditions-utilisation/" }],
    },
  ],
};
