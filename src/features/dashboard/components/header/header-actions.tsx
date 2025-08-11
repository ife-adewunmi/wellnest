import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AvatarIcon } from './avatar-icon'
import { UserMenu } from './user-menu'
import { User } from '@/features/users/auth/types'

interface HeaderActionsProps {
  user?: User
}

interface IconState {
  bgColor: string
  color: string
}

interface IconStates {
  notification: IconState
  settings: IconState
  chat: IconState
}

export function HeaderActions({ user }: HeaderActionsProps) {
  const [iconStates, setIconStates] = useState<IconStates>({
    notification: { bgColor: '#F0F2F5', color: '#000000' },
    settings: { bgColor: '#F0F2F5', color: '#000000' },
    chat: { bgColor: '#F0F2F5', color: '#000000' },
  })
  const pathname = usePathname()

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

  const handleIconStateChange = (icon: string, newState: IconState) => {
    setIconStates((prev) => ({
      ...prev,
      [icon]: newState,
    }))
  }

  return (
    <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
      <div className="flex cursor-pointer items-center gap-2 sm:gap-3">
        <AvatarIcon
          initialIcon="notification"
          currentState={iconStates.notification}
          onStateChange={handleIconStateChange}
        />
        <AvatarIcon
          initialIcon="settings"
          currentState={iconStates.settings}
          onStateChange={handleIconStateChange}
        />
        <AvatarIcon
          initialIcon="chat"
          currentState={iconStates.chat}
          onStateChange={handleIconStateChange}
        />
      </div>

      <UserMenu user={user} />
    </div>
  )
}
