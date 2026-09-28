/** Vrai uniquement sur le déploiement de production Vercel (main → trouve-ta-formation.fr). */
export const EST_PRODUCTION = process.env.VERCEL_ENV === "production";
