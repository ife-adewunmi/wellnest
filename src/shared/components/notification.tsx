'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'

import { AlertCircle, Smartphone, Calendar } from 'lucide-react'
import { Button } from './ui/custom-button'
import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'
import { useDashboardStore } from '@/features/users/counselors/state/dashboard/dashboardStore'
import { LoadingSpinner } from './loading-spinner'

import Image from 'next/image'

interface NotificationDisplay {
  id: string
  type: string
  title: string
  message: string
  icon: ReactNode
  isRead?: boolean
  createdAt?: Date | string
}

export function Notifications() {
  const [showAll, setShowAll] = useState(false)
  const { notifications, isLoading } = useDashboardStore()
  const [displayNotifications, setDisplayNotifications] = useState<NotificationDisplay[]>([])

  // Map notification types to icons
  const getNotificationIcon = (type: string): ReactNode => {
    switch (type) {
      case 'MOOD_CHANGE':
        return <Image src="/svg/notify-card.svg" alt="Mood Change" width={48} height={48} />
      case 'SCREEN_TIME_RISK':
        return <Image src="/svg/increased-screen.svg" alt="Screen Time" width={48} height={48} />
      case 'CHECK_IN_REMINDER':
      case 'FLAGGED_POST':
        return <Image src="/svg/missed.svg" alt="Check-in" width={48} height={48} />
      case 'SESSION_REMINDER':
        return <Calendar className="h-12 w-12 text-blue-500" />
      case 'CRISIS_ALERT':
        return <AlertCircle className="h-12 w-12 text-red-500" />
      default:
        return <AlertCircle className="h-12 w-12 text-gray-500" />
    }
  }

  useEffect(() => {
    // Transform API notifications to display format
    const transformed = notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      icon: getNotificationIcon(notification.type),
      isRead: notification.isRead,
      createdAt:
        typeof notification.createdAt === 'string'
          ? new Date(notification.createdAt)
          : notification.createdAt,
    }))
    setDisplayNotifications(transformed)
  }, [notifications])

  // Show loading state if data is being fetched
  if (isLoading && notifications.length === 0) {
    return (
      <div className="w-[max-content]">
        <div className="flex w-full max-w-[321px] flex-row items-center justify-between">
          <h1 className={`${interBold.className} text-[1.25rem] text-[#121417]`}>Notifications</h1>
        </div>
        <div className="mt-[1.5rem] inline-flex min-h-[200px] flex-col items-center justify-center gap-[1rem] rounded-[12px] border border-[#CBD5E0] p-[1rem]">
          <LoadingSpinner size="medium" />
        </div>
      </div>
    )
  }

  // If no notifications
  if (displayNotifications.length === 0) {
    return (
      <div className="w-[max-content]">
        <div className="flex w-full max-w-[321px] flex-row items-center justify-between">
          <h1 className={`${interBold.className} text-[1.25rem] text-[#121417]`}>Notifications</h1>
        </div>
        <div className="mt-[1.5rem] inline-flex min-h-[100px] flex-col items-center justify-center gap-[1rem] rounded-[12px] border border-[#CBD5E0] p-[1rem]">
          <p className={`${interRegular.className} text-[0.875rem] text-[#61758A]`}>
            No new notifications
          </p>
        </div>
      </div>
    )
  }

  const displayedNotifications = showAll ? displayNotifications : displayNotifications.slice(0, 4)

  return (
    <div className="w-[max-content]">
      <div className="flex w-full max-w-[321px] flex-row items-center justify-between">
        <h1 className={`${interBold.className} text-[1.25rem] text-[#121417]`}>Notifications</h1>
        {displayNotifications.length > 4 && (
          <Button
            variant="ghost"
            className={`${interMedium.className} self-start text-sm text-[#4A5568] sm:self-auto lg:text-[0.875rem]`}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show less' : 'View all'}
          </Button>
        )}
      </div>
      <div
        className={`mt-[1.5rem] inline-flex flex-col gap-[1rem] rounded-[12px] border border-[#CBD5E0] p-[1rem]`}
      >
        {displayedNotifications.map((notification) => (
          <div key={notification.id} className={notification.isRead ? 'opacity-60' : ''}>
            <div className="flex gap-[0.875rem]">
              <div className="">{notification.icon}</div>
              <div className="flex flex-col">
                <p className={`text-[1rem] text-[#121417] ${interMedium.className}`}>
                  {notification.title}
                </p>
                <p className={`${interRegular.className} text-[0.875rem] text-[#61758A]`}>
                  {notification.message}
                </p>
                {notification.createdAt && (
                  <p className={`${interRegular.className} mt-1 text-[0.75rem] text-[#A0AEC0]`}>
                    {new Date(notification.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
