import { Pool } from 'pg'
import * as dotenv from 'dotenv'

// Load .env.local file
dotenv.config({ path: '.env.local' })

if (!('DATABASE_URL' in process.env)) throw new Error('DATABASE_URL not found on .env.local')

async function resetDatabase() {
  console.log('🔄 Starting database reset...')

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  try {
    const client = await pool.connect()

    console.log('🗑️ Dropping all tables...')

    // Drop all tables in dependency order
    await client.query('DROP TABLE IF EXISTS counselor_notes CASCADE')
    await client.query('DROP TABLE IF EXISTS notifications CASCADE')
    await client.query('DROP TABLE IF EXISTS push_subscriptions CASCADE')
    await client.query('DROP TABLE IF EXISTS messages CASCADE')
    await client.query('DROP TABLE IF EXISTS sessions CASCADE')
    await client.query('DROP TABLE IF EXISTS screen_time_thresholds CASCADE')
    await client.query('DROP TABLE IF EXISTS screen_time_sessions CASCADE')
    await client.query('DROP TABLE IF EXISTS screen_time_data CASCADE')
    await client.query('DROP TABLE IF EXISTS social_media_posts CASCADE')
    await client.query('DROP TABLE IF EXISTS mood_check_ins CASCADE')
    await client.query('DROP TABLE IF EXISTS risk_thresholds CASCADE')
    await client.query('DROP TABLE IF EXISTS counselor_student CASCADE')
    await client.query('DROP TABLE IF EXISTS students CASCADE')
    await client.query('DROP TABLE IF EXISTS counselors CASCADE')
    await client.query('DROP TABLE IF EXISTS users CASCADE')

    // Drop all enums
    console.log('🗑️ Dropping enums...')
    await client.query('DROP TYPE IF EXISTS push_subscription_status CASCADE')
    await client.query('DROP TYPE IF EXISTS notification_type CASCADE')
    await client.query('DROP TYPE IF EXISTS session_type CASCADE')
    await client.query('DROP TYPE IF EXISTS session_status CASCADE')
    await client.query('DROP TYPE IF EXISTS risk_level CASCADE')
    await client.query('DROP TYPE IF EXISTS mood_type CASCADE')
    await client.query('DROP TYPE IF EXISTS assignment_status CASCADE')
    await client.query('DROP TYPE IF EXISTS level CASCADE')
    await client.query('DROP TYPE IF EXISTS gender CASCADE')
    await client.query('DROP TYPE IF EXISTS user_role CASCADE')

    // Drop migrations table
    await client.query('DROP TABLE IF EXISTS __drizzle_migrations__ CASCADE')

    client.release()
    console.log('✅ Database reset completed successfully!')
  } catch (error) {
    console.error('❌ Database reset failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}

async function main() {
  await resetDatabase()
  process.exit(0)
}

if (require.main === module) {
  main()
}

export { resetDatabase }
