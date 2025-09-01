'use client'

import React from 'react'
import { X } from 'lucide-react'
import { StudentProfile } from '../sidebar-profile/profile-card'
import { SidebarNavigation } from '../sidebar-navigation'
import { User } from '@/features/users/auth'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  user: User
}

export function MobileMenu({ isOpen, onClose, user }: MobileMenuProps) {
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`bg-opacity-50 fixed inset-0 z-40 bg-black transition-opacity duration-300 lg:hidden ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={handleBackdropClick}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 transform bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Student Profile */}
          <div className="border-b border-gray-200 p-4">
            <StudentProfile
              name={user.firstName || 'Student'}
              studentId={user.id}
              department={user.department || 'Computer Science'}
              currentSession={'2024/2025'}
              currentSemester={'First Semester'}
              level={user.level || '400'}
            />
          </div>

          {/* Navigation */}
          <div className="flex-1 p-2">
            <SidebarNavigation />
          </div>
        </div>
      </div>
    </>
  )
}
