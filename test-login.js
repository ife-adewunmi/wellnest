// Simple test script to check login functionality
const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('🧪 Testing login with seeded credentials...');
    
    const response = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'student@wellnest.com',
        password: 'password'
      })
    });

    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed:', data.error);
    }
  } catch (error) {
    console.error('🚨 Test error:', error.message);
  }
}

testLogin();
