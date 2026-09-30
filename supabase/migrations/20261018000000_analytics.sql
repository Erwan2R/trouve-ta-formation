-- Sprint 9 — Analytics (UX Analytics admin §1) : tracking interne, sans cookie ni outil externe.
-- Un événement = un type, la page, l'organisme concerné le cas échéant, l'heure. Ni IP, ni identifiant de visiteur.
create table evenements (
  id bigint generated always as identity primary key,
  type text not null check (type in ('vue_page', 'clic_telephone', 'clic_email', 'clic_site')),
  chemin text not null check (char_length(chemin) <= 300),
  organisme_id uuid references organismes (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index evenements_date_idx on evenements (created_at);
create index evenements_organisme_idx on evenements (organisme_id, created_at) where organisme_id is not null;
alter table evenements enable row level security; -- aucune policy : écriture par la route /api/evenements, lecture admin

-- Paliers de complétude jour par jour : ils ne se reconstituent pas après coup, on en garde un instantané quotidien.
create table statistiques_quotidiennes (
  jour date primary key,
  basique integer not null,
  correct integer not null,
  optimal integer not null
);
alter table statistiques_quotidiennes enable row level security; -- aucune policy : service role
