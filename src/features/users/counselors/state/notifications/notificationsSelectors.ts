import { useNotificationsStore } from './notificationsStore'

// Basic selectors
export const useNotifications = () => useNotificationsStore((state) => state.notifications)
export const useNotificationsLoading = () => useNotificationsStore((state) => state.isLoading)
export const useNotificationsError = () => useNotificationsStore((state) => state.error)

// Filtered selectors
export const useUnreadNotifications = () =>
  useNotificationsStore((state) =>
    state.notifications.filter((notification) => !notification.isRead),
  )

export const useReadNotifications = () =>
  useNotificationsStore((state) =>
    state.notifications.filter((notification) => notification.isRead),
  )

export const useNotificationsByType = (type: string) =>
  useNotificationsStore((state) =>
    state.notifications.filter((notification) => notification.type === type),
  )

export const useUrgentNotifications = () =>
  useNotificationsStore((state) =>
    state.notifications.filter(
      (notification) => notification.type === 'CRISIS_ALERT' || notification.type === 'MOOD_CHANGE',
    ),
  )

// Computed selectors
export const useUnreadNotificationCount = () =>
  useNotificationsStore(
    (state) => state.notifications.filter((notification) => !notification.isRead).length,
  )

export const useNotificationsSummary = () =>
  useNotificationsStore((state) => ({
    total: state.notifications.length,
    unread: state.notifications.filter((n) => !n.isRead).length,
    urgent: state.notifications.filter((n) => n.type === 'CRISIS_ALERT' || n.type === 'MOOD_CHANGE')
      .length,
  }))

export const useRecentNotifications = (limit: number = 5) =>
  useNotificationsStore((state) => state.notifications.slice(0, limit))

// Action selectors
export const useNotificationsActions = () => {
  const store = useNotificationsStore()
  return {
    fetchNotifications: store.fetchNotifications,
    markNotificationAsRead: store.markNotificationAsRead,
    clearNotification: store.clearNotification,
    setError: store.setError,
    resetStore: store.resetStore,
  }
}

// Data freshness selectors
export const useNotificationsDataStale = () => useNotificationsStore((state) => state.isDataStale())
export const useNotificationsLastFetched = () => useNotificationsStore((state) => state.lastFetched)
