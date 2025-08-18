import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/features/users/auth/types'

export interface UserStore {
  // User state
  user: User | null
  isLoading: boolean
  error: string | null

  // User actions
  setUser: (user: User) => void
  clearUser: () => void
  updateUser: (updates: Partial<User>) => void
  fetchUserProfile: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  clearError: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      error: null,

      // Set user data
      setUser: (user) => set({ user, error: null }),

      // Clear user data
      clearUser: () => set({ user: null, error: null }),

      // Update user data partially
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // Fetch user profile from API
      fetchUserProfile: async () => {
        if (!get().user) return

        set({ isLoading: true, error: null })

        try {
          // TODO: Implement actual API call
          // const response = await userApi.getProfile()
          // if (response.user) {
          //   set({ user: response.user, isLoading: false })
          // }
          set({ isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch profile',
            isLoading: false,
          })
        }
      },

      // Update user profile
      updateProfile: async (data) => {
        set({ isLoading: true, error: null })

        try {
          // TODO: Implement actual API call
          // const response = await userApi.updateProfile(data)
          // if (response.user) {
          //   set({ user: response.user, isLoading: false })
          // }

          // For now, just update locally
          set((state) => ({
            user: state.user ? { ...state.user, ...data } : null,
            isLoading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update profile',
            isLoading: false,
          })
          throw error
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
)
