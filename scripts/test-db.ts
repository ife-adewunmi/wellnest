import { db } from '../src/shared/db'
import { users } from '../src/shared/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    const result = await db.select().from(users).limit(1)
    console.log('✅ Database connection successful!')
    console.log(`📊 Found ${result.length} users in database`)
    
    // Check if test users exist
    const testEmails = ['student@example.com', 'counselor@example.com']
    
    for (const email of testEmails) {
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
      
      if (existingUser.length === 0) {
        console.log(`👤 Creating test user: ${email}`)
        
        // Hash password
        const hashedPassword = await bcrypt.hash('password', 12)
        
        // Determine role and name based on email
        const isStudent = email.includes('student')
        const role = isStudent ? 'STUDENT' : 'COUNSELOR'
        const firstName = isStudent ? 'Test' : 'Dr. Test'
        const lastName = isStudent ? 'Student' : 'Counselor'
        
        await db.insert(users).values({
          email,
          firstName,
          lastName,
          password: hashedPassword,
          role: role as any,
          isActive: true,
          emailVerified: true,
        })
        
        console.log(`✅ Created ${role.toLowerCase()}: ${email}`)
      } else {
        console.log(`👤 Test user already exists: ${email}`)
      }
    }
    
    // List all users
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
    }).from(users)
    
    console.log('\n📋 All users in database:')
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - Active: ${user.isActive}`)
    })
    
    console.log('\n🎉 Database test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    process.exit(1)
  }
}

// Run the test
testDatabaseConnection()
  .then(() => {
    console.log('✅ Test completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })
