export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      administrateurs: {
        Row: {
          codes_generes_le: string | null
          created_at: string
          est_test: boolean
          id: string
          mdp_modifie_le: string | null
          tfa_active_le: string | null
        }
        Insert: {
          codes_generes_le?: string | null
          created_at?: string
          est_test?: boolean
          id: string
          mdp_modifie_le?: string | null
          tfa_active_le?: string | null
        }
        Update: {
          codes_generes_le?: string | null
          created_at?: string
          est_test?: boolean
          id?: string
          mdp_modifie_le?: string | null
          tfa_active_le?: string | null
        }
        Relationships: []
      }
      articles_blog: {
        Row: {
          a_retenir: string[]
          accroche_cible: string | null
          accroche_lien: string | null
          accroche_phrase: string | null
          accroche_question: string | null
          audit_note: string | null
          audit_valide_le: string | null
          auteur_id: number | null
          categorie: string
          corps: Json
          couverture_alt: string | null
          couverture_legende: string | null
          couverture_url: string | null
          created_at: string
          essentiel: string[]
          est_test: boolean
          extrait: string | null
          id: string
          lies: string[]
          maj_le: string | null
          meta_description: string | null
          mis_en_avant: boolean
          publie_le: string | null
          reglementaire: boolean
          remplacement: string | null
          slug: string
          statut: Database["public"]["Enums"]["statut_article"]
          titre: string
          titre_seo: string | null
          updated_at: string
          verifie_le: string | null
        }
        Insert: {
          a_retenir?: string[]
          accroche_cible?: string | null
          accroche_lien?: string | null
          accroche_phrase?: string | null
          accroche_question?: string | null
          audit_note?: string | null
          audit_valide_le?: string | null
          auteur_id?: number | null
          categorie: string
          corps?: Json
          couverture_alt?: string | null
          couverture_legende?: string | null
          couverture_url?: string | null
          created_at?: string
          essentiel?: string[]
          est_test?: boolean
          extrait?: string | null
          id?: string
          lies?: string[]
          maj_le?: string | null
          meta_description?: string | null
          mis_en_avant?: boolean
          publie_le?: string | null
          reglementaire?: boolean
          remplacement?: string | null
          slug: string
          statut?: Database["public"]["Enums"]["statut_article"]
          titre: string
          titre_seo?: string | null
          updated_at?: string
          verifie_le?: string | null
        }
        Update: {
          a_retenir?: string[]
          accroche_cible?: string | null
          accroche_lien?: string | null
          accroche_phrase?: string | null
          accroche_question?: string | null
          audit_note?: string | null
          audit_valide_le?: string | null
          auteur_id?: number | null
          categorie?: string
          corps?: Json
          couverture_alt?: string | null
          couverture_legende?: string | null
          couverture_url?: string | null
          created_at?: string
          essentiel?: string[]
          est_test?: boolean
          extrait?: string | null
          id?: string
          lies?: string[]
          maj_le?: string | null
          meta_description?: string | null
          mis_en_avant?: boolean
          publie_le?: string | null
          reglementaire?: boolean
          remplacement?: string | null
          slug?: string
          statut?: Database["public"]["Enums"]["statut_article"]
          titre?: string
          titre_seo?: string | null
          updated_at?: string
          verifie_le?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_blog_auteur_id_fkey"
            columns: ["auteur_id"]
            isOneToOne: false
            referencedRelation: "auteurs_blog"
            referencedColumns: ["id"]
          },
        ]
      }
      articles_blog_anciens_slugs: {
        Row: {
          article_id: string
          slug: string
        }
        Insert: {
          article_id: string
          slug: string
        }
        Update: {
          article_id?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_blog_anciens_slugs_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles_blog"
            referencedColumns: ["id"]
          },
        ]
      }
      auteurs_blog: {
        Row: {
          biographie: string | null
          created_at: string
          est_test: boolean
          id: number
          nom: string
          photo_url: string | null
          qualification: string
        }
        Insert: {
          biographie?: string | null
          created_at?: string
          est_test?: boolean
          id?: never
          nom: string
          photo_url?: string | null
          qualification: string
        }
        Update: {
          biographie?: string | null
          created_at?: string
          est_test?: boolean
          id?: never
          nom?: string
          photo_url?: string | null
          qualification?: string
        }
        Relationships: []
      }
      codes_recuperation_admin: {
        Row: {
          admin_id: string
          code_hash: string
          created_at: string
          id: number
          utilise_le: string | null
        }
        Insert: {
          admin_id: string
          code_hash: string
          created_at?: string
          id?: never
          utilise_le?: string | null
        }
        Update: {
          admin_id?: string
          code_hash?: string
          created_at?: string
          id?: never
          utilise_le?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "codes_recuperation_admin_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "administrateurs"
            referencedColumns: ["id"]
          },
        ]
      }
      comptes_organisme: {
        Row: {
          contact_nom: string | null
          contact_telephone: string | null
          created_at: string
          email_verifie_le: string | null
          id: string
          onboarding_etape: number | null
          organisme_id: string
        }
        Insert: {
          contact_nom?: string | null
          contact_telephone?: string | null
          created_at?: string
          email_verifie_le?: string | null
          id: string
          onboarding_etape?: number | null
          organisme_id: string
        }
        Update: {
          contact_nom?: string | null
          contact_telephone?: string | null
          created_at?: string
          email_verifie_le?: string | null
          id?: string
          onboarding_etape?: number | null
          organisme_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comptes_organisme_organisme_id_fkey"
            columns: ["organisme_id"]
            isOneToOne: true
            referencedRelation: "organismes"
            referencedColumns: ["id"]
          },
        ]
      }
      demandes_titre: {
        Row: {
          created_at: string
          id: number
          intitule: string
          motif_refus: string | null
          organisme_id: string
          statut: Database["public"]["Enums"]["statut_demande"]
          titre_existant_id: number | null
          traitee_le: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          intitule: string
          motif_refus?: string | null
          organisme_id: string
          statut?: Database["public"]["Enums"]["statut_demande"]
          titre_existant_id?: number | null
          traitee_le?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          intitule?: string
          motif_refus?: string | null
          organisme_id?: string
          statut?: Database["public"]["Enums"]["statut_demande"]
          titre_existant_id?: number | null
          traitee_le?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demandes_titre_organisme_id_fkey"
            columns: ["organisme_id"]
            isOneToOne: false
            referencedRelation: "organismes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demandes_titre_titre_existant_id_fkey"
            columns: ["titre_existant_id"]
            isOneToOne: false
            referencedRelation: "titres_referentiel"
            referencedColumns: ["id"]
          },
        ]
      }
      demarches: {
        Row: {
          cout: string | null
          delai_instruction: string | null
          fenetre_depot: string | null
          page_publiee: boolean
          slug: string
          validite: string | null
          verifie_le: string | null
        }
        Insert: {
          cout?: string | null
          delai_instruction?: string | null
          fenetre_depot?: string | null
          page_publiee?: boolean
          slug: string
          validite?: string | null
          verifie_le?: string | null
        }
        Update: {
          cout?: string | null
          delai_instruction?: string | null
          fenetre_depot?: string | null
          page_publiee?: boolean
          slug?: string
          validite?: string | null
          verifie_le?: string | null
        }
        Relationships: []
      }
      departements: {
        Row: {
          code: string
          forme_de: string
          forme_lieu: string
          nb_organismes_cache: number
          nom: string
          slug: string
        }
        Insert: {
          code: string
          forme_de: string
          forme_lieu: string
          nb_organismes_cache?: number
          nom: string
          slug: string
        }
        Update: {
          code?: string
          forme_de?: string
          forme_lieu?: string
          nb_organismes_cache?: number
          nom?: string
          slug?: string
        }
        Relationships: []
      }
      evenements: {
        Row: {
          chemin: string
          created_at: string
          id: number
          organisme_id: string | null
          type: string
        }
        Insert: {
          chemin: string
          created_at?: string
          id?: never
          organisme_id?: string | null
          type: string
        }
        Update: {
          chemin?: string
          created_at?: string
          id?: never
          organisme_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "evenements_organisme_id_fkey"
            columns: ["organisme_id"]
            isOneToOne: false
            referencedRelation: "organismes"
            referencedColumns: ["id"]
          },
        ]
      }
      exclusions_prospection: {
        Row: {
          created_at: string
          empreinte: string
          id: number
          type: string
        }
        Insert: {
          created_at?: string
          empreinte: string
          id?: never
          type: string
        }
        Update: {
          created_at?: string
          empreinte?: string
          id?: never
          type?: string
        }
        Relationships: []
      }
      formulaire_statistiques: {
        Row: {
          cle: string
          compteur: number
          derniere_le: string
          premiere_le: string
        }
        Insert: {
          cle: string
          compteur?: number
          derniere_le?: string
          premiere_le?: string
        }
        Update: {
          cle?: string
          compteur?: number
          derniere_le?: string
          premiere_le?: string
        }
        Relationships: []
      }
      liens_email: {
        Row: {
          admin_id: string | null
          compte_id: string | null
          created_at: string
          email: string
          expire_le: string
          id: number
          jeton_hash: string
          type: string
          utilise_le: string | null
        }
        Insert: {
          admin_id?: string | null
          compte_id?: string | null
          created_at?: string
          email: string
          expire_le?: string
          id?: never
          jeton_hash: string
          type: string
          utilise_le?: string | null
        }
        Update: {
          admin_id?: string | null
          compte_id?: string | null
          created_at?: string
          email?: string
          expire_le?: string
          id?: never
          jeton_hash?: string
          type?: string
          utilise_le?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "liens_email_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "administrateurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "liens_email_compte_id_fkey"
            columns: ["compte_id"]
            isOneToOne: false
            referencedRelation: "comptes_organisme"
            referencedColumns: ["id"]
          },
        ]
      }
      lieux: {
        Row: {
          adresse: string
          code_postal: string
          created_at: string
          est_siege: boolean
          id: number
          nom: string | null
          organisme_id: string
          updated_at: string
          ville: string
          ville_id: number | null
        }
        Insert: {
          adresse: string
          code_postal: string
          created_at?: string
          est_siege?: boolean
          id?: never
          nom?: string | null
          organisme_id: string
          updated_at?: string
          ville?: string
          ville_id?: number | null
        }
        Update: {
          adresse?: string
          code_postal?: string
          created_at?: string
          est_siege?: boolean
          id?: never
          nom?: string | null
          organisme_id?: string
          updated_at?: string
          ville?: string
          ville_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lieux_organisme_id_fkey"
            columns: ["organisme_id"]
            isOneToOne: false
            referencedRelation: "organismes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lieux_ville_id_fkey"
            columns: ["ville_id"]
            isOneToOne: false
            referencedRelation: "villes"
            referencedColumns: ["id"]
          },
        ]
      }
      offre_lieux: {
        Row: {
          lieu_id: number
          offre_id: string
        }
        Insert: {
          lieu_id: number
          offre_id: string
        }
        Update: {
          lieu_id?: number
          offre_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offre_lieux_lieu_id_fkey"
            columns: ["lieu_id"]
            isOneToOne: false
            referencedRelation: "lieux"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offre_lieux_offre_id_fkey"
            columns: ["offre_id"]
            isOneToOne: false
            referencedRelation: "organisme_titres"
            referencedColumns: ["id"]
          },
        ]
      }
      offre_prix_historique: {
        Row: {
          change_le: string
          id: number
          offre_id: string
          prix_max: number | null
          prix_min: number | null
        }
        Insert: {
          change_le?: string
          id?: never
          offre_id: string
          prix_max?: number | null
          prix_min?: number | null
        }
        Update: {
          change_le?: string
          id?: never
          offre_id?: string
          prix_max?: number | null
          prix_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "offre_prix_historique_offre_id_fkey"
            columns: ["offre_id"]
            isOneToOne: false
            referencedRelation: "organisme_titres"
            referencedColumns: ["id"]
          },
        ]
      }
      organisme_titres: {
        Row: {
          created_at: string
          duree_heures: number | null
          financements: string[]
          id: string
          inscription: string | null
          modalites: string | null
          organisme_id: string
          prix_compris: string | null
          prix_max: number | null
          prix_min: number | null
          rythmes: string[]
          slug: string
          titre_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          duree_heures?: number | null
          financements?: string[]
          id?: string
          inscription?: string | null
          modalites?: string | null
          organisme_id: string
          prix_compris?: string | null
          prix_max?: number | null
          prix_min?: number | null
          rythmes?: string[]
          slug: string
          titre_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          duree_heures?: number | null
          financements?: string[]
          id?: string
          inscription?: string | null
          modalites?: string | null
          organisme_id?: string
          prix_compris?: string | null
          prix_max?: number | null
          prix_min?: number | null
          rythmes?: string[]
          slug?: string
          titre_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisme_titres_organisme_id_fkey"
            columns: ["organisme_id"]
            isOneToOne: false
            referencedRelation: "organismes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisme_titres_titre_id_fkey"
            columns: ["titre_id"]
            isOneToOne: false
            referencedRelation: "titres_referentiel"
            referencedColumns: ["id"]
          },
        ]
      }
      organismes: {
        Row: {
          accessibilite_pmr: boolean
          annee_creation: number | null
          capacites: Json
          created_at: string
          email_contact: string | null
          est_test: boolean
          financements: string[]
          horaires: string | null
          id: string
          langues: string[]
          logo_url: string | null
          nom: string
          numero_agrement_cnaps: string | null
          numero_declaration_activite: string | null
          numero_qualiopi: string | null
          palier_max: string
          presentation: string | null
          publie_le: string | null
          qualiopi: boolean
          raison_sociale: string | null
          rappels_desabonne_le: string | null
          score_completude: number
          siret: string | null
          site_web: string | null
          slug: string
          statut: Database["public"]["Enums"]["statut_organisme"]
          telephone: string | null
          updated_at: string
        }
        Insert: {
          accessibilite_pmr?: boolean
          annee_creation?: number | null
          capacites?: Json
          created_at?: string
          email_contact?: string | null
          est_test?: boolean
          financements?: string[]
          horaires?: string | null
          id?: string
          langues?: string[]
          logo_url?: string | null
          nom: string
          numero_agrement_cnaps?: string | null
          numero_declaration_activite?: string | null
          numero_qualiopi?: string | null
          palier_max?: string
          presentation?: string | null
          publie_le?: string | null
          qualiopi?: boolean
          raison_sociale?: string | null
          rappels_desabonne_le?: string | null
          score_completude?: number
          siret?: string | null
          site_web?: string | null
          slug: string
          statut?: Database["public"]["Enums"]["statut_organisme"]
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          accessibilite_pmr?: boolean
          annee_creation?: number | null
          capacites?: Json
          created_at?: string
          email_contact?: string | null
          est_test?: boolean
          financements?: string[]
          horaires?: string | null
          id?: string
          langues?: string[]
          logo_url?: string | null
          nom?: string
          numero_agrement_cnaps?: string | null
          numero_declaration_activite?: string | null
          numero_qualiopi?: string | null
          palier_max?: string
          presentation?: string | null
          publie_le?: string | null
          qualiopi?: boolean
          raison_sociale?: string | null
          rappels_desabonne_le?: string | null
          score_completude?: number
          siret?: string | null
          site_web?: string | null
          slug?: string
          statut?: Database["public"]["Enums"]["statut_organisme"]
          telephone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      organismes_anciens_slugs: {
        Row: {
          created_at: string
          organisme_id: string
          slug: string
        }
        Insert: {
          created_at?: string
          organisme_id: string
          slug: string
        }
        Update: {
          created_at?: string
          organisme_id?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "organismes_anciens_slugs_organisme_id_fkey"
            columns: ["organisme_id"]
            isOneToOne: false
            referencedRelation: "organismes"
            referencedColumns: ["id"]
          },
        ]
      }
      parametres: {
        Row: {
          cle: string
          description: string | null
          maj_le: string
          valeur: Json
        }
        Insert: {
          cle: string
          description?: string | null
          maj_le?: string
          valeur: Json
        }
        Update: {
          cle?: string
          description?: string | null
          maj_le?: string
          valeur?: Json
        }
        Relationships: []
      }
      prospects: {
        Row: {
          created_at: string
          departements: string | null
          dernier_contact_le: string | null
          email: string | null
          id: number
          identifiant: string | null
          nom: string
          raison_sociale: string | null
          scrape_le: string | null
          siren: string | null
          siret: string | null
          site_web: string | null
          source: string | null
          statut: Database["public"]["Enums"]["statut_prospect"]
          telephone: string | null
          titres: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          departements?: string | null
          dernier_contact_le?: string | null
          email?: string | null
          id?: never
          identifiant?: string | null
          nom: string
          raison_sociale?: string | null
          scrape_le?: string | null
          siren?: string | null
          siret?: string | null
          site_web?: string | null
          source?: string | null
          statut?: Database["public"]["Enums"]["statut_prospect"]
          telephone?: string | null
          titres?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          departements?: string | null
          dernier_contact_le?: string | null
          email?: string | null
          id?: never
          identifiant?: string | null
          nom?: string
          raison_sociale?: string | null
          scrape_le?: string | null
          siren?: string | null
          siret?: string | null
          site_web?: string | null
          source?: string | null
          statut?: Database["public"]["Enums"]["statut_prospect"]
          telephone?: string | null
          titres?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rappels_organisme: {
        Row: {
          envoye_le: string
          id: number
          organisme_id: string
          type: string
        }
        Insert: {
          envoye_le?: string
          id?: never
          organisme_id: string
          type: string
        }
        Update: {
          envoye_le?: string
          id?: never
          organisme_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "rappels_organisme_organisme_id_fkey"
            columns: ["organisme_id"]
            isOneToOne: false
            referencedRelation: "organismes"
            referencedColumns: ["id"]
          },
        ]
      }
      recherches_sans_resultat: {
        Row: {
          combinaison: string
          compteur: number
          derniere_le: string
          premiere_le: string
        }
        Insert: {
          combinaison: string
          compteur?: number
          derniere_le?: string
          premiere_le?: string
        }
        Update: {
          combinaison?: string
          compteur?: number
          derniere_le?: string
          premiere_le?: string
        }
        Relationships: []
      }
      statistiques_quotidiennes: {
        Row: {
          basique: number
          correct: number
          jour: string
          optimal: number
        }
        Insert: {
          basique: number
          correct: number
          jour: string
          optimal: number
        }
        Update: {
          basique?: number
          correct?: number
          jour?: string
          optimal?: number
        }
        Relationships: []
      }
      tentatives_acces: {
        Row: {
          cle: string
          created_at: string
          id: number
        }
        Insert: {
          cle: string
          created_at?: string
          id?: never
        }
        Update: {
          cle?: string
          created_at?: string
          id?: never
        }
        Relationships: []
      }
      titres_referentiel: {
        Row: {
          accroche: string | null
          archive_le: string | null
          categorie: string
          code_rncp: string | null
          created_at: string
          duree: string | null
          id: number
          libelle_court: string
          libelle_long: string
          ordre: number
          page_publiee: boolean
          remplace_par_id: number | null
          slug: string
          statut: Database["public"]["Enums"]["statut_titre"]
          titre_proche_id: number | null
        }
        Insert: {
          accroche?: string | null
          archive_le?: string | null
          categorie: string
          code_rncp?: string | null
          created_at?: string
          duree?: string | null
          id?: never
          libelle_court: string
          libelle_long: string
          ordre?: number
          page_publiee?: boolean
          remplace_par_id?: number | null
          slug: string
          statut?: Database["public"]["Enums"]["statut_titre"]
          titre_proche_id?: number | null
        }
        Update: {
          accroche?: string | null
          archive_le?: string | null
          categorie?: string
          code_rncp?: string | null
          created_at?: string
          duree?: string | null
          id?: never
          libelle_court?: string
          libelle_long?: string
          ordre?: number
          page_publiee?: boolean
          remplace_par_id?: number | null
          slug?: string
          statut?: Database["public"]["Enums"]["statut_titre"]
          titre_proche_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "titres_referentiel_remplace_par_id_fkey"
            columns: ["remplace_par_id"]
            isOneToOne: false
            referencedRelation: "titres_referentiel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "titres_referentiel_titre_proche_id_fkey"
            columns: ["titre_proche_id"]
            isOneToOne: false
            referencedRelation: "titres_referentiel"
            referencedColumns: ["id"]
          },
        ]
      }
      villes: {
        Row: {
          departement_code: string
          id: number
          nb_organismes_cache: number
          nom: string
          slug: string
        }
        Insert: {
          departement_code: string
          id?: never
          nb_organismes_cache?: number
          nom: string
          slug: string
        }
        Update: {
          departement_code?: string
          id?: never
          nb_organismes_cache?: number
          nom?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "villes_departement_code_fkey"
            columns: ["departement_code"]
            isOneToOne: false
            referencedRelation: "departements"
            referencedColumns: ["code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      compter_formulaire: { Args: { p_cle: string }; Returns: undefined }
      email_deja_utilise: { Args: { p_email: string }; Returns: boolean }
      enregistrer_recherche_sans_resultat: {
        Args: { p_combinaison: string }
        Returns: undefined
      }
      est_admin: { Args: never; Returns: boolean }
      maj_publication: { Args: never; Returns: string }
      maj_publication_organisme: { Args: { p_org: string }; Returns: string }
      mon_organisme: { Args: never; Returns: string }
      purger_donnees: { Args: never; Returns: undefined }
      resolution_article: {
        Args: { p_slug: string }
        Returns: {
          destination: string
          statut: string
        }[]
      }
      slug_organisme: { Args: { p_nom: string }; Returns: string }
    }
    Enums: {
      statut_article: "brouillon" | "publie" | "depublie"
      statut_demande: "en_attente" | "acceptee" | "refusee"
      statut_organisme: "brouillon" | "publie" | "suspendu"
      statut_prospect:
        | "a_contacter"
        | "appele_sans_reponse"
        | "email_envoye"
        | "contacte"
        | "inscrit"
        | "exclu"
      statut_titre: "actif" | "archive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      statut_article: ["brouillon", "publie", "depublie"],
      statut_demande: ["en_attente", "acceptee", "refusee"],
      statut_organisme: ["brouillon", "publie", "suspendu"],
      statut_prospect: [
        "a_contacter",
        "appele_sans_reponse",
        "email_envoye",
        "contacte",
        "inscrit",
        "exclu",
      ],
      statut_titre: ["actif", "archive"],
    },
  },
} as const
