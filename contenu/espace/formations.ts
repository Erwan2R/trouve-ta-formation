// Mes formations (maquette « Mes Formations », UX_Mes_Formations.md).

/** Recherche par synonymes dans la modale d'ajout (maquette, variante « synonymes » par défaut). */
export const SYNONYMES: Record<string, string> = {
  "tfp-aps": "agent de sécurité surveillance gardiennage",
  "mac-aps": "agent de sécurité renouvellement carte",
  "ssiap-1": "incendie erp",
  "ssiap-2": "incendie chef équipe encadrement",
  "ssiap-3": "incendie chef service encadrement",
  "recyclage-ssiap-1": "incendie renouvellement",
  "recyclage-ssiap-2": "incendie renouvellement",
  "recyclage-ssiap-3": "incendie renouvellement",
  "tfp-asc": "chien maître-chien cynophile",
  "mac-cyno": "chien renouvellement cynophile",
  "tfp-asa": "aéroport avion sûreté",
  "tfp-a3p": "garde du corps protection rapprochée",
  "mac-a3p": "garde du corps renouvellement",
};

export const FORMATIONS = {
  compte: (n: number) =>
    n === 0
      ? "Aucune formation déclarée sur votre fiche"
      : n === 1
        ? "1 formation déclarée sur votre fiche"
        : `${n} formations déclarées sur votre fiche`,
  repartition: (c: number, n: number) => `${c} complète${c > 1 ? "s" : ""} · ${n - c} à compléter`,
  vide: {
    surtitre: "Aucune formation déclarée",
    titre: "Votre fiche n'apparaît dans aucun filtre par titre",
    texte:
      "Les candidats ne peuvent la trouver qu'en parcourant le catalogue sans filtre, ou en cherchant le nom de votre organisme.",
  },
  derniere:
    "C'est votre dernière formation. Si vous la retirez, votre fiche sort de tous les filtres par titre du catalogue.",
  toast: {
    ajout: (noms: string[]) =>
      noms.length === 1 ? `${noms[0]} ajouté à votre fiche.` : `${noms.length} formations ajoutées à votre fiche.`,
    complete: (t: string) => `${t} est maintenant complète.`,
    enregistree: "Formation enregistrée.",
    retrait: (t: string, dernier: boolean) =>
      dernier ? `${t} retiré. Votre fiche n'apparaît plus dans les filtres par titre.` : `${t} retiré de votre fiche.`,
    demande: "Demande envoyée. L'équipe de Trouve ta formation l'examinera.",
  },
  // Titre archivé (décision Erwan 01/10/2026) : offre conservée, jamais servie publiquement. Texte à valider.
  archive:
    "Ce titre n'est plus délivré : cette formation n'apparaît plus sur votre fiche publique. Vous pouvez la retirer.",
  demande: {
    lien: "Votre titre n'est pas dans la liste ?",
    cta: "Faire une demande →",
    libelle: "Intitulé du titre",
    aide: "Notre équipe vérifie chaque demande avant d'ajouter un titre au référentiel.",
    envoyer: "Envoyer la demande",
  },
};
