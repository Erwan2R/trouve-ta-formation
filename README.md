# Trouve ta formation

Brief technique : [CLAUDE.md](CLAUDE.md) · Plan : [Plan_Sprints.md](Plan_Sprints.md) · Design : [design_handoff_trouve_ta_formation/](design_handoff_trouve_ta_formation/) · Scraping : [scrapping/](scrapping/)

## Environnements

| Branche Git | URL | Rôle | Indexé par Google |
|---|---|---|---|
| `dev` | dev.trouve-ta-formation.fr | Développement | Non |
| `preprod` | preprod.trouve-ta-formation.fr | Recette avant mise en ligne | Non |
| `main` | trouve-ta-formation.fr | Production | Oui |

Chaque `git push` sur une branche redéploie automatiquement l'environnement correspondant (Vercel).
Hors production, `robots.txt` bloque tout et chaque réponse porte `X-Robots-Tag: noindex, nofollow` (voir `next.config.ts`).

**Circuit d'une modification :** `dev` → fusion dans `preprod` → vérification → fusion dans `main`.

## Commandes

```
npm run dev        # site en local sur http://localhost:3000
npm test           # tests unitaires
npm run build      # build de production
npm run db:types   # régénère lib/supabase/types.ts après une migration
```
