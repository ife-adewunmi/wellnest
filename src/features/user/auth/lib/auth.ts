
// Client-side authentication utilities
import { UserRole } from '../enums'
import { User } from '../types'

// Mock users for development and testing
const mockUsers: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001', // Valid UUID for mock student
    email: 'student@wellnest.com',
    role: UserRole.STUDENT,
    avatar: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: 'John',
    lastName: 'Student',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002', // Valid UUID for mock counselor
    email: 'counselor@wellnest.com',
    role: UserRole.COUNSELOR,
    avatar: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
  },
  

]

// Client-side session management
export async function getSession(): Promise<{ user: User } | null> {
  try {
    // Only run on client side
    if (typeof window === 'undefined') {
      return null
    }

    const baseUrl = window.location.origin
    const response = await fetch(`${baseUrl}/api/auth/session`)
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export async function signIn(email: string, password: string): Promise<User | null> {
  // First, check mock users for development
  const mockUser = mockUsers.find((u) => u.email === email)

  if (mockUser) {
    // For mock users, accept 'password' as the password
    if (password === 'password') {
      console.log('✅ Mock user authentication successful:', email)
      return mockUser
    } else {
      console.log('❌ Invalid password for mock user:', email)
      return null
    }
  }

  // For non-mock users, use API call
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      return data.user
    } else {
      console.log('❌ Authentication failed:', email)
      return null
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export async function signUp(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: 'STUDENT' | 'COUNSELOR'
}): Promise<User | null> {
  // Check if user already exists in mock users
  const existingMockUser = mockUsers.find((u) => u.email === userData.email)
  if (existingMockUser) {
    console.log('❌ Mock user already exists:', userData.email)
    throw new Error('User already exists')
  }

  // For development, create a new mock user
  const newMockUser: User = {
    id: (mockUsers.length + 1).toString(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: (userData.role || 'STUDENT') as UserRole,
    avatar: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Add to mock users array (in memory only)
  mockUsers.push(newMockUser)
  console.log('✅ Mock user created successfully:', userData.email)

  return newMockUser

  // Database signup code (commented out for now)
  /*
  try {
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1)

    if (existingUser) {
      throw new Error('User already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'STUDENT',
        emailVerified: false,
        isActive: true,
        settings: {
          notifications: {
            moodDrop: true,
            riskLevelChange: true,
            missedCheckIn: true,
            pushNotification: true,
            emailNotification: true,
            smsNotification: false,
          },
          dashboard: {
            moodTracker: true,
            screenTimeTracker: true,
            socialMediaActivity: true,
            notificationWidget: true,
            upcomingSessions: true,
            studentTable: true,
          },
        },
      })
      .returning()

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser
    return userWithoutPassword as User
  } catch (error) {
    console.error('Sign up error:', error)
    return null
  }
  */
}

export async function signOut() {
  try {
    await fetch('/api/auth/signout', {
      method: 'POST',
    })
  } catch (error) {
    console.error('Sign out error:', error)
  }
}
