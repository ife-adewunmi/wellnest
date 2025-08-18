'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { interBold, plusJakarta } from '@/shared/styles/fonts'

interface MobileNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', tab: 'Dashboard' },
  { label: 'Students', path: '/student-table', tab: 'Students' },
  { label: 'Intervention', path: '/intervention', tab: 'Intervention' },
  { label: 'Reports', path: '/reports', tab: 'Reports' },
]

export function MobileNavigation({ activeTab, setActiveTab }: MobileNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleLinkClick = (tab: string) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile/tablet */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {/* Mobile Slide-in Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="bg-opacity-50 fixed inset-0 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-in Menu */}
          <div className="fixed top-0 left-0 z-50 h-full w-80 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden">
            {/* Menu Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <Image src="/svg/distress.svg" alt="Logo" width={16} height={16} />
                <h2 className={`text-lg font-semibold text-gray-800 ${interBold.className}`}>
                  Distress Detection
                </h2>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2 p-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.tab}
                  href={item.path}
                  onClick={() => handleLinkClick(item.tab)}
                  className={`block w-full rounded-lg p-3 text-left transition-colors ${
                    pathname === item.path
                      ? 'bg-blue-50 font-medium text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${plusJakarta.className}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
