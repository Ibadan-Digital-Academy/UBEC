import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const { Pool } = pg;

if (!process.env.DATABASE_URL || !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables in Netlify Dashboard.");
}

/**
 * Connection Pooling for Serverless
 * We use a global variable to prevent creating a new pool on every function execution
 */
let pool: pg.Pool;

if (process.env.NODE_ENV === "production") {
  // @ts-ignore - Global is used to persist the pool in serverless environments
  if (!global.pool) {
    // @ts-ignore
    global.pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 1, // Keep this low for Netlify functions to avoid hitting Supabase limits
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  // @ts-ignore
  pool = global.pool;
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

export { pool };
export const db = drizzle(pool, { schema });

// Export the Supabase client for Auth verification
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);