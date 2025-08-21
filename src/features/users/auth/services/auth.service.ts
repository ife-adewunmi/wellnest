import { db } from '@/shared/db'
import { eq } from 'drizzle-orm'
import { usersTable } from '@/shared/db/schema/users'
import { loginSchema, signupSchema } from '@/users/auth/lib/validations'
import bcrypt from 'bcryptjs'
import { LoginCredentials, AuthResponse, User, SignupCredentials } from '../types'

const mapUser = (u: any): User => ({
  id: u.id.toString(),
  email: u.email,
  firstName: u.firstName,
  lastName: u.lastName,
  role: u.role,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
})

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const validationResult = loginSchema.safeParse(credentials)
      if (!validationResult.success) {
        return {
          success: false,
          message: 'Validation failed',
          error: 'Validation failed',
          details: validationResult.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        }
      }

      const { email, password } = validationResult.data

      // Find user by email
      const found = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1)

      if (found.length === 0) {
        return { success: false, message: 'Invalid credentials', error: 'Invalid credentials' }
      }

      const userRow = found[0]

      // Compare password
      const isMatch = await bcrypt.compare(password, userRow.password)
      if (!isMatch) {
        return { success: false, message: 'Invalid credentials', error: 'Invalid credentials' }
      }

      const user = mapUser(userRow)

      return {
        success: true,
        message: 'Login successful',
        user,
      }
    } catch (error) {
      return {
        success: false,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        details: 'An unexpected error occurred during authentication',
      }
    }
  }

  static async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      // Validate input
      const validationResult = signupSchema.safeParse({
        ...credentials,
        confirmPassword: credentials.password, // For API calls, we don't need confirm password
      })

      if (!validationResult.success) {
        return {
          success: false,
          message: 'Validation failed',
          error: 'Validation failed',
          details: validationResult.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        }
      }

      const { firstName, lastName, email, password } = validationResult.data

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1)

      if (existingUser.length > 0) {
        return {
          success: false,
          message: 'User already exists',
          error: 'User already exists',
        }
      }

      // Hash password
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Create user
      const newUser = await db
        .insert(usersTable)
        .values({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: 'STUDENT', // Default role
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()

      if (newUser.length === 0) {
        return {
          success: false,
          message: 'Failed to create user',
          error: 'Failed to create user',
        }
      }

      const user = mapUser(newUser[0])

      return {
        success: true,
        message: 'User created successfully',
        user,
      }
    } catch (error) {
      console.error('Signup error:', error)
      return {
        success: false,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        details: 'An unexpected error occurred during user creation',
      }
    }
  }

  static async updateLastLogin(userId: string): Promise<void> {
    try {
      await db
        .update(usersTable)
        .set({
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, userId))
    } catch (error) {
      console.error('Failed to update last login:', error)
    }
  }
}

export const authService = new AuthService()
