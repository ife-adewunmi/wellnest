import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
}

interface UserStore {
  user: User | null
  isLoggedIn: boolean
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setUser: (user) => set({ user, isLoggedIn: true }),
      clearUser: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    },
  ),
)

export const IsLoggedIn = (state: UserStore) => state.isLoggedIn
