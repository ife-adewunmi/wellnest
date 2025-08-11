'use client'

import Link from 'next/link'
import { plusJakarta } from '@/shared/styles/fonts'
import { Button } from '@/shared/components/ui/button'
import { NAVIGATION_ITEMS } from '@/features/users/counselors/data/navigation-data'

interface DesktopNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function DesktopNavigation({ activeTab, setActiveTab }: DesktopNavigationProps) {
  return (
    <nav
      className="hidden items-center gap-8 lg:flex"
      role="navigation"
      aria-label="Main navigation"
    >
      {NAVIGATION_ITEMS.map((item) => (
        <Button
          key={item.tab}
          onClick={() => setActiveTab(item.tab)}
          className={`relative px-1 py-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === item.tab ? 'text-[#3182CE]' : 'text-[#718096] hover:text-[#1A202C]'
          } ${plusJakarta.className}`}
          aria-current={activeTab === item.tab ? 'page' : undefined}
        >
          <Link href={item.path}>{item.label}</Link>
        </Button>
      ))}
    </nav>
  )
}
