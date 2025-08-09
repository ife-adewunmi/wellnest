// Script to update existing user passwords
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

import bcrypt from 'bcryptjs'

async function updatePasswords() {
  console.log('🔄 Updating user passwords...')

  try {
    // Dynamic imports to prevent execution during module loading
    const { db } = await import('./src/shared/db/index')
    const { users } = await import('./src/shared/db/schema')
    const { eq } = await import('drizzle-orm')
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash('password', 12)
    
    // Update student password
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, 'student@wellnest.com'))
    
    console.log('✅ Updated student password')
    
    // Update counselor password
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, 'counselor@wellnest.com'))
    
    console.log('✅ Updated counselor password')
    
    console.log('🎉 Password update completed!')
    console.log('📧 Student login: student@wellnest.com / password')
    console.log('📧 Counselor login: counselor@wellnest.com / password')
    
  } catch (error) {
    console.error('❌ Error updating passwords:', error)
    throw error
  }
}

// Run update
updatePasswords()
  .then(() => {
    console.log('✨ All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Update failed:', error)
    process.exit(1)
  })
