import { db } from '@/shared/db'
import { eq } from 'drizzle-orm'
import { loginSchema, createUserSchema } from '../lib/validation'
import bcrypt from 'bcryptjs'
import { LoginCredentials, AuthResponse, User, SignupCredentials } from '../types'

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

      const existingUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1)

      if (existingUser.length === 0) {
        return {
          success: false,
          message: 'Invalid credentials',
          error: 'Invalid credentials',
          details: 'Email or password is incorrect',
        }
      }

      const user = existingUser[0]

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid credentials',
          error: 'Invalid credentials',
          details: 'Email or password is incorrect',
        }
      }

      const { password: _, ...userWithoutPassword } = user

      const mappedUser: User = {
        id: userWithoutPassword.id.toString(),
        email: userWithoutPassword.email,
        firstName: userWithoutPassword.firstName,
        lastName: userWithoutPassword.lastName,
        role: userWithoutPassword.role,
        avatar: userWithoutPassword.avatar || undefined,
        department: userWithoutPassword.department || undefined,
        studentId: userWithoutPassword.studentId || undefined,
        level: userWithoutPassword.level || undefined,
        createdAt: userWithoutPassword.createdAt || new Date(),
        updatedAt: userWithoutPassword.updatedAt || new Date(),
      }

      return {
        success: true,
        message: 'Login successful',
        user: mappedUser,
      }
    } catch (error) {
      console.error('Failed to authenticate user:', error)
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
      const validationResult = createUserSchema.safeParse(credentials)
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

      const { first_name, last_name, email, password } = validationResult.data

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
          details: 'A user with this email address already exists',
        }
      }

      // Hash password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Create user
      const result = await db
        .insert(usersTable)
        .values({
          firstName: first_name,
          lastName: last_name,
          email,
          password: hashedPassword,
        })
        .returning()

      const { password: _, ...userWithoutPassword } = result[0]

      const mappedUser: User = {
        id: userWithoutPassword.id.toString(),
        email: userWithoutPassword.email,
        firstName: userWithoutPassword.firstName,
        lastName: userWithoutPassword.lastName,
        role: userWithoutPassword.role,
        avatar: userWithoutPassword.avatar || undefined,
        department: userWithoutPassword.department || undefined,
        studentId: userWithoutPassword.studentId || undefined,
        level: userWithoutPassword.level || undefined,
        createdAt: userWithoutPassword.createdAt || new Date(),
        updatedAt: userWithoutPassword.updatedAt || new Date(),
      }

      return {
        success: true,
        message: 'User created successfully',
        user: mappedUser,
      }
    } catch (error) {
      console.error('Failed to create user:', error)
      return {
        success: false,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
        details: 'An unexpected error occurred during user creation',
      }
    }
  }
}
