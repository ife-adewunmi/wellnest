import { config } from 'dotenv'
import type { Config } from 'drizzle-kit'

// Load environment variables from .env.local
config({ path: '.env.local' })

export default {
  schema: './src/shared/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL!,
  },
} satisfies Config
