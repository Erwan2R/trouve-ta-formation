-- Décision Erwan (01/10/2026) : prospection d'abord par téléphone, puis par email si personne ne répond.
alter type statut_prospect add value 'appele_sans_reponse' after 'a_contacter';
alter type statut_prospect add value 'email_envoye' after 'appele_sans_reponse';
