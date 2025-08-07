import { NextResponse } from 'next/server'
import { db } from '@/shared/db'
import { users } from '@/shared/db/schema'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    console.log('🔍 Testing database connection...')

    // First check what columns exist in the table
    const schemaResult = await db.execute(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `)

    console.log('📋 Table schema:', schemaResult.rows)

    // Test basic connection using raw SQL
    const result = await db.execute('SELECT * FROM users LIMIT 1')
    console.log('✅ Database connection successful!')
    console.log(`📊 Found ${result.rows.length} users in database`)

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount: result.rows.length,
      users: result.rows.map((user: any) => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at,
      })),
      columns: result.rows.length > 0 ? Object.keys(result.rows[0]) : []
    })
  } catch (error) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    console.log('🌱 Creating users table and test users...')

    // First, create the users table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'STUDENT',
        avatar TEXT,
        department VARCHAR(255),
        student_id VARCHAR(255),
        level VARCHAR(50),
        gender VARCHAR(20),
        phone_number VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        emergency_contact JSONB,
        consent_screen_time BOOLEAN DEFAULT false,
        consent_social_media BOOLEAN DEFAULT false,
        email_verified BOOLEAN DEFAULT false,
        email_verification_token VARCHAR(255),
        password_reset_token VARCHAR(255),
        password_reset_expires TIMESTAMP,
        last_login_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        settings JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ Users table created/verified')

    // Check if test users already exist
    const testUserCheck = await db.execute(`SELECT * FROM users WHERE email IN ('student@example.com', 'counselor@example.com', 'test@example.com')`)

    if (testUserCheck.rows.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Test users already exist',
        userCount: testUserCheck.rows.length,
        users: testUserCheck.rows.map((user: any) => ({
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        }))
      })
    }
    
    // Hash passwords
    const studentPassword = await bcrypt.hash('password', 12)
    const counselorPassword = await bcrypt.hash('password', 12)

    // Create test users using raw SQL (matching actual database schema)
    await db.execute(`
      INSERT INTO users (
        email, first_name, last_name, password, created_at, updated_at
      ) VALUES
      (
        'student@example.com', 'Test', 'Student', '${studentPassword}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ),
      (
        'counselor@example.com', 'Dr. Test', 'Counselor', '${counselorPassword}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ),
      (
        'test@example.com', 'Test', 'User', '${studentPassword}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      ON CONFLICT (email) DO NOTHING
    `)

    // Get the created users
    const newUsers = await db.execute('SELECT id, email, first_name, last_name, role FROM users')
    
    console.log('✅ Test users created successfully!')

    return NextResponse.json({
      success: true,
      message: 'Test users created successfully',
      users: newUsers.rows.map((user: any) => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      }))
    })
  } catch (error) {
    console.error('❌ Failed to create test users:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create test users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
