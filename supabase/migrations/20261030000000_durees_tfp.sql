-- Sprint 12 — durées minimales réglementaires des TFP (décision Erwan 02/10/2026), hors examen : somme des durées
-- minimales des modules de l'arrêté du 1er septembre 2025 (aucun total n'y figure).
-- APS : annexe II (41 h) + annexe III (134 h). Cynophile : annexes II + III + VI (315 h).
-- Protection physique des personnes : annexe II + annexe XI (265 h).
update titres_referentiel set duree = '175 h minimum, hors examen' where slug = 'tfp-aps';
update titres_referentiel set duree = '490 h minimum, hors examen' where slug = 'tfp-asc';
update titres_referentiel set duree = '306 h minimum, hors examen' where slug = 'tfp-a3p';
