-- Sprint 12 — référentiel vérifié par Erwan (02/10/2026) sur sources officielles :
-- TFP ASA : RNCP40278 (France compétences) ; MAC APS 34 h (arrêté du 27 février 2017 modifié) ;
-- SSIAP 1 : 67 h, recyclage 14 h (arrêté du 2 mai 2005).
update titres_referentiel set code_rncp = '40278' where slug = 'tfp-asa';
update titres_referentiel set duree = '34 h' where slug = 'mac-aps';
update titres_referentiel set duree = '67 h' where slug = 'ssiap-1';
update titres_referentiel set duree = '14 h' where slug = 'recyclage-ssiap-1';

-- Formulaire : le SSIAP 2 exige 1 607 heures d'exercice sur les 24 derniers mois (et non un nombre d'années) ;
-- le SSIAP 3, 3 ans d'expérience avec le SSIAP 2 (ou un diplôme de niveau 4, géré dans la question).
update parametres set valeur = '{"ssiap-2": {"heures": 1607, "mois": 24}, "ssiap-3": 3}'
  where cle = 'experience_encadrement';
