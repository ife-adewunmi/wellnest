import * as dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '@/shared/db/schema'
import { isLocal, isProd } from '../enums/environment'

// Load env before creating the pool (important for CLI scripts like seed.ts)
dotenv.config({ path: '.env.local' })

const dbConnectionURL = !isProd() ? process.env.DATABASE_URL : process.env.DATABASE_URL_UNPOOLED

if (!dbConnectionURL) {
  throw new Error('DATABASE_URL not found. Please set it in .env file')
}

// Use SSL for common hosted providers or when explicitly requested
const shouldUseSSL =
  process.env.DATABASE_SSL === 'true' ||
  /neon\.tech|supabase\.co|render\.com|amazonaws\.com/i.test(dbConnectionURL)

const pool = new Pool({
  connectionString: dbConnectionURL,
  ssl: shouldUseSSL ? { rejectUnauthorized: false } : undefined,
})

export const db = drizzle(pool, { schema })
