-- Relevé CNAPS d'Erwan du 07/10/2026 (FAQ « Demande de titre et dépôt de dossier », « Formation »,
-- « Renouvellement et duplicata », page « Renouveler votre carte professionnelle »).
-- Le coût reste vide : le CNAPS n'en parle nulle part (champ masqué à l'affichage).
update demarches
  set delai_instruction = 'En général moins de 10 jours ; sans réponse au bout de 2 mois, la demande est rejetée',
      validite = 'Six mois, durée stricte',
      verifie_le = '2026-10-07'
  where slug = 'autorisation-prealable';

update demarches
  set delai_instruction = 'En général moins de 10 jours ; sans réponse au bout de 2 mois, la demande est rejetée',
      verifie_le = '2026-10-07'
  where slug = 'carte-professionnelle';

update demarches
  set fenetre_depot = 'Entre 6 mois et 3 mois avant l''expiration de la carte',
      verifie_le = '2026-10-07'
  where slug = 'renouvellement-carte-professionnelle';
