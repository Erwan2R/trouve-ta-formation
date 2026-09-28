-- Sprint 7 — formulaire d'affinage (décision Erwan 01/10/2026) : relâchement automatique à zéro résultat seulement ;
-- en dessous de ce seuil (1 ou 2 résultats), l'élargissement est proposé sans être imposé.
insert into parametres (cle, valeur, description) values
  ('seuil_proposition_elargissement', '3',
   'Formulaire d''affinage : en dessous de ce nombre d''organismes (et au-dessus de zéro), un lien propose d''élargir la recherche.');
