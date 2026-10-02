-- Sprint 12 — Suivi des 404 : une page introuvable est un événement à part (n'entre plus dans les vues de page).
alter table evenements drop constraint evenements_type_check;
alter table evenements add constraint evenements_type_check
  check (type in ('vue_page', 'page_404', 'clic_telephone', 'clic_email', 'clic_site'));
