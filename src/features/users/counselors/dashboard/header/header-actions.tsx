'use client'

import { Bell, Clock, Settings } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { UserRole } from '@/features/users/auth/enums/user-role'

interface HeaderActionsProps {
  isStudent: boolean
}

export function HeaderActions({ isStudent }: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Notification Bell */}
      <Button
        className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800"
        aria-label="Notifications"
      >
        <Bell size={50} />
      </Button>

      {/* Settings */}
      <Button
        className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
        aria-label="Settings"
      >
        <Settings size={50} />
      </Button>

      {/* Clock */}
      {isStudent && (
        <Button
          className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
          aria-label="Clock"
        >
          <Clock size={50} />
        </Button>
      )}
    </div>
  )
}
