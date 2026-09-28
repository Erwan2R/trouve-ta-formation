-- Formes rédactionnelles des départements (décision Erwan 01/10/2026) : saisies une fois, jamais construites
-- par concaténation. forme_lieu : « se former … » ; forme_de : « organismes … ».
alter table departements
  add column forme_lieu text,
  add column forme_de text;

update departements d set forme_lieu = f.lieu, forme_de = f.de
from (values
  ('75', 'à Paris', 'de Paris'),
  ('77', 'en Seine-et-Marne', 'de Seine-et-Marne'),
  ('78', 'dans les Yvelines', 'des Yvelines'),
  ('91', 'en Essonne', 'de l''Essonne'),
  ('92', 'dans les Hauts-de-Seine', 'des Hauts-de-Seine'),
  ('93', 'en Seine-Saint-Denis', 'de Seine-Saint-Denis'),
  ('94', 'dans le Val-de-Marne', 'du Val-de-Marne'),
  ('95', 'dans le Val-d''Oise', 'du Val-d''Oise')
) as f (code, lieu, de)
where d.code = f.code;

alter table departements
  alter column forme_lieu set not null,
  alter column forme_de set not null,
  drop column preposition;
