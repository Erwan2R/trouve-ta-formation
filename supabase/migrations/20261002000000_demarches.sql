-- Données variables des pages démarche CNAPS (Copy démarches §3.2 et §9 : datation gérée en base).
-- Champ vide = non affiché. Décision Erwan 30/09/2026 : coût, délai d'instruction et fenêtre de
-- renouvellement restent vides jusqu'à sa vérification sur la FAQ CNAPS ; aucune page en production avant.
create table demarches (
  slug text primary key,
  page_publiee boolean not null default false,
  verifie_le date,               -- null = jamais vérifiée → jamais visible en production
  delai_instruction text,
  cout text,
  validite text,
  fenetre_depot text             -- renouvellement uniquement (« Quand »)
);

alter table demarches enable row level security;
create policy "lecture publique" on demarches for select using (true);

-- Validités confirmées par la Copy (§1 et §6/§7) ; celle de l'autorisation préalable reste à vérifier.
insert into demarches (slug, validite) values
  ('autorisation-prealable', null),
  ('carte-professionnelle', 'Cinq ans, sur tout le territoire national'),
  ('renouvellement-carte-professionnelle', 'Cinq ans supplémentaires');
