import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { UserRole } from '../enums'
import { User } from '../types'

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    email: 'student@example.com',
    role: UserRole.STUDENT,
    avatar: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: 'John',
    lastName: 'Student',
  },
  {
    id: '2',
    email: 'counselor@example.com',
    title: 'Dr.',
    role: UserRole.COUNSELOR,
    avatar: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: 'Sarah',
    lastName: 'Johnson',
  },
]

export async function signJWT(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function getSession(): Promise<{ user: User } | null> {
  const cookieStore = cookies()
  const token = (await cookieStore).get('auth-token')?.value

  if (!token) {
    return null
  }

  const payload = await verifyJWT(token)
  if (!payload || !payload.user) {
    return null
  }

  return { user: payload.user as User }
}

export async function signIn(email: string, password: string): Promise<User | null> {
  // Find mock user
  const user = mockUsers.find((u) => u.email === email)

  if (!user) {
    return null
  }

  // For demo purposes, accept any password
  return user
}

export async function signOut() {
  const cookieStore = cookies()
  ;(await cookieStore).delete('auth-token')
}
