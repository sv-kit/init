import { DB_URL } from "$env/static/private";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const client = neon(DB_URL);

export const db = drizzle({ client });
