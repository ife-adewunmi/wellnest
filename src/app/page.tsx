'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore, IsLoggedIn } from '@/shared/store/useUserStore'
import Loading from '@/shared/components/ui/loading'

export default function RootPage() {
  const isLoggedIn = useUserStore(IsLoggedIn)
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Give zustand persist time to rehydrate
    const checkTimer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace('/dashboard')
      } else {
        router.replace('/signin')
      }
      setIsChecking(false)
    }, 100)

    return () => clearTimeout(checkTimer)
  }, [isLoggedIn, router])

  if (isChecking) {
    return (
      <div className="h-screen w-full flex items-center justify-center ">
        <Loading />
      </div>
    )
  }

  return null
}

