-- Relevé CNAPS d'Erwan, 2e partie (07/10/2026) : fiche « Demande - Autorisation préalable » de Dracar Ultimate,
-- « délai moyen de traitement […] d'environ une semaine » pour un dossier complet, sans enquête complémentaire.
update demarches
  set delai_instruction = 'Environ une semaine pour un dossier complet ; sans réponse au bout de 2 mois, la demande est rejetée'
  where slug = 'autorisation-prealable';
