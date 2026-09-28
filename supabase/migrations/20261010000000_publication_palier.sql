-- Tableau de bord organisme : date de mise en ligne (« Fiche en ligne depuis le… ») et meilleur palier atteint,
-- pour signaler un recul (UX Dashboard §2 : « refléter ce recul aussi clairement qu'une progression »).
alter table organismes
  add column publie_le timestamptz,
  add column palier_max text not null default 'basique' check (palier_max in ('basique', 'correct', 'optimal'));
grant update (palier_max) on organismes to authenticated;

create or replace function maj_publication() returns text
language plpgsql security definer set search_path = public as $$
declare
  v_org uuid := mon_organisme();
  v_ok boolean;
  v_statut statut_organisme;
begin
  if v_org is null then return null; end if;
  select
    (select email_confirmed_at is not null from auth.users where id = auth.uid())
    and char_length(trim(o.nom)) > 0
    and exists (select 1 from lieux l where l.organisme_id = o.id and l.est_siege
                and char_length(trim(l.adresse)) > 0 and l.code_postal ~ '^\d{5}$' and char_length(trim(l.ville)) > 0)
    and (nullif(trim(o.telephone), '') is not null or nullif(trim(o.email_contact), '') is not null)
  into v_ok from organismes o where o.id = v_org;
  update organismes set
    statut = case when v_ok then 'publie'::statut_organisme else 'brouillon' end,
    publie_le = case when v_ok then now() else publie_le end
  where id = v_org and statut <> 'suspendu' and statut is distinct from
    (case when v_ok then 'publie'::statut_organisme else 'brouillon' end);
  select statut into v_statut from organismes where id = v_org;
  return v_statut::text;
end $$;
