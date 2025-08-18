'use client'

import { useState } from 'react'
import { User } from '@/users/auth/types'
import { Bell, LogOut, MoreHorizontal, Settings } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { UserRole } from '@/users/auth/enums'

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
        className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800"
        aria-label="Notifications"
      >
        <Bell size={30} />
      </Button>

      {/* Settings */}
      <Button
        className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
        aria-label="Settings"
      >
        <Settings size={30} />
      </Button>

      {/* More Options Menu */}
      <div className="relative">
        <Button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
          aria-label="More options"
          aria-expanded={isUserMenuOpen}
          aria-haspopup="true"
        >
          <MoreHorizontal size={30} />
        </Button>

        {/* Dropdown Menu */}
        {isUserMenuOpen && (
          <div className="absolute top-full right-0 z-50 mt-2 w-48 cursor-pointer rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
            {user && user.role !== UserRole.COUNSELOR && (
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="text-sm font-medium text-gray-900">{user.lastName}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            )}
            <Button
              onClick={() => {
                onClickLogout()
                setIsUserMenuOpen(false)
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
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
