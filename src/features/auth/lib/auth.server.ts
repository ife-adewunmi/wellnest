// Server-side authentication functions
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { db } from '@/shared/db'

import { User } from '../types'

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')

export async function getSession(): Promise<{ user: User } | null> {
  const cookieStore = cookies()
  const token = (await cookieStore).get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, secret)

    // Reconstruct User object from JWT payload
    const user: User = {
      id: payload.id as string,
      email: payload.email as string,
      firstName: payload.firstName as string,
      lastName: payload.lastName as string,
      role: payload.role as string,
      createdAt: payload.createdAt ? new Date(payload.createdAt as string) : new Date(),
      updatedAt: payload.updatedAt ? new Date(payload.updatedAt as string) : new Date(),
    }

    return { user }
  } catch (error) {
    console.error('Invalid token:', error)
    return null
  }
}

export async function signInServer(email: string, password: string): Promise<User | null> {
  try {
    console.log('🔍 Attempting database authentication for:', email)

    // Use raw SQL to query the database with the actual schema
    const result = await db.execute(`
      SELECT id, email, first_name, last_name, password, created_at, updated_at
      FROM users
      WHERE email = '${email}'
      LIMIT 1
    `)

    if (result.rows.length > 0) {
      const user = result.rows[0] as any
      console.log('✅ User found in database:', email)

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        console.log('❌ Invalid password for user:', email)
        return null
      }

      console.log('✅ Authentication successful for:', email)

      // Update last login (update updated_at since last_login_at doesn't exist)
      await db.execute(`
        UPDATE users
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = ${user.id}
      `)

      // Return user in the expected format
      return {
        id: user.id.toString(),
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: 'STUDENT', // Default role since the table doesn't have role column yet
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
      } as User
    }

    console.log('❌ User not found in database:', email)
  } catch (error) {
    console.error('Database authentication error:', error)
  }

  // Fall back to mock authentication for development
  console.log('🔄 Falling back to mock authentication for development')
  const mockUsers = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001', // Valid UUID for mock student
      email: 'student@wellnest.com',
      firstName: 'Student',
      lastName: 'User',
      role: 'STUDENT' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002', // Valid UUID for mock counselor
      email: 'counselor@wellnest.com',
      firstName: 'Counselor',
      lastName: 'User',
      role: 'COUNSELOR' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const mockUser = mockUsers.find(u => u.email === email)
  if (mockUser && password === 'password') {
    console.log('✅ Mock user authentication successful:', email)
    return mockUser as User
  }

  return null
}

export async function signUpServer(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: 'STUDENT' | 'COUNSELOR'
}): Promise<User | null> {
  try {
    // Check if user already exists using raw SQL
    const existingResult = await db.execute(`
      SELECT id FROM users WHERE email = '${userData.email}' LIMIT 1
    `)

    if (existingResult.rows.length > 0) {
      throw new Error('User already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Create user using raw SQL
    const insertResult = await db.execute(`
      INSERT INTO users (email, first_name, last_name, password, created_at, updated_at)
      VALUES ('${userData.email}', '${userData.firstName}', '${userData.lastName}', '${hashedPassword}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, email, first_name, last_name, created_at, updated_at
    `)

    if (insertResult.rows.length === 0) {
      throw new Error('Failed to create user')
    }

    const newUser = insertResult.rows[0] as any

    // Return user in the expected format
    return {
      id: newUser.id.toString(),
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      role: userData.role || 'STUDENT',
      createdAt: new Date(newUser.created_at),
      updatedAt: new Date(newUser.updated_at),
    } as User
  } catch (error) {
    console.error('Sign up error:', error)

    // In development, provide a fallback response
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('🔄 Database signup failed, but continuing for development')
    //   return {
    //     id: Date.now().toString(),
    //     firstName: userData.firstName,
    //     lastName: userData.lastName,
    //     email: userData.email,
    //     role: userData.role || 'STUDENT',
    //     isActive: true,
    //     emailVerified: false,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   } as User
    // }

    return null
  }
}

export async function createToken(user: User): Promise<string> {
  // Convert User object to a plain object for JWT payload
  const payload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  }

const token =  await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)

    console.log('🔑 Token created:', token)
    return token;
}

export async function signOutServer() {
  const cookieStore = cookies()
  ;(await cookieStore).delete('auth-token')
}
