-- Sprint 9 — rappels envoyés par l'admin (UX Fichier client §4, historique sur la Fiche client §7).
-- Liste fermée mais extensible : ajouter un type = élargir la contrainte et rédiger l'email correspondant.
create table rappels_organisme (
  id bigint generated always as identity primary key,
  organisme_id uuid not null references organismes (id) on delete cascade,
  type text not null check (type in ('ajout_formation', 'completion_fiche')),
  envoye_le timestamptz not null default now()
);
create index rappels_organisme_idx on rappels_organisme (organisme_id, envoye_le desc);
alter table rappels_organisme enable row level security; -- aucune policy : espace admin uniquement (service role)
