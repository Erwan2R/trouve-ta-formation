-- Validation de l'email gérée par l'application (décision Erwan 29/09/2026) : Supabase n'autorise pas la connexion
-- avant validation sur ce projet, alors que la spec Inscription §4 exige l'accès immédiat. La validation bloque la
-- publication, pas l'accès.

alter table comptes_organisme add column email_verifie_le timestamptz;
update comptes_organisme c set email_verifie_le = u.email_confirmed_at
  from auth.users u where u.id = c.id and u.email_confirmed_at is not null;

-- Liens envoyés par email : usage unique, 24 h, jeton stocké haché (SHA-256). Aucun accès client (service role seul).
-- Sert aussi au quota de renvoi (1 toutes les 2 minutes, 5 par jour et par compte).
create table liens_email (
  id bigint generated always as identity primary key,
  compte_id uuid not null references comptes_organisme (id) on delete cascade,
  type text not null check (type in ('validation', 'changement')),
  email text not null,
  jeton_hash text not null unique,
  expire_le timestamptz not null default now() + interval '24 hours',
  utilise_le timestamptz,
  created_at timestamptz not null default now()
);
create index liens_email_compte_idx on liens_email (compte_id, created_at desc);
alter table liens_email enable row level security; -- aucune policy : lecture et écriture par le serveur uniquement

-- Une adresse est-elle déjà celle d'un compte ? (changement d'email : message clair plutôt qu'un échec au clic)
create function email_deja_utilise(p_email text) returns boolean
language sql stable security definer set search_path = public, auth as $$
  select exists (select 1 from auth.users where lower(email) = lower(trim(p_email)));
$$;
revoke all on function email_deja_utilise(text) from public;
grant execute on function email_deja_utilise(text) to authenticated;

-- Publication sur déclaration, pour un organisme donné (appelée aussi hors session, au clic sur un lien).
create function maj_publication_organisme(p_org uuid) returns text
language plpgsql security definer set search_path = public as $$
declare
  v_ok boolean;
  v_statut statut_organisme;
begin
  select
    (select c.email_verifie_le is not null from comptes_organisme c where c.organisme_id = o.id)
    and char_length(trim(o.nom)) > 0
    and exists (select 1 from lieux l where l.organisme_id = o.id and l.est_siege
                and char_length(trim(l.adresse)) > 0 and l.code_postal ~ '^\d{5}$' and char_length(trim(l.ville)) > 0)
    and (nullif(trim(o.telephone), '') is not null or nullif(trim(o.email_contact), '') is not null)
  into v_ok from organismes o where o.id = p_org;
  update organismes set
    statut = case when v_ok then 'publie'::statut_organisme else 'brouillon' end,
    publie_le = case when v_ok then now() else publie_le end
  where id = p_org and statut <> 'suspendu' and statut is distinct from
    (case when v_ok then 'publie'::statut_organisme else 'brouillon' end);
  select statut into v_statut from organismes where id = p_org;
  return v_statut::text;
end $$;
revoke all on function maj_publication_organisme(uuid) from public, anon, authenticated;

create or replace function maj_publication() returns text
language plpgsql security definer set search_path = public as $$
declare
  v_org uuid := mon_organisme();
begin
  if v_org is null then return null; end if;
  return maj_publication_organisme(v_org);
end $$;
