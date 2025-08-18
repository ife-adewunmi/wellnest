import 'dotenv/config'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Load .env.local file
config({ path: '.env.local' })

async function testConnection() {
  console.log('🔍 Testing Neon Database Connection...')
  console.log('=====================================')

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables')
    process.exit(1)
  }

  console.log(
    '🔗 Database URL found (showing first 20 chars):',
    databaseUrl.substring(0, 20) + '...',
  )

  try {
    // Create connection
    const sql = postgres(databaseUrl, {
      max: 1, // Use only 1 connection for testing
      idle_timeout: 5,
      connect_timeout: 10,
    })

    const db = drizzle(sql)

    // Test basic connection
    console.log('🚀 Attempting to connect...')

    const result = await sql`SELECT version(), current_database(), current_user`

    console.log('✅ Connection successful!')
    console.log('📊 Database info:')
    console.log('   - Version:', result[0].version.split(' ').slice(0, 2).join(' '))
    console.log('   - Database:', result[0].current_database)
    console.log('   - User:', result[0].current_user)

    // Test if tables exist
    console.log('\n🔍 Checking for existing tables...')
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    if (tables.length === 0) {
      console.log('📋 No tables found. You need to run migrations.')
      console.log('   Run: npm run db:migrate')
    } else {
      console.log('📋 Found tables:')
      tables.forEach((table) => {
        console.log(`   - ${table.table_name}`)
      })
    }

    await sql.end()
    console.log('\n🎉 Database connection test completed successfully!')
  } catch (error: any) {
    console.error('❌ Connection failed:')
    console.error('Error:', error.message)

    if (error.message.includes('password authentication failed')) {
      console.error('\n💡 This looks like an authentication issue. Please check:')
      console.error('   - Is your connection string correct?')
      console.error('   - Has your password expired?')
      console.error('   - Are you using the right user credentials?')
    } else if (error.message.includes('does not exist')) {
      console.error('\n💡 Database or user might not exist. Please check:')
      console.error('   - Is the database name correct in your connection string?')
      console.error('   - Has the database been created in Neon?')
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 Connection timeout. Please check:')
      console.error('   - Is your internet connection stable?')
      console.error('   - Is the Neon service accessible?')
    }

    process.exit(1)
  }
}

testConnection()
