'use client'

import { useState } from 'react'
import {
  HeaderLogo,
  DesktopNavigation,
  MobileNavigation,
  HeaderActions,
} from './layouts'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/features/users/state/userStore'
import { toast } from 'react-toastify'
import { navigateTo } from '@/shared/state/navigation'
import { Endpoints } from '@/shared/enums/endpoints'

export function Header() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const router = useRouter()
  const { logout, user } = useUserStore()
  
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
    <header className="relative w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo */}
          <HeaderLogo />
          
          {/* Center Section - Desktop Navigation */}
          <div className="flex-1 flex justify-end mx-auto px-4 sm:px-6 lg:px-8">
            <DesktopNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            <HeaderActions user={user} onClickLogout={handleSignOut} />
            <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>
    </header>
  )
}
