// Server-side authentication functions
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { db } from '@/shared/db'
import { users } from '@/shared/db/schema'
import { eq } from 'drizzle-orm'

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

    // Use Drizzle ORM to query the database safely
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (result.length > 0) {
      const user = result[0]
      console.log('✅ User found in database:', email)

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        console.log('❌ Invalid password for user:', email)
        return null
      }

      console.log('✅ Authentication successful for:', email)

      // Update last login
      await db.update(users)
        .set({
          lastLoginAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id))

      // Return user in the expected format
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        studentId: user.studentId,
        level: user.level,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'student@wellnest.com',
      firstName: 'John',
      lastName: 'Student',
      role: 'STUDENT' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      email: 'counselor@wellnest.com',
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      role: 'COUNSELOR' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const mockUser = mockUsers.find(u => u.email === email)
  // Use the seeded passwords: password and password
  if (mockUser && (password === 'password' || password === 'password')) {
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
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, userData.email)).limit(1)

    if (existingUser.length > 0) {
      throw new Error('User already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Create user using Drizzle ORM
    const newUsers = await db.insert(users).values({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: hashedPassword,
      role: userData.role || 'STUDENT',
      emailVerified: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    if (newUsers.length === 0) {
      throw new Error('Failed to create user')
    }

    const newUser = newUsers[0]

    // Return user in the expected format
    return {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      avatar: newUser.avatar,
      department: newUser.department,
      studentId: newUser.studentId,
      level: newUser.level,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    } as User
  } catch (error) {
    console.error('Sign up error:', error)
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
