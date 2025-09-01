'use client'

import { useState } from 'react'
import { HeaderLogo, DesktopNavigation, HeaderActions, MoreMenu } from '../header'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/users/state/userStore'
import { useAuthStore } from '@/users/auth/state/authStore'
import { toast } from 'react-toastify'
import { navigateTo } from '@/shared/state/navigation'
import { Endpoints } from '@/shared/enums/endpoints'
import { UserRole } from '@/features/users/auth/enums'
import { LogOut } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export function Header() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const router = useRouter()
  const { user } = useUserStore()
  const { logout } = useAuthStore()
  const isStudent = user?.role === UserRole.STUDENT

  const handleSignOut = async () => {
    logout()
      .then(() => {
        toast.success('Logout successful!')

        // Redirect to signout page after logout
        setTimeout(() => {
          navigateTo(router, Endpoints.AUTH_PAGE.SIGNIN, { replace: true })
        }, 100)
      })
      .catch((error) => {
        console.error('Failed to logout:', error)
        toast.error(error.message || 'Logout failed')
      })
  }

  return (
    <header className="relative w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section - Logo */}
          <HeaderLogo isStudent={isStudent} />

          {user && !isStudent && (
            <div className="mx-auto flex flex-1 justify-end px-4 sm:px-6 lg:px-8">
              {/* Center Section - Desktop Navigation */}
              <DesktopNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          )}

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            <HeaderActions isStudent={isStudent} />
            <MoreMenu user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
            <Button
              variant="outline"
              onClick={handleSignOut}
              size="sm"
              className="hidden cursor-pointer border-none bg-[#E9EFED] text-red-500 hover:bg-red-50 lg:flex"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
