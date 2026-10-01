// Imports relatifs : ce contenu est aussi lu par next.config.ts (blocage du build de production).
import { A_COMPLETER } from "../marqueurs";

// Société éditrice (décision Erwan 01/10/2026) : en cours de création. Tant que ces champs sont [à compléter], la
// mise en production est bloquée (next.config.ts). Un seul endroit à remplir pour toutes les pages légales.
export const EDITEUR = {
  denomination: A_COMPLETER, // dénomination sociale
  forme: A_COMPLETER, // forme juridique (SAS, SASU, SARL…)
  capital: A_COMPLETER, // capital social, en euros
  rcs: A_COMPLETER, // ville du greffe (RCS de …)
  siren: A_COMPLETER,
  siege: A_COMPLETER, // adresse du siège
  tva: A_COMPLETER, // numéro de TVA intracommunautaire, ou « non assujettie »
  directeur: A_COMPLETER, // nom et qualité du directeur de la publication
  dateMaj: A_COMPLETER, // date de publication des pages légales
};
