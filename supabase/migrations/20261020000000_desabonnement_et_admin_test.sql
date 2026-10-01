-- Décisions Erwan (01/10/2026).

-- 1. Rappels : « Ne plus recevoir ces rappels », en un clic, sans connexion (promesse de la FAQ de la landing).
--    Un organisme désabonné ne reçoit plus aucun rappel ; l'admin le voit et le bouton reste grisé.
alter table organismes add column rappels_desabonne_le timestamptz;

-- 2. Refus d'une demande de titre : motif choisi par l'admin (déjà présent sous un autre intitulé, hors périmètre).
alter table demandes_titre
  add column motif_refus text check (motif_refus in ('deja_present', 'hors_perimetre')),
  add column titre_existant_id bigint references titres_referentiel (id);

-- 3. Compte admin de test (base de dev uniquement, tests Playwright) : distinct du compte d'Erwan, pour que les tests
--    ne réinitialisent jamais sa double authentification. Le compte unique reste la règle pour les vrais comptes ;
--    un compte de test n'est jamais créé en production (les tests refusent toute autre base que celle de dev).
alter table administrateurs add column est_test boolean not null default false;
drop index administrateurs_unique;
create unique index administrateurs_unique on administrateurs ((true)) where not est_test;
create unique index administrateurs_test_unique on administrateurs ((true)) where est_test;
