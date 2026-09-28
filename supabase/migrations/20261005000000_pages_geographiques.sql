-- Sprint 6 — pages géographiques et recherches sans résultat (décisions Erwan 01/10/2026).

-- Paramètres réglables (l'admin les éditera au Sprint 9 ; en attendant, dans l'éditeur de tables Supabase).
create table parametres (
  cle text primary key,
  valeur jsonb not null,
  description text,
  maj_le timestamptz not null default now()
);
alter table parametres enable row level security;
create policy "lecture publique" on parametres for select using (true);

insert into parametres (cle, valeur, description) values
  ('seuil_page_departement', '{"organismes": 3, "palier_min": "correct"}',
   'Une page département n''existe qu''à partir de ce nombre d''organismes ayant un lieu dans le département et au moins ce palier. Valeur provisoire.'),
  ('seuil_page_ville', '{"organismes": 5, "palier_min": "correct"}',
   'Seuil de création d''une page ville (avec volume de recherche et contenu propre, UX géo §2). Valeur provisoire.');

-- Préposition du H1, saisie une fois (Copy géo §4) — corrigée : « dans le Val-de-Marne », « dans les Yvelines ».
-- L'existence d'une page département est désormais calculée (seuil + contenu rédigé), plus un drapeau manuel.
alter table departements add column preposition text not null default 'en';
update departements set preposition = case code
  when '75' then 'à'
  when '78' then 'dans les'
  when '92' then 'dans les'
  when '94' then 'dans le'
  when '95' then 'dans le'
  else 'en' end;
alter table departements drop column page_publiee;

-- Recherches sans résultat : combinaison de filtres + compteur uniquement.
-- Ni IP, ni identifiant, ni texte libre ; la recherche par nom est exclue en amont (application).
create table recherches_sans_resultat (
  combinaison text primary key check (char_length(combinaison) <= 300 and combinaison ~ '^[a-z0-9=&_-]+$'),
  compteur integer not null default 1,
  premiere_le timestamptz not null default now(),
  derniere_le timestamptz not null default now()
);
alter table recherches_sans_resultat enable row level security; -- aucune lecture publique

create function enregistrer_recherche_sans_resultat(p_combinaison text) returns void
language sql security definer set search_path = public as $$
  insert into recherches_sans_resultat (combinaison) values (p_combinaison)
  on conflict (combinaison) do update
    set compteur = recherches_sans_resultat.compteur + 1, derniere_le = now();
$$;
revoke all on function enregistrer_recherche_sans_resultat(text) from public;
grant execute on function enregistrer_recherche_sans_resultat(text) to anon, authenticated;
