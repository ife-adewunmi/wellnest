import { create } from 'zustand'

export interface NavigationEntry {
  path: string
  timestamp: number
}

interface NavigationStore {
  history: NavigationEntry[]
  currentPath: string | null
  push: (path: string) => void
  clear: () => void
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  history: [],
  currentPath: null,
  push: (path: string) =>
    set((state) => ({
      currentPath: path,
      history: [...state.history, { path, timestamp: Date.now() }],
    })),
  clear: () => set({ history: [], currentPath: null }),
}))

// Helper to navigate with Next.js router while recording history
export const navigateTo = (
  router: { push: (path: string) => void; replace?: (path: string) => void; refresh?: () => void },
  path: string,
  options?: { replace?: boolean; refresh?: boolean; preventHistory?: boolean },
) => {
  if (options?.replace && router.replace) {
    router.replace(path)
  } else {
    router.push(path)
  }

  // Only record in history if not explicitly prevented
  if (!options?.preventHistory) {
    useNavigationStore.getState().push(path)
  }
  
  if (options?.refresh && router.refresh) router.refresh()
}

// Helper specifically for auth redirects that should replace history
export const navigateToAuth = (
  router: { push: (path: string) => void; replace?: (path: string) => void },
  path: string,
) => {
  navigateTo(router, path, { replace: true, preventHistory: true })
}

// Helper for post-login redirects that should replace the login page
export const navigateAfterAuth = (
  router: { push: (path: string) => void; replace?: (path: string) => void },
  path: string,
) => {
  navigateTo(router, path, { replace: true })
}
