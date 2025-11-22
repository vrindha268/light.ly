import { neon } from "@neondatabase/serverless";

export const dbPool = neon(process.env.DB_CONN_STR as string);
