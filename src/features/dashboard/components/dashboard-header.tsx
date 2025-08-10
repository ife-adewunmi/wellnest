'use client'

import { Menu, X } from 'lucide-react'
import Avatar from '@/shared/components/ui/avatar'
import Image from 'next/image'
import { interBold, plusJakarta } from '@/shared/styles/fonts'
import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar as UserAvatar, AvatarFallback, AvatarImage } from '@/components/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '@/features/users/auth/types'

interface HeaderProps {
  user?: User
}

interface AvatarIconProps {
  initialIcon: string
}
export function Header({ user }: HeaderProps) {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [iconStates, setIconStates] = useState({
    notification: { bgColor: '#F0F2F5', color: '#000000' },
    settings: { bgColor: '#F0F2F5', color: '#000000' },
    chat: { bgColor: '#F0F2F5', color: '#000000' },
  })
  const pathname = usePathname()
  const router = useRouter()

  // Update settings icon state based on current path
  useEffect(() => {
    if (pathname === '/settings') {
      setIconStates((prev) => ({
        ...prev,
        settings: { bgColor: '#3182CE', color: '#FFFFFF' },
      }))
    } else {
      setIconStates((prev) => ({
        ...prev,
        settings: { bgColor: '#F0F2F5', color: '#000000' },
      }))
    }
  }, [pathname])

  const AvatarIcon = ({ initialIcon = 'notification' }: AvatarIconProps) => {
    const currentState = iconStates[initialIcon as keyof typeof iconStates]

    const handleClick = () => {
      setIconStates((prev) => ({
        ...prev,
        [initialIcon]: {
          bgColor:
            prev[initialIcon as keyof typeof iconStates].bgColor === '#F0F2F5'
              ? '#3182CE'
              : '#F0F2F5',
          color:
            prev[initialIcon as keyof typeof iconStates].color === '#000000'
              ? '#FFFFFF'
              : '#000000',
        },
      }))
    }

    const handleSubmitNotification = () => {
      handleClick()
      Promise.resolve().then(() => {
        router.push('/settings')
      })
    }

    if (initialIcon === 'notification') {
      return (
        <svg
          onClick={handleClick}
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="20" fill={currentState.bgColor} />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.0503 11.0503C16.3631 9.7375 18.1436 9 20.0001 9C21.8566 9 23.6371 9.7375 24.9498 11.0503C26.2626 12.363 27.0001 14.1435 27.0001 16C27.0001 19.3527 27.7171 21.4346 28.378 22.6461C28.7098 23.2544 29.0329 23.6535 29.2573 23.8904C29.3698 24.0091 29.4581 24.0878 29.5114 24.1322C29.538 24.1544 29.5558 24.168 29.5635 24.1737C29.5647 24.1746 29.5657 24.1753 29.5664 24.1758C29.9249 24.4221 30.0835 24.8725 29.9572 25.2898C29.8295 25.7115 29.4407 26 29.0001 26H11.0001C10.5594 26 10.1707 25.7115 10.043 25.2898C9.91664 24.8725 10.0753 24.4221 10.4338 24.1758C10.4345 24.1753 10.4354 24.1746 10.4366 24.1737C10.4443 24.168 10.4622 24.1544 10.4888 24.1322C10.542 24.0878 10.6304 24.0091 10.7429 23.8904C10.9673 23.6535 11.2904 23.2544 11.6222 22.6461C12.283 21.4346 13.0001 19.3527 13.0001 16C13.0001 14.1435 13.7376 12.363 15.0503 11.0503ZM10.4439 24.169C10.444 24.1689 10.444 24.1688 10.4441 24.1688C10.4441 24.1688 10.4441 24.1688 10.4441 24.1688L10.4439 24.169ZM13.1494 24H26.8508C26.7747 23.8753 26.6983 23.7434 26.6222 23.6039C25.783 22.0654 25.0001 19.6473 25.0001 16C25.0001 14.6739 24.4733 13.4021 23.5356 12.4645C22.5979 11.5268 21.3262 11 20.0001 11C18.674 11 17.4022 11.5268 16.4645 12.4645C15.5269 13.4021 15.0001 14.6739 15.0001 16C15.0001 19.6473 14.2171 22.0654 13.378 23.6039C13.3019 23.7434 13.2255 23.8753 13.1494 24Z"
            fill={currentState.color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.7679 28.1352C18.2457 27.858 18.8576 28.0207 19.1347 28.4984C19.2226 28.6499 19.3488 28.7757 19.5006 28.8632C19.6524 28.9506 19.8245 28.9966 19.9997 28.9966C20.1749 28.9966 20.347 28.9506 20.4988 28.8632C20.6506 28.7757 20.7768 28.6499 20.8647 28.4984C21.1418 28.0207 21.7537 27.858 22.2315 28.1352C22.7092 28.4123 22.8718 29.0242 22.5947 29.5019C22.331 29.9566 21.9525 30.3339 21.497 30.5962C21.0416 30.8586 20.5253 30.9966 19.9997 30.9966C19.4741 30.9966 18.9578 30.8586 18.5024 30.5962C18.0469 30.3339 17.6684 29.9566 17.4047 29.5019C17.1276 29.0242 17.2902 28.4123 17.7679 28.1352Z"
            fill={currentState.color}
          />
        </svg>
      )
    } else if (initialIcon === 'settings') {
      return (
        <svg
          onClick={handleSubmitNotification}
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="20" fill={currentState.bgColor} />
          <path
            d="M20 23.75C22.0711 23.75 23.75 22.0711 23.75 20C23.75 17.9289 22.0711 16.25 20 16.25C17.9289 16.25 16.25 17.9289 16.25 20C16.25 22.0711 17.9289 23.75 20 23.75Z"
            stroke={currentState.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.8845 24.6959C11.4701 23.9821 11.1526 23.2163 10.9404 22.4187L12.5136 20.4499C12.4957 20.149 12.4957 19.8472 12.5136 19.5462L10.9414 17.5774C11.1532 16.7797 11.47 16.0136 11.8836 15.2993L14.3876 15.0181C14.5876 14.7928 14.8008 14.5796 15.0261 14.3796L15.3073 11.8765C16.0206 11.4649 16.7854 11.15 17.5817 10.9399L19.5504 12.5131C19.8514 12.4953 20.1532 12.4953 20.4542 12.5131L22.4229 10.9409C23.2207 11.1527 23.9867 11.4695 24.7011 11.8831L24.9823 14.3871C25.2076 14.5871 25.4208 14.8003 25.6207 15.0256L28.1239 15.3068C28.5383 16.0206 28.8557 16.7864 29.0679 17.584L27.4948 19.5528C27.5126 19.8537 27.5126 20.1555 27.4948 20.4565L29.067 22.4253C28.8567 23.2228 28.5414 23.9888 28.1295 24.7034L25.6254 24.9846C25.4255 25.2099 25.2123 25.4231 24.987 25.6231L24.7057 28.1262C23.992 28.5406 23.2262 28.8581 22.4286 29.0703L20.4598 27.4971C20.1588 27.5149 19.857 27.5149 19.5561 27.4971L17.5873 29.0693C16.7898 28.859 16.0237 28.5437 15.3092 28.1318L15.0279 25.6278C14.8026 25.4278 14.5895 25.2146 14.3895 24.9893L11.8845 24.6959Z"
            stroke={currentState.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    } else {
      return (
        <svg
          onClick={handleClick}
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="20" fill={currentState.bgColor} />
          <path
            d="M16.5 27H16C12 27 10 26 10 21V16C10 12 12 10 16 10H24C28 10 30 12 30 16V21C30 25 28 27 24 27H23.5C23.19 27 22.89 27.15 22.7 27.4L21.2 29.4C20.54 30.28 19.46 30.28 18.8 29.4L17.3 27.4C17.14 27.18 16.77 27 16.5 27Z"
            stroke={currentState.color}
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 16H25"
            stroke={currentState.color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 21H21"
            stroke={currentState.color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    }
  }

  // Mobile Navigation Component
  const MobileNavigation = () => (
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
              <Link
                href="/dashboard"
                onClick={() => {
                  setActiveTab('Dashboard')
                  setMobileMenuOpen(false)
                }}
                className={`block w-full rounded-lg p-3 text-left transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-blue-50 font-medium text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${plusJakarta.className}`}
              >
                Dashboard
              </Link>

              <Link
                href="/student-table"
                onClick={() => {
                  setActiveTab('Students')
                  setMobileMenuOpen(false)
                }}
                className={`block w-full rounded-lg p-3 text-left transition-colors ${
                  pathname === '/student-table'
                    ? 'bg-blue-50 font-medium text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${plusJakarta.className}`}
              >
                Students
              </Link>

              <Link
                href="/intervention"
                onClick={() => {
                  setActiveTab('Intervention')
                  setMobileMenuOpen(false)
                }}
                className={`block w-full rounded-lg p-3 text-left transition-colors ${
                  pathname === '/intervention'
                    ? 'bg-blue-50 font-medium text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${plusJakarta.className}`}
              >
                Intervention
              </Link>

              <Link
                href="/reports"
                onClick={() => {
                  setActiveTab('Reports')
                  setMobileMenuOpen(false)
                }}
                className={`block w-full rounded-lg p-3 text-left transition-colors ${
                  pathname === '/reports'
                    ? 'bg-blue-50 font-medium text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${plusJakarta.className}`}
              >
                Reports
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/signin')
    router.refresh()
  }

  return (
    <>
      <header className="flex w-full justify-center border border-t-0 border-r-0 border-l-0 border-b-[#E5E8EB] bg-white px-4 py-3 sm:px-6 sm:py-4 lg:px-6 lg:py-5">
        <div className="flex w-full max-w-[1360px] items-center justify-between">
          <div className="flex w-full flex-col items-center justify-center lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full max-w-[206px] items-center justify-center gap-1 sm:gap-2 lg:justify-start">
              <div className="flex">
                <Image
                  src="/svg/distress.svg"
                  alt="Logo"
                  width={16}
                  height={16}
                  className="h-4 w-4 sm:h-5 sm:w-5"
                />
              </div>
              <h1
                className={`text-lg text-[#121417] sm:text-xl lg:text-[1.25rem] ${interBold.className}`}
              >
                Distress Detection
              </h1>
            </div>
            <div className="flex w-full max-w-['43.33%'] items-center justify-center gap-[2rem] lg:justify-end">
              {/* Desktop Navigation - Hidden on mobile */}
              <nav className="hidden w-full max-w-[414px] items-center lg:flex">
                <ul className="flex w-full items-center justify-between">
                  <li>
                    <button
                      onClick={() => setActiveTab('Dashboard')}
                      className={`cursor-pointer text-sm hover:text-[#1A202C] lg:text-[0.875rem] ${
                        pathname === '/dashboard' ? 'text-[#3182CE]' : 'text-[#718096]'
                      } ${plusJakarta.className}`}
                    >
                      <Link href="/dashboard">Dashboard</Link>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('Students')}
                      className={`cursor-pointer text-sm hover:text-[#1A202C] lg:text-[0.875rem] ${
                        pathname === '/student-table' ? 'text-[#3182CE]' : 'text-[#718096]'
                      } ${plusJakarta.className} `}
                    >
                      <Link href="/student-table">Students</Link>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('Intervention')}
                      className={`cursor-pointer text-sm hover:text-[#1A202C] lg:text-[0.875rem] ${
                        pathname === '/intervention' ? 'text-[#3182CE]' : 'text-[#718096]'
                      } ${plusJakarta.className}`}
                    >
                      <Link href="/intervention">Intervention</Link>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('Reports')}
                      className={`cursor-pointer text-sm hover:text-[#1A202C] lg:text-[0.875rem] ${
                        pathname === '/reports' ? 'text-[#3182CE]' : 'text-[#718096]'
                      } ${plusJakarta.className}`}
                    >
                      <Link href="/reports">Report</Link>
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Mobile Hamburger Menu Button */}
              <div className="lg:hidden">
                <MobileNavigation />
              </div>

              <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
                <div className="flex cursor-pointer items-center gap-2 sm:gap-3">
                  <AvatarIcon initialIcon="notification" />
                  <AvatarIcon initialIcon="settings" />
                  <AvatarIcon initialIcon="chat" />
                </div>
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      {user ? (
                        <UserAvatar className="h-8 w-8">
                          <AvatarImage
                            src={user?.avatar || '/placeholder.svg'}
                            alt={`${user?.firstName} ${user?.lastName}`}
                          />
                          <AvatarFallback>{`${user?.firstName} ${user?.lastName}`}</AvatarFallback>
                        </UserAvatar>
                      ) : (
                        <Avatar size={38} type="user" customDefault="thumbnail" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm leading-none font-medium">{`${user?.firstName} ${user?.lastName}`}</p>
                        <p className="text-muted-foreground text-xs leading-none">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
