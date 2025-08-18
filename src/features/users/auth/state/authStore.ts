import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginCredentials, AuthResponse } from '../types'
import { isServer } from '@/shared/lib/is-server'
import { authApi } from '../services'
import { useSessionStore } from './sessionStore'
import { useUserStore } from '../../state/userStore'

export interface AuthStore {
  // Auth state
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isInitialized: boolean

  // Auth actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  initialize: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,

      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null })

        try {
          const response = await authApi.login(credentials)

          if (!response.success) {
            set({
              error: response.error || 'Login failed',
              isLoading: false,
              isAuthenticated: false,
            })
            throw new Error(response.error || 'Login failed')
          }

          if (response.user) {
            // Update auth state
            set({
              isAuthenticated: true,
              isLoading: false,
              error: null,
              isInitialized: true,
            })

            // Update user store with user data
            const userStore = useUserStore.getState()
            userStore.setUser(response.user)

            // Start session management
            if (!isServer) {
              const sessionStore = useSessionStore.getState()
              await sessionStore.validateSession()
              sessionStore.startPeriodicCheck()
            }
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
            isAuthenticated: false,
          })
          throw error
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true, error: null })

        try {
          // Call server-side logout
          await authApi.logout()

          // Clear session store
          if (!isServer) {
            const sessionStore = useSessionStore.getState()
            sessionStore.stopPeriodicCheck()
            sessionStore.clearSession()

            // Clear all auth-related local storage data
            localStorage.removeItem('auth-storage')
            localStorage.removeItem('user-storage')
            localStorage.removeItem('rememberEmail')
            localStorage.removeItem('rememberPassword')
            localStorage.removeItem('session-storage')

            // Clear session storage
            sessionStorage.clear()
          }

          // Clear auth state
          set({
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })

          // Clear user data from user store
          const userStore = useUserStore.getState()
          userStore.clearUser()
        } catch (error) {
          console.error('Logout error:', error)

          // Even if logout fails, clear local state
          if (!isServer) {
            const sessionStore = useSessionStore.getState()
            sessionStore.stopPeriodicCheck()
            sessionStore.clearSession()
          }

          set({
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })

          // Clear user data even on error
          const userStore = useUserStore.getState()
          userStore.clearUser()
        }
      },

      // Check session validity
      checkSession: async () => {
        set({ isLoading: true })

        try {
          let sessionResponse = null

          if (!isServer) {
            const sessionStore = useSessionStore.getState()
            sessionResponse = await sessionStore.validateSession()
          }

          if (sessionResponse && sessionResponse.isAuthenticated && sessionResponse.user) {
            // Update auth state
            set({
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
            })

            // Update user store with user data
            const userStore = useUserStore.getState()
            userStore.setUser(sessionResponse.user)

            // Start periodic session checks if not already started
            if (!isServer) {
              const sessionStore = useSessionStore.getState()
              if (!sessionStore.checkInterval) {
                sessionStore.startPeriodicCheck()
              }
            }
          } else {
            // No valid session
            set({
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
            })

            // Clear user data
            const userStore = useUserStore.getState()
            userStore.clearUser()

            // Clear session store if validation failed
            if (!isServer) {
              const sessionStore = useSessionStore.getState()
              sessionStore.clearSession()
            }
          }
        } catch (error) {
          console.error('Session check failed:', error)

          set({
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          })

          // Clear user data on error
          const userStore = useUserStore.getState()
          userStore.clearUser()

          // Clear session store on error
          if (!isServer) {
            const sessionStore = useSessionStore.getState()
            sessionStore.clearSession()
          }
        }
      },

      // Initialize auth state
      initialize: async () => {
        if (get().isInitialized) return
        await get().checkSession()
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
