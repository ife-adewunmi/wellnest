// Script to update existing user passwords
require('dotenv').config({ path: '.env.local' })

const bcrypt = require('bcryptjs')
const { neon } = require('@neondatabase/serverless')

async function updatePasswords() {
  console.log('🔄 Updating user passwords...')

  try {
    const sql = neon(process.env.DATABASE_URL)
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash('password', 12)
    
    // Update student password
    await sql`UPDATE users SET password = ${hashedPassword} WHERE email = 'student@wellnest.com'`
    console.log('✅ Updated student password')
    
    // Update counselor password
    await sql`UPDATE users SET password = ${hashedPassword} WHERE email = 'counselor@wellnest.com'`
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
