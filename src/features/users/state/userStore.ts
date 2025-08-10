import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginCredentials, AuthResponse } from '@/features/users/auth/types'
import { isServer } from '@/shared/lib/is-server'
import { authApi } from '@/features/users/auth/services'
import { useSessionStore } from '@/features/users/auth/state/sessionStore'

export interface UserStore {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null
  isInitialized: boolean

  // Actions
  setUser: (user: User) => void
  clearUser: () => void
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  // fetchUserProfile: () => Promise<void>
  // updateProfile: (data: Partial<User>) => Promise<void>
  // clearError: () => void
  checkSession: () => Promise<void>
  initialize: () => Promise<void>
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
      isInitialized: false,

      setUser: (user) => set({ user, isLoggedIn: true, error: null, isInitialized: true }),

      clearUser: () => set({ user: null, isLoggedIn: false, error: null }),

      login: async (credentials) => {
        set({ isLoading: true, error: null })

        try {
          const response = await authApi.login(credentials)

          if (!response.success) {
            set({ error: response.error || 'Login failed', isLoading: false })
            throw new Error(response.error || 'Login failed')
          }

          if (response.user) {
            set({
              user: response.user,
              isLoggedIn: true,
              isLoading: false,
              error: null,
              isInitialized: true,
            })

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
            user: null,
            isLoggedIn: false,
          })
          throw error
        }
      },

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

            // Clear all local storage data
            localStorage.removeItem('user-storage')
            localStorage.removeItem('rememberEmail')
            localStorage.removeItem('rememberPassword')
            localStorage.removeItem('session-storage')

            // Clear session storage
            sessionStorage.clear()
          }

          set({ user: null, isLoggedIn: false, isLoading: false, error: null })
        } catch (error) {
          console.error('Logout error:', error)
          // Even if logout fails, clear local state
          if (!isServer) {
            const sessionStore = useSessionStore.getState()
            sessionStore.stopPeriodicCheck()
            sessionStore.clearSession()
          }
          set({ user: null, isLoggedIn: false, isLoading: false, error: null })
        }
      },

      // fetchUserProfile: async () => {
      //   if (!get().isLoggedIn) return

      //   set({ isLoading: true, error: null })

      //   try {
      //     const response = await fetch(Endpoints.USERS.PROFILE)
      //     const data = await response.json()

      //     if (response.ok && data.user) {
      //       set({ user: data.user, isLoading: false })
      //     } else {
      //       throw new Error(data.message || 'Failed to fetch profile')
      //     }
      //   } catch (error) {
      //     set({
      //       error: error instanceof Error ? error.message : 'Failed to fetch profile',
      //       isLoading: false,
      //     })
      //   }
      // },

      // updateProfile: async (data) => {
      //   set({ isLoading: true, error: null })

      //   try {
      //     const response = await fetch(Endpoints.USERS.PROFILE, {
      //       method: 'PUT',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify(data),
      //     })

      //     const result = await response.json()

      //     if (response.ok && result.user) {
      //       set({ user: result.user, isLoading: false })
      //     } else {
      //       throw new Error(result.message || 'Failed to update profile')
      //     }
      //   } catch (error) {
      //     set({
      //       error: error instanceof Error ? error.message : 'Failed to update profile',
      //       isLoading: false,
      //     })
      //     throw error
      //   }
      // },

      // clearError: () => set({ error: null }),

      checkSession: async () => {
        set({ isLoading: true })

        try {
          let sessionResponse = null
          
          if (!isServer) {
            const sessionStore = useSessionStore.getState()
            sessionResponse = await sessionStore.validateSession()
          }

          if (sessionResponse && sessionResponse.isAuthenticated && sessionResponse.user) {
            set({
              user: sessionResponse.user,
              isLoggedIn: true,
              isLoading: false,
              isInitialized: true,
            })

            // Start periodic session checks if not already started
            if (!isServer) {
              const sessionStore = useSessionStore.getState()
              if (!sessionStore.checkInterval) {
                sessionStore.startPeriodicCheck()
              }
            }
          } else {
            set({
              user: null,
              isLoggedIn: false,
              isLoading: false,
              isInitialized: true,
            })

            // Clear session store if validation failed
            if (!isServer) {
              const sessionStore = useSessionStore.getState()
              sessionStore.clearSession()
            }
          }
        } catch (error) {
          console.error('Session check failed:', error)
          set({
            user: null,
            isLoggedIn: false,
            isLoading: false,
            isInitialized: true,
          })

          // Clear session store on error
          if (!isServer) {
            const sessionStore = useSessionStore.getState()
            sessionStore.clearSession()
          }
        }
      },

      initialize: async () => {
        if (get().isInitialized) return
        await get().checkSession()
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
)
