-- Schéma de base V1 (cf. CLAUDE.md §7).
-- Lecture publique via RLS limitée au contenu publié ; toute écriture passe par le service role.

create type statut_organisme as enum ('brouillon', 'publie', 'suspendu');
create type statut_titre as enum ('actif', 'archive');

create table departements (
  code text primary key,                -- '75', '92', '2A'…
  slug text not null unique,
  nom text not null,
  nb_organismes_cache integer not null default 0
);

create table villes (
  id bigint generated always as identity primary key,
  slug text not null unique,
  nom text not null,
  departement_code text not null references departements (code),
  nb_organismes_cache integer not null default 0
);

create table titres_referentiel (
  id bigint generated always as identity primary key,
  slug text not null unique,            -- jamais modifié après création
  libelle_court text not null unique,
  libelle_long text not null,
  code_rncp text,
  duree text,                           -- null tant que [À VÉRIFIER]
  categorie text not null,
  statut statut_titre not null default 'actif',
  created_at timestamptz not null default now(),
  -- Garde-fou base : les slugs réservés sont aussi listés dans lib/config/slugs-reserves.ts
  constraint titres_slug_non_reserve check (
    slug not in ('organismes', 'demarches', 'blog', 'recherche', 'formulaire', 'referencer-mon-organisme')
  )
);

create table organismes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nom text not null,
  siret char(14) unique,
  statut statut_organisme not null default 'brouillon',
  score_completude smallint not null default 0 check (score_completude between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Un lieu est un attribut de l'organisme (pas de page dédiée).
create table lieux (
  id bigint generated always as identity primary key,
  organisme_id uuid not null references organismes (id) on delete cascade,
  adresse text not null,
  code_postal char(5) not null,
  ville_id bigint references villes (id),
  est_siege boolean not null default false
);
create index lieux_organisme_idx on lieux (organisme_id);
create index lieux_ville_idx on lieux (ville_id);

-- L'offre = organisme × titre. Pas d'URL propre : ancre sur la fiche organisme.
create table organisme_titres (
  organisme_id uuid not null references organismes (id) on delete cascade,
  titre_id bigint not null references titres_referentiel (id),
  prix numeric(10, 2),
  modalites text,
  financements text[] not null default '{}',
  lieu_id bigint references lieux (id) on delete set null,
  primary key (organisme_id, titre_id)
);
create index organisme_titres_titre_idx on organisme_titres (titre_id);

create function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger organismes_updated_at before update on organismes
  for each row execute function set_updated_at();

-- RLS : tout fermé par défaut, lecture anonyme du seul contenu public.
alter table departements enable row level security;
alter table villes enable row level security;
alter table titres_referentiel enable row level security;
alter table organismes enable row level security;
alter table lieux enable row level security;
alter table organisme_titres enable row level security;

create policy "lecture publique" on departements for select using (true);
create policy "lecture publique" on villes for select using (true);
create policy "lecture publique" on titres_referentiel for select using (statut = 'actif');
create policy "lecture publique" on organismes for select using (statut = 'publie');
create policy "lecture publique" on lieux for select using (
  exists (select 1 from organismes o where o.id = organisme_id and o.statut = 'publie')
);
create policy "lecture publique" on organisme_titres for select using (
  exists (select 1 from organismes o where o.id = organisme_id and o.statut = 'publie')
);
