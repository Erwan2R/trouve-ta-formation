-- Relevé CNAPS d'Erwan (07/10/2026), fiche « Demande - Carte professionnelle » de Dracar Ultimate : délai moyen de
-- quatre jours ouvrés pour un dossier complet, sans vérification complémentaire.
update demarches
  set delai_instruction = 'Environ quatre jours ouvrés pour un dossier complet ; sans réponse au bout de 2 mois, la demande est rejetée'
  where slug = 'carte-professionnelle';
