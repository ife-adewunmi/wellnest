'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore, IsLoggedIn } from '@/users/state'
import Loading from '@/shared/components/ui/loading'
import { Endpoints } from '@/shared/enums/endpoints'
import { navigateTo } from '@/shared/state/navigation'

export default function RootPage() {
  const isLoggedIn = useUserStore(IsLoggedIn)
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Give zustand persist time to rehydrate
    const checkTimer = setTimeout(() => {
      const path = isLoggedIn ? Endpoints.COUNSELORS.DASHBOARD : Endpoints.AUTH_PAGE.SIGNIN
      navigateTo(router, path)

      setIsChecking(false)
    }, 100)

    return () => clearTimeout(checkTimer)
  }, [isLoggedIn, router])

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading />
      </div>
    )
  }

  return null
}
