import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const isProd = process.env.CLOUDFLARE_ENV === "prod";
const url = process.env.DB_URL as string;

export default defineConfig({
  out: `.drizzle/migrations-${isProd ? "prod" : "dev"}`,
  schema: "./src/libs/db/tables/*",
  dialect: "postgresql",
  dbCredentials: { url },
  verbose: true,
  strict: true
});
