-- Sprint 12 — référentiel vérifié sur sources officielles le 06/10/2026 (rédaction des pages titres).
-- Codes RNCP : les fiches 34486 (cynophile) et 35098 (protection physique des personnes) sont inactives sur
-- France compétences ; elles sont remplacées par RNCP40271 (échéance 28/02/2028) et RNCP38002 (échéance 20/09/2028).
update titres_referentiel set code_rncp = '40271' where slug = 'tfp-asc';
update titres_referentiel set code_rncp = '38002' where slug = 'tfp-a3p';

-- Durées minimales, hors examen : arrêté du 2 mai 2005 modifié (art. 5 et 6, annexe V) pour la filière incendie ;
-- arrêté du 27 février 2017 modifié (art. 4, 5 et protection physique des personnes) pour les MAC.
update titres_referentiel set duree = '70 h' where slug = 'ssiap-2';
update titres_referentiel set duree = '216 h' where slug = 'ssiap-3';
update titres_referentiel set duree = '14 h' where slug = 'recyclage-ssiap-2';
update titres_referentiel set duree = '21 h' where slug = 'recyclage-ssiap-3';
update titres_referentiel set duree = '32 h, en plus du socle du MAC APS' where slug = 'mac-cyno';
update titres_referentiel set duree = '41 h' where slug = 'mac-a3p';
