-- Sprint 9 — espace admin : compte administrateur unique, 2FA TOTP obligatoire (Supabase MFA), codes de récupération.
-- Les lectures et écritures de l'admin passent par le serveur (service role) après vérification : administrateur
-- connu ET session au niveau aal2 (mot de passe + code TOTP). Aucune policy d'écriture n'est ouverte ici.

create table administrateurs (
  id uuid primary key references auth.users (id) on delete cascade,
  tfa_active_le timestamptz,
  codes_generes_le timestamptz,
  mdp_modifie_le timestamptz,
  created_at timestamptz not null default now()
);
-- Un seul compte admin en V1 (UX Paramètres admin §1) : une deuxième ligne est refusée par la base.
create unique index administrateurs_unique on administrateurs ((true));
alter table administrateurs enable row level security;
create policy "soi-meme" on administrateurs for select to authenticated using (id = auth.uid());
revoke insert, update, delete on administrateurs from anon, authenticated;

-- Codes de récupération : 10 codes à usage unique, stockés hachés (SHA-256), affichés une seule fois.
create table codes_recuperation_admin (
  id bigint generated always as identity primary key,
  admin_id uuid not null references administrateurs (id) on delete cascade,
  code_hash text not null,
  utilise_le timestamptz,
  created_at timestamptz not null default now()
);
alter table codes_recuperation_admin enable row level security; -- aucune policy : serveur uniquement

-- Admin : vrai seulement pour l'administrateur connecté avec son second facteur (aal2).
create function est_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from administrateurs where id = auth.uid()) and coalesce(auth.jwt() ->> 'aal', '') = 'aal2';
$$;
revoke all on function est_admin() from public;
grant execute on function est_admin() to authenticated;

-- Changement d'email de l'admin : mêmes liens que les organismes (usage unique, 24 h, jeton haché).
alter table liens_email
  alter column compte_id drop not null,
  add column admin_id uuid references administrateurs (id) on delete cascade,
  add constraint liens_email_un_titulaire check ((compte_id is null) <> (admin_id is null));
create index liens_email_admin_idx on liens_email (admin_id, created_at desc);
