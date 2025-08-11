import { HelpCircle, LogOut, LucideIcon, Settings, User } from 'lucide-react'

interface DashboardMetric {
  id: string
  title: string
  value: string | number
  change: string
  changeType: 'positive' | 'negative'
}

type NavigationItem = {
  id: string
  label: string
  isActive?: boolean
}

type DropdownMenuItem = {
  id: string
  label: string
  icon?: LucideIcon
  onClick?: () => void
  separator?: boolean
}

export const metrics: DashboardMetric[] = [
  {
    id: 'total-students',
    title: 'Total Students',
    value: '1,500',
    change: '+10%',
    changeType: 'positive',
  },
  {
    id: 'at-risk-count',
    title: 'At-Risk Count',
    value: 15,
    change: '-5%',
    changeType: 'negative',
  },
  {
    id: 'avg-mood-score',
    title: 'Avg. Mood Score',
    value: 7.8,
    change: '+2%',
    changeType: 'positive',
  },
  {
    id: 'screen-time',
    title: 'Screen-Time',
    value: '2.5hr',
    change: '+15%',
    changeType: 'positive',
  },
]

export const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', isActive: true },
  { id: 'student-table', label: 'Student Table' },
  { id: 'intervention', label: 'Intervention' },
  { id: 'reports', label: 'Reports' },
]

export const dropdownMenuItems: DropdownMenuItem[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Account Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
  { id: 'separator', label: '', separator: true },
  {
    id: 'logout',
    label: 'Log out',
    icon: LogOut,
    onClick: () => void console.log('Logging out'),
  },
]
