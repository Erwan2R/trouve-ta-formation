-- Sprint 9 — Prospection (décision Erwan 01/10/2026) : fichier issu du scraping, espace admin uniquement.
-- Jamais relié aux fiches publiques ni au Fichier client : aucun organisme n'est créé à partir d'un prospect.

create type statut_prospect as enum ('a_contacter', 'contacte', 'inscrit', 'exclu');

create table prospects (
  id bigint generated always as identity primary key,
  -- SIRET, sinon SIREN (établissement non identifié) : clé de dédoublonnage des imports successifs.
  identifiant text not null unique check (identifiant ~ '^(\d{9}|\d{14})$'),
  siret char(14) check (siret ~ '^\d{14}$'),
  siren char(9) not null check (siren ~ '^\d{9}$'),
  nom text not null,
  raison_sociale text,
  email text,
  telephone text,
  site_web text,
  departements text,
  titres text,
  source text,
  scrape_le date,
  statut statut_prospect not null default 'a_contacter',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index prospects_siren_idx on prospects (siren);
create trigger prospects_updated_at before update on prospects for each row execute function set_updated_at();
alter table prospects enable row level security; -- aucune policy : espace admin uniquement (service role)

-- Liste d'exclusion permanente (demandes de suppression) : seules des empreintes SHA-256 des identifiants sont
-- conservées. Elles suffisent à écarter l'organisme de tout import futur, sans garder ses données.
create table exclusions_prospection (
  id bigint generated always as identity primary key,
  type text not null check (type in ('siret', 'siren', 'email', 'domaine')),
  empreinte text not null check (empreinte ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  unique (type, empreinte)
);
alter table exclusions_prospection enable row level security; -- aucune policy : service role uniquement

-- Un organisme qui renseigne un SIRET présent dans la prospection : le prospect passe à « inscrit ».
create function prospect_inscrit() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_siret text := regexp_replace(coalesce(new.siret, ''), '\D', '', 'g');
begin
  if v_siret ~ '^\d{14}$' then
    update prospects set statut = 'inscrit'
      where statut <> 'inscrit' and (siret = v_siret or (siret is null and siren = left(v_siret, 9)));
  end if;
  return new;
end $$;
create trigger prospect_inscrit after insert or update of siret on organismes
  for each row execute function prospect_inscrit();
