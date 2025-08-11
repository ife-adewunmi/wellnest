'use client'

import { useState } from 'react'
import {
  HeaderLogo,
  DesktopNavigation,
  MobileNavigation,
  HeaderActions,
} from './header'
import { User } from '@/features/users/auth/types'

interface HeaderProps {
  user?: User
}

export function Header({ user }: HeaderProps) {
  const [activeTab, setActiveTab] = useState('Dashboard')

  return (
    <header className="flex w-full justify-center border border-t-0 border-r-0 border-l-0 border-b-[#E5E8EB] bg-white px-4 py-3 sm:px-6 sm:py-4 lg:px-6 lg:py-5">
      <div className="flex w-full max-w-[1360px] items-center justify-between">
        <div className="flex w-full flex-col items-center justify-center lg:flex-row lg:items-center lg:justify-between">
          <HeaderLogo />
          
          <div className="flex w-full max-w-['43.33%'] items-center justify-center gap-[2rem] lg:justify-end">
            <DesktopNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="lg:hidden">
              <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            
            <HeaderActions user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}
