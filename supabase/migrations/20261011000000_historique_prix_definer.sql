-- L'historique des prix (non public) est alimenté par un déclencheur : il doit écrire quel que soit le rôle
-- de l'auteur de la modification (compte organisme soumis à la RLS), sans ouvrir la table en lecture.
alter function tracer_prix_offre() security definer set search_path = public;
