-- Sprint 10 — audit anti-concurrence avant publication (UX blog §6, décision Erwan 01/10/2026) : l'admin confirme
-- que l'article ne traite ni un titre du référentiel ni une procédure CNAPS, et qu'il renvoie vers au moins une page
-- structurante. Sans audit, pas de publication.
alter table articles_blog
  add column audit_valide_le timestamptz,
  add column audit_note text check (char_length(audit_note) <= 1000),
  add constraint articles_publie_audite check (statut <> 'publie' or audit_valide_le is not null or est_test),
  -- Adresse de la page « article retiré » (410) : jamais un slug d'article.
  add constraint articles_slug_non_reserve check (slug <> 'article-retire');
