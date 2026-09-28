-- Statut « actif, page non publiée » (UX_Page_Pilier_Titre §statut) : un titre sans page publiée
-- s'affiche sans lien, pour ne jamais pointer vers une 404. Même logique pour les départements.
alter table titres_referentiel
  add column page_publiee boolean not null default false,
  add column ordre smallint not null default 0;

alter table departements
  add column page_publiee boolean not null default false;

-- Référentiel phase 1 (Referentiel_Titres_Securite_Privee.md v1.1).
-- Durées et RNCP du TFP ASA laissés à null : [À VÉRIFIER], jamais inventés.
insert into titres_referentiel (ordre, categorie, libelle_court, libelle_long, slug, code_rncp) values
  (1,  'Surveillance humaine',     'TFP APS',           'Titre à finalité professionnelle Agent de prévention et de sécurité',                       'tfp-aps',           '36648'),
  (2,  'Surveillance humaine',     'MAC APS',           'Maintien et actualisation des compétences — Agent de prévention et de sécurité',             'mac-aps',           null),
  (3,  'Sécurité incendie',        'SSIAP 1',           'SSIAP 1 — Agent de service de sécurité incendie',                                            'ssiap-1',           null),
  (4,  'Sécurité incendie',        'SSIAP 2',           'SSIAP 2 — Chef d''équipe de service de sécurité incendie',                                   'ssiap-2',           null),
  (5,  'Sécurité incendie',        'SSIAP 3',           'SSIAP 3 — Chef de service de sécurité incendie',                                             'ssiap-3',           null),
  (6,  'Sécurité incendie',        'Recyclage SSIAP 1', 'Recyclage SSIAP 1',                                                                          'recyclage-ssiap-1', null),
  (7,  'Sécurité incendie',        'Recyclage SSIAP 2', 'Recyclage SSIAP 2',                                                                          'recyclage-ssiap-2', null),
  (8,  'Sécurité incendie',        'Recyclage SSIAP 3', 'Recyclage SSIAP 3',                                                                          'recyclage-ssiap-3', null),
  (9,  'Cynophile',                'TFP ASC',           'Titre à finalité professionnelle Agent de sécurité cynophile',                               'tfp-asc',           '34486'),
  (10, 'Cynophile',                'MAC cynophile',     'Maintien et actualisation des compétences — Agent de sécurité cynophile',                    'mac-cyno',          null),
  (11, 'Sûreté aéroportuaire',     'TFP ASA',           'Titre à finalité professionnelle Agent de sûreté aéroportuaire',                             'tfp-asa',           null),
  (12, 'Protection des personnes', 'TFP A3P',           'Titre à finalité professionnelle Agent de protection physique des personnes',                'tfp-a3p',           '35098'),
  (13, 'Protection des personnes', 'MAC A3P',           'Maintien et actualisation des compétences — Agent de protection physique des personnes',     'mac-a3p',           null);

-- Slugs : Copy_Pages_Geographiques.md §1 (aucun numéro dans le slug).
insert into departements (code, slug, nom) values
  ('75', 'paris',             'Paris'),
  ('77', 'seine-et-marne',    'Seine-et-Marne'),
  ('78', 'yvelines',          'Yvelines'),
  ('91', 'essonne',           'Essonne'),
  ('92', 'hauts-de-seine',    'Hauts-de-Seine'),
  ('93', 'seine-saint-denis', 'Seine-Saint-Denis'),
  ('94', 'val-de-marne',      'Val-de-Marne'),
  ('95', 'val-d-oise',        'Val-d''Oise');
