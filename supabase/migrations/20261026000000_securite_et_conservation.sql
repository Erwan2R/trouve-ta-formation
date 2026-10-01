-- Sprint 11 — sécurité et durées de conservation (audit RGPD du 1er octobre 2026, validé par Erwan).

-- 1. Limitation des tentatives (connexion, codes de double authentification, mot de passe oublié, inscription).
--    Les appels à Supabase partent de notre serveur : sa limite par IP ne protège pas chaque compte. Clés stockées en
--    empreinte (jamais l'email ni l'IP en clair), purgées après 24 h.
create table tentatives_acces (
  id bigint generated always as identity primary key,
  cle text not null check (char_length(cle) <= 100),
  created_at timestamptz not null default now()
);
create index tentatives_acces_cle_idx on tentatives_acces (cle, created_at);
alter table tentatives_acces enable row level security; -- aucune policy : serveur uniquement (service role)

-- 2. Prospection : date du dernier contact, base de la durée de conservation de 3 ans (politique de confidentialité).
alter table prospects add column dernier_contact_le timestamptz;
create function prospects_dernier_contact() returns trigger language plpgsql as $$
begin
  if new.statut is distinct from old.statut and new.statut in ('appele_sans_reponse', 'email_envoye', 'contacte') then
    new.dernier_contact_le := now();
  end if;
  return new;
end $$;
create trigger prospects_dernier_contact before update of statut on prospects
  for each row execute function prospects_dernier_contact();

-- 3. Purges automatiques, chaque nuit à 3 h (UTC) :
--    · comptes organismes dont l'email n'a jamais été confirmé, 30 jours après l'inscription (le compte emporte sa fiche) ;
--    · liens email expirés depuis plus de 30 jours ;
--    · événements statistiques de plus de 25 mois (CNIL, mesure d'audience) ;
--    · prospects sans contact depuis 3 ans (ou collectés il y a 3 ans sans jamais avoir été contactés) ;
--    · demandes de titre traitées depuis plus de 3 ans ;
--    · tentatives d'accès de plus de 24 heures.
create function purger_donnees() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  delete from auth.users u using comptes_organisme c
    where c.id = u.id and c.email_verifie_le is null and u.created_at < now() - interval '30 days';
  delete from liens_email where expire_le < now() - interval '30 days';
  delete from evenements where created_at < now() - interval '25 months';
  delete from prospects where coalesce(dernier_contact_le, created_at) < now() - interval '3 years';
  delete from demandes_titre where statut <> 'en_attente' and traitee_le < now() - interval '3 years';
  delete from tentatives_acces where created_at < now() - interval '24 hours';
end $$;
revoke all on function purger_donnees() from public, anon, authenticated;

create extension if not exists pg_cron with schema extensions;
select cron.schedule('purge-quotidienne', '0 3 * * *', 'select public.purger_donnees()');
