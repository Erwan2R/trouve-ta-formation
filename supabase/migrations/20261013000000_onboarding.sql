-- Onboarding en 7 étapes (spec Inscription §6-7) : reprise exacte là où il s'est arrêté.
-- 1 à 7 : étape à reprendre ; null : parcours terminé. Les comptes existants sont considérés comme terminés.
alter table comptes_organisme add column onboarding_etape smallint check (onboarding_etape between 1 and 7);
alter table comptes_organisme alter column onboarding_etape set default 1;
grant update (onboarding_etape) on comptes_organisme to authenticated;
