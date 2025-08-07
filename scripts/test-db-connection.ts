import { db } from '../src/shared/db'
import { users } from '../src/shared/db/schema'

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection with a simple query
    const result = await db.select().from(users).limit(1)
    console.log('✅ Database connection successful!')
    console.log(`📊 Query result:`, result)
    
    // Test count query
    const count = await db.select().from(users)
    console.log(`📊 Total users in database: ${count.length}`)
    
    if (count.length > 0) {
      console.log('👥 Existing users:')
      count.forEach(user => {
        console.log(`  - ${user.email} (${user.role}) - Active: ${user.isActive}`)
      })
    } else {
      console.log('📝 No users found in database')
    }
    
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
