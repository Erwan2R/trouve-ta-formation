-- Sprint 5 — champs de la fiche organisme (UX_Ma_Fiche, UX_Fiche_Organisme) et offre identifiée.
-- Décision Erwan 01/10/2026 : une fiche n'existe qu'après inscription volontaire. Les organismes de test
-- (est_test) servent au développement et ne sont jamais servis en production.

alter table organismes
  add column raison_sociale text,
  add column numero_agrement_cnaps text,
  add column qualiopi boolean not null default false,
  add column numero_qualiopi text,
  add column numero_declaration_activite text,
  add column annee_creation smallint check (annee_creation between 1900 and 2100),
  add column logo_url text,
  add column telephone text,
  add column email_contact text,
  add column site_web text,
  add column horaires text,
  add column accessibilite_pmr boolean not null default false,
  add column langues text[] not null default '{}',
  -- Plafond de la présentation libre : 1 500 caractères (Copy fiche §17, point ouvert « à valider »).
  add column presentation text check (char_length(presentation) <= 1500),
  -- Financements acceptés au niveau de l'organisme (bloc 7) : cpf, france_travail, opco, plan_developpement.
  add column financements text[] not null default '{}',
  -- Capacités vendables (UX fiche §7) : drapeaux par compte, tous désactivés en V1.
  add column capacites jsonb not null default '{}',
  add column est_test boolean not null default false;

alter table lieux
  add column nom text,
  add column ville text not null default '',
  add column created_at timestamptz not null default now(),
  add column updated_at timestamptz not null default now();
create trigger lieux_updated_at before update on lieux for each row execute function set_updated_at();

-- L'offre (organisme × titre) : identité stable et slug stocké, jamais recalculé (UX fiche §7).
alter table organisme_titres
  drop column lieu_id,
  drop column prix,
  add column id uuid not null default gen_random_uuid() unique,
  add column slug text,
  add column prix_min numeric(10, 2) check (prix_min >= 0),
  add column prix_max numeric(10, 2) check (prix_max >= prix_min),
  add column prix_compris text,
  add column duree_heures smallint check (duree_heures > 0),
  add column rythmes text[] not null default '{}',   -- temps_plein, soir, week_end
  add column inscription text,
  add column created_at timestamptz not null default now(),
  add column updated_at timestamptz not null default now();
update organisme_titres ot set slug = t.slug from titres_referentiel t where t.id = ot.titre_id;
alter table organisme_titres alter column slug set not null;
alter table organisme_titres add constraint offre_slug_unique unique (organisme_id, slug);
create trigger organisme_titres_updated_at before update on organisme_titres
  for each row execute function set_updated_at();

-- Lieux où l'offre est dispensée (un ou plusieurs ; aucun = siège).
create table offre_lieux (
  offre_id uuid not null references organisme_titres (id) on delete cascade,
  lieu_id bigint not null references lieux (id) on delete cascade,
  primary key (offre_id, lieu_id)
);
alter table offre_lieux enable row level security;
create policy "lecture publique" on offre_lieux for select using (
  exists (
    select 1 from organisme_titres ot join organismes o on o.id = ot.organisme_id
    where ot.id = offre_id and o.statut = 'publie'
  )
);

-- Trace des changements de prix (UX fiche §7 : donnée qui ne se reconstitue pas après coup). Non public.
create table offre_prix_historique (
  id bigint generated always as identity primary key,
  offre_id uuid not null references organisme_titres (id) on delete cascade,
  prix_min numeric(10, 2),
  prix_max numeric(10, 2),
  change_le timestamptz not null default now()
);
alter table offre_prix_historique enable row level security;

create function tracer_prix_offre() returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' or new.prix_min is distinct from old.prix_min or new.prix_max is distinct from old.prix_max then
    insert into offre_prix_historique (offre_id, prix_min, prix_max) values (new.id, new.prix_min, new.prix_max);
  end if;
  return new;
end $$;
create trigger organisme_titres_prix after insert or update on organisme_titres
  for each row execute function tracer_prix_offre();

-- Offres rattachées à un titre archivé : conservées en base, jamais servies publiquement (décision 01/10/2026).
drop policy "lecture publique" on organisme_titres;
create policy "lecture publique" on organisme_titres for select using (
  exists (select 1 from organismes o where o.id = organisme_id and o.statut = 'publie')
  and exists (select 1 from titres_referentiel t where t.id = titre_id and t.statut = 'actif')
);
