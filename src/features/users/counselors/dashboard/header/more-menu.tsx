'use client'

import { useState } from 'react'
import { Button } from '@/shared-components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { MobileMenu } from '@/features/users/students/dashboard/mobile-menu'
import { User, UserRole } from '@/features/users/auth/'
import { MobileNavigation } from '../header'

interface MoreMenuProps {
  user: User | null
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function MoreMenu({ user, activeTab, setActiveTab }: MoreMenuProps) {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const isStudent = user && user.role === UserRole.STUDENT

  const handleMobileMenuClose = () => {
    setIsMoreMenuOpen(false)
  }

  return (
    <div className="relative">
      {/* More Options Menu */}
      <Button
        onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
        className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 lg:hidden"
        aria-label="More options"
        aria-expanded={isMoreMenuOpen}
        aria-haspopup="true"
      >
        <MoreHorizontal size={30} />
      </Button>

      {isStudent ? (
        <>
          {/* Mobile Menu */}
          <MobileMenu isOpen={isMoreMenuOpen} onClose={handleMobileMenuClose} user={user} />
        </>
      ) : (
        <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  )
}
