-- « Remplacé par » (décision Erwan 01/10/2026) : ni le titre lui-même (contrainte existante), ni un titre archivé.
-- Garde-fou en base ; l'admin (Sprint 9) filtrera la liste de choix en amont.
create function verifier_remplacement_titre() returns trigger language plpgsql as $$
begin
  if new.remplace_par_id is not null and
     (select statut from titres_referentiel where id = new.remplace_par_id) <> 'actif' then
    raise exception 'Le titre de remplacement doit être un titre actif';
  end if;
  return new;
end $$;

create trigger titres_remplacement_actif
  before insert or update of remplace_par_id on titres_referentiel
  for each row execute function verifier_remplacement_titre();
