-- Relecture d'Erwan (07/10/2026).
-- Libellés officiels des diplômes SSIAP (arrêté du 2 mai 2005, art. 3 : « … sécurité incendie et d'assistance à
-- personnes »).
update titres_referentiel
  set libelle_long = 'SSIAP 1 — Agent de service de sécurité incendie et d''assistance à personnes'
  where slug = 'ssiap-1';
update titres_referentiel
  set libelle_long = 'SSIAP 2 — Chef d''équipe de service de sécurité incendie et d''assistance à personnes'
  where slug = 'ssiap-2';
update titres_referentiel
  set libelle_long = 'SSIAP 3 — Chef de service de sécurité incendie et d''assistance à personnes'
  where slug = 'ssiap-3';

-- TFP ASC : l'entrée exige déjà la qualification APS (RNCP40271) ; la durée propre au cynophile mène l'affichage.
update titres_referentiel set duree = '315 h minimum (490 h en partant de zéro)' where slug = 'tfp-asc';
