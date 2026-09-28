-- Sprint 8 — inscription et espace organisme.
-- Décisions Erwan 02/10/2026 : publication sur déclaration, sans validation préalable, dès que l'email du compte
-- est confirmé et que le minimum publiable est atteint (nom, adresse du siège, un moyen de contact).
-- Un compte = un organisme (V1). 2FA : admin seulement.

create extension if not exists unaccent with schema extensions;

-- Un siège au plus par organisme.
create unique index lieux_un_siege on lieux (organisme_id) where est_siege;

create table comptes_organisme (
  id uuid primary key references auth.users (id) on delete cascade,
  organisme_id uuid not null unique references organismes (id) on delete cascade,
  -- Usage interne, jamais public (UX Paramètres §2).
  contact_nom text check (char_length(contact_nom) <= 120),
  contact_telephone text check (char_length(contact_telephone) <= 30),
  created_at timestamptz not null default now()
);
alter table comptes_organisme enable row level security;
create policy "son compte" on comptes_organisme for select to authenticated using (id = auth.uid());
revoke insert, update, delete on comptes_organisme from anon, authenticated;
grant update (contact_nom, contact_telephone) on comptes_organisme to authenticated;
create policy "modifier son compte" on comptes_organisme for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Organisme du compte connecté (null si aucun).
create function mon_organisme() returns uuid
language sql stable security definer set search_path = public as $$
  select organisme_id from comptes_organisme where id = auth.uid();
$$;
revoke all on function mon_organisme() from public;
grant execute on function mon_organisme() to authenticated;

-- Slug unique dérivé du nom, jamais modifié ensuite (URL de la fiche).
create function slug_organisme(p_nom text) returns text
language plpgsql set search_path = public, extensions as $$
declare
  base text := trim(both '-' from regexp_replace(lower(unaccent(p_nom)), '[^a-z0-9]+', '-', 'g'));
  candidat text;
  n int := 1;
begin
  if base = '' then base := 'organisme'; end if;
  base := left(base, 80);
  candidat := base;
  while exists (select 1 from organismes where slug = candidat) loop
    n := n + 1;
    candidat := base || '-' || n;
  end loop;
  return candidat;
end $$;

-- Inscription (3 champs : email, mot de passe, nom de l'organisme) : l'organisme naît en brouillon avec le compte.
create function creer_organisme_du_compte() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_nom text := nullif(trim(new.raw_user_meta_data ->> 'nom_organisme'), '');
  v_org uuid;
begin
  if v_nom is null then return new; end if; -- compte admin ou autre : pas d'organisme
  insert into organismes (slug, nom) values (slug_organisme(v_nom), left(v_nom, 150)) returning id into v_org;
  insert into comptes_organisme (id, organisme_id) values (new.id, v_org);
  return new;
end $$;
create trigger creer_organisme_apres_inscription after insert on auth.users
  for each row execute function creer_organisme_du_compte();

-- Suppression du compte = suppression de l'organisme et de ses offres (UX Paramètres §3).
create function supprimer_organisme_du_compte() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  delete from organismes where id = (select organisme_id from comptes_organisme where id = old.id);
  return old;
end $$;
create trigger supprimer_organisme_avec_compte before delete on auth.users
  for each row execute function supprimer_organisme_du_compte();

-- Publication sur déclaration : publiée dès email confirmé + minimum publiable ; repasse en brouillon sinon.
-- Une fiche suspendue par l'admin le reste.
create function maj_publication() returns text
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
  update organismes set statut = case when v_ok then 'publie'::statut_organisme else 'brouillon' end
    where id = v_org and statut <> 'suspendu' and statut is distinct from
      (case when v_ok then 'publie'::statut_organisme else 'brouillon' end);
  select statut into v_statut from organismes where id = v_org;
  return v_statut::text;
end $$;
revoke all on function maj_publication() from public;
grant execute on function maj_publication() to authenticated;

-- Droits du propriétaire : lecture de sa fiche quel que soit son statut, écriture des seuls champs éditables.
create policy "sa fiche" on organismes for select to authenticated using (id = mon_organisme());
create policy "modifier sa fiche" on organismes for update to authenticated
  using (id = mon_organisme()) with check (id = mon_organisme());
revoke insert, update, delete on organismes from anon, authenticated;
grant update (
  nom, raison_sociale, siret, numero_declaration_activite, annee_creation, logo_url,
  numero_agrement_cnaps, qualiopi, numero_qualiopi, telephone, email_contact, site_web, horaires,
  accessibilite_pmr, langues, presentation, financements
) on organismes to authenticated;

create policy "ses lieux" on lieux for select to authenticated using (organisme_id = mon_organisme());
create policy "ajouter ses lieux" on lieux for insert to authenticated with check (organisme_id = mon_organisme());
create policy "modifier ses lieux" on lieux for update to authenticated
  using (organisme_id = mon_organisme()) with check (organisme_id = mon_organisme());
create policy "retirer ses lieux" on lieux for delete to authenticated using (organisme_id = mon_organisme());
revoke insert, update, delete on lieux from anon;

-- Offres : sélection dans le référentiel fermé (titre actif uniquement), jamais de saisie libre.
create policy "ses offres" on organisme_titres for select to authenticated using (organisme_id = mon_organisme());
create policy "ajouter ses offres" on organisme_titres for insert to authenticated with check (
  organisme_id = mon_organisme()
  and exists (select 1 from titres_referentiel t where t.id = titre_id and t.statut = 'actif')
);
create policy "modifier ses offres" on organisme_titres for update to authenticated
  using (organisme_id = mon_organisme()) with check (organisme_id = mon_organisme());
create policy "retirer ses offres" on organisme_titres for delete to authenticated using (organisme_id = mon_organisme());
revoke insert, update, delete on organisme_titres from anon;
revoke update on organisme_titres from authenticated;
grant update (prix_min, prix_max, prix_compris, duree_heures, rythmes, financements, inscription)
  on organisme_titres to authenticated;

-- Slug de l'offre = slug du titre (stocké, jamais recalculé).
create function slug_offre() returns trigger language plpgsql set search_path = public as $$
begin
  if new.slug is null then select slug into new.slug from titres_referentiel where id = new.titre_id; end if;
  return new;
end $$;
create trigger organisme_titres_slug before insert on organisme_titres for each row execute function slug_offre();

create policy "ses rattachements" on offre_lieux for select to authenticated using (
  exists (select 1 from organisme_titres ot where ot.id = offre_id and ot.organisme_id = mon_organisme())
);
create policy "gérer ses rattachements" on offre_lieux for all to authenticated
  using (exists (select 1 from organisme_titres ot where ot.id = offre_id and ot.organisme_id = mon_organisme()))
  with check (
    exists (select 1 from organisme_titres ot where ot.id = offre_id and ot.organisme_id = mon_organisme())
    and exists (select 1 from lieux l where l.id = lieu_id and l.organisme_id = mon_organisme())
  );
revoke insert, update, delete on offre_lieux from anon;

-- Titres archivés visibles du propriétaire : avertissement dans « Mes formations » (décision 01/10/2026).
create policy "référentiel complet" on titres_referentiel for select to authenticated using (true);

-- Demandes d'ajout de titre (« Votre titre n'est pas dans la liste ? »), arbitrées par l'admin (Sprint 9).
create type statut_demande as enum ('en_attente', 'acceptee', 'refusee');
create table demandes_titre (
  id bigint generated always as identity primary key,
  organisme_id uuid not null references organismes (id) on delete cascade,
  intitule text not null check (char_length(trim(intitule)) between 2 and 150),
  statut statut_demande not null default 'en_attente',
  created_at timestamptz not null default now(),
  traitee_le timestamptz
);
alter table demandes_titre enable row level security;
create policy "ses demandes" on demandes_titre for select to authenticated using (organisme_id = mon_organisme());
create policy "demander un titre" on demandes_titre for insert to authenticated
  with check (organisme_id = mon_organisme() and statut = 'en_attente');
revoke update, delete on demandes_titre from anon, authenticated;

-- Logos : WebP converti côté serveur, lecture publique, écriture dans le dossier de son organisme.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('logos', 'logos', true, 2097152, array['image/webp'])
on conflict (id) do nothing;
create policy "déposer son logo" on storage.objects for insert to authenticated
  with check (bucket_id = 'logos' and (storage.foldername(name))[1] = mon_organisme()::text);
create policy "remplacer son logo" on storage.objects for update to authenticated
  using (bucket_id = 'logos' and (storage.foldername(name))[1] = mon_organisme()::text);
create policy "retirer son logo" on storage.objects for delete to authenticated
  using (bucket_id = 'logos' and (storage.foldername(name))[1] = mon_organisme()::text);
