-- Sprint 10 — images du blog (couvertures, images du corps) : WebP converti côté serveur, lecture publique.
-- Écriture par l'espace admin uniquement (service role) : aucune policy d'écriture.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog', 'blog', true, 3145728, array['image/webp']);
