-- Décision Erwan du 08/10/2026 : une page département est publiée en production si et seulement si le seuil
-- d'organismes est atteint ET son bloc 7 est validé par l'administrateur (le nombre de mots reste indicatif).
-- Aucun département n'est validé par défaut.
alter table departements add column bloc7_valide boolean not null default false;
