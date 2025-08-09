export interface User {
  id: string
  email: string
  title?: string
  role: string
  avatar?: string
  department?: string
  studentId?: string
  level?: string
  firstName: string
  lastName: string
  createdAt: Date
  updatedAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  error?: string
  details?: string | Array<{ field: string; message: string }>
}
