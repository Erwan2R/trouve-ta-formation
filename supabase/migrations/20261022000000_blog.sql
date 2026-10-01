-- Sprint 10 — blog (UX Blog et articles, Copy blog, UX Blog admin ; décisions Erwan 01/10/2026).

-- Auteurs : plusieurs possibles, gérés dans Paramètres admin. Au lancement, un seul : Erwan.
create table auteurs_blog (
  id bigint generated always as identity primary key,
  nom text not null check (char_length(trim(nom)) between 2 and 80),
  qualification text not null check (char_length(trim(qualification)) between 2 and 120),
  biographie text check (char_length(biographie) <= 300),
  photo_url text,
  est_test boolean not null default false, -- auteurs de démonstration : base de dev uniquement
  created_at timestamptz not null default now()
);
alter table auteurs_blog enable row level security;
create policy "lecture publique" on auteurs_blog for select using (true);
revoke insert, update, delete on auteurs_blog from anon, authenticated;

insert into auteurs_blog (nom, qualification, biographie) values (
  'Erwan',
  'Fondateur de Trouve ta formation',
  'Je documente le secteur de la sécurité privée à partir des textes officiels et des retours des organismes référencés.'
);

create type statut_article as enum ('brouillon', 'publie', 'depublie');

create table articles_blog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 100),
  titre text not null check (char_length(trim(titre)) between 2 and 160),
  -- Copy blog §4 : le <title> est le titre de l'article ; version courte si le H1 dépasse 60 caractères.
  titre_seo text check (char_length(titre_seo) <= 70),
  meta_description text check (char_length(meta_description) <= 160),
  extrait text check (char_length(extrait) <= 200), -- 20 mots, rédigé (jamais le début de l'article)
  -- Copy blog §1 : liste fermée, dans l'ordre d'affichage.
  categorie text not null check (categorie in ('le-metier', 'se-former', 'conditions-acces', 'actualites')),
  auteur_id bigint references auteurs_blog (id),
  couverture_url text,
  couverture_alt text,
  couverture_legende text,
  reglementaire boolean not null default false,
  verifie_le date,
  corps jsonb not null default '{"type":"doc","content":[]}', -- document de l'éditeur (Tiptap), rendu côté serveur
  essentiel text[] not null default '{}', -- encadré « L'essentiel »
  a_retenir text[] not null default '{}',
  -- Bloc 8, accroche contextuelle (décision Erwan) : générique seulement si ces champs sont vides.
  accroche_question text,
  accroche_phrase text,
  accroche_lien text,
  accroche_cible text check (accroche_cible is null or accroche_cible ~ '^/'),
  lies uuid[] not null default '{}', -- « À lire aussi », 3 articles choisis par l'admin
  mis_en_avant boolean not null default false,
  statut statut_article not null default 'brouillon',
  publie_le timestamptz, -- fixé au premier passage en « publié », jamais saisi
  maj_le timestamptz, -- fixé à chaque modification d'un article publié, jamais saisi
  -- Dépublication (décision Erwan) : page de remplacement → 301 ; sinon 410. Jamais de 404.
  remplacement text check (remplacement is null or remplacement ~ '^/'),
  est_test boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_reglementaire_verifie check (statut <> 'publie' or not reglementaire or verifie_le is not null)
);
create unique index articles_blog_un_seul_mis_en_avant on articles_blog ((true)) where mis_en_avant;
create index articles_blog_publies_idx on articles_blog (publie_le desc) where statut = 'publie';
create trigger articles_blog_updated_at before update on articles_blog for each row execute function set_updated_at();
alter table articles_blog enable row level security;
create policy "lecture publique" on articles_blog for select using (statut = 'publie');
revoke insert, update, delete on articles_blog from anon, authenticated;

-- Slug modifié après publication : l'ancienne adresse redirige (301) vers la nouvelle.
create table articles_blog_anciens_slugs (
  slug text primary key,
  article_id uuid not null references articles_blog (id) on delete cascade
);
alter table articles_blog_anciens_slugs enable row level security;

-- Résolution d'une adresse d'article absente (middleware) : ancien slug → 301 ; dépublié → 301 ou 410.
create function resolution_article(p_slug text) returns table (statut text, destination text)
language sql stable security definer set search_path = public as $$
  select 'depublie', a.remplacement from articles_blog a where a.slug = p_slug and a.statut = 'depublie'
  union all
  select 'deplace', '/securite-privee/blog/' || a.slug || '/'
    from articles_blog_anciens_slugs s join articles_blog a on a.id = s.article_id
    where s.slug = p_slug and a.statut = 'publie'
  limit 1;
$$;
revoke all on function resolution_article(text) from public;
grant execute on function resolution_article(text) to anon, authenticated;
