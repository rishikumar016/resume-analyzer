import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
export const isDatabaseConfigured =
  !!connectionString && !connectionString.includes("[YOUR-PASSWORD]");

// Connection for queries (pooled)
const client = isDatabaseConfigured
  ? postgres(connectionString!, { prepare: false })
  : null;

export const db = client ? drizzle(client, { schema }) : null;
