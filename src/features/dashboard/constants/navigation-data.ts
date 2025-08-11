export const NAVIGATION_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', tab: 'Dashboard' },
  { label: 'Students', path: '/student-table', tab: 'Students' },
  { label: 'Intervention', path: '/intervention', tab: 'Intervention' },
  { label: 'Report', path: '/reports', tab: 'Reports' },
] as const

export const ICON_INITIAL_STATES = {
  notification: { bgColor: '#F0F2F5', color: '#000000' },
  settings: { bgColor: '#F0F2F5', color: '#000000' },
  chat: { bgColor: '#F0F2F5', color: '#000000' },
} as const
