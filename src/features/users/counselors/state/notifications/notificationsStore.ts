import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Notification } from '@/users/counselors/types/dashboard.types'
import { notificationsApi } from '@/users/counselors/services/models'
import { ActionTypes } from '../actionTypes'

interface NotificationsState {
  notifications: Notification[]
  isLoading: boolean
  error: string | null
  lastFetched?: string
}

interface NotificationsActions {
  fetchNotifications: (counselorId: string, force?: boolean) => Promise<void>
  markNotificationAsRead: (notificationId: string) => Promise<void>
  clearNotification: (notificationId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetStore: () => void
  isDataStale: (maxAge?: number) => boolean
}

type NotificationsStore = NotificationsState & NotificationsActions

const CACHE_DURATION = 1 * 60 * 1000 // 1 minute

const initialState: NotificationsState = {
  notifications: [],
  isLoading: false,
  error: null,
  lastFetched: undefined,
}

export const useNotificationsStore = create<NotificationsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        fetchNotifications: async (counselorId: string, force = false) => {
          const state = get()

          // Check cache unless forced
          if (!force && state.notifications.length > 0 && !state.isDataStale()) {
            return
          }

          set({ isLoading: true, error: null })
          try {
            const notifications = await notificationsApi.getNotifications(counselorId)
            set({
              notifications,
              isLoading: false,
              lastFetched: new Date().toISOString(),
              error: null,
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch notifications',
              isLoading: false,
            })
          }
        },

        markNotificationAsRead: async (notificationId: string) => {
          try {
            await notificationsApi.markNotificationAsRead(notificationId)
            set((state) => ({
              notifications: state.notifications.map((n) =>
                n.id === notificationId ? { ...n, isRead: true } : n,
              ),
            }))
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to mark notification as read',
            })
          }
        },

        clearNotification: (notificationId: string) => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== notificationId),
          }))
        },

        setLoading: (loading: boolean) => set({ isLoading: loading }),

        setError: (error: string | null) => set({ error }),

        resetStore: () => set(initialState),

        isDataStale: (maxAge = CACHE_DURATION) => {
          const lastFetch = get().lastFetched
          if (!lastFetch) return true

          const fetchTime = new Date(lastFetch).getTime()
          const now = Date.now()
          return now - fetchTime > maxAge
        },
      }),
      {
        name: ActionTypes.NOTIFICATIONS,
        partialize: (state) => ({
          notifications: state.notifications.slice(0, 10), // Keep recent 10
          lastFetched: state.lastFetched,
        }),
      },
    ),
    {
      name: ActionTypes.NOTIFICATIONS,
    },
  ),
)
