-- Archivage (décision Erwan 30/09/2026) : un titre n'est jamais supprimé, il passe en « archive ».
--  · remplace_par_id rempli → la page redirige (permanente) vers le titre de remplacement ;
--  · sinon la page reste en ligne avec « Ce titre n'est plus délivré depuis [archive_le] »
--    et un lien vers titre_proche_id.
-- Un titre archivé sort des listes, grilles, menus et du formulaire d'affinage.
alter table titres_referentiel
  add column archive_le date,
  add column remplace_par_id bigint references titres_referentiel (id),
  add column titre_proche_id bigint references titres_referentiel (id),
  add constraint titres_archive_date check (statut = 'actif' or archive_le is not null),
  add constraint titres_remplace_pas_soi_meme check (remplace_par_id is distinct from id),
  add constraint titres_proche_pas_soi_meme check (titre_proche_id is distinct from id);

-- Les pages des titres archivés restent consultables : la lecture publique couvre désormais les deux statuts.
drop policy "lecture publique" on titres_referentiel;
create policy "lecture publique" on titres_referentiel for select using (true);
