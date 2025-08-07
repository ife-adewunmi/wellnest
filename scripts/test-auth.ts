import { signInServer, createToken, getSession } from '../src/features/auth/lib/auth.server'
import { cookies } from 'next/headers'

async function testAuthentication() {
  try {
    console.log('🔍 Testing authentication flow...')
    console.log('NODE_ENV:', process.env.NODE_ENV)

    // Test 1: Sign in with mock user
    console.log('\n1. Testing sign in with mock user...')
    const user = await signInServer('counselor@example.com', 'password')
    
    if (user) {
      console.log('✅ Sign in successful!')
      console.log('User:', {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      })
      
      // Test 2: Create JWT token
      console.log('\n2. Testing JWT token creation...')
      const token = await createToken(user)
      console.log('✅ JWT token created successfully!')
      console.log('Token length:', token.length)
      
      console.log('\n🎉 Authentication test completed successfully!')
    } else {
      console.log('❌ Sign in failed!')
    }
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error)
    process.exit(1)
  }
}

// Run the test
testAuthentication()
  .then(() => {
    console.log('✅ Test completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })
