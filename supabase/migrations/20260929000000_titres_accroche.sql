-- Ligne de description de la carte du titre (grille de l'accueil, bloc 3) :
-- une phrase de 15 mots max, qui dit à qui s'adresse le titre (Copy accueil §3).
alter table titres_referentiel add column accroche text;

-- Lignes validées (Copy_Page_Accueil_Securite_Privee.md §3).
update titres_referentiel set accroche = 'Le titre d''entrée dans le métier. Surveillance de sites, de magasins et d''événements.' where slug = 'tfp-aps';
update titres_referentiel set accroche = 'Le recyclage obligatoire pour renouveler sa carte professionnelle d''agent de prévention et de sécurité.' where slug = 'mac-aps';
update titres_referentiel set accroche = 'Agent de sécurité incendie en établissement recevant du public ou immeuble de grande hauteur.' where slug = 'ssiap-1';
update titres_referentiel set accroche = 'Chef d''équipe. Encadrement d''une équipe d''agents SSIAP 1.' where slug = 'ssiap-2';
update titres_referentiel set accroche = 'Chef de service. Responsabilité du service de sécurité incendie d''un établissement.' where slug = 'ssiap-3';
update titres_referentiel set accroche = 'Surveillance avec un chien. Le titre porte sur le binôme, pas seulement sur l''agent.' where slug = 'tfp-asc';
update titres_referentiel set accroche = 'Contrôle des passagers, des bagages et des accès en zone aéroportuaire.' where slug = 'tfp-asa';
update titres_referentiel set accroche = 'Protection physique des personnes. Le titre le plus long et le plus sélectif du secteur.' where slug = 'tfp-a3p';

-- Propositions (titres ajoutés au référentiel v1.1, sans copy validée) : À VALIDER par Erwan.
update titres_referentiel set accroche = 'Le maintien des compétences obligatoire tous les trois ans pour les agents SSIAP 1.' where slug = 'recyclage-ssiap-1';
update titres_referentiel set accroche = 'Le maintien des compétences obligatoire tous les trois ans pour les chefs d''équipe SSIAP 2.' where slug = 'recyclage-ssiap-2';
update titres_referentiel set accroche = 'Le maintien des compétences obligatoire tous les trois ans pour les chefs de service SSIAP 3.' where slug = 'recyclage-ssiap-3';
update titres_referentiel set accroche = 'Le recyclage obligatoire pour renouveler sa carte professionnelle d''agent de sécurité cynophile.' where slug = 'mac-cyno';
update titres_referentiel set accroche = 'Le recyclage obligatoire pour renouveler sa carte d''agent de protection physique des personnes.' where slug = 'mac-a3p';
