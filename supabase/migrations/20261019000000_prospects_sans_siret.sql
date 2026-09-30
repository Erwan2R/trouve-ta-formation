-- Décision Erwan (01/10/2026) : les lignes du scraping sans SIRET sont gardées. Leur SIRET est cherché à l'import
-- (API Recherche d'entreprises, correspondance sans ambiguïté seulement) ; à défaut, dédoublonnage par email,
-- domaine du site ou téléphone, et exclusion toujours active par email et domaine.
alter table prospects
  alter column identifiant drop not null,
  alter column siren drop not null,
  add constraint prospects_dedoublonnable check (
    identifiant is not null or coalesce(email, site_web, telephone) is not null),
  add constraint prospects_identifiant_coherent check (
    (identifiant is null) = (siren is null));
