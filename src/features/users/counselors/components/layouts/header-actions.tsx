'use client'

import { useState } from 'react'
import { User } from '@/features/users/auth/types'
import { Bell, LogOut, MoreHorizontal, Settings } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { UserRole } from '@/features/users/auth/enums'

interface HeaderActionsProps {
  user: User | null
  onClickLogout: () => void
}

export function HeaderActions({ user, onClickLogout }: HeaderActionsProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  return (
    <div className="flex items-center gap-4">
      {/* Notification Bell */}
      <Button
        className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
        aria-label="Notifications"
      >
        <Bell size={30} />
      </Button>
      
      {/* Settings */}
      <Button
        className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-full bg-gray-100 hover:bg-gray-100  cursor-pointer"
        aria-label="Settings"
      >
        <Settings size={30} />
      </Button>
      
      {/* More Options Menu */}
      <div className="relative">
        <Button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-full bg-gray-100 hover:bg-gray-100  cursor-pointer"
          aria-label="More options"
          aria-expanded={isUserMenuOpen}
          aria-haspopup="true"
        >
          <MoreHorizontal size={30} />
        </Button>
        
        {/* Dropdown Menu */}
        {isUserMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50  cursor-pointer">
            {user && user.role !== UserRole.COUNSELOR && (
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user.lastName}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            )}
            <Button
              onClick={() => {
                onClickLogout()
                setIsUserMenuOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors  cursor-pointer"
            >
              <LogOut size={15} />
              Log out
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
