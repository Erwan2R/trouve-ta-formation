-- Redirections du blog sans chaîne (décision Erwan 01/10/2026, même règle que les titres) : l'adresse demandée mène
-- directement à la destination finale, à travers changements de slug et remplacements successifs.
--   · article publié sous un autre slug → 301 vers son adresse actuelle ;
--   · article dépublié → 301 vers sa page de remplacement (résolue à son tour si c'est un article), sinon 410 ;
--   · aucune ligne : adresse jamais attribuée (404 normale), ou article publié servi tel quel.
create or replace function resolution_article(p_slug text) returns table (statut text, destination text)
language plpgsql stable security definer set search_path = public as $$
declare
  v_slug text := p_slug;
  v_art articles_blog%rowtype;
  v_suivant text;
begin
  for etape in 0..10 loop
    select a.* into v_art from articles_blog a where a.slug = v_slug;
    if not found then
      select a.* into v_art from articles_blog_anciens_slugs s join articles_blog a on a.id = s.article_id
        where s.slug = v_slug;
    end if;
    if not found or v_art.statut = 'brouillon' then
      -- Remplacement vers un article qui n'existe plus ou n'est pas publié : on s'arrête à l'article retiré.
      if etape = 0 then return; end if;
      statut := 'depublie'; destination := null; return next; return;
    end if;
    if v_art.statut = 'publie' then
      if etape = 0 and v_art.slug = p_slug then return; end if;
      statut := 'deplace'; destination := '/securite-privee/blog/' || v_art.slug || '/'; return next; return;
    end if;
    -- Dépublié.
    if v_art.remplacement is null then
      statut := 'depublie'; destination := null; return next; return;
    end if;
    v_suivant := substring(v_art.remplacement from '^/securite-privee/blog/([a-z0-9-]+)/?$');
    if v_suivant is null or v_suivant = 'article-retire' then
      statut := 'depublie'; destination := v_art.remplacement; return next; return;
    end if;
    v_slug := v_suivant;
  end loop;
  statut := 'depublie'; destination := null; return next; -- boucle de remplacements : article retiré
end $$;
