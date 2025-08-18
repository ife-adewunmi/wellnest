import * as dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '@/shared/db/schema'

// Load env before creating the pool (important for CLI scripts like seed.ts)
dotenv.config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found. Please set it in .env.local')
}

// Use SSL for common hosted providers or when explicitly requested
const shouldUseSSL =
  process.env.DATABASE_SSL === 'true' ||
  /neon\.tech|supabase\.co|render\.com|amazonaws\.com/i.test(process.env.DATABASE_URL)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: shouldUseSSL ? { rejectUnauthorized: false } : undefined,
})

export const db = drizzle(pool, { schema })
