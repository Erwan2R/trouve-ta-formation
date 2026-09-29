-- Le slug d'une fiche ne change pas quand l'organisme corrige son nom (décision Erwan 03/10/2026).
-- S'il change un jour (admin), l'ancienne URL redirige en 301 vers la nouvelle : l'ancien slug est conservé ici.
create table organismes_anciens_slugs (
  slug text primary key,
  organisme_id uuid not null references organismes (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table organismes_anciens_slugs enable row level security;
create policy "lecture publique" on organismes_anciens_slugs for select using (
  exists (select 1 from organismes o where o.id = organisme_id and o.statut = 'publie')
);

create function conserver_ancien_slug() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.slug is distinct from old.slug then
    insert into organismes_anciens_slugs (slug, organisme_id) values (old.slug, old.id)
      on conflict (slug) do update set organisme_id = excluded.organisme_id;
    delete from organismes_anciens_slugs where slug = new.slug; -- un slug repris redevient actif
  end if;
  return new;
end $$;
create trigger organismes_ancien_slug after update of slug on organismes
  for each row execute function conserver_ancien_slug();

-- Un slug libéré ne peut pas être réattribué à un autre organisme tant qu'il redirige.
create or replace function slug_organisme(p_nom text) returns text
language plpgsql set search_path = public, extensions as $$
declare
  base text := trim(both '-' from regexp_replace(lower(unaccent(p_nom)), '[^a-z0-9]+', '-', 'g'));
  candidat text;
  n int := 1;
begin
  if base = '' then base := 'organisme'; end if;
  base := left(base, 80);
  candidat := base;
  while exists (select 1 from organismes where slug = candidat)
     or exists (select 1 from organismes_anciens_slugs where slug = candidat) loop
    n := n + 1;
    candidat := base || '-' || n;
  end loop;
  return candidat;
end $$;
