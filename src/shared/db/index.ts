// src/shared/db/index.ts
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

import * as schema from './schema'

// Use Neon serverless driver for better compatibility
const sql = neon(process.env.DRIZZLE_DATABASE_URL!)

export const db = drizzle(sql, { schema })
