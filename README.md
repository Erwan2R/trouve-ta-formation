# Trouve ta formation

Brief technique : [CLAUDE.md](CLAUDE.md) · Plan : [Plan_Sprints.md](Plan_Sprints.md) · Design : [design_handoff_trouve_ta_formation/](design_handoff_trouve_ta_formation/) · Scraping : [scrapping/](scrapping/)

## Environnements

| Branche Git | URL (site / espace organisme) | Rôle | Base Supabase | Indexé par Google |
|---|---|---|---|---|
| `dev` | dev. / partenaires-dev.trouve-ta-formation.fr | Développement | `trouve-ta-formation-dev` | Non |
| `preprod` | preprod. / partenaires-preprod.trouve-ta-formation.fr | Recette avant mise en ligne | `trouve-ta-formation-dev` | Non |
| `main` | trouve-ta-formation.fr / partenaires.trouve-ta-formation.fr | Production | `Trouve ta formation` | Oui |
| local | localhost:3000 / partenaires.localhost:3000 | Poste de développement | `trouve-ta-formation-dev` | — |

**Deux bases Supabase.** La production a sa propre base, qui ne contient jamais de données de test. Dev, preprod et le
poste local partagent `trouve-ta-formation-dev` (`.env.development.local`, lu en priorité par `next dev`).
Une migration s'applique d'abord à la base de dev, puis à la production au moment de la mise en ligne.

Chaque `git push` sur une branche redéploie automatiquement l'environnement correspondant (Vercel).
Hors production, `robots.txt` bloque tout et chaque réponse porte `X-Robots-Tag: noindex, nofollow` (voir `next.config.ts`).

**Circuit d'une modification :** `dev` → fusion dans `preprod` → vérification → fusion dans `main`.

## Commandes

```
npm run dev        # site en local sur http://localhost:3000
npm test           # tests unitaires
npm run build      # build de production
npm run db:types   # régénère lib/supabase/types.ts après une migration
npm run test:e2e   # parcours critiques (Playwright), sur la base de dev
node --env-file=.env.local scripts/config-auth-supabase.mjs --projet=dev --smtp --emails   # réglages d'authentification
```
