-- Sprint 7, corrections (décisions Erwan 02/10/2026).

-- Expérience minimale (en années) pour viser un titre d'encadrement : valeurs provisoires, à vérifier (Copy §6).
insert into parametres (cle, valeur, description) values
  ('experience_encadrement', '{"ssiap-2": 1, "ssiap-3": 3}',
   'Formulaire d''affinage : années d''expérience minimales pour recommander le SSIAP 2 (SSIAP 1 détenu) et le SSIAP 3 (SSIAP 2 détenu). Valeurs à vérifier.');

-- Statistiques anonymes du formulaire : écrans atteints (abandons) et réponse « quand commencer ».
-- Un compteur par clé ; ni IP, ni identifiant, ni combinaison de réponses personnelles.
create table formulaire_statistiques (
  cle text primary key check (char_length(cle) <= 60 and cle ~ '^[a-z0-9=_-]+$'),
  compteur integer not null default 1,
  premiere_le timestamptz not null default now(),
  derniere_le timestamptz not null default now()
);
alter table formulaire_statistiques enable row level security; -- aucune lecture publique

create function compter_formulaire(p_cle text) returns void
language sql security definer set search_path = public as $$
  insert into formulaire_statistiques (cle) values (p_cle)
  on conflict (cle) do update
    set compteur = formulaire_statistiques.compteur + 1, derniere_le = now();
$$;
revoke all on function compter_formulaire(text) from public;
grant execute on function compter_formulaire(text) to anon, authenticated;
