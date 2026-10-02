-- Sprint 12 — pages titre (UX pilier §8, décision Erwan 02/10/2026) : le bloc « organismes qui préparent ce titre »
-- s'affiche à partir de ce nombre d'organismes publiés proposant le titre ; en dessous, il est masqué.
insert into parametres (cle, valeur, description) values
  ('seuil_bloc_organismes_pilier', '3',
   'Pages titre : le bloc des organismes qui préparent le titre s''affiche à partir de ce nombre d''organismes.');
